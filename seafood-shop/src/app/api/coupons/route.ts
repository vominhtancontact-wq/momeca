import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Coupon, User } from '@/models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Lấy danh sách mã giảm giá của user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Lấy token từ header hoặc cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    console.log('=== COUPONS API DEBUG ===');
    console.log('Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (jwtError) {
      console.log('JWT Error:', jwtError);
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }
    
    const userId = decoded.userId;
    console.log('User ID from token:', userId);

    // Cập nhật trạng thái các coupon hết hạn
    await Coupon.updateMany(
      { userId, expiresAt: { $lt: new Date() }, status: 'active' },
      { status: 'expired' }
    );

    // Lấy danh sách coupon còn hiệu lực
    const coupons = await Coupon.find({
      userId,
      status: 'active',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 }).lean();

    // Lấy thông tin user
    const user = await User.findById(userId).select('totalSpent tierLevel').lean() as { totalSpent?: number; tierLevel?: number } | null;
    
    console.log('User found:', user);
    console.log('Coupons found:', coupons.length);
    console.log('=== END DEBUG ===');

    return NextResponse.json({
      success: true,
      data: {
        coupons,
        totalSpent: user?.totalSpent || 0,
        tierLevel: user?.tierLevel || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy mã giảm giá' },
      { status: 500 }
    );
  }
}

// Áp dụng mã giảm giá
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { code, orderTotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mã giảm giá' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: 'active',
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá đã hết lượt sử dụng' },
        { status: 400 }
      );
    }

    if (orderTotal < coupon.minOrderValue) {
      return NextResponse.json(
        { success: false, error: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else {
      discount = Math.floor(orderTotal * coupon.value / 100);
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discount,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi áp dụng mã giảm giá' },
      { status: 500 }
    );
  }
}
