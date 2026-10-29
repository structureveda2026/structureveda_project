import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  RotateCcw,
  RotateCw,
  Eye,
  FileCode,
  Edit3,
  Check,
  X,
} from "lucide-react";

export interface CompactRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  compact?: boolean; // When true, displays an ultra-streamlined toolbar suited for FAQ answers
  disabled?: boolean;
}

export default function CompactRichTextEditor({
  value,
  onChange,
  placeholder = "Write content here... Select text to apply formatting.",
  minHeight = "120px",
  compact = false,
  disabled = false,
}: CompactRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const [activeMode, setActiveMode] = useState<"visual" | "html" | "preview">("visual");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

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
      onChange(html === "<p><br></p>" || html === "<br>" || html.trim() === "" ? "" : html);
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

  const applyBlockFormat = (tag: string) => {
    if (disabled || activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      const success = document.execCommand("formatBlock", false, `<${tag}>`);
      if (!success) {
        document.execCommand("formatBlock", false, tag);
      }
    } catch {
      document.execCommand("formatBlock", false, tag);
    }
    handleContentInput();
  };

  const handleOpenLinkModal = () => {
    const range = saveCurrentSelection();
    const selectedText = range ? range.toString().trim() : "";
    setLinkText(selectedText);
    setLinkUrl("");
    setShowLinkModal(true);
    setTimeout(() => {
      linkInputRef.current?.focus();
    }, 80);
  };

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

  const plainText = (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;

  return (
    <div className="border border-cream-300 rounded-xl bg-white shadow-2xs overflow-hidden focus-within:ring-1 focus-within:ring-saffron-400 focus-within:border-saffron-400 transition-all">
      {/* Streamlined Toolbar */}
      <div className="bg-cream-50/90 border-b border-cream-200 px-2 py-1 flex flex-wrap items-center justify-between gap-1 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings (P, H2, H3) - Shown in non-compact mode or when space permits */}
          {!compact && (
            <div className="flex items-center bg-white rounded-lg border border-cream-200 p-0.5 shadow-2xs text-xs">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyBlockFormat("p");
                }}
                className="px-2 py-0.5 text-[11px] font-semibold text-charcoal-700 hover:bg-cream-100 rounded transition"
                title="Normal Paragraph"
              >
                P
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyBlockFormat("h2");
                }}
                className="px-2 py-0.5 text-[11px] font-bold text-charcoal-800 hover:bg-saffron-100 hover:text-saffron-800 rounded transition border-l border-cream-200"
                title="Heading 2 (Section Title)"
              >
                H2
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyBlockFormat("h3");
                }}
                className="px-2 py-0.5 text-[11px] font-semibold text-charcoal-700 hover:bg-saffron-100 hover:text-saffron-800 rounded transition border-l border-cream-200"
                title="Heading 3 (Sub-heading)"
              >
                H3
              </button>
            </div>
          )}

          {/* Text Styling: Bold, Italic, Underline */}
          <div className="flex items-center bg-white rounded-lg border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("bold");
              }}
              className="p-1 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded transition"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("italic");
              }}
              className="p-1 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded transition"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("underline");
              }}
              className="p-1 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded transition"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists: Bullets & Numbered */}
          <div className="flex items-center bg-white rounded-lg border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertUnorderedList");
              }}
              className="p-1 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded transition"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("insertOrderedList");
              }}
              className="p-1 text-charcoal-700 hover:bg-cream-100 hover:text-saffron-600 rounded transition"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Link controls */}
          <div className="flex items-center bg-white rounded-lg border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleOpenLinkModal();
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold text-saffron-700 hover:bg-saffron-50 rounded transition"
              title="Insert Link"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Link</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("unlink");
              }}
              className="p-1 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Remove Link"
            >
              <Unlink className="w-3 h-3" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center bg-white rounded-lg border border-cream-200 p-0.5 shadow-2xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("undo");
              }}
              className="p-1 text-charcoal-500 hover:bg-cream-100 rounded transition"
              title="Undo"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                executeCommand("redo");
              }}
              className="p-1 text-charcoal-500 hover:bg-cream-100 rounded transition"
              title="Redo"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-cream-200/80 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setActiveMode("visual")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              activeMode === "visual"
                ? "bg-white text-saffron-700 shadow-2xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("html")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              activeMode === "html"
                ? "bg-white text-saffron-700 shadow-2xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <FileCode className="w-3 h-3" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("preview")}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
              activeMode === "preview"
                ? "bg-white text-saffron-700 shadow-2xs font-semibold"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative">
        {activeMode === "visual" && (
          <div
            ref={editorRef}
            contentEditable={!disabled}
            onInput={handleContentInput}
            onBlur={handleContentInput}
            style={{ minHeight }}
            className="p-3 text-xs text-charcoal-900 leading-relaxed outline-none overflow-y-auto max-w-none focus:outline-none"
            data-placeholder={placeholder}
          />
        )}

        {activeMode === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            disabled={disabled}
            placeholder="<p>Enter HTML formatted content...</p>"
            className="w-full p-3 font-mono text-xs text-charcoal-800 bg-cream-50/40 border-none outline-none resize-y leading-relaxed focus:ring-0"
          />
        )}

        {activeMode === "preview" && (
          <div
            style={{ minHeight }}
            className="p-3 text-xs leading-relaxed text-charcoal-800 overflow-y-auto bg-amber-50/20"
          >
            {value ? (
              <div
                className="prose prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <p className="text-charcoal-400 italic text-center py-4">
                Nothing to preview.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Metrics Bar - Only displayed on non-compact mode */}
      {!compact && (
        <div className="bg-cream-50/60 border-t border-cream-200 px-3 py-1 flex items-center justify-between text-[11px] text-charcoal-500">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-charcoal-700">{wordCount}</strong>
            </span>
            <span>
              Characters: <strong className="text-charcoal-700">{charCount}</strong>
            </span>
          </div>
          <span className="text-[10.5px] text-charcoal-400">
            Rich-Text Formatted
          </span>
        </div>
      )}

      {/* Hyperlink Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-cream-200 w-full max-w-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-cream-200">
              <h4 className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
                <span>Insert Link</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded hover:bg-cream-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyLink();
              }}
              className="space-y-2.5"
            >
              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  ref={linkInputRef}
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-cream-300 rounded-lg focus:ring-1 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link label"
                  className="w-full px-2.5 py-1.5 text-xs border border-cream-300 rounded-lg focus:ring-1 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-[11px] text-charcoal-700 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
                />
                <span>Open link in new tab</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1 text-xs font-medium text-charcoal-600 hover:bg-cream-100 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!linkUrl.trim()}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-saffron-600 hover:bg-saffron-700 rounded transition disabled:opacity-50"
                >
                  <Check className="w-3 h-3" />
                  <span>Insert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
