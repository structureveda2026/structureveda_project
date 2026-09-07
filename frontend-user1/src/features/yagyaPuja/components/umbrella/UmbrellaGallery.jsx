import { useState } from "react";
import { Sparkles } from "lucide-react";

import pujaDevotionalAltarImg from "../../../../assets/images/puja/puja-devotional-altar.webp.png";
import yagyaFireRitualImg from "../../../../assets/images/yagya/yagya-fire-ritual.webp.png";
import pujaPanditImg from "../../../../assets/images/puja/puja-pandit.webp.png";
import pujaSankalpaImg from "../../../../assets/images/puja/puja-sankalpa.webp.png";
import pujaPrasadImg from "../../../../assets/images/puja/puja-prasad.webp.png";
import pujaGangaImg from "../../../../assets/images/puja-ganga.jpg";

/**
 * SECTION 11: RITUAL GALLERY
 * Visual showcase of real ritual arrangements, sacred fire, pandit teams, and consecrated prasad.
 */
const UmbrellaGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Moments" },
    { id: "puja", label: "Puja Setup" },
    { id: "yagya", label: "Yagya & Havan" },
    { id: "acharya", label: "Acharyas" },
    { id: "sankalp", label: "Sankalp" },
    { id: "prasad", label: "Prasadam" },
  ];

  const galleryItems = [
    {
      title: "Consecrated Temple Altar",
      category: "puja",
      categoryLabel: "Puja Setup",
      image: pujaDevotionalAltarImg,
    },
    {
      title: "Sacred Fire Havan Kund",
      category: "yagya",
      categoryLabel: "Yagya & Havan",
      image: yagyaFireRitualImg,
    },
    {
      title: "Learned Vedic Acharyas",
      category: "acharya",
      categoryLabel: "Acharyas",
      image: pujaPanditImg,
    },
    {
      title: "Personal Gotra Sankalpa",
      category: "sankalp",
      categoryLabel: "Sankalp",
      image: pujaSankalpaImg,
    },
    {
      title: "Sanctified Prasadam & Bhasma",
      category: "prasad",
      categoryLabel: "Prasadam",
      image: pujaPrasadImg,
    },
    {
      title: "Kashi Ganga Tirtha Aradhana",
      category: "puja",
      categoryLabel: "Puja Setup",
      image: pujaGangaImg,
    },
  ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              SACRED RITUAL GLIMPSES
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Ritual <span className="text-[#c77722]">Gallery</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[660px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Authentic photographs of consecrated ritual setups, learned Vedic purohits, and sacred offerings across Varanasi and holy kshetras.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-[12px] sm:text-[12.5px] font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#eab12c] text-[#1c1308] shadow-[0_2px_10px_rgba(234,177,44,0.3)]"
                  : "border border-[#ead8b8] bg-[#fffdfa] text-[#65584a] hover:border-[#b36c1e] hover:text-[#2b241d]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid (6 Items) */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#1c1209] shadow-[0_2px_12px_rgba(60,40,15,0.05)]"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-[#faf4e8]">
                  <span className="inline-block rounded-full bg-[#180f08]/80 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#f5ce6f] border border-[#eab12c]/40 backdrop-blur-xs mb-1.5">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-[17px] font-bold leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UmbrellaGallery;
