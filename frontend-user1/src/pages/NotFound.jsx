import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf0] px-5 py-16">
      <div className="mx-auto max-w-[580px] text-center">
        {/* 404 Number */}
        <p className="font-serif text-[120px] font-bold leading-none text-[#e3ca97]">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-6 font-serif text-[36px] text-[#2b241d] sm:text-[42px]">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-4 text-[15px] leading-7 text-[#75695c]">
          The page you're looking for could not be found. It may have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-6 py-3 text-[14px] font-semibold text-[#2b241d] transition-all hover:bg-[#dca522]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            to="/astrologers"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#e3ca97] bg-white px-6 py-3 text-[14px] font-semibold text-[#2b241d] transition-all hover:border-[#c88918] hover:text-[#c88918]"
          >
            <Search size={18} />
            Explore Astrologers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
