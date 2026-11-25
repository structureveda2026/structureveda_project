import api from "./api.js";
import {
  JAPA_PURPOSE_CATEGORIES,
} from "../features/yagyaPuja/data/japaCatalogueData.js";

// Static fallback image imports to guarantee visual resilience
import defaultJapaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaMrityunjayaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../assets/images/puja-navagraha.jpg";
import pujaRudrabhishekImg from "../assets/images/puja-rudrabhishek.jpg";
import pujaLakshmiImg from "../assets/images/puja-lakshmi.jpg";
import pujaGaneshImg from "../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../assets/images/puja-vishnu.jpg";
import pujaKashiImg from "../assets/images/puja-kashi.jpg";
import malaImg from "../assets/images/p-mala.jpg";
import mantraImg from "../assets/images/c-mantra.jpg";
import meditationImg from "../assets/images/c-meditation.jpg";
import rudrakshaImg from "../assets/images/p-rudraksha.jpg";
import samagriImg from "../assets/images/p-samagri.jpg";
import deviDurgaImg from "../assets/images/devi_durga_card.jpg";
import deityHanumanImg from "../assets/images/deity-hanuman.jpg";

/**
 * Safely identifies whether an asset URL is a legacy unresolvable relative path
 * that does not exist in Vite's public or built asset tree.
 */
export const isUnresolvableAsset = (url) => {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (!trimmed) return true;

  // External URLs (Cloudinary, CDN, S3) are always valid
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return false;

  // Data URLs or blobs are valid
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return false;

  // Static images located in Vite public folder (/images/...) are valid
  if (trimmed.startsWith("/images/")) return false;

  // Vite development mode asset paths
  if (trimmed.startsWith("/src/") || trimmed.startsWith("/@fs/")) return false;

  // Vite production built assets have an 8-character build hash, e.g. /assets/name-XXXXXXXX.ext
  if (trimmed.startsWith("/assets/")) {
    const isViteHashed = /\-[A-Za-z0-9_-]{8}\.[a-zA-Z0-9]+$/.test(trimmed);
    if (isViteHashed) {
      return false;
    }
    // Any unhashed /assets/... from DB seed (like /assets/puja-rudrabhishek.jpg) is unresolvable
    return true;
  }

  // Any relative path that doesn't start with / is unresolvable
  if (!trimmed.startsWith("/")) return true;

  return false;
};

/**
 * Slug to fallback image lookup covering all 8 canonical database slugs and legacy aliases
 */
export const SLUG_IMAGE_MAP = {
  // 8 Canonical Database Slugs
  "maha-mrityunjaya-japa": pujaMrityunjayaImg,
  "navagraha-mantra-japa": pujaNavagrahaImg,
  "gayatri-mantra-japa": meditationImg || mantraImg,
  "durga-saptashati-mantra-japa": deviDurgaImg,
  "hanuman-mantra-japa": deityHanumanImg || pujaVishnuImg,
  "ganapati-atharvashirsha-japa": pujaGaneshImg,
  "maha-lakshmi-shri-suktam-japa": pujaLakshmiImg,
  "shiva-panchakshari-japa": pujaRudrabhishekImg,

  // Legacy/Alias Slugs
  "navagraha-shanti-japa": pujaNavagrahaImg,
  "durga-navarna-japa": deviDurgaImg,
  "hanuman-moola-mantra-japa": deityHanumanImg || pujaVishnuImg,
  "ganesh-atharvashirsha-japa": pujaGaneshImg,
  "maha-lakshmi-japa": pujaLakshmiImg,
  "om-namah-shivaya-japa": pujaRudrabhishekImg,
};

/**
 * Category slug to image lookup
 */
export const CATEGORY_IMAGE_MAP = {
  "shiva-mantra-japa": pujaMrityunjayaImg,
  "gayatri-vedic-japa": mantraImg,
  "durga-shakti-japa": deviDurgaImg,
  "hanuman-raksha-japa": deityHanumanImg || pujaVishnuImg,
  "ganapati-siddhi-japa": pujaGaneshImg,
  "lakshmi-prosperity-japa": pujaLakshmiImg,
  "navagraha-planetary-japa": pujaNavagrahaImg,
};

/**
 * Resolves a reliable fallback image for a Japa service
 */
export const getJapaFallbackImage = (slug) => {
  return (slug && SLUG_IMAGE_MAP[slug]) || defaultJapaImg;
};

