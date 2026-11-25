import { useState } from "react";
import { Sparkles, Heart, Compass, Shield, Coins, Flame, ArrowRight, RotateCcw, Layers } from "lucide-react";
import JapaCategoryCard from "../JapaCategoryCard";

const PURPOSE_ICONS = {
  "spiritual-practice": Sparkles,
  "shanti-wellbeing": Heart,
  "graha-shanti": Compass,
  "protection": Shield,
  "prosperity": Coins,
  "special-sankalpa": Flame,
};

/**
 * Section 02: Purpose & Category Discovery
 * Consolidates Sacred Purpose (Why Japa) and Deity Category (Traditional Classification)
 * while keeping their logical filtering separate.
 */
const JapaDiscoverySection = ({
  purposes = [],
  categories = [],
  selectedPurpose = "All",
  onSelectPurpose,
  selectedCategory = "All",
  onSelectCategory,
  onResetFilters,
  onJumpToCatalogue,
}) => {
  const [activeTab, setActiveTab] = useState("purpose"); // "purpose" | "category"

  const hasActiveFilter =
    (selectedPurpose && selectedPurpose !== "All") ||
    (selectedCategory && selectedCategory !== "All");

  return (
    <section className="border-b border-[#ead8bc] bg-[#f8f1e6] py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fffcf6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
              <Layers size={11} className="text-[#b77920]" />
              <span>Sacred Guidance</span>
            </div>
            <h2 className="mt-2 font-serif text-[26px] sm:text-[32px] font-bold text-[#30251c]">
              Discover Your Mantra Japa
            </h2>
            <p className="mt-1 text-[14px] text-[#6b5845]">
              Choose by your personal Sankalpa purpose or explore traditional deity categories.
            </p>
          </div>

          {/* Toggle Switch between Purpose and Category */}
          <div className="flex items-center gap-1 rounded-xl border border-[#ead8bc] bg-[#fffdfa] p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("purpose")}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all cursor-pointer ${
                activeTab === "purpose"
                  ? "bg-[#b77920] text-white shadow-xs"
                  : "text-[#6b5845] hover:text-[#30251c]"
              }`}
            >
              By Sankalpa Purpose
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("category")}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all cursor-pointer ${
                activeTab === "category"
                  ? "bg-[#b77920] text-white shadow-xs"
                  : "text-[#6b5845] hover:text-[#30251c]"
              }`}
            >
              By Deity Category
            </button>
          </div>
        </div>

        {/* Filter Reset Indicator if active */}
        {hasActiveFilter && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#ead8bc] bg-[#fffdfa] px-4 py-2.5">
            <div className="flex items-center gap-2 text-[12.5px] text-[#6b5845]">
              <span className="font-semibold text-[#30251c]">Active Filter:</span>
              {selectedPurpose !== "All" && (
                <span className="rounded-md bg-[#f4e7d3] px-2 py-0.5 font-bold text-[#7a4814]">
                  Purpose: {selectedPurpose}
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="rounded-md bg-[#f4e7d3] px-2 py-0.5 font-bold text-[#7a4814]">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#8a561c] hover:text-[#b77920] cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Tab 1: By Sankalpa Purpose (6 Purpose Cards) */}
        {activeTab === "purpose" && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {purposes.map((p) => {
              const IconComp = PURPOSE_ICONS[p.id] || Sparkles;
              const isSelected = selectedPurpose === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (onSelectPurpose) {
                      onSelectPurpose(isSelected ? "All" : p.id);
                    }
                    if (onJumpToCatalogue) onJumpToCatalogue();
                  }}
                  className={`group relative flex flex-col justify-between rounded-[18px] border p-5 text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-[#b77920] bg-[#fffdfa] shadow-[0_8px_24px_rgba(183,121,32,0.14)] ring-2 ring-[#b77920]"
                      : "border-[#ead8bc] bg-[#fffcf6] hover:border-[#b77920] hover:bg-[#fffdfa] hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-[#b77920] text-white"
                            : "bg-[#f4e7d3] text-[#7a4814] group-hover:bg-[#b77920] group-hover:text-white"
                        }`}
                      >
                        <IconComp size={20} />
                      </div>

                      {isSelected && (
                        <span className="rounded-full bg-[#b77920] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3.5 font-serif text-[17px] font-bold text-[#30251c] transition-colors group-hover:text-[#b77920]">
                      {p.title || p.name}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#6b5845]">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[11.5px] font-bold text-[#b77920]">
                    <span>{isSelected ? "Filter Applied" : "Filter Japa"}</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: By Deity Category (7 Category Cards) */}
        {activeTab === "category" && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.id || cat.slug}>
                <JapaCategoryCard category={cat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JapaDiscoverySection;

