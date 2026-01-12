import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query.trim() || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Tìm sản phẩm theo tên (case-insensitive)
    const products = await Product.find({
      name: { $regex: query, $options: 'i' }
    })
      .select('_id name slug price images')
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi tìm kiếm' } },
      { status: 500 }
    );
  }
}
