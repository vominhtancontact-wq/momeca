import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import '@/models/Category'; // Required for populate
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    // Check if id is a valid ObjectId or slug
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).populate('category', 'name slug').lean();
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug').lean();
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy sản phẩm' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy thông tin sản phẩm' } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating product with body:', JSON.stringify(body, null, 2));

    const product = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy sản phẩm' } },
        { status: 404 }
      );
    }
    
    console.log('Updated product isBestSeller:', product.isBestSeller);

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi cập nhật sản phẩm' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: 'Không tìm thấy sản phẩm' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Đã xóa sản phẩm thành công' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi xóa sản phẩm' } },
      { status: 500 }
    );
  }
}
