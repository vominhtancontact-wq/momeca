import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (phone) query.customerPhone = phone;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

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
    if (!token) {
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
    } catch (error) {
      return NextResponse.json(
        { success: false, error: { message: 'Phiên đăng nhập không hợp lệ' } },
        { status: 401 }
      );
    }

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

      const orderItem = {
        product: product._id,
        productName: product.name,
        productImage: product.images[0],
        variant: item.variantId,
        variantName,
        quantity: item.quantity,
        price
      };

      orderItems.push(orderItem);
      subtotal += price * item.quantity;

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
