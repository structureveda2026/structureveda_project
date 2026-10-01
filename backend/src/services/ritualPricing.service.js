/**
 * Centralized Ritual Pricing Service
 * Single source of truth for authoritative ritual booking price calculations.
 */

const EXTRA_PANDIT_RATE = 500.00;

export const formatIndianCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
};

/**
 * Derives the completion date for a multi-day ceremony (YYYY-MM-DD).
 * Completion date = start_date + (days - 1) days.
 * @param {string} startDateStr - YYYY-MM-DD format
 * @param {number|string} days - positive integer
 * @returns {string} YYYY-MM-DD completion date
 */
export const deriveCompletionDate = (startDateStr, days) => {
  if (!startDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(String(startDateStr).trim())) {
    throw new Error("Invalid start date for completion date calculation. Expected YYYY-MM-DD.");
  }
  const numDays = parseInt(days, 10);
  if (isNaN(numDays) || numDays <= 0) {
    throw new Error("Days must be a positive integer.");
  }
  const [y, m, d] = String(startDateStr).trim().split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  dateObj.setUTCDate(dateObj.getUTCDate() + (numDays - 1));
  return dateObj.toISOString().split("T")[0];
};

/**
 * Calculates authoritative pricing for a ritual service (PUJA).
 * Existing Puja logic remains completely unchanged.
 * @param {Object} params
 * @param {Object} params.service - Sequelize PujaService instance
 * @param {number} params.durationHours - Selected duration in hours
 * @param {number} params.panditCount - Requested pandit count (min 1)
 * @param {Array} params.addons - Client submitted addons array (untrusted prices)
 * @returns {Object} authoritative pricing details
 */
