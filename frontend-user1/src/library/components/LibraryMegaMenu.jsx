import { Link } from "react-router-dom";
import { ArrowRight, Scroll, Compass, BookOpen, Sun, Flame, Sparkles } from "lucide-react";
import { VEDA_CATEGORIES } from "../data/libraryData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const getMenuIcon = (slug) => {
  switch (slug) {
    case "vedic-knowledge":
      return Scroll;
    case "shastra-darshana":
      return Compass;
    case "itihasa-purana":
      return BookOpen;
    case "dharma-jeevan":
      return Sun;
    case "puja-anushthana":
      return Flame;
    default:
      return Sparkles;
  }
};

const LibraryMegaMenu = ({ onClose }) => {
  const { isHindi } = useLibraryLanguage();

  return (
    <div className="absolute right-[-40px] top-full z-50 pt-2.5 w-[610px] max-w-[calc(100vw-32px)] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="overflow-hidden rounded-2xl border-2 border-[#e6d0a7] bg-[#fffdfa] shadow-[0_20px_50px_rgba(70,45,15,0.16)] ring-1 ring-black/5">
        {/* Luxury Sacred Top Header */}
        <div className="flex items-center justify-between border-b border-[#eee1ca] bg-gradient-to-r from-[#faf4e6] via-[#fff9ee] to-[#faf4e6] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c88918] text-white shadow-xs">
              <Scroll size={14} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[13px] font-bold tracking-[0.16em] text-[#2b241d] uppercase">
                  VEDA LIBRARY
                </span>
                <span className="text-[#c88918]">✦</span>
                <span className="font-serif text-[12px] font-medium text-[#8c6724]">
                  सनातन ज्ञानकोष
                </span>
              </div>
              <p className="text-[10.5px] text-[#7d7062]">
                {isHindi
                  ? "वेदों, दर्शनों, संस्कारों एवं अनुष्ठानों का प्रामाणिक संग्रह"
                  : "Authentic taxonomy of Vedas, Darshanas, Epics & Sacred Rites"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-[#e0c99d] bg-[#fffcf5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#986411]">
            24+ Topics
          </span>
        </div>

        {/* 5 Disciplines Grid (Carefully Proportioned, 2 Columns) */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#fffefc]">
          {VEDA_CATEGORIES.map((cat) => {
            const Icon = getMenuIcon(cat.slug);

            return (
              <div
                key={cat.id}
                className="group flex flex-col justify-between rounded-xl border border-[#ebdcc4] bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c88918] hover:bg-[#fffdf8] hover:shadow-[0_4px_16px_rgba(200,137,24,0.1)]"
              >
                <div>
                  {/* Category Header Link */}
                  <Link
                    to={`/library?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-start justify-between gap-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#faf0db] text-[#9b6811] transition group-hover:bg-[#c88918] group-hover:text-white">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-[#c88918]">
                            {cat.number}.
                          </span>
                          <span className="font-serif text-[14px] font-bold text-[#2b241d] transition group-hover:text-[#c88918]">
                            {isHindi ? cat.shortTitle.hi : cat.shortTitle.en}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-[10.5px] text-[#817262]">
                          {cat.sanskrit}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={13}
                      className="text-[#a59481] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#c88918] mt-1 shrink-0"
                    />
                  </Link>

                  {/* Sub-item quick chips */}
                  <div className="mt-2.5 flex flex-wrap gap-1 pt-1 border-t border-[#f4e8d3]">
                    {cat.subgroups[0]?.items.slice(0, 4).map((slug) => {
                      const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");
                      return (
                        <Link
                          key={slug}
                          to={`/library/${slug}`}
                          onClick={onClose}
                          className="rounded bg-[#fbf5e8] px-2 py-0.5 text-[10.5px] font-medium text-[#6b5a47] transition hover:bg-[#c88918] hover:text-white"
                        >
                          {formatted}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Box: Quick Tree View Action Card */}
          <div className="flex flex-col justify-between rounded-xl border border-[#e5cfa4] bg-gradient-to-br from-[#fff7e8] via-[#fbf1dc] to-[#f7e8cb] p-3.5 shadow-2xs">
            <div>
              <div className="flex items-center gap-1 text-[#b57d17]">
                <Sparkles size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isHindi ? "वृक्ष संरचना" : "Hierarchical Tree"}
                </span>
              </div>
              <p className="mt-1 font-serif text-[14px] font-bold leading-tight text-[#2b241d]">
                {isHindi ? "वैदिक ज्ञान-वृक्ष देखें" : "Explore Interactive Tree"}
              </p>
              <p className="mt-1 text-[11px] text-[#716250] leading-snug">
                {isHindi
                  ? "शाखाओं व उपशाखाओं के पदानुक्रम में ज्ञान की खोज।"
                  : "Explore the complete expandable branches from Vedas to Yagyas."}
              </p>
            </div>

            <Link
              to="/library?view=tree"
              onClick={onClose}
              className="mt-2.5 flex items-center justify-between rounded-lg bg-[#c88918] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-[#b0740d]"
            >
              <span>{isHindi ? "वृक्ष दृश्य खोलें" : "Open Tree View"}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Bottom Banner with Full Explore Link */}
        <div className="flex items-center justify-between border-t border-[#ebd8b8] bg-[#faf3e3] px-5 py-2.5">
          <Link
            to="/library"
            onClick={onClose}
            className="flex items-center gap-1.5 text-[12px] font-bold text-[#8f5f12] transition hover:text-[#2b241d]"
          >
            <span>{isHindi ? "संपूर्ण पुस्तकालय ब्राउज़ करें" : "Browse Complete Veda Library"}</span>
            <ArrowRight size={13} />
          </Link>

          <span className="text-[11px] text-[#867562]">
            {isHindi ? "५ महा-शाखाएं • २४+ ग्रंथ" : "5 Disciplines • 24+ Scriptures"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LibraryMegaMenu;
