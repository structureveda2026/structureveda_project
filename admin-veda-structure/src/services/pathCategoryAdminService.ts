import api from "@/services/api";
import React from "react";
import {
  BookOpen,
  Scroll,
  Flame,
  ShieldCheck,
  Sparkles,
  Coins,
  Sun,
  Heart,
  Compass,
  Layers,
} from "lucide-react";

export const SUPPORTED_CATEGORY_ICONS = [
  { name: "BookOpen", label: "BookOpen (Vedic Scripture & Parayan)" },
  { name: "Scroll", label: "Scroll (Gita & Sacred Vedic Texts)" },
  { name: "Flame", label: "Flame (Shiva & Rudri Recitation)" },
  { name: "ShieldCheck", label: "ShieldCheck (Durga, Chandi & Kavach)" },
  { name: "Sparkles", label: "Sparkles (Vishnu, Suktam & Divine Stuti)" },
  { name: "Coins", label: "Coins (Lakshmi, Kanakadhara & Stotra)" },
  { name: "Sun", label: "Sun (Surya & Solar Scriptures)" },
  { name: "Heart", label: "Heart (Ayushya, Health & Healing Path)" },
  { name: "Compass", label: "Compass (Vastu, Direction & Shanti)" },
  { name: "Layers", label: "Layers (Multi-Day Recitations & Granth)" },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Scroll,
  Flame,
  ShieldCheck,
  Sparkles,
  Coins,
  Sun,
  Heart,
  Compass,
  Layers,
};

export interface AdminPathCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PathCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface PathCategoryFilters {
  search?: string;
  isActive?: string | boolean;
  status?: string;
}

export interface PathCategoryListResponse {
  success: boolean;
  count: number;
  data: AdminPathCategory[];
}

/**
 * Fetch all Path categories for admin view (both active & inactive).
 */
export const getCategories = async (
  filters: PathCategoryFilters = {}
): Promise<AdminPathCategory[]> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }
  if (typeof filters.status !== "undefined" && filters.status !== "") {
    query.append("status", String(filters.status));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = (await api.get(
    `/admin/path-categories${queryString}`
  )) as PathCategoryListResponse;

  return response.data || [];
};

/**
 * Fetch a single Path category by ID for admin detail or edit form.
 */
export const getCategoryById = async (
  id: string
): Promise<AdminPathCategory> => {
  const response = (await api.get(`/admin/path-categories/${id}`)) as {
    success: boolean;
    data: AdminPathCategory;
  };
  return response.data;
};

/**
 * Create a new Path category.
 */
export const createCategory = async (
  payload: PathCategoryPayload
): Promise<AdminPathCategory> => {
  const response = (await api.post("/admin/path-categories", payload)) as {
    success: boolean;
    message: string;
    data: AdminPathCategory;
  };
  return response.data;
};

/**
 * Update an existing Path category.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<PathCategoryPayload>
): Promise<AdminPathCategory> => {
  const response = (await api.put(
    `/admin/path-categories/${id}`,
    payload
  )) as {
    success: boolean;
    message: string;
    data: AdminPathCategory;
  };
  return response.data;
};

/**
 * Soft deactivate a Path category.
 * Existing Path services will remain untouched.
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; slug: string; name: string; isActive: boolean };
}> => {
  const response = (await api.delete(`/admin/path-categories/${id}`)) as {
    success: boolean;
    message: string;
    data: { id: string; slug: string; name: string; isActive: boolean };
  };
  return response;
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
