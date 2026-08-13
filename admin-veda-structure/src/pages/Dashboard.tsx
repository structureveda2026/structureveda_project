import { useState } from 'react';
import {
  IndianRupee, ShoppingBag, Users, CalendarCheck, Package, GraduationCap,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Calendar,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';
import { revenueData, bookingTypeData, orders, bookings } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const filterOptions = ['Today', '7 Days', '30 Days', '3 Months', '1 Year'] as const;

export default function Dashboard() {
  const [filter, setFilter] = useState<typeof filterOptions[number]>('7 Days');
  const chartData = revenueData[filter];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin. Here's what's happening with Veda Structure today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Revenue" value="₹4,82,500" change="+12.5%" trend="up" icon={IndianRupee} iconColor="text-saffron-600" iconBg="bg-saffron-50" />
        <StatCard title="Total Orders" value="1,284" change="+8.2%" trend="up" icon={ShoppingBag} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Total Customers" value="8,420" change="+15.3%" trend="up" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Total Bookings" value="356" change="+5.7%" trend="up" icon={CalendarCheck} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Products" value="128" change="+3.1%" trend="up" icon={Package} iconColor="text-gold-500" iconBg="bg-gold-400/10" />
        <StatCard title="Courses" value="24" change="-2.0%" trend="down" icon={GraduationCap} iconColor="text-charcoal-600" iconBg="bg-charcoal-100" />
      </div>

      {/* Revenue chart + Booking overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-charcoal-800">Revenue Overview</h3>
              <p className="text-sm text-charcoal-400">Revenue and orders trend</p>
            </div>
            <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    filter === opt ? 'bg-white text-saffron-600 shadow-soft' : 'text-charcoal-400 hover:text-charcoal-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7A4F8E" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#7A4F8E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E9D2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #F3E9D2',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="orders" stroke="#7A4F8E" strokeWidth={2.5} fill="url(#ordGrad)" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3 justify-center">
            <span className="flex items-center gap-2 text-sm text-charcoal-500">
              <span className="w-3 h-3 rounded-full bg-saffron-500" /> Revenue
            </span>
            <span className="flex items-center gap-2 text-sm text-charcoal-500">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> Orders
            </span>
          </div>
        </div>

        {/* Booking Overview */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-charcoal-800 mb-1">Booking Overview</h3>
          <p className="text-sm text-charcoal-400 mb-4">Distribution by service type</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-saffron-50 rounded-xl p-3">
              <Clock className="w-5 h-5 text-saffron-600 mb-1.5" />
              <p className="text-xs text-charcoal-400">Today's Bookings</p>
              <p className="text-xl font-bold text-charcoal-800">12</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <Calendar className="w-5 h-5 text-purple-600 mb-1.5" />
              <p className="text-xs text-charcoal-400">Upcoming</p>
              <p className="text-xl font-bold text-charcoal-800">28</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <CheckCircle className="w-5 h-5 text-green-600 mb-1.5" />
              <p className="text-xs text-charcoal-400">Completed</p>
              <p className="text-xl font-bold text-charcoal-800">298</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <XCircle className="w-5 h-5 text-red-500 mb-1.5" />
              <p className="text-xs text-charcoal-400">Cancelled</p>
              <p className="text-xl font-bold text-charcoal-800">18</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={bookingTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {bookingTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #F3E9D2', borderRadius: '12px', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {bookingTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-charcoal-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-medium text-charcoal-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
          <div>
            <h3 className="text-lg font-semibold text-charcoal-800">Recent Orders</h3>
            <p className="text-sm text-charcoal-400">Latest customer orders</p>
          </div>
          <Link to="/admin/orders" className="text-sm text-saffron-600 hover:text-saffron-700 font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Payment</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-right px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="table-row-hover">
                  <td className="px-5 py-3.5 font-medium text-charcoal-700">#{order.id}</td>
                  <td className="px-5 py-3.5 text-charcoal-600">{order.customerName}</td>
                  <td className="px-5 py-3.5 text-charcoal-600 max-w-[180px] truncate">{order.items[0].name}</td>
                  <td className="px-5 py-3.5 font-medium text-charcoal-700">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={order.orderStatus} /></td>
                  <td className="px-5 py-3.5 text-charcoal-500">{order.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to={`/admin/orders/${order.id}`} className="inline-flex p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
          <div>
            <h3 className="text-lg font-semibold text-charcoal-800">Upcoming Bookings</h3>
            <p className="text-sm text-charcoal-400">Next scheduled consultations and sessions</p>
          </div>
          <Link to="/admin/bookings" className="text-sm text-saffron-600 hover:text-saffron-700 font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Booking ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Service</th>
                <th className="text-left px-5 py-3 font-medium">Expert</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Time</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').slice(0, 5).map((booking) => (
                <tr key={booking.id} className="table-row-hover">
                  <td className="px-5 py-3.5 font-medium text-charcoal-700">#{booking.id}</td>
                  <td className="px-5 py-3.5 text-charcoal-600">{booking.customerName}</td>
                  <td className="px-5 py-3.5 text-charcoal-600">{booking.service}</td>
                  <td className="px-5 py-3.5 text-charcoal-600">{booking.expert}</td>
                  <td className="px-5 py-3.5 text-charcoal-500">{booking.bookingDate}</td>
                  <td className="px-5 py-3.5 text-charcoal-500">{booking.bookingTime}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={booking.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to={`/admin/bookings/${booking.id}`} className="inline-flex p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
