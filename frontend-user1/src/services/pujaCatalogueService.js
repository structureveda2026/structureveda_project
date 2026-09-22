import api from "./api.js";

// Static fallback image imports to guarantee resilience if an image URL is missing or fails
import defaultPujaImg from "../assets/images/puja-kashi.jpg";
import pujaRudrabhishekImg from "../assets/images/puja-rudrabhishek.jpg";
import pujaMrityunjayaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../assets/images/puja-navagraha.jpg";
import pujaLakshmiImg from "../assets/images/puja-lakshmi.jpg";
import pujaGangaImg from "../assets/images/puja-ganga.jpg";
import pujaGaneshImg from "../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../assets/images/puja-vishnu.jpg";

/**
 * Slug to fallback image lookup
 */
const SLUG_IMAGE_MAP = {
  "rudrabhishek-puja": pujaRudrabhishekImg,
  "maha-mrityunjaya-puja": pujaMrityunjayaImg,
  "navagraha-shanti-puja": pujaNavagrahaImg,
  "maha-lakshmi-sri-suktam-puja": pujaLakshmiImg,
  "kashi-ganga-pujan": pujaGangaImg,
  "ganesh-vighnaharta-puja": pujaGaneshImg,
  "shiva-parvati-vivah-puja": pujaVishnuImg,
};

/**
 * Resolves a reliable image for a service
 */
export const getServiceFallbackImage = (slug) => {
  return SLUG_IMAGE_MAP[slug] || defaultPujaImg;
};

export const formatModeLabel = (mode) => {
  if (!mode) return "In-Person (Kashi) or Remote";
  const m = String(mode).toLowerCase();
  if (m === "in_person" || m === "offline") return "In-Person (Kashi)";
  if (m === "remote" || m === "online") return "Remote Sankalpa";
  if (m === "hybrid") return "In-Person & Remote";
  return mode;
};

/**
 * Normalizes a single listing item from GET /api/puja-services
 */
export const mapApiPujaServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getServiceFallbackImage(item.slug);
  const primaryImage = item.image || item.bannerImage || fallbackImg;

  const formattedPrice = (item.formattedPrice && !item.formattedPrice.startsWith("?"))
    ? item.formattedPrice
    : (item.startingPrice ? `₹${Number(item.startingPrice).toLocaleString("en-IN")}` : "₹1,100");

  return {
    ...item,
    image: primaryImage,
    bannerImage: primaryImage,
    formattedPrice,
    purposeSummary: item.purposeSummary || item.purpose || null,
    rawAvailableMode: item.availableMode || "hybrid",
    availableMode: formatModeLabel(item.availableMode),
    duration: item.duration || (Array.isArray(item.availableDurations) && item.availableDurations.length > 0 ? item.availableDurations.join(", ") : "2–3 Hours"),
    availableDurations: Array.isArray(item.availableDurations) ? item.availableDurations : [],
    durationHours: Array.isArray(item.durationHours) ? item.durationHours : [],
    locationType: item.locationType || "Kashi Ghats & Consecrated Mandirs",
    location: item.location || "Kashi (Varanasi) / Consecrated Shrines",
    isFeatured: Boolean(item.isFeatured),
    isKashiAvailable: typeof item.isKashiAvailable === "boolean" ? item.isKashiAvailable : true,
  };
};

/**
 * Normalizes a detail item from GET /api/puja-services/:slug
 */
export const mapApiPujaServiceDetailToUi = (item) => {
  if (!item) return null;

  const base = mapApiPujaServiceToUi(item);
  const fallbackImg = getServiceFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;

  const rawGallery = Array.isArray(item.galleryImages) && item.galleryImages.length > 0
    ? item.galleryImages
    : [];

  const images = [primaryImage, ...rawGallery].filter(Boolean);

  // Normalize whyPerform to ensure objects with title and description
  const normalizedWhyPerform = Array.isArray(item.whyPerform)
    ? item.whyPerform.map((b) => (typeof b === "string" ? { title: b, description: "" } : b))
    : [];

  // Normalize procedureSteps to guarantee step string
  const normalizedProcedureSteps = Array.isArray(item.procedureSteps)
    ? item.procedureSteps.map((s, idx) => ({
        ...s,
        step: s.step || (s.stepNumber ? String(s.stepNumber).padStart(2, "0") : `0${idx + 1}`),
      }))
    : [];

  // Normalize faqs to guarantee canonical { question, answer } structure
  const normalizedFaqs = Array.isArray(item.faqs)
    ? item.faqs
        .map((faq) => {
          if (!faq || typeof faq !== "object") return null;
          const question = typeof faq.question === "string" ? faq.question : (typeof faq.q === "string" ? faq.q : "");
          const answer = typeof faq.answer === "string" ? faq.answer : (typeof faq.a === "string" ? faq.a : "");
          return { question, answer };
        })
        .filter((f) => f && (f.question || f.answer))
    : [];

  return {
    ...base,
    fullDescription: item.fullDescription || item.shortDescription || "",
    image: primaryImage,
    bannerImage: primaryImage,
    galleryImages: rawGallery,
    images: images.length > 0 ? images : [fallbackImg],
    whatsIncluded: Array.isArray(item.whatsIncluded) ? item.whatsIncluded : [],
    whyPerform: normalizedWhyPerform,
    significance: Array.isArray(item.significance) ? item.significance : [],
    procedureSteps: normalizedProcedureSteps,
    faqs: normalizedFaqs,
    purposeDetails: item.purposeDetails || null,
  };
};

