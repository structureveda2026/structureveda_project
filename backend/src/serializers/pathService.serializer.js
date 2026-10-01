/**
 * Public Serializers for Path / Recitation Service Catalogue
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
 * Serializes Path purpose for public listing
 */
export const serializePathPurpose = (purpose) => {
  if (!purpose) return null;
  return {
    id: purpose.id,
    name: purpose.name,
    title: purpose.name,
    slug: purpose.slug,
    description: purpose.description || null,
    iconName: purpose.iconName || "BookOpen",
    displayOrder: purpose.displayOrder ?? 0,
    isActive: Boolean(purpose.isActive),
  };
};

export const serializePublicPathPurpose = serializePathPurpose;

/**
 * Serializes Path service record for public catalogue listing
 */
export const serializePublicPathServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeCategory;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    pathType: service.pathType || "Vedic Path",
    scripture: service.scripture,
    shortDescription: service.shortDescription || null,
    description: service.description || null,
    purpose: service.purposeSummary || null,
    purposeSummary: service.purposeSummary || null,
    purposeCategory: purposeSlug || null,
    purposeCategoryName: purposeName || null,
    purposeKey: purposeSlug || null,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableFormats: Array.isArray(service.availableFormats) ? service.availableFormats : [],
    availableDurations: Array.isArray(service.availableDurations) ? service.availableDurations : [],
    chapterStructure: service.chapterStructure || null,
    totalChapters: service.totalChapters !== null && service.totalChapters !== undefined ? Number(service.totalChapters) : null,
    totalSections: service.totalSections !== null && service.totalSections !== undefined ? Number(service.totalSections) : null,
    totalVerses: service.totalVerses !== null && service.totalVerses !== undefined ? Number(service.totalVerses) : null,
    estimatedRecitationHours: service.estimatedRecitationHours !== null && service.estimatedRecitationHours !== undefined ? Number(service.estimatedRecitationHours) : null,
    dailyRecitationTarget: service.dailyRecitationTarget || null,
    minimumDays: Number(service.minimumDays || 1),
    recommendedDays: Number(service.recommendedDays || 1),
    maximumDays: Number(service.maximumDays || 1),
    minimumPandits: Number(service.minimumPandits || 2),
    recommendedPandits: Number(service.recommendedPandits || 2),
    maximumPandits: Number(service.maximumPandits || 5),
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "3 – 4 Hours Daily",
    dailyRecitationCapacity: service.dailyRecitationCapacity || null,
    samagri: Array.isArray(service.samagri) ? service.samagri : [],
    prasad: service.prasad || null,
    sankalpaFields: service.sankalpaFields || {},
    isKashiAvailable: Boolean(service.isKashiAvailable),
    kashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    remoteAvailable: Boolean(service.isRemoteAvailable),
    availableLocations: Array.isArray(service.availableLocations) ? service.availableLocations : ["kashi", "remote"],
    startingPrice: Number(service.startingPrice || 0),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isFeatured: Boolean(service.isFeatured),
    featured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    active: Boolean(service.isActive),
    image: service.bannerImage || null,
    bannerImage: service.bannerImage || null,
    gallery: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    galleryImages: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    seo: service.seo || {},
    faq: normalizeFaqs(service.faqs),
    faqs: normalizeFaqs(service.faqs),
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

/**
 * Serializes Path service record for public service detail view
 */
export const serializePublicPathServiceDetail = (service) => {
  const listingData = serializePublicPathServiceListing(service);

  return {
    ...listingData,
    purposeDetails: service.purposeDetails
      ? serializePathPurpose(service.purposeDetails)
      : null,
  };
};

export const serializePathService = serializePublicPathServiceDetail;

/**
 * Serializes list of Path services
 */
export const serializePathServiceList = (services) => {
  if (!Array.isArray(services)) return [];
  return services.map(serializePublicPathServiceListing);
};

/**
 * Serializes Path service record for Admin listing table
 */
