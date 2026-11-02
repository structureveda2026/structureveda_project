import React, { useState, useId } from "react";
import {
  Globe,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  AlertCircle,
  X,
  Plus,
  Share2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SeoMetadata } from "@/types";

export interface SEOSectionProps {
  value: SeoMetadata | undefined;
  onChange: (value: SeoMetadata) => void;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  defaultSlug?: string;
  serviceTypeLabel?: string;
  disabled?: boolean;
  sectionNumber?: number | string;
}

const ABSOLUTE_URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export const SEOSection: React.FC<SEOSectionProps> = ({
  value = {},
  onChange,
  defaultTitle = "",
  defaultDescription = "",
  defaultOgImage = "",
  defaultSlug = "",
  serviceTypeLabel = "Service",
  disabled = false,
  sectionNumber,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const componentId = useId();

  // Current values with defaults
  const title = value.title ?? value.metaTitle ?? "";
  const description = value.description ?? value.metaDescription ?? "";
  const focusKeyword = value.focusKeyword ?? "";
  const canonicalUrl = value.canonicalUrl ?? "";
  const robotsIndex = value.robotsIndex !== false; // default true
  const robotsFollow = value.robotsFollow !== false; // default true
  const ogTitle = value.ogTitle ?? "";
  const ogDescription = value.ogDescription ?? "";
  const ogImage = value.ogImage ?? "";

  // Normalize keywords array
  const keywords: string[] = Array.isArray(value.keywords)
    ? value.keywords
    : typeof value.keywords === "string"
      ? (value.keywords as string)
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

  const updateField = <K extends keyof SeoMetadata>(field: K, val: SeoMetadata[K]) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  // Keyword handling
  const handleAddKeyword = () => {
    const raw = keywordInput.trim();
    if (!raw) return;

    // Support comma-separated batch input
    const parts = raw
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const updated = Array.from(new Set([...keywords, ...parts]));
    updateField("keywords", updated);
    setKeywordInput("");
  };

  const handleRemoveKeyword = (index: number) => {
    const updated = keywords.filter((_, i) => i !== index);
    updateField("keywords", updated);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Auto-generate helper
  const handleAutoFill = () => {
    const generated: SeoMetadata = {
      ...value,
      title: title || (defaultTitle ? `${defaultTitle} in Kashi | Veda Structure` : ""),
      description: description || defaultDescription.slice(0, 160),
      ogTitle: ogTitle || title || defaultTitle,
      ogDescription: ogDescription || description || defaultDescription.slice(0, 180),
      ogImage: ogImage || defaultOgImage,
    };
    onChange(generated);
  };

  // Validation checks for live hints
  const isCanonicalValid = !canonicalUrl || ABSOLUTE_URL_REGEX.test(canonicalUrl.trim());
  const isOgImageBase64 = ogImage.trim().startsWith("data:");

  // Simulated SERP values
  const previewTitle = title || (defaultTitle ? `${defaultTitle} in Kashi | Veda Structure` : "Veda Structure Ritual Ceremony");
  const previewUrl = canonicalUrl || `https://vedastructure.com/yagya-puja/${defaultSlug || "ceremony"}`;
  const previewDescription =
    description ||
    (defaultDescription
      ? defaultDescription.slice(0, 155) + (defaultDescription.length > 155 ? "..." : "")
      : "Authentic Vedic rituals conducted in Kashi (Varanasi) by verified Vedic Pandits with live-streaming and consecrated prasad delivery.");

  return (
    <div className="card p-5 border border-cream-200">
      {/* Header with Accordion Toggle & Auto-Fill */}
      <div className="flex items-center justify-between pb-3 border-b border-cream-100">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-left text-base font-semibold text-charcoal-800 hover:text-saffron-700 transition"
          aria-expanded={isOpen}
        >
          <Globe className="w-4 h-4 text-saffron-600" />
          <span>
            {sectionNumber ? `${sectionNumber}. ` : ""}
            Search Engine Optimization (SEO) & Social Sharing
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-400" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {(defaultTitle || defaultDescription) && (
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={disabled}
              className="btn-ghost text-xs text-saffron-700 hover:text-saffron-800 flex items-center gap-1.5 py-1 px-2.5 rounded border border-saffron-200 bg-saffron-50 hover:bg-saffron-100"
              title="Automatically derive SEO titles and descriptions from entered service info"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
              Auto-Fill Suggestions
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6">
          {/* 1. Google SERP Live Snippet Preview */}
          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-4 font-sans text-left">
            <div className="text-[11px] font-semibold tracking-wider text-charcoal-400 uppercase mb-2 flex items-center gap-1">
              <span>Google Search Preview</span>
              <span className="text-[10px] text-charcoal-400 font-normal">
                (Simulated desktop snippet)
              </span>
            </div>

            <div className="space-y-1">
              {/* URL Breadcrumb */}
              <div className="text-[12px] text-[#202124] flex items-center gap-1.5 truncate">
                <span className="w-4 h-4 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[9px] font-bold">
                  V
                </span>
                <span className="text-[#202124] font-medium">Veda Structure</span>
                <span className="text-[#5f6368]">› yagya-puja › {defaultSlug || "service"}</span>
              </div>

              {/* Title */}
              <h4 className="text-[18px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug truncate">
                {previewTitle}
              </h4>

              {/* Description */}
              <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                {previewDescription}
              </p>
            </div>
          </div>

          {/* 2. Core SEO Fields */}
          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`${componentId}-seo-title`} className="label-field mb-0">
                  SEO Meta Title
                </label>
                <span
                  className={`text-xs ${
                    title.length > 60
                      ? title.length > 70
                        ? "text-red-500 font-semibold"
                        : "text-amber-600"
                      : "text-charcoal-400"
                  }`}
                >
                  {title.length}/60 characters {title.length > 60 && "(ideal: 50–60)"}
                </span>
              </div>
              <input
                id={`${componentId}-seo-title`}
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => updateField("title", e.target.value.slice(0, 200))}
                placeholder={`e.g. ${defaultTitle || "Maha Rudrabhishek Puja"} in Kashi | Veda Structure`}
                disabled={disabled}
                maxLength={200}
              />
              <p className="text-[11.5px] text-charcoal-500 mt-1">
                Specifies the primary title appearing in search results and browser tabs. If left blank, defaults to "{defaultTitle || serviceTypeLabel} | Veda Structure".
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`${componentId}-seo-desc`} className="label-field mb-0">
                  Meta Description
                </label>
                <span
                  className={`text-xs ${
                    description.length > 160
                      ? description.length > 200
                        ? "text-amber-600 font-semibold"
                        : "text-charcoal-500"
                      : "text-charcoal-400"
                  }`}
                >
                  {description.length}/160 characters {description.length > 160 && "(ideal: 140–160)"}
                </span>
              </div>
              <textarea
                id={`${componentId}-seo-desc`}
                rows={3}
                className="input-field"
                value={description}
                onChange={(e) => updateField("description", e.target.value.slice(0, 1000))}
                placeholder="Comprehensive summary for search engine indexers and social link snippets..."
                disabled={disabled}
                maxLength={1000}
              />
              <p className="text-[11.5px] text-charcoal-500 mt-1">
                A concise description outlining ritual benefits and authenticity to encourage search clicks.
              </p>
            </div>

            {/* Focus Keyword & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Focus Keyword */}
              <div>
                <label htmlFor={`${componentId}-focus-keyword`} className="label-field">
                  Primary Focus Keyword
                </label>
                <input
                  id={`${componentId}-focus-keyword`}
                  type="text"
                  className="input-field"
                  value={focusKeyword}
                  onChange={(e) => updateField("focusKeyword", e.target.value.slice(0, 150))}
                  placeholder="e.g. Rudrabhishek in Kashi"
                  disabled={disabled}
                  maxLength={150}
                />
                <p className="text-[11.5px] text-charcoal-500 mt-1">
                  Main search query targeted by this ceremony for editorial alignment.
                </p>
              </div>

              {/* Keywords Tag Input */}
              <div>
                <label htmlFor={`${componentId}-keywords-input`} className="label-field">
                  Target Keywords
                </label>
                <div className="flex gap-2">
                  <input
                    id={`${componentId}-keywords-input`}
                    type="text"
                    className="input-field"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Type keyword and press Enter or comma..."
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    disabled={disabled || !keywordInput.trim()}
                    className="btn-secondary px-3 py-2 text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Keyword Badges */}
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-200 text-charcoal-800 border border-cream-300"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(idx)}
                          disabled={disabled}
                          className="text-charcoal-400 hover:text-charcoal-700 transition"
                          title="Remove keyword"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[11.5px] text-charcoal-500 mt-1">
                  Press comma or Enter to add multiple relevant Vedic keywords.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Advanced Settings Accordion Toggle */}
          <div className="pt-2 border-t border-cream-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-charcoal-700 hover:text-saffron-700 flex items-center gap-1.5 transition"
            >
              <span>{showAdvanced ? "Hide Advanced Settings" : "Show Advanced Technical SEO & Open Graph"}</span>
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5 text-charcoal-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
              )}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-5 bg-cream-50/70 p-4 rounded-lg border border-cream-200 text-left">
              <h5 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-saffron-600" />
                Technical Directives & Social Sharing (Open Graph)
              </h5>

              {/* Canonical URL */}
              <div>
                <label htmlFor={`${componentId}-canonical-url`} className="label-field">
                  Canonical URL Override
                </label>
                <input
                  id={`${componentId}-canonical-url`}
                  type="text"
                  className={`input-field ${!isCanonicalValid ? "border-red-400 focus:ring-red-300" : ""}`}
                  value={canonicalUrl}
                  onChange={(e) => updateField("canonicalUrl", e.target.value.trim())}
                  placeholder={`https://vedastructure.com/yagya-puja/${defaultSlug || "ceremony-slug"}`}
                  disabled={disabled}
                />
                {!isCanonicalValid ? (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Must be a valid absolute URL starting with http:// or https://
                  </p>
                ) : (
                  <p className="text-[11.5px] text-charcoal-500 mt-1">
                    Leave blank to automatically canonicalize to this service's official public URL.
                  </p>
                )}
              </div>

              {/* Robots Directives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Robots Index */}
                <div className="p-3 bg-white rounded-lg border border-cream-200">
                  <span className="text-xs font-semibold text-charcoal-800 block mb-1">
                    Search Engine Indexing (`robots: index`)
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-700">
                      <input
                        type="radio"
                        name={`${componentId}-robots-index`}
                        checked={robotsIndex === true}
                        onChange={() => updateField("robotsIndex", true)}
                        disabled={disabled}
                        className="text-saffron-600 focus:ring-saffron-500 w-3.5 h-3.5"
                      />
                      <span>Index (Visible to Google)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-700">
                      <input
                        type="radio"
                        name={`${componentId}-robots-index`}
                        checked={robotsIndex === false}
                        onChange={() => updateField("robotsIndex", false)}
                        disabled={disabled}
                        className="text-saffron-600 focus:ring-saffron-500 w-3.5 h-3.5"
                      />
                      <span>No Index (Hide from search)</span>
                    </label>
                  </div>
                </div>

                {/* Robots Follow */}
                <div className="p-3 bg-white rounded-lg border border-cream-200">
                  <span className="text-xs font-semibold text-charcoal-800 block mb-1">
                    Link Following (`robots: follow`)
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-700">
                      <input
                        type="radio"
                        name={`${componentId}-robots-follow`}
                        checked={robotsFollow === true}
                        onChange={() => updateField("robotsFollow", true)}
                        disabled={disabled}
                        className="text-saffron-600 focus:ring-saffron-500 w-3.5 h-3.5"
                      />
                      <span>Follow (Crawl page links)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-700">
                      <input
                        type="radio"
                        name={`${componentId}-robots-follow`}
                        checked={robotsFollow === false}
                        onChange={() => updateField("robotsFollow", false)}
                        disabled={disabled}
                        className="text-saffron-600 focus:ring-saffron-500 w-3.5 h-3.5"
                      />
                      <span>No Follow (Do not follow links)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Open Graph Social Sharing Fields */}
              <div className="space-y-3 pt-2 border-t border-cream-200">
                <span className="text-xs font-semibold text-charcoal-800 block">
                  Social Sharing Previews (WhatsApp, Facebook, Twitter, LinkedIn)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${componentId}-og-title`} className="label-field text-xs">
                      Social Preview Title (og:title)
                    </label>
                    <input
                      id={`${componentId}-og-title`}
                      type="text"
                      className="input-field text-xs"
                      value={ogTitle}
                      onChange={(e) => updateField("ogTitle", e.target.value.slice(0, 200))}
                      placeholder="Falls back to SEO Meta Title if blank..."
                      disabled={disabled}
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${componentId}-og-image`} className="label-field text-xs">
                      Social Thumbnail Image URL (og:image)
                    </label>
                    <input
                      id={`${componentId}-og-image`}
                      type="text"
                      className={`input-field text-xs ${isOgImageBase64 ? "border-red-400 focus:ring-red-300" : ""}`}
                      value={ogImage}
                      onChange={(e) => updateField("ogImage", e.target.value.trim())}
                      placeholder={defaultOgImage || "https://example.com/banner.jpg"}
                      disabled={disabled}
                    />
                    {isOgImageBase64 && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Base64 data URLs not allowed. Upload image via media uploader first.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor={`${componentId}-og-desc`} className="label-field text-xs">
                    Social Preview Description (og:description)
                  </label>
                  <textarea
                    id={`${componentId}-og-desc`}
                    rows={2}
                    className="input-field text-xs"
                    value={ogDescription}
                    onChange={(e) => updateField("ogDescription", e.target.value.slice(0, 1000))}
                    placeholder="Falls back to Meta Description if blank..."
                    disabled={disabled}
                    maxLength={1000}
                  />
                </div>

                {/* Social Image Thumbnail Preview if valid */}
                {ogImage && !isOgImageBase64 && (
                  <div className="flex items-center gap-3 p-2 rounded border border-cream-200 bg-white w-fit">
                    <img
                      src={ogImage}
                      alt="Social share preview thumbnail"
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div>
                      <span className="text-xs font-medium text-charcoal-700 block">OG Image Preview</span>
                      <span className="text-[10px] text-charcoal-400 truncate max-w-xs block">
                        {ogImage}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SEOSection;