/**
 * Multi-tier reliable image resolution:
 * 1. Valid Admin-uploaded service image (Cloudinary, data:, /images/...)
 * 2. Service-specific mapped Vite asset
 * 3. Japa category fallback image
 * 4. Default neutral Vedic fallback
 */
export const resolveJapaImage = (item) => {
  if (!item) return defaultJapaImg;

  // 1. Valid Admin-uploaded image
  if (item.bannerImage && !isUnresolvableAsset(item.bannerImage)) {
    return item.bannerImage;
  }
  if (item.image && !isUnresolvableAsset(item.image)) {
    return item.image;
  }

  // 2. Correctly mapped local Vite-imported image by service slug
  if (item.slug && SLUG_IMAGE_MAP[item.slug]) {
    return SLUG_IMAGE_MAP[item.slug];
  }

  // 3. Appropriate Japa category fallback image
  const categorySlug = item.category?.slug || item.categorySlug || item.categoryId;
  if (categorySlug && CATEGORY_IMAGE_MAP[categorySlug]) {
    return CATEGORY_IMAGE_MAP[categorySlug];
  }

  // 4. Default neutral Vedic fallback
  return defaultJapaImg;
};

/**
 * Resolves curated multi-image gallery of authentic Vedic ritual photos for each Japa service
 */
export const getJapaServiceGallery = (slug, primaryImage) => {
  const baseImg = primaryImage || getJapaFallbackImage(slug);
  switch (slug) {
    case "maha-mrityunjaya-japa":
      return [pujaMrityunjayaImg, pujaRudrabhishekImg, malaImg, pujaKashiImg];
    case "navagraha-mantra-japa":
    case "navagraha-shanti-japa":
      return [pujaNavagrahaImg, samagriImg, malaImg, pujaKashiImg];
    case "gayatri-mantra-japa":
      return [meditationImg, mantraImg, malaImg, pujaKashiImg];
    case "durga-saptashati-mantra-japa":
    case "durga-navarna-japa":
      return [deviDurgaImg, samagriImg, rudrakshaImg, pujaKashiImg];
    case "hanuman-mantra-japa":
    case "hanuman-moola-mantra-japa":
      return [deityHanumanImg || pujaVishnuImg, rudrakshaImg, malaImg, pujaKashiImg];
    case "ganapati-atharvashirsha-japa":
    case "ganesh-atharvashirsha-japa":
      return [pujaGaneshImg, samagriImg, malaImg, pujaKashiImg];
    case "maha-lakshmi-shri-suktam-japa":
    case "maha-lakshmi-japa":
      return [pujaLakshmiImg, samagriImg, malaImg, pujaKashiImg];
    case "shiva-panchakshari-japa":
    case "om-namah-shivaya-japa":
      return [pujaRudrabhishekImg, pujaMrityunjayaImg, rudrakshaImg, pujaKashiImg];
    default:
      return [baseImg, malaImg, rudrakshaImg, pujaKashiImg];
  }
};

/**
 * Normalizes a single listing item from GET /api/japa-services
 */
