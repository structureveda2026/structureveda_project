import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getYagyaBySlug, YAGYA_LIST } from "../data/yagyaData";
import YagyaHero from "../components/YagyaHero";
import YagyaAbout from "../components/YagyaAbout";
import YagyaProcedure from "../components/YagyaProcedure";
import YagyaCard from "../components/YagyaCard";

const YagyaDetails = () => {
  const { slug } = useParams();
  const yagya = getYagyaBySlug(slug);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!yagya) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
        <div>
          <h2 className="font-serif text-[28px] font-bold text-[#2b241d]">
            Sacred Yagya Not Found
          </h2>
          <p className="mt-2 text-[14px] text-[#75695c]">
            The requested Yagya ceremony could not be located.
          </p>
          <Link
            to="/yagya"
            className="mt-5 inline-block rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-sm hover:bg-[#dda018]"
          >
            Browse All Vedic Yagyas
          </Link>
        </div>
      </div>
    );
  }

  // Related Yagyas (exclude current)
  const relatedYagyas = YAGYA_LIST.filter((y) => y.slug !== yagya.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* 1. HERO / TWO-COLUMN GALLERY & BOOKING EXPERIENCE */}
      <YagyaHero yagya={yagya} />

      {/* 2. ABOUT THE YAGYA */}
      <YagyaAbout yagya={yagya} />

      {/* 3. STEP-BY-STEP SACRED PROCEDURE */}
      <YagyaProcedure procedureSteps={yagya.procedureSteps} />

      {/* 4. EXPLORE OTHER SACRED YAGYAS */}
      {relatedYagyas.length > 0 && (
        <section className="border-b border-[#ead8b8] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                  SACRED CEREMONIES
                </span>
                <h2 className="mt-1 font-serif text-[24px] font-bold text-[#2b241d] sm:text-[30px]">
                  Explore Other Vedic Yagyas
                </h2>
              </div>

              <Link
                to="/yagya"
                className="text-[13px] font-bold text-[#c77722] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedYagyas.map((item) => (
                <YagyaCard key={item.id} yagya={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default YagyaDetails;
