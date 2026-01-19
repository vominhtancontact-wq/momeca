import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

import dbConnect from '../src/lib/db';
import Order from '../src/models/Order';

async function testOrderUpdate() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Lấy đơn hàng đầu tiên
    const order = await Order.findOne().sort({ createdAt: -1 });
    
    if (!order) {
      console.log('No orders found');
      return;
    }

    console.log('Found order:', {
      id: order._id,
      orderNumber: order.orderNumber,
      currentStatus: order.status
    });

    // Thử cập nhật trạng thái
    const newStatus = order.status === 'pending' ? 'confirmed' : 'pending';
    console.log(`Updating status from ${order.status} to ${newStatus}`);

    const updated = await Order.findByIdAndUpdate(
      order._id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    console.log('Update successful:', {
      id: updated?._id,
      orderNumber: updated?.orderNumber,
      newStatus: updated?.status
    });

    // Đổi lại về trạng thái cũ
    await Order.findByIdAndUpdate(
      order._id,
      { status: order.status },
      { new: true }
    );
    console.log('Reverted back to original status');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testOrderUpdate();
