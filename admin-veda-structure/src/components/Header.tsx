import { Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

export default function Header({ onToggleMobile, onToggleCollapse, collapsed }: HeaderProps) {
  const { user } = useAuth();

  const displayName = user?.fullName || 'Admin User';
  const displayRole = user?.role === 'admin' ? 'Super Admin' : (user?.role || 'Admin');
  const initial = (displayName[0] || 'A').toUpperCase();

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

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-cream-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {initial}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-charcoal-700 leading-none">{displayName}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
