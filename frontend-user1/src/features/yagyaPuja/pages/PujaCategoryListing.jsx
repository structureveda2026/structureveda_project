import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import pujaCatalogueService from "../../../services/pujaCatalogueService";
import PujaServiceCard from "../components/PujaServiceCard";
import PujaServiceFilters from "../components/PujaServiceFilters";
import PujaSankalpaProcess from "../components/PujaSankalpaProcess";
import PujaInclusionsSection from "../components/PujaInclusionsSection";
import PujaWorkflowSection from "../components/PujaWorkflowSection";
import PujaFinalCta from "../components/PujaFinalCta";
import {
  Sparkles,
  RefreshCw,
  ChevronRight as BreadcrumbChevron,
  ArrowRight,
  FolderX,
} from "lucide-react";

import defaultPujaImg from "../../../assets/images/puja-kashi.jpg";
import ganeshImg from "../../../assets/images/puja-ganesh.jpg";
import lakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import shivaImg from "../../../assets/images/puja-rudrabhishek.jpg";
import vishnuImg from "../../../assets/images/puja-vishnu.jpg";
import navagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import specialImg from "../../../assets/images/puja-ganga.jpg";
import durgaImg from "../../../assets/images/devi_durga_card.jpg";
import familyImg from "../../../assets/images/puja/puja-family.webp.png";

// Fallback images per category slug if category.image is not provided
const CATEGORY_SLUG_IMAGES = {
  "shiva-puja": shivaImg,
  "durga-shakti-puja": durgaImg,
  "vishnu-narayan-puja": vishnuImg,
  "navagraha-planetary-puja": navagrahaImg,
  "marriage-family-puja": familyImg,
  "special-occasion-puja": specialImg,
  "ganesh-puja": ganeshImg,
  "lakshmi-prosperity-puja": lakshmiImg,
};

