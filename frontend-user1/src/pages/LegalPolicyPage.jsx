import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  AlertCircle,
  Mail,
  ArrowRight,
} from "lucide-react";

/**
 * REUSABLE LEGAL POLICY PAGE COMPONENT
 * Supports:
 * - /privacy (Privacy Policy)
 * - /terms (Terms & Conditions)
 * - /refund-policy (Refund & Cancellation Policy)
 * - /shipping-policy (Shipping & Delivery Policy)
 *
 * Design System:
 * - Background: #FFFCF6 / #fffaf0
 * - Secondary Background: #F8F1E6
 * - Antique Gold: #B77920
 * - Deep Umber: #30251C
 * - Border: #EAD8BC
 *
 * NOTE: All policies carry a clear "Draft policy - pending client approval" banner
 * until final formal legal counsel approval is provided by the client.
 */

const POLICY_CONFIG = {
  privacy: {
    id: "privacy",
    canonicalPath: "/privacy",
    title: "Privacy & Data Policy",
    subtitle:
      "How Veda Structure collects, protects, and handles devotee personal and astrological information.",
    icon: ShieldCheck,
    lastUpdated: "November 2026",
    sections: [
      {
        title: "1. Sacred Trust & Devotee Privacy",
        paragraphs: [
          "At Veda Structure, we consider the spiritual trust of our devotees and patrons sacred. When you engage with our platform to book Vedic rituals, schedule astrologer consultations, or study sacred texts, you entrust us with personal and family information. We are committed to safeguarding this information with the highest standards of discretion and security.",
          "This policy outlines our practices regarding data collection, usage, and confidentiality across all Veda Structure services, digital platforms, and customer interactions.",
        ],
      },
      {
        title: "2. Information We Collect",
        paragraphs: [
          "To perform sacred rituals, horoscope casting, and consultation sessions authentically, we may collect the following details provided voluntarily by you:",
        ],
        bullets: [
          "Contact Details: Full name, email address, contact telephone or messaging number.",
          "Ritual & Sankalpa Information: Devotee gotra, birth nakshatra, rashi, family member names, and prayer intentions dedicated during ceremonies.",
          "Astrological Information: Exact date of birth, time of birth, and place of birth required to generate accurate Vedic Janam Kundali and divisional charts.",
          "Delivery Details: Postal delivery address for physical holy prasadam, consecrated samagri, or ritual yantras where applicable.",
          "Payment Information: Transaction identifiers, payment mode, and order summaries processed securely through certified payment gateways (e.g. Cashfree). Veda Structure does not store full credit card numbers or banking passwords.",
        ],
      },
      {
        title: "3. How Devotee Information is Used",
        paragraphs: [
          "The information collected is strictly utilized to fulfill devotional and astrological services requested by you:",
        ],
        bullets: [
          "Facilitating personalized Gotra Sankalpa recitations during Pujas, Yagyas, Japa Anushthans, and Homa ceremonies by designated Vedic Acharyas.",
          "Enabling 1-on-1 consultations and natal chart calculations with certified Vedic astrologers.",
          "Dispatching sanctified prasadam and ceremony tokens to your provided shipping destination.",
          "Sending automated booking confirmations, live ceremony schedules, and video recordings of your dedicated Sankalpa.",
          "Maintaining platform security and preventing fraudulent transactions.",
        ],
      },
      {
        title: "4. Astrological & Consultation Confidentiality",
        paragraphs: [
          "All personal conversations, life concerns, birth data, and remedies discussed during 1-on-1 astrologer consultations remain 100% confidential. Astrologer notes and horoscopes are accessible only to the presiding astrologer and the authenticated devotee.",
          "We never sell, rent, monetize, or publicly disclose personal astrological charts or family sankalpa records to any third party for marketing or commercial profiling.",
        ],
      },
      {
        title: "5. Data Security & Storage",
        paragraphs: [
          "We implement technical, administrative, and physical security measures to protect your personal data against unauthorized access, alteration, or disclosure. All digital transmission occurs over encrypted HTTPS/TLS protocols.",
          "Payment processing is handled via PCI-DSS compliant payment gateway partners. No sensitive banking credentials are stored on Veda Structure servers.",
        ],
      },
      {
        title: "6. Your Privacy Rights & Inquiries",
        paragraphs: [
          "You have the right to review, update, or request the deletion of your personal account information and family details at any time.",
          "For any questions regarding your data, privacy rights, or personal information handling, please contact our dedicated support team at support@vedastructure.com.",
        ],
      },
    ],
  },

  terms: {
    id: "terms",
    canonicalPath: "/terms",
    title: "Terms & Conditions",
    subtitle:
      "General terms governing platform usage, ritual arrangements, and consultation bookings.",
    icon: FileText,
    lastUpdated: "November 2026",
    sections: [
      {
        title: "1. Platform Overview & Acceptance",
        paragraphs: [
          "Welcome to Veda Structure. By accessing, browsing, or booking services through our website and platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions.",
          "Veda Structure operates as an authentic Vedic services facilitator, connecting devotees worldwide with traditional Kashi Acharyas, consecrated ritual ceremonies, personalized astrologer consultations, and authentic Sanatan wisdom resources.",
        ],
      },
      {
        title: "2. Ritual Services & Devotional Fulfillment",
        paragraphs: [
          "All ceremonies—including Pujas, Vedic Yagyas, Japa Anushthans, Shastric Paths, and Homa/Havan fire rituals—are conducted in accordance with traditional Vedic Shastras, authentic samagri, and consecrated procedures by qualified priests.",
        ],
        bullets: [
          "Sankalpa Dedication: Devotee names, gotras, and intentions provided during booking are incorporated into the sacred ceremony during the initial Sankalpa recitation.",
          "Remote Participation: Devotees booking remote rituals receive dedicated video confirmation recordings of their Gotra Sankalpa and ceremony execution.",
          "Spiritual Nature: Vedic ceremonies and astrologer guidance are spiritual in nature, performed in good faith according to ancient Sanatan tradition. Outcomes of spiritual rituals and astrological remedies reflect personal faith, karma, and divine grace and cannot be guaranteed as commercial or scientific deliverables.",
        ],
      },
      {
        title: "3. Astrologer Consultation Terms",
        paragraphs: [
          "Astrologer consultations provide guidance rooted in classical Parashari Jyotish and Sanatan principles based on the birth details supplied by the client.",
        ],
        bullets: [
          "Accuracy of Birth Details: Devotees are responsible for providing correct birth dates, times, and locations. Calculations depend strictly on provided inputs.",
          "Nature of Advice: Astrological advice, remedial suggestions, and gemstone recommendations are for personal guidance and spiritual insight. They should not substitute for professional legal, financial, or medical advice.",
          "Session Conduct: Devotees are expected to maintain respectful, civil communication during live 1-on-1 audio/video sessions.",
        ],
      },
      {
        title: "4. Booking Confirmations & Payments",
        paragraphs: [
          "Bookings are confirmed upon successful authorization and settlement through our secure payment gateway. An electronic booking confirmation and unique identifier are issued via email immediately upon confirmation.",
          "All published prices and dakshina schedules are displayed transparently in applicable currencies (INR, USD) prior to final checkout.",
        ],
      },
      {
        title: "5. Intellectual Property & Sacred Content",
        paragraphs: [
          "All website text, ritual descriptions, digital photographs, audio recordings, video documentation, graphics, and library materials are the intellectual property of Veda Structure or used under authorized license.",
          "Reproduction, redistribution, or commercial republication of Veda Structure content without explicit written permission is strictly prohibited.",
        ],
      },
      {
        title: "6. Limitation of Liability & Support",
        paragraphs: [
          "While Veda Structure takes every reasonable measure to ensure punctual ritual execution, qualified priesthood, and seamless consultation delivery, we are not liable for disruptions arising from acts of God, extreme natural events, regional temple closures, internet connectivity outages, or postal customs delays.",
          "For any service inquiries, clarifications, or assistance, please contact support@vedastructure.com.",
        ],
      },
    ],
  },

  refund: {
    id: "refund",
    canonicalPath: "/refund-policy",
    title: "Refund & Cancellation Policy",
    subtitle:
      "Transparent guidelines regarding ritual rescheduling, cancellations, and dakshina settlements.",
    icon: RefreshCw,
    lastUpdated: "November 2026",
    sections: [
      {
        title: "1. Sacred Rituals & Dakshina Commitments",
        paragraphs: [
          "Vedic ceremonies, Yagyas, Homas, and Japa Anushthans involve meticulous advance preparation. Once a booking is confirmed, consecrated samagri is procured, specific dates in the Hindu Panchang are reserved, and designated Vedic scholars and Acharyas are engaged exclusively for your family's ceremony.",
          "Because of these non-recoverable spiritual arrangements, cancellation and refund requests are subject to the guidelines outlined below.",
        ],
      },
      {
        title: "2. Ritual Cancellation & Rescheduling Guidelines",
        paragraphs: [
          "We understand that unforeseen life events may require changes to your planned ritual schedule. Whenever possible, we actively encourage rescheduling your ceremony to another auspicious tithi rather than cancellation.",
        ],
        bullets: [
          "Rescheduling Notice: Devotees may request to reschedule a booked ritual by contacting support prior to the scheduled ceremony date. Our team will coordinate with the presiding Acharyas to allocate the next mutually available date.",
          "Advance Cancellations: If a cancellation is requested well in advance before specific samagri has been consecrated or priesthood contracted, requests will be evaluated for eligible resolution or platform credit.",
          "Completed or Ongoing Ceremonies: Once a Vedic ceremony, multi-day Japa Anushthan, or Yagya has commenced, or after the sacred Gotra Sankalpa has been recited, the ceremony cannot be cancelled or refunded as spiritual rites have been fulfilled.",
        ],
      },
      {
        title: "3. Astrologer Consultation Rescheduling & Cancellations",
        paragraphs: [
          "Private 1-on-1 consultation sessions with Vedic astrologers require reserved professional time.",
        ],
        bullets: [
          "Slot Rescheduling: You can request to reschedule your consultation appointment slot prior to the session time without penalty by contacting support@vedastructure.com.",
          "Astrologer Unavailability: In the rare event that an astrologer is unable to conduct a scheduled session due to emergencies, devotees are provided an immediate choice between an expedited rescheduled slot or a full dakshina refund.",
          "Missed Sessions (No-Show): If a devotee misses a confirmed consultation session without prior notice, rescheduling is subject to astrologer availability.",
        ],
      },
      {
        title: "4. Service Disruption & Force Majeure",
        paragraphs: [
          "In the unlikely event that Veda Structure is unable to conduct a booked ritual due to temple administrative closures, natural calamities, or unforeseen circumstances, the devotee will be immediately notified. Devotees may choose between rescheduling the ceremony to the earliest auspicious alternative date or receiving a full refund.",
        ],
      },
      {
        title: "5. Refund Processing & Timelines",
        paragraphs: [
          "Approved refunds are initiated through the original payment gateway used at the time of booking. The settlement duration depends on your bank or card issuer's standard clearing schedule.",
          "For any refund assistance, please write to support@vedastructure.com quoting your booking reference number.",
        ],
      },
    ],
  },

  shipping: {
    id: "shipping",
    canonicalPath: "/shipping-policy",
    title: "Shipping & Delivery Policy",
    subtitle:
      "Information regarding dispatch, packing, and transit of consecrated Prasad and sacred items.",
    icon: Truck,
    lastUpdated: "November 2026",
    sections: [
      {
        title: "1. Sacred Packaging & Spiritual Reverence",
        paragraphs: [
          "For ceremonies that include physical deliverables—such as sanctified holy prasadam, consecrated raksha sutras, energised yantras, or sacred vibhuti—every package is packed with reverence following ritual conclusion.",
          "Prasadam items are hygienically sealed in food-grade packaging to preserve purity and freshness during transit from Kashi and designated temple sanctums.",
        ],
      },
      {
        title: "2. Dispatch & Fulfillment Timelines",
        paragraphs: [
          "Physical dispatch takes place only after the complete spiritual rites and blessing rituals have been performed.",
        ],
        bullets: [
          "Packaging & Blessing: Following ritual conclusion, items undergo final blessing and are packed within 2 to 4 business days.",
          "Domestic Delivery (Within India): Dispatched via reputed courier partners (e.g. Blue Dart, Delhivery, Speed Post). Delivery typically takes 4 to 8 business days depending on destination location.",
          "International Delivery: For overseas devotees (USA, UK, Canada, Australia, UAE, Europe), consecrated tokens and dry non-perishable holy samagri are dispatched via international courier services where postal and agricultural regulations permit.",
        ],
      },
      {
        title: "3. Address Accuracy & Devotee Responsibility",
        paragraphs: [
          "Devotees are requested to ensure complete and accurate shipping details—including recipient name, complete street address, postal pin code, and a reachable mobile phone number—during the booking checkout.",
          "Veda Structure cannot be held responsible for transit delays or package returns resulting from incomplete addresses, incorrect postal codes, or recipient unavailability.",
        ],
      },
      {
        title: "4. Tracking & Delivery Notifications",
        paragraphs: [
          "Once your sacred package is handed over to the logistics partner, an automated shipment notification containing the courier tracking number and URL is sent to your registered email address.",
          "Devotees can monitor the transit progress directly through the courier partner's tracking portal.",
        ],
      },
      {
        title: "5. International Customs & Regulatory Restrictions",
        paragraphs: [
          "Certain countries enforce strict agricultural, food, or quarantine import limitations on perishable food items, plant products, or natural offerings. In such regions, perishable prasad is substituted with consecrated dry sacred tokens (e.g. energized yantras, sacred threads, silver coins, or vibhuti) that comply with international transit laws.",
          "Any applicable local customs duties, taxes, or inspection charges imposed by the destination country remain the responsibility of the recipient.",
        ],
      },
      {
        title: "6. Damaged or Missing Shipments",
        paragraphs: [
          "If your package arrives in a damaged condition or is reported missing by the logistics provider, please notify support@vedastructure.com within 48 hours of delivery notification with photos of the damaged package. Our team will coordinate an expedited replacement of the sacred tokens.",
        ],
      },
    ],
  },
};

