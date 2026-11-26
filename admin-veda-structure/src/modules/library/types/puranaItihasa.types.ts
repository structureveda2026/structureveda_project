import type { VedaNode, PadapathaItem } from "./veda.types";
export type { PadapathaItem };

export type GunaClassification = "sattvika" | "rajasa" | "tamasa" | "nirguna" | "none";

export type GranthaCategory = "purana" | "itihasa" | "upapurana" | "mahakavya";

export type GranthaStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface PuranaItihasaGrantha {
  id: string;
  slug: string;
  name: string; // Hindi/Sanskrit Name e.g. "Vishnu Purana" (Devanagari)
  enName: string; // English Name e.g. "Vishnu Purana"
  hinglishName?: string; // Hinglish Name e.g. "Vishnu Puran"
  category: GranthaCategory;
  guna: GunaClassification;
  chiefDeity: string; // e.g. "Lord Vishnu"
  primaryRishis: string; // e.g. "Maharshi Parashara, Maitreya Muni"
  shlokaCount?: string | number; // e.g. "23,000" or 7000
  adhyayaCount?: string | number; // e.g. "126"
  khandaCount?: string | number;
  parvaCount?: string | number;
  skandhaCount?: string | number;
  stats?: string; // e.g. "6 Amshas • 126 Adhyayas • 7,000 Shlokas"
  eyebrow?: string; // e.g. "Vaishnava Mahapurana • Expounded by Parashara Muni"
  intro?: string; // Brief intro
  overviewText?: string; // Detailed overview
  desc?: string;
  priest?: string;
  badge?: string;
  imageKey?: string;
  bannerImage?: string;
  quickInfo?: {
    type?: string;
    language?: string;
    chiefDeity?: string;
    primaryRishi?: string;
    classification?: string;
    shlokaCount?: string;
    adhyayaCount?: string;
    [key: string]: unknown;
  };
  rishis?: Array<{ name: string; role?: string; avatar?: string }>;
  deities?: Array<{ name: string; title?: string; image?: string }>;
  availableTexts?: Array<{ title: string; desc?: string; mantraId?: string; slug?: string }>;
  relatedGranthas?: string[];
  orderIndex: number;
  status: GranthaStatus;
  createdAt?: string;
  updatedAt?: string;
  statsMeta?: {
    nodeCount: number;
    mantraCount: number;
  };
  tree?: VedaNode[];
}

export interface PhilosophicalJewel {
  id: string;
  title: string; // Devanagari title
  enTitle: string; // "Durga Saptashati (Devi Mahatmya)"
  sourceGrantha: string; // "Markandeya Purana (Ch. 81-93)"
  sourcePuranaId: string; // "markandeya-purana"
  shlokaCount: string; // "700 Shlokas (13 Chapters)"
  chiefDeity: string; // "Goddess Mahadurga (Mahakali, Mahalakshmi, Mahasaraswati)"
  speaker: string; // "Medha Rishi (to King Suratha & Samadhi Vaishya)"
  keyTheme: string; // "Slaying of Madhu-Kaitabha, Mahishasura, Shumbha-Nishumbha"
  philosophicalSignificance: string; // "Supreme Shakta stotra scripture, source of Chandi Path"
  popularStotras: string[];
  status: "ACTIVE" | "INACTIVE";
}

export interface UpapuranaItem {
  id: string;
  name: string; // Devanagari name
  enName: string; // "Sanatkumara Purana"
  chiefDeity: string; // "Lord Brahma / Sanatkumara"
  associatedRishi: string; // "Maharshi Sanatkumara"
  approxShlokas: string; // "3,500 Shlokas"
  tradition: "Vaishnava" | "Shaiva" | "Shakta" | "Saura" | "Brahma";
  summary: string;
  status: GranthaStatus;
}

export interface ShastricCharacteristic {
  id: number;
  sanskritName: string; // e.g. "Sarga (Primary Creation)"
  enName: string;
  shlokaRef: string; // "Shrimad Bhagavatam 12.7.9 / 2.10.1"
  definition: string;
  puranicSignificance: string;
  examplesInGranthas: string;
}

export interface PuranaQueryParams {
  status?: string;
  guna?: string;
  category?: string;
  search?: string;
}

export type PuranaItihasaCategory = GranthaCategory;
export type PuranaItihasaStatus = GranthaStatus;
export type PuranaItihasaText = PuranaItihasaGrantha;

export type PuranaItihasaNode = VedaNode;

export interface PuranaItihasaShloka {
  id: string;
  slug?: string;
  vedaId: string;
  textId?: string;
  nodeId?: string;
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
  hindiTranslation: string;
  englishTranslation?: string;
  hinglishTranslation?: string;
  padapatha?: Array<{ word: string; meaning: string }>;
  shastricContext?: string;
  purport?: string;
  orderIndex: number;
  isFeatured?: boolean;
  status: "ACTIVE" | "INACTIVE";
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface PuranaItihasaTaxonomy {
  nodes?: VedaNode[] | unknown[];
  mahapuranas?: unknown[];
  upapuranas?: unknown[];
  itihasas?: unknown[];
  akhyanas?: unknown[];
  dashaLakshanas?: unknown[];
  [key: string]: unknown;
}

export interface PuranaItihasaFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: GranthaCategory | "all";
  gunaClassification?: GunaClassification | "all";
  status?: GranthaStatus | "ALL";
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface ShlokaFilterParams {
  page?: number;
  limit?: number;
  textId?: string;
  vedaId?: string;
  nodeId?: string;
  search?: string;
  status?: string;
  isFeatured?: boolean;
  sort?: string;
  order?: "ASC" | "DESC";
}

export type PuranaItihasaFormData = Partial<PuranaItihasaGrantha>;
export type ShlokaFormData = Partial<PuranaItihasaShloka>;

export interface PaginatedPuranaItihasaResponse {
  data?: PuranaItihasaText[];
  granthas?: PuranaItihasaText[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedShlokasResponse {
  data?: PuranaItihasaShloka[];
  shlokas?: PuranaItihasaShloka[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
