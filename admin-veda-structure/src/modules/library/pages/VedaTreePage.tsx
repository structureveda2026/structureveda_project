import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Veda, VedaNode } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";
import VedaNodeModal from "../components/VedaNodeModal";

export const VedaTreePage: React.FC = () => {
  const { id = "rigveda" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [veda, setVeda] = useState<Veda | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
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

  const fetchTree = async () => {
    try {
      setLoading(true);
      const data = await VedaAdminService.getVedaTree(id);
      setVeda(data);
      // Auto expand top level
      if (data && data.tree) {
        const exp: Record<string, boolean> = {};
        data.tree.forEach((t) => {
          exp[t.id] = true;
          if (t.children) {
            t.children.forEach((c) => {
              exp[c.id] = true;
            });
          }
        });
        setExpandedNodes(exp);
      }
    } catch (err: any) {
      showToast(err.message || "संरचना ट्री लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [id]);

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
      showToast(`नोड "${deleteTarget.name}" हटाया गया`, "success");
      setDeleteTarget(null);
      fetchTree();
    } catch (err: any) {
      showToast(err.message || "नोड हटाने में विफल", "error");
    }
  };

  const renderNode = (node: VedaNode, depth = 0) => {
    const isExpanded = expandedNodes[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        <div
          className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
            depth === 0
              ? "bg-amber-50/80 border-amber-200 font-bold"
              : depth === 1
              ? "bg-white border-cream-200 ml-5"
              : depth === 2
              ? "bg-[#fffdfa] border-cream-200/80 ml-10"
              : "bg-white border-cream-200 ml-14"
          } hover:border-saffron-400 shadow-2xs`}
        >
          {/* Left Title Info */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 rounded-md text-charcoal-500 hover:text-saffron-700 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-saffron-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-charcoal-400" />
                )}
              </button>
            ) : (
              <span className="w-6 text-center text-stone-300">•</span>
            )}

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                node.nodeType === "SHAKHA"
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : node.nodeType === "SAMHITA"
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : node.nodeType === "SUKTA"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {node.badge || node.nodeType}
            </span>

            <div className="truncate">
              <span className="font-serif text-sm text-charcoal-900 font-bold block truncate">
                {node.name}
              </span>
              {node.enName && (
                <span className="text-[11px] text-charcoal-500 block truncate">
                  {node.enName}
                </span>
              )}
            </div>

            {node.stats && (
              <span className="text-[11px] text-charcoal-400 hidden sm:inline-block font-mono shrink-0">
                ({node.stats})
              </span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            {/* Direct link to add/view mantras under this sukta */}
            {node.nodeType === "SUKTA" || node.nodeType === "ADHYAYA" ? (
              <Link
                to={`/admin/library/mantras?nodeId=${node.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors shadow-2xs"
                title="इस सूक्त के मंत्र देखें व जोड़ें"
              >
                <Scroll className="w-3 h-3 text-emerald-600" />
                <span>मंत्र प्रबंध</span>
              </Link>
            ) : null}

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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-saffron-50 text-saffron-800 hover:bg-saffron-100 border border-saffron-200 font-bold transition-colors shadow-2xs"
              title="इसके अंदर उप-शाखा / सूक्त जोड़ें"
            >
              <Plus className="w-3 h-3" />
              <span>उप-प्रकार जोड़ें</span>
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() =>
                setActiveModal({
                  isOpen: true,
                  parentId: node.parentId,
                  initialData: node,
                })
              }
              className="p-1.5 text-charcoal-500 hover:text-saffron-700 rounded-lg hover:bg-cream-100 transition-colors"
              title="संपादित करें"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => setDeleteTarget(node)}
              className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="हटाएं"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recursive Child Rendering */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={veda ? `${veda.name} की शाखाएँ व संरचना (Hierarchy Tree)` : "संरचना ट्री"}
        subtitle="वेदों के अंतर्गत शाखाएँ, संहिताएँ, मण्डल, काण्ड, अध्याय एवं सूक्तों का संगठन"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/library/vedas"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>वेद सूची</span>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>मुख्य शाखा जोड़ें</span>
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-xs text-charcoal-400">
          संरचना ट्री लोड हो रही है...
        </div>
      ) : !veda || !veda.tree || veda.tree.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 shadow-2xs space-y-3">
          <p className="font-serif text-lg font-bold text-charcoal-800">
            इस वेद में अभी कोई शाखा या सूक्त नहीं है।
          </p>
          <button
            type="button"
            onClick={() =>
              setActiveModal({
                isOpen: true,
                parentId: null,
                initialData: null,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white text-xs font-bold shadow-xs hover:bg-saffron-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>प्रथम शाखा जोड़ें</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3 mb-2">
            <h3 className="font-serif text-sm font-bold text-charcoal-800 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-saffron-600" />
              <span>{veda.name} का संपूर्ण वांग्मय एवं सूक्त क्रम ({veda.tree.length} मुख्य शाखाएँ)</span>
            </h3>
            <span className="text-[11px] text-charcoal-400">
              शाखा पर क्लिक करके सब-नोड्स खोलें / बंद करें
            </span>
          </div>

          <div className="space-y-3">
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="नोड हटाएं (Delete Node)"
        message={`क्या आप निश्चित रूप से "${deleteTarget?.name}" को हटाना चाहते हैं? इसके अंतर्गत आने वाले उप-प्रकार व सूक्त भी हट जाएंगे।`}
        confirmLabel="हटाएं"
        variant="danger"
        onConfirm={handleDeleteNode}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default VedaTreePage;
