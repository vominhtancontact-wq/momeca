import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;
  order?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: [true, 'Tên danh mục là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên danh mục không được quá 100 ký tự']
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
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  image: { 
    type: String 
  },
  parentCategory: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (slug already has unique index)
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ order: 1 });

// Virtual for getting subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
