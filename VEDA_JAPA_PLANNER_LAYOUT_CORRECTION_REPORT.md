# Veda Structure: Japa Anushthan Planner Layout Correction Report
## Composition: Top Panoramic Devotional Banner + Full-Width Interactive Planner

**Date:** November 18, 2026  
**Module:** Vedic Japa (`frontend-user1`)  
**Scope:** Public Japa Landing Page (`/yagya-puja/japa`)  
**Status:** Complete & Production Verified (Build: Pass, Automated Tests: 18/18 Pass)

---

## 1. Executive Summary & Layout Correction Rationale

The previous 40/60 left-right split layout has been **completely removed and replaced** by the approved **Top Panoramic Image Banner + Full-Width Interactive Planner Below** composition.

### Critical Issues Fixed:
- **Eliminated 40/60 Split:** Removed the narrow permanent left image column and right planner column.
- **Eliminated Cramped Service Cards:** The service selection grid now occupies the full container width (`max-w-[1400px]`), allowing service names like *Ganapati Atharvashirsha Japa* and *Durga Saptashati Mantra Japa* to render without truncation or tiny typography.
- **Panoramic Header:** A high-resolution, wide-format 16:6 devotional photograph is placed across the entire top of the container.
- **Full-Width Hierarchy:**
  1. Full-width panoramic devotional image banner with sanctum tradition badges.
  2. Centered planner introduction (Eyebrow, Headline, Description).
  3. Horizontal 4-step progress indicator (*1. Select Mantra*, *2. Select Count*, *3. Review Plan*, *4. Continue*).
  4. Step 1: Choose Mantra Japa Ceremony (spacious 3-column responsive grid on desktop).
  5. Step 2: Select Recitation Count (4-column responsive Shastric count tiers).
  6. Step 3: Authoritative Breakdown & Inclusions (4 balanced columns with subtle architectural dividers).
  7. Footer booking action with supervision guidelines note and prominent *"Book This Japa →"* button.

---

## 2. New Layout Composition (Top-Image + Bottom-Planner)

The entire planner is housed in a single, balanced container:
- **Maximum Width:** `max-w-[1400px]` centered on the page.
- **Architectural Styling:** Large rounded corners (`rounded-[32px]`), warm ivory background (`bg-[#fffdfa]`), thin antique-gold border (`border-[#ead8bc]`), and subtle natural depth shadow (`shadow-[0_20px_50px_rgba(48,37,28,0.06)]`).
- **Complete Elimination of Permanent Columns:** Zero left-right split at any viewport breakpoint (`lg:col-span-5` and `lg:col-span-7` completely removed).

---

## 3. Top Panoramic Image Banner Specifications

- **Asset Filename:** `japa-planner-banner.jpg`
- **Asset Locations:**
  - `frontend-user1/src/assets/images/japa-planner-banner.jpg` (bundled Vite asset)
  - `frontend-user1/public/images/japa/japa-planner-banner.jpg` (public fallback asset)
- **Source & Content:**
  - Generated via Google DeepMind `image-generator` subagent specifically for this panoramic header.
  - Features an authentic 108-bead Rudraksha and crystal Sphatik Japa Mala resting on saffron silk, an ancient Sanskrit hymn manuscript with Devanagari text, glowing brass diyas, sacred copper vessels with fresh tulsi leaves, chandan (sandalwood) paste, and hanging temple bells amidst carved stone pillars with soft incense smoke.
  - Strictly **no homa kunda / sacrificial fire pit**, maintaining authentic Japa chanting atmosphere.
- **Banner Layout:**
  - Full container width (`w-full`).
  - Aspect ratio: `aspect-[16/6] min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] max-h-[420px]`.
  - Visual treatment: `object-cover object-center` with smooth subtle zoom on hover and a delicate bottom vignette overlay (`from-[#140c06]/85 via-[#140c06]/25 to-transparent`).
  - Overlay Badges:
    - Top Left: `Vedic Anushthan Vidhi • Sacred Chanting Tradition` (gold-bordered glass capsule).
    - Bottom: *Authentic Mantra Japa & Purascharana* with 4 capability badges (*Scriptural Method*, *Qualified Purohits*, *Kashi Kshetra*, *Remote Sankalpa*).

---

## 4. Introduction & Step Progress Indicator

### A. Centered Introduction:
- **Eyebrow:** `INTERACTIVE ANUSHTHAN PLANNER` (antique-gold bordered capsule).
- **Heading:** `Calculate Your Sacred Japa Plan` (high-contrast serif typography, `text-[28px] sm:text-[34px] lg:text-[38px]`).
- **Description:** `Choose your Mantra Japa and prescribed recitation count. Review the applicable duration, Purohit requirements and authoritative Dakshina before continuing.`

