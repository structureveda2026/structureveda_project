import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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

  const rawTypeParam = searchParams.get("type") || routeType;
  const isTypeScoped =
    isEditMode || rawTypeParam === "mantra" || rawTypeParam === "stotra";
  const initialTypeParam: MantraStotraType =
    rawTypeParam === "stotra" ? "stotra" : "mantra";
  const initialBranchIdParam = searchParams.get("branchId") || "";
  const initialStepParam = searchParams.get("step") === "2" ? 2 : 1;
  const returnToParam = searchParams.get("returnTo") || "";

  // Step & Context State
  const [step, setStep] = useState<1 | 2>(isEditMode ? 2 : 1);
  const [contentType, setContentType] =
    useState<MantraStotraType>(initialTypeParam);
  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] =
    useState<string>(initialBranchIdParam);
  const [itemLoading, setItemLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

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
    async (typeToLoad: MantraStotraType) => {
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
    const raw = searchParams.get("type") || routeType;
    if (raw === "stotra" || raw === "mantra") {
      setContentType(raw);
    }
  }, [isEditMode, routeType, searchParams]);

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
          if (initialStepParam === 2) {
            setStep(2);
          }
        }
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
        const itemType: MantraStotraType =
          item.type === "stotra" ? "stotra" : "mantra";
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
        setSanskrit(item.sanskrit || "");
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

  const handleTypeSwitch = (nextType: MantraStotraType) => {
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
        stats: contentType === "stotra" ? "1+ Stotras" : "1+ Mantras",
        badge: contentType === "stotra" ? "Stotra" : "Vedic Mantra",
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
      showError("Please select or create a branch in Step 1 first.");
      setStep(1);
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
      type: contentType,
      categorySlug: contentType,
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
          `${contentType === "stotra" ? "Stotra" : "Mantra"} updated successfully.`
        );
      } else {
        await libraryMantraStotraService.createItem(payload);
        showSuccess(
          `${contentType === "stotra" ? "Stotra" : "Mantra"} published successfully.`
        );
      }

      if (mode === "another" && !isEditMode) {
        resetStep2Fields();
      } else if (returnToParam === "branches") {
        navigate(
          contentType === "stotra"
            ? "/admin/library/stotra-branches"
            : "/admin/library/mantra-branches"
        );
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
              : contentType === "stotra"
                ? "/admin/library/stotra-branches"
                : "/admin/library/mantra-branches"
          }
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {isEditMode || returnToParam === "items"
              ? "Back to Mantra & Stotra Items"
              : `Back to ${contentType === "stotra" ? "Stotra Branches" : "Mantra Branches"}`}
          </span>
        </Link>
      </div>

      <PageHeader
        title={
          isEditMode
            ? `Edit ${contentType === "stotra" ? "Stotra" : "Mantra"}`
            : `Upload ${contentType === "stotra" ? "Stotra" : "Mantra"}`
        }
        subtitle={
          isEditMode
            ? "Update the content details below."
            : `Just 2 simple steps — pick the ${contentType === "stotra" ? "Stotra" : "Mantra"} branch, then type in the content. That's it!`
        }
      />

      {/* 2-Step Stepper */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
              step === 1
                ? "bg-saffron-50 border-saffron-500 shadow-2xs"
                : "bg-cream-50/50 border-cream-200 hover:bg-cream-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 1
                  ? "bg-saffron-600 text-white"
                  : selectedBranch
                    ? "bg-emerald-600 text-white"
                    : "bg-cream-200 text-charcoal-600"
              }`}
            >
              {selectedBranch && step === 2 ? (
                <Check className="w-4 h-4" />
              ) : (
                "1"
              )}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                Step 1
              </div>
              <div className="text-sm font-bold text-charcoal-900">
                Pick Category &amp; Branch
              </div>
              <div className="text-[11px] text-charcoal-500">
                {selectedBranch
                  ? `${contentType === "stotra" ? "Stotra" : "Mantra"} • ${selectedBranch.enName || selectedBranch.name}`
                  : isTypeScoped
                    ? `Choose a ${contentType === "stotra" ? "Stotra" : "Mantra"} branch.`
                    : "Is it a Mantra or Stotra? Which deity is it for?"}
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={!selectedBranch}
            onClick={() => selectedBranch && setStep(2)}
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
              step === 2
                ? "bg-saffron-50 border-saffron-500 shadow-2xs"
                : "bg-cream-50/50 border-cream-200 hover:bg-cream-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 2
                  ? "bg-saffron-600 text-white"
                  : "bg-cream-200 text-charcoal-600"
              }`}
            >
              2
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                Step 2
              </div>
              <div className="text-sm font-bold text-charcoal-900">
                Enter Sacred Content
              </div>
              <div className="text-[11px] text-charcoal-500">
                Type the Sanskrit text, Hindi/English meaning &amp; more
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-6">
          {!isTypeScoped && (
          <>
          {/* Type Selector */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-charcoal-900">
                {isTypeScoped
                  ? `1. Uploading ${contentType === "stotra" ? "Stotra / Hymn" : "Mantra / Sukta"}`
                  : "1. What type of content are you uploading?"}
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                {isTypeScoped
                  ? contentType === "stotra"
                    ? "Ashtakams, Sahasranamas, Chalisas, Kavachams, and devotional hymns."
                    : "Beej mantras, Gayatri mantras, Vedic suktas, and Japa chants."
                  : "Mantras are sacred chants (e.g. Gayatri, Beej). Stotras are devotional hymns (e.g. Chalisa, Ashtakam)."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(!isTypeScoped || contentType === "mantra") && (
              <button
                type="button"
                onClick={() => handleTypeSwitch("mantra")}
                className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  contentType === "mantra"
                    ? "border-saffron-600 bg-saffron-50/70"
                    : "border-cream-200 hover:border-saffron-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-charcoal-900">
                    Mantra / Sukta
                  </div>
                  <div className="text-xs text-charcoal-500 mt-0.5">
                    Beej mantras, Gayatri mantras, Vedic suktas, and Japa chants.
                  </div>
                </div>
              </button>
              )}

              {(!isTypeScoped || contentType === "stotra") && (
              <button
                type="button"
                onClick={() => handleTypeSwitch("stotra")}
                className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                  contentType === "stotra"
                    ? "border-saffron-600 bg-saffron-50/70"
                    : "border-cream-200 hover:border-saffron-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-charcoal-900">
                    Stotra / Hymn
                  </div>
                  <div className="text-xs text-charcoal-500 mt-0.5">
                    Ashtakams, Sahasranamas, Chalisas, Kavachams, and devotional hymns.
                  </div>
                </div>
              </button>
              )}
            </div>
          </div>
          </>
          )}

          {/* Branch Selection + Inline Create */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-charcoal-900">
                  {isTypeScoped
                    ? "1. Which deity or category does this belong to?"
                    : "2. Which deity or category does this belong to?"}
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Choose an existing group (e.g. "Shiva Mantras") or create a new one with an image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateBranch((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-saffron-50 text-saffron-700 border border-saffron-200 hover:bg-saffron-100 transition self-start"
              >
                {showCreateBranch ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel New Branch</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Branch</span>
                  </>
                )}
              </button>
            </div>

            {/* Inline Create New Branch Panel */}
            {showCreateBranch && (
              <form
                onSubmit={handleCreateInlineBranch}
                className="p-5 rounded-2xl bg-cream-50/70 border border-saffron-200 space-y-4"
              >
                <h3 className="text-sm font-bold text-charcoal-900">
                  Create New {contentType === "stotra" ? "Stotra" : "Mantra"} Branch
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Group Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newBranchName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewBranchName(val);
                        if (!newBranchSlugEdited) {
                          setNewBranchSlug(slugifyText(val));
                        }
                      }}
                      placeholder="e.g. Shiva Stotras"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      English Display Title (optional)
                    </label>
                    <input
                      type="text"
                      value={newBranchEnName}
                      onChange={(e) => setNewBranchEnName(e.target.value)}
                      placeholder="e.g. Shiva Stotras & Ashtakams"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Web Address <span className="font-normal text-charcoal-400">(auto-filled, don't worry)</span>
                    </label>
                    <input
                      type="text"
                      value={newBranchSlug}
                      onChange={(e) => {
                        setNewBranchSlugEdited(true);
                        setNewBranchSlug(slugifyText(e.target.value));
                      }}
                      placeholder="e.g. shiva"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Deity / God Name
                    </label>
                    <input
                      type="text"
                      value={newBranchDeity}
                      onChange={(e) => setNewBranchDeity(e.target.value)}
                      placeholder="e.g. Shiva"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newBranchDesc}
                    onChange={(e) => setNewBranchDesc(e.target.value)}
                    placeholder="Short description of this deity branch..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Deity Image Upload
                    </label>
                    <input
                      type="file"
                      ref={branchImageInputRef}
                      onChange={handleBranchImageUpload}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    {isUploadedImageUrl(newBranchImageKey) ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-cream-200">
                        <img
                          src={resolveMediaUrl(newBranchImageKey)}
                          alt="New branch deity"
                          className="w-12 h-12 rounded-lg object-cover border border-cream-200"
                        />
                        <div className="flex-1 min-w-0 text-[11px] font-mono text-charcoal-500 truncate">
                          {newBranchImageKey}
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewBranchImageKey("")}
                          className="p-1 text-charcoal-400 hover:text-red-600"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => branchImageInputRef.current?.click()}
                        disabled={branchImageUploading}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-saffron-300 bg-white text-xs font-semibold text-saffron-700 hover:bg-saffron-50/40 transition"
                      >
                        {branchImageUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Deity Image (JPG/PNG/WEBP)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Status
                    </label>
                    <select
                      value={newBranchStatus}
                      onChange={(e) =>
                        setNewBranchStatus(
                          e.target.value as "ACTIVE" | "INACTIVE"
                        )
                      }
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={creatingBranch || branchImageUploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 transition disabled:opacity-50"
                  >
                    {creatingBranch ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Branch &amp; Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Branch Cards */}
            {branchesLoading ? (
              <div className="py-10 text-center text-charcoal-500">
                <Loader2 className="w-6 h-6 animate-spin text-saffron-500 mx-auto mb-2" />
                <p className="text-xs font-medium">Loading deity branches...</p>
              </div>
            ) : branches.length === 0 ? (
              <div className="py-10 text-center text-charcoal-500 border border-dashed border-cream-200 rounded-xl">
                <p className="text-sm font-semibold">No branches available yet</p>
                <p className="text-xs mt-1 text-charcoal-400">
                  Click &quot;Create New Branch&quot; above to add the first{" "}
                  {contentType} branch.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {branches.map((branch) => {
                  const isSelected =
                    selectedBranch?.id === branch.id;
                  const imgUrl = resolveMediaUrl(branch.imageKey);

                  return (
                    <button
                      type="button"
                      key={branch.id}
                      onClick={() => handleSelectBranch(branch)}
                      className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                        isSelected
                          ? "border-saffron-600 bg-saffron-50/70 shadow-xs"
                          : "border-cream-200 hover:border-saffron-300 bg-white"
                      }`}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={branch.enName || branch.name}
                          className="w-11 h-11 rounded-lg object-cover border border-cream-200 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-bold text-charcoal-900 truncate">
                            {branch.enName || branch.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-saffron-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-charcoal-500 truncate mt-0.5">
                          {branch.deity ? `Deity: ${branch.deity}` : branch.slug}
                        </div>
                        {branch.stats && (
                          <div className="text-[10px] font-semibold text-saffron-700 mt-1">
                            {branch.stats}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 1 Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-cream-100">
              <button
                type="button"
                disabled={!selectedBranch}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-saffron-600 hover:bg-saffron-700 transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next: Add Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Selected Branch Context Banner */}
          <div className="bg-white rounded-2xl border border-saffron-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              {selectedBranch && resolveMediaUrl(selectedBranch.imageKey) ? (
                <img
                  src={resolveMediaUrl(selectedBranch.imageKey)}
                  alt={selectedBranch.enName || selectedBranch.name}
                  className="w-11 h-11 rounded-xl object-cover border border-cream-200 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-saffron-100 text-saffron-800">
                    {contentType === "stotra" ? "Stotra" : "Mantra"}
                  </span>
                  <span className="text-sm font-bold text-charcoal-900">
                    {selectedBranch?.enName ||
                      selectedBranch?.name ||
                      selectedBranchId}
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Deity: {deity || selectedBranch?.deity || "Not specified"} •
                  Slug: {selectedBranch?.slug || "—"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 transition self-start sm:self-auto"
            >
              Change Branch
            </button>
          </div>

          {/* Core Identity & Sacred Text Card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-5 shadow-2xs">
            <h2 className="text-base font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Core Information &amp; Sacred Text
            </h2>

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
                  placeholder="e.g. Shri Agni Gayatri Mantra"
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
                    Web Address (auto-filled, don't worry) <span className="text-red-500">*</span>
                  </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(slugifyText(e.target.value));
                  }}
                  placeholder="e.g. shri-agni-gayatri-mantra"
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="label-field">Where is this from? (optional)</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. Rigveda 1.1.1 / Shiva Purana / Traditional"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Short Description (English)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A brief one-liner about this mantra/stotra"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Short Description (Hindi)</label>
                <input
                  type="text"
                  value={subtitleHi}
                  onChange={(e) => setSubtitleHi(e.target.value)}
                  placeholder="Optional Hindi one-liner"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Deity / God Name (English)</label>
                <input
                  type="text"
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Shiva, Vishnu, Devi, Ganesh"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-field">Deity / God Name (Hindi)</label>
                <input
                  type="text"
                  value={deityHi}
                  onChange={(e) => setDeityHi(e.target.value)}
                  placeholder="Optional Devanagari name (e.g. शिव)"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-field">
                Sanskrit Text (Devanagari) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={sanskrit}
                onChange={(e) => setSanskrit(e.target.value)}
                placeholder="Paste the authentic Sanskrit mantra or stotra text in Devanagari..."
                className="input-field font-devanagari text-base"
              />
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
                <label className="label-field">Hindi Meaning</label>
                <textarea
                  rows={3}
                  value={hindiTranslation}
                  onChange={(e) => setHindiTranslation(e.target.value)}
                  placeholder="Hindi translation / arth..."
                  className="input-field"
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

          {/* Benefits Section */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-charcoal-900">
                  Benefits &amp; Spiritual Significance
                </h2>
                <p className="text-xs text-charcoal-500">
                  Add repeatable benefits with category, English text, and Hindi text.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBenefits((prev) => [
                    ...prev,
                    { category: "Spiritual", textHi: "", textEn: "" },
                  ])
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-saffron-50 text-saffron-700 border border-saffron-200 hover:bg-saffron-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Benefit</span>
              </button>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-cream-50/60 border border-cream-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
                >
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={benefit.category || ""}
                      onChange={(e) =>
                        setBenefits((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, category: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder="e.g. Health, Peace"
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Benefit (English)
                    </label>
                    <input
                      type="text"
                      value={benefit.textEn || ""}
                      onChange={(e) =>
                        setBenefits((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, textEn: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder="Benefit in English"
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-charcoal-700 mb-1">
                      Benefit (Hindi)
                    </label>
                    <input
                      type="text"
                      value={benefit.textHi || ""}
                      onChange={(e) =>
                        setBenefits((prev) =>
                          prev.map((item, idx) =>
                            idx === index
                              ? { ...item, textHi: e.target.value }
                              : item
                          )
                        )
                      }
                      placeholder="Benefit in Hindi"
                      className="input-field text-xs"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setBenefits((prev) =>
                          prev.length > 1
                            ? prev.filter((_, idx) => idx !== index)
                            : [{ category: "Spiritual", textHi: "", textEn: "" }]
                        )
                      }
                      className="p-2 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Remove benefit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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

          {/* Optional 6-Fold Canon Anga (Collapsible) */}
          <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowCanonSection((prev) => !prev)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-cream-50/60 transition"
            >
              <div>
                <h2 className="text-base font-bold text-charcoal-900">
                  Optional 6-Fold Canon Anga (Shadanga)
                </h2>
                <p className="text-xs text-charcoal-500">
                  Rishi, Chhandas, Devata, Beejam, Shakti, and Keelakam metadata.
                </p>
              </div>
              {showCanonSection ? (
                <ChevronUp className="w-5 h-5 text-charcoal-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-charcoal-400" />
              )}
            </button>

            {showCanonSection && (
              <div className="px-6 pb-6 pt-2 border-t border-cream-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-field">Rishi (Seer)</label>
                  <input
                    type="text"
                    value={canonAnga.rishi || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        rishi: e.target.value,
                      }))
                    }
                    placeholder="e.g. Maharshi Vishwamitra"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">Chhandas (Meter)</label>
                  <input
                    type="text"
                    value={canonAnga.chhandas || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        chhandas: e.target.value,
                      }))
                    }
                    placeholder="e.g. Anushtup / Gayatri"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">Devata (Presiding Deity)</label>
                  <input
                    type="text"
                    value={canonAnga.devata || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        devata: e.target.value,
                      }))
                    }
                    placeholder="e.g. Lord Shiva"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">Beejam (Seed Syllable)</label>
                  <input
                    type="text"
                    value={canonAnga.beejam || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        beejam: e.target.value,
                      }))
                    }
                    placeholder="e.g. Om / Hreem"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">Shakti (Power)</label>
                  <input
                    type="text"
                    value={canonAnga.shakti || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        shakti: e.target.value,
                      }))
                    }
                    placeholder="e.g. Parvati / Swaha"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="label-field">Keelakam (Lock)</label>
                  <input
                    type="text"
                    value={canonAnga.keelakam || ""}
                    onChange={(e) =>
                      setCanonAnga((prev) => ({
                        ...prev,
                        keelakam: e.target.value,
                      }))
                    }
                    placeholder="e.g. Namah"
                    className="input-field text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional Multi-Verse Editor (Collapsible) */}
          <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowVersesSection((prev) => !prev)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-cream-50/60 transition"
            >
              <div>
                <h2 className="text-base font-bold text-charcoal-900">
                  Optional Multi-Verse Editor ({verses.length} verses)
                </h2>
                <p className="text-xs text-charcoal-500">
                  Break long Stotras or Suktas into numbered verses with individual meanings.
                </p>
              </div>
              {showVersesSection ? (
                <ChevronUp className="w-5 h-5 text-charcoal-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-charcoal-400" />
              )}
            </button>

            {showVersesSection && (
              <div className="px-6 pb-6 pt-3 border-t border-cream-100 space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setVerses((prev) => [
                        ...prev,
                        {
                          verseNo: prev.length + 1,
                          sanskrit: "",
                          meaningHi: "",
                          meaningEn: "",
                        },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-saffron-50 text-saffron-700 border border-saffron-200 hover:bg-saffron-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Verse</span>
                  </button>
                </div>

                {verses.length === 0 ? (
                  <p className="text-xs text-charcoal-400 text-center py-4">
                    No verses added yet. Click &quot;Add Verse&quot; to enter verse-by-verse breakdown.
                  </p>
                ) : (
                  verses.map((verse, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-cream-50/60 border border-cream-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-saffron-700">
                          Verse #{verse.verseNo || idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setVerses((prev) =>
                              prev
                                .filter((_, i) => i !== idx)
                                .map((v, n) => ({ ...v, verseNo: n + 1 }))
                            )
                          }
                          className="p-1 text-charcoal-400 hover:text-red-600"
                          title="Remove verse"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <textarea
                          rows={2}
                          value={verse.sanskrit}
                          onChange={(e) =>
                            setVerses((prev) =>
                              prev.map((v, i) =>
                                i === idx
                                  ? { ...v, sanskrit: e.target.value }
                                  : v
                              )
                            )
                          }
                          placeholder="Verse Sanskrit (Devanagari)"
                          className="input-field text-xs font-devanagari md:col-span-2"
                        />
                        <textarea
                          rows={2}
                          value={verse.meaningEn || ""}
                          onChange={(e) =>
                            setVerses((prev) =>
                              prev.map((v, i) =>
                                i === idx
                                  ? { ...v, meaningEn: e.target.value }
                                  : v
                              )
                            )
                          }
                          placeholder="Verse English Meaning"
                          className="input-field text-xs"
                        />
                        <textarea
                          rows={2}
                          value={verse.meaningHi || ""}
                          onChange={(e) =>
                            setVerses((prev) =>
                              prev.map((v, i) =>
                                i === idx
                                  ? { ...v, meaningHi: e.target.value }
                                  : v
                              )
                            )
                          }
                          placeholder="Verse Hindi Meaning"
                          className="input-field text-xs"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-charcoal-600 hover:bg-cream-100 border border-cream-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1</span>
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
      )}
    </div>
  );
}
