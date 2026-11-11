# Comprehensive End-to-End Audit Report: Homa Module
## Admin Panel ↔ Backend ↔ Database ↔ Public Frontend

**Audit Date:** November 5, 2026  
**Auditor:** Antigravity Autonomous Coding Agent  
**Audit Scope:** Entire Homa Module (Admin Frontend, Express Backend, PostgreSQL Database, Public Frontend, Booking Engine)  
**Execution Mode:** STRICT READ-ONLY AUDIT (Zero source code, database, migration, or seed modifications)  

---

## 1. Executive Summary

A comprehensive, end-to-end technical and functional audit of the Vedic Homa ceremony module was conducted across all four application tiers:
1. **Admin Panel** (`admin-veda-structure`)
2. **Backend Services & APIs** (`backend`)
3. **Database & Models** (`PostgreSQL via Sequelize`)
4. **Public Devotee Frontend** (`frontend-user1`)

### Key Finding:
The backend architecture, database schemas, Admin CRUD APIs, and booking pricing engine are **exceptionally robust and logically sound**, with **402 out of 402 automated unit and integration tests passing (100% pass rate)**. 

However, a strict code-level, database, and payload analysis revealed that **the public frontend is currently disconnected from several key fields configured in the Admin Panel**. While source-level tests pass because they verify UI layout components, the devotee frontend does not render Admin-configured FAQs, custom Samagri items, or Prasad descriptions; it relies on hardcoded fallbacks for related services, and contains asset resolution flaws that produce 404 network errors for seeded database images.

### High-Level Status Summary

| Area | Status | Key Evidence / Observations |
| :--- | :---: | :--- |
| **Admin CRUD** | **PASS** | Full create, update, list, filter, and soft deactivation tested via live API. 30/30 backend & 44/44 admin tests pass. |
| **Backend Validation** | **PASS** | Strict validations on UUIDs, slugs, Havan counts, days, pandit hierarchy, pricing, and Havan-day coupling. |
| **Database Persistence** | **PASS** | All 8 Homa services and 8 categories persist cleanly in PostgreSQL with foreign keys and JSONB fields. |
| **Public API** | **PASS** | `GET /api/homa-services`, `GET /api/homa-services/:slug`, `GET /api/homa-categories` serialize records accurately. |
| **Frontend Dynamic Rendering** | **PARTIAL** | Hero, title, category, starting Dakshina, 2×2 specs, and availability badges are dynamic. FAQs and Prasad are missing. |
| **Image & Gallery Mapping** | **FAIL** | Seeded database paths (`/assets/*.jpg`) fail with 404s. Admin gallery uploads with 1 image are ignored. |
| **Pricing Consistency** | **PASS** | Authoritative calculation (`basePrice + (havans-1)*perHavan + (days-1)*perDay`). Client cannot spoof totals. |
| **Samagri / Prasad Mapping** | **FAIL** | `HomaSamagriSection` uses a 10-item hardcoded list; custom admin items do not render. Prasad is never rendered. |
| **Booking Integration** | **PASS** | Routes to `/yagya-puja/homa/:slug/book`, loads `HomaSinglePageBooking`, recalculates on backend, creates `VEDA-HOMA-XXXXXXXX`. |
| **All Homa Services** | **PASS** | All 8 services (`rudra-homa`, `maha-mrityunjaya-homa`, `navagraha-homa`, `lakshmi-kubera-homa`, `durga-chandi-homa`, `vastu-shanti-homa`, `ganapati-homa`, `ayushya-homa`) exist and route cleanly. |

---