### B. Horizontal 4-Step Progress Indicator:
- Rendered below the heading in a clean, compact horizontal track (`max-w-[900px] mx-auto`):
  1. **Step 1:** `Select Mantra` (Active/Completed checkmark indicator)
  2. **Step 2:** `Select Count` (Active count selection indicator)
  3. **Step 3:** `Review Plan` (Calculated plan breakdown indicator)
  4. **Step 4:** `Continue` (Booking readiness indicator)
- Fully responsive on mobile (`grid-cols-2 sm:grid-cols-4`) without horizontal overflow.

---

## 5. Step 1: Choose Mantra Japa Ceremony

- **Full-Width 3-Column Responsive Grid:**
  - Desktop: 3 columns (`lg:grid-cols-3`).
  - Tablet: 2 columns (`md:grid-cols-2`).
  - Mobile: 1 column (`grid-cols-1`).
- **Readable Card Typography:**
  - Removed truncation from service titles (`text-[14px] sm:text-[14.5px] font-bold text-[#30251c] leading-snug`).
  - Ceremony thumbnail resolved via `resolveJapaImage(svc)` (`h-12 w-12 rounded-xl`).
  - Deity / tradition subtitle (`text-[12px] text-[#8a725b]`).
  - Consistent height across all cards with comfortable padding (`p-4`).
- **Selected State:**
  - Warm antique-gold border (`border-[#b77920]`).
  - Soft cream background (`bg-[#fbf5eb]`).
  - Gold ring highlight (`ring-2 ring-[#b77920]/80`).
  - Solid gold checkmark badge.

---

## 6. Step 2: Select Recitation Count

- **Service-Specific Availability:**
  - Derived strictly from `currentService.availableCounts` (e.g. 11,000, 21,000, 51,000, 1,25,000).
  - No unsupported counts are rendered.
  - Automatic reset: if the user switches ceremony and the previously selected count is unsupported, it automatically resets to `availableCounts[0]`.
- **4-Column Layout on Desktop:**
  - Desktop: 4 columns (`lg:grid-cols-4`).
  - Tablet: 2 columns (`sm:grid-cols-2`).
  - Mobile: 1 column (`grid-cols-1`).
- **Card Content:**
  - Formatted label: e.g. `11,000 Japa`, `21,000 Japa`, `51,000 Japa`, `1.25 Lakh Japa`.
  - Shastric classification: `Laghu Anushthan`, `Madhyama Anushthan`, `Maha Anushthan`, `Purascharana Vidhi`.
  - Selected state with checkmark icon and active ring.

---

## 7. Step 3: Your Japa Plan Summary

- **Full-Width 4-Column Balanced Panel:**
  - Four evenly spaced columns on desktop separated by subtle architectural vertical dividers (`divide-x divide-[#ead8bc] bg-[#faf6f0] rounded-2xl border border-[#ead8bc] p-5 sm:p-7`).
  - 4 Key Metrics:
    1. **Duration:** Clock icon, label *Estimated Duration*, value `${estimatedDuration}`, subtitle `${dailyHours}` (e.g., `3-4 Days` / `4 Hours Daily`).
    2. **Purohit Squad:** Users icon, label *Purohit Squad*, value `${recommendedPandits} Vedic Priests`, subtitle `Min. ${minimumPandits} Scholars`.
    3. **Recitation Count:** Hash icon, label *Recitations*, value `${activeCount.toLocaleString('en-IN')}`, subtitle *Consecrated Tally*.
    4. **Dakshina:** Sparkles icon, label *Authoritative Dakshina*, value `₹${Number(displayPrice).toLocaleString('en-IN')}`, subtitle *Authoritative Base*.
- **Data Integrity:** All values are pulled directly from the authoritative backend variant record. Zero frontend pricing calculation or hardcoded numbers.

---

## 8. Booking Action & Cashfree Preservation

- **Placement:** Bottom of the summary panel across full container width.
- **Supervision Note:** `Strict daily tally metrics: 2000 Japa per Purohit daily under senior Acharya supervision.`
- **Primary CTA:** Prominent **"Book This Japa →"** button (`bg-[#b77920] hover:bg-[#8f5211] text-white px-9 py-4 font-bold rounded-full`).
- **Target URL Pattern:** `/yagya-puja/japa/${selectedSlug}/book?count=${activeCount}`.
- **Route & Cashfree Preservation:**
  - Matches `<Route path="/yagya-puja/japa/:slug/book" element={<RitualBookingWizard serviceType="JAPA" />} />`.
  - Disabled state with `cursor-not-allowed` if service or count is invalid.
  - Cashfree payment creation and server-side verification remain 100% untouched.

