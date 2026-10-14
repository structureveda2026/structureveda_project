import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import pujaCatalogueService from "../../../services/pujaCatalogueService";
import yagyaCatalogueService from "../../../services/yagyaCatalogueService";
import japaCatalogueService from "../../../services/japaCatalogueService";
import pathCatalogueService from "../../../services/pathCatalogueService";
import homaCatalogueService from "../../../services/homaCatalogueService";

/**
 * REFINED 2-ROW DEDICATED PUJA & YAGYA NAVBAR
 *
 * ROW 1: Compact Information Strip (Trust statements, helpline, Main Website link)
 * ROW 2: Single Combined Brand & 6-Category Navigation
 *        [ VEDA STRUCTURE LOGO ] [ Upcoming Puja ] [ Puja ] [ Yagya ] [ Japa ] [ Path ] [ Homa ] [ Puja in Kashi ]
 *
 * DROPDOWN: Wide cream multi-column panel directly below Row 2 on hover/click.
 */

const RITUAL_NAV_TABS = [
  {
    id: "puja",
    label: "Puja",
    shortLabel: "Puja",
    path: "/yagya-puja/puja",
    viewAllLabel: "View All Pujas",
    heading: "PUJA CATEGORIES",
    categoryRoutePrefix: "/yagya-puja/puja/category/",
    countLabel: "Categories",
  },
  {
    id: "yagya",
    label: "Yagya",
    shortLabel: "Yagya",
    path: "/yagya-puja/yagya",
    viewAllLabel: "View All Yagyas",
    heading: "YAGYA CATEGORIES",
    categoryRoutePrefix: "/yagya-puja/yagya/category/",
    countLabel: "Categories",
  },
  {
    id: "japa",
    label: "Japa / Chanting",
    shortLabel: "Japa",
    path: "/yagya-puja/japa",
    viewAllLabel: "View All Japa Services",
    heading: "JAPA CATEGORIES",
    categoryRoutePrefix: "/yagya-puja/japa/category/",
    countLabel: "Categories",
  },
  {
    id: "path",
    label: "Path / Recitation",
    shortLabel: "Path",
    path: "/yagya-puja/path",
    viewAllLabel: "View All Path Services",
    heading: "PATH CATEGORIES",
    categoryRoutePrefix: "/yagya-puja/path/category/",
    countLabel: "Categories",
  },
  {
    id: "homa",
    label: "Homa / Havan",
    shortLabel: "Homa",
    path: "/yagya-puja/homa",
    viewAllLabel: "View All Homa Services",
    heading: "HOMA CATEGORIES",
    categoryRoutePrefix: "/yagya-puja/homa/category/",
    countLabel: "Categories",
  },
  {
    id: "kashi",
    label: "Puja in Kashi",
    shortLabel: "Puja in Kashi",
    path: "/yagya-puja/kashi",
    viewAllLabel: "View All Kashi Ceremonies",
    heading: "KASHI PUJA CEREMONIES",
    categoryRoutePrefix: null,
    countLabel: "Ceremonies",
  },
];

