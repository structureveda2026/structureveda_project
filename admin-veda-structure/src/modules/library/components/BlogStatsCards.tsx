import { BookOpen, CheckCircle2, FileEdit, Eye, TrendingUp, Sparkles } from "lucide-react";

interface BlogStatsCardsProps {
  stats: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
  };
}

export default function BlogStatsCards({ stats }: BlogStatsCardsProps) {
  const totalBlogs = stats?.totalBlogs || 0;
  const publishedBlogs = stats?.publishedBlogs || 0;
  const draftBlogs = stats?.draftBlogs || 0;
  const totalViews = Number(stats?.totalViews) || 0;

  const cards = [
    {
      title: "Total Articles",
      value: totalBlogs.toLocaleString(),
      subtitle: "Vedic library repository",
      badge: "Knowledge Base",
      badgeColor: "bg-saffron-50 text-saffron-700 border-saffron-200/80",
      icon: BookOpen,
      iconBg: "bg-gradient-to-br from-saffron-500/10 to-saffron-600/20 text-saffron-600 border border-saffron-200/50",
      accentGlow: "from-saffron-500/10 via-transparent to-transparent",
    },
    {
      title: "Published Articles",
      value: publishedBlogs.toLocaleString(),
      subtitle: "Live for seekers & devotees",
      badge: "Live Online",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: CheckCircle2,
      iconBg: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 border border-emerald-200/50",
      accentGlow: "from-emerald-500/10 via-transparent to-transparent",
      liveDot: true,
    },
    {
      title: "Drafts in Progress",
      value: draftBlogs.toLocaleString(),
      subtitle: "Pending editorial review",
      badge: "Staging",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
      icon: FileEdit,
      iconBg: "bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-600 border border-amber-200/50",
      accentGlow: "from-amber-500/10 via-transparent to-transparent",
    },
    {
      title: "Total Devotee Reads",
      value: totalViews.toLocaleString(),
      subtitle: "Cumulative reader impressions",
      badge: "Reader Reach",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 border border-purple-200/50",
      accentGlow: "from-purple-500/10 via-transparent to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-cream-200/90 p-5 shadow-xs hover:shadow-md hover:border-cream-300 transition-all duration-300"
          >
            {/* Ambient subtle glow background */}
            <div
              className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.accentGlow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                    {card.value}
                  </h3>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}
                  >
                    {card.liveDot && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                    )}
                    {card.badge}
                  </span>
                  <p className="text-[11px] text-charcoal-400 truncate">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
