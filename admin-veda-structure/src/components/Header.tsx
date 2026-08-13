import { Menu, PanelLeftClose, PanelLeft, Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

export default function Header({ onToggleMobile, onToggleCollapse, collapsed }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-cream-200 h-16 flex items-center px-4 sm:px-6 gap-4">
      <button
        onClick={onToggleMobile}
        className="lg:hidden p-2 rounded-lg text-charcoal-500 hover:bg-cream-100 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex p-2 rounded-lg text-charcoal-500 hover:bg-cream-100 transition"
      >
        {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
      </button>

      <div className="hidden md:block flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-cream-200 bg-cream-50 text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link to="/admin/notifications" className="relative p-2 rounded-lg text-charcoal-500 hover:bg-cream-100 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-saffron-500 rounded-full ring-2 ring-white" />
        </Link>
        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-cream-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-charcoal-700 leading-none">Admin User</p>
            <p className="text-xs text-charcoal-400 mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
