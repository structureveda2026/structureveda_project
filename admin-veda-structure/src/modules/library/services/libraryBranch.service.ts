import api from "@/services/api";

export type BranchCategorySlug = "mantra" | "stotra" | "mantra-stotra";

export interface LibraryBranch {
  id: string;
  categorySlug: string;
  slug: string;
  name: string;
  enName?: string;
  desc?: string;
  stats?: string;
  badge?: string;
  deity?: string;
  imageKey?: string;
  orderIndex: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_MANTRA_BRANCHES: LibraryBranch[] = [
  {
    id: "branch-mantra-shiva",
    categorySlug: "mantra",
    slug: "shiva",
    name: "Shiva Mantras",
    enName: "Shiva Mantras & Suktas",
    desc: "Mahamrityunjaya Mantra, Panchakshara Mantra, Rudra Gayatri, and Vedic Shiva chants.",
    stats: "15+ Mantras",
    badge: "Vedic Mantra",
    deity: "Shiva",
    imageKey: "deity-shiva.jpg",
    orderIndex: 1,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-vishnu",
    categorySlug: "mantra",
    slug: "vishnu",
    name: "Vishnu & Narayana Mantras",
    enName: "Vishnu Mantras & Suktas",
    desc: "Dwadashakshara Mantra, Purusha Sukta, Narayana Gayatri, and Vaishnava Vedic chants.",
    stats: "12+ Mantras",
    badge: "Vedic Mantra",
    deity: "Vishnu",
    imageKey: "deity-vishnu.jpg",
    orderIndex: 2,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-devi",
    categorySlug: "mantra",
    slug: "devi",
    name: "Devi Mantras & Suktas",
    enName: "Devi Mantras & Suktas",
    desc: "Shri Sukta, Navarna Mantra, Devi Gayatri, and Vedic Shakti invocations.",
    stats: "18+ Mantras",
    badge: "Devi Sukta",
    deity: "Devi",
    imageKey: "deity-durga.jpg",
    orderIndex: 3,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-gayatri",
    categorySlug: "mantra",
    slug: "gayatri",
    name: "Vedic Shanti & Gayatri",
    enName: "Vedic Shanti & Gayatri Mantras",
    desc: "Gayatri Mahamantra, Shanti Patha, Pavamana Mantra, and Agni Gayatri invocations.",
    stats: "15+ Vedic Chants",
    badge: "Vedic Mantra",
    deity: "Gayatri",
    imageKey: "deity-saraswati.jpg",
    orderIndex: 4,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-ganesh",
    categorySlug: "mantra",
    slug: "ganesh",
    name: "Ganesh Mantras",
    enName: "Ganesh Mantras & Atharvashirsha",
    desc: "Vakratunda Mahakaya, Ganapati Moola Mantra, and Vedic Ganapati invocations.",
    stats: "10+ Mantras",
    badge: "Vedic Mantra",
    deity: "Ganesh",
    imageKey: "deity-ganesh.jpg",
    orderIndex: 5,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-surya",
    categorySlug: "mantra",
    slug: "surya",
    name: "Surya & Navagraha Mantras",
    enName: "Surya & Navagraha Mantras",
    desc: "Surya Beej Mantra, Navagraha Shanti Mantras, and planetary Vedic remedies.",
    stats: "12+ Mantras",
    badge: "Navagraha",
    deity: "Surya",
    imageKey: "deity-navagraha.jpg",
    orderIndex: 6,
    status: "ACTIVE",
  },
  {
    id: "branch-mantra-hanuman",
    categorySlug: "mantra",
    slug: "hanuman",
    name: "Hanuman Mantras",
    enName: "Hanuman Beej & Strength Mantras",
    desc: "Hanuman Moola Mantra, Anjaneya Gayatri, and Manojavam Marutatulyavegam.",
    stats: "8+ Mantras",
    badge: "Mantra",
    deity: "Hanuman",
    imageKey: "card-puja.jpg",
    orderIndex: 7,
    status: "ACTIVE",
  },
];

export const DEFAULT_STOTRA_BRANCHES: LibraryBranch[] = [
  {
    id: "branch-stotra-shiva",
    categorySlug: "stotra",
    slug: "shiva",
    name: "Shiva Stotras",
    enName: "Shiva Stotras & Ashtakams",
    desc: "Shiva Tandava Stotram, Rudrashtakam, Lingashtakam, and Bilvashtakam hymns.",
    stats: "12+ Stotras",
    badge: "Stotra",
    deity: "Shiva",
    imageKey: "deity-shiva.jpg",
    orderIndex: 1,
    status: "ACTIVE",
  },
  {
    id: "branch-stotra-vishnu",
    categorySlug: "stotra",
    slug: "vishnu",
    name: "Vishnu & Narayana Stotras",
    enName: "Vishnu Stotras & Sahasranama",
    desc: "Vishnu Sahasranama, Narayana Kavacham, Madhurashtakam, and Achyutashtakam.",
    stats: "10+ Stotras",
    badge: "Stotra",
    deity: "Vishnu",
    imageKey: "deity-vishnu.jpg",
    orderIndex: 2,
    status: "ACTIVE",
  },
  {
    id: "branch-stotra-devi",
    categorySlug: "stotra",
    slug: "devi",
    name: "Devi Stotras & Kavach",
    enName: "Devi Stotras & Argala",
    desc: "Mahishasura Mardini Stotram, Kanakadhara Stotram, Argala Stotram, and Lalita Sahasranama.",
    stats: "15+ Stotras",
    badge: "Stotra & Kavach",
    deity: "Devi",
    imageKey: "deity-durga.jpg",
    orderIndex: 3,
    status: "ACTIVE",
  },
  {
    id: "branch-stotra-ganesh",
    categorySlug: "stotra",
    slug: "ganesh",
    name: "Ganesh Stotras",
    enName: "Ganesh Stotras & Chalisa",
    desc: "Sankatanashana Ganesh Stotram, Ganapati Atharvashirsha, and Ganesh Pancharatnam.",
    stats: "8+ Stotras",
    badge: "Stotra",
    deity: "Ganesh",
    imageKey: "deity-ganesh.jpg",
    orderIndex: 4,
    status: "ACTIVE",
  },
  {
    id: "branch-stotra-surya",
    categorySlug: "stotra",
    slug: "surya",
    name: "Surya & Navagraha Stotras",
    enName: "Aditya Hridaya & Navagraha Stotras",
    desc: "Aditya Hridaya Stotram, Surya Ashtakam, and Navagraha Stotram.",
    stats: "6+ Stotras",
    badge: "Navagraha",
    deity: "Surya",
    imageKey: "deity-navagraha.jpg",
    orderIndex: 5,
    status: "ACTIVE",
  },
  {
    id: "branch-stotra-hanuman",
    categorySlug: "stotra",
    slug: "hanuman",
    name: "Hanuman Chalisa & Stotras",
    enName: "Hanuman Chalisa, Bajrang Baan & Ashtak",
    desc: "Hanuman Chalisa, Sankatmochan Hanumanashtak, Bajrang Baan, and Panchamukhi Kavach.",
    stats: "8+ Stotras",
    badge: "Chalisa & Stotra",
    deity: "Hanuman",
    imageKey: "card-puja.jpg",
    orderIndex: 6,
    status: "ACTIVE",
  },
];

export function getDefaultBranches(categorySlug: string): LibraryBranch[] {
  if (categorySlug === "mantra") {
    return DEFAULT_MANTRA_BRANCHES;
  }
  if (categorySlug === "stotra") {
    return DEFAULT_STOTRA_BRANCHES;
  }
  return [...DEFAULT_MANTRA_BRANCHES, ...DEFAULT_STOTRA_BRANCHES];
}

export const libraryBranchService = {
  /**
   * Fetch all branches for a category (e.g. "mantra", "stotra", or "mantra-stotra")
   */
  async getBranches(categorySlug = "mantra-stotra"): Promise<LibraryBranch[]> {
    try {
      const res = await api.get(
        `/admin/library/categories/${encodeURIComponent(categorySlug)}/subcategories`
      );
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch {
      try {
        const publicRes = await api.get(
          `/library/categories/${encodeURIComponent(categorySlug)}/subcategories`
        );
        if (publicRes && publicRes.data && Array.isArray(publicRes.data)) {
          return publicRes.data;
        }
      } catch {
        // Fallback to clean English defaults scoped to categorySlug
      }
    }
    return getDefaultBranches(categorySlug);
  },

  /**
   * Create a new subcategory branch
   */
  async createBranch(
    categorySlug: string,
    data: Partial<LibraryBranch>
  ): Promise<LibraryBranch> {
    const res = await api.post(
      `/admin/library/categories/${encodeURIComponent(categorySlug)}/subcategories`,
      data
    );
    return res.data;
  },

  /**
   * Update existing branch
   */
  async updateBranch(
    categorySlug: string,
    id: string,
    data: Partial<LibraryBranch>
  ): Promise<LibraryBranch> {
    const res = await api.put(
      `/admin/library/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(id)}`,
      data
    );
    return res.data;
  },

  /**
   * Delete a branch
   */
  async deleteBranch(categorySlug: string, id: string): Promise<boolean> {
    await api.del(
      `/admin/library/categories/${encodeURIComponent(categorySlug)}/subcategories/${encodeURIComponent(id)}`
    );
    return true;
  },

  /**
   * Reorder branches
   */
  async reorderBranches(
    categorySlug: string,
    orderedIds: string[] | { id: string; orderIndex: number }[]
  ): Promise<LibraryBranch[]> {
    try {
      const res = await api.put(
        `/admin/library/categories/${encodeURIComponent(categorySlug)}/subcategories/reorder`,
        { orderedIds }
      );
      if (res && Array.isArray(res.data)) return res.data;
    } catch {
      try {
        const publicRes = await api.put(
          `/library/categories/${encodeURIComponent(categorySlug)}/subcategories/reorder`,
          { orderedIds }
        );
        if (publicRes && Array.isArray(publicRes.data)) return publicRes.data;
      } catch {
        // Fallback
      }
    }
    return getDefaultBranches(categorySlug);
  },
};

export default libraryBranchService;
