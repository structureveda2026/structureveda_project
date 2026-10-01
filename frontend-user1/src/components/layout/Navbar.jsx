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

// Featured astrologers for navbar dropdown
const NAVBAR_ASTROLOGERS = [
  { name: "Vishal Bhardwaj", slug: "vishal-bhardwaj" },
  { name: "Acharya Anurag Bhardwaj", slug: "acharya-anurag-bhardwaj" },
];

// Yagya & Puja dropdown items
const YAGYA_PUJA_NAV_ITEMS = [
  { label: "Puja", path: "/yagya-puja/puja" },
  { label: "Yagya", path: "/yagya-puja/yagya" },
  { label: "Japa / Chanting", path: "/yagya-puja/japa" },
  { label: "Path / Recitation", path: "/yagya-puja/path" },
  { label: "Homa / Havan", path: "/yagya-puja/homa" },
  { label: "Puja in Kashi", path: "/yagya-puja/kashi" },
];

// Veda Library nav items
const VEDA_LIBRARY_NAV_ITEMS = [
  {
    label: "01. Vedic Knowledge (Vedas & Vedanga)",
    path: "/library?node=vedic-knowledge",
  },
  {
    label: "02. Shastra & Darshana (Six Systems)",
    path: "/library?node=shastra-darshana",
  },
  {
    label: "03. Itihasa & Purana (Ramayana & Mahabharata)",
    path: "/library?node=itihasa-purana",
  },
  {
    label: "04. Dharma & Jeevan (16 Samskaras)",
    path: "/library?node=dharma-jeevan",
  },
  {
    label: "05. Puja & Anushthana (Sacred Rites)",
    path: "/library?node=puja-anushthana",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAstrologerDropdownOpen, setIsAstrologerDropdownOpen] =
    useState(false);
  const [isYagyaPujaDropdownOpen, setIsYagyaPujaDropdownOpen] = useState(false);
  const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileAstrologerOpen, setIsMobileAstrologerOpen] = useState(false);
  const [isMobileYagyaPujaOpen, setIsMobileYagyaPujaOpen] = useState(false);
  const [isMobileLibraryOpen, setIsMobileLibraryOpen] = useState(false);

  const accountDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName =
    user?.fullName || user?.name || user?.email || "Account";

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
        setIsYagyaPujaDropdownOpen(false);
        setIsLibraryDropdownOpen(false);
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
            className="relative"
            onMouseEnter={() => setIsYagyaPujaDropdownOpen(true)}
            onMouseLeave={() => setIsYagyaPujaDropdownOpen(false)}
          >
            <Link
              to="/yagya-puja"
              className="flex items-center gap-1 rounded-full px-2.5 py-1.5 whitespace-nowrap text-[13px] xl:text-[13.5px] font-semibold text-[#4e4337] transition-all hover:bg-amber-500/10 hover:text-[#b36a18]"
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
              <div className="absolute left-0 top-full z-50 pt-2 w-[240px]">
                <div className="overflow-hidden rounded-2xl border border-[#ebd2a0] bg-[#fffdf9] shadow-[0_16px_40px_rgba(80,60,30,0.14)] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-[#ebdcc2] bg-gradient-to-r from-[#fbf3e4] to-[#faf0db] px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a18]">
                      YAGYA & PUJA
                    </p>
                  </div>

                  <div className="p-1.5">
                    {YAGYA_PUJA_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsYagyaPujaDropdownOpen(false)}
                        className="group flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left transition-colors hover:bg-[#faf4e6]"
                      >
                        <span className="text-[13px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#b36a18]">
                          {item.label}
                        </span>
                        <ArrowRight
                          size={13}
                          className="text-[#8a7c6b] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-[#b36a18]"
                        />
                      </Link>
                    ))}
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
              >
                <span>Yagya & Puja</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isMobileYagyaPujaOpen ? "rotate-180 text-[#b36a18]" : ""
                  }`}
                />
              </button>
              {isMobileYagyaPujaOpen && (
                <div className="space-y-1.5 pb-2">
                  {YAGYA_PUJA_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setIsMobileYagyaPujaOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-[#ebd6ab] bg-[#fffdf9] px-4 py-2.5 text-left text-[13px] font-semibold text-[#241c15] transition-colors hover:bg-[#faf4e6]"
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
