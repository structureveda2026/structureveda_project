import { Sparkles, Orbit, TrendingUp, BookOpen } from 'lucide-react';
import { features } from '../data/prompts';
import SectionHeading from './SectionHeading';

const iconMap = {
  predictions: Sparkles,
  kundli: Orbit,
  transits: TrendingUp,
  remedies: BookOpen,
};

const WhatVedaOffers = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading title="Ancient Wisdom, Intelligent Insights" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((f) => {
          const Icon = iconMap[f.id];
          return (
            <div
              key={f.id}
              className="group rounded-2xl border border-gold/15 bg-white/5 backdrop-blur-sm p-6 hover:border-gold/40 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple/30 to-gold/20 border border-gold/20 group-hover:from-purple/40 transition-all">
                <Icon className="h-6 w-6 text-lightgold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-mutedtext leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatVedaOffers;