## 2. Architecture and File Mapping

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             ADMIN PANEL (React + TS)                             │
│  - HomaServiceForm.tsx (Create / Edit Form)                                      │
│  - HomaServices.tsx (Catalogue Table & Filter)                                   │
│  - HomaServiceDetail.tsx (Admin Detail Inspector)                                │
│  - HomaCategoryForm.tsx / HomaCategories.tsx (Category Management)               │
│  - homaServiceCatalogueService.ts / homaCategoryAdminService.ts (API Clients)    │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTP JSON / JWT Bearer
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js Express)                           │
│  - homaServiceAdmin.routes.js / homaCategoryAdmin.routes.js (Protected Routes)   │
│  - homaService.routes.js / homaCategory.routes.js (Public Routes)                │
│  - homaServiceAdmin.controller.js / homaService.controller.js (Controllers)     │
│  - homaService.serializer.js (Data Shaping & Sanitization)                       │
│  - ritualPricing.service.js (Authoritative Homa Price Calculation)               │
│  - ritualBooking.controller.js (Order Placement & Status Tracking)               │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Sequelize ORM (pg)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             DATABASE (PostgreSQL)                                │
│  - Table: homa_services (UUID pk, slug, name, pricing, JSONB counts, samagri)   │
│  - Table: homa_categories (UUID pk, slug, name, icon_name, display_order)        │
│  - Table: homa_purposes (UUID pk, slug, name, display_order)                     │
│  - Table: ritual_bookings (UUID pk, booking_reference, service_type='HOMA')      │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Public JSON APIs
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            PUBLIC FRONTEND (Vite + React)                        │
│  - HomaCatalogueListing.jsx (Landing Page: 8 approved sections)                  │
│  - HomaCategoryListing.jsx / HomaCategoryView.jsx (Category Showcase)           │
│  - HomaServiceDetails.jsx (Design C Hero + Specifications + Floating Card)       │
│  - HomaSamagriSection.jsx (Samagri Inclusions Section)                           │
│  - RitualBookingWizard.jsx / HomaSinglePageBooking.jsx (Booking Wizard)          │
│  - homaCatalogueService.js (API Normalizer & Curated Visual Asset Fallback)      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Exact Source File Locations:

#### Admin Panel (`admin-veda-structure/`)
- `src/pages/HomaServices.tsx`: Admin listing table with search, category filter, active toggle, sort, and pagination.
- `src/pages/HomaServiceForm.tsx`: Service create/edit form handling all 28 service parameters.
- `src/pages/HomaServiceDetail.tsx`: Admin detail review view.
- `src/pages/HomaCategories.tsx` & `HomaCategoryForm.tsx`: Category CRUD interfaces.
- `src/services/homaServiceCatalogueService.ts`: Admin API service client for Homa services.
- `src/services/homaCategoryAdminService.ts`: Admin API service client for Homa categories.
- `src/services/mediaUploadService.ts`: Cloudinary image uploader.

#### Backend (`backend/`)
- `src/routes/homaServiceAdmin.routes.js`: Protected admin endpoints (`/api/admin/homa-services/*`).
- `src/routes/homaService.routes.js`: Public endpoints (`/api/homa-services/*`).
- `src/controllers/homaServiceAdmin.controller.js`: Validation, business rules, and DB persistence.
- `src/controllers/homaService.controller.js`: Public querying, filtering, search, and pagination.
- `src/models/homaServiceModel.js`: Sequelize model for `homa_services`.
- `src/models/homaCategoryModel.js`: Sequelize model for `homa_categories`.
- `src/serializers/homaService.serializer.js`: Public and admin serialization transformers.
- `src/services/ritualPricing.service.js`: Function `calculateHomaPriceInternal()`.
- `src/controllers/ritualBooking.controller.js`: Homa reservation and booking handler.

#### Public Frontend (`frontend-user1/`)
- `src/features/yagyaPuja/pages/HomaServiceDetails.jsx`: Ceremony detail page (Design C Hero 55/45 split).
- `src/features/yagyaPuja/pages/HomaCategoryListing.jsx`: Dynamic category landing router.
- `src/features/yagyaPuja/components/HomaCategoryView.jsx`: Universal 5-section category layout.
- `src/features/yagyaPuja/pages/HomaCatalogueListing.jsx`: Main Homa landing page.
- `src/features/yagyaPuja/components/HomaSamagriSection.jsx`: Sacred Samagri display component.
- `src/features/yagyaPuja/components/booking/HomaSinglePageBooking.jsx`: Single-page booking checkout wizard.
- `src/services/homaCatalogueService.js`: Frontend API consumer, fallback image resolver, and UI normalizer.
- `src/features/yagyaPuja/data/homaCatalogueData.js`: Static fallback catalogue and purpose categories.
- `src/features/yagyaPuja/data/homaCategoryConfig.js`: Static category presentation templates.

---

## 3. Admin Field ↔ Backend ↔ Database ↔ Frontend Mapping Matrix

