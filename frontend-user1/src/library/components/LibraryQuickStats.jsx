import { Scroll, Compass, BookOpen, Sun, Flame } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const LibraryQuickStats = ({ onSelectCategory }) => {
  const { isHindi } = useLibraryLanguage();

  const stats = [
    {
      num: "05",
      slug: "vedic-knowledge",
      title: isHindi ? "ज्ञान शाखाएं" : "Disciplines",
      desc: isHindi ? "वेद, दर्शन, पुराण, धर्म व यज्ञ" : "Shruti, Darshana, Itihasa, Dharma, Puja",
      icon: Scroll,
      color: "border-[#e6ce9d] bg-[#fbf5e8]",
    },
    {
      num: "04",
      slug: "vedic-knowledge",
      title: isHindi ? "आदिम वेद" : "Primordial Vedas",
      desc: isHindi ? "ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद" : "Rig, Yajur, Sama, Atharva",
      icon: Compass,
      color: "border-[#e0cb9e] bg-[#faf3e3]",
    },
    {
      num: "06",
      slug: "shastra-darshana",
      title: isHindi ? "षड् दर्शन" : "Darshana Schools",
      desc: isHindi ? "वेदांत, सांख्य, योग, न्याय, वैशेषिक, मीमांसा" : "Vedanta, Yoga, Sankhya, Nyaya...",
      icon: BookOpen,
      color: "border-[#e5d4b0] bg-[#fcf8ee]",
    },
    {
      num: "16",
      slug: "dharma-jeevan",
      title: isHindi ? "षोडश संस्कार" : "Sacred Samskaras",
      desc: isHindi ? "गर्भाधान से अंत्येष्टि तक १६ संस्कार" : "Rites of Passage (Garbhadhana to Antyeshti)",
      icon: Sun,
      color: "border-[#dfcca5] bg-[#fdfaf2]",
    },
    {
      num: "18",
      slug: "itihasa-purana",
      title: isHindi ? "महापुराण एवं इतिहास" : "Puranas & Epics",
      desc: isHindi ? "रामायण, महाभारत व १८ महापुराण" : "Ramayana, Mahabharata & 18 Puranas",
      icon: Flame,
      color: "border-[#e8d5ae] bg-[#fbf6e9]",
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-8 sm:mt-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectCategory && onSelectCategory(item.slug)}
              className={`group flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-[0_4px_16px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_8px_24px_rgba(200,137,24,0.14)] ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-[28px] font-bold text-[#c88918] transition-transform group-hover:scale-110">
                  {item.num}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[#8f6317] shadow-xs transition group-hover:bg-[#c88918] group-hover:text-white">
                  <Icon size={16} strokeWidth={2} />
                </div>
              </div>

              <div className="mt-3">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#2b241d]">
                  {item.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-[11px] text-[#786b5c] leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryQuickStats;