const YagyaPujaNavBar = () => {
  const location = useLocation();

  // Desktop active dropdown ID (null = closed)
  const [openDropdown, setOpenDropdown] = useState(null);

  // Mobile menu open state (< lg)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobile accordion expanded tab ID
  const [mobileExpanded, setMobileExpanded] = useState(null);

  // Categories data for each of the 6 disciplines
  const [categoriesData, setCategoriesData] = useState(() => {
    const initial = {};
    RITUAL_NAV_TABS.forEach((tab) => {
      initial[tab.id] = {
        items: [],
        loading: false,
        error: false,
        loaded: false,
      };
    });
    return initial;
  });

  const loadedRef = useRef(new Set());
  const dropdownTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);

  // Fetch categories from existing services
  const fetchCategories = useCallback(async (ritualId, forceRefresh = false) => {
    switch (ritualId) {
      case "puja": {
        const res = await pujaCatalogueService.getPujaCategories(forceRefresh);
        return Array.isArray(res) ? res : [];
      }
      case "yagya": {
        const res = await yagyaCatalogueService.getYagyaCategories(forceRefresh);
        return Array.isArray(res) ? res : [];
      }
      case "japa": {
        const res = await japaCatalogueService.getJapaCategories(forceRefresh);
        return Array.isArray(res) ? res : [];
      }
      case "path": {
        const res = await pathCatalogueService.getPathCategories(forceRefresh);
        return Array.isArray(res) ? res : [];
      }
      case "homa": {
        const res = await homaCatalogueService.getHomaCategories(forceRefresh);
        return Array.isArray(res) ? res : [];
      }
      case "kashi": {
        const result = await pujaCatalogueService.getPujaServices({ limit: 100 });
        const list = Array.isArray(result?.services) ? result.services : [];
        const kashiList = list.filter((s) => s.isKashiAvailable !== false);
        return kashiList.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          path: `/yagya-puja/puja/${s.slug}`,
        }));
      }
      default:
        return [];
    }
  }, []);

  const loadCategoryData = useCallback(
    async (ritualId, forceRefresh = false) => {
      setCategoriesData((prev) => ({
        ...prev,
        [ritualId]: { ...prev[ritualId], loading: true, error: false },
      }));

      try {
        const data = await fetchCategories(ritualId, forceRefresh);
        setCategoriesData((prev) => ({
          ...prev,
          [ritualId]: {
            items: Array.isArray(data) ? data : [],
            loading: false,
            error: false,
            loaded: true,
          },
        }));
      } catch (err) {
        console.error(`YagyaPujaNavBar: failed to load categories for ${ritualId}:`, err);
        setCategoriesData((prev) => ({
          ...prev,
          [ritualId]: {
            ...prev[ritualId],
            loading: false,
            error: true,
            loaded: true,
          },
        }));
      }
    },
    [fetchCategories]
  );

  // Pre-load all 6 categories on mount so badges and dropdowns are immediate
  useEffect(() => {
    RITUAL_NAV_TABS.forEach((tab) => {
      if (!loadedRef.current.has(tab.id)) {
        loadedRef.current.add(tab.id);
        loadCategoryData(tab.id);
      }
    });
  }, [loadCategoryData]);

  // Route change: close dropdowns & mobile menu
  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  // Click outside and Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    const handleClickOutside = (e) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hover handlers with debounce to prevent abrupt closing
  const handleMouseEnterTab = (tabId) => {
    clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(tabId);
  };

  const handleMouseLeaveTab = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 220);
  };

  const handleDropdownMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 220);
  };

  // Determine active tab from URL path
  const getActiveTabId = () => {
    const p = location.pathname;
    if (p.startsWith("/yagya-puja/yagya")) return "yagya";
    if (p.startsWith("/yagya-puja/japa")) return "japa";
    if (p.startsWith("/yagya-puja/path")) return "path";
    if (p.startsWith("/yagya-puja/homa")) return "homa";
    if (p.startsWith("/yagya-puja/kashi")) return "kashi";
    if (p.startsWith("/yagya-puja/puja")) return "puja";
    return null;
  };

  const activeTabId = getActiveTabId();
  const currentOpenTab = RITUAL_NAV_TABS.find((t) => t.id === openDropdown);

  return (
    <header
      ref={navContainerRef}
      className="sticky top-0 z-40 border-b border-[#ebdcc2] bg-[#fffdf9]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(50,35,15,0.04)]"
      aria-label="Veda Structure Puja & Yagya Navigation"
    >
      {/* ========================================================
          ROW 1: COMPACT INFORMATION STRIP
      ========================================================= */}
      <div className="border-b border-[#ebdcc2]/60 bg-[#fbf5e8] px-4 py-1.5 text-[11px] sm:text-[11.5px] text-[#5c4e3f]">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3">
          {/* Left Trust Statement */}
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={13} className="text-[#b36c1e] shrink-0" />
            <p className="font-medium tracking-wide truncate">
              Authentic Vedic Rituals <span className="text-[#c77722]/40 mx-1">•</span> Performed in Sacred Kashi <span className="text-[#c77722]/40 mx-1">•</span> Personalized Sankalp
            </p>
          </div>

          {/* Right Helpline & Main Website link */}
          <div className="flex items-center gap-4 text-[11px] sm:text-[11.5px] shrink-0">
            <a
              href="tel:+918887776655"
              className="hidden md:inline-flex items-center gap-1.5 text-[#6e5d4b] hover:text-[#b36a18] transition-colors"
            >
              <Phone size={11} className="text-[#b36a18]" />
              <span>Helpline: +91 888 777 6655</span>
            </a>
            <span className="hidden md:inline text-[#c77722]/30">•</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-[#8a7258] hover:text-[#b36a18] transition-colors"
              aria-label="Return to Main Website"
            >
              <ArrowLeft size={11} />
              <span>Main Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          ROW 2: SINGLE COMBINED BRAND & CATEGORY NAVBAR
          [ VEDA STRUCTURE LOGO ]       [ Puja ] [ Yagya ] [ Japa ] [ Path ] [ Homa ] [ Puja in Kashi ]
      ========================================================= */}
      <div className="relative mx-auto flex h-[62px] max-w-[1360px] items-center justify-between px-4 sm:px-6">
        {/* Far Left: Existing Veda Structure Branding */}
        <Link
          to="/yagya-puja"
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90"
          aria-label="Veda Structure - Puja & Yagya Home"
        >
          {/* Sacred Vedic Emblem SVG */}
          <div className="flex h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] shrink-0 items-center justify-center">
            <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
              <circle cx="24" cy="24" r="5" fill="#c88918" />
              <path d="M24 4 C29 10 30 15 24 20 C18 15 19 10 24 4Z" fill="#8c6a2f" />
              <path d="M44 24 C38 29 33 30 28 24 C33 18 38 19 44 24Z" fill="#8c6a2f" />
              <path d="M24 44 C19 38 18 33 24 28 C30 33 29 38 24 44Z" fill="#8c6a2f" />
              <path d="M4 24 C10 19 15 18 20 24 C15 30 10 29 4 24Z" fill="#8c6a2f" />
              <path d="M10 10 C18 11 22 14 21 20 C15 21 11 18 10 10Z" fill="#a47a32" />
              <path d="M38 10 C37 18 33 21 27 20 C26 14 30 11 38 10Z" fill="#a47a32" />
              <path d="M38 38 C30 37 26 34 27 28 C33 27 37 30 38 38Z" fill="#a47a32" />
              <path d="M10 38 C11 30 15 27 21 28 C22 34 18 37 10 38Z" fill="#a47a32" />
            </svg>
          </div>

          <div>
            <p className="font-serif text-[17px] sm:text-[19px] font-bold leading-tight tracking-[-0.01em] text-[#241c15] whitespace-nowrap">
              VEDA STRUCTURE
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#b36a18] whitespace-nowrap">
                Yagya &amp; Puja
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop: Navigation (Upcoming Puja + 6 Ritual Categories) */}
        <nav
          className="hidden lg:flex flex-1 items-center justify-center pl-4 xl:pl-8"
          aria-label="Ritual Disciplines"
        >
          <div className="flex items-center gap-1 xl:gap-2">
            {/* Upcoming Puja Link */}
            <Link
              to="/puja/upcoming"
              className={`group relative flex items-center rounded-full px-3 xl:px-4 py-2 text-[13px] xl:text-[13.5px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                location.pathname.startsWith("/puja/upcoming")
                  ? "bg-gradient-to-r from-[#d99426]/18 to-[#c98218]/12 text-[#b36a18] font-bold shadow-[inset_0_-2px_0_#c77722]"
                  : "text-[#3c3125] hover:bg-[#faf4e6] hover:text-[#b36a18]"
              }`}
            >
              <span>Upcoming Puja</span>
            </Link>

            {RITUAL_NAV_TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              const isOpen = openDropdown === tab.id;
              const data = categoriesData[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onMouseEnter={() => handleMouseEnterTab(tab.id)}
                  onMouseLeave={handleMouseLeaveTab}
                  onClick={() => setOpenDropdown(isOpen ? null : tab.id)}
                  className={`group relative flex items-center gap-1.5 xl:gap-2 rounded-full px-3 xl:px-4 py-2 text-[13px] xl:text-[13.5px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-[#d99426]/18 to-[#c98218]/12 text-[#b36a18] font-bold shadow-[inset_0_-2px_0_#c77722]"
                      : isOpen
                      ? "bg-[#faf2df] text-[#b36a18]"
                      : "text-[#3c3125] hover:bg-[#faf4e6] hover:text-[#b36a18]"
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span>{tab.label}</span>

                  {/* Dynamic count badge */}
                  {data?.loaded && !data?.error && data?.items?.length > 0 && (
                    <span className="rounded-full bg-[#fbf0db] px-1.5 py-0.5 text-[9.5px] font-bold text-[#b36a18] leading-none shrink-0 border border-[#ebdcc2]">
                      {data.items.length}
                    </span>
                  )}

                  {data?.loading && (
                    <Loader2
                      size={10}
                      className="animate-spin text-[#c77722] shrink-0"
                    />
                  )}

                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#b36a18]" : "text-[#8c7b69]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile / Tablet Toggle (< lg) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 rounded-full border border-[#ebdcc2] bg-[#fbf5e8] px-3.5 py-2 text-[12px] font-bold text-[#b36a18] hover:bg-[#faf0dc] transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Ritual Categories Menu"
          >
            {isMobileMenuOpen ? (
              <>
                <X size={15} />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu size={15} />
                <span>Categories</span>
                <span className="rounded-full bg-[#ebdcc2]/60 px-1.5 py-0.2 text-[10px]">
                  6
                </span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================
            WIDE CREAM DROPDOWN PANEL (Directly below Row 2)
        ========================================================= */}
        {currentOpenTab && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full z-50 px-4 sm:px-6 pt-1"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="mx-auto max-w-[1360px]">
              <div className="overflow-hidden rounded-2xl border border-[#ead2a4] bg-[#fffdfa] shadow-[0_16px_44px_rgba(70,50,25,0.13)] animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Header Row: Uppercase label on left, "View All" on right */}
                <div className="flex items-center justify-between border-b border-[#ebdcc2] bg-gradient-to-r from-[#fcf5e9] to-[#faf0dc] px-8 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b36a18]">
                      {currentOpenTab.heading}
                    </span>
                    {categoriesData[currentOpenTab.id]?.loaded &&
                      !categoriesData[currentOpenTab.id]?.error &&
                      categoriesData[currentOpenTab.id]?.items?.length > 0 && (
                        <span className="rounded-full bg-[#fbf0db] px-2 py-0.5 text-[10px] font-bold text-[#b36a18] border border-[#ebdcc2]">
                          {categoriesData[currentOpenTab.id].items.length} {currentOpenTab.countLabel}
                        </span>
                      )}
                  </div>

                  <Link
                    to={currentOpenTab.path}
                    onClick={() => setOpenDropdown(null)}
                    className="group inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b36a18] transition-colors hover:text-[#8a4b08]"
                  >
                    <span>{currentOpenTab.viewAllLabel}</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Body: Multi-column clean grid of category names */}
                <div className="px-8 py-6">
                  {categoriesData[currentOpenTab.id]?.loading ? (
                    <div className="flex items-center justify-center gap-2.5 py-8 text-[13px] text-[#8a7c6b]">
                      <Loader2 size={16} className="animate-spin text-[#c77722]" />
                      <span>Loading {currentOpenTab.label} categories…</span>
                    </div>
                  ) : categoriesData[currentOpenTab.id]?.error ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <AlertCircle size={20} className="text-[#c77722]" />
                      <p className="text-[13px] text-[#75695c]">
                        Unable to load {currentOpenTab.label} categories.
                      </p>
                      <button
                        type="button"
                        onClick={() => loadCategoryData(currentOpenTab.id, true)}
                        className="text-[12px] font-bold text-[#b36a18] underline hover:text-[#8a4b08] cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  ) : categoriesData[currentOpenTab.id]?.items?.length === 0 ? (
                    <div className="py-6 text-center text-[13px] text-[#75695c]">
                      No {currentOpenTab.countLabel.toLowerCase()} available at this time.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                      {categoriesData[currentOpenTab.id].items.map((item) => {
                        const itemUrl =
                          item.path ||
                          (currentOpenTab.categoryRoutePrefix
                            ? `${currentOpenTab.categoryRoutePrefix}${item.slug}`
                            : currentOpenTab.path);
                        const isCurrent = location.pathname === itemUrl;

                        return (
                          <Link
                            key={item.id || item.slug}
                            to={itemUrl}
                            onClick={() => setOpenDropdown(null)}
                            className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all duration-150 ${
                              isCurrent
                                ? "bg-[#fbf0db] font-bold text-[#b36a18]"
                                : "font-medium text-[#2b2218] hover:bg-[#faf4e6] hover:text-[#b36a18]"
                            }`}
                          >
                            <span className="text-[13.5px] truncate">
                              {item.name}
                            </span>
                            <ArrowRight
                              size={12}
                              className={`shrink-0 transition-all ${
                                isCurrent
                                  ? "text-[#b36a18]"
                                  : "text-[#c2b4a3] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#b36a18]"
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MOBILE / TABLET ACCORDION MENU (< lg)
      ========================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ebdcc2] bg-[#fffdf9] px-4 py-3 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a18]">
            RITUAL DISCIPLINES
          </p>
          <div className="divide-y divide-[#ebdcc2]/60 rounded-xl border border-[#ebdcc2] bg-white overflow-hidden">
            {/* Upcoming Puja Link */}
            <div className="bg-[#fffdf9]">
              <Link
                to="/puja/upcoming"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex min-h-[48px] w-full items-center justify-between px-4 py-2.5 text-left text-[13.5px] font-bold ${
                  location.pathname.startsWith("/puja/upcoming")
                    ? "text-[#b36a18] bg-[#fbf0db]"
                    : "text-[#241c15] hover:text-[#b36a18]"
                }`}
              >
                <span>Upcoming Puja</span>
                <ArrowRight size={14} className="text-[#8a7c6b]" />
              </Link>
            </div>

            {RITUAL_NAV_TABS.map((tab) => {
              const data = categoriesData[tab.id];
              const isExpanded = mobileExpanded === tab.id;
              const isActive = activeTabId === tab.id;

              return (
                <div key={tab.id} className="bg-[#fffdf9]">
                  <button
                    type="button"
                    onClick={() => {
                      const next = isExpanded ? null : tab.id;
                      setMobileExpanded(next);
                      if (next && !loadedRef.current.has(next)) {
                        loadedRef.current.add(next);
                        loadCategoryData(next);
                      }
                    }}
                    className="flex min-h-[48px] w-full items-center justify-between px-4 py-2.5 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13.5px] font-bold ${
                          isActive ? "text-[#b36a18]" : "text-[#241c15]"
                        }`}
                      >
                        {tab.label}
                      </span>
                      {data?.loaded && !data?.error && data?.items?.length > 0 && (
                        <span className="rounded-full bg-[#fbf0db] px-1.5 py-0.5 text-[9.5px] font-bold text-[#b36a18]">
                          {data.items.length}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-[#b36a18]" : "text-[#8a7c6b]"
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#ebdcc2]/50 bg-[#fffaf2] px-4 py-3">
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a18]">
                          {tab.heading}
                        </span>
                        <Link
                          to={tab.path}
                          className="text-[11.5px] font-bold text-[#b36a18] hover:underline"
                        >
                          {tab.viewAllLabel} →
                        </Link>
                      </div>

                      {data?.loading ? (
                        <div className="flex items-center gap-2 py-3 text-[12px] text-[#8a7c6b]">
                          <Loader2 size={13} className="animate-spin text-[#c77722]" />
                          <span>Loading…</span>
                        </div>
                      ) : data?.error ? (
                        <div className="py-2 text-center text-[12px] text-[#75695c]">
                          Unable to load categories.{" "}
                          <button
                            type="button"
                            onClick={() => loadCategoryData(tab.id, true)}
                            className="font-bold text-[#b36a18] underline cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 pt-1">
                          {data.items.map((item) => {
                            const itemUrl =
                              item.path ||
                              (tab.categoryRoutePrefix
                                ? `${tab.categoryRoutePrefix}${item.slug}`
                                : tab.path);
                            const isCurrent = location.pathname === itemUrl;

                            return (
                              <Link
                                key={item.id || item.slug}
                                to={itemUrl}
                                className={`flex min-h-[40px] items-center rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                                  isCurrent
                                    ? "bg-[#fbf0db] font-bold text-[#b36a18]"
                                    : "font-medium text-[#2b241d] hover:bg-[#faf4e6] hover:text-[#b36a18]"
                                }`}
                              >
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default YagyaPujaNavBar;
