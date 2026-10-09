import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import defaultPathImg from "../../../assets/images/c-gita.jpg";
import gitaImg from "../../../assets/images/c-gita.jpg";
import rudrakshaImg from "../../../assets/images/p-rudraksha.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";

// Deterministic fallback images for canonical Path categories
const CATEGORY_SLUG_IMAGES = {
  "ramayana-manas-path": rudrakshaImg,
  "shiva-rudri-path": pujaRudrabhishekImg,
  "durga-shakta-path": pujaLakshmiImg,
  "bhagavad-gita-scripture": gitaImg,
  "vishnu-suktam-path": pujaVishnuImg,
  "lakshmi-stotra-path": pujaLakshmiImg,
  "surya-solar-path": pujaNavagrahaImg,
};

/**
 * PathCategoryCard Component
 * Editorial Vedic Category Card following the Puja/Yagya/Japa/Homa design system:
 * 1. Category Image (aspect-[16/10], object-cover, rounded top corners)
 * 2. Centered Category Name & Description
 * 3. Subtle Divider
 * 4. Centered "Explore Path →" CTA
 *
 * Navigates to /yagya-puja/path/category/:categorySlug.
 */
const PathCategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  if (!category) return null;

  const fallbackSrc = CATEGORY_SLUG_IMAGES[category.slug] || defaultPathImg;
  const imageSrc = !imageError && category.image ? category.image : fallbackSrc;

  // Optional service count when supported by API
  const serviceCount =
    typeof category.serviceCount === "number"
      ? category.serviceCount
      : typeof category.count === "number"
      ? category.count
      : null;

  return (
    <Link
      to={`/yagya-puja/path/category/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_12px_24px_rgba(199,119,34,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
    >
      {/* 1. Category Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f4ecd8]">
        <img
          src={imageSrc}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {serviceCount !== null && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#2b241d]/85 px-2.5 py-0.5 text-[11px] font-semibold text-[#f7ecd5] backdrop-blur-xs">
            {serviceCount} {serviceCount === 1 ? "Recitation" : "Recitations"}
          </span>
        )}
      </div>

      {/* 2. Card Content: Category Name + Description + Subtle Divider + Centered CTA */}
      <div className="flex flex-1 flex-col items-center justify-between p-5 text-center sm:p-6">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722] sm:text-[19px]">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#685c4f]">
              {category.description}
            </p>
          )}
        </div>

        {/* 3. Subtle Divider & Centered CTA */}
        <div className="mt-4 flex w-full justify-center border-t border-[#f2e6d5] pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] transition-colors group-hover:text-[#c77722]">
            <span>Explore Path</span>
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PathCategoryCard;
