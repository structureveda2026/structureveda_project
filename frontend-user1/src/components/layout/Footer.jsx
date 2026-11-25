import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  ChevronRight,
  Flower2,
  Flame,
  Sun,
  BookOpen,
  Sparkles,
  Calendar,
  Layers,
  MessageSquare,
  UserCheck,
  Library,
  Users,
  Headphones,
  HelpCircle,
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
} from "lucide-react";

/**
 * VEDA STRUCTURE CANONICAL FOOTER
 * Modern, responsive 4-column layout conforming to the authentic visual identity:
 * - Background: #FFFCF6
 * - Secondary Background: #F8F1E6
 * - Antique Gold: #B77920
 * - Deep Umber: #30251C
 * - Border: #EAD8BC
 *
 * Column Architecture:
 * - Column 1: Brand & Spiritual Sanctum (Logo, mission, verified Kashi sanctum, support email, verified social media)
 * - Column 2: Sacred Rituals (7 canonical ritual routes with 32px icon containers)
 * - Column 3: Wisdom & Consultations (4 canonical routes with matching 32px icon containers)
 * - Column 4: Trust & Policies (6 canonical Phase 1 routes with matching 32px icon containers)
 */

const SACRED_RITUAL_LINKS = [
  { label: "Puja Ceremonies", path: "/yagya-puja/puja", icon: Flower2 },
  { label: "Vedic Yagya", path: "/yagya-puja/yagya", icon: Flame },
  { label: "Japa Anushthana", path: "/yagya-puja/japa", icon: Sun },
  { label: "Shastric Path", path: "/yagya-puja/path", icon: BookOpen },
  { label: "Vedic Homa & Havan", path: "/yagya-puja/homa", icon: Sparkles },
  { label: "Upcoming Community Pujas", path: "/puja/upcoming", icon: Calendar },
  { label: "All Sacred Rituals", path: "/yagya-puja", icon: Layers },
];

const WISDOM_LINKS = [
  { label: "Book Consultation", path: "/book-consultation", icon: MessageSquare },
  { label: "All Astrologers", path: "/astrologers", icon: UserCheck },
  { label: "Veda Library", path: "/library", icon: Library },
  { label: "Community", path: "/community", icon: Users },
];

const TRUST_POLICY_LINKS = [
  { label: "Contact Support", path: "/contact", icon: Headphones },
  { label: "Frequently Asked Questions", path: "/faqs", icon: HelpCircle },
  { label: "Privacy & Data Policy", path: "/privacy", icon: ShieldCheck },
  { label: "Terms & Conditions", path: "/terms", icon: FileText },
  { label: "Refund & Cancellation Policy", path: "/refund-policy", icon: RotateCcw },
  { label: "Shipping & Delivery Policy", path: "/shipping-policy", icon: Truck },
];