export const mapApiJapaServiceToUi = (item) => {
  if (!item) return null;

  const primaryImage = resolveJapaImage(item);

  const formattedPrice =
    item.formattedPrice && !item.formattedPrice.includes("?")
      ? item.formattedPrice
      : item.startingPrice
      ? `₹${Number(item.startingPrice).toLocaleString("en-IN")}`
      : "₹18,000";

  const availableCounts = Array.isArray(item.availableCounts)
    ? item.availableCounts.map(Number).filter((n) => !isNaN(n) && n > 0)
    : [11000, 21000, 51000, 125000];

  const variants = Array.isArray(item.variants) && item.variants.length > 0
    ? item.variants.map((v) => ({
        count: Number(v.count),
        label: v.label || `${Number(v.count).toLocaleString("en-IN")} Japa`,
        startingPrice: Number(v.startingPrice) || Number(item.startingPrice) || 18000,
        estimatedDuration: v.estimatedDuration || "3-4 Days",
        minimumPandits: Number(v.minimumPandits) || Number(item.minimumPandits) || 2,
        recommendedPandits: Number(v.recommendedPandits) || Number(item.recommendedPandits) || 3,
        dailyCapacity: Number(v.dailyCapacity) || Number(item.dailyCapacityPerPandit) || 2000,
      }))
    : availableCounts.map((cnt) => {
        const estDays = Math.ceil(cnt / ((item.recommendedPandits || 3) * (item.dailyCapacityPerPandit || 2000)));
        return {
          count: cnt,
          label: `${cnt.toLocaleString("en-IN")} Japa`,
          startingPrice: Number(item.startingPrice) || 18000,
          estimatedDuration: `${estDays} Days`,
          minimumPandits: Number(item.minimumPandits) || 2,
          recommendedPandits: Number(item.recommendedPandits) || 3,
          dailyCapacity: Number(item.dailyCapacityPerPandit) || 2000,
        };
      });

  const rawGallery = Array.isArray(item.gallery) && item.gallery.length > 0
    ? item.gallery
    : (Array.isArray(item.galleryImages) && item.galleryImages.length > 0 ? item.galleryImages : []);

  const sanitizedGallery = rawGallery
    .filter((img) => !isUnresolvableAsset(img));

  const resolvedGallery = sanitizedGallery.length > 0
    ? sanitizedGallery
    : getJapaServiceGallery(item.slug, primaryImage);

  return {
    ...item,
    id: item.id || item.slug,
    slug: item.slug,
    name: item.name,
    mantra: item.mantra || "",
    mantraMeaning: item.mantraMeaning || "",
    shortDescription: item.shortDescription || item.description || "",
    description: item.description || item.shortDescription || "",
    purpose: item.purposeSummary || item.purpose || "Spiritual practice, peace and wellbeing",
    purposeCategory: item.purposeCategory || (item.purposeDetails ? item.purposeDetails.slug : "shanti-wellbeing"),
    purposeCategories: Array.isArray(item.purposeCategories) && item.purposeCategories.length > 0
      ? item.purposeCategories
      : [item.purposeCategory || "shanti-wellbeing"],
    categoryId: item.categoryId || null,
    category: item.category || (item.categoryDetails ? {
      id: item.categoryDetails.id,
      name: item.categoryDetails.name,
      slug: item.categoryDetails.slug,
      description: item.categoryDetails.description || null,
    } : null),
    availableCounts,
    variants,
    dailyCapacityPerPandit: Number(item.dailyCapacityPerPandit) || 2000,
    minimumPandits: Number(item.minimumPandits) || 2,
    recommendedPandits: Number(item.recommendedPandits) || 4,
    maximumPandits: Number(item.maximumPandits) || 11,
    requiredSkills: item.requiredSkills || "Vedic Chanting, Sanskrit Chandas recitation",
    dailyHours: item.dailyHours || "4 Hours Daily",
    completionWindow: item.completionWindow || `${variants[0]?.estimatedDuration || "3-4 Days"}`,
    startingPrice: Number(item.startingPrice) || variants[0]?.startingPrice || 18000,
    formattedPrice,
    isKashiAvailable: typeof item.isKashiAvailable === "boolean" ? item.isKashiAvailable : (typeof item.kashiAvailable === "boolean" ? item.kashiAvailable : true),
    kashiAvailable: typeof item.isKashiAvailable === "boolean" ? item.isKashiAvailable : (typeof item.kashiAvailable === "boolean" ? item.kashiAvailable : true),
    isRemoteAvailable: typeof item.isRemoteAvailable === "boolean" ? item.isRemoteAvailable : (typeof item.remoteAvailable === "boolean" ? item.remoteAvailable : true),
    remoteAvailable: typeof item.isRemoteAvailable === "boolean" ? item.isRemoteAvailable : (typeof item.remoteAvailable === "boolean" ? item.remoteAvailable : true),
    isFeatured: typeof item.isFeatured === "boolean" ? item.isFeatured : Boolean(item.featured),
    featured: typeof item.isFeatured === "boolean" ? item.isFeatured : Boolean(item.featured),
    isActive: typeof item.isActive === "boolean" ? item.isActive : (typeof item.active === "boolean" ? item.active : true),
    active: typeof item.isActive === "boolean" ? item.isActive : (typeof item.active === "boolean" ? item.active : true),
    image: primaryImage,
    bannerImage: primaryImage,
    gallery: resolvedGallery,
    galleryImages: resolvedGallery,
    samagri: Array.isArray(item.samagri) && item.samagri.length > 0
      ? item.samagri
      : ["Japa Mala", "Gangajal", "Pavitra Bhasma", "Dhoop & Deepam", "Sandalwood Paste", "Pure Ghee"],
    prasad: item.prasad || "Energized Japa Mala, consecrated Raksha Sutra, and dry prasad dispatch",
    seo: item.seo || {},
    faq: Array.isArray(item.faq) ? item.faq : (Array.isArray(item.faqs) ? item.faqs : []),
  };
};

/**
 * Normalizes a detail item from GET /api/japa-services/:slug
 */
