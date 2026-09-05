import { Users, BookOpen, Calendar, Sparkles, Package, MapPin, Gift, FileText, Video, Info } from "lucide-react";

const PathInclusionsSection = () => {
  const items = [
    {
      title: "Pandit Coordination",
      desc: "Assigning initiated Vedic scholars matched specifically to the chosen scripture.",
      status: "Included",
      icon: Users,
    },
    {
      title: "Scripture / Path Selection",
      desc: "Authentic text edition, chapter divisions, and classical Samput arrangements.",
      status: "Included",
      icon: BookOpen,
    },
    {
      title: "Recitation Schedule",
      desc: "Structured daily session timelines, target chapters, and planned Purnahuti.",
      status: "Included",
      icon: Calendar,
    },
    {
      title: "Sankalpa",
      desc: "Formal ritual intention taking with Gotra, names, and personal prayer.",
      status: "Included",
      icon: Sparkles,
    },
    {
      title: "Samagri",
      desc: "Granth, pure cow ghee lamp, chandan, akshat, flowers, and offering items.",
      status: "As Applicable",
      icon: Package,
    },
    {
      title: "Location",
      desc: "Arranged in sacred Kashi mandapams, sanctified shrines, or remote coordination.",
      status: "Selected Service",
      icon: MapPin,
    },
    {
      title: "Prasad",
      desc: "Consecrated raksha-sutra, sacred bhasma, or holy prasad tokens where supported.",
      status: "Optional / Where Supported",
      icon: Gift,
    },
    {
      title: "Completion Update",
      desc: "Notification upon Purnahuti, chapter completion metrics, and closing blessings.",
      status: "Included",
      icon: FileText,
    },
    {
      title: "Photo / Video",
      desc: "Ritual commencement recording or commemorative photos where applicable.",
      status: "Where Applicable",
      icon: Video,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            COMPREHENSIVE COORDINATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Everything Your Recitation Requires
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Exact inclusions depend on the selected Path and are displayed before booking. Every detail is structured to support uncompromised recitation.
          </p>
        </div>

        {/* 9 Inclusions Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

export default PathInclusionsSection;
