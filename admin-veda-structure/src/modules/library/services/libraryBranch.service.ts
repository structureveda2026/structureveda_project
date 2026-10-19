import api from "@/services/api";

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
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_MANTRA_BRANCHES: LibraryBranch[] = [
  {
    id: "branch-shiva",
    categorySlug: "mantra-stotra",
    slug: "shiva",
    name: "शिव मंत्र एवं स्तोत्र",
    enName: "Shiva Mantras & Stotras",
    desc: "महामृत्युंजय, शिव तांडव, रुद्राष्टकम, पञ्चाक्षर मंत्र एवं कर्पूरगौरं स्तुति।",
    stats: "२५+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व मंत्र",
    deity: "shiva",
    imageKey: "deity-shiva.jpg",
    orderIndex: 1,
    status: "ACTIVE",
  },
  {
    id: "branch-vishnu",
    categorySlug: "mantra-stotra",
    slug: "vishnu",
    name: "विष्णु मंत्र एवं स्तोत्र",
    enName: "Vishnu Mantras & Stotras",
    desc: "विष्णु सहस्रनाम, नारायण कवच, द्वादशाक्षर मंत्र एवं पुरुष सूक्त।",
    stats: "२०+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व मंत्र",
    deity: "vishnu",
    imageKey: "deity-vishnu.jpg",
    orderIndex: 2,
    status: "ACTIVE",
  },
  {
    id: "branch-devi",
    categorySlug: "mantra-stotra",
    slug: "devi",
    name: "देवी मंत्र एवं सूक्त",
    enName: "Devi Mantras & Suktas",
    desc: "श्री सूक्त, दुर्गा सप्तशती, कनकधारा स्तोत्र, ललिता सहस्रनाम।",
    stats: "३०+ स्तोत्र व मंत्र",
    badge: "सूक्त व स्तोत्र",
    deity: "devi",
    imageKey: "deity-durga.jpg",
    orderIndex: 3,
    status: "ACTIVE",
  },
  {
    id: "branch-gayatri",
    categorySlug: "mantra-stotra",
    slug: "gayatri",
    name: "वैदिक शांति व गायत्री मंत्र",
    enName: "Vaidika Shanti & Gayatri",
    desc: "महाशांति पाठ, गायत्री महामंत्र, पवमान व हिरण्यगर्भ सूक्त।",
    stats: "१५+ वैदिक सूक्त",
    badge: "वैदिक सूक्त",
    deity: "gayatri",
    imageKey: "deity-saraswati.jpg",
    orderIndex: 4,
    status: "ACTIVE",
  },
  {
    id: "branch-ganesh",
    categorySlug: "mantra-stotra",
    slug: "ganesh",
    name: "श्री गणेश मंत्र व स्तुति",
    enName: "Ganesh Mantras & Stutis",
    desc: "संकटनाशन गणेश स्तोत्र, अथर्वशीर्ष, वक्रतुण्ड महामंत्र।",
    stats: "१०+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व स्तुति",
    deity: "ganesh",
    imageKey: "deity-ganesh.jpg",
    orderIndex: 5,
    status: "ACTIVE",
  },
  {
    id: "branch-surya",
    categorySlug: "mantra-stotra",
    slug: "surya",
    name: "सूर्य एवं नवग्रह मंत्र",
    enName: "Surya & Navagraha Mantras",
    desc: "आदित्य हृदय स्तोत्र, नवग्रह स्तोत्र एवं शांति विधान।",
    stats: "१२+ स्तोत्र व मंत्र",
    badge: "नवग्रह शांति",
    deity: "surya",
    imageKey: "deity-navagraha.jpg",
    orderIndex: 6,
    status: "ACTIVE",
  },
  {
    id: "branch-hanuman",
    categorySlug: "mantra-stotra",
    slug: "hanuman",
    name: "हनुमान चालीसा एवं स्तोत्र",
    enName: "Hanuman Chalisa & Stotras",
    desc: "हनुमान चालीसा, बजरंग बाण, संकटमोचन हनुमानाष्टक।",
    stats: "८+ स्तोत्र व पाठ",
    badge: "चालीसा व पाठ",
    deity: "hanuman",
    imageKey: "card-puja.jpg",
    orderIndex: 7,
    status: "ACTIVE",
  },
];

export const libraryBranchService = {
  /**
   * Fetch all branches for a category (e.g. mantra-stotra)
   */
  async getBranches(categorySlug = "mantra-stotra"): Promise<LibraryBranch[]> {
    try {
      const res = await api.get(`/admin/library/categories/${categorySlug}/subcategories`);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      try {
        const publicRes = await api.get(`/library/categories/${categorySlug}/subcategories`);
        if (publicRes && publicRes.data && Array.isArray(publicRes.data) && publicRes.data.length > 0) {
          return publicRes.data;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_MANTRA_BRANCHES;
  },

  /**
   * Create a new subcategory branch
   */
  async createBranch(categorySlug: string, data: Partial<LibraryBranch>): Promise<LibraryBranch> {
    const res = await api.post(`/admin/library/categories/${categorySlug}/subcategories`, data);
    return res.data;
  },

  /**
   * Update existing branch
   */
  async updateBranch(categorySlug: string, id: string, data: Partial<LibraryBranch>): Promise<LibraryBranch> {
    const res = await api.put(`/admin/library/categories/${categorySlug}/subcategories/${id}`, data);
    return res.data;
  },

  /**
   * Delete a branch
   */
  async deleteBranch(categorySlug: string, id: string): Promise<boolean> {
    await api.del(`/admin/library/categories/${categorySlug}/subcategories/${id}`);
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
      const res = await api.put(`/admin/library/categories/${categorySlug}/subcategories/reorder`, {
        orderedIds,
      });
      if (res && res.data) return res.data;
    } catch {
      try {
        const publicRes = await api.put(
          `/library/categories/${categorySlug}/subcategories/reorder`,
          { orderedIds }
        );
        if (publicRes && publicRes.data) return publicRes.data;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_MANTRA_BRANCHES;
  },
};

export default libraryBranchService;
