import React, { useState, useEffect, useMemo } from "react";
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
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Check,
  X,
  Sparkles,
  Flame,
  Feather,
  CheckCircle2,
  BookMarked,
  Layers,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { VedaMantra } from "../types/veda.types";
import VedaMantraAdminService from "../services/vedaMantra.service";
import BulkMantraModal from "../components/BulkMantraModal";

const VEDA_PILLS = [
  { id: "all", label: "सभी वेद", enLabel: "All Vedas" },
  { id: "rigveda", label: "ऋग्वेद", enLabel: "Rigveda", badgeBg: "bg-amber-100 text-amber-900 border-amber-300" },
  { id: "yajurveda", label: "यजुर्वेद", enLabel: "Yajurveda", badgeBg: "bg-orange-100 text-orange-900 border-orange-300" },
  { id: "samaveda", label: "सामवेद", enLabel: "Samaveda", badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  { id: "atharvaveda", label: "अथर्ववेद", enLabel: "Atharvaveda", badgeBg: "bg-purple-100 text-purple-900 border-purple-300" },
];

export const MantraListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [mantras, setMantras] = useState<VedaMantra[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);

  // View Mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<"table" | "grid">(
    (searchParams.get("view") as "table" | "grid") || "table"
  );

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [vedaFilter, setVedaFilter] = useState(searchParams.get("vedaId") || "all");
  const [nodeFilter, setNodeFilter] = useState(searchParams.get("nodeId") || "");
  const [deleteTarget, setDeleteTarget] = useState<VedaMantra | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update query params when key filters change
  const updateQueryParams = (newVeda: string, newSearch: string, newPage: number, newView: "table" | "grid") => {
    const params: Record<string, string> = {};
    if (newVeda && newVeda !== "all") params.vedaId = newVeda;
    if (newSearch) params.search = newSearch;
    if (newPage > 1) params.page = String(newPage);
    if (newView !== "table") params.view = newView;
    if (nodeFilter) params.nodeId = nodeFilter;
    setSearchParams(params, { replace: true });
  };

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
    updateQueryParams(vedaFilter, search, page, viewMode);
  }, [page, vedaFilter, nodeFilter, viewMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMantras();
    updateQueryParams(vedaFilter, search, 1, viewMode);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    updateQueryParams(vedaFilter, "", 1, viewMode);
    // trigger refetch with empty search
    setTimeout(() => {
      fetchMantras();
    }, 0);
  };

  const handleCopySanskrit = (m: VedaMantra, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(m.sanskrit);
    setCopiedId(m.id);
    showToast(`मंत्र (${m.mantraNumber}) संस्कृत प्रतिलिपि की गई!`, "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaMantraAdminService.deleteMantra(deleteTarget.id);
      showToast(`मंत्र "${deleteTarget.mantraNumber}" सफलतापूर्वक हटाया गया`, "success");
      setDeleteTarget(null);
      fetchMantras();
    } catch (err: any) {
      showToast(err.message || "मंत्र हटाने में विफल", "error");
    }
  };

  // Language & Padapatha statistics calculation
  const stats = useMemo(() => {
    const hindiCount = mantras.filter((m) => Boolean(m.hindiTranslation?.trim())).length;
    const engCount = mantras.filter((m) => Boolean(m.englishTranslation?.trim())).length;
    const hingCount = mantras.filter((m) => Boolean(m.hinglishTranslation?.trim())).length;
    const padaCount = mantras.filter((m) => m.padapatha && m.padapatha.length > 0).length;
    return {
      hindiCount,
      engCount,
      hingCount,
      padaCount,
      totalLoaded: mantras.length,
    };
  }, [mantras]);

  // Veda Badge helper
  const getVedaBadge = (vedaId: string) => {
    switch (vedaId) {
      case "rigveda":
        return { name: "ऋग्वेद", bg: "bg-amber-100 text-amber-900 border-amber-300" };
      case "yajurveda":
        return { name: "यजुर्वेद", bg: "bg-orange-100 text-orange-900 border-orange-300" };
      case "samaveda":
        return { name: "सामवेद", bg: "bg-emerald-100 text-emerald-900 border-emerald-300" };
      case "atharvaveda":
        return { name: "अथर्ववेद", bg: "bg-purple-100 text-purple-900 border-purple-300" };
      default:
        return { name: "वैदिक संहिता", bg: "bg-cream-200 text-charcoal-800 border-cream-300" };
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Page Header */}
      <PageHeader
        title="मंत्र एवं सूक्त प्रबंधन (Vedic Mantras & Suktas)"
        subtitle="ऋग्वेद, यजुर्वेद, सामवेद एवं अथर्ववेद के समस्त मूल मंत्र, सस्वर पाठ, पदच्छेद व ३-भाषी भावार्थ"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-all shadow-2xs cursor-pointer hover:border-amber-400"
            >
              <Upload className="w-3 h-3 text-amber-700" />
              <span>बल्क JSON</span>
            </button>

            <Link
              to="/admin/library/mantras/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white text-xs font-bold shadow-2xs transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>नया मंत्र</span>
            </Link>
          </div>
        }
      />

      {/* Compact Vedic Stats Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: कुल मंत्र */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-medium text-charcoal-500 truncate block">
              कुल मंत्र (Total Mantras)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 font-devanagari tracking-tight leading-none">
                {total.toLocaleString("hi-IN")}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-saffron-50 text-saffron-700 border-saffron-200/80">
                वैदिक ऋचाएँ
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-saffron-50 text-saffron-600 border border-saffron-200/60">
            <Scroll className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2: सस्वर पाठ */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-medium text-charcoal-500 truncate block">
              सस्वर पाठ (Svara Richas)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 font-devanagari tracking-tight leading-none">
                {total > 0 ? total.toLocaleString("hi-IN") : "१०,५५२"}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-amber-50 text-amber-800 border-amber-200/80">
                उदात्त-अनुदात्त
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 text-amber-700 border border-amber-200/60">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: ३-भाषा अनुवाद स्थिति */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-medium text-charcoal-500 truncate block">
              ३-भाषा अनुवाद (Translations)
            </span>
            <div className="flex items-center gap-1 pt-0.5">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                हि {stats.hindiCount > 0 ? "✓" : ""}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                En {stats.engCount > 0 ? "✓" : ""}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200/80">
                Hg {stats.hingCount > 0 ? "✓" : ""}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-700 border border-blue-200/60">
            <Languages className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 4: पदच्छेद व पदार्थ */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[11px] font-medium text-charcoal-500 truncate block">
              पदच्छेद (Padapatha)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 font-devanagari tracking-tight leading-none">
                {stats.padaCount} / {stats.totalLoaded}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200/80">
                पदार्थ युक्त
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Filter & Control Toolbar */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-cream-200/90 shadow-2xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Veda Filter Segmented Bar with Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {VEDA_PILLS.map((tab) => {
              const isActive = vedaFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setVedaFilter(tab.id);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-saffron-600 to-saffron-500 text-white shadow-2xs"
                      : "bg-cream-50 text-charcoal-700 hover:bg-cream-100 border border-cream-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id !== "all" && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-cream-200 text-charcoal-600"
                      }`}
                    >
                      {tab.enLabel.slice(0, 3)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar & View Switcher */}
          <div className="flex items-center gap-2">
            {/* Real-time search form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="मंत्र संख्या, ऋषि, देवता, संस्कृत..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari bg-cream-50/40 focus:bg-white transition-all shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-700 rounded-full hover:bg-cream-200 transition-colors"
                  title="खोज साफ़ करें"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={handleSearchSubmit}
              className="px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800 transition-colors shadow-2xs cursor-pointer"
            >
              खोजें
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 bg-cream-100 rounded-lg border border-cream-200">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="तालिका दृश्य (Table View)"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
                title="कार्ड दृश्य (Grid View)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setVedaFilter("all");
                setNodeFilter("");
                setPage(1);
                fetchMantras();
              }}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-800 rounded-lg hover:bg-cream-100 border border-cream-200 transition-colors cursor-pointer"
              title="रीसेट फ़िल्टर"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Node Filter alert if active */}
        {nodeFilter && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[11px]">सक्रिय सूक्त/अध्याय फ़िल्टर:</span>
              <code className="bg-amber-100/80 px-1.5 py-0.2 rounded font-mono text-[10px] text-amber-950">
                {nodeFilter}
              </code>
            </div>
            <button
              type="button"
              onClick={() => {
                setNodeFilter("");
                setPage(1);
              }}
              className="text-[10px] underline font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              फ़िल्टर हटाएं
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Table View vs Grid View */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] border-b border-cream-200 text-charcoal-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">मंत्र संख्या व ID</th>
                  <th className="py-2.5 px-3">वेद एवं शाखा</th>
                  <th className="py-2.5 px-3 min-w-[240px]">संस्कृत मूल मंत्र (सस्वर)</th>
                  <th className="py-2.5 px-3">ऋषि • देवता • छंद</th>
                  <th className="py-2.5 px-3">भाषा स्थिति</th>
                  <th className="py-2.5 px-3 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-charcoal-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-saffron-500 animate-spin" />
                        <span className="font-medium text-xs">वैदिक मंत्र डेटा लोड हो रहा है...</span>
                      </div>
                    </td>
                  </tr>
                ) : mantras.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-charcoal-400">
                      <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto">
                        <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-charcoal-400">
                          <Scroll className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-charcoal-700 text-xs">कोई मंत्र नहीं मिला</p>
                        <p className="text-[11px] text-charcoal-400 text-center">
                          वर्तमान खोज या फ़िल्टर के अनुसार कोई परिणाम नहीं मिला। नया मंत्र जोड़ने के लिए "नया मंत्र" या "बल्क JSON" चुनें।
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  mantras.map((m) => {
                    const vedaBadge = getVedaBadge(m.vedaId);
                    return (
                      <tr key={m.id} className="hover:bg-[#FFFDF9] transition-colors group">
                        {/* 1. Mantra ID & Number */}
                        <td className="py-2.5 px-3 align-top">
                          <div className="space-y-0.5">
                            <span className="inline-block px-1.5 py-0.2 rounded bg-saffron-50 border border-saffron-200 font-bold text-saffron-800 font-devanagari text-[11px]">
                              {m.mantraNumber}
                            </span>
                            <span className="text-[9px] text-charcoal-400 font-mono block">
                              {m.id}
                            </span>
                          </div>
                        </td>

                        {/* 2. Veda & Shakha tags */}
                        <td className="py-2.5 px-3 align-top max-w-[180px]">
                          <div className="space-y-0.5">
                            <span
                              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border ${vedaBadge.bg}`}
                            >
                              {vedaBadge.name}
                            </span>
                            <span className="text-xs font-semibold text-charcoal-900 block truncate">
                              {m.textName}
                            </span>
                            {m.shakha && (
                              <span className="text-[10px] text-charcoal-500 block truncate">
                                {m.shakha}
                              </span>
                            )}
                            <span className="text-[9px] text-charcoal-400 block truncate font-mono">
                              {m.sectionRef}
                            </span>
                          </div>
                        </td>

                        {/* 3. Sanskrit text snippet with quick copy */}
                        <td className="py-2.5 px-3 align-top max-w-[300px]">
                          <div className="relative group/sanskrit">
                            <div className="flex items-start justify-between gap-1.5">
                              <p
                                className="font-devanagari text-xs sm:text-sm font-semibold text-[#2E1808] line-clamp-2 leading-relaxed"
                                title={m.sanskrit}
                              >
                                {m.sanskrit}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => handleCopySanskrit(m, e)}
                                className="opacity-0 group-hover/sanskrit:opacity-100 shrink-0 p-1 rounded-md bg-cream-100 hover:bg-cream-200 text-charcoal-600 hover:text-saffron-700 transition-all cursor-pointer shadow-2xs"
                                title="संस्कृत मंत्र कॉपी करें"
                              >
                                {copiedId === m.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            {/* Hindi translation preview under Sanskrit */}
                            {m.hindiTranslation && (
                              <p className="text-[10px] text-charcoal-500 font-devanagari line-clamp-1 mt-0.5 leading-snug">
                                <span className="font-bold text-amber-800">भावार्थ:</span> {m.hindiTranslation}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* 4. Rishi, Devata, Chhanda */}
                        <td className="py-2.5 px-3 align-top text-[10px] space-y-0.5 max-w-[150px]">
                          {m.rishi && (
                            <div className="truncate flex items-center gap-1">
                              <span className="text-charcoal-400 text-[9px]">ऋषि:</span>
                              <span className="font-semibold text-charcoal-800 font-devanagari">
                                {m.rishi}
                              </span>
                            </div>
                          )}
                          {m.devata && (
                            <div className="truncate flex items-center gap-1">
                              <span className="text-charcoal-400 text-[9px]">देवता:</span>
                              <span className="font-semibold text-charcoal-800 font-devanagari">
                                {m.devata}
                              </span>
                            </div>
                          )}
                          {m.chhanda && (
                            <div className="truncate flex items-center gap-1">
                              <span className="text-charcoal-400 text-[9px]">छंद:</span>
                              <span className="text-charcoal-600 font-devanagari">
                                {m.chhanda}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 5. Language status badges */}
                        <td className="py-2.5 px-3 align-top">
                          <div className="flex flex-wrap gap-1">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                m.hindiTranslation?.trim()
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-cream-100 text-charcoal-400"
                              }`}
                              title={m.hindiTranslation ? "हिंदी भावार्थ उपलब्ध" : "अनुपलब्ध"}
                            >
                              हि {m.hindiTranslation?.trim() ? "✓" : "—"}
                            </span>

                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                m.englishTranslation?.trim()
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : "bg-cream-100 text-charcoal-400"
                              }`}
                              title={m.englishTranslation ? "English Translation Available" : "Not available"}
                            >
                              En {m.englishTranslation?.trim() ? "✓" : "—"}
                            </span>

                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                m.hinglishTranslation?.trim()
                                  ? "bg-purple-50 text-purple-800 border border-purple-200"
                                  : "bg-cream-100 text-charcoal-400"
                              }`}
                              title={m.hinglishTranslation ? "Hinglish Available" : "Not available"}
                            >
                              Hg {m.hinglishTranslation?.trim() ? "✓" : "—"}
                            </span>

                            {m.padapatha && m.padapatha.length > 0 && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                {m.padapatha.length} पद
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Actions */}
                        <td className="py-2.5 px-3 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/admin/library/mantras/${m.id}`}
                              className="p-1 text-charcoal-500 hover:text-saffron-700 rounded-md hover:bg-cream-100 transition-colors"
                              title="मंत्र विवरण देखें (View)"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              to={`/admin/library/mantras/${m.id}/edit`}
                              className="p-1 text-charcoal-500 hover:text-saffron-700 rounded-md hover:bg-cream-100 transition-colors"
                              title="संपादित करें (Edit)"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(m)}
                              className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title="हटाएं (Delete)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-cream-200 bg-cream-50/30">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      ) : (
        /* GRID CARD VIEW - Compact Proportionate Cards */
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-charcoal-400 bg-white rounded-xl border border-cream-200">
              <Sparkles className="w-5 h-5 text-saffron-500 animate-spin mx-auto mb-2" />
              <span className="font-medium text-xs">वैदिक मंत्र लोड हो रहे हैं...</span>
            </div>
          ) : mantras.length === 0 ? (
            <div className="py-16 text-center text-charcoal-400 bg-white rounded-xl border border-cream-200">
              <p className="font-bold text-charcoal-700 text-xs">कोई मंत्र नहीं मिला</p>
              <p className="text-[11px] text-charcoal-400 mt-1">
                फ़िल्टर साफ़ करें या नया मंत्र जोड़ें।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {mantras.map((m) => {
                const vedaBadge = getVedaBadge(m.vedaId);
                return (
                  <div
                    key={m.id}
                    className="group bg-white rounded-xl border border-cream-200/90 hover:border-amber-300 shadow-2xs hover:shadow-soft transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Ornate Header */}
                    <div className="px-3 py-2 border-b border-cream-100 bg-[#FFFDF9] space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${vedaBadge.bg}`}
                        >
                          {vedaBadge.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px] text-charcoal-400">
                            {m.id}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-saffron-50 border border-saffron-200 text-saffron-800 font-devanagari font-bold text-[11px]">
                            {m.mantraNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-charcoal-900 truncate">
                          {m.textName}
                        </span>
                        <span className="text-[10px] text-charcoal-500 truncate ml-1.5 font-mono">
                          {m.sectionRef}
                        </span>
                      </div>
                    </div>

                    {/* Central Sacred Sanskrit Card */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="p-2.5 rounded-lg bg-[#FFFDF8] border border-amber-200/70 relative">
                        <p className="font-devanagari font-bold text-xs sm:text-sm text-[#2E1808] leading-relaxed line-clamp-2">
                          {m.sanskrit}
                        </p>
                        {m.transliteration && (
                          <p className="font-serif italic text-[10px] text-amber-950/70 line-clamp-1 mt-1 border-t border-amber-100 pt-0.5">
                            {m.transliteration}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleCopySanskrit(m, e)}
                          className="absolute right-1.5 top-1.5 p-1 rounded-md bg-white/80 hover:bg-white text-charcoal-600 hover:text-saffron-700 shadow-2xs border border-amber-200/50 transition-colors cursor-pointer"
                          title="संस्कृत मंत्र कॉपी करें"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Hindi Translation Snippet */}
                      {m.hindiTranslation && (
                        <p className="text-[10px] text-charcoal-600 font-devanagari line-clamp-2 leading-relaxed">
                          <strong className="text-amber-800">भावार्थ: </strong>
                          {m.hindiTranslation}
                        </p>
                      )}

                      {/* Rishi, Devata, Chhanda strip */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1 border-t border-cream-100">
                        <div>
                          <span className="text-charcoal-400 block text-[9px]">ऋषि:</span>
                          <span className="font-semibold text-charcoal-800 font-devanagari truncate block">
                            {m.rishi || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-400 block text-[9px]">देवता:</span>
                          <span className="font-semibold text-charcoal-800 font-devanagari truncate block">
                            {m.devata || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Language Chips & Actions */}
                    <div className="px-3 py-2 bg-[#FAF7F0] border-t border-cream-200/80 flex items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                            m.hindiTranslation?.trim()
                              ? "bg-emerald-100/80 text-emerald-800"
                              : "bg-cream-200 text-charcoal-400"
                          }`}
                        >
                          हि
                        </span>
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                            m.englishTranslation?.trim()
                              ? "bg-blue-100/80 text-blue-800"
                              : "bg-cream-200 text-charcoal-400"
                          }`}
                        >
                          En
                        </span>
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                            m.hinglishTranslation?.trim()
                              ? "bg-purple-100/80 text-purple-800"
                              : "bg-cream-200 text-charcoal-400"
                          }`}
                        >
                          Hg
                        </span>
                        {m.padapatha && m.padapatha.length > 0 && (
                          <span className="text-[9px] font-semibold text-amber-800 ml-0.5">
                            {m.padapatha.length} पद
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/library/mantras/${m.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-cream-300 text-charcoal-700 hover:text-saffron-700 text-[11px] font-semibold hover:bg-cream-50 transition-colors shadow-2xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>दर्शन</span>
                        </Link>
                        <Link
                          to={`/admin/library/mantras/${m.id}/edit`}
                          className="p-1 text-charcoal-500 hover:text-saffron-700 rounded-md hover:bg-cream-100 transition-colors"
                          title="संपादित करें"
                        >
                          <Edit className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination for Grid view */}
          {totalPages > 1 && (
            <div className="p-3 bg-white rounded-xl border border-cream-200/90 shadow-2xs">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}

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
        message={`क्या आप निश्चित रूप से मंत्र "${deleteTarget?.mantraNumber}" (${deleteTarget?.id}) को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।`}
        confirmLabel="हटाएं"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MantraListPage;
