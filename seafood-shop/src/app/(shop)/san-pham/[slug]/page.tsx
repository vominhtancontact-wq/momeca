import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { Product as ProductType, Category } from '@/types';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<ProductType | null> {
  await dbConnect();
  const product = await Product.findOne({ slug })
    .populate('category', 'name slug')
    .lean();
  
  if (!product) return null;
  
  return JSON.parse(JSON.stringify(product));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm',
    };
  }

  return {
    title: `${product.name} - Hải Sản Tươi`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const category = product.category as Category;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li>
            <a href="/" className="hover:text-primary">Trang chủ</a>
          </li>
          <li>/</li>
          {category && (
            <>
              <li>
                <a href={`/danh-muc/${category.slug}`} className="hover:text-primary">
                  {category.name}
                </a>
              </li>
              <li>/</li>
            </>
          )}
          <li className="text-gray-900 font-medium line-clamp-1">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Info */}
        <div>
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Related Products */}
      {category && (
        <RelatedProducts
          categorySlug={category.slug}
          currentProductId={product._id}
        />
      )}
    </div>
  );
}