export const serializeAdminPathServiceListing = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    pathType: service.pathType || "Vedic Path",
    scripture: service.scripture,
    purposeId: service.purposeId || null,
    purpose: purposeName,
    purposeSummary: service.purposeSummary || null,
    purposeCategory: purposeSlug,
    purposeCategories: Array.isArray(service.purposeCategories) ? service.purposeCategories : [],
    availableFormats: Array.isArray(service.availableFormats) ? service.availableFormats : [],
    availableDurations: Array.isArray(service.availableDurations) ? service.availableDurations : [],
    minimumDays: Number(service.minimumDays || 1),
    recommendedDays: Number(service.recommendedDays || 1),
    maximumDays: Number(service.maximumDays || 1),
    minimumPandits: Number(service.minimumPandits || 2),
    recommendedPandits: Number(service.recommendedPandits || 2),
    maximumPandits: Number(service.maximumPandits || 5),
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
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
 * Serializes Path service record for Admin detail/edit form
 */
export const serializeAdminPathServiceDetail = (service) => {
  const purposeName = service.purposeDetails ? service.purposeDetails.name : service.purposeSummary || null;
  const purposeSlug = service.purposeDetails ? service.purposeDetails.slug : service.purposeCategory || null;

  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    pathType: service.pathType || "Vedic Path",
    scripture: service.scripture,
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
    availableFormats: Array.isArray(service.availableFormats) ? service.availableFormats : [],
    availableDurations: Array.isArray(service.availableDurations) ? service.availableDurations : [],
    chapterStructure: service.chapterStructure || null,
    totalChapters: service.totalChapters !== null && service.totalChapters !== undefined ? Number(service.totalChapters) : null,
    totalSections: service.totalSections !== null && service.totalSections !== undefined ? Number(service.totalSections) : null,
    totalVerses: service.totalVerses !== null && service.totalVerses !== undefined ? Number(service.totalVerses) : null,
    estimatedRecitationHours: service.estimatedRecitationHours !== null && service.estimatedRecitationHours !== undefined ? Number(service.estimatedRecitationHours) : null,
    dailyRecitationTarget: service.dailyRecitationTarget || null,
    minimumDays: Number(service.minimumDays || 1),
    recommendedDays: Number(service.recommendedDays || 1),
    maximumDays: Number(service.maximumDays || 1),
    minimumPandits: Number(service.minimumPandits || 2),
    recommendedPandits: Number(service.recommendedPandits || 2),
    maximumPandits: Number(service.maximumPandits || 5),
    requiredSkills: service.requiredSkills || null,
    dailyHours: service.dailyHours || "3 – 4 Hours Daily",
    dailyRecitationCapacity: service.dailyRecitationCapacity || null,
    samagri: Array.isArray(service.samagri) ? service.samagri : [],
    prasad: service.prasad || null,
    sankalpaFields: service.sankalpaFields || {},
    isKashiAvailable: Boolean(service.isKashiAvailable),
    isRemoteAvailable: Boolean(service.isRemoteAvailable),
    availableLocations: Array.isArray(service.availableLocations) ? service.availableLocations : ["kashi", "remote"],
    startingPrice: Number(service.startingPrice),
    formattedPrice: formatIndianCurrency(service.startingPrice),
    isFeatured: Boolean(service.isFeatured),
    isActive: Boolean(service.isActive),
    bannerImage: service.bannerImage || null,
    galleryImages: Array.isArray(service.galleryImages) ? service.galleryImages : [],
    seo: service.seo || {},
    faqs: normalizeFaqs(service.faqs),
    createdAt: service.createdAt || service.created_at,
    updatedAt: service.updatedAt || service.updated_at,
  };
};

export default {
  normalizeFaqs,
  formatIndianCurrency,
  serializePathPurpose,
  serializePublicPathPurpose,
  serializePathService,
  serializePublicPathServiceListing,
  serializePublicPathServiceDetail,
  serializePathServiceList,
  serializeAdminPathServiceListing,
  serializeAdminPathServiceDetail,
};
