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

// Supplier Types
export interface Supplier {
  id: string
  name: string
  supplierType: BL
  category: 'OEM' | 'Packaging' | 'Ingredients' | 'Contract Manufacturing' | 'Equipment'
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
