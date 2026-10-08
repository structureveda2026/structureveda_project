import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Copy,
  Check,
  Globe,
  Sparkles,
  Languages,
  BookOpen,
  Share2,
  Search,
  FileText,
  Tag,
  ExternalLink,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

import { blogService } from "../services/blog.service";
import type { BlogPost } from "../types/blog.types";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "hi">("en");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const data = await blogService.getAdminBlogById(id);
        setBlog(data);
      } catch (err: any) {
        showError(err?.message || "Failed to load blog post details");
        navigate("/admin/library/blogs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleCopyLink = () => {
    if (!blog) return;
    const publicUrl = `${window.location.origin}/library/blogs/${blog.slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showSuccess("Public article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const confirmDelete = async () => {
    if (!blog) return;
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(blog.id);
      showSuccess("Article deleted successfully");
      navigate("/admin/library/blogs");
    } catch (err: any) {
      showError(err?.message || "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading Vedic article preview...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-cream-200 p-8 max-w-xl mx-auto shadow-xs">
        <BookOpen className="w-12 h-12 text-saffron-500 mx-auto mb-3 opacity-60" />
        <h2 className="text-xl font-bold text-charcoal-800">Article Not Found</h2>
        <p className="text-xs text-charcoal-500 mt-1">
          The requested Vedic library article might have been moved or removed.
        </p>
        <Link
          to="/admin/library/blogs"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Articles Directory</span>
        </Link>
      </div>
    );
  }

  const currentTitle = activeLang === "en" ? blog.title : blog.titleHi || blog.title;
  const currentSubtitle = activeLang === "en" ? blog.subtitle : blog.subtitleHi || blog.subtitle;
  const currentExcerpt = activeLang === "en" ? blog.excerpt : blog.excerptHi || blog.excerpt;
  const currentContent = activeLang === "en" ? blog.content : blog.contentHi || blog.content;
  const hasHindi = Boolean(blog.titleHi || blog.contentHi);

  // Content Analytics
  const plainText = (currentContent || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;
  const estimatedReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const renderStatusPill = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PUBLISHED
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            DRAFT
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            SCHEDULED
          </span>
        );
      case "Archived":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-charcoal-100 text-charcoal-600 border border-charcoal-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal-400" />
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Sticky / Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200 bg-white/70 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/library/blogs"
            className="p-2.5 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-xl hover:bg-cream-50 transition shadow-2xs"
            title="Back to Articles List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md border border-saffron-200/60">
                Veda Library
              </span>
              <span className="text-xs text-charcoal-300">•</span>
              <span className="text-xs text-charcoal-500 font-medium">Article Details</span>
              {hasHindi && (
                <>
                  <span className="text-xs text-charcoal-300">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Languages className="w-3 h-3" /> Bilingual (EN + HI)
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 mt-0.5 truncate max-w-xl">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Switcher */}
          <div className="flex items-center bg-cream-100/90 p-1 rounded-xl text-xs font-semibold border border-cream-200/80 shadow-2xs">
            <button
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === "en"
                  ? "bg-white text-saffron-700 shadow-xs font-bold"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setActiveLang("hi")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === "hi"
                  ? "bg-white text-saffron-700 shadow-xs font-bold"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              🇮🇳 हिन्दी {hasHindi ? "✓" : "(draft)"}
            </button>
          </div>

          {/* Copy Public Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-charcoal-700 bg-white border border-cream-200 hover:bg-cream-50 rounded-xl transition shadow-2xs hover:shadow-xs"
            title="Copy Public Link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-charcoal-500" />
            )}
            <span>{copied ? "Copied Link!" : "Copy Link"}</span>
          </button>

          {/* Edit Button */}
          <Link
            to={`/admin/library/blogs/${blog.id}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-500 hover:to-saffron-600 rounded-xl transition shadow-xs hover:shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Article</span>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-2 text-charcoal-400 hover:text-red-600 bg-white border border-cream-200 hover:bg-red-50 rounded-xl transition shadow-2xs"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Article & Body), Right 1 Col (SEO & Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editorial Article View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-xs overflow-hidden">
            {/* Hero Cover Image Banner */}
            <div className="relative aspect-video w-full overflow-hidden bg-cream-100">
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={currentTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-50 via-cream-100 to-saffron-50/30 flex flex-col items-center justify-center text-saffron-600 p-8">
                  <BookOpen className="w-16 h-16 stroke-[1.2] text-saffron-500/70 mb-2" />
                  <span className="text-sm font-serif font-bold text-charcoal-500">
                    Sacred Vedic Wisdom
                  </span>
                  <span className="text-xs text-charcoal-400">
                    Veda Structure Knowledge Library
                  </span>
                </div>
              )}

              {/* Floating Hero Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-saffron-700 border border-cream-200/90 shadow-2xs">
                  {blog.category}
                </span>

                <div className="flex items-center gap-2">
                  {blog.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured
                    </span>
                  )}
                  {renderStatusPill(blog.status)}
                </div>
              </div>
            </div>

            {/* Editorial Header Content */}
            <div className="p-6 sm:p-10 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-charcoal-500">
                  <span className="bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200/60">
                    {activeLang === "en" ? "🇬🇧 English Edition" : "🇮🇳 हिन्दी संस्करण"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200/50">
                    /library/blogs/{blog.slug}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 leading-tight tracking-tight">
                  {currentTitle}
                </h1>

                {currentSubtitle && (
                  <p className="text-base sm:text-lg text-charcoal-600 italic font-serif leading-relaxed">
                    {currentSubtitle}
                  </p>
                )}

                {/* Author Info & Timestamps Bar */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-charcoal-600 pt-4 border-t border-cream-100">
                  <div className="flex items-center gap-2.5 font-semibold text-charcoal-800">
                    {blog.authorAvatar ? (
                      <img
                        src={blog.authorAvatar}
                        alt={blog.author}
                        className="w-8 h-8 rounded-full object-cover border border-cream-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-800 flex items-center justify-center font-bold text-xs border border-saffron-200">
                        {blog.author?.charAt(0) || "V"}
                      </div>
                    )}
                    <div>
                      <p className="leading-none text-charcoal-900 font-bold">{blog.author}</p>
                      <p className="text-[11px] text-charcoal-400 font-normal mt-0.5">
                        Author & Curator
                      </p>
                    </div>
                  </div>

                  <span className="text-charcoal-300">•</span>

                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-charcoal-400" />
                    <span>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Unpublished Draft"}
                    </span>
                  </span>

                  <span className="text-charcoal-300">•</span>

                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-charcoal-400" />
                    <span>{blog.readTime || `${estimatedReadingMinutes} min read`}</span>
                  </span>

                  <span className="text-charcoal-300">•</span>

                  <span className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/60">
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>{(blog.viewsCount || 0).toLocaleString()} devotee reads</span>
                  </span>
                </div>
              </div>

              {/* Excerpt Card */}
              {currentExcerpt && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border-l-4 border-saffron-500 text-charcoal-800 font-medium leading-relaxed shadow-2xs text-sm sm:text-base">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 mb-1">
                    Article Summary
                  </div>
                  {currentExcerpt}
                </div>
              )}

              {/* Rich Body Content Render */}
              <div
                className="rich-text-content max-w-none text-charcoal-800 leading-relaxed font-sans text-base space-y-4 pt-2"
                dangerouslySetInnerHTML={{
                  __html:
                    currentContent ||
                    `<p className="text-charcoal-400 italic">${
                      activeLang === "en"
                        ? "No English content provided for this article."
                        : "हिन्दी संस्करण अभी उपलब्ध नहीं है।"
                    }</p>`,
                }}
              />

              {/* Tags & Topics */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="pt-8 border-t border-cream-200/80 space-y-2.5">
                  <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-saffron-500" />
                    Topics & Vedic Taxonomy
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cream-100 text-charcoal-700 hover:bg-saffron-50 hover:text-saffron-700 border border-cream-200/60 transition-colors cursor-default"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: SEO, SERP, OpenGraph & Analytics Cards */}
        <div className="space-y-6">
          {/* Analytics & Reader Engagement Summary Card */}
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Article Analytics & Metrics</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/60 space-y-1">
                <span className="text-[11px] font-medium text-charcoal-400">Devotee Views</span>
                <p className="text-xl font-extrabold text-charcoal-900">
                  {(blog.viewsCount || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/60 space-y-1">
                <span className="text-[11px] font-medium text-charcoal-400">Reading Time</span>
                <p className="text-xl font-extrabold text-charcoal-900">
                  {blog.readTime || `${estimatedReadingMinutes} min`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/60 space-y-1">
                <span className="text-[11px] font-medium text-charcoal-400">Word Count</span>
                <p className="text-xl font-extrabold text-charcoal-900">{wordCount}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/60 space-y-1">
                <span className="text-[11px] font-medium text-charcoal-400">Characters</span>
                <p className="text-xl font-extrabold text-charcoal-900">{charCount}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Publication Status:</span>
                <div>{renderStatusPill(blog.status)}</div>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Library Category:</span>
                <span className="font-bold text-charcoal-800">{blog.category}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Languages:</span>
                <span className="font-semibold text-emerald-700">
                  English {hasHindi ? "+ हिन्दी" : "(Hindi pending)"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Created:</span>
                <span className="font-medium text-charcoal-700">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-charcoal-400">Last Modified:</span>
                <span className="font-medium text-charcoal-700">
                  {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Public Permalink Card */}
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-xs p-6 space-y-3">
            <h3 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-saffron-600" />
              <span>Public Web URL</span>
            </h3>
            <p className="text-xs text-charcoal-500">
              Devotees and seekers access this wisdom post via:
            </p>
            <div className="p-3 rounded-xl bg-cream-50 font-mono text-xs text-charcoal-700 break-all border border-cream-200/80">
              https://vedastructure.com/library/blogs/{blog.slug}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 rounded-xl transition border border-saffron-200/60 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{copied ? "URL Copied to Clipboard!" : "Copy Full Article URL"}</span>
            </button>
          </div>

          {/* SEO & SERP / Social OpenGraph Preview Card */}
          <div className="bg-white rounded-3xl border border-cream-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-bold text-charcoal-900 text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>SEO & Google SERP Preview</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-charcoal-400 tracking-wider">
                Google Search
              </span>
            </div>

            {/* Google Search Result Mockup Card */}
            <div className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200/80 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[9px] font-bold">
                  V
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-charcoal-700 font-medium truncate">
                    Veda Structure Library
                  </p>
                  <p className="text-[10px] text-charcoal-400 font-mono truncate">
                    https://vedastructure.com › library › blogs › {blog.slug}
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1 pt-1">
                {blog.metaTitle || blog.title} | Veda Structure
              </h4>

              <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                {blog.metaDescription ||
                  blog.excerpt ||
                  "Read sacred Vedic wisdom, ritual procedures, and authentic scriptures at Veda Structure Library."}
              </p>
            </div>

            {/* OpenGraph / Social Share Mockup */}
            <div className="space-y-2 pt-2 border-t border-cream-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-saffron-500" />
                  Social Card Preview (OpenGraph)
                </span>
              </div>

              <div className="rounded-2xl border border-cream-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="aspect-video w-full bg-cream-100 relative overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-saffron-600 bg-amber-50">
                      <BookOpen className="w-10 h-10 text-saffron-500/60" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-cream-50/70 border-t border-cream-200/60 space-y-0.5">
                  <span className="text-[10px] text-charcoal-400 uppercase font-mono">
                    vedastructure.com
                  </span>
                  <p className="text-xs font-bold text-charcoal-900 truncate">
                    {blog.metaTitle || blog.title}
                  </p>
                  <p className="text-[11px] text-charcoal-500 line-clamp-1">
                    {blog.metaDescription || blog.excerpt || "Sacred Vedic Library Article"}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Tags & Keywords */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-cream-100">
              <div>
                <span className="text-[11px] font-bold text-charcoal-400 uppercase block mb-1">
                  Meta Keywords ({blog.metaKeywords?.length || 0}):
                </span>
                {blog.metaKeywords && blog.metaKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {blog.metaKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-cream-100 rounded-md text-[11px] text-charcoal-600 font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-charcoal-400 italic text-[11px]">No SEO keywords set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Permanently Delete Article"
        message={`Are you sure you want to permanently delete "${blog.title}"? This will remove the article and its URLs from Veda Structure.`}
        confirmText={isDeleting ? "Deleting..." : "Permanently Delete"}
        type="danger"
      />
    </div>
  );
}
