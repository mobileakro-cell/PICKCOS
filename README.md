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
- **News & Insights** - 5+ articles covering K-Beauty trends, regulations, sustainability, sourcing tips, and quality assurance
- **Trade Exhibitions** - 9 upcoming and past beauty trade shows where suppliers participate
- **Supplier Matching** - 4-step form to get matched with suppliers based on specific requirements
- **Contact Form** - 3-step inquiry form with category and market selection
- **About Page** - Company mission, vision, supplier curation process, ambassador showcase, and values
- **Responsive Design** - Mobile-first responsive design with hamburger menu for mobile
- **Global Navigation** - Persistent header (sticky) and footer across all pages

## 📊 Mock Data

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
- **Forms**: react-hook-form + zod validation
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
│   ├── mock.ts                        # Mock data (suppliers, articles, exhibitions, ambassadors)
│   ├── types.ts                       # TypeScript type definitions
│   └── utils.ts                       # Utility functions (if any)
└── styles/
    └── globals.css                    # Global Tailwind styles
```

## 🔌 API Endpoints

All endpoints return JSON responses with pagination support where applicable.

### Suppliers
- `GET /api/suppliers` - List suppliers with filters (category, region, search, pagination)
- `GET /api/suppliers/[id]` - Get single supplier detail
- `GET /api/suppliers/[id]/exhibitions` - Get exhibitions for a supplier

### Articles & News
- `GET /api/articles` - List articles with filters (category, region, search)
- `GET /api/articles/[slug]` - Get single article detail
- `GET /api/articles/[slug]/related-suppliers` - Get related suppliers for article

### Exhibitions
- `GET /api/exhibitions` - List exhibitions with filters (status, region)

### Other
- `GET /api/ambassadors` - List all ambassadors

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone or navigate to project directory
cd website_0131

# Install dependencies
npm install

# Install required packages (if not already installed)
npm install @hookform/resolvers react-hook-form zod
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
Pages with user interaction (forms, filters) are configured as `force-dynamic` to prevent caching:
- `/contact`
- `/exhibitions`
- `/request-matching`
- `/sourcing`

### Next.js Settings
- App Router enabled
- TypeScript strict mode
- Tailwind CSS v4
- Image optimization enabled

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
4. **API route** → Filters mock data based on query params
5. **State updates** → Components re-render with data
6. **User interactions** → Forms submit, filters update URL params
7. **useSearchParams()** → URL query params update page

## 🚨 Known Issues & Limitations

- Mock data is hardcoded (no database)
- Form submissions are logged to console only
- File downloads link to Placeholder API
- Exhibition booth assignments are limited
- No user authentication/authorization
- No email notifications for inquiries

## 🎯 Future Enhancements

1. **Backend Integration**
   - Connect to real database (MongoDB, PostgreSQL)
   - Implement actual form submission and data storage
   - User authentication and accounts

2. **Advanced Features**
   - Supplier ratings and reviews
   - Inquiry tracking dashboard
   - Advanced search with saved searches
   - Real file uploads
   - Email notifications
   - Admin dashboard for supplier management

3. **Performance**
   - Image optimization and lazy loading
   - API response caching
   - Database indexing

4. **UX Improvements**
   - Multi-language support
   - Dark mode
   - Advanced filters with more options
   - Saved favorites/bookmarks
   - Detailed analytics

## 📧 Support

For issues, questions, or suggestions, please contact the development team.

## 📄 License

This project is proprietary and confidential.

---

**Last Updated**: January 31, 2025
**Version**: 1.0.0
**Status**: Development/Beta
