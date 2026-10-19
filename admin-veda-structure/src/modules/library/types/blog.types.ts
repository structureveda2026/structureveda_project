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
  // Hinglish Content (3-Language Standard)
  titleHinglish?: string | null;
  subtitleHinglish?: string | null;
  excerptHinglish?: string | null;
  contentHinglish?: string | null;
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
  metaTitleHinglish?: string | null;
  metaDescriptionHinglish?: string | null;
  metaKeywords?: string[];
  publishedAt?: string | null;
  // Multi-format & Sacred Verse / Mantra additions (Devanagari Sanskrit + 3 Languages)
  postType?: string;
  sanskrit?: string | null;
  deity?: string | null;
  rishi?: string | null;
  chhandas?: string | null;
  meaning?: string | null;
  meaningHi?: string | null;
  meaningEn?: string | null;
  meaningHinglish?: string | null;
  hindiTranslation?: string | null;
  englishTranslation?: string | null;
  hinglishTranslation?: string | null;
  vidhi?: string | null;
  benefits?: string | null;
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
  titleHinglish?: string;
  subtitleHinglish?: string;
  excerptHinglish?: string;
  contentHinglish?: string;
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
  metaTitleHinglish?: string;
  metaDescriptionHinglish?: string;
  metaKeywords?: string[];
  publishedAt?: string;
  // Multi-format & Sacred Verse / Mantra additions (Devanagari Sanskrit + 3 Languages)
  postType?: string;
  sanskrit?: string;
  deity?: string;
  rishi?: string;
  chhandas?: string;
  meaning?: string;
  meaningHi?: string;
  meaningEn?: string;
  meaningHinglish?: string;
  hindiTranslation?: string;
  englishTranslation?: string;
  hinglishTranslation?: string;
  vidhi?: string;
  benefits?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

export interface BlogFilterParams {
  status?: string;
  category?: string;
  postType?: string;
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