const PujaCategoryListing = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Category state
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Helper to highlight "Puja" with gold accent in title
  const renderCategoryHeading = (name) => {
    if (!name) return "Vedic Puja Category";
    const parts = name.split(/(Puja)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === "puja" ? (
        <span key={i} className="text-[#f5ce6f]">{part}</span>
      ) : (
        part
      )
    );
  };

  // Dynamic context-specific CTA label (single arrow in icon, no duplicate in text)
  const dynamicCtaText = (() => {
    if (!category?.name) return "Explore Pujas";
    const name = category.name.trim();
    if (name.toLowerCase().endsWith("puja")) {
      return `Explore ${name}s`;
    }
    return `Explore ${name} Pujas`;
  })();

  // Dynamic category image source with deity fallback
  const categoryImageSrc =
    category?.image || (category?.slug ? CATEGORY_SLUG_IMAGES[category.slug] : null) || defaultPujaImg;

  // Services & filters state
  const [services, setServices] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Pagination state initialized from URL searchParams
  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);

  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load purpose metadata for the filters
  useEffect(() => {
    let isMounted = true;
    pujaCatalogueService
      .getPujaPurposes()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPurposes(data);
        }
      })
      .catch((err) => {
        console.error("Could not load Puja purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Category info from API
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      setCategoryLoading(true);
      setCategoryError(null);
      setCategoryNotFound(false);

      pujaCatalogueService
        .getPujaCategoryBySlug(categorySlug)
        .then((catData) => {
          if (!isMounted) return;
          if (!catData) {
            setCategoryNotFound(true);
            setCategory(null);
          } else {
            setCategory(catData);
            setCategoryNotFound(false);
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
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [categorySlug, reloadTrigger]);

  // Dynamic SEO metadata
  useEffect(() => {
    if (category?.name) {
      document.title = `${category.name} | Veda Structure`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && category.description) {
        metaDesc.setAttribute("content", category.description);
      }
    } else if (categoryNotFound) {
      document.title = "Puja Category Not Found • Veda Structure";
    } else {
      document.title = "Puja Category • Veda Structure";
    }
  }, [category, categoryNotFound]);

  // Sync currentPage with URL searchParams
  useEffect(() => {
    const currentParamPage = parseInt(searchParams.get("page"), 10) || 1;
    if (currentPage !== currentParamPage) {
      const nextParams = new URLSearchParams(searchParams);
      if (currentPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(currentPage));
      }
      setSearchParams(nextParams, { replace: true });
    }
  }, [currentPage, searchParams, setSearchParams]);

  // Filter setters that reset currentPage to 1
  const handlePurposeChange = useCallback((pur) => {
    setSelectedPurpose(pur);
    setCurrentPage(1);
  }, []);

  const handleDurationChange = useCallback((dur) => {
    setSelectedDuration(dur);
    setCurrentPage(1);
  }, []);

  const handleModeChange = useCallback((m) => {
    setSelectedMode(m);
    setCurrentPage(1);
  }, []);

  const handleFeaturedChange = useCallback((f) => {
    setIsFeaturedOnly(f);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((s) => {
    setSelectedSort(s);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedPurpose("All Purposes");
    setSelectedDuration("All Durations");
    setSelectedMode("All Modes");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
  }, [currentPage, totalPages]);
  void handlePageChange;

  // Resolve purpose slug
  const resolvedPurposeSlug = useMemo(() => {
    if (!selectedPurpose || selectedPurpose === "All Purposes") return undefined;
    const found = (purposes || []).find(
      (p) =>
        p.slug === selectedPurpose ||
        p.name.toLowerCase() === selectedPurpose.toLowerCase()
    );
    return found ? found.slug : selectedPurpose;
  }, [selectedPurpose, purposes]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All Purposes") count++;
    if (selectedDuration !== "All Durations") count++;
    if (selectedMode !== "All Modes") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery]);

  // Fetch Services belonging strictly to this category from backend
  useEffect(() => {
    if (categoryNotFound) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        setServicesLoading(true);
        const res = await pujaCatalogueService.getPujaServices({
          category: categorySlug,
          search: debouncedSearch,
          purpose: resolvedPurposeSlug,
          duration: selectedDuration,
          mode: selectedMode,
          isFeatured: isFeaturedOnly,
          sortBy: selectedSort,
          page: 1,
          limit: 100, // Show all active services in this category without pagination
        });

        if (isMounted) {
          setServices(res.services || []);
          setTotalCount(res.total ?? (res.services ? res.services.length : 0));
          setTotalPages(1);
          setServicesLoading(false);
          setServicesError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching category puja services:", err);
          setServicesError("Unable to load Vedic Puja services in this category. Please try again.");
          setServicesLoading(false);
        }
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    categorySlug,
    categoryNotFound,
    debouncedSearch,
    resolvedPurposeSlug,
    selectedDuration,
    selectedMode,
    isFeaturedOnly,
    selectedSort,
    currentPage,
    reloadTrigger,
  ]);

  // 1. NOT FOUND STATE
  if (!categoryLoading && categoryNotFound) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf0] px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fdf3e7] text-[#c77722] shadow-sm">
          <FolderX size={36} />
        </div>
        <h1 className="mt-6 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
          Puja Category Not Found
        </h1>
        <p className="mx-auto mt-3 max-w-[500px] text-[15px] leading-relaxed text-[#65584a]">
          The category you&apos;re looking for is unavailable or no longer active.
        </p>
        <Link
          to="/yagya-puja/puja"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
        >
          <span>View All Puja</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // 2. CATEGORY FETCH ERROR STATE
  if (!categoryLoading && categoryError) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fffaf0] px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422] shadow-sm">
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
            onClick={() => setReloadTrigger((prev) => prev + 1)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
          <Link
            to="/yagya-puja/puja"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#5c4e3f] transition hover:border-[#c77722] hover:text-[#c77722]"
          >
            <span>View All Puja</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* ── 1. IMMERSIVE FULL-WIDTH EDITORIAL CATEGORY HERO ── */}
      <header className="group relative w-full overflow-hidden border-y border-[#ebdcc4] bg-[#140c06]">
        {/* Full-Bleed Background Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src={categoryImageSrc}
            alt={
              category?.name
                ? `${category.name} sacred Vedic tradition`
                : "Sacred Vedic Puja category ritual"
            }
            className="h-full w-full object-cover object-center sm:object-[center_35%] transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
            loading="eager"
          />

          {/* Left-Weighted Warm Scrim (Text crisp on left, visual subject visible on right) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[rgba(20,12,5,0.70)] via-[rgba(20,12,5,0.80)] to-[rgba(20,12,5,0.92)] sm:bg-gradient-to-r sm:from-[rgba(20,12,5,0.93)] sm:via-[rgba(20,12,5,0.75)] sm:via-55% sm:to-[rgba(20,12,5,0.22)] sm:to-92%"
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

        {/* Content Container (Constrained max-w-[1400px], 55-65% width editorial block) */}
        <div className="relative z-10 mx-auto flex min-h-[560px] sm:min-h-[580px] lg:min-h-[620px] xl:min-h-[650px] w-full max-w-[1400px] flex-col justify-between px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-12">
          {/* Top: Breadcrumb Navigation Layered Directly Inside Hero */}
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
            <Link to="/yagya-puja/puja" className="transition-colors hover:text-white">
              Puja
            </Link>
            <BreadcrumbChevron size={12} className="text-[#d4c5b2]/70" />
            <span className="font-semibold text-[#f5ce6f]">
              {categoryLoading ? "..." : category?.name}
            </span>
          </nav>

          {/* Middle: Left-Aligned Editorial Category Content (~55-65% Width) */}
          <div className="my-auto max-w-[720px] pt-8 pb-6 text-left xl:max-w-[760px]">
            {/* Eyebrow Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#eab12c]/35 bg-[#1a1007]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f] shadow-xs backdrop-blur-md">
              <Sparkles size={12} className="text-[#eab12c]" />
              <span>VEDIC PUJA CATEGORY</span>
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
                <span>Sacred Vedic Tradition</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
                <span>Experienced Acharyas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
                <span>Kashi &amp; Beyond</span>
              </div>
            </div>

            {/* Dynamic Category CTA (Single clean arrow) */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={`/yagya-puja/puja/category/${categorySlug}#category-catalogue`}
                onClick={(e) => {
                  const el = document.getElementById("category-catalogue");
                  if (el) {
                    e.preventDefault();
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
              </Link>
            </div>
          </div>

          {/* Bottom Balance Spacer */}
          <div aria-hidden="true" className="h-2" />
        </div>
      </header>

      {/* ── 2. CATEGORY CATALOGUE SECTION (6 PER PAGE) ── */}
      <section
        id="category-catalogue"
        className="border-b border-[#ebdcc4] bg-[#fdf8ef] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 xl:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          {/* Filter Area */}
          <div className="mb-8 rounded-2xl border border-[#e8d9bc] bg-[#fffdf8] px-5 py-4 shadow-[0_2px_12px_rgba(80,55,20,0.05)] sm:px-6 sm:py-5">
            <PujaServiceFilters
              selectedPurpose={selectedPurpose}
              setSelectedPurpose={handlePurposeChange}
              selectedDuration={selectedDuration}
              setSelectedDuration={handleDurationChange}
              selectedMode={selectedMode}
              setSelectedMode={handleModeChange}
              isFeaturedOnly={isFeaturedOnly}
              setIsFeaturedOnly={handleFeaturedChange}
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              selectedSort={selectedSort}
              setSelectedSort={handleSortChange}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
              purposes={purposes}
            />
          </div>

          {/* Counter Bar */}
          <div className="mb-7 flex items-center justify-between text-[13px] text-[#75695c]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[15px] text-[#2b241d]">
                {servicesLoading
                  ? "..."
                  : totalCount === 0
                  ? "0"
                  : `${(currentPage - 1) * 6 + 1}–${Math.min(currentPage * 6, totalCount)}`}
              </strong>{" "}
              of{" "}
              <strong className="font-bold text-[15px] text-[#2b241d]">
                {servicesLoading ? "..." : totalCount}
              </strong>{" "}
              Sacred Ceremonies in{" "}
              <span className="font-semibold text-[#b36c1e]">
                {category?.name || "Category"}
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

          {/* Service Cards Grid / State Handling */}
          {servicesLoading ? (
            /* Loading Skeleton (6 cards) */
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] shadow-xs animate-pulse"
                >
                  <div
                    className="w-full bg-[#ebdcc4]/60"
                    style={{ aspectRatio: "4/3" }}
                  />
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-20 rounded-full bg-[#ebdcc4]/70" />
                        <div className="h-4 w-24 rounded-full bg-[#ebdcc4]/50" />
                      </div>
                      <div className="h-6 w-3/4 rounded-md bg-[#ebdcc4]/70" />
                      <div className="h-3.5 w-full rounded bg-[#ebdcc4]/40" />
                      <div className="h-3.5 w-4/5 rounded bg-[#ebdcc4]/40" />
                    </div>
                    <div className="flex items-end justify-between border-t border-[#f0e2cd] pt-4">
                      <div className="space-y-1">
                        <div className="h-3 w-16 rounded bg-[#ebdcc4]/50" />
                        <div className="h-5 w-20 rounded bg-[#ebdcc4]/70" />
                      </div>
                      <div className="h-8 w-24 rounded-full bg-[#ebdcc4]/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : servicesError ? (
            /* Service Error State */
            <div className="rounded-[28px] border border-[#f0c8a8] bg-[#fffbf7] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422]">
                <RefreshCw size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                Unable to load Pujas
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                Please try again or view all available Puja rituals.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setServicesError(null);
                    setReloadTrigger((prev) => prev + 1);
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018]"
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
                <Link
                  to="/yagya-puja/puja"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#5c4e3f] transition hover:border-[#c77722] hover:text-[#c77722]"
                >
                  <span>View All Puja</span>
                </Link>
              </div>
            </div>
          ) : services.length > 0 ? (
            /* Service Cards Grid */
            <>
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                {services.map((service) => (
                  <PujaServiceCard
                    key={service.id || service.slug}
                    service={service}
                  />
                ))}
              </div>

              {/* Bottom Actions: Browse All Puja Categories (NO PAGINATION) */}
              <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#ebdcc4] pt-8 sm:flex-row">
                <Link
                  to="/yagya-puja/puja/all"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-6 py-2.5 text-[13px] font-bold text-[#b36c1e] shadow-2xs transition-all duration-300 hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308] hover:shadow-[0_4px_14px_rgba(234,177,44,0.25)]"
                >
                  <span>Browse All Puja Categories</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/yagya-puja/puja"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7d6f5f] transition-colors hover:text-[#c77722]"
                >
                  <span>View All Puja Overview</span>
                </Link>
              </div>
            </>
          ) : (
            /* Category Empty State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <Sparkles size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                No Puja services are currently available in this category.
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                {activeFilterCount > 0
                  ? "Try clearing your search or filters to see all rituals in this category."
                  : "We are currently curating more consecrated Pujas for this tradition. Explore all Puja categories in the meantime."}
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
                  to="/yagya-puja/puja/all"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#c77722] bg-[#fffdfa] px-6 py-3 text-[13px] font-bold text-[#b36c1e] transition hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308]"
                >
                  <span>Browse All Puja Categories</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. RELEVANT REUSABLE SECTIONS ── */}
      <PujaSankalpaProcess />
      <PujaInclusionsSection />
      <PujaWorkflowSection />
      <PujaFinalCta />
    </div>
  );
};

export default PujaCategoryListing;
