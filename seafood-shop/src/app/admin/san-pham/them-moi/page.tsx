'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Category {
  _id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '999',
    unit: 'kg',
    images: [''],
    variants: [{ name: '', price: '', stock: '999' }],
    isActive: true,
    isBestSeller: false,
    isHotDeal: false,
    isCombo: false,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((response) => {
        // Handle both { data: [...] } and direct array responses
        const cats = response?.data || response || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(console.error);
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const price = Number(formData.price);
      const originalPriceValue = formData.originalPrice ? Number(formData.originalPrice) : null;
      
      const payload = {
        ...formData,
        price,
        // Chỉ set originalPrice khi có giá trị và lớn hơn giá bán (có giảm giá)
        originalPrice: originalPriceValue && originalPriceValue > price ? originalPriceValue : undefined,
        stock: Number(formData.stock),
        images: formData.images.filter((img) => img.trim()),
        variants: formData.variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            name: v.name,
            price: Number(v.price) || price,
            stock: Number(v.stock) || Number(formData.stock),
          })),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/san-pham');
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: '', stock: '' }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tên sản phẩm *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Giá bán *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              required
              min="0"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giá gốc (để trống nếu không giảm giá)</label>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))}
              min="0"
              placeholder="Để trống = không giảm giá"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đơn vị</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="con">con</option>
              <option value="hộp">hộp</option>
              <option value="khay">khay</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Danh mục</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
        />

        {/* Variants */}
        <div>
          <label className="block text-sm font-medium mb-2">Biến thể (tùy chọn)</label>
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={variant.name}
                onChange={(e) => {
                  const newVariants = [...formData.variants];
                  newVariants[index].name = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newVariants }));
                }}
                placeholder="Tên biến thể (VD: 500g)"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const newVariants = [...formData.variants];
                  newVariants[index].price = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newVariants }));
                }}
                placeholder="Giá"
                className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => {
                  const newVariants = [...formData.variants];
                  newVariants[index].stock = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newVariants }));
                }}
                placeholder="Tồn kho"
                className="w-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {formData.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="text-primary hover:underline text-sm"
          >
            + Thêm biến thể
          </button>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span>Đang bán</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData((prev) => ({ ...prev, isBestSeller: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span>Bán chạy</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isHotDeal}
              onChange={(e) => setFormData((prev) => ({ ...prev, isHotDeal: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span>Khuyến mãi hot</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isCombo}
              onChange={(e) => setFormData((prev) => ({ ...prev, isCombo: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span>Combo tiết kiệm</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Thêm sản phẩm'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
