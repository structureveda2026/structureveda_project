import { Clock, Info, Check, Sparkles, ArrowRight } from "lucide-react";
import sankalpImg     from "../../../assets/images/puja/puja-sankalpa.webp.png";
import ritualSetupImg from "../../../assets/images/puja/puja-ritual-setup.webp.png";
import altarImg       from "../../../assets/images/puja/puja-devotional-altar.webp.png";

const PujaDurationSection = ({ selectedDuration, onSelectDuration }) => {
  const durations = [
    {
      hours: "2 HOURS",
      filterVal: "2 Hours",
      title: "Essential Vidhi",
      subtitle: "For selected Puja services.",
      description:
        "Prescribed for standard household invocations, daily Gotra Sankalp archana, and focused single-deity Vedic rituals.",
      image: sankalpImg,
      imageAlt: "Devotee taking Sankalpa at the beginning of an Essential Vidhi Puja",
    },
    {
      hours: "3 HOURS",
      filterVal: "3 Hours",
      title: "Detailed Shastric Vidhi",
      subtitle: "For selected detailed ritual arrangements.",
      description:
        "Accommodates comprehensive panchamrit abhishekam, extended Vedic Suktam avartans, and dedicated havan offerings.",
      image: ritualSetupImg,
      imageAlt: "Authentic consecrated Vedic ritual setup with kalash, flowers and lamps for Detailed Vidhi",
    },
    {
      hours: "5 HOURS",
      filterVal: "5 Hours",
      title: "Extended Mahapuja Vidhi",
      subtitle: "For selected extended Puja procedures.",
      description:
        "Designed for intricate Navagraha shanti, multi-priest anushthan, elaborate mandalas, and complete purnahuti vidhi.",
      image: altarImg,
      imageAlt: "Sacred devotional altar arranged for an Extended Mahapuja Vedic ceremony",
    },
  ];

  const handleDurationClick = (item, isSelected) => {
    if (onSelectDuration) {
      onSelectDuration(isSelected ? "All Durations" : item.filterVal);
    }
    const el = document.getElementById("puja-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">

        {/* ── Section Header ── */}
        <div className="mb-12 text-center lg:mb-14">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Ritual Duration &amp; Rigor
            </span>
          </div>

          {/* Two-color heading */}
          <h2 className="mt-5 font-serif leading-[1.15]">
            <span className="block text-[26px] font-semibold text-[#2b241d] sm:text-[32px] lg:text-[38px]">
              Choose Your Puja
            </span>
            <span className="block text-[34px] font-bold text-[#c77722] sm:text-[42px] lg:text-[46px]">
              Duration
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-12 rounded-full bg-[#c77722]/50 sm:w-16"
              />
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-[600px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            Available duration depends strictly upon the selected Puja and its
            prescribed Shastric requirements.
          </p>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* ── Three Duration Cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {durations.map((item) => {
            const isSelected = selectedDuration === item.filterVal;

            return (
              <div
                key={item.hours}
                className={`group flex flex-col overflow-hidden rounded-[18px] border shadow-[0_3px_16px_rgba(60,40,15,0.06)] transition-all duration-300 ${
                  isSelected
                    ? "border-[#c77722] bg-[#fff9ed] shadow-[0_8px_28px_rgba(199,119,34,0.14)]"
                    : "border-[#e8d9bc] bg-[#fffdfa] hover:border-[#c77722] hover:bg-[#fdf8ee] hover:shadow-[0_8px_24px_rgba(199,119,34,0.10)]"
                }`}
              >
                {/* Card Image */}
                <div className="relative h-[140px] w-full overflow-hidden sm:h-[150px]">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Selected indicator ribbon — top right */}
                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#c77722] shadow-md">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">

                  {/* Duration Badge */}
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors duration-250 ${
                      isSelected
                        ? "border-[#c77722]/60 bg-[#f8edd8] text-[#c77722]"
                        : "border-[#eed7b6] bg-[#f8edd8] text-[#b36c1e] group-hover:border-[#c77722]/40 group-hover:text-[#c77722]"
                    }`}
                  >
                    <Clock size={11} />
                    {item.hours}
                  </span>

                  {/* Title */}
                  <h3
                    className={`mt-3 font-serif text-[19px] font-bold leading-snug transition-colors duration-250 sm:text-[20px] ${
                      isSelected
                        ? "text-[#c77722]"
                        : "text-[#2b241d] group-hover:text-[#b36c1e]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="mt-1.5 text-[12px] font-semibold text-[#b36c1e]">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-[13px] leading-[1.65] text-[#685c4f]">
                    {item.description}
                  </p>

                  {/* Bottom action */}
                  <div className="mt-5 border-t border-[#f0e2cd] pt-4">
                    <button
                      type="button"
                      onClick={() => handleDurationClick(item, isSelected)}
                      className={`group/btn flex w-full cursor-pointer items-center justify-between text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] focus-visible:ring-offset-2`}
                      aria-pressed={isSelected}
                      aria-label={isSelected ? `Clear ${item.hours} duration filter` : `Explore ${item.hours} Pujas`}
                    >
                      <span
                        className={`text-[12.5px] font-semibold transition-colors duration-200 ${
                          isSelected
                            ? "text-[#c77722]"
                            : "text-[#8a7b6a] group-hover/btn:text-[#c77722]"
                        }`}
                      >
                        {isSelected ? "Clear Duration Filter" : `Explore ${item.hours} →`}
                      </span>
                      {!isSelected && (
                        <ArrowRight
                          size={14}
                          className="text-[#d2baa0] transition-all duration-200 group-hover/btn:translate-x-1 group-hover/btn:text-[#c77722]"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Service-Specific Duration Notice ── */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#e8d9bc] bg-[#fbf5e8] px-5 py-4 text-[13px] text-[#756653]">
          <Info size={15} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <p>
            <strong className="font-semibold text-[#2b241d]">
              Service-Specific Duration Architecture:
            </strong>{" "}
            Durations are controlled individually per Puja service. When viewing a
            specific service, only authentic scripturally recognized durations are
            rendered.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PujaDurationSection;
