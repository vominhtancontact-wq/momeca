import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category'; // Required for populate

// Tắt cache để luôn lấy data mới nhất
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const category = searchParams.get('category');

    // Build query
    const query: Record<string, unknown> = {};
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseInt(maxPrice);
    }

    if (category) {
      query.category = category;
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
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy danh sách sản phẩm' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const product = await Product.create(body);
    
    // Populate category
    await product.populate('category', 'name slug');

    // Revalidate các trang liên quan
    revalidatePath('/san-pham');
    revalidatePath('/');
    
    if (product.category && typeof product.category === 'object' && 'slug' in product.category) {
      revalidatePath(`/danh-muc/${product.category.slug}`);
    }

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi tạo sản phẩm' } },
      { status: 500 }
    );
  }
}
