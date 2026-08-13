import { useState } from 'react';
import { Download, FileText, TrendingUp, IndianRupee, ShoppingBag, Users, CalendarCheck } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { monthlyRevenue, customerGrowth, topProducts, topCourses, topExperts } from '@/data/mockData';

const dateRanges = ['7 Days', '30 Days', '3 Months', '1 Year'] as const;

export default function Reports() {
  const [range, setRange] = useState<typeof dateRanges[number]>('3 Months');

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive analytics for Veda Structure business performance."
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-secondary"><Download className="w-4 h-4" /> Export CSV</button>
            <button className="btn-primary"><FileText className="w-4 h-4" /> Export PDF</button>
          </div>
        }
      />

      <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1 w-fit mb-6">
        {dateRanges.map((opt) => (
          <button
            key={opt}
            onClick={() => setRange(opt)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${range === opt ? 'bg-white text-saffron-600 shadow-soft' : 'text-charcoal-400 hover:text-charcoal-600'}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value="₹4,82,500" change="+12.5%" trend="up" icon={IndianRupee} />
        <StatCard title="Total Orders" value="1,284" change="+8.2%" trend="up" icon={ShoppingBag} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="New Customers" value="410" change="+15.3%" trend="up" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Bookings" value="356" change="+5.7%" trend="up" icon={CalendarCheck} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Month */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-1">Revenue by Month</h3>
          <p className="text-sm text-charcoal-400 mb-4">Monthly revenue and orders trend</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E9D2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #F3E9D2', borderRadius: '12px', fontSize: '13px' }} />
              <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar dataKey="orders" fill="#7A4F8E" radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-1">Customer Growth</h3>
          <p className="text-sm text-charcoal-400 mb-4">Total registered customers over time</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={customerGrowth}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7A4F8E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7A4F8E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E9D2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#A39B8E' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #F3E9D2', borderRadius: '12px', fontSize: '13px' }} />
              <Area type="monotone" dataKey="customers" stroke="#7A4F8E" strokeWidth={2.5} fill="url(#custGrad)" name="Customers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-saffron-100 text-saffron-700' : 'bg-cream-100 text-charcoal-400'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{p.name}</p>
                  <p className="text-xs text-charcoal-400">{p.sales} sales</p>
                </div>
                <span className="text-sm font-medium text-charcoal-700">₹{(p.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Top Courses</h3>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-purple-100 text-purple-700' : 'bg-cream-100 text-charcoal-400'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{c.name}</p>
                  <p className="text-xs text-charcoal-400">{c.students} students</p>
                </div>
                <span className="text-sm font-medium text-charcoal-700">₹{(c.revenue / 100000).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Experts */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4">Top Experts</h3>
          <div className="space-y-3">
            {topExperts.map((e, i) => (
              <div key={e.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-gold-400/20 text-gold-600' : 'bg-cream-100 text-charcoal-400'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{e.name}</p>
                  <p className="text-xs text-charcoal-400">{e.bookings} bookings</p>
                </div>
                <span className="text-sm font-medium text-charcoal-700">₹{(e.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
