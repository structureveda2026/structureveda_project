import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Search,
  HelpCircle,
  Mail,
  ArrowRight,
} from "lucide-react";

/**
 * COMMON FAQS PAGE (/faqs)
 * Aggregates all verified FAQ content across:
 * - General Vedic Rituals & Sankalp (UmbrellaFaq)
 * - Puja Ceremonies & Deliverables (PujaCatalogueListing, UpcomingPujaFAQ)
 * - Vedic Yagya & Homa Fire Ceremonies (HomaFaqSection, UmbrellaFaq)
 * - Japa Anushthana & Shastric Path (JapaFaqSection)
 * - Astrologer Consultations & Janam Kundali (AstrologerFaq)
 *
 * NOTE: Strictly reuses existing verified information without manufacturing guarantees.
 */

const FAQ_DATA = [
  // ── Category 1: General & Sacred Rituals ──
  {
    category: "rituals",
    categoryLabel: "Sacred Rituals & Puja",
    question: "What rituals are available on Veda Structure?",
    answer:
      "Our ecosystem provides five core ritual streams: daily and special deity Pujas, multi-day ceremonial Vedic Yagyas, disciplined Japa chanting anushthans, complete scriptural Path recitations, purifying Homa/Havan fire ceremonies, and specialized Kashi Kshetra rituals.",
  },
  {
    category: "rituals",
    categoryLabel: "Sacred Rituals & Puja",
    question: "Can I book a Puja or ritual from outside India?",
    answer:
      "Yes. Devotees living in the USA, UK, Canada, Australia, UAE, Europe, and worldwide frequently book rituals through Veda Structure. You can specify your family gotra and prayer intentions online, receive personal video recordings of your specific Gotra Sankalp, and have energized holy prasad dispatched to your international address where postal regulations permit.",
  },
  {
    category: "rituals",
    categoryLabel: "Sacred Rituals & Puja",
    question: "Can I perform a Puja in Kashi (Varanasi)?",
    answer:
      "Yes. We facilitate rituals directly on sacred Ganga ghats and consecrated Varanasi kshetras. You can either attend in-person with our designated local Acharya team, or participate remotely through personalized live Sankalp coordination.",
  },
  {
    category: "rituals",
    categoryLabel: "Sacred Rituals & Puja",
    question: "What is the difference between a Puja and a Yagya?",
    answer:
      "A Puja is typically a deity-centered worship involving abhishekam, archana, and offerings (usually 2 to 5 hours). A Yagya is an extensive sacred fire ceremony (Havan) involving specialized Kundas, multiple priests chanting Vedic Samhitas, and thousands of herbal ahutis, often structured over several hours or multiple consecutive days.",
  },
  {
    category: "rituals",
    categoryLabel: "Sacred Rituals & Puja",
    question: "Can I choose a specific ritual based on my life intention?",
    answer:
      "Yes. Our platform organizes rituals by life intentions — including marriage and relationship harmony, wealth and business prosperity, home purification, planetary balance (Graha Shanti), health protection, education, and spiritual practice.",
  },

  // ── Category 2: Sankalpa & Family Participation ──
  {
    category: "sankalpa",
    categoryLabel: "Sankalpa & Participation",
    question: "How does the sacred Sankalpa work?",
    answer:
      "A Sankalp is the solemn Vedic vow defining the devotee's spiritual intention, ancestral gotra, geographical location, and date according to the Hindu Panchang. The presiding Acharya invokes this sacred dedication before commencing the ritual, establishing your direct spiritual connection to the ceremony.",
  },
  {
    category: "sankalpa",
    categoryLabel: "Sankalpa & Participation",
    question: "Can my family members participate in the Sankalp?",
    answer:
      "Yes. During the booking process, you can provide the full names, gotras, and birth nakshatras of your family members so that the spiritual merit and protective blessings of the ceremony are explicitly invoked for all of them.",
  },
  {
    category: "sankalpa",
    categoryLabel: "Sankalpa & Participation",
    question: "What if I do not know my Gotra or Nakshatra?",
    answer:
      "If you do not know your ancestral gotra, traditional Shastras prescribe dedicating the Sankalpa under 'Kashyapa' gotra (the universal spiritual lineage) or invoking the ceremony by your full name and family intentions. Our Acharyas ensure proper Shastric dedication regardless.",
  },
  {
    category: "sankalpa",
    categoryLabel: "Sankalpa & Participation",
    question: "How do I know my ritual was performed authentically?",
    answer:
      "For remote rituals, devotees receive personalized video documentation capturing the presiding Acharya reciting your specific Gotra, name, and prayer Sankalp before the consecrated deity or sacred Agni Kund. Following completion, sanctified prasad is packaged and dispatched.",
  },

  // ── Category 3: Yagya & Homa Ceremonies ──
  {
    category: "homa_yagya",
    categoryLabel: "Homa & Yagya Ceremonies",
    question: "What is the spiritual significance of Homa / Havan?",
    answer:
      "Homa is the Vedic practice of invoking Agni (the divine messenger) as the consecrated medium to carry sacred mantras and offerings to deities and planetary energies. It purifies atmospheric and psychic subtle energy, neutralizes negative planetary doshas, and invokes auspicious blessings.",
  },
  {
    category: "homa_yagya",
    categoryLabel: "Homa & Yagya Ceremonies",
    question: "What samagri (materials) are used in Veda Structure Homas?",
    answer:
      "We use strictly pure, authentic Shastric samagri: desi cow ghee, consecrated havan wood (Samidha like Palasha, Khadira, Peepal, and Audumbara suited to the specific deity), guggul, camphor, sacred herbs, lotus seeds, and seasonal grains.",
  },
  {
    category: "homa_yagya",
    categoryLabel: "Homa & Yagya Ceremonies",
    question: "Can Homa be performed at my home or venue?",
    answer:
      "Yes. In addition to our sanctum ceremonies in Varanasi, we arrange authenticated Acharya delegations for in-person home ceremonies (such as Griha Pravesh, Vastu Shanti, and Navagraha Homa) where geographically serviceable.",
  },

  // ── Category 4: Japa Anushthana & Shastric Path ──
  {
    category: "japa_path",
    categoryLabel: "Japa & Shastric Path",
    question: "What is a Japa Anushthana?",
    answer:
      "A Japa Anushthana is a dedicated spiritual discipline involving systematic, unbroken repetition of a sacred Vedic or Tantric mantra for a prescribed count (such as 11,000, 21,000, 51,000, or 125,000 chants) along with Dashansh Homa, Marjana, and Tarpan rites performed by disciplined scholars.",
  },
  {
    category: "japa_path",
    categoryLabel: "Japa & Shastric Path",
    question: "How are high mantra counts (e.g. 125,000 chants) fulfilled?",
    answer:
      "Higher chant counts are distributed among a consecrated mandala of qualified Vedic Brahmins chanting simultaneously over several consecutive days under the strict supervision of a head Acharya, ensuring Shastric metre, correct Sanskrit pronunciation, and ceremonial discipline.",
  },
  {
    category: "japa_path",
    categoryLabel: "Japa & Shastric Path",
    question: "What is Shastric Path recitation?",
    answer:
      "Shastric Path refers to the complete ceremonial chanting of foundational Sanatan scriptures—including the Durga Saptashati, Srimad Bhagavad Gita, Vishnu Sahasranama, Shiva Sahasranama, and Ramcharitmanas—performed for spiritual elevation and karmic balance.",
  },

  // ── Category 5: Astrologer Consultations ──
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "How long is each consultation session?",
    answer:
      "Sessions range from 30 minutes (Essential Clarity) to 60 minutes (Complete Kundali Analysis), 90 minutes (Deep-Dive), and extended family consultations. You can select your preferred duration during booking.",
  },
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "How is the consultation conducted online?",
    answer:
      "Consultations take place via private 1-on-1 Audio or Video calls over a secure link. You can join conveniently from your phone, laptop, or tablet from anywhere in the world.",
  },
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "Do I need a pre-made Kundali before the session?",
    answer:
      "No. You only need your exact date of birth, time of birth, and place of birth. The astrologer computes your precise Janam Kundali, Navamsha (D-9), and planetary strengths directly using astronomical ephemeris.",
  },
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "Is my personal birth data and conversation confidential?",
    answer:
      "Absolutely. 100% privacy and confidentiality are guaranteed. Your birth details, personal circumstances, and conversation remain strictly private between you and the astrologer.",
  },
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "In which languages are consultations available?",
    answer:
      "Consultations are conducted fluently in Hindi and English according to your preference and comfort.",
  },
  {
    category: "astrology",
    categoryLabel: "Astrologer Consultations",
    question: "Can I reschedule my appointment if an emergency arises?",
    answer:
      "Yes. You can reschedule your consultation slot prior to the session time by contacting our support team with your booking reference.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "rituals", label: "Sacred Rituals & Puja" },
  { id: "sankalpa", label: "Sankalpa & Participation" },
  { id: "homa_yagya", label: "Homa & Yagya" },
  { id: "japa_path", label: "Japa & Shastric Path" },
  { id: "astrology", label: "Astrologer Consultations" },
];

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndexes, setOpenIndexes] = useState([0]); // First open by default

  useEffect(() => {
    document.title = "Frequently Asked Questions • Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

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
            <span className="font-semibold text-[#2b241d]">Common FAQs</span>
          </nav>

          {/* Heading */}
          <div className="mt-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                VEDA STRUCTURE KNOWLEDGE BASE
              </span>
            </div>

            <h1 className="mt-2 font-serif text-[30px] font-bold text-[#2b241d] sm:text-[38px] lg:text-[42px] leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="mt-2.5 max-w-[650px] text-[15px] leading-relaxed text-[#5c4e3f]">
              Find authentic answers regarding how our Vedic rituals are organized, how family
              Sankalpas are dedicated, and how consultations take place.
            </p>
          </div>

          {/* ── Search Input ── */}
          <div className="mt-6 max-w-[540px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword (e.g. Sankalp, Kashi, Prasad)..."
                className="w-full rounded-full border border-[#ebdcc4] bg-white py-2.5 pl-10 pr-4 text-[13.5px] text-[#2b241d] placeholder-[#9c8d7c] shadow-xs outline-none focus:border-[#b36c1e] focus:ring-2 focus:ring-[#b36c1e]/15"
              />
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c8d7c]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#8a7661] hover:text-[#2b241d]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Category Filter Pills ── */}
          <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-[#ebdcc4]/60">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "border border-[#b36c1e] bg-[#b36c1e] text-white shadow-xs"
                      : "border border-[#ebdcc4] bg-white/80 text-[#5c4e3f] hover:border-[#b36c1e] hover:text-[#b36c1e]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Accordion Container ── */}
      <div className="mx-auto max-w-[1080px] px-4 py-12 sm:px-6 lg:px-8">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-[#ebdcc4] bg-white p-12 text-center">
            <HelpCircle size={36} className="mx-auto text-[#c2ab90]" />
            <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
              No questions found
            </h3>
            <p className="mt-2 text-[13.5px] text-[#6d5a47]">
              No questions matched your search query "{searchQuery}". Try searching for terms like
              "Sankalp", "Kashi", "Prasad", or "Kundali".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-5 rounded-full border border-[#ebd09b] bg-[#fffcf5] px-5 py-2 text-[13px] font-semibold text-[#874204] hover:bg-[#faebd0]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-[#ebd09b] bg-white shadow-[0_4px_16px_rgba(180,120,40,0.06)]"
                      : "border-[#ebdcc4] bg-white/85 hover:border-[#ebd09b] hover:bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                        ✦
                      </span>
                      <span className="font-serif text-[16px] font-bold text-[#2b241d] sm:text-[17px]">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#ebd09b] bg-[#fffcf5] text-[#b36c1e] transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#b36c1e] text-white" : ""
                      }`}
                    >
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[14.5px] leading-relaxed text-[#524436] border-t border-[#f7eedf]/80">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom Still Have Questions CTA ── */}
        <div className="mt-12 rounded-2xl border border-[#ebd09b] bg-gradient-to-r from-[#faebd0]/80 via-[#fcf5e5] to-[#faebd0]/80 p-6 sm:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
              Have a specific question not covered here?
            </h3>
            <p className="mt-1 text-[13.5px] text-[#6d5a47]">
              Our devotee support desk is available to assist you with complete clarity and care.
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
  );
}