---

## 9. Responsive Verification Matrix

| Viewport | Device Size | Banner Behavior | Service Grid | Count Selector | Plan Summary |
|:---|:---|:---|:---|:---|:---|
| **Desktop** | 1280px - 1440px+ | Full-width 16:6 panoramic banner (`h-[360px]`) | 3 columns (`lg:grid-cols-3`) | 4 columns (`lg:grid-cols-4`) | 4 columns (`divide-x`) |
| **Tablet** | 768px - 1024px | Full-width banner (`h-[280px] - [320px]`) | 2 columns (`md:grid-cols-2`) | 2 columns (`sm:grid-cols-2`) | 2 columns |
| **Mobile** | 360px - 640px | Full-width compact banner (`h-[220px]`) | 1 column (`grid-cols-1`) | 1 column (`grid-cols-1`) | 2 columns stacked |

---

## 10. Automated Test Results

Executed `node frontend-user1/src/features/yagyaPuja/tests/testJapaRedesignComplete.cjs`:

```text
================================================================
VEDA STRUCTURE: JAPA COMPLETE REDESIGN VERIFICATION SUITE
================================================================
[PASS] 1.1 japaCatalogueService.js has isUnresolvableAsset handling
[PASS] 1.2 SLUG_IMAGE_MAP covers all 8 canonical database slugs
[PASS] 1.3 JapaServiceCard has onError handler and warm ivory background
[PASS] 1.4 JapaCategoryCard has onError handler and deityHanumanImg
[PASS] 2.1 JapaCatalogueListing.jsx renders the 7 consolidated sections (Catalogue removed)
[PASS] 2.2 Obsolete bloated sections and catalogue are completely removed
[PASS] 3.1 JapaHero has full background image and eliminated split image card
[PASS] 3.2 JapaHero has eyebrow, headline, search, dual CTAs, and verified highlights
[PASS] 4.1 JapaCategorySection previews categories in responsive 3-col grid and has View All link
[PASS] 4.2 AppRoutes.jsx has both /yagya-puja/japa/categories and /all mapped
[PASS] 4.3 JapaCategoryCard routes to /yagya-puja/japa/category/:slug
[PASS] 5.1 Vedic Mantra Japa Catalogue section and component are cleanly removed
[PASS] 6.1 JapaAnushthanPlanner has top panoramic banner and full-width content below
[PASS] 6.2 JapaAnushthanPlanner includes step progress indicator, 3-col service grid, and 4-col summary
[PASS] 7.1 JapaParticipationSection compares Kashi and Remote modes without unsupported claims
[PASS] 8.1 JapaJourneySection defines 4 clean milestones
[PASS] 9.1 JapaFAQAndCTA has accordion and restrained closing CTA
[PASS] 10.1 JapaServiceDetails has slide error handling and no black background
================================================================
TOTAL TESTS: 18 | PASSED: 18 | FAILED: 0
================================================================
```

---

## 11. Production Build Verification

Executed `npm --prefix frontend-user1 run build`:
- **Result:** Success (Exit Code: 0)
- **Build Time:** 14.48 seconds
- **Modules Transformed:** 2,284 modules
- **Asset Bundled:** `dist/assets/japa-planner-banner-0EXg-0zh.jpg` (840.13 kB)
- **Zero Errors:** All imports and CSS variables cleanly resolved.

---

## 12. Strict Scope & Module Preservation Confirmation

- **Preserved Landing Page Sequence:**
  1. `JapaHero` (Full-width background hero)
  2. `JapaCategorySection` (Category discovery preview + View All link)
  3. `JapaAnushthanPlanner` (Top Panoramic Banner + Full-Width Planner Below)
  4. `JapaParticipationSection` (Kashi vs Remote)
  5. `JapaArrangementsSection` (Mala, Samagri & Purohits)
  6. `JapaJourneySection` (4-Step Vedic Journey)
  7. `JapaFAQAndCTA` (FAQs & Closing CTA)
- **Catalogue Removed:** The former "Vedic Mantra Japa Catalogue" section remains completely removed.
- **Unmodified Systems:** Backend APIs, database migrations, Cashfree payment gateway, and Admin Library modules were strictly preserved with zero alterations.

