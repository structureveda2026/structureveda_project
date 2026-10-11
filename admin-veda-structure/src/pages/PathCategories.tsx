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
import PathCategoryIcon from "@/components/PathCategoryIcon";
import { useToast } from "@/context/ToastContext";
import pathCategoryAdminService, {
  AdminPathCategory,
} from "@/services/pathCategoryAdminService";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

export default function PathCategories() {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState<AdminPathCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] =
    useState<AdminPathCategory | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAuthError(false);
    setIsForbiddenError(false);

    try {
      const data = await pathCategoryAdminService.getCategories({
        search,
        isActive: status,
      });
      setCategories(data);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = errorObj?.status;
      const msg = errorObj?.message || "Failed to load Path categories.";

      if (status === 401) {
        setIsAuthError(true);
        setError("Your session has expired. Please sign in again.");
      } else if (status === 403) {
        setIsForbiddenError(true);
        setError("You do not have permission to manage Path categories.");
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
      await pathCategoryAdminService.deleteCategory(deactivateTarget.id);
      toast.success(
        `Category "${deactivateTarget.name}" deactivated successfully.`
      );
      setDeactivateTarget(null);
      await loadCategories();
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message ||
        `Failed to deactivate "${deactivateTarget.name}".`;
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reactivate Directly
  const handleReactivate = async (cat: AdminPathCategory) => {
    setActionLoading(true);
    try {
      await pathCategoryAdminService.updateCategory(cat.id, { isActive: true });
      toast.success(`Category "${cat.name}" reactivated successfully.`);
      await loadCategories();
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message || `Failed to reactivate "${cat.name}".`;
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Path Categories"
        subtitle="Manage Liturgical Categories for Vedic Scripture & Parayan Recitations, deity classifications, display order, and public visibility."
        actions={
          <Link
            to="/admin/path/categories/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Link>
        }
      />

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by category name or slug..."
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            value={status}
            onChange={setStatus}
            options={STATUS_FILTER_OPTIONS}
            label="Filter Status"
            hasAllOption={false}
          />
          <button
            onClick={loadCategories}
            className="p-2.5 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition cursor-pointer"
            title="Refresh Categories"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Categories Table View */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-charcoal-500">
              Loading Path categories...
            </p>
          </div>
        ) : isAuthError ? (
          <EmptyState
            icon={<AlertCircle className="w-10 h-10 text-red-500" />}
            title="Session Expired"
            message={error}
            action={
              <button
                onClick={() => navigate("/admin/login")}
                className="btn-primary flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            }
          />
        ) : isForbiddenError ? (
          <EmptyState
            icon={<AlertCircle className="w-10 h-10 text-amber-500" />}
            title="Access Restricted"
            message={error}
          />
        ) : error ? (
          <EmptyState
            icon={<AlertCircle className="w-10 h-10 text-red-400" />}
            title="Unable to Load Categories"
            message={error}
            action={
              <button
                onClick={loadCategories}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            }
          />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={<FolderTree className="w-10 h-10 text-saffron-300" />}
            title="No Categories Found"
            message={
              search || status
                ? "No Path categories match your current search and filter settings."
                : "No Path categories have been created yet."
            }
            action={
              <Link
                to="/admin/path/categories/new"
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Category
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-50/50 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-center">Display Order</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-cream-50/40 transition group"
                  >
                    {/* Category Name & Slug */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 flex-shrink-0">
                          <PathCategoryIcon
                            iconName={cat.iconName}
                            className="w-4 h-4 text-saffron-600"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/path/categories/${cat.id}`}
                            className="font-semibold text-charcoal-800 hover:text-saffron-600 transition block truncate"
                            title={cat.name}
                          >
                            {cat.name}
                          </Link>
                          <span className="text-[11px] font-mono text-charcoal-400 block truncate">
                            /{cat.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 max-w-sm">
                      <p className="text-xs text-charcoal-500 line-clamp-2">
                        {cat.description || (
                          <span className="italic text-charcoal-300">
                            No description provided
                          </span>
                        )}
                      </p>
                    </td>

                    {/* Display Order */}
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-cream-100 text-charcoal-600 font-mono">
                        {cat.displayOrder ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <StatusBadge
                        status={cat.isActive ? "active" : "inactive"}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/path/categories/${cat.id}`}
                          className="p-1.5 rounded-md text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-100 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/path/categories/${cat.id}/edit`}
                          className="p-1.5 rounded-md text-charcoal-400 hover:text-saffron-600 hover:bg-cream-100 transition"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {cat.isActive ? (
                          <button
                            type="button"
                            onClick={() => setDeactivateTarget(cat)}
                            className="p-1.5 rounded-md text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Deactivate Category"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleReactivate(cat)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-md text-charcoal-400 hover:text-green-600 hover:bg-green-50 transition cursor-pointer"
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

      {/* Confirmation Dialog for Soft Deactivation */}
      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        title="Deactivate Path Category?"
        message={`Are you sure you want to deactivate "${deactivateTarget?.name}"? It will be hidden from customer category discovery and filter dropdowns. Existing Path recitations assigned to this category will remain completely intact.`}
        confirmLabel="Deactivate Category"
        cancelLabel="Keep Active"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
}
