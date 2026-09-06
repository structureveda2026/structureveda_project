import {
  Users,
  Package,
  Scroll,
  Calendar,
  Gift,
  Video,
  Info,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import pujaPanditImg from "../../../assets/images/puja/puja-pandit.webp.png";
import pujaSamagriImg from "../../../assets/images/puja/puja-samagri.webp.png";
import pujaSankalpaImg from "../../../assets/images/puja/puja-sankalpa.webp.png";
import pujaRitualSetupImg from "../../../assets/images/puja/puja-ritual-setup.webp.png";
import pujaPrasadImg from "../../../assets/images/puja/puja-prasad.webp.png";
import pujaDevotionalAltarImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";

const inclusions = [
  {
    num: "01",
    title: "Pandit Coordination",
    description: "Required Vedic Acharyas and Ritviks coordinated according to the selected Puja vidhi.",
    icon: Users,
    image: pujaPanditImg,
    alt: "Vedic Pandit and Acharyas coordinating Puja vidhi",
  },
  {
    num: "02",
    title: "Puja Samagri",
    description: "Pure Shastric ritual offerings sourced per scripture according to the specific service.",
    icon: Package,
    image: pujaSamagriImg,
    alt: "Pure Shastric Puja Samagri and sacred offerings",
  },
  {
    num: "03",
    title: "Sankalpa Management",
    description: "Structured recording of your name, family Gotra, Nakshatra, and dedicated devotional intentions.",
    icon: Scroll,
    image: pujaSankalpaImg,
    alt: "Sankalpa declaration and recording with Gotra and intentions",
  },
  {
    num: "04",
    title: "Ritual Schedule",
    description: "Auspicious Muhurta and date scheduling according to operational priest availability.",
    icon: Calendar,
    image: pujaRitualSetupImg,
    alt: "Auspicious Muhurta and Vedic ritual preparation setup",
  },
  {
    num: "05",
    title: "Consecrated Prasad",
    description: "Where included or chosen, blessed vibhuti, kumkum, and dry sweets dispatched with sanctity.",
    icon: Gift,
    image: pujaPrasadImg,
    alt: "Sanctified Prasad offerings and blessed holy thread",
  },
  {
    num: "06",
    title: "Completion Update",
    description: "Applicable ritual photographs, video clips, or completion confirmation post-ceremony.",
    icon: Video,
    image: pujaDevotionalAltarImg,
    alt: "Concluding Puja Aarti, ceremonial lamps and ritual completion",
  },
];

const samagriRows = [
  { label: "Pure Desi Cow Ghee (Ghrita), Samidha, Gangajal", status: "Foundational", statusColor: "text-[#2e7d32]" },
  { label: "Prescribed Herbs, Roli, Akshat, Flowers & Naivedyam", status: "Included",     statusColor: "text-[#2e7d32]" },
  { label: "Special Offerings (Lotus, Bilva leaves, Yantra)",       status: "Service Specific", statusColor: "text-[#b36c1e]" },
];

const prasadRows = [
  { label: "Sanctified Bhasma, Kumkum & Blessed Thread",          status: "Included",      statusColor: "text-[#2e7d32]" },
  { label: "Safe Doorstep Packaging (Dry Sweets & Offerings)",     status: "Where Selected", statusColor: "text-[#b36c1e]" },
  { label: "Sankalpa Recitation Video / Photo Confirmation",        status: "Provided",      statusColor: "text-[#2e7d32]" },
];

const PujaInclusionsSection = () => {
  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">

        {/* ── Section Header ── */}
        <div className="mb-12 text-center lg:mb-14">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Transparent Arrangements
            </span>
          </div>

          <h2 className="mt-5 font-serif leading-[1.15]">
            <span className="block text-[24px] font-semibold text-[#2b241d] sm:text-[30px] lg:text-[36px]">
              What Your Puja Arrangement May
            </span>
            <span className="block text-[32px] font-bold text-[#c77722] sm:text-[40px] lg:text-[44px]">
              Include
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-10 rounded-full bg-[#c77722]/50 sm:w-14"
              />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[580px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            Veda Structure coordinates all essential elements to ensure rituals are conducted with traditional integrity.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* ── Six Arrangement Facets (Image-First Editorial Tiles) ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#ebdcc4]/70 bg-[#1c130b] p-4.5 shadow-[0_4px_16px_rgba(40,25,10,0.08)] transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_28px_rgba(199,119,34,0.16)] sm:min-h-[260px] sm:p-5 sm:rounded-[20px]"
              >
                {/* Background Image (Fills Entire Card) */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Directional Dark Warm Bottom Gradient (Text readability without separate boxes) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/95 via-[#140c06]/45 via-45% to-transparent transition-opacity duration-300 group-hover:from-[#140c06]" />

                {/* Top Row: Number + Icon + Arrow */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Compact Editorial Number Badge */}
                    <span className="flex h-7 items-center justify-center rounded-md border border-[#ebdcc4]/25 bg-[#140c06]/40 px-2 font-sans text-[11px] font-semibold tracking-wider text-[#e8d5be] backdrop-blur-xs transition-colors duration-300 group-hover:border-[#eab12c]/50 group-hover:text-[#eab12c]">
                      {item.num}
                    </span>

                    {/* Compact Icon Container */}
                    <div className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-lg border border-[#ebdcc4]/30 bg-[#fffdfa]/80 text-[#b36c1e] backdrop-blur-xs transition-all duration-300 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                      <Icon size={16} />
                    </div>
                  </div>

                  {/* Compact Arrow Indicator */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#140c06]/35 text-[#e6d7c3] backdrop-blur-xs transition-all duration-300 group-hover:border-[#eab12c]/60 group-hover:text-[#eab12c]">
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>

                {/* Bottom Direct Content (No white rectangle, no glass card) */}
                <div className="relative z-10 mt-auto pt-8">
                  <h3 className="font-serif text-[16.5px] font-semibold leading-snug text-[#faf3e6] transition-colors duration-300 group-hover:text-[#f5ce6f] sm:text-[17.5px]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-[96%] text-[12.5px] leading-[1.55] text-[#eedcc5]/90 transition-colors duration-300 group-hover:text-[#faf0e1] sm:text-[13px]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Connector divider ── */}
        <div
          aria-hidden="true"
          className="my-12 flex items-center justify-center gap-4"
        >
          <span className="h-px flex-1 bg-[#ebdcc4]" />
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#c5b59f]">Sacred Materials &amp; Completion</span>
          <span className="h-px flex-1 bg-[#ebdcc4]" />
        </div>

        {/* ── Samagri + Prasad Showcase ── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* SAMAGRI */}
          <div className="group overflow-hidden rounded-[18px] border border-[#e0ceaf] bg-[#fffdfa] shadow-[0_3px_14px_rgba(60,40,15,0.06)] transition-all duration-300 hover:border-[#c77722]/60 hover:shadow-[0_8px_24px_rgba(199,119,34,0.10)]">
            {/* Image */}
            <div className="relative h-[220px] w-full overflow-hidden sm:h-[240px]">
              <img
                src={pujaSamagriImg}
                alt="Pure Vedic Puja Samagri including herbs, cow ghee, samidha and sacred offerings"
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120b]/65 via-[#1a120b]/10 to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-4 left-5">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#eab12c]/30 bg-[#1c130b]/75 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#f5ce6f] backdrop-blur-sm">
                  Sacred Sourcing
                </span>
                <h4 className="mt-1.5 font-serif text-[17px] font-bold text-[#faf0dc]">
                  Prescribed Vedic Samagri
                </h4>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[13px] leading-[1.65] text-[#685c4f]">
                Materials vary according to the selected Puja and deity. Items are verified for Shastric purity:
              </p>
              <div className="mt-4 divide-y divide-[#eddfc8]">
                {samagriRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-[12.5px] font-medium leading-snug text-[#2b241d]">{row.label}</span>
                    <span className={`shrink-0 text-[10.5px] font-bold uppercase tracking-[0.14em] ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRASAD */}
          <div className="group overflow-hidden rounded-[18px] border border-[#e0ceaf] bg-[#fffdfa] shadow-[0_3px_14px_rgba(60,40,15,0.06)] transition-all duration-300 hover:border-[#c77722]/60 hover:shadow-[0_8px_24px_rgba(199,119,34,0.10)]">
            {/* Image */}
            <div className="relative h-[220px] w-full overflow-hidden sm:h-[240px]">
              <img
                src={pujaPrasadImg}
                alt="Consecrated Puja Prasad and blessed sacred offerings after ritual completion"
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120b]/65 via-[#1a120b]/10 to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-4 left-5">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#eab12c]/30 bg-[#1c130b]/75 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#f5ce6f] backdrop-blur-sm">
                  Divine Blessings
                </span>
                <h4 className="mt-1.5 font-serif text-[17px] font-bold text-[#faf0dc]">
                  Prasad &amp; Ritual Completion
                </h4>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[13px] leading-[1.65] text-[#685c4f]">
                Following the Purnahuti and Aarti, ritual coordination concludes with transparency:
              </p>
              <div className="mt-4 divide-y divide-[#eddfc8]">
                {prasadRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-[12.5px] font-medium leading-snug text-[#2b241d]">{row.label}</span>
                    <span className={`shrink-0 text-[10.5px] font-bold uppercase tracking-[0.14em] ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Transparency Notice ── */}
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-[#e8d9bc] bg-[#fbf5e8] px-5 py-5 sm:px-6">
          <Info size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <div>
            <p className="font-serif text-[15px] font-semibold text-[#2b241d]">
              Before You Confirm
            </p>
            <p className="mt-1 text-[13px] leading-[1.65] text-[#756653]">
              Exact inclusions are transparently displayed before you confirm your booking.
              Inclusions vary according to ritual complexity, location (consecrated Kashi shrine or remote Sankalpa), and selected duration.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PujaInclusionsSection;
