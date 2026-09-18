import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { VEDA_TOPICS } from "../data/libraryData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import LibraryHero from "../components/LibraryHero";
import LibraryQuickStats from "../components/LibraryQuickStats";
import LibraryCategoryTabs from "../components/LibraryCategoryTabs";
import LibraryCardGrid from "../components/LibraryCardGrid";
import LibraryTreeView from "../components/LibraryTreeView";
import { Sparkles, ArrowRight } from "lucide-react";

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isHindi } = useLibraryLanguage();

  const [searchQuery, setSearchQuery] = useState("");

  // Derived state directly from URL query parameters
  const selectedCategory = searchParams.get("category") || "all";
  const topicParam = searchParams.get("topic");
  const activeView = searchParams.get("view") === "tree" ? "tree" : "grid";

  // Backward compatibility: If an old link arrives with ?topic=slug, forward to dedicated page
  useEffect(() => {
    if (topicParam) {
      navigate(`/library/${topicParam}`, { replace: true });
    }
  }, [topicParam, navigate]);

  // Handle Category Selection
  const handleSelectCategory = (categorySlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (categorySlug === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categorySlug);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Handle View Selection
  const handleSelectView = (view) => {
    const newParams = new URLSearchParams(searchParams);
    if (view === "grid") {
      newParams.delete("view");
    } else {
      newParams.set("view", "tree");
    }
    setSearchParams(newParams, { replace: true });
  };

  // Handle Topic Selection -> Navigate directly to dedicated full-page article!
  const handleSelectTopic = (topic) => {
    if (topic?.slug) {
      navigate(`/library/${topic.slug}`);
    }
  };

  // Filter topics based on search and category
  const filteredTopics = useMemo(() => {
    return VEDA_TOPICS.filter((topic) => {
      // Category match
      if (selectedCategory !== "all" && topic.categorySlug !== selectedCategory) {
        return false;
      }

      // Search match
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const matchTitleEn = topic.title.en.toLowerCase().includes(query);
      const matchTitleHi = topic.title.hi.toLowerCase().includes(query);
      const matchSanskrit = topic.sanskritTitle.toLowerCase().includes(query);
      const matchGroup = topic.group.toLowerCase().includes(query);
      const matchDescEn = topic.shortDesc.en.toLowerCase().includes(query);
      const matchDescHi = topic.shortDesc.hi.toLowerCase().includes(query);
      const matchTags = topic.tags.some((tag) => tag.toLowerCase().includes(query));

      return (
        matchTitleEn ||
        matchTitleHi ||
        matchSanskrit ||
        matchGroup ||
        matchDescEn ||
        matchDescHi ||
        matchTags
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-20">
      {/* Hero Section */}
      <LibraryHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Quick Statistics Bar */}
      <LibraryQuickStats onSelectCategory={handleSelectCategory} />

      {/* Categories Bar & View Switcher */}
      <LibraryCategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        activeView={activeView}
        setActiveView={handleSelectView}
        totalResultsCount={filteredTopics.length}
      />

      {/* Main View: Tree vs Grid */}
      {activeView === "tree" ? (
        <LibraryTreeView onSelectTopic={handleSelectTopic} />
      ) : (
        <LibraryCardGrid
          topics={filteredTopics}
          onSelectTopic={handleSelectTopic}
        />
      )}

      {/* Scholarly Vedic FAQ / Educational Guide Section */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-8 mt-20 sm:mt-24">
        <div className="rounded-3xl border border-[#ebd8b7] bg-gradient-to-b from-[#fbf4e5] via-[#fffcf7] to-[#fffdfa] p-6 shadow-sm sm:p-10">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4e6ce] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#916213]">
              <Sparkles size={13} />
              <span>{isHindi ? "ज्ञान जिज्ञासा" : "Vedic Knowledge Insights"}</span>
            </div>

            <h2 className="mt-3 font-serif text-[26px] font-bold text-[#2b241d] sm:text-[32px]">
              {isHindi
                ? "श्रुति और स्मृति में क्या अंतर है?"
                : "Understanding the Vedic Architecture: Shruti & Smriti"}
            </h2>

            <p className="mt-2 text-[14px] leading-relaxed text-[#685949] sm:text-[15px]">
              {isHindi
                ? "सनातन साहित्य दो विशाल धाराओं में विभक्त है: 'श्रुति' (जो सुना गया — चार वेद व उपनिषद, जो अपौरुषेय एवं शाश्वत हैं) और 'स्मृति' (जो याद रखा गया — रामायण, महाभारत, पुराण, धर्मशास्त्र, जो युगीन आचार संहिता प्रस्तुत करते हैं)।"
                : "Vedic literature is fundamentally bifurcated into Shruti ('that which is directly heard/revealed' — the 4 Vedas and Upanishads, authorless and eternal) and Smriti ('that which is remembered' — Itihasas, Puranas, and Dharma Shastras adapting eternal truths to shifting cultural eras)."}
            </p>
          </div>

          {/* 3 Insight Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ebdcc0] bg-white p-5 shadow-2xs">
              <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                {isHindi ? "१. श्रुति (Shruti)" : "1. Shruti (Divine Revelation)"}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6b5d4e]">
                {isHindi
                  ? "ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद एवं १०८ उपनिषद। यह अपरिवर्तनीय एवं परम प्रमाण है।"
                  : "The 4 Vedas, Brahmanas, Aranyakas, and Upanishads. Unalterable, eternal cosmic acoustics."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebdcc0] bg-white p-5 shadow-2xs">
              <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                {isHindi ? "२. स्मृति एवं पुराण" : "2. Smriti & Puranas"}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6b5d4e]">
                {isHindi
                  ? "रामायण, महाभारत, भगवद्गीता, १८ महापुराण एवं मनुस्मृति आदि। व्यावहारिक जीवन का आदर्श।"
                  : "Epics like Valmiki Ramayana, Mahabharata, Gita, and 18 Puranas translating wisdom into stories."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebdcc0] bg-white p-5 shadow-2xs">
              <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                {isHindi ? "३. षड् दर्शन (Shad Darshana)" : "3. Shad Darshana (Philosophy)"}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6b5d4e]">
                {isHindi
                  ? "न्याय, वैशेषिक, सांख्य, योग, मीमांसा और वेदांत। सत्य की परीक्षा हेतु छह आस्तिक मत।"
                  : "Six orthodox philosophical systems proving the reality of consciousness, matter, and liberation."}
              </p>
            </div>
          </div>

          {/* Quick link banner to puja and yagya modules */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e5d0a6] bg-[#faedd4] p-4 sm:flex-row sm:px-6">
            <p className="text-[13px] font-medium text-[#644917]">
              {isHindi
                ? "क्या आप वैदिक विधि से महायज्ञ या पूजा संपन्न कराना चाहते हैं?"
                : "Looking to participate in authentic Vedic Yagyas or Temple Pujas?"}
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/yagya-puja"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#c88918] px-4 py-2 text-[12px] font-bold text-white shadow-xs transition hover:bg-[#b0740d]"
              >
                <span>{isHindi ? "यज्ञ व पूजा सेवाएँ" : "Explore Yagya Services"}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LibraryPage;
