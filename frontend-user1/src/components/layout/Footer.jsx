import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#e5dac6] bg-[#fbf1de] text-[#5f554b]">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-16 lg:px-10">
        {/* Brand */}
        <div>
          <Link to="/" className="mb-5 flex w-fit items-center gap-3">
            {/* Logo */}
            <div className="flex h-[42px] w-[42px] items-center justify-center">
              <svg
                viewBox="0 0 50 50"
                className="h-full w-full"
                aria-hidden="true"
              >
                <circle cx="25" cy="25" r="7" fill="#b88935" />

                <path
                  d="M25 3
                     C29 8 32 10 37 11
                     C35 16 37 20 45 22
                     C40 25 40 30 45 33
                     C38 34 35 38 36 45
                     C31 41 27 42 25 47
                     C22 42 18 41 13 45
                     C14 38 11 34 5 33
                     C10 30 10 25 5 22
                     C13 20 15 16 13 11
                     C18 10 21 8 25 3Z"
                  fill="none"
                  stroke="#b88935"
                  strokeWidth="2"
                />

                <circle cx="25" cy="25" r="3" fill="#fbf1de" />
              </svg>
            </div>

            <div>
              <h2 className="font-serif text-[21px] tracking-[-0.02em] text-[#201b17]">
                VEDA STRUCTURE
              </h2>

              <p className="mt-0.5 text-[9px] font-medium tracking-[0.2em] text-[#897b6c]">
                WISDOM, WORLDWIDE
              </p>
            </div>
          </Link>

          <p className="max-w-[320px] text-[14px] leading-6 text-[#76695c]">
            Making wisdom easier through online worldwide. Sacred products,
            authentic prasadam, guided courses and trusted experts, all in one
            calm place.
          </p>

          {/* Social Icons */}
          <div className="mt-7 flex gap-2.5">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d5bc] bg-[#fffdf9] transition hover:border-[#d6a13b] hover:text-[#b36c1e]"
            >
              <span className="text-[15px] font-semibold">◎</span>
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d5bc] bg-[#fffdf9] transition hover:border-[#d6a13b] hover:text-[#b36c1e]"
            >
              <span className="text-[15px] font-bold">f</span>
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d5bc] bg-[#fffdf9] transition hover:border-[#d6a13b] hover:text-[#b36c1e]"
            >
              <span className="text-[13px] font-bold">▶</span>
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d5bc] bg-[#fffdf9] transition hover:border-[#d6a13b] hover:text-[#b36c1e]"
            >
              <span className="text-[14px] font-semibold">𝕏</span>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-6 font-serif text-[15px] font-semibold tracking-[0.14em] text-[#201b17]">
            EXPLORE
          </h3>

          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Shop
            </Link>

            <Link
              to="/prasad"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Prasadam
            </Link>

            <Link
              to="/courses"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Courses
            </Link>

            <Link
              to="/consultancy"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Book a Consultancy
            </Link>
          </nav>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="mb-6 font-serif text-[15px] font-semibold tracking-[0.14em] text-[#201b17]">
            CUSTOMER SUPPORT
          </h3>

          <nav className="flex flex-col gap-4">
            <Link
              to="/contact"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Contact Us
            </Link>

            <Link
              to="/faqs"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              FAQs
            </Link>

            <Link
              to="/shipping"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Shipping & Delivery
            </Link>

            <Link
              to="/returns"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Returns & Refunds
            </Link>

            <Link
              to="/privacy"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-6 font-serif text-[15px] font-semibold tracking-[0.14em] text-[#201b17]">
            MY ACCOUNT
          </h3>

          <nav className="flex flex-col gap-4">
            <Link
              to="/login"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Login
            </Link>

            <Link
              to="/orders"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              My Orders
            </Link>

            <Link
              to="/bookings"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              My Bookings
            </Link>

            <Link
              to="/my-courses"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              My Courses
            </Link>

            <Link
              to="/wishlist"
              className="w-fit text-[14px] transition hover:text-[#b36c1e]"
            >
              Wishlist
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e5dac6]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-6 py-6 text-[12px] text-[#806f5e] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© 2026 Veda Structure. All rights reserved.</p>

          <p>Making Wisdom Easier Through Online Worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
