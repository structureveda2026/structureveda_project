# READ-ONLY AUDIT: Navagraha Planetary Homa Category Landing Page

**Route Audited:** `/yagya-puja/homa/category/navagraha-planetary-homa`  
**Date of Audit:** November 5, 2026  
**Auditor:** Antigravity AI Pair Programmer (DeepMind Team)  
**Status:** READ-ONLY COMPLETED (Zero code, database, API, or pricing modifications performed)

---

## Executive Summary

The Navagraha Planetary Homa category page at `/yagya-puja/homa/category/navagraha-planetary-homa` currently presents a stark layout and functional disconnect when compared to the finalized Puja and Yagya category experiences (`/yagya-puja/puja/category/*` and `/yagya-puja/yagya/category/*`), as well as the newly redesigned Homa landing page (`/yagya-puja/homa`).

The page exhibits four fundamental architectural problems:
1. **Broken Ritual Image**: The service card displays a broken/empty image icon because the backend API delivers a static string `"/assets/puja-navagraha.jpg"`, which does not exist in the public directory and cannot be resolved by Vite's asset pipeline. A compounding bug in `HomaServiceCard.jsx` causes the `onError` fallback to re-request the exact same broken string.
2. **Severe Layout Asymmetry (67% Dead Space)**: The single Navagraha Homa service is forced into Column 1 of a 3-column CSS grid (`md:grid-cols-2 lg:grid-cols-3`). This makes the card narrow (~380px) and leaves ~800px (two-thirds) of the desktop viewport completely blank on the right.
3. **Massive Void Below the Card**: While Puja and Yagya category pages feature rich educational and conversion sections below their catalogues (Inclusions, Sankalpa Process, Pandit Credentials, FAQs, and Final CTA), the Homa category page has **0 sections** below the catalogue, resulting in 600px+ of blank canvas down to the footer.
4. **Counter-Productive Filter Bar**: A 5-control search and filter bar (Search, Purpose, Havan Count, Duration, Sort, Location) is rendered above a category containing only **1 service**. Selecting almost any filter (e.g. 7 Havans or 3 Days) instantly empties the page and shows an empty state.

---

## 1. Complete Page Architecture & Render Tree

### 1.1 Route Configuration
- **File**: `frontend-user1/src/routes/AppRoutes.jsx` (Line 105)
- **Route**:
  ```jsx
  <Route element={<YagyaPujaLayout />}>
    ...
    <Route path="/yagya-puja/homa/category/:categorySlug" element={<HomaCategoryListing />} />
    ...
  </Route>
  ```
- **Parent Layout**: `YagyaPujaLayout.jsx` provides the top navigation header and shared container.
- **Global Footer**: Delivered via `Footer.jsx` mounted within the layout tree.

### 1.2 Component Hierarchy
```
YagyaPujaLayout
└── HomaCategoryListing (/yagya-puja/homa/category/navagraha-planetary-homa)
    ├── <nav> Breadcrumb Navigation ("Home > Yagya & Puja > Homa / Havan > Navagraha Planetary Homa")
    ├── <header> Editorial Category Hero (Inline JSX)
    │   ├── Background Image Frame (uses categoryImageSrc)
    │   ├── Eyebrow Pill ("VEDIC FIRE SACRAMENT TRADITION")
    │   ├── H1 Heading ("Navagraha Planetary Homa" with gold "Homa")
    │   ├── Category Description
    │   └── Anchor Button ("Explore Navagraha Planetary Homa Rituals" -> #category-catalogue)
    └── <section id="category-catalogue"> Primary Catalogue
        ├── Section Header ("Available Fire Ceremonies" • Showing 1 Consecrated Ritual)
        ├── Search & Filter Controls Bar (5 dropdowns/inputs + Mode pills)
        ├── Services Grid (grid gap-6 md:grid-cols-2 lg:grid-cols-3)
        │   └── <HomaServiceCard> (Only 1 instance: "Navagraha Homa")
        │       ├── Top Image Frame (BROKEN: /assets/puja-navagraha.jpg)
        │       ├── Featured Badge & Location Pills (Kashi & Remote)
        │       ├── Card Metadata (Type, Duration, Homa Name, Description)
        │       ├── Supported Havans Pills ([1, 3, 5] Havan)
        │       └── Card Footer (Starting Dakshina ₹9,500 + "Explore Homa →")
        └── Pagination Controls (Hidden when totalPages === 1)
```

