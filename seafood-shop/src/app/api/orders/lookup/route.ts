import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    if (!orderNumber && !phone) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp mã đơn hàng hoặc số điện thoại' },
        { status: 400 }
      );
    }

    let query = {};
    
    if (orderNumber) {
      // Tìm theo mã đơn hàng (không phân biệt hoa thường)
      query = { orderNumber: { $regex: new RegExp(`^${orderNumber}$`, 'i') } };
    } else if (phone) {
      // Tìm theo số điện thoại
      query = { customerPhone: phone.trim() };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error looking up orders:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tra cứu đơn hàng' },
      { status: 500 }
    );
  }
}
