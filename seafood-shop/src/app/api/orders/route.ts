import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { sendNewOrderNotification } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('orderNumber');

    // Check if user is authenticated (for fetching their own orders)
    let token = request.cookies.get('token')?.value;
    
    // If no cookie, check Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    console.log('=== GET ORDERS DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Phone param:', phone);
    console.log('OrderNumber param:', orderNumber);
    
    let userId: string | null = null;
    
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
        console.log('✓ User authenticated, userId:', userId);
      } catch (error: any) {
        console.log('✗ Token verification failed:', error.message);
      }
    }

    const query: Record<string, unknown> = {};
    
    // Priority 1: If userId exists, filter by userId only
    if (userId && !orderNumber) {
      // For authenticated users, show orders by userId
      query.userId = userId;
      console.log('→ Filtering by userId:', userId);
    } 
    // Priority 2: If phone provided (for order tracking without login)
    else if (phone && !userId) {
      query.customerPhone = phone;
      console.log('→ Filtering by phone only:', phone);
    } 
    // Priority 3: If orderNumber provided (for order tracking)
    else if (orderNumber) {
      query.orderNumber = orderNumber;
      console.log('→ Filtering by orderNumber:', orderNumber);
    } 
    // No filter - return empty (security)
    else {
      console.log('→ No valid filter - returning empty');
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0 }
      });
    }
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    console.log('→ Found orders:', orders.length, 'Total:', total);
    console.log('→ Query used:', JSON.stringify(query));
    console.log('=== END DEBUG ===\n');

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy danh sách đơn hàng' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Kiểm tra authentication
    const token = request.cookies.get('token')?.value;
    console.log('=== ORDER CREATE DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'none');
    
    if (!token) {
      console.log('No token found - returning 401');
      console.log('=== END DEBUG ===');
      return NextResponse.json(
        { success: false, error: { message: 'Vui lòng đăng nhập để đặt hàng' } },
        { status: 401 }
      );
    }

    // Verify token và lấy userId
    const jwt = require('jsonwebtoken');
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log('Token verified, userId:', userId);
    } catch (error) {
      console.log('Token verification failed:', error);
      console.log('=== END DEBUG ===');
      return NextResponse.json(
        { success: false, error: { message: 'Phiên đăng nhập không hợp lệ' } },
        { status: 401 }
      );
    }
    console.log('=== END DEBUG ===');

    const body = await request.json();
    const { customerName, customerPhone, customerEmail, customerAddress, customerNote, deliveryDate, deliveryTime, paymentMethod, items, couponCode } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, error: { message: 'Vui lòng điền đầy đủ thông tin bắt buộc' } },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Đơn hàng phải có ít nhất 1 sản phẩm' } },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(customerPhone)) {
      return NextResponse.json(
        { success: false, error: { message: 'Số điện thoại không hợp lệ' } },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'online'];
    const selectedPaymentMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'cod';

    // Build order items and calculate total
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: { message: `Không tìm thấy sản phẩm: ${item.productId}` } },
          { status: 400 }
        );
      }

      let price = product.price;
      let variantName = undefined;

      // Check if variant is selected
      if (item.variantId && product.variants) {
        const variant = product.variants.find(v => v._id?.toString() === item.variantId);
        if (variant) {
          price = variant.price;
          variantName = variant.name;
        }
      }

      // Check if weight option is selected
      let weightMultiplier = 1;
      let weightOptionName = undefined;
      if (item.weightOptionId && product.weightOptions) {
        const weightOption = product.weightOptions.find(w => w._id?.toString() === item.weightOptionId);
        if (weightOption) {
          weightMultiplier = weightOption.priceMultiplier;
          weightOptionName = weightOption.name;
        }
      }

      // Apply weight multiplier to price
      const finalPrice = price * weightMultiplier;

      const orderItem = {
        product: product._id,
        productName: product.name,
        productImage: product.images[0],
        variant: item.variantId,
        variantName,
        weightOption: item.weightOptionId,
        weightOptionName,
        quantity: item.quantity,
        price: finalPrice
      };

      orderItems.push(orderItem);
      subtotal += finalPrice * item.quantity;

      // Update sold count
      await Product.findByIdAndUpdate(product._id, {
        $inc: { soldCount: item.quantity }
      });
    }

    // Calculate shipping fee: 40k, free for orders >= 500k
    const FREE_SHIPPING_THRESHOLD = 500000;
    const SHIPPING_FEE = 40000;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    // Process coupon if provided
    let couponDiscount = 0;
    let appliedCouponCode = undefined;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        status: 'active',
        expiresAt: { $gt: new Date() },
      });

      if (coupon && coupon.usedCount < coupon.maxUsage && subtotal >= coupon.minOrderValue) {
        if (coupon.type === 'fixed') {
          couponDiscount = coupon.value;
        } else {
          couponDiscount = Math.floor(subtotal * coupon.value / 100);
        }
        appliedCouponCode = coupon.code;

        // Update coupon usage
        coupon.usedCount += 1;
        if (coupon.usedCount >= coupon.maxUsage) {
          coupon.status = 'used';
        }
        await coupon.save();
      }
    }

    const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);

    // Generate order number
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `DH${dateStr}${random}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      userId, // Lưu userId
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerNote,
      deliveryDate,
      deliveryTime,
      items: orderItems,
      subtotal,
      couponCode: appliedCouponCode,
      couponDiscount,
      shippingFee,
      totalAmount,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'pending',
      status: 'pending'
    });

    // Send email notification (non-blocking but log errors)
    sendNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      items: orderItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    }).then(result => {
      console.log('📧 Email notification result:', result);
    }).catch(error => {
      console.error('❌ Failed to send email notification:', error);
      // Don't fail the order creation if notification fails
    });

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi tạo đơn hàng' } },
      { status: 500 }
    );
  }
}
