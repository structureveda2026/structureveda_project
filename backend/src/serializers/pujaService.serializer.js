/**
 * Public Serializers for Puja Service Catalogue
 */


/**
 * Normalizes FAQ items to canonical { question, answer } structure
 */
export const normalizeFaqs = (faqs) => {
  if (!Array.isArray(faqs)) return [];
  return faqs.map((faq) => {
    if (!faq || typeof faq !== "object") return { question: "", answer: "" };
    return {
      question: typeof faq.question === "string" ? faq.question : (typeof faq.q === "string" ? faq.q : ""),
      answer: typeof faq.answer === "string" ? faq.answer : (typeof faq.a === "string" ? faq.a : ""),
    };
  }).filter((f) => f.question || f.answer);
};

export const formatIndianCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `\u20B9${num.toLocaleString("en-IN")}`;
};

/**
 * Serializes service record for public catalogue listing
 */
export const serializePublicPujaServiceListing = (service) => {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    eyebrow: service.eyebrow || null,
    tagline: service.tagline || null,
    shortDescription: service.shortDescription || null,
    deity: service.deity,
    purpose: service.purposeSummary || null,
    purposeCategory: service.purposeDetails ? service.purposeDetails.name : null,
    purposeKey: service.purposeDetails ? service.purposeDetails.slug : null,
    availableDurations: Array.isArray(service.availableDurations)
      ? service.availableDurations
      : [],
    duration: service.duration || null,
    durationHours: Array.isArray(service.durationHours)
      ? service.durationHours
      : [],
    locationType: service.locationType || null,
    location: service.location || null,
    availableMode: service.availableMode,
    isKashiAvailable: Boolean(service.isKashiAvailable),
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isFeatured: Boolean(service.isFeatured),
    image: service.bannerImage || null,
  };
};

/**
 * Serializes service record for public service detail view
 */
export const serializePublicPujaServiceDetail = (service) => {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    eyebrow: service.eyebrow || null,
    tagline: service.tagline || null,
    shortDescription: service.shortDescription || null,
    fullDescription: service.fullDescription || null,
    deity: service.deity,
    purpose: service.purposeSummary || null,
    purposeCategory: service.purposeDetails ? service.purposeDetails.name : null,
    purposeKey: service.purposeDetails ? service.purposeDetails.slug : null,
    purposeDetails: service.purposeDetails
      ? {
          id: service.purposeDetails.id,
          name: service.purposeDetails.name,
          slug: service.purposeDetails.slug,
          description: service.purposeDetails.description || null,
          iconName: service.purposeDetails.iconName,
          displayOrder: service.purposeDetails.displayOrder,
        }
      : null,
    availableDurations: Array.isArray(service.availableDurations)
      ? service.availableDurations
      : [],
    duration: service.duration || null,
    durationHours: Array.isArray(service.durationHours)
      ? service.durationHours
      : [],
    locationType: service.locationType || null,
    location: service.location || null,
    availableMode: service.availableMode,
    isKashiAvailable: Boolean(service.isKashiAvailable),
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    image: service.bannerImage || null,
    bannerImage: service.bannerImage || null,
    galleryImages: Array.isArray(service.galleryImages)
      ? service.galleryImages
      : [],
    whatsIncluded: Array.isArray(service.whatsIncluded)
      ? service.whatsIncluded
      : [],
    whyPerform: Array.isArray(service.whyPerform)
      ? service.whyPerform
      : [],
    significance: Array.isArray(service.significance)
      ? service.significance
      : [],
    procedureSteps: Array.isArray(service.procedureSteps)
      ? service.procedureSteps
      : [],
    faqs: normalizeFaqs(service.faqs),
  };
};

/**
 * Serializes purpose category for public purpose list
 */
export const serializePublicPujaPurpose = (purpose) => {
  return {
    id: purpose.id,
    name: purpose.name,
    slug: purpose.slug,
    description: purpose.description || null,
    iconName: purpose.iconName,
    displayOrder: purpose.displayOrder,
  };
};

/**
 * Serializes service record for Admin table listing
 */
export const serializeAdminPujaServiceListing = (service) => {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    purposeId: service.purposeId || null,
    purpose: service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null,
    purposeSummary: service.purposeSummary || null,
    deity: service.deity,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    availableMode: service.availableMode,
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

/**
 * Serializes service record for Admin detail/edit form
 */
export const serializeAdminPujaServiceDetail = (service) => {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    eyebrow: service.eyebrow || null,
    tagline: service.tagline || null,
    shortDescription: service.shortDescription || null,
    fullDescription: service.fullDescription || null,
    deity: service.deity,
    purposeId: service.purposeId || null,
    purpose: service.purposeDetails ? service.purposeDetails.name : null,
    purposeSummary: service.purposeSummary || null,
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
    availableDurations: Array.isArray(service.availableDurations)
      ? service.availableDurations
      : [],
    duration: service.duration || null,
    durationHours: Array.isArray(service.durationHours)
      ? service.durationHours
      : [],
    locationType: service.locationType || null,
    location: service.location || null,
    availableMode: service.availableMode,
    isKashiAvailable: Boolean(service.isKashiAvailable),
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    galleryImages: Array.isArray(service.galleryImages)
      ? service.galleryImages
      : [],
    whatsIncluded: Array.isArray(service.whatsIncluded)
      ? service.whatsIncluded
      : [],
    whyPerform: Array.isArray(service.whyPerform)
      ? service.whyPerform
      : [],
    significance: Array.isArray(service.significance)
      ? service.significance
      : [],
    procedureSteps: Array.isArray(service.procedureSteps)
      ? service.procedureSteps
      : [],
    faqs: normalizeFaqs(service.faqs),
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};
