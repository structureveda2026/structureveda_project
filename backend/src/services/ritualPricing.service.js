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
