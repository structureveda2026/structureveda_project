import { useState } from "react";
import { MapPin, ArrowRight, Sparkles, User, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import pujaKashiImg from "../../../assets/images/puja/puja-kashi.webp.png";

const PujaKashiSection = ({ onFilterRemote }) => {
  const [activeMode, setActiveMode] = useState("visiting");

  const handleBookFromAnywhere = () => {
    if (onFilterRemote) {
      onFilterRemote();
    }
    const el = document.getElementById("puja-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-18 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* ── Left Column: Editorial Context & Segmented Choices ── */}
          <div className="lg:col-span-7">
            {/* Location Eyebrow */}
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <MapPin size={13} className="text-[#c77722]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
                Kashi • Varanasi
              </span>
            </div>

            <h2 className="mt-2.5 font-serif text-[28px] font-semibold leading-[1.15] sm:text-[36px] lg:text-[40px]">
              <span className="text-[#2b241d]">
                Perform Your
              </span>
              <span className="text-[#c77722]">
                {" "}Puja in Kashi
              </span>
            </h2>



            {/* Two Narrative Paragraphs */}
            <div className="mt-5 space-y-3 max-w-[620px]">
              <p className="text-[15px] leading-[1.75] text-[#5e5143] sm:text-[16px]">
                For millennia, devotees have journeyed to Kashi with a sacred Sankalpa for Darshan, ritual purification, and Vedic ceremonies along the eternal Ganga.
              </p>
              <p className="text-[14px] leading-[1.75] text-[#5e5143] sm:text-[14.5px]">
                Veda Structure coordinates selected traditional Puja services in Kashi for visitors as well as devotees who cannot travel to Varanasi in person.
              </p>
            </div>

            {/* ── Single Unified Segmented Choice Selector ── */}
            <div className="mt-8 inline-flex w-full max-w-[580px] rounded-[14px] border border-[#dcc5a5] bg-[#f7eee1]/70 p-1">
              <button
                type="button"
                onClick={() => setActiveMode("visiting")}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 px-3 text-[13px] font-semibold transition-all duration-250 cursor-pointer ${activeMode === "visiting"
                  ? "bg-[#eab12c] text-[#1c1308] shadow-xs font-bold"
                  : "text-[#685c4f] hover:text-[#2b241d] hover:bg-[#ebdcc4]/40"
                  }`}
              >
                <User size={15} />
                <span>I Am Visiting Kashi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("remote")}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-[10px] py-2.5 px-3 text-[13px] font-semibold transition-all duration-250 cursor-pointer ${activeMode === "remote"
                  ? "bg-[#eab12c] text-[#1c1308] shadow-xs font-bold"
                  : "text-[#685c4f] hover:text-[#2b241d] hover:bg-[#ebdcc4]/40"
                  }`}
              >
                <Globe size={15} />
                <span>I Cannot Visit Kashi</span>
              </button>
            </div>

            {/* ── Choice Descriptions & CTAs (Clean 2-Column Editorial Blocks) ── */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 max-w-[580px]">
              {/* In-Person Presence */}
              <div className={`transition-opacity duration-300 ${activeMode === "visiting" ? "opacity-100" : "opacity-75 sm:opacity-90"}`}>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  In-Person Presence
                </span>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#685c4f]">
                  Plan your private ceremony around your Kashi travel dates and family schedule.
                </p>
                <div className="mt-4">
                  <Link
                    to="/yagya-puja/kashi"
                    className={`group inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-5 h-11 text-[13px] font-bold transition-all duration-300 ${activeMode === "visiting"
                      ? "bg-[#eab12c] text-[#1c1308] shadow-xs hover:bg-[#dda018]"
                      : "border border-[#d6b8a0] bg-transparent text-[#2b241d] hover:border-[#c77722] hover:bg-[#fcf5e9] hover:text-[#c77722]"
                      }`}
                  >
                    <span>Plan My Kashi Puja</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Remote Devotion */}
              <div className={`transition-opacity duration-300 ${activeMode === "remote" ? "opacity-100" : "opacity-75 sm:opacity-90"}`}>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  Remote Devotion
                </span>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#685c4f]">
                  Explore selected Puja services performed on holy Ganga ghats on your behalf.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleBookFromAnywhere}
                    className={`group inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-5 h-11 text-[13px] font-bold transition-all duration-300 cursor-pointer ${activeMode === "remote"
                      ? "bg-[#eab12c] text-[#1c1308] shadow-xs hover:bg-[#dda018]"
                      : "border border-[#d6b8a0] bg-transparent text-[#2b241d] hover:border-[#c77722] hover:bg-[#fcf5e9] hover:text-[#c77722]"
                      }`}
                  >
                    <span>Book From Anywhere</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Editorial Visual Anchor ── */}
          <div className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-[22px] border border-[#e2d2ba] bg-[#1c1209] shadow-[0_8px_24px_rgba(50,35,20,0.08)] transition-all duration-300 hover:border-[#c77722]">
              <div className="relative h-[400px] w-full overflow-hidden sm:h-[460px] lg:h-[490px]">
                <img
                  src={pujaKashiImg}
                  alt="Sacred Ganga Aarti and Ghats of Kashi Varanasi"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Subtle dark warm bottom gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/90 via-[#140c06]/25 via-40% to-transparent transition-opacity duration-300 group-hover:from-[#140c06]/95" />

                {/* Direct Editorial Caption Over Image */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-[#f5ebd9]">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#eab12c]/35 bg-[#160d06]/60 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f] backdrop-blur-xs">
                    <Sparkles size={10} className="text-[#eab12c]" />
                    <span>Kshetra Mahatmya</span>
                  </div>
                  <h3 className="font-serif text-[19px] font-bold text-[#faf4e8] sm:text-[20px] leading-snug">
                    Kashi Mokshapuri
                  </h3>
                  <p className="mt-1 text-[12.5px] text-[#eedcc5]/90">
                    Venerable Ganga Ghats &amp; Sacred Mandir Kshetras
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaKashiSection;
