import api from "@/services/api";
import type {
  VedaMantra,
  MantraQueryParams,
  PaginatedMantrasResponse,
} from "../types/veda.types";

export const VedaMantraAdminService = {
  /**
   * Get paginated mantras with filters
   */
  async getMantras(params: MantraQueryParams = {}): Promise<PaginatedMantrasResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.vedaId && params.vedaId !== "all") query.append("vedaId", params.vedaId);
    if (params.nodeId) query.append("nodeId", params.nodeId);
    if (params.shakha) query.append("shakha", params.shakha);
    if (params.rishi) query.append("rishi", params.rishi);
    if (params.devata) query.append("devata", params.devata);
    if (params.search) query.append("search", params.search);
    if (params.status && params.status !== "ALL") query.append("status", params.status);
    if (params.sort) query.append("sort", params.sort);
    if (params.order) query.append("order", params.order);

    const res = await api.get(`/admin/library/mantras?${query.toString()}`);
    return res.data;
  },

  /**
   * Get single mantra by ID
   */
  async getMantraById(id: string): Promise<VedaMantra> {
    const res = await api.get(`/admin/library/mantras/${id}`);
    return res.data;
  },

  /**
   * Create Mantra
   */
  async createMantra(data: Partial<VedaMantra>): Promise<VedaMantra> {
    const res = await api.post("/admin/library/mantras", data);
    return res.data;
  },

  /**
   * Update Mantra
   */
  async updateMantra(id: string, data: Partial<VedaMantra>): Promise<VedaMantra> {
    const res = await api.put(`/admin/library/mantras/${id}`, data);
    return res.data;
  },

  /**
   * Delete Mantra
   */
  async deleteMantra(id: string): Promise<boolean> {
    await api.delete(`/admin/library/mantras/${id}`);
    return true;
  },

  /**
   * Bulk upload mantras from JSON array
   */
  async bulkUpload(mantras: Partial<VedaMantra>[]): Promise<any> {
    const res = await api.post("/admin/library/mantras/bulk-upload", { mantras });
    return res.data;
  },
};

export default VedaMantraAdminService;
