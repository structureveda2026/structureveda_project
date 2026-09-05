import React from 'react';
import { Flame, ArrowRight, Sparkles } from 'lucide-react';

export default function HomaFinalCta({ onRequestCustom }) {
  return (
    <section className="py-24 bg-[#1f1711] text-white relative overflow-hidden" id="final-cta">
      {/* Subtle warm background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c77722]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8a4e0c]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#35271d] border border-[#554030] text-xs uppercase tracking-widest text-[#e89b4f] mb-6">
          <Flame className="w-3.5 h-3.5 text-[#e89b4f]" />
          <span>BEGIN WITH AGNI & SANKALPA</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-[#faf4e6] mb-6 max-w-3xl mx-auto leading-tight">
          Configure Your Homa
        </h2>

        <p className="text-base sm:text-lg text-[#d1c5b6] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Choose your Homa, select the available Havan configuration and begin your ritual arrangement with Veda Structure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#explore"
            className="w-full sm:w-auto px-8 py-4 bg-[#c77722] hover:bg-[#b36c1e] text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
          >
            <span>Explore Homa</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={onRequestCustom}
            className="w-full sm:w-auto px-8 py-4 bg-[#2f2219] hover:bg-[#3d2c20] text-[#eedac3] hover:text-white border border-[#574332] text-xs uppercase tracking-widest font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#c77722]" />
            <span>Request Custom Homa</span>
          </button>
        </div>

        <div className="mt-14 pt-8 border-t border-[#3a2c22] flex flex-wrap justify-center items-center gap-8 text-xs text-[#a39382]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c77722]"></span>
            <span>Shastric Agnihotra Discipline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c77722]"></span>
            <span>Service-Specific Havan Counts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c77722]"></span>
            <span>Kashi & Remote Availability</span>
          </div>
        </div>
      </div>
    </section>
  );
}
