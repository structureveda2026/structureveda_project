import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash2,
  Sparkles,
  Scroll,
  Languages,
  BookOpen,
  Copy,
  Check,
  Flame,
  Volume2,
  BookMarked,
  Layers,
  Feather,
  Music,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { VedaMantra } from "../types/veda.types";
import VedaMantraAdminService from "../services/vedaMantra.service";

export const MantraDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mantra, setMantra] = useState<VedaMantra | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<"hindi" | "english" | "hinglish">("hindi");
  const [copiedMantra, setCopiedMantra] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Adjacent sibling mantras for Prev / Next navigation
  const [prevMantraId, setPrevMantraId] = useState<string | null>(null);
  const [nextMantraId, setNextMantraId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMantra = async () => {
      try {
        setLoading(true);
        const data = await VedaMantraAdminService.getMantraById(id);
        setMantra(data);

        // Determine previous and next mantras
        if (data.previousId) {
          setPrevMantraId(data.previousId);
        }
        if (data.nextId) {
          setNextMantraId(data.nextId);
        }

        // If previousId or nextId not provided, look at siblings or fetch adjacent in same section
        if (!data.previousId || !data.nextId) {
          try {
            const siblingsRes = await VedaMantraAdminService.getMantras({
              vedaId: data.vedaId,
              nodeId: data.nodeId || undefined,
              limit: 50,
            });
            const list = siblingsRes.mantras || [];
            const currentIndex = list.findIndex((m) => m.id === id);
            if (currentIndex !== -1) {
              if (!data.previousId && currentIndex > 0) {
                setPrevMantraId(list[currentIndex - 1].id);
              }
              if (!data.nextId && currentIndex < list.length - 1) {
                setNextMantraId(list[currentIndex + 1].id);
              }
            }
          } catch {
            // Silently ignore siblings fetch failure
          }
        }
      } catch (err: any) {
        showToast(err.message || "मंत्र विवरण लोड करने में विफल", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMantra();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  const handleCopyMantra = () => {
    if (!mantra) return;
    const fullText = `॥ ${mantra.sanskrit} ॥\n\n— ${mantra.textName} (${mantra.mantraNumber})\nऋषि: ${mantra.rishi || "वैदिक ऋषि"} | देवता: ${mantra.devata || "दिव्य देव"} | छंद: ${mantra.chhanda || "गायत्री"}\n\nहिंदी भावार्थ: ${mantra.hindiTranslation}`;
    navigator.clipboard.writeText(fullText);
    setCopiedMantra(true);
    showToast("संपूर्ण मंत्र एवं संदर्भ कॉपी किया गया!", "success");
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleCopyTranslation = () => {
    if (!mantra) return;
    let text = "";
    if (selectedLang === "hindi") text = mantra.hindiTranslation;
    else if (selectedLang === "english") text = mantra.englishTranslation || mantra.hindiTranslation;
    else if (selectedLang === "hinglish") text = mantra.hinglishTranslation || mantra.hindiTranslation;

    navigator.clipboard.writeText(text);
    setCopiedTranslation(true);
    showToast("भावार्थ कॉपी किया गया!", "success");
    setTimeout(() => setCopiedTranslation(false), 2000);
  };

  const handleDelete = async () => {
    if (!mantra) return;
    try {
      await VedaMantraAdminService.deleteMantra(mantra.id);
      showToast("मंत्र सफलतापूर्वक हटाया गया", "success");
      navigate("/admin/library/mantras");
    } catch (err: any) {
      showToast(err.message || "मंत्र हटाने में विफल", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-charcoal-500 bg-white rounded-3xl border border-cream-200 max-w-4xl mx-auto space-y-3">
        <Sparkles className="w-8 h-8 text-saffron-500 animate-spin mx-auto" />
        <p className="font-devanagari text-base font-bold text-charcoal-800">
          वैदिक मंत्र का पावन पृष्ठ लोड हो रहा है...
        </p>
      </div>
    );
  }

  if (!mantra) {
    return (
      <div className="p-16 text-center text-xs text-charcoal-500 bg-white rounded-3xl border border-cream-200 max-w-4xl mx-auto space-y-4">
        <p className="font-bold text-base text-charcoal-800">मंत्र नहीं मिला।</p>
        <Link
          to="/admin/library/mantras"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>मंत्र सूची पर लौटें</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Action Header */}
      <PageHeader
        title={`${mantra.textName} • मंत्र ${mantra.mantraNumber}`}
        subtitle={`${mantra.sectionRef} • ${mantra.vedaName} ${mantra.shakha ? `(${mantra.shakha})` : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/library/mantras"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>मंत्र सूची</span>
            </Link>

            <Link
              to={`/admin/library/mantras/${mantra.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-700 hover:to-saffron-600 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>संपादित करें</span>
            </Link>

            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="p-2 text-charcoal-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-cream-200 transition-colors cursor-pointer"
              title="मंत्र हटाएं"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Shastric Metadata Strip (7 Vedic Facets) */}
      <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center divide-y sm:divide-y-0 sm:divide-x divide-cream-100">
          {/* 1. Veda */}
          <div className="space-y-1">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <BookOpen className="w-3 h-3" />
              वेद
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.vedaName}
            </strong>
          </div>

          {/* 2. Shakha */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <Layers className="w-3 h-3" />
              शाखा
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.shakha || "प्रामाणिक शाखा"}
            </strong>
          </div>

          {/* 3. Grantha / Section */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <BookMarked className="w-3 h-3" />
              ग्रंथ व संदर्भ
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate" title={mantra.sectionRef}>
              {mantra.sectionRef}
            </strong>
          </div>

          {/* 4. Rishi */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <Feather className="w-3 h-3" />
              ऋषि (Sage)
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.rishi || "वैदिक द्रष्टा"}
            </strong>
          </div>

          {/* 5. Devata */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <Flame className="w-3 h-3 text-amber-600" />
              देवता (Deity)
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.devata || "दिव्य देव"}
            </strong>
          </div>

          {/* 6. Chhanda */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <Sparkles className="w-3 h-3" />
              छंद (Meter)
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.chhanda || "गायत्री"}
            </strong>
          </div>

          {/* 7. Svara */}
          <div className="space-y-1 sm:pl-2 pt-2 sm:pt-0">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-saffron-800">
              <Music className="w-3 h-3" />
              स्वर विधान
            </span>
            <strong className="text-xs text-charcoal-900 block font-devanagari truncate">
              {mantra.svara || "सस्वर पाठ"}
            </strong>
          </div>
        </div>
      </div>

      {/* Central Sacred Sanskrit Sanctuary Card */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFFDF5] to-[#FFF9EE] border-2 border-amber-300/80 shadow-lg text-center space-y-6 overflow-hidden">
        {/* Subtle Vedic watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[140px] font-black text-amber-500/5 select-none pointer-events-none font-devanagari">
          ॐ
        </div>

        {/* Top Filigree Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-saffron-900 border-b border-amber-200/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-devanagari text-amber-700">॥ ॐ श्रीगुरुभ्यो नमः ॥</span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900 font-mono">
              ID: {mantra.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {mantra.audioUrl && (
              <a
                href={mantra.audioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 shadow-2xs transition-colors"
                title="वैदिक स्वर पाठ सुनें"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-xs">मंत्र गान</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyMantra}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-charcoal-800 shadow-2xs transition-all cursor-pointer font-bold"
            >
              {copiedMantra ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">कॉपी हुआ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-saffron-700" />
                  <span>मंत्र कॉपी करें</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Central Sanskrit Devanagari Typography */}
        <div className="py-2">
          <p className="font-devanagari font-bold text-2xl sm:text-4xl text-[#2E1808] leading-loose sm:leading-[2.6] tracking-wide select-text drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            {mantra.sanskrit}
          </p>
        </div>

        {/* IAST Roman Transliteration */}
        {mantra.transliteration && (
          <div className="pt-4 border-t border-amber-200/70 max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800/80 block">
              IAST Transliteration (रोमन लिपि)
            </span>
            <p className="font-serif italic text-base sm:text-lg text-amber-950/85 whitespace-pre-line leading-relaxed tracking-wider">
              {mantra.transliteration}
            </p>
          </div>
        )}

        {/* Bottom Filigree Mark */}
        <div className="pt-2 text-xs text-amber-700/70 font-devanagari font-bold">
          ॥ इति {mantra.textName} {mantra.mantraNumber} समाप्तम् ॥
        </div>
      </div>

      {/* Interactive 3-Language Translation Tabs */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-2xs overflow-hidden">
        {/* Header with Language Tabs & Copy Button */}
        <div className="p-5 border-b border-cream-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF8F3]">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-saffron-600" />
            <div>
              <h3 className="font-bold text-sm text-charcoal-900">
                त्रिभाषी भावार्थ (Authentic 3-Language Translations)
              </h3>
              <p className="text-[11px] text-charcoal-400">
                शास्त्रीय परंपरा के अनुसार हिंदी, अंग्रेजी एवं आधुनिक हिंग्लिश अनुवाद
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* 3 Tab Switcher */}
            <div className="inline-flex rounded-xl p-1 bg-cream-100 border border-cream-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedLang("hindi")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLang === "hindi"
                    ? "bg-saffron-600 text-white shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                प्रामाणिक हिंदी
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang("english")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLang === "english"
                    ? "bg-saffron-600 text-white shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang("hinglish")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLang === "hinglish"
                    ? "bg-saffron-600 text-white shadow-2xs"
                    : "text-charcoal-600 hover:text-charcoal-900"
                }`}
              >
                सरल Hinglish
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyTranslation}
              className="p-1.5 rounded-lg bg-white border border-cream-200 text-charcoal-600 hover:text-saffron-700 shadow-2xs transition-colors"
              title="यह भावार्थ कॉपी करें"
            >
              {copiedTranslation ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Translation Content Area */}
        <div className="p-6">
          {selectedLang === "hindi" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-saffron-800 font-bold border-b border-cream-100 pb-2">
                <span>प्रामाणिक हिंदी भावार्थ (Authentic Hindi Meaning)</span>
                <span className="text-[11px] text-charcoal-400">वैदिक परंपरा</span>
              </div>
              <p className="font-devanagari text-base sm:text-lg text-charcoal-800 leading-relaxed sm:leading-loose whitespace-pre-line select-text">
                {mantra.hindiTranslation || "हिंदी भावार्थ उपलब्ध नहीं है।"}
              </p>
            </div>
          )}

          {selectedLang === "english" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-blue-800 font-bold border-b border-cream-100 pb-2">
                <span>Authentic English Translation (Classical & Scholarly)</span>
                <span className="text-[11px] text-charcoal-400">Scholarly Vedic Exposition</span>
              </div>
              <p className="font-serif text-base sm:text-lg text-charcoal-800 leading-relaxed italic whitespace-pre-line select-text">
                {mantra.englishTranslation ||
                  "English translation is currently not available for this mantra."}
              </p>
            </div>
          )}

          {selectedLang === "hinglish" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-purple-800 font-bold border-b border-cream-100 pb-2">
                <span>सरल हिंग्लिश भावार्थ (Accessible Hinglish Meaning)</span>
                <span className="text-[11px] text-charcoal-400">आधुनिक सरल भाषा</span>
              </div>
              <p className="font-sans text-sm sm:text-base text-charcoal-800 leading-relaxed whitespace-pre-line select-text">
                {mantra.hinglishTranslation ||
                  "Hinglish translation is currently not available for this mantra."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Padapatha (Word-by-word) Breakdown Cards Grid */}
      {mantra.padapatha && mantra.padapatha.length > 0 ? (
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-600" />
              <div>
                <h3 className="font-bold text-sm text-charcoal-900">
                  पदच्छेद एवं पदार्थ (Padapatha & Word Breakdown)
                </h3>
                <p className="text-[11px] text-charcoal-400">
                  प्रत्येक पद का संधि-विच्छेद व स्वतंत्र अर्थ
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              कुल {mantra.padapatha.length} पद
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {mantra.padapatha.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-cream-200 hover:border-amber-300 hover:shadow-2xs transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="font-devanagari font-bold text-base text-saffron-900 group-hover:text-saffron-600 transition-colors">
                    {p.word}
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-mono bg-cream-100 px-1.5 py-0.2 rounded">
                    #{idx + 1}
                  </span>
                </div>
                <p className="font-devanagari text-xs text-charcoal-700 leading-relaxed border-t border-cream-100 pt-1.5">
                  {p.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-2xs text-center space-y-2">
          <Sparkles className="w-6 h-6 text-charcoal-300 mx-auto" />
          <h4 className="font-bold text-xs text-charcoal-700">पदच्छेद अभी संकलित नहीं है</h4>
          <p className="text-[11px] text-charcoal-400 max-w-md mx-auto">
            इस मंत्र के प्रत्येक पद का पदच्छेद व पदार्थ जोड़ने के लिए "संपादित करें" पर क्लिक करें।
          </p>
        </div>
      )}

      {/* Shastric Commentary & Viniyoga Card */}
      {mantra.shastricContext && (
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 border-b border-cream-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-charcoal-900">
                शास्त्रीय संदर्भ, विनियोग एवं आध्यात्मिक तात्पर्य
              </h3>
              <p className="text-[11px] text-charcoal-400">
                ऋषि, देवता, छंद एवं यज्ञीय/आध्यात्मिक विनियोग विवरण
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border-l-4 border-saffron-500 text-xs text-charcoal-800 font-devanagari leading-loose whitespace-pre-line">
            {mantra.shastricContext}
          </div>
        </div>
      )}

      {/* Bottom Previous / Next Mantra Navigation */}
      <div className="p-4 rounded-3xl bg-white border border-cream-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {prevMantraId ? (
          <Link
            to={`/admin/library/mantras/${prevMantraId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cream-50 hover:bg-cream-100 text-charcoal-800 border border-cream-200 text-xs font-bold transition-all w-full sm:w-auto justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-saffron-600" />
            <span>← पिछला मंत्र (Previous)</span>
          </Link>
        ) : (
          <div className="text-xs text-charcoal-400 px-4 py-2 italic w-full sm:w-auto text-center">
            (प्रारंभिक मंत्र)
          </div>
        )}

        <Link
          to="/admin/library/mantras"
          className="text-xs font-bold text-saffron-700 hover:text-saffron-900 underline"
        >
          सम्पूर्ण मंत्र सूची देखें
        </Link>

        {nextMantraId ? (
          <Link
            to={`/admin/library/mantras/${nextMantraId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-saffron-50 hover:bg-saffron-100 text-saffron-900 border border-saffron-200 text-xs font-bold transition-all w-full sm:w-auto justify-center shadow-2xs"
          >
            <span>अगला मंत्र (Next) →</span>
            <ChevronRight className="w-4 h-4 text-saffron-700" />
          </Link>
        ) : (
          <div className="text-xs text-charcoal-400 px-4 py-2 italic w-full sm:w-auto text-center">
            (अंतिम मंत्र)
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        title="मंत्र हटाएं"
        message={`क्या आप निश्चित रूप से मंत्र "${mantra.mantraNumber}" (${mantra.id}) को हटाना चाहते हैं? यह क्रिया स्थायी है।`}
        confirmLabel="हटाएं"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
};

export default MantraDetailPage;
