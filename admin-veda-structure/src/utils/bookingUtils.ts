export const formatCurrency = (amount: number | string | undefined | null, currency = "INR") => {
  const num = typeof amount === "number" ? amount : Number(amount || 0);
  if (isNaN(num)) return `₹0`;
  return `${currency === "INR" ? "₹" : currency + " "}${num.toLocaleString("en-IN")}`;
};

export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

export const getSourceTypeConfig = (sourceType?: string) => {
  switch (sourceType?.toUpperCase()) {
    case "RITUAL":
      return {
        label: "Ritual Booking",
        shortLabel: "Ritual",
        bg: "bg-saffron-50 text-saffron-700 border-saffron-200",
        badge: "bg-saffron-100 text-saffron-800",
      };
    case "COMMUNITY_PUJA":
      return {
        label: "Community Puja",
        shortLabel: "Community Puja",
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        badge: "bg-purple-100 text-purple-800",
      };
    case "CONSULTATION":
      return {
        label: "Astrologer Consultation",
        shortLabel: "Consultation",
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        badge: "bg-blue-100 text-blue-800",
      };
    default:
      return {
        label: sourceType || "Booking",
        shortLabel: sourceType || "Booking",
        bg: "bg-cream-100 text-charcoal-700 border-cream-200",
        badge: "bg-cream-200 text-charcoal-800",
      };
  }
};

export const getBookingDetailRoute = (sourceType: string, recordId: string) => {
  const cleanSource = sourceType?.toUpperCase();
  if (cleanSource === "RITUAL") {
    return `/admin/bookings/rituals/${recordId}`;
  }
  if (cleanSource === "COMMUNITY_PUJA") {
    return `/admin/bookings/community-puja/${recordId}`;
  }
  if (cleanSource === "CONSULTATION") {
    return `/admin/bookings/consultations/${recordId}`;
  }
  return `/admin/bookings/${recordId}`;
};

