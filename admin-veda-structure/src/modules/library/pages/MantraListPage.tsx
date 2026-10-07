import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Scroll,
  Plus,
  Search,
  Filter,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Languages,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { VedaMantra } from "../types/veda.types";
import VedaMantraAdminService from "../services/vedaMantra.service";
import BulkMantraModal from "../components/BulkMantraModal";

export const MantraListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [mantras, setMantras] = useState<VedaMantra[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [vedaFilter, setVedaFilter] = useState(searchParams.get("vedaId") || "all");
  const [nodeFilter, setNodeFilter] = useState(searchParams.get("nodeId") || "");
  const [deleteTarget, setDeleteTarget] = useState<VedaMantra | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const fetchMantras = async () => {
    try {
      setLoading(true);
      const res = await VedaMantraAdminService.getMantras({
        page,
        limit,
        vedaId: vedaFilter !== "all" ? vedaFilter : undefined,
        nodeId: nodeFilter || undefined,
        search: search.trim() || undefined,
        status: "ALL",
      });
      setMantras(res.mantras || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      showToast(err.message || "मंत्र सूची लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMantras();
  }, [page, vedaFilter, nodeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMantras();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaMantraAdminService.deleteMantra(deleteTarget.id);
      showToast(`मंत्र "${deleteTarget.mantraNumber}" हटाया गया`, "success");
      setDeleteTarget(null);
      fetchMantras();
    } catch (err: any) {
      showToast(err.message || "मंत्र हटाने में विफल", "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="मंत्र एवं सूक्त प्रबंधन (Vedic Mantras & Suktas)"
        subtitle="ऋग्वेद एवं यजुर्वेद के समस्त मंत्र, पदच्छेद (Padapatha), हिंदी, अंग्रेजी एवं हिंग्लिश भावार्थ"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-amber-700" />
              <span>बल्क JSON अपलोड (Bulk Upload)</span>
            </button>

            <Link
              to="/admin/library/mantras/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया मंत्र जोड़ें</span>
            </Link>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between"
        >
          {/* Veda Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {[
              { id: "all", label: "सभी वेद" },
              { id: "rigveda", label: "ऋग्वेद (Rigveda)" },
              { id: "yajurveda", label: "यजुर्वेद (Yajurveda)" },
              { id: "samaveda", label: "सामवेद (Samaveda)" },
              { id: "atharvaveda", label: "अथर्ववेद (Atharvaveda)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setVedaFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  vedaFilter === tab.id
                    ? "bg-saffron-600 text-white shadow-2xs"
                    : "bg-cream-50 text-charcoal-700 hover:bg-cream-100 border border-cream-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="मंत्र संख्या, ऋषि, देवता, संस्कृत..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800 transition-colors"
            >
              खोजें
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setVedaFilter("all");
                setNodeFilter("");
                setPage(1);
                fetchMantras();
              }}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-800 rounded-lg hover:bg-cream-100 transition-colors"
              title="रीसेट"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {nodeFilter && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span>फ़ील्ड फ़िल्टर सक्रिय: <strong>{nodeFilter}</strong></span>
            <button
              type="button"
              onClick={() => setNodeFilter("")}
              className="text-[11px] underline font-bold cursor-pointer"
            >
              फ़िल्टर हटाएं
            </button>
          </div>
        )}
      </div>

      {/* Mantras Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-charcoal-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">मंत्र संख्या व ID</th>
                <th className="py-3 px-4">वेद एवं सूक्त / अध्याय</th>
                <th className="py-3 px-4">संस्कृत मूल मंत्र</th>
                <th className="py-3 px-4">भावार्थ (हिंदी / Eng / Hinglish)</th>
                <th className="py-3 px-4">ऋषि • देवता • छंद</th>
                <th className="py-3 px-4 text-right">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    डेटा लोड हो रहा है...
                  </td>
                </tr>
              ) : mantras.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    कोई मंत्र नहीं मिला। नया मंत्र जोड़ने के लिए "नया मंत्र जोड़ें" या "Bulk Upload" बटन दबाएं।
                  </td>
                </tr>
              ) : (
                mantras.map((m) => (
                  <tr key={m.id} className="hover:bg-cream-50/50 transition-colors">
                    {/* 1. Mantra ID & Number */}
                    <td className="py-3 px-4 align-top">
                      <span className="font-bold text-saffron-700 font-mono block">
                        {m.mantraNumber}
                      </span>
                      <span className="text-[10px] text-charcoal-400 font-mono block">
                        {m.id}
                      </span>
                    </td>

                    {/* 2. Veda & Section */}
                    <td className="py-3 px-4 align-top max-w-[200px]">
                      <span className="text-xs font-bold text-charcoal-900 block truncate">
                        {m.textName}
                      </span>
                      <span className="text-[11px] text-charcoal-500 block truncate">
                        {m.sectionRef}
                      </span>
                      {m.shakha && (
                        <span className="text-[10px] text-saffron-600 block truncate">
                          {m.shakha}
                        </span>
                      )}
                    </td>

                    {/* 3. Sanskrit text snippet */}
                    <td className="py-3 px-4 align-top max-w-[280px]">
                      <p className="font-devanagari text-xs text-charcoal-900 font-bold line-clamp-2 leading-relaxed">
                        {m.sanskrit}
                      </p>
                      {m.transliteration && (
                        <p className="font-serif italic text-[11px] text-charcoal-500 line-clamp-1 mt-0.5">
                          {m.transliteration}
                        </p>
                      )}
                    </td>

                    {/* 4. Multilingual Meanings Snippet */}
                    <td className="py-3 px-4 align-top max-w-[280px]">
                      <div className="space-y-1">
                        <p className="font-devanagari text-[11px] text-charcoal-700 line-clamp-2 leading-relaxed">
                          <strong className="text-amber-800">हिं:</strong> {m.hindiTranslation}
                        </p>
                        {m.hinglishTranslation && (
                          <p className="text-[10px] text-charcoal-500 line-clamp-1">
                            <strong className="text-blue-800">Hing:</strong> {m.hinglishTranslation}
                          </p>
                        )}
                        {m.padapatha && m.padapatha.length > 0 && (
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                            {m.padapatha.length} पद पदार्थ
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Rishi, Devata, Chhanda */}
                    <td className="py-3 px-4 align-top text-[11px] space-y-0.5 max-w-[150px]">
                      {m.rishi && (
                        <div className="truncate">
                          <span className="text-charcoal-400">ऋषि:</span>{" "}
                          <span className="font-semibold text-charcoal-800">{m.rishi}</span>
                        </div>
                      )}
                      {m.devata && (
                        <div className="truncate">
                          <span className="text-charcoal-400">देवता:</span>{" "}
                          <span className="font-semibold text-charcoal-800">{m.devata}</span>
                        </div>
                      )}
                      {m.chhanda && (
                        <div className="truncate">
                          <span className="text-charcoal-400">छंद:</span>{" "}
                          <span className="text-charcoal-600">{m.chhanda}</span>
                        </div>
                      )}
                    </td>

                    {/* 6. Actions */}
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/library/mantras/${m.id}`}
                          className="p-1.5 text-charcoal-500 hover:text-saffron-700 rounded-lg hover:bg-cream-100 transition-colors"
                          title="विवरण देखें"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/library/mantras/${m.id}/edit`}
                          className="p-1.5 text-charcoal-500 hover:text-saffron-700 rounded-lg hover:bg-cream-100 transition-colors"
                          title="संपादित करें"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-cream-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      <BulkMantraModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSuccess={() => {
          fetchMantras();
          showToast("बल्क मंत्र अपलोड सफल!", "success");
        }}
        defaultVedaId={vedaFilter !== "all" ? vedaFilter : "rigveda"}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="मंत्र हटाएं (Delete Mantra)"
        message={`क्या आप निश्चित रूप से मंत्र "${deleteTarget?.mantraNumber}" (${deleteTarget?.id}) को हटाना चाहते हैं?`}
        confirmLabel="हटाएं"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MantraListPage;
