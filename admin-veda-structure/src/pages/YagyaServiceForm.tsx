import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save, Plus, Trash2, HelpCircle, Image as ImageIcon, Upload, X,
  Flame, Clock, Users, MapPin, DollarSign, Calendar, BookOpen,
  CheckCircle2, Star, Layers, ListPlus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BulkFaqModal from "@/components/BulkFaqModal";
import BulkStringListModal from "@/components/BulkStringListModal";
import BulkSamagriModal from "@/components/BulkSamagriModal";
import BulkDailyScheduleModal from "@/components/BulkDailyScheduleModal";
import { useToast } from "@/context/ToastContext";
import * as mediaUploadService from "@/services/mediaUploadService";
import yagyaCategoryAdminService, {
  AdminYagyaCategory,
} from "@/services/yagyaCategoryAdminService";
import yagyaServiceCatalogueService, {
  YagyaPurpose, YagyaFaqItem, YagyaPricingTier, YagyaDailyScheduleItem,
  YagyaSamagriItem, YagyaWhyPerformItem, YagyaProcedureStep,
} from "@/services/yagyaServiceCatalogueService";
import SEOSection from "@/components/SEOSection";
import { SeoMetadata } from "@/types";

const slugify = (str: string) =>
  str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

interface FormState {
  name: string; slug: string; deity: string; eyebrow: string; tagline: string;
  shortDescription: string; fullDescription: string;
  categoryId: string;
  purposeId: string; purposeSummary: string;
  availableDurationsText: string; durationDisplay: string; dailyRitualHours: string; dailyHoursDisplay: string;
  minimumPandits: string; recommendedPandits: string; maximumPandits: string;
  skillRequirements: string; panditDailyHours: string;
  startingPrice: string; pricingTiers: YagyaPricingTier[];
  availableMode: "in_person" | "remote" | "hybrid";
  locationType: string; location: string; isKashiAvailable: boolean; isRemoteAvailable: boolean;
  bannerImage: string; galleryImages: string[];
  samagri: YagyaSamagriItem[]; prasad: string;
  dailySchedule: YagyaDailyScheduleItem[];
  whatsIncluded: string[];
  whyPerform: YagyaWhyPerformItem[];
  significance: string[];
  procedureSteps: YagyaProcedureStep[];
  faqs: YagyaFaqItem[];
  isFeatured: boolean; isActive: boolean;
  seo: SeoMetadata;
}

