import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { FlashSale } from '@/models';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const flashSale = await FlashSale.findById(id).populate('products.product').lean();

    if (!flashSale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 });
    }

    return NextResponse.json(flashSale);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flash sale' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const flashSale = await FlashSale.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!flashSale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 });
    }

    return NextResponse.json(flashSale);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update flash sale' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const flashSale = await FlashSale.findByIdAndDelete(id);

    if (!flashSale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Flash sale deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete flash sale' }, { status: 500 });
  }
}
