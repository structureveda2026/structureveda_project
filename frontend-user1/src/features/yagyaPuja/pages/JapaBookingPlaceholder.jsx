import { useParams, Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

/**
 * Temporary lightweight placeholder for Phase J3-A routing verification.
 * Full Japa booking wizard flow will be implemented in Phase J3-B.
 */
const JapaBookingPlaceholder = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center bg-[#fffaf0]">
      <div className="max-w-md w-full rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
          <Sparkles size={28} />
        </div>
        <h2 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
          Japa Booking Configuration
        </h2>
        <p className="mt-2 text-[14px] text-[#685c4f]">
          Ceremonial booking setup for{" "}
          <span className="font-semibold text-[#b36c1e]">{slug}</span> will be
          integrated in Phase J3-B.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to={`/yagya-puja/japa/${slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#c77722] px-6 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#a8641b]"
          >
            <ArrowLeft size={14} />
            <span>Return to Japa Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JapaBookingPlaceholder;
