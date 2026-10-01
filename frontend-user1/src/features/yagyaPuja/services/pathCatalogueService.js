import api from "../../../services/api.js";
import {
  PATH_PURPOSE_CATEGORIES,
} from "../data/pathCatalogueData.js";

// Static fallback image imports to guarantee visual resilience
import gitaImg from "../../../assets/images/c-gita.jpg";
import mantraImg from "../../../assets/images/c-mantra.jpg";
import rudrakshaImg from "../../../assets/images/p-rudraksha.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";

/**
 * Slug to fallback image lookup for Path services
 */
const SLUG_IMAGE_MAP = {
  "sundarkand-path": rudrakshaImg,
  "durga-saptashati-path": pujaLakshmiImg,
  "shrimad-bhagavad-gita-path": gitaImg,
  "shri-rudram-rudri-path": pujaRudrabhishekImg,
  "vishnu-sahasranama-path": pujaVishnuImg,
  "ramcharitmanas-akhand-path": rudrakshaImg,
  "valmiki-ramayana-path": mantraImg,
  "shiva-mahimna-stotra-path": pujaMrityunjayaImg,
};

/**
 * Resolves a reliable fallback image for a Path service
 */
export const getPathFallbackImage = (slug) => {
  return SLUG_IMAGE_MAP[slug] || rudrakshaImg;
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
 * Normalizes Path purpose items so both 'name' and 'title' are universally available
 */
export const normalizePathPurpose = (item) => {
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
    iconName: item.iconName || "BookOpen",
  };
};

/**
 * Normalizes a single listing or detail item from GET /api/path-services or GET /api/path-services/:slug
 */
export const mapApiPathServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getPathFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;

  const startingPrice = Number(item.startingPrice) || 5100;
  const basePrice = Number(item.basePrice) || startingPrice;

  const formattedPrice =
    item.formattedPrice && !item.formattedPrice.includes("?")
      ? item.formattedPrice
      : `₹${startingPrice.toLocaleString("en-IN")}`;

  const availableFormats =
    Array.isArray(item.availableFormats) && item.availableFormats.length > 0
      ? item.availableFormats
      : ["single_session", "same_day"];

  const availableDurations =
    Array.isArray(item.availableDurations) && item.availableDurations.length > 0
      ? item.availableDurations
      : ["3 to 4 Hours"];

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
      : [primaryImage, gitaImg, pujaKashiImg];

  const samagri = Array.isArray(item.samagri)
    ? item.samagri.map((s) =>
        typeof s === "string" ? { name: s, status: "Included" } : s
      )
    : [
        { name: "Sacred Pothi / Scripture Granth", status: "Included" },
        { name: "Asana & Peetha Vastra", status: "Included" },
        { name: "Panchamrit & Puja Dravya", status: "Included" },
        { name: "Deepa, Dhoopa & Pushpa Offerings", status: "Included" },
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
    pathType: item.pathType || "Vedic Path",
    scripture: item.scripture || "Vedic Scripture",
    shortDescription: item.shortDescription || item.description || "",
    description: item.description || item.shortDescription || "",
    purpose:
      item.purposeSummary ||
      item.purpose ||
      "Traditional Vedic scripture recitation with auspicious Sankalpa",
    purposeSummary:
      item.purposeSummary ||
      item.purpose ||
      "Traditional Vedic scripture recitation with auspicious Sankalpa",
    purposeCategory:
      item.purposeCategory ||
      (item.purposeDetails ? item.purposeDetails.slug : "devotional-practice"),
    purposeCategories:
      Array.isArray(item.purposeCategories) && item.purposeCategories.length > 0
        ? item.purposeCategories
        : [item.purposeCategory || "devotional-practice"],
    availableFormats,
    availableDurations,
    availableLocations,
    minimumDays: Number(item.minimumDays) || 1,
    recommendedDays: Number(item.recommendedDays) || Number(item.minimumDays) || 1,
    maximumDays: Number(item.maximumDays) || 9,
    minimumPandits: Number(item.minimumPandits) || 1,
    recommendedPandits: Number(item.recommendedPandits) || Number(item.minimumPandits) || 2,
    maximumPandits: Number(item.maximumPandits) || 5,
    requiredSkills: normalizeRequiredSkills(item.requiredSkills),
    chapterStructure: item.chapterStructure || "Complete Sacred Text",
    dailyTarget: item.dailyTarget || "Continuous Chanting Session",
    estimatedRecitationHours: item.estimatedRecitationHours || "3 - 4 Hours",
    samagri,
    prasad:
      item.prasad ||
      "Consecrated Kumkum, Raksha Sutra, and sacred recitation token",
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
export const mapApiPathServiceDetailToUi = (item) => {
  return mapApiPathServiceToUi(item);
};

/**
 * Fetches public Path services from GET /api/path-services with query filters
 */
export const getPathServices = async (filterParams = {}) => {
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

    if (
      filterParams.format &&
      filterParams.format !== "all" &&
      filterParams.format !== "All"
    ) {
      query.format = String(filterParams.format).trim();
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

    const response = await api.get("/path-services", { params: query });
    const payload = response.data;

    const rawList = Array.isArray(payload.data) ? payload.data : [];
    const normalizedServices = rawList.map(mapApiPathServiceToUi);

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
    console.error("Failed to fetch Path services from API:", error);
    throw error;
  }
};

/**
 * Fetches a single public Path service by slug from GET /api/path-services/:slug
 */
export const getPathServiceBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const cleanSlug = String(slug).trim().toLowerCase();
    const response = await api.get(`/path-services/${cleanSlug}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return mapApiPathServiceDetailToUi(payload.data);
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch Path service for slug "${slug}":`, error);
    throw error;
  }
};

/**
 * Fetches public Path purpose categories from GET /api/path-services/purposes
 */
export const getPathPurposes = async () => {
  try {
    const response = await api.get("/path-services/purposes");
    const payload = response.data;
    if (
      payload &&
      payload.success &&
      Array.isArray(payload.data) &&
      payload.data.length > 0
    ) {
      return payload.data.map(normalizePathPurpose);
    }
  } catch (error) {
    console.warn(
      "Failed to fetch Path purposes from API, using fallback categories:",
      error?.message || error
    );
  }

  return PATH_PURPOSE_CATEGORIES.map(normalizePathPurpose);
};

const pathCatalogueService = {
  getPathServices,
  getPathServiceBySlug,
  getPathPurposes,
  mapApiPathServiceToUi,
  mapApiPathServiceDetailToUi,
  normalizeRequiredSkills,
  normalizePathPurpose,
  getPathFallbackImage,
};

export default pathCatalogueService;
