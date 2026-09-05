import { ArrowRight, Calculator, Calendar, Clock, Users, Hash, ShieldCheck, Info } from "lucide-react";

const JapaScheduleSection = () => {
  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            CAPACITY & PLANNING
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Your Japa Is Structured Around a Completion Schedule
          </h2>
          <p className="mx-auto mt-3 max-w-[660px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Every large-scale Japa requires mathematical precision, daily chanting targets, and dedicated priest allocations to ensure undisturbed continuity.
          </p>
        </div>

        {/* 6-Stage Flow Pipeline */}
        <div className="mt-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { step: "01", label: "Japa Count", desc: "e.g. 51,000 Recitations", icon: Hash },
              { step: "02", label: "Daily Capacity", desc: "Admin-Configured Per Pandit", icon: Clock },
              { step: "03", label: "Pandit Requirement", desc: "Determined by Target Window", icon: Users },
              { step: "04", label: "Daily Target", desc: "Structured Daily Chanting Total", icon: Calculator },
              { step: "05", label: "Number of Days", desc: "Dedicated Anushthan Timeline", icon: Calendar },
              { step: "06", label: "Completion Date", desc: "Synchronized with Purnahuti", icon: ShieldCheck },
            ].map((node, i, arr) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.step}
                  className="relative flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.04)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold tracking-widest text-[#a8641b]">
                        PHASE {node.step}
                      </span>
                      <Icon size={16} className="text-[#c77722]" />
                    </div>
                    <h3 className="mt-3 font-serif text-[16px] font-bold text-[#2b241d]">
                      {node.label}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#736353]">
                      {node.desc}
                    </p>
                  </div>

                  {i < arr.length - 1 && (
                    <div className="hidden lg:absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#c77722]">
                      <ArrowRight size={15} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Illustrative Architecture Calculation Demonstration Box */}
        <div className="mx-auto mt-12 max-w-[880px] overflow-hidden rounded-[26px] border border-[#d8c3a1] bg-[#fffdfa] shadow-[0_10px_30px_rgba(80,60,30,0.06)]">
          <div className="border-b border-[#ebdcc4] bg-[#f7eedc] px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#8a571c]">
                SCHEDULING ENGINE ARCHITECTURE (ILLUSTRATIVE DEMO)
              </span>
              <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[10.5px] font-semibold text-[#f7ecd5]">
                Architecture Preview
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-[#ebdcc4] sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-[#fffdfa] p-5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Selected Japa
              </span>
              <span className="mt-1.5 block font-serif text-[22px] font-bold text-[#2b241d]">
                51,000
              </span>
              <span className="text-[11px] text-[#7d6c5b]">Recitations</span>
            </div>

            <div className="bg-[#fffdfa] p-5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Pandit Team
              </span>
              <span className="mt-1.5 block font-serif text-[22px] font-bold text-[#a8641b]">
                Calculated
              </span>
              <span className="text-[11px] text-[#7d6c5b]">Based on Capacity</span>
            </div>

            <div className="bg-[#fffdfa] p-5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Daily Target
              </span>
              <span className="mt-1.5 block font-serif text-[22px] font-bold text-[#a8641b]">
                Calculated
              </span>
              <span className="text-[11px] text-[#7d6c5b]">Total Japa / Day</span>
            </div>

            <div className="bg-[#fffdfa] p-5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Estimated Days
              </span>
              <span className="mt-1.5 block font-serif text-[22px] font-bold text-[#a8641b]">
                Calculated
              </span>
              <span className="text-[11px] text-[#7d6c5b]">Target Window</span>
            </div>

            <div className="bg-[#fffdfa] p-5 text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                Expected Completion
              </span>
              <span className="mt-1.5 block font-serif text-[22px] font-bold text-[#a8641b]">
                Calculated
              </span>
              <span className="text-[11px] text-[#7d6c5b]">Purnahuti Schedule</span>
            </div>
          </div>

          {/* Admin Configured Capacity Clarification Footer */}
          <div className="flex items-start gap-3 bg-[#fdfaf4] p-5 text-[12.5px] leading-relaxed text-[#735e47]">
            <Info size={16} className="mt-0.5 shrink-0 text-[#c77722]" />
            <div>
              <strong>Business Architecture Rule:</strong> Daily chanting capacity (e.g. 2,000–2,500 recitations per Pandit per day) is configured per individual Mantra and service by the administrators, taking into account mantra syllable length and strict Chandas meter. No fixed universal capacity is hardcoded.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaScheduleSection;