### 1.3 Missing Bottom Sections
Unlike `PujaCategoryListing` and `YagyaCategoryListing`:
- `HomaCategoryListing.jsx` terminates immediately after `</section>` (Line 772).
- **Missing**:
  - No "About Navagraha Homa" or Vedic Planetary significance section.
  - No itemized Sacred Inclusions or 9 Planetary Woods explanation.
  - No Pandit credentials or Kashi sanctum explanation.
  - No Frequently Asked Questions (FAQ) section.
  - No Final Conversion CTA banner.

### 1.4 Asset & Image References
- **Category Hero Background**:
  - `CATEGORY_SLUG_IMAGES["navagraha-planetary-homa"] = yagyaSacredFireCardImg` (`src/assets/images/yagya_sacred_fire_card.jpg`).
  - This is a generic Yagya card image borrowed from Yagya, with `opacity-35` over a dark black/brown gradient.
  - It does NOT depict Navagraha, planetary mandalas, or celestial sacred fire.
- **Service Card Image**:
  - Database value: `bannerImage = "/assets/puja-navagraha.jpg"`.
  - Statically imported asset in source: `src/assets/images/puja-navagraha.jpg` (exists in frontend assets, but bypassed by API string).

---

## 2. Actual Service Data Inspection

### 2.1 How Navagraha Homa Service Data is Fetched
1. **Category Metadata**: Fetched via `homaCatalogueService.getHomaCategoryBySlug("navagraha-planetary-homa")` calling `GET /api/homa-categories/navagraha-planetary-homa`.
2. **Service Listing**: Fetched via `homaCatalogueService.getHomaServices(filterObj)` calling `GET /api/homa-services?category=navagraha-planetary-homa&page=1&limit=6&sortBy=featured`.
3. **Data Source**: Live PostgreSQL / SQLite database seeded by `backend/src/scripts/seedHomaCatalogue.js` and `backend/src/scripts/seedHomaCategories.js`. (Mirrored statically in `frontend-user1/src/features/yagyaPuja/data/homaCatalogueData.js`).

### 2.2 Why Only One Service is Displayed
In `backend/src/scripts/seedHomaCategories.js`, line 80:
```javascript
export const HOMA_SERVICE_CATEGORY_MAPPINGS = {
  "maha-mrityunjaya-homa": "shiva-rudra-homa",
  "rudra-homa": "shiva-rudra-homa",
  "ganapati-homa": "ganapati-homa",
  "durga-chandi-homa": "durga-chandi-homa",
  "lakshmi-kubera-homa": "lakshmi-kubera-homa",
  "navagraha-homa": "navagraha-planetary-homa", // <--- ONLY ONE SERVICE MAPPED
  "vastu-shanti-homa": "vastu-griha-homa",
  "ayushya-homa": "ayushya-longevity-homa",
};
```
The database contains exactly one ritual assigned to `navagraha-planetary-homa`: `"navagraha-homa"` ("Navagraha Homa"). There are currently no sub-deity rituals (such as individual Shani Shanti Homa, Rahu-Ketu Homa, or Surya Homa).

### 2.3 Detailed Data Schema for "Navagraha Homa"

