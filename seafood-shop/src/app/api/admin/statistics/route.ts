import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order, User } from '@/models';

export const dynamic = 'force-dynamic';

type PeriodType = 'day' | 'month' | 'quarter' | 'year';

interface DateRange {
  start: Date;
  end: Date;
}

function getDateRange(period: PeriodType, date: Date): DateRange {
  const start = new Date(date);
  const end = new Date(date);

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(quarter * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

function getPreviousDateRange(period: PeriodType, date: Date): DateRange {
  const prevDate = new Date(date);

  switch (period) {
    case 'day':
      prevDate.setDate(prevDate.getDate() - 1);
      break;
    case 'month':
      prevDate.setMonth(prevDate.getMonth() - 1);
      break;
    case 'quarter':
      prevDate.setMonth(prevDate.getMonth() - 3);
      break;
    case 'year':
      prevDate.setFullYear(prevDate.getFullYear() - 1);
      break;
  }

  return getDateRange(period, prevDate);
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'month') as PeriodType;
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    // Validate date
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Ngày không hợp lệ' },
        { status: 400 }
      );
    }

    const { start, end } = getDateRange(period, date);
    const { start: prevStart, end: prevEnd } = getPreviousDateRange(period, date);

    // Current period stats
    const currentOrders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    }).lean() || [];

    const completedOrders = currentOrders.filter(
      o => o.status === 'delivered'
    );

    const currentRevenue = completedOrders.reduce((sum, order) => {
      const productAmount = (order.totalAmount || 0) - (order.shippingFee || 0);
      return sum + productAmount;
    }, 0);

    const currentOrderCount = currentOrders.length;
    const currentCompletedCount = completedOrders.length;
    const currentCancelledCount = currentOrders.filter(o => o.status === 'cancelled').length;

    // Previous period stats for comparison
    const prevOrders = await Order.find({
      createdAt: { $gte: prevStart, $lte: prevEnd }
    }).lean() || [];

    const prevCompletedOrders = prevOrders.filter(
      o => o.status === 'delivered'
    );

    const prevRevenue = prevCompletedOrders.reduce((sum, order) => {
      const productAmount = (order.totalAmount || 0) - (order.shippingFee || 0);
      return sum + productAmount;
    }, 0);

    const prevOrderCount = prevOrders.length;

    // Calculate growth percentages
    const revenueGrowth = prevRevenue > 0 
      ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 
      : currentRevenue > 0 ? 100 : 0;

    const orderGrowth = prevOrderCount > 0 
      ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100 
      : currentOrderCount > 0 ? 100 : 0;

    // New customers in period
    const newCustomers = await User.countDocuments({
      role: { $ne: 'admin' },
      createdAt: { $gte: start, $lte: end }
    }) || 0;

    const prevNewCustomers = await User.countDocuments({
      role: { $ne: 'admin' },
      createdAt: { $gte: prevStart, $lte: prevEnd }
    }) || 0;

    const customerGrowth = prevNewCustomers > 0
      ? ((newCustomers - prevNewCustomers) / prevNewCustomers) * 100
      : newCustomers > 0 ? 100 : 0;

    // Top selling products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    completedOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const key = item.productName || 'Unknown';
          if (!productSales[key]) {
            productSales[key] = { name: item.productName || 'Unknown', quantity: 0, revenue: 0 };
          }
          productSales[key].quantity += item.quantity || 0;
          productSales[key].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Daily/Monthly breakdown for chart
    const chartData = await getChartData(period, start, end);

    // Order status breakdown
    const statusBreakdown = {
      pending: currentOrders.filter(o => o.status === 'pending').length,
      confirmed: currentOrders.filter(o => o.status === 'confirmed').length,
      shipping: currentOrders.filter(o => o.status === 'shipping').length,
      delivered: currentOrders.filter(o => o.status === 'delivered').length,
      cancelled: currentCancelledCount,
    };

    // Average order value
    const avgOrderValue = currentCompletedCount > 0 
      ? currentRevenue / currentCompletedCount 
      : 0;

    return NextResponse.json({
      period,
      dateRange: { 
        start: start.toISOString(), 
        end: end.toISOString() 
      },
      stats: {
        revenue: currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orderCount: currentOrderCount,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        completedOrders: currentCompletedCount,
        cancelledOrders: currentCancelledCount,
        newCustomers,
        customerGrowth: Math.round(customerGrowth * 10) / 10,
        avgOrderValue: Math.round(avgOrderValue),
      },
      topProducts,
      statusBreakdown,
      chartData,
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thống kê' },
      { status: 500 }
    );
  }
}

async function getChartData(period: PeriodType, start: Date, end: Date) {
  const data: { label: string; revenue: number; orders: number }[] = [];

  // Lấy tất cả orders trong khoảng thời gian một lần
  const allOrders = await Order.find({
    createdAt: { $gte: start, $lte: end },
    status: 'delivered'
  }).lean() || [];

  if (period === 'day') {
    // Hourly breakdown
    for (let hour = 0; hour < 24; hour++) {
      const hourOrders = allOrders.filter(o => {
        const orderHour = new Date(o.createdAt).getHours();
        return orderHour === hour;
      });

      const revenue = hourOrders.reduce((sum, o) => sum + (o.totalAmount || 0) - (o.shippingFee || 0), 0);

      data.push({
        label: `${hour}:00`,
        revenue,
        orders: hourOrders.length
      });
    }
  } else if (period === 'month') {
    // Daily breakdown
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOrders = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getDate() === day;
      });

      const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0) - (o.shippingFee || 0), 0);

      data.push({
        label: `${day}`,
        revenue,
        orders: dayOrders.length
      });
    }
  } else if (period === 'quarter') {
    // Monthly breakdown
    const quarterStart = start.getMonth();
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    for (let i = 0; i < 3; i++) {
      const targetMonth = quarterStart + i;
      const monthOrders = allOrders.filter(o => {
        const orderMonth = new Date(o.createdAt).getMonth();
        return orderMonth === targetMonth;
      });

      const revenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0) - (o.shippingFee || 0), 0);

      data.push({
        label: monthNames[targetMonth],
        revenue,
        orders: monthOrders.length
      });
    }
  } else {
    // Yearly - monthly breakdown
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    for (let month = 0; month < 12; month++) {
      const monthOrders = allOrders.filter(o => {
        const orderMonth = new Date(o.createdAt).getMonth();
        return orderMonth === month;
      });

      const revenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0) - (o.shippingFee || 0), 0);

      data.push({
        label: monthNames[month],
        revenue,
        orders: monthOrders.length
      });
    }
  }

  return data;
}
