import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  ChevronRight,
  HelpCircle,
  Sparkles,
  BookOpen,
  Calendar,
  ShieldCheck,
} from "lucide-react";

/**
 * CONTACT SUPPORT PAGE (/contact)
 * Clean, reverent, minimal contact experience.
 * Displays only verified, confirmed contact channels:
 * - Email: support@vedastructure.com (mailto)
 * - Spiritual Sanctum: Kashi (Varanasi), Uttar Pradesh, India
 * NOTE: Omits placeholder telephone numbers and unverified forms.
 */
export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Support • Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf0] font-sans text-[#2b241d]">
      {/* ── Top Header / Breadcrumb Zone ── */}
      <div className="border-b border-[#ebdcc4] bg-[#fbf4e6]/70 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1080px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] font-medium text-[#7d6954]"
          >
            <Link to="/" className="transition-colors hover:text-[#b36c1e]">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#c2ab90]" />
            <span className="font-semibold text-[#2b241d]">Contact Support</span>
          </nav>

          {/* Heading */}
          <div className="mt-6">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                VEDIC SANCTUARY ASSISTANCE
              </span>
            </div>

            <h1 className="mt-2 font-serif text-[30px] font-bold text-[#2b241d] sm:text-[38px] lg:text-[42px] leading-tight">
              Connect with Veda Structure
            </h1>

            <p className="mt-2.5 max-w-[650px] text-[15px] leading-relaxed text-[#5c4e3f]">
              Whether you need guidance choosing an auspicious ceremony, assistance with family
              Sankalpa details, or consultation support, our team is at your service.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content Zone ── */}
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Primary Verified Channels Card (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-[#ebdcc4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(180,120,40,0.06)]">
              <h2 className="font-serif text-[20px] font-bold text-[#2b241d] border-b border-[#f3e9d8] pb-4">
                Official Support Channels
              </h2>

              <div className="mt-6 space-y-6">
                {/* 1. Support Email */}
                <div className="flex items-start gap-4 rounded-xl border border-[#ebd09b] bg-[#fffcf5] p-4 sm:p-5 transition-all hover:border-[#b36c1e]">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#fef3d6] to-[#fbdc8e] border border-[#f5cc76] text-[#944e08] shadow-2xs">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#26180a]">
                      Email Devotee Support
                    </h3>
                    <p className="mt-0.5 text-[12.5px] text-[#6d5a47]">
                      For ceremony inquiries, Sankalp modifications, and general assistance:
                    </p>
                    <a
                      href="mailto:support@vedastructure.com"
                      className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#b36c1e] hover:text-[#874204] underline underline-offset-4"
                    >
                      support@vedastructure.com
                    </a>
                    <p className="mt-1 text-[11px] text-[#8a7661]">
                      Responses typically provided within 24 to 48 hours.
                    </p>
                  </div>
                </div>

                {/* 2. Spiritual Sanctum Location */}
                <div className="flex items-start gap-4 rounded-xl border border-[#ebd09b] bg-[#fffcf5] p-4 sm:p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#fef3d6] to-[#fbdc8e] border border-[#f5cc76] text-[#944e08] shadow-2xs">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#26180a]">
                      Spiritual Sanctum
                    </h3>
                    <p className="mt-0.5 text-[13px] font-medium text-[#4c3a29]">
                      Kashi (Varanasi), Uttar Pradesh, India
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#6d5a47]">
                      All sacred rituals and Ganga offerings are coordinated directly with traditional
                      Acharya lineages in Varanasi.
                    </p>
                  </div>
                </div>

                {/* 3. Privacy & Discretion Note */}
                <div className="flex items-start gap-3 rounded-xl border border-[#e5dac6] bg-[#faf6ed] p-4 text-[#5c4e3f]">
                  <ShieldCheck size={18} className="shrink-0 text-[#b36c1e] mt-0.5" />
                  <p className="text-[12px] leading-relaxed">
                    <span className="font-semibold text-[#2b241d]">Devotional Discretion:</span> All
                    personal gotra details, birth charts, and consultation communications are kept strictly
                    confidential and never shared.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidance / Self-Help Column (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Common Questions Card */}
            <div className="rounded-2xl border border-[#ebdcc4] bg-white p-6 shadow-[0_4px_24px_rgba(180,120,40,0.06)]">
              <div className="flex items-center gap-2.5">
                <HelpCircle size={18} className="text-[#b36c1e]" />
                <h2 className="font-serif text-[17px] font-bold text-[#2b241d]">
                  Quick Self-Service Answers
                </h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6d5a47]">
                Many inquiries regarding family Sankalpas, remote ritual participation, and ceremony
                deliverables are answered in our comprehensive FAQ directory.
              </p>
              <Link
                to="/faqs"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ebd09b] bg-[#fffcf5] py-2.5 text-[13px] font-bold text-[#874204] hover:bg-[#faebd0] transition-colors"
              >
                <span>Browse Frequently Asked Questions</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Sacred Services Navigation Card */}
            <div className="rounded-2xl border border-[#ebdcc4] bg-white p-6 shadow-[0_4px_24px_rgba(180,120,40,0.06)]">
              <div className="flex items-center gap-2.5">
                <BookOpen size={18} className="text-[#b36c1e]" />
                <h2 className="font-serif text-[17px] font-bold text-[#2b241d]">
                  Explore Sacred Services
                </h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6d5a47]">
                Ready to configure an auspicious ceremony or speak with a Vedic scholar?
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  to="/yagya-puja"
                  className="flex items-center justify-between rounded-xl border border-[#ebdcc4]/60 bg-[#fffdfa] px-3.5 py-2.5 text-[13px] font-medium text-[#4c3a29] hover:border-[#b36c1e] hover:text-[#b36c1e] transition-colors"
                >
                  <span>Sacred Rituals (Puja, Yagya, Homa)</span>
                  <ChevronRight size={13} className="text-[#c2ab90]" />
                </Link>

                <Link
                  to="/book-consultation"
                  className="flex items-center justify-between rounded-xl border border-[#ebdcc4]/60 bg-[#fffdfa] px-3.5 py-2.5 text-[13px] font-medium text-[#4c3a29] hover:border-[#b36c1e] hover:text-[#b36c1e] transition-colors"
                >
                  <span>Book Astrologer Consultation</span>
                  <ChevronRight size={13} className="text-[#c2ab90]" />
                </Link>

                <Link
                  to="/library"
                  className="flex items-center justify-between rounded-xl border border-[#ebdcc4]/60 bg-[#fffdfa] px-3.5 py-2.5 text-[13px] font-medium text-[#4c3a29] hover:border-[#b36c1e] hover:text-[#b36c1e] transition-colors"
                >
                  <span>Explore Veda Library</span>
                  <ChevronRight size={13} className="text-[#c2ab90]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}