| Field | Database / API Value | Verification & Notes |
|---|---|---|
| **Service ID / Slug** | `navagraha-homa` | Canonical slug |
| **Service Name** | `Navagraha Homa` | Authentic Vedic title |
| **Homa Type** | `Vedic Planetary Homa` | High-level tradition classification |
| **Short Description** | `Cosmic fire ritual offering nine specific Samidha woods to harmonize all nine planetary spheres.` | 1-line summary |
| **Full Description** | `The Navagraha Homa utilizes specific sacred woods (such as Arka for Sun, Palasha for Moon, Khadira for Mars) and Beeja mantras to balance astrological planetary periods (Dashas) and foster serenity.` | Shastric context |
| **Supported Havan Counts** | `[1, 3, 5]` Havans | Specific to this ritual (does not support 7 or 11) |
| **Available Durations** | `[1, 2]` Days | Configurable over 1 or 2 days |
| **Starting Dakshina** | `₹9,500` | Base: ₹9,500 • Per Havan: ₹3,500 • Per Day: ₹3,000 |
| **Pandit Requirements** | Min: `2` • Rec: `3` • Max: `9` Pandits | Scaled by Havan count |
| **Acharya Qualification** | `Navagraha Samhita & Beeja Mantra Homa Priests` | Traditional Vedic qualification |
| **Daily Hours** | `3 – 4 Hours Daily` | Dedicated ritual duration |
| **Ahuti Throughput** | `500 Ahutis per Pandit / Day` | Prescribed Shastric cadence |
| **Kashi Availability** | `true` | Consecrated at Kashi sanctum |
| **Remote Availability** | `true` | Live streaming + energized prasad delivery |
| **Included Samagri** | 8 items: Havan Samagri, Pure Cow Ghrita, 9 Planetary Sacred Woods, Navadhanya (9 Grains), 9 Colored Cloths, Special Offerings (Planetary Herbs), Flowers, Navagraha Yantra Archana (Optional) | Itemized Shastric materials |
| **Prasad Delivery** | `Blessed Navagraha coin, sacred Homa ash, and consecrated Akshat` | Dispatched to devotee address |
| **Sankalpa Fields** | Name, Gotra, Nakshatra, Rashi, Family Members, Special Sankalpa | Full astrological alignment |
| **Banner Image** | `"/assets/puja-navagraha.jpg"` | **BROKEN PATH** (causes 404 in Vite) |

---

## 3. Root Cause Analysis: Layout Problems & Visual Defects

### 3.1 The Broken Image Bug
- **Cause 1 (Backend Seed Data)**: The database seeds store `bannerImage: "/assets/puja-navagraha.jpg"`. In Vite, static source assets located in `src/assets/images/` are bundled with content hashes (e.g. `dist/assets/puja-navagraha-BW99sT_x.jpg`). Raw string paths like `"/assets/puja-navagraha.jpg"` are not served by Vite and 404.
- **Cause 2 (Service Normalizer Precedence)**: In `homaCatalogueService.js` (Line 80-81):
  ```javascript
  const fallbackImg = getHomaFallbackImage(item.slug);
  const primaryImage = item.bannerImage || item.image || fallbackImg;
  ```
  Because `item.bannerImage` is a truthy string (`"/assets/puja-navagraha.jpg"`), `fallbackImg` (which contains the working imported image `pujaNavagrahaImg`) is completely ignored.
- **Cause 3 (Flawed Error Fallback in Card)**: In `HomaServiceCard.jsx` (Line 11):
  ```jsx
  const imgSrc = !imgError && service.image ? service.image : (service.bannerImage || cardYagyaFireImg);
  ```
  When the browser fails to load `service.image` and triggers `onError={() => setImgError(true)}`, `(!imgError && service.image)` becomes `false`. The ternary operator falls back to `service.bannerImage || cardYagyaFireImg`. Because `service.bannerImage` is ALSO `"/assets/puja-navagraha.jpg"`, the card attempts to reload the exact same broken URL, preventing the fallback `cardYagyaFireImg` from ever displaying!

### 3.2 Narrow Card and 67% Dead Space
- In `HomaCategoryListing.jsx` (Line 712):
  ```jsx
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {services.map((svc) => (
      <HomaServiceCard key={svc.id || svc.slug} service={svc} />
    ))}
  </div>
  ```
- The grid is forced into 3 equal columns (`lg:grid-cols-3`) within a `max-w-[1280px]` container.
- With only 1 service in the array, `HomaServiceCard` occupies Column 1 (~380px wide).
- Columns 2 and 3 remain completely vacant, leaving ~800px of dead space on the right side of standard desktop monitors.

