import type { VedaNode, VedaMantra, PadapathaItem } from "./veda.types";
export type { PadapathaItem };

export type GunaClassification = "sattvika" | "rajasa" | "tamasa" | "nirguna" | "none";

export type GranthaCategory = "purana" | "itihasa" | "upapurana" | "mahakavya";

export type GranthaStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface PuranaItihasaGrantha {
  id: string;
  slug: string;
  name: string; // Devanagari e.g. "विष्णु पुराण"
  enName: string; // English e.g. "Vishnu Purana"
  category: GranthaCategory;
  guna: GunaClassification;
  chiefDeity: string; // e.g. "भगवान् विष्णु"
  primaryRishis: string; // e.g. "महर्षि पराशर, मैत्रेय मुनि"
  shlokaCount?: string | number; // e.g. "२३,०००" or 7000
  adhyayaCount?: string | number; // e.g. "१२६"
  khandaCount?: string | number;
  parvaCount?: string | number;
  skandhaCount?: string | number;
  stats?: string; // e.g. "६ अंश • १२६ अध्याय • ७,००० श्लोक"
  eyebrow?: string; // e.g. "वैष्णव महापुराण • पराशर मुनि प्रोक्त"
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
    [key: string]: any;
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
  title: string; // Devanagari e.g. "दुर्गा सप्तशती (देवी माहात्म्य)"
  enTitle: string; // "Durga Saptashati (Devi Mahatmya)"
  sourceGrantha: string; // "मार्कण्डेय पुराण (अध्याय ८१-९३)"
  sourcePuranaId: string; // "markandeya-purana"
  shlokaCount: string; // "७०० श्लोक (त्रयोदश अध्याय)"
  chiefDeity: string; // "भगवती महादुर्गा (महाकाली, महालक्ष्मी, महासरस्वती)"
  speaker: string; // "मेधा ऋषि (राजा सुरथ व समाधि वैश्य के प्रति)"
  keyTheme: string; // "मधु-कैटभ, महिषासुर, शुम्भ-निशुम्भ वध एवं नवदुर्गा पराक्रम"
  philosophicalSignificance: string; // "शाक्त परम्परा का शिरोमणि स्तोत्र ग्रंथ, चण्डी पाठ का मूल"
  popularStotras: string[];
  status: "ACTIVE" | "INACTIVE";
}

export interface UpapuranaItem {
  id: string;
  name: string; // Devanagari e.g. "सनत्कुमार पुराण"
  enName: string; // "Sanatkumara Purana"
  chiefDeity: string; // "भगवान् ब्रह्मा / सनत्कुमार"
  associatedRishi: string; // "सनत्कुमार महर्षि"
  approxShlokas: string; // "३,५०० श्लोक"
  tradition: "वैष्णव" | "शैव" | "शाक्त" | "सौर" | "ब्राह्म";
  summary: string;
  status: GranthaStatus;
}

export interface ShastricCharacteristic {
  id: number;
  sanskritName: string; // e.g. "सर्ग (Sarga)"
  enName: string;
  shlokaRef: string; // "श्रीमद्भागवत १२.७.९ / २.१०.१"
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

export interface PuranaItihasaNode extends VedaNode {}

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
  transliteration?: string;
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
  [key: string]: any;
}

export interface PuranaItihasaTaxonomy {
  nodes?: VedaNode[] | any[];
  mahapuranas?: any[];
  upapuranas?: any[];
  itihasas?: any[];
  akhyanas?: any[];
  dashaLakshanas?: any[];
  [key: string]: any;
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

export interface PuranaItihasaFormData extends Partial<PuranaItihasaGrantha> {}
export interface ShlokaFormData extends Partial<PuranaItihasaShloka> {}

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
