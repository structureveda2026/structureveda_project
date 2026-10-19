import api from "./api";

export interface AstrologerPackage {
  id: string;
  astrologerId?: string;
  packageKey: string;
  title: string;
  subtitle?: string | null;
  duration: string;
  price: number;
  originalPrice?: number | null;
  isPopular?: boolean;
  badge?: string | null;
  knownFor: string[];
  consultationDetails: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackageInput {
  packageKey: string;
  title: string;
  subtitle?: string | null;
  duration: string;
  price: number;
  originalPrice?: number | null;
  isPopular?: boolean;
  badge?: string | null;
  knownFor?: string[];
  consultationDetails?: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdatePackageInput {
  packageKey?: string;
  title?: string;
  subtitle?: string | null;
  duration?: string;
  price?: number;
  originalPrice?: number | null;
  isPopular?: boolean;
  badge?: string | null;
  knownFor?: string[];
  consultationDetails?: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface PackageFilterParams {
  search?: string;
  isActive?: string;
  sortBy?: string;
}

export interface AstrologerPillar {
  title: string;
  desc: string;
}

export interface AstrologerFaq {
  q: string;
  a: string;
}

export interface AdminAstrologer {
  id: string;
  code: string;
  slug: string;
  name: string;
  title: string;
  eyebrow?: string | null;
  quote?: string | null;
  description?: string | null;
  experienceYears: number;
  holySeat: string;
  location: string;
  languages: string[];
  specializations: string[];
  expertise: string[];
  rating: number;
  reviewsCount: string;
  sessionsCount: string;
  profileImage?: string | null;
  portraitImage?: string | null;
  secondaryImage?: string | null;
  bioParagraphs: string[];
  pillars: AstrologerPillar[];
  faqs: AstrologerFaq[];
  availableTimeSlots: string[];
  addOnPricing: Record<string, number>;
  packagesCount?: number;
  packages?: AstrologerPackage[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAstrologerInput {
  name: string;
  title: string;
  code?: string;
  slug?: string;
  eyebrow?: string | null;
  quote?: string | null;
  description?: string | null;
  experienceYears?: number;
  holySeat?: string;
  location?: string;
  languages?: string[];
  specializations?: string[];
  expertise?: string[];
  rating?: number;
  reviewsCount?: string;
  sessionsCount?: string;
  profileImage?: string | null;
  portraitImage?: string | null;
  secondaryImage?: string | null;
  bioParagraphs?: string[];
  pillars?: AstrologerPillar[];
  faqs?: AstrologerFaq[];
  availableTimeSlots?: string[];
  addOnPricing?: Record<string, number>;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateAstrologerInput {
  name?: string;
  title?: string;
  code?: string;
  slug?: string;
  eyebrow?: string | null;
  quote?: string | null;
  description?: string | null;
  experienceYears?: number;
  holySeat?: string;
  location?: string;
  languages?: string[];
  specializations?: string[];
  expertise?: string[];
  rating?: number;
  reviewsCount?: string;
  sessionsCount?: string;
  profileImage?: string | null;
  portraitImage?: string | null;
  secondaryImage?: string | null;
  bioParagraphs?: string[];
  pillars?: AstrologerPillar[];
  faqs?: AstrologerFaq[];
  availableTimeSlots?: string[];
  addOnPricing?: Record<string, number>;
  displayOrder?: number;
  isActive?: boolean;
}

export interface AstrologerFilterParams {
  search?: string;
  isActive?: string;
  sortBy?: string;
}

const getAstrologers = async (
  params?: AstrologerFilterParams
): Promise<{ success: boolean; count: number; data: AdminAstrologer[] }> => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.isActive !== undefined && params.isActive !== "") {
    query.append("isActive", params.isActive);
  }
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const queryString = query.toString();
  const endpoint = queryString
    ? `/api/admin/astrologers?${queryString}`
    : "/api/admin/astrologers";

  return api.get(endpoint);
};

const getAstrologerById = async (
  id: string
): Promise<{ success: boolean; data: AdminAstrologer }> => {
  return api.get(`/api/admin/astrologers/${id}`);
};

const createAstrologer = async (
  payload: CreateAstrologerInput
): Promise<{ success: boolean; message: string; data: AdminAstrologer }> => {
  return api.post("/api/admin/astrologers", payload);
};

const updateAstrologer = async (
  id: string,
  payload: UpdateAstrologerInput
): Promise<{ success: boolean; message: string; data: AdminAstrologer }> => {
  return api.patch(`/api/admin/astrologers/${id}`, payload);
};

const updateAstrologerStatus = async (
  id: string,
  isActive: boolean
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; code: string; slug: string; isActive: boolean };
}> => {
  return api.patch(`/api/admin/astrologers/${id}/status`, { isActive });
};

const getAstrologerPackages = async (
  astrologerId: string,
  params?: PackageFilterParams
): Promise<{
  success: boolean;
  count: number;
  astrologer: { id: string; code: string; slug: string; name: string };
  data: AstrologerPackage[];
}> => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.isActive !== undefined && params.isActive !== "") {
    query.append("isActive", params.isActive);
  }
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const queryString = query.toString();
  const endpoint = queryString
    ? `/api/admin/astrologers/${astrologerId}/packages?${queryString}`
    : `/api/admin/astrologers/${astrologerId}/packages`;

  return api.get(endpoint);
};

const getAstrologerPackageById = async (
  astrologerId: string,
  packageId: string
): Promise<{ success: boolean; data: AstrologerPackage }> => {
  return api.get(`/api/admin/astrologers/${astrologerId}/packages/${packageId}`);
};

const createAstrologerPackage = async (
  astrologerId: string,
  payload: CreatePackageInput
): Promise<{ success: boolean; message: string; data: AstrologerPackage }> => {
  return api.post(`/api/admin/astrologers/${astrologerId}/packages`, payload);
};

const updateAstrologerPackage = async (
  astrologerId: string,
  packageId: string,
  payload: UpdatePackageInput
): Promise<{ success: boolean; message: string; data: AstrologerPackage }> => {
  return api.patch(
    `/api/admin/astrologers/${astrologerId}/packages/${packageId}`,
    payload
  );
};

const updateAstrologerPackageStatus = async (
  astrologerId: string,
  packageId: string,
  isActive: boolean
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; packageKey: string; isActive: boolean };
}> => {
  return api.patch(
    `/api/admin/astrologers/${astrologerId}/packages/${packageId}/status`,
    { isActive }
  );
};

const deleteAstrologerPackage = async (
  astrologerId: string,
  packageId: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; packageKey: string; title: string };
}> => {
  return api.delete(
    `/api/admin/astrologers/${astrologerId}/packages/${packageId}`
  );
};

const astrologerAdminService = {
  getAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  updateAstrologerStatus,
  getAstrologerPackages,
  getAstrologerPackageById,
  createAstrologerPackage,
  updateAstrologerPackage,
  updateAstrologerPackageStatus,
  deleteAstrologerPackage,
};

export default astrologerAdminService;
