import { useState, useMemo } from "react";
import { Sparkles, Calendar, MapPin, ShieldCheck, Video, PackageCheck, Award } from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";
import PujaCard from "../components/PujaCard";
import PujaFilters from "../components/PujaFilters";
import pujaBgImage from "../../../assets/images/puja_bg_image.jpg";

const PujaListing = () => {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDeity, setSelectedDeity] = useState("All Deities");
  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedSort, setSelectedSort] = useState("date-asc");

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedLocation !== "All Locations") count++;
    if (selectedDeity !== "All Deities") count++;
    if (selectedPurpose !== "All Purposes") count++;
    return count;
  }, [selectedLocation, selectedDeity, selectedPurpose]);

  const handleResetFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedDeity("All Deities");
    setSelectedPurpose("All Purposes");
    setSelectedSort("date-asc");
  };

  // Filter and sort items
  const filteredPujas = useMemo(() => {
    return PUJA_LIST.filter((puja) => {
      if (selectedLocation !== "All Locations" && puja.location !== selectedLocation) {
        return false;
      }
      if (selectedDeity !== "All Deities" && puja.deity !== selectedDeity) {
        return false;
      }
      if (selectedPurpose !== "All Purposes" && puja.purposeCategory !== selectedPurpose) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === "price-asc") {
        return a.startingPrice - b.startingPrice;
      }
      if (selectedSort === "price-desc") {
        return b.startingPrice - a.startingPrice;
      }
      // date-asc
      return new Date(a.date) - new Date(b.date);
    });
  }, [selectedLocation, selectedDeity, selectedPurpose, selectedSort]);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24">
      {/* =========================================================
          PAGE HEADER / CINEMATIC HERO BANNER WITH PUJA BG IMAGE
      ========================================================== */}
      <section className="relative overflow-hidden border-b border-[#ead8b8] bg-[#1a1109] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Background Image with Layered Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src={pujaBgImage}
            alt="Sacred Puja Backdrop"
            className="h-full w-full object-cover object-center scale-105 filter brightness-[0.78] contrast-[1.08] transition-transform duration-1000 ease-out"
          />
          {/* Rich Ambient Gradient Overlays for High Legibility & Warm Spiritual Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#170e06]/92 via-[#1c1208]/80 to-[#170e06]/92" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120a04]/80 via-transparent to-[#fffaf0]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#eab12c]/15 via-transparent to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-[1100px] text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5cf73]/40 bg-[#2b1b0e]/85 px-4 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <Sparkles size={13} className="text-[#f7c844]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#fce59f]">
              Kashi Vishwanath & Sacred Dhams
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-5 font-serif text-[38px] font-bold leading-[1.12] tracking-[-0.02em] text-[#fffdf8] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:text-[52px] lg:text-[62px]">
            Upcoming Sacred Puja & Yagya
          </h1>

          {/* Supporting Text */}
          <p className="mx-auto mt-4 max-w-[760px] text-[15.5px] leading-relaxed text-[#f3e3cd] drop-shadow-sm sm:text-[17px]">
            Participate in authentic Vedic rituals performed on the holy banks of River Ganga in Kashi and sacred Dhams. Receive personalized Sankalp with your Name & Gotra, video updates, and energized holy Prasadam delivered to your doorstep.
          </p>

          {/* Quick Highlight Pillars */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 rounded-full border border-[#f5cf73]/25 bg-[#26170c]/75 px-4 py-2 text-[12.5px] font-semibold text-[#fae9cb] backdrop-blur-sm shadow-sm">
              <Award size={15} className="text-[#f5ce6f]" />
              <span>100% Authentic Vedic Vidhi</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#f5cf73]/25 bg-[#26170c]/75 px-4 py-2 text-[12.5px] font-semibold text-[#fae9cb] backdrop-blur-sm shadow-sm">
              <ShieldCheck size={15} className="text-[#f5ce6f]" />
              <span>Personalized Sankalp (Name & Gotra)</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#f5cf73]/25 bg-[#26170c]/75 px-4 py-2 text-[12.5px] font-semibold text-[#fae9cb] backdrop-blur-sm shadow-sm">
              <Video size={15} className="text-[#f5ce6f]" />
              <span>HD Video & Photos</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#f5cf73]/25 bg-[#26170c]/75 px-4 py-2 text-[12.5px] font-semibold text-[#fae9cb] backdrop-blur-sm shadow-sm">
              <PackageCheck size={15} className="text-[#f5ce6f]" />
              <span>Energized Prasadam Shipped Home</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT AREA (FILTERS & CARDS GRID)
      ========================================================== */}
      <div className="mx-auto max-w-[1280px] px-5 pt-10 sm:px-8 lg:px-12">
        {/* Filters Bar */}
        <PujaFilters
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedDeity={selectedDeity}
          setSelectedDeity={setSelectedDeity}
          selectedPurpose={selectedPurpose}
          setSelectedPurpose={setSelectedPurpose}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-[13px] text-[#75695c]">
          <span>
            Showing <strong className="text-[#2b241d]">{filteredPujas.length}</strong> upcoming sacred rituals
          </span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[12px] font-semibold text-[#c77722] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Pujas Grid */}
        {filteredPujas.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center">
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              No matching rituals found
            </h3>
            <p className="mt-2 text-[14px] text-[#75695c]">
              Try adjusting your filter criteria to discover more upcoming Vedic ceremonies.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PujaListing;
