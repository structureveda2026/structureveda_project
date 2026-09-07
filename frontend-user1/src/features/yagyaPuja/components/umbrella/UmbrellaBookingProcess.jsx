import { Sparkles, CalendarCheck, FileText, Flame, Video, PackageCheck, UserCheck } from "lucide-react";

/**
 * SECTION 8: FROM BOOKING TO SANKALP
 * Clean 6-step horizontal timeline detailing the authentic coordination process.
 */
const UmbrellaBookingProcess = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Puja",
      description: "Select a suitable ritual based on your purpose and family traditions.",
      icon: CalendarCheck,
    },
    {
      number: "02",
      title: "Share Your Details",
      description: "Provide family gotra, nakshatra, and dedicated devotional intentions.",
      icon: FileText,
    },
    {
      number: "03",
      title: "Sankalp Preparation",
      description: "Acharya prepares the personalized sankalpa according to your details.",
      icon: UserCheck,
    },
    {
      number: "04",
      title: "Ritual Performed",
      description: "Ceremony is executed with acoustic precision and prescribed Shastric vidhi.",
      icon: Flame,
    },
    {
      number: "05",
      title: "Receive Updates",
      description: "Receive photographic/video updates of your specific gotra sankalpa recitation.",
      icon: Video,
    },
    {
      number: "06",
      title: "Prasad / Report",
      description: "Receive consecrated prasad, sacred raksha sutra, and completion certificate.",
      icon: PackageCheck,
    },
  ];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              TRANSPARENT CEREMONY WORKFLOW
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Booking to <span className="text-[#c77722]">Sankalp</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[680px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            A clear, organized ritual coordination journey ensuring traditional sanctity from your initial prayer intention to post-Purnahuti blessings.
          </p>

          <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* 6 Steps Grid (Responsive: 1 col on mobile, 2 on tablet, 6 on desktop) */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 sm:gap-4.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-[20px] border border-[#ead8b8] bg-[#fffcf7] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:shadow-[0_8px_20px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[20px] font-bold text-[#b36c1e]/40 group-hover:text-[#b36c1e] transition-colors">
                      {step.number}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f5ebd7] text-[#b36c1e]">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="mt-3.5 font-serif text-[16.5px] font-bold text-[#2b241d] leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[12px] leading-relaxed text-[#65584a]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UmbrellaBookingProcess;
