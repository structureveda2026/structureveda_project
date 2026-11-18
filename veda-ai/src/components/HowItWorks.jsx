import { Calendar, Orbit, Sparkles } from 'lucide-react';
import { steps } from '../data/prompts';
import SectionHeading from './SectionHeading';

const iconMap = [Calendar, Orbit, Sparkles];

const HowItWorks = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <SectionHeading title="Your Journey to Astrological Clarity" />
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {/* Connecting line on desktop */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        {steps.map((step, i) => {
          const Icon = iconMap[i];
          return (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-md animate-glowPulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/50 bg-[#0b0817]">
                  <Icon className="h-8 w-8 text-lightgold" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lightgold to-gold text-xs font-bold text-vedabg shadow-lg shadow-gold/30">
                  {step.id}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-mutedtext leading-relaxed max-w-xs">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
