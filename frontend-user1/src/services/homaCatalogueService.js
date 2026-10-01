import api from "./api.js";
import {
  HOMA_PURPOSE_CATEGORIES,
} from "../features/yagyaPuja/data/homaCatalogueData.js";

// Static fallback image imports to guarantee visual resilience
import defaultHomaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaMrityunjayaImg from "../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../assets/images/puja-navagraha.jpg";
import pujaGaneshImg from "../assets/images/puja-ganesh.jpg";
import pujaLakshmiImg from "../assets/images/puja-lakshmi.jpg";
import pujaRudrabhishekImg from "../assets/images/puja-rudrabhishek.jpg";
import pujaKashiImg from "../assets/images/puja-kashi.jpg";
import samagriImg from "../assets/images/p-samagri.jpg";
import vastuImg from "../assets/images/c-vastu.jpg";
import yagyaHeroImg from "../assets/images/yagya_hero.png";

/**
 * Slug to fallback image lookup for Homa services
 */
const SLUG_IMAGE_MAP = {
  "maha-mrityunjaya-homa": pujaMrityunjayaImg,
  "navagraha-homa": pujaNavagrahaImg,
  "ganapati-homa": pujaGaneshImg,
  "durga-chandi-homa": pujaLakshmiImg,
  "lakshmi-kubera-homa": pujaLakshmiImg,
  "rudra-homa": pujaRudrabhishekImg,
  "vastu-shanti-homa": vastuImg,
  "ayushya-homa": yagyaHeroImg,
};

/**
 * Resolves a reliable fallback image for a Homa service
 */
export const getHomaFallbackImage = (slug) => {
  return SLUG_IMAGE_MAP[slug] || defaultHomaImg;
};

/**
 * Safely normalizes requiredSkills into an array of trimmed strings
 */
export const normalizeRequiredSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skills === "string" && skills.trim()) {
    return skills.includes(",")
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [skills.trim()];
  }
  return [];
};

/**
 * Normalizes Homa purpose items so both 'name' and 'title' are universally available
 */
export const normalizeHomaPurpose = (item) => {
  if (!item) return null;
  const name = item.name || item.title || "";
  const title = item.title || item.name || "";
  const id = item.id || item.slug || "";
  const slug = item.slug || item.id || "";
  return {
    ...item,
    id,
    slug,
    name,
    title,
    description: item.description || "",
    iconName: item.iconName || "Flame",
  };
};

/**
 * Normalizes a single listing or detail item from GET /api/homa-services or GET /api/homa-services/:slug
 */
