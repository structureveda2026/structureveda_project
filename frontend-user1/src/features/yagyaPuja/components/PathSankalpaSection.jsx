import { Sparkles, Check, User, Users, Compass, Moon, Heart } from "lucide-react";

const PathSankalpaSection = () => {
  const fields = [
    {
      label: "Devotee Name",
      desc: "Pronounced during the ritual invocation (Pratham Sankalpa).",
      icon: User,
      status: "Standard",
    },
    {
      label: "Gotra",
      desc: "Ancestral lineage consecrated in the opening mantras.",
      icon: Compass,
      status: "Configurable",
    },
    {
      label: "Nakshatra & Rashi",
      desc: "Birth constellation and moon sign aligned with auspicious tithis.",
      icon: Moon,
      status: "Service-Specific",
    },
    {
      label: "Family Members",
      desc: "Option to include names of family members for joint blessings.",
      icon: Users,
      status: "Where Supported",
    },
    {
      label: "Specific Purpose",
      desc: "Stated devotional intention (e.g. Shanti, health, milestone).",
      icon: Heart,
      status: "Standard",
    },
    {
      label: "Special Sankalpa",
      desc: "Custom vow or memorial observance formally recorded.",
      icon: Sparkles,
      status: "Optional",
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            INTENTION CONSECRATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Begin Your Path With a Sankalpa
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A Path may be undertaken with a personal, family or specific spiritual intention. During booking, the applicable Sankalpa details can be provided according to the selected service.
          </p>
        </div>

        {/* 6 Potential Fields Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.label}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e6d1] text-[#9c5a17]">
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full bg-[#f8eedf] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#8c591c]">
                      {field.status}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                    {field.label}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                    {field.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shastric Rule Clarification */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#d8b584] bg-[#fffaf0] p-4 text-center text-[13px] text-[#705c48]">
          <p>
            <strong>Configurable Field Architecture:</strong> Not every Path requires every field. Each individual service configures flags such as `gotraRequired` or `nakshatraRequired`. The future booking form will dynamically adapt to ask only what is Shastrically necessary.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathSankalpaSection;
