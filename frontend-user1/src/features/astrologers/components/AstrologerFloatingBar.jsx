import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const AstrologerFloatingBar = ({
  astrologerImage,
  astrologerName = "Vishal Bhardwaj",
  rating = "4.9 ★",
  expertiseText = "Vedic Astrology",
  price = "₹1,100",
  buttonText = "Book Now",
  showStickyBar: controlledShow,
  scrollThreshold = 480,
  onBookConsultation,
}) => {
  const [internalShow, setInternalShow] = useState(false);

  useEffect(() => {
    if (controlledShow !== undefined) return;

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setInternalShow(true);
      } else {
        setInternalShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controlledShow, scrollThreshold]);

  const isVisible = controlledShow !== undefined ? controlledShow : internalShow;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[92%] max-w-[620px] -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-6 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-[#eab12c]/50 bg-[#1e150ee6] p-2.5 pl-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.38)] backdrop-blur-lg">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#eab12c]/70 shadow-sm">
            {astrologerImage && (
              <img
                src={astrologerImage}
                alt={astrologerName}
                className="h-full w-full object-cover object-top"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-serif text-[15px] font-semibold text-[#fffaf0]">
                {astrologerName}
              </p>
              {rating && (
                <span className="hidden rounded bg-[#eab12c]/20 px-1.5 py-0.5 text-[9.5px] font-bold text-[#f5ce6f] sm:inline">
                  {rating}
                </span>
              )}
            </div>
            <p className="truncate text-[11px] text-[#c7b9a5]">
              {expertiseText} • Starting{" "}
              <strong className="text-[#eab12c]">{price}</strong>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onBookConsultation}
            className="group flex items-center gap-1.5 rounded-full bg-[#eab12c] px-4 py-2 text-[12.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dfa420] sm:px-5 sm:py-2.5 sm:text-[13px]"
          >
            <span>{buttonText}</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AstrologerFloatingBar;
