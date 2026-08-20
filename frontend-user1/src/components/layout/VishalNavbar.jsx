import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const VishalNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/astrologers/vishal-bhardwaj/book-consultation");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#ead8b8] bg-[#fffaf0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-85"
        >
          {/* Logo Icon */}
          <div className="flex h-[42px] w-[42px] items-center justify-center">
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
            <p className="font-serif text-[20px] leading-none tracking-[-0.02em] text-[#2b241d]">
              VEDA STRUCTURE
            </p>
            <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.24em] text-[#b36c1e]">
              Wisdom, Worldwide
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-[13.5px] font-semibold text-[#5c4f42] transition-colors hover:text-[#c77722]"
          >
            Home
          </Link>
          <a
            href="#guidance-section"
            className="text-[13.5px] font-semibold text-[#5c4f42] transition-colors hover:text-[#c77722]"
          >
            Consultation Guidance
          </a>
          <a
            href="#packages"
            className="text-[13.5px] font-semibold text-[#5c4f42] transition-colors hover:text-[#c77722]"
          >
            Packages & Rates
          </a>
          <a
            href="#profile"
            className="text-[13.5px] font-semibold text-[#5c4f42] transition-colors hover:text-[#c77722]"
          >
            About Vishal
          </a>
          <a
            href="#faq"
            className="text-[13.5px] font-semibold text-[#5c4f42] transition-colors hover:text-[#c77722]"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/astrologers"
            className="text-[13px] font-semibold text-[#8c7e6c] transition-colors hover:text-[#2b241d]"
          >
            All Astrologers
          </Link>

          <button
            type="button"
            onClick={handleBookClick}
            className="group flex items-center gap-2 rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#2b241d] shadow-[0_4px_16px_rgba(234,177,44,0.22)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_8px_22px_rgba(234,177,44,0.32)]"
          >
            <span>BOOK CONSULTATION</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f8edd8] text-[#2b241d] transition-colors hover:bg-[#eab12c] lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#ead8b8] bg-[#fffaf0] px-5 py-6 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3.5">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#2b241d] hover:bg-[#f8edd8]"
            >
              Home
            </Link>
            <a
              href="#guidance-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#5c4f42] hover:bg-[#f8edd8]"
            >
              Consultation Guidance
            </a>
            <a
              href="#packages"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#5c4f42] hover:bg-[#f8edd8]"
            >
              Packages & Rates
            </a>
            <a
              href="#profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#5c4f42] hover:bg-[#f8edd8]"
            >
              About Vishal
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#5c4f42] hover:bg-[#f8edd8]"
            >
              FAQ
            </a>
            <Link
              to="/astrologers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-[14.5px] font-semibold text-[#8c7e6c] hover:bg-[#f8edd8]"
            >
              All Astrologers
            </Link>

            <div className="mt-4 border-t border-[#ead8b8] pt-4">
              <button
                type="button"
                onClick={handleBookClick}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_4px_16px_rgba(234,177,44,0.25)] transition-all hover:bg-[#dfa420]"
              >
                <span>BOOK CONSULTATION</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default VishalNavbar;