export default function YagyaServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug?: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [purposes, setPurposes] = useState<YagyaPurpose[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bannerUploading, setBannerUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);
  const [isFaqBulkModalOpen, setIsFaqBulkModalOpen] = useState(false);
  const [isWhatsIncludedBulkModalOpen, setIsWhatsIncludedBulkModalOpen] = useState(false);
  const [isSamagriBulkModalOpen, setIsSamagriBulkModalOpen] = useState(false);
  const [isSignificanceBulkModalOpen, setIsSignificanceBulkModalOpen] = useState(false);
  const [isDailyScheduleBulkModalOpen, setIsDailyScheduleBulkModalOpen] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "", slug: "", deity: "", eyebrow: "", tagline: "",
    shortDescription: "", fullDescription: "",
    categoryId: "",
    purposeId: "", purposeSummary: "",
    availableDurationsText: "3, 5, 7", durationDisplay: "3 / 5 / 7 Days",
    dailyRitualHours: "5", dailyHoursDisplay: "5 Hours / Day",
    minimumPandits: "3", recommendedPandits: "5", maximumPandits: "11",
    skillRequirements: "", panditDailyHours: "5",
    startingPrice: "", pricingTiers: [],
    availableMode: "hybrid", locationType: "Kashi Kshetras & Sacred Mandaps",
    location: "Kashi (Varanasi)", isKashiAvailable: true, isRemoteAvailable: true,
    bannerImage: "", galleryImages: [],
    samagri: [], prasad: "",
    dailySchedule: [],
    whatsIncluded: ["Vedic Brahmin Dakshina", "Puja Samagri & Prasad"],
    whyPerform: [{ title: "", description: "" }],
    significance: ["Prescribed in ancient Vedic scriptures"],
    procedureSteps: [{ step: "01", title: "Sankalp & Ganapati Puja", description: "" }],
    faqs: [{ question: "Can I participate virtually?", answer: "Yes, live stream is provided." }],
    isFeatured: false, isActive: true,
    seo: {},
  });

  useEffect(() => {
    setCategoriesLoading(true);
    setCategoriesError("");
    yagyaServiceCatalogueService
      .getCategories()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        setCategories(list);
      })
      .catch((err) => {
        console.warn("Could not load Yagya categories from catalogue, falling back to admin service:", err);
        return yagyaCategoryAdminService.getCategories({ isActive: "true" })
          .then((res: any) => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setCategories(list);
          });
      })
      .catch((err) => {
        console.warn("Could not load Yagya categories:", err);
        setCategoriesError("Failed to load categories");
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    yagyaServiceCatalogueService.getYagyaPurposes()
      .then((data) => {
        setPurposes(data);
        if (!isEdit && data.length > 0) setForm((p) => ({ ...p, purposeId: data[0].id }));
      })
      .catch((err) => console.warn("Could not load purposes:", err));
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    yagyaServiceCatalogueService.getYagyaService(id)
      .then((data) => {
        const req = data.panditRequirement || {};
        setForm({
          name: data.name || "", slug: data.slug || "", deity: data.deity || "",
          eyebrow: data.eyebrow || "", tagline: data.tagline || "",
          shortDescription: data.shortDescription || "", fullDescription: data.fullDescription || "",
          categoryId: data.categoryId || "",
          purposeId: data.purposeId || "", purposeSummary: data.purposeSummary || "",
          availableDurationsText: Array.isArray(data.availableDurations) ? data.availableDurations.join(", ") : "",
          durationDisplay: data.durationDisplay || "", dailyRitualHours: String(data.dailyRitualHours || 5),
          dailyHoursDisplay: data.dailyHoursDisplay || "",
          minimumPandits: String(req.minimumPandits ?? 3),
          recommendedPandits: String(req.recommendedPandits ?? 5),
          maximumPandits: String(req.maximumPandits ?? 11),
          skillRequirements: req.skillRequirements || "",
          panditDailyHours: String(req.dailyHours ?? 5),
          startingPrice: String(data.startingPrice || 0),
          pricingTiers: Array.isArray(data.pricingTiers) ? data.pricingTiers : [],
          availableMode: data.availableMode || "hybrid",
          locationType: data.locationType || "", location: data.location || "",
          isKashiAvailable: Boolean(data.isKashiAvailable), isRemoteAvailable: Boolean(data.isRemoteAvailable),
          bannerImage: data.bannerImage || "", galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          samagri: Array.isArray(data.samagri)
            ? (data.samagri as Array<YagyaSamagriItem | string>).map((s) =>
                typeof s === "string" ? { name: s, status: "included" as const } : { name: s.name || "", status: s.status || "included" }
              )
            : [],
          prasad: data.prasad || "",
          dailySchedule: Array.isArray(data.dailySchedule)
            ? (data.dailySchedule as Array<YagyaDailyScheduleItem | { day?: string | number; time?: string | number; title?: string; activity?: string; details?: string }>).map((s) => ({
                day: ("day" in s && s.day !== undefined ? s.day : "time" in s ? s.time : "") ?? "",
                title: ("title" in s && s.title !== undefined ? s.title : "activity" in s ? s.activity : "") ?? "",
                details: s.details ?? "",
              }))
            : [],
          whatsIncluded: Array.isArray(data.whatsIncluded) ? data.whatsIncluded : [],
          whyPerform: Array.isArray(data.whyPerform)
            ? (data.whyPerform as Array<YagyaWhyPerformItem | string>).map((w) =>
                typeof w === "string" ? { title: w, description: "" } : { title: w.title || "", description: w.description || "" }
              )
            : [],
          significance: Array.isArray(data.significance) ? data.significance as string[] : [],
          procedureSteps: Array.isArray(data.procedureSteps)
            ? (data.procedureSteps as Array<YagyaProcedureStep | string>).map((p, i: number) =>
                typeof p === "string" ? { step: String(i + 1).padStart(2, "0"), title: p, description: "" }
                  : { step: p.step || String(i + 1).padStart(2, "0"), title: p.title || "", description: p.description || "" }
              )
            : [],
          faqs: Array.isArray(data.faqs)
            ? (data.faqs as Array<YagyaFaqItem | { question?: string; q?: string; answer?: string; a?: string }>).map((f) => ({
                question: ("question" in f && f.question !== undefined ? f.question : "q" in f ? f.q : "") || "",
                answer: ("answer" in f && f.answer !== undefined ? f.answer : "a" in f ? f.a : "") || "",
              }))
            : [],
          isFeatured: Boolean(data.isFeatured), isActive: Boolean(data.isActive),
          seo: data.seo || {},
        });
        setSlugManuallyEdited(true);
      })
      .catch((err: unknown) => toast.error((err as Error)?.message || "Unable to load Yagya service."))
      .finally(() => setLoading(false));
  }, [id, isEdit, toast]);

  const handleNameChange = (v: string) => {
    setForm((p) => ({ ...p, name: v, slug: slugManuallyEdited ? p.slug : slugify(v) }));
    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
  };
  const handleSlugChange = (v: string) => {
    setSlugManuallyEdited(true);
    setForm((p) => ({ ...p, slug: slugify(v) }));
  };

  // Simple string-array helpers (whatsIncluded, significance)
  type SAF = "whatsIncluded" | "significance";
  const addStr = (f: SAF) => setForm((p) => ({ ...p, [f]: [...(p[f] as string[]), ""] }));
  const updStr = (f: SAF, i: number, v: string) =>
    setForm((p) => { const a = [...(p[f] as string[])]; a[i] = v; return { ...p, [f]: a }; });
  const remStr = (f: SAF, i: number) =>
    setForm((p) => { const a = [...(p[f] as string[])]; a.splice(i, 1); return { ...p, [f]: a }; });

  // FAQ helpers
  const addFaq = () => setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  const updFaq = (i: number, k: "question" | "answer", v: string) =>
    setForm((p) => { const faqs = [...p.faqs]; faqs[i] = { ...faqs[i], [k]: v }; return { ...p, faqs }; });
  const remFaq = (i: number) =>
    setForm((p) => { const faqs = [...p.faqs]; faqs.splice(i, 1); return { ...p, faqs }; });

  const handleApplyBulkFaqs = (
    newFaqs: Array<{ question: string; answer: string }>,
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      faqs: mode === "replace" ? newFaqs : [...prev.faqs, ...newFaqs],
    }));
    toast.success(
      `${newFaqs.length} FAQ${newFaqs.length > 1 ? "s" : ""} ${
        mode === "replace" ? "replaced" : "added to"
      } Yagya service.`
    );
  };

  const handleApplyBulkWhatsIncluded = (
    newItems: string[],
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      whatsIncluded: mode === "replace" ? newItems : [...prev.whatsIncluded, ...newItems],
    }));
    toast.success(
      `${newItems.length} inclusion item${newItems.length > 1 ? "s" : ""} ${
        mode === "replace" ? "replaced" : "added to"
      } What's Included.`
    );
  };

  const handleApplyBulkSamagri = (
    newItems: YagyaSamagriItem[],
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      samagri: mode === "replace" ? newItems : [...prev.samagri, ...newItems],
    }));
    toast.success(
      `${newItems.length} samagri item${newItems.length > 1 ? "s" : ""} ${
        mode === "replace" ? "replaced" : "added to"
      } Samagri list.`
    );
  };

  const handleApplyBulkSignificance = (
    newItems: string[],
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      significance:
        mode === "replace"
          ? newItems
          : [...prev.significance, ...newItems],
    }));
    toast.success(
      `${newItems.length} significance point${
        newItems.length > 1 ? "s" : ""
      } ${mode === "replace" ? "replaced" : "added to"} Scriptural Significance.`
    );
  };

  const handleApplyBulkDailySchedule = (
    newItems: YagyaDailyScheduleItem[],
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      dailySchedule:
        mode === "replace"
          ? newItems
          : [...prev.dailySchedule, ...newItems],
    }));
    toast.success(
      `${newItems.length} schedule item${
        newItems.length > 1 ? "s" : ""
      } ${mode === "replace" ? "replaced" : "added to"} Daily Schedule.`
    );
  };

  // Pricing tier helpers — includes panditCount
  const addTier = () => setForm((p) => ({ ...p, pricingTiers: [...p.pricingTiers, { label: "", days: 3, price: 0, panditCount: 5 }] }));
  const updTier = (i: number, k: keyof YagyaPricingTier, v: string) =>
    setForm((p) => { const t = [...p.pricingTiers]; t[i] = { ...t[i], [k]: k === "label" ? v : Number(v) }; return { ...p, pricingTiers: t }; });
  const remTier = (i: number) =>
    setForm((p) => { const t = [...p.pricingTiers]; t.splice(i, 1); return { ...p, pricingTiers: t }; });

  // Daily schedule helpers — { day, title, details }
  const addSched = () => setForm((p) => ({ ...p, dailySchedule: [...p.dailySchedule, { day: p.dailySchedule.length + 1, title: "", details: "" }] }));
  const updSched = (i: number, k: keyof YagyaDailyScheduleItem, v: string) =>
    setForm((p) => { const s = [...p.dailySchedule]; s[i] = { ...s[i], [k]: k === "day" ? (isNaN(Number(v)) ? v : Number(v)) : v }; return { ...p, dailySchedule: s }; });
  const remSched = (i: number) =>
    setForm((p) => { const s = [...p.dailySchedule]; s.splice(i, 1); return { ...p, dailySchedule: s }; });

  // Samagri helpers — { name, status }
  const addSamagri = () => setForm((p) => ({ ...p, samagri: [...p.samagri, { name: "", status: "included" as const }] }));
  const updSamagri = (i: number, k: keyof YagyaSamagriItem, v: string) =>
    setForm((p) => { const s = [...p.samagri]; s[i] = { ...s[i], [k]: v } as YagyaSamagriItem; return { ...p, samagri: s }; });
  const remSamagri = (i: number) =>
    setForm((p) => { const s = [...p.samagri]; s.splice(i, 1); return { ...p, samagri: s }; });

  // whyPerform helpers — { title, description }
  const addWhyPerform = () => setForm((p) => ({ ...p, whyPerform: [...p.whyPerform, { title: "", description: "" }] }));
  const updWhyPerform = (i: number, k: keyof YagyaWhyPerformItem, v: string) =>
    setForm((p) => { const w = [...p.whyPerform]; w[i] = { ...w[i], [k]: v }; return { ...p, whyPerform: w }; });
  const remWhyPerform = (i: number) =>
    setForm((p) => { const w = [...p.whyPerform]; w.splice(i, 1); return { ...p, whyPerform: w }; });

  // procedureSteps helpers — { step, title, description }
  const addStep = () => setForm((p) => ({ ...p, procedureSteps: [...p.procedureSteps, { step: String(p.procedureSteps.length + 1).padStart(2, "0"), title: "", description: "" }] }));
  const updStep = (i: number, k: keyof YagyaProcedureStep, v: string) =>
    setForm((p) => { const s = [...p.procedureSteps]; s[i] = { ...s[i], [k]: v }; return { ...p, procedureSteps: s }; });
  const remStep = (i: number) =>
    setForm((p) => { const s = [...p.procedureSteps]; s.splice(i, 1); return { ...p, procedureSteps: s }; });


  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { mediaUploadService.validateImageFile(file); } catch (err: any) {
      toast.error(err.message); if (bannerInputRef.current) bannerInputRef.current.value = ""; return;
    }
    setBannerUploading(true);
    try {
      const r = await mediaUploadService.uploadImage(file, { folder: "veda-structure/yagya-services/banners" });
      setForm((p) => ({ ...p, bannerImage: r.url }));
      toast.success("Banner uploaded.");
    } catch (err: any) { toast.error(err.message || "Upload failed."); }
    finally { setBannerUploading(false); if (bannerInputRef.current) bannerInputRef.current.value = ""; }
  };

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]; if (!files.length) return;
    setGalleryUploading(true);
    try {
      const results = await mediaUploadService.uploadImages(files, {
        folder: "veda-structure/yagya-services/gallery",
        onProgress: (c, t) => setGalleryProgress({ current: c, total: t }),
      });
      setForm((p) => ({ ...p, galleryImages: [...p.galleryImages, ...results.map((r) => r.url)] }));
      toast.success(`${results.length} image(s) uploaded.`);
    } catch (err: any) { toast.error(err.message || "Gallery upload failed."); }
    finally { setGalleryUploading(false); setGalleryProgress(null); if (galleryInputRef.current) galleryInputRef.current.value = ""; }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    if (!form.deity.trim()) e.deity = "Deity is required.";
    if (!form.startingPrice || isNaN(Number(form.startingPrice)) || Number(form.startingPrice) < 0)
      e.startingPrice = "Valid price required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted errors."); return; }
    setSubmitting(true);
    try {
      const durNums = form.availableDurationsText.split(/[,\s]+/).map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
      const payload = {
        name: form.name.trim(), slug: form.slug.trim(), deity: form.deity.trim(),
        eyebrow: form.eyebrow.trim() || null, tagline: form.tagline.trim() || null,
        shortDescription: form.shortDescription.trim() || null, fullDescription: form.fullDescription.trim() || null,
        categoryId: form.categoryId.trim() || null,
        purposeId: form.purposeId || null, purposeSummary: form.purposeSummary.trim() || null,
        availableDurations: durNums, durationDisplay: form.durationDisplay.trim() || null,
        dailyRitualHours: parseInt(form.dailyRitualHours, 10) || 5,
        dailyHoursDisplay: form.dailyHoursDisplay.trim() || null,
        panditRequirement: {
          minimumPandits: parseInt(form.minimumPandits, 10) || 3,
          recommendedPandits: parseInt(form.recommendedPandits, 10) || 5,
          maximumPandits: parseInt(form.maximumPandits, 10) || 11,
          skillRequirements: form.skillRequirements.trim() || undefined,
          dailyHours: parseInt(form.panditDailyHours, 10) || 5,
        },
        startingPrice: Number(form.startingPrice),
        pricingTiers: form.pricingTiers.filter((t) => t.days > 0 && t.price >= 0),
        availableMode: form.availableMode,
        locationType: form.locationType.trim() || null, location: form.location.trim() || null,
        isKashiAvailable: form.isKashiAvailable, isRemoteAvailable: form.isRemoteAvailable,
        isFeatured: form.isFeatured, isActive: form.isActive,
        bannerImage: form.bannerImage || null, galleryImages: form.galleryImages,
        samagri: form.samagri.filter((s) => s.name.trim()),
        prasad: form.prasad.trim() || null,
        dailySchedule: form.dailySchedule.filter((s) => s.title.trim()),
        whatsIncluded: form.whatsIncluded.filter((s) => s.trim()),
        whyPerform: form.whyPerform.filter((w) => w.title.trim()),
        significance: form.significance.filter((s) => s.trim()),
        procedureSteps: form.procedureSteps.filter((p) => p.title.trim()),
        faqs: form.faqs.filter((f) => f.question.trim()),
        seo: form.seo,
      };
      if (isEdit && id) {
        await yagyaServiceCatalogueService.updateYagyaService(id, payload);
        toast.success(`"${form.name}" updated.`);
        navigate(`/admin/yagya-services/${id}`);
      } else {
        const created = await yagyaServiceCatalogueService.createYagyaService(payload);
        toast.success(`"${form.name}" created.`);
        navigate(`/admin/yagya-services/${created.id}`);
      }
    } catch (err: any) { toast.error(err?.message || "Failed to save Yagya service."); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium text-charcoal-500">Loading Yagya service...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Yagya Service" : "New Yagya Service"}
        subtitle={isEdit ? `Editing: ${form.name || "…"}` : "Add a new Yagya to the catalogue"}
        actions={
          <div className="flex items-center gap-2">
            <Link to={isEdit && id ? `/admin/yagya-services/${id}` : "/admin/yagya-services"} className="btn-secondary">Cancel</Link>
            <button type="submit" form="yagya-service-form" disabled={submitting} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {submitting ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        }
      />
      <form id="yagya-service-form" onSubmit={handleSubmit} className="space-y-5">

        {/* S1: Basic Info */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Flame className="w-4 h-4 text-saffron-600" /> 1. Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Name <span className="text-red-500">*</span></label>
              <input id="yagya-name" className={`input-field ${errors.name ? "border-red-400" : ""}`} value={form.name}
                onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Maha Mrityunjaya Yagya" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label-field">Slug <span className="text-red-500">*</span></label>
              <input id="yagya-slug" className={`input-field font-mono text-sm ${errors.slug ? "border-red-400" : ""}`} value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)} placeholder="auto-generated" />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>
            <div>
              <label className="label-field">Deity <span className="text-red-500">*</span></label>
              <input id="yagya-deity" className={`input-field ${errors.deity ? "border-red-400" : ""}`} value={form.deity}
                onChange={(e) => setForm((p) => ({ ...p, deity: e.target.value }))} placeholder="e.g. Lord Shiva (Tryambaka)" />
              {errors.deity && <p className="text-xs text-red-500 mt-1">{errors.deity}</p>}
            </div>
            <div>
              <label className="label-field">Eyebrow Label</label>
              <input className="input-field" value={form.eyebrow}
                onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))} placeholder="e.g. VEDIC YAGYA · TRYAMBAKAM SEVA" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Tagline</label>
              <input className="input-field" value={form.tagline}
                onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} placeholder="e.g. Sacred Rigvedic Maha Mrityunjaya Ahutis…" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Short Description</label>
              <textarea rows={2} className="input-field" value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} placeholder="Brief summary (1–2 sentences)" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Full Description</label>
              <textarea rows={4} className="input-field" value={form.fullDescription}
                onChange={(e) => setForm((p) => ({ ...p, fullDescription: e.target.value }))} placeholder="Detailed description for the service page" />
            </div>
            <div className="flex gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isFeatured}
                  onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="rounded" />
                <span className="font-medium text-charcoal-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                <span className="font-medium text-charcoal-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* S2: Purpose & Category */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Star className="w-4 h-4 text-saffron-600" /> 2. Category & Purpose
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="yagya-category-select">
                Yagya Category
              </label>
              <select
                id="yagya-category-select"
                className="input-field"
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "— Select Yagya Category (Optional) —"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <p className="text-xs text-red-500 mt-1">{categoriesError}</p>
              )}
              <p className="text-xs text-charcoal-400 mt-1">
                Associates this service with a customer discovery category.
              </p>
            </div>
            <div>
              <label className="label-field">Purpose Category</label>
              <select className="input-field" value={form.purposeId}
                onChange={(e) => setForm((p) => ({ ...p, purposeId: e.target.value }))}>
                <option value="">— Select Purpose —</option>
                {purposes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Purpose Summary</label>
              <input className="input-field" value={form.purposeSummary}
                onChange={(e) => setForm((p) => ({ ...p, purposeSummary: e.target.value }))}
                placeholder="e.g. Healing intentions, longevity, inner courage" />
            </div>
          </div>
        </div>

        {/* S3: Duration */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Clock className="w-4 h-4 text-saffron-600" /> 3. Duration & Ritual Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Available Durations (comma-separated days)</label>
              <input className="input-field" value={form.availableDurationsText}
                onChange={(e) => setForm((p) => ({ ...p, availableDurationsText: e.target.value }))} placeholder="e.g. 3, 5, 7, 11" />
              <p className="text-xs text-charcoal-400 mt-1">Stored as number array [3, 5, 7, 11] in API.</p>
            </div>
            <div>
              <label className="label-field">Duration Display Label</label>
              <input className="input-field" value={form.durationDisplay}
                onChange={(e) => setForm((p) => ({ ...p, durationDisplay: e.target.value }))} placeholder="e.g. 3 / 5 / 7 Days" />
            </div>
            <div>
              <label className="label-field">Daily Ritual Hours</label>
              <input type="number" min="1" max="24" className="input-field" value={form.dailyRitualHours}
                onChange={(e) => setForm((p) => ({ ...p, dailyRitualHours: e.target.value }))} placeholder="5" />
            </div>
            <div>
              <label className="label-field">Daily Hours Display</label>
              <input className="input-field" value={form.dailyHoursDisplay}
                onChange={(e) => setForm((p) => ({ ...p, dailyHoursDisplay: e.target.value }))} placeholder="e.g. 5 Hours / Day" />
            </div>
          </div>
        </div>

        {/* S4: Pandit Requirement */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Users className="w-4 h-4 text-saffron-600" /> 4. Pandit Requirement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">Minimum Pandits</label>
              <input type="number" min="1" className="input-field" value={form.minimumPandits}
                onChange={(e) => setForm((p) => ({ ...p, minimumPandits: e.target.value }))} placeholder="3" />
            </div>
            <div>
              <label className="label-field">Recommended Pandits</label>
              <input type="number" min="1" className="input-field" value={form.recommendedPandits}
                onChange={(e) => setForm((p) => ({ ...p, recommendedPandits: e.target.value }))} placeholder="5" />
            </div>
            <div>
              <label className="label-field">Maximum Pandits</label>
              <input type="number" min="1" className="input-field" value={form.maximumPandits}
                onChange={(e) => setForm((p) => ({ ...p, maximumPandits: e.target.value }))} placeholder="11" />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Skill Requirements</label>
              <input className="input-field" value={form.skillRequirements}
                onChange={(e) => setForm((p) => ({ ...p, skillRequirements: e.target.value }))}
                placeholder="e.g. Trained in Shukla/Krishna Yajurveda and Sri Rudram" />
            </div>
            <div>
              <label className="label-field">Daily Hours (Pandit)</label>
              <input type="number" min="1" max="24" className="input-field" value={form.panditDailyHours}
                onChange={(e) => setForm((p) => ({ ...p, panditDailyHours: e.target.value }))} placeholder="5" />
            </div>
          </div>
        </div>

        {/* S5: Pricing */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <DollarSign className="w-4 h-4 text-saffron-600" /> 5. Pricing
          </h3>
          <div className="mb-4">
            <label className="label-field">Starting Price (INR) <span className="text-red-500">*</span></label>
            <input type="number" min="0" step="100" className={`input-field max-w-xs ${errors.startingPrice ? "border-red-400" : ""}`}
              value={form.startingPrice} onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))} placeholder="e.g. 21000" />
            {errors.startingPrice && <p className="text-xs text-red-500 mt-1">{errors.startingPrice}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-field mb-0">Pricing Tiers (days · panditCount · price)</label>
              <button type="button" onClick={addTier} className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>
            <div className="space-y-2">
              {form.pricingTiers.map((tier, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-cream-200 space-y-2">
                  <input className="input-field py-1.5 text-xs w-full" placeholder="Label (e.g. 3-Day Sacred Cycle)" value={tier.label}
                    onChange={(e) => updTier(idx, "label", e.target.value)} />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-charcoal-400 block mb-1">Days</label>
                      <input type="number" min="1" className="input-field py-1.5 text-xs" value={tier.days}
                        onChange={(e) => updTier(idx, "days", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-charcoal-400 block mb-1">Pandit Count</label>
                      <input type="number" min="0" className="input-field py-1.5 text-xs" value={tier.panditCount ?? ""}
                        onChange={(e) => updTier(idx, "panditCount", e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-charcoal-400 block mb-1">Price (INR)</label>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" className="input-field py-1.5 text-xs flex-1" value={tier.price}
                          onChange={(e) => updTier(idx, "price", e.target.value)} />
                        <button type="button" onClick={() => remTier(idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {form.pricingTiers.length === 0 && <p className="text-xs text-charcoal-400 italic">No pricing tiers. Add tiers for different durations.</p>}
            </div>
          </div>
        </div>

        {/* S6: Location */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <MapPin className="w-4 h-4 text-saffron-600" /> 6. Location & Arrangement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Available Mode</label>
              <select className="input-field" value={form.availableMode} onChange={(e) => setForm((p) => ({ ...p, availableMode: e.target.value as "in_person" | "remote" | "hybrid" }))}>
                <option value="hybrid">Hybrid (In-Person + Remote)</option>
                <option value="in_person">In-Person Only</option>
                <option value="remote">Remote Only</option>
              </select>
            </div>
            <div>
              <label className="label-field">Location Type</label>
              <input className="input-field" value={form.locationType}
                onChange={(e) => setForm((p) => ({ ...p, locationType: e.target.value }))} placeholder="e.g. Kashi Kshetras & Sacred Mandaps" />
            </div>
            <div>
              <label className="label-field">Location</label>
              <input className="input-field" value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Kashi (Varanasi)" />
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isKashiAvailable}
                  onChange={(e) => setForm((p) => ({ ...p, isKashiAvailable: e.target.checked }))} className="rounded" />
                <span className="font-medium text-charcoal-700">Kashi Venue Available</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isRemoteAvailable}
                  onChange={(e) => setForm((p) => ({ ...p, isRemoteAvailable: e.target.checked }))} className="rounded" />
                <span className="font-medium text-charcoal-700">Remote Participation Available</span>
              </label>
            </div>
          </div>
        </div>

        {/* S7: Samagri */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-cream-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-saffron-600" /> 7. Samagri (Ritual Materials)
              </h3>
              <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                {form.samagri.length} {form.samagri.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSamagriBulkModalOpen(true)}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
              >
                <ListPlus className="w-3.5 h-3.5" /> Bulk Add Samagri
              </button>
              <button
                type="button"
                onClick={addSamagri}
                className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {form.samagri.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-1 text-xs font-bold text-charcoal-400 text-center">{idx + 1}.</span>
                <input className="input-field py-1.5 text-xs col-span-6" value={item.name}
                  onChange={(e) => updSamagri(idx, "name", e.target.value)} placeholder="e.g. Pure Desi Cow Ghee" />
                <select className="input-field py-1.5 text-xs col-span-4" value={item.status}
                  onChange={(e) => updSamagri(idx, "status", e.target.value)}>
                  <option value="included">Included</option>
                  <option value="optional">Optional</option>
                  <option value="additional">Additional</option>
                </select>
                <button type="button" onClick={() => remSamagri(idx)} className="col-span-1 p-1.5 text-charcoal-400 hover:text-red-500 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.samagri.length === 0 && (
              <div className="text-center py-6 px-4 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
                No samagri items added. Click{" "}
                <strong
                  className="text-saffron-600 cursor-pointer hover:underline"
                  onClick={() => setIsSamagriBulkModalOpen(true)}
                >
                  Bulk Add Samagri
                </strong>{" "}
                to paste an inventory list or{" "}
                <strong
                  className="text-charcoal-800 cursor-pointer hover:underline"
                  onClick={addSamagri}
                >
                  + Add Item
                </strong>{" "}
                to add one manually.
              </div>
            )}
          </div>
          <div>
            <label className="label-field">Prasad Description</label>
            <input className="input-field" value={form.prasad}
              onChange={(e) => setForm((p) => ({ ...p, prasad: e.target.value }))} placeholder="e.g. Energized Bhasma, Raksha Sutra, dry prasadam" />
          </div>
        </div>

        {/* S8: Daily Schedule */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-cream-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-saffron-600" /> 8. Daily Schedule
              </h3>
              <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                {form.dailySchedule.length} {form.dailySchedule.length === 1 ? "Day" : "Days"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDailyScheduleBulkModalOpen(true)}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
              >
                <ListPlus className="w-3.5 h-3.5" /> Bulk Add Schedule
              </button>
              <button
                type="button"
                onClick={addSched}
                className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {form.dailySchedule.map((slot, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-cream-200 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-charcoal-400 mb-1 block">Day (number or "Final")</label>
                    <input className="input-field py-1.5 text-xs" placeholder='e.g. 1, 2, "Final"' value={String(slot.day)}
                      onChange={(e) => updSched(idx, "day", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-charcoal-400 mb-1 block">Title</label>
                    <div className="flex items-center gap-2">
                      <input className="input-field py-1.5 text-xs flex-1" placeholder="e.g. Sthapana & Pratham Sankalp" value={slot.title}
                        onChange={(e) => updSched(idx, "title", e.target.value)} />
                      <button type="button" onClick={() => remSched(idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-charcoal-400 mb-1 block">Details</label>
                  <input className="input-field py-1.5 text-xs" placeholder="e.g. Altar sanctification, Agni Mathan, initial ahutis" value={slot.details}
                    onChange={(e) => updSched(idx, "details", e.target.value)} />
                </div>
              </div>
            ))}
            {form.dailySchedule.length === 0 && (
              <div className="text-center py-6 px-4 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
                No schedule days added. Click{" "}
                <strong
                  className="text-saffron-600 cursor-pointer hover:underline"
                  onClick={() => setIsDailyScheduleBulkModalOpen(true)}
                >
                  Bulk Add Schedule
                </strong>{" "}
                to paste an itinerary or{" "}
                <strong
                  className="text-charcoal-800 cursor-pointer hover:underline"
                  onClick={addSched}
                >
                  + Add Day
                </strong>{" "}
                to add one manually.
              </div>
            )}
          </div>
        </div>

        {/* S9: Content */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <BookOpen className="w-4 h-4 text-saffron-600" /> 9. Service Content
          </h3>

          {/* What's Included — string[] */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <label className="label-field mb-0">What's Included</label>
                <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2 py-0.5 rounded-full border border-cream-200">
                  {form.whatsIncluded.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsIncludedBulkModalOpen(true)}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Bulk Add
                </button>
                <button
                  type="button"
                  onClick={() => addStr("whatsIncluded")}
                  className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {form.whatsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saffron-400 flex-shrink-0" />
                  <input className="input-field py-1.5 text-xs" value={item}
                    onChange={(e) => updStr("whatsIncluded", idx, e.target.value)} placeholder="e.g. All samagri and pure desi cow ghee" />
                  <button type="button" onClick={() => remStr("whatsIncluded", idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.whatsIncluded.length === 0 && (
                <div className="text-center py-4 px-3 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
                  No inclusions added. Click{" "}
                  <strong
                    className="text-saffron-600 cursor-pointer hover:underline"
                    onClick={() => setIsWhatsIncludedBulkModalOpen(true)}
                  >
                    Bulk Add
                  </strong>{" "}
                  to paste a list or{" "}
                  <strong
                    className="text-charcoal-800 cursor-pointer hover:underline"
                    onClick={() => addStr("whatsIncluded")}
                  >
                    + Add
                  </strong>{" "}
                  to create one.
                </div>
              )}
            </div>
          </div>

          {/* Why Perform — { title, description } */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="label-field mb-0">Why Perform (Benefits)</label>
              <button type="button" onClick={addWhyPerform} className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.whyPerform.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-cream-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <input className="input-field py-1.5 text-xs flex-1" placeholder="Benefit title (e.g. Vitality & Longevity)" value={item.title}
                      onChange={(e) => updWhyPerform(idx, "title", e.target.value)} />
                    <button type="button" onClick={() => remWhyPerform(idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input className="input-field py-1.5 text-xs" placeholder="Description (e.g. Invokes Tryambaka Shiva for health…)" value={item.description}
                    onChange={(e) => updWhyPerform(idx, "description", e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          {/* Significance — string[] */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <label className="label-field mb-0">Scriptural Significance</label>
                <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2 py-0.5 rounded-full border border-cream-200">
                  {form.significance.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignificanceBulkModalOpen(true)}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Bulk Add
                </button>
                <button
                  type="button"
                  onClick={() => addStr("significance")}
                  className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {form.significance.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input className="input-field py-1.5 text-xs" value={item}
                    onChange={(e) => updStr("significance", idx, e.target.value)} placeholder="e.g. Prescribed in Rigveda Mandala 7" />
                  <button type="button" onClick={() => remStr("significance", idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {form.significance.length === 0 && (
                <div className="text-center py-4 px-3 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
                  No scriptural significance points added. Click{" "}
                  <strong
                    className="text-saffron-600 cursor-pointer hover:underline"
                    onClick={() => setIsSignificanceBulkModalOpen(true)}
                  >
                    Bulk Add
                  </strong>{" "}
                  to paste references or{" "}
                  <strong
                    className="text-charcoal-800 cursor-pointer hover:underline"
                    onClick={() => addStr("significance")}
                  >
                    + Add
                  </strong>{" "}
                  to add one manually.
                </div>
              )}
            </div>
          </div>

          {/* Procedure Steps — { step, title, description } */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-field mb-0">Ritual Procedure Steps</label>
              <button type="button" onClick={addStep} className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {form.procedureSteps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-cream-200 space-y-2">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <input className="input-field py-1.5 text-xs font-mono" placeholder="Step (e.g. 01)" value={step.step}
                      onChange={(e) => updStep(idx, "step", e.target.value)} />
                    <div className="col-span-2 flex items-center gap-2">
                      <input className="input-field py-1.5 text-xs flex-1" placeholder="Title (e.g. Sthapana & Gotra Sankalp)" value={step.title}
                        onChange={(e) => updStep(idx, "title", e.target.value)} />
                      <button type="button" onClick={() => remStep(idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input className="input-field py-1.5 text-xs" placeholder="Description (e.g. Priests sanctify the yagyashala…)" value={step.description}
                    onChange={(e) => updStep(idx, "description", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S10: FAQs */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-cream-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-saffron-600" /> 10. FAQs
              </h3>
              <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                {form.faqs.length} {form.faqs.length === 1 ? "FAQ" : "FAQs"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFaqBulkModalOpen(true)}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
              >
                <ListPlus className="w-3.5 h-3.5" /> Bulk Add FAQs
              </button>
              <button
                type="button"
                onClick={addFaq}
                className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-cream-50 border border-cream-200 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-saffron-600 mt-2 flex-shrink-0">Q{idx + 1}</span>
                  <input className="input-field py-1.5 text-xs flex-1" placeholder="Question" value={faq.question}
                    onChange={(e) => updFaq(idx, "question", e.target.value)} />
                  <button type="button" onClick={() => remFaq(idx)} className="p-1.5 text-charcoal-400 hover:text-red-500 rounded flex-shrink-0 mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-charcoal-400 mt-2 flex-shrink-0">A{idx + 1}</span>
                  <textarea rows={2} className="input-field py-1.5 text-xs flex-1" placeholder="Answer" value={faq.answer}
                    onChange={(e) => updFaq(idx, "answer", e.target.value)} />
                </div>
              </div>
            ))}
            {form.faqs.length === 0 && (
              <div className="text-center py-6 px-4 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
                No FAQs added yet. Click{" "}
                <strong
                  className="text-saffron-600 cursor-pointer hover:underline"
                  onClick={() => setIsFaqBulkModalOpen(true)}
                >
                  Bulk Add FAQs
                </strong>{" "}
                to paste multiple entries or{" "}
                <strong
                  className="text-charcoal-800 cursor-pointer hover:underline"
                  onClick={addFaq}
                >
                  + Add FAQ
                </strong>{" "}
                to create one manually.
              </div>
            )}
          </div>
        </div>

        {/* S11: Media */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <ImageIcon className="w-4 h-4 text-saffron-600" /> 11. Media
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label-field">Banner Image</label>
              <div className="flex items-start gap-3 flex-wrap">
                {form.bannerImage && (
                  <div className="relative">
                    <img src={form.bannerImage} alt="Banner" className="w-32 h-24 object-cover rounded-lg border border-cream-200" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, bannerImage: "" }))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerSelect} className="hidden" />
                  <button type="button" onClick={() => bannerInputRef.current?.click()} disabled={bannerUploading}
                    className="btn-secondary flex items-center gap-2 text-sm">
                    <Upload className="w-4 h-4" />
                    {bannerUploading ? "Uploading…" : form.bannerImage ? "Replace Banner" : "Upload Banner"}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="label-field">Gallery Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.galleryImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-20 h-16 object-cover rounded border border-cream-200" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, galleryImages: p.galleryImages.filter((_, i) => i !== idx) }))}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" multiple ref={galleryInputRef} onChange={handleGallerySelect} className="hidden" />
              <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={galleryUploading}
                className="btn-secondary flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4" />
                {galleryUploading
                  ? galleryProgress ? `Uploading ${galleryProgress.current}/${galleryProgress.total}…` : "Uploading…"
                  : "Upload Gallery Images"}
              </button>
            </div>
          </div>
        </div>

        {/* Section: Search Engine Optimization & Social Sharing */}
        <SEOSection
          value={form.seo}
          onChange={(newSeo) => setForm((p) => ({ ...p, seo: newSeo }))}
          defaultTitle={form.name}
          defaultDescription={form.shortDescription || form.fullDescription}
          defaultOgImage={form.bannerImage}
          defaultSlug={form.slug}
          serviceTypeLabel="Yagya"
          disabled={submitting}
        />

        {/* Submit Footer */}
        <div className="flex justify-end gap-3 pb-6">
          <Link to={isEdit && id ? `/admin/yagya-services/${id}` : "/admin/yagya-services"} className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {submitting ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>

      {/* Bulk FAQ Modal */}
      <BulkFaqModal
        isOpen={isFaqBulkModalOpen}
        onClose={() => setIsFaqBulkModalOpen(false)}
        onApply={handleApplyBulkFaqs}
        existingCount={
          form.faqs.filter((f) => f.question.trim().length > 0).length
        }
      />

      {/* Bulk What's Included Modal */}
      <BulkStringListModal
        isOpen={isWhatsIncludedBulkModalOpen}
        onClose={() => setIsWhatsIncludedBulkModalOpen(false)}
        title="Bulk Add Inclusions (What's Included)"
        itemLabel="Inclusion"
        placeholder="Paste inclusions here (one per line)...&#10;e.g.&#10;Vedic Brahmin Dakshina & Guru Dakshina&#10;Pure Desi Cow Ghee & Puja Samagri&#10;Personalized Gotra & Family Sankalp&#10;Consecrated Prasad Shipped to Home"
        sampleItems={[
          "Vedic Brahmin Dakshina & Guru Dakshina",
          "Pure Desi Cow Ghee & Puja Samagri",
          "Personalized Gotra & Family Sankalp",
          "Private High-Definition Live Stream",
          "Consecrated Prasad Shipped to Home",
        ]}
        isNumbered={false}
        existingCount={form.whatsIncluded.filter((s) => s.trim().length > 0).length}
        onApply={handleApplyBulkWhatsIncluded}
      />

      {/* Bulk Samagri Modal */}
      <BulkSamagriModal
        isOpen={isSamagriBulkModalOpen}
        onClose={() => setIsSamagriBulkModalOpen(false)}
        existingCount={form.samagri.filter((s) => s.name.trim().length > 0).length}
        onApply={handleApplyBulkSamagri}
      />

      {/* Bulk Scriptural Significance Modal */}
      <BulkStringListModal
        isOpen={isSignificanceBulkModalOpen}
        onClose={() => setIsSignificanceBulkModalOpen(false)}
        title="Bulk Add Scriptural Significance"
        itemLabel="Significance Point"
        placeholder="Paste scriptural significance points here (one per line)...&#10;e.g.&#10;Promotes spiritual purification&#10;Encourages discipline and devotion&#10;Supports traditional Vedic worship&#10;Provides an opportunity for collective prayer"
        sampleItems={[
          "Promotes spiritual purification and inner clarity",
          "Encourages discipline, devotion, and divine surrender",
          "Supports traditional Vedic worship according to ancient Shastras",
          "Provides an auspicious opportunity for collective family prayer",
        ]}
        isNumbered={false}
        existingCount={form.significance.filter((s) => s.trim().length > 0).length}
        onApply={handleApplyBulkSignificance}
      />

      {/* Bulk Daily Schedule Modal */}
      <BulkDailyScheduleModal
        isOpen={isDailyScheduleBulkModalOpen}
        onClose={() => setIsDailyScheduleBulkModalOpen(false)}
        existingCount={form.dailySchedule.filter((s) => s.title.trim().length > 0).length}
        onApply={handleApplyBulkDailySchedule}
      />
    </div>
  );
}
