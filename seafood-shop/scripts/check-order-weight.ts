// Script to check order weight options
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import Order from '../src/models/Order';

async function checkOrderWeight() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find recent orders
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

    console.log(`\n📦 Found ${orders.length} recent orders:\n`);

    for (const order of orders) {
      console.log(`Order: ${order.orderNumber}`);
      console.log(`Customer: ${order.customerName}`);
      console.log(`Total: ${order.totalAmount}`);
      console.log('Items:');
      
      for (const item of order.items) {
        console.log(`  - ${item.productName}`);
        if (item.variantName) {
          console.log(`    Variant: ${item.variantName}`);
        }
        if (item.weightOptionName) {
          console.log(`    Weight: ${item.weightOptionName}`);
        } else {
          console.log(`    Weight: ❌ NOT SET`);
        }
        console.log(`    Price: ${item.price} x ${item.quantity}`);
      }
      console.log('---\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOrderWeight();
