import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Bold,
  Italic,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import mediaUploadService, {
  resolveMediaUrl,
  isUploadedImageUrl,
} from "@/services/mediaUploadService";
import libraryBranchService, {
  LibraryBranch,
} from "../services/libraryBranch.service";
import libraryMantraStotraService from "../services/libraryMantraStotra.service";
import {
  LibraryMantraStotra,
  MantraStotraBenefit,
  MantraStotraCanonAnga,
  MantraStotraStatus,
  MantraStotraType,
  MantraStotraVerse,
  MantraStotraVidhi,
} from "../types/mantraStotra.types";

function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }
  return fallback;
}

const EMPTY_CANON_ANGA: MantraStotraCanonAnga = {
  rishi: "",
  chhandas: "",
  devata: "",
  beejam: "",
  shakti: "",
  keelakam: "",
};

const EMPTY_VIDHI: MantraStotraVidhi = {
  bestDay: "",
  muhurat: "",
  direction: "",
  asana: "",
  mala: "",
  sankhya: "108",
  samagri: "",
};

export default function MantraStotraUploadWizardPage() {
  const { id: editId, type: routeType } = useParams<{
    id?: string;
    type?: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const isEditMode = Boolean(editId);

  const rawTypeParam = (searchParams.get("type") || routeType || "").trim().toLowerCase();
  const isTypeScoped = isEditMode || Boolean(rawTypeParam);
  const initialTypeParam: string = rawTypeParam || "mantra";
  const initialBranchIdParam = searchParams.get("branchId") || "";
  const initialStepParam = searchParams.get("step") === "2" ? 2 : 1;
  const returnToParam = searchParams.get("returnTo") || "";

  const formatTypeLabel = (type: string) => {
    if (!type) return "Content";
    if (type === "mantra") return "Mantra";
    if (type === "stotra") return "Stotra";
    if (type === "sukti") return "Sukti";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Step & Context State
  const [step, setStep] = useState<1 | 2>(2);
  const [contentType, setContentType] = useState<string>(initialTypeParam);
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] =
    useState<string>(initialBranchIdParam);
  const [itemLoading, setItemLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  // Step 2 Content Form State
  const [title, setTitle] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [subtitleHi, setSubtitleHi] = useState("");
  const [deity, setDeity] = useState("");
  const [deityHi, setDeityHi] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [sanskrit, setSanskrit] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [hindiTranslation, setHindiTranslation] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [hinglishTranslation, setHinglishTranslation] = useState("");
  const [count, setCount] = useState("108 Chants (1 Mala)");
  const [astrologicalRemedy, setAstrologicalRemedy] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<MantraStotraStatus>("ACTIVE");

  const [vidhi, setVidhi] = useState<MantraStotraVidhi>({ ...EMPTY_VIDHI });
  const [canonAnga, setCanonAnga] = useState<MantraStotraCanonAnga>({
    ...EMPTY_CANON_ANGA,
  });
  const [benefits, setBenefits] = useState<MantraStotraBenefit[]>([
    { category: "Spiritual", textHi: "", textEn: "" },
  ]);
  const [verses, setVerses] = useState<MantraStotraVerse[]>([]);
  const sanskritEditorRef = useRef<HTMLDivElement>(null);
  const isEditorFocusedRef = useRef(false);

  const setEditorRef = useCallback(
    (node: HTMLDivElement | null) => {
      sanskritEditorRef.current = node;
      if (node && !isEditorFocusedRef.current) {
        const formatted = (sanskrit || "")
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>")
          .replace(/\n/g, "<br>");
        if (node.innerHTML !== formatted) {
          node.innerHTML = formatted;
        }
      }
    },
    [sanskrit]
  );

  useEffect(() => {
    if (sanskritEditorRef.current && !isEditorFocusedRef.current) {
      const formatted = (sanskrit || "")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/\n/g, "<br>");
      if (sanskritEditorRef.current.innerHTML !== formatted) {
        sanskritEditorRef.current.innerHTML = formatted;
      }
    }
  }, [sanskrit, itemLoading]);

  const applySanskritFormat = (format: "bold" | "italic" | "space" | "newline") => {
    const editor = sanskritEditorRef.current;
    if (!editor) return;
    editor.focus();

    if (format === "bold") {
      document.execCommand("bold", false);
    } else if (format === "italic") {
      document.execCommand("italic", false);
    } else if (format === "space") {
      document.execCommand("insertText", false, " ");
    } else if (format === "newline") {
      document.execCommand("insertLineBreak");
    }

    setSanskrit(editor.innerHTML);
  };

  // Inline Create Branch State
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchEnName, setNewBranchEnName] = useState("");
  const [newBranchSlug, setNewBranchSlug] = useState("");
  const [newBranchSlugEdited, setNewBranchSlugEdited] = useState(false);
  const [newBranchDeity, setNewBranchDeity] = useState("");
  const [newBranchDesc, setNewBranchDesc] = useState("");
  const [newBranchImageKey, setNewBranchImageKey] = useState("");
  const [newBranchStatus, setNewBranchStatus] = useState<"ACTIVE" | "INACTIVE">(
    "ACTIVE"
  );
  const [branchImageUploading, setBranchImageUploading] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const branchImageInputRef = useRef<HTMLInputElement>(null);

  // Voice Speech-to-Text State & Handlers (Web Speech API)
  const [isListeningSanskrit, setIsListeningSanskrit] = useState(false);
  const [isListeningHindi, setIsListeningHindi] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoiceInput = (targetField: "sanskrit" | "hindi") => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showError("Voice speech-to-text is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
      setIsListeningSanskrit(false);
      setIsListeningHindi(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = true;
      recognition.interimResults = false;

      if (targetField === "sanskrit") setIsListeningSanskrit(true);
      else setIsListeningHindi(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (targetField === "sanskrit") {
          setSanskrit((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
        } else {
          setHindiTranslation((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListeningSanskrit(false);
        setIsListeningHindi(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListeningSanskrit(false);
        setIsListeningHindi(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningSanskrit(false);
      setIsListeningHindi(false);
      recognitionRef.current = null;
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListeningSanskrit(false);
    setIsListeningHindi(false);
  };



  // Collapsible Optional Sections
  const [showCanonSection, setShowCanonSection] = useState(false);
  const [showVersesSection, setShowVersesSection] = useState(false);
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const selectedBranch =
    branches.find(
      (b) => b.id === selectedBranchId || b.slug === selectedBranchId
    ) || null;
  const itemsReturnUrl = `/admin/library/mantra-stotra-items?${new URLSearchParams({
    type: contentType,
    ...(selectedBranch ? { branchId: selectedBranch.id } : {}),
  }).toString()}`;

  const loadBranchesForType = useCallback(
    async (typeToLoad: string) => {
      setBranchesLoading(true);
      try {
        const list = await libraryBranchService.getBranches(typeToLoad);
        setBranches(list);
        return list;
      } catch (err: unknown) {
        showError(getErrorMessage(err, "Failed to load deity branches."));
        return [];
      } finally {
        setBranchesLoading(false);
      }
    },
    [showError]
  );

  // Sync contentType when route param or query param changes in create mode
  useEffect(() => {
    if (isEditMode) return;
    const raw = (searchParams.get("type") || routeType || "").trim().toLowerCase();
    if (raw && raw !== contentType) {
      setContentType(raw);
    }
  }, [isEditMode, routeType, searchParams, contentType]);

  // Initial load for create mode or query-param quick upload
  useEffect(() => {
    if (isEditMode) return;
    let active = true;
    loadBranchesForType(contentType).then((loaded) => {
      if (!active) return;
      if (initialBranchIdParam) {
        const matched = loaded.find(
          (b) =>
            b.id === initialBranchIdParam || b.slug === initialBranchIdParam
        );
        if (matched) {
          setSelectedBranchId(matched.id);
          setDeity((prev) => prev || matched.deity || matched.enName || matched.name);
        } else if (loaded.length > 0 && !selectedBranchId) {
          setSelectedBranchId(loaded[0].id);
          setDeity((prev) => prev || loaded[0].deity || loaded[0].enName || loaded[0].name);
        }
        setStep(2);
      }
    });
    return () => {
      active = false;
    };
  }, [
    isEditMode,
    contentType,
    initialBranchIdParam,
    initialStepParam,
    loadBranchesForType,
  ]);

  // Edit mode load
  useEffect(() => {
    if (!editId) return;
    let active = true;
    setItemLoading(true);
    libraryMantraStotraService
      .getItemById(editId)
      .then(async (item) => {
        if (!active) return;
        const itemType = (item.type || item.categorySlug || "mantra").toLowerCase();
        setContentType(itemType);
        await loadBranchesForType(itemType);
        if (!active) return;

        setSelectedBranchId(item.branchId || item.branchSlug || "");
        setTitle(item.title || "");
        setTitleHi(item.titleHi || "");
        setSlug(item.slug || "");
        setSlugEdited(true);
        setSubtitle(item.subtitle || "");
        setSubtitleHi(item.subtitleHi || "");
        setDeity(item.deity || "");
        setDeityHi(item.deityHi || "");
        setSourceRef(item.sourceRef || "");
        const loadedSanskrit = item.sanskrit || item.keyVerse?.sanskrit || "";
        setSanskrit(loadedSanskrit);
        setTransliteration(item.transliteration || "");
        setHindiTranslation(item.hindiTranslation || "");
        setEnglishTranslation(item.englishTranslation || "");
        setHinglishTranslation(item.hinglishTranslation || "");
        setCount(item.count || item.vidhi?.sankhya || "108 Chants (1 Mala)");
        setAstrologicalRemedy(item.astrologicalRemedy || "");
        setAudioUrl(item.audioUrl || "");
        setFeaturedImage(item.featuredImage || "");
        setTagsInput(Array.isArray(item.tags) ? item.tags.join(", ") : "");
        setIsFeatured(Boolean(item.isFeatured));
        setStatus(item.status || "ACTIVE");

        setVidhi({
          bestDay: item.vidhi?.bestDay || "",
          muhurat: item.vidhi?.muhurat || "",
          direction: item.vidhi?.direction || "",
          asana: item.vidhi?.asana || "",
          mala: item.vidhi?.mala || "",
          sankhya: item.vidhi?.sankhya || "108",
          samagri: item.vidhi?.samagri || "",
        });

        const loadedCanon: MantraStotraCanonAnga = {
          rishi: item.canonAnga?.rishi || item.rishi || "",
          chhandas: item.canonAnga?.chhandas || item.chhandas || "",
          devata: item.canonAnga?.devata || "",
          beejam: item.canonAnga?.beejam || "",
          shakti: item.canonAnga?.shakti || "",
          keelakam: item.canonAnga?.keelakam || "",
        };
        setCanonAnga(loadedCanon);
        if (Object.values(loadedCanon).some((v) => Boolean(v))) {
          setShowCanonSection(true);
        }

        if (Array.isArray(item.benefits) && item.benefits.length > 0) {
          setBenefits(item.benefits);
        }

        if (Array.isArray(item.verses) && item.verses.length > 0) {
          setVerses(item.verses);
          setShowVersesSection(true);
        }
        setStep(2);
      })
      .catch((err: unknown) => {
        showError(getErrorMessage(err, "Failed to load item for editing."));
      })
      .finally(() => {
        if (active) setItemLoading(false);
      });

    return () => {
      active = false;
    };
  }, [editId, loadBranchesForType, showError]);

  const handleTypeSwitch = (nextType: string) => {
    if (nextType === contentType) return;
    setContentType(nextType);
    setSelectedBranchId("");
    setShowCreateBranch(false);
  };

  const handleSelectBranch = (branch: LibraryBranch) => {
    setSelectedBranchId(branch.id);
    if (!deity.trim()) {
      setDeity(branch.deity || branch.enName || branch.name);
    }
  };

  const handleBranchImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBranchImageUploading(true);
    try {
      const uploaded = await mediaUploadService.uploadImage(file, {
        folder: "library/branches",
      });
      setNewBranchImageKey(uploaded.url);
      showSuccess("Deity image uploaded.");
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to upload deity image."));
    } finally {
      setBranchImageUploading(false);
      if (branchImageInputRef.current) {
        branchImageInputRef.current.value = "";
      }
    }
  };

  const handleCreateInlineBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      showError("Branch name is required.");
      return;
    }
    const finalSlug =
      newBranchSlug.trim() || slugifyText(newBranchEnName || newBranchName);
    if (!finalSlug) {
      showError("Please enter a valid branch slug.");
      return;
    }

    setCreatingBranch(true);
    try {
      const created = await libraryBranchService.createBranch(contentType, {
        categorySlug: contentType,
        name: newBranchName.trim(),
        enName: newBranchEnName.trim() || newBranchName.trim(),
        slug: finalSlug,
        deity: newBranchDeity.trim() || newBranchName.trim(),
        desc: newBranchDesc.trim() || undefined,
        imageKey: newBranchImageKey.trim() || undefined,
        stats: `1+ ${formatTypeLabel(contentType)}s`,
        badge: formatTypeLabel(contentType),
        orderIndex: branches.length + 1,
        status: newBranchStatus,
      });

      setBranches((prev) => [...prev, created]);
      setSelectedBranchId(created.id);
      setDeity(created.deity || created.enName || created.name);
      setShowCreateBranch(false);
      setNewBranchName("");
      setNewBranchEnName("");
      setNewBranchSlug("");
      setNewBranchSlugEdited(false);
      setNewBranchDeity("");
      setNewBranchDesc("");
      setNewBranchImageKey("");
      showSuccess("Branch created and selected.");
      setStep(2);
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to create branch."));
    } finally {
      setCreatingBranch(false);
    }
  };

  const handleContentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setContentImageUploading(true);
    try {
      const uploaded = await mediaUploadService.uploadImage(file, {
        folder: "library/mantra-stotras",
      });
      setFeaturedImage(uploaded.url);
      showSuccess("Content image uploaded.");
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to upload content image."));
    } finally {
      setContentImageUploading(false);
      if (contentImageInputRef.current) {
        contentImageInputRef.current.value = "";
      }
    }
  };

  const resetStep2Fields = () => {
    setTitle("");
    setTitleHi("");
    setSlug("");
    setSlugEdited(false);
    setSubtitle("");
    setSubtitleHi("");
    setSourceRef("");
    setSanskrit("");
    setTransliteration("");
    setHindiTranslation("");
    setEnglishTranslation("");
    setHinglishTranslation("");
    setCount("108 Chants (1 Mala)");
    setAstrologicalRemedy("");
    setAudioUrl("");
    setFeaturedImage("");
    setTagsInput("");
    setIsFeatured(false);
    setStatus("ACTIVE");
    setVidhi({ ...EMPTY_VIDHI });
    setCanonAnga({ ...EMPTY_CANON_ANGA });
    setBenefits([{ category: "Spiritual", textHi: "", textEn: "" }]);
    setVerses([]);
  };

  const handleSaveContent = async (mode: "finish" | "another") => {
    if (!selectedBranch) {
      showError("Please select a deity branch above.");
      return;
    }
    if (!title.trim()) {
      showError("English Title is required.");
      return;
    }
    if (!sanskrit.trim()) {
      showError("Sanskrit Text (Devanagari) is required.");
      return;
    }

    const finalSlug = slug.trim() || slugifyText(title);
    if (!finalSlug) {
      showError("Please provide a valid URL slug.");
      return;
    }

    const cleanedBenefits = benefits.filter(
      (b) => b.textEn?.trim() || b.textHi?.trim()
    );
    const cleanedVerses = verses
      .filter((v) => v.sanskrit.trim())
      .map((v, idx) => ({
        ...v,
        verseNo: v.verseNo || idx + 1,
      }));
    const cleanedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const hasCanon = Object.values(canonAnga).some((v) => Boolean(v?.trim()));
    const hasVidhi = Object.values(vidhi).some((v) => Boolean(v?.trim()));

    const payload: Partial<LibraryMantraStotra> = {
      type: contentType as MantraStotraType,
      categorySlug: contentType as MantraStotraType,
      branchId: selectedBranch.id,
      branchSlug: selectedBranch.slug,
      deity:
        deity.trim() ||
        selectedBranch.deity ||
        selectedBranch.enName ||
        selectedBranch.name,
      deityHi: deityHi.trim() || undefined,
      title: title.trim(),
      titleHi: titleHi.trim() || undefined,
      slug: finalSlug,
      subtitle: subtitle.trim() || undefined,
      subtitleHi: subtitleHi.trim() || undefined,
      sourceRef: sourceRef.trim() || undefined,
      featuredImage: featuredImage.trim() || undefined,
      sanskrit: sanskrit.trim(),
      transliteration: isEditMode
        ? transliteration.trim() || undefined
        : undefined,
      hindiTranslation: hindiTranslation.trim() || undefined,
      englishTranslation: englishTranslation.trim() || undefined,
      hinglishTranslation: hinglishTranslation.trim() || undefined,
      count: count.trim() || undefined,
      rishi: canonAnga.rishi?.trim() || undefined,
      chhandas: canonAnga.chhandas?.trim() || undefined,
      astrologicalRemedy: astrologicalRemedy.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined,
      tags: cleanedTags,
      isFeatured,
      status,
      benefits: cleanedBenefits,
      verses: cleanedVerses,
      canonAnga: hasCanon ? canonAnga : undefined,
      vidhi: hasVidhi ? vidhi : undefined,
    };

    setIsSaving(true);
    try {
      if (isEditMode && editId) {
        await libraryMantraStotraService.updateItem(editId, payload);
        showSuccess(
          `${formatTypeLabel(contentType)} updated successfully.`
        );
      } else {
        await libraryMantraStotraService.createItem(payload);
        showSuccess(
          `${formatTypeLabel(contentType)} published successfully.`
        );
      }

      if (mode === "another" && !isEditMode) {
        resetStep2Fields();
      } else if (returnToParam === "branches") {
        navigate(`/admin/library/${contentType}-branches`);
      } else {
        navigate(
          `/admin/library/mantra-stotra-items?type=${contentType}${
            selectedBranch
              ? `&branchId=${encodeURIComponent(selectedBranch.id)}`
              : ""
          }`
        );
      }
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to save content."));
    } finally {
      setIsSaving(false);
    }
  };

  if (itemLoading) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-cream-200">
        <Loader2 className="w-8 h-8 text-saffron-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-charcoal-600">
          Loading content details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          to={
            isEditMode || returnToParam === "items"
              ? itemsReturnUrl
              : `/admin/library/${contentType}-branches`
          }
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {isEditMode || returnToParam === "items"
              ? "Back to Items"
              : `Back to ${formatTypeLabel(contentType)} Branches`}
          </span>
        </Link>
      </div>

      <PageHeader
        title={
          isEditMode
            ? `Edit ${formatTypeLabel(contentType)}`
            : `Upload ${formatTypeLabel(contentType)}`
        }
        subtitle={
          isEditMode
            ? "Update the content details below."
            : "Enter the sacred text and details below to publish."
        }
      />

      

      {/* STEP 2 DIRECT FORM */}
      <div className="space-y-6">
          {/* Core Identity & Sacred Text Card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-5 shadow-2xs">
            <h2 className="text-base font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Core Information &amp; Sacred Text
            </h2>

            {/* Branch Selection */}
            <div className="p-4 rounded-xl bg-cream-50/70 border border-cream-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-charcoal-800">
                    {formatTypeLabel(contentType)} Branch <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-charcoal-500">
                    Select the deity or section this {contentType} belongs to.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateBranch((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showCreateBranch ? "Cancel New Branch" : "Add New Branch"}</span>
                </button>
              </div>

              {showCreateBranch ? (
                <div className="p-3 bg-white rounded-xl border border-saffron-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label-field">Branch Name *</label>
                      <input
                        type="text"
                        value={newBranchName}
                        onChange={(e) => {
                          setNewBranchName(e.target.value);
                          if (!newBranchSlugEdited) {
                            setNewBranchSlug(slugifyText(e.target.value));
                          }
                        }}
                        placeholder={`e.g. Shiva ${formatTypeLabel(contentType)}s`}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label-field">Deity Name</label>
                      <input
                        type="text"
                        value={newBranchDeity}
                        onChange={(e) => setNewBranchDeity(e.target.value)}
                        placeholder="e.g. Shiva"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={creatingBranch}
                      onClick={handleCreateInlineBranch}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-saffron-600 rounded-lg hover:bg-saffron-700 disabled:opacity-50"
                    >
                      {creatingBranch ? "Creating..." : "Save Branch"}
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={selectedBranchId}
                  onChange={(e) => {
                    const found = branches.find((b) => b.id === e.target.value || b.slug === e.target.value);
                    if (found) {
                      handleSelectBranch(found);
                    } else {
                      setSelectedBranchId(e.target.value);
                    }
                  }}
                  className="input-field text-xs font-semibold"
                >
                  <option value="">-- Choose a Deity Branch --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.enName ? `(${b.enName})` : ""} {b.deity ? `• ${b.deity}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Title & Identity Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    if (!slugEdited) {
                      setSlug(slugifyText(val));
                    }
                  }}
                  placeholder={`e.g. Shri Shiva ${formatTypeLabel(contentType)}`}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">
                  Title (Hindi / Sanskrit)
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="Optional Devanagari title"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">
                  Web Address (Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(slugifyText(e.target.value));
                  }}
                  placeholder="e.g. shri-shiva-mantra"
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="label-field">Where is this from? (Optional)</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. Rigveda 1.1.1 / Traditional"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Short Description (English)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Essential essence or significance"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Short Description (Hindi)</label>
                <input
                  type="text"
                  value={subtitleHi}
                  onChange={(e) => setSubtitleHi(e.target.value)}
                  placeholder="संक्षिप्त विवरण"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Deity / God Name (English)</label>
                <input
                  type="text"
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Shiva, Vishnu, Devi"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Deity / God Name (Hindi)</label>
                <input
                  type="text"
                  value={deityHi}
                  onChange={(e) => setDeityHi(e.target.value)}
                  placeholder="e.g. शिव, विष्णु"
                  className="input-field"
                />
              </div>
            </div>

            {/* Sacred Sanskrit Text Area with Pro WYSIWYG Formatting Toolbar */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-charcoal-800">
                  Sanskrit Text (Devanagari) <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Voice Typing Button (English) */}
                  <button
                    type="button"
                    onClick={() => isListeningSanskrit ? stopVoiceInput() : startVoiceInput("sanskrit")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition shadow-2xs ${
                      isListeningSanskrit
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-saffron-50 text-saffron-700 hover:bg-saffron-100 border border-saffron-200"
                    }`}
                  >
                    {isListeningSanskrit ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListeningSanskrit ? "Listening... (Stop)" : "Voice Typing"}</span>
                  </button>

                  {/* Formatting Toolbar: Bold, Italic, Line Break, Space */}
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-cream-50 border border-cream-200 text-charcoal-700">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySanskritFormat("bold")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white hover:shadow-2xs rounded transition text-xs font-bold text-charcoal-800"
                      title="Bold Selection (Ctrl+B)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                      <span>Bold</span>
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySanskritFormat("italic")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 hover:bg-white hover:shadow-2xs rounded transition text-xs font-semibold text-charcoal-700"
                      title="Italic Selection (Ctrl+I)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                      <span>Italic</span>
                    </button>
                    <div className="w-px h-3.5 bg-cream-300 mx-1" />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySanskritFormat("newline")}
                      className="px-2 py-0.5 hover:bg-white hover:shadow-2xs rounded transition text-[11px] font-semibold text-charcoal-600"
                      title="Insert Line Break"
                    >
                      Line Break
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySanskritFormat("space")}
                      className="px-2 py-0.5 hover:bg-white hover:shadow-2xs rounded transition text-[11px] font-semibold text-charcoal-600"
                      title="Insert Space"
                    >
                      Space
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                {(!sanskrit || sanskrit === "<br>" || sanskrit.trim() === "") && (
                  <span className="absolute top-3 left-4 text-charcoal-400 font-devanagari text-base pointer-events-none select-none">
                    Type or paste sacred Sanskrit text in Devanagari (or use Voice Typing)...
                  </span>
                )}
                <div
                  ref={setEditorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => { isEditorFocusedRef.current = true; }}
                  onBlur={() => {
                    isEditorFocusedRef.current = false;
                    if (sanskritEditorRef.current) {
                      setSanskrit(sanskritEditorRef.current.innerHTML);
                    }
                  }}
                  onInput={(e) => {
                    setSanskrit(e.currentTarget.innerHTML);
                  }}
                  className="w-full min-h-[140px] px-4 py-3 rounded-xl border border-cream-200 bg-white focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 focus:outline-hidden font-devanagari text-base leading-relaxed tracking-wide shadow-2xs whitespace-pre-wrap outline-none"
                />
                <div className="flex items-center justify-between text-[11px] text-charcoal-400 px-1 pt-1 font-mono">
                  <span>Pure Devanagari (Visual Formatting)</span>
                  <span>
                    {(sanskrit || "").replace(/<[^>]*>/g, "").trim().length} chars • {(sanskrit || "").replace(/<[^>]*>/g, "").trim() ? (sanskrit || "").replace(/<[^>]*>/g, "").trim().split(/\s+/).length : 0} words
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">English Meaning</label>
                <textarea
                  rows={3}
                  value={englishTranslation}
                  onChange={(e) => setEnglishTranslation(e.target.value)}
                  placeholder="Accurate English meaning and essence..."
                  className="input-field"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label-field mb-0">Hindi Meaning</label>
                  <button
                    type="button"
                    onClick={() => isListeningHindi ? stopVoiceInput() : startVoiceInput("hindi")}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold transition ${
                      isListeningHindi
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-saffron-50 text-saffron-700 hover:bg-saffron-100 border border-saffron-200"
                    }`}
                  >
                    {isListeningHindi ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListeningHindi ? "Listening... (Stop)" : "Voice Typing"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={hindiTranslation}
                  onChange={(e) => setHindiTranslation(e.target.value)}
                  placeholder="Hindi translation / arth..."
                  className="input-field font-devanagari"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Hinglish Meaning</label>
              <textarea
                rows={2}
                value={hinglishTranslation}
                onChange={(e) => setHinglishTranslation(e.target.value)}
                placeholder="Accessible Hinglish explanation..."
                className="input-field"
              />
            </div>
          </div>

          {/* Vidhi & Recommended Count */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4 shadow-2xs">
            <h2 className="text-base font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Vidhi &amp; Recommended Chanting Count
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label-field">Recommended Count Summary</label>
                <input
                  type="text"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="e.g. 108 Chants (1 Mala)"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Count (Sankhya)</label>
                <input
                  type="text"
                  value={vidhi.sankhya || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, sankhya: e.target.value }))
                  }
                  placeholder="e.g. 108"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Best Day</label>
                <input
                  type="text"
                  value={vidhi.bestDay || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, bestDay: e.target.value }))
                  }
                  placeholder="e.g. Monday / Pradosh"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Muhurat</label>
                <input
                  type="text"
                  value={vidhi.muhurat || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, muhurat: e.target.value }))
                  }
                  placeholder="e.g. Brahma Muhurat"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Facing Direction</label>
                <input
                  type="text"
                  value={vidhi.direction || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, direction: e.target.value }))
                  }
                  placeholder="e.g. East / North"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Asana</label>
                <input
                  type="text"
                  value={vidhi.asana || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, asana: e.target.value }))
                  }
                  placeholder="e.g. Kusha Asana"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Mala</label>
                <input
                  type="text"
                  value={vidhi.mala || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, mala: e.target.value }))
                  }
                  placeholder="e.g. Rudraksha / Tulsi"
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="label-field">Samagri</label>
                <input
                  type="text"
                  value={vidhi.samagri || ""}
                  onChange={(e) =>
                    setVidhi((prev) => ({ ...prev, samagri: e.target.value }))
                  }
                  placeholder="e.g. Bilva leaves, Deepam"
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Media, Metadata & Publishing */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-5 shadow-2xs">
            <h2 className="text-base font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Media, Tags &amp; Publishing Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="label-field">
                  Optional Content Image Upload
                </label>
                <input
                  type="file"
                  ref={contentImageInputRef}
                  onChange={handleContentImageUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                {isUploadedImageUrl(featuredImage) ? (
                  <div className="rounded-xl border border-cream-200 overflow-hidden bg-cream-50">
                    <img
                      src={resolveMediaUrl(featuredImage)}
                      alt="Content preview"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-2 bg-white border-t border-cream-100 flex items-center justify-between text-xs">
                      <span className="truncate pr-2 font-mono text-charcoal-500">
                        {featuredImage}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFeaturedImage("")}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => contentImageInputRef.current?.click()}
                    disabled={contentImageUploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-cream-300 bg-cream-50/50 hover:bg-cream-50 text-xs font-semibold text-charcoal-700 transition"
                  >
                    {contentImageUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-saffron-600" />
                        <span>Uploading image...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-saffron-600" />
                        <span>Upload Featured Image (Optional)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-field">Audio URL</label>
                  <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://... (MP3 / audio stream URL)"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">
                    Astrological Remedy / Context
                  </label>
                  <input
                    type="text"
                    value={astrologicalRemedy}
                    onChange={(e) => setAstrologicalRemedy(e.target.value)}
                    placeholder="e.g. Pacifies Mars and Saturn afflictions"
                    className="input-field text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="label-field">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="shiva, healing, protection"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="label-field">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as MantraStotraStatus)
                  }
                  className="input-field text-xs font-semibold"
                >
                  <option value="ACTIVE">Active (Published)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
                  />
                  <span>Feature on Library Highlights</span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 2 Footer Actions */}
          <div className="bg-white rounded-2xl border border-cream-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={() => navigate(`/admin/library/${contentType}-branches`)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-charcoal-600 hover:bg-cream-100 border border-cream-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to ${formatTypeLabel(contentType)} Branches</span>
            </button>

            <div className="flex flex-wrap items-center justify-end gap-2.5">
              {!isEditMode && (
                <button
                  type="button"
                  disabled={isSaving || contentImageUploading}
                  onClick={() => handleSaveContent("another")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save & Add Another"}</span>
                </button>
              )}

              <button
                type="button"
                disabled={isSaving || contentImageUploading}
                onClick={() => handleSaveContent("finish")}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-saffron-600 hover:bg-saffron-700 transition shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSaving
                    ? "Saving..."
                    : isEditMode
                      ? "Update & Finish"
                      : "Save & Finish"}
                </span>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
