import { BookOpen, CheckCircle, FileText, Eye } from "lucide-react";

interface BlogStatsCardsProps {
  stats: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
  };
}

export default function BlogStatsCards({ stats }: BlogStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-400">Total Blog Posts</p>
          <h3 className="text-2xl font-bold text-charcoal-900 mt-1">{stats.totalBlogs}</h3>
          <p className="text-[11px] text-charcoal-400 mt-0.5">In Veda Library</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-saffron-50 flex items-center justify-center text-saffron-600">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-400">Published Posts</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.publishedBlogs}</h3>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Live for devotees</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-400">Drafts in Progress</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.draftBlogs}</h3>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Unpublished</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-400">Total Devotee Reads</p>
          <h3 className="text-2xl font-bold text-purple-600 mt-1">{stats.totalViews.toLocaleString()}</h3>
          <p className="text-[11px] text-purple-600/80 mt-0.5">Across all articles</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
          <Eye className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
