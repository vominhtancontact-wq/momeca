import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, error: { message: 'Token không hợp lệ' } },
        { status: 401 }
      );
    }

    const { name, email, address } = await request.json();

    // Validate
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: { message: 'Tên phải có ít nhất 2 ký tự' } },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name: name.trim(),
        email: email?.trim() || '',
        address: address?.trim() || '',
      },
      { new: true }
    ).select('-__v');

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy người dùng' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi server' } },
      { status: 500 }
    );
  }
}
