import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

// Schemas
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  order: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discountPercent: Number,
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [{
    name: String,
    price: Number,
    originalPrice: Number,
    inStock: { type: Boolean, default: true }
  }],
  soldCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  tags: [String],
  unit: String
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Danh mục hải sản Bình Thuận
const categories = [
  { name: 'Tôm', slug: 'tom', description: 'Tôm hùm, tôm sú, tôm thẻ Bình Thuận', order: 1 },
  { name: 'Cá', slug: 'ca', description: 'Cá biển tươi ngon vùng biển Bình Thuận', order: 2 },
  { name: 'Mực', slug: 'muc', description: 'Mực một nắng, mực tươi Phan Thiết', order: 3 },
  { name: 'Ghẹ & Cua', slug: 'ghe-cua', description: 'Ghẹ xanh, cua biển Bình Thuận', order: 4 },
  { name: 'Ốc & Sò', slug: 'oc-so', description: 'Ốc hương, sò điệp, nghêu Bình Thuận', order: 5 },
  { name: 'Khô & Chế biến', slug: 'kho-che-bien', description: 'Hải sản khô, nước mắm Phan Thiết', order: 6 },
];


async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories:', createdCategories.length);

    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // Sản phẩm hải sản Bình Thuận
    const products = [
      // === TÔM ===
      {
        name: 'Tôm Hùm Bình Thuận',
        slug: 'tom-hum-binh-thuan',
        description: 'Tôm hùm xanh đặc sản Bình Thuận, đánh bắt tự nhiên từ vùng biển Phan Thiết. Thịt chắc ngọt, giàu dinh dưỡng.',
        price: 890000,
        originalPrice: 950000,
        discountPercent: 6,
        images: ['//images/tomhumbt.png'],
        category: categoryMap['tom'],
        variants: [
          { name: '300-400g', price: 890000, originalPrice: 950000, inStock: true },
          { name: '400-500g', price: 1190000, originalPrice: 1290000, inStock: true },
          { name: '500-700g', price: 1590000, originalPrice: 1750000, inStock: true },
        ],
        soldCount: 89,
        inStock: true,
        tags: ['Đặc sản', 'Bình Thuận', 'Tự nhiên'],
        unit: 'Con'
      },
      {
        name: 'Tôm Sú Bình Thuận',
        slug: 'tom-su-binh-thuan',
        description: 'Tôm sú tươi sống từ vùng nuôi Bình Thuận, size đều, thịt chắc ngọt tự nhiên.',
        price: 285000,
        originalPrice: 320000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        variants: [
          { name: '15-20 con/kg', price: 285000, originalPrice: 320000, inStock: true },
          { name: '20-25 con/kg', price: 245000, originalPrice: 280000, inStock: true },
          { name: '25-30 con/kg', price: 195000, originalPrice: 220000, inStock: true },
        ],
        soldCount: 156,
        inStock: true,
        tags: ['Tươi sống', 'Bình Thuận'],
        unit: 'Kg'
      },

      {
        name: 'Tôm Thẻ Chân Trắng',
        slug: 'tom-the-chan-trang',
        description: 'Tôm thẻ chân trắng nuôi tại Bình Thuận, tươi ngon, phù hợp nhiều món ăn.',
        price: 145000,
        originalPrice: 165000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        variants: [
          { name: '40-50 con/kg', price: 145000, originalPrice: 165000, inStock: true },
          { name: '60-70 con/kg', price: 125000, originalPrice: 140000, inStock: true },
          { name: '80-100 con/kg', price: 95000, originalPrice: 110000, inStock: true },
        ],
        soldCount: 234,
        inStock: true,
        tags: ['Giá rẻ', 'Phổ biến'],
        unit: 'Kg'
      },
      {
        name: 'Tôm Tít Bình Thuận',
        slug: 'tom-tit-binh-thuan',
        description: 'Tôm tít (bề bề) tươi sống, đặc sản biển Bình Thuận. Thịt ngọt, béo, giàu đạm.',
        price: 320000,
        originalPrice: 350000,
        discountPercent: 9,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        soldCount: 45,
        inStock: true,
        tags: ['Đặc sản', 'Tươi sống'],
        unit: 'Kg'
      },

      // === CÁ ===
      {
        name: 'Cá Mú Đỏ Bình Thuận',
        slug: 'ca-mu-do-binh-thuan',
        description: 'Cá mú đỏ tự nhiên vùng biển Bình Thuận, thịt trắng, chắc, vị ngọt thanh. Phù hợp hấp, nấu lẩu.',
        price: 450000,
        originalPrice: 490000,
        discountPercent: 8,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        variants: [
          { name: '500g-700g', price: 450000, originalPrice: 490000, inStock: true },
          { name: '700g-1kg', price: 520000, originalPrice: 570000, inStock: true },
          { name: '1kg-1.5kg', price: 620000, originalPrice: 680000, inStock: true },
        ],
        soldCount: 67,
        inStock: true,
        tags: ['Cao cấp', 'Tự nhiên'],
        unit: 'Con'
      },

      {
        name: 'Cá Bớp Biển Phan Thiết',
        slug: 'ca-bop-bien-phan-thiet',
        description: 'Cá bớp biển tươi, đánh bắt từ ngư trường Phan Thiết. Thịt dai, ngọt, ít xương.',
        price: 185000,
        originalPrice: 210000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        variants: [
          { name: '1-1.5kg', price: 185000, originalPrice: 210000, inStock: true },
          { name: '1.5-2kg', price: 195000, originalPrice: 220000, inStock: true },
        ],
        soldCount: 112,
        inStock: true,
        tags: ['Phổ biến', 'Ít xương'],
        unit: 'Kg'
      },
      {
        name: 'Cá Thu Một Nắng',
        slug: 'ca-thu-mot-nang',
        description: 'Cá thu một nắng Phan Thiết, phơi tự nhiên dưới nắng biển. Thịt thơm, béo, đậm đà.',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 178,
        inStock: true,
        tags: ['Một nắng', 'Đặc sản Phan Thiết'],
        unit: 'Kg'
      },
      {
        name: 'Cá Ngừ Đại Dương',
        slug: 'ca-ngu-dai-duong',
        description: 'Cá ngừ đại dương tươi, đánh bắt xa bờ vùng biển Bình Thuận. Giàu Omega-3, tốt cho sức khỏe.',
        price: 165000,
        originalPrice: 185000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        variants: [
          { name: 'Cắt khúc 500g', price: 165000, originalPrice: 185000, inStock: true },
          { name: 'Nguyên con 2-3kg', price: 145000, originalPrice: 165000, inStock: true },
        ],
        soldCount: 145,
        inStock: true,
        tags: ['Omega-3', 'Tươi ngon'],
        unit: 'Kg'
      },
      {
        name: 'Cá Chim Trắng',
        slug: 'ca-chim-trang',
        description: 'Cá chim trắng biển Bình Thuận, thịt trắng mịn, vị ngọt thanh. Phù hợp chiên, hấp.',
        price: 195000,
        originalPrice: 220000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 78,
        inStock: true,
        tags: ['Thịt trắng', 'Ngọt thanh'],
        unit: 'Kg'
      },

      {
        name: 'Cá Đuối Bình Thuận',
        slug: 'ca-duoi-binh-thuan',
        description: 'Cá đuối tươi vùng biển Bình Thuận, thịt dai giòn, vị ngọt đặc trưng.',
        price: 125000,
        originalPrice: 145000,
        discountPercent: 14,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 34,
        inStock: true,
        tags: ['Đặc sản', 'Thịt dai'],
        unit: 'Kg'
      },

      // === MỰC ===
      {
        name: 'Mực Một Nắng Phan Thiết',
        slug: 'muc-mot-nang-phan-thiet',
        description: 'Mực một nắng đặc sản Phan Thiết, phơi tự nhiên. Thịt dày, ngọt, thơm đặc trưng.',
        price: 380000,
        originalPrice: 420000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        variants: [
          { name: 'Size nhỏ (10-15 con/kg)', price: 320000, originalPrice: 360000, inStock: true },
          { name: 'Size vừa (7-10 con/kg)', price: 380000, originalPrice: 420000, inStock: true },
          { name: 'Size lớn (5-7 con/kg)', price: 450000, originalPrice: 500000, inStock: true },
        ],
        soldCount: 198,
        inStock: true,
        tags: ['Đặc sản', 'Một nắng', 'Best seller'],
        unit: 'Kg'
      },
      {
        name: 'Mực Ống Tươi',
        slug: 'muc-ong-tuoi',
        description: 'Mực ống tươi sống đánh bắt từ biển Bình Thuận, thịt giòn ngọt tự nhiên.',
        price: 220000,
        originalPrice: 250000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        variants: [
          { name: 'Size nhỏ', price: 180000, originalPrice: 200000, inStock: true },
          { name: 'Size vừa', price: 220000, originalPrice: 250000, inStock: true },
          { name: 'Size lớn', price: 280000, originalPrice: 320000, inStock: true },
        ],
        soldCount: 167,
        inStock: true,
        tags: ['Tươi sống', 'Giòn ngọt'],
        unit: 'Kg'
      },

      {
        name: 'Mực Nang Bình Thuận',
        slug: 'muc-nang-binh-thuan',
        description: 'Mực nang tươi, thịt dày, ngọt. Phù hợp nướng, xào, làm gỏi.',
        price: 195000,
        originalPrice: 220000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        soldCount: 89,
        inStock: true,
        tags: ['Thịt dày', 'Đa dụng'],
        unit: 'Kg'
      },
      {
        name: 'Mực Khô Phan Thiết',
        slug: 'muc-kho-phan-thiet',
        description: 'Mực khô đặc sản Phan Thiết, phơi tự nhiên 100%. Thơm ngon, bảo quản lâu.',
        price: 650000,
        originalPrice: 720000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        variants: [
          { name: 'Loại 1 (con to)', price: 750000, originalPrice: 820000, inStock: true },
          { name: 'Loại 2 (con vừa)', price: 650000, originalPrice: 720000, inStock: true },
        ],
        soldCount: 134,
        inStock: true,
        tags: ['Khô', 'Đặc sản', 'Quà tặng'],
        unit: 'Kg'
      },

      // === GHẸ & CUA ===
      {
        name: 'Ghẹ Xanh Bình Thuận',
        slug: 'ghe-xanh-binh-thuan',
        description: 'Ghẹ xanh tươi sống, đặc sản vùng biển Bình Thuận. Thịt ngọt, gạch béo ngậy.',
        price: 420000,
        originalPrice: 480000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        variants: [
          { name: '3-4 con/kg', price: 520000, originalPrice: 580000, inStock: true },
          { name: '5-6 con/kg', price: 420000, originalPrice: 480000, inStock: true },
          { name: '7-8 con/kg', price: 350000, originalPrice: 400000, inStock: true },
        ],
        soldCount: 123,
        inStock: true,
        tags: ['Tươi sống', 'Gạch béo'],
        unit: 'Kg'
      },

      {
        name: 'Cua Biển Bình Thuận',
        slug: 'cua-bien-binh-thuan',
        description: 'Cua biển tươi sống, gạch son đầy, thịt chắc ngọt. Đánh bắt tự nhiên.',
        price: 380000,
        originalPrice: 420000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        variants: [
          { name: 'Size Y3 (200-250g)', price: 320000, originalPrice: 360000, inStock: true },
          { name: 'Size Y4 (250-300g)', price: 380000, originalPrice: 420000, inStock: true },
          { name: 'Size Y5 (300-400g)', price: 450000, originalPrice: 500000, inStock: true },
        ],
        soldCount: 87,
        inStock: true,
        tags: ['Gạch son', 'Tự nhiên'],
        unit: 'Con'
      },
      {
        name: 'Ghẹ Đỏ Phan Thiết',
        slug: 'ghe-do-phan-thiet',
        description: 'Ghẹ đỏ (ghẹ 3 chấm) đặc sản Phan Thiết, thịt ngọt đậm, gạch nhiều.',
        price: 480000,
        originalPrice: 540000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        soldCount: 56,
        inStock: true,
        tags: ['Đặc sản', 'Gạch nhiều'],
        unit: 'Kg'
      },

      // === ỐC & SÒ ===
      {
        name: 'Ốc Hương Bình Thuận',
        slug: 'oc-huong-binh-thuan',
        description: 'Ốc hương tươi sống, đặc sản biển Bình Thuận. Thịt giòn, ngọt, thơm đặc trưng.',
        price: 450000,
        originalPrice: 500000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        variants: [
          { name: '50-60 con/kg', price: 520000, originalPrice: 580000, inStock: true },
          { name: '60-70 con/kg', price: 450000, originalPrice: 500000, inStock: true },
          { name: '70-80 con/kg', price: 380000, originalPrice: 420000, inStock: true },
        ],
        soldCount: 145,
        inStock: true,
        tags: ['Đặc sản', 'Tươi sống'],
        unit: 'Kg'
      },

      {
        name: 'Sò Điệp Bình Thuận',
        slug: 'so-diep-binh-thuan',
        description: 'Sò điệp tươi sống, thịt ngọt béo. Phù hợp nướng mỡ hành, nướng phô mai.',
        price: 185000,
        originalPrice: 210000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 112,
        inStock: true,
        tags: ['Tươi sống', 'Nướng ngon'],
        unit: 'Kg'
      },
      {
        name: 'Nghêu Lụa Bình Thuận',
        slug: 'ngheu-lua-binh-thuan',
        description: 'Nghêu lụa tươi, vỏ mỏng, thịt ngọt. Phù hợp hấp sả, xào, nấu canh.',
        price: 85000,
        originalPrice: 95000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 178,
        inStock: true,
        tags: ['Giá rẻ', 'Phổ biến'],
        unit: 'Kg'
      },
      {
        name: 'Ốc Móng Tay',
        slug: 'oc-mong-tay',
        description: 'Ốc móng tay tươi sống, thịt giòn ngọt. Xào tỏi, nướng mỡ hành đều ngon.',
        price: 165000,
        originalPrice: 185000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 67,
        inStock: true,
        tags: ['Tươi sống', 'Giòn ngọt'],
        unit: 'Kg'
      },
      {
        name: 'Ốc Bươu Biển',
        slug: 'oc-buou-bien',
        description: 'Ốc bươu biển Bình Thuận, thịt dai giòn, vị ngọt đậm đà.',
        price: 145000,
        originalPrice: 165000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 54,
        inStock: true,
        tags: ['Thịt dai', 'Ngọt đậm'],
        unit: 'Kg'
      },


      // === KHÔ & CHẾ BIẾN ===
      {
        name: 'Nước Mắm Phan Thiết',
        slug: 'nuoc-mam-phan-thiet',
        description: 'Nước mắm truyền thống Phan Thiết, ủ chượp 12-18 tháng. Thơm ngon, đậm đà.',
        price: 85000,
        originalPrice: 95000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        variants: [
          { name: 'Chai 500ml', price: 85000, originalPrice: 95000, inStock: true },
          { name: 'Chai 1 lít', price: 150000, originalPrice: 170000, inStock: true },
          { name: 'Can 5 lít', price: 650000, originalPrice: 720000, inStock: true },
        ],
        soldCount: 245,
        inStock: true,
        tags: ['Đặc sản', 'Truyền thống', 'Best seller'],
        unit: 'Chai'
      },
      {
        name: 'Cá Cơm Khô Phan Thiết',
        slug: 'ca-com-kho-phan-thiet',
        description: 'Cá cơm khô đặc sản Phan Thiết, phơi tự nhiên. Chiên giòn, kho tiêu đều ngon.',
        price: 180000,
        originalPrice: 200000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 134,
        inStock: true,
        tags: ['Khô', 'Đặc sản'],
        unit: 'Kg'
      },
      {
        name: 'Tôm Khô Bình Thuận',
        slug: 'tom-kho-binh-thuan',
        description: 'Tôm khô loại 1, phơi tự nhiên. Thịt ngọt, thơm, bảo quản lâu.',
        price: 450000,
        originalPrice: 500000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        variants: [
          { name: 'Loại 1 (to)', price: 550000, originalPrice: 600000, inStock: true },
          { name: 'Loại 2 (vừa)', price: 450000, originalPrice: 500000, inStock: true },
          { name: 'Loại 3 (nhỏ)', price: 350000, originalPrice: 400000, inStock: true },
        ],
        soldCount: 98,
        inStock: true,
        tags: ['Khô', 'Quà tặng'],
        unit: 'Kg'
      },

      {
        name: 'Ruốc Tôm Phan Thiết',
        slug: 'ruoc-tom-phan-thiet',
        description: 'Ruốc tôm (chà bông tôm) đặc sản Phan Thiết, 100% tôm tươi. Thơm ngon, bổ dưỡng.',
        price: 320000,
        originalPrice: 360000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 76,
        inStock: true,
        tags: ['Đặc sản', 'Bổ dưỡng'],
        unit: 'Hũ 500g'
      },
      {
        name: 'Cá Chỉ Vàng Khô',
        slug: 'ca-chi-vang-kho',
        description: 'Cá chỉ vàng khô Phan Thiết, phơi tự nhiên. Chiên giòn, nướng đều ngon.',
        price: 220000,
        originalPrice: 250000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 89,
        inStock: true,
        tags: ['Khô', 'Chiên giòn'],
        unit: 'Kg'
      },
      {
        name: 'Mắm Ruốc Phan Thiết',
        slug: 'mam-ruoc-phan-thiet',
        description: 'Mắm ruốc truyền thống Phan Thiết, ủ chượp tự nhiên. Thơm ngon, đậm đà.',
        price: 65000,
        originalPrice: 75000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        variants: [
          { name: 'Hũ 250g', price: 65000, originalPrice: 75000, inStock: true },
          { name: 'Hũ 500g', price: 120000, originalPrice: 140000, inStock: true },
        ],
        soldCount: 167,
        inStock: true,
        tags: ['Đặc sản', 'Truyền thống'],
        unit: 'Hũ'
      },

      // === THÊM SẢN PHẨM MỚI ===
      
      // TÔM - Thêm
      {
        name: 'Tôm Càng Xanh',
        slug: 'tom-cang-xanh',
        description: 'Tôm càng xanh tươi sống, nuôi tự nhiên. Thịt chắc, ngọt, càng to đầy thịt.',
        price: 380000,
        originalPrice: 420000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        variants: [
          { name: '5-7 con/kg', price: 450000, originalPrice: 500000, inStock: true },
          { name: '8-10 con/kg', price: 380000, originalPrice: 420000, inStock: true },
        ],
        soldCount: 78,
        inStock: true,
        tags: ['Tươi sống', 'Càng to'],
        unit: 'Kg'
      },
      {
        name: 'Tôm Hùm Baby',
        slug: 'tom-hum-baby',
        description: 'Tôm hùm baby size nhỏ, thịt ngọt mềm. Phù hợp nướng, hấp, làm salad.',
        price: 450000,
        originalPrice: 500000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        soldCount: 45,
        inStock: true,
        tags: ['Cao cấp', 'Size nhỏ'],
        unit: 'Con'
      },
      {
        name: 'Tôm Sú Quảng Canh',
        slug: 'tom-su-quang-canh',
        description: 'Tôm sú nuôi quảng canh sinh thái, không hóa chất. Thịt săn chắc, vị ngọt tự nhiên.',
        price: 320000,
        originalPrice: 360000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['tom'],
        soldCount: 92,
        inStock: true,
        tags: ['Sinh thái', 'Sạch'],
        unit: 'Kg'
      },

      // CÁ - Thêm
      {
        name: 'Cá Hồng Bình Thuận',
        slug: 'ca-hong-binh-thuan',
        description: 'Cá hồng biển tươi, thịt trắng hồng, vị ngọt thanh. Hấp, chiên, nấu canh đều ngon.',
        price: 175000,
        originalPrice: 195000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 89,
        inStock: true,
        tags: ['Thịt trắng', 'Ngọt thanh'],
        unit: 'Kg'
      },
      {
        name: 'Cá Bò Da',
        slug: 'ca-bo-da',
        description: 'Cá bò da tươi, thịt dai ngọt, ít xương. Nướng muối ớt, chiên giòn đều tuyệt.',
        price: 145000,
        originalPrice: 165000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 67,
        inStock: true,
        tags: ['Ít xương', 'Nướng ngon'],
        unit: 'Kg'
      },
      {
        name: 'Cá Cam Nhật',
        slug: 'ca-cam-nhat',
        description: 'Cá cam (Hamachi) tươi, thịt béo ngậy, giàu Omega-3. Làm sashimi, nướng đều ngon.',
        price: 350000,
        originalPrice: 390000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        variants: [
          { name: 'Phi lê 300g', price: 350000, originalPrice: 390000, inStock: true },
          { name: 'Nguyên con 1-1.5kg', price: 320000, originalPrice: 360000, inStock: true },
        ],
        soldCount: 56,
        inStock: true,
        tags: ['Cao cấp', 'Sashimi'],
        unit: 'Kg'
      },
      {
        name: 'Cá Saba Nhật',
        slug: 'ca-saba-nhat',
        description: 'Cá saba (cá thu Nhật) tươi, thịt béo, giàu dinh dưỡng. Nướng, kho đều ngon.',
        price: 125000,
        originalPrice: 145000,
        discountPercent: 14,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 134,
        inStock: true,
        tags: ['Nhập khẩu', 'Béo ngậy'],
        unit: 'Con'
      },
      {
        name: 'Cá Dìa Bình Thuận',
        slug: 'ca-dia-binh-thuan',
        description: 'Cá dìa biển tươi, thịt trắng mịn, vị ngọt. Hấp hành gừng, nấu canh chua đều ngon.',
        price: 165000,
        originalPrice: 185000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 78,
        inStock: true,
        tags: ['Thịt trắng', 'Hấp ngon'],
        unit: 'Kg'
      },
      {
        name: 'Cá Lăng Nha',
        slug: 'ca-lang-nha',
        description: 'Cá lăng nha tươi sống, thịt dai ngọt, không tanh. Nấu lẩu, kho tộ đều tuyệt.',
        price: 195000,
        originalPrice: 220000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 89,
        inStock: true,
        tags: ['Tươi sống', 'Lẩu ngon'],
        unit: 'Kg'
      },
      {
        name: 'Cá Bống Mú',
        slug: 'ca-bong-mu',
        description: 'Cá bống mú tươi, thịt trắng dai, vị ngọt đậm. Hấp, nấu cháo đều ngon.',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'],
        category: categoryMap['ca'],
        soldCount: 45,
        inStock: true,
        tags: ['Cao cấp', 'Hấp ngon'],
        unit: 'Kg'
      },

      // MỰC - Thêm
      {
        name: 'Mực Lá Tươi',
        slug: 'muc-la-tuoi',
        description: 'Mực lá tươi sống, thịt mỏng giòn. Nướng, xào, làm gỏi đều ngon.',
        price: 185000,
        originalPrice: 210000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        soldCount: 98,
        inStock: true,
        tags: ['Tươi sống', 'Giòn ngon'],
        unit: 'Kg'
      },
      {
        name: 'Mực Trứng',
        slug: 'muc-trung',
        description: 'Mực trứng tươi, bụng đầy trứng béo ngậy. Hấp, nướng đều tuyệt vời.',
        price: 320000,
        originalPrice: 360000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        soldCount: 67,
        inStock: true,
        tags: ['Có trứng', 'Béo ngậy'],
        unit: 'Kg'
      },
      {
        name: 'Mực Sữa Tươi',
        slug: 'muc-sua-tuoi',
        description: 'Mực sữa (mực baby) tươi sống, thịt mềm ngọt. Chiên giòn, xào chua ngọt đều ngon.',
        price: 165000,
        originalPrice: 185000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['muc'],
        soldCount: 112,
        inStock: true,
        tags: ['Size nhỏ', 'Mềm ngọt'],
        unit: 'Kg'
      },

      // GHẸ & CUA - Thêm
      {
        name: 'Cua Hoàng Đế',
        slug: 'cua-hoang-de',
        description: 'Cua hoàng đế (King Crab) nhập khẩu, thịt ngọt béo, chân to đầy thịt.',
        price: 1200000,
        originalPrice: 1350000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        variants: [
          { name: '1-1.5kg', price: 1200000, originalPrice: 1350000, inStock: true },
          { name: '1.5-2kg', price: 1500000, originalPrice: 1700000, inStock: true },
        ],
        soldCount: 23,
        inStock: true,
        tags: ['Cao cấp', 'Nhập khẩu'],
        unit: 'Con'
      },
      {
        name: 'Ghẹ Sữa',
        slug: 'ghe-sua',
        description: 'Ghẹ sữa (ghẹ non) tươi sống, vỏ mềm, thịt ngọt. Rang me, chiên giòn đều ngon.',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        soldCount: 78,
        inStock: true,
        tags: ['Vỏ mềm', 'Ngọt'],
        unit: 'Kg'
      },
      {
        name: 'Cua Lột',
        slug: 'cua-lot',
        description: 'Cua lột (soft shell crab) tươi, ăn được cả vỏ. Chiên giòn, rang muối đều tuyệt.',
        price: 350000,
        originalPrice: 400000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['ghe-cua'],
        soldCount: 45,
        inStock: true,
        tags: ['Ăn cả vỏ', 'Chiên giòn'],
        unit: 'Kg'
      },

      // ỐC & SÒ - Thêm
      {
        name: 'Sò Huyết Tươi',
        slug: 'so-huyet-tuoi',
        description: 'Sò huyết tươi sống, thịt đỏ tươi, vị ngọt đậm. Nướng, hấp, xào đều ngon.',
        price: 125000,
        originalPrice: 145000,
        discountPercent: 14,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 134,
        inStock: true,
        tags: ['Tươi sống', 'Bổ máu'],
        unit: 'Kg'
      },
      {
        name: 'Ốc Vú Nàng',
        slug: 'oc-vu-nang',
        description: 'Ốc vú nàng tươi, thịt giòn ngọt, vị đặc trưng. Nướng mỡ hành, hấp sả đều ngon.',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 67,
        inStock: true,
        tags: ['Đặc sản', 'Giòn ngọt'],
        unit: 'Kg'
      },
      {
        name: 'Ốc Giác',
        slug: 'oc-giac',
        description: 'Ốc giác biển tươi, thịt dai giòn, vị ngọt thanh. Luộc, nướng đều ngon.',
        price: 195000,
        originalPrice: 220000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 56,
        inStock: true,
        tags: ['Thịt dai', 'Ngọt thanh'],
        unit: 'Kg'
      },
      {
        name: 'Sò Lông',
        slug: 'so-long',
        description: 'Sò lông tươi sống, thịt ngọt béo. Nướng mỡ hành, hấp sả đều tuyệt.',
        price: 145000,
        originalPrice: 165000,
        discountPercent: 12,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        soldCount: 89,
        inStock: true,
        tags: ['Tươi sống', 'Béo ngọt'],
        unit: 'Kg'
      },
      {
        name: 'Hàu Sữa Tươi',
        slug: 'hau-sua-tuoi',
        description: 'Hàu sữa tươi sống, thịt béo ngậy, giàu kẽm. Nướng phô mai, hấp đều ngon.',
        price: 165000,
        originalPrice: 185000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['oc-so'],
        variants: [
          { name: 'Size nhỏ (12-15 con/kg)', price: 145000, originalPrice: 165000, inStock: true },
          { name: 'Size vừa (8-10 con/kg)', price: 165000, originalPrice: 185000, inStock: true },
          { name: 'Size lớn (5-7 con/kg)', price: 195000, originalPrice: 220000, inStock: true },
        ],
        soldCount: 156,
        inStock: true,
        tags: ['Giàu kẽm', 'Béo ngậy'],
        unit: 'Kg'
      },

      // KHÔ & CHẾ BIẾN - Thêm
      {
        name: 'Khô Cá Dứa',
        slug: 'kho-ca-dua',
        description: 'Khô cá dứa một nắng, thịt dày, vị ngọt béo. Chiên, nướng đều ngon.',
        price: 280000,
        originalPrice: 320000,
        discountPercent: 13,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 78,
        inStock: true,
        tags: ['Một nắng', 'Thịt dày'],
        unit: 'Kg'
      },
      {
        name: 'Khô Cá Lóc',
        slug: 'kho-ca-loc',
        description: 'Khô cá lóc đồng, phơi tự nhiên. Thịt dai ngọt, chiên giòn rất ngon.',
        price: 320000,
        originalPrice: 360000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 67,
        inStock: true,
        tags: ['Cá đồng', 'Chiên giòn'],
        unit: 'Kg'
      },
      {
        name: 'Chả Cá Thu',
        slug: 'cha-ca-thu',
        description: 'Chả cá thu Phan Thiết, 100% cá thu tươi. Chiên, nướng, ăn kèm bánh mì đều ngon.',
        price: 180000,
        originalPrice: 200000,
        discountPercent: 10,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 145,
        inStock: true,
        tags: ['Chế biến', 'Tiện lợi'],
        unit: 'Kg'
      },
      {
        name: 'Mắm Cá Cơm',
        slug: 'mam-ca-com',
        description: 'Mắm cá cơm truyền thống Phan Thiết, ủ 12 tháng. Thơm ngon, đậm đà.',
        price: 95000,
        originalPrice: 110000,
        discountPercent: 14,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        variants: [
          { name: 'Chai 500ml', price: 95000, originalPrice: 110000, inStock: true },
          { name: 'Chai 1 lít', price: 170000, originalPrice: 195000, inStock: true },
        ],
        soldCount: 189,
        inStock: true,
        tags: ['Truyền thống', 'Đậm đà'],
        unit: 'Chai'
      },
      {
        name: 'Cá Khô Sặc Rằn',
        slug: 'ca-kho-sac-ran',
        description: 'Cá khô sặc rằn miền Tây, phơi tự nhiên. Chiên giòn, kho tiêu đều ngon.',
        price: 250000,
        originalPrice: 280000,
        discountPercent: 11,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 78,
        inStock: true,
        tags: ['Miền Tây', 'Chiên giòn'],
        unit: 'Kg'
      },
      {
        name: 'Bánh Tráng Trộn Hải Sản',
        slug: 'banh-trang-tron-hai-san',
        description: 'Bánh tráng trộn với tôm khô, mực khô, ruốc tôm. Ăn vặt ngon miệng.',
        price: 45000,
        originalPrice: 55000,
        discountPercent: 18,
        images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600'],
        category: categoryMap['kho-che-bien'],
        soldCount: 234,
        inStock: true,
        tags: ['Ăn vặt', 'Tiện lợi'],
        unit: 'Gói'
      },
    ];

    await Product.insertMany(products);
    console.log('Created products:', products.length);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();