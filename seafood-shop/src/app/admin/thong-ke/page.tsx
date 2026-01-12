'use client';

import { useState, useEffect } from 'react';

type PeriodType = 'day' | 'month' | 'quarter' | 'year';

interface Stats {
  revenue: number;
  revenueGrowth: number;
  orderCount: number;
  orderGrowth: number;
  completedOrders: number;
  cancelledOrders: number;
  newCustomers: number;
  customerGrowth: number;
  avgOrderValue: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface ChartDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface StatusBreakdown {
  pending: number;
  confirmed: number;
  shipping: number;
  delivered: number;
  cancelled: number;
}

interface StatisticsData {
  period: PeriodType;
  dateRange: { start: string; end: string };
  stats: Stats;
  topProducts: TopProduct[];
  statusBreakdown: StatusBreakdown;
  chartData: ChartDataPoint[];
}

const periodLabels: Record<PeriodType, string> = {
  day: 'Ngày',
  month: 'Tháng',
  quarter: 'Quý',
  year: 'Năm',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-500' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500' },
  shipping: { label: 'Đang giao', color: 'bg-purple-500' },
  delivered: { label: 'Đã giao', color: 'bg-green-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500' },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export default function StatisticsPage() {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [period, selectedDate]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/statistics?period=${period}&date=${selectedDate}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateInputType = () => {
    switch (period) {
      case 'day':
        return 'date';
      case 'month':
        return 'month';
      default:
        return 'date';
    }
  };

  const getDateInputValue = () => {
    if (period === 'month') {
      return selectedDate.slice(0, 7);
    }
    return selectedDate;
  };

  const handleDateChange = (value: string) => {
    if (period === 'month') {
      setSelectedDate(value + '-01');
    } else {
      setSelectedDate(value);
    }
  };

  const getQuarterOptions = () => {
    const year = new Date(selectedDate).getFullYear();
    return [
      { value: `${year}-01-01`, label: `Q1 ${year}` },
      { value: `${year}-04-01`, label: `Q2 ${year}` },
      { value: `${year}-07-01`, label: `Q3 ${year}` },
      { value: `${year}-10-01`, label: `Q4 ${year}` },
    ];
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      years.push({ value: `${y}-01-01`, label: `${y}` });
    }
    return years;
  };

  const maxRevenue = data?.chartData ? Math.max(...data.chartData.map(d => d.revenue), 1) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Thống kê chi tiết 📊</h1>
        <p className="text-violet-100">Phân tích doanh thu và hoạt động kinh doanh</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kỳ thống kê</label>
            <div className="flex gap-2">
              {(['day', 'month', 'quarter', 'year'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chọn thời gian</label>
            {period === 'quarter' ? (
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {getQuarterOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : period === 'year' ? (
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {getYearOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={getDateInputType()}
                value={getDateInputValue()}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Doanh thu"
              value={formatPrice(data.stats.revenue)}
              growth={data.stats.revenueGrowth}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              label="Đơn hàng"
              value={data.stats.orderCount.toString()}
              growth={data.stats.orderGrowth}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              label="Khách hàng mới"
              value={data.stats.newCustomers.toString()}
              growth={data.stats.customerGrowth}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
              gradient="from-cyan-500 to-cyan-600"
            />
            <StatCard
              label="Giá trị TB/đơn"
              value={formatPrice(data.stats.avgOrderValue)}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              gradient="from-violet-500 to-violet-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Biểu đồ doanh thu</h3>
              <div className="h-64 flex items-end gap-1">
                {data.chartData.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm transition-all hover:from-cyan-400 hover:to-blue-400"
                      style={{ height: `${(point.revenue / maxRevenue) * 100}%`, minHeight: point.revenue > 0 ? '4px' : '0' }}
                      title={`${point.label}: ${formatPrice(point.revenue)}`}
                    />
                    <span className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                      {point.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Trạng thái đơn hàng</h3>
              <div className="space-y-3">
                {Object.entries(data.statusBreakdown).map(([status, count]) => {
                  const config = statusLabels[status];
                  const total = Object.values(data.statusBreakdown).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{config.label}</span>
                        <span className="font-medium text-slate-800">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${config.color} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Products & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Top sản phẩm bán chạy</h3>
              {data.topProducts.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Chưa có dữ liệu</p>
              ) : (
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-700' : 'bg-slate-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">Đã bán: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tổng kết</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Đơn hoàn thành</span>
                  <span className="font-semibold text-green-600">{data.stats.completedOrders}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Đơn đã hủy</span>
                  <span className="font-semibold text-red-600">{data.stats.cancelledOrders}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Tỷ lệ hoàn thành</span>
                  <span className="font-semibold text-slate-800">
                    {data.stats.orderCount > 0 
                      ? Math.round((data.stats.completedOrders / data.stats.orderCount) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Tổng doanh thu</span>
                  <span className="font-bold text-lg text-emerald-600">{formatPrice(data.stats.revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-slate-500">
          Không thể tải dữ liệu thống kê
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  growth, 
  icon, 
  gradient 
}: { 
  label: string; 
  value: string; 
  growth?: number; 
  icon: React.ReactNode; 
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{Math.abs(growth)}%</span>
              <span className="text-slate-400">so với kỳ trước</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
