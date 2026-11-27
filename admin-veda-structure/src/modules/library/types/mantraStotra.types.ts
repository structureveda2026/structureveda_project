export type MantraStotraType = "mantra" | "stotra";
export type MantraStotraStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface MantraStotraVerse {
  verseNo: number;
  sanskrit: string;
  transliteration?: string;
  meaningHi?: string;
  meaningEn?: string;
}

export interface MantraStotraCanonAnga {
  rishi?: string;
  chhandas?: string;
  devata?: string;
  beejam?: string;
  shakti?: string;
  keelakam?: string;
}

export interface MantraStotraVidhi {
  bestDay?: string;
  muhurat?: string;
  direction?: string;
  asana?: string;
  mala?: string;
  sankhya?: string;
  samagri?: string;
}

export interface MantraStotraBenefit {
  category?: string;
  textHi?: string;
  textEn?: string;
}

export interface LibraryMantraStotraBranchRef {
  id: string;
  slug: string;
  name: string;
  enName?: string;
  categorySlug?: string;
  deity?: string;
  imageKey?: string;
}

export interface LibraryMantraStotra {
  id: string;
  slug: string;
  type: MantraStotraType;
  categorySlug: MantraStotraType;
  branchId: string;
  branchSlug: string;
  deity: string;
  deityHi?: string;
  title: string;
  titleHi?: string;
  subtitle?: string;
  subtitleHi?: string;
  sourceRef?: string;
  featuredImage?: string;
  sanskrit: string;
  transliteration?: string;
  hindiTranslation?: string;
  englishTranslation?: string;
  hinglishTranslation?: string;
  verses?: MantraStotraVerse[];
  canonAnga?: MantraStotraCanonAnga;
  vidhi?: MantraStotraVidhi;
  benefits?: MantraStotraBenefit[];
  count?: string;
  rishi?: string;
  chhandas?: string;
  astrologicalRemedy?: string;
  tags?: string[];
  audioUrl?: string;
  isFeatured?: boolean;
  orderIndex?: number;
  status: MantraStotraStatus;
  branch?: LibraryMantraStotraBranchRef;
  createdAt?: string;
  updatedAt?: string;
}

export interface MantraStotraQueryParams {
  type?: MantraStotraType | "";
  branchId?: string;
  branchSlug?: string;
  deity?: string;
  status?: MantraStotraStatus | "ALL" | "";
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedMantraStotraResponse {
  items: LibraryMantraStotra[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
