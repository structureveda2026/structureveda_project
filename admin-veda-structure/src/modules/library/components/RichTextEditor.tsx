import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  RotateCcw,
  RotateCw,
  Eye,
  FileCode,
  Edit3,
  Check,
  X,
  Upload,
} from "lucide-react";
import { uploadImage } from "@/services/mediaUploadService";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Type your content here... Select text and click H1, H2, Bold, or Link to format.",
  minHeight = "360px",
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const [activeMode, setActiveMode] = useState<"visual" | "html" | "preview">("visual");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Sync external HTML value into contenteditable
  useEffect(() => {
    if (editorRef.current && activeMode === "visual") {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeMode]);

  const handleContentInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === "<p><br></p>" || html === "<br>" ? "" : html);
    }
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      setSavedSelection(range.cloneRange());
      return range;
    }
    return null;
  };

  const restoreSavedSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
  };

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (disabled || activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleContentInput();
  };

  /**
   * Apply Heading Format (H1, H2, H3, H4, P, Blockquote, Pre)
   */
  const applyBlockFormat = (tag: string) => {
    if (disabled || activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Standard formatBlock with browser fallback
    try {
      // In Chromium / modern browsers formatBlock accepts tag name or `<tag>`
      const success = document.execCommand("formatBlock", false, `<${tag}>`);
      if (!success) {
        document.execCommand("formatBlock", false, tag);
      }
    } catch {
      document.execCommand("formatBlock", false, tag);
    }

    handleContentInput();
  };

  /**
   * Open Link Modal and capture selected text
   */
  const handleOpenLinkModal = () => {
    const range = saveCurrentSelection();
    const selectedText = range ? range.toString().trim() : "";
    setLinkText(selectedText);
    setLinkUrl("");
    setShowLinkModal(true);
    setTimeout(() => {
      linkInputRef.current?.focus();
    }, 100);
  };

  /**
   * Apply Hyperlink href to selected text
   */
  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      setShowLinkModal(false);
      return;
    }

    if (activeMode === "visual") {
      restoreSavedSelection();
      if (editorRef.current) {
        editorRef.current.focus();
      }

      let formattedUrl = linkUrl.trim();
      if (
        !/^https?:\/\//i.test(formattedUrl) &&
        !formattedUrl.startsWith("mailto:") &&
        !formattedUrl.startsWith("/") &&
        !formattedUrl.startsWith("#")
      ) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const currentSel = window.getSelection();
      const hasSelection = currentSel && !currentSel.isCollapsed && currentSel.toString().trim().length > 0;

      if (linkText.trim() && (!hasSelection || linkText.trim() !== currentSel?.toString().trim())) {
        const linkHtml = `<a href="${formattedUrl}" ${
          openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ""
        } class="text-saffron-600 underline font-medium hover:text-saffron-700">${linkText.trim()}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
      } else {
        document.execCommand("createLink", false, formattedUrl);
        // Ensure proper classes and target on newly created anchor tags
        if (editorRef.current) {
          const links = editorRef.current.querySelectorAll("a");
          links.forEach((a) => {
            if (a.getAttribute("href") === formattedUrl) {
              if (openInNewTab) {
                a.setAttribute("target", "_blank");
                a.setAttribute("rel", "noopener noreferrer");
              }
              a.className = "text-saffron-600 underline font-medium hover:text-saffron-700";
            }
          });
        }
      }

      handleContentInput();
    } else if (activeMode === "html") {
      const linkTag = `<a href="${linkUrl}" ${
        openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : ""
      } class="text-saffron-600 underline font-medium">${linkText || linkUrl}</a>`;
      onChange(value + linkTag);
    }

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Image Insertion
  const handleInsertImage = (url: string, alt: string = "") => {
    if (!url.trim()) return;

    const imgTag = `<div class="my-4"><img src="${url}" alt="${
      alt || "Blog Image"
    }" class="rounded-xl max-w-full h-auto shadow-sm border border-cream-200 mx-auto" /></div><p><br></p>`;

    if (activeMode === "visual") {
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand("insertHTML", false, imgTag);
      handleContentInput();
    } else {
      onChange(value + "\n" + imgTag);
    }
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploaded = await uploadImage(file, { folder: "veda-blogs" });
      handleInsertImage(uploaded.url, file.name);
    } catch {
      const previewUrl = URL.createObjectURL(file);
      handleInsertImage(previewUrl, file.name);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const plainText = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="border border-cream-300 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-saffron-400 focus-within:border-saffron-500 transition-all">
      {/* Top Main Toolbar */}
      <div className="bg-cream-50/90 border-b border-cream-200 px-3 py-2 flex flex-wrap items-center justify-between gap-1.5 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Dedicated Headings Group */}
          <div className="flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("p");
              }}
              className="px-2.5 py-1 text-xs font-semibold text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
              title="Normal Paragraph (P)"
            >
              Paragraph
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("h1");
              }}
              className="px-2 py-1 text-xs font-extrabold text-charcoal-900 hover:bg-saffron-100 hover:text-saffron-800 rounded-lg transition border-l border-cream-200"
              title="Heading 1 (H1) - Main Section Title"
            >
              H1
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("h2");
              }}
              className="px-2 py-1 text-xs font-bold text-charcoal-800 hover:bg-saffron-100 hover:text-saffron-800 rounded-lg transition border-l border-cream-200"
              title="Heading 2 (H2) - Section Subtitle"
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("h3");
              }}
              className="px-2 py-1 text-xs font-semibold text-charcoal-700 hover:bg-saffron-100 hover:text-saffron-800 rounded-lg transition border-l border-cream-200"
              title="Heading 3 (H3)"
            >
              H3
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("h4");
              }}
              className="px-2 py-1 text-xs font-medium text-charcoal-600 hover:bg-saffron-100 hover:text-saffron-800 rounded-lg transition border-l border-cream-200"
              title="Heading 4 (H4)"
            >
              H4
            </button>
          </div>

          {/* Text Styling (Bold, Italic, Underline, Strike) */}
          <div className="flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("bold");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("italic");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("underline");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("strikeThrough");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Lists (Bulleted & Ordered) */}
          <div className="flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertUnorderedList");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertOrderedList");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Hyperlinks (Insert Link & Remove Link) */}
          <div className="flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleOpenLinkModal();
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-saffron-700 hover:bg-saffron-50 rounded-lg transition"
              title="Insert Hyperlink (href)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("unlink");
              }}
              className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Remove Hyperlink"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Media & Quotes */}
          <div className="flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyBlockFormat("blockquote");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertHorizontalRule");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded-lg transition"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowImageModal(true);
              }}
              className="p-1.5 text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {/* Alignment */}
          <div className="hidden sm:flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyLeft");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyCenter");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("justifyRight");
              }}
              className="p-1.5 text-charcoal-700 hover:bg-cream-100 rounded-lg transition"
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="hidden md:flex items-center bg-white rounded-xl border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("undo");
              }}
              className="p-1.5 text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
              title="Undo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("redo");
              }}
              className="p-1.5 text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
              title="Redo"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-cream-200/80 p-0.5 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveMode("visual")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeMode === "visual"
                ? "bg-white text-saffron-700 shadow-xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("html")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeMode === "html"
                ? "bg-white text-saffron-700 shadow-xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("preview")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              activeMode === "preview"
                ? "bg-white text-saffron-700 shadow-xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Explicit Typography Styles */}
      <div className="relative">
        {activeMode === "visual" && (
          <div
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleContentInput}
            onBlur={handleContentInput}
            style={{ minHeight }}
            className="rich-text-editor p-5 sm:p-7 outline-none overflow-y-auto max-w-none text-charcoal-900 leading-relaxed font-sans focus:outline-none"
            data-placeholder={placeholder}
          />
        )}

        {activeMode === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            disabled={disabled}
            placeholder="<p>Enter HTML formatted blog content here...</p>"
            className="w-full p-5 sm:p-7 font-mono text-xs sm:text-sm text-charcoal-800 bg-cream-50/40 border-none outline-none resize-y leading-relaxed focus:ring-0"
          />
        )}

        {activeMode === "preview" && (
          <div
            style={{ minHeight }}
            className="rich-text-content p-5 sm:p-7 overflow-y-auto bg-amber-50/20"
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-charcoal-400">
                <Eye className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Nothing to preview yet. Start typing in the Visual tab.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Bar */}
      <div className="bg-cream-50/60 border-t border-cream-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-charcoal-500 gap-2">
        <div className="flex items-center gap-4">
          <span>
            Words: <strong className="text-charcoal-700">{wordCount}</strong>
          </span>
          <span>
            Characters: <strong className="text-charcoal-700">{charCount}</strong>
          </span>
          <span className="hidden sm:inline">
            Estimated Reading Time: <strong className="text-saffron-600">{estimatedReadTime} min</strong>
          </span>
        </div>
        <div className="text-[11px] text-charcoal-400">
          💡 Select any text & click <strong>H1</strong>, <strong>H2</strong>, or <strong>Link</strong> to format instantly.
        </div>
      </div>

      {/* Hyperlink Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-cream-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <h4 className="font-bold text-charcoal-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-saffron-600" />
                <span>Insert Hyperlink (href)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyLink();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <input
                  ref={linkInputRef}
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /puja/rudra"
                  required
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Link Text / Anchor Label
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="E.g. Click here to learn more"
                  className="w-full px-3 py-2 text-sm border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
                />
                <span>Open link in new tab (target="_blank")</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!linkUrl.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded-lg transition disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Insert Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Insertion Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-cream-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <h4 className="font-bold text-charcoal-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Insert Image into Content</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-cream-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-cream-300 rounded-xl p-4 text-center hover:border-saffron-400 transition bg-cream-50/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="editor-file-upload-lib-v2"
                />
                <label
                  htmlFor="editor-file-upload-lib-v2"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                >
                  <Upload className="w-6 h-6 text-saffron-600 mb-1" />
                  <span className="text-xs font-semibold text-charcoal-800">
                    {isUploadingImage ? "Uploading image..." : "Upload from Computer"}
                  </span>
                  <span className="text-[11px] text-charcoal-400">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                </label>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-cream-200 w-full" />
                <span className="bg-white px-2 text-[11px] text-charcoal-400 uppercase font-medium">
                  or enter URL
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Image Web Address (URL)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    Alt Description
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="E.g. Puja ceremony offering"
                    className="w-full px-3 py-2 text-sm border border-cream-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-cream-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInsertImage(imageUrl, imageAlt)}
                disabled={!imageUrl.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Insert Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
