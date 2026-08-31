import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, Menu, X, ChevronDown, ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { useToast } from "../ui/toastContext";

// Featured astrologers for navbar dropdown
const NAVBAR_ASTROLOGERS = [
  { name: "Vishal Bhardwaj", slug: "vishal-bhardwaj" },
  { name: "Acharya Anurag Bhardwaj", slug: "acharya-anurag-bhardwaj" }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAstrologerDropdownOpen, setIsAstrologerDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileAstrologerOpen, setIsMobileAstrologerOpen] = useState(false);

  const accountDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName = user?.fullName || user?.name || user?.email || "Account";

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsMenuOpen(false);
    setIsAccountDropdownOpen(false);
    showToast("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadcc2] bg-[#fffaf0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* =====================================================
            LOGO (Acts as Home)
        ====================================================== */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Logo Icon */}
          <div className="flex h-[43px] w-[43px] items-center justify-center">
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

          {/* Logo Text */}
          <div className="hidden sm:block">
            <p className="font-serif text-[21px] leading-none tracking-[-0.02em] text-[#2b241d]">
              VEDA STRUCTURE
            </p>
            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.24em] text-[#8a7c6b]">
              Wisdom, Worldwide
            </p>
          </div>
        </Link>

        {/* =====================================================
            CENTER NAVIGATION (Desktop)
        ====================================================== */}
        <nav className="ml-10 hidden items-center gap-8 lg:flex">
          {/* Talk to an Astrologer Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAstrologerDropdownOpen(true)}
            onMouseLeave={() => setIsAstrologerDropdownOpen(false)}
          >
            <Link
              to="/astrologers"
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#5f554a] transition-colors hover:text-[#c88918]"
            >
              Talk to an Astrologer
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isAstrologerDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {isAstrologerDropdownOpen && (
              <div className="absolute left-0 top-full z-50 pt-2 w-[280px]">
                <div className="overflow-hidden rounded-xl border border-[#e3ca97] bg-[#fffdf9] shadow-[0_12px_32px_rgba(80,60,30,0.12)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="border-b border-[#eee1ca] bg-[#faf6ed] px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c88918]">
                      TALK TO AN ASTROLOGER
                    </p>
                  </div>

                  {/* Astrologer List */}
                  <div className="py-1">
                    {NAVBAR_ASTROLOGERS.map((astrologer) => (
                      <button
                        key={astrologer.slug}
                        type="button"
                        onClick={() => {
                          window.open(`/astrologers/${astrologer.slug}`, "_blank", "noopener,noreferrer");
                          setIsAstrologerDropdownOpen(false);
                        }}
                        className="group flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#faf6ed]"
                      >
                        <span className="text-[13px] font-medium text-[#2b241d] transition-colors group-hover:text-[#c88918]">
                          {astrologer.name}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-[#8a7c6b] transition-all group-hover:translate-x-1 group-hover:text-[#c88918]"
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
            className="text-[14px] font-medium text-[#5f554a] transition-colors hover:text-[#c88918]"
          >
            Upcoming Puja
          </Link>

          {/* Vedic Yagyas Link */}
          <Link
            to="/yagya"
            className="text-[14px] font-medium text-[#5f554a] transition-colors hover:text-[#c88918]"
          >
            Vedic Yagyas
          </Link>
        </nav>

        {/* =====================================================
            RIGHT SIDE CONTROLS (Desktop)
        ====================================================== */}
        <div className="ml-auto hidden items-center gap-6 lg:flex">
          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Search"
              className="text-[#2b241d] transition-colors hover:text-[#c88918]"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            <Link
              to="/wishlist"
              aria-label="Favorites"
              className="text-[#2b241d] transition-colors hover:text-[#c88918]"
            >
              <Heart size={20} strokeWidth={1.8} />
            </Link>
          </div>

          {/* Account Dropdown or Login */}
          {isAuthenticated ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[#e5d8c0] bg-white px-4 py-2 text-[13px] font-medium text-[#2b241d] transition-all hover:border-[#c88918] hover:text-[#c88918]"
                aria-expanded={isAccountDropdownOpen}
                aria-haspopup="true"
              >
                <User size={16} />
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isAccountDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="overflow-hidden rounded-xl border border-[#e3ca97] bg-[#fffdf9] shadow-[0_12px_32px_rgba(80,60,30,0.12)]">
                    {/* Header */}
                    <div className="border-b border-[#eee1ca] bg-[#faf6ed] px-4 py-3">
                      <p className="truncate text-[13px] font-semibold text-[#2b241d]">
                        {displayName}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-[#75695c]">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/bookings"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-center justify-between px-4 py-2.5 text-[13px] text-[#2b241d] transition-colors hover:bg-[#faf6ed] hover:text-[#c88918]"
                      >
                        My Consultations
                        <ArrowRight size={12} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="group flex items-center justify-between px-4 py-2.5 text-[13px] text-[#2b241d] transition-colors hover:bg-[#faf6ed] hover:text-[#c88918]"
                      >
                        Favorites
                        <ArrowRight size={12} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#eee1ca] py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-[13px] text-[#2b241d] transition-colors hover:bg-[#faf6ed] hover:text-[#c88918]"
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
              className="rounded-full border border-[#e5d8c0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#2b241d] transition-all hover:border-[#c88918] hover:text-[#c88918]"
            >
              Login / Sign Up
            </Link>
          )}

          {/* Book Consultation CTA */}
          <Link
            to="/book-consultation"
            className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-semibold text-[#2b241d] shadow-[0_4px_12px_rgba(203,151,32,0.15)] transition-all hover:bg-[#dca522] hover:shadow-[0_6px_16px_rgba(203,151,32,0.22)]"
          >
            BOOK CONSULTATION
          </Link>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-4 flex h-10 w-10 items-center justify-center rounded-lg text-[#2b241d] hover:bg-[#f4e8d1] lg:hidden"
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {isMenuOpen && (
        <div className="border-t border-[#eadcc2] bg-[#fffaf0] px-5 py-5 lg:hidden">
          <nav className="flex flex-col">
            {/* Talk to an Astrologer */}
            <div className="border-b border-[#eee1ca]">
              <button
                type="button"
                onClick={() => setIsMobileAstrologerOpen(!isMobileAstrologerOpen)}
                className="flex w-full items-center justify-between py-3 text-left text-[14px] font-medium text-[#5f554a]"
              >
                Talk to an Astrologer
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isMobileAstrologerOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobileAstrologerOpen && (
                <div className="space-y-1 pb-3">
                  {NAVBAR_ASTROLOGERS.map((astrologer) => (
                    <button
                      key={astrologer.slug}
                      type="button"
                      onClick={() => {
                        window.open(`/astrologers/${astrologer.slug}`, "_blank", "noopener,noreferrer");
                        setIsMobileAstrologerOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border border-[#e3ca97] bg-[#fffdf9] px-4 py-2.5 text-left text-[13px] font-medium text-[#2b241d] transition-colors hover:bg-[#faf6ed]"
                    >
                      {astrologer.name}
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
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Upcoming Puja
            </Link>

            {/* Vedic Yagyas */}
            <Link
              to="/yagya"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Vedic Yagyas
            </Link>

            {/* Book Consultation */}
            <Link
              to="/book-consultation"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Book a Consultation
            </Link>

            {/* Search */}
            <button
              type="button"
              className="border-b border-[#eee1ca] py-3 text-left text-[14px] font-medium text-[#5f554a]"
            >
              Search
            </button>

            {/* Favorites */}
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Favorites
            </Link>

            {/* Account Section */}
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <div className="rounded-lg border border-[#e3ca97] bg-[#faf6ed] px-4 py-3">
                  <p className="text-[13px] font-semibold text-[#2b241d]">{displayName}</p>
                  <p className="mt-0.5 text-[11px] text-[#75695c]">{user?.email}</p>
                </div>
                <Link
                  to="/bookings"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg border border-[#e3ca97] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d]"
                >
                  My Consultations
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-[#d9bd7b] px-4 py-2.5 text-[13px] font-medium text-[#2b241d] transition hover:border-[#c88918] hover:text-[#c88918]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 block rounded-full bg-[#eab12c] px-5 py-3 text-center text-[14px] font-semibold text-[#2b241d]"
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
