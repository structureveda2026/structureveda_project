/**
 * Public Serializers for Homa Service Catalogue
 */

export const normalizeFaqs = (faqs) => {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((faq) => {
      if (!faq || typeof faq !== "object") return { question: "", answer: "" };
      return {
        question:
          typeof faq.question === "string"
            ? faq.question
            : typeof faq.q === "string"
            ? faq.q
            : "",
        answer:
          typeof faq.answer === "string"
            ? faq.answer
            : typeof faq.a === "string"
            ? faq.a
            : "",
      };
    })
    .filter((f) => f.question || f.answer);
};

export const formatIndianCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `\u20B9${num.toLocaleString("en-IN")}`;
};

/**
 * Serializes Homa purpose for public listing
 */
export const serializePublicHomaPurpose = (purpose) => {
  return {
    id: purpose.id,
    name: purpose.name,
    title: purpose.name,
    slug: purpose.slug,
    description: purpose.description || null,
    iconName: purpose.iconName || "Flame",
    displayOrder: purpose.displayOrder || 0,
    isActive: Boolean(purpose.isActive),
  };
};

/**
 * Serializes Homa service record for public catalogue listing
 */
export const serializePublicHomaServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeCategory;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    homaType: service.homaType || "Vedic Homa",
    shortDescription: service.shortDescription || null,
    description: service.description || null,
    purpose: service.purposeSummary || null,
    purposeCategory: purposeSlug || null,
    purposeCategoryName: purposeName || null,
    purposeKey: purposeSlug || null,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableHavanCounts: Array.isArray(service.availableHavanCounts) ? service.availableHavanCounts.map(Number) : [],
    availableDays: Array.isArray(service.availableDays) ? service.availableDays.map(Number) : [],
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 3,
    maximumPandits: service.maximumPandits || 11,
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "3 – 4 Hours Daily",
    havanCapacityPerPandit: service.havanCapacityPerPandit || null,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    basePrice: Number(service.basePrice || service.startingPrice),
    perHavanPrice: Number(service.perHavanPrice || 0),
    perDayPrice: Number(service.perDayPrice || 0),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    kashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    remoteAvailable: Boolean(service.isRemoteAvailable),
    availableLocations: Array.isArray(service.availableLocations) ? service.availableLocations : ["kashi", "remote"],
    isFeatured: Boolean(service.isFeatured),
    featured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    active: Boolean(service.isActive),
    image: service.bannerImage || null,
    bannerImage: service.bannerImage || null,
    gallery: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    galleryImages: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    samagri: Array.isArray(service.samagri) ? service.samagri : [],
    prasad: service.prasad || null,
    sankalpaFields: service.sankalpaFields || {},
    seo: service.seo || {},
    faq: normalizeFaqs(service.faqs),
    faqs: normalizeFaqs(service.faqs),
  };
};

/**
 * Serializes Homa service record for public service detail view
 */
export const serializePublicHomaServiceDetail = (service) => {
  const listingData = serializePublicHomaServiceListing(service);

  return {
    ...listingData,
    purposeDetails: service.purposeDetails
      ? serializePublicHomaPurpose(service.purposeDetails)
      : null,
  };
};

/**
 * Serializes Homa service record for Admin table listing
 */
export const serializeAdminHomaServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    homaType: service.homaType || "Vedic Homa",
    purposeId: service.purposeId || null,
    purpose: purposeName,
    purposeSummary: service.purposeSummary || null,
    purposeCategory: purposeSlug,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableHavanCounts: Array.isArray(service.availableHavanCounts) ? service.availableHavanCounts.map(Number) : [],
    availableDays: Array.isArray(service.availableDays) ? service.availableDays.map(Number) : [],
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 3,
    maximumPandits: service.maximumPandits || 11,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    basePrice: Number(service.basePrice || service.startingPrice),
    perHavanPrice: Number(service.perHavanPrice || 0),
    perDayPrice: Number(service.perDayPrice || 0),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    availableLocations: Array.isArray(service.availableLocations) ? service.availableLocations : ["kashi", "remote"],
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

/**
 * Serializes Homa service record for Admin detail/edit form
 */
export const serializeAdminHomaServiceDetail = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    homaType: service.homaType || "Vedic Homa",
    shortDescription: service.shortDescription || null,
    description: service.description || null,
    purposeId: service.purposeId || null,
    purpose: purposeName,
    purposeSummary: service.purposeSummary || null,
    purposeCategory: purposeSlug,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    purposeDetails: service.purposeDetails
      ? {
          id: service.purposeDetails.id,
          name: service.purposeDetails.name,
          slug: service.purposeDetails.slug,
          description: service.purposeDetails.description || null,
          iconName: service.purposeDetails.iconName,
          displayOrder: service.purposeDetails.displayOrder,
          isActive: service.purposeDetails.isActive,
        }
      : null,
    availableHavanCounts: Array.isArray(service.availableHavanCounts) ? service.availableHavanCounts.map(Number) : [],
    availableDays: Array.isArray(service.availableDays) ? service.availableDays.map(Number) : [],
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 3,
    maximumPandits: service.maximumPandits || 11,
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "3 – 4 Hours Daily",
    havanCapacityPerPandit: service.havanCapacityPerPandit || null,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    basePrice: Number(service.basePrice || service.startingPrice),
    perHavanPrice: Number(service.perHavanPrice || 0),
    perDayPrice: Number(service.perDayPrice || 0),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    availableLocations: Array.isArray(service.availableLocations) ? service.availableLocations : ["kashi", "remote"],
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    galleryImages: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    samagri: Array.isArray(service.samagri) ? service.samagri : [],
    prasad: service.prasad || null,
    sankalpaFields: service.sankalpaFields || {},
    seo: service.seo || {},
    faqs: normalizeFaqs(service.faqs),
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

export default {
  normalizeFaqs,
  formatIndianCurrency,
  serializePublicHomaPurpose,
  serializePublicHomaServiceListing,
  serializePublicHomaServiceDetail,
  serializeAdminHomaServiceListing,
  serializeAdminHomaServiceDetail,
};

