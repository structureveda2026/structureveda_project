import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";

const Favorites = () => {
  return (
    <div className="min-h-[70vh] bg-[#fffaf0] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-[680px]">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#faf6ed]">
              <Heart size={36} className="text-[#c88918]" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mt-6 font-serif text-[38px] text-[#2b241d] sm:text-[44px]">
            Your Favorites
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-[#75695c]">
            Your saved astrologers will appear here.
          </p>
        </div>

        {/* Empty State */}
        <div className="mt-10 rounded-2xl border-2 border-[#e3ca97] bg-white p-8 text-center sm:p-10">
          <p className="text-[14px] leading-7 text-[#675b50]">
            You haven't added any astrologers to your favorites yet.
            <br />
            Explore our astrologers and save your favorites for quick access.
          </p>

          <Link
            to="/astrologers"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-6 py-3 text-[14px] font-semibold text-[#2b241d] transition-all hover:bg-[#dca522]"
          >
            <Search size={18} />
            Explore Astrologers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
