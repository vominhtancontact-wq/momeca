'use client';

import { useEffect, useState } from 'react';

export default function TestCookiePage() {
  const [cookies, setCookies] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie);
    
    // Try to get admin_token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_token='))
      ?.split('=')[1];
    
    setAdminToken(token || 'Not found');
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (res.ok) {
        alert('Logged out successfully! Please login again.');
        window.location.href = '/admin/dang-nhap';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Admin Cookie</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl space-y-4">
        <div>
          <h3 className="font-medium mb-2">All Cookies:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {cookies || 'No cookies found'}
          </pre>
        </div>

        <div>
          <h3 className="font-medium mb-2">Admin Token:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {adminToken}
          </pre>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout & Re-login
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Click this to logout and login again to get a fresh admin token
          </p>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
        <h3 className="font-medium text-blue-800 mb-2">Note:</h3>
        <p className="text-sm text-blue-700">
          The admin_token cookie is HTTP-only, so you won't see it in document.cookie.
          But the API can still read it from the request headers.
        </p>
      </div>
    </div>
  );
}
