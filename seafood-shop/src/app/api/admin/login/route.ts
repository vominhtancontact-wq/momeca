import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { checkRateLimit, resetRateLimit, getClientIP } from '@/lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Rate limit config: 5 attempts per 15 minutes
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `admin-login:${clientIP}`;

    // Check rate limit
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIG);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: `Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau ${rateLimit.retryAfter} giây.`,
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    await dbConnect();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bạn không có quyền truy cập trang quản trị' },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa' },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only cookie for admin token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
