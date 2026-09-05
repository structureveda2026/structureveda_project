import {
  HeartHandshake,
  Users,
  Sparkles,
  Flame,
  Calendar,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PURPOSE_CATEGORIES } from "../data/yagyaPujaData";

const ICON_MAP = {
  HeartHandshake: HeartHandshake,
  Users: Users,
  Sparkles: Sparkles,
  Flame: Flame,
  Calendar: Calendar,
  Compass: Compass,
};

const ExploreByPurpose = () => {
  return (
    <section className="border-t border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            Discovery By Intention
          </p>

          <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            Explore by Purpose
          </h2>

          <p className="mx-auto mt-3 max-w-[660px] text-[15px] leading-relaxed text-[#685c4f]">
            Find the traditional ritual best suited for your family's current life stage, spiritual dedication, or auspicious occasion.
          </p>
        </div>

        {/* Purpose Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PURPOSE_CATEGORIES.map((purpose) => {
            const Icon = ICON_MAP[purpose.iconName] || Sparkles;
            return (
              <div
                key={purpose.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_28px_rgba(199,119,34,0.09)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                      <Icon size={20} />
                    </div>
                    <span className="rounded-full bg-[#f4e8d1]/60 px-3 py-1 text-[11px] font-semibold text-[#8a6b32]">
                      {purpose.recommendedType}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[20px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                    {purpose.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {purpose.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-[13px] font-bold text-[#b36c1e] transition-colors group-hover:text-[#2b241d]">
                  <Link to="/yagya-puja/puja" className="inline-flex items-center gap-1">
                    <span>Browse Matching Rituals</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreByPurpose;
