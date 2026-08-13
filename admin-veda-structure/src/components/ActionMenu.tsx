import { MoreVertical, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ActionMenuProps {
  actions: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[];
}

export default function ActionMenu({ actions }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-elevated border border-cream-200 py-1.5 z-20 animate-scale-in">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => { action.onClick(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition ${
                action.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-charcoal-600 hover:bg-cream-100'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const actionIcons = { Eye: () => <Eye className="w-4 h-4" />, Edit: () => <Edit className="w-4 h-4" />, Delete: () => <Trash2 className="w-4 h-4" />, Copy: () => <Copy className="w-4 h-4" /> };
