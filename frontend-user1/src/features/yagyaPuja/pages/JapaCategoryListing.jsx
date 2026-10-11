import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import japaCatalogueService from "../../../services/japaCatalogueService";
import JapaServiceCard from "../components/JapaServiceCard";
import JapaSamagriSection from "../components/JapaSamagriSection";
import JapaPanditTeamSection from "../components/JapaPanditTeamSection";
import JapaKashiSection from "../components/JapaKashiSection";
import JapaFinalCta from "../components/JapaFinalCta";
import {
  Sparkles,
  RefreshCw,
  ChevronRight as BreadcrumbChevron,
  ArrowRight,
  FolderX,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import defaultJapaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import mantraImg from "../../../assets/images/c-mantra.jpg";

// Canonical fallback images per category slug if category.image is not provided
const CATEGORY_SLUG_IMAGES = {
  "shiva-mantra-japa": pujaMrityunjayaImg,
  "gayatri-vedic-japa": mantraImg,
  "durga-shakti-japa": pujaRudrabhishekImg,
  "hanuman-raksha-japa": pujaVishnuImg,
  "ganapati-siddhi-japa": pujaGaneshImg,
  "lakshmi-prosperity-japa": pujaLakshmiImg,
  "navagraha-planetary-japa": pujaNavagrahaImg,
};

const COUNT_FILTER_OPTIONS = [
  { label: "All Counts", value: "All" },
  { label: "11,000 Japa", value: 11000 },
  { label: "21,000 Japa", value: 21000 },
  { label: "51,000 Japa", value: 51000 },
  { label: "1,25,000 Japa", value: 125000 },
];

const MODE_FILTER_OPTIONS = [
  { label: "All Modes", value: "All" },
  { label: "Kashi Anushthan", value: "kashi" },
  { label: "Remote Sankalpa", value: "remote" },
];

const SORT_FILTER_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const PAGE_SIZE = 6;

/**
 * JapaCategoryListing Page
 * Customer-Facing Dedicated Category Listing Page for Vedic Mantra Japa traditions.
 * Route: /yagya-puja/japa/category/:categorySlug
 */
const JapaCategoryListing = () => {
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
  const currentCount = searchParams.get("count") || "All";
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

  // Helper to highlight "Japa" with gold accent in title
  const renderCategoryHeading = (name) => {
    if (!name) return "Vedic Mantra Japa Category";
    const parts = name.split(/(Japa)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === "japa" ? (
        <span key={i} className="text-[#f5ce6f]">{part}</span>
      ) : (
        part
      )
    );
  };

  // Dynamic context-specific CTA label
  const dynamicCtaText = (() => {
    if (!category?.name) return "Explore Japa";
    const name = category.name.trim();
    if (/japa$/i.test(name)) {
      return `Explore ${name}s`;
    }
    return `Explore ${name} Japa`;
  })();

  // Catalogue Section Heading
  const catalogueHeading = (() => {
    if (!category?.name) return "Explore Category Japas";
    const trimmed = category.name.trim();
    if (/japa$/i.test(trimmed)) {
      return `${trimmed}s`;
    }
    return `${trimmed} Japa Anushthans`;
  })();

  // Dynamic category image source with fallback
  const categoryImageSrc =
    category?.image ||
    (category?.slug ? CATEGORY_SLUG_IMAGES[category.slug] : null) ||
    defaultJapaImg;

  // Load available Japa purposes for filter dropdown
  useEffect(() => {
    let isMounted = true;
    japaCatalogueService
      .getJapaPurposes()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPurposes(data);
        }
      })
      .catch((err) => {
        console.error("Could not load Japa purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Category info from API
  useEffect(() => {
    let isMounted = true;
    japaCatalogueService
      .getJapaCategoryBySlug(categorySlug)
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
      document.title = `${category.name} | Vedic Mantra Japa | Veda Structure`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && category.description) {
        metaDesc.setAttribute("content", category.description);
      }
    } else if (categoryNotFound) {
      document.title = "Japa Category Not Found • Veda Structure";
    } else {
      document.title = "Vedic Mantra Japa Category • Veda Structure";
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
          v === "All Counts" ||
          v === "All Modes" ||
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
    if (currentCount !== "All" && currentCount !== "All Counts") count++;
    if (currentMode !== "All" && currentMode !== "All Modes") count++;
    if (currentSort !== "featured") count++;
    return count;
  }, [currentSearch, currentPurpose, currentCount, currentMode, currentSort]);

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    updateParams({
      search: "",
      purpose: "All",
      count: "All",
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
    if (currentCount && currentCount !== "All" && currentCount !== "All Counts") {
      filterObj.count = currentCount;
    }
    if (currentMode && currentMode !== "All" && currentMode !== "All Modes") {
      filterObj.mode = currentMode;
    }

    japaCatalogueService
      .getJapaServices(filterObj)
      .then((res) => {
        if (!isMounted) return;
        setServices(res.services || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setServicesLoading(false);
        setServicesError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching category japa services:", err);
        setServicesError("Unable to load Vedic Japa services in this category. Please try again.");
        setServicesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    categorySlug,
    categoryNotFound,
    currentSearch,
    currentPurpose,
    currentCount,
    currentMode,
    currentSort,
    currentPage,
    reloadTrigger,
  ]);

  // 1. NOT FOUND / INACTIVE CATEGORY STATE
  if (!categoryLoading && categoryNotFound) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf0] px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fdf3e7] text-[#c77722] shadow-xs">
          <FolderX size={36} />
        </div>
        <h1 className="mt-6 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
          Japa Category Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-[500px] text-[15px] leading-relaxed text-[#65584a]">
          The Japa category you&apos;re looking for is unavailable or no longer active.
        </p>
        <Link
          to="/yagya-puja/japa"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
        >
          <span>Back to All Japas</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // 2. CATEGORY FETCH ERROR STATE
  if (!categoryLoading && categoryError) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf0] px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422] shadow-xs">
          <RefreshCw size={28} />
        </div>
        <h1 className="mt-5 font-serif text-[26px] font-bold text-[#2b241d] sm:text-[32px]">
          Unable to Load Category
        </h1>
        <p className="mx-auto mt-2.5 max-w-[460px] text-[14.5px] leading-relaxed text-[#75695c]">
          {categoryError} Please check your connection and try again.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setCategoryLoading(true);
              setReloadTrigger((prev) => prev + 1);
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
          <Link
            to="/yagya-puja/japa"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#5c4e3f] transition hover:border-[#c77722] hover:text-[#c77722]"
          >
            <span>Back to All Japas</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* ── 1. IMMERSIVE EDITORIAL CATEGORY HERO ── */}
      <header className="group relative w-full overflow-hidden border-y border-[#ebdcc4] bg-[#140c06]">
        {/* Full-Bleed Background Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src={categoryImageSrc}
            alt={
              category?.name
                ? `${category.name} sacred Vedic Mantra Japa tradition`
                : "Sacred Vedic Mantra Japa tradition"
            }
            className="h-full w-full object-cover object-center sm:object-[center_35%] transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
            loading="eager"
          />

          {/* Left-Weighted Dark Warm Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[rgba(20,12,5,0.72)] via-[rgba(20,12,5,0.82)] to-[rgba(20,12,5,0.94)] sm:bg-gradient-to-r sm:from-[rgba(20,12,5,0.94)] sm:via-[rgba(20,12,5,0.78)] sm:via-55% sm:to-[rgba(20,12,5,0.25)] sm:to-92%"
          />

          {/* Subtle Top & Bottom Vignettes */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(20,12,5,0.85)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[rgba(20,12,5,0.60)] to-transparent"
          />

          {/* Warm Ambient Radial Glow Behind Content */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[440px] w-[440px] rounded-full bg-[#eab12c]/12 blur-[130px]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex min-h-[560px] sm:min-h-[580px] lg:min-h-[620px] xl:min-h-[650px] w-full max-w-[1400px] flex-col justify-between px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-12">
          {/* Top: Breadcrumb Navigation Layered Inside Hero */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#e8ded1]/90 drop-shadow-xs"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <Link to="/yagya-puja" className="transition-colors hover:text-white">
              Yagya &amp; Puja
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <Link to="/yagya-puja/japa" className="transition-colors hover:text-white">
              Mantra Japa
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <span className="font-semibold text-[#f5ce6f]">
              {categoryLoading ? "..." : category?.name}
            </span>
          </nav>

          {/* Middle: Left-Aligned Editorial Category Content */}
          <div className="my-auto max-w-[720px] pt-8 pb-6 text-left xl:max-w-[760px]">
            {/* Eyebrow Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#eab12c]/35 bg-[#1a1007]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f] shadow-xs backdrop-blur-md">
              <Sparkles size={12} className="text-[#eab12c]" />
              <span>VEDIC JAPA CATEGORY</span>
            </div>

            {/* Category Title Heading */}
            <h1 className="font-serif text-[36px] font-bold tracking-tight text-[#fffdfa] sm:text-[48px] lg:text-[56px] xl:text-[62px] leading-[1.12]">
              {categoryLoading ? (
                <span className="inline-block h-12 w-64 rounded bg-white/20 animate-pulse" />
              ) : (
                renderCategoryHeading(category?.name)
              )}
            </h1>

            {/* Dynamic Category Description */}
            <p className="mt-4 max-w-[650px] text-[15.5px] leading-relaxed text-[#ede1d1] sm:text-[17px] sm:leading-relaxed">
              {categoryLoading ? (
                <span className="inline-block h-5 w-full max-w-xl rounded bg-white/15 animate-pulse" />
              ) : (
                category?.description
              )}
            </p>

            {/* Sacred Context & Authenticity Indicators */}
            <div className="mt-7 flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#d9c9b5]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
                <span>Sacred Vedic Chanting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
                <span>Conducted by Initiated Vedapathis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
                <span>Kashi &amp; Remote Sankalpa</span>
              </div>
            </div>

            {/* Primary CTA (Scroll to catalogue) */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#category-catalogue"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("category-catalogue");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group inline-flex items-center gap-2.5 rounded-full border border-[#f5ce6f] bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_20px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_26px_rgba(234,177,44,0.48)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f]"
              >
                <span>{dynamicCtaText}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>

          {/* Bottom Balance Spacer */}
          <div aria-hidden="true" className="h-2" />
        </div>
      </header>

      {/* ── 2. CATEGORY SERVICE CATALOGUE SECTION (PAGE_SIZE = 6) ── */}
      <section
        id="category-catalogue"
        className="border-b border-[#ebdcc4] bg-[#fffaf0] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 xl:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Centered Editorial Header */}
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              EXPLORE THIS TRADITION
            </p>
            <h2 className="mt-2.5 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[38px] lg:text-[42px]">
              {catalogueHeading}
            </h2>
            <p className="mx-auto mt-2.5 max-w-[640px] text-[15px] leading-relaxed text-[#685c4f]">
              Consecrated Vedic Mantra Japas chanted with traditional Sanskrit Chandas, disciplined count tracking, and personalized sankalpa.
            </p>
          </div>

          {/* Filters Panel Enclosure */}
          <div className="mt-8 mb-8 rounded-2xl border border-[#e8d9bc] bg-[#fffdf8] px-5 py-4 shadow-[0_2px_12px_rgba(80,55,20,0.05)] sm:px-6 sm:py-5 space-y-4">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1 sm:max-w-[440px]">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89d91]"
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
                  placeholder="Search by deity, mantra, or intention..."
                  aria-label="Search Japa services"
                  className="h-[42px] w-full rounded-full border border-[#e0ceaf] bg-[#fffaf5] pl-10 pr-10 text-[13px] text-[#2b241d] outline-none transition placeholder:text-[#b0a494] hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ search: "", page: 1 });
                    }}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7c6b] hover:text-[#2b241d]"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Action Controls: Purpose & Sort */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Purpose Selector */}
                {purposes.length > 0 && (
                  <div className="flex items-center">
                    <select
                      value={currentPurpose}
                      onChange={(e) => updateParams({ purpose: e.target.value, page: 1 })}
                      aria-label="Filter by Purpose"
                      className="h-[42px] rounded-full border border-[#e0ceaf] bg-[#fffaf5] px-4 text-[13px] font-medium text-[#2b241d] outline-none transition hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10 cursor-pointer"
                    >
                      <option value="All">All Purposes</option>
                      {purposes.map((p) => (
                        <option key={p.slug || p.id} value={p.name || p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort Selector */}
                <div>
                  <select
                    value={currentSort}
                    onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
                    aria-label="Sort Japa services"
                    className="h-[42px] rounded-full border border-[#e0ceaf] bg-[#fffaf5] px-4 text-[13px] font-medium text-[#2b241d] outline-none transition hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10 cursor-pointer"
                  >
                    {SORT_FILTER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Count & Mode Filters Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#f0e3ce]">
              {/* Count Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-[#b36c1e] mr-1">
                  <SlidersHorizontal size={12} />
                  Count:
                </span>
                {COUNT_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updateParams({ count: opt.value, page: 1 })}
                    className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition-all cursor-pointer ${
                      String(currentCount) === String(opt.value)
                        ? "border-[#c77722] bg-[#eab12c] text-[#1c1308] shadow-xs"
                        : "border-[#e0ceaf] bg-[#fffaf5] text-[#5c4f42] hover:border-[#c77722]/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Mode Filter */}
              <div className="flex flex-wrap items-center gap-1.5 sm:border-l sm:border-[#e8d9bc] sm:pl-4">
                <span className="flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#b36c1e] mr-1">
                  <MapPin size={11} />
                  Mode:
                </span>
                {MODE_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updateParams({ mode: opt.value, page: 1 })}
                    className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition-all cursor-pointer ${
                      String(currentMode) === String(opt.value)
                        ? "border-[#c77722] bg-[#eab12c] text-[#1c1308] shadow-xs"
                        : "border-[#e0ceaf] bg-[#fffaf5] text-[#5c4f42] hover:border-[#c77722]/60"
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
                  className="ml-auto text-[12.5px] font-semibold text-[#c77722] hover:underline cursor-pointer"
                >
                  Clear all filters ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Results Counter & Pagination Info */}
          <div className="mb-7 flex flex-col gap-2 text-[13px] text-[#75695c] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="font-bold text-[15px] text-[#2b241d]">
                {servicesLoading
                  ? "..."
                  : totalCount > 0
                  ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                      currentPage * PAGE_SIZE,
                      totalCount
                    )}`
                  : "0"}
              </strong>{" "}
              of <strong className="font-bold text-[15px] text-[#2b241d]">{servicesLoading ? "..." : totalCount}</strong> Sacred Japa Anushthans in{" "}
              <span className="font-semibold text-[#b36c1e]">
                {category?.name || "this tradition"}
              </span>
              {totalPages > 1 && (
                <span className="ml-2 font-medium text-[#8c7e6e]">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </span>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="cursor-pointer text-[12.5px] font-semibold text-[#c77722] hover:underline"
              >
                Clear all filters ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Catalogue Body States */}
          {servicesLoading ? (
            /* Loading Skeleton (6 cards) */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[24px] border border-[#e6caa0]/60 bg-[#fffdfa] animate-pulse"
                >
                  <div className="h-[220px] w-full bg-[#ebdcc4]/60" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-1/3 rounded bg-[#ebdcc4]/60" />
                    <div className="h-6 w-3/4 rounded bg-[#ebdcc4]/80" />
                    <div className="h-4 w-full rounded bg-[#ebdcc4]/40" />
                    <div className="h-4 w-4/5 rounded bg-[#ebdcc4]/40" />
                    <div className="pt-4 border-t border-[#f0e2cd] flex justify-between items-center">
                      <div className="h-6 w-20 rounded bg-[#ebdcc4]/60" />
                      <div className="h-9 w-28 rounded-full bg-[#ebdcc4]/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : servicesError ? (
            /* Error State */
            <div className="rounded-[28px] border border-[#f0c8a8] bg-[#fffbf7] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422]">
                <RefreshCw size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                Unable to load Japa services
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                {servicesError}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setServicesLoading(true);
                    setReloadTrigger((prev) => prev + 1);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
                <Link
                  to="/yagya-puja/japa"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#5c4e3f] transition hover:border-[#c77722] hover:text-[#c77722]"
                >
                  <span>Explore All Japas</span>
                </Link>
              </div>
            </div>
          ) : services.length > 0 ? (
            /* Service Cards Grid */
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
                {services.map((service) => (
                  <JapaServiceCard
                    key={service.id || service.slug}
                    service={service}
                  />
                ))}
              </div>

              {/* Server-Side Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 border-t border-[#ebdcc4] pt-8">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d8c0] bg-white text-[#5c4f42] transition disabled:opacity-30 disabled:pointer-events-none hover:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    const isCurrent = pg === currentPage;
                    return (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => handlePageChange(pg)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`h-10 w-10 rounded-full text-[13.5px] font-semibold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] ${
                          isCurrent
                            ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                            : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5d8c0] bg-white text-[#5c4f42] transition disabled:opacity-30 disabled:pointer-events-none hover:border-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Bottom Actions: Back to All Japa */}
              <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#ebdcc4] pt-8 sm:flex-row">
                <Link
                  to="/yagya-puja/japa"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-6 py-2.5 text-[13px] font-bold text-[#b36c1e] shadow-2xs transition-all duration-300 hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308] hover:shadow-[0_4px_14px_rgba(234,177,44,0.25)]"
                >
                  <span>Explore All Japa Traditions</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/yagya-puja"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7d6f5f] transition-colors hover:text-[#c77722]"
                >
                  <span>Return to Yagya &amp; Puja Overview</span>
                </Link>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <Sparkles size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                {activeFilterCount > 0
                  ? "No Japas found matching your filters."
                  : "No Japas are currently available in this category."}
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                {activeFilterCount > 0
                  ? "Try resetting your search or filter options to see all Japas in this category."
                  : "We are currently curating more consecrated Vedic Japa Anushthans for this tradition. Explore all Japas in the meantime."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="cursor-pointer rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  to="/yagya-puja/japa"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#c77722] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#b36c1e] transition hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308]"
                >
                  <span>Explore All Japas</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. SACRED REUSABLE VEDIC SECTIONS ── */}
      <JapaSamagriSection />
      <JapaPanditTeamSection />
      <JapaKashiSection />
      <JapaFinalCta
        onExploreClick={() => {
          const el = document.getElementById("category-catalogue");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default JapaCategoryListing;
