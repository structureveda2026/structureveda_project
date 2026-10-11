import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import pathCatalogueService from "../services/pathCatalogueService";
import PathServiceCard from "../components/PathServiceCard";
import PathPanditTeamSection from "../components/PathPanditTeamSection";
import PathChapterStructureSection from "../components/PathChapterStructureSection";
import PathKashiSection from "../components/PathKashiSection";
import PathFaqSection from "../components/PathFaqSection";
import PathFinalCta from "../components/PathFinalCta";
import {
  Sparkles,
  RefreshCw,
  ChevronRight as BreadcrumbChevron,
  ArrowRight,
  FolderX,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

import defaultPathImg from "../../../assets/images/c-gita.jpg";
import gitaImg from "../../../assets/images/c-gita.jpg";
import rudrakshaImg from "../../../assets/images/p-rudraksha.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";

// Canonical fallback images per category slug if category.image is null
const CATEGORY_SLUG_IMAGES = {
  "ramayana-manas-path": rudrakshaImg,
  "shiva-rudri-path": pujaRudrabhishekImg,
  "durga-shakta-path": pujaLakshmiImg,
  "bhagavad-gita-scripture": gitaImg,
  "vishnu-suktam-path": pujaVishnuImg,
  "lakshmi-stotra-path": pujaLakshmiImg,
  "surya-solar-path": pujaNavagrahaImg,
};

const FORMAT_OPTIONS = [
  { label: "All Formats", value: "All" },
  { label: "Single Session", value: "single_session" },
  { label: "Same-Day", value: "same_day" },
  { label: "Multi-Day", value: "multi_day" },
  { label: "Custom Request", value: "custom_request" },
];

const DAYS_OPTIONS = [
  { label: "All Durations", value: "All" },
  { label: "1 Day", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "9 Days", value: 9 },
];

const MODE_OPTIONS = [
  { label: "All Locations", value: "All" },
  { label: "Kashi Shrines", value: "kashi" },
  { label: "Remote Recitation", value: "remote" },
];

const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const PAGE_SIZE = 6;

/**
 * PathCategoryListing Page
 * Dedicated customer category listing page for Vedic Path & Scripture Recitation traditions.
 * Route: /yagya-puja/path/category/:categorySlug
 */
const PathCategoryListing = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Category state
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Purpose options loaded from backend
  const [purposes, setPurposes] = useState([]);

  // Retry trigger for reload actions
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // URL search parameter states
  const currentSearch = searchParams.get("search") || "";
  const currentPurpose = searchParams.get("purpose") || "All";
  const currentFormat = searchParams.get("format") || "All";
  const currentDays = searchParams.get("days") || "All";
  const currentMode = searchParams.get("mode") || "All";
  const currentSort = searchParams.get("sortBy") || "featured";
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;

  // Local search input for responsive typing
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setSearchInput(currentSearch);
  }

  // Dynamic category image source with fallback
  const categoryImageSrc =
    category?.image ||
    (category?.slug ? CATEGORY_SLUG_IMAGES[category.slug] : null) ||
    defaultPathImg;

  // Load available Path purposes for filter dropdown
  useEffect(() => {
    let isMounted = true;
    pathCatalogueService
      .getPathPurposes()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPurposes(data);
        }
      })
      .catch((err) => {
        console.error("Could not load Path purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Category info from API
  useEffect(() => {
    let isMounted = true;

    pathCatalogueService
      .getPathCategoryBySlug(categorySlug)
      .then((catData) => {
        if (!isMounted) return;
        if (!catData || catData.isActive === false) {
          setCategoryNotFound(true);
          setCategory(null);
        } else {
          setCategory(catData);
          setCategoryNotFound(false);
          setCategoryError(null);
        }
        setCategoryLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(`Error loading category ${categorySlug}:`, err);
        if (err.response?.status === 404) {
          setCategoryNotFound(true);
        } else {
          setCategoryError("Unable to load category information.");
        }
        setCategoryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categorySlug, reloadTrigger]);

  // Dynamic SEO metadata
  useEffect(() => {
    if (category?.name) {
      document.title = `${category.name} | Vedic Path & Recitations | Veda Structure`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && category.description) {
        metaDesc.setAttribute("content", category.description);
      }
    } else if (categoryNotFound) {
      document.title = "Path Category Not Found • Veda Structure";
    } else {
      document.title = "Vedic Path & Scripture Category • Veda Structure";
    }
  }, [category, categoryNotFound]);

  // Helper to synchronize query params safely
  const updateParams = useCallback(
    (newParams) => {
      setServicesLoading(true);
      const merged = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([k, v]) => {
        if (
          v === null ||
          v === undefined ||
          v === "" ||
          v === "All" ||
          v === "All Purposes" ||
          v === "All Formats" ||
          v === "All Durations" ||
          v === "All Locations" ||
          (k === "page" && v === 1) ||
          (k === "sortBy" && v === "featured")
        ) {
          merged.delete(k);
        } else {
          merged.set(k, String(v));
        }
      });
      setSearchParams(merged, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentSearch.trim() !== "") count++;
    if (currentPurpose !== "All" && currentPurpose !== "All Purposes") count++;
    if (currentFormat !== "All" && currentFormat !== "All Formats") count++;
    if (currentDays !== "All" && currentDays !== "All Durations") count++;
    if (currentMode !== "All" && currentMode !== "All Locations") count++;
    if (currentSort !== "featured") count++;
    return count;
  }, [currentSearch, currentPurpose, currentFormat, currentDays, currentMode, currentSort]);

  // Reset filters handler (retaining current category context)
  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    updateParams({
      search: "",
      purpose: "All",
      format: "All",
      days: "All",
      mode: "All",
      sortBy: "featured",
      page: 1,
    });
  }, [updateParams]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
      updateParams({ page: newPage });
      const el = document.getElementById("category-services-grid");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [currentPage, totalPages, updateParams]
  );

  // Search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  // Fetch services for this category with filters
  useEffect(() => {
    let isMounted = true;
    if (!categorySlug) return;

    const filterParams = {
      category: categorySlug,
      search: currentSearch.trim() || undefined,
      purpose:
        currentPurpose !== "All" && currentPurpose !== "All Purposes"
          ? currentPurpose
          : undefined,
      format:
        currentFormat !== "All" && currentFormat !== "All Formats"
          ? currentFormat
          : undefined,
      days:
        currentDays !== "All" && currentDays !== "All Durations"
          ? parseInt(currentDays, 10)
          : undefined,
      mode:
        currentMode !== "All" && currentMode !== "All Locations"
          ? currentMode
          : undefined,
      sortBy: currentSort,
      page: currentPage,
      limit: PAGE_SIZE,
    };

    pathCatalogueService
      .getPathServices(filterParams)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.services)) {
          setServices(res.services);
          setTotalCount(res.total ?? res.services.length);
          setTotalPages(res.totalPages || Math.ceil((res.total ?? res.services.length) / PAGE_SIZE) || 1);
        } else {
          setServices([]);
          setTotalCount(0);
          setTotalPages(1);
        }
        setServicesLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching services for category:", err);
        setServicesError("Failed to load recitations for this category.");
        setServicesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    categorySlug,
    currentSearch,
    currentPurpose,
    currentFormat,
    currentDays,
    currentMode,
    currentSort,
    currentPage,
    reloadTrigger,
  ]);

  // Scroll to grid helper
  const scrollToGrid = () => {
    const el = document.getElementById("category-services-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ── 404 / NOT FOUND STATE ──
  if (!categoryLoading && categoryNotFound) {
    return (
      <div className="min-h-screen bg-[#faf4e6] text-[#2b241d] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f2e2cb] text-[#b36c1e]">
            <FolderX size={40} aria-hidden="true" />
          </div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            Recitation Tradition Notice
          </span>
          <h1 className="mt-2 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[36px]">
            Path Category Not Found
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#685c4f]">
            The requested scripture recitation category does not exist, has been retired, or the address may be mistyped.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/yagya-puja/path"
              className="inline-flex items-center gap-2 rounded-full bg-[#c77722] px-6 py-3 text-[13.5px] font-bold text-white shadow-sm transition hover:bg-[#b06519] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
            >
              <span>Return to Path Catalogue</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── CATEGORY API ERROR STATE ──
  if (!categoryLoading && categoryError) {
    return (
      <main className="min-h-screen bg-[#faf4e6] text-[#2b241d] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fcedd2] text-[#c77722]">
            <RefreshCw size={28} />
          </div>
          <h1 className="mt-5 font-serif text-[28px] font-bold text-[#2b241d]">
            Unable to Load Path Category
          </h1>
          <p className="mt-2 text-[14.5px] text-[#685c4f]">{categoryError}</p>
          <button
            type="button"
            onClick={() => setReloadTrigger((prev) => prev + 1)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c77722] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-xs transition hover:bg-[#a96017] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Retry Loading</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* ── 1. BREADCRUMBS ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-3.5 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          <ol className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#786b5e]">
            <li>
              <Link
                to="/"
                className="transition hover:text-[#c77722] focus:outline-none focus-visible:underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <BreadcrumbChevron size={13} className="text-[#c77722]/60" />
            </li>
            <li>
              <Link
                to="/yagya-puja"
                className="transition hover:text-[#c77722] focus:outline-none focus-visible:underline"
              >
                Yagya & Puja
              </Link>
            </li>
            <li aria-hidden="true">
              <BreadcrumbChevron size={13} className="text-[#c77722]/60" />
            </li>
            <li>
              <Link
                to="/yagya-puja/path"
                className="transition hover:text-[#c77722] focus:outline-none focus-visible:underline"
              >
                Path Recitations
              </Link>
            </li>
            <li aria-hidden="true">
              <BreadcrumbChevron size={13} className="text-[#c77722]/60" />
            </li>
            <li className="font-semibold text-[#2b241d]" aria-current="page">
              {categoryLoading ? "Loading..." : category?.name || "Category"}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── 2. HERO / CATEGORY BANNER ── */}
      <header className="relative border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading, Description, Badges */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1">
              <Sparkles size={12} aria-hidden="true" className="text-[#c77722]" />
              <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                Scripture & Parayan Tradition
              </span>
            </div>

            <h1 className="mt-3 font-serif text-[32px] font-bold text-[#2b241d] sm:text-[42px] lg:text-[46px]">
              {categoryLoading ? (
                <span className="inline-block h-10 w-3/4 animate-pulse rounded-lg bg-[#ebdcc4]/60" />
              ) : (
                category?.name
              )}
            </h1>

            <p className="mt-3.5 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {categoryLoading ? (
                <span className="inline-block h-16 w-full animate-pulse rounded-lg bg-[#ebdcc4]/40" />
              ) : (
                category?.description ||
                "Vedic scriptural recitation, sacred chanting, and holy Parayans performed with authentic Vidhi."
              )}
            </p>

            {/* Badges / Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[12.5px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d3ba] bg-[#fffaf1] px-3.5 py-1 font-semibold text-[#b36c1e]">
                <BookOpen size={13} aria-hidden="true" />
                <span>
                  {servicesLoading ? "..." : totalCount}{" "}
                  {totalCount === 1 ? "Recitation Service" : "Recitation Services"}
                </span>
              </span>
              <span className="rounded-full border border-[#e6d3ba] bg-[#fffaf1] px-3.5 py-1 font-medium text-[#7a6a57]">
                Authentic Vedic Pandits
              </span>
              <span className="rounded-full border border-[#e6d3ba] bg-[#fffaf1] px-3.5 py-1 font-medium text-[#7a6a57]">
                Kashi & Remote Sankalpa
              </span>
            </div>
          </div>

          {/* Right Column: Category Featured Image Banner */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-[#ebdcc4] bg-[#241a12] shadow-md">
              <img
                src={categoryImageSrc}
                alt={category?.name || "Path Category"}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f]">
                  Sacred Category
                </span>
                <p className="font-serif text-[18px] font-semibold leading-snug">
                  {category?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. SEARCH & SECONDARY FILTERS BAR ── */}
      <section
        id="category-services-grid"
        className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Filter Container */}
          <div className="rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] p-5 shadow-2xs sm:p-6">
            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative md:col-span-5">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c]"
                />
                <input
                  type="text"
                  placeholder="Search in this category..."
                  aria-label="Search within this category"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => {
                    if (searchInput !== currentSearch) {
                      updateParams({ search: searchInput.trim(), page: 1 });
                    }
                  }}
                  className="w-full rounded-full border border-[#d8c3a5] bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#2b241d] placeholder:text-[#9e8f7e] focus:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]/30"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ search: "", page: 1 });
                    }}
                    aria-label="Clear search query"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c] hover:text-[#2b241d] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Purpose Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={currentPurpose}
                  onChange={(e) => updateParams({ purpose: e.target.value, page: 1 })}
                  aria-label="Filter by purpose"
                  className="w-full rounded-full border border-[#d8c3a5] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] focus:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]/30 cursor-pointer"
                >
                  <option value="All">All Purposes</option>
                  {purposes.map((p) => (
                    <option key={p.id || p.slug} value={p.slug}>
                      {p.name || p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recitation Format Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={currentFormat}
                  onChange={(e) => updateParams({ format: e.target.value, page: 1 })}
                  aria-label="Filter by recitation format"
                  className="w-full rounded-full border border-[#d8c3a5] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] focus:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]/30 cursor-pointer"
                >
                  {FORMAT_OPTIONS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
                  aria-label="Sort recitations"
                  className="w-full rounded-full border border-[#d8c3a5] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] focus:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]/30 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Pills Row: Days, Mode, Reset */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebdcc4]/60 pt-3.5 text-[12.5px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#8a725b]">Duration:</span>
                {DAYS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateParams({ days: opt.value, page: 1 })}
                    className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                      String(currentDays) === String(opt.value)
                        ? "bg-[#2b241d] text-[#f7ecd5]"
                        : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                <span className="ml-2 font-semibold text-[#8a725b]">Mode:</span>
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateParams({ mode: opt.value, page: 1 })}
                    className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                      currentMode === opt.value
                        ? "bg-[#2b241d] text-[#f7ecd5]"
                        : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 font-bold text-[#b36c1e] hover:underline cursor-pointer"
                >
                  <X size={13} aria-hidden="true" />
                  <span>Reset Filters ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Status Bar ── */}
          <div className="mt-8 flex items-center justify-between text-[13px] text-[#786b5e]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[14.5px] text-[#2b241d]">
                {servicesLoading ? "..." : services.length}
              </strong>{" "}
              of{" "}
              <strong className="font-bold text-[14.5px] text-[#2b241d]">
                {totalCount}
              </strong>{" "}
              Recitations in <span className="text-[#c77722]">{category?.name}</span>
            </span>

            <Link
              to="/yagya-puja/path"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
            >
              <span>View All Path Categories</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          {/* ── 4. SERVICE GRID / STATES ── */}
          {/* Error State */}
          {servicesError && (
            <div className="my-10 rounded-2xl border border-[#e8d5be] bg-[#fffaf2] p-8 text-center">
              <p className="text-[14.5px] font-medium text-[#7a3b2e]">
                {servicesError}
              </p>
              <button
                type="button"
                onClick={() => setReloadTrigger((prev) => prev + 1)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-white px-4 py-2 text-[13px] font-semibold text-[#b36c1e] shadow-xs transition hover:bg-[#fff7ed] cursor-pointer"
              >
                <RefreshCw size={13} aria-hidden="true" />
                <span>Retry Loading</span>
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {servicesLoading && !servicesError && (
            <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[24px] border border-[#e6caa0]/60 bg-[#fffdf9] animate-pulse"
                >
                  <div className="h-[220px] w-full bg-[#ebdcc4]/60" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-[#ebdcc4]/70" />
                    <div className="h-4 w-full rounded bg-[#ebdcc4]/40" />
                    <div className="h-4 w-1/2 rounded bg-[#ebdcc4]/40" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!servicesLoading && !servicesError && services.length === 0 && (
            <div className="my-12 rounded-[24px] border border-[#ebdcc4] bg-[#fffcf7] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e2cb] text-[#b36c1e]">
                <FolderX size={32} aria-hidden="true" />
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
                {activeFilterCount > 0
                  ? "No Rituals Match Your Filters"
                  : `No Rituals Available in ${category?.name || "this Category"}`}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[14px] text-[#685c4f]">
                {activeFilterCount > 0
                  ? "Try adjusting or clearing your search and filters to view recitations under this category."
                  : "No specific Path recitations are currently assigned to this category. You can explore all available Vedic recitations."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rounded-full bg-[#2b241d] px-5 py-2.5 text-[13px] font-semibold text-[#f7ecd5] transition hover:bg-[#40352b] cursor-pointer"
                  >
                    Clear Applied Filters
                  </button>
                )}
                <Link
                  to="/yagya-puja/path"
                  className="rounded-full border border-[#c77722] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#b36c1e] transition hover:bg-[#fff7ed] cursor-pointer"
                >
                  Explore All Categories
                </Link>
              </div>
            </div>
          )}

          {/* Actual Services Grid */}
          {!servicesLoading && !servicesError && services.length > 0 && (
            <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => (
                <PathServiceCard key={svc.id || svc.slug} service={svc} />
              ))}
            </div>
          )}

          {/* ── 5. PAGINATION (If totalPages > 1) ── */}
          {!servicesLoading && totalPages > 1 && (
            <nav
              aria-label="Pagination Navigation"
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c3a5] bg-white text-[#2b241d] transition disabled:opacity-40 hover:bg-[#f2e2cb] cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>

              <span className="px-3 text-[13px] font-semibold text-[#5c4e3f]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c3a5] bg-white text-[#2b241d] transition disabled:opacity-40 hover:bg-[#f2e2cb] cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ── 6. REUSABLE VEDIC SECTIONS ── */}
      <PathPanditTeamSection />
      <PathChapterStructureSection />
      <PathKashiSection />
      <PathFaqSection />
      <PathFinalCta onExploreClick={scrollToGrid} />
    </div>
  );
};

export default PathCategoryListing;