const VERIFIED_SOCIAL_LINKS = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/vedastructure.official/",
    ariaLabel: "Follow Veda Structure on Instagram",
    svg: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/veda-structure-ba7517355/",
    ariaLabel: "Connect with Veda Structure on LinkedIn",
    svg: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0-.02-3.3 1.65 1.65 0 0 0 .02 3.3m1.39 9.74V9.93H5.07v8.57h2.78z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/vedastructure/",
    ariaLabel: "Follow Veda Structure on Facebook",
    svg: (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#EAD8BC] bg-[#FFFCF6] text-[#30251C] font-sans">
      {/* =========================================================
          MAIN FOUR-COLUMN FOOTER CONTAINER (NO TOP TRUST RIBBON)
      ========================================================== */}
      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ─────────────────────────────────────────────────────────
              COLUMN 1: BRAND & SPIRITUAL SANCTUM (4 COLS)
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              {/* Brand Header */}
              <Link to="/" className="flex w-fit items-center gap-3 group">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#d99426] via-[#f7ce68] to-[#c98218] text-[#1a1106] shadow-xs border border-[#ffea9f]/70 transition-transform duration-300 group-hover:scale-105">
                  <svg
                    viewBox="0 0 50 50"
                    className="h-6 w-6"
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
                  <span className="font-serif text-[20px] font-bold tracking-tight text-[#24170a] group-hover:text-[#B77920] transition-colors block leading-tight">
                    VEDA STRUCTURE
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#B77920] block">
                    WISDOM, WORLDWIDE
                  </span>
                </div>
              </Link>

              {/* Concise Mission Description */}
              <p className="mt-3.5 max-w-[360px] text-[13px] leading-relaxed text-[#5c4e3f]">
                Preserving authentic Vedic rituals, sacred shastric learning, and temple ceremonies with reverent transparency and spiritual purity.
              </p>

              {/* Verified Sanctum & Contact Card */}
              <div className="mt-4 space-y-2 rounded-xl border border-[#EAD8BC] bg-[#F8F1E6]/50 p-3 max-w-[360px]">
                <div className="flex items-start gap-2.5 text-[12px] text-[#4C3A29]">
                  <MapPin size={14} className="text-[#B77920] shrink-0 mt-0.5" />
                  <span>Spiritual Sanctum: Kashi (Varanasi), Uttar Pradesh, India</span>
                </div>

                <div className="flex items-center gap-2.5 text-[12px] text-[#4C3A29]">
                  <Mail size={14} className="text-[#B77920] shrink-0" />
                  <a
                    href="mailto:support@vedastructure.com"
                    className="hover:text-[#B77920] transition-colors font-medium underline underline-offset-2"
                  >
                    support@vedastructure.com
                  </a>
                </div>
              </div>

              {/* Official Verified Social Media Channels */}
              <div className="mt-4 max-w-[360px]">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#874204] mb-2 flex items-center gap-1">
                  <span className="text-[#B77920]">✦</span>
                  Connect With Us
                </p>
                <div className="flex items-center gap-2">
                  {VERIFIED_SOCIAL_LINKS.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.ariaLabel}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-[#EAD8BC] bg-[#F8F1E6]/70 text-[#4C3A29] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B77920] hover:bg-[#FFFDF9] hover:text-[#B77920] hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B77920]/40"
                    >
                      {soc.svg}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              COLUMN 2: SACRED RITUALS (3 COLS)
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h3 className="mb-3.5 font-serif text-[13px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-1.5 h-6">
              <span className="text-[#B77920]">✦</span>
              SACRED RITUALS
            </h3>

            <nav aria-label="Sacred Rituals Navigation" className="flex flex-col gap-1">
              {SACRED_RITUAL_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-[#F8F1E6]/80 hover:text-[#B77920]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#EAD8BC] bg-[#F8F1E6]/60 text-[#B77920] transition-colors group-hover:border-[#B77920] group-hover:bg-white group-hover:text-[#94580E]">
                        <IconComponent size={14} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-[#30251C] transition-colors group-hover:text-[#B77920] truncate">
                        {link.label}
                      </span>
                    </div>

                    <ChevronRight
                      size={12}
                      className="shrink-0 text-[#B77920] opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ─────────────────────────────────────────────────────────
              COLUMN 3: WISDOM & CONSULTATIONS (2 COLS)
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="mb-3.5 font-serif text-[13px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-1.5 h-6">
              <span className="text-[#B77920]">✦</span>
              WISDOM
            </h3>

            <nav aria-label="Wisdom and Consultations Navigation" className="flex flex-col gap-1">
              {WISDOM_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-[#F8F1E6]/80 hover:text-[#B77920]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#EAD8BC] bg-[#F8F1E6]/60 text-[#B77920] transition-colors group-hover:border-[#B77920] group-hover:bg-white group-hover:text-[#94580E]">
                        <IconComponent size={14} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-[#30251C] transition-colors group-hover:text-[#B77920] truncate">
                        {link.label}
                      </span>
                    </div>

                    <ChevronRight
                      size={12}
                      className="shrink-0 text-[#B77920] opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ─────────────────────────────────────────────────────────
              COLUMN 4: TRUST, SUPPORT & POLICIES (3 COLS)
          ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h3 className="mb-3.5 font-serif text-[13px] font-bold uppercase tracking-[0.16em] text-[#874204] flex items-center gap-1.5 h-6">
              <span className="text-[#B77920]">✦</span>
              TRUST &amp; POLICIES
            </h3>

            <nav aria-label="Trust and Legal Policies Navigation" className="flex flex-col gap-1">
              {TRUST_POLICY_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="group flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 hover:bg-[#F8F1E6]/80 hover:text-[#B77920]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#EAD8BC] bg-[#F8F1E6]/60 text-[#B77920] transition-colors group-hover:border-[#B77920] group-hover:bg-white group-hover:text-[#94580E]">
                        <IconComponent size={14} strokeWidth={2} />
                      </div>
                      <span className="text-[13px] font-medium text-[#30251C] transition-colors group-hover:text-[#B77920] truncate">
                        {link.label}
                      </span>
                    </div>

                    <ChevronRight
                      size={12}
                      className="shrink-0 text-[#B77920] opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM COPYRIGHT BAR
      ========================================================== */}
      <div className="border-t border-[#EAD8BC] bg-[#F8F1E6]/70 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[12px] text-[#78634E] text-center sm:text-left">
          <p>© 2026 Veda Structure. All rights reserved.</p>

          <p className="font-serif text-[12px] font-semibold text-[#874204]">
            Sanatan Dharma Sanctuary · Varanasi (Kashi), India
          </p>
        </div>
      </div>
    </footer>
  );
}
