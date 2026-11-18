import { useState } from 'react';
import { Compass, ShieldCheck, MessageCircle, Check } from 'lucide-react';
import { pathways } from '../data/prompts';
import SectionHeading from './SectionHeading';

const iconMap = {
  free: Compass,
  verify: ShieldCheck,
  talk: MessageCircle,
};

const PlatformPathways = () => {
  const [notice, setNotice] = useState('');

  const handleCta = (tier) => {
    setNotice(`${tier} pathway is coming soon. Stay tuned!`);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading title="Choose Your Journey with Veda" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {pathways.map((p) => {
          const Icon = iconMap[p.id];
          const featured = p.id === 'verify';
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                featured
                  ? 'border-gold/50 bg-gradient-to-b from-purple/15 to-white/5 shadow-[0_0_40px_-12px_rgba(113,56,168,0.7)]'
                  : 'border-gold/15 bg-white/5 hover:border-gold/40 hover:bg-white/[0.08]'
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-lightgold to-gold px-3 py-1 text-xs font-semibold text-vedabg">
                  Recommended
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 mb-4">
                <Icon className="h-6 w-6 text-lightgold" />
              </div>
              <div className="mb-1 text-xs font-semibold tracking-widest text-gold/80">{p.tier}</div>
              <h3 className="font-display text-xl font-semibold text-white mb-2">{p.name}</h3>
              <p className="text-sm text-mutedtext leading-relaxed mb-5">{p.description}</p>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCta(p.tier)}
                className={`w-full rounded-2xl px-5 py-3 font-semibold transition-all duration-300 ${
                  featured
                    ? 'text-vedabg bg-gradient-to-r from-lightgold via-gold to-lightgold shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.02]'
                    : 'text-lightgold border border-gold/40 bg-gold/5 hover:bg-gold/15 hover:border-gold'
                }`}
              >
                {p.id === 'free' ? 'Start Free' : p.id === 'verify' ? 'Get Verified' : 'Talk to Astrologers'}
              </button>
            </div>
          );
        })}
      </div>
      {notice && (
        <div className="mt-6 text-center text-sm text-mutedtext animate-fadeIn">{notice}</div>
      )}
    </section>
  );
};

export default PlatformPathways;
