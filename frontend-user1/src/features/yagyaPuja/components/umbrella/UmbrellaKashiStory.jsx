import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import pujaKashiImg from "../../../../assets/images/puja/puja-kashi.webp.png";

/**
 * SECTION 10: PERFORMED IN THE SACRED LAND OF KASHI
 * Split editorial storytelling honoring Varanasi's living Vedic heritage and structured facilitation.
 */
const UmbrellaKashiStory = () => {
  const highlights = [
    "Consecrated ceremonies along sanctified Ganga ghats and ancient shrines",
    "Learned Vedic Purohits trained in Shukla Yajurvedic oral traditions",
    "Authentic gotra recording and high-definition video updates for remote devotees",
  ];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">

          {/* Left Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[22px] border border-[#ead8b8] shadow-[0_8px_30px_rgba(60,40,15,0.08)]">
              <img
                src={pujaKashiImg}
                alt="Sacred river banks of Kashi during evening ritual"
                className="h-[340px] sm:h-[420px] lg:h-[460px] w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#faf4e8]">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5ce6f]">
                  ANCIENT DHAM
                </span>
                <h4 className="mt-1 font-serif text-[20px] font-bold">
                  Avimukta Kshetra Varanasi
                </h4>
                <p className="mt-1 text-[12.5px] text-[#eedcc5]/90">
                  Continuous Vedic acoustic resonance preserved on the banks of River Ganga.
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#8e4f0d]">
                SACRED GEOGRAPHY
              </span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Performed in the <span className="text-[#c77722]">Sacred Land of Kashi</span>
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-[#5c4e3f] sm:text-[16px]">
              Varanasi is the timeless heart of Sanatana Dharma, where sacred acoustic vibrations have continued unbroken for thousands of years. Veda Structure brings this heritage within reachable reach of every devotee worldwide.
            </p>

            <p className="mt-3 text-[14px] leading-relaxed text-[#685c4f]">
              We facilitate transparent, organized ritual execution by designated Kashi-based scholars versed in Shastric discipline, ensuring pure samagri, precise acoustic chanting, and dedicated gotra sankalpa.
            </p>

            {/* Bullet Highlights */}
            <div className="mt-6 space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 text-[#b36c1e] shrink-0" />
                  <span className="text-[13.5px] text-[#473a2e] font-medium leading-normal">
                    {h}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 pt-4">
              <Link
                to="/yagya-puja/puja"
                className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.4)]"
              >
                <span>Explore Puja in Kashi</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UmbrellaKashiStory;
