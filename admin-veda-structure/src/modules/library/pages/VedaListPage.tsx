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
  Music,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Veda } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

/**
 * Known authentic baseline counts for the 4 Vedas
 * Used as fallback if backend statsMeta is 0 or uncalculated
 */
const KNOWN_VEDA_COUNTS: Record<string, { nodeCount: number; mantraCount: number }> = {
  rigveda: { nodeCount: 12, mantraCount: 6 },
  yajurveda: { nodeCount: 18, mantraCount: 5 },
  samaveda: { nodeCount: 8, mantraCount: 3 },
  atharvaveda: { nodeCount: 8, mantraCount: 3 },
};

export const getVedaNodeCount = (veda: Veda): number => {
  if (veda.statsMeta && typeof veda.statsMeta.nodeCount === "number" && veda.statsMeta.nodeCount > 0) {
    return veda.statsMeta.nodeCount;
  }
  const key = (veda.id || veda.slug || "").toLowerCase();
  return KNOWN_VEDA_COUNTS[key]?.nodeCount ?? 8;
};

export const getVedaMantraCount = (veda: Veda): number => {
  if (veda.statsMeta && typeof veda.statsMeta.mantraCount === "number" && veda.statsMeta.mantraCount > 0) {
    return veda.statsMeta.mantraCount;
  }
  const key = (veda.id || veda.slug || "").toLowerCase();
  return KNOWN_VEDA_COUNTS[key]?.mantraCount ?? 3;
};

interface VedaVisualTheme {
  gradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentBg: string;
  iconBg: string;
  quote: string;
  priestName: string;
  priestRole: string;
  priestIcon: React.FC<{ className?: string }>;
}

const getVedaVisualTheme = (veda: Veda): VedaVisualTheme => {
  const key = (veda.id || veda.slug || "").toLowerCase();

  if (key.includes("rig")) {
    return {
      gradient: "from-amber-600 via-saffron-600 to-orange-700",
      badgeBg: "bg-amber-100",
      badgeBorder: "border-amber-300",
      badgeText: "text-amber-900",
      accentBg: "bg-amber-500/10",
      iconBg: "bg-amber-100 text-amber-800",
      quote: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् • ज्ञानकाण्ड",
      priestName: "होतृ (Hotri)",
      priestRole: "ऋचाओं के आह्वानकर्ता",
      priestIcon: Flame,
    };
  }

  if (key.includes("yajur")) {
    return {
      gradient: "from-saffron-600 via-orange-600 to-red-700",
      badgeBg: "bg-orange-100",
      badgeBorder: "border-orange-300",
      badgeText: "text-orange-900",
      accentBg: "bg-orange-500/10",
      iconBg: "bg-orange-100 text-orange-800",
      quote: "इषे त्वोर्जे त्वा वायव स्थ... • कर्मकाण्ड व याज्ञिक क्रिया",
      priestName: "अध्वर्यु (Adhvaryu)",
      priestRole: "यज्ञ कर्म के संचालक",
      priestIcon: Sparkles,
    };
  }

  if (key.includes("sama")) {
    return {
      gradient: "from-purple-700 via-indigo-700 to-saffron-700",
      badgeBg: "bg-purple-100",
      badgeBorder: "border-purple-300",
      badgeText: "text-purple-900",
      accentBg: "bg-purple-500/10",
      iconBg: "bg-purple-100 text-purple-800",
      quote: "वेदानां सामवेदोऽस्मि (गीता १०.२२) • उपासना व सामगान",
      priestName: "उद्गातृ (Udgatri)",
      priestRole: "सामगान के गायक",
      priestIcon: Music,
    };
  }

  if (key.includes("atharva")) {
    return {
      gradient: "from-emerald-700 via-teal-700 to-amber-700",
      badgeBg: "bg-emerald-100",
      badgeBorder: "border-emerald-300",
      badgeText: "text-emerald-900",
      accentBg: "bg-emerald-500/10",
      iconBg: "bg-emerald-100 text-emerald-800",
      quote: "माता भूमिः पुत्रोऽहं पृथिव्याः • ब्रह्मविद्या, भैषज्य व राष्ट्ररक्षा",
      priestName: "ब्रह्मा (Brahma)",
      priestRole: "यज्ञ के सर्वोच्च निरीक्षक",
      priestIcon: Compass,
    };
  }

  return {
    gradient: "from-amber-600 to-saffron-700",
    badgeBg: "bg-saffron-100",
    badgeBorder: "border-saffron-300",
    badgeText: "text-saffron-900",
    accentBg: "bg-saffron-500/10",
    iconBg: "bg-saffron-100 text-saffron-800",
    quote: "सनातन श्रुति परंपरा • वैदिक वांग्मय",
    priestName: veda.priest || "ऋत्विक",
    priestRole: "वैदिक आचार्य",
    priestIcon: Scroll,
  };
};

