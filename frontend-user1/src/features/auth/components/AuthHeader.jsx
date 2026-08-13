import { Link } from "react-router-dom";

const AuthHeader = ({ activeTab, title, subtitle }) => {
  return (
    <header>
      <div className="mb-7 text-center">
        <div className="mb-5 flex items-center justify-center">
          <span className="font-serif text-[19px] font-medium tracking-[0.08em] text-[#17130f]">
            VEDA STRUCTURE
          </span>
        </div>

        <p className="font-serif text-[34px] font-normal leading-tight tracking-[-0.02em] text-[#17130f] sm:text-[38px]">
          {title}
        </p>

        <p className="mt-3 text-[14px] leading-6 text-[#62594e]">{subtitle}</p>
      </div>

      <nav
        aria-label="Authentication pages"
        className="relative mb-8 flex h-[52px] overflow-hidden rounded-[12px] border border-[#eadfc9] bg-[#f5ead4] p-1"
      >
        <div
          className="
            absolute bottom-1 left-1 top-1
            w-[calc(50%-4px)]
            rounded-[9px]
            bg-[#fffdf9]
            shadow-[0_2px_8px_rgba(55,42,25,0.08)]
            transition-transform
            duration-300
            ease-out
          "
          style={{
            transform:
              activeTab === "signup" ? "translateX(100%)" : "translateX(0)",
          }}
        />

        <Link
          to="/login"
          className={`
            relative z-10
            flex flex-1
            items-center justify-center
            text-[14px]
            font-semibold
            text-[#17130f]
            transition
          `}
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className={`
            relative z-10
            flex flex-1
            items-center justify-center
            text-[14px]
            font-semibold
            text-[#17130f]
            transition
          `}
        >
          Create account
        </Link>
      </nav>
    </header>
  );
};

export default AuthHeader;
