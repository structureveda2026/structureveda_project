import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Flame,
  Sparkles,
  Sun,
  Trash2,
  Send,
  Calendar,
  Tag,
  Check,
  User,
  AlertCircle,
  Bell,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  formatRelativeTime,
  DEFAULT_NEUTRAL_AVATAR,
} from "../data/communityMockData";

const renderRoleIcon = (role) => {
  if (role && role.toLowerCase().includes("pandit")) {
    return <Flame className="w-3 h-3 text-[#a94f0a]" />;
  }
  if (role && role.toLowerCase().includes("both")) {
    return <Sun className="w-3 h-3 text-[#a94f0a]" />;
  }
  return <Sparkles className="w-3 h-3 text-[#a94f0a]" />;
};

const getInitials = (name) => {
  if (!name) return "VS";
  return name
    .replace(/^(Pt\.|Dr\.|Acharya|Swami|Vidushi)\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const CommunityPostCard = ({
  post,
  onLike,
  onSave,
  onCommentSubmit,
  onShare,
  onDeletePost,
  onTopicClick,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [sessionReminderSet, setSessionReminderSet] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    authorSlug,
    authorName,
    authorRole,
    authorHeadline,
    authorAvatar,
    authorLocation,
    isVerified,
    isCustomUserCreated,
    topic,
    tags = [],
    createdAt,
    content,
    mediaImage,
    likesCount = 0,
    commentsCount = 0,
    comments = [],
    isLiked = false,
    isSaved = false,
    isSession = false,
    sessionDate,
    sessionMode,
  } = post;

  const isLongPost = content && content.length > 280;

  const profileLink =
    authorSlug && authorSlug !== "community-member"
      ? `/community/profile/${authorSlug}`
      : "/community?view=directory";

  const handleShareClick = () => {
    const postUrl =
      authorSlug && authorSlug !== "community-member"
        ? `${window.location.origin}/community/profile/${authorSlug}#${id}`
        : `${window.location.origin}/community?view=feed#${id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${authorName} on Veda Structure Community`,
          text: content.slice(0, 120) + "...",
          url: postUrl,
        })
        .catch(() => {
          copyToClipboard(postUrl);
        });
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2400);
    }
    if (onShare) onShare(post);
  };

  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    onCommentSubmit(id, commentText);
    setCommentText("");
    setIsSubmittingComment(false);
  };

  return (
    <article className="bg-white rounded-2xl border border-[#ebdcc2] p-5 sm:p-6 shadow-[0_2px_14px_rgba(43,36,29,0.04)] hover:border-[#dfcdb5] transition-all">
      {/* Top Header: Author Identity & Post Metadata */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-start gap-3 min-w-0">
          {/* Author Avatar (46-50px) */}
          <Link
            to={profileLink}
            className="relative shrink-0 group block"
            title={`View profile of ${authorName}`}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-[#ebdcc2] p-0.5 bg-gradient-to-br from-[#d4af37]/30 via-white to-[#a94f0a]/20 shadow-2xs group-hover:border-[#d6be9a] transition">
              {authorAvatar && !imageError ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-full h-full rounded-[9px] object-cover bg-white"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-[9px] bg-[#fff5e5] flex items-center justify-center text-[#a94f0a] font-serif font-bold text-xs">
                  {getInitials(authorName)}
                </div>
              )}
            </div>

            {isVerified && (
              <div
                className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs"
                title="Verified Vedic Scholar"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
              </div>
            )}
          </Link>

          {/* Author Details (2-Level Hierarchy) */}
          <div className="min-w-0 flex-1">
            {/* Level 1: Author Name + Verified Badge + Role Badge */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 leading-tight">
              <Link
                to={profileLink}
                className="font-serif text-sm sm:text-base font-bold text-[#2b241d] hover:text-[#a94f0a] transition-colors truncate block"
              >
                {authorName}
              </Link>

              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="hidden xs:inline">Verified Scholar</span>
                </span>
              )}

              {authorRole && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fff5e5] text-[#8a4e17] border border-[#ebdcc2] shrink-0">
                  {renderRoleIcon(authorRole)}
                  <span>{authorRole}</span>
                </span>
              )}

              {isCustomUserCreated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-300 shrink-0">
                  <AlertCircle className="w-2.5 h-2.5 text-amber-700" />
                  <span>Demo Post</span>
                </span>
              )}
            </div>

            {/* Level 2: Professional Description / Lineage + Timestamp & Location */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6e5845]">
              {authorHeadline && (
                <p className="truncate max-w-md font-medium text-[#5c4736]">
                  {authorHeadline}
                </p>
              )}
              {authorHeadline && <span className="text-[#c7b4a2] hidden sm:inline">•</span>}
              <div className="flex items-center gap-1 text-[11px] text-[#8c745e]">
                <Clock className="w-3 h-3 text-[#a94f0a]" />
                <span>{formatRelativeTime(createdAt)}</span>
                {authorLocation && (
                  <>
                    <span>•</span>
                    <span className="truncate">{authorLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Header: Topic Badge & Delete Option */}
        <div className="flex items-center gap-2 shrink-0">
          {topic && (
            <button
              type="button"
              onClick={() => onTopicClick && onTopicClick(topic)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#fcf8f0] hover:bg-[#faeed8] text-[#8a4e17] border border-[#ebdcc2] transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-[#a94f0a]" />
              <span className="hidden sm:inline">{topic}</span>
            </button>
          )}

          {isCustomUserCreated && onDeletePost && (
            <button
              type="button"
              onClick={() => onDeletePost(id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Delete demo post"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Post Body with comfortable line-height and optional long-post expander */}
      <div className="mb-3.5">
        <div
          className={`text-[14.5px] sm:text-[15px] text-[#382516] leading-[1.72] whitespace-pre-line font-sans break-words ${
            !isExpanded && isLongPost ? "line-clamp-4" : ""
          }`}
        >
          {content}
        </div>

        {isLongPost && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#a94f0a] hover:text-[#8f4208] transition cursor-pointer select-none"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Show less" : "Read more"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Special Session / Study Circle Event Box */}
      {isSession && (
        <div className="my-3.5 p-4 rounded-xl bg-gradient-to-r from-[#fbf6ec] to-[#f7eedc] border border-[#ebd6ab] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Community Study Session
            </span>
            <p className="text-xs font-semibold text-[#2b241d]">{sessionDate}</p>
            {sessionMode && (
              <p className="text-[11px] text-[#6b5542]">{sessionMode}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSessionReminderSet(!sessionReminderSet)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a94f0a]/30 ${
              sessionReminderSet
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-white hover:bg-[#faeed8] text-[#8a4e17] border border-[#d6be9a]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{sessionReminderSet ? "Reminder Saved" : "Set Reminder"}</span>
          </button>
        </div>
      )}

      {/* Media Image (If attached) */}
      {mediaImage && !imageError && (
        <div className="my-3.5 rounded-xl overflow-hidden border border-[#ebdcc2] bg-stone-100 max-h-96">
          <img
            src={mediaImage}
            alt="Vedic discussion media"
            className="w-full h-full object-cover max-h-96"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Tags Chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5 pt-0.5">
          {tags.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onTopicClick && onTopicClick(tag)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fff5e5] hover:bg-[#faeed8] text-[#7a4010] border border-[#ebdcc2] transition cursor-pointer"
            >
              <Tag className="w-2.5 h-2.5 text-[#a94f0a]" />
              <span>#{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Engagement Metrics Summary Row */}
      <div className="flex items-center justify-between text-xs text-[#7d6857] pb-3 border-b border-[#ebdcc2]">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2] flex items-center justify-center font-bold text-[10px]">
            🙏
          </span>
          <span className="font-semibold text-[#4a3727]">
            {likesCount} {likesCount === 1 ? "Pranam" : "Pranams"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:text-[#a94f0a] transition cursor-pointer font-medium"
          >
            {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
          </button>
        </div>
      </div>

      {/* Action Buttons Toolbar: Like, Comment, Save, Share */}
      <div className="pt-2.5 grid grid-cols-4 gap-1 sm:gap-2 text-xs font-semibold text-[#5c4736]">
        {/* Like Button */}
        <button
          type="button"
          onClick={() => onLike(id)}
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a94f0a]/30 ${
            isLiked
              ? "text-[#a94f0a] bg-[#fff5e5] font-bold"
              : "hover:bg-[#fff5e5] hover:text-[#a94f0a]"
          }`}
          title="Offer respectful Pranam"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? "fill-[#a94f0a] text-[#a94f0a]" : ""
            }`}
          />
          <span className="truncate">{isLiked ? "Pranamed" : "Offer Pranam"}</span>
        </button>

        {/* Comment Toggle */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a94f0a]/30 ${
            showComments
              ? "text-[#a94f0a] bg-[#fff5e5] font-bold"
              : "hover:bg-[#fff5e5] hover:text-[#a94f0a]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Save/Bookmark */}
        <button
          type="button"
          onClick={() => onSave(id)}
          className={`inline-flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3 rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a94f0a]/30 ${
            isSaved
              ? "text-[#a94f0a] bg-[#fff5e5] font-bold"
              : "hover:bg-[#fff5e5] hover:text-[#a94f0a]"
          }`}
        >
          <Bookmark
            className={`w-4 h-4 ${
              isSaved ? "fill-[#a94f0a] text-[#a94f0a]" : ""
            }`}
          />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-1 sm:px-3 rounded-xl hover:bg-[#fff5e5] hover:text-[#a94f0a] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a94f0a]/30"
        >
          {copiedToast ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#ebdcc2] space-y-4 animate-in fade-in duration-200">
          {/* Comment Submission Form */}
          <form onSubmit={handleCommentFormSubmit} className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a respectful shastric thought..."
                className="w-full pl-3.5 pr-20 py-2 rounded-xl border border-[#ebdcc2] bg-[#fffdfa] text-xs text-[#2b241d] placeholder:text-[#9e8b78] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/25 focus:border-[#a94f0a] transition"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#a94f0a] hover:bg-[#8f4208] disabled:opacity-40 text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-xs text-[#8c745e] italic py-2 text-center">
              No comments yet. Be the first to share an insight!
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="p-3 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {cmt.authorAvatar ? (
                          <img
                            src={cmt.authorAvatar}
                            alt={cmt.authorName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = DEFAULT_NEUTRAL_AVATAR;
                            }}
                          />
                        ) : (
                          getInitials(cmt.authorName)
                        )}
                      </div>
                      <span className="font-bold text-[#2b241d]">
                        {cmt.authorName}
                      </span>
                      {cmt.authorRole && (
                        <span className="text-[10px] text-[#7d6857] px-1.5 py-0.2 rounded bg-[#fff5e5] border border-[#ebdcc2]/60">
                          {cmt.authorRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8c745e]">
                      {formatRelativeTime(cmt.createdAt)}
                    </span>
                  </div>
                  <p className="text-[#453629] pl-8 leading-relaxed break-words">
                    {cmt.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default CommunityPostCard;
