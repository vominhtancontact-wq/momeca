import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function fixOrderStatus() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Update all orders with status 'completed' to 'delivered'
    const result = await db.collection('orders').updateMany(
      { status: 'completed' },
      { $set: { status: 'delivered' } }
    );

    console.log(`Updated ${result.modifiedCount} orders from 'completed' to 'delivered'`);

    // Also check for any invalid status values
    const invalidOrders = await db.collection('orders').find({
      status: { $nin: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'] }
    }).toArray();

    if (invalidOrders.length > 0) {
      console.log(`Found ${invalidOrders.length} orders with invalid status:`);
      invalidOrders.forEach(order => {
        console.log(`  - Order ${order._id}: status = "${order.status}"`);
      });
    } else {
      console.log('All orders have valid status values');
    }

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixOrderStatus();
