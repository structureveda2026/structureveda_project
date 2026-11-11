import api from "./api";

// -------------------------------------------------------------
// Unified Cross-Model Bookings Interfaces & Types
// -------------------------------------------------------------

export type BookingSourceType = "RITUAL" | "COMMUNITY_PUJA" | "CONSULTATION";

export interface UnifiedBooking {
  sourceType: BookingSourceType;
  recordId: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  serviceName: string;
  serviceCategory: string; // 'PUJA' | 'YAGYA' | 'HOMA' | 'JAPA' | 'PATH' | 'COMMUNITY_PUJA' | 'CONSULTATION'
  bookingDate: string;
  bookingTime?: string | null;
  amount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentGateway: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedBookingFilters {
  sourceType?: string; // 'ALL' | 'RITUAL' | 'COMMUNITY_PUJA' | 'CONSULTATION'
  serviceCategory?: string; // 'PUJA' | 'YAGYA' | 'HOMA' | 'JAPA' | 'PATH' | 'COMMUNITY_PUJA' | 'CONSULTATION'
  bookingStatus?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface UnifiedBookingListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  page: number;
  data: UnifiedBooking[];
}

// -------------------------------------------------------------
// Ritual Bookings Interfaces & Types (Puja, Yagya, Homa, Japa, Path)
// -------------------------------------------------------------

export interface AdminRitualBooking {
  id: string;
  bookingReference: string;
  serviceType: "PUJA" | "YAGYA" | "HOMA" | "JAPA" | "PATH";
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  userId?: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
    gotra?: string | null;
    rashi?: string | null;
    nakshatra?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  };
  bookingDate: string;
  bookingTime: string;
  durationSelected?: string;
  durationHours?: number;
  panditCount?: number;
  arrangementMode?: string;
  locationType?: string;
  venueDetails?: Record<string, any>;
  sankalpDetails?: {
    purpose?: string;
    description?: string;
    gotra?: string;
    nakshatra?: string;
    rashi?: string;
    [key: string]: any;
  };
  familyMembers?: Array<{
    name?: string;
    relation?: string;
    rashi?: string;
    nakshatra?: string;
    gotra?: string;
    [key: string]: any;
  }>;
  addons?: Array<{
    id?: string;
    name?: string;
    price?: number;
    [key: string]: any;
  }>;
  pricing: {
    basePrice: number;
    panditAddonPrice: number;
    addonsTotal: number;
    totalAmount: number;
    currency: string;
  };
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: string;
  paymentGateway: string;
  transactionId?: string | null;
  paymentSessionId?: string | null;
  prasadStatus?: string;
  prasadTrackingNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RitualBookingFilters {
  search?: string;
  serviceType?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface RitualBookingListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  page: number;
  data: AdminRitualBooking[];
}

export interface RitualStatusUpdatePayload {
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
}

// -------------------------------------------------------------
// Community Puja Bookings Interfaces & Types
// -------------------------------------------------------------

export interface AdminCommunityPujaBooking {
  id: string;
  bookingReference: string;
  pujaId: string;
  puja: {
    id: string;
    name: string;
    slug?: string | null;
    ceremonyDate?: string | null;
    startDateTime?: string | null;
    location?: string | null;
    temple?: string | null;
    deity?: string | null;
    bannerImage?: string | null;
  };
  packageId: string;
  package: {
    id: string;
    name: string;
    price: number;
    maxDevotees: number;
    description?: string | null;
    features?: string[];
  };
  userId?: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
  };
  devotees?: Array<{
    name?: string;
    gotra?: string;
    rashi?: string;
    nakshatra?: string;
    relation?: string;
    [key: string]: any;
  }>;
  devoteeCount: number;
  sankalpPurpose?: string | null;
  shippingAddress?: Record<string, any>;
  amount: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  paymentGateway: string;
  prasadStatus: string;
  prasadTrackingNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPujaFilters {
  search?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface CommunityPujaListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  page: number;
  data: AdminCommunityPujaBooking[];
}

// -------------------------------------------------------------
// API Service Methods
// -------------------------------------------------------------

/**
 * Fetch unified list of all bookings across all models.
 * GET /api/admin/bookings/all
 */
export const getUnifiedBookings = async (
  params?: UnifiedBookingFilters
): Promise<UnifiedBookingListResponse> => {
  const query = new URLSearchParams();
  if (params?.sourceType) query.append("sourceType", params.sourceType);
  if (params?.serviceCategory) query.append("serviceCategory", params.serviceCategory);
  if (params?.bookingStatus) query.append("bookingStatus", params.bookingStatus);
  if (params?.paymentStatus) query.append("paymentStatus", params.paymentStatus);
  if (params?.search) query.append("search", params.search);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const qs = query.toString();
  return api.get(qs ? `/api/admin/bookings/all?${qs}` : "/api/admin/bookings/all");
};

/**
 * Fetch list of all ritual bookings (Puja, Yagya, Homa, Japa, Path).
 * GET /api/admin/ritual-bookings
 */
export const getRitualBookings = async (
  params?: RitualBookingFilters
): Promise<RitualBookingListResponse> => {
  const query = new URLSearchParams();
  if (params?.serviceType) query.append("serviceType", params.serviceType);
  if (params?.bookingStatus) query.append("bookingStatus", params.bookingStatus);
  if (params?.paymentStatus) query.append("paymentStatus", params.paymentStatus);
  if (params?.search) query.append("search", params.search);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const qs = query.toString();
  return api.get(qs ? `/api/admin/ritual-bookings?${qs}` : "/api/admin/ritual-bookings");
};

/**
 * Fetch administrative details of a single ritual booking by ID or reference.
 * GET /api/admin/ritual-bookings/:id
 */
export const getRitualBookingById = async (
  id: string
): Promise<{ success: boolean; data: AdminRitualBooking }> => {
  return api.get(`/api/admin/ritual-bookings/${encodeURIComponent(id)}`);
};

/**
 * Update ritual booking status with strict state validation.
 * PATCH /api/admin/ritual-bookings/:id/status
 */
export const updateRitualBookingStatus = async (
  id: string,
  payload: RitualStatusUpdatePayload
): Promise<{ success: boolean; message: string; data: AdminRitualBooking }> => {
  return api.patch(`/api/admin/ritual-bookings/${encodeURIComponent(id)}/status`, payload);
};

/**
 * Fetch list of all community puja bookings.
 * GET /api/admin/community-puja-bookings
 */
export const getCommunityPujaBookings = async (
  params?: CommunityPujaFilters
): Promise<CommunityPujaListResponse> => {
  const query = new URLSearchParams();
  if (params?.bookingStatus) query.append("bookingStatus", params.bookingStatus);
  if (params?.paymentStatus) query.append("paymentStatus", params.paymentStatus);
  if (params?.search) query.append("search", params.search);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const qs = query.toString();
  return api.get(qs ? `/api/admin/community-puja-bookings?${qs}` : "/api/admin/community-puja-bookings");
};

/**
 * Fetch administrative details of a community puja booking by ID or reference.
 * GET /api/admin/community-puja-bookings/:id
 */
export const getCommunityPujaBookingById = async (
  id: string
): Promise<{ success: boolean; data: AdminCommunityPujaBooking }> => {
  return api.get(`/api/admin/community-puja-bookings/${encodeURIComponent(id)}`);
};

const unifiedBookingAdminService = {
  getUnifiedBookings,
  getRitualBookings,
  getRitualBookingById,
  updateRitualBookingStatus,
  getCommunityPujaBookings,
  getCommunityPujaBookingById,
};

export default unifiedBookingAdminService;

