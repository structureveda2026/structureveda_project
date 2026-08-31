import YagyaGallery from "./YagyaGallery";
import YagyaBookingPanel from "./YagyaBookingPanel";

const YagyaHero = ({ yagya }) => {
  if (!yagya) return null;

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:px-12">
      {/* Warm Ambient Spiritual Glow */}
      <div className="pointer-events-none absolute -left-20 top-10 h-[380px] w-[380px] rounded-full bg-[#eab12c]/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-[#d4872b]/8 blur-[90px]" />

      <div className="relative mx-auto max-w-[1340px]">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: INTERACTIVE IMAGE GALLERY
          ========================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28">
            <YagyaGallery yagya={yagya} />
          </div>

          {/* =========================================================
              RIGHT COLUMN: YAGYA DETAILS & INTERACTIVE BOOKING
          ========================================================== */}
          <div className="lg:col-span-7 xl:col-span-7">
            <YagyaBookingPanel yagya={yagya} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default YagyaHero;
