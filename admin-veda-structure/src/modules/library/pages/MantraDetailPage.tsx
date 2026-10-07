import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchMantra = async () => {
      try {
        setLoading(true);
        const data = await VedaMantraAdminService.getMantraById(id);
        setMantra(data);
      } catch (err: any) {
        showToast(err.message || "मंत्र विवरण लोड करने में विफल", "error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMantra();
  }, [id]);

  const handleCopy = () => {
    if (!mantra) return;
    const text = `${mantra.sanskrit}\n\n— ${mantra.textName} (${mantra.mantraNumber})\nहिंदी भावार्थ: ${mantra.hindiTranslation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="p-12 text-center text-xs text-charcoal-400">
        मंत्र डेटा लोड हो रहा है...
      </div>
    );
  }

  if (!mantra) {
    return (
      <div className="p-12 text-center text-xs text-charcoal-500">
        मंत्र नहीं मिला।
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={`${mantra.textName} • मंत्र ${mantra.mantraNumber}`}
        subtitle={`${mantra.sectionRef} • ${mantra.vedaName}`}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>संपादित करें</span>
            </Link>

            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="p-2 text-charcoal-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-cream-200 transition-colors cursor-pointer"
              title="हटाएं"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Shastric Meta Strip */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center divide-y sm:divide-y-0 sm:divide-x divide-cream-200">
          <div className="pt-2 sm:pt-0">
            <span className="block text-[10px] uppercase font-bold text-saffron-800">
              ऋषि (Sage)
            </span>
            <strong className="text-charcoal-900 font-devanagari">
              {mantra.rishi || "वैदिक ऋषि"}
            </strong>
          </div>
          <div className="pt-2 sm:pt-0 sm:pl-3">
            <span className="block text-[10px] uppercase font-bold text-saffron-800">
              देवता (Deity)
            </span>
            <strong className="text-charcoal-900 font-devanagari">
              {mantra.devata || "दिव्य देव"}
            </strong>
          </div>
          <div className="pt-2 sm:pt-0 sm:pl-3">
            <span className="block text-[10px] uppercase font-bold text-saffron-800">
              छंद (Meter)
            </span>
            <strong className="text-charcoal-900 font-devanagari">
              {mantra.chhanda || "गायत्री"}
            </strong>
          </div>
          <div className="pt-2 sm:pt-0 sm:pl-3">
            <span className="block text-[10px] uppercase font-bold text-saffron-800">
              स्वर / पाठ
            </span>
            <strong className="text-charcoal-900 font-devanagari">
              {mantra.svara || "सस्वर"}
            </strong>
          </div>
        </div>
      </div>

      {/* Core Sanskrit Sanctuary Card */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-[#fffcf6] border border-amber-300/80 shadow-md text-center space-y-4">
        <div className="flex items-center justify-between text-xs text-saffron-800 font-bold mb-2">
          <span>॥ ॐ ॥</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-charcoal-700 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "कॉपी हुआ!" : "कॉपी"}</span>
          </button>
        </div>

        <p className="font-devanagari font-bold text-2xl sm:text-3xl text-[#2e1808] leading-loose whitespace-pre-line select-text">
          {mantra.sanskrit}
        </p>

        {mantra.transliteration && (
          <p className="font-serif italic text-sm text-amber-950/80 pt-3 border-t border-amber-200/60 max-w-xl mx-auto whitespace-pre-line">
            {mantra.transliteration}
          </p>
        )}
      </div>

      {/* 3-Language Bhavarth Card with Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-cream-100 pb-3">
          <h3 className="font-serif text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-saffron-600" />
            <span>भावार्थ (Multilingual Translations)</span>
          </h3>

          <div className="flex items-center rounded-xl p-1 bg-cream-50 border border-cream-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedLang("hindi")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedLang === "hindi"
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang("english")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
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
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedLang === "hinglish"
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cream-50/50 border border-cream-200">
          {selectedLang === "hindi" && (
            <p className="font-devanagari text-sm text-charcoal-800 leading-relaxed">
              {mantra.hindiTranslation}
            </p>
          )}
          {selectedLang === "english" && (
            <p className="font-serif text-sm text-charcoal-800 leading-relaxed">
              {mantra.englishTranslation || mantra.hindiTranslation}
            </p>
          )}
          {selectedLang === "hinglish" && (
            <p className="font-sans text-sm text-charcoal-800 leading-relaxed">
              {mantra.hinglishTranslation || mantra.hindiTranslation}
            </p>
          )}
        </div>
      </div>

      {/* Padapatha (Word-by-Word Meanings) */}
      {mantra.padapatha && mantra.padapatha.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-saffron-600" />
              <span>पदच्छेद एवं पदार्थ (Word-by-Word Breakdown)</span>
            </h3>
            <span className="text-[11px] text-charcoal-400">
              {mantra.padapatha.length} पद
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {mantra.padapatha.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-devanagari"
              >
                <span className="font-bold text-saffron-800 block mb-0.5">
                  {p.word}
                </span>
                <span className="text-charcoal-600">{p.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shastric Context */}
      {mantra.shastricContext && (
        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-3">
          <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-saffron-600" />
            <span>शास्त्रीय संदर्भ एवं विनियोग</span>
          </h3>
          <p className="font-devanagari text-xs text-charcoal-700 leading-relaxed">
            {mantra.shastricContext}
          </p>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        title="मंत्र हटाएं"
        message={`क्या आप निश्चित रूप से मंत्र "${mantra.mantraNumber}" को हटाना चाहते हैं?`}
        confirmLabel="हटाएं"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
};

export default MantraDetailPage;
