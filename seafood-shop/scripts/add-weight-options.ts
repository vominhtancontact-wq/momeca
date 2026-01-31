// Script to add weight options to products
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import Product from '../src/models/Product';

async function addWeightOptions() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find product by slug
    const productSlug = 'muc-kho-phan-thiet';
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      console.log(`❌ Product not found: ${productSlug}`);
      process.exit(1);
    }

    console.log(`📦 Found product: ${product.name}`);

    // Add weight options
    product.weightOptions = [
      {
        name: 'Nửa kí',
        weight: 0.5,
        priceMultiplier: 0.5  // 1/2 giá gốc
      },
      {
        name: '1 kí',
        weight: 1,
        priceMultiplier: 1    // Giá gốc
      }
    ];

    await product.save();

    console.log('✅ Weight options added successfully!');
    console.log('Weight options:', product.weightOptions);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addWeightOptions();
