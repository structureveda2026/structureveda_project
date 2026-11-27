import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  CheckCircle2,
  Maximize2,
  Minimize2,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { VedaNode } from "../types/veda.types";
import type { PuranaItihasaGrantha } from "../types/puranaItihasa.types";
import PuranaItihasaAdminService from "../services/puranaItihasa.service";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

// Grantha Quick Navigation Tabs
const QUICK_GRANTHAS = [
  { id: "vishnu-purana", label: "Vishnu Purana" },
  { id: "shrimad-bhagavata", label: "Shrimad Bhagavata" },
  { id: "shiva-purana", label: "Shiva Purana" },
  { id: "markandeya-purana", label: "Markandeya Purana" },
  { id: "valmiki-ramayana", label: "Valmiki Ramayana" },
  { id: "mahabharata", label: "Mahabharata" },
  { id: "bhagavad-gita", label: "Bhagavad Gita" },
];

// Node Type configurations for Purana & Itihasa
const PURANA_NODE_TYPES = [
  { value: "KANDA", label: "Kanda / Khanda", badgeClass: "bg-teal-50 text-teal-800 border-teal-200" },
  { value: "PARVA", label: "Parva (Mahabharata / Harivamsha)", badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { value: "SARGA", label: "Sarga (Ramayana / Mahakavya)", badgeClass: "bg-rose-50 text-rose-800 border-rose-200" },
  { value: "ADHYAYA", label: "Adhyaya (Chapter)", badgeClass: "bg-sky-50 text-sky-800 border-sky-200" },
  { value: "SAMHITA", label: "Samhita (Shiva Purana)", badgeClass: "bg-orange-50 text-orange-800 border-orange-200" },
  { value: "SUKTA", label: "Stotra / Sukta", badgeClass: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "VARGA", label: "Varga / Prakarana", badgeClass: "bg-purple-50 text-purple-800 border-purple-200" },
];

const getNodeTypeBadge = (type: string) => {
  const match = PURANA_NODE_TYPES.find((t) => t.value === type?.toUpperCase());
  if (match) return match;
  return {
    value: type,
    label: type,
    badgeClass: "bg-cream-100 text-charcoal-700 border-cream-200",
  };
};

export const PuranaItihasaStructureTreePage: React.FC = () => {
  const { id = "vishnu-purana" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [grantha, setGrantha] = useState<PuranaItihasaGrantha | null>(null);
  const [treeNodes, setTreeNodes] = useState<VedaNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Modal States
  const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
  const [editingNode, setEditingNode] = useState<VedaNode | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);

  // Delete State
  const [deletingNode, setDeletingNode] = useState<VedaNode | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form State for Node Modal
  const [nodeFormData, setNodeFormData] = useState<Partial<VedaNode>>({
    name: "",
    enName: "",
    slug: "",
    nodeType: "KANDA",
    stats: "",
    desc: "",
    orderIndex: 1,
    status: "ACTIVE",
  });
  const [nodeErrors, setNodeErrors] = useState<Record<string, string>>({});
  const [savingNode, setSavingNode] = useState<boolean>(false);

  // Fetch Tree & Grantha Details
  const fetchTreeData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await PuranaItihasaAdminService.getStructureTree(id);
      setGrantha(res.grantha);
      setTreeNodes(res.nodes || []);

      // Auto expand root nodes
      const initialExpanded: Record<string, boolean> = {};
      (res.nodes || []).forEach((node) => {
        initialExpanded[node.id] = true;
      });
      setExpandedNodes(initialExpanded);
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Unable to load structure tree"));
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  // Toggle Single Node
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Expand / Collapse All
  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    const traverse = (nodes: VedaNode[]) => {
      nodes.forEach((n) => {
        allExpanded[n.id] = true;
        if (n.children && n.children.length > 0) {
          traverse(n.children);
        }
      });
    };
    traverse(treeNodes);
    setExpandedNodes(allExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Node Count calculations
  const totalStats = useMemo(() => {
    let count = 0;
    let leaves = 0;

    const traverse = (nodes: VedaNode[]) => {
      nodes.forEach((n) => {
        count++;
        if (!n.children || n.children.length === 0) {
          leaves++;
        } else {
          traverse(n.children);
        }
      });
    };
    traverse(treeNodes);

    return { totalNodes: count, leafNodes: leaves };
  }, [treeNodes]);

  // Open Add Modal
  const openAddModal = (parentId: string | null = null) => {
    setEditingNode(null);
    setTargetParentId(parentId);
    setNodeFormData({
      name: "",
      enName: "",
      slug: "",
      nodeType: parentId ? "ADHYAYA" : "KANDA",
      stats: "",
      desc: "",
      orderIndex: 1,
      status: "ACTIVE",
    });
    setNodeErrors({});
    setIsNodeModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (node: VedaNode) => {
    setEditingNode(node);
    setTargetParentId(node.parentId || null);
    setNodeFormData({
      name: node.name,
      enName: node.enName || "",
      slug: node.slug,
      nodeType: node.nodeType || "ADHYAYA",
      stats: node.stats || "",
      desc: node.desc || "",
      orderIndex: node.orderIndex ?? 1,
      status: node.status || "ACTIVE",
    });
    setNodeErrors({});
    setIsNodeModalOpen(true);
  };

  // Save Node (Create or Update)
  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Record<string, string> = {};
    if (!nodeFormData.name?.trim()) {
      errs.name = "Name is required (e.g. Bala Kanda, Bhishma Parva, Chapter 1)";
    }
    if (Object.keys(errs).length > 0) {
      setNodeErrors(errs);
      return;
    }

    try {
      setSavingNode(true);
      const generatedSlug =
        nodeFormData.slug?.trim() ||
        (nodeFormData.enName || nodeFormData.name || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") ||
        `node-${Date.now()}`;

      if (editingNode) {
        // Update existing node
        await PuranaItihasaAdminService.updateNode(editingNode.id, {
          ...nodeFormData,
          slug: generatedSlug,
        });
        showSuccess(`Node "${nodeFormData.enName || nodeFormData.name}" updated successfully`);
      } else {
        // Create new node
        const newNodeId = `${id}-${generatedSlug}`;
        await PuranaItihasaAdminService.createNode({
          ...nodeFormData,
          id: newNodeId,
          slug: generatedSlug,
          vedaId: id,
          parentId: targetParentId,
        });
        showSuccess(`New node "${nodeFormData.enName || nodeFormData.name}" added successfully`);
      }

      setIsNodeModalOpen(false);
      await fetchTreeData();
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Error saving node"));
    } finally {
      setSavingNode(false);
    }
  };

  // Delete Node Confirmation
  const handleDeleteNodeConfirm = async () => {
    if (!deletingNode) return;
    try {
      setIsDeleting(true);
      await PuranaItihasaAdminService.deleteNode(deletingNode.id);
      showSuccess(`Node "${deletingNode.enName || deletingNode.name}" deleted successfully`);
      setDeletingNode(null);
      await fetchTreeData();
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Error deleting node"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: VedaNode, depth = 0) => {
    const isExpanded = Boolean(expandedNodes[node.id]);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const badgeConfig = getNodeTypeBadge(node.nodeType);

    // Apply search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      const matchSelf =
        node.name.toLowerCase().includes(q) ||
        (node.enName && node.enName.toLowerCase().includes(q)) ||
        (node.desc && node.desc.toLowerCase().includes(q));

      const hasMatchingChild = (children?: VedaNode[]): boolean => {
        if (!children) return false;
        return children.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.enName && c.enName.toLowerCase().includes(q)) ||
            hasMatchingChild(c.children)
        );
      };

      if (!matchSelf && !hasMatchingChild(node.children)) {
        return null;
      }
    }

    return (
      <div key={node.id} className="relative group">
        <div
          className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
            depth === 0
              ? "bg-white border-cream-300 hover:border-saffron-300 shadow-xs mb-2"
              : "bg-cream-50/60 border-cream-200 hover:border-cream-300 hover:bg-cream-100/50 my-1.5"
          }`}
          style={{ marginLeft: `${depth * 28}px` }}
        >
          {/* Left: Expander + Badge + Name + Stats */}
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {/* Toggle button or dot */}
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleNode(node.id)}
                className="p-1 rounded hover:bg-cream-200 text-charcoal-500 hover:text-charcoal-800 transition mt-0.5 shrink-0"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-saffron-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                )}
              </button>
            ) : (
              <span className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cream-400" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Node Type Badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${badgeConfig.badgeClass}`}
                >
                  {badgeConfig.label.split(" (")[0]}
                </span>

                {/* Node Title */}
                <span className="font-bold text-sm sm:text-base text-charcoal-900">
                  {node.enName || node.name}
                </span>

                {/* Secondary Name */}
                {node.name && node.enName && node.name !== node.enName && (
                  <span className="text-xs text-charcoal-500 font-medium hidden sm:inline">
                    ({node.name})
                  </span>
                )}

                {/* Stats Pill */}
                {node.stats && (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {node.stats}
                  </span>
                )}
              </div>

              {/* Description */}
              {node.desc && (
                <p className="text-xs text-charcoal-500 mt-1 line-clamp-1">
                  {node.desc}
                </p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Shlokas link */}
            <Link
              to={`/admin/purana-itihasa/${id}/shlokas?nodeId=${node.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
              title="View and manage shlokas for this section"
            >
              <Scroll className="w-3 h-3 text-amber-700" />
              <span className="hidden sm:inline">Shlokas</span>
            </Link>

            {/* Add Child Node */}
            <button
              onClick={() => openAddModal(node.id)}
              className="p-1.5 rounded-lg text-saffron-700 hover:bg-saffron-50 border border-transparent hover:border-saffron-200 transition"
              title="Add Child Node"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Edit Node */}
            <button
              onClick={() => openEditModal(node)}
              className="p-1.5 rounded-lg text-charcoal-600 hover:bg-cream-200 transition"
              title="Edit Node"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            {/* Delete Node */}
            <button
              onClick={() => setDeletingNode(node)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
              title="Delete Node"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Grantha Context & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-saffron-700 mb-1">
            <Link
              to="/admin/purana-itihasa"
              className="hover:underline flex items-center gap-1 text-charcoal-500 hover:text-saffron-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Purana &amp; Itihasa Archive
            </Link>
            <span>/</span>
            <span className="text-charcoal-700 font-bold">Structure Tree</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-serif flex items-center gap-2">
              <FolderTree className="w-7 h-7 text-saffron-500" />
              <span>{grantha?.enName || grantha?.name || "Grantha Structure Tree"}</span>
            </h1>

            {grantha && grantha.name && grantha.name !== grantha.enName && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
                {grantha.name}
              </span>
            )}
          </div>

          <p className="text-xs text-charcoal-500 mt-1 max-w-2xl">
            {grantha?.stats || "Hierarchical tree view of Kandas, Parvas, Sargas, Amshas, and Adhyayas."}{" "}
            Shlokas can be added and edited under each node.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/admin/purana-itihasa/${id}/edit`}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Grantha Details</span>
          </Link>

          <Link
            to={`/admin/purana-itihasa/${id}/shlokas`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-semibold text-xs hover:bg-amber-100 transition shadow-xs"
          >
            <Scroll className="w-3.5 h-3.5 text-amber-700" />
            <span>Manage All Shlokas</span>
          </Link>

          <button
            onClick={() => openAddModal(null)}
            className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Root Node</span>
          </button>
        </div>
      </div>

      {/* 2. Grantha Quick-Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-cream-200">
        <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider shrink-0 pr-2">
          Quick Select:
        </span>
        {QUICK_GRANTHAS.map((g) => {
          const isActive = g.id === id;
          return (
            <button
              key={g.id}
              onClick={() => navigate(`/admin/purana-itihasa/${g.id}/structure`)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                isActive
                  ? "bg-saffron-500 text-white shadow-xs"
                  : "bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* 3. Hierarchy Metrics Bar & Tree Controls */}
      <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-charcoal-600">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-900 text-sm">{totalStats.totalNodes}</span>
            <span>Total Nodes</span>
          </div>
          <span className="text-cream-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-900 text-sm">{totalStats.leafNodes}</span>
            <span>Chapters / Sub-units</span>
          </div>
          <span className="text-cream-300">•</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Structure Active</span>
          </div>
        </div>

        {/* Tree Search & Expand/Collapse Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search nodes or chapters..."
              className="input-field pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>

          <button
            onClick={expandAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-100 text-charcoal-700 text-xs font-medium hover:bg-cream-200 transition shrink-0"
            title="Expand all nodes"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand All</span>
          </button>

          <button
            onClick={collapseAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-100 text-charcoal-700 text-xs font-medium hover:bg-cream-200 transition shrink-0"
            title="Collapse all nodes"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collapse All</span>
          </button>
        </div>
      </div>

      {/* 4. Visual Tree View Canvas */}
      <div className="card p-6 min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center text-charcoal-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-saffron-500 mb-2" />
            <p className="text-sm font-medium">Loading structure tree...</p>
          </div>
        ) : treeNodes.length === 0 ? (
          <div className="py-20 text-center text-charcoal-500">
            <FolderTree className="w-12 h-12 mx-auto text-charcoal-300 mb-3" />
            <h3 className="text-base font-bold text-charcoal-800">
              No structure nodes in this grantha yet
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              You can add the first root node (Kanda, Parva, Sarga, or Amsha).
            </p>
            <button
              onClick={() => openAddModal(null)}
              className="btn-primary text-xs mt-4"
            >
              Add First Node
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {treeNodes.map((node) => renderTreeNode(node, 0))}
          </div>
        )}
      </div>

      {/* 5. Add / Edit Node Modal */}
      <Modal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        title={
          editingNode
            ? `Edit Node: ${editingNode.enName || editingNode.name}`
            : targetParentId
            ? "Add Child Node"
            : "Add Root Node"
        }
        size="md"
      >
        <form onSubmit={handleSaveNode} className="space-y-4">
          {/* Node Type */}
          <div>
            <label className="label-field">Node Type</label>
            <select
              value={nodeFormData.nodeType || "ADHYAYA"}
              onChange={(e) =>
                setNodeFormData({
                  ...nodeFormData,
                  nodeType: e.target.value as VedaNode["nodeType"],
                })
              }
              className="input-field text-sm font-semibold"
            >
              {PURANA_NODE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hindi Name */}
          <div>
            <label className="label-field">
              Hindi / Sanskrit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nodeFormData.name || ""}
              onChange={(e) => {
                setNodeFormData({ ...nodeFormData, name: e.target.value });
                if (nodeErrors.name) setNodeErrors({ ...nodeErrors, name: "" });
              }}
              placeholder="e.g. Prathama Amsha, Bala Kanda, Bhishma Parva, Chapter 1"
              className={`input-field font-devanagari font-semibold ${
                nodeErrors.name ? "border-red-400" : ""
              }`}
            />
            {nodeErrors.name && (
              <p className="text-xs text-red-600 mt-1">{nodeErrors.name}</p>
            )}
          </div>

          {/* English Name, Hinglish Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label-field">English Title</label>
              <input
                type="text"
                value={nodeFormData.enName || ""}
                onChange={(e) => setNodeFormData({ ...nodeFormData, enName: e.target.value })}
                placeholder="e.g. Bala Kanda, Chapter 1"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="label-field">Hinglish Title</label>
              <input
                type="text"
                value={nodeFormData.hinglishName || ""}
                onChange={(e) => setNodeFormData({ ...nodeFormData, hinglishName: e.target.value })}
                placeholder="e.g. Bala Kand, Adhyay 1"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="label-field">Slug / Key</label>
              <input
                type="text"
                value={nodeFormData.slug || ""}
                onChange={(e) => setNodeFormData({ ...nodeFormData, slug: e.target.value })}
                placeholder="bala-kanda"
                className="input-field text-xs font-mono"
              />
            </div>
          </div>

          {/* Stats Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Shlokas / Stats</label>
              <input
                type="text"
                value={nodeFormData.stats || ""}
                onChange={(e) => setNodeFormData({ ...nodeFormData, stats: e.target.value })}
                placeholder="e.g. 50 Shlokas, 25 Sargas"
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="label-field">Order Index</label>
              <input
                type="number"
                value={nodeFormData.orderIndex ?? 1}
                onChange={(e) =>
                  setNodeFormData({ ...nodeFormData, orderIndex: Number(e.target.value) })
                }
                className="input-field text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-field">Description</label>
            <textarea
              rows={3}
              value={nodeFormData.desc || ""}
              onChange={(e) => setNodeFormData({ ...nodeFormData, desc: e.target.value })}
              placeholder="Key narrative or shloka theme of this section or chapter..."
              className="input-field text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
            <button
              type="button"
              onClick={() => setIsNodeModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingNode}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              {savingNode ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{editingNode ? "Update Node" : "Add Node"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 6. Delete Node Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingNode)}
        title="Confirm Node Deletion"
        message={`Are you sure you want to delete node "${deletingNode?.enName || deletingNode?.name}"? Child nodes linked under it may also be affected.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        danger
        loading={isDeleting}
        onConfirm={handleDeleteNodeConfirm}
        onClose={() => setDeletingNode(null)}
      />
    </div>
  );
};

export default PuranaItihasaStructureTreePage;
