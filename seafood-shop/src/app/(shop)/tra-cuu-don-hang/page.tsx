'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

function OrderLookupContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  
  const [searchType, setSearchType] = useState<'orderNumber' | 'phone'>('orderNumber');
  const [searchValue, setSearchValue] = useState(initialOrderNumber);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Auto search if orderNumber is provided in URL
  useEffect(() => {
    if (initialOrderNumber) {
      handleSearchWithValue(initialOrderNumber, 'orderNumber');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderNumber]);

  const handleSearchWithValue = async (value: string, type: 'orderNumber' | 'phone') => {
    if (!value.trim()) return;

    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (type === 'orderNumber') {
        params.set('orderNumber', value.trim());
      } else {
        params.set('phone', value.trim());
      }

      const response = await fetch(`/api/orders/lookup?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Không tìm thấy đơn hàng');
        setOrders([]);
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError(searchType === 'orderNumber' ? 'Vui lòng nhập mã đơn hàng' : 'Vui lòng nhập số điện thoại');
      return;
    }

    handleSearchWithValue(searchValue, searchType);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2 text-gray-500">
          <li><a href="/" className="hover:text-primary">Trang chủ</a></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Tra cứu đơn hàng</li>
        </ol>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Tra cứu đơn hàng
      </h1>

      {/* Search Form */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => { setSearchType('orderNumber'); setSearchValue(''); setOrders([]); setSearched(false); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                searchType === 'orderNumber'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Theo mã đơn hàng
            </button>
            <button
              type="button"
              onClick={() => { setSearchType('phone'); setSearchValue(''); setOrders([]); setSearched(false); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                searchType === 'phone'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Theo số điện thoại
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label={searchType === 'orderNumber' ? 'Mã đơn hàng' : 'Số điện thoại'}
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setError(''); }}
              placeholder={searchType === 'orderNumber' ? 'Nhập mã đơn hàng...' : 'Nhập số điện thoại...'}
              error={error}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Tra cứu
            </Button>
          </form>
        </div>
      </div>

      {/* Results */}
      {searched && !isLoading && (
        <div className="max-w-3xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Tìm thấy {orders.length} đơn hàng</p>
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                      <span className="ml-2 font-semibold text-primary">{order.orderNumber}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusMap[order.status]?.label || order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                          {item.variantName && (
                            <p className="text-sm text-gray-500">{item.variantName}</p>
                          )}
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      <p>Địa chỉ: {order.customerAddress}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default function OrderLookupPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Đang tải...</div>}>
      <OrderLookupContent />
    </Suspense>
  );
}
