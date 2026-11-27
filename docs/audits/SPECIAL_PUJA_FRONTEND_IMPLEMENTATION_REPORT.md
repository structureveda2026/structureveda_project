# Veda Structure: Special Puja Visual Experience Redesign Report

**Document Date:** November 26, 2026  
**Module:** Yagya & Puja Portal (`frontend-user1`)  
**Scope:** Premium Visual UI Redesign matching existing Veda Structure Puja & Yagya experience  
**Status:** Completed & Production Build Verified  

---

## 1. Executive Summary & Design Transformation

The Special Puja frontend (`frontend-user1`) has been completely redesigned from a text-heavy, card-centric presentation into an **image-rich, premium Vedic ritual booking experience** that seamlessly matches the established design language of the Veda Structure Puja and Yagya portal (`UmbrellaHero`, `UmbrellaRitualCategories`, `PujaServiceDetails`).

### Key Visual & Architectural Upgrades:
1. **Replaced Generic Minimalist Blocks with Atmospheric Editorial Layouts:**
   - Hero section now features full-bleed photography with priest and sacred altar backdrop, warm golden ambient aura (`blur-[140px]`), refined localized readability gradients (`from-[#fffaf0]/96 via-[#fffaf0]/90 to-transparent`), and high-contrast serif typography.
2. **Standardized Image-Based Category & Discovery Cards:**
   - All 4 primary categories and individual services now feature high-resolution imagery (`aspect-[16/10]` and `h-44/h-48`) with dark gradient footers, gold badges (`border-[#eab12c]/40`), smooth hover zoom (`scale-105`), and subtle card elevations (`shadow-[0_8px_24px_rgba(199,119,34,0.12)]`).
3. **Harmonized Life-Stage Journey for Shodasha Samskars:**
   - 16 Samskar cards now incorporate individual ritual photography, Devanagari Sanskrit nomenclature, concise 2-line descriptions, timing/duration metadata pills, and whole-card clickable interactions.
4. **Dedicated Visual Sections for Birthday Puja, Pinda Daan & Tirth Shradh:**
   - Large Birthday Puja/Havan feature explaining the Vedic Janma Tithi vs Gregorian calendar.
   - Pinda Daan pilgrimage cards showcasing holy Tirthas (Gaya, Kashi, Prayagraj, Badrinath, Haridwar) with river ghat imagery and a 4-step Vidhi strip.
   - Clean Tirth Shradh cards with Vidhi element checklists.
5. **Authentic Detail Page Redesign Matching `PujaServiceDetails.jsx`:**
   - Two-column desktop layout (`lg:grid-cols-12`: 8 cols left, 4 cols right).
   - Large ritual-specific hero frame with gold borders (`border-2 border-[#e6caa0]`), stage pill, and location indicator.
   - Scriptural context, karmic fruits, step-by-step Vidhi sequence numbers, sacred samagri grid, and 4 feature highlights.
   - Sticky inquiry & booking card with direct helpline CTA and previous/next Samskar navigation.

---

## 2. Design System Alignment

| Design Element | Value | Visual Application |
| :--- | :--- | :--- |
| **Page Canvas** | `#fffaf0` | Soft warm ivory background across all pages |
| **Card Canvas** | `#fffcf7` / `#fffdfa` | Elevated cream card backgrounds with subtle borders |
| **Border Tone** | `#ead8b8` / `#ebdcc4` | Refined antique sand borders matching Veda Structure portal |
| **Primary CTA** | `#eab12c` hover `#dda018` | Gold pill button with `shadow-[0_4px_18px_rgba(234,177,44,0.3)]` |
| **Secondary CTA** | `#fffaf0` border `#dcc5a7` | Warm ivory pill button with `#b36c1e` text hover |
| **Antique Gold** | `#b36c1e` / `#c77722` | Category badges, Sanskrit titles, eyebrow stars `✦` |
| **Primary Text** | `#2b241d` | Deep brown serif headings (`font-serif`) |
| **Body Text** | `#5c4e3f` / `#65584a` | Highly legible warm charcoal-brown body typography |

---

## 3. Comprehensive Imagery & Asset Mapping

All images are imported locally via Vite's static asset pipeline, ensuring hash-based cache bursting and zero broken links:

