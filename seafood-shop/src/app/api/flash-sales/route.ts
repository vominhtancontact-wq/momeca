import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FlashSale from '@/models/FlashSale';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    // Find active flash sales that are currently running
    const flashSales = await FlashSale.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    })
      .populate({
        path: 'products.product',
        select: 'name slug images price originalPrice soldCount inStock'
      })
      .sort({ startTime: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: flashSales
    });
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Lỗi khi lấy danh sách flash sale' } },
      { status: 500 }
    );
  }
}


// Tạo flash sale mới (Admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, startTime, endTime, products, isActive } = body;

    // Validate required fields
    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
      return NextResponse.json(
        { success: false, error: 'Thời gian kết thúc phải sau thời gian bắt đầu' },
        { status: 400 }
      );
    }

    // Validate products and get original prices
    const flashSaleProducts = [];
    for (const item of products || []) {
      if (!item.product || !item.salePrice || !item.quantity) continue;
      
      const product = await Product.findById(item.product);
      if (!product) continue;

      flashSaleProducts.push({
        product: item.product,
        originalPrice: product.price,
        salePrice: Number(item.salePrice),
        quantity: Number(item.quantity),
        soldCount: 0,
      });
    }

    if (flashSaleProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng thêm ít nhất một sản phẩm' },
        { status: 400 }
      );
    }

    // Create flash sale
    const flashSale = await FlashSale.create({
      name,
      startTime: start,
      endTime: end,
      products: flashSaleProducts,
      isActive: isActive !== false,
    });

    return NextResponse.json({
      success: true,
      data: flashSale,
    });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo flash sale' },
      { status: 500 }
    );
  }
}
