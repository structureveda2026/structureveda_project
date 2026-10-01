import { Link } from "react-router-dom";
import {
  Award,
  Globe2,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t-2 border-[#ebd399] bg-gradient-to-b from-[#fffbf4] via-[#fbf2de] to-[#f5e3bc] text-[#24170a] font-sans shadow-inner">
      {/* Ambient Warm Golden Aura Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />

      {/* =========================================================
          TOP SACRED SHLOKA & TRUST PROMISES RIBBON
      ========================================================== */}
      <div className="border-b border-[#e9cb8f] bg-gradient-to-r from-[#faebd0]/95 via-[#f7dfb0]/95 to-[#faebd0]/95 py-6 px-6 lg:px-10 backdrop-blur-md">
        <div className="mx-auto max-w-[1240px]">
          {/* Sacred Vedic Shloka Bar */}
          <div className="text-center mb-6">
            <p className="font-serif text-[18px] sm:text-[21px] font-bold text-[#7a3b02] tracking-wide leading-snug drop-shadow-xs">
              <span className="text-[#d97706] mr-2 select-none">✦</span>
              ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
              <span className="text-[#d97706] ml-2 select-none">✦</span>
            </p>
            <p className="mt-1 font-serif text-[12.5px] sm:text-[13.5px] text-[#5e442c] italic">
              “Lead us from ignorance to truth, from darkness to light, from mortality to immortality.” — Brihadaranyaka Upanishad
            </p>
          </div>

          {/* 4 Pillars Trust Row */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:gap-5">
            {[
              {
                icon: Award,
                title: "100% Vedic Authentic",
                desc: "Ritual energized items",
              },
              {
                icon: Globe2,
                title: "Worldwide Delivery",
                desc: "Serving 40+ countries",
              },
              {
                icon: ShieldCheck,
                title: "Verified Acharyas",
                desc: "Direct temple lineage",
              },
              {
                icon: PackageCheck,
                title: "Sacred Packaging",
                desc: "Sealed fresh prasadam",
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-center gap-3.5 rounded-2xl border border-[#ebd09b] bg-white/95 p-3.5 shadow-[0_4px_16px_rgba(180,120,40,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-amber-500 hover:shadow-[0_8px_24px_rgba(217,148,38,0.18)] hover:bg-white"
                >
                  <div className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#fef3d6] to-[#fbdc8e] border border-[#f5cc76] text-[#944e08] shadow-2xs">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#26180a]">
                      {pillar.title}
                    </p>
                    <p className="text-[11px] text-[#78634e]">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN FOOTER COLUMNS
      ========================================================== */}
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-12">
          {/* BRAND COLUMN */}
          <div>
            <Link to="/" className="mb-4 flex w-fit items-center gap-3 group">
              {/* Luxury Gilded Logo Emblem */}
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#d99426] via-[#f7ce68] to-[#c98218] text-[#1a1106] shadow-[0_4px_16px_rgba(217,148,38,0.35)] border border-[#ffea9f]/70 transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 50 50"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <circle cx="25" cy="25" r="7" fill="#1a1106" />
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
                    stroke="#1a1106"
                    strokeWidth="2.5"
                  />
                  <circle cx="25" cy="25" r="3" fill="#ffd777" />
                </svg>
              </div>

              <div>
                <h2 className="font-serif text-[21px] font-bold tracking-tight text-[#24170a] group-hover:text-[#b36a18] transition-colors">
                  VEDA STRUCTURE
                </h2>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.26em] text-[#b46814]">
                  WISDOM, WORLDWIDE
                </p>
              </div>
            </Link>

            <p className="max-w-[340px] text-[13.5px] leading-relaxed text-[#5e4b38]">
              Making wisdom easier through online worldwide. Sacred products,
              authentic prasadam, guided courses and trusted experts, all in one
              calm place.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {[
                {
                  name: "Instagram",
                  url: "https://instagram.com",
                  hoverClass: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(220,39,67,0.35)]",
                  svg: (
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  name: "YouTube",
                  url: "https://youtube.com",
                  hoverClass: "hover:bg-[#ff0000] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(255,0,0,0.35)]",
                  svg: (
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  name: "Facebook",
                  url: "https://facebook.com",
                  hoverClass: "hover:bg-[#1877f2] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(24,119,242,0.35)]",
                  svg: (
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  name: "X (Twitter)",
                  url: "https://x.com",
                  hoverClass: "hover:bg-[#0f1419] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
                  svg: (
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  name: "WhatsApp",
                  url: "https://whatsapp.com",
                  hoverClass: "hover:bg-[#25D366] hover:text-white hover:border-transparent hover:shadow-[0_8px_20px_rgba(37,211,102,0.35)]",
                  svg: (
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  ),
                },
              ].map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  className={`grid h-10 w-10 place-items-center rounded-2xl border border-[#ebd09b] bg-white text-[#6b4c24] shadow-[0_3px_10px_rgba(180,120,40,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 ${soc.hoverClass}`}
                >
                  {soc.svg}
                </a>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-2">
              <span className="text-[#d97706]">✦</span>
              EXPLORE
            </h3>

            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", path: "/" },
                { label: "Veda Library", path: "https://veda-library-five.vercel.app/library", isExternal: true },
                { label: "Shop", path: "/shop" },
                { label: "Prasadam", path: "/prasad" },
                { label: "Courses", path: "/courses" },
                { label: "Upcoming Puja", path: "/puja/upcoming" },
                { label: "Book a Consultancy", path: "/book-consultation" },
              ].map((link) => link.isExternal ? (
                <a
                  key={link.label}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-[13.5px] font-medium text-[#4c3a29] transition-all duration-200 hover:text-[#b36a18] hover:translate-x-1"
                >
                  <span className="text-[10px] text-amber-600/70 group-hover:text-[#b36a18]">›</span>
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  className="group flex items-center gap-2 text-[13.5px] font-medium text-[#4c3a29] transition-all duration-200 hover:text-[#b36a18] hover:translate-x-1"
                >
                  <span className="text-[10px] text-amber-600/70 group-hover:text-[#b36a18]">›</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-2">
              <span className="text-[#d97706]">✦</span>
              CUSTOMER SUPPORT
            </h3>

            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Contact Us", path: "/contact" },
                { label: "FAQs", path: "/faqs" },
                { label: "Shipping & Delivery", path: "/shipping" },
                { label: "Returns & Refunds", path: "/returns" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms & Conditions", path: "/terms" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="group flex items-center gap-2 text-[13.5px] font-medium text-[#4c3a29] transition-all duration-200 hover:text-[#b36a18] hover:translate-x-1"
                >
                  <span className="text-[10px] text-amber-600/70 group-hover:text-[#b36a18]">›</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* MY ACCOUNT */}
          <div>
            <h3 className="mb-4 font-serif text-[14px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-2">
              <span className="text-[#d97706]">✦</span>
              MY ACCOUNT
            </h3>

            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Login", path: "/login" },
                { label: "My Orders", path: "/orders" },
                { label: "My Bookings", path: "/bookings" },
                { label: "My Courses", path: "/my-courses" },
                { label: "Wishlist", path: "/wishlist" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="group flex items-center gap-2 text-[13.5px] font-medium text-[#4c3a29] transition-all duration-200 hover:text-[#b36a18] hover:translate-x-1"
                >
                  <span className="text-[10px] text-amber-600/70 group-hover:text-[#b36a18]">›</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM COPYRIGHT BAR
      ========================================================== */}
      <div className="border-t border-[#e2c589] bg-[#ebd8ad]/70 py-4.5 px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2.5 text-[12px] text-[#6b543e] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Veda Structure. All rights reserved.</p>

          <p className="flex items-center gap-1.5 font-serif text-[13px] font-semibold text-[#874204]">
            <span className="text-[#d97706]">✦</span>
            <span>Making Wisdom Easier Through Online Worldwide</span>
            <span className="text-[#d97706]">✦</span>
          </p>

          <p className="text-[11.5px] text-[#8a6e53]">Sanatan Dharma Sanctuary</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