| Field Description | Admin Form Key | Backend Request Key | Database Column | Public Serializer Key | Frontend UI Key | Rendered Component | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Service Name** | `form.name` | `name` | `name` (VARCHAR 200) | `name` | `service.name` | `HomaServiceDetails` (`h1`) | **PASS** |
| **Slug** | `form.slug` | `slug` | `slug` (VARCHAR 150) | `slug` | `service.slug` | Route & Navigation URLs | **PASS** |
| **Homa Type** | `form.homaType` | `homaType` | `homa_type` (VARCHAR 100) | `homaType` | `service.homaType` | Tagline fallback / Badges | **PASS** |
| **Tagline** | *Missing in Admin* | *Not sent* | *None* | *None* | `service.tagline` | Hero Italic Tagline | **PARTIAL** (Falls back to `homaType`) |
| **Short Description** | `form.shortDescription` | `shortDescription` | `short_description` (TEXT) | `shortDescription` | `service.shortDescription` | Hero Description (`p`) | **PASS** |
| **Full Description** | `form.description` | `description` | `description` (TEXT) | `description` | `service.description` | Hero Description fallback | **PARTIAL** (No dedicated section) |
| **Category ID** | `form.categoryId` | `categoryId` | `category_id` (UUID) | `categoryId` | `service.categoryId` | Category filter & pills | **PASS** |
| **Category Object** | Dropdown select | Derived via JOIN | Relation `belongsTo` | `category: {id, name, slug}` | `service.category` | Category Eyebrow Pill | **PASS** |
| **Havan Counts** | `form.availableHavanCounts` | `availableHavanCounts` | `available_havan_counts` (JSONB) | `availableHavanCounts` | `service.availableHavanCounts` | 2x2 Specs Grid & Booking | **PASS** |
| **Available Days** | `form.availableDays` | `availableDays` | `available_days` (JSONB) | `availableDays` | `service.availableDays` | 2x2 Specs Grid & Booking | **PASS** |
| **Minimum Pandits** | `form.minimumPandits` | `minimumPandits` | `minimum_pandits` (INT) | `minimumPandits` | `service.minimumPandits` | 2x2 Specs & Booking | **PASS** |
| **Recommended Pandits**| `form.recommendedPandits` | `recommendedPandits` | `recommended_pandits` (INT) | `recommendedPandits` | `service.recommendedPandits`| Booking default selection | **PASS** |
| **Maximum Pandits** | `form.maximumPandits` | `maximumPandits` | `maximum_pandits` (INT) | `maximumPandits` | `service.maximumPandits` | 2x2 Specs (`{min}–{max}`) | **PASS** |
| **Daily Hours** | `form.dailyHours` | `dailyHours` | `daily_hours` (VARCHAR 100) | `dailyHours` | `service.dailyHours` | 2x2 Specs Grid (`Clock`) | **PASS** |
| **Havan Capacity/Pandit**| `form.havanCapacityPerPandit`| `havanCapacityPerPandit`| `havan_capacity_per_pandit` (VARCHAR)| `havanCapacityPerPandit` | `service.havanCapacityPerPandit`| Pandit qualifications card | **PASS** |
| **Base Price** | `form.basePrice` | `basePrice` | `base_price` (DECIMAL 10,2) | `basePrice` | `service.basePrice` | Price breakdown engine | **PASS** |
| **Per Havan Price** | `form.perHavanPrice` | `perHavanPrice` | `per_havan_price` (DECIMAL 10,2)| `perHavanPrice` | `service.perHavanPrice` | Price breakdown engine | **PASS** |
| **Per Day Price** | `form.perDayPrice` | `perDayPrice` | `per_day_price` (DECIMAL 10,2) | `perDayPrice` | `service.perDayPrice` | Price breakdown engine | **PASS** |
| **Starting Dakshina** | Auto-synced (`basePrice`)| Synced on backend | `starting_price` (DECIMAL 10,2)| `startingPrice` & `formattedPrice` | `service.startingPrice` | Floating Booking Card | **PASS** |
| **Kashi Availability** | `form.isKashiAvailable` | `isKashiAvailable` | `is_kashi_available` (BOOLEAN) | `isKashiAvailable` | `service.isKashiAvailable` | Hero Location Badge | **PASS** |
| **Remote Availability**| `form.isRemoteAvailable` | `isRemoteAvailable` | `is_remote_available` (BOOLEAN)| `isRemoteAvailable` | `service.isRemoteAvailable`| Hero Location Badge | **PASS** |
| **Available Locations**| Derived array | `availableLocations` | `available_locations` (JSONB) | `availableLocations` | `service.availableLocations`| Booking StepLocation | **PASS** |
| **Active Status** | `form.isActive` | `isActive` | `is_active` (BOOLEAN) | `isActive` | `service.isActive` | Public visibility filter | **PASS** |
| **Featured Status** | `form.isFeatured` | `isFeatured` | `is_featured` (BOOLEAN) | `isFeatured` | `service.isFeatured` | Showcase sort & badge | **PASS** |
| **Banner Image** | `form.bannerImage` | `bannerImage` | `banner_image` (VARCHAR 500) | `bannerImage` & `image` | `service.bannerImage` | Hero Gallery Main View | **FAIL** (Seed broken paths) |
| **Gallery Images** | `form.galleryImages` | `galleryImages` | `gallery_images` (JSONB) | `galleryImages` & `gallery` | `service.gallery` | Supporting Thumbnails | **FAIL** (1-image override bug)|
| **Samagri Items** | `form.samagri` | `samagri` | `samagri` (JSONB) | `samagri` | `service.samagri` | `HomaSamagriSection` | **FAIL** (Custom items ignored)|
| **Prasad Details** | `form.prasad` | `prasad` | `prasad` (TEXT) | `prasad` | `service.prasad` | *Not Rendered Anywhere* | **FAIL** (Omitted in UI) |
| **Service FAQs** | `form.faqs` | `faqs` | `faqs` (JSONB) | `faqs` & `faq` | `service.faqs` | *Not Rendered Anywhere* | **FAIL** (Omitted in UI) |
| **Sankalpa Fields** | `form.sankalpaFields` | `sankalpaFields` | `sankalpa_fields` (JSONB) | `sankalpaFields` | `service.sankalpaFields` | Booking Wizard StepSankalp| **PASS** |
| **SEO Title/Desc** | `form.seo` | `seo` | `seo` (JSONB) | `seo` | `service.seo` | `PublicSEO` -> `<title>, <meta>`| **PASS** |

