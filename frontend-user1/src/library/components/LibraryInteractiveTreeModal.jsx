import { useState, useMemo } from "react";
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Scroll,
  BookOpen,
  Compass,
  Sun,
  Flame,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { VEDA_HIERARCHY_TREE } from "../data/vedaHierarchyData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

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
  activeNodeId,
  onSelectNode,
  openNodes,
  toggleNode,
  isHindi,
  level = 0,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = !!openNodes[node.id];
  const isActive = activeNodeId === node.id;
  const Icon = getTreeIcon(node);

  const title = isHindi ? node.shortTitle?.hi || node.title?.hi : node.shortTitle?.en || node.title?.en;

  return (
    <div className="text-[13.5px] select-none">
      <div
        className={`group flex items-center justify-between rounded-xl px-3 py-2 transition-all cursor-pointer ${
          isActive
            ? "bg-[#c88918] text-white shadow-xs font-semibold"
            : "text-[#3b3126] hover:bg-[#faedd8]/80 hover:text-[#1e1710]"
        }`}
        style={{ paddingLeft: `${Math.max(12, level * 20 + 12)}px` }}
        onClick={() => onSelectNode(node.id)}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className={`p-1 rounded-md transition hover:bg-black/10 shrink-0 ${
                isActive ? "text-white" : "text-[#8c7762]"
              }`}
            >
              {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : (
            <span className={`w-4 h-4 flex items-center justify-center shrink-0 ${isActive ? "text-white" : "text-[#bcaaa0]"}`}>
              •
            </span>
          )}

          <Icon
            size={16}
            className={`shrink-0 ${isActive ? "text-white" : "text-[#c88918]"}`}
          />

          <span className="truncate font-medium" title={title}>
            {title}
          </span>

          {node.sanskrit && (
            <span
              className={`font-serif text-[12px] truncate hidden sm:inline ${
                isActive ? "text-white/80" : "text-[#8a7258]"
              }`}
            >
              ({node.sanskrit})
            </span>
          )}
        </div>

        {/* Level badge / Child count */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {node.levelLabel && (
            <span
              className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[#f4e6ca] text-[#8e651e]"
              }`}
            >
              {isHindi ? node.levelLabel?.hi : node.levelLabel?.en}
            </span>
          )}

          {hasChildren && (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isActive
                  ? "bg-white/30 text-white"
                  : "bg-[#ebd9bc] text-[#694812]"
              }`}
            >
              {node.children.length}
            </span>
          )}
        </div>
      </div>

      {/* Children Branches */}
      {hasChildren && isOpen && (
        <div className="relative mt-0.5 ml-5 pl-2 border-l-2 border-[#ebdcc4] space-y-0.5">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              activeNodeId={activeNodeId}
              onSelectNode={onSelectNode}
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

const LibraryInteractiveTreeModal = ({
  isOpen,
  onClose,
  activeNodeId,
  onSelectNode,
}) => {
  const { isHindi } = useLibraryLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Default all root categories open for rich immediate exploration
  const [openNodes, setOpenNodes] = useState({
    "vedic-knowledge": true,
    "veda": true,
    "rigveda": true,
    "shastra-darshana": true,
    "itihasa-purana": true,
    "ramayana": true,
    "dharma-jeevan": true,
    "shodasha-samskara": true,
    "puja-anushthana": true,
    "puja-vidhi": true,
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

  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return VEDA_HIERARCHY_TREE;
    const q = searchQuery.toLowerCase().trim();

    const traverseFilter = (node) => {
      const match =
        node.title?.en?.toLowerCase().includes(q) ||
        node.title?.hi?.toLowerCase().includes(q) ||
        node.shortTitle?.en?.toLowerCase().includes(q) ||
        node.shortTitle?.hi?.toLowerCase().includes(q) ||
        node.sanskrit?.toLowerCase().includes(q);

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

    return VEDA_HIERARCHY_TREE.map(traverseFilter).filter(Boolean);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-3xl border-2 border-[#e6d0a7] bg-[#fffdfa] shadow-[0_24px_60px_rgba(40,25,10,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#ebd8b8] bg-gradient-to-r from-[#faf3e3] via-[#fffbf3] to-[#faf3e3] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c88918] text-white shadow-xs">
              <Scroll size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[17px] sm:text-[19px] font-bold text-[#2b241d]">
                  {isHindi ? "सम्पूर्ण वैदिक ज्ञान-वृक्ष" : "Interactive Vedic Knowledge Tree"}
                </span>
                <span className="text-[#c88918]">✦</span>
                <span className="font-serif text-[13px] text-[#8c651e] hidden sm:inline">
                  वेदों से लेकर अनुष्ठानों तक
                </span>
              </div>
              <p className="text-[11.5px] text-[#7d6f5f]">
                {isHindi
                  ? "किसी भी शाखा या मंत्र पर क्लिक करके सीधे पृष्ठ पर पहुँचें"
                  : "Explore complete hierarchical branches from Vedas to Yagyas. Click any node to navigate."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e2c8] text-[#4d3f32] transition hover:bg-[#c88918] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* Search & Tree Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#ebdcc4] bg-[#fffcf7] px-6 py-3">
          <div className="relative flex-1 max-w-[500px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "वृक्ष में कोई भी ग्रंथ, काण्ड, या मंत्र खोजें..." : "Search grantha, mandala, kanda, sutra, or mantra in tree..."}
              className="w-full rounded-full border border-[#ebd8b8] bg-white py-2 pl-9 pr-4 text-[13px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-1 focus:ring-[#c88918]"
            />
            <Search size={15} className="absolute left-3.5 top-3 text-[#9e8f7f]" />
          </div>

          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#796754]">
            <button
              type="button"
              onClick={expandAll}
              className="cursor-pointer rounded-lg border border-[#e2cca4] bg-white px-3 py-1.5 transition hover:border-[#c88918] hover:text-[#c88918]"
            >
              {isHindi ? "सब शाखाएँ खोलें" : "Expand All"}
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="cursor-pointer rounded-lg border border-[#e2cca4] bg-white px-3 py-1.5 transition hover:border-[#c88918] hover:text-[#c88918]"
            >
              {isHindi ? "सब समेटें" : "Collapse All"}
            </button>
          </div>
        </div>

        {/* Scrollable Tree View Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1.5 scrollbar-thin scrollbar-thumb-[#ebd6b0]">
          {filteredTree.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              activeNodeId={activeNodeId}
              onSelectNode={(id) => {
                onSelectNode(id);
                onClose();
              }}
              openNodes={openNodes}
              toggleNode={toggleNode}
              isHindi={isHindi}
              level={0}
            />
          ))}
        </div>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between border-t border-[#ebd8b8] bg-[#faf3e3] px-6 py-3 text-[12px] text-[#7d6f5f]">
          <span>
            {isHindi ? "सनातन ज्ञानकोष डिजिटल पुस्तकालय" : "Sanatana Jnana-Kosha Digital Repository"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-bold text-[#c88918] hover:underline"
          >
            {isHindi ? "बंद करें" : "Close Explorer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryInteractiveTreeModal;
