import { MapPin, Compass, ArrowRight, ShieldCheck, Waves } from "lucide-react";

const PathKashiSection = ({ onSelectMode }) => {
  return (
    <section className="relative overflow-hidden border-b border-[#ebdcc4] bg-gradient-to-b from-[#fbf4e6] to-[#f7eedc] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8b584] bg-[#fbf3e4] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e5a1e]">
            <MapPin size={12} className="text-[#c77722]" />
            <span>KASHI • VARANASI</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Sacred Recitation in Kashi
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Devotees visiting Kashi may choose selected Path and Recitation services as part of their spiritual visit. Veda Structure can coordinate applicable Pandits, scheduling and ritual arrangements according to the selected service.
          </p>
        </div>

        {/* 2 Modes Grid: Visiting Kashi vs Cannot Visit Kashi */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Card 1: Visiting Kashi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#d6b78d] bg-[#fffdfa] p-7 shadow-[0_8px_25px_rgba(80,50,20,0.06)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_12px_32px_rgba(199,119,34,0.12)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f4e4cd] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                  IN-PERSON RECENSION
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faedd9] text-[#b36c1e]">
                  <Waves size={18} />
                </div>
              </div>

              <h3 className="mt-5 font-serif text-[24px] font-bold text-[#2b241d]">
                Visiting Kashi
              </h3>

              <p className="mt-2.5 text-[14px] leading-relaxed text-[#685c4f]">
                Plan Your Path Around Your Kashi Stay. Attend the opening Sankalpa in person, hear initiated Pandits chanting the Granth along sacred venues, and conclude with the Purnahuti ceremony.
              </p>

              <ul className="mt-5 space-y-2 text-[12.5px] text-[#735f4b]">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#a8641b]" />
                  <span>Physical presence during Pratham Sankalpa and closing Aarti</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#a8641b]" />
                  <span>Coordinated at traditional Kashi ritual mandapams</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#ebdcc4]">
              <button
                type="button"
                onClick={() => onSelectMode && onSelectMode("kashi")}
                className="inline-flex items-center gap-2 rounded-full bg-[#b56e20] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#8f5211] cursor-pointer"
              >
                <span>Plan My Kashi Path</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Cannot Visit Kashi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#d6b78d] bg-[#fffdfa] p-7 shadow-[0_8px_25px_rgba(80,50,20,0.06)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_12px_32px_rgba(199,119,34,0.12)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f4e4cd] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                  SERVICE-SPECIFIC REMOTE RECITATION
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faedd9] text-[#b36c1e]">
                  <Compass size={18} />
                </div>
              </div>

              <h3 className="mt-5 font-serif text-[24px] font-bold text-[#2b241d]">
                Cannot Visit Kashi
              </h3>

              <p className="mt-2.5 text-[14px] leading-relaxed text-[#685c4f]">
                Explore Available Remote Recitations. Your Sankalpa is pronounced with your Gotra and Name by proxy, with verified daily chapter completions and updates.
              </p>

              <ul className="mt-5 space-y-2 text-[12.5px] text-[#735f4b]">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#a8641b]" />
                  <span>Formal Gotra & Name Sankalpa pronounced in Kashi</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#a8641b]" />
                  <span>Service-specific daily chapter updates & documentation</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#ebdcc4]">
              <button
                type="button"
                onClick={() => onSelectMode && onSelectMode("remote")}
                className="inline-flex items-center gap-2 rounded-full border border-[#b56e20] bg-white px-6 py-3 text-[13px] font-bold text-[#b56e20] transition hover:bg-[#b56e20] hover:text-white cursor-pointer"
              >
                <span>Explore Remote Path</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Shastric Rule Clarification */}
        <div className="mx-auto mt-8 max-w-[800px] text-center text-[12.5px] text-[#7a6a57]">
          <p>
            * Remote availability is configured per individual Path service. Veda Structure maintains authentic ritual coordination without making speculative claims of exclusive temple partnerships or guaranteed supernatural outcomes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathKashiSection;
