import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Coupon } from '@/models';

// Lấy tất cả mã giảm giá (Admin)
export async function GET() {
  try {
    await dbConnect();

    const coupons = await Coupon.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách mã giảm giá' },
      { status: 500 }
    );
  }
}
