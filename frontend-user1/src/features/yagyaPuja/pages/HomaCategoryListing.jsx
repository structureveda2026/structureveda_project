import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import homaCatalogueService from "../../../services/homaCatalogueService";
import HomaServiceCard from "../components/HomaServiceCard";
import HomaSamagriSection from "../components/HomaSamagriSection";
import HomaPanditTeamSection from "../components/HomaPanditTeamSection";
import HomaKashiSection from "../components/HomaKashiSection";
import HomaFaqSection from "../components/HomaFaqSection";
import HomaFinalCta from "../components/HomaFinalCta";
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
  Flame,
} from "lucide-react";

import defaultHomaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import vastuImg from "../../../assets/images/c-vastu.jpg";
import yagyaHeroImg from "../../../assets/images/yagya_hero.png";

// Canonical fallback images per category slug if category.image is null
const CATEGORY_SLUG_IMAGES = {
  "shiva-rudra-homa": pujaRudrabhishekImg,
  "ganapati-homa": pujaGaneshImg,
  "durga-chandi-homa": pujaLakshmiImg,
  "lakshmi-kubera-homa": pujaLakshmiImg,
  "navagraha-planetary-homa": pujaNavagrahaImg,
  "vastu-griha-homa": vastuImg,
  "ayushya-longevity-homa": yagyaHeroImg || pujaMrityunjayaImg,
};

const HAVAN_COUNT_OPTIONS = [
  { label: "All Havan Counts", value: "All" },
  { label: "1 Havan", value: 1 },
  { label: "3 Havans", value: 3 },
  { label: "5 Havans", value: 5 },
  { label: "7 Havans", value: 7 },
  { label: "11 Havans", value: 11 },
];

const DAYS_OPTIONS = [
  { label: "All Durations", value: "All" },
  { label: "1 Day", value: 1 },
  { label: "2 Days", value: 2 },
  { label: "3 Days", value: 3 },
];

const MODE_OPTIONS = [
  { label: "All Locations", value: "All" },
  { label: "Kashi Eligible", value: "kashi" },
  { label: "Remote Eligible", value: "remote" },
];

const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const PAGE_SIZE = 6;

/**
 * HomaCategoryListing Page
 * Dedicated customer category listing page for Vedic Homa / Havan traditions.
 * Route: /yagya-puja/homa/category/:categorySlug
 */
