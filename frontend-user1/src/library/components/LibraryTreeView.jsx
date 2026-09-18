import { useState } from "react";
import { ChevronRight, ChevronDown, BookOpen, Scroll, Compass, Sun, Flame, Sparkles, ExternalLink } from "lucide-react";
import { VEDA_CATEGORIES, VEDA_TOPICS } from "../data/libraryData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const getCategoryIcon = (slug) => {
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

const LibraryTreeView = ({ onSelectTopic }) => {
  const { isHindi } = useLibraryLanguage();

  // Keep track of which categories and sub-branches are open (default all open for rich discovery)
  const [openCategories, setOpenCategories] = useState({
    "vedic-knowledge": true,
    "shastra-darshana": true,
    "itihasa-purana": true,
    "dharma-jeevan": true,
    "puja-anushthana": true,
  });

  const [openSubgroups, setOpenSubgroups] = useState({
    "Veda": true,
    "Vedanga": true,
    "Explanatory & Philosophical Treatises": true,
    "Shad Darshana": true,
    "Epics & Puranic Heritage": true,
    "Vedic Lifestyle & Conduct": true,
    "Rituals & Sacrifices": true,
  });

  const toggleCategory = (slug) => {
    setOpenCategories((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleSubgroup = (name) => {
    setOpenSubgroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const expandAll = () => {
    const allCats = {};
    VEDA_CATEGORIES.forEach((c) => (allCats[c.slug] = true));
    setOpenCategories(allCats);

    const allSubs = {};
    VEDA_CATEGORIES.forEach((c) => {
      c.subgroups.forEach((s) => {
        allSubs[s.name.en] = true;
      });
    });
    setOpenSubgroups(allSubs);
  };

  const collapseAll = () => {
    setOpenCategories({});
    setOpenSubgroups({});
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-8">
      {/* Container with parchment style border */}
      <div className="overflow-hidden rounded-3xl border-2 border-[#e6d0a7] bg-[#fffdfa] shadow-[0_12px_40px_rgba(90,65,25,0.06)]">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#ebd8b8] bg-[#faf3e3] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c88918] text-white shadow-xs">
              <Scroll size={18} />
            </div>
            <div>
              <h2 className="font-serif text-[18px] font-bold text-[#2b241d] sm:text-[20px]">
                {isHindi ? "वैदिक ज्ञान-वृक्ष संरचना" : "Veda Interactive Tree Explorer"}
              </h2>
              <p className="text-[12px] text-[#7d6f5f]">
                {isHindi
                  ? "क्लाइंट संरचना के अनुरूप पदानुक्रमिक वैदिक ज्ञान दर्शन"
                  : "Hierarchical Vedic repository mapped directly to scripture taxonomy"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={expandAll}
              className="cursor-pointer rounded-lg border border-[#dfcaa1] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#665747] transition hover:border-[#c88918] hover:text-[#c88918]"
            >
              {isHindi ? "सब खोलें (Expand All)" : "Expand All"}
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="cursor-pointer rounded-lg border border-[#dfcaa1] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#665747] transition hover:border-[#c88918] hover:text-[#c88918]"
            >
              {isHindi ? "सब समेटें (Collapse All)" : "Collapse All"}
            </button>
          </div>
        </div>

        {/* Tree Root Node */}
        <div className="p-6 sm:p-8">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#d6b77c] bg-[#fff5de] px-4 py-2 shadow-xs">
            <span className="font-serif text-[18px] font-bold tracking-wider text-[#9b6811]">
              VEDA LIBRARY (वेद पुस्तकालय)
            </span>
            <span className="rounded-full bg-[#c88918] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              Root
            </span>
          </div>

          {/* Tree Branches */}
          <div className="relative mt-6 space-y-6 pl-4 sm:pl-8">
            {/* Connecting Vertical Line */}
            <div className="absolute left-2.5 top-0 bottom-4 w-[2px] bg-gradient-to-b from-[#d8ba82] via-[#e2cca4] to-transparent sm:left-4" />

            {VEDA_CATEGORIES.map((cat) => {
              const isOpen = !!openCategories[cat.slug];
              const Icon = getCategoryIcon(cat.slug);

              return (
                <div key={cat.id} className="relative">
                  {/* Category Header Row */}
                  <div
                    onClick={() => toggleCategory(cat.slug)}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#ecdab9] bg-gradient-to-r from-[#fff9ee] to-[#fffefb] p-3.5 shadow-xs transition-all hover:border-[#c88918] hover:shadow-[0_4px_16px_rgba(200,137,24,0.1)] sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#faecd1] text-[#9b6811] transition group-hover:bg-[#c88918] group-hover:text-white">
                        <Icon size={16} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[12px] font-bold text-[#c88918]">
                            ├── {cat.number}.
                          </span>
                          <span className="font-serif text-[17px] font-bold tracking-wide text-[#2b241d] sm:text-[19px]">
                            {isHindi ? cat.title.hi : cat.title.en}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#7d7062]">
                          {isHindi ? cat.tagline.hi : cat.tagline.en}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden text-[11px] font-semibold text-[#a5864e] sm:inline">
                        {isOpen ? (isHindi ? "समेटें" : "Collapse") : (isHindi ? "विस्तार" : "Expand")}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4e8d1] text-[#7c664b] transition-transform duration-200 group-hover:bg-[#c88918] group-hover:text-white">
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </div>
                    </div>
                  </div>

                  {/* Subgroups & Topics within Category */}
                  {isOpen && (
                    <div className="relative mt-3 space-y-4 pl-6 sm:pl-10">
                      {/* Vertical branch line for sub-elements */}
                      <div className="absolute left-3 top-0 bottom-2 w-[1.5px] border-l-2 border-dashed border-[#ddc392]" />

                      {cat.subgroups.map((subgroup, sIdx) => {
                        const subName = subgroup.name.en;
                        const isSubOpen = openSubgroups[subName] !== false;

                        return (
                          <div key={sIdx} className="relative">
                            {/* Subgroup Heading if exists */}
                            <div
                              onClick={() => toggleSubgroup(subName)}
                              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#ebd8b7] bg-[#fbf5e7] px-3 py-1.5 text-[13px] font-bold text-[#865d1d] shadow-2xs transition hover:border-[#c88918]"
                            >
                              <span className="text-[#c88918]">│──</span>
                              <span>{isHindi ? subgroup.name.hi : subgroup.name.en}</span>
                              {isSubOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>

                            {/* Leaf Topics Grid */}
                            {isSubOpen && (
                              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 pl-4 sm:pl-6">
                                {subgroup.items.map((topicSlug) => {
                                  const topic = VEDA_TOPICS.find((t) => t.slug === topicSlug);
                                  if (!topic) return null;

                                  return (
                                    <div
                                      key={topic.id}
                                      onClick={() => onSelectTopic(topic)}
                                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#ebdcc0] bg-white p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c88918] hover:bg-[#fffdf7] hover:shadow-[0_4px_14px_rgba(200,137,24,0.12)]"
                                    >
                                      <div className="flex items-center gap-2.5 overflow-hidden">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#faeed8] text-[#9b6811] transition group-hover:bg-[#c88918] group-hover:text-white">
                                          <BookOpen size={13} />
                                        </div>
                                        <div className="truncate">
                                          <p className="truncate text-[13px] font-bold text-[#2b241d] group-hover:text-[#c88918]">
                                            {isHindi ? topic.title.hi : topic.title.en}
                                          </p>
                                          <p className="truncate text-[11px] font-serif text-[#8f7962]">
                                            {topic.sanskritTitle}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex shrink-0 items-center gap-1.5 text-[#9b8b79] transition group-hover:text-[#c88918]">
                                        <span className="hidden text-[10px] font-medium sm:inline">
                                          {topic.readTime}
                                        </span>
                                        <ExternalLink size={13} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryTreeView;
