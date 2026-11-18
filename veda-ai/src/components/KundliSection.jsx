import { useState } from 'react';
import { X, Sparkles, Orbit, Home, TrendingUp } from 'lucide-react';
import SectionHeading from './SectionHeading';

const highlights = [
  { icon: Orbit, title: 'Planetary Positions', desc: 'Understand the placement and strength of each graha in your chart.' },
  { icon: Home, title: 'Houses & Ascendant', desc: 'Discover your rising sign and the twelve bhavas shaping your life.' },
  { icon: TrendingUp, title: 'Dasha & Transits', desc: 'Track your planetary periods and current transits for timing insights.' },
];

const KundliChart = () => {
  // Decorative north Indian style Kundli (square divided into 12 diamond/rhombus houses)
  const houses = Array.from({ length: 12 });
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple/10 to-gold/5 blur-xl" />
      <svg viewBox="0 0 200 200" className="relative w-full h-full">
        {/* Outer square */}
        <rect x="10" y="10" width="180" height="180" fill="none" stroke="rgba(245,184,46,0.5)" strokeWidth="1.5" rx="6" />
        {/* Diagonals */}
        <line x1="10" y1="10" x2="190" y2="190" stroke="rgba(245,184,46,0.4)" strokeWidth="1.2" />
        <line x1="190" y1="10" x2="10" y2="190" stroke="rgba(245,184,46,0.4)" strokeWidth="1.2" />
        {/* Middle horizontal & vertical */}
        <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(245,184,46,0.4)" strokeWidth="1.2" />
        <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(245,184,46,0.4)" strokeWidth="1.2" />
        {/* Center diamond */}
        <rect x="60" y="60" width="80" height="80" fill="rgba(113,56,168,0.08)" stroke="rgba(245,184,46,0.5)" strokeWidth="1.2" transform="rotate(45 100 100)" />
        {/* House numbers */}
        {houses.map((_, i) => {
          const positions = [
            { x: 100, y: 30 }, { x: 140, y: 50 }, { x: 170, y: 100 },
            { x: 150, y: 140 }, { x: 100, y: 170 }, { x: 60, y: 150 },
            { x: 30, y: 100 }, { x: 50, y: 60 }, { x: 75, y: 75 },
            { x: 125, y: 75 }, { x: 125, y: 125 }, { x: 75, y: 125 },
          ];
          const p = positions[i];
          return (
            <text key={i} x={p.x} y={p.y} fill="rgba(255,217,120,0.7)" fontSize="9" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif">
              {i + 1}
            </text>
          );
        })}
        {/* Center symbol */}
        <circle cx="100" cy="100" r="6" fill="rgba(245,184,46,0.6)" />
      </svg>
    </div>
  );
};

const KundliSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        title="Discover Your Cosmic Blueprint"
        description="Explore your birth chart and understand the planetary influences shaping your life."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <p className="font-serif text-base sm:text-lg text-mutedtext leading-relaxed mb-8">
            Your Kundli is a snapshot of the sky at the moment of your birth. Veda AI interprets
            this celestial map to reveal the energies, strengths and rhythms that guide your
            journey through life.
          </p>
          <div className="space-y-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex gap-4 rounded-xl border border-gold/15 bg-white/5 p-4 hover:border-gold/40 transition-colors">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple/20 border border-purple/30">
                  <h.icon className="h-5 w-5 text-lightgold" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">{h.title}</h3>
                  <p className="text-sm text-mutedtext leading-relaxed mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-vedabg bg-gradient-to-r from-lightgold via-gold to-lightgold shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Sparkles className="h-5 w-5" />
            Explore Your Kundli
          </button>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <KundliChart />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-gold/30 bg-[#0b0817]/95 p-6 shadow-2xl shadow-purple/30 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h2 className="font-display text-lg font-semibold text-white">Explore Your Kundli</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 text-mutedtext hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-lightgold mb-1.5">Date of Birth</label>
                <input type="date" className="w-full rounded-xl border border-gold/25 bg-white/5 px-4 py-2.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-lightgold mb-1.5">Time of Birth</label>
                <input type="time" className="w-full rounded-xl border border-gold/25 bg-white/5 px-4 py-2.5 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-lightgold mb-1.5">Place of Birth</label>
                <input type="text" placeholder="City, Country" className="w-full rounded-xl border border-gold/25 bg-white/5 px-4 py-2.5 text-white placeholder:text-mutedtext/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all" />
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-2xl px-6 py-3 font-semibold text-vedabg bg-gradient-to-r from-lightgold via-gold to-lightgold shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300"
            >
              Generate My Kundli
            </button>
            <p className="mt-3 text-center text-xs text-mutedtext">This is a demo. Full Kundli generation is coming soon.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default KundliSection;
