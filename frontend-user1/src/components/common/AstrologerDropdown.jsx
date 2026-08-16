import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import vishalImage from "../../assets/images/e-3.jpg";

const AstrologerDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[14px] font-medium text-[#5f554a] transition-colors hover:text-[#c88918]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Talk to an Astrologer
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-[380px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-hidden rounded-2xl border-2 border-[#e3ca97] bg-[#fffdf9] shadow-[0_16px_48px_rgba(80,60,30,0.15)]">
            {/* Header */}
            <div className="border-b border-[#eee1ca] bg-gradient-to-r from-[#faf6ed] to-[#fffdf9] px-5 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                Talk to an Astrologer
              </p>
            </div>

            {/* Content */}
            <Link
              to="/astrologers/vishal-bhardwaj"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group block p-5 transition-all hover:bg-[#faf6ed]"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#e3ca97] bg-[#f8e7c2] transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={vishalImage}
                    alt="Vishal Bhardwaj"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b241d]/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-[18px] font-semibold leading-tight text-[#2b241d]">
                    Vishal Bhardwaj
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#75695c]">
                    Vedic Astrologer | Jyotish Consultant
                  </p>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8a7c6b]">
                      <MapPin size={13} className="shrink-0 text-[#c88918]" />
                      <span>Kashi / Varanasi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8a7c6b]">
                      <Briefcase size={13} className="shrink-0 text-[#c88918]" />
                      <span>10+ Years Experience</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e3ca97] bg-[#fffaf0] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#c88918]" />
                      <div>
                        <p className="text-[10px] text-[#8a7c6b]">30-Min Consultation</p>
                        <p className="font-serif text-[16px] font-semibold text-[#2b241d]">₹1,100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Profile Button */}
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#eab12c] px-4 py-2.5 text-[12px] font-semibold text-[#2b241d] transition-all group-hover:bg-[#dca522]">
                <span>View Profile</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologerDropdown;
