import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import AstrologerCard from "../components/AstrologerCard";
import AstrologerFilters from "../components/AstrologerFilters";
import { mockAstrologers } from "../data/astrologers";

const Astrologers = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [language, setLanguage] = useState("All languages");
  const [priceLimit, setPriceLimit] = useState("");
  const filteredAstrologers = useMemo(() => mockAstrologers.filter((astrologer) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || astrologer.name.toLowerCase().includes(term) || astrologer.expertise.some((item) => item.toLowerCase().includes(term));
    const matchesFilter = activeFilter === "All" || (activeFilter === "Available Now" ? astrologer.online : astrologer.expertise.includes(activeFilter));
    const matchesLanguage = language === "All languages" || astrologer.languages.includes(language);
    return matchesSearch && matchesFilter && matchesLanguage && (!priceLimit || astrologer.pricePerMinute <= Number(priceLimit));
  }), [activeFilter, language, priceLimit, search]);
  const availableNow = filteredAstrologers.filter((astrologer) => astrologer.online);

  return <section className="min-h-screen bg-[#fffaf0] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"><div className="mx-auto max-w-[1240px]"><div className="max-w-[710px]"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]"><Sparkles size={14} />Personal guidance</p><h1 className="mt-3 font-serif text-[46px] leading-[0.98] text-[#2b241d] sm:text-[58px]">Talk to an Astrologer</h1><p className="mt-5 text-[15px] leading-7 text-[#75695c] sm:text-[16px]">Connect with trusted astrologers for personalized guidance, clarity and meaningful insights.</p></div><div className="mt-9"><AstrologerFilters search={search} onSearchChange={setSearch} activeFilter={activeFilter} onFilterChange={setActiveFilter} language={language} onLanguageChange={setLanguage} priceLimit={priceLimit} onPriceLimitChange={setPriceLimit} /></div>{availableNow.length > 0 && <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#637741]">Online now</p><h2 className="mt-1 font-serif text-[32px]">Available Now</h2></div><p className="text-[12px] text-[#75695c]">{availableNow.length} astrologers ready to connect</p></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{availableNow.map((astrologer) => <AstrologerCard key={astrologer.id} astrologer={astrologer} />)}</div></section>}<section className="mt-12"><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">Explore trusted guidance</p><h2 className="mt-1 font-serif text-[32px]">All Astrologers</h2></div>{filteredAstrologers.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredAstrologers.map((astrologer) => <AstrologerCard key={astrologer.id} astrologer={astrologer} />)}</div> : <div className="rounded-[20px] border border-dashed border-[#dfc99e] bg-[#fffdf9] px-6 py-14 text-center"><h3 className="font-serif text-[27px]">No astrologers found</h3><p className="mt-2 text-[13px] text-[#75695c]">Try changing your search or filters to see more experts.</p><button type="button" onClick={() => { setSearch(""); setActiveFilter("All"); setLanguage("All languages"); setPriceLimit(""); }} className="mt-5 rounded-full border border-[#d9bd7b] px-5 py-2.5 text-[12px] font-semibold">Clear filters</button></div>}</section></div></section>;
};

export default Astrologers;