| Section / Ceremony | Image Asset Path | Visual Description |
| :--- | :--- | :--- |
| **Special Puja Hero** | `src/assets/images/puja/puja-kashi.webp.png` | Traditional Vedic ceremony in sacred Kashi with Acharyas |
| **Shodasha Samskars Category** | `src/assets/images/library/cards/card-samskara.jpg` | Consecrated Samskara and Upanayana ceremony |
| **Birthday Puja Category** | `src/assets/images/homa/homa-hero-kashi-ceremony.jpg` | Traditional Ayushya Homa with sacred Agni kunda |
| **Pinda Daan Category** | `src/assets/images/library/banners/banner-temple-ghat.jpg` | Sacred river ghat pilgrimage during Tarpana |
| **Tirth Shradh Category** | `src/assets/images/library/banners/banner-sanctum.png` | Holy Teertha sanctum along the riverbank |
| **Final CTA Section** | `src/assets/images/yagya/yagya-final-cta.webp.png` | Atmospheric grand Vedic fire altar backdrop |
| **#01 Garbhadhana** | `src/assets/images/puja/puja-devotional-altar.webp.png` | Devotional altar with sacred kalash |
| **#02 Punsavana** | `src/assets/images/library/banners/banner-ritual-setup.png` | Consecrated herbs & mother's protective altar |
| **#03 Simantonnayana** | `src/assets/images/puja/puja-family.webp.png` | Family gathering for auspicious baby shower rite |
| **#04 Jatakarma** | `src/assets/images/library/banners/banner-altar.png` | Consecrated honey, ghee & gold touch |
| **#05 Namakarana** | `src/assets/images/puja/puja-family.webp.png` | Family naming ceremony with unbroken rice grains |
| **#06 Nishkramana** | `src/assets/images/library/banners/banner-temple-hero.jpg` | First outing gazing upon Surya & Chandra |
| **#07 Annaprashana** | `src/assets/images/puja/puja-prasad.webp.png` | Sacred kheer offering with silver spoon |
| **#08 Chudakarana (Mundan)** | `src/assets/images/library/banners/banner-temple-ghat.jpg` | Sacred tonsure at holy river ghat |
| **#09 Karnavedha** | `src/assets/images/puja/puja-pandit.webp.png` | Learned Acharya performing ear piercing |
| **#10 Vidyarambha** | `src/assets/images/devi_saraswati_card.jpg` | Goddess Saraswati and letters initiation |
| **#11 Upanayana (Yajnopavita)** | `src/assets/images/library/cards/card-samskara.jpg` | Sacred thread initiation & Gayatri transmission |
| **#12 Vedarambha** | `src/assets/images/library/cards/card-rigveda.jpg` | Traditional Veda scriptures study initiation |
| **#13 Keshanta (Godana)** | `src/assets/images/library/banners/banner-altar.png` | Adult chastity vow & cow donation |
| **#14 Samavartana** | `src/assets/images/library/cards/card-samskara.jpg` | Graduation from Gurukul as Snataka |
| **#15 Vivaha** | `src/assets/images/guidance-marriage.png` | Sacred Vedic marriage with Saptapadi |
| **#16 Antyeshti** | `src/assets/images/puja-ganga.jpg` | Final sacrifice returning body to Panchamahabhutas |

---

## 4. Modified & Redesigned Components

1. **`specialPujaData.js`:**
   - Bundles all local asset imports and exports `SPECIAL_PUJA_IMAGES` registry.
   - Refined copy to eliminate excessive paragraph text in cards.
   - Added `categoryBadge`, `image`, and structured metadata to all 16 Samskars, 4 Birthday services, 5 Pinda Daan Tirthas, and 4 Tirth Shradh ceremonies.
2. **`SpecialPujaLanding.jsx`:**
   - Completely redesigned with 10 visual sections:
     - Section A: Visual Hero with dual CTAs and trust micro-indicators.
     - Section B: 4 Image-rich category cards with zoom and gold badges.
     - Section C: 16 Samskars grid with interactive life-stage filter tabs (All, Pre-natal, Infancy, Childhood, Student Life, Householder, Final Transition).
     - Section D: Birthday Puja visual section with Vedic Janma Tithi explanation and 4 service cards.
     - Section E: Pinda Daan pilgrimage section with 5 holy Tirthas and a 4-step Vidhi strip.
     - Section F: Tirth Shradh section showcasing Mahalaya, Tripindi, Narayan Bali, and Amavasya Tarpana.
     - Section G: Why Choose Veda Structure with 4 trust pillars.
     - Section H: How It Works horizontal stepper.
     - Section I: FAQ accordion with chevron indicators.
     - Section J: Final CTA with atmospheric ritual photo backdrop.
3. **`SpecialPujaCategoryPage.jsx`:**
   - Breadcrumb navigation and large category hero banner with prominent image.
   - Life-stage filter tabs and responsive card grid with consistent heights.
   - Rich presentation for Samskars, Birthday Pujas, Pinda Daan, and Tirth Shradh.
4. **`SpecialPujaServiceDetail.jsx`:**
   - Aligned directly with `PujaServiceDetails.jsx`:
     - Breadcrumbs: Home > Yagya & Puja > Special Puja > Shodasha Samskars > [Samskar Name].
     - Hero with large framed image, serial number badge, timing/priest/duration pills, and primary booking CTA.
     - 8-column main content area with Shastric meaning, spiritual fruits, numbered Vidhi steps, samagri grid, and 4 feature highlights.
     - 4-column sticky booking and inquiry card with direct helpline link.
     - Previous & next Samskar navigation at bottom.

---

## 5. Verification & Testing

1. **Automated QA Test Suite:**
   - Script: `frontend-user1/src/features/yagyaPuja/tests/testSpecialPujaFrontend.cjs`
   - All 4 categories, all 16 Samskars in exact sequence, navbar tab, 7 routes, and all 10 landing sections passed with **exit code 0**.
2. **Production Vite Build:**
   - Command: `npm --prefix frontend-user1 run build`
   - Compiled with **exit code 0** in **19.60s** with zero errors. All asset chunks and routes generated successfully.
