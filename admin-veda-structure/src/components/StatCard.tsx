import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  change?: string;
  sublabel?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  color?: string;
}

export default function StatCard({
  title,
  label,
  value,
  change,
  sublabel,
  trend,
  icon: Icon,
  iconColor = 'text-saffron-600',
  iconBg = 'bg-saffron-50',
  color,
}: StatCardProps) {
  const displayTitle = title || label || '';
  
  // Map color shorthand if provided
  let computedIconColor = iconColor;
  let computedIconBg = iconBg;
  if (color === 'saffron') {
    computedIconColor = 'text-saffron-600';
    computedIconBg = 'bg-saffron-50';
  } else if (color === 'blue') {
    computedIconColor = 'text-blue-600';
    computedIconBg = 'bg-blue-50';
  } else if (color === 'emerald') {
    computedIconColor = 'text-emerald-600';
    computedIconBg = 'bg-emerald-50';
  } else if (color === 'purple') {
    computedIconColor = 'text-purple-600';
    computedIconBg = 'bg-purple-50';
  }

  return (
    <div className="card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-400 font-medium">{displayTitle}</p>
          <p className="text-2xl font-bold text-charcoal-800 mt-1.5">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${computedIconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${computedIconColor}`} strokeWidth={2} />
        </div>
      </div>
      {(change || sublabel) && (
        <div className="flex items-center gap-1.5 mt-3">
          {change && trend && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {change && <span className="text-xs text-charcoal-300">vs last month</span>}
          {!change && sublabel && <span className="text-xs text-charcoal-400">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
