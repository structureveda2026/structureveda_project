import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import defaultJapaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import mantraImg from "../../../assets/images/c-mantra.jpg";
import deviDurgaImg from "../../../assets/images/devi_durga_card.jpg";
import deityHanumanImg from "../../../assets/images/deity-hanuman.jpg";

// Deterministic fallback images for known canonical Japa categories
const CATEGORY_SLUG_IMAGES = {
  "shiva-mantra-japa": pujaMrityunjayaImg,
  "gayatri-vedic-japa": mantraImg,
  "durga-shakti-japa": deviDurgaImg || pujaRudrabhishekImg,
  "hanuman-raksha-japa": deityHanumanImg || pujaVishnuImg,
  "ganapati-siddhi-japa": pujaGaneshImg,
  "lakshmi-prosperity-japa": pujaLakshmiImg,
  "navagraha-planetary-japa": pujaNavagrahaImg,
};

/**
 * JapaCategoryCard Component
 * Editorial Vedic Category Card following the Puja/Yagya design system:
 * 1. Category Image (aspect-[16/10], object-cover, rounded top corners)
 * 2. Centered Category Name
 * 3. Subtle Divider
 * 4. Centered "Explore Japa ->" CTA
 *
 * Navigates to /yagya-puja/japa/category/:categorySlug.
 */
const JapaCategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  if (!category) return null;

  const fallbackSrc = CATEGORY_SLUG_IMAGES[category.slug] || defaultJapaImg;
  const imageSrc = !imageError && category.image ? category.image : fallbackSrc;

  return (
    <Link
      to={`/yagya-puja/japa/category/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#ead8bc] bg-[#fffdfa] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b77920] hover:bg-[#fffcf7] hover:shadow-[0_12px_24px_rgba(183,121,32,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920]"
    >
      {/* 1. Category Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5ecd9]">
        <img
          src={imageSrc}
          alt={category.name}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241a12]/60 via-[#241a12]/10 to-transparent" />
      </div>

      {/* 2. Content Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 text-center">
        <div>
          <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#30251c] transition-colors duration-300 group-hover:text-[#b77920] line-clamp-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6b5845] line-clamp-2">
              {category.description}
            </p>
          )}
        </div>

        {/* 3. Subtle Divider & 4. Centered Explore CTA */}
        <div className="mt-3.5 border-t border-[#ead8bc] pt-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#b77920] transition-colors duration-300 group-hover:text-[#8f5211]">
            <span>Explore Japa</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JapaCategoryCard;
