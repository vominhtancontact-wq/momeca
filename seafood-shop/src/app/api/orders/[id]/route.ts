import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order, User, Coupon } from '@/models';
import { getTierLevel, getCouponValueForTier, TIER_CONFIG } from '@/lib/tierSystem';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
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

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const oldStatus = order.status;
    const newStatus = body.status;

    // Cập nhật order
    Object.assign(order, { ...body, updatedAt: new Date() });
    await order.save();

    // Nếu đơn hàng chuyển sang "delivered", cập nhật chi tiêu user
    if (oldStatus !== 'delivered' && newStatus === 'delivered') {
      await updateUserSpending(order);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// Cập nhật chi tiêu user và tạo coupon nếu đạt mức mới
async function updateUserSpending(order: any) {
  try {
    // Tìm user theo số điện thoại
    const user = await User.findOne({ phone: order.customerPhone });
    
    if (!user) return;

    // Tính số tiền sản phẩm (dùng subtotal nếu có, không thì tính từ totalAmount)
    const productAmount = order.subtotal || ((order.totalAmount || 0) - (order.shippingFee || 0) + (order.couponDiscount || 0));
    
    const oldTotalSpent = user.totalSpent || 0;
    const newTotalSpent = oldTotalSpent + productAmount;
    
    const oldTierLevel = getTierLevel(oldTotalSpent);
    const newTierLevel = getTierLevel(newTotalSpent);

    // Cập nhật user
    user.totalSpent = newTotalSpent;
    user.tierLevel = newTierLevel;
    await user.save();

    // Nếu đạt tier mới, tạo coupon
    if (newTierLevel > oldTierLevel) {
      // Tìm các tier mới đạt được
      for (const tier of TIER_CONFIG) {
        if (tier.threshold > oldTierLevel && tier.threshold <= newTierLevel) {
          // Kiểm tra xem đã có coupon cho tier này chưa
          const existingCoupon = await Coupon.findOne({
            userId: user._id,
            tierLevel: tier.threshold,
          });

          if (!existingCoupon) {
            // Tạo mã coupon unique
            let code = '';
            let isUnique = false;
            while (!isUnique) {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              code = 'MMC';
              for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              const existing = await Coupon.findOne({ code });
              if (!existing) isUnique = true;
            }

            // Tạo coupon mới
            await Coupon.create({
              code,
              userId: user._id,
              type: 'fixed',
              value: tier.discount,
              minOrderValue: 100000, // Đơn tối thiểu 100k
              maxUsage: 1,
              usedCount: 0,
              status: 'active',
              tierLevel: tier.threshold,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating user spending:', error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
