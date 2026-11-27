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
  Scroll,
  Search,
  Maximize2,
  Minimize2,
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
    label: "Shakha",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  SAMHITA: {
    label: "Samhita",
    badgeClass: "bg-orange-100 text-orange-900 border-orange-300",
  },
  BRAHMANA: {
    label: "Brahmana",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
  },
  ARANYAKA: {
    label: "Aranyaka",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  UPANISHAD: {
    label: "Upanishad",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
  },
  SUKTA: {
    label: "Sukta",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
  },
  ADHYAYA: {
    label: "Adhyaya",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
  },
  MANDALA: {
    label: "Mandala",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
  },
  KANDA: {
    label: "Kanda",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300",
  },
  SUTRA: {
    label: "Sutra",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
  },
  VARGA: {
    label: "Varga",
    badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
  },
  PARVA: {
    label: "Parva",
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
  { id: "rigveda", label: "Rigveda" },
  { id: "yajurveda", label: "Yajurveda" },
  { id: "samaveda", label: "Samaveda" },
  { id: "atharvaveda", label: "Atharvaveda" },
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load structure tree";
      showToast(msg || "Failed to load structure tree", "error");
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
      showToast(`Node "${deleteTarget.enName || deleteTarget.name}" deleted successfully`, "success");
      setDeleteTarget(null);
      fetchTree();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete node";
      showToast(msg || "Failed to delete node", "error");
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
      node.mantraId ||
        node.nodeType === "SUKTA" ||
        node.nodeType === "ADHYAYA" ||
        !node.children?.length
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
                title={isExpanded ? "Collapse" : "Expand child branches"}
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
                <span className="font-serif text-xs sm:text-sm font-bold text-charcoal-900 block truncate">
                  {node.enName || node.name}
                </span>
                {hasChildren && (
                  <span className="text-[9px] font-semibold text-charcoal-400 bg-cream-100 px-1.5 py-0.2 rounded-full shrink-0">
                    {node.children!.length} sub-nodes
                  </span>
                )}
              </div>
              {node.name && node.enName && node.name !== node.enName && (
                <span className="text-[10px] text-charcoal-500 block truncate font-sans">
                  {node.name}
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
            {/* Quick View Mantras Shortcut Button */}
            {hasMantraShortcut && (
              <Link
                to={`/admin/library/mantras?vedaId=${veda?.id || id}&nodeId=${node.id}&sectionRef=${encodeURIComponent(node.enName || node.name || typeConfig.label)}${
                  node.mantraId ? `&mantraId=${node.mantraId}` : ""
                }`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-all shadow-2xs hover:shadow-xs"
                title="View and manage mantras linked to this section"
              >
                <Scroll className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Mantras</span>
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
              title="Add child branch / sukta"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Child Node</span>
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
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </button>

            {/* Delete Node */}
            <button
              type="button"
              onClick={() => setDeleteTarget(node)}
              className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete"
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
          {(() => {
            const categoryPath = (veda?.category || "").toLowerCase();
            const backRoute =
              categoryPath === "purana"
                ? "/admin/library/puranas"
                : categoryPath === "itihasa"
                ? "/admin/library/itihasas"
                : categoryPath === "upanishad"
                ? "/admin/library/upanishads"
                : categoryPath === "darshana"
                ? "/admin/library/darshanas"
                : "/admin/library/vedas";

            const backLabel =
              categoryPath === "purana"
                ? "All Puranas"
                : categoryPath === "itihasa"
                ? "All Itihasas"
                : categoryPath === "upanishad"
                ? "All Upanishads"
                : categoryPath === "darshana"
                ? "All Darshanas"
                : "All Vedas";

            return (
              <Link
                to={backRoute}
                className="hover:text-saffron-700 transition-colors flex items-center gap-1 font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backLabel}</span>
              </Link>
            );
          })()}
          <span className="text-charcoal-300">/</span>
          <span className="font-bold text-charcoal-800">
            {veda?.enName || veda?.name || "Scripture"}
          </span>
          <span className="text-charcoal-300">/</span>
          <span className="text-saffron-700 font-semibold">Structure Tree</span>
        </div>

        {/* Quick Add Node Modal Trigger */}
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/library/mantras?vedaId=${veda?.id || id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-charcoal-800 text-xs font-semibold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <Scroll className="w-3 h-3 text-saffron-600" />
            <span>Mantras List</span>
          </Link>

          <Link
            to={`/admin/library/mantras/new?vedaId=${encodeURIComponent(veda?.id || id)}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Mantra</span>
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
            <span>Add New Node</span>
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
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-200">
                {veda?.badge || "Shruti Scripture"}
              </span>
              {veda?.priest && (
                <span className="text-[11px] font-semibold text-charcoal-600">
                  Chief Priest: <strong>{veda.priest}</strong>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-charcoal-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-saffron-600 shrink-0" />
              <span>{veda?.enName || veda?.name} — Branches &amp; Hierarchy Tree</span>
            </h1>

            <p className="text-xs text-charcoal-500 max-w-2xl leading-relaxed">
              {veda?.intro ||
                veda?.desc ||
                "Authentic organization and relationships across Shakhas, Samhitas, Mandalas, Kandas, Adhyayas, and Suktas."}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-center">
              <span className="block text-[9px] font-bold uppercase text-amber-700">
                Total Nodes
              </span>
              <strong className="text-sm font-bold text-amber-950 font-mono">
                {totalNodesCount}
              </strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-center">
              <span className="block text-[9px] font-bold uppercase text-rose-700">
                Suktas &amp; Adhyayas
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
                placeholder="Search suktas, shakhas, or samhitas in tree..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs border border-cream-200 bg-white text-charcoal-700 font-semibold focus:border-saffron-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="SHAKHA">Shakha</option>
              <option value="SAMHITA">Samhita</option>
              <option value="BRAHMANA">Brahmana</option>
              <option value="ARANYAKA">Aranyaka</option>
              <option value="UPANISHAD">Upanishad</option>
              <option value="SUKTA">Sukta</option>
              <option value="ADHYAYA">Adhyaya</option>
            </select>
          </div>

          {/* Expand All / Collapse All controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 font-semibold border border-cream-200 transition-colors cursor-pointer text-xs"
              title="Expand all nodes"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Expand All</span>
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 font-semibold border border-cream-200 transition-colors cursor-pointer text-xs"
              title="Collapse all nodes"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tree Content Area */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-cream-200 text-center space-y-2.5">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-charcoal-500">Loading Vedic structure tree...</p>
        </div>
      ) : !veda || !veda.tree || veda.tree.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 flex items-center justify-center text-saffron-600">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-800">
              No shakhas or suktas registered for this Veda yet.
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              Start building the hierarchical structure by adding the first root node.
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
            <span>Add First Root Branch</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
          {/* Legend Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-[10px] border-b border-cream-100">
            <span className="font-bold text-charcoal-500 uppercase shrink-0 text-[9px]">
              Legend:
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-amber-100 text-amber-900 border-amber-300 font-bold shrink-0">
              Shakha
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-orange-100 text-orange-900 border-orange-300 font-bold shrink-0">
              Samhita
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-purple-100 text-purple-900 border-purple-300 font-bold shrink-0">
              Brahmana
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shrink-0">
              Aranyaka
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-blue-100 text-blue-900 border-blue-300 font-bold shrink-0">
              Upanishad
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-rose-100 text-rose-900 border-rose-300 font-bold shrink-0">
              Sukta
            </span>
            <span className="px-1.5 py-0.2 rounded-full border bg-indigo-100 text-indigo-900 border-indigo-300 font-bold shrink-0">
              Adhyaya
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
        title="Delete Node"
        message={`Are you sure you want to delete "${deleteTarget?.enName || deleteTarget?.name}"? All child nodes, suktas, and related references under it will also be removed.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteNode}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default VedaTreePage;
