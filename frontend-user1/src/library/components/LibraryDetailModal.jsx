import { useState } from "react";
import { X, Copy, Check, Share2, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import { VEDA_TOPICS } from "../data/libraryData";
import LanguageSwitcher from "./LanguageSwitcher";

const LibraryDetailModal = ({ topic, onClose, onSelectTopic }) => {
  const { isHindi, t } = useLibraryLanguage();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  if (!topic) return null;

  const handleCopySloka = () => {
    if (topic.keyVerse) {
      const textToCopy = `${topic.keyVerse.sanskrit}\n${topic.keyVerse.transliteration}\nMeaning: ${
        isHindi ? topic.keyVerse.meaningHi : topic.keyVerse.meaningEn
      }`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const relatedTopics = VEDA_TOPICS.filter(
    (t) => t.categorySlug === topic.categorySlug && t.id !== topic.id
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1e1710]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-hidden rounded-3xl border border-[#ecd5a8] bg-[#fffdfa] shadow-[0_20px_60px_rgba(40,25,10,0.3)]">
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#ebd8b8] bg-[#faf2e1]/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#c88918] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
              {topic.categoryNumber}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#79644d]">
              {topic.group}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="compact" />

            <button
              type="button"
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9c49d] bg-white text-[#7d6b57] transition hover:border-[#c88918] hover:text-[#c88918]"
              title={t("share")}
            >
              {shareCopied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e2c8] text-[#4d3f32] transition hover:bg-[#c88918] hover:text-white"
              title={t("close")}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-8 scrollbar-thin">
          {/* Main Title Section */}
          <div>
            <p className="font-serif text-[18px] font-semibold text-[#c88918]">
              {topic.sanskritTitle}
            </p>
            <h1 className="mt-1 font-serif text-[30px] font-bold text-[#2b241d] sm:text-[38px]">
              {isHindi ? topic.title.hi : topic.title.en}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-[#867664]">
              <Clock size={13} />
              <span>{topic.readTime}</span>
              <span>•</span>
              <span className="font-medium text-[#9a6a16]">{topic.badge}</span>
            </p>
          </div>

          {/* Sacred Chhandas & Verse Altar Box (Fixed Centered across Laptop & Phone) */}
          {topic.keyVerse && (
            <div className="relative mx-auto w-full overflow-hidden rounded-3xl border-2 border-[#e6ce9d] bg-gradient-to-b from-[#fff9ee] via-[#fffdfa] to-[#faf3e3] p-5 sm:p-7 shadow-[0_8px_30px_rgba(200,137,24,0.08)]">
              {/* Top Sacred Ornamental Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebd8b7] pb-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#c88918]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9b6811]">
                    {isHindi ? "वैदिक छंद एवं मंत्र" : "Sacred Vedic Chhandas & Shloka"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Font Size Adjuster */}
                  <div className="flex items-center rounded-lg border border-[#e2cca4] bg-white p-0.5 text-[11px] font-semibold text-[#705e4c]">
                    <button
                      type="button"
                      onClick={() => setFontSize("normal")}
                      className={`px-2 py-0.5 rounded transition ${fontSize === "normal" ? "bg-[#faedd4] text-[#8e6015]" : "hover:text-[#2b241d]"}`}
                      title="Standard size"
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize("large")}
                      className={`px-2 py-0.5 rounded font-bold transition ${fontSize === "large" ? "bg-[#faedd4] text-[#8e6015]" : "hover:text-[#2b241d]"}`}
                      title="Large size"
                    >
                      A+
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySloka}
                    className="flex items-center gap-1.5 rounded-lg border border-[#e2cca4] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#735e46] transition hover:border-[#c88918] hover:text-[#c88918]"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-green-600" />
                        <span>{t("copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>{t("copySloka")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Centered Sacred Verse Presentation (Fixed Centered on Phone & Laptop) */}
              <div className="mx-auto mt-6 max-w-[680px] text-center">
                {/* Traditional Auspicious Invocation Mark */}
                <div className="mb-2.5 inline-flex items-center justify-center font-serif text-[18px] text-[#b8801d]">
                  ॥ ॐ ॥
                </div>

                {/* Main Sanskrit Chhandas (Centered & Prominent) */}
                <p
                  className={`font-serif font-bold leading-relaxed text-[#7a4805] transition-all ${
                    fontSize === "large"
                      ? "text-[24px] sm:text-[28px] leading-loose"
                      : "text-[21px] sm:text-[24px] leading-relaxed"
                  }`}
                >
                  {topic.keyVerse.sanskrit}
                </p>

                {/* Transliteration (Centered) */}
                <p className="mt-3 font-mono text-[13px] italic tracking-wide text-[#7d6c59] sm:text-[14px]">
                  {topic.keyVerse.transliteration}
                </p>

                {/* Traditional Decorative Symmetrical Divider */}
                <div className="my-5 flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d9be89]" />
                  <span className="text-[#c88918] text-xs">✦</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d9be89]" />
                </div>

                {/* Translation / Meaning (Centered) */}
                <div className="rounded-xl border border-[#ede0c8] bg-white/85 p-4 shadow-2xs backdrop-blur-xs">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b6811] mb-1">
                    {isHindi ? "— पावन भावार्थ —" : "— Sacred Translation —"}
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#4d4034] sm:text-[15px]">
                    {isHindi ? topic.keyVerse.meaningHi : topic.keyVerse.meaningEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Deep Summary */}
          {topic.detailedArticle?.summary && (
            <div>
              <h2 className="font-serif text-[20px] font-bold text-[#2b241d] sm:text-[22px]">
                {isHindi ? "विषय परिचय एवं महत्ता" : "Overview & Spiritual Significance"}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5c4f42]">
                {isHindi ? topic.detailedArticle.summary.hi : topic.detailedArticle.summary.en}
              </p>
            </div>
          )}

          {/* Structure / Chapters / Kandas */}
          {topic.detailedArticle?.structure && topic.detailedArticle.structure.length > 0 && (
            <div>
              <h2 className="font-serif text-[20px] font-bold text-[#2b241d] sm:text-[22px]">
                {t("tableOfContents")}
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {topic.detailedArticle.structure.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#ebdcc0] bg-[#fffaf0] p-4 transition hover:border-[#c88918]"
                  >
                    <h3 className="text-[14px] font-bold text-[#2b241d]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[13px] leading-snug text-[#6f6151]">
                      {isHindi ? item.descHi : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Principles */}
          {topic.detailedArticle?.corePrinciples && (
            <div>
              <h2 className="font-serif text-[20px] font-bold text-[#2b241d] sm:text-[22px]">
                {t("coreWisdom")}
              </h2>
              <div className="mt-3 space-y-3">
                {topic.detailedArticle.corePrinciples.map((cp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-l-4 border-l-[#c88918] border border-[#ebdcc0] bg-[#fffdf8] p-4"
                  >
                    <h3 className="text-[14px] font-bold text-[#2b241d]">
                      {isHindi ? cp.headingHi : cp.headingEn}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#685949]">
                      {isHindi ? cp.textHi : cp.textEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modern Application */}
          {topic.detailedArticle?.modernRelevance && (
            <div className="rounded-2xl border border-[#e0c99a] bg-[#faf4e6] p-5">
              <h2 className="font-serif text-[18px] font-bold text-[#865d1d]">
                {t("modernApplication")}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#615243]">
                {isHindi
                  ? topic.detailedArticle.modernRelevance.hi
                  : topic.detailedArticle.modernRelevance.en}
              </p>
            </div>
          )}

          {/* Related Topics & Scholar CTA */}
          <div className="border-t border-[#ebd8b8] pt-6">
            <h2 className="font-serif text-[17px] font-bold text-[#2b241d]">
              {t("relatedScriptures")}
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {relatedTopics.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectTopic(rel)}
                  className="group flex items-center justify-between rounded-xl border border-[#ebd8b7] bg-white p-3 text-left transition hover:border-[#c88918] hover:bg-[#fffcf5]"
                >
                  <div className="truncate">
                    <p className="truncate text-[13px] font-bold text-[#2b241d] group-hover:text-[#c88918]">
                      {isHindi ? rel.title.hi : rel.title.en}
                    </p>
                    <p className="truncate text-[11px] text-[#867562]">{rel.group}</p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="shrink-0 text-[#9b8976] transition group-hover:translate-x-1 group-hover:text-[#c88918]"
                  />
                </button>
              ))}
            </div>

            {/* Consultation CTA */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e8d5ae] bg-gradient-to-r from-[#faecd2] to-[#fff4de] p-4 sm:flex-row sm:p-5">
              <div>
                <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                  {isHindi ? "विद्वान आचार्यों से मार्गदर्शन लें" : "Connect with Vedic Scholars"}
                </p>
                <p className="text-[12px] text-[#6d5e4d]">
                  {isHindi
                    ? "यज्ञ, कर्मकांड और ज्योतिषीय समाधान हेतु हमारे वैदिक आचार्यों से चर्चा करें।"
                    : "Deepen your understanding with authenticated Vedic Acharyas and Astrologers."}
                </p>
              </div>

              <Link
                to="/astrologers"
                onClick={onClose}
                className="shrink-0 rounded-full bg-[#c88918] px-5 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#ad7410]"
              >
                {isHindi ? "आचार्य सूची देखें" : "Consult Experts"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDetailModal;
