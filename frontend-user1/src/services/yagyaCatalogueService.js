import api from "./api.js";

// Static fallback image imports to guarantee resilience
import defaultYagyaImg from "../assets/images/puja-kashi.jpg";
import pujaMrityunjayaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../assets/images/puja-navagraha.jpg";
import pujaGaneshImg from "../assets/images/puja-ganesh.jpg";
import pujaLakshmiImg from "../assets/images/puja-lakshmi.jpg";
import pujaRudrabhishekImg from "../assets/images/puja-rudrabhishek.jpg";
import samagriImg from "../assets/images/p-samagri.jpg";

/**
 * Slug to fallback image lookup
 */
const SLUG_IMAGE_MAP = {
  "maha-mrityunjaya-yagya": pujaMrityunjayaImg,
  "navagraha-shanti-maha-yagya": pujaNavagrahaImg,
  "maha-ganapati-atharvashirsha-yagya": pujaGaneshImg,
  "maha-lakshmi-kubera-yagya": pujaLakshmiImg,
  "durga-saptashati-chandi-homa": pujaRudrabhishekImg,
  "maha-rudra-yagya-kashi": defaultYagyaImg,
};

/**
 * Resolves a reliable image for a Yagya service
 */
export const getYagyaFallbackImage = (slug) => {
  return SLUG_IMAGE_MAP[slug] || defaultYagyaImg;
};

export const formatModeLabel = (mode) => {
  if (!mode) return "In-Person (Kashi) or Remote Gotra Sankalpa";
  const m = String(mode).toLowerCase();
  if (m === "in_person" || m === "offline") return "In-Person (Kashi)";
  if (m === "remote" || m === "online") return "Remote Gotra Sankalpa";
  if (m === "hybrid") return "In-Person (Kashi) or Remote Gotra Sankalpa";
  return mode;
};

/**
 * Normalizes a single listing item from GET /api/yagya-services
 */
export const mapApiYagyaServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getYagyaFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;

  const formattedPrice =
    item.formattedPrice && !item.formattedPrice.includes("?")
      ? item.formattedPrice
      : item.startingPrice
      ? `₹${Number(item.startingPrice).toLocaleString("en-IN")}`
      : "₹18,000";

  const parsedDurations = Array.isArray(item.availableDurations)
    ? item.availableDurations.map(Number).filter((n) => !isNaN(n) && n > 0)
    : [3, 5, 7];

  return {
    ...item,
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    image: primaryImage,
    bannerImage: primaryImage,
    formattedPrice,
    purposeCategory: item.purposeCategory || (item.purposeDetails ? item.purposeDetails.name : null),
    purposeKey: item.purposeKey || (item.purposeDetails ? item.purposeDetails.slug : null),
    purposeSummary: item.purposeSummary || item.purpose || null,
    rawAvailableMode: item.availableMode || "hybrid",
    availableMode: formatModeLabel(item.availableMode),
    durationDisplay:
      item.durationDisplay ||
      (parsedDurations.length > 0
        ? `${parsedDurations.join(" / ")} Days`
        : "3 / 5 / 7 Days"),
    availableDurations: parsedDurations,
    dailyRitualHours: item.dailyRitualHours || 5,
    dailyHoursDisplay: item.dailyHoursDisplay || "5 Hours / Day",
    locationType: item.locationType || "Kashi Kshetras & Sacred Mandaps",
    location: item.location || "Kashi (Varanasi)",
    isFeatured: Boolean(item.isFeatured),
    isKashiAvailable: typeof item.isKashiAvailable === "boolean" ? item.isKashiAvailable : true,
    isRemoteAvailable: typeof item.isRemoteAvailable === "boolean" ? item.isRemoteAvailable : true,
    panditRequirement: item.panditRequirement || {
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 11,
      skillRequirements: "Trained in Vedic Vidhi and Shastras",
      dailyHours: 5,
    },
  };
};

/**
 * Normalizes a detail item from GET /api/yagya-services/:slug
 */
