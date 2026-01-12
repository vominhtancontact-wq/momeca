'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? 'Đang xóa...' : 'Xóa'}
    </button>
  );
}
