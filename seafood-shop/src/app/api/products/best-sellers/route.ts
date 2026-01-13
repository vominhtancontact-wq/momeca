import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';

// Tắt cache để luôn lấy data mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '15');

    // Lấy sản phẩm được đánh dấu là bán chạy
    const products = await Product.find({ isBestSeller: true })
      .populate('category', 'name slug')
      .sort({ soldCount: -1 })
      .limit(limit)
      .lean();

    const response = NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total: products.length,
        page: 1,
        limit,
        totalPages: 1
      }
    });

    // Cache response trong 60 giây
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy sản phẩm bán chạy' } },
      { status: 500 }
    );
  }
}
