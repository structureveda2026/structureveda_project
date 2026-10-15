import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Scroll,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  BookOpen,
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Check,
  Sparkles,
  Flame,
  ChevronRight,
  BookMarked,
  Layers,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  Languages,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { PuranaItihasaShloka } from "../types/puranaItihasa.types";
import { PuranaItihasaAdminService } from "../services/puranaItihasa.service";
import {
  GRANTHA_CATALOGUE,
  INITIAL_PURANA_ITIHASA_SHLOKAS,
} from "../constants/puranaShloka.constants";

export const PuranaItihasaShlokaListPage: React.FC = () => {
  const { id: routeGranthaId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Selected Grantha: from route param or query param or "all"
  const selectedGranthaId = routeGranthaId || searchParams.get("grantha") || "all";

  // Grantha details if scoped to a specific one
  const currentGrantha = useMemo(() => {
    if (selectedGranthaId === "all") return null;
    return GRANTHA_CATALOGUE.find((g) => g.id === selectedGranthaId) || {
      id: selectedGranthaId,
      name: selectedGranthaId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      enName: selectedGranthaId,
      category: "purana" as const,
      sections: [],
    };
  }, [selectedGranthaId]);

  const [shlokas, setShlokas] = useState<PuranaItihasaShloka[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);

  // View Mode: 'cards' or 'table'
  const [viewMode, setViewMode] = useState<"cards" | "table">(
    (searchParams.get("view") as "cards" | "table") || "cards"
  );

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sectionFilter, setSectionFilter] = useState(searchParams.get("section") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [languagePreview, setLanguagePreview] = useState<"all" | "hi" | "en" | "hinglish">("all");

  // Interaction State
  const [deleteTarget, setDeleteTarget] = useState<PuranaItihasaShloka | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch shlokas from API with authentic fallback
  const fetchShlokas = async () => {
    try {
      setLoading(true);
      const res = await PuranaItihasaAdminService.getShlokas(
        selectedGranthaId !== "all" ? selectedGranthaId : undefined,
        {
          page,
          limit,
          search: search.trim() || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        }
      );

      let fetchedList: PuranaItihasaShloka[] = [];
      let totalCount = 0;

      if (Array.isArray(res)) {
        fetchedList = res;
        totalCount = res.length;
      } else if (res && typeof res === "object") {
        fetchedList = (res as any).shlokas || (res as any).data || [];
        totalCount = (res as any).pagination?.total || fetchedList.length;
      }

      // If backend returns empty, provide authentic fallback data filtered accordingly
      if (fetchedList.length === 0) {
        let pool = [...INITIAL_PURANA_ITIHASA_SHLOKAS];
        if (selectedGranthaId !== "all") {
          pool = pool.filter(
            (s) =>
              s.vedaId === selectedGranthaId ||
              s.textId === selectedGranthaId ||
              s.id.includes(selectedGranthaId)
          );
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          pool = pool.filter(
            (s) =>
              s.sanskrit?.toLowerCase().includes(q) ||
              s.hindiTranslation?.toLowerCase().includes(q) ||
              s.englishTranslation?.toLowerCase().includes(q) ||
              s.hinglishTranslation?.toLowerCase().includes(q) ||
              s.mantraNumber?.toLowerCase().includes(q) ||
              s.textName?.toLowerCase().includes(q) ||
              s.rishi?.toLowerCase().includes(q) ||
              s.devata?.toLowerCase().includes(q)
          );
        }
        if (statusFilter !== "ALL") {
          pool = pool.filter((s) => s.status === statusFilter);
        }
        fetchedList = pool;
        totalCount = pool.length;
      }

      setShlokas(fetchedList);
      setTotal(totalCount);
    } catch (err: any) {
      console.warn("API request fallback for Shlokas:", err);
      // Fallback on error
      let pool = [...INITIAL_PURANA_ITIHASA_SHLOKAS];
      if (selectedGranthaId !== "all") {
        pool = pool.filter(
          (s) =>
            s.vedaId === selectedGranthaId ||
            s.textId === selectedGranthaId ||
            s.id.includes(selectedGranthaId)
        );
      }
      setShlokas(pool);
      setTotal(pool.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShlokas();
  }, [selectedGranthaId, search, statusFilter, page]);

  // Handle Grantha selector change
  const handleGranthaChange = (newGranthaId: string) => {
    if (newGranthaId === "all") {
      navigate("/admin/purana-itihasa/shlokas");
    } else {
      navigate(`/admin/purana-itihasa/${newGranthaId}/shlokas`);
    }
  };

  // Copy Sanskrit text
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("श्लोक क्लिपबोर्ड पर कॉपी किया गया", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete Shloka
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await PuranaItihasaAdminService.deleteShloka(deleteTarget.id);
      showToast("श्लोक सफलतापूर्वक हटाया गया", "success");
      setShlokas((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "श्लोक हटाने में विफल", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered in memory for section filter if applicable
  const displayShlokas = useMemo(() => {
    if (sectionFilter === "all") return shlokas;
    return shlokas.filter(
      (s) =>
        s.textName?.includes(sectionFilter) ||
        s.sectionRef?.includes(sectionFilter) ||
        s.nodeId?.includes(sectionFilter)
    );
  }, [shlokas, sectionFilter]);

  const totalPages = Math.ceil(total / limit) || 1;

  // Add shloka target URL
  const addShlokaUrl =
    selectedGranthaId && selectedGranthaId !== "all"
      ? `/admin/purana-itihasa/${selectedGranthaId}/shlokas/new`
      : "/admin/purana-itihasa/shlokas/new";

  return (
    <div className="space-y-6">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-charcoal-500">
        <Link
          to="/admin/dashboard"
          className="hover:text-saffron-700 transition-colors"
        >
          डैशबोर्ड
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to="/admin/purana-itihasa"
          className="hover:text-saffron-700 transition-colors"
        >
          पुराण एवं इतिहास आर्काइव
        </Link>
        {currentGrantha && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
            <Link
              to={`/admin/purana-itihasa/${currentGrantha.id}/edit`}
              className="text-saffron-700 font-semibold hover:underline"
            >
              {currentGrantha.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="text-charcoal-900 font-bold">श्लोक प्रबन्धन</span>
      </nav>

      {/* 2. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-amber-500/10 via-saffron-500/10 to-orange-500/5 p-5 md:p-6 rounded-2xl border border-saffron-200/80 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-600 text-white shadow-2xs">
              <Scroll className="w-3.5 h-3.5" />
              <span>श्लोक एवं भावार्थ आर्काइव</span>
            </span>
            {currentGrantha && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <BookOpen className="w-3 h-3" />
                <span>{currentGrantha.name}</span>
              </span>
            )}
            <span className="text-xs font-bold text-charcoal-600 bg-white/80 px-2 py-0.5 rounded-md border border-cream-200">
              कुल श्लोक: {total}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-serif font-bold text-charcoal-900 flex items-center gap-2">
            <span>
              {currentGrantha
                ? `${currentGrantha.name} — श्लोक प्रबन्धन`
                : "पुराण एवं इतिहास श्लोक प्रबन्धन (Shloka Management)"}
            </span>
          </h1>

          <p className="text-xs text-charcoal-600 max-w-3xl leading-relaxed">
            {currentGrantha
              ? `${currentGrantha.enName} के सभी प्रामाणिक श्लोक, पदच्छेद (Padapatha), त्रिभाषी भावार्थ (हिन्दी, English, हिंग्लिश) एवं शास्त्रीय संदर्भ का सम्पादन व प्रबन्धन करें।`
              : "१८ महापुराण, १८ उपपुराण, वाल्मीकि रामायण, महाभारत एवं श्रीमद्भगवद्गीता के श्लोकों का सम्पूर्ण वैदिक संग्रह।"}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Link
            to="/admin/purana-itihasa"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ग्रंथ सूची पर लौटें</span>
          </Link>

          <Link
            to={addShlokaUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नया श्लोक जोड़ें (Add Shloka)</span>
          </Link>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-cream-200 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="सस्कृत श्लोक, हिन्दी भावार्थ, English, हिंग्लिश या श्लोक संख्या खोजें..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none placeholder:text-charcoal-400"
            />
          </div>

          {/* Grantha Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedGranthaId}
              onChange={(e) => handleGranthaChange(e.target.value)}
              aria-label="ग्रंथ चुनें"
              className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white text-charcoal-800"
            >
              <option value="all">समस्त ग्रंथ (All Granthas)</option>
              <optgroup label="अष्टादश महापुराण">
                {GRANTHA_CATALOGUE.filter((g) => g.category === "purana").map(
                  (g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.enName})
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label="इतिहास एवं महाकाव्य">
                {GRANTHA_CATALOGUE.filter((g) => g.category === "itihasa").map(
                  (g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.enName})
                    </option>
                  )
                )}
              </optgroup>
            </select>
          </div>

          {/* Chapter / Section filter */}
          <div className="md:col-span-2">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              aria-label="खण्ड अथवा अध्याय चुनें"
              className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white text-charcoal-800"
            >
              <option value="all">सभी खण्ड/अध्याय</option>
              {currentGrantha?.sections?.map((sec, idx) => (
                <option key={idx} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="md:col-span-2 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="स्थिति चुनें"
              className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white text-charcoal-800"
            >
              <option value="ALL">सभी स्थिति</option>
              <option value="ACTIVE">सक्रिय (Active)</option>
              <option value="INACTIVE">निष्क्रिय (Inactive)</option>
            </select>
          </div>
        </div>

        {/* Toolbar Sub-bar: Language preview pills + View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-charcoal-500 font-bold flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-saffron-600" />
              <span>भाषा प्रदर्शन:</span>
            </span>
            <div className="flex items-center gap-1 bg-cream-100/80 p-0.5 rounded-lg border border-cream-200">
              <button
                type="button"
                onClick={() => setLanguagePreview("all")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  languagePreview === "all"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                तीनों भाषाएं (All 3)
              </button>
              <button
                type="button"
                onClick={() => setLanguagePreview("hi")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  languagePreview === "hi"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                हिन्दी भावार्थ
              </button>
              <button
                type="button"
                onClick={() => setLanguagePreview("en")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  languagePreview === "en"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguagePreview("hinglish")}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  languagePreview === "hinglish"
                    ? "bg-white text-saffron-700 shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                हिंग्लिश
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchShlokas}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
              title="रिफ्रेश करें"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>रिफ्रेश</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-lg border border-cream-200">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "cards"
                    ? "bg-white text-saffron-600 shadow-2xs"
                    : "text-charcoal-400 hover:text-charcoal-600"
                }`}
                title="कार्ड दृश्य (Cards View)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-saffron-600 shadow-2xs"
                    : "text-charcoal-400 hover:text-charcoal-600"
                }`}
                title="तालिका दृश्य (Table View)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTENT AREA: CARDS VIEW OR TABLE VIEW */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-cream-200">
          <RefreshCw className="w-8 h-8 text-saffron-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-charcoal-700">
            श्लोक लोड हो रहे हैं...
          </p>
          <p className="text-xs text-charcoal-400 mt-1">
            कृपया प्रतीक्षा करें, प्रामाणिक श्लोक सूची तैयार हो रही है।
          </p>
        </div>
      ) : displayShlokas.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-cream-300 p-8 space-y-4">
          <Scroll className="w-12 h-12 text-saffron-300 mx-auto" />
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-800">
              कोई श्लोक नहीं मिला
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              दिए गए फ़िल्टर या खोज के आधार पर कोई श्लोक उपलब्ध नहीं है। नया
              श्लोक जोड़ने हेतु नीचे दिए गए बटन पर क्लिक करें।
            </p>
          </div>
          <Link
            to={addShlokaUrl}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>पहला श्लोक जोड़ें</span>
          </Link>
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayShlokas.map((shloka) => (
            <div
              key={shloka.id}
              className="bg-white rounded-2xl border border-cream-200 hover:border-saffron-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-4 md:p-5 border-b border-cream-100 bg-cream-50/40 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-saffron-700 bg-saffron-100/70 border border-saffron-200 px-2.5 py-0.5 rounded-md">
                        {shloka.mantraNumber || shloka.sectionRef || "श्लोक"}
                      </span>
                      {shloka.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>विशेष (Featured)</span>
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          shloka.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-charcoal-100 text-charcoal-600 border border-charcoal-200"
                        }`}
                      >
                        {shloka.status === "ACTIVE" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>सक्रिय</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>निष्क्रिय</span>
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-saffron-800 transition-colors">
                      {shloka.vedaName || currentGrantha?.name}
                    </h3>
                    <p className="text-[11px] text-charcoal-500 font-medium">
                      {shloka.textName || shloka.sectionRef}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(shloka.sanskrit, shloka.id)}
                      className="p-1.5 text-charcoal-400 hover:text-saffron-700 hover:bg-cream-100 rounded-lg transition-colors cursor-pointer"
                      title="संस्कृत श्लोक कॉपी करें"
                    >
                      {copiedId === shloka.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      to={`/admin/purana-itihasa/shlokas/${shloka.id}/edit`}
                      className="p-1.5 text-charcoal-400 hover:text-saffron-700 hover:bg-cream-100 rounded-lg transition-colors"
                      title="संपादित करें"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(shloka)}
                      className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shastric Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  {shloka.rishi && (
                    <span className="bg-white px-2 py-0.5 rounded border border-cream-200 text-charcoal-600 font-medium">
                      ऋषि: {shloka.rishi}
                    </span>
                  )}
                  {shloka.devata && (
                    <span className="bg-white px-2 py-0.5 rounded border border-cream-200 text-charcoal-600 font-medium">
                      देवता: {shloka.devata}
                    </span>
                  )}
                  {shloka.chhanda && (
                    <span className="bg-white px-2 py-0.5 rounded border border-cream-200 text-charcoal-600 font-medium">
                      छन्द: {shloka.chhanda}
                    </span>
                  )}
                  {shloka.padapatha && shloka.padapatha.length > 0 && (
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-bold">
                      पदच्छेद: {shloka.padapatha.length} पद
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body: Sanskrit Devanagari */}
              <div className="p-4 md:p-5 space-y-4 flex-1">
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/80">
                  <pre className="font-serif text-sm md:text-base font-bold text-charcoal-900 leading-loose whitespace-pre-wrap text-center tracking-wide selection:bg-saffron-200">
                    {shloka.sanskrit}
                  </pre>
                </div>

                {/* Translations Preview */}
                <div className="space-y-2.5 text-xs">
                  {(languagePreview === "all" || languagePreview === "hi") &&
                    shloka.hindiTranslation && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700">
                          हिन्दी भावार्थ:
                        </span>
                        <p className="text-charcoal-700 leading-relaxed font-devanagari line-clamp-3">
                          {shloka.hindiTranslation}
                        </p>
                      </div>
                    )}

                  {(languagePreview === "all" || languagePreview === "en") &&
                    shloka.englishTranslation && (
                      <div className="space-y-1 pt-1.5 border-t border-cream-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                          English Translation:
                        </span>
                        <p className="text-charcoal-600 leading-relaxed italic line-clamp-3">
                          {shloka.englishTranslation}
                        </p>
                      </div>
                    )}

                  {(languagePreview === "all" || languagePreview === "hinglish") &&
                    shloka.hinglishTranslation && (
                      <div className="space-y-1 pt-1.5 border-t border-cream-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                          हिंग्लिश व्याख्या:
                        </span>
                        <p className="text-charcoal-600 leading-relaxed line-clamp-2">
                          {shloka.hinglishTranslation}
                        </p>
                      </div>
                    )}

                  {shloka.shastricContext && (
                    <div className="pt-2 border-t border-cream-100 flex items-start gap-1.5 text-[11px] text-charcoal-500">
                      <Flame className="w-3.5 h-3.5 text-saffron-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {shloka.shastricContext}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-cream-50/70 border-t border-cream-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-charcoal-400">
                  क्रम: #{shloka.orderIndex || 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(shloka)}
                    className="text-charcoal-500 hover:text-red-600 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    हटाएं
                  </button>
                  <Link
                    to={`/admin/purana-itihasa/shlokas/${shloka.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>संपादित करें</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-cream-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-cream-100/70 border-b border-cream-200 text-charcoal-600 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 w-16">संख्या</th>
                  <th className="py-3 px-4">ग्रंथ एवं संदर्भ</th>
                  <th className="py-3 px-4 min-w-[280px]">मूल संस्कृत श्लोक</th>
                  <th className="py-3 px-4 min-w-[260px]">त्रिभाषी भावार्थ</th>
                  <th className="py-3 px-4">पदच्छेद</th>
                  <th className="py-3 px-4">स्थिति</th>
                  <th className="py-3 px-4 text-right">कार्य (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {displayShlokas.map((shloka) => (
                  <tr
                    key={shloka.id}
                    className="hover:bg-cream-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-saffron-700">
                      {shloka.mantraNumber || shloka.sectionRef}
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-charcoal-900">
                        {shloka.vedaName || currentGrantha?.name}
                      </div>
                      <div className="text-[11px] text-charcoal-500">
                        {shloka.textName}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-charcoal-400">
                        {shloka.rishi && <span>ऋषि: {shloka.rishi}</span>}
                        {shloka.chhanda && <span>• {shloka.chhanda}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-charcoal-900 leading-relaxed text-xs line-clamp-3">
                        {shloka.sanskrit}
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-1">
                      <div className="text-[11px] text-charcoal-800 line-clamp-2">
                        {shloka.hindiTranslation}
                      </div>
                      {shloka.englishTranslation && (
                        <div className="text-[10px] text-charcoal-500 italic line-clamp-1">
                          {shloka.englishTranslation}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {shloka.padapatha && shloka.padapatha.length > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {shloka.padapatha.length} पद
                        </span>
                      ) : (
                        <span className="text-charcoal-300 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          shloka.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-charcoal-100 text-charcoal-600"
                        }`}
                      >
                        {shloka.status === "ACTIVE" ? "सक्रिय" : "निष्क्रिय"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(shloka.sanskrit, shloka.id)}
                          className="p-1.5 text-charcoal-400 hover:text-saffron-700 hover:bg-cream-100 rounded-lg transition-colors cursor-pointer"
                          title="कॉपी करें"
                        >
                          {copiedId === shloka.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Link
                          to={`/admin/purana-itihasa/shlokas/${shloka.id}/edit`}
                          className="p-1.5 text-charcoal-400 hover:text-saffron-700 hover:bg-cream-100 rounded-lg transition-colors"
                          title="संपादित करें"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(shloka)}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* 6. CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="श्लोक हटाएं (Confirm Deletion)"
        message={`क्या आप निश्चित हैं कि आप इस श्लोक (${deleteTarget?.mantraNumber || deleteTarget?.sectionRef || "श्लोक"}) को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।`}
        confirmLabel={isDeleting ? "हटाया जा रहा है..." : "हाँ, श्लोक हटाएं"}
        cancelLabel="रद्द करें"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default PuranaItihasaShlokaListPage;
