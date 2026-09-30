import api from "./api.js";
import {
  JAPA_CATALOGUE_LIST,
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
import rudrakshaImg from "../assets/images/p-rudraksha.jpg";
import samagriImg from "../assets/images/p-samagri.jpg";

/**
 * Slug to fallback image lookup
 */
const SLUG_IMAGE_MAP = {
  "maha-mrityunjaya-japa": pujaMrityunjayaImg,
  "navagraha-shanti-japa": pujaNavagrahaImg,
  "gayatri-mantra-japa": mantraImg,
  "durga-navarna-japa": pujaRudrabhishekImg,
  "hanuman-moola-mantra-japa": pujaVishnuImg,
  "ganesh-atharvashirsha-japa": pujaGaneshImg,
  "maha-lakshmi-japa": pujaLakshmiImg,
  "om-namah-shivaya-japa": pujaKashiImg,
};

/**
 * Resolves a reliable fallback image for a Japa service
 */
export const getJapaFallbackImage = (slug) => {
  return SLUG_IMAGE_MAP[slug] || defaultJapaImg;
};

/**
 * Normalizes a single listing item from GET /api/japa-services
 */
export const mapApiJapaServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getJapaFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;

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
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery
      : (Array.isArray(item.galleryImages) && item.galleryImages.length > 0 ? item.galleryImages : [primaryImage, malaImg, rudrakshaImg]),
    galleryImages: Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
      : (Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [primaryImage, malaImg, rudrakshaImg]),
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
  getJapaPurposes,
  mapApiJapaServiceToUi,
  mapApiJapaServiceDetailToUi,
  getJapaFallbackImage,
};

export default japaCatalogueService;