export const calculateRitualPriceInternal = ({
  service,
  durationHours,
  panditCount = 1,
  addons = [],
}) => {
  if (!service) {
    throw new Error("Service is required for price calculation");
  }

  // 1. Authoritative Base Price from database
  const basePrice = Number(service.startingPrice) || 0;

  // 2. Validate durationHours
  const durationNum = parseInt(durationHours, 10);
  if (isNaN(durationNum) || durationNum <= 0) {
    throw new Error("Invalid durationHours parameter. Must be a positive integer.");
  }

  const allowedDurations = Array.isArray(service.durationHours) ? service.durationHours : [];
  if (allowedDurations.length > 0 && !allowedDurations.includes(durationNum)) {
    throw new Error(
      `Duration of ${durationNum} hour(s) is not available for this Puja service. Available options: ${allowedDurations.join(", ")} hours.`
    );
  }

  // 3. Validate panditCount
  const panditNum = parseInt(panditCount, 10);
  if (isNaN(panditNum) || panditNum < 1) {
    throw new Error("Pandit count must be at least 1.");
  }

  // 4. Pandit Surcharge: 1 Pandit included in base price
  const additionalPandits = Math.max(0, panditNum - 1);
  const panditAddonPrice = Number((additionalPandits * EXTRA_PANDIT_RATE).toFixed(2));

  // 5. Add-ons pricing: In Phase 2, no dynamic add-on catalog exists yet.
  // Never trust client prices; addonsTotal remains 0.00 and breakdown is empty.
  const addonsTotal = 0.00;
  const breakdown = [];

  // 6. Total Amount
  const totalAmount = Number((basePrice + panditAddonPrice + addonsTotal).toFixed(2));
  const formattedTotal = formatIndianCurrency(totalAmount);

  return {
    serviceType: "PUJA",
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    durationHours: durationNum,
    panditCount: panditNum,
    basePrice: Number(basePrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    currency: "INR",
    breakdown,
  };
};

/**
 * Calculates authoritative pricing for a multi-day Yagya service.
 * Follows Phase 5D authoritative pricing rules:
 * - Selected days determines the pricing tier
 * - Tier price becomes the base package price
 * - Tier includes defined pandit team
 * - Rejects unauthorized custom surcharges or unsupported configurations
 * - addonsTotal remains 0.00
 *
 * @param {Object} params
 * @param {Object} params.service - Sequelize YagyaService instance
 * @param {number|string} params.days - Selected duration in days
 * @param {number|string} [params.durationHours] - Total ritual hours (days * dailyRitualHours)
 * @param {number|string} [params.dailyHours] - Daily hours
 * @param {number|string} [params.panditCount] - Selected pandit count
 * @param {Array} [params.addons] - Untrusted client addons
 * @returns {Object} authoritative Yagya pricing details
 */
export const calculateYagyaPriceInternal = ({
  service,
  days,
  durationHours,
  dailyHours,
  panditCount,
  addons = [],
}) => {
  if (!service) {
    throw new Error("Yagya service is required for price calculation");
  }

  if (service.isActive === false) {
    throw new Error("Yagya service is currently inactive");
  }

  // 1. Resolve and validate days
  let numDays = parseInt(days, 10);
  const expectedDailyHours = Number(service.dailyRitualHours) || 5;

  if (isNaN(numDays) || numDays <= 0) {
    if (durationHours && !isNaN(parseInt(durationHours, 10))) {
      numDays = Math.round(parseInt(durationHours, 10) / expectedDailyHours);
    }
  }

  if (isNaN(numDays) || numDays <= 0) {
    throw new Error("Invalid days parameter. Must be a positive integer.");
  }

  const availableDurations = Array.isArray(service.availableDurations)
    ? service.availableDurations.map(Number)
    : [];
  if (availableDurations.length > 0 && !availableDurations.includes(numDays)) {
    throw new Error(
      `Selected duration of ${numDays} days is not available for this Yagya. Available options: ${availableDurations.join(", ")} days.`
    );
  }

  // 2. Validate Daily Hours
  if (dailyHours != null) {
    const numDailyHours = parseInt(dailyHours, 10);
    if (!isNaN(numDailyHours) && numDailyHours !== expectedDailyHours) {
      throw new Error(
        `Daily ritual hours mismatch. Expected ${expectedDailyHours} hours/day for this Yagya, received ${numDailyHours}.`
      );
    }
  }

  // 3. Authoritative Total Duration Hours
  const expectedTotalHours = numDays * expectedDailyHours;
  if (durationHours != null) {
    const numTotalHours = parseInt(durationHours, 10);
    if (!isNaN(numTotalHours) && numTotalHours !== expectedTotalHours) {
      throw new Error(
        `Total duration hours is inconsistent. Expected ${expectedTotalHours} hours (${numDays} days × ${expectedDailyHours} hrs/day), received ${numTotalHours}.`
      );
    }
  }

  // 4. Find matching authoritative pricing tier from PostgreSQL
  const pricingTiers = Array.isArray(service.pricingTiers) ? service.pricingTiers : [];
  const matchedTier = pricingTiers.find((t) => Number(t.days) === numDays);

  if (!matchedTier) {
    throw new Error(
      `No authoritative pricing tier found for ${numDays} days duration for this Yagya.`
    );
  }

  const basePrice = Number(matchedTier.price);
  if (isNaN(basePrice) || basePrice < 0) {
    throw new Error(`Invalid pricing tier configuration for ${numDays} days.`);
  }

  // 5. Validate Pandit Count against service requirement and tier definition
  const minPandits =
    Number(service.panditRequirement?.minimumPandits) ||
    Number(service.panditRequirement?.minPandits) ||
    1;
  const maxPandits =
    Number(service.panditRequirement?.maximumPandits) ||
    Number(service.panditRequirement?.maxPandits) ||
    25;
  const tierPanditCount = Number(matchedTier.panditCount) || minPandits;

  const requestedPandits =
    panditCount != null && !isNaN(parseInt(panditCount, 10))
      ? parseInt(panditCount, 10)
      : tierPanditCount;

  if (requestedPandits < minPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) is below the required minimum of ${minPandits} Vedic scholars for this Yagya.`
    );
  }

  if (requestedPandits > maxPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) exceeds the maximum allowed limit of ${maxPandits} for this Yagya.`
    );
  }

  // Rule: Do NOT invent a ₹500 or any custom surcharge for Yagya unless an authoritative rate exists.
  // If requested exceeds the tier's included pandit count, reject unsupported configuration per Section 4 & 11.
  if (requestedPandits > tierPanditCount) {
    throw new Error(
      `Additional pandits beyond the included tier package of ${tierPanditCount} scholars are currently not supported for this package. Please select ${tierPanditCount} officiating scholars.`
    );
  }

  const panditAddonPrice = 0.00;

  // 6. Add-ons pricing: In Yagya catalogue, no dynamic addon catalog exists; addonsTotal = 0.00
  const addonsTotal = 0.00;
  const breakdown = [];

  // 7. Authoritative Total Amount
  const totalAmount = Number((basePrice + panditAddonPrice + addonsTotal).toFixed(2));
  const formattedTotal = formatIndianCurrency(totalAmount);

  return {
    serviceType: "YAGYA",
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    durationSelected: `${numDays} Days`,
    days: numDays,
    dailyHours: expectedDailyHours,
    durationHours: expectedTotalHours,
    panditCount: requestedPandits,
    basePrice: Number(basePrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    currency: "INR",
    pricingSource: "YAGYA_PRICING_TIER",
    pricingTier: {
      days: Number(matchedTier.days),
      price: Number(matchedTier.price),
      panditCount: Number(matchedTier.panditCount),
      label: matchedTier.label || `${numDays}-Day Sacred Cycle`,
    },
    breakdown,
  };
};

