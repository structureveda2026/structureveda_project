import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const VishalNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#3a3026] bg-[#1E1A16]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[75px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center">
            <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
              <circle cx="24" cy="24" r="5" fill="#C9A227" />
              <path d="M24 4 C29 10 30 15 24 20 C18 15 19 10 24 4Z" fill="#C9A227" />
              <path d="M44 24 C38 29 33 30 28 24 C33 18 38 19 44 24Z" fill="#C9A227" />
              <path d="M24 44 C19 38 18 33 24 28 C30 33 29 38 24 44Z" fill="#C9A227" />
              <path d="M4 24 C10 19 15 18 20 24 C15 30 10 29 4 24Z" fill="#C9A227" />
            </svg>
          </div>
          <div>
            <p className="font-serif text-[19px] leading-none tracking-[-0.02em] text-[#F7F4ED]">
              VEDA STRUCTURE
            </p>
            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.24em] text-[#C9A227]">
              Wisdom, Worldwide
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
          >
            Home
          </Link>
          <Link
            to="/astrologers/vishal-bhardwaj"
            className="text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
          >
            Astrology Consultation
          </Link>
          <a
            href="#profile"
            className="text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
          >
            About
          </a>
          <a
            href="#faq"
            className="text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/login"
            className="text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
          >
            Login / Sign Up
          </Link>
          <Link
            to="/book-consultation"
            className="rounded-lg bg-[#C9A227] px-6 py-2.5 text-[13px] font-semibold text-[#121212] transition-all hover:bg-[#E8D28A]"
          >
            BOOK CONSULTATION
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#F7F4ED] hover:bg-[#3a3026] lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#3a3026] bg-[#1E1A16] px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-[14px] font-medium text-[#E8D28A]"
            >
              Home
            </Link>
            <Link
              to="/astrologers/vishal-bhardwaj"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-[14px] font-medium text-[#E8D28A]"
            >
              Astrology Consultation
            </Link>
            <a
              href="#profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-[14px] font-medium text-[#E8D28A]"
            >
              About
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-[14px] font-medium text-[#E8D28A]"
            >
              FAQ
            </a>
            <div className="mt-4 space-y-3 border-t border-[#3a3026] pt-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[14px] font-medium text-[#E8D28A]"
              >
                Login / Sign Up
              </Link>
              <Link
                to="/book-consultation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg bg-[#C9A227] px-6 py-3 text-center text-[14px] font-semibold text-[#121212]"
              >
                BOOK CONSULTATION
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default VishalNavbar;
