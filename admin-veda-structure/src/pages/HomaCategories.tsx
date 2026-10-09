import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Power,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  AlertCircle,
  LogIn,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import HomaCategoryIcon from "@/components/HomaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import homaCategoryAdminService, {
  AdminHomaCategory,
} from "@/services/homaCategoryAdminService";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

export default function HomaCategories() {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState<AdminHomaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] =
    useState<AdminHomaCategory | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAuthError(false);
    setIsForbiddenError(false);

    try {
      const data = await homaCategoryAdminService.getCategories({
        search,
        isActive: status,
      });
      setCategories(data);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = errorObj?.status;
      const msg = errorObj?.message || "Failed to load Homa categories.";

      if (status === 401) {
        setIsAuthError(true);
        setError("Your session has expired. Please sign in again.");
      } else if (status === 403) {
        setIsForbiddenError(true);
        setError("You do not have permission to manage Homa categories.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadCategories]);

  // Handle Deactivate Confirm
  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;
    setActionLoading(true);
    try {
      await homaCategoryAdminService.deleteCategory(deactivateTarget.id);
      toast.success(
        `Category "${deactivateTarget.name}" deactivated successfully.`
      );
      setDeactivateTarget(null);
      await loadCategories();
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to deactivate Homa category.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reactivate
  const handleReactivate = async (category: AdminHomaCategory) => {
    setActionLoading(true);
    try {
      await homaCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      await loadCategories();
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to reactivate Homa category.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
  };

  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homa Categories"
        subtitle="Organize, order, and control visibility of Vedic Homa / Havan fire sacrifice traditions and categories."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadCategories()}
              className="btn-secondary flex items-center gap-1.5 cursor-pointer"
              title="Refresh list"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/admin/homa/categories/new"
              className="btn-primary flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </Link>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8 md:col-span-9">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search categories by name, slug, or description..."
            />
          </div>
          <div className="sm:col-span-4 md:col-span-3">
            <FilterDropdown
              value={status}
              onChange={setStatus}
              options={STATUS_FILTER_OPTIONS}
              label="All Statuses"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div className="card p-6 border-red-200 bg-red-50 text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">
                {isForbiddenError
                  ? "Access Denied"
                  : isAuthError
                  ? "Authentication Required"
                  : "Error Loading Categories"}
              </h3>
              <p className="text-sm mt-1 text-red-700">{error}</p>
              {isAuthError && (
                <button
                  onClick={() => navigate("/admin/login")}
                  className="btn-primary mt-3 inline-flex items-center gap-2 text-xs py-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" /> Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-cream-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-cream-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-200 rounded w-1/3" />
                  <div className="h-3 bg-cream-200 rounded w-1/2" />
                </div>
                <div className="w-16 h-6 bg-cream-200 rounded-full" />
                <div className="w-20 h-6 bg-cream-200 rounded-full" />
                <div className="w-24 h-8 bg-cream-200 rounded" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8">
            {hasActiveFilters ? (
              <EmptyState
                icon={FolderTree}
                title="No Categories Match Your Search"
                message="No Homa categories matched your search or status filter. Try clearing filters to view all categories."
                action={{
                  label: "Clear Filters",
                  onClick: handleClearFilters,
                }}
              />
            ) : (
              <EmptyState
                icon={FolderTree}
                title="No Homa Categories Found"
                message="No Homa categories exist in the system yet. Create the first category to start organizing Vedic Homa rituals."
                action={{
                  label: "Create Category",
                  to: "/admin/homa/categories/new",
                }}
              />
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/70 text-charcoal-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">Icon</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4 hidden md:table-cell">Slug</th>
                  <th className="py-3 px-4 hidden lg:table-cell max-w-xs">
                    Description
                  </th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-cream-50/50 transition-colors group"
                  >
                    {/* Icon / Avatar */}
                    <td className="py-3 px-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center mx-auto text-saffron-600 shadow-xs">
                        <HomaCategoryIcon
                          iconName={cat.iconName}
                          className="w-5 h-5 text-saffron-600"
                        />
                      </div>
                    </td>

                    {/* Name + Mobile Subtitle */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/admin/homa/categories/${cat.id}`}
                          className="font-medium text-charcoal-900 group-hover:text-saffron-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <span className="text-xs font-mono text-charcoal-400 md:hidden mt-0.5">
                          {cat.slug}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4 hidden md:table-cell font-mono text-xs text-charcoal-500">
                      {cat.slug}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 hidden lg:table-cell max-w-xs text-xs text-charcoal-600 truncate">
                      {cat.description || (
                        <span className="italic text-charcoal-400">
                          No description provided
                        </span>
                      )}
                    </td>

                    {/* Display Order */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-charcoal-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-cream-100 text-charcoal-700 font-semibold">
                        {cat.displayOrder ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <StatusBadge
                        status={cat.isActive ? "active" : "inactive"}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/homa/categories/${cat.id}`}
                          className="p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/homa/categories/${cat.id}/edit`}
                          className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {cat.isActive ? (
                          <button
                            type="button"
                            onClick={() => setDeactivateTarget(cat)}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Deactivate Category"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReactivate(cat)}
                            className="p-1.5 text-charcoal-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition cursor-pointer"
                            title="Reactivate Category"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deactivateTarget)}
        title="Deactivate Category"
        message={
          deactivateTarget
            ? `Are you sure you want to deactivate "${deactivateTarget.name}"? This category will be hidden from customer category discovery and public listings. Existing Homa services will remain associated in the database.`
            : ""
        }
        confirmLabel={actionLoading ? "Deactivating..." : "Deactivate"}
        cancelLabel="Cancel"
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateTarget(null)}
        variant="danger"
      />
    </div>
  );
}
