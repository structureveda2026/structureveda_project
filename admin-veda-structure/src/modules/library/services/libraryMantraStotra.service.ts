import api from "@/services/api";
import {
  LibraryMantraStotra,
  MantraStotraQueryParams,
  PaginatedMantraStotraResponse,
} from "../types/mantraStotra.types";

const BASE_PATH = "/admin/library/mantra-stotras";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

function buildQueryString(params: MantraStotraQueryParams): string {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.branchId) qs.set("branchId", params.branchId);
  if (params.branchSlug) qs.set("branchSlug", params.branchSlug);
  if (params.deity) qs.set("deity", params.deity);
  if (params.status && params.status !== "ALL") qs.set("status", params.status);
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const encoded = qs.toString();
  return encoded ? `?${encoded}` : "";
}

export const libraryMantraStotraService = {
  async getItems(
    params: MantraStotraQueryParams = {}
  ): Promise<PaginatedMantraStotraResponse> {
    const query = buildQueryString(params);
    const res = (await api.get(`${BASE_PATH}${query}`)) as ApiResponse<
      PaginatedMantraStotraResponse | LibraryMantraStotra[]
    >;

    const data = res?.data;
    if (Array.isArray(data)) {
      return {
        items: data,
        pagination: {
          total: data.length,
          page: params.page || 1,
          limit: params.limit || 20,
          pages: 1,
        },
      };
    }

    const items = Array.isArray(data?.items) ? data.items : [];
    const pagination = data?.pagination || {
      total: items.length,
      page: params.page || 1,
      limit: params.limit || 20,
      pages: Math.max(1, Math.ceil(items.length / (params.limit || 20))),
    };

    return { items, pagination };
  },

  async getItemById(idOrSlug: string): Promise<LibraryMantraStotra> {
    const res = (await api.get(
      `${BASE_PATH}/${encodeURIComponent(idOrSlug)}`
    )) as ApiResponse<LibraryMantraStotra>;
    if (!res?.data) {
      throw new Error(res?.message || "Mantra/Stotra item not found.");
    }
    return res.data;
  },

  async createItem(
    payload: Partial<LibraryMantraStotra>
  ): Promise<LibraryMantraStotra> {
    const res = (await api.post(
      BASE_PATH,
      payload
    )) as ApiResponse<LibraryMantraStotra>;
    if (!res?.data) {
      throw new Error(res?.message || "Failed to create Mantra/Stotra item.");
    }
    return res.data;
  },

  async updateItem(
    id: string,
    payload: Partial<LibraryMantraStotra>
  ): Promise<LibraryMantraStotra> {
    const res = (await api.put(
      `${BASE_PATH}/${encodeURIComponent(id)}`,
      payload
    )) as ApiResponse<LibraryMantraStotra>;
    if (!res?.data) {
      throw new Error(res?.message || "Failed to update Mantra/Stotra item.");
    }
    return res.data;
  },

  async deleteItem(id: string): Promise<boolean> {
    await api.del(`${BASE_PATH}/${encodeURIComponent(id)}`);
    return true;
  },

  async seedDefaults(): Promise<unknown> {
    const res = (await api.post(`${BASE_PATH}/seed`, {})) as ApiResponse<unknown>;
    return res?.data ?? res;
  },
};

export default libraryMantraStotraService;
