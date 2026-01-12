'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipping', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
];

export default function OrderStatusSelectClient({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const currentOption = statusOptions.find((opt) => opt.value === currentStatus);

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${
        currentOption?.color || 'bg-gray-100 text-gray-800'
      } ${loading ? 'opacity-50' : ''}`}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
