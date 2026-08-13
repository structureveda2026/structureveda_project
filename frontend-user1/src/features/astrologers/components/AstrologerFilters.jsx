import { Search } from "lucide-react";

const expertiseFilters = ["All", "Available Now", "Vedic Astrology", "Vastu", "Tarot", "Numerology", "Marriage", "Career", "Finance", "Relationships"];
const languages = ["All languages", "Hindi", "English", "Sanskrit", "Marathi", "Kannada"];

const AstrologerFilters = ({ search, onSearchChange, activeFilter, onFilterChange, language, onLanguageChange, priceLimit, onPriceLimitChange }) => (
  <div className="rounded-[20px] border border-[#e6d3ab] bg-[#fffdf9] p-4 shadow-[0_10px_28px_rgba(80,60,30,0.04)] sm:p-5">
    <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px]">
      <label className="relative block"><span className="sr-only">Search astrologers</span><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d8172]" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by astrologer or expertise" className="h-12 w-full rounded-xl border border-[#e5dac6] bg-[#fffaf0] pl-11 pr-4 text-[13px] outline-none transition focus:border-[#c88918] focus:ring-4 focus:ring-[#d6a13b]/10" /></label>
      <label className="sr-only" htmlFor="astrologer-language">Filter by language</label><select id="astrologer-language" value={language} onChange={(event) => onLanguageChange(event.target.value)} className="h-12 rounded-xl border border-[#e5dac6] bg-[#fffaf0] px-3 text-[13px] text-[#5f554a] outline-none focus:border-[#c88918]">{languages.map((item) => <option key={item}>{item}</option>)}</select>
      <label className="sr-only" htmlFor="astrologer-price">Filter by price</label><select id="astrologer-price" value={priceLimit} onChange={(event) => onPriceLimitChange(event.target.value)} className="h-12 rounded-xl border border-[#e5dac6] bg-[#fffaf0] px-3 text-[13px] text-[#5f554a] outline-none focus:border-[#c88918]"><option value="">Any price</option><option value="20">Up to ₹20/min</option><option value="25">Up to ₹25/min</option></select>
    </div>
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{expertiseFilters.map((filter) => <button type="button" key={filter} onClick={() => onFilterChange(filter)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition ${activeFilter === filter ? "border-[#c88918] bg-[#eab12c] text-[#2b241d]" : "border-[#e5d3b2] bg-white text-[#6f6255] hover:border-[#d6a13b]"}`}>{filter}</button>)}</div>
  </div>
);

export default AstrologerFilters;
