import { LayoutGrid, Network } from "lucide-react";
import { VEDA_CATEGORIES } from "../data/libraryData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const LibraryCategoryTabs = ({
  selectedCategory,
  onSelectCategory,
  activeView,
  setActiveView,
  totalResultsCount,
}) => {
  const { isHindi, t } = useLibraryLanguage();

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-8 sm:mt-10">
      {/* Category Pills and View Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-[#2b241d] text-[#fffaf0] shadow-md ring-2 ring-[#c88918]/30"
                : "border border-[#e2cca4] bg-[#fffaf0] text-[#635546] hover:border-[#c88918] hover:text-[#2b241d]"
            }`}
          >
            {t("allDisciplines")}
          </button>

          {VEDA_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`cursor-pointer flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#c88918] text-white shadow-md ring-2 ring-[#c88918]/30"
                    : "border border-[#e2cca4] bg-[#fffaf0] text-[#635546] hover:border-[#c88918] hover:text-[#2b241d]"
                }`}
              >
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? "bg-white/25 text-white" : "bg-[#f4e6ca] text-[#8e651e]"
                  }`}
                >
                  {cat.number}
                </span>
                <span>{isHindi ? cat.shortTitle.hi : cat.shortTitle.en}</span>
              </button>
            );
          })}
        </div>

        {/* View Toggle (Cards vs Interactive Hierarchy Tree) */}
        <div className="flex shrink-0 items-center justify-between gap-3 pt-2 lg:pt-0">
          <span className="text-[12px] font-medium text-[#7d6f5f]">
            {totalResultsCount} {t("searchResultsCount")}
          </span>

          <div className="inline-flex rounded-full border border-[#e2cca4] bg-[#fffaf0] p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveView("grid")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
                activeView === "grid"
                  ? "bg-[#2b241d] text-white shadow-xs"
                  : "text-[#6b5e4f] hover:text-[#2b241d]"
              }`}
            >
              <LayoutGrid size={14} />
              <span>{t("viewGrid")}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("tree")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
                activeView === "tree"
                  ? "bg-[#c88918] text-white shadow-xs"
                  : "text-[#6b5e4f] hover:text-[#2b241d]"
              }`}
            >
              <Network size={14} />
              <span>{t("viewTree")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryCategoryTabs;
