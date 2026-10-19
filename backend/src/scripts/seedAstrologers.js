import dotenv from "dotenv";
import db, { Astrologer, AstrologerPackage } from "../models/index.js";

dotenv.config();

export const SEED_ASTROLOGERS = [
  {
    id: "c7d1e84a-912a-4286-9a28-6d2c4e8f1001",
    slug: "vishal-bhardwaj",
    code: "ast-vishal",
    name: "Vishal Bhardwaj",
    title: "Vedic Astrologer | Jyotish Consultant | Spiritual Guide",
    eyebrow: "Vedic Astrology • Kashi / Varanasi",
    quote: "Understand Your Kundali. Find Clarity in Life.",
    description: "Personalized Vedic Astrology consultation rooted in ancient Kashi traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies.",
    experienceYears: 10,
    holySeat: "Kashi / Varanasi",
    location: "Kashi (Varanasi), India",
    languages: ["Hindi", "English"],
    specializations: [
      "Career & Job",
      "Business & Finance",
      "Marriage & Relationship",
      "Education",
      "Family & Property",
      "Remedies & Spiritual Guidance",
      "Foreign Travel",
      "Kundali-based Life Guidance",
    ],
    expertise: ["Vedic Astrology", "Kundali Analysis", "Life Guidance"],
    rating: 4.90,
    reviewsCount: "1,500+",
    sessionsCount: "3,800+",
    profileImage: "/assets/images/vishal.png",
    portraitImage: "/assets/images/vishal_png.png",
    secondaryImage: "/assets/images/vishal vhadrawaj.png",
    bioParagraphs: [
      "Vishal Bhardwaj is a seasoned Vedic Astrologer based in the sacred city of Kashi (Varanasi), dedicating over a decade to the deep study and practical application of classical Parashari Jyotish.",
      "His consultations bridge ancient Sanatan wisdom with modern life complexities — helping individuals navigate career milestones, marriage timings, financial decisions, and spiritual growth without fear or superstition.",
    ],
    pillars: [
      {
        title: "Fear-Free & Compassionate Guidance",
        desc: "Astrology is treated as a guiding light (Jyoti), not fatalism. Every session empowers you to take conscious action.",
      },
      {
        title: "Timing & Dasha Synchronization",
        desc: "Precise calculation of planetary periods (Vimshottari Dasha) and transits (Gochar) to align choices with cosmic timing.",
      },
      {
        title: "Pure & Actionable Vedic Remedies",
        desc: "Straightforward remedial measures centered on mantra sadhana, genuine gemstones, and karma alignment.",
      },
    ],
    faqs: [
      {
        q: "What details do I need to provide for the consultation?",
        a: "You will need your exact date of birth, time of birth, and place of birth. If your exact birth time is unknown, our Prashna Kundali (horary) and palmistry techniques can still provide accurate directional clarity.",
      },
      {
        q: "How will the consultation take place?",
        a: "Consultations are conducted 1-on-1 via private Google Meet / Zoom video call or direct phone call according to your preference. Meeting links and joining details are provided upon confirmation.",
      },
      {
        q: "Can I discuss multiple questions or charts?",
        a: "Yes. Our standard 30-minute session focuses on 1-2 core questions. The 60-minute and 90-minute sessions provide exhaustive life mapping and allow discussion of family/couple charts.",
      },
      {
        q: "Are the remedies expensive or difficult to perform?",
        a: "No. Our approach prioritizes simple, authentic Vedic remedies such as mantra japa, donation (daan), and behavioral karma corrections rather than costly fear-driven rituals.",
      },
    ],
    availableTimeSlots: [
      "10:00 AM - 10:30 AM",
      "11:30 AM - 12:00 PM",
      "02:00 PM - 02:30 PM",
      "03:30 PM - 04:00 PM",
      "05:00 PM - 05:30 PM",
      "06:30 PM - 07:00 PM",
      "08:00 PM - 08:30 PM",
    ],
    addOnPricing: {
      addOnCouple: 3100,
      addOnReport: 500,
      addOnExpress: 400,
    },
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "c7d1e84a-912a-4286-9a28-6d2c4e8f1002",
    slug: "acharya-anurag-bhardwaj",
    code: "ast-anurag",
    name: "Acharya Anurag Bhardwaj",
    title: "Senior Vedic Astrologer & Sanatan Shastra Scholar",
    eyebrow: "Vedic Astrology • Ancient Wisdom",
    quote: "Traditional Vedic astrology guidance rooted in ancient wisdom.",
    description: "Personalized Vedic Astrology consultation rooted in ancient Sanatan traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies.",
    experienceYears: 14,
    holySeat: "Kashi / Haridwar",
    location: "Kashi, India",
    languages: ["Hindi", "Sanskrit", "English"],
    specializations: [
      "Kundali Analysis",
      "Muhurat & Sanskar",
      "Dosha Nivarana",
      "Career & Wealth Guidance",
      "Marriage Compatibility",
    ],
    expertise: ["Parashari Jyotish", "Vedic Muhurat", "Remedial Astrology"],
    rating: 4.90,
    reviewsCount: "1,200+",
    sessionsCount: "2,900+",
    profileImage: null,
    portraitImage: null,
    secondaryImage: null,
    bioParagraphs: [
      "Acharya Anurag Bhardwaj is a revered Vedic scholar and astrologer carrying forward the traditional lineage of Sanatan Jyotish and Karmakand.",
      "With over 14 years of rigorous study and counseling experience, he specializes in accurate horoscope analysis, auspicious timings (Muhurat), and time-tested Vedic remedies to resolve obstacles in career, marriage, and family life.",
    ],
    pillars: [
      {
        title: "Classical Shastric Integrity",
        desc: "Analysis grounded in Brihat Parashara Hora Shastra and Jaimini Sutras for authentic, verified predictions.",
      },
      {
        title: "Holistic Muhurat & Timing",
        desc: "Align your life's key milestones with auspicious cosmic windows to maximize positive outcomes.",
      },
      {
        title: "Compassionate Remedial Guidance",
        desc: "Practical, sattvic remedies focusing on mantra recitation, stotram sadhana, and spiritual alignment.",
      },
    ],
    faqs: [
      {
        q: "What should I prepare before consulting with Acharya Anurag?",
        a: "Please keep your exact birth date, time, and birthplace ready, along with any specific life questions you wish to resolve.",
      },
      {
        q: "How are the consultation sessions conducted?",
        a: "Sessions are conducted 1-on-1 via high-quality video call (Google Meet / Zoom) or direct voice call.",
      },
      {
        q: "Can I consult regarding marriage matching (Kundali Milan)?",
        a: "Yes. In 60-minute and comprehensive sessions, thorough Ashta-Kuta and D-9 Navamsha compatibility analysis is provided.",
      },
    ],
    availableTimeSlots: [
      "10:00 AM - 10:30 AM",
      "11:30 AM - 12:00 PM",
      "02:00 PM - 02:30 PM",
      "03:30 PM - 04:00 PM",
      "05:00 PM - 05:30 PM",
      "06:30 PM - 07:00 PM",
      "08:00 PM - 08:30 PM",
    ],
    addOnPricing: {
      addOnCouple: 3100,
      addOnReport: 500,
      addOnExpress: 400,
    },
    isActive: true,
    displayOrder: 2,
  },
];