/**
 * Fetches public Puja services from GET /api/puja-services
 * Supports server-side search, purpose, duration, mode, isFeatured, sortBy, pagination.
 */
export const getPujaServices = async (filterParams = {}) => {
  try {
    const query = {};

    // 1. Search
    if (filterParams.search && String(filterParams.search).trim()) {
      query.search = String(filterParams.search).trim();
    }

    // 2. Purpose filter (expects slug e.g. "protection-peace")
    if (filterParams.purpose && filterParams.purpose !== "All Purposes") {
      query.purpose = String(filterParams.purpose).trim().toLowerCase();
    }

    // 3. Duration filter (extracts integer e.g. "2 Hours" -> 2)
    if (filterParams.duration && filterParams.duration !== "All Durations") {
      const durNum = parseInt(filterParams.duration, 10);
      if (!isNaN(durNum) && durNum > 0) {
        query.duration = durNum;
      }
    }

    // 4. Mode filter (canonical backend values: "in_person", "remote", "hybrid")
    if (filterParams.mode && filterParams.mode !== "All Modes") {
      let normalizedMode = String(filterParams.mode).trim().toLowerCase().replace(/-/g, "_").replace(/\s+/g, "_");
      if (normalizedMode === "online") normalizedMode = "remote";
      if (normalizedMode === "offline") normalizedMode = "in_person";

      if (["in_person", "remote", "hybrid"].includes(normalizedMode)) {
        query.mode = normalizedMode;
      }
    }

    // 5. Featured filter
    if (filterParams.isFeatured === true || filterParams.isFeatured === "true") {
      query.isFeatured = "true";
    }

    // 6. Sorting (canonical backend options: "featured", "price-asc", "price-desc", "name-asc")
    if (filterParams.sortBy) {
      let sortVal = String(filterParams.sortBy).trim().toLowerCase();
      if (sortVal === "popular" || sortVal === "newest" || sortVal === "duration-asc") {
        sortVal = "featured";
      }
      if (["featured", "price-asc", "price-desc", "name-asc"].includes(sortVal)) {
        query.sortBy = sortVal;
      }
    }

    // 7. Pagination
    if (filterParams.page) {
      query.page = parseInt(filterParams.page, 10) || 1;
    }
    if (filterParams.limit) {
      query.limit = parseInt(filterParams.limit, 10) || 20;
    } else {
      query.limit = 50; // Default generous limit to show all catalogue services
    }

    const response = await api.get("/puja-services", { params: query });
    const payload = response.data;

    const rawList = Array.isArray(payload.data) ? payload.data : [];
    const normalizedServices = rawList.map(mapApiPujaServiceToUi);

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
    console.error("Failed to fetch puja services:", error);
    throw error;
  }
};

/**
 * Fetches a single public Puja service by slug from GET /api/puja-services/:slug
 */
export const getPujaServiceBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const response = await api.get(`/puja-services/${encodeURIComponent(slug)}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return mapApiPujaServiceDetailToUi(payload.data);
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch puja service by slug (${slug}):`, error);
    throw error;
  }
};

/**
 * Fetches active Puja purposes from GET /api/puja-services/purposes
 */
export const getPujaPurposes = async () => {
  try {
    const response = await api.get("/puja-services/purposes");
    const payload = response.data;

    if (payload && payload.success && Array.isArray(payload.data)) {
      return payload.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch puja purposes:", error);
    return [];
  }
};

export default {
  getPujaServices,
  getPujaServiceBySlug,
  getPujaPurposes,
  mapApiPujaServiceToUi,
  mapApiPujaServiceDetailToUi,
  getServiceFallbackImage,
};
