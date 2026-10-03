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
import PujaCategoryIcon from "@/components/PujaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import pujaCategoryAdminService, {
  AdminPujaCategory,
} from "@/services/pujaCategoryAdminService";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active Only", value: "true" },
  { label: "Inactive Only", value: "false" },
];

export default function PujaCategories() {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState<AdminPujaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Deactivation state
  const [deactivateTarget, setDeactivateTarget] =
    useState<AdminPujaCategory | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    setIsAuthError(false);
    setIsForbiddenError(false);

    try {
      const data = await pujaCategoryAdminService.getCategories({
        search,
        isActive: status,
      });
      setCategories(data);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = errorObj?.status;
      const msg = errorObj?.message || "Failed to load Puja categories.";

      if (status === 401) {
        setIsAuthError(true);
        setError("Your session has expired. Please sign in again.");
      } else if (status === 403) {
        setIsForbiddenError(true);
        setError("You do not have permission to manage Puja categories.");
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
      await pujaCategoryAdminService.deleteCategory(deactivateTarget.id);
      toast.success(
        `Category "${deactivateTarget.name}" deactivated successfully.`
      );
      setDeactivateTarget(null);
      await loadCategories();
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to deactivate Puja category.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reactivate
  const handleReactivate = async (category: AdminPujaCategory) => {
    setActionLoading(true);
    try {
      await pujaCategoryAdminService.updateCategory(category.id, {
        isActive: true,
      });
      toast.success(`Category "${category.name}" reactivated successfully.`);
      await loadCategories();
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to reactivate Puja category.";
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
        title="Puja Categories"
        subtitle="Organize, order, and control visibility of Puja traditions and categories."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadCategories()}
              className="btn-secondary flex items-center gap-1.5"
              title="Refresh list"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/admin/puja/categories/new"
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
                message="No Puja categories matched your search or status filter. Try clearing filters to view all categories."
                action={{
                  label: "Clear Filters",
                  onClick: handleClearFilters,
                }}
              />
            ) : (
              <EmptyState
                icon={FolderTree}
                title="No Puja Categories Found"
                message="No Puja categories have been configured yet. Create your first category to organize Puja services."
                action={{
                  label: "Create Category",
                  onClick: () => navigate("/admin/puja/categories/new"),
                }}
              />
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-50/70 border-b border-cream-200 text-xs uppercase font-semibold text-charcoal-500 tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3.5 hidden md:table-cell">
                    Description
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center">
                    Order
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-cream-50/50 transition-colors"
                  >
                    {/* Category column */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PujaCategoryIcon
                              iconName={cat.iconName}
                              className="w-5 h-5 text-saffron-600"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/puja/categories/${cat.id}`}
                            className="font-semibold text-charcoal-900 hover:text-saffron-600 transition block truncate"
                          >
                            {cat.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xs text-charcoal-500 bg-cream-100 px-1.5 py-0.5 rounded">
                              {cat.slug}
                            </span>
                            {cat.iconName && (
                              <span className="text-xs text-charcoal-400 hidden sm:inline">
                                • {cat.iconName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Description column */}
                    <td className="px-5 py-4 hidden md:table-cell max-w-xs text-charcoal-600">
                      <p className="line-clamp-2 text-xs leading-relaxed">
                        {cat.description || (
                          <span className="text-charcoal-300 italic">
                            No description provided
                          </span>
                        )}
                      </p>
                    </td>

                    {/* Order column */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-cream-100 text-charcoal-700">
                        #{cat.displayOrder}
                      </span>
                    </td>

                    {/* Status column */}
                    <td className="px-5 py-4 text-center">
                      <StatusBadge
                        status={cat.isActive ? "Active" : "Inactive"}
                      />
                    </td>

                    {/* Actions column */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/puja/categories/${cat.id}`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-700 transition"
                          title="View Category Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/puja/categories/${cat.id}/edit`}
                          className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-saffron-600 transition"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {cat.isActive ? (
                          <button
                            onClick={() => setDeactivateTarget(cat)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Deactivate Category"
                            disabled={actionLoading}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(cat)}
                            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-green-50 hover:text-green-600 transition"
                            title="Activate Category"
                            disabled={actionLoading}
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

      {/* Safety Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Puja Category"
        message={`Deactivate this Puja category (${deactivateTarget?.name})? Existing Puja services will not be deleted. The category will simply become inactive.`}
        confirmText="Deactivate Category"
        danger={true}
      />
    </div>
  );
}
