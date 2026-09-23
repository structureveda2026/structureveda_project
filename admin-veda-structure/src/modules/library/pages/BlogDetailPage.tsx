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
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
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
      showSuccess("Blog post deleted successfully");
      navigate("/admin/library/blogs");
    } catch (err: any) {
      showError(err?.message || "Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading blog post...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-charcoal-800">Blog post not found</h2>
        <Link
          to="/admin/library/blogs"
          className="mt-4 inline-block text-sm font-semibold text-saffron-600 hover:underline"
        >
          Return to Blog Posts List
        </Link>
      </div>
    );
  }

  const currentTitle = activeLang === "en" ? blog.title : blog.titleHi || blog.title;
  const currentSubtitle = activeLang === "en" ? blog.subtitle : blog.subtitleHi || blog.subtitle;
  const currentExcerpt = activeLang === "en" ? blog.excerpt : blog.excerptHi || blog.excerpt;
  const currentContent = activeLang === "en" ? blog.content : blog.contentHi || blog.content;
  const hasHindi = Boolean(blog.titleHi || blog.contentHi);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Header */}
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
              <span className="text-xs text-charcoal-500">Article Details</span>
              {hasHindi && (
                <>
                  <span className="text-xs text-charcoal-400">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Languages className="w-3 h-3" /> EN + HI
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-charcoal-900 mt-0.5">
              {currentTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-cream-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeLang === "en"
                  ? "bg-white text-saffron-700 shadow-xs"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setActiveLang("hi")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeLang === "hi"
                  ? "bg-white text-saffron-700 shadow-xs"
                  : "text-charcoal-600 hover:text-charcoal-900"
              }`}
            >
              🇮🇳 हिन्दी {hasHindi && "✓"}
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-charcoal-700 bg-white border border-cream-200 hover:bg-cream-50 rounded-xl transition shadow-xs"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-charcoal-500" />
            )}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          <Link
            to={`/admin/library/blogs/${blog.id}/edit`}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs hover:shadow-md"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Article</span>
          </Link>

          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-2 text-charcoal-400 hover:text-red-600 bg-white border border-cream-200 hover:bg-red-50 rounded-xl transition shadow-xs"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-saffron-50 text-saffron-700 border border-saffron-100">
                  {blog.category}
                </span>
                <StatusBadge status={blog.status} />
                {blog.isFeatured && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured Post
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-cream-100 text-charcoal-600">
                  {activeLang === "en" ? "Viewing English" : "हिन्दी प्रारूप"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 leading-tight">
                {currentTitle}
              </h1>

              {currentSubtitle && (
                <p className="text-base sm:text-lg text-charcoal-600 italic">
                  {currentSubtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-charcoal-500 pt-3 border-t border-cream-100">
                <div className="flex items-center gap-2 font-medium text-charcoal-800">
                  {blog.authorAvatar ? (
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-charcoal-700">
                      {blog.author?.charAt(0) || "V"}
                    </div>
                  )}
                  <span>{blog.author}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Draft"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  {blog.readTime || "5 min read"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-purple-600">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.viewsCount || 0} reads
                </span>
              </div>
            </div>

            {blog.featuredImage && (
              <div className="rounded-2xl overflow-hidden aspect-video border border-cream-200">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {currentExcerpt && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border-l-4 border-amber-400 text-charcoal-700 font-medium leading-relaxed">
                {currentExcerpt}
              </div>
            )}

            <div
              className="prose prose-saffron max-w-none text-charcoal-800 leading-relaxed font-sans pt-2"
              dangerouslySetInnerHTML={{
                __html:
                  currentContent ||
                  `<p><em>${activeLang === "en" ? "No English content available." : "हिन्दी सामग्री उपलब्ध नहीं है।"}</em></p>`,
              }}
            />

            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-cream-200 space-y-2">
                <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">
                  Topics & Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-cream-100 text-charcoal-700 hover:bg-cream-200 transition"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-charcoal-800">Article Overview</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Post Status:</span>
                <StatusBadge status={blog.status} />
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Category:</span>
                <span className="font-semibold text-charcoal-800">{blog.category}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Languages:</span>
                <span className="font-semibold text-emerald-700">
                  English {hasHindi ? "+ हिन्दी" : "(Hindi pending)"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Total Views:</span>
                <span className="font-semibold text-purple-600">{blog.viewsCount || 0}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Estimated Read:</span>
                <span className="font-semibold text-charcoal-800">{blog.readTime || "5 min read"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Created:</span>
                <span className="font-medium text-charcoal-700">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-charcoal-400">Last Updated:</span>
                <span className="font-medium text-charcoal-700">
                  {new Date(blog.updatedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-800 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-saffron-600" />
              <span>Public Web URL</span>
            </h3>
            <p className="text-xs text-charcoal-500">
              Devotees can read this article at:
            </p>
            <div className="p-2.5 rounded-xl bg-cream-50 font-mono text-xs text-charcoal-700 break-all border border-cream-200">
              /library/blogs/{blog.slug}
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 rounded-xl transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{copied ? "Copied to Clipboard!" : "Copy Full URL"}</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-800">SEO Settings</h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-charcoal-400 block mb-0.5">Meta Title (EN):</span>
                <p className="font-medium text-charcoal-800">
                  {blog.metaTitle || blog.title}
                </p>
              </div>

              {blog.metaTitleHi && (
                <div>
                  <span className="text-charcoal-400 block mb-0.5">मेटा शीर्षक (HI):</span>
                  <p className="font-medium text-charcoal-800">{blog.metaTitleHi}</p>
                </div>
              )}

              <div>
                <span className="text-charcoal-400 block mb-0.5">Meta Description (EN):</span>
                <p className="font-medium text-charcoal-700">
                  {blog.metaDescription || blog.excerpt || "Default library description"}
                </p>
              </div>

              {blog.metaDescriptionHi && (
                <div>
                  <span className="text-charcoal-400 block mb-0.5">मेटा विवरण (HI):</span>
                  <p className="font-medium text-charcoal-700">{blog.metaDescriptionHi}</p>
                </div>
              )}

              {blog.metaKeywords && blog.metaKeywords.length > 0 && (
                <div>
                  <span className="text-charcoal-400 block mb-1">Keywords:</span>
                  <div className="flex flex-wrap gap-1">
                    {blog.metaKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-cream-100 rounded text-[11px] text-charcoal-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to permanently delete "${blog.title}"?`}
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
        type="danger"
      />
    </div>
  );
}
