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
  const [status, setStatus] = useState(currentStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === status) return;

    console.log('Updating order status:', { orderId, from: status, to: newStatus });
    
    setLoading(true);
    try {
      const url = `/api/orders/${orderId}`;
      console.log('Sending PATCH request to:', url);
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok && data.success) {
        console.log('Status updated successfully');
        setStatus(newStatus);
        router.refresh();
        alert('Cập nhật trạng thái thành công!');
      } else {
        console.error('Failed to update status:', data);
        alert(data.error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        // Reset về trạng thái cũ
        e.target.value = status;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
      // Reset về trạng thái cũ
      e.target.value = status;
    } finally {
      setLoading(false);
    }
  };

  const currentOption = statusOptions.find((opt) => opt.value === status);

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-opacity ${
        currentOption?.color || 'bg-gray-100 text-gray-800'
      } ${loading ? 'opacity-50 cursor-wait' : 'hover:opacity-80'}`}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
