import api from "@/services/api";
import type { Veda, VedaNode } from "../types/veda.types";

export interface VedaQueryParams {
  status?: string;
  category?: string;
  search?: string;
}

export const VedaAdminService = {
  /**
   * Get list of all Vedas / Granthas with node & mantra count statistics
   * Passes category, status, and search in query params
   */
  async getAllVedas(params?: VedaQueryParams): Promise<Veda[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") {
      query.append("category", params.category);
    }
    if (params?.status && params.status !== "ALL") {
      query.append("status", params.status);
    }
    if (params?.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }

    const qs = query.toString() ? `?${query.toString()}` : "";

    try {
      const res = await api.get(`/admin/library/vedas${qs}`);
      const list = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      if (params?.category) {
        try {
          const fallbackRes = await api.get(`/api/library/vedas${qs}`);
          const fallbackList = fallbackRes?.data || (Array.isArray(fallbackRes) ? fallbackRes : []);
          if (Array.isArray(fallbackList) && fallbackList.length > 0) {
            return fallbackList;
          }
        } catch (_) {
          // ignore fallback error
        }
      }
      return list;
    } catch (err: any) {
      try {
        const fallbackRes = await api.get(`/api/library/vedas${qs}`);
        return fallbackRes?.data || (Array.isArray(fallbackRes) ? fallbackRes : []);
      } catch {
        return [];
      }
    }
  },

  /**
   * Get list of all Vedas with node & mantra count statistics (backward-compatible)
   */
  async getVedas(params?: VedaQueryParams): Promise<Veda[]> {
    return this.getAllVedas(params);
  },

  /**
   * Get single Veda by ID
   */
  async getVedaById(id: string): Promise<Veda> {
    const res = await api.get(`/admin/library/vedas/${id}`);
    return res.data;
  },

  /**
   * Get Veda with full nested hierarchy tree (for tree manager)
   */
  async getVedaTree(id: string): Promise<Veda> {
    const res = await api.get(`/admin/library/vedas/${id}/tree`);
    return res.data;
  },

  /**
   * Create Veda
   */
  async createVeda(data: Partial<Veda>): Promise<Veda> {
    const res = await api.post("/admin/library/vedas", data);
    return res.data;
  },

  /**
   * Update Veda
   */
  async updateVeda(id: string, data: Partial<Veda>): Promise<Veda> {
    const res = await api.put(`/admin/library/vedas/${id}`, data);
    return res.data;
  },

  /**
   * Delete Veda
   */
  async deleteVeda(id: string): Promise<boolean> {
    await api.delete(`/admin/library/vedas/${id}`);
    return true;
  },

  /**
   * Create Node in tree (Shakha, Sukta, Adhyaya, Kanda, etc.)
   */
  async createNode(data: Partial<VedaNode>): Promise<VedaNode> {
    const res = await api.post("/admin/library/vedas/nodes", data);
    return res.data;
  },

  /**
   * Update Node in tree
   */
  async updateNode(id: string, data: Partial<VedaNode>): Promise<VedaNode> {
    const res = await api.put(`/admin/library/vedas/nodes/${id}`, data);
    return res.data;
  },

  /**
   * Delete Node in tree
   */
  async deleteNode(id: string): Promise<boolean> {
    await api.delete(`/admin/library/vedas/nodes/${id}`);
    return true;
  },

  /**
   * Seed / Reset default Rigveda & Yajurveda authentic Vedic heritage datasets
   */
  async seedDefaultVedas(overwrite = false): Promise<any> {
    const res = await api.post("/admin/library/vedas/seed-vedas", { overwrite });
    return res.data;
  },
};

export default VedaAdminService;
