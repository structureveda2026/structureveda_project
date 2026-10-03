import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  User,
  Sparkles,
  Scroll,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { useToast } from "../ui/toastContext";
import pujaCatalogueService from "../../services/pujaCatalogueService";

// Featured astrologers for navbar dropdown
const NAVBAR_ASTROLOGERS = [
  { name: "Vishal Bhardwaj", slug: "vishal-bhardwaj" },
  { name: "Acharya Anurag Bhardwaj", slug: "acharya-anurag-bhardwaj" },
];

// Other Yagya & Puja disciplines
const YAGYA_PUJA_OTHER_ITEMS = [
  { label: "Yagya", path: "/yagya-puja/yagya" },
  { label: "Japa / Chanting", path: "/yagya-puja/japa" },
  { label: "Path / Recitation", path: "/yagya-puja/path" },
  { label: "Homa / Havan", path: "/yagya-puja/homa" },
  { label: "Puja in Kashi", path: "/yagya-puja/kashi" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAstrologerDropdownOpen, setIsAstrologerDropdownOpen] =
    useState(false);
  const [isYagyaPujaDropdownOpen, setIsYagyaPujaDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileAstrologerOpen, setIsMobileAstrologerOpen] = useState(false);
  const [isMobileYagyaPujaOpen, setIsMobileYagyaPujaOpen] = useState(false);
  const [isMobilePujaOpen, setIsMobilePujaOpen] = useState(false);

  // Dynamic Puja categories state
  const [pujaCategories, setPujaCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  const accountDropdownRef = useRef(null);
  const yagyaPujaDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName =
    user?.fullName || user?.name || user?.email || "Account";

  const isYagyaPujaActive = location.pathname.startsWith("/yagya-puja");
  const isPujaActive = location.pathname.startsWith("/yagya-puja/puja");

  // Load Puja categories on mount with session caching
  useEffect(() => {
    let isMounted = true;
    pujaCatalogueService.getPujaCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPujaCategories(data);
          setCategoriesLoading(false);
          setCategoriesError(false);
        }
      })
      .catch((err) => {
        console.error("Navbar: could not load Puja categories:", err);
        if (isMounted) {
          setCategoriesError(true);
          setCategoriesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdowns on location changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsYagyaPujaDropdownOpen(false);
      setIsAstrologerDropdownOpen(false);
      setIsAccountDropdownOpen(false);
      setIsMenuOpen(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
      if (
        yagyaPujaDropdownRef.current &&
        !yagyaPujaDropdownRef.current.contains(event.target)
      ) {
        setIsYagyaPujaDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsAstrologerDropdownOpen(false);
        setIsYagyaPujaDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsMenuOpen(false);
    setIsAccountDropdownOpen(false);
    showToast("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ebd7b2] bg-[#fffdfa]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(90,65,25,0.03)] font-sans">
      <div className="mx-auto flex h-[72px] sm:h-[78px] max-w-[1360px] items-center justify-between px-3 sm:px-4 lg:px-5 xl:px-6">
        {/* =====================================================
            LOGO (Acts as Home)
        ====================================================== */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-90"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Logo Icon with Gilded Medallion */}
          <div className="grid h-[36px] w-[36px] sm:h-[40px] sm:w-[40px] place-items-center rounded-2xl bg-gradient-to-br from-[#d99426] via-[#f7ce68] to-[#c98218] shadow-[0_4px_14px_rgba(217,148,38,0.3)] border border-[#ffea9f]/70 transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 48 48"
              className="h-5.5 w-5.5 sm:h-6 sm:w-6"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="5" fill="#1a1106" />
              <path
                d="M24 4 C29 10 30 15 24 20 C18 15 19 10 24 4Z"
                fill="#1a1106"
              />
              <path
                d="M44 24 C38 29 33 30 28 24 C33 18 38 19 44 24Z"
                fill="#1a1106"
              />
              <path
                d="M24 44 C19 38 18 33 24 28 C30 33 29 38 24 44Z"
                fill="#1a1106"
              />
              <path
                d="M4 24 C10 19 15 18 20 24 C15 30 10 29 4 24Z"
                fill="#1a1106"
              />
              <circle cx="24" cy="24" r="2.5" fill="#ffd777" />
            </svg>
          </div>

          {/* Logo Text */}
          <div className="hidden sm:block">
            <p className="font-serif text-[18px] xl:text-[20px] font-bold leading-none tracking-tight text-[#241c15] group-hover:text-[#b36a18] transition-colors">
              VEDA STRUCTURE
            </p>
            <p className="mt-0.5 text-[8.5px] xl:text-[9px] font-bold uppercase tracking-[0.22em] text-[#d4872b]">
              Wisdom, Worldwide
            </p>
          </div>
        </Link>

        {/* =====================================================
            CENTER NAVIGATION (Desktop xl+)
        ====================================================== */}
        <nav className="ml-3 xl:ml-4 2xl:ml-6 hidden items-center gap-1 xl:gap-1.5 2xl:gap-3 xl:flex">
          {/* Talk to an Astrologer Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAstrologerDropdownOpen(true)}
            onMouseLeave={() => setIsAstrologerDropdownOpen(false)}
          >
            <Link
              to="/astrologers"
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] font-semibold text-[#4e4337] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
            >
              <span>Talk to an Astrologer</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isAstrologerDropdownOpen ? "rotate-180 text-[#b36a18]" : "text-[#8a7c6b]"
                }`}
              />
            </Link>

            {isAstrologerDropdownOpen && (
              <div className="absolute left-0 top-full z-50 pt-2 w-[270px]">
                <div className="overflow-hidden rounded-2xl border border-[#ebd2a0] bg-[#fffdf9] shadow-[0_16px_40px_rgba(80,60,30,0.14)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="border-b border-[#ebdcc2] bg-gradient-to-r from-[#fbf3e4] to-[#faf0db] px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a18] flex items-center gap-1.5">
                      <Sparkles size={11} />
                      TALK TO AN ASTROLOGER
                    </p>
                  </div>

                  {/* Astrologer List */}
                  <div className="p-1.5 divide-y divide-[#f7eedf]">
                    {NAVBAR_ASTROLOGERS.map((astrologer) => (
                      <button
                        key={astrologer.slug}
                        type="button"
                        onClick={() => {
                          window.open(
                            `/astrologers/${astrologer.slug}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsAstrologerDropdownOpen(false);
                        }}
                        className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#faf4e6] cursor-pointer"
                      >
                        <span className="text-[13px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#b36a18]">
                          {astrologer.name}
                        </span>
                        <ArrowRight
                          size={13}
                          className="text-[#8a7c6b] transition-all group-hover:translate-x-1 group-hover:text-[#b36a18]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Puja Link */}
          <Link
            to="/puja/upcoming"
            className="rounded-full px-2.5 py-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] font-semibold text-[#4e4337] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
          >
            Upcoming Puja
          </Link>

          {/* Yagya & Puja Dropdown */}
          <div
            ref={yagyaPujaDropdownRef}
            className="relative"
            onMouseEnter={() => setIsYagyaPujaDropdownOpen(true)}
            onMouseLeave={() => setIsYagyaPujaDropdownOpen(false)}
          >
            <Link
              to="/yagya-puja"
              className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] font-semibold transition-all ${
                isYagyaPujaActive
                  ? "bg-amber-500/15 text-[#b36a18]"
                  : "text-[#4e4337] hover:bg-amber-500/10 hover:text-[#b36a18]"
              }`}
              aria-expanded={isYagyaPujaDropdownOpen}
              aria-haspopup="true"
            >
              <span>Yagya & Puja</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isYagyaPujaDropdownOpen ? "rotate-180 text-[#b36a18]" : "text-[#8a7c6b]"
                }`}
              />
            </Link>

            {isYagyaPujaDropdownOpen && (
              <div className="absolute left-[-220px] xl:left-[-260px] top-full z-50 pt-2 w-[900px] xl:w-[960px] max-w-[calc(100vw-32px)]">
                <div className="overflow-hidden rounded-xl border border-[#ebdcc2] bg-[#fffdfa] shadow-[0_16px_40px_rgba(40,28,15,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Top Horizontal Row: Ritual Services Navigation */}
                  <div className="border-b border-[#ebdcc2]/80 bg-[#fbf7ee]/50 px-8 py-3.5">
                    <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#b36a18]">
                      RITUAL SERVICES
                    </p>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[14px]">
                      {/* Puja (Active Service Tab) */}
                      <Link
                        to="/yagya-puja/puja"
                        onClick={() => setIsYagyaPujaDropdownOpen(false)}
                        className="group relative pb-1 font-bold text-[#1f160e] transition-colors hover:text-[#b36a18]"
                      >
                        <span>Puja</span>
                        {/* Active Gold Indicator */}
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#c77722]" />
                      </Link>

                      {/* Other Ritual Services */}
                      {YAGYA_PUJA_OTHER_ITEMS.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsYagyaPujaDropdownOpen(false)}
                          className="pb-1 font-semibold text-[#483d31] transition-colors hover:text-[#b36a18]"
                        >
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Main Content Area: Puja Categories */}
                  <div className="px-8 py-6">
                    {/* Header: Title + View All Pujas Link */}
                    <div className="mb-4 flex items-center justify-between border-b border-[#ebdcc2]/60 pb-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#b36a18]">
                        PUJA CATEGORIES
                      </p>
                      <Link
                        to="/yagya-puja/puja"
                        onClick={() => setIsYagyaPujaDropdownOpen(false)}
                        className="group inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#b36a18] transition-colors hover:text-[#8a4b08] hover:underline"
                      >
                        <span>View All Pujas</span>
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>

                    {/* Category List: Clean Multi-Column Text Links */}
                    {categoriesLoading ? (
                      <div className="grid grid-cols-2 gap-x-12 gap-y-3.5 py-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <div
                            key={n}
                            className="h-6 w-48 rounded bg-[#ebdcc2]/30 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : categoriesError ? (
                      <div className="py-6 text-center">
                        <p className="text-[13px] text-[#75695c]">
                          Unable to load categories
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoriesLoading(true);
                            setCategoriesError(false);
                            pujaCatalogueService
                              .getPujaCategories(true)
                              .then((data) => {
                                setPujaCategories(data);
                                setCategoriesLoading(false);
                              })
                              .catch(() => {
                                setCategoriesError(true);
                                setCategoriesLoading(false);
                              });
                          }}
                          className="mt-2 text-[12px] font-semibold text-[#b36a18] underline cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-12 gap-y-3 pt-1">
                        {pujaCategories.map((cat) => {
                          const isCurrent =
                            location.pathname ===
                            `/yagya-puja/puja/category/${cat.slug}`;
                          return (
                            <Link
                              key={cat.id || cat.slug}
                              to={`/yagya-puja/puja/category/${cat.slug}`}
                              onClick={() => setIsYagyaPujaDropdownOpen(false)}
                              className={`block py-1 text-[15px] transition-colors duration-150 ${
                                isCurrent
                                  ? "font-bold text-[#b36a18]"
                                  : "font-medium text-[#221a12] hover:text-[#b36a18]"
                              }`}
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Veda Library Link */}
          <a
            href="https://veda-library-five.vercel.app/library"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-2.5 py-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] font-semibold text-[#4e4337] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
          >
            Veda Library
          </a>
        </nav>

        {/* =====================================================
            RIGHT SIDE CONTROLS (Desktop xl+)
        ====================================================== */}
        <div className="ml-auto hidden items-center gap-2 xl:gap-2.5 2xl:gap-3.5 xl:flex shrink-0">
          {/* Search Button */}
          <Link
            to="/shop"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ebd6ab] bg-white text-[#4e4337] transition-all hover:border-[#d99426] hover:text-[#b36a18] hover:shadow-xs"
          >
            <Search size={16} strokeWidth={2} />
          </Link>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            aria-label="Favorites"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ebd6ab] bg-white text-[#4e4337] transition-all hover:border-[#d99426] hover:text-[#b36a18] hover:shadow-xs"
          >
            <Heart size={16} strokeWidth={2} />
          </Link>

          {/* Account Dropdown or Login */}
          {isAuthenticated ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsAccountDropdownOpen(!isAccountDropdownOpen)
                }
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#ebd6ab] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#241c15] transition-all hover:border-[#d99426] hover:text-[#b36a18] shadow-2xs"
                aria-expanded={isAccountDropdownOpen}
                aria-haspopup="true"
              >
                <div className="grid h-5.5 w-5.5 place-items-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  <User size={12} />
                </div>
                <span className="max-w-[110px] truncate">{displayName}</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isAccountDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="overflow-hidden rounded-2xl border border-[#ebd2a0] bg-[#fffdf9] shadow-[0_16px_40px_rgba(80,60,30,0.14)]">
                    <div className="border-b border-[#ebdcc2] bg-gradient-to-r from-[#fbf3e4] to-[#faf0db] px-4 py-3">
                      <p className="truncate text-[13px] font-bold text-[#241c15]">
                        {displayName}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-[#75695c]">
                        {user?.email}
                      </p>
                    </div>

                    <div className="p-1.5">
                      <Link
                        to="/bookings"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[13px] font-medium text-[#241c15] transition-colors hover:bg-[#faf4e6] hover:text-[#b36a18]"
                      >
                        My Consultations
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                        />
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-center justify-between rounded-xl px-3.5 py-2 text-[13px] font-medium text-[#241c15] transition-colors hover:bg-[#faf4e6] hover:text-[#b36a18]"
                      >
                        Favorites
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                        />
                      </Link>
                    </div>

                    <div className="border-t border-[#ebdcc2] p-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3.5 py-2 text-left text-[13px] font-medium text-[#241c15] transition-colors hover:bg-rose-50 hover:text-rose-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="veda-glass-pill whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-bold text-[#3e3428] transition-all hover:border-[#d99426] hover:bg-white hover:text-[#b36a18] hover:shadow-xs"
            >
              Login / Sign Up
            </Link>
          )}

          {/* Book Consultation CTA Button */}
          <Link
            to="/book-consultation"
            className="veda-shimmer-wrap group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-veda-gold-gradient px-4 py-2 text-[12px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(217,148,38,0.28)] border border-[#ffea9f]/70 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(217,148,38,0.42)] hover:-translate-y-0.5 active:scale-95 tracking-wide"
          >
            <span>BOOK CONSULTATION</span>
          </Link>
        </div>

        {/* =====================================================
            TABLET / MOBILE CONTROLS (< xl)
        ====================================================== */}
        <div className="ml-auto flex items-center gap-2 xl:hidden shrink-0">
          <Link
            to="/shop"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ebd6ab] bg-white text-[#4e4337]"
          >
            <Search size={16} />
          </Link>

          <Link
            to="/wishlist"
            aria-label="Favorites"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ebd6ab] bg-white text-[#4e4337]"
          >
            <Heart size={16} />
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ebd6ab] bg-white text-[#2b241d] hover:bg-[#fbf4e5] cursor-pointer"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET MENU DRAWER (< xl)
      ====================================================== */}
      {isMenuOpen && (
        <div className="border-t border-[#ebdcc2] bg-[#fffdfa] px-5 py-5 xl:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {/* Talk to an Astrologer */}
            <div className="border-b border-[#ebdcc2] pb-2">
              <button
                type="button"
                onClick={() =>
                  setIsMobileAstrologerOpen(!isMobileAstrologerOpen)
                }
                className="flex w-full items-center justify-between py-3 text-left text-[14px] font-bold text-[#241c15]"
              >
                <span>Talk to an Astrologer</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isMobileAstrologerOpen ? "rotate-180 text-[#b36a18]" : ""
                  }`}
                />
              </button>
              {isMobileAstrologerOpen && (
                <div className="space-y-1.5 pb-2">
                  {NAVBAR_ASTROLOGERS.map((astrologer) => (
                    <button
                      key={astrologer.slug}
                      type="button"
                      onClick={() => {
                        window.open(
                          `/astrologers/${astrologer.slug}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                        setIsMobileAstrologerOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-[#ebd6ab] bg-[#fffdf9] px-4 py-2.5 text-left text-[13px] font-semibold text-[#241c15] transition-colors hover:bg-[#faf4e6]"
                    >
                      <span>{astrologer.name}</span>
                      <ArrowRight size={14} className="text-[#8a7c6b]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Puja */}
            <Link
              to="/puja/upcoming"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#ebdcc2] py-3 text-[14px] font-bold text-[#241c15]"
            >
              Upcoming Puja
            </Link>

            {/* Yagya & Puja Mobile Dropdown */}
            <div className="border-b border-[#ebdcc2] pb-2">
              <button
                type="button"
                onClick={() =>
                  setIsMobileYagyaPujaOpen(!isMobileYagyaPujaOpen)
                }
                className="flex w-full items-center justify-between py-3 text-left text-[14px] font-bold text-[#241c15]"
                aria-expanded={isMobileYagyaPujaOpen}
              >
                <span className={isYagyaPujaActive ? "text-[#b36a18]" : ""}>
                  Yagya & Puja
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isMobileYagyaPujaOpen ? "rotate-180 text-[#b36a18]" : ""
                  }`}
                />
              </button>
              {isMobileYagyaPujaOpen && (
                <div className="space-y-2 pb-2 pl-2">
                  <p className="px-1 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a18]">
                    RITUAL SERVICES
                  </p>
                  {/* Puja with Subcategories Accordion */}
                  <div className="rounded-xl border border-[#ebd6ab] bg-[#fffdf9] p-2">
                    <button
                      type="button"
                      onClick={() => setIsMobilePujaOpen(!isMobilePujaOpen)}
                      className="flex min-h-[44px] w-full items-center justify-between px-2 py-2 text-left text-[13.5px] font-bold text-[#241c15]"
                      aria-expanded={isMobilePujaOpen}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isPujaActive ? "text-[#b36a18]" : ""}>
                          Puja
                        </span>
                        <span className="rounded-full bg-[#fbf0db] px-2 py-0.5 text-[10px] font-bold text-[#b36a18]">
                          Active
                        </span>
                      </div>
                      <ChevronDown
                        size={15}
                        className={`transition-transform ${
                          isMobilePujaOpen ? "rotate-180 text-[#b36a18]" : ""
                        }`}
                      />
                    </button>

                    {isMobilePujaOpen && (
                      <div className="mt-1 space-y-1 border-t border-[#ebdcc2]/60 pt-2 pl-2">
                        <div className="flex items-center justify-between px-2 pb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b36a18]">
                            PUJA CATEGORIES
                          </span>
                          <Link
                            to="/yagya-puja/puja/all"
                            onClick={() => {
                              setIsMobileYagyaPujaOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="text-[11px] font-bold text-[#b36a18] hover:underline"
                          >
                            Browse All →
                          </Link>
                        </div>
                        {categoriesLoading ? (
                          <div className="space-y-1.5 py-1">
                            {[1, 2, 3].map((n) => (
                              <div
                                key={n}
                                className="h-8 rounded bg-[#ebdcc2]/40 animate-pulse"
                              />
                            ))}
                          </div>
                        ) : (
                          pujaCategories.map((cat) => {
                            const isCurrent =
                              location.pathname ===
                              `/yagya-puja/puja/category/${cat.slug}`;
                            return (
                              <Link
                                key={cat.id || cat.slug}
                                to={`/yagya-puja/puja/category/${cat.slug}`}
                                onClick={() => {
                                  setIsMobileYagyaPujaOpen(false);
                                  setIsMenuOpen(false);
                                }}
                                className={`flex min-h-[44px] items-center px-2.5 py-2 text-[13.5px] transition-colors ${
                                  isCurrent
                                    ? "font-bold text-[#b36a18]"
                                    : "font-medium text-[#2b241d] hover:text-[#b36a18]"
                                }`}
                              >
                                <span className="truncate">{cat.name}</span>
                              </Link>
                            );
                          })
                        )}

                        <Link
                          to="/yagya-puja/puja"
                          onClick={() => {
                            setIsMobileYagyaPujaOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="mt-1 flex min-h-[44px] items-center justify-between rounded-lg bg-[#faf2e1] px-3 py-2 text-[12px] font-bold text-[#b36a18] hover:bg-[#eab12c] hover:text-[#1c1308]"
                        >
                          <span>View All Pujas</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Other Ritual Services */}
                  {YAGYA_PUJA_OTHER_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setIsMobileYagyaPujaOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-[#ebd6ab] bg-[#fffdf9] px-4 py-2.5 text-left text-[13px] font-semibold text-[#241c15] transition-colors hover:bg-[#faf4e6]"
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} className="text-[#8a7c6b]" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Veda Library */}
            <a
              href="https://veda-library-five.vercel.app/library"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#ebdcc2] py-3 text-[14px] font-bold text-[#b36a18] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <Scroll size={15} />
                <span>Veda Library</span>
              </div>
              <ArrowRight size={14} className="text-[#8a7c6b]" />
            </a>

            {/* Book Consultation */}
            <Link
              to="/book-consultation"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#ebdcc2] py-3 text-[14px] font-bold text-[#241c15]"
            >
              Book a Consultation
            </Link>

            {/* Favorites */}
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#ebdcc2] py-3 text-[14px] font-bold text-[#241c15]"
            >
              Favorites & Wishlist
            </Link>

            {/* Account Section */}
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <div className="rounded-2xl border border-[#ebd6ab] bg-[#fbf4e5] px-4 py-3">
                  <p className="text-[13px] font-bold text-[#241c15]">
                    {displayName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#75695c]">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/bookings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl border border-[#ebd6ab] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#241c15]"
                >
                  My Consultations
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-[13px] font-semibold text-rose-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 block rounded-full bg-veda-gold-gradient px-5 py-3 text-center text-[14px] font-bold text-[#1a1106] shadow-md border border-[#ffea9f]/60"
              >
                Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