export const SEED_PACKAGES = [
  // Vishal Packages
  {
    id: "2a196b4a-a6fb-4dc1-b303-e022afd64b54",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1001",
    packageKey: "essential",
    title: "Essential Vedic Clarity",
    subtitle: "Selected From The Top 5% For Accuracy, Expertise & Trust.",
    duration: "30 Minutes",
    price: 1100.00,
    originalPrice: 1500.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Personalized remedies for career, finance, marriage, and health",
      "Easy-to-follow solutions for daily life",
      "Clear and honest guidance without fear tactics",
      "Key poojas organized and performed with spiritual precision",
    ],
    consultationDetails: [
      "Duration: 30 minutes",
      "Schedule your session immediately",
      "Couple consultation available at checkout",
    ],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "11213c0c-c4fd-47e2-b2bf-eb0dd9d1757e",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1001",
    packageKey: "complete",
    title: "Complete Kundali Guidance",
    subtitle: "Comprehensive Horoscope Analysis | Janam Kundali + Navamsha (D-9) + 12-Month Forecast",
    duration: "60 Minutes (1 Hr)",
    price: 2100.00,
    originalPrice: 2800.00,
    isPopular: true,
    badge: "Most Popular",
    knownFor: [
      "Giving clear actionable guidance that you can implement immediately",
      "Offering simple and effective remedies based on your unique birth chart",
      "Providing detailed predictions trusted by thousands",
      "Specialising in career relationship and health advice",
      "Guidance and support for getting specific pooja done when required",
    ],
    consultationDetails: [
      "Duration: 60-minute session (Comprehensive)",
      "Immediate slot availability & priority booking",
      "Couple Consultation option available at checkout",
    ],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "7a9bcd22-a460-4f34-9f5d-40950486ace8",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1001",
    packageKey: "premium",
    title: "Deep-Dive Life & Destiny",
    subtitle: "Exhaustive Kundali + D-10/D-9/D-7 Analysis + 3-Year Dasha Roadmap",
    duration: "90 Minutes",
    price: 5100.00,
    originalPrice: 6500.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Kundli-based timelines for life events",
      "Practical remedies for career love marriage and business",
      "Major poojas and rituals performed with spiritual precision",
      "Comprehensive 3-year Dasha roadmap & transit alignments",
    ],
    consultationDetails: [
      "Duration: 90-minute session",
      "Schedule immediately with priority queue",
      "Couple consultation available at checkout",
    ],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "2da8d53e-060c-4135-bcc1-8d122c16cb77",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1001",
    packageKey: "comprehensive",
    title: "Family & Enterprise Session",
    subtitle: "Up to 3 family charts + Kundali Milan + Written blueprint",
    duration: "3 Hours",
    price: 11000.00,
    originalPrice: 14000.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Comprehensive multi-chart family consultation",
      "In-depth Kundali Milan for marriage or business partnership",
      "Full remedial protocol and customized written life roadmap",
      "Priority direct communication follow-up",
    ],
    consultationDetails: [
      "Duration: 3 Hours session",
      "Up to 3 family charts analyzed",
      "Written summary and remedy protocol included",
    ],
    displayOrder: 4,
    isActive: true,
  },

  // Anurag Packages
  {
    id: "abc1d611-33ce-451c-8df0-4c64f0bca85c",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1002",
    packageKey: "essential",
    title: "Essential Vedic Clarity",
    subtitle: "Selected From The Top 5% For Accuracy, Expertise & Trust.",
    duration: "30 Minutes",
    price: 1100.00,
    originalPrice: 1500.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Personalized remedies for career, finance, marriage, and health",
      "Easy-to-follow solutions for daily life",
      "Clear and honest guidance without fear tactics",
      "Key poojas organized and performed with spiritual precision",
    ],
    consultationDetails: [
      "Duration: 30 minutes",
      "Schedule your session immediately",
      "Couple consultation available at checkout",
    ],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "b6e4e7a8-32cb-4f6e-a985-7a3fd1bd3db2",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1002",
    packageKey: "complete",
    title: "Complete Kundali Guidance",
    subtitle: "Comprehensive Horoscope Analysis | Janam Kundali + Navamsha (D-9) + 12-Month Forecast",
    duration: "60 Minutes (1 Hr)",
    price: 2100.00,
    originalPrice: 2800.00,
    isPopular: true,
    badge: "Most Popular",
    knownFor: [
      "Giving clear actionable guidance that you can implement immediately",
      "Offering simple and effective remedies based on your unique birth chart",
      "Providing detailed predictions trusted by thousands",
      "Specialising in career relationship and health advice",
      "Guidance and support for getting specific pooja done when required",
    ],
    consultationDetails: [
      "Duration: 60-minute session (Comprehensive)",
      "Immediate slot availability & priority booking",
      "Couple Consultation option available at checkout",
    ],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "adfc68bd-5e50-49f8-aa77-a84e84139602",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1002",
    packageKey: "premium",
    title: "Deep-Dive Life & Destiny",
    subtitle: "Exhaustive Kundali + D-10/D-9/D-7 Analysis + 3-Year Dasha Roadmap",
    duration: "90 Minutes",
    price: 5100.00,
    originalPrice: 6500.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Kundli-based timelines for life events",
      "Practical remedies for career love marriage and business",
      "Major poojas and rituals performed with spiritual precision",
      "Comprehensive 3-year Dasha roadmap & transit alignments",
    ],
    consultationDetails: [
      "Duration: 90-minute session",
      "Schedule immediately with priority queue",
      "Couple consultation available at checkout",
    ],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "87aeb724-c61a-44c9-91bb-167e8c888b65",
    astrologerId: "c7d1e84a-912a-4286-9a28-6d2c4e8f1002",
    packageKey: "comprehensive",
    title: "Family & Enterprise Session",
    subtitle: "Up to 3 family charts + Kundali Milan + Written blueprint",
    duration: "3 Hours",
    price: 11000.00,
    originalPrice: 14000.00,
    isPopular: false,
    badge: null,
    knownFor: [
      "Comprehensive multi-chart family consultation",
      "In-depth Kundali Milan for marriage or business partnership",
      "Full remedial protocol and customized written life roadmap",
      "Priority direct communication follow-up",
    ],
    consultationDetails: [
      "Duration: 3 Hours session",
      "Up to 3 family charts analyzed",
      "Written summary and remedy protocol included",
    ],
    displayOrder: 4,
    isActive: true,
  },
];

export const seedAstrologers = async () => {
  console.log("Starting idempotent astrologer baseline seeding...");

  for (const a of SEED_ASTROLOGERS) {
    const existing = await Astrologer.findOne({ where: { code: a.code } });
    if (!existing) {
      await Astrologer.create(a);
      console.log(`  + Created astrologer: ${a.name} (${a.code})`);
    } else {
      console.log(`  = [SKIP] Astrologer already exists: ${existing.name} (${existing.code})`);
    }
  }

  for (const p of SEED_PACKAGES) {
    const existing = await AstrologerPackage.findOne({
      where: {
        astrologerId: p.astrologerId,
        packageKey: p.packageKey,
      },
    });

    if (!existing) {
      await AstrologerPackage.create(p);
      console.log(`  + Created package: ${p.title} (${p.packageKey})`);
    } else {
      console.log(`  = [SKIP] Package already exists: ${existing.title} (${existing.packageKey})`);
    }
  }

  console.log("Astrologer baseline seeding completed successfully.");
};

if (process.argv[1] && process.argv[1].endsWith("seedAstrologers.js")) {
  seedAstrologers()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}

export default seedAstrologers;
