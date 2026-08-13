import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";
import { useToast } from "../ui/toastContext";

const navLinkClass = ({ isActive }) =>
  `text-[14px] font-medium transition-colors ${
    isActive ? "text-[#c88918]" : "text-[#5f554a] hover:text-[#c88918]"
  }`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const displayName = user?.fullName || user?.name || user?.email || "Account";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsMenuOpen(false);
    showToast("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadcc2] bg-[#fffaf0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center px-5 sm:px-8 lg:px-12">
        {/* =====================================================
            LEFT : LOGO
        ====================================================== */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Logo Icon */}
          <div className="flex h-[43px] w-[43px] items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="h-full w-full"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="5" fill="#c88918" />

              <path
                d="M24 4
                   C29 10 30 15 24 20
                   C18 15 19 10 24 4Z"
                fill="#8c6a2f"
              />

              <path
                d="M44 24
                   C38 29 33 30 28 24
                   C33 18 38 19 44 24Z"
                fill="#8c6a2f"
              />

              <path
                d="M24 44
                   C19 38 18 33 24 28
                   C30 33 29 38 24 44Z"
                fill="#8c6a2f"
              />

              <path
                d="M4 24
                   C10 19 15 18 20 24
                   C15 30 10 29 4 24Z"
                fill="#8c6a2f"
              />

              <path
                d="M10 10
                   C18 11 22 14 21 20
                   C15 21 11 18 10 10Z"
                fill="#a47a32"
              />

              <path
                d="M38 10
                   C37 18 33 21 27 20
                   C26 14 30 11 38 10Z"
                fill="#a47a32"
              />

              <path
                d="M38 38
                   C30 37 26 34 27 28
                   C33 27 37 30 38 38Z"
                fill="#a47a32"
              />

              <path
                d="M10 38
                   C11 30 15 27 21 28
                   C22 34 18 37 10 38Z"
                fill="#a47a32"
              />
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
            DESKTOP LEFT / CENTER NAV
        ====================================================== */}
        <nav className="ml-10 hidden items-center gap-8 lg:flex">
          {/* NEW: HOME */}
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {/* NEW: BOOK CONSULTATION */}
          <NavLink to="/book-consultation" className={navLinkClass}>
            Book a Consultation
          </NavLink>

          <NavLink to="/astrologers" className={navLinkClass}>
            Talk to an Astrologer
          </NavLink>
        </nav>

        {/* =====================================================
            DESKTOP RIGHT NAV
        ====================================================== */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {/* <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <NavLink to="/prasad" className={navLinkClass}>
            Prasadam
          </NavLink>

          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>

          <NavLink to="/consult-expert" className={navLinkClass}>
            Consult an Expert
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink> */}

          {/* Icons */}
          <div className="ml-2 flex items-center gap-5 border-l border-[#e5d8c0] pl-6">
            <button
              type="button"
              aria-label="Search"
              className="text-[#2b241d] transition-colors hover:text-[#c88918]"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="text-[#2b241d] transition-colors hover:text-[#c88918]"
            >
              <Heart size={20} strokeWidth={1.8} />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping bag"
              className="text-[#2b241d] transition-colors hover:text-[#c88918]"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
            </Link>

            {isAuthenticated ? (
              <>
                <span
                  className="ml-2 max-w-36 truncate text-[13px] font-semibold text-[#2b241d]"
                  title={displayName}
                >
                  {displayName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-[#d9bd7b] px-5 py-2.5 text-[13px] font-semibold text-[#2b241d] transition-all hover:border-[#c88918] hover:text-[#c88918]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="
                  ml-2
                  rounded-full
                  bg-[#eab12c]
                  px-6
                  py-3
                  text-[13px]
                  font-semibold
                  text-[#2b241d]
                  shadow-[0_5px_15px_rgba(203,151,32,0.15)]
                  transition-all
                  hover:bg-[#dca522]
                  hover:shadow-[0_7px_18px_rgba(203,151,32,0.22)]
                "
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </nav>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-[#2b241d] hover:bg-[#f4e8d1] lg:hidden"
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
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Home
            </NavLink>

            <NavLink
              to="/book-consultation"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Book a Consultation
            </NavLink>

            <NavLink
              to="/astrologers"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Talk to an Astrologer
            </NavLink>

            <NavLink
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Shop
            </NavLink>

            <NavLink
              to="/prasad"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Prasadam
            </NavLink>

            <NavLink
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Courses
            </NavLink>

            <NavLink
              to="/consult-expert"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              Consult an Expert
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="border-b border-[#eee1ca] py-3 text-[14px] font-medium text-[#5f554a]"
            >
              About Us
            </NavLink>

            {isAuthenticated ? (
              <div className="mt-5 space-y-3">
                <p className="text-center text-[14px] font-semibold text-[#2b241d]">
                  {displayName}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-[#d9bd7b] px-5 py-3 text-center text-[14px] font-semibold text-[#2b241d] transition hover:border-[#c88918] hover:text-[#c88918]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-5 rounded-full bg-[#eab12c] px-5 py-3 text-center text-[14px] font-semibold text-[#2b241d]"
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
