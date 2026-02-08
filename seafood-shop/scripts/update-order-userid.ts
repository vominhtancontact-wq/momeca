import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || '';

async function updateOrderUserId() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }), 'orders');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

    // Find all orders without userId
    const ordersWithoutUserId = await Order.find({ 
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    }).lean();

    console.log(`Found ${ordersWithoutUserId.length} orders without userId\n`);

    let updated = 0;
    let notFound = 0;

    for (const order of ordersWithoutUserId) {
      const customerPhone = (order as any).customerPhone;
      
      // Find user by phone
      const user = await User.findOne({ phone: customerPhone }).lean();
      
      if (user) {
        await Order.updateOne(
          { _id: (order as any)._id },
          { $set: { userId: (user as any)._id } }
        );
        console.log(`✓ Updated order ${(order as any).orderNumber} with userId ${(user as any)._id} (${(user as any).name})`);
        updated++;
      } else {
        console.log(`✗ No user found for order ${(order as any).orderNumber} with phone ${customerPhone}`);
        notFound++;
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Updated: ${updated} orders`);
    console.log(`Not found: ${notFound} orders`);

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateOrderUserId();
