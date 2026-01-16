import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://vominhtancontact_db_user:Minhtan3105%4012@cluster0.fortcxc.mongodb.net/seafood-shop?retryWrites=true&w=majority&appName=Cluster0';

async function checkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');
    
    const Product = mongoose.connection.collection('products');
    
    // Tìm sản phẩm có tên chứa "Khô" hoặc "Mực Rim"
    const products = await Product.find({
      $or: [
        { name: /Khô/i },
        { name: /Mực Rim/i }
      ]
    }).toArray();
    
    console.log('\n=== KIỂM TRA SẢN PHẨM ===\n');
    
    for (const product of products) {
      console.log(`Tên: ${product.name}`);
      console.log(`  price: ${product.price}`);
      console.log(`  originalPrice: ${product.originalPrice}`);
      console.log(`  discountPercent: ${product.discountPercent}`);
      console.log(`  soldCount: ${product.soldCount}`);
      console.log('---');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

checkProducts();
