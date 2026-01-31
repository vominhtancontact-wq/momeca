import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Coupon from '@/models/Coupon';
import jwt from 'jsonwebtoken';
import { getTierLevel, getCouponValueForTier } from '@/lib/tierSystem';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PATCH /api/orders/[id] - Starting request');
    
    await dbConnect();
    console.log('Database connected');

    // Kiểm tra admin authentication
    const adminToken = request.cookies.get('admin_token')?.value;
    console.log('Admin token present:', !!adminToken);
    
    if (!adminToken) {
      console.log('No admin token found');
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized - No token' } },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(adminToken, JWT_SECRET);
      console.log('Token verified, admin:', decoded);
    } catch (error) {
      console.log('Token verification failed:', error);
      return NextResponse.json(
        { success: false, error: { message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('Order ID:', id);
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { status, paymentStatus } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // Logic tự động: Khi chuyển trạng thái đơn hàng sang "confirmed", 
    // tự động đánh dấu thanh toán online là "paid"
    if (status === 'confirmed' && !paymentStatus) {
      // Lấy thông tin đơn hàng hiện tại để kiểm tra paymentMethod
      const currentOrder = await Order.findById(id);
      if (currentOrder && currentOrder.paymentMethod === 'online' && currentOrder.paymentStatus === 'pending') {
        updateData.paymentStatus = 'paid';
        console.log('Auto-updating payment status to paid for online payment order');
      }
    }

    console.log('Update data:', updateData);

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      console.log('Order not found');
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy đơn hàng' } },
        { status: 404 }
      );
    }

    // Nếu đơn hàng chuyển sang "delivered", cập nhật totalSpent và tier
    if (status === 'delivered' && order.userId) {
      console.log('Order delivered, updating user totalSpent and tier');
      
      const user = await User.findById(order.userId);
      if (user) {
        const oldTierLevel = user.tierLevel;
        const newTotalSpent = user.totalSpent + order.totalAmount;
        const newTierLevel = getTierLevel(newTotalSpent);
        
        user.totalSpent = newTotalSpent;
        user.tierLevel = newTierLevel;
        await user.save();
        
        console.log(`User ${user._id} totalSpent updated: ${user.totalSpent}, tier: ${user.tierLevel}`);
        
        // Nếu đạt tier mới, tạo coupon
        if (newTierLevel > oldTierLevel && newTierLevel > 0) {
          const couponValue = getCouponValueForTier(newTierLevel);
          const tierNames: Record<number, string> = {
            500000: 'BẠC',
            1000000: 'VÀNG',
            2000000: 'KIMCƯƠNG'
          };
          
          const couponCode = `${tierNames[newTierLevel]}${Date.now().toString().slice(-6)}`;
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 3); // Hết hạn sau 3 tháng
          
          await Coupon.create({
            code: couponCode,
            type: 'fixed',
            value: couponValue,
            minOrderValue: 0,
            maxUsage: 1,
            usedCount: 0,
            expiresAt,
            status: 'active',
            tierLevel: newTierLevel,
            userId: user._id,
          });
          
          console.log(`Created coupon ${couponCode} for user ${user._id} (tier ${newTierLevel})`);
        }
      }
    }

    console.log('Order updated successfully:', order._id);
    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Lỗi khi cập nhật đơn hàng' } },
      { status: 500 }
    );
  }
}