/**
 * Calculates authoritative pricing for a structured Mantra Japa service.
 * Follows Phase J2 authoritative pricing rules:
 * - Selected Japa count resolves the authoritative variant and starting price
 * - Total daily capacity = panditCount * dailyCapacityPerPandit
 * - Required days = CEILING(japaCount / totalDailyCapacity)
 * - Completion date = commencementDate + (requiredDays - 1)
 * - Pandit count validated against service min/max boundaries
 * - Rejects unsupported counts or invalid pandit numbers
 *
 * @param {Object} params
 * @param {Object} params.service - Sequelize JapaService instance
 * @param {number|string} params.japaCount - Selected Japa recitation count
 * @param {number|string} [params.panditCount] - Selected pandit count
 * @param {string} [params.commencementDate] - Commencement date YYYY-MM-DD
 * @param {number|string} [params.dailyHours] - Daily hours
 * @param {string} [params.arrangementMode] - kashi | remote
 * @param {string} [params.locationType] - location type
 * @param {Array} [params.addons] - Untrusted client addons
 * @returns {Object} authoritative Japa pricing details
 */
export const calculateJapaPriceInternal = ({
  service,
  japaCount,
  panditCount,
  commencementDate,
  dailyHours,
  arrangementMode,
  locationType,
  addons = [],
}) => {
  if (!service) {
    throw new Error("Japa service is required for price calculation");
  }

  if (service.isActive === false) {
    throw new Error("Japa service is currently inactive");
  }

  // 1. Validate and resolve selected Japa count
  const numCount = parseInt(japaCount, 10);
  if (isNaN(numCount) || numCount <= 0) {
    throw new Error("Invalid japaCount parameter. Must be a positive integer.");
  }

  const availableCounts = Array.isArray(service.availableCounts)
    ? service.availableCounts.map(Number)
    : [];

  const variants = Array.isArray(service.variants) ? service.variants : [];

  const matchedVariant = variants.find((v) => Number(v.count) === numCount);

  // If count is not in availableCounts and no matched variant, reject with 400
  const isSupportedCount =
    (availableCounts.length > 0 && availableCounts.includes(numCount)) ||
    Boolean(matchedVariant);

  if (!isSupportedCount) {
    throw new Error(
      `Unsupported Japa count: ${numCount}. Supported counts for this service: ${availableCounts.join(", ")}`
    );
  }

  // 2. Authoritative Base Price from matched variant or service starting price
  let basePrice = matchedVariant ? Number(matchedVariant.startingPrice) : Number(service.startingPrice);
  if (isNaN(basePrice) || basePrice < 0) {
    throw new Error(`Invalid pricing configuration for ${numCount} Japa.`);
  }

  // 3. Validate Pandit Count against service requirement and variant definition
  const minPandits =
    Number(matchedVariant?.minimumPandits) ||
    Number(service.minimumPandits) ||
    1;
  const maxPandits =
    Number(service.maximumPandits) ||
    25;
  const recPandits =
    Number(matchedVariant?.recommendedPandits) ||
    Number(service.recommendedPandits) ||
    minPandits;

  let requestedPandits = recPandits;
  if (panditCount != null && !isNaN(parseInt(panditCount, 10))) {
    requestedPandits = parseInt(panditCount, 10);
  }

  if (requestedPandits < minPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) is below the required minimum of ${minPandits} Vedic scholars for this Japa.`
    );
  }

  if (requestedPandits > maxPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) exceeds the maximum allowed limit of ${maxPandits} for this Japa.`
    );
  }

  // 4. Capacity and Required Days Calculation
  const dailyCapacityPerPandit =
    Number(matchedVariant?.dailyCapacity) ||
    Number(service.dailyCapacityPerPandit) ||
    2000;

  const totalDailyCapacity = requestedPandits * dailyCapacityPerPandit;
  if (totalDailyCapacity <= 0) {
    throw new Error("Invalid daily chanting capacity configuration.");
  }

  const requiredDays = Math.ceil(numCount / totalDailyCapacity);

  // 5. Completion Date Calculation
  let completionDate = null;
  if (commencementDate && String(commencementDate).trim()) {
    completionDate = deriveCompletionDate(String(commencementDate).trim(), requiredDays);
  }

  // 6. Daily Hours
  const expectedDailyHours = service.dailyHours || "4 Hours Daily";

  // 7. Authoritative Total Amount
  const panditAddonPrice = 0.00;
  const addonsTotal = 0.00;
  const totalAmount = Number((basePrice + panditAddonPrice + addonsTotal).toFixed(2));
  const formattedTotal = formatIndianCurrency(totalAmount);

  return {
    serviceType: "JAPA",
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.name,
    japaCount: numCount,
    panditCount: requestedPandits,
    dailyCapacityPerPandit,
    totalDailyCapacity,
    requiredDays,
    durationSelected: `${requiredDays} Days (${numCount.toLocaleString("en-IN")} Japa)`,
    days: requiredDays,
    dailyHours: expectedDailyHours,
    durationHours: requiredDays * 4,
    commencementDate: commencementDate ? String(commencementDate).trim() : null,
    completionDate,
    basePrice: Number(basePrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    currency: "INR",
    pricingSource: "JAPA_VARIANT_PRICING",
    variant: matchedVariant
      ? {
          count: Number(matchedVariant.count),
          label: matchedVariant.label || `${numCount.toLocaleString("en-IN")} Japa`,
          startingPrice: Number(matchedVariant.startingPrice),
          estimatedDuration: matchedVariant.estimatedDuration,
          minimumPandits: Number(matchedVariant.minimumPandits),
          recommendedPandits: Number(matchedVariant.recommendedPandits),
          dailyCapacity: Number(matchedVariant.dailyCapacity),
        }
      : null,
    breakdown: [],
  };
};

