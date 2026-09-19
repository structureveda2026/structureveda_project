import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ChevronRight,
  ChevronDown,
  Scroll,
  BookOpen,
  Compass,
  Sun,
  Flame,
  Sparkles,
  Layers,
  ArrowRight,
  Network,
  X,
} from "lucide-react";
import { VEDA_HIERARCHY_TREE } from "../data/vedaHierarchyData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import LanguageSwitcher from "../components/LanguageSwitcher";

const getTreeIcon = (node) => {
  if (node.type === "category") {
    switch (node.id) {
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
  }
  if (node.type === "grantha") return BookOpen;
  if (node.type === "leaf") return Sparkles;
  return Layers;
};

const TreeItem = ({
  node,
  onNavigateNode,
  openNodes,
  toggleNode,
  isHindi,
  level = 0,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = !!openNodes[node.id];
  const Icon = getTreeIcon(node);

  const title = isHindi
    ? node.shortTitle?.hi || node.title?.hi
    : node.shortTitle?.en || node.title?.en;

  return (
    <div className="text-[13.5px] sm:text-[14.5px] select-none">
      <div
        className="group flex items-center justify-between rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-2 transition-all hover:bg-[#faedd8]/80 text-[#3b3126] hover:text-[#1e1710]"
        style={{ paddingLeft: `${Math.max(8, level * 18 + 8)}px` }}
      >
        {/* Left: Chevron + Icon + Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg hover:bg-black/10 text-[#8c7762] hover:text-[#2b241d] transition-colors shrink-0 cursor-pointer"
              aria-label={isOpen ? "Collapse branch" : "Expand branch"}
            >
              {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
            </button>
          ) : (
            <span className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center shrink-0 text-[#c2b09a] text-[18px]">
              •
            </span>
          )}

          <div
            onClick={() => onNavigateNode(node.id)}
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 cursor-pointer"
          >
            <Icon
              size={17}
              className="shrink-0 text-[#c88918] group-hover:scale-110 transition-transform"
            />

            <span
              className="font-medium text-[#2b241d] group-hover:text-[#c88918] transition-colors truncate"
              title={title}
            >
              {title}
            </span>

            {node.sanskrit && (
              <span className="font-serif text-[12px] sm:text-[12.5px] text-[#8a7258] truncate hidden md:inline">
                ({node.sanskrit})
              </span>
            )}
          </div>
        </div>

        {/* Right: Badge count + Direct Navigate Button */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {node.levelLabel && (
            <span className="hidden lg:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider bg-[#f4e6ca] text-[#8e651e] border border-[#ebd2a0]">
              {isHindi ? node.levelLabel?.hi : node.levelLabel?.en}
            </span>
          )}

          {hasChildren && (
            <span className="text-[11px] sm:text-[11.5px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#f2e2c8] text-[#784e12]">
              {node.children.length}
            </span>
          )}

          <button
            type="button"
            onClick={() => onNavigateNode(node.id)}
            className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-[#e2cca4] bg-white px-2.5 py-1 text-[11px] sm:text-[11.5px] font-bold text-[#986411] hover:border-[#c88918] hover:bg-[#c88918] hover:text-white transition-all shadow-2xs"
          >
            <span className="hidden sm:inline">
              {node.type === "leaf"
                ? isHindi
                  ? "पढ़ें"
                  : "Read"
                : isHindi
                ? "देखें"
                : "View"}
            </span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Recursive Children Branches */}
      {hasChildren && isOpen && (
        <div className="relative mt-0.5 ml-4 sm:ml-5 pl-2.5 sm:pl-3.5 border-l-2 border-[#eddcc5] space-y-0.5">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              onNavigateNode={onNavigateNode}
              openNodes={openNodes}
              toggleNode={toggleNode}
              isHindi={isHindi}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LibraryTreePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isHindi } = useLibraryLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Default expanded root nodes for immediate, rich overview
  const [openNodes, setOpenNodes] = useState({
    "vedic-knowledge": true,
    veda: true,
    rigveda: true,
    "shastra-darshana": true,
    "itihasa-purana": true,
    ramayana: true,
    "devata-avatara-tattva": true,
    "dharma-jeevan": true,
    "shodasha-samskara": true,
    "puja-anushthana": true,
    "puja-vidhi": true,
    "yagya-homa": true,
  });

  const toggleNode = (id) => {
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all = {};
    const traverse = (nodes) => {
      nodes.forEach((n) => {
        all[n.id] = true;
        if (n.children) traverse(n.children);
      });
    };
    traverse(VEDA_HIERARCHY_TREE);
    setOpenNodes(all);
  };

  const collapseAll = () => {
    setOpenNodes({});
  };

  // Filter by Category and Search Query
  const filteredTree = useMemo(() => {
    let sourceTree = VEDA_HIERARCHY_TREE;
    if (selectedCategory !== "all") {
      sourceTree = VEDA_HIERARCHY_TREE.filter((cat) => cat.id === selectedCategory);
    }

    if (!searchQuery.trim()) return sourceTree;
    const q = searchQuery.toLowerCase().trim();

    const traverseFilter = (node) => {
      const match =
        node.title?.en?.toLowerCase().includes(q) ||
        node.title?.hi?.toLowerCase().includes(q) ||
        node.shortTitle?.en?.toLowerCase().includes(q) ||
        node.shortTitle?.hi?.toLowerCase().includes(q) ||
        node.sanskrit?.toLowerCase().includes(q) ||
        node.tagline?.en?.toLowerCase().includes(q) ||
        node.tagline?.hi?.toLowerCase().includes(q);

      let filteredChildren = [];
      if (node.children) {
        filteredChildren = node.children.map(traverseFilter).filter(Boolean);
      }

      if (match || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        };
      }
      return null;
    };

    return sourceTree.map(traverseFilter).filter(Boolean);
  }, [searchQuery, selectedCategory]);

  const handleNavigateNode = (id) => {
    navigate(`/library?node=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 text-[#2b241d]">
      {/* ============================================================== */}
      {/* STICKY TOP NAVIGATION BAR (Clean & Mobile-Friendly)            */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40 border-b border-[#ebd8b8] bg-[#fffdfa]/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/library")}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#ebd2a0] bg-[#fdf8ee] px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-bold text-[#8c651e] hover:bg-[#c88918] hover:text-white transition-all shadow-2xs"
              >
                <ArrowLeft size={16} />
                <span>{isHindi ? "पुस्तकालय" : "Library"}</span>
              </button>

              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#c88918] text-white shadow-xs">
                <Network size={20} />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#986411]">
                  <span>Vedic Architecture</span>
                  <span>✦</span>
                  <span className="font-serif">ज्ञान-वृक्ष</span>
                </div>
                <h1 className="font-serif text-[17px] sm:text-[20px] font-bold text-[#2b241d] leading-tight">
                  {isHindi ? "सम्पूर्ण वैदिक ज्ञान-वृक्ष" : "Interactive Vedic Knowledge Tree"}
                </h1>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="self-end sm:self-auto">
              <LanguageSwitcher variant="default" className="shadow-xs" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SEARCH & EXPAND / COLLAPSE CONTROLS BAR                        */}
        {/* ============================================================== */}
        <div className="border-t border-[#ebdcc4] bg-[#fbf6ea] px-4 sm:px-8 py-3">
          <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-full md:max-w-[480px]">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9b8571]">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? "ग्रंथ, काण्ड, सूक्त, मंत्र खोजें..."
                    : "Search grantha, kanda, sarga, sutra, mantra..."
                }
                className="w-full rounded-full border border-[#e2cca4] bg-white py-2 pl-9 pr-8 text-[13.5px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-1 focus:ring-[#c88918] shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="cursor-pointer absolute inset-y-0 right-2.5 flex items-center text-[#9e8f7f] hover:text-[#2b241d]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Expand / Collapse Buttons */}
            <div className="flex items-center gap-2 text-[12px] font-bold">
              <button
                type="button"
                onClick={expandAll}
                className="cursor-pointer flex-1 md:flex-none rounded-lg border border-[#ebd2a0] bg-white px-3.5 py-1.5 text-[#7a5518] hover:border-[#c88918] hover:bg-[#c88918] hover:text-white transition-all shadow-2xs text-center"
              >
                {isHindi ? "सब शाखाएँ खोलें" : "Expand All"}
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="cursor-pointer flex-1 md:flex-none rounded-lg border border-[#ebd2a0] bg-white px-3.5 py-1.5 text-[#7a5518] hover:border-[#c88918] hover:bg-[#c88918] hover:text-white transition-all shadow-2xs text-center"
              >
                {isHindi ? "सब समेटें" : "Collapse All"}
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Mobile Scrollable) */}
          <div className="mx-auto max-w-[1280px] mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-bold transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-[#2b241d] text-[#fffaf0] shadow-2xs"
                  : "border border-[#e2cca4] bg-white text-[#635546] hover:border-[#c88918]"
              }`}
            >
              {isHindi ? "सभी श्रेणियाँ" : "All Disciplines"}
            </button>

            {VEDA_HIERARCHY_TREE.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11.5px] font-bold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-[#c88918] text-white shadow-2xs"
                      : "border border-[#e2cca4] bg-white text-[#635546] hover:border-[#c88918]"
                  }`}
                >
                  <span>{cat.number}. </span>
                  <span>{isHindi ? cat.shortTitle?.hi : cat.shortTitle?.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN TREE CONTAINER (Full Page, Natural Scrolling)             */}
      {/* ============================================================== */}
      <div className="mx-auto max-w-[1180px] px-3 sm:px-8 mt-6">
        <div className="rounded-2xl sm:rounded-3xl border-2 border-[#ebd8b8] bg-white p-3.5 sm:p-7 shadow-[0_8px_30px_rgba(90,65,25,0.06)]">
          {/* Header Banner inside container */}
          <div className="mb-4 pb-3 border-b border-[#ebdcc4]/80 flex items-center justify-between">
            <div className="text-[12px] sm:text-[13px] text-[#7d6f5f]">
              {isHindi ? (
                <span>
                  शाखाओं का अन्वेषण करें। किसी भी नाम या{" "}
                  <strong className="text-[#986411]">"देखें →"</strong> पर क्लिक करने पर
                  संबंधित अध्याय या मंत्र खुल जाएगा।
                </span>
              ) : (
                <span>
                  Explore sacred branches. Click any name or{" "}
                  <strong className="text-[#986411]">"View →"</strong> to open that chapter or
                  verse directly.
                </span>
              )}
            </div>
            <span className="text-[11.5px] font-mono font-bold text-[#986411] hidden sm:inline">
              {filteredTree.length} {isHindi ? "मुख्य शाखाएँ" : "Main Branches"}
            </span>
          </div>

          {/* The Tree Nodes List */}
          <div className="space-y-1">
            {filteredTree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                onNavigateNode={handleNavigateNode}
                openNodes={openNodes}
                toggleNode={toggleNode}
                isHindi={isHindi}
                level={0}
              />
            ))}

            {filteredTree.length === 0 && (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#7d6f5f]">
                  {isHindi
                    ? "इस खोज के लिए कोई शाखा या मंत्र नहीं मिला।"
                    : "No matching branches or verses found for this search."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-3 cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#c88918] px-4 py-1.5 text-[12.5px] font-bold text-white shadow-sm hover:bg-[#b07817]"
                >
                  <span>{isHindi ? "सभी शाखाएँ पुनः देखें" : "Clear Filter"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryTreePage;
