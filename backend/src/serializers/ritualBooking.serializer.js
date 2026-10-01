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
    currency: priceData.currency || "INR",
    breakdown: Array.isArray(priceData.breakdown) ? priceData.breakdown : [],
    ...(priceData.serviceType && { serviceType: priceData.serviceType }),
    ...(priceData.serviceId && { serviceId: priceData.serviceId }),
    ...(priceData.serviceSlug && { serviceSlug: priceData.serviceSlug }),
    ...(priceData.serviceName && { serviceName: priceData.serviceName }),
    ...(priceData.durationSelected && { durationSelected: priceData.durationSelected }),
    ...(priceData.days != null && { days: priceData.days }),
    ...(priceData.dailyHours != null && { dailyHours: priceData.dailyHours }),
    ...(priceData.durationHours != null && { durationHours: priceData.durationHours }),
    ...(priceData.panditCount != null && { panditCount: priceData.panditCount }),
    ...(priceData.pricingSource && { pricingSource: priceData.pricingSource }),
    ...(priceData.pricingTier && { pricingTier: priceData.pricingTier }),
    // Japa specific fields
    ...(priceData.japaCount != null && { japaCount: priceData.japaCount }),
    ...(priceData.dailyCapacityPerPandit != null && { dailyCapacityPerPandit: priceData.dailyCapacityPerPandit }),
    ...(priceData.totalDailyCapacity != null && { totalDailyCapacity: priceData.totalDailyCapacity }),
    ...(priceData.requiredDays != null && { requiredDays: priceData.requiredDays }),
    ...(priceData.commencementDate != null && { commencementDate: priceData.commencementDate }),
    ...(priceData.completionDate != null && { completionDate: priceData.completionDate }),
    ...(priceData.variant && { variant: priceData.variant }),
    // Homa specific fields
    ...(priceData.havanCount != null && { havanCount: priceData.havanCount }),
    ...(priceData.havanAddonPrice != null && { havanAddonPrice: Number(priceData.havanAddonPrice) }),
    ...(priceData.dayAddonPrice != null && { dayAddonPrice: Number(priceData.dayAddonPrice) }),
    ...(priceData.havanCapacityPerPandit != null && { havanCapacityPerPandit: priceData.havanCapacityPerPandit }),
    // Path specific fields
    ...(priceData.format && { format: priceData.format }),
    ...(priceData.selectedFormat && { selectedFormat: priceData.selectedFormat }),
    ...(priceData.duration && { duration: priceData.duration }),
    ...(priceData.selectedDuration && { selectedDuration: priceData.selectedDuration }),
    ...(priceData.scripture && { scripture: priceData.scripture }),
    ...(priceData.pathType && { pathType: priceData.pathType }),
    ...(priceData.service && { service: priceData.service }),
  };
};

export const serializeRitualBookingCreation = (booking, formattedTotal) => {
  const yagyaMeta = booking.sankalpDetails?.yagyaMetadata;
  const japaMeta = booking.sankalpDetails?.japaMetadata;
  const homaMeta = booking.sankalpDetails?.homaMetadata;
  const pathMeta = booking.sankalpDetails?.pathMetadata;

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
      ...(yagyaMeta && {
        days: yagyaMeta.days,
        dailyHours: yagyaMeta.dailyHours,
        completionDate: yagyaMeta.completionDate,
        selectedPricingTier: yagyaMeta.selectedPricingTier,
      }),
      ...(japaMeta && {
        japaCount: japaMeta.japaCount,
        dailyCapacityPerPandit: japaMeta.dailyCapacityPerPandit,
        totalDailyCapacity: japaMeta.totalDailyCapacity,
        requiredDays: japaMeta.requiredDays,
        dailyHours: japaMeta.dailyHours,
        commencementDate: japaMeta.commencementDate,
        completionDate: japaMeta.completionDate,
        pricingSource: japaMeta.pricingSource,
      }),
      ...(homaMeta && {
        havanCount: homaMeta.havanCount,
        durationDays: homaMeta.durationDays,
        dailyHours: homaMeta.dailyHours,
        havanCapacityPerPandit: homaMeta.havanCapacityPerPandit,
        panditCount: homaMeta.panditCount,
        commencementDate: homaMeta.commencementDate,
        completionDate: homaMeta.completionDate,
        pricingSource: homaMeta.pricingSource,
        priceBreakdown: homaMeta.priceBreakdown,
      }),
      ...(pathMeta && {
        format: pathMeta.selectedFormat,
        selectedFormat: pathMeta.selectedFormat,
        selectedDuration: pathMeta.selectedDuration,
        duration: pathMeta.selectedDuration,
        days: pathMeta.selectedDays,
        dailyHours: pathMeta.dailyHours,
        panditCount: pathMeta.panditCount,
        commencementDate: pathMeta.commencementDate,
        completionDate: pathMeta.completionDate,
        pricingSource: pathMeta.pricingSource,
        priceBreakdown: pathMeta.priceBreakdown,
      }),
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
      formattedTotal: formattedTotal || `\u20B9${Number(booking.totalAmount).toLocaleString("en-IN")}`,
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt || booking.created_at,
    updatedAt: booking.updatedAt || booking.updated_at,
  };
};

export const serializeRitualBookingDetail = (booking) => {
  const yagyaMeta = booking.sankalpDetails?.yagyaMetadata;
  const japaMeta = booking.sankalpDetails?.japaMetadata;
  const homaMeta = booking.sankalpDetails?.homaMetadata;
  const pathMeta = booking.sankalpDetails?.pathMetadata;

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
      ...(yagyaMeta && {
        days: yagyaMeta.days,
        dailyHours: yagyaMeta.dailyHours,
        completionDate: yagyaMeta.completionDate,
        selectedPricingTier: yagyaMeta.selectedPricingTier,
      }),
      ...(japaMeta && {
        japaCount: japaMeta.japaCount,
        dailyCapacityPerPandit: japaMeta.dailyCapacityPerPandit,
        totalDailyCapacity: japaMeta.totalDailyCapacity,
        requiredDays: japaMeta.requiredDays,
        dailyHours: japaMeta.dailyHours,
        commencementDate: japaMeta.commencementDate,
        completionDate: japaMeta.completionDate,
        pricingSource: japaMeta.pricingSource,
      }),
      ...(homaMeta && {
        havanCount: homaMeta.havanCount,
        durationDays: homaMeta.durationDays,
        dailyHours: homaMeta.dailyHours,
        havanCapacityPerPandit: homaMeta.havanCapacityPerPandit,
        panditCount: homaMeta.panditCount,
        commencementDate: homaMeta.commencementDate,
        completionDate: homaMeta.completionDate,
        pricingSource: homaMeta.pricingSource,
        priceBreakdown: homaMeta.priceBreakdown,
      }),
      ...(pathMeta && {
        format: pathMeta.selectedFormat,
        selectedFormat: pathMeta.selectedFormat,
        selectedDuration: pathMeta.selectedDuration,
        duration: pathMeta.selectedDuration,
        days: pathMeta.selectedDays,
        dailyHours: pathMeta.dailyHours,
        panditCount: pathMeta.panditCount,
        commencementDate: pathMeta.commencementDate,
        completionDate: pathMeta.completionDate,
        pricingSource: pathMeta.pricingSource,
        priceBreakdown: pathMeta.priceBreakdown,
      }),
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
      formattedTotal: `\u20B9${Number(booking.totalAmount).toLocaleString("en-IN")}`,
    },
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    prasadStatus: booking.prasadStatus,
    createdAt: booking.createdAt || booking.created_at,
    updatedAt: booking.updatedAt || booking.updated_at,
  };
};
