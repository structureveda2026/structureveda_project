import api from "@/services/api";

// --- Shared Types ---

export type YagyaAvailableMode = "in_person" | "remote" | "hybrid";

export interface YagyaPurpose {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface YagyaPanditRequirement {
  minimumPandits?: number;
  recommendedPandits?: number;
  maximumPandits?: number;
  skillRequirements?: string;
  dailyHours?: number;
}

export interface YagyaPricingTier {
  label: string;
  days: number;
  price: number;
  panditCount?: number;
}

export interface YagyaDailyScheduleItem {
  day: number | string;
  title: string;
  details: string;
}

export interface YagyaSamagriItem {
  name: string;
  status: "included" | "optional" | "additional";
}

export interface YagyaWhyPerformItem {
  title: string;
  description: string;
}

export interface YagyaProcedureStep {
  step: string;
  title: string;
  description: string;
}

export interface YagyaFaqItem {
  question: string;
  answer: string;
}

// --- Listing Item ---

export interface AdminYagyaServiceListingItem {
  id: string;
  slug: string;
  name: string;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  deity: string;
  startingPrice: number;
  formattedPrice: string;
  availableDurations: number[];
  dailyRitualHours: number;
  availableMode: YagyaAvailableMode;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminYagyaServiceListingResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: AdminYagyaServiceListingItem[];
}

// --- Detail Record ---

export interface AdminYagyaServiceDetail {
  id: string;
  slug: string;
  name: string;
  eyebrow: string | null;
  tagline: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  deity: string;
  purposeId: string | null;
  purpose: string | null;
  purposeSummary: string | null;
  purposeDetails: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconName: string;
    displayOrder: number;
    isActive: boolean;
  } | null;
  availableDurations: number[];
  durationDisplay: string | null;
  dailyRitualHours: number;
  dailyHoursDisplay: string | null;
  panditRequirement: YagyaPanditRequirement;
  locationType: string | null;
  location: string | null;
  availableMode: YagyaAvailableMode;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  startingPrice: number;
  formattedPrice: string;
  pricingTiers: YagyaPricingTier[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string | null;
  galleryImages: string[];
  samagri: YagyaSamagriItem[];
  prasad: string | null;
  dailySchedule: YagyaDailyScheduleItem[];
  whatsIncluded: string[];
  whyPerform: YagyaWhyPerformItem[];
  significance: string[];
  procedureSteps: YagyaProcedureStep[];
  faqs: YagyaFaqItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Filters ---

export interface YagyaServiceFilters {
  search?: string;
  purpose?: string;
  duration?: string;
  isActive?: string | boolean;
  isFeatured?: string | boolean;
  mode?: YagyaAvailableMode | "";
  sortBy?:
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "created-newest"
    | "created-oldest"
    | "";
  page?: number;
  limit?: number;
}

// --- Payload ---

export interface YagyaServicePayload {
  name: string;
  slug: string;
  deity: string;
  startingPrice: number;
  availableMode: YagyaAvailableMode;
  eyebrow?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  purposeId?: string | null;
  purposeSummary?: string | null;
  availableDurations?: number[];
  durationDisplay?: string | null;
  dailyRitualHours?: number;
  dailyHoursDisplay?: string | null;
  panditRequirement?: YagyaPanditRequirement;
  locationType?: string | null;
  location?: string | null;
  isKashiAvailable?: boolean;
  isRemoteAvailable?: boolean;
  pricingTiers?: YagyaPricingTier[];
  isFeatured?: boolean;
  isActive?: boolean;
  bannerImage?: string | null;
  galleryImages?: string[];
  samagri?: YagyaSamagriItem[];
  prasad?: string | null;
  dailySchedule?: YagyaDailyScheduleItem[];
  whatsIncluded?: string[];
  whyPerform?: YagyaWhyPerformItem[];
  significance?: string[];
  procedureSteps?: YagyaProcedureStep[];
  faqs?: YagyaFaqItem[];
}

// --- Service Functions ---

const getYagyaServices = async (
  filters: YagyaServiceFilters = {},
): Promise<AdminYagyaServiceListingResponse> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) query.append("search", filters.search.trim());
  if (filters.purpose && filters.purpose.trim()) query.append("purpose", filters.purpose.trim());
  if (filters.duration && filters.duration.trim()) query.append("duration", filters.duration.trim());
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "")
    query.append("isActive", String(filters.isActive));
  if (typeof filters.isFeatured !== "undefined" && filters.isFeatured !== "")
    query.append("isFeatured", String(filters.isFeatured));
  if (filters.mode && filters.mode.trim()) query.append("mode", filters.mode.trim());
  if (filters.sortBy && filters.sortBy.trim()) query.append("sortBy", filters.sortBy.trim());
  if (filters.page) query.append("page", String(filters.page));
  if (filters.limit) query.append("limit", String(filters.limit));
  const qs = query.toString() ? `?${query.toString()}` : "";
  const response = await api.get(`/admin/yagya-services${qs}`);
  return response as AdminYagyaServiceListingResponse;
};

const getYagyaService = async (id: string): Promise<AdminYagyaServiceDetail> => {
  const response = await api.get(`/admin/yagya-services/${id}`);
  return response.data as AdminYagyaServiceDetail;
};

const createYagyaService = async (
  payload: YagyaServicePayload,
): Promise<AdminYagyaServiceDetail> => {
  const response = await api.post("/admin/yagya-services", payload);
  return response.data as AdminYagyaServiceDetail;
};

const updateYagyaService = async (
  id: string,
  payload: Partial<YagyaServicePayload>,
): Promise<AdminYagyaServiceDetail> => {
  const response = await api.put(`/admin/yagya-services/${id}`, payload);
  return response.data as AdminYagyaServiceDetail;
};

const deleteYagyaService = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/admin/yagya-services/${id}`);
  return response as { success: boolean; message: string };
};

const getYagyaPurposes = async (): Promise<YagyaPurpose[]> => {
  const response = await api.get("/yagya-services/purposes");
  return (response.data || []) as YagyaPurpose[];
};

export default {
  getYagyaServices,
  getYagyaService,
  createYagyaService,
  updateYagyaService,
  deleteYagyaService,
  getYagyaPurposes,
};