### 3.3 Excessive Blank Space Below the Card
- In `PujaCategoryListing` and `YagyaCategoryListing`, 4 subsequent sections fill the page with valuable content, guiding the user towards conversion.
- In `HomaCategoryListing`, the page ends abruptly at line 775. After scrolling 300px past the single card, the user sees an expansive, empty beige background down to the footer.

### 3.4 Filter Redundancy
- The filter bar contains:
  1. Full-text search
  2. Purpose dropdown (7 options)
  3. Havan count dropdown (6 options: All, 1, 3, 5, 7, 11)
  4. Duration dropdown (4 options: All, 1, 2, 3)
  5. Sort dropdown (4 options)
  6. Location pills (All, Kashi, Remote)
- Because there is only 1 ritual, selecting any duration other than "1 Day" or "2 Days", or selecting "7 Havans" or "11 Havans", immediately clears the card and triggers the empty state: *"No Rituals Match Your Filters"*.
- For a 1-service category, this creates a disjointed, frustrating user experience.

---

## 4. Comparison: Homa vs. Finalized Puja & Yagya Category Pages

| Design Dimension | Puja Category (`PujaCategoryListing`) | Yagya Category (`YagyaCategoryListing`) | Current Homa Category (`HomaCategoryListing`) |
|---|---|---|---|
| **Route Pattern** | `/yagya-puja/puja/category/:slug` | `/yagya-puja/yagya/category/:slug` | `/yagya-puja/homa/category/:slug` |
| **Hero Image** | Deity-specific fallback (Navagraha mandala, Shiva, Durga) | Sacred fire ceremony ritual photography | Generic Yagya card image (`yagyaSacredFireCardImg`) with `opacity-35` |
| **Hero Typography** | Gold accent on "Puja" (`#f5ce6f`) | Gold accent on "Yagya" (`#f5ce6f`) | Gold accent on "Homa" (`#f5ce6f`) |
| **Hero CTA** | Dynamic button: `"Explore [Category] Pujas"` | Dynamic button: `"Explore [Category] Yagyas"` | Static button: `"Explore [Category] Rituals"` |
| **Listing Presentation** | 3-column grid for categories with multiple services | 3-column grid for multi-service categories | Rigid 3-column grid forcing single card into 33% width with 67% void |
| **Filter Handling** | Comprehensive filters (tailored to 5-10 services per category) | Tailored filters (Duration, Purpose, Sort) | 5 full filter dropdowns rendered for 1 single service |
| **Service Card Quality** | High-res deity image, Starting Dakshina badge, Duration, Explore CTA | High-res fire image, multi-day badge, Starting Dakshina, Explore CTA | **Broken image** icon, correct metadata & pricing, narrow aspect |
| **Subsequent Section 1** | `<PujaSankalpaProcess />` (Vedic Sankalpa Vidhi) | `<YagyaSamagriSection />` (Herbs, Cow Ghee, Woods) | **MISSING** (None) |
| **Subsequent Section 2** | `<PujaInclusionsSection />` (What is included) | `<YagyaPanditTeamSection />` (Vedic Acharyas) | **MISSING** (None) |
| **Subsequent Section 3** | `<PujaWorkflowSection />` (How booking works) | `<YagyaKashiSection />` (Kashi Moksha Kshetra) | **MISSING** (None) |
| **Subsequent Section 4** | `<PujaFinalCta />` (Conversion Banner) | `<YagyaFinalCta />` (Conversion Banner) | **MISSING** (None) |
| **Visual Balance** | Balanced, editorial, content-rich | Balanced, grand, immersive | Asymmetric, unfinished, empty space |

---

## 5. Proposed Redesign Architecture: 5-Section Layout

To eliminate the 67% right-side void, remove empty page space, fix broken media, and elevate this page to the standard of Puja and Yagya, a dedicated **Five-Section Layout** is proposed:

```
┌──────────────────────────────────────────────────────────────────┐
│ SECTION 1: Dedicated Navagraha Category Hero                     │
│ [Eyebrow: GRAHA SHANTI] • [H1: Navagraha Planetary Homa]         │
│ Celestial Fire Tradition • 9 Sacred Woods • Kashi & Remote       │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ SECTION 2: Vedic Significance & The 9 Sacred Samidhas            │
│ 3 Feature Columns: Planetary Harmony • Botanical Samidha • Vidhi │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ SECTION 3: Featured Ritual Showcase (Wide 2-Column Card)         │
│ Left: High-Res Navagraha Fire Artwork (16:10, Badges)            │
│ Right: Title, Specs, 1/3/5 Havans, Dakshina ₹9,500, Direct CTAs  │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ SECTION 4: Ceremony Details, Samagri & Acharya Credentials       │
│ Itemized 8 Inclusions (9 Woods, Navadhanya, Ghee) • 2-9 Pandits │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ SECTION 5: Navagraha Homa FAQs & Final Conversion CTA            │
│ 2-Column Accordion FAQs (4 Left, 3 Right) + Reusable Final CTA   │
└──────────────────────────────────────────────────────────────────┘
```

---

### Detailed Section Specifications

#### Section 1: Dedicated Navagraha Category Hero
- **Existing Component**: Inline `<header>` in `HomaCategoryListing.jsx` (Lines 425–476).
- **Proposed Changes**:
  - Replace generic `yagya_sacred_fire_card.jpg` with an authentic high-resolution Navagraha planetary sacred fire asset.
  - Refine gradient overlay: Warm dark brown (`from-[#1C120C]/95 via-[#231710]/80 to-transparent`) matching the newly polished Homa hero.
  - Eyebrow Badge: `"VEDIC GRAHA SHANTI • 9 CELESTIAL DEITIES"`.
  - Trust Indicators: 3 pill tags at the base: *9 Shastric Botanical Woods*, *Kashi Kshetra & Remote*, *Initiated Vedic Acharyas*.
  - Primary CTA: Smooth-scroll anchor button `"Explore Navagraha Homa Ritual"` linking to `#featured-ritual`.
- **Available Data**: `category.name`, `category.description`.
- **Image Requirements**: 1920x1080 (16:9) warm morning sanctum lighting featuring copper Havan Kund with sacred planetary offerings or Navagraha Yantra backdrop.
- **Responsive Behavior**: Full-bleed on mobile with centered copy; left-aligned with negative space on desktop.

#### Section 2: Vedic Significance & The 9 Sacred Samidhas (About Navagraha Homa)
- **Existing Component**: None on category page.
- **Proposed Changes**:
  - Add an educational 3-column editorial section explaining the unique Vedic science behind Navagraha Homa:
    1. **The 9 Celestial Deities**: Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (North Node), Ketu (South Node).
    2. **The 9 Shastric Samidhas (Botanical Woods)**: Arka (Sun), Palasha (Moon), Khadira (Mars), Apamarga (Mercury), Ashvattha (Jupiter), Audumbara (Venus), Shami (Saturn), Durva (Rahu), Kusha (Ketu).
    3. **Dosha Pacification & Life Harmony**: Mitigating Sade Sati, Manglik Dosha, planetary transits, and Mahadasha transitions through Agni Ahuti.
- **Available Data**: Synthesized from Shastric principles and `navagraha-homa` database description.
- **Image / Icon Requirements**: Clean antique gold icons (`Compass`, `Sparkles`, `Flame`).
- **Responsive Behavior**: 1 column on mobile, 3 equal cards on `lg:` screens with soft gold borders (`border-[#EAD8B8]`).

