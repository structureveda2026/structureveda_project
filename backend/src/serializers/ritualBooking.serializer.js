/**
 * Serializers for Ritual Booking Engine
 */

export const serializeRitualPriceCalculation = (priceData) => {
  return {
    basePrice: Number(priceData.basePrice),
    panditAddonPrice: Number(priceData.panditAddonPrice),
    addonsTotal: Number(priceData.addonsTotal),
    totalAmount: Number(priceData.totalAmount),
    formattedTotal: priceData.formattedTotal,
    breakdown: Array.isArray(priceData.breakdown) ? priceData.breakdown : [],
  };
};

export const serializeRitualBookingCreation = (booking, formattedTotal) => {
  return {
    id: booking.id,
    bookingReference: booking.bookingReference,
    serviceType: booking.serviceType,
    serviceId: booking.serviceId,
    serviceSlug: booking.serviceSlug,
    serviceName: booking.serviceName,
    userId: booking.userId,
    configuration: {
      date: booking.bookingDate,
      timeSlot: booking.bookingTime,
      durationSelected: booking.durationSelected,
      durationHours: booking.durationHours,
      panditCount: booking.panditCount,
      arrangementMode: booking.arrangementMode,
    },
    location: {
      locationType: booking.locationType,
      venueDetails: booking.venueDetails || {},
    },
    yajman: booking.yajmanDetails,
    sankalp: booking.sankalpDetails,
    familyMembers: booking.familyMembers || [],
    addons: booking.addons || [],
    pricing: {
      basePrice: Number(booking.basePrice),
      panditAddonPrice: Number(booking.panditAddonPrice),
      addonsTotal: Number(booking.addonsTotal),
      totalAmount: Number(booking.totalAmount),
      currency: booking.currency,
      formattedTotal: formattedTotal || `₹${Number(booking.totalAmount).toLocaleString("en-IN")}`,
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt || booking.created_at,
    updatedAt: booking.updatedAt || booking.updated_at,
  };
};

export const serializeRitualBookingDetail = (booking) => {
  return {
    bookingReference: booking.bookingReference,
    service: {
      type: booking.serviceType,
      id: booking.serviceId,
      slug: booking.serviceSlug,
      name: booking.serviceName,
    },
    configuration: {
      date: booking.bookingDate,
      timeSlot: booking.bookingTime,
      durationSelected: booking.durationSelected,
      durationHours: booking.durationHours,
      panditCount: booking.panditCount,
      arrangementMode: booking.arrangementMode,
    },
    location: {
      locationType: booking.locationType,
      venueDetails: booking.venueDetails || {},
    },
    yajman: booking.yajmanDetails,
    sankalp: booking.sankalpDetails,
    familyMembers: booking.familyMembers || [],
    addons: booking.addons || [],
    pricing: {
      basePrice: Number(booking.basePrice),
      panditAddonPrice: Number(booking.panditAddonPrice),
      addonsTotal: Number(booking.addonsTotal),
      totalAmount: Number(booking.totalAmount),
      currency: booking.currency,
      formattedTotal: `₹${Number(booking.totalAmount).toLocaleString("en-IN")}`,
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    prasadStatus: booking.prasadStatus,
    createdAt: booking.createdAt || booking.created_at,
    updatedAt: booking.updatedAt || booking.updated_at,
  };
};
