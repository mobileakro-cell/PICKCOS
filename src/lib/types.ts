// Bilingual helpers
export interface BL {
  ko: string
  en: string
}

export interface BLArray {
  ko: string[]
  en: string[]
}

// Helper to create bilingual text
export function bl(en: string, ko: string): BL {
  return { en, ko }
}

export function blArr(en: string[], ko: string[]): BLArray {
  return { en, ko }
}

// ── Supplier taxonomy (2-axis faceted) ──
// Axis 1 — supplier type (역할)
export type SupplierType = 'Packaging' | 'Ingredients' | 'Materials'
// Axis 2 — product category (제품군)
export type ProductCategory = 'Skincare' | 'Functional' | 'Makeup' | 'Hair' | 'Body' | 'Fragrance'

export const SUPPLIER_TYPES: { code: SupplierType; en: string; ko: string }[] = [
  { code: 'Packaging', en: 'Packaging', ko: '패키징' },
  { code: 'Ingredients', en: 'Ingredients', ko: '원료' },
  { code: 'Materials', en: 'Materials', ko: '부자재' },
]

export const PRODUCT_CATEGORIES: { code: ProductCategory; en: string; ko: string }[] = [
  { code: 'Skincare', en: 'Skincare', ko: '스킨케어' },
  { code: 'Functional', en: 'Functional care', ko: '기능성케어' },
  { code: 'Makeup', en: 'Makeup', ko: '메이크업' },
  { code: 'Hair', en: 'Hair', ko: '헤어' },
  { code: 'Body', en: 'Body', ko: '바디' },
  { code: 'Fragrance', en: 'Fragrance', ko: '향' },
]

export const supplierTypeLabel = (code: string, lang: 'en' | 'ko') =>
  SUPPLIER_TYPES.find((t) => t.code === code)?.[lang] ?? code
export const productCategoryLabel = (code: string, lang: 'en' | 'ko') =>
  PRODUCT_CATEGORIES.find((p) => p.code === code)?.[lang] ?? code

// Supplier Types
export interface Supplier {
  id: string
  name: string
  supplierType: BL
  category: SupplierType
  productCategories: ProductCategory[]
  image: string
  location: BL
  country: string
  featured: boolean
  verified: boolean
  ambassadorPick: boolean
  certifications: string[]
  moq: number
  leadTime: number
  moqRange: string
  leadTimeRange: string
  description: BL
  descriptionFull: BL
  coreStrengths: BLArray
  capabilities: BLArray
  regulatoryNotes: BL
  exportMarkets: string[]
  files: File[]
  website: string
  contact: string
  exportExperience: boolean
  exhibitionIds: string[]
}

export interface File {
  id: string
  name: string
  type: string
  size: string
}

// Article Types
export interface Article {
  id: string
  slug: string
  title: BL
  summary: BL
  content: BL
  category: string
  region: string
  tags: BLArray
  publishedAt: string
  image: string
  author: string
  isHeadline: boolean
  contentBlocks: ContentBlock[]
  relatedSuppliers: string[]
}

export interface ContentBlock {
  type: string
  title: BL
  content?: BL
  items?: BLArray
}

// Exhibition Types
export interface Exhibition {
  id: string
  title: BL
  dateRange: string
  location: BL
  region: string
  image: string
  status: 'upcoming' | 'past' | 'planning'
  description: BL
  supplierIds: string[]
  articleIds?: string[]
}

// Ambassador Types
export interface Ambassador {
  id: string
  name: string
  title: BL
  region: string
  bio: BL
  expertise: BLArray
  image: string
}

// Contact Types
export interface BaseFormData {
  companyName: string
  personName: string
  email: string
  country?: string
  phone?: string
}

export interface ContactFormData extends BaseFormData {
  inquiryType: 'sourcing' | 'partnership' | 'general' | 'support'
  category: string
  targetMarkets: string[]
  description: string
}

export interface MatchingFormData extends BaseFormData {
  inquiryType: 'sourcing' | 'partnership' | 'support'
  category: string
  targetMarkets: string[]
  quantity: string
  timeframe: string
  budget: string
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> extends PaginatedResponse<T> {}

export interface SupplierFilters {
  category?: string
  region?: string
  search?: string
  page?: number
  pageSize?: number
}

// Normalized Region mapping for consistent filtering
export const REGION_MAP: Record<string, string[]> = {
  'KR': ['Korea', 'South Korea', 'Seoul', 'Busan', 'Daegu', 'Incheon'],
  'ASIA': ['Japan', 'China', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore'],
  'EU': ['EU Countries', 'Germany', 'France', 'Netherlands', 'UK'],
  'ME': ['Middle East', 'UAE', 'Dubai', 'Saudi Arabia'],
  'US': ['United States', 'Canada', 'USA'],
}
