import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight, Share2, Check, ArrowLeft } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const LibraryBreadcrumbs = ({ path = [], onSelectNode }) => {
  const { isHindi } = useLibraryLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    if (path.length > 1) {
      const parentNode = path[path.length - 2];
      onSelectNode ? onSelectNode(parentNode.id) : navigate(`/library?node=${parentNode.id}`);
    } else {
      onSelectNode ? onSelectNode(null) : navigate("/library");
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebdcc4] bg-[#fffcf7] px-3.5 py-2.5 sm:px-6 sm:py-3 rounded-2xl shadow-xs mb-6">
      {/* Responsive Breadcrumb Trail */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 whitespace-nowrap text-[12px] sm:text-[13px] text-[#71614f] -mx-1 px-1 sm:flex-wrap"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 min-h-[44px] px-1 text-[#8b7660] hover:text-[#c88918] transition-colors shrink-0"
        >
          <Home size={14} />
          <span>{isHindi ? "होम" : "Home"}</span>
        </Link>

        <ChevronRight size={13} className="text-[#c2af96] shrink-0" />

        <Link
          to="/library"
          onClick={(e) => {
            if (onSelectNode) {
              e.preventDefault();
              onSelectNode(null);
            }
          }}
          className={`inline-flex items-center min-h-[44px] px-1 hover:text-[#c88918] transition-colors font-medium shrink-0 ${
            path.length === 0 ? "text-[#c88918] font-bold" : ""
          }`}
        >
          {isHindi ? "वेद पुस्तकालय" : "Veda Library"}
        </Link>

        {path.map((node, index) => {
          const isLast = index === path.length - 1;
          const label = isHindi ? node.shortTitle?.hi || node.title?.hi : node.shortTitle?.en || node.title?.en;

          return (
            <div key={node.id} className="inline-flex items-center gap-1.5 shrink-0">
              <ChevronRight size={13} className="text-[#c2af96]" />
              {isLast ? (
                <span className="font-bold text-[#c88918] bg-[#f9edd5] px-2.5 py-1.5 rounded-lg border border-[#ebd2a0] text-[12px]">
                  {label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => (onSelectNode ? onSelectNode(node.id) : navigate(`/library?node=${node.id}`))}
                  className="hover:text-[#c88918] transition-colors cursor-pointer text-left min-h-[44px] px-1 inline-flex items-center"
                >
                  {label}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Action Controls (Prominent Back & Share) */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
        {path.length > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer inline-flex items-center gap-1.5 min-h-[44px] rounded-xl border border-[#e2cca4] bg-white px-3.5 py-2 text-[12px] font-bold text-[#6f5b45] transition hover:border-[#c88918] hover:text-[#c88918] shadow-2xs"
            title={isHindi ? "पिछले स्तर पर वापस जाएँ" : "Go back to previous level"}
          >
            <ArrowLeft size={14} />
            <span>{isHindi ? "पीछे जाएँ" : "Back"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="cursor-pointer inline-flex items-center gap-1.5 min-h-[44px] rounded-xl border border-[#e2cca4] bg-white px-3.5 py-2 text-[12px] font-bold text-[#6f5b45] transition hover:border-[#c88918] hover:text-[#c88918] shadow-2xs ml-auto sm:ml-0"
          title={isHindi ? "इस पावन प्रभाग का लिंक शेयर करें" : "Share link to this sacred section"}
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              <span className="text-green-700">{isHindi ? "कॉपी हुआ!" : "Copied!"}</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>{isHindi ? "शेयर" : "Share"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LibraryBreadcrumbs;
