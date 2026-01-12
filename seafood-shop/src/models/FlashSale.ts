import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlashSaleProduct {
  product: mongoose.Types.ObjectId;
  salePrice: number;
  originalPrice: number;
  quantity: number;
  soldCount: number;
}

export interface IFlashSale extends Document {
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  products: IFlashSaleProduct[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashSaleProductSchema = new Schema<IFlashSaleProduct>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  salePrice: { 
    type: Number, 
    required: true,
    min: [0, 'Giá sale không được âm']
  },
  originalPrice: { 
    type: Number, 
    required: true,
    min: [0, 'Giá gốc không được âm']
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [0, 'Số lượng không được âm']
  },
  soldCount: { 
    type: Number, 
    default: 0,
    min: 0
  }
}, { _id: false });

const FlashSaleSchema = new Schema<IFlashSale>({
  name: { 
    type: String, 
    required: [true, 'Tên chương trình là bắt buộc'],
    trim: true,
    maxlength: [200, 'Tên không được quá 200 ký tự']
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  startTime: { 
    type: Date, 
    required: [true, 'Thời gian bắt đầu là bắt buộc']
  },
  endTime: { 
    type: Date, 
    required: [true, 'Thời gian kết thúc là bắt buộc']
  },
  products: [FlashSaleProductSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
FlashSaleSchema.index({ startTime: 1, endTime: 1 });
FlashSaleSchema.index({ isActive: 1 });

// Virtual to check if flash sale is currently running
FlashSaleSchema.virtual('isRunning').get(function() {
  const now = new Date();
  return this.isActive && this.startTime <= now && this.endTime >= now;
});

// Virtual to get remaining time in seconds
FlashSaleSchema.virtual('remainingTime').get(function() {
  const now = new Date();
  if (this.endTime <= now) return 0;
  return Math.floor((this.endTime.getTime() - now.getTime()) / 1000);
});

// Validate that endTime is after startTime
FlashSaleSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
  }
  next();
});

const FlashSale: Model<IFlashSale> = mongoose.models.FlashSale || mongoose.model<IFlashSale>('FlashSale', FlashSaleSchema);

export default FlashSale;
