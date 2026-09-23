export type BlogStatus = "Draft" | "Published" | "Archived";

export interface BlogPost {
  id: string;
  slug: string;
  // English Content
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content: string;
  // Hindi Content (Bilingual)
  titleHi?: string | null;
  subtitleHi?: string | null;
  excerptHi?: string | null;
  contentHi?: string | null;
  // Media & Metadata
  featuredImage?: string | null;
  author: string;
  authorAvatar?: string | null;
  category: string;
  tags: string[];
  status: BlogStatus;
  isFeatured: boolean;
  readTime?: string;
  viewsCount: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaTitleHi?: string | null;
  metaDescriptionHi?: string | null;
  metaKeywords?: string[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  titleHi?: string;
  subtitleHi?: string;
  excerptHi?: string;
  contentHi?: string;
  featuredImage?: string;
  author?: string;
  authorAvatar?: string;
  category: string;
  tags?: string[];
  status?: BlogStatus;
  isFeatured?: boolean;
  readTime?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTitleHi?: string;
  metaDescriptionHi?: string;
  metaKeywords?: string[];
  publishedAt?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

export interface BlogFilterParams {
  status?: string;
  category?: string;
  search?: string;
  isFeatured?: boolean | string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC" | "asc" | "desc";
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  archivedBlogs: number;
  totalViews: number;
  categories: { category: string; count: string | number }[];
}
