import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Edit,
  ExternalLink,
  LayoutGrid,
  LayoutList,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import {
  PUBLIC_LIBRARY_URL,
  resolveMediaUrl,
} from "@/services/mediaUploadService";
import libraryBranchService, {
  LibraryBranch,
} from "../services/libraryBranch.service";
import libraryMantraStotraService from "../services/libraryMantraStotra.service";
import {
  LibraryMantraStotra,
  MantraStotraStatus,
  MantraStotraType,
} from "../types/mantraStotra.types";

const ITEMS_PER_PAGE = 12;

type ViewMode = "grid" | "list";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  return fallback;
}

function parseTypeFilter(value: string | null): "" | MantraStotraType {
  if (value === "mantra" || value === "stotra") return value;
  return "";
}

function parseStatusFilter(
  value: string | null
): "ALL" | MantraStotraStatus {
  if (value === "ACTIVE" || value === "DRAFT" || value === "INACTIVE") {
    return value;
  }
  return "ALL";
}

function parsePositivePage(value: string | null): number {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 ? num : 1;
}

export default function MantraStotraListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError, showInfo } = useToast();
  const routeType = parseTypeFilter(searchParams.get("type"));
  const isTypeScoped = Boolean(routeType);

  const [typeFilter, setTypeFilter] = useState<"" | MantraStotraType>(() =>
    parseTypeFilter(searchParams.get("type"))
  );
  const [branchIdFilter, setBranchIdFilter] = useState<string>(
    () => searchParams.get("branchId") || ""
  );
  const [branchSlugFilter, setBranchSlugFilter] = useState<string>(
    () => searchParams.get("branchSlug") || ""
  );
  const [statusFilter, setStatusFilter] = useState<"ALL" | MantraStotraStatus>(
    () => parseStatusFilter(searchParams.get("status"))
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    () => searchParams.get("search") || ""
  );
  const [page, setPage] = useState<number>(() =>
    parsePositivePage(searchParams.get("page"))
  );

  const [items, setItems] = useState<LibraryMantraStotra[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] =
    useState<LibraryMantraStotra | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync external URL changes (e.g., navigating from Branches "View Items")
  useEffect(() => {
    const urlType = parseTypeFilter(searchParams.get("type"));
    const urlBranchId = searchParams.get("branchId") || "";
    const urlBranchSlug = searchParams.get("branchSlug") || "";
    const urlStatus = parseStatusFilter(searchParams.get("status"));
    const urlSearch = searchParams.get("search") || "";
    const urlPage = parsePositivePage(searchParams.get("page"));

    setTypeFilter(urlType);
    setBranchIdFilter(urlBranchId);
    setBranchSlugFilter(urlBranchSlug);
    setStatusFilter(urlStatus);
    setSearchQuery(urlSearch);
    setDebouncedSearch(urlSearch);
    setPage(urlPage);
  }, [searchParams]);

  // 300ms debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== searchQuery) {
          setPage(1);
        }
        return searchQuery;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync filter state back to URL query params
  useEffect(() => {
    const next = new URLSearchParams();
    if (typeFilter) next.set("type", typeFilter);
    if (branchIdFilter) next.set("branchId", branchIdFilter);
    if (branchSlugFilter) next.set("branchSlug", branchSlugFilter);
    if (statusFilter !== "ALL") next.set("status", statusFilter);
    if (debouncedSearch.trim()) next.set("search", debouncedSearch.trim());
    if (page > 1) next.set("page", String(page));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [
    typeFilter,
    branchIdFilter,
    branchSlugFilter,
    statusFilter,
    debouncedSearch,
    page,
    searchParams,
    setSearchParams,
  ]);

  // Load branches for dropdown and active filter chip
  useEffect(() => {
    let active = true;
    libraryBranchService
      .getBranches(typeFilter || "mantra-stotra")
      .then((list) => {
        if (active) setBranches(list);
      })
      .catch(() => {
        if (active) setBranches([]);
      });
    return () => {
      active = false;
    };
  }, [typeFilter]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await libraryMantraStotraService.getItems({
        type: typeFilter || undefined,
        branchId: branchIdFilter || undefined,
        branchSlug:
          !branchIdFilter && branchSlugFilter ? branchSlugFilter : undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: debouncedSearch.trim() || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });

      setItems(response.items || []);
      setTotalItems(response.pagination?.total ?? response.items.length);
      setTotalPages(Math.max(1, response.pagination?.pages ?? 1));
      setBrokenImages({});
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to load Mantra & Stotra items."
      );
      setLoadError(message);
      setItems([]);
      setTotalItems(0);
      setTotalPages(1);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    typeFilter,
    branchIdFilter,
    branchSlugFilter,
    statusFilter,
    debouncedSearch,
    page,
    showError,
  ]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleTypeChange = (nextType: "" | MantraStotraType) => {
    if (isTypeScoped) return;
    setTypeFilter(nextType);
    setBranchIdFilter("");
    setBranchSlugFilter("");
    setPage(1);
  };

  const handleBranchSelect = (selectedId: string) => {
    setBranchIdFilter(selectedId);
    const matched = branches.find((b) => b.id === selectedId);
    setBranchSlugFilter(matched?.slug || "");
    setPage(1);
  };

  const clearBranchFilter = () => {
    setBranchIdFilter("");
    setBranchSlugFilter("");
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setTypeFilter(routeType);
    setBranchIdFilter("");
    setBranchSlugFilter("");
    setStatusFilter("ALL");
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await libraryMantraStotraService.deleteItem(deleteTarget.id);
      showSuccess("Item deleted successfully.");
      setDeleteTarget(null);
      if (items.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      } else {
        await fetchItems();
      }
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to delete item."));
    } finally {
      setIsDeleting(false);
    }
  };

  const activeBranchObj = branches.find(
    (b) =>
      (branchIdFilter && b.id === branchIdFilter) ||
      (branchSlugFilter && b.slug === branchSlugFilter)
  );

  const activeOnPage = items.filter((item) => item.status === "ACTIVE").length;
  const featuredOnPage = items.filter((item) => item.isFeatured).length;
  const multiVerseOnPage = items.filter(
    (item) => Array.isArray(item.verses) && item.verses.length > 0
  ).length;

  const hasActiveFilters = Boolean(
    typeFilter ||
      branchIdFilter ||
      branchSlugFilter ||
      statusFilter !== "ALL" ||
      debouncedSearch.trim()
  );

  const uploadUrl = `/admin/library/mantra-stotra-upload${
    typeFilter || branchIdFilter
      ? `?${new URLSearchParams({
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(branchIdFilter ? { branchId: branchIdFilter, step: "2" } : {}),
        }).toString()}`
      : ""
  }`;

  const branchesManageUrl =
    typeFilter === "stotra"
      ? "/admin/library/stotra-branches"
      : "/admin/library/mantra-branches";

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title={typeFilter === "mantra" ? "Mantra Items" : typeFilter === "stotra" ? "Stotra Items" : "Mantra & Stotra Items"}
        subtitle={typeFilter === "mantra" ? "Manage Mantras and Suktas across deity branches." : typeFilter === "stotra" ? "Manage Stotras across deity branches." : "Manage published Mantras, Suktas, and Stotras across deity branches."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchItems();
                showInfo("Items list refreshed.");
              }}
              className="p-2 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-lg hover:bg-cream-50 transition shadow-2xs"
              title="Refresh items"
              aria-label="Refresh items"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {/* View toggle */}
            <div className="flex items-center bg-white border border-cream-200 rounded-lg shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${
                  viewMode === "grid"
                    ? "bg-saffron-50 text-saffron-700"
                    : "text-charcoal-400 hover:bg-cream-50"
                }`}
                title="Card View"
                aria-label="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${
                  viewMode === "list"
                    ? "bg-saffron-50 text-saffron-700"
                    : "text-charcoal-400 hover:bg-cream-50"
                }`}
                title="List View"
                aria-label="List view"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
            </div>
            <Link
              to={branchesManageUrl}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-charcoal-700 bg-white hover:bg-cream-50 border border-cream-200 rounded-lg transition"
            >
              <Layers className="w-3.5 h-3.5 text-saffron-600" />
              <span>Manage Branches</span>
            </Link>
            <Link
              to={uploadUrl}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-500 hover:to-saffron-600 rounded-lg transition shadow-xs hover:shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Content</span>
            </Link>
          </div>
        }
      />

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-600 border border-saffron-200 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-charcoal-900 leading-tight">
              {totalItems}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              Total Items
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-emerald-700 leading-tight">
              {activeOnPage}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              Active on Page
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-amber-700 leading-tight">
              {featuredOnPage}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              Featured on Page
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-blue-700 leading-tight">
              {multiVerseOnPage}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">
              Multi-Verse Items
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-cream-200/90 shadow-2xs p-3 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Type Switcher Pills */}
          {!isTypeScoped && <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleTypeChange("")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === ""
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("mantra")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === "mantra"
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
              }`}
            >
              Mantras
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("stotra")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === "stotra"
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
              }`}
            >
              Stotras
            </button>
          </div>}

          {/* Search + Dropdown Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 lg:max-w-3xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, Sanskrit text, deity, or slug..."
                className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm bg-cream-50/40 border border-cream-200 rounded-lg focus:bg-white focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all placeholder:text-charcoal-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={activeBranchObj?.id || branchIdFilter}
              onChange={(e) => handleBranchSelect(e.target.value)}
              aria-label="Filter by branch"
              className="px-3 py-1.5 text-xs font-medium bg-cream-50/40 border border-cream-200 rounded-lg focus:bg-white focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 text-charcoal-700"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.enName || branch.name} ({branch.categorySlug})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  parseStatusFilter(e.target.value)
                );
                setPage(1);
              }}
              aria-label="Filter by status"
              className="px-3 py-1.5 text-xs font-medium bg-cream-50/40 border border-cream-200 rounded-lg focus:bg-white focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 text-charcoal-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Active Branch Filter Chip */}
        {(branchIdFilter || branchSlugFilter) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream-100">
            <span className="text-[11px] font-semibold text-charcoal-500">
              Active Filter:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
              <span>
                Branch:{" "}
                {activeBranchObj?.enName ||
                  activeBranchObj?.name ||
                  branchSlugFilter ||
                  branchIdFilter}
              </span>
              <button
                type="button"
                onClick={clearBranchFilter}
                className="text-saffron-600 hover:text-saffron-900"
                aria-label="Clear branch filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-xs font-medium text-charcoal-500 hover:text-saffron-700 underline ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Items Table / States */}
      {isLoading ? (
        <div className="p-12 text-center text-charcoal-500 bg-white rounded-2xl border border-cream-200">
          <div className="w-7 h-7 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">
            Loading Mantra & Stotra items...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-xs">
          <EmptyState
            icon={BookOpen}
            title={
              loadError
                ? "Unable to load Mantra & Stotra items"
                : hasActiveFilters
                ? "No matching items found"
                : "No Mantra or Stotra items yet"
            }
            message={
              loadError
                ? loadError
                : hasActiveFilters
                ? "Try clearing your branch, status, or search filters to view more items."
                : "Use the Guided Upload Wizard to publish your first Mantra, Sukta, or Stotra."
            }
            action={
              loadError ? (
                <button
                  type="button"
                  onClick={fetchItems}
                  className="btn-primary inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              ) : hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to={uploadUrl}
                  className="btn-primary inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Content</span>
                </Link>
              )
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-xs overflow-hidden">
          {/* ───── GRID / CARD VIEW ───── */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {items.map((item) => {
                const thumbUrl = resolveMediaUrl(
                  item.featuredImage || item.branch?.imageKey
                );
                const showThumb =
                  Boolean(thumbUrl) && !brokenImages[item.id];
                const publicPreviewUrl = `${PUBLIC_LIBRARY_URL}/library/mantra-stotra/item/${encodeURIComponent(
                  item.slug
                )}`;
                const editUrl = `/admin/library/mantra-stotra-upload/edit/${encodeURIComponent(
                  item.id
                )}?${new URLSearchParams({
                  type: item.type,
                  ...(item.branchId ? { branchId: item.branchId } : {}),
                  returnTo: "items",
                }).toString()}`;
                const branchLabel =
                  item.branch?.enName ||
                  item.branch?.name ||
                  item.branchSlug ||
                  "—";
                const verseCount = Array.isArray(item.verses)
                  ? item.verses.length
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-cream-200 bg-cream-50/40 hover:bg-white hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-saffron-50 flex items-center justify-center overflow-hidden">
                      {showThumb ? (
                        <img
                          src={thumbUrl}
                          alt={item.title}
                          onError={() =>
                            setBrokenImages((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-10 h-10 text-saffron-300" />
                      )}
                      {/* Type badge overlay */}
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          item.type === "stotra"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-saffron-50 text-saffron-800 border-saffron-200"
                        }`}
                      >
                        {item.type === "stotra" ? "Stotra" : "Mantra"}
                      </span>
                      {item.isFeatured && (
                        <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      )}
                      {/* Status dot */}
                      <span
                        className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "DRAFT"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-charcoal-100 text-charcoal-600 border-charcoal-200"
                        }`}
                      >
                        {item.status === "ACTIVE"
                          ? "Active"
                          : item.status === "DRAFT"
                          ? "Draft"
                          : "Inactive"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-3 flex flex-col flex-1 gap-1.5">
                      <Link
                        to={editUrl}
                        className="font-bold text-sm text-charcoal-900 hover:text-saffron-700 transition line-clamp-2 leading-snug"
                      >
                        {item.title}
                      </Link>
                      {item.titleHi && (
                        <p className="text-xs text-charcoal-500 font-devanagari line-clamp-1">
                          {item.titleHi}
                        </p>
                      )}
                      <p className="text-[11px] text-charcoal-400 truncate">
                        {branchLabel}
                        {item.deity ? ` · ${item.deity}` : ""}
                      </p>
                      {verseCount > 0 && (
                        <span className="inline-block w-fit px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {verseCount} {verseCount === 1 ? "verse" : "verses"}
                        </span>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-3 py-2 border-t border-cream-100 flex items-center justify-end gap-1">
                      <a
                        href={publicPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-charcoal-500 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                        title="View in Public Library"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        to={editUrl}
                        className="p-1.5 text-charcoal-500 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                        title="Edit Item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ───── LIST / TABLE VIEW ───── */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream-50/80 border-b border-cream-200 text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Type & Branch</th>
                    <th className="px-4 py-3">Languages & Verses</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 text-sm">
                  {items.map((item) => {
                    const thumbUrl = resolveMediaUrl(
                      item.featuredImage || item.branch?.imageKey
                    );
                    const showThumb =
                      Boolean(thumbUrl) && !brokenImages[item.id];
                    const publicPreviewUrl = `${PUBLIC_LIBRARY_URL}/library/mantra-stotra/item/${encodeURIComponent(
                      item.slug
                    )}`;
                    const editUrl = `/admin/library/mantra-stotra-upload/edit/${encodeURIComponent(
                      item.id
                    )}?${new URLSearchParams({
                      type: item.type,
                      ...(item.branchId ? { branchId: item.branchId } : {}),
                      returnTo: "items",
                    }).toString()}`;
                    const branchLabel =
                      item.branch?.enName ||
                      item.branch?.name ||
                      item.branchSlug ||
                      "—";
                    const verseCount = Array.isArray(item.verses)
                      ? item.verses.length
                      : 0;
                    const hasHindi = Boolean(item.hindiTranslation?.trim());
                    const hasEnglish = Boolean(item.englishTranslation?.trim());
                    const hasHinglish = Boolean(
                      item.hinglishTranslation?.trim()
                    );

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-cream-50/50 transition-colors"
                      >
                        {/* Item */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-start gap-3 min-w-[230px]">
                            {showThumb ? (
                              <img
                                src={thumbUrl}
                                alt={item.title}
                                onError={() =>
                                  setBrokenImages((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }))
                                }
                                className="w-11 h-11 rounded-xl object-cover border border-cream-200 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-saffron-50 text-saffron-600 border border-saffron-200 flex items-center justify-center shrink-0">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Link
                                  to={editUrl}
                                  className="font-bold text-charcoal-900 hover:text-saffron-700 transition line-clamp-1"
                                >
                                  {item.title}
                                </Link>
                                {item.isFeatured && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              {item.titleHi && (
                                <p className="text-xs text-charcoal-500 font-devanagari line-clamp-1 mt-0.5">
                                  {item.titleHi}
                                </p>
                              )}
                              <p className="text-[11px] font-mono text-charcoal-400 truncate mt-0.5">
                                /{item.type}/{item.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type & Branch */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1 min-w-[150px]">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                item.type === "stotra"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-saffron-50 text-saffron-800 border-saffron-200"
                              }`}
                            >
                              {item.type === "stotra" ? "Stotra" : "Mantra"}
                            </span>
                            <div className="text-xs font-semibold text-charcoal-800">
                              {branchLabel}
                            </div>
                            {item.deity && (
                              <div className="text-[11px] text-charcoal-500">
                                Deity: {item.deity}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Languages & Verses */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1.5 min-w-[140px]">
                            <div className="flex flex-wrap items-center gap-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  hasHindi
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-cream-100 text-charcoal-400 border-cream-200"
                                }`}
                                title={
                                  hasHindi
                                    ? "Hindi meaning available"
                                    : "Hindi meaning missing"
                                }
                              >
                                HI
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  hasEnglish
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-cream-100 text-charcoal-400 border-cream-200"
                                }`}
                                title={
                                  hasEnglish
                                    ? "English meaning available"
                                    : "English meaning missing"
                                }
                              >
                                EN
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  hasHinglish
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-cream-100 text-charcoal-400 border-cream-200"
                                }`}
                                title={
                                  hasHinglish
                                    ? "Hinglish meaning available"
                                    : "Hinglish meaning missing"
                                }
                              >
                                HG
                              </span>
                            </div>
                            {verseCount > 0 && (
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {verseCount} {verseCount === 1 ? "verse" : "verses"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 align-top">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              item.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "DRAFT"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-charcoal-100 text-charcoal-600 border-charcoal-200"
                            }`}
                          >
                            {item.status === "ACTIVE"
                              ? "Active"
                              : item.status === "DRAFT"
                              ? "Draft"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 align-top text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <a
                              href={publicPreviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-charcoal-500 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                              title="View in Public Library"
                              aria-label={`View ${item.title} in Public Library`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                              to={editUrl}
                              className="p-1.5 text-charcoal-500 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                              title="Edit Item"
                              aria-label={`Edit ${item.title}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Item"
                              aria-label={`Delete ${item.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => setPage(nextPage)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Item"
        cancelText="Cancel"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
