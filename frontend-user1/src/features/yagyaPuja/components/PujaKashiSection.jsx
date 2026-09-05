import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import kashiImg from "../../../assets/images/puja-kashi.jpg";

const PujaKashiSection = ({ onFilterRemote }) => {
  const handleBookFromAnywhere = () => {
    if (onFilterRemote) {
      onFilterRemote();
    }
    const el = document.getElementById("puja-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Editorial Container */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#ead8b8] bg-[#fbf5e8] p-8 shadow-xs sm:p-10 lg:p-12">
          {/* Subtle Golden Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#eab12c]/10 blur-[100px]" />

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Context Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffdfa] px-3.5 py-1.5 shadow-2xs">
                <MapPin size={13} className="text-[#c77722]" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  KASHI • VARANASI
                </span>
              </div>

              <h2 className="mt-4 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[38px] lg:text-[42px]">
                Perform Your Puja in Kashi
              </h2>

              <p className="mt-4 text-[14.5px] leading-relaxed text-[#5e5143] sm:text-[15.5px]">
                For generations, devotees have travelled to Kashi with a Sankalpa for Darshan, Puja and spiritual practice.
              </p>

              <p className="mt-2 text-[14.5px] leading-relaxed text-[#5e5143] sm:text-[15.5px]">
                Veda Structure helps coordinate selected traditional Puja services in Kashi for visitors as well as devotees who cannot travel to Varanasi.
              </p>

              {/* Two Choices */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {/* Choice 1: Visiting */}
                <div className="flex flex-col justify-between rounded-[20px] border border-[#e5d2b3] bg-[#fffdfa] p-5 shadow-2xs">
                  <div>
                    <h3 className="font-serif text-[17px] font-bold text-[#2b241d]">
                      I AM VISITING KASHI
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                      Plan your Puja around your Kashi visit.
                    </p>
                  </div>
                  <div className="mt-5">
                    <Link
                      to="/yagya-puja/kashi"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] px-5 py-2.5 text-[12.5px] font-bold text-[#1c1308] shadow-xs transition hover:bg-[#dda018]"
                    >
                      <span>Plan My Kashi Puja</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Choice 2: Cannot Visit */}
                <div className="flex flex-col justify-between rounded-[20px] border border-[#e5d2b3] bg-[#fffdfa] p-5 shadow-2xs">
                  <div>
                    <h3 className="font-serif text-[17px] font-bold text-[#2b241d]">
                      I CANNOT VISIT KASHI
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                      Explore selected Puja services that may be arranged remotely.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleBookFromAnywhere}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-white px-5 py-2.5 text-[12.5px] font-bold text-[#2b241d] shadow-2xs transition hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] cursor-pointer"
                    >
                      <span>Book From Anywhere</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[24px] border border-[#e2cca4] shadow-md">
                <img
                  src={kashiImg}
                  alt="Holy Ghats of Kashi Varanasi"
                  className="h-[340px] w-full object-cover sm:h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f160e]/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-[#f5ebd9]">
                  <p className="font-serif text-[18px] font-bold">Kashi Mokshapuri</p>
                  <p className="text-[12px] opacity-90">Sacred Ganga Ghats & Venerable Mandir Kshetras</p>
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