export const mapApiHomaServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getHomaFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;

  const startingPrice = Number(item.startingPrice) || Number(item.basePrice) || 11000;
  const basePrice = Number(item.basePrice) || startingPrice;
  const perHavanPrice = Number(item.perHavanPrice) || 0;
  const perDayPrice = Number(item.perDayPrice) || 0;

  const formattedPrice =
    item.formattedPrice && !item.formattedPrice.includes("?")
      ? item.formattedPrice
      : `₹${startingPrice.toLocaleString("en-IN")}`;

  const availableHavanCounts = Array.isArray(item.availableHavanCounts)
    ? item.availableHavanCounts
        .map((v) => (v === "custom" || v === "Custom" ? "custom" : Number(v)))
        .filter((n) => n === "custom" || (!isNaN(n) && n > 0))
    : [1, 3, 5];

  const availableDays = Array.isArray(item.availableDays)
    ? item.availableDays.map(Number).filter((n) => !isNaN(n) && n > 0)
    : [1];

  const availableLocations =
    Array.isArray(item.availableLocations) && item.availableLocations.length > 0
      ? item.availableLocations
      : ["kashi", "remote"];

  const isKashiAvailable =
    typeof item.isKashiAvailable === "boolean"
      ? item.isKashiAvailable
      : typeof item.kashiAvailable === "boolean"
      ? item.kashiAvailable
      : true;

  const isRemoteAvailable =
    typeof item.isRemoteAvailable === "boolean"
      ? item.isRemoteAvailable
      : typeof item.remoteAvailable === "boolean"
      ? item.remoteAvailable
      : true;

  const isFeatured =
    typeof item.isFeatured === "boolean"
      ? item.isFeatured
      : Boolean(item.featured);

  const isActive =
    typeof item.isActive === "boolean"
      ? item.isActive
      : typeof item.active === "boolean"
      ? item.active
      : true;

  const gallery =
    Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery
      : Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
      : [primaryImage, samagriImg, pujaKashiImg];

  const samagri = Array.isArray(item.samagri)
    ? item.samagri.map((s) =>
        typeof s === "string" ? { name: s, status: "Included" } : s
      )
    : [
        { name: "Havan Samagri", status: "Included" },
        { name: "Pure Cow Ghrita", status: "Included" },
        { name: "Samidha Woods", status: "Included" },
        { name: "Sacred Bhasma Consecration", status: "Included" },
      ];

  const faqs = Array.isArray(item.faqs)
    ? item.faqs
    : Array.isArray(item.faq)
    ? item.faq
    : [];

  return {
    ...item,
    id: item.id || item.slug,
    slug: item.slug,
    name: item.name,
    homaType: item.homaType || "Vedic Homa",
    shortDescription: item.shortDescription || item.description || "",
    description: item.description || item.shortDescription || "",
    purpose:
      item.purposeSummary ||
      item.purpose ||
      "Traditional Vedic fire sacrifice for auspiciousness and peace",
    purposeSummary:
      item.purposeSummary ||
      item.purpose ||
      "Traditional Vedic fire sacrifice for auspiciousness and peace",
    purposeCategory:
      item.purposeCategory ||
      (item.purposeDetails ? item.purposeDetails.slug : "shanti-wellbeing"),
    purposeCategories:
      Array.isArray(item.purposeCategories) && item.purposeCategories.length > 0
        ? item.purposeCategories
        : [item.purposeCategory || "shanti-wellbeing"],
    availableHavanCounts,
    availableDays,
    availableLocations,
    minimumPandits: Number(item.minimumPandits) || 2,
    recommendedPandits: Number(item.recommendedPandits) || 3,
    maximumPandits: Number(item.maximumPandits) || 11,
    requiredSkills: normalizeRequiredSkills(item.requiredSkills),
    dailyHours: item.dailyHours || "3 – 4 Hours Daily",
    havanCapacityPerPandit:
      item.havanCapacityPerPandit || "500 Ahutis per Pandit / Day",
    samagri,
    prasad:
      item.prasad ||
      "Consecrated Homa Bhasma, blessed Raksha Sutra, and energized Prasad token",
    sankalpaFields: item.sankalpaFields || {
      name: true,
      gotra: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    isKashiAvailable,
    kashiAvailable: isKashiAvailable,
    isRemoteAvailable,
    remoteAvailable: isRemoteAvailable,
    startingPrice,
    basePrice,
    perHavanPrice,
    perDayPrice,
    formattedPrice,
    isFeatured,
    featured: isFeatured,
    isActive,
    active: isActive,
    image: primaryImage,
    bannerImage: primaryImage,
    gallery,
    galleryImages: gallery,
    seo: item.seo || {},
    faq: faqs,
    faqs,
  };
};

/**
 * Detail serializer alias
 */
export const mapApiHomaServiceDetailToUi = (item) => {
  return mapApiHomaServiceToUi(item);
};

/**
 * Fetches public Homa services from GET /api/homa-services with query filters
 */
