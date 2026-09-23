import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Sparkles,
  Clock,
  RefreshCw,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
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

      setBlogs(res.blogs);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
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
        totalBlogs: data.totalBlogs,
        publishedBlogs: data.publishedBlogs,
        draftBlogs: data.draftBlogs,
        totalViews: data.totalViews,
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
      showSuccess(`Blog post marked as ${newStatus}`);
      fetchBlogs();
      fetchStats();
    } catch (err: any) {
      showError(err?.message || "Failed to update blog status");
    }
  };

  const handleFeaturedToggle = async (blog: BlogPost) => {
    try {
      await blogService.toggleBlogFeatured(blog.id, !blog.isFeatured);
      showSuccess(blog.isFeatured ? "Removed from featured posts" : "Marked as featured post");
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
      showSuccess("Blog post deleted successfully");
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      fetchBlogs();
      fetchStats();
    } catch (err: any) {
      showError(err?.message || "Failed to delete blog post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Veda Library - Blog Posts"
        subtitle="Create, edit and manage articles and wisdom guides for the Veda Library."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchBlogs();
                fetchStats();
                showInfo("Blog list refreshed");
              }}
              className="p-2.5 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-xl hover:bg-cream-50 transition shadow-xs"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/admin/library/blogs/new"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Blog Post</span>
            </Link>
          </div>
        }
      />

      <BlogStatsCards stats={stats} />

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
      />

      <div className="bg-white rounded-2xl border border-cream-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">Loading Veda Library posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No blog posts found"
            description="Start building your knowledge library by creating your first Vedic article."
            action={{
              label: "Create First Blog Post",
              onClick: () => navigate("/admin/library/blogs/new"),
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/50 text-[11px] uppercase tracking-wider text-charcoal-500 font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Article Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Reads</th>
                  <th className="py-3.5 px-4">Published Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-sm">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-cream-50/40 transition group"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3 max-w-md">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg object-cover border border-cream-200 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                            <BookOpen className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/admin/library/blogs/${blog.id}`}
                              className="font-semibold text-charcoal-900 hover:text-saffron-600 transition line-clamp-1"
                            >
                              {blog.title}
                            </Link>
                            {blog.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                <Sparkles className="w-3 h-3" />
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
                          <div className="text-[11px] text-charcoal-400 mt-1 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                EN
                              </span>
                              {blog.titleHi || blog.contentHi ? (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  HI
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-cream-100 text-charcoal-400">
                                  HI -
                                </span>
                              )}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[120px]">/{blog.slug}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime || "5 min read"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-saffron-50 text-saffron-700 border border-saffron-100">
                        {blog.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
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
                        <span className="text-xs font-medium text-charcoal-700">
                          {blog.author}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={blog.status} />
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-charcoal-700">
                      <span className="flex items-center gap-1 text-charcoal-600">
                        <Eye className="w-3.5 h-3.5 text-charcoal-400" />
                        {blog.viewsCount || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-charcoal-500">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not published"}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
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
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/admin/library/blogs/${blog.id}`}
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/library/blogs/${blog.id}/edit`}
                          className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 rounded-lg transition"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(blog)}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Post"
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

        {blogs.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t border-cream-200">
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
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Post"}
        type="danger"
      />
    </div>
  );
}
