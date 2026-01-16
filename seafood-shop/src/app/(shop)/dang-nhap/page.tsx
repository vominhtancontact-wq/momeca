'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        login(data.data.user, data.data.token);
        // Redirect về trang trước đó hoặc trang chủ
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
        <p className="text-gray-500 mt-2">Chào mừng bạn quay trở lại!</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          required
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>

      <p className="text-center text-gray-500 mt-6">
        Chưa có tài khoản?{' '}
        <Link href="/dang-ky" className="text-primary font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