---

## 4. Backend API & Endpoint Audit

### Endpoints Inspected & Tested:

#### 1. Public Service Listing: `GET /api/homa-services`
- **Controller:** `homaService.controller.js` -> `getPublicHomaServices`
- **Supported Query Parameters:** `search`, `category`, `purpose`, `count`, `havanCount`, `days`, `mode`, `location`, `isFeatured`, `featured`, `sortBy`, `page`, `limit`
- **Active Filtering:** Enforces `where: { isActive: true }`. Inactive services are never exposed.
- **Sorting Options:** Deterministic ordering supporting `price-asc`, `price-desc`, `name-asc`, `name-desc`, `featured`.
- **Response Structure:** `{ success: true, count, total, totalPages, currentPage, data: [...] }`
- **Runtime Verdict:** **PASS** (100% verified via automated integration suites).

#### 2. Public Service Detail: `GET /api/homa-services/:slug`
- **Controller:** `homaService.controller.js` -> `getPublicHomaServiceBySlug`
- **Security:** Public read-only.
- **Error Handling:** Returns `HTTP 404` with `{ success: false, message: "Homa service not found: '...' " }` for non-existent or inactive services.
- **Relationships Included:** Joined with `HomaPurpose` (`purposeDetails`) and `HomaCategory` (`categoryDetails`).
- **Runtime Verdict:** **PASS**.

#### 3. Public Categories: `GET /api/homa-categories`
- **Controller:** `homaCategory.controller.js` -> `getPublicHomaCategories`
- **Filtering:** Returns only `isActive: true` records, ordered by `display_order ASC`.
- **Runtime Verdict:** **PASS**.

#### 4. Admin Service Management: `POST /api/admin/homa-services`, `PUT /api/admin/homa-services/:id`, `DELETE /api/admin/homa-services/:id`
- **Authentication & Authorization:** Enforces JWT `authenticate` and `authorizeAdmin` middleware. Returns `401 Unauthorized` without token, and `403 Forbidden` for regular users.
- **Havan/Day Coupling Enforcement:** Strict business rule: `1 Havan` cannot span multiple days (`availableHavanCounts: [1], availableDays: [2, 3]` returns `HTTP 400 Bad Request`).
- **Pandit Hierarchy Enforcement:** Requires `1 <= minimumPandits <= recommendedPandits <= maximumPandits`.
- **Deactivation Handling:** Soft delete sets `isActive: false`. Service remains accessible to Admin for editing/reactivation, but is immediately purged from the public catalogue.
- **Runtime Verdict:** **PASS** (30/30 test cases passed in `test_phase_h5_homa_admin_crud.cjs`).

