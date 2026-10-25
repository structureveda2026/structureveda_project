import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  UserPlus,
  Bell,
  Clock,
} from "lucide-react";
import {
  TRENDING_TOPICS,
  UPCOMING_COMMUNITY_SESSIONS,
  isFollowingPractitioner,
} from "../data/communityMockData";

const CommunityRightSidebar = ({
  suggestedPractitioners = [],
  onFollowToggle,
  onTopicClick,
  onSwitchToDirectory,
}) => {
  const [reminders, setReminders] = useState({});

  const toggleReminder = (sessionId) => {
    setReminders((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  return (
    <aside className="space-y-5">
      {/* 1. Suggested Practitioners to Follow */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-[0_2px_14px_rgba(43,36,29,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-sm font-bold text-[#2b241d] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#b35d14]" />
            <span>Scholars to Follow</span>
          </h3>
          {onSwitchToDirectory && (
            <button
              type="button"
              onClick={onSwitchToDirectory}
              className="text-[11px] font-semibold text-[#9b4e10] hover:text-[#7a3b09] transition"
            >
              View All
            </button>
          )}
        </div>

        <div className="divide-y divide-[#f5ebd9]">
          {suggestedPractitioners.slice(0, 4).map((expert) => {
            const isFollowing = isFollowingPractitioner(expert.slug);

            return (
              <div
                key={expert.slug}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Link
                    to={`/community/profile/${expert.slug}`}
                    className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#d4af37] via-[#ebdcc2] to-[#b35d14] shrink-0"
                  >
                    <img
                      src={expert.avatar}
                      alt={expert.displayName}
                      className="w-full h-full rounded-[8px] object-cover bg-white"
                      loading="lazy"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/community/profile/${expert.slug}`}
                      className="font-serif text-xs font-bold text-[#2b241d] hover:text-[#9b4e10] transition-colors truncate block"
                    >
                      {expert.displayName}
                    </Link>
                    <p className="text-[10px] text-[#7d6857] truncate">
                      {expert.city} • {expert.professionalType}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onFollowToggle(expert.slug)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 shadow-2xs cursor-pointer ${
                    isFollowing
                      ? "bg-[#faeed8] text-[#8a4e17] border border-[#d6be9a]"
                      : "bg-[#9b4e10] hover:bg-[#853f09] text-white"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3 text-[#8a4e17]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {onSwitchToDirectory && (
          <div className="mt-4 pt-3 border-t border-[#f0e4cf] text-center">
            <button
              type="button"
              onClick={onSwitchToDirectory}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a4e17] hover:text-[#2b241d] transition"
            >
              <span>Explore full directory of Pandits & Astrologers</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Trending Shastric Topics */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-[0_2px_14px_rgba(43,36,29,0.04)]">
        <h3 className="font-serif text-sm font-bold text-[#2b241d] flex items-center gap-1.5 mb-3.5">
          <TrendingUp className="w-4 h-4 text-[#b35d14]" />
          <span>Trending Shastric Themes</span>
        </h3>

        <div className="space-y-2">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => onTopicClick && onTopicClick(item.topic)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#fffdfa] hover:bg-[#faf4e8] border border-[#f0e4cf] transition text-left group"
            >
              <div>
                <p className="text-xs font-bold text-[#3d2d20] group-hover:text-[#9b4e10] transition">
                  #{item.tag}
                </p>
                <p className="text-[10px] text-[#8c745e]">{item.topic}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#7d6857] px-2 py-0.5 rounded-full bg-[#fcf8f0]">
                {item.count} posts
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Community Study Circles */}
      <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-[0_2px_14px_rgba(43,36,29,0.04)]">
        <h3 className="font-serif text-sm font-bold text-[#2b241d] flex items-center gap-1.5 mb-3.5">
          <Calendar className="w-4 h-4 text-[#b35d14]" />
          <span>Upcoming Study Sessions</span>
        </h3>

        <div className="space-y-3">
          {UPCOMING_COMMUNITY_SESSIONS.map((session) => {
            const hasReminder = Boolean(reminders[session.id]);

            return (
              <div
                key={session.id}
                className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#f0e4cf] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif font-bold text-[#2b241d] leading-snug line-clamp-2">
                    {session.title}
                  </h4>
                </div>

                <Link
                  to={session.hostSlug ? `/community/profile/${session.hostSlug}` : "/community"}
                  className="flex items-center gap-2 text-[11px] text-[#7d6857] hover:text-[#9b4e10] transition-colors group"
                >
                  <img
                    src={session.hostAvatar}
                    alt={session.hostName}
                    className="w-4 h-4 rounded-full object-cover"
                    loading="lazy"
                  />
                  <span className="truncate group-hover:underline">{session.hostName}</span>
                </Link>

                <div className="flex items-center justify-between gap-1 pt-1 text-[11px] text-[#8c745e]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#b35d14]" />
                    <span>{session.date}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleReminder(session.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer ${
                      hasReminder
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#faeed8] text-[#8a4e17] hover:bg-[#f7dfb0]"
                    }`}
                  >
                    <Bell className="w-2.5 h-2.5" />
                    <span>{hasReminder ? "Saved" : "Remind"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default CommunityRightSidebar;
