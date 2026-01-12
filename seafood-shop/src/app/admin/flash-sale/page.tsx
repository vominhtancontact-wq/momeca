'use client';

import { useState, useEffect } from 'react';

interface FlashSale {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  products: {
    product: string;
    salePrice: number;
    quantity: number;
    sold: number;
  }[];
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function FlashSalePage() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    products: [{ product: '', salePrice: '', quantity: '' }],
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        fetch('/api/flash-sales'),
        fetch('/api/products'),
      ]);
      const [salesData, productsData] = await Promise.all([
        salesRes.json(),
        productsRes.json(),
      ]);
      // Handle both { data: [...] } and direct array responses
      const sales = salesData?.data || salesData || [];
      setFlashSales(Array.isArray(sales) ? sales : []);
      
      const prods = productsData?.data || productsData?.products || productsData || [];
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        products: formData.products
          .filter((p) => p.product)
          .map((p) => ({
            product: p.product,
            salePrice: Number(p.salePrice),
            quantity: Number(p.quantity),
            sold: 0,
          })),
      };

      const res = await fetch('/api/flash-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchData();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa flash sale này?')) return;

    try {
      const res = await fetch(`/api/flash-sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Có lỗi xảy ra khi xóa flash sale');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa flash sale');
    }
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { product: '', salePrice: '', quantity: '' }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      products: [{ product: '', salePrice: '', quantity: '' }],
      isActive: true,
    });
  };

  const getStatus = (sale: FlashSale) => {
    const now = new Date();
    const start = new Date(sale.startTime);
    const end = new Date(sale.endTime);

    if (!sale.isActive) return { label: 'Đã tắt', color: 'bg-gray-100 text-gray-800' };
    if (now < start) return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-800' };
    if (now > end) return { label: 'Đã kết thúc', color: 'bg-red-100 text-red-800' };
    return { label: 'Đang diễn ra', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Flash Sale</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Tạo Flash Sale
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tạo Flash Sale mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên chương trình *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Thời gian bắt đầu *</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Thời gian kết thúc *</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Products */}
            <div>
              <label className="block text-sm font-medium mb-2">Sản phẩm Flash Sale</label>
              {formData.products.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.product}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].product = e.target.value;
                      setFormData((prev) => ({ ...prev, products: newProducts }));
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} - {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.salePrice}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].salePrice = e.target.value;
                      setFormData((prev) => ({ ...prev, products: newProducts }));
                    }}
                    placeholder="Giá sale"
                    className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].quantity = e.target.value;
                      setFormData((prev) => ({ ...prev, products: newProducts }));
                    }}
                    placeholder="Số lượng"
                    className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addProduct}
                className="text-primary hover:underline text-sm"
              >
                + Thêm sản phẩm
              </button>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary"
              />
              <span>Kích hoạt</span>
            </label>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Tạo Flash Sale
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {flashSales.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có flash sale nào. Hãy tạo flash sale đầu tiên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Tên chương trình</th>
                  <th className="text-left py-3 px-4">Thời gian</th>
                  <th className="text-left py-3 px-4">Số sản phẩm</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {flashSales.map((sale) => {
                  const status = getStatus(sale);
                  return (
                    <tr key={sale._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{sale.name}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>{new Date(sale.startTime).toLocaleString('vi-VN')}</div>
                        <div className="text-gray-500">
                          đến {new Date(sale.endTime).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">{sale.products?.length || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(sale._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
