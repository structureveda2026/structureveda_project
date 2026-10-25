import { useState } from "react";
import {
  Image,
  Send,
  Calendar,
  X,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  COMMUNITY_TOPICS,
  createCommunityPost,
  getUserCustomProfile,
} from "../data/communityMockData";

const CommunityPostComposer = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("Vedic Scriptures");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [mediaImage, setMediaImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSession, setIsSession] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionMode, setSessionMode] = useState("Online Discussion Circle");
  const [publishedToast, setPublishedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const customProfile = getUserCustomProfile();

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, "");
    if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      setErrorMsg("Please write at least 10 characters to share a meaningful thought.");
      return;
    }
    setErrorMsg("");

    const newPost = createCommunityPost({
      content,
      topic,
      tags: tags.length > 0 ? tags : ["VedaCommunity", "SanatanaDharma"],
      mediaImage,
      isSession,
      sessionDate: isSession ? sessionDate : "",
      sessionMode: isSession ? sessionMode : "",
      authorName: customProfile?.displayName || customProfile?.fullName || "Spiritual Scholar",
      authorRole: customProfile?.professionalType || "Vedic Practitioner",
      authorSlug: customProfile?.slug || "community-member",
      authorAvatar: customProfile?.avatar || "",
      authorHeadline: customProfile?.headline || "Member of Veda Structure Community",
    });

    setContent("");
    setTags([]);
    setMediaImage("");
    setShowImageInput(false);
    setIsSession(false);
    setSessionDate("");
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3000);

    if (onPostCreated) {
      onPostCreated(newPost);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 sm:p-6 shadow-[0_2px_14px_rgba(43,36,29,0.04)] mb-6 transition-all">
      {/* Composer Header & Identity */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#d4af37] via-[#ebdcc2] to-[#b35d14] shrink-0">
            {customProfile?.avatar ? (
              <img
                src={customProfile.avatar}
                alt={customProfile.displayName}
                className="w-full h-full rounded-[8px] object-cover bg-white"
              />
            ) : (
              <div className="w-full h-full rounded-[8px] bg-[#faeed8] flex items-center justify-center text-[#8a4e17] font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <p className="font-serif text-sm font-bold text-[#2b241d]">
              {customProfile?.displayName || "Share with the Vedic Community"}
            </p>
            <p className="text-[11px] text-[#7d6857]">
              {customProfile
                ? `Posting as ${customProfile.professionalType || "Practitioner"} (Demo)`
                : "Open to Pandits, Astrologers, Gurukul scholars & Devotees"}
            </p>
          </div>
        </div>

        {/* Selected Topic Pill */}
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="Discussion topic"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] hover:bg-white text-[#8a4e17] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/25 transition cursor-pointer"
        >
          {COMMUNITY_TOPICS.filter((t) => t !== "All").map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Main Composer Textarea */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="Share a Vedic reflection, shastra injunction, Sanskrit stotra study, or question for fellow Acharyas..."
          className="w-full p-3.5 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] text-sm text-[#2b241d] placeholder:text-[#9e8b78] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/25 focus:border-[#b35d14] transition leading-relaxed resize-none"
        />

        {content.length > 0 && (
          <div className="flex justify-end -mt-1">
            <span
              className={`text-[10px] ${
                content.trim().length < 10
                  ? "text-amber-700 font-medium"
                  : "text-[#8c745e]"
              }`}
            >
              {content.length} characters {content.trim().length < 10 && "(min 10)"}
            </span>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </p>
        )}

        {/* Image Attachment Preview */}
        {mediaImage && (
          <div className="relative rounded-xl overflow-hidden border border-[#ebdcc2] max-h-52 bg-stone-50">
            <img
              src={mediaImage}
              alt="Uploaded preview"
              className="w-full h-full object-cover max-h-52"
            />
            <button
              type="button"
              onClick={() => setMediaImage("")}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Image Input Drawer */}
        {showImageInput && !mediaImage && (
          <div className="p-3 rounded-xl bg-[#fffdfa] border border-[#f0e4cf] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#4a3727]">Attach an Illustrative Image</span>
              <button
                type="button"
                onClick={() => setShowImageInput(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="text-xs text-[#6b5542] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-[#d6be9a] file:text-xs file:font-semibold file:bg-[#faeed8] file:text-[#8a4e17] hover:file:bg-[#f5dfb8] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Session / Study Circle Options Drawer */}
        {isSession && (
          <div className="p-3.5 rounded-xl bg-[#fbf6ec] border border-[#ebd6ab] space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#8a4e17] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Live Discussion or Study Session Details
              </span>
              <button
                type="button"
                onClick={() => setIsSession(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#665342] mb-1">
                  Date & Time
                </label>
                <input
                  type="text"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  placeholder="e.g. Sunday, Oct 26 • 10:00 AM IST"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#dfcdb5] bg-white text-xs text-[#2b241d]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#665342] mb-1">
                  Format / Mode
                </label>
                <input
                  type="text"
                  value={sessionMode}
                  onChange={(e) => setSessionMode(e.target.value)}
                  placeholder="e.g. Interactive Google Meet / Satsang"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#dfcdb5] bg-white text-xs text-[#2b241d]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tag chips & Quick tag input */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#faeed8] text-[#8a4e17] border border-[#d6be9a]"
            >
              <span>#{t}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(t)}
                className="hover:text-rose-700"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}

          {tags.length < 4 && (
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="+ tag (press Enter)"
                className="px-2 py-0.5 rounded-full border border-dashed border-[#d6be9a] bg-transparent text-[11px] text-[#705238] placeholder:text-[#a08975] focus:outline-none focus:border-[#9b4e10]"
              />
            </div>
          )}
        </div>

        {/* Toolbar & Actions Bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f0e4cf]">
          <div className="flex items-center gap-1 text-xs text-[#6e5845]">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#faf4e8] hover:text-[#9b4e10] transition"
              title="Add illustrative image"
            >
              <Image className="w-4 h-4 text-[#b35d14]" />
              <span className="hidden sm:inline">Image</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSession(!isSession)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                isSession
                  ? "bg-[#faeed8] text-[#9b4e10] font-semibold"
                  : "hover:bg-[#faf4e8] hover:text-[#9b4e10]"
              }`}
              title="Add live study session info"
            >
              <Calendar className="w-4 h-4 text-[#b35d14]" />
              <span className="hidden sm:inline">Study Session</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#9b4e10] via-[#b35d14] to-[#c76d1a] hover:from-[#853f09] hover:via-[#a0520d] hover:to-[#b35d14] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-xs transition transform active:scale-95 cursor-pointer"
          >
            <span>Publish</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Confirmation Toast */}
      {publishedToast && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your discussion post has been published to the community feed!</span>
        </div>
      )}
    </div>
  );
};

export default CommunityPostComposer;
