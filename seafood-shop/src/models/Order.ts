import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  variant?: string;
  variantName?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerNote?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  items: IOrderItem[];
  subtotal: number; // Tổng tiền sản phẩm
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  totalAmount: number; // subtotal - couponDiscount + shippingFee
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  productImage: { 
    type: String 
  },
  variant: { 
    type: String 
  },
  variantName: { 
    type: String 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Số lượng phải lớn hơn 0']
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Giá không được âm']
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: { 
    type: String, 
    required: [true, 'Tên khách hàng là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được quá 100 ký tự']
  },
  customerPhone: { 
    type: String, 
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
  },
  customerEmail: { 
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  customerAddress: { 
    type: String, 
    required: [true, 'Địa chỉ giao hàng là bắt buộc'],
    trim: true,
    maxlength: [500, 'Địa chỉ không được quá 500 ký tự']
  },
  customerNote: { 
    type: String,
    maxlength: [500, 'Ghi chú không được quá 500 ký tự']
  },
  deliveryDate: {
    type: String
  },
  deliveryTime: {
    type: String
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: function(items: IOrderItem[]) {
        return items && items.length > 0;
      },
      message: 'Đơn hàng phải có ít nhất 1 sản phẩm'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Tạm tính không được âm']
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  couponDiscount: {
    type: Number,
    default: 0,
    min: [0, 'Giảm giá không được âm']
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: [0, 'Phí ship không được âm']
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: [0, 'Tổng tiền không được âm']
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cod', 'online'],
      message: 'Phương thức thanh toán không hợp lệ'
    },
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed'],
      message: 'Trạng thái thanh toán không hợp lệ'
    },
    default: 'pending'
  },
  status: { 
    type: String, 
    enum: {
      values: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
      message: 'Trạng thái không hợp lệ'
    },
    default: 'pending'
  }
}, { 
  timestamps: true 
});

// Indexes (orderNumber already has unique index)
OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `DH${dateStr}${random}`;
  }
  next();
});

// Static method to generate unique order number
OrderSchema.statics.generateOrderNumber = async function(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DH${dateStr}${random}`;
};

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
