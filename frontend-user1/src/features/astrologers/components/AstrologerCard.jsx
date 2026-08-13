import { MessageCircle, Star, UserRound } from "lucide-react";

const AstrologerCard = ({ astrologer }) => {
  const profileUrl = `/astrologers/${astrologer.slug}`;

  return (
    <article className="group rounded-[22px] border border-[#e4cd9d] bg-[#fffdf9] p-5 shadow-[0_10px_28px_rgba(80,60,30,0.045)] transition hover:-translate-y-1 hover:border-[#d6a13b] hover:shadow-[0_18px_38px_rgba(80,60,30,0.1)]">
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="flex gap-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#c88918]">
        <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full border border-[#e1c995] bg-[#f8e7c2]">
          <img src={astrologer.image} alt={astrologer.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span className={`absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white ${astrologer.online ? "bg-[#668047]" : "bg-[#aa9680]"}`} aria-label={astrologer.online ? "Available now" : "Currently offline"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h2 className="font-serif text-[22px] leading-tight text-[#2b241d]">{astrologer.name}</h2><span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#725a25]"><Star size={13} fill="#eab12c" className="text-[#eab12c]" />{astrologer.rating}</span></div>
          <p className="mt-1 text-[12px] text-[#b36c1e]">{astrologer.title}</p>
          <p className="mt-2 text-[11px] text-[#75695c]">{astrologer.experience}+ years · {astrologer.languages.join(", ")}</p>
        </div>
      </a>
      <div className="mt-4 flex flex-wrap gap-1.5">{astrologer.expertise.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-[#fbefd9] px-2.5 py-1 text-[10px] text-[#725a25]">{item}</span>)}</div>
      <div className="mt-4 flex items-center justify-between border-t border-[#eee1ca] pt-4"><div><p className={`text-[11px] font-semibold ${astrologer.online ? "text-[#637741]" : "text-[#75695c]"}`}>{astrologer.availability}</p><p className="mt-1 font-serif text-[21px] text-[#2b241d]">{astrologer.currency}{astrologer.pricePerMinute}<span className="ml-1 font-sans text-[10px] text-[#75695c]">/ min</span></p></div><p className="text-right text-[10px] text-[#75695c]"><span className="block font-semibold text-[#4f463d]">{astrologer.sessions}</span>consultations</p></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><a href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d9bd7b] px-3 py-2.5 text-[11px] font-semibold text-[#5f4932] transition hover:border-[#c88918] hover:text-[#b36c1e]"><UserRound size={14} />View Profile</a><a href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#eab12c] px-3 py-2.5 text-[11px] font-semibold text-[#2b241d] transition hover:bg-[#dca522]"><MessageCircle size={14} />Talk Now</a></div>
    </article>
  );
};

export default AstrologerCard;