/**
 * Calculates authoritative pricing for a sacred Homa / Havan service.
 * Follows Phase H3 authoritative pricing rules:
 * - Total Amount = basePrice + (havanCount - 1) * perHavanPrice + (days - 1) * perDayPrice
 * - Pandit count has NO surcharge; must be between minimumPandits and maximumPandits
 * - Default pandit count = recommendedPandits
 * - havanCount must be in service.availableHavanCounts
 * - days must be in service.availableDays
 * - Coupling: havanCount === 1 && days > 1 is rejected (HTTP 400)
 * - Server derived completionDate = deriveCompletionDate(commencementDate, days)
 * - addonsTotal = 0.00
 * - pricingSource = "HOMA_CONFIGURED_PRICING"
 *
 * @param {Object} params
 * @param {Object} [params.service] - Sequelize HomaService instance
 * @param {string} [params.serviceSlug] - Slug to resolve if service not passed
 * @param {number|string} params.havanCount - Selected Havan ceremony count
 * @param {number|string} [params.days] - Selected ceremony days
 * @param {number|string} [params.durationDays] - Alternate key for days
 * @param {number|string} [params.panditCount] - Selected pandit count
 * @param {string} [params.commencementDate] - Commencement date YYYY-MM-DD
 * @param {string} [params.dailyHours] - Daily hours
 * @param {string} [params.arrangementMode] - kashi | remote
 * @param {string} [params.locationType] - location type
 * @param {Array} [params.addons] - Untrusted client addons
 * @returns {Promise<Object>} authoritative Homa pricing details
 */