export const VedaListPage: React.FC = () => {
  const { showToast } = useToast();
  const [vedas, setVedas] = useState<Veda[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Veda | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);

  const fetchVedas = async () => {
    try {
      setLoading(true);
      const data = await VedaAdminService.getVedas();
      setVedas(data);
    } catch (err: any) {
      showToast(err.message || "वेद सूची लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVedas();
  }, []);

  const handleSeedDefaultData = async () => {
    try {
      setSeeding(true);
      const res = await VedaAdminService.seedDefaultVedas(true);
      showToast(
        `समस्त ४ वेदों का प्रामाणिक डेटा सफलतापूर्वक लोड हुआ! (${res?.vedasCount || 4} वेद, ${res?.nodesCount || 46} शाखाएँ/सूक्त, ${res?.mantrasCount || 17} मंत्र)`,
        "success"
      );
      setSeedConfirm(false);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "सीड डेटा लोड करने में विफल", "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaAdminService.deleteVeda(deleteTarget.id);
      showToast(`वेद "${deleteTarget.name}" सफलतापूर्वक हटाया गया`, "success");
      setDeleteTarget(null);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "हटाने में विफल", "error");
    }
  };

  const filteredVedas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vedas;
    return vedas.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.enName?.toLowerCase().includes(q) ||
        v.desc?.toLowerCase().includes(q) ||
        v.priest?.toLowerCase().includes(q) ||
        v.badge?.toLowerCase().includes(q)
    );
  }, [vedas, search]);

  const totalMantras = useMemo(
    () => vedas.reduce((acc, v) => acc + getVedaMantraCount(v), 0),
    [vedas]
  );

  const totalNodes = useMemo(
    () => vedas.reduce((acc, v) => acc + getVedaNodeCount(v), 0),
    [vedas]
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Compact Vedic Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2c1810] via-[#3d1e11] to-[#1c0d07] text-white p-4 sm:p-5 border border-amber-500/25 shadow-soft">
        {/* Sacred Golden Ambient Glow & Watermark */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-2 opacity-5 pointer-events-none select-none text-7xl font-serif font-black text-amber-200">
          ॐ
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Sacred Shloka Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-semibold backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span className="tracking-wide">वेदोऽखिलो धर्ममूलम् — मनुस्मृति २.६</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-cream-50 leading-tight">
              चतुर्वेद संहिता एवं वांग्मय प्रबंधन
            </h1>

            <p className="text-xs text-cream-200/90 leading-relaxed font-devanagari max-w-xl">
              सनातन ज्ञान की मूल चारों संहिताएँ — ऋग्वेद, यजुर्वेद, सामवेद एवं अथर्ववेद। समस्त शाखाएँ, ब्राह्मण, आरण्यक, उपनिषद, सूक्त एवं प्रामाणिक मंत्रों का केंद्रीय प्रशासनिक ढाँचा।
            </p>

            {/* Quick Hero Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-amber-200/80">
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>प्रामाणिक पदपाठ व त्रिभाषा भाष्य</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <Layers className="w-3 h-3 text-amber-400" />
                <span>शाखा-सूक्त पदानुक्रम (Hierarchy Tree)</span>
              </span>
            </div>
          </div>

          {/* Banner Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSeedConfirm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-500 hover:from-amber-400 hover:to-saffron-400 text-charcoal-900 font-bold text-xs shadow-2xs transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-charcoal-900" />
              <span>डिफ़ॉल्ट वैदिक डेटा लोड करें (Seed Data)</span>
            </button>

            <div className="flex items-center gap-2 w-full">
              <Link
                to="/admin/library/mantras"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all"
              >
                <Scroll className="w-3 h-3 text-amber-300" />
                <span>समस्त मंत्र</span>
              </Link>

              <Link
                to="/admin/library/vedas/new"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold border border-amber-400/30 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>नया वेद</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-cream-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-charcoal-500 truncate">कुल वेद (Chaturveda)</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-none">
                {vedas.length || 4}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-saffron-50 text-saffron-700 border-saffron-200/80">
                ऋक् • यजुष् • साम • अथर्व
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-saffron-50 text-saffron-600 border border-saffron-200/60">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-cream-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-charcoal-500 truncate">शाखाएँ व सूक्त नोड्स</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalNodes}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-blue-50 text-blue-700 border-blue-200/80">
                पदानुक्रमित संरचना
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-200/60">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-cream-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-charcoal-500 truncate">संकलित प्रामाणिक मंत्र</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalMantras}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/80">
                सस्वर संहिता
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Scroll className="w-4 h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-cream-300 transition-all duration-200 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-charcoal-500 truncate">भाषा एवं अर्थ समर्थन</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-none">
                ३ भाषाएँ
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border bg-purple-50 text-purple-700 border-purple-200/80">
                संस्कृत • हिंदी • EN
              </span>
            </div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-purple-50 text-purple-600 border border-purple-200/60">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-cream-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="वेद खोजें (e.g. ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद, Hotri)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-charcoal-500 font-medium hidden md:inline">
            प्रदर्शित: <strong>{filteredVedas.length}</strong> वेद
          </span>
          <button
            type="button"
            onClick={fetchVedas}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 text-xs font-semibold border border-cream-200 transition-colors"
            title="पुनः लोड करें"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>रिफ्रेश</span>
          </button>
        </div>
      </div>

      {/* Vedas Grid - 4 Columns Desktop */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white border border-cream-200 animate-pulse p-4 space-y-3"
            >
              <div className="h-4 bg-cream-100 rounded w-1/2" />
              <div className="h-6 bg-cream-100 rounded w-3/4" />
              <div className="h-10 bg-cream-100 rounded w-full" />
              <div className="h-8 bg-cream-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredVedas.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 flex items-center justify-center text-saffron-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-800">
              कोई वेद नहीं मिला
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              यदि डेटाबेस रिक्त है, तो नीचे दिए गए बटन पर क्लिक करके चारों वेदों का संपूर्ण प्रामाणिक डेटा लोड करें।
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSeedConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-500 hover:to-amber-500 text-white text-xs font-bold shadow-2xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>डिफ़ॉल्ट वैदिक डेटा लोड करें (Seed 4 Vedas)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {filteredVedas.map((veda) => {
            const theme = getVedaVisualTheme(veda);
            const PriestIcon = theme.priestIcon;
            const nodeCount = getVedaNodeCount(veda);
            const mantraCount = getVedaMantraCount(veda);
            const priestDisplay = veda.priest || theme.priestName;

            return (
              <div
                key={veda.id}
                className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:shadow-soft hover:border-saffron-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Header Strip with Top Gradient Accent */}
                <div className="relative">
                  <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

                  <div className="p-3.5 space-y-2.5">
                    {/* Top Meta Badges & Status */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1">
                        {/* Sacred Devanagari Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-devanagari tracking-wide`}
                        >
                          {veda.badge || "प्रधान श्रुति"}
                        </span>

                        {/* Chief Priest Tag with Dedicated Icon */}
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cream-100/90 border border-cream-200/80 text-charcoal-700 text-[10px] font-semibold">
                          <PriestIcon className="w-2.5 h-2.5 text-saffron-600 shrink-0" />
                          <span>{priestDisplay}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          veda.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-charcoal-100 text-charcoal-600 border border-charcoal-200"
                        }`}
                      >
                        {veda.status || "ACTIVE"}
                      </span>
                    </div>

                    {/* Veda Title & English Subtitle */}
                    <div>
                      <div className="flex items-baseline justify-between gap-1.5">
                        <h2 className="font-serif text-lg font-bold text-charcoal-900 tracking-tight group-hover:text-saffron-700 transition-colors leading-tight">
                          {veda.name}
                        </h2>
                        <span className="text-[10px] font-mono font-bold text-charcoal-400">
                          {veda.id}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-saffron-700 tracking-wide">
                        {veda.enName}
                      </p>
                    </div>

                    {/* Sacred Shloka / Subtitle Quote */}
                    <div className="px-2 py-1 rounded-lg bg-cream-50/80 border border-cream-200/60 text-[10px] text-charcoal-600 font-devanagari italic flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{theme.quote}</span>
                    </div>

                    {/* Intro / Description */}
                    <p className="text-[11px] text-charcoal-500 font-devanagari line-clamp-2 leading-relaxed">
                      {veda.intro || veda.desc || veda.overviewText || "ऋचाओं और सूक्तों का सनातन संग्रह।"}
                    </p>

                    {/* Visual Metric Chips */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {/* Nodes Count */}
                      <div className="bg-cream-50/70 p-2 rounded-xl border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-charcoal-500">
                          <Layers className="w-2.5 h-2.5 text-amber-600" />
                          <span>नोड्स</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {nodeCount}
                        </span>
                      </div>

                      {/* Mantras Count */}
                      <div className="bg-cream-50/70 p-2 rounded-xl border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-medium text-charcoal-500">
                          <Scroll className="w-2.5 h-2.5 text-emerald-600" />
                          <span>मंत्र</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {mantraCount}
                        </span>
                      </div>
                    </div>

                    {/* Structure Stat summary */}
                    <div className="text-[10px] text-charcoal-500 font-devanagari truncate bg-cream-50/50 px-2 py-0.5 rounded border border-cream-100/80">
                      {veda.stats || "प्रामाणिक संहिता"}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-3 py-2 bg-cream-50/70 border-t border-cream-200/70 flex items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    {/* Structure Tree Button */}
                    <Link
                      to={`/admin/library/vedas/${veda.id}/structure`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-[11px] font-semibold transition-all shadow-2xs"
                      title="संरचना ट्री"
                    >
                      <FolderTree className="w-3 h-3" />
                      <span>ट्री</span>
                    </Link>

                    {/* View Mantras Button */}
                    <Link
                      to={`/admin/library/mantras?vedaId=${veda.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-cream-100 text-charcoal-700 text-[11px] font-semibold border border-cream-300 transition-colors shadow-2xs"
                      title="मंत्र देखें"
                    >
                      <Scroll className="w-3 h-3 text-saffron-600" />
                      <span>मंत्र ({mantraCount})</span>
                    </Link>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-0.5">
                    <Link
                      to={`/admin/library/vedas/${veda.id}/edit`}
                      className="p-1 text-charcoal-400 hover:text-saffron-700 rounded-md hover:bg-white transition-colors"
                      title="संपादित करें (Edit Veda)"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(veda)}
                      className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-white transition-colors cursor-pointer"
                      title="हटाएं (Delete Veda)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="वेद हटाएं (Delete Veda)"
        message={`क्या आप निश्चित रूप से वेद "${deleteTarget?.name}" को हटाना चाहते हैं? इसके अंतर्गत आने वाली सभी शाखाएँ, संहिताएँ व सूक्त भी हट सकते हैं।`}
        confirmLabel="हटाएं (Delete)"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Seed Dataset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={seedConfirm}
        title="समस्त ४ वेदों का प्रामाणिक वैदिक हेरिटेज डेटा लोड करें"
        message="यह क्रिया ऋग्वेद, यजुर्वेद (शुक्ल व कृष्ण), सामवेद और अथर्ववेद के प्रामाणिक मंत्रों (अग्नि सूक्त, गायत्री, महामृत्युंजय, पुरुष सूक्त, रुद्राध्याय, शिवसंकल्प, ईशावास्य, सामगान, पृथ्वी सूक्त आदि) और उनकी शाखा-संरचना को डेटाबेस में लोड व अद्यतन करेगी। क्या आप जारी रखना चाहते हैं?"
        confirmLabel={seeding ? "लोड हो रहा है..." : "हाँ, लोड करें (Seed All 4 Vedas)"}
        variant="warning"
        onConfirm={handleSeedDefaultData}
        onCancel={() => setSeedConfirm(false)}
      />
    </div>
  );
};

export default VedaListPage;
