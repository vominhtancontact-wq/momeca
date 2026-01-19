'use client';

import { useState } from 'react';

export default function TestOrderUpdatePage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!orderId) {
      alert('Vui lòng nhập Order ID');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      console.log('Testing order update:', { orderId, status });
      
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error('Error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Order Status Update</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter order ID (MongoDB ObjectId)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipping">Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Update'}
          </button>

          {result && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl">
        <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
          <li>Go to /admin/don-hang to get an order ID</li>
          <li>Copy the order ID (MongoDB ObjectId)</li>
          <li>Paste it here and select a new status</li>
          <li>Click "Test Update" and check the console for logs</li>
        </ol>
      </div>
    </div>
  );
}