export const calculateHomaPriceInternal = async ({
  service,
  serviceSlug,
  havanCount,
  days,
  durationDays,
  panditCount,
  commencementDate,
  dailyHours,
  arrangementMode,
  locationType,
  addons = [],
}) => {
  let activeService = service;
  if (!activeService && serviceSlug) {
    const { HomaService } = await import("../models/index.js");
    activeService = await HomaService.findOne({
      where: { slug: String(serviceSlug).trim().toLowerCase() },
    });
  }

  if (!activeService) {
    throw new Error("Homa service is required for price calculation");
  }

  if (activeService.isActive === false) {
    throw new Error("Homa service is currently inactive");
  }

  // 1. Validate havanCount
  const numHavans = parseInt(havanCount, 10);
  if (isNaN(numHavans) || numHavans <= 0) {
    throw new Error("Invalid havanCount parameter. Must be a positive integer.");
  }

  const availableHavanCounts = Array.isArray(activeService.availableHavanCounts)
    ? activeService.availableHavanCounts.map(Number)
    : [];

  if (availableHavanCounts.length > 0 && !availableHavanCounts.includes(numHavans)) {
    throw new Error(
      `Selected Havan count of ${numHavans} is not available for this Homa. Available options: ${availableHavanCounts.join(", ")}`
    );
  }

  // 2. Validate days
  const rawDays = days != null ? days : durationDays;
  const numDays = parseInt(rawDays, 10);
  if (isNaN(numDays) || numDays <= 0) {
    throw new Error("Invalid days parameter. Must be a positive integer.");
  }

  const availableDays = Array.isArray(activeService.availableDays)
    ? activeService.availableDays.map(Number)
    : [];

  if (availableDays.length > 0 && !availableDays.includes(numDays)) {
    throw new Error(
      `Selected duration of ${numDays} days is not available for this Homa. Available options: ${availableDays.join(", ")} days.`
    );
  }

  // 3. Coupling Rule: 1 Havan cannot span multiple days
  if (numHavans === 1 && numDays > 1) {
    const err = new Error(
      "A single Havan (1 Havan) must be completed in 1 day. Multi-day duration is only valid for multi-Havan ceremonies."
    );
    err.statusCode = 400;
    throw err;
  }

  // 4. Pandit Count Validation
  const minPandits = Number(activeService.minimumPandits) || 1;
  const maxPandits = Number(activeService.maximumPandits) || 25;
  const recPandits = Number(activeService.recommendedPandits) || minPandits;

  let requestedPandits = recPandits;
  if (panditCount != null && String(panditCount).trim() !== "") {
    const parsedPandits = parseInt(panditCount, 10);
    if (isNaN(parsedPandits)) {
      throw new Error("Invalid panditCount parameter. Must be an integer.");
    }
    requestedPandits = parsedPandits;
  }

  if (requestedPandits < minPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) is below the required minimum of ${minPandits} Vedic scholars for this Homa.`
    );
  }

  if (requestedPandits > maxPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) exceeds the maximum allowed limit of ${maxPandits} for this Homa.`
    );
  }

  // 5. Commencement & Completion Date Calculation
  let completionDate = null;
  if (commencementDate != null && String(commencementDate).trim() !== "") {
    const cleanDate = String(commencementDate).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      throw new Error("Invalid commencement date. Expected YYYY-MM-DD.");
    }
    completionDate = deriveCompletionDate(cleanDate, numDays);
  }

  // 6. Authoritative Pricing Formula
  const basePrice = Number(activeService.basePrice);
  if (isNaN(basePrice) || basePrice < 0) {
    throw new Error("Invalid base price configuration for this Homa service.");
  }

  const perHavanPrice = Number(activeService.perHavanPrice) || 0;
  const perDayPrice = Number(activeService.perDayPrice) || 0;

  const havanAddonPrice = (numHavans - 1) * perHavanPrice;
  const dayAddonPrice = (numDays - 1) * perDayPrice;
  const panditAddonPrice = 0.00;
  const addonsTotal = 0.00;

  const totalAmount = Number((basePrice + havanAddonPrice + dayAddonPrice + addonsTotal).toFixed(2));
  const formattedTotal = formatIndianCurrency(totalAmount);

  const durationSelected = `${numHavans} Havan${numHavans > 1 ? "s" : ""} (${numDays} Day${numDays > 1 ? "s" : ""})`;
  const parsedDailyHours = parseInt(activeService.dailyHours, 10) || 4;
  const totalDurationHours = numDays * parsedDailyHours;

  return {
    serviceType: "HOMA",
    serviceId: activeService.id,
    serviceSlug: activeService.slug,
    serviceName: activeService.name,
    havanCount: numHavans,
    days: numDays,
    durationDays: numDays,
    durationSelected,
    durationHours: totalDurationHours,
    dailyHours: activeService.dailyHours,
    havanCapacityPerPandit: activeService.havanCapacityPerPandit,
    panditCount: requestedPandits,
    commencementDate: commencementDate ? String(commencementDate).trim() : null,
    completionDate,
    basePrice: Number(basePrice.toFixed(2)),
    havanAddonPrice: Number(havanAddonPrice.toFixed(2)),
    dayAddonPrice: Number(dayAddonPrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    currency: "INR",
    pricingSource: "HOMA_CONFIGURED_PRICING",
    service: {
      id: activeService.id,
      slug: activeService.slug,
      name: activeService.name,
    },
    breakdown: [],
  };
};

