import { MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";

const KashiSection = () => {
  return (
    <section className="relative overflow-hidden border-t border-[#ebdcc4] bg-[#2b241d] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute -right-20 top-0 h-[450px] w-[450px] rounded-full bg-[#eab12c]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[380px] w-[380px] rounded-full bg-[#c77722]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/40 bg-[#3a3026]/90 px-3.5 py-1.5 backdrop-blur-xs">
              <Sparkles size={13} className="text-[#eab12c]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#eab12c]">
                The Eternal Spiritual Epicenter
              </span>
            </div>

            <h2 className="mt-4 font-serif text-[32px] font-medium leading-tight text-[#fbf4e8] sm:text-[42px] lg:text-[46px]">
              Sacred Rituals in <span className="text-[#eab12c]">Kashi (Varanasi)</span>
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-[#d5c7b5] sm:text-[16px]">
              Kashi holds an unbroken lineage of spiritual seekers, scholars, and daily Vedic offerings on the sacred banks of Ma Ganga. Selected Puja, Yagya, and Abhishek services can be conducted directly in Kashi by traditionally trained local pandits, subject to seasonal scheduling and operational availability.
            </p>

            {/* Feature Badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#d4872b]/30 bg-[#3a3026]/60 px-3.5 py-2 text-[12.5px] text-[#fbf4e8]">
                <MapPin size={14} className="text-[#eab12c]" />
                <span>Holy Ganga Ghats & Vishwanath Kshetra</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-[#d4872b]/30 bg-[#3a3026]/60 px-3.5 py-2 text-[12.5px] text-[#fbf4e8]">
                <ShieldCheck size={14} className="text-[#eab12c]" />
                <span>Authentic Kashi Purohits</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                to="/yagya-puja/kashi"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_8px_28px_rgba(234,177,44,0.45)]"
              >
                <span>Explore Puja in Kashi</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[26px] border-2 border-[#d4872b]/40 shadow-2xl">
              <img
                src={pujaKashiImg}
                alt="Ganga Ghats in Kashi Varanasi"
                className="h-[340px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[400px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-center sm:text-left">
                <p className="font-serif text-[18px] font-semibold text-white">
                  Ganga Aarti & Tirtha Seva
                </p>
                <p className="text-[12px] text-[#f4e8d1]/80">
                  Direct gotra sankalpa invocation on holy river ghats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KashiSection;
