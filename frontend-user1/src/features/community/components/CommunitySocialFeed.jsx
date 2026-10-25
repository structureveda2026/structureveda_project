import { useState, useMemo, useCallback } from "react";
import {
  Users,
  Bookmark,
  RotateCcw,
  Search,
  X,
  Filter,
  MessageSquare,
} from "lucide-react";
import CommunityPostComposer from "./CommunityPostComposer";
import CommunityPostCard from "./CommunityPostCard";
import CommunityLeftSidebar from "./CommunityLeftSidebar";
import CommunityRightSidebar from "./CommunityRightSidebar";
import {
  getCommunityPosts,
  getCommunityProfiles,
  toggleLikePost,
  toggleSavePost,
  addPostComment,
  deleteCommunityPost,
  getSavedPostIds,
  getFollowedPractitioners,
  toggleFollowPractitioner,
  getUserCustomProfile,
} from "../data/communityMockData";

const CommunitySocialFeed = ({ onSwitchToDirectory }) => {
  const [feedTab, setFeedTab] = useState("for-you"); // "for-you" | "following" | "latest" | "saved"
  const [activeTopic, setActiveTopic] = useState("All");
  const [feedSearch, setFeedSearch] = useState("");
  const [postsVersion, setPostsVersion] = useState(0);
  const [followVersion, setFollowVersion] = useState(0);

  // Retrieve user custom profile
  const customProfile = useMemo(() => {
    return getUserCustomProfile();
  }, []);

  // Retrieve all directory practitioners for right sidebar suggestions
  const allPractitioners = useMemo(() => {
    return getCommunityProfiles();
  }, []);

  // Filter suggested practitioners (exclude custom profile if created)
  const suggestedPractitioners = useMemo(() => {
    return allPractitioners.filter(
      (p) => !p.isCustomUserCreated && p.slug !== customProfile?.slug
    );
  }, [allPractitioners, customProfile]);

  // Load all posts
  const allPosts = useMemo(() => {
    return getCommunityPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsVersion]);

  // Saved post IDs
  const savedPostIds = useMemo(() => {
    return getSavedPostIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsVersion]);

  // Followed practitioner slugs
  const followedSlugs = useMemo(() => {
    return getFollowedPractitioners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followVersion]);

  // Posts authored by the user
  const myPostsCount = useMemo(() => {
    if (!customProfile) return 0;
    return allPosts.filter(
      (p) => p.authorSlug === customProfile.slug || p.isCustomUserCreated
    ).length;
  }, [allPosts, customProfile]);

  // Handlers for interactive actions
  const handleLike = useCallback((postId) => {
    toggleLikePost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleSave = useCallback((postId) => {
    toggleSavePost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleCommentSubmit = useCallback((postId, content) => {
    const authorName = customProfile?.displayName || "Spiritual Seeker";
    const authorRole = customProfile?.professionalType || "Devotee / Scholar";
    const authorAvatar = customProfile?.avatar || "";

    addPostComment(postId, {
      authorName,
      authorRole,
      authorAvatar,
      content,
    });
    setPostsVersion((v) => v + 1);
  }, [customProfile]);

  const handleDeletePost = useCallback((postId) => {
    deleteCommunityPost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleFollowToggle = useCallback((slug) => {
    toggleFollowPractitioner(slug);
    setFollowVersion((v) => v + 1);
  }, []);

  const handlePostCreated = useCallback(() => {
    setPostsVersion((v) => v + 1);
    setFeedTab("latest");
    setActiveTopic("All");
  }, []);

  // Filtered & Sorted Feed computation
  const filteredPosts = useMemo(() => {
    return allPosts
      .filter((post) => {
        // Tab Filtering
        if (feedTab === "following") {
          if (!followedSlugs.includes(post.authorSlug)) return false;
        } else if (feedTab === "saved") {
          if (!savedPostIds.includes(post.id)) return false;
        }

        // Topic Filtering
        if (activeTopic !== "All") {
          if (post.topic !== activeTopic) return false;
        }

        // Search text filtering
        if (feedSearch.trim()) {
          const q = feedSearch.toLowerCase();
          const matchesContent = post.content?.toLowerCase().includes(q);
          const matchesAuthor = post.authorName?.toLowerCase().includes(q);
          const matchesTags = (post.tags || []).some((t) =>
            t.toLowerCase().includes(q)
          );
          if (!matchesContent && !matchesAuthor && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (feedTab === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // For You / Default: balance between recency and popularity
        const scoreA = (a.likesCount || 0) * 2 + new Date(a.createdAt).getTime() / 1e10;
        const scoreB = (b.likesCount || 0) * 2 + new Date(b.createdAt).getTime() / 1e10;
        return scoreB - scoreA;
      });
  }, [allPosts, feedTab, followedSlugs, savedPostIds, activeTopic, feedSearch]);

  const resetAllFeedFilters = () => {
    setFeedTab("for-you");
    setActiveTopic("All");
    setFeedSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Main 3-Column Social Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Member Profile Summary & Navigation (Desktop lg+) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-20">
          <CommunityLeftSidebar
            feedTab={feedTab}
            onFeedTabChange={setFeedTab}
            activeTopic={activeTopic}
            onTopicChange={setActiveTopic}
            savedCount={savedPostIds.length}
            followedCount={followedSlugs.length}
            myPostsCount={myPostsCount}
            onSwitchToDirectory={onSwitchToDirectory}
          />
        </div>

        {/* Center Column: Feed Toolbar, Composer & Post List */}
        <main className="col-span-12 lg:col-span-8 xl:col-span-6 space-y-5">
          {/* Mobile Tab Control & Search (visible < lg) */}
          <div className="lg:hidden bg-white rounded-2xl border border-[#ebdcc2] p-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setFeedTab("for-you")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  feedTab === "for-you"
                    ? "bg-[#a94f0a] text-white"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                For You
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("following")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  feedTab === "following"
                    ? "bg-[#a94f0a] text-white"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Following ({followedSlugs.length})
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("latest")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  feedTab === "latest"
                    ? "bg-[#a94f0a] text-white"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("saved")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  feedTab === "saved"
                    ? "bg-[#a94f0a] text-white"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Saved ({savedPostIds.length})
              </button>
            </div>
          </div>

          {/* Desktop Top Feed Toolbar */}
          <div className="hidden lg:flex items-center justify-between gap-3 bg-white rounded-2xl border border-[#ebdcc2] px-4 py-3 shadow-[0_2px_10px_rgba(43,36,29,0.03)]">
            {/* Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFeedTab("for-you")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  feedTab === "for-you"
                    ? "bg-[#a94f0a] text-white shadow-2xs"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                For You
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("following")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  feedTab === "following"
                    ? "bg-[#a94f0a] text-white shadow-2xs"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Following ({followedSlugs.length})
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("latest")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  feedTab === "latest"
                    ? "bg-[#a94f0a] text-white shadow-2xs"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("saved")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  feedTab === "saved"
                    ? "bg-[#a94f0a] text-white shadow-2xs"
                    : "text-[#5c4736] hover:bg-[#fff5e5]"
                }`}
              >
                Saved ({savedPostIds.length})
              </button>
            </div>

            {/* In-feed quick search */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a08975]" />
              <input
                type="text"
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                placeholder="Filter feed..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] text-xs text-[#2b241d] placeholder:text-[#9e8b78] focus:outline-none focus:ring-1 focus:ring-[#b35d14]"
              />
              {feedSearch && (
                <button
                  type="button"
                  onClick={() => setFeedSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicators Bar */}
          {(activeTopic !== "All" || feedSearch) && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#faeed8] border border-[#d6be9a] text-xs text-[#7a3b09] shadow-2xs">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#9b4e10]" />
                <span>
                  Filtering by:{" "}
                  <strong>{activeTopic !== "All" ? activeTopic : ""}</strong>
                  {activeTopic !== "All" && feedSearch ? " & " : ""}
                  {feedSearch ? `Keyword "${feedSearch}"` : ""}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTopic("All");
                  setFeedSearch("");
                }}
                className="font-bold underline hover:text-[#522502]"
              >
                Reset
              </button>
            </div>
          )}

          {/* Post Composer */}
          <CommunityPostComposer onPostCreated={handlePostCreated} />

          {/* Feed Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#ebdcc2] p-8 sm:p-12 text-center shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#faeed8] border border-[#ebdcc2] flex items-center justify-center mx-auto text-[#9b4e10]">
                {feedTab === "saved" ? (
                  <Bookmark className="w-8 h-8" />
                ) : feedTab === "following" ? (
                  <Users className="w-8 h-8" />
                ) : (
                  <MessageSquare className="w-8 h-8" />
                )}
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#2b241d]">
                  {feedTab === "saved"
                    ? "No Saved Insights Yet"
                    : feedTab === "following"
                    ? "No Posts from Followed Scholars"
                    : "No Discussions Found"}
                </h3>
                <p className="text-xs sm:text-sm text-[#6e5845] max-w-md mx-auto mt-1 leading-relaxed">
                  {feedTab === "saved"
                    ? "Bookmark meaningful reflections and shastra studies to easily revisit them here at any time."
                    : feedTab === "following"
                    ? "You aren't following any Vedic Acharyas or Astrologers yet. Check the suggestions on the right to follow scholars!"
                    : "Try selecting another topic filter or reset your search keywords."}
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={resetAllFeedFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>View All Discussions</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                  onCommentSubmit={handleCommentSubmit}
                  onDeletePost={handleDeletePost}
                  onTopicClick={(top) => {
                    setActiveTopic(top);
                    window.scrollTo({ top: 100, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          )}
        </main>

        {/* Right Column: Suggested Practitioners, Trending Topics & Sessions (Desktop xl+) */}
        <div className="hidden xl:block xl:col-span-3 sticky top-20">
          <CommunityRightSidebar
            suggestedPractitioners={suggestedPractitioners}
            onFollowToggle={handleFollowToggle}
            onTopicClick={(t) => {
              setActiveTopic(t);
              window.scrollTo({ top: 100, behavior: "smooth" });
            }}
            onSwitchToDirectory={onSwitchToDirectory}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunitySocialFeed;
