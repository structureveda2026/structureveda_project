import { useState, useRef, useEffect, useCallback } from "react";
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
  ShoppingBag,
  Users,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { useToast } from "../ui/toastContext";

// Featured astrologers for navbar dropdown
const NAVBAR_ASTROLOGERS = [
  { name: "Vishal Bhardwaj", slug: "vishal-bhardwaj" },
  { name: "Acharya Anurag Bhardwaj", slug: "acharya-anurag-bhardwaj" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAstrologerDropdownOpen, setIsAstrologerDropdownOpen] =
    useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileAstrologerOpen, setIsMobileAstrologerOpen] = useState(false);

  const location = useLocation();
  const accountDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName =
    user?.fullName || user?.name || user?.email || "Account";

  const isYagyaPujaActive = location.pathname.startsWith("/yagya-puja");

  // Close dropdowns on location changes
  useEffect(() => {
    const timer = setTimeout(() => {
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
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsAstrologerDropdownOpen(false);
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

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsMenuOpen(false);
    setIsAccountDropdownOpen(false);
    showToast("You have been logged out.");
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ebdcc2] bg-[#fffcf7]/95 backdrop-blur-md shadow-[0_2px_14px_rgba(50,35,15,0.04)] font-sans transition-all">
      {/* =====================================================
          ROW 1: BRAND, PROMINENT SEARCH & USER ACTIONS
      ====================================================== */}
      <div className="border-b border-[#ebdcc2]/60">
        <div className="mx-auto flex h-[72px] xl:h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 xl:gap-8">
          {/* Left Region: Brand */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Logo Icon with Gilded Medallion */}
            <div className="grid h-[40px] w-[40px] sm:h-[42px] sm:w-[42px] place-items-center rounded-2xl bg-gradient-to-br from-[#d99426] via-[#f7ce68] to-[#c98218] shadow-[0_4px_14px_rgba(217,148,38,0.25)] border border-[#ffea9f]/80 transition-transform duration-300 group-hover:scale-105">
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
              <p className="font-serif text-[18.5px] xl:text-[20px] font-bold leading-none tracking-tight text-[#221910] group-hover:text-[#b36a18] transition-colors">
                VEDA STRUCTURE
              </p>
              <p className="mt-1 text-[8.5px] xl:text-[9px] font-bold uppercase tracking-[0.24em] text-[#c77a1e]">
                WISDOM, WORLDWIDE
              </p>
            </div>
          </Link>

          {/* Center Region: Prominent Desktop Search Bar (Desktop xl+) */}
          <div className="hidden xl:flex flex-1 max-w-[480px] 2xl:max-w-[560px] mx-auto items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full flex items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Pujas, Astrologers, Sacred Rituals..."
                className="w-full h-10 pl-11 pr-24 rounded-full border border-[#ebdcc2] bg-white text-[13px] text-[#2c2217] placeholder-[#8a7c6b] transition-all focus:border-[#b36a18] focus:outline-none focus:ring-2 focus:ring-[#b36a18]/15 shadow-2xs"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8a7c6b]">
                <Search size={16} strokeWidth={2.2} />
              </div>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7.5 px-3.5 rounded-full bg-gradient-to-r from-[#d99426] to-[#c98218] text-[#1a1106] text-[11px] font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Region: Desktop User Actions (Desktop xl+) */}
          <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 shrink-0">
            {/* Wishlist Button (Circular Outline) */}
            <Link
              to="/wishlist"
              aria-label="Favorites"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#ebdcc2] bg-white text-[#2c2217] transition-all hover:border-[#b36a18] hover:text-[#b36a18] hover:bg-[#faf4e6] hover:shadow-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <Heart size={16} strokeWidth={2.2} />
            </Link>

            {/* Account Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative" ref={accountDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#ebdcc2] bg-white px-3.5 text-[12.5px] font-semibold text-[#241c15] transition-all hover:border-[#b36a18] hover:text-[#b36a18] hover:bg-[#faf4e6] shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer"
                  aria-expanded={isAccountDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#f5ce6f] to-[#d99426] text-[#1c1308] text-[10px] font-bold">
                    <User size={12} />
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      isAccountDropdownOpen ? "rotate-180 text-[#b36a18]" : "text-[#8a7c6b]"
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
                className="flex h-10 items-center whitespace-nowrap rounded-full border border-[#ebdcc2] bg-white px-4 text-[12.5px] font-semibold text-[#2c2217] transition-all hover:border-[#b36a18] hover:bg-[#faf4e6] hover:text-[#b36a18] shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                Login / Sign Up
              </Link>
            )}

            {/* Book Consultation CTA Button */}
            <Link
              to="/book-consultation"
              className="veda-shimmer-wrap group inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#d99426] via-[#f5ce6f] to-[#c98218] px-5 text-[11.5px] 2xl:text-[12px] font-bold text-[#1c1308] shadow-[0_3px_14px_rgba(217,148,38,0.26)] border border-[#ffea9f]/80 transition-all duration-300 hover:shadow-[0_6px_22px_rgba(217,148,38,0.40)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wider uppercase cursor-pointer"
            >
              <span>BOOK CONSULTATION</span>
            </Link>
          </div>

          {/* Tablet / Mobile Actions (< xl) */}
          <div className="ml-auto flex items-center gap-2 xl:hidden shrink-0">
            <Link
              to="/shop"
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#ebdcc2] bg-white text-[#2c2217] transition-all hover:border-[#b36a18] hover:text-[#b36a18]"
            >
              <Search size={16} strokeWidth={2.2} />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Favorites"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#ebdcc2] bg-white text-[#2c2217] transition-all hover:border-[#b36a18] hover:text-[#b36a18]"
            >
              <Heart size={16} strokeWidth={2.2} />
            </Link>

            {/* Book Consultation button visible on tablet (md - lg) */}
            <Link
              to="/book-consultation"
              className="hidden md:inline-flex h-10 items-center whitespace-nowrap rounded-full bg-gradient-to-r from-[#d99426] via-[#f5ce6f] to-[#c98218] px-4 text-[11.5px] font-bold text-[#1c1308] shadow-[0_2px_10px_rgba(217,148,38,0.22)] border border-[#ffea9f]/80 transition-all hover:shadow-[0_4px_16px_rgba(217,148,38,0.32)] tracking-wide"
            >
              <span>CONSULTATION</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ebdcc2] bg-white text-[#2b241d] hover:bg-[#faf4e6] hover:border-[#b36a18] transition-all cursor-pointer"
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ROW 2: MAIN NAVIGATION ROW (Desktop xl+)
      ====================================================== */}
      <nav className="relative hidden xl:block bg-[#fffcf7] border-b border-[#ebdcc2]/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex h-[46px] items-center justify-center gap-8 2xl:gap-12">
          {/* Talk to an Astrologer Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAstrologerDropdownOpen(true)}
            onMouseLeave={() => setIsAstrologerDropdownOpen(false)}
          >
            <Link
              to="/astrologers"
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold text-[#2c2217] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
            >
              <span>Talk to an Astrologer</span>
              <ChevronDown
                size={13}
                strokeWidth={2.2}
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
            className="rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold text-[#2c2217] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
          >
            Upcoming Puja
          </Link>

          {/* Yagya & Puja — Opens dedicated landing in new tab */}
          <div>
            <button
              type="button"
              onClick={() => {
                window.open("/yagya-puja", "_blank", "noopener,noreferrer");
              }}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold transition-all cursor-pointer ${
                isYagyaPujaActive
                  ? "bg-amber-500/15 text-[#b36a18] font-bold"
                  : "text-[#2c2217] hover:bg-amber-500/10 hover:text-[#b36a18]"
              }`}
              aria-label="Open Yagya & Puja in new tab"
            >
              <span>Yagya & Puja</span>
              <ArrowRight
                size={13}
                strokeWidth={2.2}
                className="text-[#8a7c6b]"
              />
            </button>
          </div>

          {/* Veda Library Link */}
          <a
            href="https://veda-library-five.vercel.app/library"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold text-[#2c2217] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
          >
            Veda Library
          </a>

          {/* Community Link */}
          <Link
            to="/community"
            className={`rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold transition-all ${
              location.pathname.startsWith("/community")
                ? "bg-amber-500/15 text-[#b36a18] font-bold"
                : "text-[#2c2217] hover:bg-amber-500/10 hover:text-[#b36a18]"
            }`}
          >
            Community
          </Link>

          {/* Shop Link */}
          <a
            href="https://veda-shop.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-3.5 py-2 whitespace-nowrap text-[13.5px] 2xl:text-[14px] font-semibold text-[#2c2217] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
          >
            Shop
          </a>
          </div>
        </div>
      </nav>

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
                  className={`transition-transform ${isMobileAstrologerOpen ? "rotate-180 text-[#b36a18]" : ""
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

            {/* Yagya & Puja — Opens dedicated landing in new tab (mobile) */}
            <div className="border-b border-[#ebdcc2] pb-2">
              <button
                type="button"
                onClick={() => {
                  window.open("/yagya-puja", "_blank", "noopener,noreferrer");
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center justify-between py-3 text-left text-[14px] font-bold text-[#241c15]"
              >
                <span className={isYagyaPujaActive ? "text-[#b36a18]" : ""}>
                  Yagya & Puja
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#8a7c6b]"
                />
              </button>
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

            {/* Community */}
            <Link
              to="/community"
              onClick={() => setIsMenuOpen(false)}
              className={`border-b border-[#ebdcc2] py-3 text-[14px] font-bold flex items-center justify-between ${
                location.pathname.startsWith("/community") ? "text-[#b36a18]" : "text-[#241c15]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Users size={15} className="text-[#b36a18]" />
                <span>Community</span>
              </div>
              <ArrowRight size={14} className="text-[#8a7c6b]" />
            </Link>

            {/* Shop */}
            <a
              href="https://veda-shop.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#ebdcc2] py-3 text-[14px] font-bold text-[#b36a18] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={15} />
                <span>Shop</span>
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
