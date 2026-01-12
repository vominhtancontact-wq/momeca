import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function clearOrders() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa tất cả orders
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const result = await db.collection('orders').deleteMany({});
    console.log(`Deleted ${result.deletedCount} orders`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearOrders();