/**
 * Calculates authoritative pricing for a sacred Path / Recitation service.
 * Follows Phase P3 authoritative pricing rules:
 * - Base price is derived authoritatively from activeService.startingPrice
 * - Validates format against service.availableFormats
 * - Validates duration against service.availableDurations
 * - Validates days against service.minimumDays and service.maximumDays
 * - Coupling rule: single_session and same_day formats cannot span multiple days
 * - Validates pandit count against service.minimumPandits and service.maximumPandits
 * - Server derived completionDate = deriveCompletionDate(commencementDate, days)
 * - addonsTotal = 0.00
 * - pricingSource = "PATH_CANONICAL_PRICING"
 *
 * @param {Object} params
 * @param {Object} [params.service] - Sequelize PathService instance
 * @param {string} [params.serviceSlug] - Slug to resolve if service not passed
 * @param {string} [params.format] - Selected recitation format
 * @param {string} [params.selectedFormat] - Alternate key for format
 * @param {string} [params.duration] - Selected duration string
 * @param {string} [params.selectedDuration] - Alternate key for duration string
 * @param {string} [params.durationSelected] - Alternate key for duration string
 * @param {number|string} [params.days] - Selected days
 * @param {number|string} [params.durationDays] - Alternate key for days
 * @param {number|string} [params.panditCount] - Selected pandit count
 * @param {string} [params.commencementDate] - Commencement date YYYY-MM-DD
 * @param {string} [params.dailyHours] - Daily hours
 * @param {string} [params.arrangementMode] - kashi | remote
 * @param {string} [params.locationType] - location type
 * @param {Array} [params.addons] - Untrusted client addons
 * @returns {Promise<Object>} authoritative Path pricing details
 */
