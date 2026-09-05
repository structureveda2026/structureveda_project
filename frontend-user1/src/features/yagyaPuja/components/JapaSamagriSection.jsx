import { Scroll, Sparkles, Users, CircleDot, Package, Calendar, Gift, FileText, Info } from "lucide-react";

const JapaSamagriSection = () => {
  const items = [
    {
      title: "Mantra / Japa Specification",
      desc: "Specific Sanskrit text, Shakha tradition, and sanctioned count metric.",
      status: "Included",
      icon: Scroll,
    },
    {
      title: "Sankalpa",
      desc: "Formal ritual vow with name, Gotra, and consecrated intention.",
      status: "Included",
      icon: Sparkles,
    },
    {
      title: "Pandit Team",
      desc: "Dedicated team of qualified Vedic reciters assigned for uninterrupted chanting.",
      status: "Included",
      icon: Users,
    },
    {
      title: "Japa Mala / Applicable Materials",
      desc: "Consecrated chanting beads (Rudraksha, Tulsi, Kamalgatta) matching the deity.",
      status: "Service-Specific",
      icon: CircleDot,
    },
    {
      title: "Samagri",
      desc: "Pure cow ghee, herbs, flowers, and offering materials for daily archana.",
      status: "As Applicable",
      icon: Package,
    },
    {
      title: "Schedule",
      desc: "Defined daily time slots (e.g. Brahma Muhurta, Pradosha) and tally maintenance.",
      status: "Included",
      icon: Calendar,
    },
    {
      title: "Prasad",
      desc: "Consecrated raksha-sutra, energized rudraksha, or sacred bhasma where supported.",
      status: "Optional / Where Supported",
      icon: Gift,
    },
    {
      title: "Completion Update",
      desc: "Timely notification upon Purnahuti, completion count verification, and closing blessings.",
      status: "Included",
      icon: FileText,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            COMPREHENSIVE PROVISIONING
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Ritual Arrangements Behind Your Japa
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Exact inclusions depend on the selected Mantra Japa service and are displayed before booking. Every detail is structured to support uncompromised recitation.
          </p>
        </div>

        {/* 8 Arrangements Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition hover:border-[#c77722]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e6d1] text-[#9c5a17]">
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full bg-[#f8eedf] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#8c591c]">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[17px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency Banner */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#d8b584] bg-[#fffaf0] p-4 text-center text-[13px] text-[#705c48]">
          <div className="flex items-center justify-center gap-2">
            <Info size={15} className="text-[#c77722]" />
            <span>
              In accordance with Veda Structure architecture, services delineate items into <strong>Included</strong>, <strong>Optional</strong>, or <strong>Additional</strong> so devotees retain absolute clarity before booking.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaSamagriSection;
