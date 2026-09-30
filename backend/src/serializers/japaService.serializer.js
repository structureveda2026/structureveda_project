/**
 * Public Serializers for Japa Service Catalogue
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
 * Serializes Japa purpose for public listing
 */
export const serializePublicJapaPurpose = (purpose) => {
  return {
    id: purpose.id,
    name: purpose.name,
    title: purpose.name,
    slug: purpose.slug,
    description: purpose.description || null,
    iconName: purpose.iconName || "Sparkles",
    displayOrder: purpose.displayOrder || 0,
    isActive: Boolean(purpose.isActive),
  };
};

/**
 * Serializes Japa service record for public catalogue listing
 */
export const serializePublicJapaServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeCategory;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    mantra: service.mantra,
    mantraMeaning: service.mantraMeaning || null,
    shortDescription: service.shortDescription || null,
    description: service.description || null,
    purpose: service.purposeSummary || null,
    purposeCategory: purposeSlug || null,
    purposeCategoryName: purposeName || null,
    purposeKey: purposeSlug || null,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableCounts: Array.isArray(service.availableCounts) ? service.availableCounts : [],
    variants: Array.isArray(service.variants) ? service.variants : [],
    dailyCapacityPerPandit: service.dailyCapacityPerPandit || 2000,
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 4,
    maximumPandits: service.maximumPandits || 11,
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "4 Hours Daily",
    completionWindow: service.completionWindow || null,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    kashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    remoteAvailable: Boolean(service.isRemoteAvailable),
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
    seo: service.seo || {},
    faq: normalizeFaqs(service.faqs),
  };
};

/**
 * Serializes Japa service record for public service detail view
 */
export const serializePublicJapaServiceDetail = (service) => {
  const listingData = serializePublicJapaServiceListing(service);

  return {
    ...listingData,
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
  };
};

/**
 * Serializes Japa service record for Admin table listing
 */
export const serializeAdminJapaServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    mantra: service.mantra,
    purposeId: service.purposeId || null,
    purpose: purposeName,
    purposeSummary: service.purposeSummary || null,
    purposeCategory: purposeSlug,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableCounts: Array.isArray(service.availableCounts) ? service.availableCounts : [],
    dailyCapacityPerPandit: service.dailyCapacityPerPandit || 2000,
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 4,
    maximumPandits: service.maximumPandits || 11,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

/**
 * Serializes Japa service record for Admin detail/edit form
 */
export const serializeAdminJapaServiceDetail = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    mantra: service.mantra,
    mantraMeaning: service.mantraMeaning || null,
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
    availableCounts: Array.isArray(service.availableCounts) ? service.availableCounts : [],
    variants: Array.isArray(service.variants) ? service.variants : [],
    dailyCapacityPerPandit: service.dailyCapacityPerPandit || 2000,
    minimumPandits: service.minimumPandits || 2,
    recommendedPandits: service.recommendedPandits || 4,
    maximumPandits: service.maximumPandits || 11,
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "4 Hours Daily",
    completionWindow: service.completionWindow || null,
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isKashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    galleryImages: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    samagri: Array.isArray(service.samagri) ? service.samagri : [],
    prasad: service.prasad || null,
    seo: service.seo || {},
    faqs: normalizeFaqs(service.faqs),
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

