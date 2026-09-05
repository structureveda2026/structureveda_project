import {
  Compass,
  Sliders,
  FileSignature,
  CalendarCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Choose a Ritual",
    description: "Browse through Puja, Yagya, Japa, Path, Homa, or Kashi-based ceremonies.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Configure Service",
    description: "Select ritual duration, deity focus, and samagri options according to tradition.",
    icon: Sliders,
  },
  {
    step: "03",
    title: "Share Sankalpa",
    description: "Provide your family gotra, seeker names, and specific prayer intentions.",
    icon: FileSignature,
  },
  {
    step: "04",
    title: "Check Availability",
    description: "View auspicious dates and verify pandit scheduling for your chosen date.",
    icon: CalendarCheck,
  },
  {
    step: "05",
    title: "Review Your Plan",
    description: "Check transparent pricing, venue details, and service inclusions.",
    icon: CheckCircle2,
  },
  {
    step: "06",
    title: "Book & Coordinate",
    description: "Confirm your ritual with digital booking, video updates, and holy prasad dispatch.",
    icon: Lock,
  },
];

const HowItWorksSection = () => {
  return (
    <section className="border-t border-[#ebdcc4] bg-[#faf5eb] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            Seamless 6-Step Flow
          </p>

          <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            How It Works
          </h2>

          <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f]">
            From selection to post-ritual prasad delivery, experience a transparent and structured Vedic journey.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col rounded-2xl border border-[#ebdcc4] bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_28px_rgba(199,119,34,0.08)]"
              >
                {/* Step Number Top */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-[16px] font-bold text-[#b36c1e]/60">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-[18px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
