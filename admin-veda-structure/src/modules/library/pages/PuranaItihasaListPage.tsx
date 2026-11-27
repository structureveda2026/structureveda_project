import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ShieldCheck,
  CheckCircle2,
  Award,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type {
  PuranaItihasaGrantha,
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
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PuranaItihasaAdminService.getAllTexts();
      setGranthas(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load Purana & Itihasa texts";
      showError(msg || "Failed to load Purana & Itihasa texts");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Seed Archive handler
  const handleSeedArchive = async () => {
    try {
      setSeeding(true);
      const res = await PuranaItihasaAdminService.seedArchive(true);
      showSuccess(res.message);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync archive";
      showError(msg || "Failed to sync archive");
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
      showSuccess(`"${deleteTarget.enName || deleteTarget.name}" deleted successfully`);
      setGranthas((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete text";
      showError(msg || "Failed to delete text");
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
      totalShlokas: "5,25,000+",
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
            Sattvika
          </span>
        );
      case "rajasa":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Rajasa
          </span>
        );
      case "tamasa":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            Tamasa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-100 text-charcoal-700 border border-charcoal-200">
            Vedic
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
          Active
        </span>
      );
    }
    if (status === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
          Draft
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-charcoal-100 text-charcoal-600 border border-charcoal-200">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Sacred Royal Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0f0a] via-[#2c1810] to-[#1c0d07] text-white p-4 sm:p-5 border border-amber-500/25 shadow-elevated">
        {/* Sacred Ambient Glow & Watermark */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-6 bottom-1 opacity-5 pointer-events-none select-none text-8xl font-serif font-black text-amber-200">
          ॐ
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Sacred Shloka Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold backdrop-blur-sm bg-amber-500/20 border-amber-400/30 text-amber-200 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span className="tracking-wide">अष्टादशपुराणेषु व्यासस्य वचनद्वयम् • परोपकाराय पुण्याय पापाय परपीडनम्</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-cream-50 leading-tight">
              Purana &amp; Itihasa Archive
            </h1>

            <p className="text-xs text-cream-200/90 leading-relaxed max-w-xl">
              Comprehensive digital archive management for the 18 Mahapuranas, Valmiki Ramayana, Mahabharata, 18 Upapuranas, 10 Philosophical Jewels, and the 10 Shastric Characteristics of Shrimad Bhagavatam.
            </p>

            {/* Quick Hero Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-amber-200/90">
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span>18 Mahapuranas (Sattvika • Rajasa • Tamasa)</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                <Scroll className="w-3 h-3 text-amber-400" />
                <span>5 Itihasas &amp; Epics (Ramayana, Mahabharata...)</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>10 Shastric Characteristics &amp; Philosophical Jewels</span>
              </span>
            </div>
          </div>

          {/* Banner Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2 shrink-0">
            <button
              onClick={handleSeedArchive}
              disabled={seeding}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-500 hover:from-amber-400 hover:to-saffron-400 text-charcoal-900 font-bold text-xs shadow-2xs transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              title="Re-seed and sync the authentic 18 Mahapuranas and Itihasas in the database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-charcoal-900 ${seeding ? "animate-spin" : ""}`} />
              <span>{seeding ? "Syncing..." : "Seed Archive"}</span>
            </button>

            <Link
              to="/admin/purana-itihasa/new"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Add New Grantha</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards at Top (Compact Bento-Luxury) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Total Texts */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-saffron-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Total Texts
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight font-serif leading-none">
                {statsSummary.totalTexts}
              </span>
              <span className="text-[10px] font-medium text-charcoal-500">
                Core Granthas
              </span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">
              18 Mahapuranas + 5 Itihasas
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-saffron-50 text-saffron-600 border border-saffron-200/60 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-400 to-amber-500" />
        </div>

        {/* Card 2: Total Shlokas */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-gold-400 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Total Shlokas
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-amber-700 tracking-tight font-serif leading-none">
                5,25,000+
              </span>
              <span className="text-[10px] font-medium text-charcoal-500">
                Shlokas
              </span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">
              400K Puranas + 125K Itihasas
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 text-amber-700 border border-amber-200/60 group-hover:scale-105 transition-transform">
            <Scroll className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-gold-500" />
        </div>

        {/* Card 3: Triguna Classification */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Triguna Classification
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal-800">
              <span className="text-emerald-700">6 Sattvika</span> •
              <span className="text-amber-700">6 Rajasa</span> •
              <span className="text-purple-700">6 Tamasa</span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">
              Per Padma &amp; Matsya Purana
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/60 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600" />
        </div>

        {/* Card 4: 10 Akhyanas & Jewels */}
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Jewels &amp; Upapuranas
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-purple-800 tracking-tight font-serif leading-none">
                10 Jewels
              </span>
              <span className="text-[10px] font-normal text-charcoal-500">
                &amp; 18 Upapuranas
              </span>
            </div>
            <p className="text-[10px] text-charcoal-500 truncate">
              Gita, Chandi, Sahasranama, Moksha
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-50 text-purple-700 border border-purple-200/60 group-hover:scale-105 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600" />
        </div>
      </div>

      {/* 3. Floating Segmented Tab Switcher */}
      <div className="bg-cream-200/60 p-1 rounded-xl border border-cream-300/60 shadow-2xs">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("mahapuranas")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === "mahapuranas"
                ? "bg-white text-saffron-800 shadow-soft border border-cream-200/90 font-bold scale-[1.01]"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-saffron-600" />
            <span>1. 18 Mahapuranas</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "mahapuranas" ? "bg-saffron-500 text-white" : "bg-saffron-100 text-saffron-800"
            }`}>
              18
            </span>
          </button>

          <button
            onClick={() => setActiveTab("itihasas")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === "itihasas"
                ? "bg-white text-saffron-800 shadow-soft border border-cream-200/90 font-bold scale-[1.01]"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Itihasa &amp; Epics</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "itihasas" ? "bg-amber-600 text-white" : "bg-cream-200 text-charcoal-800"
            }`}>
              5
            </span>
          </button>

          <button
            onClick={() => setActiveTab("akhyanas")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === "akhyanas"
                ? "bg-white text-purple-800 shadow-soft border border-cream-200/90 font-bold scale-[1.01]"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>3. 10 Philosophical Jewels</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "akhyanas" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-800"
            }`}>
              10
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upapuranas")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === "upapuranas"
                ? "bg-white text-amber-900 shadow-soft border border-cream-200/90 font-bold scale-[1.01]"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>4. 18 Upapuranas</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "upapuranas" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
            }`}>
              18
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lakshanas")}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === "lakshanas"
                ? "bg-white text-emerald-900 shadow-soft border border-cream-200/90 font-bold scale-[1.01]"
                : "text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>5. 10 Shastric Characteristics</span>
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "lakshanas" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
            }`}>
              10
            </span>
          </button>
        </nav>
      </div>

      {/* 4. Search and Filter Bar (Executive Control Center) */}
      <div className="card p-2 sm:p-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 bg-white border border-cream-200/90 shadow-soft">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "mahapuranas"
                ? "Search Mahapurana name, deity, or rishi..."
                : activeTab === "itihasas"
                ? "Search Ramayana, Mahabharata, or section..."
                : activeTab === "akhyanas"
                ? "Search narrative or stotra..."
                : activeTab === "upapuranas"
                ? "Search Upapurana name..."
                : "Search Dasha Lakshanas (Sarga, Visarga, Manvantara...)..."
            }
            className="input-field pl-8 pr-12 py-1.5 text-xs w-full rounded-lg bg-cream-50/40 focus:bg-white border-cream-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-charcoal-400 hover:text-saffron-600 transition-colors"
            >
              Clear
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
                className="input-field py-1 px-2.5 text-xs w-auto rounded-lg bg-cream-50/40 focus:bg-white border-cream-200"
              >
                <option value="all">All Gunas</option>
                <option value="sattvika">Sattvika</option>
                <option value="rajasa">Rajasa</option>
                <option value="tamasa">Tamasa</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-charcoal-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field py-1 px-2.5 text-xs w-auto rounded-lg bg-cream-50/40 focus:bg-white border-cream-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB 1 & 2: Table for 18 Mahapuranas OR Itihasa & Epics (Compact & Luxury) */}
      {(activeTab === "mahapuranas" || activeTab === "itihasas") && (
        <div className="card overflow-hidden shadow-soft border border-cream-200/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-cream-100/90 via-cream-50 to-cream-100/90 border-b border-cream-200 text-[10.5px] font-bold text-charcoal-700 uppercase tracking-wider">
                  <th className="py-2 px-2.5 w-10 text-center">#</th>
                  <th className="py-2 px-2.5 min-w-[200px]">Grantha Name (Script &amp; English)</th>
                  <th className="py-2 px-2.5">Category</th>
                  <th className="py-2 px-2.5">Guna</th>
                  <th className="py-2 px-2.5">Chief Deity &amp; Speaker</th>
                  <th className="py-2 px-2.5">Shlokas / Chapters</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                  <th className="py-2 px-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-charcoal-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <RefreshCw className="w-5 h-5 animate-spin text-saffron-500" />
                        <span className="text-xs">Loading grantha data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTexts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-charcoal-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <BookOpen className="w-6 h-6 text-charcoal-300" />
                        <span className="font-semibold text-sm text-charcoal-700">No Granthas Found</span>
                        <span className="text-[11px] text-charcoal-400">
                          Try adjusting your search terms or filters, or add a new grantha.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTexts.map((item, index) => (
                    <tr key={item.id} className="hover:bg-amber-50/25 transition-colors group">
                      {/* Serial */}
                      <td className="py-1.5 px-2.5 text-center text-[10.5px] font-semibold text-charcoal-400 font-mono">
                        {index + 1}
                      </td>

                      {/* Name & English */}
                      <td className="py-1.5 px-2.5">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-800 border border-saffron-200/70 flex items-center justify-center font-serif font-bold text-[11px] shadow-2xs shrink-0 mt-0.5">
                            {item.enName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-charcoal-900 text-xs sm:text-[13px] group-hover:text-saffron-700 transition-colors">
                              {item.enName}
                            </div>
                            <div className="text-[10px] text-charcoal-500 font-medium font-devanagari">
                              {item.name}
                            </div>
                            {item.eyebrow && (
                              <div className="text-[9px] text-saffron-700 font-medium line-clamp-1 bg-saffron-50/70 px-1 py-0.2 rounded inline-block mt-0.5">
                                {item.eyebrow}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-1.5 px-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-saffron-50 text-saffron-800 border border-saffron-200/70">
                          {item.category === "purana" ? "Mahapurana" : item.category === "itihasa" ? "Itihasa" : item.category}
                        </span>
                      </td>

                      {/* Guna Badge */}
                      <td className="py-1.5 px-2.5 whitespace-nowrap">
                        {renderGunaBadge(item.guna)}
                      </td>

                      {/* Deity & Rishis */}
                      <td className="py-1.5 px-2.5">
                        <div className="text-[11px] font-semibold text-charcoal-800">
                          {item.chiefDeity}
                        </div>
                        <div className="text-[9.5px] text-charcoal-500 line-clamp-1">
                          {item.primaryRishis}
                        </div>
                      </td>

                      {/* Shlokas / Stats */}
                      <td className="py-1.5 px-2.5">
                        <div className="text-[11px] font-bold text-charcoal-900">
                          {item.shlokaCount || item.statsMeta?.mantraCount || "—"}
                        </div>
                        <div className="text-[9.5px] text-charcoal-500">
                          {item.adhyayaCount || `${item.statsMeta?.nodeCount || 6} Sections`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-1.5 px-2.5 text-center whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-1.5 px-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* 1. Shlokas Management */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/shlokas`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 transition shadow-2xs hover:scale-[1.02]"
                            title="Manage Shlokas & Verses"
                          >
                            <Scroll className="w-2.5 h-2.5 text-amber-700" />
                            <span>Shlokas</span>
                          </Link>

                          {/* 2. Structure Tree */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/structure`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 hover:bg-blue-100/90 text-blue-800 border border-blue-200/80 transition shadow-2xs hover:scale-[1.02]"
                            title="Structure Hierarchy Tree (Khandas, Parvas, Sargas, Adhyayas)"
                          >
                            <FolderTree className="w-2.5 h-2.5 text-blue-700" />
                            <span>Structure Tree</span>
                          </Link>

                          {/* 3. Edit */}
                          <Link
                            to={`/admin/purana-itihasa/${item.id}/edit`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-700 border border-cream-300 transition shadow-2xs hover:scale-[1.02]"
                            title="Edit Grantha Metadata"
                          >
                            <Edit className="w-2.5 h-2.5 text-charcoal-600" />
                            <span>Edit</span>
                          </Link>

                          {/* 4. Delete */}
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1 rounded-md text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete"
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
          <div className="py-2 px-3 bg-cream-50/80 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-[10.5px] text-charcoal-600 gap-1.5">
            <div>
              Showing Granthas: <span className="font-bold text-charcoal-900">{filteredTexts.length}</span> / {granthas.length}
            </div>
            <div className="flex items-center gap-3 text-charcoal-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sattvika
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Rajasa
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" /> Tamasa
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 10 Philosophical Jewels - Compact */}
      {activeTab === "akhyanas" && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#210d33] via-[#2f1247] to-[#1a0a29] text-purple-100 p-3 sm:p-3.5 border border-purple-700/40 shadow-soft flex items-start gap-2.5">
            <Award className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
            <div className="text-[10.5px] text-purple-100/90 leading-relaxed">
              <span className="font-bold text-white">10 Priceless Philosophical Jewels of Puranas &amp; Mahabharata:</span> These timeless standalone spiritual discourses have emerged from their source scriptures to become foundational pillars of daily study, devotion, and liberation in Sanatana Dharma. Shlokas, meanings, and structure for each jewel can be managed directly.
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
                        <h3 className="font-bold text-xs sm:text-[13px] text-charcoal-900">
                          {jewel.enTitle}
                        </h3>
                        <p className="text-[10px] text-charcoal-500 font-medium font-devanagari">
                          {jewel.title}
                        </p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 text-purple-800 shrink-0">
                      {jewel.shlokaCount}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-[10px]">
                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">Source Text:</span>
                      <span className="font-medium text-saffron-700 bg-saffron-50 px-1.5 py-0.2 rounded text-[9px]">
                        {jewel.sourceGrantha}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">Chief Deity:</span>
                      <span>{jewel.chiefDeity}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-charcoal-700">
                      <span className="font-semibold text-charcoal-500">Speaker / Listener:</span>
                      <span className="text-charcoal-600">{jewel.speaker}</span>
                    </div>

                    <div className="pt-1 text-charcoal-600 leading-relaxed text-[10px] bg-cream-50/60 p-1.5 rounded-lg border border-cream-200">
                      <span className="font-bold text-charcoal-800">Philosophical Significance: </span>
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
                    <CheckCircle2 className="w-2.5 h-2.5" /> Active Collection
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/purana-itihasa/${jewel.sourcePuranaId}/shlokas`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                    >
                      <Scroll className="w-2.5 h-2.5" />
                      <span>View Shlokas</span>
                    </Link>
                    <Link
                      to={`/admin/purana-itihasa/${jewel.sourcePuranaId}/structure`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-charcoal-700 border border-cream-300 hover:bg-cream-200 transition"
                    >
                      <FolderTree className="w-2.5 h-2.5" />
                      <span>Structure</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 18 Upapuranas - Compact & Luxury */}
      {activeTab === "upapuranas" && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#2c1810] via-[#3a1d11] to-[#200e07] text-amber-100 p-3 sm:p-3.5 border border-amber-700/40 shadow-soft flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-[10.5px] text-amber-100/90 leading-relaxed">
              <span className="font-bold text-white">18 Upapuranas (Minor Puranas):</span> Complementing the Mahapuranas, these 18 Upapuranas expounded by Vyasa, Sanatkumara, Durvasa, Vashistha, and other sages form the authoritative foundation for specialized spiritual practices, Shakti Peethas, sacred pilgrimage sites, and esoteric mantra traditions.
            </div>
          </div>

          <div className="card overflow-hidden shadow-soft border border-cream-200/90">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-cream-100/90 via-cream-50 to-cream-100/90 border-b border-cream-200 text-[10.5px] font-bold text-charcoal-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center">#</th>
                    <th className="py-2 px-2.5 min-w-[180px]">Upapurana Name</th>
                    <th className="py-2 px-2.5">Tradition</th>
                    <th className="py-2 px-2.5">Deity &amp; Rishi</th>
                    <th className="py-2 px-2.5">Shlokas</th>
                    <th className="py-2 px-2.5 min-w-[240px]">Summary</th>
                    <th className="py-2 px-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 text-xs">
                  {filteredUpapuranas.map((u, i) => (
                    <tr key={u.id} className="hover:bg-amber-50/25 transition-colors">
                      <td className="py-1.5 px-2.5 text-center text-[10.5px] font-semibold text-charcoal-400 font-mono">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-2.5">
                        <div className="font-bold text-charcoal-900 text-xs">
                          {u.enName}
                        </div>
                        <div className="text-[10px] text-charcoal-500 font-medium font-devanagari">
                          {u.name}
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {u.tradition}
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5">
                        <div className="text-[11px] font-medium text-charcoal-800">
                          {u.chiefDeity}
                        </div>
                        <div className="text-[9px] text-charcoal-500">
                          {u.associatedRishi}
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 whitespace-nowrap text-[11px] font-bold text-charcoal-700">
                        {u.approxShlokas}
                      </td>
                      <td className="py-1.5 px-2.5 text-[10px] text-charcoal-600 leading-snug">
                        {u.summary}
                      </td>
                      <td className="py-1.5 px-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-green-50 text-green-700 border border-green-200">
                          Active
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

      {/* TAB 5: 10 Shastric Characteristics - Compact & Luxury */}
      {activeTab === "lakshanas" && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0d2818] via-[#123822] to-[#091f13] text-emerald-100 p-3 sm:p-3.5 border border-emerald-700/40 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shrimad Bhagavata Mahapurana (Skandha 12.7.9-10 &amp; Skandha 2.10.1)</span>
              </div>
              <div className="text-xs sm:text-[13px] font-devanagari font-bold text-white mt-0.5 italic">
                सर्गोऽस्याथ विसर्गश्च वृत्ती रक्षान्तराणि च। वंशो वंशानुचरितं संस्था हेतुरपाश्रयः॥
              </div>
              <p className="text-[10px] text-emerald-200/90 mt-0.5">
                The 10 classical characteristics of a complete Mahapurana (Sarga, Visarga, Vritti, Raksha, Manvantara, Vamsha, Vamshanucharita, Samstha/Pralaya, Hetu, and Apashraya).
              </p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-700/80 border border-emerald-500/30 text-white font-bold text-[10px] shrink-0 shadow-2xs">
              10 Shastric Standards
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCharacteristics.map((char) => (
              <div
                key={char.id}
                className="card p-3 border-cream-200/90 hover:border-emerald-300 hover:shadow-card transition-all duration-200 rounded-xl"
              >
                <div className="flex items-start justify-between gap-2 border-b border-cream-100 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {char.id}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-[13px] text-charcoal-900">
                        {char.enName}
                      </h4>
                      <div className="text-[10px] text-charcoal-500 font-medium font-devanagari">
                        {char.sanskritName}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold bg-cream-100 text-charcoal-600 px-1.5 py-0.2 rounded border border-cream-200">
                    {char.shlokaRef}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[10px]">
                  <div>
                    <span className="font-bold text-charcoal-700">Classical Definition: </span>
                    <span className="text-charcoal-800 leading-relaxed text-[10px]">{char.definition}</span>
                  </div>

                  <div className="bg-cream-50 p-1.5 rounded-lg border border-cream-200">
                    <span className="font-bold text-emerald-800">Philosophical Significance: </span>
                    <span className="text-charcoal-700 text-[10px]">{char.puranicSignificance}</span>
                  </div>

                  <div>
                    <span className="font-bold text-charcoal-700">Examples in Granthas: </span>
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
        title="Confirm Grantha Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.enName}" (${deleteTarget?.name})? Linked structure tree nodes and shlokas may also be affected.`}
        confirmLabel="Yes, Delete Grantha"
        cancelLabel="Cancel"
        danger
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default PuranaItihasaListPage;