export const mapApiJapaServiceDetailToUi = (item) => {
  if (!item) return null;
  return mapApiJapaServiceToUi(item);
};

/**
 * Fetches public Japa services from GET /api/japa-services with query filters
 */
export const getJapaServices = async (filterParams = {}) => {
  try {
    const query = {};

    if (filterParams.search && String(filterParams.search).trim()) {
      query.search = String(filterParams.search).trim();
    }

    if (filterParams.category && filterParams.category !== "All" && filterParams.category !== "All Categories") {
      query.category = String(filterParams.category).trim().toLowerCase();
    }

    if (filterParams.purpose && filterParams.purpose !== "All" && filterParams.purpose !== "All Purposes") {
      query.purpose = String(filterParams.purpose).trim().toLowerCase();
    }

    if (filterParams.count && filterParams.count !== "All" && filterParams.count !== "All Counts") {
      const countNum = parseInt(filterParams.count, 10);
      if (!isNaN(countNum) && countNum > 0) {
        query.count = countNum;
      }
    }

    if (filterParams.mode && filterParams.mode !== "All" && filterParams.mode !== "All Modes") {
      let normalizedMode = String(filterParams.mode).trim().toLowerCase();
      if (["kashi", "remote"].includes(normalizedMode)) {
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
      query.limit = parseInt(filterParams.limit, 10) || 50;
    }

    const response = await api.get("/japa-services", { params: query });
    const payload = response.data;

    const rawList = Array.isArray(payload.data) ? payload.data : [];
    const normalizedServices = rawList.map(mapApiJapaServiceToUi);

    return {
      success: true,
      services: normalizedServices,
      count: payload.count || normalizedServices.length,
      total: payload.total || normalizedServices.length,
      page: payload.page || 1,
      limit: payload.limit || 50,
      totalPages: payload.totalPages || 1,
    };
  } catch (error) {
    console.error("Failed to fetch japa services from API:", error);
    throw error;
  }
};

/**
 * Fetches a single public Japa service by slug from GET /api/japa-services/:slug
 */
export const getJapaServiceBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const cleanSlug = String(slug).trim().toLowerCase();
    const response = await api.get(`/japa-services/${cleanSlug}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return mapApiJapaServiceDetailToUi(payload.data);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch japa service for slug "${slug}":`, error);
    throw error;
  }
};

let cachedJapaCategories = null;
let japaCategoriesPromise = null;

/**
 * Fetches active Japa categories from GET /api/japa-categories with in-memory session caching
 */
export const getJapaCategories = async (forceRefresh = false) => {
  if (cachedJapaCategories && !forceRefresh) {
    return cachedJapaCategories;
  }

  if (!japaCategoriesPromise || forceRefresh) {
    japaCategoriesPromise = api
      .get("/japa-categories")
      .then((response) => {
        const payload = response.data;
        if (payload && payload.success && Array.isArray(payload.data)) {
          const sorted = [...payload.data].sort(
            (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
          );
          cachedJapaCategories = sorted;
          return sorted;
        }
        return [];
      })
      .catch((error) => {
        japaCategoriesPromise = null;
        console.error("Failed to fetch japa categories:", error);
        throw error;
      });
  }

  return japaCategoriesPromise;
};

/**
 * Fetches a single public Japa category by slug from GET /api/japa-categories/:slug
 */
export const getJapaCategoryBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const cleanSlug = String(slug).trim().toLowerCase();
    const response = await api.get(`/japa-categories/${encodeURIComponent(cleanSlug)}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return payload.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch japa category by slug (${slug}):`, error);
    throw error;
  }
};

/**
 * Fetches public Japa purpose categories from GET /api/japa-services/purposes
 */
export const getJapaPurposes = async () => {
  try {
    const response = await api.get("/japa-services/purposes");
    const payload = response.data;
    if (payload && payload.success && Array.isArray(payload.data) && payload.data.length > 0) {
      return payload.data;
    }
  } catch (error) {
    console.warn("Failed to fetch Japa purposes from API, using fallback categories:", error?.message || error);
  }

  return JAPA_PURPOSE_CATEGORIES;
};

const japaCatalogueService = {
  getJapaServices,
  getJapaServiceBySlug,
  getJapaCategories,
  getJapaCategoryBySlug,
  getJapaPurposes,
  mapApiJapaServiceToUi,
  mapApiJapaServiceDetailToUi,
  getJapaFallbackImage,
  resolveJapaImage,
  getJapaServiceGallery,
  isUnresolvableAsset,
};

export default japaCatalogueService;
