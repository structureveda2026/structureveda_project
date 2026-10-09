import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Layers,
  Scroll,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ExternalLink,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Veda, VedaNode } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";
import VedaNodeModal from "../components/VedaNodeModal";

interface NodeTypeBadgeConfig {
  label: string;
  badgeClass: string;
}

const NODE_TYPE_MAP: Record<string, NodeTypeBadgeConfig> = {
  SHAKHA: {
    label: "शाखा (Shakha)",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  SAMHITA: {
    label: "संहिता (Samhita)",
    badgeClass: "bg-orange-100 text-orange-900 border-orange-300",
  },
  BRAHMANA: {
    label: "ब्राह्मण (Brahmana)",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
  },
  ARANYAKA: {
    label: "आरण्यक (Aranyaka)",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  UPANISHAD: {
    label: "उपनिषद (Upanishad)",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
  },
  SUKTA: {
    label: "सूक्त (Sukta)",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
  },
  ADHYAYA: {
    label: "अध्याय (Adhyaya)",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  MANDALA: {
    label: "मण्डल (Mandala)",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
  },
  KANDA: {
    label: "काण्ड (Kanda)",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300",
  },
  SUTRA: {
    label: "सूत्र (Sutra)",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
  },
  VARGA: {
    label: "वर्ग (Varga)",
    badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
  },
  PARVA: {
    label: "पर्व (Parva)",
    badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
  },
};

const getNodeTypeConfig = (type: string): NodeTypeBadgeConfig => {
  return (
    NODE_TYPE_MAP[type.toUpperCase()] || {
      label: type,
      badgeClass: "bg-cream-200 text-charcoal-800 border-cream-300",
    }
  );
};

const VEDA_QUICK_TABS = [
  { id: "rigveda", label: "ऋग्वेद (Rigveda)" },
  { id: "yajurveda", label: "यजुर्वेद (Yajurveda)" },
  { id: "samaveda", label: "सामवेद (Samaveda)" },
  { id: "atharvaveda", label: "अथर्ववेद (Atharvaveda)" },
];

export const VedaTreePage: React.FC = () => {
  const { id = "rigveda" } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [veda, setVeda] = useState<Veda | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    parentId?: string | null;
    initialData?: VedaNode | null;
  }>({
    isOpen: false,
    parentId: null,
    initialData: null,
  });

  const [deleteTarget, setDeleteTarget] = useState<VedaNode | null>(null);

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const data = await VedaAdminService.getVedaTree(id);
      setVeda(data);

      // Auto-expand all top-level and second-level nodes by default
      if (data && data.tree) {
        const exp: Record<string, boolean> = {};
        const expandRecursive = (nodes: VedaNode[], currentDepth: number) => {
          nodes.forEach((n) => {
            if (currentDepth <= 2) {
              exp[n.id] = true;
            }
            if (n.children && n.children.length > 0) {
              expandRecursive(n.children, currentDepth + 1);
            }
          });
        };
        expandRecursive(data.tree, 0);
        setExpandedNodes(exp);
      }
    } catch (err: any) {
      showToast(err.message || "संरचना ट्री लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // Recursively collect all nodes in flat array for counting and matching
  const allNodesFlat = useMemo(() => {
    const list: VedaNode[] = [];
    const traverse = (nodes?: VedaNode[]) => {
      if (!nodes) return;
      nodes.forEach((n) => {
        list.push(n);
        if (n.children && n.children.length > 0) {
          traverse(n.children);
        }
      });
    };
    traverse(veda?.tree);
    return list;
  }, [veda]);

  const totalNodesCount = allNodesFlat.length;

  const totalSuktasCount = useMemo(() => {
    return allNodesFlat.filter(
      (n) => n.nodeType === "SUKTA" || n.nodeType === "ADHYAYA"
    ).length;
  }, [allNodesFlat]);

  // Expand all / Collapse all helpers
  const handleExpandAll = () => {
    const exp: Record<string, boolean> = {};
    allNodesFlat.forEach((n) => {
      exp[n.id] = true;
    });
    setExpandedNodes(exp);
  };

  const handleCollapseAll = () => {
    setExpandedNodes({});
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleDeleteNode = async () => {
    if (!deleteTarget) return;
    try {
      await VedaAdminService.deleteNode(deleteTarget.id);
      showToast(`नोड "${deleteTarget.name}" सफलतापूर्वक हटाया गया`, "success");
      setDeleteTarget(null);
      fetchTree();
    } catch (err: any) {
      showToast(err.message || "नोड हटाने में विफल", "error");
    }
  };

  // Node matching logic for search & filter
  const isNodeMatching = useCallback(
    (node: VedaNode): boolean => {
      const q = search.trim().toLowerCase();
      const matchesText =
        !q ||
        node.name?.toLowerCase().includes(q) ||
        node.enName?.toLowerCase().includes(q) ||
        node.desc?.toLowerCase().includes(q) ||
        node.stats?.toLowerCase().includes(q) ||
        node.nodeType?.toLowerCase().includes(q);

      const matchesType =
        typeFilter === "ALL" || node.nodeType === typeFilter;

      return matchesText && matchesType;
    },
    [search, typeFilter]
  );

  // Check if node itself or any descendant matches filter
  const nodeOrDescendantMatches = useCallback(
    (node: VedaNode): boolean => {
      if (isNodeMatching(node)) return true;
      if (node.children && node.children.length > 0) {
        return node.children.some((child) => nodeOrDescendantMatches(child));
      }
      return false;
    },
    [isNodeMatching]
  );

  // If search or type filter changes, automatically expand matching branches
  useEffect(() => {
    if (search.trim() || typeFilter !== "ALL") {
      const exp: Record<string, boolean> = {};
      const autoExpandMatches = (nodes: VedaNode[]) => {
        nodes.forEach((n) => {
          if (nodeOrDescendantMatches(n)) {
            exp[n.id] = true;
          }
          if (n.children && n.children.length > 0) {
            autoExpandMatches(n.children);
          }
        });
      };
      if (veda?.tree) {
        autoExpandMatches(veda.tree);
      }
      setExpandedNodes((prev) => ({ ...prev, ...exp }));
    }
  }, [search, typeFilter, veda, nodeOrDescendantMatches]);

  const renderNode = (node: VedaNode, depth = 0) => {
    // Check if node or its descendants match active filter
    if (search.trim() || typeFilter !== "ALL") {
      if (!nodeOrDescendantMatches(node)) {
        return null;
      }
    }

    const isExpanded = expandedNodes[node.id] ?? false;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isDirectMatch = isNodeMatching(node);
    const typeConfig = getNodeTypeConfig(node.nodeType);
    const hasMantraShortcut = Boolean(
      node.mantraId || node.nodeType === "SUKTA" || node.nodeType === "ADHYAYA"
    );

    // Depth-aware card styling
    let cardBgStyle = "bg-white border-cream-200/90";
    if (depth === 0) {
      cardBgStyle = "bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border-amber-300 shadow-2xs";
    } else if (depth === 1) {
      cardBgStyle = "bg-gradient-to-r from-saffron-50/50 via-white to-cream-50/60 border-cream-300";
    } else if (depth === 2) {
      cardBgStyle = "bg-[#fffdfb] border-cream-200";
    }

    if (isDirectMatch && (search.trim() || typeFilter !== "ALL")) {
      cardBgStyle += " ring-2 ring-saffron-400 bg-amber-50/40";
    }

    return (
      <div key={node.id} className="relative space-y-1.5">
        {/* Node Container Card */}
        <div
          className={`group flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 hover:border-saffron-400 hover:shadow-2xs ${cardBgStyle}`}
        >
          {/* Left Info Column */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
            {/* Expand / Collapse Button */}
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded-md text-charcoal-500 hover:text-saffron-700 hover:bg-amber-100/60 transition-colors cursor-pointer shrink-0"
                title={isExpanded ? "बंद करें" : "उप-शाखाएँ खोलें"}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-saffron-600" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-saffron-600" />
                )}
              </button>
            ) : (
              <div className="w-6 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-300 group-hover:bg-saffron-400 transition-colors" />
              </div>
            )}

            {/* Distinct Node Type Badge */}
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${typeConfig.badgeClass} shadow-2xs`}
            >
              {node.badge || typeConfig.label}
            </span>

            {/* Node Title & English translation */}
            <div className="min-w-0 flex-1 truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 block truncate font-devanagari">
                  {node.name}
                </span>
                {hasChildren && (
                  <span className="text-[9px] font-semibold text-charcoal-400 bg-cream-100 px-1.5 py-0.2 rounded-full shrink-0">
                    {node.children!.length} उप-नोड
                  </span>
                )}
              </div>
              {node.enName && (
                <span className="text-[10px] text-charcoal-500 block truncate font-sans">
                  {node.enName}
                </span>
              )}
            </div>

            {/* Authentic Structure Stat Badge */}
            {node.stats && (
              <span className="text-[10px] text-charcoal-500 hidden md:inline-block font-mono bg-cream-100/80 px-2 py-0.5 rounded-md border border-cream-200/80 shrink-0">
                {node.stats}
              </span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 text-xs">
            {/* Quick "मंत्र देखें" Shortcut Button */}
            {hasMantraShortcut && (
              <Link
                to={`/admin/library/mantras?vedaId=${veda?.id || id}&nodeId=${node.id}${
                  node.mantraId ? `&mantraId=${node.mantraId}` : ""
                }`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-all shadow-2xs hover:shadow-xs"
                title="इस सूक्त के सिद्ध मंत्र देखें व प्रबंधित करें"
              >
                <Scroll className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">मंत्र</span>
              </Link>
            )}

            {/* Add Child Node */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  isOpen: true,
                  parentId: node.id,
                  initialData: null,
                })
              }
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-saffron-50 text-saffron-800 hover:bg-saffron-100 border border-saffron-200 text-[11px] font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              title="इसके अंतर्गत उप-शाखा / सूक्त जोड़ें"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">उप-नोड</span>
            </button>

            {/* Edit Node */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  isOpen: true,
                  parentId: node.parentId,
                  initialData: node,
                })
              }
              className="p-1 text-charcoal-500 hover:text-saffron-700 rounded-md hover:bg-cream-100 transition-colors cursor-pointer"
              title="संपादित करें (Edit)"
            >
              <Edit className="w-3 h-3" />
            </button>

            {/* Delete Node */}
            <button
              type="button"
              onClick={() => setDeleteTarget(node)}
              className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
              title="हटाएं (Delete)"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recursive Child Nodes with Guided Tree Connection Line */}
        {hasChildren && isExpanded && (
          <div className="relative ml-3 sm:ml-5 pl-3 sm:pl-4 border-l-2 border-amber-300/40 space-y-1.5 pt-0.5 pb-0.5">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
          <Link
            to="/admin/library/vedas"
            className="hover:text-saffron-700 transition-colors flex items-center gap-1 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वेद सूची (All Vedas)</span>
          </Link>
          <span className="text-charcoal-300">/</span>
          <span className="font-bold text-charcoal-800 font-devanagari">
            {veda?.name || "वेद"}
          </span>
          <span className="text-charcoal-300">/</span>
          <span className="text-saffron-700 font-semibold">संरचना ट्री</span>
        </div>

        {/* Quick Add Node Modal Trigger */}
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/library/mantras?vedaId=${veda?.id || id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-charcoal-800 text-xs font-semibold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <Scroll className="w-3 h-3 text-saffron-600" />
            <span>मंत्र सूची</span>
          </Link>

          <button
            type="button"
            onClick={() =>
              setActiveModal({
                isOpen: true,
                parentId: null,
                initialData: null,
              })
            }
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-500 hover:to-amber-500 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>नया नोड जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Veda Quick Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-cream-200">
        {VEDA_QUICK_TABS.map((tab) => {
          const isActive = tab.id === id;
          return (
            <Link
              key={tab.id}
              to={`/admin/library/vedas/${tab.id}/structure`}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-devanagari shrink-0 transition-all ${
                isActive
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Header Banner Summary - Compact */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-200 font-devanagari">
                {veda?.badge || "श्रुति ग्रंथ"}
              </span>
              {veda?.priest && (
                <span className="text-[11px] font-semibold text-charcoal-600">
                  प्रधान ऋत्विक: <strong>{veda.priest}</strong>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-saffron-600 shrink-0" />
              <span>{veda?.name} की शाखाएँ एवं पदानुक्रम (Hierarchy Tree)</span>
            </h1>

            <p className="text-xs text-charcoal-500 font-devanagari max-w-2xl leading-relaxed">
              {veda?.intro ||
                veda?.desc ||
                "वेदों के अंतर्गत शाखाएँ, संहिताएँ, मण्डल, काण्ड, अध्याय एवं सूक्तों का प्रामाणिक संगठन व संबंध।"}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-center">
              <span className="block text-[9px] font-bold uppercase text-amber-700">
                कुल नोड्स
              </span>
              <strong className="text-sm font-bold text-amber-950 font-mono">
                {totalNodesCount}
              </strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-center">
              <span className="block text-[9px] font-bold uppercase text-rose-700">
                सूक्त व अध्याय
              </span>
              <strong className="text-sm font-bold text-rose-950 font-mono">
                {totalSuktasCount}
              </strong>
            </div>
          </div>
        </div>

        {/* Controls: Search, Filter, Expand/Collapse */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-cream-100">
          {/* Real-time search filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ट्री में सूक्त, शाखा या संहिता खोजें..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari transition-colors"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs border border-cream-200 bg-white text-charcoal-700 font-semibold focus:border-saffron-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">सभी प्रकार (All)</option>
              <option value="SHAKHA">शाखा (Shakha)</option>
              <option value="SAMHITA">संहिता (Samhita)</option>
              <option value="BRAHMANA">ब्राह्मण (Brahmana)</option>
              <option value="ARANYAKA">आरण्यक (Aranyaka)</option>
              <option value="UPANISHAD">उपनिषद (Upanishad)</option>
              <option value="SUKTA">सूक्त (Sukta)</option>
              <option value="ADHYAYA">अध्याय (Adhyaya)</option>
            </select>
          </div>

          {/* Expand All / Collapse All controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 font-semibold border border-cream-200 transition-colors cursor-pointer text-xs"
              title="समस्त नोड्स खोलें"
            >
              <Maximize2 className="w-3 h-3" />
              <span>सभी खोलें</span>
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 font-semibold border border-cream-200 transition-colors cursor-pointer text-xs"
              title="समस्त नोड्स बंद करें"
            >
              <Minimize2 className="w-3 h-3" />
              <span>सभी बंद करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tree Content Area */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-cream-200 text-center space-y-2.5">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-charcoal-500">वैदिक संरचना ट्री लोड हो रही है...</p>
        </div>
      ) : !veda || !veda.tree || veda.tree.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 flex items-center justify-center text-saffron-600">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-800">
              इस वेद में अभी कोई शाखा या सूक्त पंजीकृत नहीं है।
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              प्रथम मुख्य शाखा (Root Node) जोड़कर अपनी वैदिक संरचना का निर्माण प्रारंभ करें।
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setActiveModal({
                isOpen: true,
                parentId: null,
                initialData: null,
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-saffron-600 text-white text-xs font-bold shadow-2xs hover:bg-saffron-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>प्रथम मुख्य शाखा जोड़ें</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
          {/* Legend Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-[10px] border-b border-cream-100">
            <span className="font-bold text-charcoal-500 uppercase shrink-0 text-[9px]">
              संकेतक:
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-amber-100 text-amber-900 border-amber-300 font-bold shrink-0">
              शाखा
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-orange-100 text-orange-900 border-orange-300 font-bold shrink-0">
              संहिता
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-purple-100 text-purple-900 border-purple-300 font-bold shrink-0">
              ब्राह्मण
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shrink-0">
              आरण्यक
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-blue-100 text-blue-900 border-blue-300 font-bold shrink-0">
              उपनिषद
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-rose-100 text-rose-900 border-rose-300 font-bold shrink-0">
              सूक्त
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-indigo-100 text-indigo-900 border-indigo-300 font-bold shrink-0">
              अध्याय
            </span>
          </div>

          {/* Render Root Nodes */}
          <div className="space-y-2 pt-0.5">
            {veda.tree.map((rootNode) => renderNode(rootNode, 0))}
          </div>
        </div>
      )}

      {/* Node Add/Edit Modal */}
      <VedaNodeModal
        isOpen={activeModal.isOpen}
        onClose={() =>
          setActiveModal({ isOpen: false, parentId: null, initialData: null })
        }
        onSuccess={fetchTree}
        vedaId={id}
        parentId={activeModal.parentId}
        initialData={activeModal.initialData}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="नोड हटाएं (Delete Node)"
        message={`क्या आप निश्चित रूप से "${deleteTarget?.name}" को हटाना चाहते हैं? इसके अंतर्गत आने वाले सभी उप-नोड्स, सूक्त व संबंधित संदर्भ भी हट जाएंगे।`}
        confirmLabel="हटाएं (Delete)"
        variant="danger"
        onConfirm={handleDeleteNode}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default VedaTreePage;
