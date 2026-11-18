import { Briefcase, Heart, HeartHandshake, Wallet, GraduationCap, HeartPulse } from 'lucide-react';
import { categories } from '../data/prompts';
import SectionHeading from './SectionHeading';

const iconMap = {
  career: Briefcase,
  love: Heart,
  marriage: HeartHandshake,
  finance: Wallet,
  education: GraduationCap,
  health: HeartPulse,
};

const AstrologyCategories = ({ onSelect }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading
        title="Explore What the Stars Say"
        subtitle="Choose a topic and discover personalized Vedic astrology insights."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.question)}
              className="group relative text-left rounded-2xl border border-gold/15 bg-white/5 backdrop-blur-sm p-6 hover:border-gold/50 hover:bg-white/[0.08] hover:shadow-[0_0_30px_-8px_rgba(113,56,168,0.6)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
                  <Icon className="h-5 w-5 text-lightgold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{cat.title}</h3>
              </div>
              <p className="text-sm text-mutedtext leading-relaxed line-clamp-2">{cat.question}</p>
              <span className="mt-3 inline-block text-xs text-gold/70 group-hover:text-gold transition-colors">
                Ask about this →
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AstrologyCategories;
