import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';

export default function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center shadow-soft flex-shrink-0">
        <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="font-serif text-lg font-bold text-charcoal-800">Veda Structure</span>
          <span className="text-[10px] text-charcoal-400 tracking-wider uppercase">Admin Portal</span>
        </div>
      )}
    </Link>
  );
}
