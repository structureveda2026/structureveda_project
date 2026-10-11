import React from "react";
import { BookOpen, CheckCircle2, FileEdit, TrendingUp } from "lucide-react";

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
      badge: "Knowledge Base",
      badgeColor: "bg-saffron-50 text-saffron-700 border-saffron-200/80",
      icon: BookOpen,
      iconBg: "bg-saffron-50 text-saffron-600 border border-saffron-200/60",
    },
    {
      title: "Published Articles",
      value: publishedBlogs.toLocaleString(),
      badge: "Live Online",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
      liveDot: true,
    },
    {
      title: "Drafts in Progress",
      value: draftBlogs.toLocaleString(),
      badge: "Staging",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
      icon: FileEdit,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-200/60",
    },
    {
      title: "Total Devotee Reads",
      value: totalViews.toLocaleString(),
      badge: "Reader Reach",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      icon: TrendingUp,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-2xs hover:shadow-xs hover:border-cream-300 transition-all duration-200 flex items-center justify-between gap-2.5"
          >
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-charcoal-500 truncate">
                  {card.title}
                </span>
                {card.liveDot && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-none">
                  {card.value}
                </span>
                <span
                  className={`hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>

            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
