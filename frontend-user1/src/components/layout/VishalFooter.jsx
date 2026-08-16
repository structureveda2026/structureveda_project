import { Link } from "react-router-dom";

const VishalFooter = () => {
  return (
    <footer className="border-t border-[#3a3026] bg-[#1E1A16] text-[#E8D28A]">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex w-fit items-center gap-3">
              <div className="flex h-[36px] w-[36px] items-center justify-center">
                <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                  <circle cx="24" cy="24" r="5" fill="#C9A227" />
                  <path d="M24 4 C29 10 30 15 24 20 C18 15 19 10 24 4Z" fill="#C9A227" />
                  <path d="M44 24 C38 29 33 30 28 24 C33 18 38 19 44 24Z" fill="#C9A227" />
                  <path d="M24 44 C19 38 18 33 24 28 C30 33 29 38 24 44Z" fill="#C9A227" />
                  <path d="M4 24 C10 19 15 18 20 24 C15 30 10 29 4 24Z" fill="#C9A227" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-[18px] tracking-[-0.02em] text-[#F7F4ED]">
                  VEDA STRUCTURE
                </h2>
                <p className="mt-0.5 text-[8px] font-medium tracking-[0.2em] text-[#C9A227]">
                  WISDOM, WORLDWIDE
                </p>
              </div>
            </Link>
            <p className="mt-4 max-w-[280px] text-[13px] leading-6 text-[#B8A88F]">
              Personalized Vedic astrology consultations rooted in traditional wisdom.
            </p>
          </div>

          {/* Consultation */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-semibold tracking-[0.14em] text-[#F7F4ED]">
              CONSULTATION
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/astrologers/vishal-bhardwaj"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Vedic Astrology
              </Link>
              <Link
                to="/book-consultation"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Book Consultation
              </Link>
              <a
                href="#profile"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                About Astrologer
              </a>
              <a
                href="#faq"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-semibold tracking-[0.14em] text-[#F7F4ED]">
              SUPPORT
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Contact Us
              </Link>
              <Link
                to="/privacy"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-semibold tracking-[0.14em] text-[#F7F4ED]">
              MY ACCOUNT
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                to="/login"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Login
              </Link>
              <Link
                to="/bookings"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                My Bookings
              </Link>
              <Link
                to="/"
                className="w-fit text-[13px] transition hover:text-[#C9A227]"
              >
                Return to Marketplace
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-[#3a3026] pt-6 text-center text-[12px] text-[#B8A88F]">
          <p>© 2026 Veda Structure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default VishalFooter;
