# PICKCOS - K-Beauty Sourcing Platform

A comprehensive web platform connecting global beauty brands with verified Korean suppliers, manufacturers, and ingredient suppliers.

## 🎯 Project Overview

PICKCOS is a Next.js-based B2B sourcing platform that streamlines the process of finding and connecting with Korean beauty manufacturers and suppliers. The platform features supplier discovery, advanced filtering, supplier details, news/insights, exhibitions, and supplier matching services.

## 🚀 Features

### Core Features
- **Supplier Directory** - Browse 5+ verified Korean beauty suppliers with detailed information
- **Advanced Filtering** - Filter suppliers by category (OEM, Packaging, Ingredients, Contract Manufacturing, Equipment), region, and search
- **Supplier Details** - Comprehensive supplier profiles with 7 tabs:
  - Overview
  - Capabilities
  - Certifications
  - Export Markets
  - MOQ & Lead Times
  - Exhibition Participation
  - Downloadable Files

### Additional Features
- **Sourcing Hub** - Central hub for supplier discovery with pagination (12 suppliers per page)
- **News & Insights** - Articles covering K-Beauty trends, regulations, sustainability, sourcing tips, and quality assurance
- **Trade Exhibitions** - Upcoming and past beauty trade shows where suppliers participate
- **Supplier Matching** - 4-step matching request form *(submissions currently closed — event capacity reached)*
- **Contact Form** - 3-step inquiry form *(submissions currently closed — event capacity reached)*
- **Member Registration** - Open sign-up form (`/register`) persisted to the database
- **About Page** - Company mission, vision, supplier curation process, ambassador showcase, and values
- **Bilingual (KR/EN)** - Full Korean/English i18n via a language context and string table
- **Admin Panel** (`/admin`) - Auth-protected dashboard for managing suppliers, articles, exhibitions, site settings, and viewing inquiries / matching requests / members; includes Excel/CSV import & export and Supabase image upload
- **Responsive Design** - Mobile-first responsive design with hamburger menu for mobile
- **Global Navigation** - Persistent header (sticky) and footer across all pages

## 📊 Seed / Sample Data

Content lives in Postgres (see **Data Layer** below). The repo ships seed data
(`prisma/seed.ts`, flagged `sample: true`) so a fresh database — or local dev with
no database — is usable out of the box. Sample rows can be wiped from the admin
panel ("clear samples") before going live.

**Suppliers**: 5 verified suppliers
- BeautySourceKr (OEM) - Seoul
- PackagingInnovators (Packaging) - Busan
- IngredientsKorea (Raw Materials) - Daegu
- KoreanContractMfg (OEM/Contract Mfg) - Incheon
- GreenBeauty Solutions (Clean Beauty) - Seoul

**Articles**: 5 comprehensive articles
- K-Beauty Trends 2026
- EU Cosmetics Regulation Updates for 2026
- Sustainable Packaging in K-Beauty
- MOQ Negotiation Strategies
- Quality Assurance Standards at Korean Manufacturers

**Exhibitions**: 9 trade shows
- Regional: Seoul Beauty Expo, Busan Beauty Expo, K-Beauty Sourcing Summit
- International: Cosmoprof Asia Hong Kong, in-cosmetics Global Paris, Tokyo Beauty World
- Niche: Beauty Ingredients Forum, Natural & Organic Products Expo, Beautyworld Middle East

**Ambassadors**: 4 regional experts
- Sarah Chen (North America)
- Yuki Tanaka (Asia Pacific)
- Marie Dubois (Europe)
- Ahmed Al-Rashid (Middle East)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Framework**: React 18
- **Styling**: Tailwind CSS v4 with custom primary color (RGB 255, 149, 0)
- **Database**: PostgreSQL (Supabase) via Prisma — with an in-memory seed fallback when `DATABASE_URL` is unset
- **File Storage**: Supabase Storage (admin image uploads)
- **Auth**: HMAC-signed admin session cookie (`src/lib/auth.ts`)
- **i18n**: React context + string table (`src/lib/i18n`), Korean/English
- **Forms**: react-hook-form + zod validation
- **Excel/CSV**: exceljs (`src/lib/xlsx.ts`, `src/lib/csv.ts`)
- **API**: Next.js Route Handlers
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js dynamic routes with URL search parameters

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                           # API endpoints
│   │   ├── suppliers/route.ts         # List suppliers with filtering
│   │   ├── suppliers/[id]/route.ts    # Single supplier detail
│   │   ├── suppliers/[id]/exhibitions/route.ts  # Exhibition list for supplier
│   │   ├── ambassadors/route.ts       # List ambassadors
│   │   ├── articles/route.ts          # List articles
│   │   ├── exhibitions/route.ts       # List exhibitions
│   │   └── ...
│   ├── about/page.tsx                 # About page
│   ├── contact/layout.tsx             # Dynamic layout for contact
│   ├── contact/page.tsx               # Contact form (3-step)
│   ├── exhibitions/layout.tsx         # Dynamic layout
│   ├── exhibitions/page.tsx           # Exhibition listing & filtering
│   ├── news/page.tsx                  # News article listing
│   ├── request-matching/layout.tsx    # Dynamic layout
│   ├── request-matching/page.tsx      # Supplier matching form (4-step)
│   ├── sourcing/layout.tsx            # Dynamic layout
│   ├── sourcing/page.tsx              # Sourcing hub with filtering
│   ├── suppliers/[id]/page.tsx        # Supplier detail page (7 tabs)
│   ├── layout.tsx                     # Root layout with Header/Footer
│   └── page.tsx                       # Homepage
├── components/
│   ├── Header.tsx                     # Sticky navigation with mobile menu
│   ├── Footer.tsx                     # Footer with links
│   ├── SupplierCard.tsx               # Reusable supplier card
│   ├── ExhibitionCard.tsx             # Reusable exhibition card
│   └── ArticleCard.tsx                # Reusable article card
├── lib/
│   ├── db.ts                          # Data layer: Prisma (Postgres) with in-memory seed fallback
│   ├── prisma.ts                      # Prisma client singleton
│   ├── auth.ts                        # HMAC-signed admin session helpers
│   ├── mock.ts                        # Seed/sample data + local fallback source
│   ├── csv.ts / xlsx.ts               # CSV/Excel import & export helpers
│   ├── options.ts                     # Shared select/option constants
│   ├── i18n/                          # Language context + KR/EN string table
│   └── types.ts                       # TypeScript type definitions (bilingual BL types)
└── styles/
    └── globals.css                    # Global Tailwind styles

