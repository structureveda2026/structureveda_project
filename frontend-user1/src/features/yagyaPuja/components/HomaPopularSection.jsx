import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HOMA_SERVICES } from '../data/homaCatalogueData';
import HomaServiceCard from './HomaServiceCard';

export default function HomaPopularSection({ onSelectHoma }) {
  // Filter for featured and active services
  const popularHomas = HOMA_SERVICES.filter(
    (homa) => homa.featured === true && homa.active === true
  ).slice(0, 6);

  return (
    <section className="py-20 bg-[#fffdf9] border-b border-[#e8dfd1]" id="popular-homa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3e3] border border-[#ebdcc4] text-xs font-semibold uppercase tracking-wider text-[#b36c1e] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMONLY SOUGHT SACRED AGNI RITUALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b]">
              Popular Homa & Havan
            </h2>
            <p className="text-sm sm:text-base text-[#685847] mt-2">
              Time-tested Vedic fire ceremonies requested frequently by devotees for health, planetary peace, family harmony, and obstacle clearance.
            </p>
          </div>
          <div>
            <a
              href="#explore"
              className="inline-flex items-center gap-2 text-sm font-serif font-semibold text-[#b36c1e] hover:text-[#8a4e0c] transition-colors pb-1 border-b border-[#b36c1e]"
            >
              <span>View All Catalogue Offerings</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularHomas.map((homa) => (
            <HomaServiceCard
              key={homa.id}
              homa={homa}
              onConfigure={onSelectHoma}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
