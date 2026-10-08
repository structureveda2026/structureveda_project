import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Upload,
  X,
  Sparkles,
  Globe,
  Tag,
  ChevronDown,
  ChevronUp,
  Languages,
  CheckCircle2,
  AlertCircle,
  Search,
  Share2,
  BookOpen,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { uploadImage } from "@/services/mediaUploadService";

import { blogService } from "../services/blog.service";
import RichTextEditor from "../components/RichTextEditor";
import { BLOG_CATEGORIES, SUGGESTED_TAGS } from "../constants/blog.constants";
import type { BlogStatus } from "../types/blog.types";

export default function BlogFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(id);

  // Active Language Tab for Editor ("en" | "hi")
  const [activeLang, setActiveLang] = useState<"en" | "hi">("en");
  const [previewLang, setPreviewLang] = useState<"en" | "hi">("en");

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // English Content States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Hindi Content States (Bilingual)
  const [titleHi, setTitleHi] = useState("");
  const [subtitleHi, setSubtitleHi] = useState("");
  const [excerptHi, setExcerptHi] = useState("");
  const [contentHi, setContentHi] = useState("");
  const [metaTitleHi, setMetaTitleHi] = useState("");
  const [metaDescriptionHi, setMetaDescriptionHi] = useState("");

  // Metadata & Settings
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const [author, setAuthor] = useState("Veda Structure Team");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [status, setStatus] = useState<BlogStatus>("Draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [readTime, setReadTime] = useState("5 min read");
  const [publishedAt, setPublishedAt] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [showSeoSection, setShowSeoSection] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
    if (!isCustomSlug && !isEditMode) {
      setSlug(generateSlug(val));
    }
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadBlog = async () => {
        setIsLoading(true);
        try {
          const blog = await blogService.getAdminBlogById(id);
          // English Content
          setTitle(blog.title || "");
          setSlug(blog.slug || "");
          setIsCustomSlug(true);
          setSubtitle(blog.subtitle || "");
          setExcerpt(blog.excerpt || "");
          setContent(blog.content || "");
          setMetaTitle(blog.metaTitle || "");
          setMetaDescription(blog.metaDescription || "");

          // Hindi Content
          setTitleHi(blog.titleHi || "");
          setSubtitleHi(blog.subtitleHi || "");
          setExcerptHi(blog.excerptHi || "");
          setContentHi(blog.contentHi || "");
          setMetaTitleHi(blog.metaTitleHi || "");
          setMetaDescriptionHi(blog.metaDescriptionHi || "");

          // Common Metadata
          const isStandardCategory = (BLOG_CATEGORIES as readonly string[]).includes(blog.category);
          setCategory(isStandardCategory ? blog.category : "Custom");
          if (!isStandardCategory) {
            setCustomCategory(blog.category);
            setIsAddingCustomCategory(true);
          }
          setFeaturedImage(blog.featuredImage || "");
          setAuthor(blog.author || "Veda Structure Team");
          setAuthorAvatar(blog.authorAvatar || "");
          setStatus(blog.status);
          setIsFeatured(blog.isFeatured);
          setReadTime(blog.readTime || "5 min read");
          setTags(blog.tags || []);
          setMetaKeywords(blog.metaKeywords || []);
          if (blog.publishedAt) {
            setPublishedAt(new Date(blog.publishedAt).toISOString().slice(0, 16));
          }
        } catch (err: any) {
          showError(err?.message || "Failed to load blog post for editing");
          navigate("/admin/library/blogs");
        } finally {
          setIsLoading(false);
        }
      };
      loadBlog();
    }
  }, [id, isEditMode]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (errors.featuredImage) {
      setErrors((prev) => ({ ...prev, featuredImage: "" }));
    }

    setIsUploadingImage(true);
    try {
      const uploaded = await uploadImage(file, { folder: "library-blogs" });
      setFeaturedImage(uploaded.url);
      showSuccess("Featured image uploaded successfully");
    } catch {
      const localUrl = URL.createObjectURL(file);
      setFeaturedImage(localUrl);
      showWarning("Image loaded locally (offline storage mode)");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (newTag: string) => {
    const clean = newTag.trim().replace(/^#/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddKeyword = (newKw: string) => {
    const clean = newKw.trim();
    if (clean && !metaKeywords.includes(clean)) {
      setMetaKeywords([...metaKeywords, clean]);
    }
    setKeywordInput("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setMetaKeywords(metaKeywords.filter((k) => k !== kwToRemove));
  };

  /**
   * Form Validation
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. English Title Validation
    if (!title.trim()) {
      newErrors.title = "Article title (English) is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Article title must be at least 3 characters long.";
    } else if (title.trim().length > 300) {
      newErrors.title = "Article title cannot exceed 300 characters.";
    }

    // 2. English Content Validation
    const plainContent = content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
    if (!plainContent) {
      newErrors.content = "Article content (English) is required.";
    }

    // 3. Slug Validation
    if (slug.trim()) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug.trim())) {
        newErrors.slug =
          "URL slug must contain only lowercase letters, numbers, and hyphens (e.g. sacred-vedas-wisdom).";
      }
    }

    // 4. Category Validation
    if (isAddingCustomCategory && !customCategory.trim()) {
      newErrors.category = "Please enter a custom category name or select a standard category.";
    }

    // 5. Author Validation
    if (!author.trim()) {
      newErrors.author = "Author name is required.";
    }

    // 6. Featured Image URL Validation
    if (
      featuredImage.trim() &&
      !featuredImage.startsWith("data:") &&
      !/^https?:\/\//i.test(featuredImage.trim()) &&
      !featuredImage.startsWith("/")
    ) {
      newErrors.featuredImage = "Featured image must be a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.title || newErrors.content) {
        setActiveLang("en");
      }
      const firstError = Object.values(newErrors)[0];
      showError(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (targetStatus?: BlogStatus) => {
    if (!validateForm()) {
      return;
    }

    const finalCategory =
      isAddingCustomCategory && customCategory.trim()
        ? customCategory.trim()
        : category;

    const finalStatus = targetStatus || status;

    setIsSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        subtitle: subtitle.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content,
        titleHi: titleHi.trim() || undefined,
        subtitleHi: subtitleHi.trim() || undefined,
        excerptHi: excerptHi.trim() || undefined,
        contentHi: contentHi.trim() || undefined,
        featuredImage: featuredImage.trim() || undefined,
        author: author.trim() || "Veda Structure Team",
        authorAvatar: authorAvatar.trim() || undefined,
        category: finalCategory,
        tags,
        status: finalStatus,
        isFeatured,
        readTime: readTime.trim() || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaTitleHi: metaTitleHi.trim() || undefined,
        metaDescriptionHi: metaDescriptionHi.trim() || undefined,
        metaKeywords,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      };

      if (isEditMode && id) {
        await blogService.updateBlog(id, payload);
        showSuccess("Article updated successfully!");
      } else {
        await blogService.createBlog(payload);
        showSuccess(
          finalStatus === "Published"
            ? "Article published successfully to Veda Library!"
            : "Draft article saved successfully!",
        );
      }

      navigate("/admin/library/blogs");
    } catch (err: any) {
      const errorMsg =
        err?.message ||
        err?.data?.message ||
        err?.data?.error ||
        "Failed to save article. Please check your network connection.";
      showError(errorMsg);

      if (errorMsg.toLowerCase().includes("slug")) {
        setErrors((prev) => ({ ...prev, slug: errorMsg }));
      } else if (errorMsg.toLowerCase().includes("title")) {
        setErrors((prev) => ({ ...prev, title: errorMsg }));
        setActiveLang("en");
      } else if (errorMsg.toLowerCase().includes("content")) {
        setErrors((prev) => ({ ...prev, content: errorMsg }));
        setActiveLang("en");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading article editor...</p>
      </div>
    );
  }

  const hasEnglishContent = Boolean(title.trim() && content.trim());
  const hasHindiContent = Boolean(titleHi.trim() || contentHi.trim());

  // SERP preview calculations
  const displaySerpTitle = (metaTitle || title || "Veda Library Article").trim();
  const displaySerpSlug = (slug || generateSlug(title) || "article-slug").trim();
  const displaySerpDesc = (
    metaDescription ||
    excerpt ||
    "Discover authentic Vedic wisdom, ancient rituals, mantras, and scriptural insights at Veda Structure Library."
  ).trim();

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* ================= STICKY ACTION HEADER ================= */}
      <div className="sticky top-0 z-40 -mx-2 sm:-mx-4 px-4 py-3 bg-white/95 backdrop-blur-md border border-cream-200/90 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/admin/library/blogs"
            className="p-2 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-xl hover:bg-cream-50 transition shadow-2xs shrink-0"
            title="Back to Articles List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md border border-saffron-200/60">
                Veda Library
              </span>
              <span className="text-xs text-charcoal-300">•</span>
              <span className="text-xs text-charcoal-500 font-medium">
                {isEditMode ? "Editing Post" : "Compose New Post"}
              </span>
              <span className="text-xs text-charcoal-300">•</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  status === "Published"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : status === "Draft"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-charcoal-100 text-charcoal-600 border-charcoal-200"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-charcoal-900 truncate">
              {title.trim() ? title : isEditMode ? "Edit Article" : "Create New Article"}
            </h1>
          </div>
        </div>

        {/* Right Sticky Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-700 bg-white border border-cream-200 hover:bg-cream-50 rounded-xl transition shadow-2xs hover:shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-charcoal-500" />
            <span className="hidden sm:inline">Live</span> Preview
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit("Draft")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition shadow-2xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-charcoal-600" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit("Published")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-500 hover:to-saffron-600 rounded-xl transition shadow-xs hover:shadow-md disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isEditMode ? "Update & Publish" : "Publish Post"}</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
              Please resolve the following required fields:
            </h4>
            <ul className="mt-1 list-disc list-inside text-xs space-y-0.5 text-red-700">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bilingual Language Switcher Strip */}
      <div className="bg-white/95 backdrop-blur-md border border-cream-200/90 rounded-2xl p-3 sm:px-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-saffron-50 border border-saffron-200 text-saffron-600 flex items-center justify-center font-bold shadow-2xs">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-800">
              Article Language Editor:
            </span>
            <span className="text-xs text-charcoal-400 ml-1.5 hidden md:inline">
              (Single article holds dual English & Hindi translations)
            </span>
          </div>
        </div>

        <div className="flex items-center bg-cream-100/80 p-1 rounded-xl border border-cream-200/60 gap-1 self-stretch sm:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveLang("en")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeLang === "en"
                ? "bg-white text-charcoal-900 shadow-2xs border border-cream-200/80 font-bold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <span>🇬🇧 English</span>
            {hasEnglishContent ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="English content added" />
            ) : (
              <span className="text-[10px] text-amber-600 font-normal">*Required</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveLang("hi")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeLang === "hi"
                ? "bg-white text-charcoal-900 shadow-2xs border border-cream-200/80 font-bold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <span>🇮🇳 हिन्दी (Hindi)</span>
            {hasHindiContent ? (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                ✓ Ready
              </span>
            ) : (
              <span className="text-[10px] text-charcoal-400 font-normal">+ Optional</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT 2 COLUMNS: MAIN CONTENT & SEO ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ================= 🇬🇧 ENGLISH TAB ================= */}
          {activeLang === "en" && (
            <div className="space-y-6 animate-fade-in">
              {/* Title & Slug Box */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                      Article Title (English) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      Primary Heading
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="E.g. The Sacred Science of Rudrabhishek: Cosmic Benefits & Vidhi"
                    className={`w-full px-4 py-3 text-base sm:text-lg font-bold border rounded-2xl focus:ring-2 focus:outline-hidden placeholder:font-normal placeholder:text-charcoal-400 transition-all ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                        : "border-cream-200 focus:ring-saffron-500/30 focus:border-saffron-500 bg-cream-50/30 focus:bg-white"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                {/* Slug with Auto-generate & Manual Override */}
                <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-charcoal-600">
                    <span className="flex items-center gap-1.5 font-semibold text-charcoal-800">
                      <Globe className="w-3.5 h-3.5 text-saffron-600" />
                      <span>URL Permaslug:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCustomSlug(!isCustomSlug)}
                      className="text-saffron-600 hover:text-saffron-700 font-bold transition text-xs"
                    >
                      {isCustomSlug ? "↺ Auto-generate from title" : "✎ Edit custom slug"}
                    </button>
                  </div>

                  {isCustomSlug ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal-400 font-mono">/library/blogs/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlug(generateSlug(e.target.value));
                          if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
                        }}
                        placeholder="custom-article-slug"
                        className={`flex-1 px-3 py-1.5 text-xs font-mono border rounded-xl focus:ring-2 focus:outline-hidden bg-white ${
                          errors.slug
                            ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                            : "border-cream-300 focus:ring-saffron-500/30 focus:border-saffron-500"
                        }`}
                      />
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-charcoal-600 truncate bg-white px-3 py-1.5 rounded-xl border border-cream-200/60">
                      https://vedastructure.com/library/blogs/
                      <strong className="text-saffron-700 font-bold">{slug || "article-slug"}</strong>
                    </p>
                  )}
                  {errors.slug && (
                    <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.slug}</span>
                    </p>
                  )}
                </div>

                {/* Subtitle / Tagline */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Subtitle / Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A poignant one-line philosophical summary of this article"
                    className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-cream-50/30 focus:bg-white"
                  />
                </div>
              </div>

              {/* English Summary / Excerpt */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                    Summary / Excerpt (English)
                  </label>
                  <span className="text-xs text-charcoal-400 font-mono">
                    {excerpt.length}/250 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={excerpt}
                  maxLength={250}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short 2-3 sentence overview displayed on blog index cards and social previews..."
                  className="w-full px-4 py-2.5 text-sm border border-cream-200 rounded-2xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden leading-relaxed bg-cream-50/30 focus:bg-white"
                />
              </div>

              {/* English Rich Text Editor */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-800">
                      Article Body Content (English) <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      Rich markdown & visual typography: Headings, bullet lists, Sanskrit quotes, and images.
                    </p>
                  </div>
                </div>

                <div className={errors.content ? "ring-2 ring-red-400 rounded-2xl" : ""}>
                  <RichTextEditor
                    value={content}
                    onChange={(val) => {
                      setContent(val);
                      if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
                    }}
                    minHeight="440px"
                    placeholder="Compose sacred knowledge, mantra meanings, and scriptural context in English..."
                  />
                </div>

                {errors.content && (
                  <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.content}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= 🇮🇳 HINDI TAB ================= */}
          {activeLang === "hi" && (
            <div className="space-y-6 animate-fade-in">
              {/* Hindi Title & Subtitle */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                      लेख का शीर्षक (Title in Hindi)
                    </label>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      हिन्दी शीर्षक
                    </span>
                  </div>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="जैसे: रुद्राभिषेक पूजा की दिव्य शक्ति और लाभ: संपूर्ण विधि एवं रहस्य"
                    className="w-full px-4 py-3 text-base sm:text-lg font-bold border border-cream-200 rounded-2xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-cream-50/30 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    उप-शीर्षक / टैगलाइन (Subtitle in Hindi)
                  </label>
                  <input
                    type="text"
                    value={subtitleHi}
                    onChange={(e) => setSubtitleHi(e.target.value)}
                    placeholder="भगवान शिव की असीम कृपा और आध्यात्मिक उन्नति के लिए मार्गदर्शन"
                    className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-cream-50/30 focus:bg-white"
                  />
                </div>
              </div>

              {/* Hindi Excerpt */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                    संक्षिप्त सारांश (Excerpt in Hindi)
                  </label>
                  <span className="text-xs text-charcoal-400 font-mono">
                    {excerptHi.length}/250 अक्षर
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={excerptHi}
                  maxLength={250}
                  onChange={(e) => setExcerptHi(e.target.value)}
                  placeholder="ब्लॉग कार्ड और खोज परिणामों के लिए 2-3 पंक्तियों का संक्षिप्त हिन्दी सारांश..."
                  className="w-full px-4 py-2.5 text-sm border border-cream-200 rounded-2xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden leading-relaxed bg-cream-50/30 focus:bg-white"
                />
              </div>

              {/* Hindi Rich Text Editor */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-800">
                      सम्पूर्ण लेख सामग्री (Content in Hindi)
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      हिन्दी में विस्तृत लेख लिखें। हेडिंग्स, बुलेट पॉइंट्स एवं मंत्रों की व्याख्या।
                    </p>
                  </div>
                </div>
                <RichTextEditor
                  value={contentHi}
                  onChange={setContentHi}
                  minHeight="440px"
                  placeholder="यहाँ हिन्दी में वैदिक ज्ञान, मंत्रों की व्याख्या और पूजा विधि लिखें..."
                />
              </div>
            </div>
          )}

          {/* ================= SEO & SERP PREVIEW SECTION ================= */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-cream-200/90 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeoSection(!showSeoSection)}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-cream-50/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">
                    Search Engine Optimization (SEO) & Google SERP Preview
                  </h3>
                  <p className="text-xs text-charcoal-400">
                    Configure meta tags, title, description, and preview Google search ranking cards.
                  </p>
                </div>
              </div>
              {showSeoSection ? (
                <ChevronUp className="w-5 h-5 text-charcoal-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-charcoal-400" />
              )}
            </button>

            {showSeoSection && (
              <div className="p-6 border-t border-cream-200/80 space-y-5 bg-cream-50/20">
                {/* Google SERP Live Snippet Card */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-cream-100">
                    <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      Live Google Search Snippet Card
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-mono">Desktop Preview</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[9px] font-bold">
                        V
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-charcoal-700 font-medium">
                          Veda Structure › library › blogs
                        </p>
                        <p className="text-[10px] text-charcoal-400 font-mono truncate">
                          https://vedastructure.com/library/blogs/{displaySerpSlug}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-base font-semibold text-blue-700 hover:underline cursor-pointer truncate pt-0.5">
                      {displaySerpTitle} | Veda Structure
                    </h4>

                    <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                      {displaySerpDesc}
                    </p>
                  </div>
                </div>

                {/* English Meta Title & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Meta Title (English)
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || "Focus keyword rich title"}
                      className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      मेटा शीर्षक (Meta Title in Hindi)
                    </label>
                    <input
                      type="text"
                      value={metaTitleHi}
                      onChange={(e) => setMetaTitleHi(e.target.value)}
                      placeholder={titleHi || "हिन्दी खोज शीर्षक"}
                      className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-charcoal-700">
                        Meta Description (English)
                      </label>
                      <span className="text-[10px] text-charcoal-400">
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={160}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="150-160 character description in English..."
                      className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-charcoal-700">
                        मेटा विवरण (Meta Description in Hindi)
                      </label>
                      <span className="text-[10px] text-charcoal-400">
                        {metaDescriptionHi.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={160}
                      value={metaDescriptionHi}
                      onChange={(e) => setMetaDescriptionHi(e.target.value)}
                      placeholder="150-160 अक्षरों का हिन्दी विवरण..."
                      className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>

                {/* SEO Keywords Input */}
                <div className="space-y-2 pt-2 border-t border-cream-200/80">
                  <label className="block text-xs font-semibold text-charcoal-700">
                    SEO Focus Keywords
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddKeyword(keywordInput);
                        }
                      }}
                      placeholder="Type keyword and press Enter..."
                      className="flex-1 px-3.5 py-1.5 text-xs border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddKeyword(keywordInput)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition"
                    >
                      Add Keyword
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {metaKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white text-charcoal-700 border border-cream-200 shadow-2xs"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="hover:text-red-600 transition ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT 1 COLUMN: SIDEBAR METADATA ================= */}
        <div className="space-y-6">
          {/* Publishing Details Card */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-saffron-600" />
              <span>Publishing Status & Timing</span>
            </h3>

            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogStatus)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold border border-cream-200 rounded-xl bg-white focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden text-charcoal-900 shadow-2xs"
              >
                <option value="Draft">Draft (Saved Privately)</option>
                <option value="Published">Published (Live Online)</option>
                <option value="Archived">Archived (Hidden)</option>
              </select>
            </div>

            {/* Featured Post Toggle */}
            <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
              <div className="pr-2">
                <span className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Featured Article</span>
                </span>
                <p className="text-[11px] text-charcoal-400">
                  Spotlight on top of library homepage.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-cream-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-600 shadow-2xs"></div>
              </label>
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1.5">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-cream-200 rounded-xl bg-cream-50/40 focus:bg-white focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Featured Cover Image with Live Preview & Dropzone */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-saffron-600" />
                  <span>Cover Image</span>
                </h3>
                <p className="text-xs text-charcoal-400">
                  Shared across English and Hindi listings.
                </p>
              </div>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
                >
                  Remove
                </button>
              )}
            </div>

            {featuredImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-cream-200 group aspect-video max-h-56 shadow-2xs">
                <img
                  src={featuredImage}
                  alt="Featured blog cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-bold text-charcoal-800 bg-white rounded-xl shadow-xs hover:bg-cream-50"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-xl shadow-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-cream-300 rounded-2xl p-5 text-center hover:border-saffron-400 transition bg-cream-50/40">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="blog-featured-image-upload-bi2"
                />
                <label
                  htmlFor="blog-featured-image-upload-bi2"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-saffron-50 flex items-center justify-center text-saffron-600 shadow-2xs">
                    {isUploadingImage ? (
                      <div className="w-5 h-5 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-charcoal-800 block">
                      {isUploadingImage ? "Uploading image..." : "Upload Cover Image"}
                    </span>
                    <span className="text-[11px] text-charcoal-400">
                      PNG, JPG, WEBP (1200 x 630 px)
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Direct Image URL input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-charcoal-600">
                Or Direct Image URL
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => {
                  setFeaturedImage(e.target.value);
                  if (errors.featuredImage) setErrors((prev) => ({ ...prev, featuredImage: "" }));
                }}
                placeholder="https://example.com/cover.jpg"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:outline-hidden bg-white ${
                  errors.featuredImage
                    ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                    : "border-cream-200 focus:ring-saffron-500/30 focus:border-saffron-500"
                }`}
              />
              {errors.featuredImage && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.featuredImage}</span>
                </p>
              )}
            </div>
          </div>

          {/* Category Selector Card */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal-900">
                Library Category <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCustomCategory(!isAddingCustomCategory);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className="text-xs text-saffron-600 hover:text-saffron-700 font-bold transition"
              >
                {isAddingCustomCategory ? "Choose standard" : "+ Custom Category"}
              </button>
            </div>

            {isAddingCustomCategory ? (
              <div>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  placeholder="Enter custom category name"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:outline-hidden bg-white ${
                    errors.category
                      ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                      : "border-cream-200 focus:ring-saffron-500/30 focus:border-saffron-500"
                  }`}
                />
                {errors.category && (
                  <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.category}</span>
                  </p>
                )}
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className="w-full px-3.5 py-2.5 text-sm font-semibold border border-cream-200 rounded-xl bg-white focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden text-charcoal-800 shadow-2xs"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tags & Topics Card */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-saffron-600" />
              <span>Vedic Tags & Topics</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                placeholder="Type tag & press Enter"
                className="flex-1 px-3 py-2 text-xs border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-2xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-8 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200/60 shadow-2xs"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-600 transition ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-cream-100">
              <span className="text-[11px] font-bold text-charcoal-400 block mb-1.5">
                Suggested Topics:
              </span>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_TAGS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleAddTag(st)}
                    disabled={tags.includes(st)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-cream-100 text-charcoal-600 hover:bg-saffron-50 hover:text-saffron-700 transition disabled:opacity-30 font-medium"
                  >
                    +{st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Author & Reading Time Card */}
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-cream-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <User className="w-4 h-4 text-saffron-600" />
              <span>Author & Reading Estimate</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: "" }));
                }}
                placeholder="Veda Structure Team"
                className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-hidden bg-white ${
                  errors.author
                    ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                    : "border-cream-200 focus:ring-saffron-500/30 focus:border-saffron-500"
                }`}
              />
              {errors.author && (
                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.author}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Author Avatar URL
              </label>
              <input
                type="url"
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3.5 py-2 text-xs border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 focus:outline-hidden bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-saffron-600" />
                <h3 className="font-bold text-charcoal-900">Live Article Reader Preview</h3>
                <div className="flex items-center bg-cream-200/80 p-0.5 rounded-lg text-xs font-semibold ml-2">
                  <button
                    type="button"
                    onClick={() => setPreviewLang("en")}
                    className={`px-3 py-1 rounded-md transition ${
                      previewLang === "en" ? "bg-white text-saffron-700 shadow-2xs font-bold" : "text-charcoal-600"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang("hi")}
                    className={`px-3 py-1 rounded-md transition ${
                      previewLang === "hi" ? "bg-white text-saffron-700 shadow-2xs font-bold" : "text-charcoal-600"
                    }`}
                  >
                    🇮🇳 हिन्दी
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-xl hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-saffron-100 text-saffron-800">
                    {category}
                  </span>
                  {isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cream-100 text-charcoal-600">
                    {previewLang === "en" ? "English View" : "हिन्दी प्रारूप"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 leading-tight">
                  {previewLang === "en"
                    ? title || "Untitled Article"
                    : titleHi || title || "शीर्षक उपलब्ध नहीं है"}
                </h1>

                {(previewLang === "en" ? subtitle : subtitleHi) && (
                  <p className="text-base sm:text-lg text-charcoal-600 italic">
                    {previewLang === "en" ? subtitle : subtitleHi}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs sm:text-sm text-charcoal-500 pt-2 border-t border-cream-200">
                  <span className="font-semibold text-charcoal-800">{author}</span>
                  <span>•</span>
                  <span>{readTime}</span>
                  <span>•</span>
                  <span>
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {featuredImage && (
                <div className="rounded-2xl overflow-hidden aspect-video border border-cream-200">
                  <img
                    src={featuredImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {(previewLang === "en" ? excerpt : excerptHi) && (
                <div className="p-4 rounded-xl bg-amber-50/50 border-l-4 border-amber-400 text-charcoal-700 font-medium leading-relaxed">
                  {previewLang === "en" ? excerpt : excerptHi}
                </div>
              )}

              <div
                className="rich-text-content max-w-none text-charcoal-800 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{
                  __html:
                    (previewLang === "en" ? content : contentHi) ||
                    `<p><em>${
                      previewLang === "en"
                        ? "No English content provided yet..."
                        : "हिन्दी सामग्री अभी नहीं जोड़ी गई है..."
                    }</em></p>`,
                }}
              />

              {tags.length > 0 && (
                <div className="pt-6 border-t border-cream-200 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-cream-100 text-charcoal-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
