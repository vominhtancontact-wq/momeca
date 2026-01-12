import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '15');

    // Lấy sản phẩm bán chạy nhất (theo soldCount hoặc isBestSeller)
    const products = await Product.find({
      $or: [
        { isBestSeller: true },
        { soldCount: { $gt: 0 } }
      ]
    })
      .populate('category', 'name slug')
      .sort({ soldCount: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total: products.length,
        page: 1,
        limit,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy sản phẩm bán chạy' } },
      { status: 500 }
    );
  }
}