#### 5. Pricing Engine: `POST /api/ritual-bookings/calculate-price`
- **Service:** `ritualPricing.service.js` -> `calculateHomaPriceInternal`
- **Formula:** `Total = basePrice + (numHavans - 1) * perHavanPrice + (numDays - 1) * perDayPrice`
- **Security:** Completely server-side. Ignores any client-submitted totals.
- **Runtime Verdict:** **PASS** (25/25 test cases passed in `test_phase_h3_homa_pricing_booking.cjs`).

---

## 5. Service-by-Service Verification Table

An inspection of all 8 database records retrieved from PostgreSQL was cross-referenced with the public frontend:

| # | Slug | Service Name | DB Category | Starting Price | Havan Counts | Available Days | Pandit Scale | DB Banner Image | UI Rendered Image | Issues / Observations |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| 1 | `rudra-homa` | Rudra Homa (Shri Rudram Fire Ritual) | Shiva & Rudra Homa | ₹12,500 | 1, 3, 5, 11 | 1, 2, 3 | 2–11 | `/assets/puja-rudrabhishek.jpg` | Bundled `pujaRudrabhishekImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 2 | `maha-mrityunjaya-homa` | Maha Mrityunjaya Homa | Shiva & Rudra Homa | ₹11,000 | 1, 3, 5, 7, 11 | 1, 2, 3 | 2–11 | `/assets/puja-mrityunjaya.jpg` | Bundled `pujaMrityunjayaImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 3 | `navagraha-homa` | Navagraha Homa | Navagraha Planetary Homa | ₹9,500 | 1, 3, 5 | 1, 2 | 2–9 | `/assets/puja-navagraha.jpg` | Bundled `navagrahaRitualShowcaseImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 4 | `lakshmi-kubera-homa` | Maha Lakshmi & Kubera Homa | Lakshmi & Kubera Homa | ₹10,500 | 1, 3, 5 | 1, 2 | 2–7 | `/assets/puja-lakshmi.jpg` | Bundled `pujaLakshmiImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 5 | `durga-chandi-homa` | Durga Homa (Chandi Homa) | Durga & Chandi Homa | ₹15,000 | 1, 3, 5, 9 | 1, 2, 3 | 3–11 | `/assets/puja-lakshmi.jpg` | Bundled `deviDurgaImg` | **DB seed borrows Lakshmi image; UI overrides with Durga visual** |
| 6 | `vastu-shanti-homa` | Vastu Shanti Homa | Vastu & Griha Homa | ₹8,500 | 1, 3 | 1 | 2–5 | `/assets/c-vastu.jpg` | Bundled `vastuImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 7 | `ganapati-homa` | Maha Ganapati Homa | Ganapati Homa | ₹7,500 | 1, 3 | 1 | 2–5 | `/assets/puja-ganesh.jpg` | Bundled `pujaGaneshImg` | **DB seed path unresolvable (404 flash before error fallback)** |
| 8 | `ayushya-homa` | Ayushya Homa (Longevity Fire Ritual) | Ayushya & Longevity Homa | ₹8,000 | 1, 3 | 1 | 2–4 | `https://res.cloudinary.com/...` | Cloudinary Image URL | **Working Cleanly: Valid CDN URLs resolve without error** |

---

## 6. Image and Media Audit

### Finding 6.1: Database Unhashed Relative Paths Cause 404s
- **Current State:** Services 1 through 7 have `bannerImage` and `galleryImages` seeded as relative URLs (e.g. `"/assets/puja-rudrabhishek.jpg"`, `"/assets/p-samagri.jpg"`).
- **The Problem:** In Vite, static assets are bundled with content hashes (e.g., `dist/assets/puja-rudrabhishek-D4zzZ_aI.jpg`). There is no public `/assets/` directory on the server.
- **The Bug in `isUnresolvableAsset`:**
  ```javascript
  const isUnresolvableAsset = (url) => {
    if (!url || typeof url !== "string") return true;
    if (url.startsWith("/assets/") && !url.includes("-")) return true;
    return false;
  };
  ```
  Because filenames like `puja-rudrabhishek.jpg`, `p-samagri.jpg`, and `p-rudraksha.jpg` contain a hyphen (`-`), the check `!url.includes("-")` evaluates to `false`!
  As a result, `isUnresolvableAsset` returns `false` (falsely assuming the URL is valid). The browser issues an HTTP request to `http://localhost:5173/assets/puja-rudrabhishek.jpg`, receives a **404 Not Found**, triggers the `onError` handler, and only then updates state to the bundled fallback image.
