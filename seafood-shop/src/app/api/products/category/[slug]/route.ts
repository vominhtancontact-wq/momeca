import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { slug } = await params;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Find category by slug
    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy danh mục' } },
        { status: 404 }
      );
    }

    // Build query
    const query: Record<string, unknown> = { category: category._id };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseInt(maxPrice);
    }

    // Build sort
    let sortOption: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'popular':
        sortOption = { soldCount: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      category,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy sản phẩm theo danh mục' } },
      { status: 500 }
    );
  }
}
