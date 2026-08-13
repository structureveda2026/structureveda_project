import { useState } from 'react';
import { ShoppingBag, CalendarCheck, CreditCard, Package, UserPlus, XCircle, Bell, Check } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { notifications as initialNotifications } from '@/data/mockData';
import type { Notification } from '@/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<Notification['type'], { icon: LucideIcon; bg: string; color: string }> = {
  order: { icon: ShoppingBag, bg: 'bg-saffron-50', color: 'text-saffron-600' },
  booking: { icon: CalendarCheck, bg: 'bg-purple-50', color: 'text-purple-600' },
  payment: { icon: CreditCard, bg: 'bg-green-50', color: 'text-green-600' },
  stock: { icon: Package, bg: 'bg-amber-50', color: 'text-amber-600' },
  customer: { icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-600' },
  cancellation: { icon: XCircle, bg: 'bg-red-50', color: 'text-red-500' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notifications.`}
        actions={
          <button onClick={markAllRead} className="btn-secondary">
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        }
      />

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all' ? 'bg-saffron-500 text-white' : 'bg-white text-charcoal-500 border border-cream-200 hover:bg-cream-100'}`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'unread' ? 'bg-saffron-500 text-white' : 'bg-white text-charcoal-500 border border-cream-200 hover:bg-cream-100'}`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="card divide-y divide-cream-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
            <p className="text-charcoal-400">No notifications to show.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const config = iconMap[n.type];
            const Icon = config.icon;
            return (
              <div key={n.id} className={`flex items-start gap-4 p-4 hover:bg-cream-50 transition cursor-pointer ${!n.read ? 'bg-saffron-50/30' : ''}`} onClick={() => toggleRead(n.id)}>
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-charcoal-700">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-saffron-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-charcoal-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-charcoal-300 mt-1">{n.date}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
