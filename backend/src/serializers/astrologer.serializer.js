/**
 * Public Serializers for Astrologer Profiles & Consultation Packages
 */

export const serializePublicAstrologerPackage = (pkg) => {
  if (!pkg) return null;
  const p = pkg.toJSON ? pkg.toJSON() : pkg;

  return {
    id: p.id,
    packageKey: p.packageKey,
    title: p.title,
    subtitle: p.subtitle || null,
    duration: p.duration,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    isPopular: Boolean(p.isPopular),
    badge: p.badge || null,
    knownFor: Array.isArray(p.knownFor) ? p.knownFor : [],
    consultationDetails: Array.isArray(p.consultationDetails) ? p.consultationDetails : [],
    displayOrder: p.displayOrder || 0,
    isActive: Boolean(p.isActive),
  };
};

export const serializePublicAstrologerListing = (astrologer) => {
  if (!astrologer) return null;
  const a = astrologer.toJSON ? astrologer.toJSON() : astrologer;

  const rawPackages = Array.isArray(a.packages) ? a.packages : [];
  const activePackages = rawPackages.filter((p) => p.isActive !== false);

  let startingPrice = null;
  if (activePackages.length > 0) {
    const prices = activePackages.map((p) => Number(p.price)).filter((pr) => !isNaN(pr));
    if (prices.length > 0) {
      startingPrice = Math.min(...prices);
    }
  }

  return {
    id: a.id,
    code: a.code,
    slug: a.slug,
    name: a.name,
    title: a.title,
    eyebrow: a.eyebrow || null,
    quote: a.quote || null,
    description: a.description || null,
    experienceYears: a.experienceYears || 0,
    holySeat: a.holySeat || "Vedic Tradition",
    location: a.location || "India",
    languages: Array.isArray(a.languages) ? a.languages : [],
    specializations: Array.isArray(a.specializations) ? a.specializations : [],
    expertise: Array.isArray(a.expertise) ? a.expertise : [],
    rating: Number(a.rating) || 5.0,
    reviewsCount: a.reviewsCount || "0+",
    sessionsCount: a.sessionsCount || "0+",
    profileImage: a.profileImage || null,
    portraitImage: a.portraitImage || null,
    secondaryImage: a.secondaryImage || null,
    startingPrice,
    packagesCount: activePackages.length,
    displayOrder: a.displayOrder || 0,
    isActive: Boolean(a.isActive),
  };
};

export const serializePublicAstrologerDetail = (astrologer) => {
  if (!astrologer) return null;
  const a = astrologer.toJSON ? astrologer.toJSON() : astrologer;

  const base = serializePublicAstrologerListing(a);
  const rawPackages = Array.isArray(a.packages) ? a.packages : [];
  const activePackages = rawPackages
    .filter((p) => p.isActive !== false)
    .sort((x, y) => (x.displayOrder || 0) - (y.displayOrder || 0))
    .map(serializePublicAstrologerPackage);

  return {
    ...base,
    bioParagraphs: Array.isArray(a.bioParagraphs) ? a.bioParagraphs : [],
    pillars: Array.isArray(a.pillars) ? a.pillars : [],
    faqs: Array.isArray(a.faqs) ? a.faqs : [],
    availableTimeSlots: Array.isArray(a.availableTimeSlots) ? a.availableTimeSlots : [],
    addOnPricing: typeof a.addOnPricing === "object" && a.addOnPricing !== null ? a.addOnPricing : {},
    packages: activePackages,
  };
};

/**
 * Admin Serializers for Astrologer Management
 */
export const serializeAdminAstrologerListing = (astrologer) => {
  if (!astrologer) return null;
  const a = astrologer.toJSON ? astrologer.toJSON() : astrologer;

  const rawPackages = Array.isArray(a.packages) ? a.packages : [];

  return {
    id: a.id,
    code: a.code,
    slug: a.slug,
    name: a.name,
    title: a.title,
    eyebrow: a.eyebrow || null,
    quote: a.quote || null,
    description: a.description || null,
    experienceYears: a.experienceYears || 0,
    holySeat: a.holySeat || "Vedic Tradition",
    location: a.location || "India",
    languages: Array.isArray(a.languages) ? a.languages : [],
    specializations: Array.isArray(a.specializations) ? a.specializations : [],
    expertise: Array.isArray(a.expertise) ? a.expertise : [],
    rating: Number(a.rating) || 5.0,
    reviewsCount: a.reviewsCount || "0+",
    sessionsCount: a.sessionsCount || "0+",
    profileImage: a.profileImage || null,
    portraitImage: a.portraitImage || null,
    secondaryImage: a.secondaryImage || null,
    packagesCount: rawPackages.length,
    displayOrder: a.displayOrder || 0,
    isActive: Boolean(a.isActive),
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
};

/**
 * Admin Serializer for Astrologer Packages
 */
export const serializeAdminAstrologerPackage = (pkg) => {
  if (!pkg) return null;
  const p = pkg.toJSON ? pkg.toJSON() : pkg;

  return {
    id: p.id,
    astrologerId: p.astrologerId || p.astrologer_id,
    packageKey: p.packageKey || p.package_key,
    title: p.title,
    subtitle: p.subtitle || null,
    duration: p.duration,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    isPopular: Boolean(p.isPopular),
    badge: p.badge || null,
    knownFor: Array.isArray(p.knownFor) ? p.knownFor : [],
    consultationDetails: Array.isArray(p.consultationDetails) ? p.consultationDetails : [],
    displayOrder: typeof p.displayOrder === "number" ? p.displayOrder : (p.display_order || 0),
    isActive: Boolean(p.isActive !== undefined ? p.isActive : p.is_active),
    createdAt: p.createdAt || p.created_at,
    updatedAt: p.updatedAt || p.updated_at,
  };
};

export const serializeAdminAstrologerDetail = (astrologer) => {
  if (!astrologer) return null;
  const a = astrologer.toJSON ? astrologer.toJSON() : astrologer;

  const base = serializeAdminAstrologerListing(a);
  const rawPackages = Array.isArray(a.packages) ? a.packages : [];
  const allPackages = rawPackages
    .sort((x, y) => (x.displayOrder || 0) - (y.displayOrder || 0))
    .map(serializeAdminAstrologerPackage);

  return {
    ...base,
    bioParagraphs: Array.isArray(a.bioParagraphs) ? a.bioParagraphs : [],
    pillars: Array.isArray(a.pillars) ? a.pillars : [],
    faqs: Array.isArray(a.faqs) ? a.faqs : [],
    availableTimeSlots: Array.isArray(a.availableTimeSlots) ? a.availableTimeSlots : [],
    addOnPricing: typeof a.addOnPricing === "object" && a.addOnPricing !== null ? a.addOnPricing : {},
    packages: allPackages,
  };
};
