import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';

// Revalidate cache mỗi 60 giây
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '15');

    // Lấy sản phẩm được đánh dấu là khuyến mãi hot
    const products = await Product.find({ isHotDeal: true })
      .populate('category', 'name slug')
      .sort({ discountPercent: -1 })
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
    console.error('Error fetching hot deals:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy sản phẩm khuyến mãi' } },
      { status: 500 }
    );
  }
}