- **Impact:** Devotee experiences an image flickering flash, network error logging in the console, and slower initial render.

### Finding 6.2: Gallery Fallback Overwrite (Single Image Upload Bug)
- **Current State:**
  ```javascript
  const cleanGallery = rawGallery
    .filter((img) => !isUnresolvableAsset(img))
    .filter(Boolean);

  const curatedGallery = getHomaServiceGallery(item.slug, primaryImage);
  const gallery = cleanGallery.length >= 2 ? cleanGallery : curatedGallery;
  ```
- **The Problem:** If an Administrator uploads a single custom gallery image in the Admin Panel (`galleryImages: ["https://res.cloudinary.com/.../altar.jpg"]`), `cleanGallery.length` is 1. Because it is less than 2, the frontend throws away the Admin's uploaded photo and substitutes the hardcoded `curatedGallery`!
- **Impact:** An administrator's uploaded image will never appear on the service detail page unless they upload 2 or more images.

---

## 7. Pricing Consistency Audit

### Starting Dakshina Synchronization
- **Admin Configuration:** Administrator sets `basePrice` (e.g. ₹11,000 for Maha Mrityunjaya Homa).
- **Backend Synchronization:** In `homaServiceAdmin.controller.js`:
  ```javascript
  const resolvedBasePrice = Number(basePrice);
  const resolvedStartingPrice = resolvedBasePrice; // startingPrice automatically matches basePrice
  ```
- **Public API:** Returns `startingPrice: 11000` and `formattedPrice: "₹11,000"`.
- **Frontend Display:** `HomaServiceDetails.jsx` displays `formatIndianCurrency(startingPrice)` (₹11,000) under the `STARTING DAKSHINA` eyebrow.
- **Booking Initial Price:** When navigating to `/yagya-puja/homa/:slug/book`, the wizard initializes with `1 Havan` and `1 Day`, calculating exactly `₹11,000`.
- **Incremental Add-ons:** Selecting `3 Havans` and `1 Day` adds `(3 - 1) * perHavanPrice` (2 * ₹4,000 = ₹8,000), yielding `₹19,000`. Selecting `5 Havans` and `2 Days` yields `₹30,500`.
- **Verdict:** **PERFECT 100% PRICING CONSISTENCY**.

---

## 8. Samagri and Prasad Consistency Audit

### Finding 8.1: Service Samagri is Masked by Hardcoded Editorial Cards
- In the Admin Panel, administrators have a granular Samagri editor and a Bulk Samagri modal to input items (e.g., "Navagraha Samidha Set", "Bilva Leaves", "Ghee").
- In `HomaServiceDetails.jsx`, the page renders `<HomaSamagriSection service={service} />`.
- Inside `HomaSamagriSection.jsx`, the component defines a static, hardcoded list of 10 items (Desi Cow Ghrita, Vedic Samidha Wood, Shastric Havan Samagri, Dhanya & Akshata, Pushpa & Bilva, Special Ahuti, Herbal Decoctions, Purnahuti Coconut, Panchamrit, Copper Agni Kund).
- It only uses `service.samagri` to fuzzy-match item names for status badges ("Included", "Optional", "Additional", "Not Required").
- **Impact:** Any custom or ceremony-specific Samagri item created in Admin that does not match one of those 10 hardcoded names is completely omitted from the service detail page!

### Finding 8.2: Service Prasad is Never Displayed
- In `HomaServiceForm.tsx`, administrators can enter a detailed Prasad description (e.g., "Consecrated Homa Bhasma, blessed Raksha Sutra, and energized Prasad token").
- The database stores this in `homa_services.prasad` (TEXT).
- The backend serializer outputs `prasad: service.prasad`.
- The frontend normalizer maps it to `service.prasad`.
- **However, `HomaServiceDetails.jsx` contains NO Prasad section or field rendering anywhere.**
- In `HomaCategoryView.jsx`, the "Dispatched Prasad" card renders a hardcoded static string rather than `primaryService.prasad`.
- **Impact:** Devotees are unable to see the specific blessed Prasad inclusions configured by the administrator for that ceremony.