export const getHomaServices = async (filterParams = {}) => {
  try {
    const query = {};

    if (filterParams.search && String(filterParams.search).trim()) {
      query.search = String(filterParams.search).trim();
    }

    const rawPurpose =
      filterParams.purpose !== undefined ? filterParams.purpose : filterParams.category;
    if (
      rawPurpose &&
      rawPurpose !== "all" &&
      rawPurpose !== "All" &&
      rawPurpose !== "All Purposes" &&
      rawPurpose !== "All Purpose Categories"
    ) {
      query.purpose = String(rawPurpose).trim().toLowerCase();
    }

    const rawCount =
      filterParams.havanCount !== undefined
        ? filterParams.havanCount
        : filterParams.count;
    if (
      rawCount &&
      rawCount !== "all" &&
      rawCount !== "All" &&
      rawCount !== "custom" &&
      rawCount !== "Custom"
    ) {
      const countNum = parseInt(String(rawCount).trim(), 10);
      if (!isNaN(countNum) && countNum > 0) {
        query.count = countNum;
      }
    }

    if (
      filterParams.days &&
      filterParams.days !== "all" &&
      filterParams.days !== "All"
    ) {
      const daysNum = parseInt(String(filterParams.days).trim(), 10);
      if (!isNaN(daysNum) && daysNum > 0) {
        query.days = daysNum;
      }
    }

    const rawMode =
      filterParams.mode !== undefined ? filterParams.mode : filterParams.location;
    if (rawMode && rawMode !== "all" && rawMode !== "All") {
      const normalizedMode = String(rawMode).trim().toLowerCase();
      if (["kashi", "remote"].includes(normalizedMode)) {
        query.mode = normalizedMode;
      }
    }

    if (filterParams.isFeatured === true || filterParams.isFeatured === "true") {
      query.isFeatured = "true";
    }

    if (filterParams.sortBy) {
      const sortVal = String(filterParams.sortBy).trim().toLowerCase();
      if (sortVal === "price-low" || sortVal === "price-asc") {
        query.sortBy = "price-asc";
      } else if (sortVal === "price-high" || sortVal === "price-desc") {
        query.sortBy = "price-desc";
      } else if (sortVal === "name" || sortVal === "name-asc") {
        query.sortBy = "name-asc";
      } else if (sortVal === "name-desc") {
        query.sortBy = "name-desc";
      } else if (sortVal === "featured") {
        query.sortBy = "featured";
      }
    }

    if (filterParams.page) {
      query.page = parseInt(filterParams.page, 10) || 1;
    }
    if (filterParams.limit) {
      query.limit = parseInt(filterParams.limit, 10) || 50;
    }

    const response = await api.get("/homa-services", { params: query });
    const payload = response.data;

    const rawList = Array.isArray(payload.data) ? payload.data : [];
    const normalizedServices = rawList.map(mapApiHomaServiceToUi);

    return {
      success: true,
      services: normalizedServices,
      count: payload.count || normalizedServices.length,
      total: payload.total || normalizedServices.length,
      page: payload.currentPage || payload.page || 1,
      limit: payload.limit || 50,
      totalPages: payload.totalPages || 1,
    };
  } catch (error) {
    console.error("Failed to fetch Homa services from API:", error);
    throw error;
  }
};

/**
 * Fetches a single public Homa service by slug from GET /api/homa-services/:slug
 */
export const getHomaServiceBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const cleanSlug = String(slug).trim().toLowerCase();
    const response = await api.get(`/homa-services/${cleanSlug}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return mapApiHomaServiceDetailToUi(payload.data);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch Homa service for slug "${slug}":`, error);
    throw error;
  }
};

/**
 * Fetches public Homa purpose categories from GET /api/homa-services/purposes
 */
export const getHomaPurposes = async () => {
  try {
    const response = await api.get("/homa-services/purposes");
    const payload = response.data;
    if (
      payload &&
      payload.success &&
      Array.isArray(payload.data) &&
      payload.data.length > 0
    ) {
      return payload.data.map(normalizeHomaPurpose);
    }
  } catch (error) {
    console.warn(
      "Failed to fetch Homa purposes from API, using fallback categories:",
      error?.message || error
    );
  }

  return HOMA_PURPOSE_CATEGORIES.map(normalizeHomaPurpose);
};

const homaCatalogueService = {
  getHomaServices,
  getHomaServiceBySlug,
  getHomaPurposes,
  mapApiHomaServiceToUi,
  mapApiHomaServiceDetailToUi,
  normalizeRequiredSkills,
  normalizeHomaPurpose,
  getHomaFallbackImage,
};

export default homaCatalogueService;
