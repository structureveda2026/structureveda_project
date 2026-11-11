import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import cardYagyaFireImg from "../../../assets/images/library/cards/card-yagya-fire.jpg";
import yagyaSacredFireCardImg from "../../../assets/images/yagya_sacred_fire_card.jpg";
import yagyaFireRitualImg from "../../../assets/images/yagya/yagya-fire-ritual.webp.png";
import yagyaPurnahutiImg from "../../../assets/images/yagya/yagya-purnahuti.webp.png";
import yagyaSacredFireDetailImg from "../../../assets/images/yagya/yagya-sacred-fire-detail.webp.png";
import bannerFireRitualImg from "../../../assets/images/library/banners/banner-fire-ritual.png";
import bannerRitualSetupImg from "../../../assets/images/library/banners/banner-ritual-setup.png";

// Authentic Vedic Homa / Fire Ceremony imagery mapping
const CATEGORY_SLUG_IMAGES = {
  "shiva-rudra-homa": yagyaFireRitualImg,
  "ganapati-homa": yagyaSacredFireDetailImg,
  "durga-chandi-homa": yagyaPurnahutiImg,
  "lakshmi-kubera-homa": cardYagyaFireImg,
  "navagraha-planetary-homa": yagyaSacredFireCardImg,
  "vastu-griha-homa": bannerFireRitualImg,
  "ayushya-longevity-homa": bannerRitualSetupImg,
};

const defaultHomaImg = yagyaSacredFireCardImg;

/**
 * HomaCategoryCard Component
 * Editorial Vedic Category Card following the Puja/Yagya/Japa design system:
 * 1. Category Image (aspect-[16/10], object-cover, rounded top corners)
 * 2. Centered Category Name & Description
 * 3. Subtle Divider
 * 4. Centered "Explore Homa →" CTA
 *
 * Navigates to /yagya-puja/homa/category/:categorySlug.
 */
const HomaCategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  if (!category) return null;

  const fallbackSrc = CATEGORY_SLUG_IMAGES[category.slug] || defaultHomaImg;
  const imageSrc = !imageError && category.image ? category.image : fallbackSrc;

  return (
    <Link
      to={`/yagya-puja/homa/category/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#B7791F] hover:bg-[#FFFAF0] hover:shadow-[0_12px_24px_rgba(183,121,31,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F]"
    >
      {/* 1. Category Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F8EEDD]">
        <img
          src={imageSrc}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      {/* 2. Card Content: Category Name + Description + Subtle Divider + Centered CTA */}
      <div className="flex flex-1 flex-col items-center justify-between p-5 text-center sm:p-6">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-[#29231B] transition-colors group-hover:text-[#B7791F] sm:text-[19px]">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#766D60]">
              {category.description}
            </p>
          )}
        </div>

        {/* 3. Subtle Divider & Centered CTA */}
        <div className="mt-4 flex w-full justify-center border-t border-[#F2E6D5] pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#B7791F] transition-colors group-hover:text-[#C77722]">
            <span>Explore Homa</span>
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

export default HomaCategoryCard;
