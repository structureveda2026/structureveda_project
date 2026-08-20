import { Link } from "react-router-dom";
import { ShieldCheck, UserRound, Clock } from "lucide-react";

const VishalFooter = () => {
  return (
    <footer className="border-t border-[#ead8b8] bg-[#f8edd8] text-[#5f554b]">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex w-fit items-center gap-3 transition-opacity hover:opacity-85">
              <div className="flex h-[40px] w-[40px] items-center justify-center">
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
                <p className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.2em] text-[#b36c1e]">
                  WISDOM, WORLDWIDE
                </p>
              </div>
            </Link>

            <p className="max-w-[280px] text-[13.5px] leading-relaxed text-[#75695c]">
              Personalized Vedic astrology consultations rooted in traditional Kashi wisdom and classical Parashari Jyotish principles.
            </p>

            {/* Micro Trust Indicators */}
            <div className="space-y-1.5 pt-2 text-[12px] font-medium text-[#685c4f]">
              <p className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#d4872b]" />
                100% Confidential Consultations
              </p>
              <p className="flex items-center gap-1.5">
                <UserRound size={14} className="text-[#d4872b]" />
                Direct 1-on-1 Astrologer Sessions
              </p>
            </div>
          </div>

          {/* Consultation Navigation */}
          <div>
            <p className="mb-4 font-serif text-[15px] font-bold tracking-[0.14em] text-[#2b241d]">
              CONSULTATION
            </p>
            <nav className="flex flex-col gap-2.5">
              <a
                href="#guidance-section"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Guidance Explorer
              </a>
              <a
                href="#packages"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Packages & Pricing
              </a>
              <a
                href="#profile"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                About Astrologer Vishal
              </a>
              <a
                href="#faq"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Consultation FAQs
              </a>
              <Link
                to="/astrologers/vishal-bhardwaj/book-consultation"
                className="w-fit text-[13.5px] font-bold text-[#b36c1e] transition-colors hover:text-[#2b241d]"
              >
                Book Session Now →
              </Link>
            </nav>
          </div>

          {/* Quick Links / Marketplace */}
          <div>
            <p className="mb-4 font-serif text-[15px] font-bold tracking-[0.14em] text-[#2b241d]">
              EXPLORE VEDA
            </p>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Veda Marketplace
              </Link>
              <Link
                to="/astrologers"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                All Vedic Astrologers
              </Link>
              <Link
                to="/courses"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Sanatan Courses
              </Link>
              <Link
                to="/products"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Sacred Products & Prasadam
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div>
            <p className="mb-4 font-serif text-[15px] font-bold tracking-[0.14em] text-[#2b241d]">
              SUPPORT & TRUST
            </p>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/contact"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Contact Support
              </Link>
              <Link
                to="/privacy"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Privacy & Data Policy
              </Link>
              <Link
                to="/terms"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Terms of Service
              </Link>
              <Link
                to="/bookings"
                className="w-fit text-[13.5px] font-medium text-[#685c4f] transition-colors hover:text-[#c77722]"
              >
                Manage My Bookings
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#ead8b8] pt-6 text-[12px] text-[#8a7c6b] sm:flex-row">
          <p>© 2026 Veda Structure. All rights reserved.</p>
          <p className="text-[11.5px] text-[#9c8d7c]">
            Rooted in Kashi Vishwanath Tradition • Built with Reverence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default VishalFooter;
