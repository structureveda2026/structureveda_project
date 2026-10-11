export interface PadapathaItem {
  word: string;
  meaning: string;
}

export interface VedaQuickInfo {
  type?: string;
  language?: string;
  chiefPriest?: string;
  mandalCount?: string;
  suktaCount?: string;
  chiefRishis?: string;
  [key: string]: any;
}

export interface VedaRishi {
  name: string;
  role?: string;
  avatar?: string;
}

export interface VedaDeity {
  name: string;
  title?: string;
  image?: string;
}

export interface VedaAvailableText {
  title: string;
  desc?: string;
  mantraId?: string;
  slug?: string;
}

export interface VedaRelatedGrantha {
  name: string;
  type?: string;
  author?: string;
  desc?: string;
}

export interface Veda {
  id: string;
  slug: string;
  name: string;
  enName: string;
  eyebrow?: string;
  intro?: string;
  overviewText?: string;
  desc?: string;
  stats?: string;
  priest?: string;
  badge?: string;
  imageKey?: string;
  bannerImage?: string;
  quickInfo?: VedaQuickInfo;
  rishis?: VedaRishi[];
  deities?: VedaDeity[];
  availableTexts?: VedaAvailableText[];
  relatedGranthas?: VedaRelatedGrantha[];
  orderIndex?: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  createdAt?: string;
  updatedAt?: string;
  statsMeta?: {
    nodeCount: number;
    mantraCount: number;
  };
  tree?: VedaNode[];
}

export interface VedaNode {
  id: string;
  slug: string;
  vedaId: string;
  parentId?: string | null;
  nodeType:
    | "SHAKHA"
    | "SAMHITA"
    | "BRAHMANA"
    | "ARANYAKA"
    | "UPANISHAD"
    | "SUTRA"
    | "MANDALA"
    | "KANDA"
    | "ADHYAYA"
    | "SUKTA"
    | "VARGA"
    | "PARVA";
  name: string;
  enName?: string;
  desc?: string;
  stats?: string;
  priest?: string;
  badge?: string;
  imageKey?: string;
  mantraId?: string | null;
  orderIndex?: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  children?: VedaNode[];
  mantras?: VedaMantra[];
  breadcrumb?: VedaNode[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VedaMantra {
  id: string;
  slug?: string;
  vedaId: string;
  nodeId?: string | null;
  vedaName: string;
  shakha?: string;
  textName: string;
  sectionRef: string;
  mantraNumber: string;
  rishi?: string;
  devata?: string;
  chhanda?: string;
  svara?: string;
  sanskrit: string;
  transliteration?: string;
  hindiTranslation: string;
  englishTranslation?: string;
  hinglishTranslation?: string;
  padapatha?: PadapathaItem[];
  shastricContext?: string;
  audioUrl?: string;
  previousId?: string | null;
  nextId?: string | null;
  chapterMantraIds?: string[];
  orderIndex?: number;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  createdAt?: string;
  updatedAt?: string;
  siblings?: VedaMantra[];
}

export interface MantraQueryParams {
  page?: number;
  limit?: number;
  vedaId?: string;
  nodeId?: string;
  shakha?: string;
  rishi?: string;
  devata?: string;
  search?: string;
  status?: string;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface PaginatedMantrasResponse {
  mantras: VedaMantra[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
