import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

async function fixDiscount() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db!;
    const productsCollection = db.collection('products');

    // Tìm tất cả sản phẩm có originalPrice = price hoặc originalPrice <= price (không có giảm giá thực sự)
    const products = await productsCollection.find({
      $or: [
        { $expr: { $eq: ['$originalPrice', '$price'] } },
        { $expr: { $lte: ['$originalPrice', '$price'] } },
        { originalPrice: 0 },
        { originalPrice: null },
        { discountPercent: 0 }
      ]
    }).toArray();

    console.log(`Found ${products.length} products to fix`);

    for (const product of products) {
      const hasRealDiscount = product.originalPrice && product.originalPrice > product.price;
      
      if (!hasRealDiscount) {
        // Xóa originalPrice và discountPercent nếu không có giảm giá thực sự
        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $unset: { 
              originalPrice: '',
              discountPercent: ''
            } 
          }
        );
        console.log(`Fixed: ${product.name} - removed originalPrice and discountPercent`);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDiscount();
