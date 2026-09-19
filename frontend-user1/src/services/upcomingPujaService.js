import api from "./api.js";
import defaultPujaImg from "../assets/images/puja-kashi.jpg";

/**
 * Timezone-safe ceremony date formatting.
 * Ensures dates like "2026-10-25" never shift to 24th or 26th due to client timezone offsets.
 */
export const formatCeremonyDate = (dateStr, startDateTime) => {
  if (dateStr && typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${d} ${months[m - 1]} ${y}`;
  }
  if (startDateTime) {
    const d = new Date(startDateTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }
  return dateStr || "Upcoming Ceremony";
};

/**
 * Normalizes an API response item from GET /api/upcoming-pujas into the UI model.
 */
export const mapApiPujaToUiModel = (item) => {
  if (!item) return null;

  const rawPackages = Array.isArray(item.packages) ? item.packages : [];
  const normalizedPackages =
    rawPackages.length > 0
      ? rawPackages.map((pkg, idx) => {
          const pkgPrice = pkg.price != null ? Number(pkg.price) : 1100;
          const maxDevotees = pkg.maxDevotees != null ? Number(pkg.maxDevotees) : 1;
          const pkgFeatures = Array.isArray(pkg.features) && pkg.features.length > 0
            ? pkg.features
            : (Array.isArray(pkg.includes) && pkg.includes.length > 0 ? pkg.includes : [
                "Devotee Name & Gotra in Sankalp",
                "HD Ritual Highlights & Photos",
                "Consecrated Prasadam delivery to home",
              ]);
          return {
            ...pkg,
            id: pkg.id || `pkg-${idx + 1}`,
            name: pkg.name || `Participation Tier ${idx + 1}`,
            price: pkgPrice,
            maxDevotees,
            formattedPrice:
              pkg.formattedPrice || `₹${pkgPrice.toLocaleString("en-IN")}`,
            description:
              pkg.description ||
              "Personalized Sankalp for devotees with authentic Vedic Vidhi.",
            includes: pkgFeatures,
            features: pkgFeatures,
            isDefault: Boolean(pkg.isDefault),
          };
        })
      : [
          {
            id: "pkg-individual",
            name: "Individual",
            price: 1100,
            maxDevotees: 1,
            formattedPrice: "₹1,100",
            description: "Personal Sankalp for 1 devotee with full ritual participation.",
            includes: [
              "1 Devotee Name & Gotra in Sankalp",
              "HD Ritual Video Highlights",
              "Consecrated Prasadam delivery to home",
            ],
            features: [
              "1 Devotee Name & Gotra in Sankalp",
              "HD Ritual Video Highlights",
              "Consecrated Prasadam delivery to home",
            ],
            isDefault: true,
          },
          {
            id: "pkg-couple",
            name: "Couple (Dampati)",
            price: 1800,
            maxDevotees: 2,
            formattedPrice: "₹1,800",
            description: "Dedicated blessings for husband & wife for marital harmony.",
            includes: [
              "2 Devotees (Husband & Wife) in Sankalp",
              "Personalized blessing chant by Acharyas",
              "Full Ceremony Recording & Photos",
              "Energized Prasad pack",
            ],
            features: [
              "2 Devotees (Husband & Wife) in Sankalp",
              "Personalized blessing chant by Acharyas",
              "Full Ceremony Recording & Photos",
              "Energized Prasad pack",
            ],
            isDefault: false,
          },
          {
            id: "pkg-family",
            name: "Complete Family",
            price: 2500,
            maxDevotees: 6,
            formattedPrice: "₹2,500",
            description: "Comprehensive Sankalp for up to 6 immediate family members.",
            includes: [
              "Up to 6 Family Members with individual Gotras",
              "Special Archana for each member",
              "Priority Video delivery within 24 hours",
              "Grand Puja Prasadam Box with sacred items",
            ],
            features: [
              "Up to 6 Family Members with individual Gotras",
              "Special Archana for each member",
              "Priority Video delivery within 24 hours",
              "Grand Puja Prasadam Box with sacred items",
            ],
            isDefault: false,
          },
        ];

  const defaultPackage = normalizedPackages.find((p) => p.isDefault) || normalizedPackages[0];
  const price = defaultPackage ? Number(defaultPackage.price) : 1100;
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`;

  const purposeCats = Array.isArray(item.purposeCategories)
    ? item.purposeCategories
    : [];
  const purposeText =
    purposeCats.length > 0
      ? purposeCats.join(" • ")
      : item.category || "Vedic Ceremony";

  const formattedDateStr = formatCeremonyDate(
    item.ceremonyDate,
    item.startDateTime
  );

  const bannerImgUrl = item.bannerImage || null;
  const gallery = Array.isArray(item.galleryImages) ? item.galleryImages : [];
  const carouselImages =
    gallery.length > 0
      ? gallery
      : bannerImgUrl
      ? [bannerImgUrl]
      : [defaultPujaImg];

  const defaultIcons = ["Sparkles", "ShieldCheck", "Heart", "Sun"];
  const defaultBenefits = [
    {
      title: "Peace & Mental Clarity",
      description: "Alleviates mental stress and restlessness through sacred Vedic vibrations.",
      icon: "Sparkles",
    },
    {
      title: "Protection & Dosha Shanti",
      description: "Shields against negative energies and mitigates adverse planetary influences.",
      icon: "ShieldCheck",
    },
    {
      title: "Family Harmony & Wellbeing",
      description: "Invokes household peace, long-term health, and spiritual alignment for your family.",
      icon: "Heart",
    },
    {
      title: "Spiritual Upliftment",
      description: "Purifies subtle energy channels and attracts auspicious opportunities and prosperity.",
      icon: "Sun",
    },
  ];

  const rawBenefits = Array.isArray(item.benefits) && item.benefits.length > 0 ? item.benefits : defaultBenefits;
  const whyPerformMapped = rawBenefits.map((b, idx) => {
    if (typeof b === "object" && b !== null && b.title) return b;
    const str = String(b);
    const parts = str.split(/:(.*)/s);
    const title =
      parts.length > 1 && parts[0].length < 35
        ? parts[0].trim()
        : `Vedic Benefit ${idx + 1}`;
    const description =
      parts.length > 1 && parts[0].length < 35 ? parts[1].trim() : str;
    return {
      title,
      description,
      icon: defaultIcons[idx % defaultIcons.length],
    };
  });

  const defaultProcedure = [
    {
      step: "01",
      title: "Sankalp",
      description: "The Acharya invokes your Name, Gotra, and specific intention before the sacred altar.",
    },
    {
      step: "02",
      title: "Preparation & Aavahan",
      description: "Purification of the altar, chanting of Swasti Vachan, and ritual invocation of deities.",
    },
    {
      step: "03",
      title: "Main Vedic Vidhi",
      description: "Consecrated chanting of sacred Shastric mantras and ceremonial offerings by Vedic priests.",
    },
    {
      step: "04",
      title: "Aarti & Blessings",
      description: "Maha Mangal Aarti, Pushpanjali, distribution of sacred bhasma, and special prayers for prosperity.",
    },
  ];

  const defaultWhatsIncluded = [
    "Complete Vedic Puja Vidhi as per Shastric standards",
    "All required 100% pure puja samagri and offerings",
    "Personalized Sankalp chanted with your Name & Gotra",
    "Performed by certified Vedic Brahmins",
    "High-definition Puja completion video recording & photos sent to your WhatsApp/Email",
    "Energized sacred Prasadam delivered to your home address",
  ];

  const defaultSignificance = [
    "Rooted in ancient Vedic revelations, this sacred ceremony invokes divine cosmic harmony.",
    "Every sacred mantra chanted resonates with authentic sonic frequencies that disperse stagnated energies.",
    "Participating in consecrated Vedic rituals magnifies spiritual merit and grants auspicious clarity.",
  ];

  const defaultFaqs = [
    {
      question: "Do I need to be physically present for this Puja?",
      answer: "No, physical presence is not required. Our Acharyas take your personalized Sankalp invoking your Name and Gotra directly at the consecrated altar. Complete video updates and energized Prasad are sent to your doorstep.",
    },
    {
      question: "What items will I receive in the Prasadam package?",
      answer: "You will receive sanctified holy Prasadam, consecrated Raksha Sutra, sacred Bhasma/Chandan, and holy blessings directly from the ceremony venue.",
    },
    {
      question: "Can I perform this Puja on behalf of my parents or family members?",
      answer: "Yes, you can register and provide the details of your family members, parents, or loved ones during the Sankalp step.",
    },
  ];

  const isBookingOpen = Boolean(
    item.isBookingOpen !== false && item.status !== "Booking Closed"
  );
  const bookingStatus = isBookingOpen ? "Booking Open" : "Booking Closed";

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    eyebrow: item.eyebrow || "VEDIC PUJA • KASHI",
    tagline:
      item.tagline ||
      item.shortDescription ||
      "Sacred Vedic Ritual performed with authentic Shastric Vidhi",
    description: item.shortDescription || item.fullDescription || "",
    shortDescription: item.shortDescription || "",
    fullDescription: item.fullDescription || item.shortDescription || "",

    // Imagery (Cloudinary priority + graceful fallback)
    bannerImage: bannerImgUrl,
    image: bannerImgUrl || defaultPujaImg,
    galleryImages: gallery,
    images: carouselImages,

    // Scheduling
    ceremonyDate: item.ceremonyDate,
    date: item.ceremonyDate,
    startDateTime: item.startDateTime,
    bookingCloseAt: item.bookingCloseAt,
    formattedDate: formattedDateStr,

    // Geographic & Deity
    location: item.location || item.temple || "Kashi (Varanasi)",
    city: item.location ? item.location.split(",")[0].trim() : "Varanasi",
    temple: item.temple || item.location || "Varanasi Kshetra",
    deity: item.deity || "Sanatan Devata",

    // Classification
    category: item.category || "Vedic Puja",
    occasion: item.occasion || "",
    purposeCategories: purposeCats,
    purpose: purposeText,
    purposeCategory: purposeCats[0] || "All",

    // Status & Booking
    status: item.status || "Published",
    isBookingOpen,
    bookingStatus,
    bookingOpen: isBookingOpen,

    // Packages & Pricing
    packages: normalizedPackages,
    price,
    startingPrice: price,
    formattedPrice,
    badge: item.occasion ? `Upcoming ${item.occasion}` : "Featured Puja",

    // Editorial Content & Vidhi
    whyPerform: whyPerformMapped,
    benefits: whyPerformMapped,
    significance: Array.isArray(item.significance) && item.significance.length > 0 ? item.significance : defaultSignificance,
    whatsIncluded: Array.isArray(item.whatsIncluded) && item.whatsIncluded.length > 0 ? item.whatsIncluded : defaultWhatsIncluded,
    procedureSteps: Array.isArray(item.procedureSteps) && item.procedureSteps.length > 0 ? item.procedureSteps : defaultProcedure,
    faqs: Array.isArray(item.faqs) && item.faqs.length > 0 ? item.faqs : defaultFaqs,
    eligibility:
      item.eligibility ||
      "Open to all devotees and families seeking divine blessings through Vedic Sankalp. You can book this puja for yourself, family, or ancestors even if you cannot travel to Kashi.",

    rating: item.rating || "4.9",
    reviewCount: item.reviewCount || "8.4K",
    bookingCount: item.bookingCount || "15K+",

    isFeatured: Boolean(item.isFeatured),
    featured: Boolean(item.isFeatured),
    remoteAvailable: Boolean(item.remoteAvailable !== false),
  };
};

/**
 * Fetch public upcoming pujas from backend API.
 */
export const getUpcomingPujas = async (params = {}) => {
  const response = await api.get("/upcoming-pujas", { params });
  const rawList = response.data?.data || [];
  return rawList.map(mapApiPujaToUiModel);
};

/**
 * Fetch a single public upcoming puja by its unique slug.
 */
export const getUpcomingPujaBySlug = async (slug) => {
  if (!slug) return null;
  const response = await api.get(`/upcoming-pujas/${encodeURIComponent(slug)}`);
  const rawData = response.data?.data;
  return rawData ? mapApiPujaToUiModel(rawData) : null;
};

/**
 * Book an upcoming puja package with devotee details.
 */
export const bookUpcomingPuja = async (bookingData) => {
  const response = await api.post("/upcoming-pujas/book", bookingData);
  return response.data;
};

export default {
  getUpcomingPujas,
  getUpcomingPujaBySlug,
  bookUpcomingPuja,
  mapApiPujaToUiModel,
  formatCeremonyDate,
};