prisma/
├── schema.prisma                      # Single generic Entity table (collection + id + JSON)
└── seed.ts                            # Seeds sample suppliers/articles/exhibitions

src/app/admin/                         # Admin dashboard (page.tsx) + manual (manual/page.tsx)
```

## 🗄️ Data Layer

Persistence goes through `src/lib/db.ts`, which exposes a generic per-collection API
(`listAll`, `getOne`, `insertOne`, `patchOne`, `upsertOne`, `removeOne`). All
collections (`supplier`, `article`, `exhibition`, `inquiry`, `matchingRequest`,
`member`, `setting`) are stored as JSON rows in one `Entity` table
(`prisma/schema.prisma`); filtering happens in the API layer since the dataset is small.

- If `DATABASE_URL` is set → Postgres via Prisma.
- If not (local dev with no DB) → an in-memory store seeded from `src/lib/mock.ts`, so
  the site runs with zero setup.

## 🔌 API Endpoints

All endpoints return JSON responses with pagination support where applicable.
Write methods (`POST`/`PUT`/`PATCH`/`DELETE`) require a valid admin session cookie.

### Suppliers
- `GET /api/suppliers` - List suppliers with filters (category, region, products, search, pagination)
- `POST` / `PUT` / `DELETE /api/suppliers` - Create / update / delete (admin)
- `GET /api/suppliers/[id]` - Get single supplier detail
- `GET /api/suppliers/[id]/exhibitions` - Get exhibitions for a supplier

### Articles & News
- `GET /api/articles` - List articles with filters (category, region, headline, search)
- `POST` / `PUT` / `DELETE /api/articles` - Create / update / delete (admin)
- `GET /api/articles/[slug]` - Get single article detail
- `GET /api/articles/[slug]/related-suppliers` - Get related suppliers for article

### Exhibitions
- `GET /api/exhibitions` - List exhibitions with filters (status, region)
- `POST` / `PUT` / `DELETE /api/exhibitions` - Create / update / delete (admin)

### Leads (inquiries / matching / members)
- `POST /api/inquiries` - Submit an inquiry *(currently closed → 403)*; `GET` / `PATCH` status (admin)
- `POST /api/matching-requests` - Submit a matching request *(currently closed → 403)*; `GET` / `PATCH` status (admin)
- `POST /api/register` - Member sign-up (open); `GET` list (admin)

### Admin & Utilities
- `POST` / `DELETE /api/admin-auth` - Admin login / logout
- `DELETE /api/admin/clear-samples` - Remove all sample-flagged rows (admin)
- `GET` / `POST /api/settings` - Read (public) / update (admin) site settings
- `POST /api/upload` - Upload an image to Supabase Storage (admin)
- `POST /api/parse-sheet` / `GET /api/template` - Excel/CSV import parsing & template download (admin)
- `GET /api/ambassadors` - List all ambassadors (static)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- (Optional) A PostgreSQL/Supabase database — omit `DATABASE_URL` to run on the seed fallback

### Installation

```bash
# Navigate to the project directory
cd MYNEWSITE

# Install dependencies (postinstall runs `prisma generate`)
npm install

# Configure environment
cp .env.example .env
# then fill in DATABASE_URL / DIRECT_URL, ADMIN_ID / ADMIN_PW, SESSION_SECRET,
# and (for image upload) the SUPABASE_* values
```

### Database setup (only when using a real database)

```bash
# Push the Prisma schema to the database
npm run db:push

# Seed sample data
npm run db:seed
```

### Development

```bash
# Start development server
npm run dev

# Server will run at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

## 📝 Key Features Explained

