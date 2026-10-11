import { Link } from "react-router-dom";
import { SearchX, UserPlus, RotateCcw } from "lucide-react";
import ProfessionalProfileCard from "./ProfessionalProfileCard";

const CommunityDirectory = ({ profiles = [], onClearFilters }) => {
  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#ebdcc2] p-8 sm:p-14 text-center max-w-xl mx-auto shadow-[0_4px_24px_rgba(43,36,29,0.06)] my-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#faeed8] to-[#f5dfb8] border border-[#ebdcc2] flex items-center justify-center mx-auto text-[#b35d14] mb-5 shadow-xs">
          <SearchX className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b241d] mb-2.5">
          No Vedic Experts Found
        </h3>
        <p className="text-sm text-[#665342] leading-relaxed mb-6 max-w-md mx-auto">
          We couldn&apos;t find any spiritual professionals matching your active search keywords or filter criteria. Try broadening your role, city, or expertise selection.
        </p>

        {/* Suggested Quick Searches */}
        <div className="p-3.5 rounded-xl bg-[#fffdfa] border border-[#f0e4cf] mb-6 max-w-sm mx-auto text-xs text-[#7a6452]">
          <span className="font-semibold text-[#2b241d] mr-2">Try searching:</span>
          <span className="inline-flex gap-1.5 flex-wrap justify-center mt-1">
            <span className="px-2 py-0.5 rounded bg-[#faeed8] text-[#8a4e17]">Varanasi</span>
            <span className="px-2 py-0.5 rounded bg-[#faeed8] text-[#8a4e17]">Kundli Analysis</span>
            <span className="px-2 py-0.5 rounded bg-[#faeed8] text-[#8a4e17]">Maha Rudrabhishek</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#9b4e10]/20 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
          <Link
            to="/community/create-profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#fffdfa] hover:bg-[#faeed8] text-[#7a4010] font-semibold text-xs sm:text-sm border border-[#ebdcc2] transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Your Profile</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
      {profiles.map((profile) => (
        <ProfessionalProfileCard key={profile.id || profile.slug} profile={profile} />
      ))}
    </div>
  );
};

export default CommunityDirectory;