#### Section 3: Featured Ritual Showcase (Navagraha Homa Service)
- **Existing Component**: 5-dropdown filter bar + 3-column grid containing 1 narrow 380px card (`HomaServiceCard`).
- **Proposed Changes**:
  - **Eliminate Redundant Filters**: When `totalCount === 1` or category is filtered to 1 result, hide the 5 complex dropdowns and replace them with an elegant status bar: *"1 Consecrated Planetary Homa Available"*.
  - **Re-Architect Card to a Wide Featured Showcase**:
    - Instead of squishing the card into Column 1 of a 3-column grid, render a **2-Column Featured Editorial Card** (`grid md:grid-cols-12`):
      - **Left Column (5 cols)**: Prominent 16:10 or 4:3 high-resolution ritual image with "Featured Homa" and "Kashi & Remote" floating badges.
      - **Right Column (7 cols)**:
        - Eyebrow: `Vedic Planetary Homa • 3 – 4 Hours Daily`
        - Heading: `Navagraha Homa`
        - Shastric Description: Full narrative description highlighting the 9 woods and planetary harmony.
        - Supported Cadence: Pill badges for `1 Havan`, `3 Havans`, and `5 Havans`.
        - Pandit Team: `2 to 9 Initiated Vedic Priests (500 Ahutis/day)`.
        - Price & Actions: Prominent Starting Dakshina badge (`₹9,500`) with direct action buttons:
          - Primary Button: `"Book Navagraha Homa"` (linking to `/yagya-puja/homa/navagraha-homa/book`).
          - Secondary Button: `"View Ritual Details"` (linking to `/yagya-puja/homa/navagraha-homa`).
  - **Fix Image Bug**: Import `pujaNavagrahaImg` directly via Vite ESM and pass it as fallback, ensuring zero 404s.
- **Available Data**: Full `services[0]` record from `getHomaServices()`.
- **Responsive Behavior**: Stacks vertically on mobile/tablet (image top, content bottom); wide horizontal 2-column on desktop.

#### Section 4: Ceremony Details, Samagri & Sacred Inclusions
- **Existing Component**: None on category page.
- **Proposed Changes**:
  - Add an authentic inclusions breakdown displaying the 8 Shastric Samagri items included in Navagraha Homa:
    - 9 Botanical Woods (Arka, Palasha, Khadira, etc.)
    - Navadhanya (9 sacred planetary grains: Wheat, Rice, Toor, Moong, Chana, Rajma, Sesame, Urad, Horsegram)
    - Pure A2 Cow Ghee (Ghrita)
    - 9 Colored Silks for Graha Mandalas
    - Planetary Herbs & Ahuti Samagri
    - Pushpa & Malas (Fresh flowers)
    - Consecrated Kashi Bhasma
    - Blessed Navagraha Coin & Raksha Sutra (Prasad)
  - Acharya credentials badge: *"Performed strictly by initiated Navagraha Samhita & Beeja Mantra scholars from Kashi Kshetra"*.
- **Available Data**: `services[0].samagri`, `services[0].prasad`, `services[0].requiredSkills`.
- **Responsive Behavior**: 2-column or 4-column responsive grid with warm ivory cards (`bg-[#FFFDF9] border-[#EAD8B8]`).

#### Section 5: Navagraha FAQs & Final Conversion CTA
- **Existing Component**: None on category page (`HomaFaqSection` and `HomaFinalCta` exist on landing page).
- **Proposed Changes**:
  - **Navagraha-Specific FAQs**: Render a 2-column accordion FAQ section addressing specific planetary queries:
    1. *Why are nine distinct sacred woods used in Navagraha Homa?*
    2. *Can Navagraha Homa be performed remotely?*
    3. *Which birth details are required for the Sankalpa?*
    4. *How do I choose between 1, 3, or 5 Havan sessions?*
    5. *What Prasad will I receive after the ceremony?*
    6. *Can family members be included in the Sankalpa?*
    7. *When is the most auspicious tithi for Navagraha Homa?*
  - **Final CTA**: Reuse `<HomaFinalCta />` with category-tailored copy:
    - Eyebrow: `HARMONIZE YOUR COSMIC SPHERES`
    - Title: `Arrange Your Consecrated Navagraha Homa`
    - Description: `Invoke the grace of the nine planetary deities through authentic Shastric oblations in Kashi or remotely.`
    - Buttons: `"Book Navagraha Homa Now"` and `"Explore All Homa Categories"`.
