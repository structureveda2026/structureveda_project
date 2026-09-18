import { BookOpen, Clock, ArrowRight, Quote } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const LibraryCardGrid = ({ topics, onSelectTopic }) => {
  const { isHindi, t } = useLibraryLanguage();

  if (!topics || topics.length === 0) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-12">
        <div className="rounded-3xl border-2 border-dashed border-[#e3ca97] bg-[#fffbf2] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f6e7cd] text-[#b37714]">
            <BookOpen size={28} />
          </div>
          <h3 className="mt-4 font-serif text-[20px] font-bold text-[#2b241d]">
            {t("noResults")}
          </h3>
          <p className="mt-1 text-[14px] text-[#7d7062]">
            {isHindi
              ? "कृपया दूसरा शब्द खोजें अथवा समस्त श्रेणियाँ चुनें।"
              : "Try searching with a different term or clear your category filter."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          return (
            <article
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#e8d5b2] bg-white p-5 shadow-[0_4px_20px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_12px_32px_rgba(200,137,24,0.14)] sm:p-6"
            >
              {/* Subtle top golden accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 opacity-80 group-hover:opacity-100" />

              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#faf0dc] px-2 py-0.5 font-mono text-[11px] font-bold text-[#986411]">
                      {topic.categoryNumber}
                    </span>
                    <span className="rounded-md border border-[#eee0c3] bg-[#fffaf0] px-2 py-0.5 text-[11px] font-semibold text-[#7c6953]">
                      {topic.group}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8f7e6e]">
                    <Clock size={12} />
                    {topic.readTime}
                  </span>
                </div>

                {/* Title & Sanskrit */}
                <div className="mt-4">
                  <p className="font-serif text-[15px] font-medium text-[#9b6811]">
                    {topic.sanskritTitle}
                  </p>
                  <h3 className="mt-0.5 font-serif text-[22px] font-bold leading-tight text-[#2b241d] transition-colors group-hover:text-[#c88918] sm:text-[24px]">
                    {isHindi ? topic.title.hi : topic.title.en}
                  </h3>
                </div>

                {/* Short description */}
                <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-[#685c4e]">
                  {isHindi ? topic.shortDesc.hi : topic.shortDesc.en}
                </p>

                {/* Key Verse Box */}
                {topic.keyVerse && (
                  <div className="mt-4 rounded-xl border border-[#ebdcc0] bg-[#fffaf0] p-3 transition-colors group-hover:border-[#e2cca4]">
                    <div className="flex items-start gap-2">
                      <Quote size={13} className="shrink-0 text-[#c88918] mt-0.5" />
                      <p className="line-clamp-2 font-serif text-[12px] italic text-[#6d5e4d]">
                        {topic.keyVerse.sanskrit}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {topic.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#f8f1e3] px-2.5 py-0.5 text-[10px] font-medium text-[#7d6850]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-[#f2e7d3] pt-4">
                <span className="text-[12px] font-bold tracking-wide text-[#c88918] group-hover:text-[#9e670c]">
                  {t("readMore")}
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faedd4] text-[#9b6811] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#c88918] group-hover:text-white">
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryCardGrid;