---

## 9. Booking Integration Audit

### Data Handoff and Security Flow:
1. **CTA Trigger:** On `/yagya-puja/homa/:slug`, clicking `BOOK HOMA CEREMONY` executes:
   ```javascript
   navigate(`/yagya-puja/homa/${service.slug}/book`);
   ```
2. **Wizard Resolution:** `AppRoutes.jsx` routes `/yagya-puja/homa/:slug/book` to `<RitualBookingWizard serviceType="HOMA" />`.
3. **Component Activation:** `RitualBookingWizard` identifies `serviceType === "HOMA"` and mounts `<HomaSinglePageBooking />`.
4. **Parameters Passed:**
   - `serviceId`: Validated against DB UUID.
   - `serviceSlug`: Canonical slug.
   - `havanCount`: Constrained to `service.availableHavanCounts` (e.g. `[1, 3, 5, 7, 11]`).
   - `days`: Constrained to `service.availableDays` (e.g. `[1, 2, 3]`).
   - `panditCount`: Constrained to `[service.minimumPandits, service.maximumPandits]`.
5. **Coupling Rule Safety:** If a user selects 1 Havan, multi-day options are disabled in the UI. If a malformed payload is submitted directly to the API, backend throws `HTTP 400 Bad Request` ("A single Havan must be completed in 1 day").
6. **Reference Generation:** Post-payment/checkout creates a unique reference matching `VEDA-HOMA-XXXXXXXX`.
7. **Verdict:** **PASS**. Clean, secure, and resilient.

---

## 10. Automated & Runtime Test Summary

During this audit, all available test suites across the repository were executed:

| Test Suite | Tier | Tests Run | Passed | Failed | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `test_phase_h5_homa_admin_crud.cjs` | Backend Admin API | 30 | 30 | 0 | **PASS** |
| `test_phase_h3_homa_pricing_booking.cjs` | Backend Pricing & Booking | 25 | 25 | 0 | **PASS** |
| `test_phase_1_homa_category.cjs` | Backend Category Schema | 42 | 42 | 0 | **PASS** |
| `test_phase_2_homa_category_e2e.cjs` | Backend Category E2E | 41 | 41 | 0 | **PASS** |
| `testHomaAdminCategories.cjs` | Admin Panel Code & API | 44 | 44 | 0 | **PASS** |
| `testHomaServiceDetailsRedesign.cjs` | Public Service Details | 51 | 51 | 0 | **PASS** |
| `testHomaRedesign.cjs` | Public Main Landing Page | 52 | 52 | 0 | **PASS** |
| `testAllHomaCategories.cjs` | Public Dynamic Categories | 67 | 67 | 0 | **PASS** |
| `testNavagrahaCategoryRedesign.cjs` | Public Navagraha Category | 50 | 50 | 0 | **PASS** |
| **TOTAL** | **Full System Audit** | **402** | **402** | **0** | **100% PASS** |

> **Audit Observation:** The 402 passing tests establish that individual units, API contracts, database constraints, and layout structures conform strictly to code specifications. However, unit tests on the frontend did not test for the presence of dynamic FAQs, dynamic Prasad, or dynamic related ceremonies because those assertions were not part of the previous test scopes.

---

## 11. Confirmed Discrepancies and Bugs

### Bug 1: Broken Unhashed Seed Image Paths in Database
- **Severity:** High
- **Files Affected:** `backend/src/scripts/seedHomaCatalogue.js`, `frontend-user1/src/services/homaCatalogueService.js` (lines 173–177)
- **Observed Behavior:** Database seeds store `/assets/puja-rudrabhishek.jpg`. `isUnresolvableAsset()` fails to identify it as unresolvable because it contains a hyphen `-`. The browser triggers 404 network errors before runtime `onError` replaces it.
- **Expected Behavior:** Unresolvable relative asset paths should either be stored as valid CDN URLs (like `ayushya-homa`) or correctly trapped by `isUnresolvableAsset()` so no 404 requests are made.

### Bug 2: Single Gallery Image Overwrite Bug
- **Severity:** Medium
- **Files Affected:** `frontend-user1/src/services/homaCatalogueService.js` (line 248)
- **Observed Behavior:** `cleanGallery.length >= 2 ? cleanGallery : curatedGallery`. If an admin uploads exactly 1 gallery image, it is thrown away and replaced by the curated static gallery.
- **Expected Behavior:** If an admin uploads 1 image, that image should be prioritized as the primary view, with fallback images filling only subsequent slots.

