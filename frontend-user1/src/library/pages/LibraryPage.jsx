import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import {
  VEDA_HIERARCHY_TREE,
  findNodeById,
  getNodePath,
  getQuickStats,
} from "../data/vedaHierarchyData";
import LibraryHero from "../components/LibraryHero";
import LibraryBreadcrumbs from "../components/LibraryBreadcrumbs";
import LibraryNodeExplorer from "../components/LibraryNodeExplorer";
import LibraryDetailReader from "../components/LibraryDetailReader";
import LibraryInteractiveTreeModal from "../components/LibraryInteractiveTreeModal";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  Network,
  Sparkles,
  ArrowRight,
  Scroll,
  Compass,
  BookOpen,
  Sun,
  Flame,
  Layers,
  LayoutGrid,
} from "lucide-react";

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

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isHindi } = useLibraryLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);

  // URL parameters
  const nodeId = searchParams.get("node");
  const categoryParam = searchParams.get("category");
  const viewParam = searchParams.get("view");

  // If view=tree is in url, redirect to dedicated full tree page
  useEffect(() => {
    if (viewParam === "tree") {
      navigate("/library/tree", { replace: true });
    }
  }, [viewParam, navigate]);

  // Listen for open-library-tree-modal custom event and route to /library/tree page
  useEffect(() => {
    const handleOpenTree = () => navigate("/library/tree");
    window.addEventListener("open-library-tree-modal", handleOpenTree);
    return () =>
      window.removeEventListener("open-library-tree-modal", handleOpenTree);
  }, [navigate]);

  // Backward compatibility: map category query to node
  const activeNodeId = nodeId || (categoryParam ? categoryParam : null);

  const currentNode = useMemo(() => {
    if (!activeNodeId) return null;
    return findNodeById(activeNodeId);
  }, [activeNodeId]);

  const breadcrumbPath = useMemo(() => {
    if (!activeNodeId) return [];
    return getNodePath(activeNodeId);
  }, [activeNodeId]);

  const stats = useMemo(() => getQuickStats(), []);

  // Handle selecting a node anywhere in the UI
  const handleSelectNode = (id) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("view");
    if (!id) {
      newParams.delete("node");
      newParams.delete("category");
    } else {
      newParams.set("node", id);
      newParams.delete("category");
    }
    setSearchParams(newParams);
    setIsTreeModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseTreeModal = () => {
    setIsTreeModalOpen(false);
  };

  // Active top filter category slug (or null if all)
  const activeFilterCategory = useMemo(() => {
    if (!currentNode) return "all";
    if (breadcrumbPath.length > 0) {
      return breadcrumbPath[0].id;
    }
    return currentNode.id;
  }, [currentNode, breadcrumbPath]);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 text-[#2b241d]">
      {/* Top Hero Section: Render full hero only on root view */}
      {!currentNode ? (
        <LibraryHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectNode={handleSelectNode}
        />
      ) : (
        /* Sleek Compact Navigation Ribbon when exploring or reading */
        <div className="sticky top-0 z-30 border-b border-[#ebd8b8] bg-[#fffdfa]/95 backdrop-blur-md shadow-xs">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleSelectNode(null)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[13px] font-bold text-[#8b5e15] hover:bg-[#faf4e6] hover:text-[#c88918] transition"
              title={
                isHindi
                  ? "मुख्य ज्ञान श्रेणियों पर वापस जाएँ"
                  : "Return to all knowledge categories"
              }
            >
              <BookOpen size={16} className="text-[#c88918]" />
              <span>
                {isHindi
                  ? "सनातन ज्ञानकोष (मुख्य सूची)"
                  : "Veda Library (Main)"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTreeModalOpen(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#ebd2a0] bg-[#faf5ec] px-3 sm:px-4 py-1.5 text-[11.5px] sm:text-[12px] font-bold text-[#7d4808] hover:bg-[#c88918] hover:text-white transition shadow-2xs"
                title={isHindi ? "ज्ञान-वृक्ष खोलें" : "Open Interactive Tree"}
              >
                <Network size={13} />
                <span>{isHindi ? "ज्ञान-वृक्ष" : "Tree View"}</span>
              </button>

              <LanguageSwitcher variant="default" className="shadow-2xs" />
            </div>
          </div>
        </div>
      )}

      <div
        className={`mx-auto max-w-[1280px] px-4 sm:px-8 ${currentNode ? "mt-5" : "mt-8"}`}
      >
        {/* HIERARCHICAL TREE BANNER (Rendered on root overview) */}
        {!currentNode && (
          <section className="mb-8 rounded-3xl border-2 border-[#ebd8b8] bg-gradient-to-r from-[#fbf4e5] via-[#fffdf9] to-[#faf2df] p-6 sm:p-8 shadow-[0_8px_30px_rgba(90,65,25,0.06)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c88918] text-white shadow-md">
                  <Network size={24} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#986411]">
                    <span>Hierarchical Tree</span>
                    <span>✦</span>
                    <span className="font-serif">सम्पूर्ण वैदिक शाखाएँ</span>
                  </div>
                  <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#2b241d] mt-0.5">
                    {isHindi
                      ? "वैदिक ज्ञान-वृक्ष अन्वेषण"
                      : "Explore Interactive Tree"}
                  </h2>
                  <p className="text-[13px] sm:text-[14px] text-[#6d5b48] mt-1 max-w-[620px]">
                    {isHindi
                      ? "वेदों से लेकर महायज्ञों तक की सभी शाखाओं का संपूर्ण विस्तार देखें।"
                      : "Explore the complete expandable branches from Vedas to Yagyas."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTreeModalOpen(true)}
                className="cursor-pointer inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-full bg-[#c88918] px-6 py-3 font-serif text-[14px] font-bold text-white shadow-md hover:bg-[#b07817] hover:shadow-lg transition-all"
              >
                <Network size={16} />
                <span>
                  {isHindi
                    ? "ज्ञान-वृक्ष खोलें (Open Tree View)"
                    : "Open Tree View"}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SRIMANDIR-STYLE HORIZONTAL CATEGORY PILLS BAR                  */}
        {/* ============================================================== */}
        <div className="mb-6 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => handleSelectNode(null)}
            className={`cursor-pointer rounded-full px-4 sm:px-5 py-2.5 min-h-[42px] inline-flex items-center text-[13px] font-bold transition-all shrink-0 ${
              activeFilterCategory === "all"
                ? "bg-[#2b241d] text-[#fffaf0] shadow-md ring-2 ring-[#c88918]/30"
                : "border border-[#e2cca4] bg-[#fffaf0] text-[#635546] hover:border-[#c88918] hover:text-[#2b241d]"
            }`}
          >
            {isHindi ? "सभी ज्ञान श्रेणियाँ" : "All Disciplines"}
          </button>

          {VEDA_HIERARCHY_TREE.map((cat) => {
            const isSelected = activeFilterCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectNode(cat.id)}
                className={`cursor-pointer flex items-center gap-2 rounded-full px-3.5 sm:px-4 py-2.5 min-h-[42px] text-[13px] font-bold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-[#c88918] text-white shadow-md ring-2 ring-[#c88918]/30"
                    : "border border-[#e2cca4] bg-[#fffaf0] text-[#635546] hover:border-[#c88918] hover:text-[#2b241d]"
                }`}
              >
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-[#f4e6ca] text-[#8e651e]"
                  }`}
                >
                  {cat.number}
                </span>
                <span>{isHindi ? cat.shortTitle?.hi : cat.shortTitle?.en}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* MAIN BODY: DRILL-DOWN EXPLORATION vs ROOT CARDS OVERVIEW        */}
        {/* ============================================================== */}
        {currentNode ? (
          <div>
            {/* Clickable Multi-Level Breadcrumbs */}
            <LibraryBreadcrumbs
              path={breadcrumbPath}
              onSelectNode={handleSelectNode}
            />

            {/* FULL-WIDTH CARD EXPLORER / LEAF READER (No sidebar clutter) */}
            <div className="w-full">
              {currentNode.type === "leaf" ? (
                <LibraryDetailReader
                  node={currentNode}
                  path={breadcrumbPath}
                  onSelectNode={handleSelectNode}
                />
              ) : (
                <LibraryNodeExplorer
                  node={currentNode}
                  onSelectChild={handleSelectNode}
                />
              )}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* ROOT OVERVIEW: 5 MAIN KNOWLEDGE AREA CARDS WITH IMAGES       */
          /* ============================================================ */
          <div className="space-y-10">
            {/* Section Heading */}
            <div className="text-center max-w-[760px] mx-auto">
              <span className="rounded-full bg-[#f4e7d0] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#986411] border border-[#ebd2a0]">
                {isHindi ? "सनातन ज्ञानकोष" : "Authentic Vedic Architecture"}
              </span>
              <h2 className="font-serif text-[28px] sm:text-[36px] font-bold text-[#2b241d] mt-3">
                {isHindi
                  ? "ज्ञान क्षेत्र चुनें और विस्तार देखें"
                  : "Explore Sacred Knowledge Areas"}
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#6d5b48] mt-2">
                {isHindi
                  ? "किसी भी ज्ञान क्षेत्र के कार्ड पर क्लिक करें और उसके प्रकार, शाखाएँ तथा मंत्र देखें।"
                  : "Click any Knowledge Area card to explore its branches, texts, and verses in beautiful visual cards."}
              </p>
            </div>

            {/* 5 Main Knowledge Area Cards (Srimandir-Style Compact Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {VEDA_HIERARCHY_TREE.map((category) => {
                const Icon = getCategoryIcon(category.id);

                return (
                  <div
                    key={category.id}
                    onClick={() => handleSelectNode(category.id)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#ebd8b8] bg-[#fffdfa] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_12px_32px_rgba(200,137,24,0.12)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image Banner with Sacred Overlay (Square-Type Proportional Height) */}
                      <div className="relative aspect-square max-h-[190px] sm:max-h-[215px] w-full overflow-hidden bg-[#faf2e3] border-b border-[#ebdcc4]">
                        {category.cardImage || category.image ? (
                          <img
                            src={category.cardImage || category.image}
                            alt={category.title?.en}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 filter brightness-[0.93]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#fbf5e7]">
                            <Icon size={44} className="text-[#c88918]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="rounded-md bg-[#2b241d]/85 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] font-bold text-[#faedd8] border border-white/20">
                            {category.number}
                          </span>
                          <span className="rounded-md bg-[#c88918] px-2 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wider shadow-2xs">
                            {category.badge}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3">
                          <p className="font-serif text-[15px] sm:text-[16px] font-bold text-white drop-shadow-md truncate">
                            {category.sanskrit}
                          </p>
                        </div>
                      </div>

                      {/* Content Area (Slim & Shorter Height) */}
                      <div className="p-3 sm:p-3.5">
                        <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-[#2b241d] group-hover:text-[#c88918] transition-colors leading-snug">
                          {isHindi ? category.title?.hi : category.title?.en}
                        </h3>

                        <p className="mt-1 text-[11.5px] text-[#71614f] leading-snug line-clamp-2">
                          {isHindi ? category.desc?.hi : category.desc?.en}
                        </p>

                        {/* Sub-branch quick preview tags */}
                        {category.children && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {category.children.slice(0, 4).map((sub) => (
                              <span
                                key={sub.id}
                                className="rounded-md border border-[#ebd2a0] bg-[#fbf5e7] px-1.5 py-0.5 text-[9.5px] font-medium text-[#7d4808]"
                              >
                                {isHindi
                                  ? sub.shortTitle?.hi
                                  : sub.shortTitle?.en}
                              </span>
                            ))}
                            {category.children.length > 4 && (
                              <span className="rounded-md border border-[#ebd2a0] bg-[#fbf5e7] px-1.5 py-0.5 text-[9px] font-bold text-[#986411]">
                                +{category.children.length - 4}{" "}
                                {isHindi ? "अन्य" : "more"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Action (Compact) */}
                    <div className="p-3 sm:p-3.5 pt-0">
                      <div className="flex items-center justify-between border-t border-[#ebdcc4]/60 pt-2">
                        <span className="text-[11px] font-bold text-[#867563] group-hover:text-[#c88918] transition-colors">
                          {isHindi
                            ? "ग्रंथ एवं अध्याय देखें"
                            : "Explore Scriptures & Chapters"}
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbf5e7] text-[#986411] transition-all group-hover:translate-x-1 group-hover:bg-[#c88918] group-hover:text-white">
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tree View Modal */}
      <LibraryInteractiveTreeModal
        isOpen={isTreeModalOpen}
        onClose={handleCloseTreeModal}
        activeNodeId={activeNodeId}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
};

export default LibraryPage;