export const mapApiYagyaServiceDetailToUi = (item) => {
  if (!item) return null;

  const base = mapApiYagyaServiceToUi(item);
  const fallbackImg = getYagyaFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;
  const images = Array.isArray(item.galleryImages) && item.galleryImages.length > 0 ? [primaryImage, ...item.galleryImages.filter(g => g !== primaryImage)] : [primaryImage, defaultYagyaImg, samagriImg];

  const normalizedWhyPerform = Array.isArray(item.whyPerform)
    ? item.whyPerform.map((b) => (typeof b === "string" ? { title: b, description: "" } : b))
    : [];

  const normalizedProcedureSteps = Array.isArray(item.procedureSteps)
    ? item.procedureSteps.map((s, idx) => ({
        ...s,
        step: s.step || (s.stepNumber ? String(s.stepNumber).padStart(2, "0") : `0${idx + 1}`),
      }))
    : [];

  const normalizedFaqs = Array.isArray(item.faqs)
    ? item.faqs
        .map((faq) => {
          if (!faq || typeof faq !== "object") return null;
          const question = typeof faq.question === "string" ? faq.question : typeof faq.q === "string" ? faq.q : "";
          const answer = typeof faq.answer === "string" ? faq.answer : typeof faq.a === "string" ? faq.a : "";
          return { question, answer };
        })
        .filter((f) => f && (f.question || f.answer))
    : [];

  return {
    ...base,
    fullDescription: item.fullDescription || item.shortDescription || "",
    image: primaryImage,
    bannerImage: primaryImage,
    galleryImages: images,
    images: images,
    samagri: Array.isArray(item.samagri) ? item.samagri : [],
    prasad: item.prasad || "Energized Bhasma, Raksha Sutra, and dry prasadam packed after Purnahuti",
    dailySchedule: Array.isArray(item.dailySchedule) ? item.dailySchedule : [],
    whatsIncluded: Array.isArray(item.whatsIncluded) ? item.whatsIncluded : [],
    whyPerform: normalizedWhyPerform,
    significance: Array.isArray(item.significance) ? item.significance : [],
    procedureSteps: normalizedProcedureSteps,
    faqs: normalizedFaqs,
    purposeDetails: item.purposeDetails || null,
  };
};

/**
 * Fetches public Yagya services from GET /api/yagya-services
 */
export const getYagyaServices = async (filterParams = {}) => {
  try {
    const query = {};

    if (filterParams.search && String(filterParams.search).trim()) {
      query.search = String(filterParams.search).trim();
    }

    if (filterParams.purpose && filterParams.purpose !== "All Purposes") {
      query.purpose = String(filterParams.purpose).trim().toLowerCase();
    }

    if (filterParams.duration && filterParams.duration !== "All" && filterParams.duration !== "All Durations") {
      const durNum = parseInt(filterParams.duration, 10);
      if (!isNaN(durNum) && durNum > 0) {
        query.duration = durNum;
      }
    }

    if (filterParams.mode && filterParams.mode !== "All" && filterParams.mode !== "All Modes") {
      let normalizedMode = String(filterParams.mode).trim().toLowerCase().replace(/-/g, "_").replace(/\s+/g, "_");
      if (normalizedMode === "online") normalizedMode = "remote";
      if (normalizedMode === "offline") normalizedMode = "in_person";

      if (["in_person", "remote", "hybrid"].includes(normalizedMode)) {
        query.mode = normalizedMode;
      }
    }

    if (filterParams.isFeatured === true || filterParams.isFeatured === "true") {
      query.isFeatured = "true";
    }

    if (filterParams.sortBy) {
      let sortVal = String(filterParams.sortBy).trim().toLowerCase();
      if (["featured", "price-asc", "price-desc", "name-asc"].includes(sortVal)) {
        query.sortBy = sortVal;
      }
    }

    if (filterParams.page) {
      query.page = parseInt(filterParams.page, 10) || 1;
    }
    if (filterParams.limit) {
      query.limit = parseInt(filterParams.limit, 10) || 20;
    } else {
      query.limit = 50;
    }

    const response = await api.get("/yagya-services", { params: query });
    const payload = response.data;

    const rawList = Array.isArray(payload.data) ? payload.data : [];
    const normalizedServices = rawList.map(mapApiYagyaServiceToUi);

    return {
      success: true,
      services: normalizedServices,
      count: payload.count || normalizedServices.length,
      total: payload.total || normalizedServices.length,
      page: payload.page || 1,
      limit: payload.limit || query.limit,
      totalPages: payload.totalPages || 1,
    };
  } catch (error) {
    console.error("Failed to fetch yagya services:", error);
    throw error;
  }
};

/**
 * Fetches a single public Yagya service by slug from GET /api/yagya-services/:slug
 */
export const getYagyaServiceBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const response = await api.get(`/yagya-services/${encodeURIComponent(slug)}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return mapApiYagyaServiceDetailToUi(payload.data);
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch yagya service by slug (${slug}):`, error);
    throw error;
  }
};

/**
 * Fetches active Yagya purposes from GET /api/yagya-services/purposes
 */
export const getYagyaPurposes = async () => {
  try {
    const response = await api.get("/yagya-services/purposes");
    const payload = response.data;

    if (payload && payload.success && Array.isArray(payload.data)) {
      return payload.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch yagya purposes:", error);
    return [];
  }
};

export default {
  getYagyaServices,
  getYagyaServiceBySlug,
  getYagyaPurposes,
  mapApiYagyaServiceToUi,
  mapApiYagyaServiceDetailToUi,
  getYagyaFallbackImage,
};