### Bug 3: Service FAQs Configured by Admin are Completely Omitted
- **Severity:** Medium
- **Files Affected:** `frontend-user1/src/features/yagyaPuja/pages/HomaServiceDetails.jsx`
- **Observed Behavior:** Admin creates FAQ questions and answers in `HomaServiceForm.tsx`. Backend persists and serializes them in `service.faqs`. `HomaServiceDetails.jsx` does not render an FAQ section at all.
- **Expected Behavior:** Devotees visiting `/yagya-puja/homa/:slug` should see an accordion section displaying the ceremony's specific FAQs.

### Bug 4: Consecrated Prasad Details Omitted from Frontend
- **Severity:** Medium
- **Files Affected:** `frontend-user1/src/features/yagyaPuja/pages/HomaServiceDetails.jsx`, `HomaCategoryView.jsx`
- **Observed Behavior:** `service.prasad` is entered in Admin and saved in DB, but nowhere on the public frontend detail page is `service.prasad` rendered.
- **Expected Behavior:** Devotees should see the specific Prasad items dispatched for that ceremony (e.g. blessed coins, yantras, bhasma).

### Bug 5: Custom Samagri Inclusions Masked by Hardcoded Inclusions
- **Severity:** Low
- **Files Affected:** `frontend-user1/src/features/yagyaPuja/components/HomaSamagriSection.jsx`
- **Observed Behavior:** Only 10 pre-defined samagri items are rendered. Custom items added by Admin are filtered out unless they fuzzy-match one of the 10 names.
- **Expected Behavior:** `HomaSamagriSection.jsx` should render any additional ceremony-specific items provided in `service.samagri`.

### Bug 6: Related Ceremonies are Hardcoded to 8 Static Slugs
- **Severity:** Low
- **Files Affected:** `frontend-user1/src/features/yagyaPuja/pages/HomaServiceDetails.jsx` (lines 174–178)
- **Observed Behavior:** `relatedHomas` is generated by slicing `HOMA_CATALOGUE_LIST` from static code. Newly created Homa ceremonies never appear in related recommendations.
- **Expected Behavior:** Related ceremonies should query `getHomaServices({ limit: 4 })` from the active backend API, preferably prioritizing ceremonies from the same category.

---

## 12. Recommended Remediation Plan (Prioritized)

When permission is granted to implement improvements, follow this ordered plan:

1. **Fix Image Asset Trapping in `homaCatalogueService.js` (Priority 1):**
   - Update `isUnresolvableAsset(url)` to identify any relative path `/assets/*` that does not match the compiled Vite asset manifest, or update the database seed script to provide production CDN / Cloudinary URLs for all 8 services (just as was done for `ayushya-homa`).
2. **Support Single and Multi-Image Admin Uploads in Gallery (Priority 2):**
   - Modify the gallery fallback logic: if `cleanGallery.length > 0`, use the admin-provided images first and prepend/append curated fallbacks only to reach the required 3-slide minimum for Design C.
3. **Add Ceremony FAQs Accordion to `HomaServiceDetails.jsx` (Priority 3):**
   - Render a 2-column or full-width FAQ accordion section above the related ceremonies when `service.faqs && service.faqs.length > 0`.
4. **Display Consecrated Prasad Inclusions (Priority 4):**
   - Add a "Blessed Prasad & Sacred Bhasma Dispatch" card/callout in `HomaServiceDetails.jsx` rendering `service.prasad`.
5. **Dynamic Inclusions in `HomaSamagriSection.jsx` (Priority 5):**
   - Allow `HomaSamagriSection.jsx` to render custom ceremony items from `service.samagri` inside the "Ceremony-Specific Offerings" group.
6. **Dynamic Related Ceremonies Query (Priority 6):**
   - Replace the static `HOMA_CATALOGUE_LIST.filter()` in `HomaServiceDetails.jsx` with an asynchronous query to `homaCatalogueService.getHomaServices({ category: service.category?.slug, limit: 4 })`.

---

## 13. Final Audit Conclusion

The **Backend, Database, Admin Panel, and Booking Calculation Engine are 100% sound, secure, and production-ready**. 
The discrepancies identified are **strictly frontend presentation omissions and asset fallback edge-cases** on the public service detail page. No backend schema, database migration, or business logic redesign is required.

