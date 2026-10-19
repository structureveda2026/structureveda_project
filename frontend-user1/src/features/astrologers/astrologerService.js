import api from "../../services/api.js";

/**
 * Astrologer Public API Service
 * Connects frontend-user1 public pages to Phase 1-4 backend endpoints.
 */

export const getPublicAstrologers = async () => {
  const response = await api.get("/astrologers");
  return response.data;
};

export const getPublicAstrologerBySlug = async (slug) => {
  const cleanSlug = encodeURIComponent(String(slug).trim().toLowerCase());
  const response = await api.get(`/astrologers/${cleanSlug}`);
  return response.data;
};

export const getPublicAstrologerPackages = async (slug) => {
  const cleanSlug = encodeURIComponent(String(slug).trim().toLowerCase());
  const response = await api.get(`/astrologers/${cleanSlug}/packages`);
  return response.data;
};

export const getPublicAstrologerSlots = async (slug) => {
  const cleanSlug = encodeURIComponent(String(slug).trim().toLowerCase());
  const response = await api.get(`/astrologers/${cleanSlug}/slots`);
  return response.data;
};

const astrologerService = {
  getPublicAstrologers,
  getPublicAstrologerBySlug,
  getPublicAstrologerPackages,
  getPublicAstrologerSlots,
};

export default astrologerService;