### Supplier Filtering
- **Category Filter**: OEM, Packaging, Ingredients, Contract Manufacturing, Equipment
- **Region Filter**: Korea, Asia, Europe, Middle East
- **Search**: Full-text search across supplier names, descriptions, and capabilities

### Supplier Detail Page
- Tab 1: **Overview** - Company info, description, certifications, core strengths
- Tab 2: **Capabilities** - Product types and services offered
- Tab 3: **Certifications** - Quality and regulatory certifications
- Tab 4: **Export Markets** - Countries and regions where supplier exports
- Tab 5: **MOQ** - Minimum order quantities and lead times
- Tab 6: **Exhibitions** - Upcoming trade shows with participation
- Tab 7: **Files** - Downloadable documents (catalogs, certifications, pricing)

### Supplier Matching (4-Step Form)
1. **Step 1**: Inquiry type, product category, target markets
2. **Step 2**: Quantity, timeline, budget
3. **Step 3**: Company and contact information
4. **Step 4**: Review and submit with request ID generation

### News & Articles
- 5 curated articles covering industry topics
- Category and region filtering
- Author and publish date information
- Related supplier links

### Exhibitions
- 9 upcoming and past trade shows
- Supplier participation information
- Date, location, and exhibition details
- Filter by status (upcoming/past) and region

## 🎨 Design System

### Colors
- **Primary**: RGB(255, 149, 0) - Orange
- **Background**: White
- **Text**: Dark gray/black
- **Borders**: Light gray (#e5e7eb)

### Components
- Responsive grid layouts (1 col mobile, 2-3 cols desktop)
- Hover effects on cards and links
- Smooth transitions and animations
- Mobile-friendly hamburger menu

### Typography
- **Headings**: Bold, large sizes (h1: 2.25rem, h2: 1.875rem)
- **Body**: Regular weight, readable line height
- **Labels**: Small font size with semibold weight

## 🔧 Configuration

### Dynamic Routes
Pages with user interaction (forms, filters) or live data are configured as
`force-dynamic` to prevent caching:
- `/contact`
- `/exhibitions`
- `/request-matching`
- `/sourcing`
- `/admin`

### Next.js Settings
- App Router enabled
- TypeScript strict mode
- Tailwind CSS v4
- Images use plain `<img>` tags (the Next.js image optimizer is not used, so no
  `images.domains` config is required)

## 📚 Data Models

### Supplier
```typescript
{
  id: string
  name: string
  supplierType: string
  category: 'OEM' | 'Packaging' | 'Ingredients' | 'Contract Manufacturing'
  image: string
  location: string
  country: string
  verified: boolean
  ambassadorPick: boolean
  certifications: string[]
  moq: number
  leadTime: number
  capabilities: string[]
  exportMarkets: string[]
  files: File[]
  exhibitionIds: string[]
  ... and more
}
```

### Article
```typescript
{
  id: string
  slug: string
  title: string
  summary: string
  category: string
  region: string
  publishedAt: string
  image: string
  author: string
  contentBlocks: ContentBlock[]
  relatedSuppliers: string[]
}
```

### Exhibition
```typescript
{
  id: string
  title: string
  dateRange: string
  location: string
  region: string
  status: 'upcoming' | 'past'
  description: string
  supplierIds: string[]
}
```

## 🔄 Data Flow

1. **User navigates** → Page loads
2. **Page renders** → Component mounts
3. **useEffect hook** → Fetches data from `/api/*`
4. **API route** → Reads from Postgres via `src/lib/db.ts` (or the seed fallback) and filters by query params
5. **State updates** → Components re-render with data
6. **User interactions** → Forms submit (persisted to the database), filters update URL params
7. **useSearchParams()** → URL query params update page

## 🚨 Known Issues & Limitations

- Ambassadors are still served from static data (`src/lib/mock.ts`); no admin CRUD for them
- Contact and matching-request submissions are intentionally closed (UI notice + `403` from the API); flip `SUBMISSIONS_CLOSED` in the respective routes to reopen
- Data is stored as JSON in a single generic `Entity` table — fine at the current scale, but not indexed per-field (see "future enhancements")
- No email notifications for inquiries/registrations

## 🎯 Future Enhancements

1. **Data model**
   - Migrate the single JSON `Entity` table to typed Prisma models with per-field indexes and foreign keys (once past MVP scale)
   - Database-level filtering/pagination instead of in-memory

2. **Advanced Features**
   - Ambassador management in the admin panel
   - Supplier ratings and reviews
   - Advanced search with saved searches
   - Email notifications for new leads/members

3. **Performance**
   - Lazy loading and API response caching

4. **UX Improvements**
   - Dark mode
   - Saved favorites/bookmarks
   - Detailed analytics

## ✅ Already Implemented

Backend integration (Postgres/Prisma), real form persistence, admin authentication,
an admin dashboard (supplier/article/exhibition CRUD, lead & member views, settings),
real image uploads (Supabase Storage), Excel/CSV import & export, and KR/EN
multi-language support are all in place.

## 📧 Support

For issues, questions, or suggestions, please contact the development team.

## 📄 License

This project is proprietary and confidential.

---

**Last Updated**: July 5, 2026
**Version**: 1.1.0
**Status**: Beta — pre-launch