- **Responsive Behavior**: 2-column layout on desktop; single-column stacked accordion on mobile.

---

## 6. Affected File Paths & Reusable Inventory

### 6.1 Target Page File
- `frontend-user1/src/features/yagyaPuja/pages/HomaCategoryListing.jsx` (Core category landing page component to be upgraded).

### 6.2 Target Supporting Files
- `frontend-user1/src/features/yagyaPuja/components/HomaServiceCard.jsx` (Fix image fallback bug).
- `frontend-user1/src/services/homaCatalogueService.js` (Ensure fallback image lookup succeeds when `bannerImage` is an unresolvable string).

### 6.3 Reusable Component Inventory
- `frontend-user1/src/features/yagyaPuja/components/HomaFaqSection.jsx` (Reusable 2-column FAQ pattern).
- `frontend-user1/src/features/yagyaPuja/components/HomaFinalCta.jsx` (Reusable bottom conversion banner).
- `frontend-user1/src/features/yagyaPuja/components/HomaConceptSection.jsx` (Reference for editorial card styling and stage progressions).
- `frontend-user1/src/features/yagyaPuja/components/HomaSamagriSection.jsx` (Reference for samagri pill/card styling).

### 6.4 Relevant Asset Inventory
- `frontend-user1/src/assets/images/puja-navagraha.jpg` (High-res traditional Navagraha mandala/ritual painting).
- `frontend-user1/src/assets/images/homa/homa-hero-morning-sanctum.jpg` (High-res morning temple Agni Kund hero asset).
- `frontend-user1/src/assets/images/library/cards/card-yagya-fire.jpg` (Sacred fire fallback card).
- `frontend-user1/src/assets/images/samagri/samagri-samidha-wood.jpg` (Sacred botanical woods asset).
- `frontend-user1/src/assets/images/samagri/samagri-dhanya-akshata.jpg` (Sacred grains/navadhanya asset).

---

## 7. Prioritized Implementation Plan (When Approved)

| Priority | Phase | Scope of Work | Key Deliverables |
|---|---|---|---|
| **P0** | **Phase 1: Image Resolution & Bug Fix** | Fix the broken image bug in `homaCatalogueService.js` and `HomaServiceCard.jsx` | Reliable image fallback chain; zero 404s on `puja-navagraha.jpg`. |
| **P1** | **Phase 2: Featured Ritual Showcase Architecture** | Redesign the single-service display from a narrow 33% card into a wide 2-column editorial showcase | Eliminates 67% dead space; highlights 1/3/5 Havans, Dakshina ₹9,500, Kashi/Remote, and direct booking links. |
| **P2** | **Phase 3: Filter Bar Cleanup** | Replace 5 redundant dropdowns with a clean category status bar when only 1 service exists | Prevents user frustration from dead-end filters. |
| **P3** | **Phase 4: Dedicated Hero Polish** | Upgrade category hero with authentic Navagraha Agni imagery, refined gradients, and trust tags | Eliminates borrowed low-opacity Yagya background. |
| **P4** | **Phase 5: Inclusions & About Sections** | Add Section 2 (Vedic Significance of 9 Woods) and Section 4 (8 Sacred Inclusions & Pandit Credentials) | Fills the massive vertical void below the card with authentic Shastric value. |
| **P5** | **Phase 6: FAQs & Final CTA** | Integrate Navagraha 2-column FAQs and reusable `HomaFinalCta` | Consistent layout with Puja & Yagya; complete customer conversion funnel. |
| **P6** | **Phase 7: Test Suite & Build Verification** | Extend `testHomaRedesign.cjs` and verify `npm run build` | 100% test pass rate, clean Vite build. |

---

## 8. Verification & Strict Restriction Compliance

- **READ-ONLY AUDIT**: No production or test source files have been altered during this audit.
- **NO DATA ALTERATION**: Backend databases, API endpoints, migrations, and pricing rules remain completely untouched.
- **AUDIT RECORD**: This audit is permanently saved as `NAVAGRAHA_HOMA_CATEGORY_AUDIT.md` in the project root for review and subsequent phase approval.

