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

  // Common Settings
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
  const [showSeoAccordion, setShowSeoAccordion] = useState(false);

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

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (targetStatus?: BlogStatus) => {
    if (!title.trim()) {
      showError("Please enter English blog post title");
      setActiveLang("en");
      return;
    }
    if (!content.trim()) {
      showError("Please write English blog content");
      setActiveLang("en");
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
        // Hindi Content
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
        showSuccess("Blog post updated successfully (English & Hindi)!");
      } else {
        await blogService.createBlog(payload);
        showSuccess(
          finalStatus === "Published"
            ? "Blog post published successfully to Veda Library!"
            : "Draft blog post saved successfully!",
        );
      }

      navigate("/admin/library/blogs");
    } catch (err: any) {
      showError(err?.message || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading blog post details...</p>
      </div>
    );
  }

  const hasEnglishContent = Boolean(title.trim() && content.trim());
  const hasHindiContent = Boolean(titleHi.trim() || contentHi.trim());

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/library/blogs"
            className="p-2 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-xl hover:bg-cream-50 transition shadow-xs"
            title="Back to Blog List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md">
                Veda Library
              </span>
              <span className="text-xs text-charcoal-400">•</span>
              <span className="text-xs text-charcoal-500">
                {isEditMode ? "Editing Post" : "New Post"}
              </span>
              <span className="text-xs text-charcoal-400">•</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Languages className="w-3.5 h-3.5" />
                <span>Bilingual Upload (EN + HI)</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-charcoal-900 mt-0.5">
              {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-charcoal-700 bg-white border border-cream-200 hover:bg-cream-50 rounded-xl transition shadow-xs"
          >
            <Eye className="w-4 h-4 text-charcoal-500" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit("Draft")}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-charcoal-600" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit("Published")}
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs hover:shadow-md disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isEditMode ? "Update & Publish" : "Publish Post"}</span>
          </button>
        </div>
      </div>

      {/* COMPACT SLEEK LANGUAGE SWITCHER */}
      <div className="bg-white border border-cream-200 rounded-xl p-2 sm:px-4 sm:py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-saffron-50 border border-saffron-200 text-saffron-600 flex items-center justify-center font-bold">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-800">
              Editing Language:
            </span>
            <span className="text-xs text-charcoal-500 ml-1.5 hidden md:inline">
              (Same blog has both English & Hindi versions)
            </span>
          </div>
        </div>

        {/* Compact Switcher Pills */}
        <div className="flex items-center bg-cream-100/80 p-1 rounded-lg border border-cream-200 gap-1 self-stretch sm:self-auto">
          {/* English Tab */}
          <button
            type="button"
            onClick={() => setActiveLang("en")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
              activeLang === "en"
                ? "bg-white text-charcoal-900 shadow-xs border border-cream-200 font-bold"
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

          {/* Hindi Tab */}
          <button
            type="button"
            onClick={() => setActiveLang("hi")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${
              activeLang === "hi"
                ? "bg-white text-charcoal-900 shadow-xs border border-cream-200 font-bold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <span>🇮🇳 हिन्दी (Hindi)</span>
            {hasHindiContent ? (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
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
        {/* Left 2 Columns: Title, Excerpt & Rich Text Editor for Current Language */}
        <div className="lg:col-span-2 space-y-6">
          {/* ===================== 🇬🇧 ENGLISH CONTENT SECTION ===================== */}
          {activeLang === "en" && (
            <div className="space-y-6 animate-fade-in">

              {/* English Title & Slug */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                      Article Title (English) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      English Title
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="E.g. The Divine Power of Rudrabhishek Puja: Complete Guide and Benefits"
                    className="w-full px-4 py-2.5 text-base sm:text-lg font-semibold border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden placeholder:font-normal placeholder:text-charcoal-400"
                  />
                </div>

                {/* Custom Slug & URL preview */}
                <div className="p-3 rounded-xl bg-cream-50/60 border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-charcoal-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Globe className="w-3.5 h-3.5 text-saffron-600" />
                      <span>Public URL Slug:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCustomSlug(!isCustomSlug)}
                      className="text-saffron-600 hover:text-saffron-700 font-semibold"
                    >
                      {isCustomSlug ? "Auto-generate from title" : "Edit custom slug"}
                    </button>
                  </div>

                  {isCustomSlug ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal-400 font-mono">/library/blogs/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        placeholder="custom-article-slug"
                        className="flex-1 px-3 py-1.5 text-xs font-mono border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                      />
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-charcoal-600 truncate">
                      https://vedastructure.com/library/blogs/<strong className="text-saffron-700">{slug || "article-slug"}</strong>
                    </p>
                  )}
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Subtitle / Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A brief catchy one-liner summarizing the core wisdom"
                    className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* English Summary / Excerpt */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                    Summary / Excerpt (English)
                  </label>
                  <span className="text-xs text-charcoal-400">
                    {excerpt.length}/250 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={excerpt}
                  maxLength={250}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short 2-3 line overview in English shown on blog cards and search listings..."
                  className="w-full px-3.5 py-2.5 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* English Rich Text Editor */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-800">
                      Article Content (English) <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      Use toolbar above editor for Headings (H1, H2), Bullet points, Hyperlinks (Link), and formatting.
                    </p>
                  </div>
                </div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  minHeight="420px"
                  placeholder="Write sacred wisdom, mantra explanations, and procedure steps in English..."
                />
              </div>
            </div>
          )}

          {/* ===================== 🇮🇳 HINDI CONTENT SECTION ===================== */}
          {activeLang === "hi" && (
            <div className="space-y-6 animate-fade-in">
              {/* Hindi Title & Subtitle */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                      लेख का शीर्षक (Title in Hindi)
                    </label>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      हिन्दी शीर्षक
                    </span>
                  </div>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="जैसे: रुद्राभिषेक पूजा की दिव्य शक्ति और लाभ: संपूर्ण विधि एवं रहस्य"
                    className="w-full px-4 py-2.5 text-base sm:text-lg font-semibold border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden placeholder:font-normal placeholder:text-charcoal-400"
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
                    placeholder="भगवान शिव की कृपा और आध्यात्मिक उन्नति के लिए संपूर्ण मार्गदर्शन"
                    className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Hindi Excerpt */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                    संक्षिप्त सारांश (Excerpt in Hindi)
                  </label>
                  <span className="text-xs text-charcoal-400">
                    {excerptHi.length}/250 अक्षरों में
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={excerptHi}
                  maxLength={250}
                  onChange={(e) => setExcerptHi(e.target.value)}
                  placeholder="ब्लॉग कार्ड और खोज परिणामों के लिए 2-3 पंक्तियों का संक्षिप्त हिन्दी सारांश..."
                  className="w-full px-3.5 py-2.5 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Hindi Rich Text Editor */}
              <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-800">
                      सम्पूर्ण लेख सामग्री (Content in Hindi)
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      हिन्दी में विस्तृत लेख लिखें। हेडिंग्स (H1, H2), बुलेट पॉइंट्स, हाइपरलिंक्स का उपयोग करें।
                    </p>
                  </div>
                </div>
                <RichTextEditor
                  value={contentHi}
                  onChange={setContentHi}
                  minHeight="420px"
                  placeholder="यहाँ हिन्दी में वैदिक ज्ञान, मंत्रों की व्याख्या और पूजा विधि लिखें..."
                />
              </div>
            </div>
          )}

          {/* Featured Cover Image (Shared across languages) */}
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-charcoal-800">Featured Banner Image</h3>
                <p className="text-xs text-charcoal-400">
                  Main card thumbnail and article header image (applies to both English & Hindi).
                </p>
              </div>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove Image
                </button>
              )}
            </div>

            {featuredImage ? (
              <div className="relative rounded-xl overflow-hidden border border-cream-200 group aspect-video max-h-72">
                <img
                  src={featuredImage}
                  alt="Featured blog cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-charcoal-800 bg-white rounded-lg shadow-sm hover:bg-cream-50"
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-cream-300 rounded-2xl p-6 text-center hover:border-saffron-400 transition bg-cream-50/40">
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
                  <div className="w-12 h-12 rounded-2xl bg-saffron-50 flex items-center justify-center text-saffron-600">
                    {isUploadingImage ? (
                      <div className="w-5 h-5 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-charcoal-800">
                      {isUploadingImage ? "Uploading image..." : "Upload Cover Image"}
                    </span>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      PNG, JPG, WEBP recommended size: 1200 x 630 px
                    </p>
                  </div>
                </label>

                <div className="mt-4 pt-3 border-t border-cream-200 max-w-sm mx-auto">
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-1.5 text-xs border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SEO Accordion */}
          <div className="bg-white rounded-2xl border border-cream-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeoAccordion(!showSeoAccordion)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-cream-50/50 transition"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-saffron-600" />
                <span className="text-sm font-bold text-charcoal-800">
                  Search Engine Optimization (SEO) & Social Meta (EN & HI)
                </span>
              </div>
              {showSeoAccordion ? (
                <ChevronUp className="w-4 h-4 text-charcoal-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-charcoal-400" />
              )}
            </button>

            {showSeoAccordion && (
              <div className="p-5 border-t border-cream-200 space-y-4 bg-cream-50/20">
                <div className="p-3.5 bg-white rounded-xl border border-cream-200 space-y-1">
                  <span className="text-[11px] text-charcoal-400 font-medium">
                    Google Search Preview (English)
                  </span>
                  <h4 className="text-sm font-semibold text-blue-700 truncate">
                    {metaTitle || title || "Article Title - Veda Structure Library"}
                  </h4>
                  <p className="text-xs text-emerald-700 font-mono truncate">
                    https://vedastructure.com/library/blogs/{slug || "article-slug"}
                  </p>
                  <p className="text-xs text-charcoal-600 line-clamp-2">
                    {metaDescription || excerpt || "Read sacred Vedic wisdom and authentic insights at Veda Structure Library."}
                  </p>
                </div>

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
                      className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
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
                      placeholder={titleHi || "हिन्दी मेटा शीर्षक"}
                      className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      Meta Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="150-160 character description in English..."
                      className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                      मेटा विवरण (Meta Description in Hindi)
                    </label>
                    <textarea
                      rows={2}
                      value={metaDescriptionHi}
                      onChange={(e) => setMetaDescriptionHi(e.target.value)}
                      placeholder="150-160 अक्षरों का हिन्दी विवरण..."
                      className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Publishing Details, Category & Tags */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-charcoal-800">Publishing Details</h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Post Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogStatus)}
                className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl bg-white focus:ring-2 focus:ring-saffron-500 focus:outline-hidden font-medium text-charcoal-800"
              >
                <option value="Draft">Draft (Saved privately)</option>
                <option value="Published">Published (Live in Library)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
              <div className="pr-2">
                <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Featured Post</span>
                </span>
                <p className="text-[11px] text-charcoal-400">
                  Highlight at the top of Veda Library.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-cream-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-saffron-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal-800">Category</h3>
              <button
                type="button"
                onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                className="text-xs text-saffron-600 hover:text-saffron-700 font-medium"
              >
                {isAddingCustomCategory ? "Choose standard" : "+ Custom"}
              </button>
            </div>

            {isAddingCustomCategory ? (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category name"
                className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-cream-200 rounded-xl bg-white focus:ring-2 focus:ring-saffron-500 focus:outline-hidden text-charcoal-800"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-saffron-600" />
              <span>Tags & Topics</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag & press Enter"
                className="flex-1 px-3 py-1.5 text-xs border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-8 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-saffron-50 text-saffron-700 border border-saffron-100"
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
              <span className="text-[11px] font-semibold text-charcoal-400 block mb-1.5">
                Suggested Topics:
              </span>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_TAGS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleAddTag(st)}
                    disabled={tags.includes(st)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-cream-100 text-charcoal-600 hover:bg-saffron-50 hover:text-saffron-700 transition disabled:opacity-40"
                  >
                    +{st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-charcoal-800">Author & Meta Info</h3>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Veda Structure Team"
                className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
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
                className="w-full px-3 py-2 text-sm border border-cream-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal (With Language Toggle) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-cream-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-saffron-600" />
                <h3 className="font-bold text-charcoal-900">Live Blog Article Preview</h3>
                <div className="flex items-center bg-cream-200 p-0.5 rounded-lg text-xs font-semibold ml-2">
                  <button
                    type="button"
                    onClick={() => setPreviewLang("en")}
                    className={`px-3 py-1 rounded-md transition ${
                      previewLang === "en" ? "bg-white text-saffron-700 shadow-xs" : "text-charcoal-600"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang("hi")}
                    className={`px-3 py-1 rounded-md transition ${
                      previewLang === "hi" ? "bg-white text-saffron-700 shadow-xs" : "text-charcoal-600"
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
                    ? title || "Untitled Blog Post"
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
                  <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
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
                    `<p><em>${previewLang === "en" ? "No English content provided yet..." : "हिन्दी सामग्री अभी नहीं जोड़ी गई है..."}</em></p>`,
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
