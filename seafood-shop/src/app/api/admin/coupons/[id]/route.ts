import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Coupon } from '@/models';

// Xóa mã giảm giá (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa mã giảm giá',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa mã giảm giá' },
      { status: 500 }
    );
  }
}
