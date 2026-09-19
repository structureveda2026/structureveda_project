import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  BookOpen,
  Scroll,
  Compass,
  Sun,
  Flame,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
} from "lucide-react";
import { VEDA_HIERARCHY_TREE } from "../data/vedaHierarchyData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const getNodeIcon = (node) => {
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
  return ChevronRight;
};

const TreeNodeItem = ({
  node,
  activeNodeId,
  onSelectNode,
  openMap,
  toggleOpen,
  isHindi,
  level = 0,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = !!openMap[node.id];
  const isActive = activeNodeId === node.id;
  const Icon = getNodeIcon(node);

  const title = isHindi ? node.shortTitle?.hi || node.title?.hi : node.shortTitle?.en || node.title?.en;

  return (
    <div className="select-none text-[13px]">
      <div
        className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 transition-all duration-150 cursor-pointer ${
          isActive
            ? "bg-[#c88918] text-white font-semibold shadow-xs"
            : "text-[#4b3f33] hover:bg-[#faedd8]/70 hover:text-[#2b241d]"
        }`}
        style={{ paddingLeft: `${Math.max(10, level * 14 + 10)}px` }}
        onClick={() => onSelectNode(node.id)}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 py-0.5">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen(node.id);
              }}
              className={`p-0.5 rounded-md transition hover:bg-black/10 shrink-0 ${
                isActive ? "text-white" : "text-[#947f69]"
              }`}
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${isActive ? "text-white" : "text-[#b29f8a]"}`}>
              •
            </span>
          )}

          {level === 0 && (
            <Icon
              size={15}
              className={`shrink-0 ${isActive ? "text-white" : "text-[#c88918]"}`}
            />
          )}

          <span className="truncate" title={title}>
            {title}
          </span>
        </div>

        {/* Count / Badge */}
        {hasChildren && (
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ml-1.5 ${
              isActive
                ? "bg-white/25 text-white"
                : "bg-[#f4e6ce] text-[#8e651e] group-hover:bg-[#edd9bc]"
            }`}
          >
            {node.children.length}
          </span>
        )}
      </div>

      {/* Nested Children */}
      {hasChildren && isOpen && (
        <div className="mt-0.5 border-l border-[#ebdcc4] ml-4 pl-1 space-y-0.5">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              activeNodeId={activeNodeId}
              onSelectNode={onSelectNode}
              openMap={openMap}
              toggleOpen={toggleOpen}
              isHindi={isHindi}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LibrarySidebarTree = ({
  activeNodeId,
  onSelectNode,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { isHindi } = useLibraryLanguage();
  const [filterQuery, setFilterQuery] = useState("");

  // Default open map with root categories open
  const [openMap, setOpenMap] = useState({
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

  const toggleOpen = (id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all = {};
    const markAll = (nodes) => {
      nodes.forEach((n) => {
        all[n.id] = true;
        if (n.children) markAll(n.children);
      });
    };
    markAll(VEDA_HIERARCHY_TREE);
    setOpenMap(all);
  };

  const collapseAll = () => {
    setOpenMap({});
  };

  // Filter tree nodes if query entered
  const filteredTree = useMemo(() => {
    if (!filterQuery.trim()) return VEDA_HIERARCHY_TREE;
    const q = filterQuery.toLowerCase().trim();

    const filterNode = (node) => {
      const matchTitle =
        node.title?.en?.toLowerCase().includes(q) ||
        node.title?.hi?.toLowerCase().includes(q) ||
        node.shortTitle?.en?.toLowerCase().includes(q) ||
        node.shortTitle?.hi?.toLowerCase().includes(q) ||
        node.sanskrit?.toLowerCase().includes(q);

      let matchingChildren = [];
      if (node.children) {
        matchingChildren = node.children
          .map(filterNode)
          .filter(Boolean);
      }

      if (matchTitle || matchingChildren.length > 0) {
        return {
          ...node,
          children: matchingChildren.length > 0 ? matchingChildren : node.children,
        };
      }
      return null;
    };

    return VEDA_HIERARCHY_TREE.map(filterNode).filter(Boolean);
  }, [filterQuery]);

  if (isCollapsed) {
    return (
      <aside className="shrink-0">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="cursor-pointer flex items-center gap-2 rounded-2xl border border-[#ebd2a0] bg-[#fffdf9] p-3 text-[#79634e] shadow-sm hover:border-[#c88918] hover:text-[#c88918] transition-all"
          title="Open Knowledge Navigation Sidebar"
        >
          <PanelLeftOpen size={18} />
          <span className="text-[12px] font-bold writing-mode-vertical sm:hidden">
            {isHindi ? "ज्ञान सूची" : "Index"}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[310px] shrink-0">
      <div className="sticky top-24 rounded-3xl border-2 border-[#ebd8b8] bg-[#fffdfa] p-4 shadow-[0_8px_30px_rgba(90,65,25,0.05)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c88918] text-white">
              <Scroll size={14} />
            </div>
            <div>
              <h3 className="font-serif text-[14px] font-bold text-[#2b241d]">
                {isHindi ? "ज्ञान कोष संरचना" : "Knowledge Index"}
              </h3>
              <p className="text-[10.5px] text-[#867563]">
                {isHindi ? "पदानुक्रमिक वैदिक अनुक्रमणिका" : "Hierarchical Vedic Index"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="cursor-pointer rounded-lg p-1.5 text-[#867563] hover:bg-[#faedd8] hover:text-[#2b241d] transition"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>

        {/* Search inside Sidebar */}
        <div className="relative mb-3">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={isHindi ? "ग्रंथ या शाखा खोजें..." : "Filter branch or text..."}
            className="w-full rounded-xl border border-[#e5d4b8] bg-white py-1.5 pl-8 pr-3 text-[12px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-1 focus:ring-[#c88918]"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-[#9e8f7f]" />
        </div>

        {/* Expand / Collapse Controls */}
        <div className="flex items-center justify-between px-1 mb-2 text-[11px] text-[#867563]">
          <button
            type="button"
            onClick={expandAll}
            className="cursor-pointer hover:text-[#c88918] font-medium"
          >
            {isHindi ? "सब खोलें" : "Expand All"}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="cursor-pointer hover:text-[#c88918] font-medium"
          >
            {isHindi ? "सब समेटें" : "Collapse All"}
          </button>
        </div>

        {/* Tree Nodes List */}
        <div className="max-h-[calc(100vh-320px)] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-[#ebd6b0]">
          {filteredTree.length > 0 ? (
            filteredTree.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                activeNodeId={activeNodeId}
                onSelectNode={onSelectNode}
                openMap={openMap}
                toggleOpen={toggleOpen}
                isHindi={isHindi}
                level={0}
              />
            ))
          ) : (
            <div className="py-6 text-center text-[12px] text-[#867563]">
              {isHindi ? "कोई परिणाम नहीं मिला" : "No branches found"}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default LibrarySidebarTree;
