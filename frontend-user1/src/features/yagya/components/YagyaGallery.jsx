import { useState } from "react";
import { Sparkles, MapPin } from "lucide-react";

const YagyaGallery = ({ yagya }) => {
  if (!yagya) return null;

  const images = Array.isArray(yagya.images) && yagya.images.length > 0
    ? yagya.images
    : [yagya.image].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-3.5">
      {/* Primary Featured Image Frame */}
      <div className="group relative overflow-hidden rounded-[26px] sm:rounded-[30px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 sm:p-2.5 shadow-[0_16px_45px_rgba(80,60,30,0.08)] transition-all duration-500 hover:border-[#d4872b]/70 hover:shadow-[0_20px_50px_rgba(212,135,43,0.12)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#241a12]">
          <img
            src={images[activeImageIndex] || yagya.image}
            alt={`${yagya.name} - view ${activeImageIndex + 1}`}
            className="h-full w-full object-cover object-center transition-all duration-500"
          />

          {/* Subtle Bottom Gradient Scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-black/20" />

          {/* Floating Badge (Top Left) */}
          {yagya.badge && (
            <div className="absolute left-4 top-4 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#1c130b]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-sm">
                <Sparkles size={11} className="text-[#eab12c]" />
                {yagya.badge}
              </span>
            </div>
          )}

          {/* Floating Location / Deity Pill (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-medium text-[#f0e3ce] backdrop-blur-xs shadow-sm">
              <MapPin size={13} className="shrink-0 text-[#eab12c]" />
              <span className="truncate">{yagya.location || "Kashi Vishwanath Kshetra"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails Row (if multiple images available) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 p-1 transition-all duration-300 ${
                activeImageIndex === idx
                  ? "border-[#d4872b] bg-[#fffdfa] shadow-md scale-102 ring-2 ring-[#eab12c]/40"
                  : "border-[#e6caa0]/70 bg-white opacity-70 hover:opacity-100 hover:border-[#d4872b]/60"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full rounded-xl object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default YagyaGallery;
