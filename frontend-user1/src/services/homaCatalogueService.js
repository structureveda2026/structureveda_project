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
import navagrahaRitualShowcaseImg from "../assets/images/homa/navagraha-ritual-showcase.jpg";
import deviDurgaImg from "../assets/images/devi_durga_card.jpg";

import navagrahaHeroSacredFireImg from "../assets/images/homa/navagraha-hero-sacred-fire.jpg";
import navagrahaMandalaYantraImg from "../assets/images/homa/navagraha-mandala-yantra.jpg";
import navagrahaSacredSamagriImg from "../assets/images/homa/navagraha-sacred-samagri.jpg";
import shivaHeroImg from "../assets/images/homa/shiva-rudra-homa-hero.jpg";
import homaHeroMorningSanctumImg from "../assets/images/homa/homa-hero-morning-sanctum.jpg";
import homaHeroKashiCeremonyImg from "../assets/images/homa/homa-hero-kashi-ceremony.jpg";
import yagyaFireRitualImg from "../assets/images/yagya/yagya-fire-ritual.webp.png";
import yagyaSacredFireDetailImg from "../assets/images/yagya/yagya-sacred-fire-detail.webp.png";
import yagyaPurnahutiImg from "../assets/images/yagya/yagya-purnahuti.webp.png";
import cardYagyaFireImg from "../assets/images/library/cards/card-yagya-fire.jpg";
import bannerFireRitualImg from "../assets/images/library/banners/banner-fire-ritual.png";
import samagriPushpaImg from "../assets/images/samagri/samagri-pushpa-bilva.jpg";
import samagriHavanMixImg from "../assets/images/samagri/samagri-havan-mix.jpg";
import samagriSpecialAhutiImg from "../assets/images/samagri/samagri-special-ahuti.jpg";
import samagriGheeImg from "../assets/images/samagri/samagri-desi-ghee.jpg";
import samagriCopperKundImg from "../assets/images/samagri/samagri-copper-agni-kund.jpg";
import samagriHerbalImg from "../assets/images/samagri/samagri-herbal-decoction.jpg";

/**
 * Slug to fallback image lookup for Homa services
 */
