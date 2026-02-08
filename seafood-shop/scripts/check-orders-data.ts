import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

interface Order {
  _id: any;
  orderNumber: string;
  userId?: any;
  customerPhone: string;
  customerName: string;
  totalAmount: number;
  createdAt: Date;
}

async function checkOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }), 'orders');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

    // Get all orders
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10).lean() as any[];
    
    console.log('=== LAST 10 ORDERS ===\n');
    
    for (const order of orders) {
      console.log(`Order: ${order.orderNumber}`);
      console.log(`  Customer: ${order.customerName}`);
      console.log(`  Phone: ${order.customerPhone}`);
      console.log(`  UserId: ${order.userId || 'NOT SET'}`);
      console.log(`  Amount: ${order.totalAmount.toLocaleString('vi-VN')}đ`);
      console.log(`  Date: ${order.createdAt.toLocaleString('vi-VN')}`);
      
      // Try to find user by phone
      if (!order.userId && order.customerPhone) {
        const user = await User.findOne({ phone: order.customerPhone }).lean();
        if (user) {
          console.log(`  ⚠️  Found user by phone: ${(user as any)._id} (${(user as any).name})`);
        } else {
          console.log(`  ℹ️  No user found with phone: ${order.customerPhone}`);
        }
      }
      
      console.log('');
    }

    // Get all users
    const users = await User.find({}).select('_id name email phone').lean();
    console.log('\n=== ALL USERS ===\n');
    
    for (const user of users) {
      console.log(`User: ${(user as any).name}`);
      console.log(`  ID: ${(user as any)._id}`);
      console.log(`  Email: ${(user as any).email}`);
      console.log(`  Phone: ${(user as any).phone}`);
      
      // Count orders for this user
      const ordersByUserId = await Order.countDocuments({ userId: (user as any)._id });
      const ordersByPhone = await Order.countDocuments({ customerPhone: (user as any).phone });
      
      console.log(`  Orders by userId: ${ordersByUserId}`);
      console.log(`  Orders by phone: ${ordersByPhone}`);
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkOrders();
