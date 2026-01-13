import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// Revalidate cache mỗi 5 phút (categories ít thay đổi)
export const revalidate = 300;

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const response = NextResponse.json({
      success: true,
      data: categories
    });

    // Cache response trong 5 phút
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy danh sách danh mục' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const category = await Category.create(body);

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi tạo danh mục' } },
      { status: 500 }
    );
  }
}
