import dbConnect from '@/lib/db';
import { Product } from '@/models';
import ProductListClient from './ProductListClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getProducts() {
  await dbConnect();
  const products = await Product.find().populate('category').sort({ createdAt: -1 }).lean();
  
  // Serialize the data for client component
  return products.map((product: any) => ({
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    isActive: product.isActive,
    images: product.images,
    category: product.category ? {
      name: product.category.name
    } : undefined
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductListClient products={products} />;
}
