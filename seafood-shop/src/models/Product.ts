import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  variants?: IProductVariant[];
  soldCount: number;
  inStock: boolean;
  tags?: string[];
  unit?: string;
  isBestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  inStock: { type: Boolean, default: true }
}, { _id: true });

const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên sản phẩm không được quá 200 ký tự']
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Mô tả sản phẩm là bắt buộc'],
    maxlength: [5000, 'Mô tả không được quá 5000 ký tự']
  },
  price: { 
    type: Number, 
    required: [true, 'Giá sản phẩm là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  originalPrice: { 
    type: Number,
    min: [0, 'Giá gốc không được âm']
  },
  discountPercent: { 
    type: Number, 
    default: 0,
    min: [0, 'Phần trăm giảm giá không được âm'],
    max: [100, 'Phần trăm giảm giá không được quá 100']
  },
  images: [{ 
    type: String,
    required: true
  }],
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, 'Danh mục sản phẩm là bắt buộc']
  },
  variants: [ProductVariantSchema],
  soldCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  unit: {
    type: String,
    default: 'kg'
  },
  isBestSeller: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance (slug already has unique index)
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ soldCount: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Virtual for checking if product has discount
ProductSchema.virtual('hasDiscount').get(function() {
  return this.discountPercent && this.discountPercent > 0;
});

// Pre-save middleware to calculate discount percent
ProductSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
