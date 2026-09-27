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
 * Calculates authoritative pricing for a ritual service.
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
    basePrice: Number(basePrice.toFixed(2)),
    panditAddonPrice,
    addonsTotal,
    totalAmount,
    formattedTotal,
    breakdown,
  };
};