/**
 * Maps policy type to configuration
 */
export default function LegalPolicyPage({ policyType = "privacy" }) {
  const location = useLocation();

  // Resolve config from prop or pathname fallback
  let resolvedType = policyType;
  if (location.pathname === "/terms") resolvedType = "terms";
  else if (location.pathname === "/refund-policy" || location.pathname === "/returns" || location.pathname === "/refunds")
    resolvedType = "refund";
  else if (location.pathname === "/shipping-policy" || location.pathname === "/shipping")
    resolvedType = "shipping";
  else if (location.pathname === "/privacy" || location.pathname === "/privacy-policy")
    resolvedType = "privacy";

  const config = POLICY_CONFIG[resolvedType] || POLICY_CONFIG.privacy;
  const IconComponent = config.icon;

  useEffect(() => {
    document.title = `${config.title} • Veda Structure`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [config.title]);

  const navPolicies = [
    { type: "privacy", label: "Privacy Policy", path: "/privacy" },
    { type: "terms", label: "Terms & Conditions", path: "/terms" },
    { type: "refund", label: "Refund Policy", path: "/refund-policy" },
    { type: "shipping", label: "Shipping Policy", path: "/shipping-policy" },
  ];

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
            <span className="text-[#a47a32]">Legal &amp; Policies</span>
            <ChevronRight size={12} className="text-[#c2ab90]" />
            <span className="font-semibold text-[#2b241d]">{config.title}</span>
          </nav>

          {/* Heading */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#ebd09b] bg-white text-[#b36c1e] shadow-xs">
                  <IconComponent size={20} />
                </div>
                <div>
                  <h1 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px] lg:text-[38px] leading-tight">
                    {config.title}
                  </h1>
                </div>
              </div>
              <p className="mt-2.5 max-w-[700px] text-[14.5px] leading-relaxed text-[#5c4e3f]">
                {config.subtitle}
              </p>
            </div>

            <div className="shrink-0 self-start sm:self-auto rounded-full border border-[#ebd09b] bg-white/80 px-3.5 py-1 text-[11.5px] font-semibold text-[#8a6026]">
              Last Updated: {config.lastUpdated}
            </div>
          </div>

          {/* ── Internal Review Disclaimer Notice ── */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e8c98e] bg-[#fef8ea] p-4 text-[#754a10] shadow-2xs">
            <AlertCircle size={18} className="shrink-0 text-[#b36c1e] mt-0.5" />
            <div className="text-[12.5px] leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-[#915408]">
                Draft Policy — Pending Client Approval:
              </span>{" "}
              The clauses outlined below represent a provisional operational framework drafted for internal
              review and platform scaffolding. These will be updated upon receipt of formally approved policy
              wording from Veda Structure management.
            </div>
          </div>

          {/* ── Policy Switcher Tabs ── */}
          <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-[#ebdcc4]/60">
            {navPolicies.map((p) => {
              const isActive = resolvedType === p.type;
              return (
                <Link
                  key={p.type}
                  to={p.path}
                  className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
                    isActive
                      ? "border border-[#b36c1e] bg-[#b36c1e] text-white shadow-xs"
                      : "border border-[#ebdcc4] bg-white/80 text-[#5c4e3f] hover:border-[#b36c1e] hover:text-[#b36c1e]"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Policy Content Container ── */}
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#ebdcc4] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(180,120,40,0.05)]">
          <div className="space-y-10">
            {config.sections.map((section, idx) => (
              <section key={idx} className="border-b border-[#f3e9d8] pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-serif text-[19px] font-bold text-[#2b241d] sm:text-[21px] tracking-tight">
                  {section.title}
                </h2>

                <div className="mt-3.5 space-y-3 text-[14.5px] leading-relaxed text-[#524436]">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.bullets && (
                  <ul className="mt-4 space-y-2.5 pl-2 text-[14px] leading-relaxed text-[#524436]">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="text-[#b36c1e] text-[15px] select-none shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* ── Devotee Assistance Callout Card ── */}
          <div className="mt-12 rounded-xl border border-[#ebd09b] bg-[#fffcf5] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
            <div>
              <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                Have questions regarding our policies or ritual bookings?
              </p>
              <p className="mt-1 text-[13px] text-[#6d5a47]">
                Our dedicated support desk is available to assist you with complete reverence and clarity.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d99426] to-[#b36c1e] px-5 py-2.5 text-[13px] font-bold text-white shadow-xs hover:brightness-105 transition-all shrink-0"
            >
              <Mail size={15} />
              <span>Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}