import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import defaultPujaImg from "../../../assets/images/puja-kashi.jpg";
import ganeshImg from "../../../assets/images/puja-ganesh.jpg";
import lakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import shivaImg from "../../../assets/images/puja-rudrabhishek.jpg";
import vishnuImg from "../../../assets/images/puja-vishnu.jpg";
import navagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import specialImg from "../../../assets/images/puja-ganga.jpg";

// Fallback images per category slug if category.image is not provided
const CATEGORY_SLUG_IMAGES = {
  "ganesh-puja": ganeshImg,
  "shiva-puja": shivaImg,
  "lakshmi-prosperity-puja": lakshmiImg,
  "vishnu-narayan-puja": vishnuImg,
  "navagraha-planetary-puja": navagrahaImg,
  "special-occasion-puja": specialImg,
  "durga-shakti-puja": shivaImg,
  "marriage-family-puja": lakshmiImg,
};

/**
 * PujaCategoryCard Component
 * Visual Hierarchy:
 * 1. Category Image (clean, aspect-[16/10], object-cover, rounded top)
 * 2. Category Name (prominent typography, easy to scan)
 * 3. Explore Pujas → CTA (consistent across all cards)
 *
 * Entire card behaves as a link navigating to /yagya-puja/puja/category/:categorySlug.
 */
const PujaCategoryCard = ({ category }) => {
  if (!category) return null;

  const imageSrc = category.image || CATEGORY_SLUG_IMAGES[category.slug] || defaultPujaImg;

  return (
    <Link
      to={`/yagya-puja/puja/category/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_12px_24px_rgba(199,119,34,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
    >
      {/* 1. Category Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f4ecd8]">
        <img
          src={imageSrc}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* 2. Card Content: Category Name + Subtle Divider + Centered CTA */}
      <div className="flex flex-1 flex-col items-center justify-between p-5 text-center sm:p-6">
        <h3 className="font-serif text-[18px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722] sm:text-[19px]">
          {category.name}
        </h3>

        {/* 3. Subtle Divider & Centered CTA */}
        <div className="mt-4 flex w-full justify-center border-t border-[#f2e6d5] pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] transition-colors group-hover:text-[#c77722]">
            <span>Explore Pujas</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PujaCategoryCard;

