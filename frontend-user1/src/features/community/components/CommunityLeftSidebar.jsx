import { Link } from "react-router-dom";
import {
  Compass,
  Bookmark,
  Users,
  Edit3,
  BookOpen,
  Flame,
  CheckCircle2,
  Tag,
  Eye,
  ShieldCheck,
} from "lucide-react";
import {
  COMMUNITY_TOPICS,
  getUserCustomProfile,
  DEFAULT_NEUTRAL_AVATAR,
} from "../data/communityMockData";

const CommunityLeftSidebar = ({
  feedTab,
  onFeedTabChange,
  activeTopic,
  onTopicChange,
  savedCount = 0,
  followedCount = 0,
  myPostsCount = 0,
  onSwitchToDirectory,
}) => {
  const customProfile = getUserCustomProfile();

  return (
    <aside className="space-y-5">
      {/* 1. Member Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] shadow-sm overflow-hidden">
        {/* Compact, polished Vedic cover banner (approx 74px to 80px) */}
        <div className="relative h-[76px] bg-gradient-to-r from-[#44220b] via-[#6f330b] to-[#9b4e10] overflow-hidden">
          <img
            src={customProfile?.coverImage || "/create-profile-hero-bg.jpg"}
            alt="Cover"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Profile Details Container */}
        <div className="px-4 pb-4 pt-0">
          {/* Avatar Row: Avatar (approx 68px) naturally overlapping the bottom edge of cover */}
          <div className="flex items-end justify-between -mt-9 mb-3">
            <Link
              to={`/community/profile/${customProfile.slug}`}
              className="relative group shrink-0 block"
              title="View profile"
            >
              <div className="w-[68px] h-[68px] rounded-xl overflow-hidden border-[3px] border-white shadow-md bg-stone-100 group-hover:scale-[1.02] transition-transform">
                <img
                  src={customProfile.avatar || DEFAULT_NEUTRAL_AVATAR}
                  alt={customProfile.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_NEUTRAL_AVATAR;
                  }}
                />
              </div>
              {customProfile.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs"
                  title="Verified Sanatana Scholar"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              )}
            </Link>

            <span className="text-[10px] font-bold text-[#8a4e17] px-2.5 py-0.5 rounded-full bg-[#faeed8] border border-[#ebdcc2] mb-1 truncate max-w-[140px]">
              {customProfile.professionalType || "Vedic Scholar"}
            </span>
          </div>

          {/* User Display Name & Headline / Bio */}
          <div className="mb-3 space-y-0.5">
            <Link
              to={`/community/profile/${customProfile.slug}`}
              className="font-serif text-[15px] font-bold text-[#2b241d] hover:text-[#a94f0a] transition-colors block leading-snug truncate"
              title={customProfile.displayName}
            >
              {customProfile.displayName}
            </Link>
            {(customProfile.headline || customProfile.bio) && (
              <p className="text-xs text-[#6e5845] font-normal line-clamp-2 leading-relaxed">
                {customProfile.headline || customProfile.bio}
              </p>
            )}
          </div>

          {/* Statistics in a clean horizontal row */}
          <div className="grid grid-cols-3 gap-1 py-2 px-1 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] text-center mb-3.5">
            <div className="px-1">
              <p className="font-bold text-[#2b241d] text-sm leading-none">{myPostsCount}</p>
              <p className="text-[9.5px] text-[#8c745e] uppercase tracking-wider font-semibold mt-1">Posts</p>
            </div>
            <div className="border-x border-[#ebdcc2] px-1">
              <p className="font-bold text-[#2b241d] text-sm leading-none">{followedCount}</p>
              <p className="text-[9.5px] text-[#8c745e] uppercase tracking-wider font-semibold mt-1">Following</p>
            </div>
            <div className="px-1">
              <p className="font-bold text-[#2b241d] text-sm leading-none">{savedCount}</p>
              <p className="text-[9.5px] text-[#8c745e] uppercase tracking-wider font-semibold mt-1">Saved</p>
            </div>
          </div>

          {/* Action Buttons: My Profile & Edit Profile */}
          <div className="flex gap-2">
            <Link
              to={`/community/profile/${customProfile.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#faeed8] hover:bg-[#f7dfb0] text-[#7a4010] text-xs font-bold border border-[#d6be9a] transition shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#8a4e17]" />
              <span>My Profile</span>
            </Link>
            <Link
              to={`/community/edit-profile?slug=${customProfile.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-[#fff5e5] text-[#5c4736] text-xs font-semibold border border-[#ebdcc2] transition shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#a94f0a]" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Feeds & Saved Filters */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] p-4 shadow-[0_2px_14px_rgba(43,36,29,0.04)] space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] px-2 mb-2">
          Community Views
        </p>

        <button
          type="button"
          onClick={() => {
            onFeedTabChange("for-you");
            onTopicChange("All");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            feedTab === "for-you" && activeTopic === "All"
              ? "bg-[#9b4e10] text-white shadow-2xs"
              : "text-[#4a3727] hover:bg-[#faf4e8]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>For You (Curated)</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onFeedTabChange("following");
            onTopicChange("All");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            feedTab === "following"
              ? "bg-[#9b4e10] text-white shadow-2xs"
              : "text-[#4a3727] hover:bg-[#faf4e8]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Following</span>
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              feedTab === "following"
                ? "bg-white/20 text-white"
                : "bg-[#faeed8] text-[#8a4e17]"
            }`}
          >
            {followedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onFeedTabChange("latest");
            onTopicChange("All");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            feedTab === "latest"
              ? "bg-[#9b4e10] text-white shadow-2xs"
              : "text-[#4a3727] hover:bg-[#faf4e8]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>Latest Discussions</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onFeedTabChange("saved");
            onTopicChange("All");
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            feedTab === "saved"
              ? "bg-[#9b4e10] text-white shadow-2xs"
              : "text-[#4a3727] hover:bg-[#faf4e8]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>Saved Insights</span>
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              feedTab === "saved"
                ? "bg-white/20 text-white"
                : "bg-[#faeed8] text-[#8a4e17]"
            }`}
          >
            {savedCount}
          </span>
        </button>

        {onSwitchToDirectory && (
          <div className="pt-2 border-t border-[#f0e4cf]">
            <button
              type="button"
              onClick={onSwitchToDirectory}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#8a4e17] bg-[#fdf8f0] hover:bg-[#faeed8] border border-[#ebdcc2] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9b4e10]" />
                <span>Expert Directory</span>
              </span>
              <span className="text-[10px] text-[#9b4e10] font-bold">Browse →</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Shastric Topics Filter */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] p-4 shadow-[0_2px_14px_rgba(43,36,29,0.04)] space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] px-2 mb-2">
          Vedic Topics
        </p>

        <div className="flex flex-col gap-1">
          {COMMUNITY_TOPICS.map((topicName) => {
            const isSelected = activeTopic === topicName;
            return (
              <button
                key={topicName}
                type="button"
                onClick={() => {
                  onTopicChange(topicName);
                  if (feedTab === "saved") onFeedTabChange("for-you");
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#faeed8] text-[#7a3b09] font-bold border border-[#d6be9a]"
                    : "text-[#5c4736] hover:bg-[#faf4e8]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#b35d14]" />
                  <span>{topicName}</span>
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9b4e10]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sanatana Community Standards Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#faf4e8] to-[#f4e8d3] border border-[#ebdcc2] text-xs text-[#6e5845] space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#3d2d20]">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Shastric Respect & Ethics</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Discussions honor Guru paramparas, sacred scriptures, and civil shastra dialogues.
        </p>
      </div>
    </aside>
  );
};

export default CommunityLeftSidebar;
