import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  title, value, change, trend, icon: Icon, iconColor = 'text-saffron-600', iconBg = 'bg-saffron-50',
}: StatCardProps) {
  return (
    <div className="card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-charcoal-800 mt-1.5">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change}
        </span>
        <span className="text-xs text-charcoal-300">vs last month</span>
      </div>
    </div>
  );
}