const SLUG_IMAGE_MAP = {
  "maha-mrityunjaya-homa": pujaMrityunjayaImg,
  "navagraha-homa": navagrahaRitualShowcaseImg || pujaNavagrahaImg,
  "ganapati-homa": pujaGaneshImg,
  "durga-chandi-homa": deviDurgaImg || pujaLakshmiImg,
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
 * Resolves a curated multi-image gallery of authentic Vedic ritual photos for each Homa service
 */
export const getHomaServiceGallery = (slug, primaryImage) => {
  const baseImg = primaryImage || getHomaFallbackImage(slug);
  switch (slug) {
    case "navagraha-homa":
      return [
        navagrahaRitualShowcaseImg,
        navagrahaHeroSacredFireImg,
        navagrahaMandalaYantraImg,
        navagrahaSacredSamagriImg,
      ];
    case "maha-mrityunjaya-homa":
      return [
        pujaMrityunjayaImg,
        shivaHeroImg,
        samagriPushpaImg,
        homaHeroKashiCeremonyImg,
      ];
    case "rudra-homa":
      return [
        pujaRudrabhishekImg,
        shivaHeroImg,
        samagriPushpaImg,
        homaHeroKashiCeremonyImg,
      ];
    case "ganapati-homa":
      return [
        pujaGaneshImg,
        yagyaSacredFireDetailImg,
        samagriHavanMixImg,
        homaHeroMorningSanctumImg,
      ];
    case "durga-chandi-homa":
      return [
        deviDurgaImg,
        yagyaPurnahutiImg,
        samagriSpecialAhutiImg,
        homaHeroKashiCeremonyImg,
      ];
    case "lakshmi-kubera-homa":
      return [
        pujaLakshmiImg,
        cardYagyaFireImg,
        samagriGheeImg,
        homaHeroMorningSanctumImg,
      ];
    case "vastu-shanti-homa":
      return [
        vastuImg,
        bannerFireRitualImg,
        samagriCopperKundImg,
        homaHeroMorningSanctumImg,
      ];
    case "ayushya-homa":
      return [
        yagyaHeroImg,
        homaHeroMorningSanctumImg,
        samagriHerbalImg,
        homaHeroKashiCeremonyImg,
      ];
    default:
      return [
        baseImg,
        homaHeroMorningSanctumImg,
        samagriHavanMixImg,
        homaHeroKashiCeremonyImg,
      ];
  }
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
 * Normalizes a single listing or detail item from GET /api/homa-services or GET /api/homa-services/:slug
 */
export const mapApiHomaServiceToUi = (item) => {
  if (!item) return null;

  const fallbackImg = getHomaFallbackImage(item.slug);
  const rawImg = !isUnresolvableAsset(item.bannerImage)
    ? item.bannerImage
    : !isUnresolvableAsset(item.image)
    ? item.image
    : null;
  const primaryImage = rawImg || fallbackImg;

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

  const rawGallery =
    Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery
      : Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
      : [];

  const cleanGallery = Array.from(
    new Set(
      rawGallery
        .filter((img) => !isUnresolvableAsset(img))
        .filter(Boolean)
    )
  );

  const curatedGallery = getHomaServiceGallery(item.slug, primaryImage);
  // PRESERVE ADMIN UPLOADS: If admin uploaded 1 or more valid images, preserve them;
  // only fall back to curated multi-slide gallery if no valid images exist.
  const gallery = cleanGallery.length > 0 ? cleanGallery : curatedGallery;

  const samagri = Array.isArray(item.samagri)
    ? item.samagri.map((s) =>
        typeof s === "string" ? { name: s, status: "Included" } : s
      )
    : [];

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

    const KNOWN_PURPOSES = [
      "shanti-wellbeing",
      "wealth-prosperity",
      "protection-victory",
      "planetary-dosha",
      "health-longevity",
      "spiritual-growth",
      "education-career",
    ];

    if (
      filterParams.category &&
      filterParams.category !== "all" &&
      filterParams.category !== "All" &&
      filterParams.category !== "All Categories"
    ) {
      const catVal = String(filterParams.category).trim().toLowerCase();
      if (KNOWN_PURPOSES.includes(catVal) && !filterParams.purpose) {
        query.purpose = catVal;
      } else {
        query.category = catVal;
      }
    }

    if (
      filterParams.purpose &&
      filterParams.purpose !== "all" &&
      filterParams.purpose !== "All" &&
      filterParams.purpose !== "All Purposes" &&
      filterParams.purpose !== "All Purpose Categories"
    ) {
      query.purpose = String(filterParams.purpose).trim().toLowerCase();
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

let cachedHomaCategories = null;
let homaCategoriesPromise = null;

/**
 * Fetches active Homa categories from GET /api/homa-categories with in-memory caching
 */
export const getHomaCategories = async (forceRefresh = false) => {
  if (cachedHomaCategories && !forceRefresh) {
    return cachedHomaCategories;
  }

  if (!homaCategoriesPromise || forceRefresh) {
    homaCategoriesPromise = api
      .get("/homa-categories")
      .then((response) => {
        const payload = response.data;
        if (payload && payload.success && Array.isArray(payload.data)) {
          const sorted = [...payload.data].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          );
          cachedHomaCategories = sorted;
          return sorted;
        }
        return [];
      })
      .catch((error) => {
        homaCategoriesPromise = null;
        console.error("Failed to fetch homa categories:", error);
        throw error;
      });
  }

  return homaCategoriesPromise;
};

/**
 * Fetches a single public Homa category by slug from GET /api/homa-categories/:slug
 */
export const getHomaCategoryBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const cleanSlug = String(slug).trim().toLowerCase();
    const response = await api.get(`/homa-categories/${encodeURIComponent(cleanSlug)}`);
    const payload = response.data;

    if (payload && payload.success && payload.data) {
      return payload.data;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Failed to fetch homa category by slug (${slug}):`, error);
    throw error;
  }
};

const homaCatalogueService = {
  getHomaServices,
  getHomaServiceBySlug,
  getHomaCategories,
  getHomaCategoryBySlug,
  getHomaPurposes,
  mapApiHomaServiceToUi,
  mapApiHomaServiceDetailToUi,
  normalizeRequiredSkills,
  normalizeHomaPurpose,
  getHomaFallbackImage,
  getHomaServiceGallery,
};

export default homaCatalogueService;