export const calculatePathPriceInternal = async ({
  service,
  serviceSlug,
  format,
  selectedFormat,
  duration,
  selectedDuration,
  durationSelected,
  days,
  durationDays,
  panditCount,
  commencementDate,
  dailyHours,
  arrangementMode,
  locationType,
  addons = [],
}) => {
  let activeService = service;
  if (!activeService && serviceSlug) {
    const { PathService } = await import("../models/index.js");
    activeService = await PathService.findOne({
      where: { slug: String(serviceSlug).trim().toLowerCase() },
    });
  }

  if (!activeService) {
    throw new Error("Path service is required for price calculation");
  }

  if (activeService.isActive === false) {
    throw new Error("Path service is currently inactive");
  }

  // 1. Days Validation
  const rawDays = days != null ? days : durationDays;
  let numDays;

  if (rawDays != null && String(rawDays).trim() !== "") {
    numDays = parseInt(rawDays, 10);
    if (isNaN(numDays) || numDays <= 0) {
      throw new Error("Invalid days parameter. Must be a positive integer.");
    }
  } else {
    numDays = Number(activeService.recommendedDays) || Number(activeService.minimumDays) || 1;
  }

  const minDays = Number(activeService.minimumDays) || 1;
  const maxDays = Number(activeService.maximumDays) || 1;

  if (numDays < minDays) {
    throw new Error(
      `Selected duration of ${numDays} day(s) is below the minimum required ${minDays} day(s) for this Path.`
    );
  }

  if (numDays > maxDays) {
    throw new Error(
      `Selected duration of ${numDays} day(s) exceeds the maximum allowed ${maxDays} day(s) for this Path.`
    );
  }

  // 2. Format Validation
  const chosenFormat = format || selectedFormat;
  const availableFormats = Array.isArray(activeService.availableFormats)
    ? activeService.availableFormats
    : [];

  if (chosenFormat) {
    const cleanFormat = String(chosenFormat).trim();
    if (availableFormats.length > 0 && !availableFormats.includes(cleanFormat)) {
      throw new Error(
        `Selected recitation format '${cleanFormat}' is not available for this Path. Available options: ${availableFormats.join(", ")}`
      );
    }
  }

  let effectiveFormat;
  if (chosenFormat) {
    effectiveFormat = String(chosenFormat).trim();
  } else if (numDays > 1 && availableFormats.includes("multi_day")) {
    effectiveFormat = "multi_day";
  } else {
    effectiveFormat = availableFormats.length > 0 ? availableFormats[0] : "single_session";
  }

  // Coupling Rule: Single session and same-day recitations must be completed in 1 day
  if ((effectiveFormat === "single_session" || effectiveFormat === "same_day") && numDays > 1) {
    const err = new Error(
      `A ${effectiveFormat === "single_session" ? "single-session" : "same-day"} Path recitation must be completed in 1 day.`
    );
    err.statusCode = 400;
    throw err;
  }

  // 3. Duration String Validation
  const rawDurationStr = duration || selectedDuration || durationSelected;
  const availableDurations = Array.isArray(activeService.availableDurations)
    ? activeService.availableDurations
    : [];

  if (rawDurationStr && String(rawDurationStr).trim() !== "") {
    const cleanDurationStr = String(rawDurationStr).trim();
    const isDurationMatched =
      availableDurations.length === 0 ||
      availableDurations.includes(cleanDurationStr) ||
      availableDurations.some(
        (d) => d.toLowerCase() === cleanDurationStr.toLowerCase()
      );

    if (!isDurationMatched) {
      throw new Error(
        `Selected duration '${cleanDurationStr}' is not available for this Path. Available options: ${availableDurations.join(", ")}`
      );
    }
  }

  // 4. Pandit Count Validation
  const minPandits = Number(activeService.minimumPandits) || 1;
  const maxPandits = Number(activeService.maximumPandits) || 25;
  const recPandits = Number(activeService.recommendedPandits) || minPandits;

  let requestedPandits = recPandits;
  if (panditCount != null && String(panditCount).trim() !== "") {
    const parsedPandits = parseInt(panditCount, 10);
    if (isNaN(parsedPandits)) {
      throw new Error("Invalid panditCount parameter. Must be an integer.");
    }
    requestedPandits = parsedPandits;
  }

  if (requestedPandits < minPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) is below the required minimum of ${minPandits} Vedic scholars for this Path.`
    );
  }

  if (requestedPandits > maxPandits) {
    throw new Error(
      `Selected pandit count (${requestedPandits}) exceeds the maximum allowed limit of ${maxPandits} for this Path.`
    );
  }

  // 5. Commencement & Completion Date Calculation
  let completionDate = null;
  if (commencementDate != null && String(commencementDate).trim() !== "") {
    const cleanDate = String(commencementDate).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      throw new Error("Invalid commencement date. Expected YYYY-MM-DD.");
    }
    completionDate = deriveCompletionDate(cleanDate, numDays);
  }

  // 6. Authoritative Pricing
  const basePrice = Number(activeService.startingPrice);
  if (isNaN(basePrice) || basePrice < 0) {
    throw new Error("Invalid base price configuration for this Path service.");
  }

  const panditAddonPrice = 0.00;
  const addonsTotal = 0.00;
  const totalAmount = Number((basePrice + panditAddonPrice + addonsTotal).toFixed(2));
  const formattedTotal = formatIndianCurrency(totalAmount);

  const resolvedDuration = rawDurationStr
    ? String(rawDurationStr).trim()
    : `${numDays} Day${numDays > 1 ? "s" : ""}`;

  const parsedDailyHours = parseInt(activeService.dailyHours, 10) || 4;
  const totalDurationHours = numDays * parsedDailyHours;

  return {
    serviceType: "PATH",
    serviceId: activeService.id,
    serviceSlug: activeService.slug,
    serviceName: activeService.name,
    pathType: activeService.pathType,
    scripture: activeService.scripture,
    format: effectiveFormat,
    selectedFormat: effectiveFormat,
    duration: resolvedDuration,
    selectedDuration: resolvedDuration,
    durationSelected: resolvedDuration,
    days: numDays,
    durationDays: numDays,
    durationHours: totalDurationHours,
    dailyHours: activeService.dailyHours,
    panditCount: requestedPandits,
    commencementDate: commencementDate ? String(commencementDate).trim() : null,
    completionDate,
    basePrice: Number(basePrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    currency: "INR",
    pricingSource: "PATH_CANONICAL_PRICING",
    service: {
      id: activeService.id,
      slug: activeService.slug,
      name: activeService.name,
    },
    breakdown: [],
  };
};
