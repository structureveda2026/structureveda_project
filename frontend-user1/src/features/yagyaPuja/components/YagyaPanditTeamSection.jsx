import { Users, Sliders, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

const YagyaPanditTeamSection = () => {
  const steps = [
    { label: "Selected Yagya", desc: "Core ritual specifications & deity vidhi" },
    { label: "Duration", desc: "Multi-day commitment (3, 5, 7, 9, or 11 days)" },
    { label: "Ritual Configuration", desc: "Target mantra count & ahuti volume" },
    { label: "Pandit Requirement", desc: "Calculated minimum & recommended priests" },
    { label: "Availability", desc: "Priest team scheduling verification" },
    { label: "Booking Confirmation", desc: "Dedicated ceremony assignment" },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            PRIESTHOOD ALLOCATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Required Pandit Team Is Calculated for Your Yagya
          </h2>
          <p className="mx-auto mt-3.5 max-w-[700px] text-[15px] leading-relaxed text-[#5e5143] sm:text-[16px]">
            The number of Pandits required depends on the selected Yagya, duration and configured ritual requirements.
          </p>
        </div>

        {/* Visual Calculation Flow */}
        <div className="mt-12 rounded-[24px] border border-[#ead8b8] bg-[#fffdfa] p-8 shadow-2xs sm:p-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((item, idx) => (
              <div
                key={item.label}
                className="relative flex flex-col justify-between rounded-xl border border-[#ebdcc4] bg-[#fbf6ec]/60 p-4 text-center"
              >
                <div>
                  <span className="inline-block rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#b36c1e]">
                    Step {idx + 1}
                  </span>
                  <h4 className="mt-2 font-serif text-[15.5px] font-bold text-[#2b241d]">
                    {item.label}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#6b5d4e]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Model Clarity Note */}
          <div className="mt-8 rounded-xl border border-[#ebdcc4] bg-[#fffaf0] p-5 text-center">
            <p className="text-[13.5px] leading-relaxed text-[#685c4f]">
              <strong>Structured Capacity Model:</strong> Rather than arbitrary rules, our architecture calculates priest requirements based on 
              <span className="font-semibold text-[#2b241d]"> minimum pandits</span>, 
              <span className="font-semibold text-[#2b241d]"> recommended acharyas</span>, 
              <span className="font-semibold text-[#2b241d]"> specific Veda skillsets</span>, and 
              <span className="font-semibold text-[#2b241d]"> daily ritual hours</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YagyaPanditTeamSection;
