import api from "@/services/api";
import React from "react";
import {
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
} from "lucide-react";

export const SUPPORTED_CATEGORY_ICONS = [
  { name: "Sparkles", label: "Sparkles (Divine & Blessing)" },
  { name: "Flame", label: "Flame (Sacred Agni & Yagya)" },
  { name: "Coins", label: "Coins (Wealth & Lakshmi)" },
  { name: "ShieldCheck", label: "ShieldCheck (Protection & Suraksha)" },
  { name: "Sun", label: "Sun (Surya & Vitality)" },
  { name: "Compass", label: "Compass (Guidance & Vastu)" },
  { name: "Heart", label: "Heart (Harmony & Relationships)" },
  { name: "Scroll", label: "Scroll (Vedic Scripture)" },
  { name: "BookOpen", label: "BookOpen (Wisdom & Saraswati)" },
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Sun,
  Compass,
  Heart,
  Scroll,
  BookOpen,
};

export interface AdminYagyaCategory {
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

export interface YagyaCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  iconName?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface YagyaCategoryFilters {
  search?: string;
  isActive?: string | boolean;
}

export interface YagyaCategoryListResponse {
  success: boolean;
  count: number;
  data: AdminYagyaCategory[];
}

/**
 * Fetch all Yagya categories for admin view (both active & inactive).
 */
export const getCategories = async (
  filters: YagyaCategoryFilters = {}
): Promise<AdminYagyaCategory[]> => {
  const query = new URLSearchParams();
  if (filters.search && filters.search.trim()) {
    query.append("search", filters.search.trim());
  }
  if (typeof filters.isActive !== "undefined" && filters.isActive !== "") {
    query.append("isActive", String(filters.isActive));
  }

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = (await api.get(
    `/admin/yagya-categories${queryString}`
  )) as YagyaCategoryListResponse;

  return response.data || [];
};

/**
 * Fetch a single category by ID for admin detail or edit form.
 */
export const getCategoryById = async (
  id: string
): Promise<AdminYagyaCategory> => {
  const response = (await api.get(`/admin/yagya-categories/${id}`)) as {
    success: boolean;
    data: AdminYagyaCategory;
  };
  return response.data;
};

/**
 * Create a new Yagya category.
 */
export const createCategory = async (
  payload: YagyaCategoryPayload
): Promise<AdminYagyaCategory> => {
  const response = (await api.post("/admin/yagya-categories", payload)) as {
    success: boolean;
    message: string;
    data: AdminYagyaCategory;
  };
  return response.data;
};

/**
 * Update an existing Yagya category.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<YagyaCategoryPayload>
): Promise<AdminYagyaCategory> => {
  const response = (await api.put(
    `/admin/yagya-categories/${id}`,
    payload
  )) as {
    success: boolean;
    message: string;
    data: AdminYagyaCategory;
  };
  return response.data;
};

/**
 * Soft deactivate a Yagya category.
 * Existing Yagya services will remain untouched.
 */
export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { id: string; slug: string; name: string; isActive: boolean };
}> => {
  const response = (await api.delete(`/admin/yagya-categories/${id}`)) as {
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
