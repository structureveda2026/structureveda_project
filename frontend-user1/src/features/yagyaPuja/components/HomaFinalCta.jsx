import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomaFinalCta({ onExploreCategories }) {
  return (
    <section className="py-20 bg-[#241910] text-white relative overflow-hidden" id="final-cta">
      {/* Subtle warm background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B7791F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C77722]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#352517] border border-[#554030] text-xs uppercase tracking-widest text-[#E89B4F] mb-6">
          <Flame className="w-3.5 h-3.5 text-[#E89B4F]" />
          <span>BEGIN WITH AGNI &amp; SANKALPA</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-[#FAF4E6] mb-5 max-w-3xl mx-auto leading-tight">
          Explore Sacred Vedic Homa Traditions
        </h2>

        <p className="text-base sm:text-lg text-[#D1C5B6] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Select your tradition, configure your ceremony parameters, and arrange your fire offering with initiated Vedic Acharyas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/yagya-puja/homa/all"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#B7791F] to-[#C77722] hover:brightness-105 text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all shadow-lg inline-flex items-center justify-center gap-2"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={onExploreCategories}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#302115] hover:bg-[#3E2B1C] text-[#EEDAC3] hover:text-white border border-[#574332] text-xs uppercase tracking-widest font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Browse Traditions</span>
          </button>
        </div>

        <div className="mt-14 pt-8 border-t border-[#3A2C22] flex flex-wrap justify-center items-center gap-8 text-xs text-[#A39382]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]"></span>
            <span>Shastric Agnihotra Discipline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]"></span>
            <span>Service-Specific Havan Counts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]"></span>
            <span>Kashi &amp; Remote Live Sankalpa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
