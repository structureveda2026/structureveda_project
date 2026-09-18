import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VEDA_TOPICS } from "../data/libraryData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Copy,
  Check,
  Share2,
  ArrowRight,
  ChevronRight,
  Home,
} from "lucide-react";

const LibraryTopicPage = () => {
  const { topicSlug } = useParams();
  const { isHindi, t } = useLibraryLanguage();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  // Scroll smoothly to top on topic change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topicSlug]);

  const topic = VEDA_TOPICS.find((t) => t.slug === topicSlug);

  if (!topic) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <h1 className="font-serif text-[32px] font-bold text-[#2b241d]">
          {isHindi ? "विषय उपलब्ध नहीं है" : "Scripture Topic Not Found"}
        </h1>
        <p className="mt-3 text-[15px] text-[#716353]">
          {isHindi
            ? "यह विषय पुस्तकालय में उपलब्ध नहीं है। कृपया मुख्य पुस्तकालय में खोजें।"
            : "The requested topic could not be located in the Veda Library."}
        </p>
        <Link
          to="/library"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c88918] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? "पुस्तकालय पर लौटें" : "Back to Library"}</span>
        </Link>
      </div>
    );
  }

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
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const relatedTopics = VEDA_TOPICS.filter(
    (t) => t.categorySlug === topic.categorySlug && t.id !== topic.id
  ).slice(0, 3);

  return (
    <article className="min-h-screen bg-[#fffaf0] py-8 sm:py-12">
      <div className="mx-auto max-w-[920px] px-5 sm:px-8">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eadbc1] pb-5">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#786652]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[#c88918] transition">
              <Home size={13} />
              <span>{isHindi ? "होम" : "Home"}</span>
            </Link>
            <ChevronRight size={12} className="text-[#a89580]" />
            <Link to="/library" className="hover:text-[#c88918] transition font-medium">
              {isHindi ? "वेद पुस्तकालय" : "Veda Library"}
            </Link>
            <ChevronRight size={12} className="text-[#a89580]" />
            <span className="font-semibold text-[#c88918]">{isHindi ? topic.title.hi : topic.title.en}</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2cca4] bg-white px-3 py-1.5 text-[11.5px] font-bold text-[#6f5b45] transition hover:border-[#c88918] hover:text-[#c88918]"
            >
              <ArrowLeft size={13} />
              <span>{isHindi ? "पुस्तकालय सूची" : "All Scriptures"}</span>
            </Link>

            <LanguageSwitcher variant="compact" />

            <button
              type="button"
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0cba0] bg-white text-[#6b5844] transition hover:border-[#c88918] hover:text-[#c88918]"
              title={t("share")}
            >
              {shareCopied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#c88918] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
              {topic.categoryNumber}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#816b54]">
              {topic.group}
            </span>
          </div>

          <p className="mt-4 font-serif text-[22px] font-semibold text-[#c88918]">
            {topic.sanskritTitle}
          </p>

          <h1 className="mt-1 font-serif text-[36px] font-bold leading-tight text-[#2b241d] sm:text-[46px]">
            {isHindi ? topic.title.hi : topic.title.en}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-[13px] text-[#786959]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {topic.readTime}
            </span>
            <span>•</span>
            <span className="rounded-full bg-[#f6ebda] px-2.5 py-0.5 text-[11px] font-semibold text-[#8b621e]">
              {topic.badge}
            </span>
          </div>
        </div>

        {/* Sacred Chhandas & Verse Altar Box (Fixed Centered across Laptop & Phone) */}
        {topic.keyVerse && (
          <div className="relative mx-auto mt-8 w-full overflow-hidden rounded-3xl border-2 border-[#e6ce9d] bg-gradient-to-b from-[#fff9ee] via-[#fffdfa] to-[#faf3e3] p-5 sm:p-7 shadow-[0_8px_30px_rgba(200,137,24,0.08)]">
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

        {/* Summary Content */}
        {topic.detailedArticle?.summary && (
          <div className="mt-10">
            <h2 className="font-serif text-[24px] font-bold text-[#2b241d]">
              {isHindi ? "विषय परिचय एवं महत्ता" : "Overview & Spiritual Significance"}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-[#5c4f42]">
              {isHindi ? topic.detailedArticle.summary.hi : topic.detailedArticle.summary.en}
            </p>
          </div>
        )}

        {/* Structure Breakdown */}
        {topic.detailedArticle?.structure && topic.detailedArticle.structure.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-[24px] font-bold text-[#2b241d]">
              {t("tableOfContents")}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {topic.detailedArticle.structure.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#ebdcc0] bg-white p-4.5 shadow-2xs transition hover:border-[#c88918]"
                >
                  <h3 className="text-[15px] font-bold text-[#2b241d]">{item.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-[#6f6151]">
                    {isHindi ? item.descHi : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Principles */}
        {topic.detailedArticle?.corePrinciples && (
          <div className="mt-10">
            <h2 className="font-serif text-[24px] font-bold text-[#2b241d]">
              {t("coreWisdom")}
            </h2>
            <div className="mt-4 space-y-3.5">
              {topic.detailedArticle.corePrinciples.map((cp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-l-4 border-l-[#c88918] border border-[#ebdcc0] bg-[#fffdf8] p-5"
                >
                  <h3 className="text-[15px] font-bold text-[#2b241d]">
                    {isHindi ? cp.headingHi : cp.headingEn}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#685949]">
                    {isHindi ? cp.textHi : cp.textEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modern Relevance */}
        {topic.detailedArticle?.modernRelevance && (
          <div className="mt-10 rounded-2xl border border-[#e0c99a] bg-[#faf4e6] p-6">
            <h2 className="font-serif text-[20px] font-bold text-[#865d1d]">
              {t("modernApplication")}
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-[#615243]">
              {isHindi
                ? topic.detailedArticle.modernRelevance.hi
                : topic.detailedArticle.modernRelevance.en}
            </p>
          </div>
        )}

        {/* Related Scriptures */}
        <div className="mt-12 border-t border-[#ebd8b8] pt-8">
          <h2 className="font-serif text-[20px] font-bold text-[#2b241d]">
            {t("relatedScriptures")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {relatedTopics.map((rel) => (
              <Link
                key={rel.id}
                to={`/library/${rel.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[#ebd8b7] bg-white p-4 shadow-2xs transition hover:border-[#c88918] hover:bg-[#fffcf5]"
              >
                <div className="truncate">
                  <p className="truncate text-[14px] font-bold text-[#2b241d] group-hover:text-[#c88918]">
                    {isHindi ? rel.title.hi : rel.title.en}
                  </p>
                  <p className="truncate text-[11px] text-[#867562]">{rel.group}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-[#9b8976] transition group-hover:translate-x-1 group-hover:text-[#c88918]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default LibraryTopicPage;
