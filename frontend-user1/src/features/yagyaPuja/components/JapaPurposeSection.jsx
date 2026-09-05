import { Sparkles, Heart, Compass, Shield, Coins, Flame, ArrowRight } from "lucide-react";
import { JAPA_PURPOSE_CATEGORIES } from "../data/japaCatalogueData";

const iconMap = {
  Sparkles: Sparkles,
  Heart: Heart,
  Compass: Compass,
  Shield: Shield,
  Coins: Coins,
  Flame: Flame,
};

const JapaPurposeSection = ({ selectedPurpose, onSelectPurpose }) => {
  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            INTENTION & SANKALPA
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Begin Your Japa With a Defined Sankalpa
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            In traditional Vedic ritual, every Japa begins by consecrating a clear Sankalpa that aligns the chanting with your spiritual intent.
          </p>
        </div>

        {/* 6 Structured Purpose Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {JAPA_PURPOSE_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.iconName] || Sparkles;
            const isSelected = selectedPurpose === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectPurpose && onSelectPurpose(isSelected ? "All" : cat.id)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-[22px] border p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffdf9] shadow-[0_10px_30px_rgba(199,119,34,0.15)] ring-1 ring-[#c77722]"
                    : "border-[#e6d3ba] bg-[#fffaf1] shadow-[0_4px_16px_rgba(80,50,20,0.03)] hover:-translate-y-1 hover:border-[#c77722] hover:bg-[#fffdfa] hover:shadow-[0_8px_24px_rgba(199,119,34,0.1)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                        isSelected
                          ? "bg-[#c77722] text-white"
                          : "bg-[#f4e6d1] text-[#9c5a17] group-hover:bg-[#c77722] group-hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#a8641b]">
                      SANKALPA
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d] group-hover:text-[#a8641b]">
                    {cat.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-[#a8641b]">
                  <span>Filter Services</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JapaPurposeSection;
