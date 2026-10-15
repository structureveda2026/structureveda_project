import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Sparkles,
  Layers,
  Scroll,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  FolderTree,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Award,
  Feather,
  Sun,
  Eye,
  ExternalLink,
  Info,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type {
  PuranaItihasaGrantha,
  PhilosophicalJewel,
  UpapuranaItem,
  ShastricCharacteristic,
  GunaClassification,
  GranthaStatus,
} from "../types/puranaItihasa.types";
import PuranaItihasaAdminService from "../services/puranaItihasa.service";

type TabKey = "mahapuranas" | "itihasas" | "akhyanas" | "upapuranas" | "lakshanas";

export const PuranaItihasaListPage: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>("mahapuranas");
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [granthas, setGranthas] = useState<PuranaItihasaGrantha[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gunaFilter, setGunaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<PuranaItihasaGrantha | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load Granthas
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await PuranaItihasaAdminService.getAllTexts();
      setGranthas(data);
    } catch (err: any) {
      showError(err.message || "पुराण एवं इतिहास ग्रंथ लोड करने में त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Seed Archive handler
  const handleSeedArchive = async () => {
    try {
      setSeeding(true);
      const res = await PuranaItihasaAdminService.seedArchive(true);
      showSuccess(res.message);
      await loadData();
    } catch (err: any) {
      showError(err.message || "आर्काइव सिंक करने में त्रुटि उत्पन्न हुई");
    } finally {
      setSeeding(false);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await PuranaItihasaAdminService.delete(deleteTarget.id);
      showSuccess(`"${deleteTarget.name}" सफलतापूर्वक हटाया गया`);
      setGranthas((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      showError(err.message || "ग्रंथ हटाने में त्रुटि");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculations for Stat Cards
  const statsSummary = useMemo(() => {
    const mahapuranas = granthas.filter((g) => g.category === "purana");
    const epics = granthas.filter((g) => g.category === "itihasa");

    const sattvika = granthas.filter((g) => g.guna === "sattvika").length;
    const rajasa = granthas.filter((g) => g.guna === "rajasa").length;
    const tamasa = granthas.filter((g) => g.guna === "tamasa").length;

    return {
      totalTexts: granthas.length,
      mahapuranasCount: mahapuranas.length,
      epicsCount: epics.length,
      sattvika,
      rajasa,
      tamasa,
      totalShlokas: "५,२५,०००+",
      jewelsCount: 10,
      upapuranasCount: 18,
    };
  }, [granthas]);

  // Filtered lists for Table tabs
  const filteredTexts = useMemo(() => {
    let list = granthas;

    // Filter by tab category
    if (activeTab === "mahapuranas") {
      list = list.filter((g) => g.category === "purana");
    } else if (activeTab === "itihasas") {
      list = list.filter((g) => g.category === "itihasa");
    }

    // Filter by Guna
    if (gunaFilter !== "all") {
      list = list.filter((g) => g.guna === gunaFilter);
    }

    // Filter by Status
    if (statusFilter !== "ALL") {
      list = list.filter((g) => g.status === statusFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.enName.toLowerCase().includes(q) ||
          (g.chiefDeity && g.chiefDeity.toLowerCase().includes(q)) ||
          (g.primaryRishis && g.primaryRishis.toLowerCase().includes(q)) ||
          (g.eyebrow && g.eyebrow.toLowerCase().includes(q))
      );
    }

    return list;
  }, [granthas, activeTab, gunaFilter, statusFilter, searchQuery]);

  // Static Data for tab 3, 4, 5
  const philosophicalJewels = useMemo(() => PuranaItihasaAdminService.getPhilosophicalJewels(), []);
  const upapuranas = useMemo(() => PuranaItihasaAdminService.getUpapuranas(), []);
  const shastricCharacteristics = useMemo(() => PuranaItihasaAdminService.getShastricCharacteristics(), []);

  // Filtered jewels for Tab 3
  const filteredJewels = useMemo(() => {
    if (!searchQuery.trim()) return philosophicalJewels;
    const q = searchQuery.toLowerCase().trim();
    return philosophicalJewels.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.enTitle.toLowerCase().includes(q) ||
        j.chiefDeity.toLowerCase().includes(q) ||
        j.speaker.toLowerCase().includes(q) ||
        j.sourceGrantha.toLowerCase().includes(q) ||
        j.keyTheme.toLowerCase().includes(q)
    );
  }, [philosophicalJewels, searchQuery]);

  // Filtered upapuranas for Tab 4
  const filteredUpapuranas = useMemo(() => {
    if (!searchQuery.trim()) return upapuranas;
    const q = searchQuery.toLowerCase().trim();
    return upapuranas.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.enName.toLowerCase().includes(q) ||
        u.chiefDeity.toLowerCase().includes(q) ||
        u.tradition.toLowerCase().includes(q) ||
        u.summary.toLowerCase().includes(q)
    );
  }, [upapuranas, searchQuery]);

  // Filtered characteristics for Tab 5
  const filteredCharacteristics = useMemo(() => {
    if (!searchQuery.trim()) return shastricCharacteristics;
    const q = searchQuery.toLowerCase().trim();
    return shastricCharacteristics.filter(
      (c) =>
        c.sanskritName.toLowerCase().includes(q) ||
        c.enName.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q) ||
        c.puranicSignificance.toLowerCase().includes(q)
    );
  }, [shastricCharacteristics, searchQuery]);

  // Render Guna Badge
  const renderGunaBadge = (guna: GunaClassification) => {
    switch (guna) {
      case "sattvika":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            सात्त्विक (Sattvika)
          </span>
        );
      case "rajasa":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            राजस (Rajasa)
          </span>
        );
      case "tamasa":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            तामस (Tamasa)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
            सनातन (Vedic)
          </span>
        );
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: GranthaStatus) => {
    if (status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
          <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
          सक्रिय (Active)
        </span>
      );
    }
    if (status === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
          प्रारूप (Draft)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-100 text-charcoal-600 border border-charcoal-200">
        निष्क्रिय (Inactive)
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Header with Breadcrumb & Global Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gradient-to-r from-saffron-50 via-cream-50 to-purple-50 p-4 sm:p-5 rounded-xl border border-saffron-200/60 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-saffron-700 uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 text-saffron-500" />
            <span>वैदिक वाङ्मय अभिलेखागार • Puranic & Epic Corpus</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 font-serif tracking-tight">
            पुराण एवं इतिहास महासंग्रह (Purana & Itihasa Archive)
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-0.5 max-w-2xl leading-normal">
            अष्टादश महापुराण (१८), आदिकाव्य रामायण, महाभारत, १८ उपपुराण, १० दार्शनिक आख्यान रत्न एवं श्रीमद्भागवत प्रतिपादित दश लक्षणों का सर्वांगीण डिजिटल प्रबंधन।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSeedArchive}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-saffron-300 text-saffron-700 font-semibold text-xs hover:bg-saffron-50 transition shadow-2xs disabled:opacity-50"
            title="डेटाबेस में प्रामाणिक १८ महापुराण एवं इतिहास पुनः स्थापित करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin text-saffron-600" : ""}`} />
            <span>{seeding ? "सिंक हो रहा है..." : "डेटाबेस पुनः सिंक करें (Seed Archive)"}</span>
          </button>

          <Link
            to="/admin/purana-itihasa/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-saffron-500 hover:bg-saffron-600 text-white font-semibold text-xs transition shadow-xs hover:shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नया ग्रंथ जोड़ें (Add New Grantha)</span>
          </Link>
        </div>
      </div>

      {/* 2. Stat Cards at Top (Compact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* Card 1: Total Texts */}
        <div className="card p-2.5 sm:p-3 relative overflow-hidden group hover:border-saffron-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              कुल ग्रंथ (Total Texts)
            </span>
            <div className="w-7 h-7 rounded-lg bg-saffron-100 flex items-center justify-center text-saffron-600 group-hover:scale-105 transition-transform">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold text-charcoal-900 font-serif">
              {statsSummary.totalTexts} <span className="text-[11px] font-normal text-charcoal-500">प्रमुख ग्रंथ</span>
            </div>
            <p className="text-[10px] text-charcoal-600 mt-0.5">
              १८ महापुराण + ५ इतिहास एवं महाकाव्य
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-400 to-saffron-600" />
        </div>

        {/* Card 2: Total Shlokas */}
        <div className="card p-2.5 sm:p-3 relative overflow-hidden group hover:border-gold-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              कुल श्लोक संख्या (Total Shlokas)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
              <Scroll className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold text-charcoal-900 font-serif text-amber-700">
              ५,२५,०००+ <span className="text-[11px] font-normal text-charcoal-500">श्लोक</span>
            </div>
            <p className="text-[10px] text-charcoal-600 mt-0.5">
              ४ लाख पुराण + १ लाख महाभारत + २४ हजार रामायण
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600" />
        </div>

        {/* Card 3: Triguna Classification */}
        <div className="card p-2.5 sm:p-3 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              त्रिगुण वर्गीकरण (Guna Breakdown)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-charcoal-800">
              <span className="text-emerald-700">६ सात्त्विक</span> •
              <span className="text-amber-700">६ राजस</span> •
              <span className="text-purple-700">६ तामस</span>
            </div>
            <p className="text-[10px] text-charcoal-600 mt-0.5">
              पद्म व मत्स्य पुराण अनुसार १८ महापुराणों का सन्तुलन
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600" />
        </div>

        {/* Card 4: 10 Akhyanas & Jewels */}
        <div className="card p-2.5 sm:p-3 relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              प्रमुख आख्यान व रत्न (Philosophical Jewels)
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-105 transition-transform">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <div className="text-base sm:text-lg font-bold text-charcoal-900 font-serif text-purple-800">
              १० आख्यान <span className="text-[11px] font-normal text-charcoal-500">& १८ उपपुराण</span>
            </div>
            <p className="text-[10px] text-charcoal-600 mt-0.5">
              गीता, दुर्गा सप्तशती, सहस्रनाम, गजेन्द्र मोक्ष
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600" />
        </div>
      </div>

      {/* 3. Tab Switcher (Compact 5 Tabs) */}
      <div className="border-b border-cream-200">
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setActiveTab("mahapuranas")}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 font-semibold text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
              activeTab === "mahapuranas"
                ? "border-saffron-500 text-saffron-700 bg-saffron-50/50"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>१. १८ महापुराण (18 Mahapuranas)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-saffron-100 text-saffron-800 font-bold">
              18
            </span>
          </button>

          <button
            onClick={() => setActiveTab("itihasas")}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 font-semibold text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
              activeTab === "itihasas"
                ? "border-saffron-500 text-saffron-700 bg-saffron-50/50"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50"
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>२. इतिहास एवं महाकाव्य (Itihasa & Epics)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cream-200 text-charcoal-800 font-bold">
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab("akhyanas")}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 font-semibold text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
              activeTab === "akhyanas"
                ? "border-purple-600 text-purple-700 bg-purple-50/50"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>३. प्रमुख आख्यान व रत्न (10 Jewels)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
              10
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upapuranas")}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 font-semibold text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
              activeTab === "upapuranas"
                ? "border-amber-600 text-amber-800 bg-amber-50/50"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>४. १८ उपपुराण (18 Upapuranas)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              18
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lakshanas")}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 font-semibold text-xs rounded-t-lg transition-all whitespace-nowrap border-b-2 ${
              activeTab === "lakshanas"
                ? "border-emerald-600 text-emerald-800 bg-emerald-50/50"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>५. दश लक्षण (10 Characteristics)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              10
            </span>
          </button>
        </nav>
      </div>

      {/* 4. Search and Filter Bar (Compact) */}
      <div className="card p-2 sm:p-2.5 flex flex-col md:flex-row items-center justify-between gap-2 bg-white shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "mahapuranas"
                ? "महापुराण का नाम, देवता या ऋषि खोजें..."
                : activeTab === "itihasas"
                ? "रामायण, महाभारत या सर्ग खोजें..."
                : activeTab === "akhyanas"
                ? "आख्यान या स्तोत्र खोजें..."
                : activeTab === "upapuranas"
                ? "उपपुराण का नाम खोजें..."
                : "दश लक्षण (सर्ग, विसर्ग, मन्वन्तर...) खोजें..."
            }
            className="input-field pl-8 pr-3 py-1 text-xs w-full rounded-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-charcoal-400 hover:text-charcoal-700"
            >
              हटाएं
            </button>
          )}
        </div>

        {/* Filters (only for Mahapuranas and Itihasas tabs) */}
        {(activeTab === "mahapuranas" || activeTab === "itihasas") && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Guna Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-charcoal-500" />
              <select
                value={gunaFilter}
                onChange={(e) => setGunaFilter(e.target.value)}
                className="input-field py-1 px-2 text-xs w-auto rounded-lg"
              >
                <option value="all">सभी गुण (All Gunas)</option>
                <option value="sattvika">सात्त्विक (Sattvika)</option>
                <option value="rajasa">राजस (Rajasa)</option>
                <option value="tamasa">तामस (Tamasa)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-charcoal-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field py-1 px-2 text-xs w-auto rounded-lg"
              >
                <option value="ALL">सभी स्थितियाँ (All Status)</option>
                <option value="ACTIVE">सक्रिय (Active)</option>
                <option value="DRAFT">प्रारूप (Draft)</option>
                <option value="INACTIVE">निष्क्रिय (Inactive)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB 1 & 2: Table for 18 Mahapuranas OR Itihasa & Epics (Compact) */}
      {(activeTab === "mahapuranas" || activeTab === "itihasas") && (
        <div className="card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-cream-200 text-[10px] font-bold text-charcoal-700 uppercase tracking-wider">
                  <th className="py-1.5 px-2 w-10 text-center">क्र०</th>
                  <th className="py-1.5 px-2 min-w-[200px]">ग्रंथ का नाम (हिन्दी व English)</th>
                  <th className="py-1.5 px-2">श्रेणी</th>
                  <th className="py-1.5 px-2">गुण वर्गीकरण</th>
                  <th className="py-1.5 px-2">प्रधान देव व वक्ता</th>
                  <th className="py-1.5 px-2">श्लोक / अध्याय संख्या</th>
                  <th className="py-1.5 px-2 text-center">स्थिति</th>
                  <th className="py-1.5 px-2 text-right">कार्य (Admin Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-charcoal-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <RefreshCw className="w-5 h-5 animate-spin text-saffron-500" />
                        <span className="text-xs">ग्रंथ डेटा लोड हो रहा है...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTexts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-charcoal-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <BookOpen className="w-6 h-6 text-charcoal-300" />
                        <span className="font-semibold text-sm text-charcoal-700">कोई ग्रंथ नहीं मिला</span>
                        <span className="text-[11px] text-charcoal-400">
                          खोज शब्द या फ़िल्टर बदलें, अथवा नया ग्रंथ जोड़ें।
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTexts.map((item, index) => (
                    <tr key={item.id} className="table-row-hover group">
                      {/* Serial */}
                      <td className="py-1.5 px-2 text-center text-[10px] font-semibold text-charcoal-400">
                        {index + 1}
                      </td>

                      {/* Name & English */}
                      <td className="py-1.5 px-2">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-900 text-xs sm:text-[13px] font-devanagari group-hover:text-saffron-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-charcoal-500 font-medium">
                              {item.enName}
                            </div>
                            {item.eyebrow && (
                              <div className="text-[9px] text-saffron-600 font-medium line-clamp-1">
                                {item.eyebrow}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-1.5 px-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200 uppercase">
                          {item.category === "purana" ? "महापुराण" : item.category === "itihasa" ? "इतिहास" : item.category}
                        </span>
                      </td>

                      {/* Guna Badge */}
                      <td className="py-1.5 px-2 whitespace-nowrap">
                        {renderGunaBadge(item.guna)}
                      </td>

                      {/* Deity & Rishis */}
                      <td className="py-1.5 px-2">
                        <div className="text-[11px] font-medium text-charcoal-800">
                          {item.chiefDeity}
                        </div>
                        <div className="text-[9px] text-charcoal-500 line-clamp-1">
                          {item.primaryRishis}
                        </div>
                      </td>

                      {/* Shlokas / Stats */}
                      <td className="py-1.5 px-2">
                        <div className="text-[11px] font-bold text-charcoal-800">
                          {item.shlokaCount || item.statsMeta?.mantraCount || "—"}
                        </div>
                        <div className="text-[9px] text-charcoal-500">
                          {item.adhyayaCount || `${item.statsMeta?.nodeCount || 6} खण्ड/अध्याय`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-1.5 px-2 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-1.5 px-2 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1. Shlokas Management */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/shlokas`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition shadow-2xs"
                            title="श्लोक प्रबंधन (Manage Shlokas & Verses)"
                          >
                            <Scroll className="w-2.5 h-2.5 text-amber-700" />
                            <span>श्लोक</span>
                          </Link>

                          {/* 2. Structure Tree */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/structure`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition shadow-2xs"
                            title="संरचना वृक्ष (Hierarchy Tree: Khandas, Parvas, Sargas, Adhyayas)"
                          >
                            <FolderTree className="w-2.5 h-2.5 text-blue-700" />
                            <span>संरचना वृक्ष</span>
                          </Link>

                          {/* 3. Edit */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/edit`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-charcoal-700 border border-cream-300 hover:bg-cream-200 transition shadow-2xs"
                            title="संपादन (Edit Grantha Metadata)"
                          >
                            <Edit className="w-2.5 h-2.5 text-charcoal-600" />
                            <span>संपादन</span>
                          </Link>

                          {/* 4. Delete */}
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                            title="हटाएं (Delete)"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="py-1.5 px-2 bg-cream-50/70 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-charcoal-600 gap-1.5">
            <div>
              प्रदर्शित ग्रंथ: <span className="font-bold text-charcoal-900">{filteredTexts.length}</span> / {granthas.length}
            </div>
            <div className="flex items-center gap-3 text-charcoal-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> सात्त्विक
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> राजस
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" /> तामस
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: प्रमुख आख्यान व रत्न (10 Philosophical Jewels) - Compact */}
      {activeTab === "akhyanas" && (
        <div className="space-y-3">
          <div className="bg-purple-50/70 border border-purple-200 p-2 sm:p-2.5 rounded-xl flex items-start gap-2">
            <Award className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
            <div className="text-[10px] text-purple-900 leading-relaxed">
              <span className="font-bold">पुराण व महाभारत के १० अमूल्य दार्शनिक रत्न:</span> ये वे स्वतंत्र व अमर आध्यात्मिक प्रकरण हैं, जो अपने मूल ग्रंथों से निकलकर सनातन धर्म के दैनिक स्वाध्याय, साधन, और मोक्ष के प्रधान स्तम्भ बन गए हैं। प्रत्येक रत्न के मूल श्लोक, भावार्थ एवं संरचना को सीधे प्रबंधित किया जा सकता है।
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredJewels.map((jewel, idx) => (
              <div
                key={jewel.id}
                className="card p-2.5 sm:p-3 border-cream-200 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-xs sm:text-[13px] text-charcoal-900 font-devanagari">
                          {jewel.title}
                        </h3>
                        <p className="text-[10px] text-charcoal-500 font-medium">
                          {jewel.enTitle}
                        </p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 text-purple-800 shrink-0">
                      {jewel.shlokaCount}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-[10px]">
                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">स्रोत ग्रंथ:</span>
                      <span className="font-medium text-saffron-700 bg-saffron-50 px-1.5 py-0.2 rounded text-[9px]">
                        {jewel.sourceGrantha}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">प्रधान देव:</span>
                      <span>{jewel.chiefDeity}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">वक्ता / श्रोता:</span>
                      <span className="text-charcoal-600">{jewel.speaker}</span>
                    </div>

                    <div className="pt-1 text-charcoal-600 leading-relaxed text-[10px] bg-cream-50/60 p-1.5 rounded-lg border border-cream-200">
                      <span className="font-bold text-charcoal-800">दार्शनिक रहस्य: </span>
                      {jewel.philosophicalSignificance}
                    </div>

                    {jewel.popularStotras && jewel.popularStotras.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {jewel.popularStotras.map((st, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-medium bg-cream-100 text-charcoal-700 px-1.5 py-0.2 rounded border border-cream-200"
                          >
                            • {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> सक्रिय संग्रह
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/purana-itihasa/${jewel.sourcePuranaId}/shlokas`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                    >
                      <Scroll className="w-2.5 h-2.5" />
                      <span>श्लोक देखें</span>
                    </Link>
                    <Link
                      to={`/admin/purana-itihasa/${jewel.sourcePuranaId}/structure`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-charcoal-700 border border-cream-300 hover:bg-cream-200 transition"
                    >
                      <FolderTree className="w-2.5 h-2.5" />
                      <span>संरचना</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: १८ उपपुराण (18 Upapuranas) - Compact */}
      {activeTab === "upapuranas" && (
        <div className="space-y-3">
          <div className="bg-amber-50/70 border border-amber-200 p-2 sm:p-2.5 rounded-xl flex items-start gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[10px] text-amber-900 leading-relaxed">
              <span className="font-bold">अष्टादश उपपुराण (18 Minor Puranas):</span> महापुराणों के अतिरिक्त व्यास, सनत्कुमार, दुर्वासा, वसिष्ठ आदि ऋषियों द्वारा प्रतिपादित १८ उपपुराण सनातन धर्म की विशिष्ट साधनाओं, शक्तिपीठों, तीर्थों एवं गूढ़ मन्त्रविद्याओं के प्रामाणिक आधार हैं।
            </div>
          </div>

          <div className="card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream-100/70 border-b border-cream-200 text-[10px] font-bold text-charcoal-700 uppercase tracking-wider">
                    <th className="py-1.5 px-2 w-10 text-center">क्र०</th>
                    <th className="py-1.5 px-2 min-w-[180px]">उपपुराण का नाम</th>
                    <th className="py-1.5 px-2">परम्परा</th>
                    <th className="py-1.5 px-2">इष्ट देवता व ऋषि</th>
                    <th className="py-1.5 px-2">श्लोक संख्या</th>
                    <th className="py-1.5 px-2 min-w-[240px]">संक्षिप्त सार</th>
                    <th className="py-1.5 px-2 text-center">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 text-xs">
                  {filteredUpapuranas.map((u, i) => (
                    <tr key={u.id} className="table-row-hover">
                      <td className="py-1.5 px-2 text-center text-[10px] font-semibold text-charcoal-400">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="font-bold text-charcoal-900 text-xs font-devanagari">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-charcoal-500 font-medium">
                          {u.enName}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {u.tradition}
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="text-[11px] font-medium text-charcoal-800">
                          {u.chiefDeity}
                        </div>
                        <div className="text-[9px] text-charcoal-500">
                          {u.associatedRishi}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 whitespace-nowrap text-[11px] font-bold text-charcoal-700">
                        {u.approxShlokas}
                      </td>
                      <td className="py-1.5 px-2 text-[10px] text-charcoal-600 leading-snug">
                        {u.summary}
                      </td>
                      <td className="py-1.5 px-2 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-green-50 text-green-700 border border-green-200">
                          सक्रिय
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: दश लक्षण (10 Shastric Characteristics) - Compact */}
      {activeTab === "lakshanas" && (
        <div className="space-y-3">
          <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 sm:p-3 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>श्रीमद्भागवत महापुराण (द्वादश स्कन्ध ७.९-१० एवं द्वितीय स्कन्ध १०.१)</span>
              </div>
              <div className="text-xs sm:text-[13px] font-devanagari font-bold text-emerald-950 mt-0.5 italic">
                सर्गोऽस्याथ विसर्गश्च वृत्ती रक्षान्तराणि च। वंशो वंशानुचरितं संस्था हेतुरपाश्रयः॥
              </div>
              <p className="text-[10px] text-emerald-800 mt-0.5">
                महापुराणों के पूर्ण होने के १० शास्त्रीय लक्षण (सर्ग, विसर्ग, वृत्ति, रक्षा, मन्वन्तर, वंश, वंशानुचरित, संस्था/प्रलय, हेतु, और अपाश्रय)।
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shrink-0 shadow-2xs">
              १० शास्त्रीय लक्षण मानक
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCharacteristics.map((char) => (
              <div
                key={char.id}
                className="card p-2.5 border-cream-200 hover:border-emerald-300 hover:shadow-2xs transition-all"
              >
                <div className="flex items-start justify-between gap-2 border-b border-cream-100 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {char.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-[13px] text-charcoal-900 font-devanagari">
                        {char.sanskritName}
                      </h4>
                      <div className="text-[10px] text-charcoal-500 font-medium">
                        {char.enName}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold bg-cream-100 text-charcoal-600 px-1.5 py-0.2 rounded border border-cream-200">
                    {char.shlokaRef}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[10px]">
                  <div>
                    <span className="font-bold text-charcoal-700">शास्त्रीय परिभाषा: </span>
                    <span className="text-charcoal-800 leading-relaxed text-[10px]">{char.definition}</span>
                  </div>

                  <div className="bg-cream-50 p-1.5 rounded-lg border border-cream-200">
                    <span className="font-bold text-emerald-800">दार्शनिक रहस्य: </span>
                    <span className="text-charcoal-700 text-[10px]">{char.puranicSignificance}</span>
                  </div>

                  <div>
                    <span className="font-bold text-charcoal-700">प्रमुख पुराणों में उदाहरण: </span>
                    <span className="text-saffron-700 font-medium text-[10px]">{char.examplesInGranthas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="ग्रंथ हटाने की पुष्टि (Confirm Delete)"
        message={`क्या आप सुनिश्चित हैं कि आप ग्रंथ "${deleteTarget?.name}" (${deleteTarget?.enName}) को हटाना चाहते हैं? इसके अन्तर्गत जुड़े संरचना वृक्ष व श्लोक भी प्रभावित हो सकते हैं।`}
        confirmLabel="हाँ, ग्रंथ हटाएं"
        cancelLabel="रद्द करें"
        danger
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default PuranaItihasaListPage;
