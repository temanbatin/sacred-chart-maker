import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Types for analytics data
interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  affiliateOrders: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    affiliateRevenue: 0,
    affiliateOrderCount: 0
  });

  const [chartData, setChartData] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const last30Days = subDays(today, 30); // Get data for last 30 days

      // 1. Fetch Orders (PAID)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'PAID')
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      // 2. Fetch Users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (profilesError) throw profilesError;

      // --- Calculate Totals ---
      const totalRev = orders?.reduce((acc, order) => acc + (Number(order.amount) || 0), 0) || 0;
      const totalOrd = orders?.length || 0;
      const totalUsr = profiles?.length || 0;

      // Affiliate Stats (Orders with coupon_code in metadata)
      const affiliateOrders = orders?.filter(o => o.metadata && (o.metadata as any).coupon_code) || [];
      const affRev = affiliateOrders.reduce((acc, order) => acc + (Number(order.amount) || 0), 0) || 0;

      setStats({
        totalRevenue: totalRev,
        totalOrders: totalOrd,
        activeUsers: totalUsr,
        affiliateRevenue: affRev,
        affiliateOrderCount: affiliateOrders.length
      });

      // --- Process Daily Data for Charts (Last 30 Days) ---
      const dailyStatsMap = new Map<string, DailyStat>();

      // Initialize map with empty days
      for (let i = 0; i <= 30; i++) {
        const d = subDays(today, 30 - i);
        const dateKey = format(d, 'yyyy-MM-dd');
        dailyStatsMap.set(dateKey, {
          date: format(d, 'dd MMM', { locale: id }),
          revenue: 0,
          orders: 0,
          users: 0,
          affiliateOrders: 0
        });
      }

      // Fill with Order Data
      orders?.forEach(order => {
        const orderDate = new Date(order.created_at);
        if (orderDate >= last30Days) {
          const key = format(orderDate, 'yyyy-MM-dd');
          if (dailyStatsMap.has(key)) {
            const stat = dailyStatsMap.get(key)!;
            stat.revenue += Number(order.amount) || 0;
            stat.orders += 1;
            if (order.metadata && (order.metadata as any).coupon_code) {
              stat.affiliateOrders += 1;
            }
          }
        }
      });

      // Fill with User Data
      profiles?.forEach(user => {
        const userDate = new Date(user.created_at);
        if (userDate >= last30Days) {
          const key = format(userDate, 'yyyy-MM-dd');
          if (dailyStatsMap.has(key)) {
            const stat = dailyStatsMap.get(key)!;
            stat.users += 1;
          }
        }
      });

      setChartData(Array.from(dailyStatsMap.values()));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  if (isLoading) return <div className="p-8 text-center">Loading dashboard data...</div>;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Analisis performa bisnis 30 hari terakhir.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatIDR(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total pendapatan bersih</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.affiliateOrderCount} dari affiliate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Total pengguna terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliate Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatIDR(stats.affiliateRevenue)}</div>
            <p className="text-xs text-muted-foreground">Pendapatan via link affiliate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Penjualan Harian</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(val) => `Rp${val / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => formatIDR(value)}
                  labelStyle={{ color: 'black' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pertumbuhan User Baru</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip labelStyle={{ color: 'black' }} />
                <Bar dataKey="users" fill="#82ca9d" name="New Users" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Affiliate Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Affiliate vs Direct Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip labelStyle={{ color: 'black' }} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#ff7300" name="Total Orders" strokeWidth={2} />
                <Line type="monotone" dataKey="affiliateOrders" stroke="#387908" name="Affiliate Orders" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;
