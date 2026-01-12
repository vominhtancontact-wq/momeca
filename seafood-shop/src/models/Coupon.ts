import mongoose, { Schema, Document, Model } from 'mongoose';

export type CouponType = 'fixed' | 'percent';
export type CouponStatus = 'active' | 'used' | 'expired';

export interface ICoupon extends Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  type: CouponType;
  value: number; // Số tiền giảm (fixed) hoặc % giảm (percent)
  minOrderValue: number; // Giá trị đơn hàng tối thiểu
  maxUsage: number; // Số lần sử dụng tối đa
  usedCount: number; // Số lần đã sử dụng
  status: CouponStatus;
  tierLevel: number; // Mức chi tiêu đạt được (500k, 1M, 2M)
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['fixed', 'percent'],
    default: 'fixed',
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxUsage: {
    type: Number,
    default: 1,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired'],
    default: 'active',
  },
  tierLevel: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes (code already has unique index from schema definition)
CouponSchema.index({ userId: 1, status: 1 });
CouponSchema.index({ expiresAt: 1 });

// Generate unique coupon code
CouponSchema.statics.generateCode = function(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MMC'; // Mỡ Mê Cá prefix
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
