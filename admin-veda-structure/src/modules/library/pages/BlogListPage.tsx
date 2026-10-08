import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Sparkles,
  Clock,
  RefreshCw,
  Calendar,
  Globe,
  FileText,
  User,
  ArrowUpRight,
  Bookmark,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

import { blogService } from "../services/blog.service";
import BlogStatsCards from "../components/BlogStatsCards";
import BlogFilters from "../components/BlogFilters";
import type { BlogPost, BlogStatus } from "../types/blog.types";

export default function BlogListPage() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await blogService.getAdminBlogs({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        sort: sortBy,
        order: sortOrder,
      });

      setBlogs(res?.blogs || []);
      setTotalPages(res?.pagination?.totalPages || 1);
      setTotalCount(res?.pagination?.total || 0);
    } catch (err: any) {
      showError(err?.message || "Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await blogService.getBlogStats();
      setStats({
        totalBlogs: data?.totalBlogs || 0,
        publishedBlogs: data?.publishedBlogs || 0,
        draftBlogs: data?.draftBlogs || 0,
        totalViews: data?.totalViews || 0,
      });
    } catch (err) {
      console.warn("Could not fetch blog stats:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchBlogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusToggle = async (blog: BlogPost) => {
    const newStatus: BlogStatus = blog.status === "Published" ? "Draft" : "Published";
    try {
      await blogService.toggleBlogStatus(blog.id, newStatus);
      showSuccess(`Article status changed to ${newStatus}`);
      fetchBlogs();
      fetchStats();
    } catch (err: any) {
      showError(err?.message || "Failed to update article status");
    }
  };

  const handleFeaturedToggle = async (blog: BlogPost) => {
    try {
      await blogService.toggleBlogFeatured(blog.id, !blog.isFeatured);
      showSuccess(blog.isFeatured ? "Removed from featured articles" : "Marked as featured article");
      fetchBlogs();
    } catch (err: any) {
      showError(err?.message || "Failed to toggle featured status");
    }
  };

  const openDeleteDialog = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      await blogService.deleteBlog(blogToDelete.id);
      showSuccess("Article deleted successfully");
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      fetchBlogs();
      fetchStats();
    } catch (err: any) {
      showError(err?.message || "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Status Pill renderer matching strict specifications:
   * PUBLISHED in emerald, DRAFT in amber, ARCHIVED in gray, SCHEDULED in blue.
   */
  const renderStatusPill = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PUBLISHED
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            DRAFT
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            SCHEDULED
          </span>
        );
      case "Archived":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-charcoal-100 text-charcoal-600 border border-charcoal-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal-400" />
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader
        title="Veda Library Articles"
        subtitle="Curate, publish and manage sacred Vedic knowledge guides, rituals and wisdom articles."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchBlogs();
                fetchStats();
                showInfo("Article directory refreshed");
              }}
              className="p-2.5 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-xl hover:bg-cream-50 transition shadow-2xs hover:shadow-xs"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/admin/library/blogs/new"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-500 hover:to-saffron-600 rounded-xl transition shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </Link>
          </div>
        }
      />

      {/* Top Glassmorphic Stats Section */}
      <BlogStatsCards stats={stats} />

      {/* Filter and Search Bar */}
      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(f, o) => {
          setSortBy(f);
          setSortOrder(o);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content: Table or Cards View */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-cream-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">
              Retrieving Vedic knowledge library articles...
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-12 px-6">
            <EmptyState
              icon={<BookOpen className="w-12 h-12 text-saffron-500/80" />}
              title="No Vedic articles found"
              message="Begin curating sacred knowledge for devotees and seekers by creating your first article."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/admin/library/blogs/new")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write First Article</span>
                </button>
              }
            />
          </div>
        ) : viewMode === "grid" ? (
          /* =================== CARDS GRID VIEW =================== */
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group flex flex-col justify-between rounded-2xl border border-cream-200/90 bg-white hover:border-saffron-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div>
                    {/* Cover Thumbnail with Fallback */}
                    <div className="relative aspect-video w-full overflow-hidden bg-cream-100">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-cream-100 flex flex-col items-center justify-center text-saffron-600">
                          <BookOpen className="w-10 h-10 stroke-[1.5] text-saffron-500/60" />
                          <span className="text-[11px] font-semibold text-charcoal-400 mt-1">
                            Veda Library
                          </span>
                        </div>
                      )}

                      {/* Top Badges overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 backdrop-blur-md text-saffron-700 border border-cream-200/80 shadow-2xs">
                          {blog.category}
                        </span>
                        <div>{renderStatusPill(blog.status)}</div>
                      </div>

                      {blog.isFeatured && (
                        <div className="absolute bottom-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Info */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="space-y-1">
                        <Link
                          to={`/admin/library/blogs/${blog.id}`}
                          className="text-base font-bold text-charcoal-900 group-hover:text-saffron-600 transition line-clamp-2 leading-snug"
                        >
                          {blog.title}
                        </Link>
                        {blog.titleHi && (
                          <p className="text-xs text-charcoal-500 font-medium line-clamp-1">
                            🇮🇳 {blog.titleHi}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                        {blog.excerpt || "No summary provided for this article."}
                      </p>

                      <div className="text-[11px] font-mono text-charcoal-400 truncate flex items-center gap-1">
                        <Globe className="w-3 h-3 text-saffron-500 shrink-0" />
                        <span>/library/blogs/{blog.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Metadata and Quick Actions */}
                  <div className="px-4 py-3 bg-cream-50/50 border-t border-cream-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {blog.authorAvatar ? (
                        <img
                          src={blog.authorAvatar}
                          alt={blog.author}
                          className="w-6 h-6 rounded-full object-cover border border-cream-200"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-800 flex items-center justify-center font-bold text-[10px]">
                          {blog.author?.charAt(0) || "V"}
                        </div>
                      )}
                      <span className="font-semibold text-charcoal-700 truncate max-w-[90px]">
                        {blog.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mr-2">
                        <Eye className="w-3 h-3 text-charcoal-400" />
                        {blog.viewsCount || 0}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleFeaturedToggle(blog)}
                        title={blog.isFeatured ? "Unfeature" : "Make Featured"}
                        className={`p-1.5 rounded-lg transition ${
                          blog.isFeatured
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusToggle(blog)}
                        title={blog.status === "Published" ? "Switch to Draft" : "Publish Now"}
                        className={`p-1.5 rounded-lg transition ${
                          blog.status === "Published"
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-amber-600 hover:bg-amber-50"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        to={`/admin/library/blogs/${blog.id}`}
                        className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition"
                        title="View Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/admin/library/blogs/${blog.id}/edit`}
                        className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => openDeleteDialog(blog)}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* =================== REFINED TABLE VIEW =================== */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/60 text-[11px] uppercase tracking-wider text-charcoal-500 font-semibold select-none">
                  <th className="py-4 px-4 sm:px-6">Article Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Author</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Reads</th>
                  <th className="py-4 px-4">Published Date</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-sm">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-cream-50/50 transition-colors group"
                  >
                    {/* Article Details with Thumbnail, Title, Slug & Excerpt */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3.5 max-w-lg">
                        {/* Cover Image Thumbnail with Fallback */}
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover border border-cream-200 shrink-0 shadow-2xs group-hover:scale-102 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl bg-gradient-to-br from-amber-50 to-cream-100 border border-cream-200 flex flex-col items-center justify-center text-saffron-600 shrink-0 shadow-2xs">
                            <BookOpen className="w-5 h-5 text-saffron-500/70" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/admin/library/blogs/${blog.id}`}
                              className="font-bold text-charcoal-900 hover:text-saffron-600 transition line-clamp-1 text-sm sm:text-base"
                            >
                              {blog.title}
                            </Link>
                            {blog.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/60">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>

                          {blog.titleHi && (
                            <p className="text-xs text-charcoal-600 font-medium line-clamp-1 mt-0.5">
                              🇮🇳 {blog.titleHi}
                            </p>
                          )}

                          {blog.excerpt && !blog.titleHi && (
                            <p className="text-xs text-charcoal-500 line-clamp-1 mt-0.5">
                              {blog.excerpt}
                            </p>
                          )}

                          {/* Slug, Language and Read time */}
                          <div className="text-[11px] text-charcoal-400 mt-1 flex items-center gap-2 flex-wrap font-sans">
                            <span className="flex items-center gap-1 font-mono text-[10px] bg-cream-100 px-1.5 py-0.2 rounded border border-cream-200/60 text-charcoal-600">
                              /{blog.slug}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                EN
                              </span>
                              {blog.titleHi || blog.contentHi ? (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  HI
                                </span>
                              ) : null}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime || "5 min read"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200/60 shadow-2xs">
                        {blog.category}
                      </span>
                    </td>

                    {/* Author name & avatar */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {blog.authorAvatar ? (
                          <img
                            src={blog.authorAvatar}
                            alt={blog.author}
                            className="w-6 h-6 rounded-full object-cover border border-cream-200"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-saffron-100 flex items-center justify-center text-[10px] font-bold text-saffron-800 border border-saffron-200">
                            {blog.author?.charAt(0) || "V"}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-charcoal-700">
                          {blog.author}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {renderStatusPill(blog.status)}
                    </td>

                    {/* Reads Count */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs font-semibold text-charcoal-700">
                      <span className="flex items-center gap-1.5 text-charcoal-600 bg-cream-50 px-2 py-1 rounded-lg border border-cream-100 w-fit">
                        <Eye className="w-3.5 h-3.5 text-charcoal-400" />
                        {(blog.viewsCount || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-charcoal-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not published"}
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleFeaturedToggle(blog)}
                          title={blog.isFeatured ? "Unfeature" : "Make Featured"}
                          className={`p-1.5 rounded-lg transition ${
                            blog.isFeatured
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700"
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStatusToggle(blog)}
                          title={blog.status === "Published" ? "Switch to Draft" : "Publish Now"}
                          className={`p-1.5 rounded-lg transition ${
                            blog.status === "Published"
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/admin/library/blogs/${blog.id}`}
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
                          title="View Article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/library/blogs/${blog.id}/edit`}
                          className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openDeleteDialog(blog)}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {blogs.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t border-cream-200 bg-cream-50/30">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog Article"
        message={`Are you sure you want to permanently delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Permanently"}
        type="danger"
      />
    </div>
  );
}
