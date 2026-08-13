import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  className?: string;
}

export default function FilterDropdown({ value, onChange, options, label, className = '' }: FilterDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      {label && <span className="sr-only">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-lg border border-cream-200 bg-white text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-300 transition cursor-pointer"
      >
        <option value="">{label || 'All'}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 pointer-events-none" />
    </div>
  );
}