const HomaCategoryListing = () => {
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
  const currentHavanCount = searchParams.get("havanCount") || "All";
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
    defaultHomaImg;

  // Load available Homa purposes for filter dropdown
  useEffect(() => {
    let isMounted = true;
    homaCatalogueService
      .getHomaPurposes()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPurposes(data);
        }
      })
      .catch((err) => {
        console.error("Could not load Homa purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Category info from API
  useEffect(() => {
    let isMounted = true;

    homaCatalogueService
      .getHomaCategoryBySlug(categorySlug)
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
      document.title = `${category.name} | Vedic Homa & Havan | Veda Structure`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && category.description) {
        metaDesc.setAttribute("content", category.description);
      }
    } else if (categoryNotFound) {
      document.title = "Homa Category Not Found • Veda Structure";
    } else {
      document.title = "Vedic Homa & Havan Category • Veda Structure";
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
          v === "All Havan Counts" ||
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
    if (currentHavanCount !== "All" && currentHavanCount !== "All Havan Counts") count++;
    if (currentDays !== "All" && currentDays !== "All Durations") count++;
    if (currentMode !== "All" && currentMode !== "All Locations") count++;
    if (currentSort !== "featured") count++;
    return count;
  }, [currentSearch, currentPurpose, currentHavanCount, currentDays, currentMode, currentSort]);

  // Reset filters handler (retaining current category context)
  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    updateParams({
      search: "",
      purpose: "All",
      havanCount: "All",
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
      const el = document.getElementById("category-catalogue");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [currentPage, totalPages, updateParams]
  );

  // Search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  // Fetch Services belonging strictly to this category with server-side filtering & pagination
  useEffect(() => {
    if (categoryNotFound) return;

    let isMounted = true;

    const filterObj = {
      category: categorySlug,
      page: currentPage,
      limit: PAGE_SIZE,
      sortBy: currentSort,
    };

    if (currentSearch.trim()) filterObj.search = currentSearch.trim();
    if (currentPurpose && currentPurpose !== "All" && currentPurpose !== "All Purposes") {
      filterObj.purpose = currentPurpose;
    }
    if (currentHavanCount && currentHavanCount !== "All" && currentHavanCount !== "All Havan Counts") {
      filterObj.havanCount = currentHavanCount;
    }
    if (currentDays && currentDays !== "All" && currentDays !== "All Durations") {
      filterObj.days = currentDays;
    }
    if (currentMode && currentMode !== "All" && currentMode !== "All Locations") {
      filterObj.location = currentMode;
    }

    homaCatalogueService
      .getHomaServices(filterObj)
      .then((res) => {
        if (!isMounted) return;
        setServices(res.services || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || Math.ceil((res.total || 0) / PAGE_SIZE) || 1);
        setServicesError(null);
        setServicesLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading category Homa services:", err);
        setServicesError("Failed to load rituals for this category.");
        setServices([]);
        setServicesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    categorySlug,
    categoryNotFound,
    currentPage,
    currentSearch,
    currentPurpose,
    currentHavanCount,
    currentDays,
    currentMode,
    currentSort,
    reloadTrigger,
  ]);

  // Highlight "Homa" in category title with flame gold accent
  const renderCategoryHeading = (name) => {
    if (!name) return "Vedic Homa Category";
    const parts = name.split(/(Homa)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === "homa" ? (
        <span key={i} className="text-[#f5ce6f]">{part}</span>
      ) : (
        part
      )
    );
  };

  // 1. STATE: Category Not Found (404 or inactive)
  if (!categoryLoading && categoryNotFound) {
    return (
      <main className="min-h-screen bg-[#fffcf7] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[640px] text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fcedd2] text-[#c77722]">
            <FolderX size={38} />
          </div>
          <h1 className="mt-6 font-serif text-[32px] font-bold text-[#2b241d] sm:text-[38px]">
            Homa Category Not Found
          </h1>
          <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-[#685c4f]">
            The requested Homa fire ritual category does not exist or is currently inactive. You can explore all canonical Vedic Homas in our main catalogue.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/yagya-puja/homa"
              className="inline-flex items-center gap-2 rounded-full bg-[#c77722] px-6 py-3 text-[14px] font-bold text-white shadow-md transition hover:bg-[#a96017] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
            >
              <span>Browse All Homa & Havan</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. STATE: Category API Error
  if (!categoryLoading && categoryError) {
    return (
      <main className="min-h-screen bg-[#fffcf7] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[600px] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fcedd2] text-[#c77722]">
            <RefreshCw size={28} />
          </div>
          <h1 className="mt-5 font-serif text-[28px] font-bold text-[#2b241d]">
            Unable to Load Homa Category
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
    <div className="min-h-screen bg-[#fffcf7] text-[#2b241d]">
      {/* ── BREADCRUMB NAVIGATION ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#ebdcc4] bg-[#fdf9f2] px-5 py-3.5 sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12.5px] text-[#786a5b]">
          <Link
            to="/"
            className="transition hover:text-[#c77722] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c77722]"
          >
            Home
          </Link>
          <BreadcrumbChevron size={12} className="text-[#a89988]" />
          <Link
            to="/yagya-puja"
            className="transition hover:text-[#c77722] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c77722]"
          >
            Yagya & Puja
          </Link>
          <BreadcrumbChevron size={12} className="text-[#a89988]" />
          <Link
            to="/yagya-puja/homa"
            className="transition hover:text-[#c77722] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c77722]"
          >
            Homa / Havan
          </Link>
          <BreadcrumbChevron size={12} className="text-[#a89988]" />
          <span
            aria-current="page"
            className="font-semibold text-[#b36c1e] truncate max-w-[200px] sm:max-w-none"
          >
            {categoryLoading ? "Loading..." : category?.name}
          </span>
        </div>
      </nav>

      {/* ── EDITORIAL CATEGORY HERO ── */}
      <header className="relative overflow-hidden bg-[#1f160e] text-white">
        {/* Background Image Frame */}
        <div className="absolute inset-0 z-0">
          <img
            src={categoryImageSrc}
            alt={category?.name || "Vedic Homa Category"}
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a] via-[#1a110a]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a110a]/90 via-[#1a110a]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="max-w-[760px]">
            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5ce6f]/30 bg-black/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#f5ce6f] backdrop-blur-md">
              <Flame size={12} className="text-[#f5ce6f]" />
              <span>Vedic Fire Sacrament Tradition</span>
            </div>

            {/* H1 Heading */}
            <h1 className="mt-4 font-serif text-[32px] font-bold leading-[1.15] tracking-tight text-white sm:text-[44px] lg:text-[52px]">
              {categoryLoading ? (
                <span className="inline-block h-12 w-64 animate-pulse rounded-lg bg-white/20" />
              ) : (
                renderCategoryHeading(category?.name)
              )}
            </h1>

            {/* Category Description */}
            <p className="mt-4 text-[15px] leading-relaxed text-[#e6dac9] sm:text-[17px]">
              {categoryLoading ? (
                <span className="inline-block h-16 w-full animate-pulse rounded bg-white/10" />
              ) : (
                category?.description ||
                "Consecrated Vedic fire ceremonies performed by revered Vedic scholars with authentic Shastric vidhi, samagri, and personalized sankalpa."
              )}
            </p>

            {/* Quick Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#category-catalogue"
                className="inline-flex items-center gap-2 rounded-full bg-[#c77722] px-6 py-3 text-[14px] font-bold text-white shadow-lg transition hover:bg-[#e0892c] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f]"
              >
                <span>Explore {category?.name || "Homa"} Rituals</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── PRIMARY CATEGORY CATALOGUE ── */}
      <section
        id="category-catalogue"
        className="scroll-mt-16 px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#ebdcc4] pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b36c1e]">
                <Sparkles size={12} className="text-[#c77722]" />
                <span>Available Fire Ceremonies</span>
              </div>
              <h2 className="mt-1 font-serif text-[26px] font-bold text-[#2b241d] sm:text-[32px]">
                {category?.name || "Category"} Services
              </h2>
            </div>
            <div className="text-[13px] text-[#786a5b]">
              Showing{" "}
              <strong className="text-[15px] font-bold text-[#2b241d]">
                {servicesLoading ? "..." : totalCount}
              </strong>{" "}
              Consecrated Rituals
            </div>
          </div>

          {/* ── SEARCH & FILTER CONTROLS BAR ── */}
          <div className="mt-8 rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] p-5 shadow-xs">
            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative md:col-span-4">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c]"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => {
                    if (searchInput !== currentSearch) {
                      updateParams({ search: searchInput.trim(), page: 1 });
                    }
                  }}
                  placeholder="Search inside this category..."
                  aria-label="Search within this category"
                  className="w-full rounded-full border border-[#d6b8a0] bg-white py-2.5 pl-10 pr-10 text-[13px] text-[#2b241d] placeholder-[#8c7e6c] transition focus:border-[#c77722] focus:outline-none"
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

              {/* Purpose Filter Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={currentPurpose}
                  onChange={(e) => updateParams({ purpose: e.target.value, page: 1 })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  <option value="All">All Purposes</option>
                  {purposes.map((p) => (
                    <option key={p.id || p.slug} value={p.slug || p.id}>
                      {p.name || p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Havan Count Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={currentHavanCount}
                  onChange={(e) => updateParams({ havanCount: e.target.value, page: 1 })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  {HAVAN_COUNT_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration (Days) Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={currentDays}
                  onChange={(e) => updateParams({ days: e.target.value, page: 1 })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  {DAYS_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="md:col-span-1">
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-2 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none text-center"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Pills & Clear Actions */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebdcc4] pt-3 text-[12px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#8a725b]">Mode:</span>
                {MODE_OPTIONS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => updateParams({ mode: m.value, page: 1 })}
                    className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                      currentMode === String(m.value)
                        ? "bg-[#2b241d] text-[#f7ecd5]"
                        : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#8a725b]">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 rounded-full border border-[#d6b8a0] bg-white px-3 py-1 font-semibold text-[#a9442a] hover:bg-[#fff0eb] cursor-pointer"
                  >
                    <X size={12} />
                    <span>Clear Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── SERVICES GRID OR EMPTY / ERROR STATES ── */}
          <div className="mt-10">
            {/* Loading Skeletons */}
            {servicesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="flex flex-col overflow-hidden rounded-[24px] border border-[#ebdcc4] bg-white p-5 animate-pulse"
                  >
                    <div className="h-[200px] w-full rounded-[16px] bg-[#f0e3ce]" />
                    <div className="mt-4 h-6 w-3/4 rounded bg-[#f0e3ce]" />
                    <div className="mt-2 h-4 w-full rounded bg-[#f5ecdd]" />
                    <div className="mt-4 flex items-center justify-between border-t border-[#f5ecdd] pt-4">
                      <div className="h-6 w-24 rounded bg-[#f0e3ce]" />
                      <div className="h-8 w-24 rounded-full bg-[#f0e3ce]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : servicesError ? (
              /* Services Error State */
              <div className="rounded-[24px] border border-[#f0c8ba] bg-[#fff5f2] p-12 text-center">
                <p className="font-serif text-[18px] font-semibold text-[#8a2f1c]">
                  {servicesError}
                </p>
                <button
                  type="button"
                  onClick={() => setReloadTrigger((prev) => prev + 1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c77722] px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-xs hover:bg-[#a96017] cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Retry Rituals</span>
                </button>
              </div>
            ) : services.length === 0 ? (
              /* Empty State (Zero results for category or filters) */
              <div className="rounded-[24px] border border-[#e6d3ba] bg-[#fffdf9] p-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fcedd2] text-[#c77722]">
                  <FolderX size={30} />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                  {activeFilterCount > 0
                    ? "No Rituals Match Your Filters"
                    : `No Rituals Available in ${category?.name || "This Category"}`}
                </h3>
                <p className="mx-auto mt-2 max-w-[460px] text-[14px] leading-relaxed text-[#685c4f]">
                  {activeFilterCount > 0
                    ? "Try adjusting or clearing your search and filters to view rituals under this category."
                    : "No specific Homa ceremonies are currently assigned to this category. You can explore all available Vedic fire rituals."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {activeFilterCount > 0 ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="rounded-full bg-[#c77722] px-5 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-[#a96017] cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  ) : null}
                  <Link
                    to="/yagya-puja/homa"
                    className="rounded-full border border-[#d6b8a0] bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#5c4e3f] shadow-xs hover:border-[#c77722] hover:text-[#c77722]"
                  >
                    Browse All Homa & Havan
                  </Link>
                </div>
              </div>
            ) : (
              /* Success Grid */
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((svc) => (
                  <HomaServiceCard key={svc.id || svc.slug} service={svc} />
                ))}
              </div>
            )}
          </div>

          {/* ── PAGINATION CONTROLS ── */}
          {!servicesLoading && totalPages > 1 && (
            <nav
              aria-label="Pagination Navigation"
              className="mt-14 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous Page"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition cursor-pointer ${
                  currentPage <= 1
                    ? "border-[#e0d4c2] text-[#c2b5a5] cursor-not-allowed opacity-50"
                    : "border-[#d6b8a0] bg-white text-[#2b241d] hover:border-[#c77722] hover:text-[#c77722]"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => handlePageChange(pg)}
                  aria-current={pg === currentPage ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[13.5px] font-bold transition cursor-pointer ${
                    pg === currentPage
                      ? "bg-[#c77722] text-white shadow-xs"
                      : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722] hover:text-[#c77722]"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next Page"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition cursor-pointer ${
                  currentPage >= totalPages
                    ? "border-[#e0d4c2] text-[#c2b5a5] cursor-not-allowed opacity-50"
                    : "border-[#d6b8a0] bg-white text-[#2b241d] hover:border-[#c77722] hover:text-[#c77722]"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ── SUPPORTING HOMA SECTIONS ── */}
      <HomaSamagriSection />
      <HomaPanditTeamSection />
      <HomaKashiSection />
      <HomaFaqSection />
      <HomaFinalCta />
    </div>
  );
};

export default HomaCategoryListing;
