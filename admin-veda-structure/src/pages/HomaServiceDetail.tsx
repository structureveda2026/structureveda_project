import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Edit,
  ArrowLeft,
  Power,
  Sparkles,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  DollarSign,
  Calendar,
  HelpCircle,
  Flame,
  Layers,
  Tag,
  Shield,
  Globe,
  Package,
  Gift,
  ShieldAlert,
  LogIn,
  RefreshCw,
  Image as ImageIcon,
  Check,
  X as CloseIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import homaServiceCatalogueService, {
  AdminHomaServiceDetail,
  HomaSamagriItem,
} from "@/services/homaServiceCatalogueService";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
        <Icon className="w-4 h-4 text-saffron-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-2 border-b border-cream-50 last:border-0">
      <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider w-44 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-charcoal-700 flex-1">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Detail Page
// ---------------------------------------------------------------------------

export default function HomaServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState<AdminHomaServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchService = () => {
    if (!id) {
      navigate("/admin/homa-services");
      return;
    }
    setLoading(true);
    setError("");
    setIsAuthError(false);
    setIsNotFound(false);

    homaServiceCatalogueService
      .getHomaService(id)
      .then((data) => setService(data))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unable to load Homa service.";
        const lower = msg.toLowerCase();
        if (lower.includes("not found") || lower.includes("404")) {
          setIsNotFound(true);
        } else if (
          lower.includes("admin access required") ||
          lower.includes("unauthorized") ||
          lower.includes("forbidden") ||
          lower.includes("401") ||
          lower.includes("403")
        ) {
          setIsAuthError(true);
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!service || !id) return;
    if (service.isActive) {
      setDeactivateOpen(true);
      return;
    }
    setToggling(true);
    try {
      await homaServiceCatalogueService.updateHomaService(id, { isActive: true });
      setService((prev) => (prev ? { ...prev, isActive: true } : prev));
      toast.success(`"${service.name}" activated successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to activate service.";
      toast.error(msg);
    } finally {
      setToggling(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!service || !id) return;
    setToggling(true);
    try {
      await homaServiceCatalogueService.deleteHomaService(id);
      setService((prev) => (prev ? { ...prev, isActive: false } : prev));
      toast.success(`"${service.name}" deactivated successfully.`);
      setDeactivateOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to deactivate service.";
      toast.error(msg);
    } finally {
      setToggling(false);
    }
  };

  // Live Display Pricing Samples
  const pricingSamples = useMemo(() => {
    if (!service) return [];
    const base = Number(service.basePrice) || Number(service.startingPrice) || 0;
    const perHavan = Number(service.perHavanPrice) || 0;
    const perDay = Number(service.perDayPrice) || 0;

    const samples: { label: string; formula: string; amount: number }[] = [];

    const counts = Array.isArray(service.availableHavanCounts) && service.availableHavanCounts.length > 0
      ? service.availableHavanCounts
      : [1];
    const days = Array.isArray(service.availableDays) && service.availableDays.length > 0
      ? service.availableDays
      : [1];

    // Sample 1: 1 Havan / 1 Day (Base)
    if (counts.includes(1) && days.includes(1)) {
      samples.push({
        label: "1 Havan / 1 Day",
        formula: "Base Price",
        amount: base,
      });
    }

    // Sample 2: Multi-havan / 1 Day
    const multiHavan = counts.find((c) => c > 1);
    if (multiHavan && days.includes(1)) {
      samples.push({
        label: `${multiHavan} Havans / 1 Day`,
        formula: `₹${base.toLocaleString("en-IN")} + (${multiHavan} - 1) × ₹${perHavan.toLocaleString("en-IN")}`,
        amount: base + (multiHavan - 1) * perHavan,
      });
    }

    // Sample 3: Multi-havan / Multi-day
    const multiDay = days.find((d) => d > 1);
    const multiHavanForMultiDay = counts.find((c) => c >= 3) || multiHavan;
    if (multiDay && multiHavanForMultiDay) {
      samples.push({
        label: `${multiHavanForMultiDay} Havans / ${multiDay} Days`,
        formula: `₹${base.toLocaleString("en-IN")} + ${multiHavanForMultiDay - 1} × ₹${perHavan.toLocaleString("en-IN")} + ${multiDay - 1} × ₹${perDay.toLocaleString("en-IN")}`,
        amount: base + (multiHavanForMultiDay - 1) * perHavan + (multiDay - 1) * perDay,
      });
    }

    return samples;
  }, [service]);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-9 h-9 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading Homa service...</p>
      </div>
    );
  }

  // Auth Error State (401 / 403)
  if (isAuthError) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={<ShieldAlert className="w-10 h-10 text-red-400" />}
          title="Admin Access Required"
          message="Your account does not have administrator privileges to view this Homa service."
          action={
            <Link to="/admin/login" className="btn-primary flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  // Not Found State (404)
  if (isNotFound) {
    return (
      <div className="card p-6">
        <EmptyState
          icon={<Flame className="w-10 h-10 text-saffron-300" />}
          title="Homa Service Not Found"
          message="The requested Homa service does not exist or has been removed."
          action={
            <Link to="/admin/homa-services" className="btn-primary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Homa Services
            </Link>
          }
        />
      </div>
    );
  }

  // Generic Error State
  if (error || !service) {
    return (
      <div className="card p-6">
        <EmptyState
          title="Unable to Load Homa Service"
          message={error || "An unexpected error occurred while loading details."}
          action={
            <button
              type="button"
              onClick={fetchService}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          }
        />
      </div>
    );
  }

  const seoKeywords = Array.isArray(service.seo?.keywords)
    ? service.seo.keywords.join(", ")
    : typeof service.seo?.keywords === "string"
    ? service.seo.keywords
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title={service.name}
        subtitle={
          <span className="flex items-center gap-2 flex-wrap mt-1">
            <span className="font-mono text-xs text-charcoal-400 bg-cream-100 px-2 py-0.5 rounded">
              /{service.slug}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-saffron-800 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded">
              <Flame className="w-3 h-3 text-saffron-600" />
              {service.homaType || "Vedic Homa"}
            </span>
            {service.isFeatured && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-500" /> Featured
              </span>
            )}
            <StatusBadge status={service.isActive ? "Active" : "Inactive"} />
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/homa-services"
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>

            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 ${
                service.isActive
                  ? "text-red-600 hover:border-red-300"
                  : "text-green-600 hover:border-green-300"
              }`}
            >
              <Power className="w-4 h-4" />
              {toggling
                ? "Saving..."
                : service.isActive
                ? "Deactivate"
                : "Activate"}
            </button>

            <Link
              to={`/admin/homa-services/${id}/edit`}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm"
            >
              <Edit className="w-4 h-4" /> Edit Service
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 COLS) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Banner Image */}
          {service.bannerImage ? (
            <div className="card overflow-hidden">
              <img
                src={service.bannerImage}
                alt={service.name}
                className="w-full h-72 object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="card p-8 bg-cream-50/60 border border-cream-200 flex flex-col items-center justify-center text-charcoal-400">
              <Flame className="w-10 h-10 text-saffron-300 mb-2" />
              <span className="text-xs font-medium">No banner image uploaded</span>
            </div>
          )}

          {/* 1. Basic Information */}
          <SectionCard title="Basic Information" icon={Flame}>
            <InfoRow label="Service Name" value={service.name} />
            <InfoRow
              label="URL Slug"
              value={
                <span className="font-mono text-xs text-charcoal-700 bg-cream-100 px-2 py-0.5 rounded">
                  /{service.slug}
                </span>
              }
            />
            <InfoRow label="Homa Classification" value={service.homaType || "Vedic Homa"} />
            {service.shortDescription && (
              <div className="py-2 border-b border-cream-50">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                  Short Description
                </span>
                <p className="text-sm text-charcoal-700">{service.shortDescription}</p>
              </div>
            )}
            {service.description && (
              <div className="py-2">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                  Full Ritual Description
                </span>
                <p className="text-sm text-charcoal-700 whitespace-pre-wrap leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}
          </SectionCard>

          {/* 2. Purpose / Classification */}
          <SectionCard title="Purpose & Spiritual Benefits" icon={Tag}>
            <InfoRow
              label="Primary Purpose"
              value={
                service.purposeDetails ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
                    {service.purposeDetails.name} ({service.purposeDetails.slug})
                  </span>
                ) : service.purpose || service.purposeSummary ? (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
                    {service.purpose || service.purposeSummary}
                  </span>
                ) : (
                  <span className="text-charcoal-400 italic text-xs">None specified</span>
                )
              }
            />
            <InfoRow label="Purpose Summary" value={service.purposeSummary} />
            <InfoRow label="Purpose Category" value={service.purposeCategory} />

            <div className="py-2">
              <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1.5">
                Related Purpose Tags
              </span>
              {Array.isArray(service.purposeCategories) && service.purposeCategories.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {service.purposeCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-saffron-50 text-saffron-800 border border-saffron-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-charcoal-400 italic">No secondary tags assigned</span>
              )}
            </div>
          </SectionCard>

          {/* 3. Homa Configuration (Havan Counts & Durations) */}
          <SectionCard title="Homa & Duration Configuration" icon={Layers}>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                  Available Havan Counts
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(service.availableHavanCounts) && service.availableHavanCounts.length > 0 ? (
                    service.availableHavanCounts.map((count) => (
                      <span
                        key={count}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-saffron-50 text-saffron-900 border border-saffron-200"
                      >
                        <Flame className="w-3.5 h-3.5 text-saffron-600" />
                        {count} Havan{count > 1 ? "s" : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-charcoal-400 italic">No counts configured</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                  Available Durations (Days)
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(service.availableDays) && service.availableDays.length > 0 ? (
                    service.availableDays.map((day) => (
                      <span
                        key={day}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        {day} Day{day > 1 ? "s" : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-charcoal-400 italic">No durations configured</span>
                  )}
                </div>
              </div>

              {/* Informational Coupling Rule Callout */}
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-charcoal-800 font-semibold mb-0.5">
                    Vedic Ceremony Coupling Rule:
                  </strong>
                  A single Havan (1 Havan) is strictly completed in 1 Day. Multi-day ceremonies are supported when multi-havan recitation options (e.g. 3, 5, 11) are chosen.
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 4. Authoritative Pricing Section */}
          <SectionCard title="Authoritative Pricing Configuration" icon={DollarSign}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase block">Starting Price</span>
                <span className="text-lg font-bold text-charcoal-800">
                  {service.formattedPrice || `₹${Number(service.startingPrice).toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-green-700 block mt-0.5">= Base Price</span>
              </div>

              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase block">Base Price</span>
                <span className="text-lg font-bold text-charcoal-800">
                  ₹{Number(service.basePrice || service.startingPrice).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">1 Havan / 1 Day</span>
              </div>

              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase block">Per Havan (Delta)</span>
                <span className="text-lg font-bold text-charcoal-800">
                  ₹{Number(service.perHavanPrice || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">For count &gt; 1</span>
              </div>

              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase block">Per Day (Delta)</span>
                <span className="text-lg font-bold text-charcoal-800">
                  ₹{Number(service.perDayPrice || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">For days &gt; 1</span>
              </div>
            </div>

            {/* Authoritative Formula Callout */}
            <div className="p-4 rounded-xl bg-saffron-50/70 border border-saffron-200 text-xs text-saffron-900 mb-4">
              <span className="font-semibold block mb-1">Authoritative Runtime Formula:</span>
              <code className="block bg-white px-3 py-1.5 rounded-lg border border-saffron-200 font-mono text-xs text-charcoal-800">
                Total = Base Price + (Havan Count - 1) × Per Havan Price + (Duration Days - 1) × Per Day Price
              </code>
            </div>

            {/* Calculated Samples */}
            {pricingSamples.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                  Sample Configuration Calculations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pricingSamples.map((sample, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-cream-200 shadow-sm text-xs">
                      <span className="font-semibold text-charcoal-800 block text-xs mb-0.5">
                        {sample.label}
                      </span>
                      <span className="text-[11px] text-charcoal-400 block mb-1 font-mono">
                        {sample.formula}
                      </span>
                      <span className="text-base font-bold text-saffron-700 block">
                        ₹{sample.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* 5. Samagri & Prasad */}
          <SectionCard title="Samagri & Prasad Consecration" icon={Package}>
            <div className="space-y-4">
              {service.prasad && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-xs font-semibold text-amber-900 block mb-1">Prasad Consecration:</span>
                  <p className="text-xs text-charcoal-700">{service.prasad}</p>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                  Homa Samagri Items
                </span>
                {Array.isArray(service.samagri) && service.samagri.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.samagri.map((item, idx) => {
                      const itemName = typeof item === "string" ? item : (item as HomaSamagriItem).name;
                      const itemStatus =
                        typeof item === "string" ? "included" : (item as HomaSamagriItem).status || "included";
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-cream-200 bg-cream-50/50 text-xs"
                        >
                          <span className="font-medium text-charcoal-800">{itemName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                              itemStatus === "included"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : itemStatus === "optional"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {itemStatus}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-400 italic">No specific samagri items listed</span>
                )}
              </div>
            </div>
          </SectionCard>

          {/* 6. Frequently Asked Questions */}
          <SectionCard title="Frequently Asked Questions (FAQs)" icon={HelpCircle}>
            {Array.isArray(service.faqs) && service.faqs.length > 0 ? (
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-cream-50/60 border border-cream-200 space-y-1">
                    <p className="text-xs font-semibold text-charcoal-800">{faq.question}</p>
                    <p className="text-xs text-charcoal-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-charcoal-400 italic">No FAQs configured</span>
            )}
          </SectionCard>
        </div>

        {/* RIGHT COLUMN (1 COL) */}
        <div className="space-y-6">
          {/* Status & Overview */}
          <SectionCard title="Catalogue Status" icon={Shield}>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Public Visibility</span>
                <StatusBadge status={service.isActive ? "Active" : "Inactive"} />
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Catalogue Promotion</span>
                {service.isFeatured ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                  </span>
                ) : (
                  <span className="text-charcoal-500">Regular</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Kashi (Varanasi)</span>
                {service.isKashiAvailable ? (
                  <span className="inline-flex items-center gap-0.5 font-medium text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
                    <MapPin className="w-3 h-3 text-saffron-500" /> Available
                  </span>
                ) : (
                  <span className="text-charcoal-400">Not Available</span>
                )}
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-cream-100">
                <span className="text-charcoal-400">Remote Livestream</span>
                {service.isRemoteAvailable ? (
                  <span className="inline-flex items-center gap-0.5 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <Globe className="w-3 h-3 text-blue-500" /> Available
                  </span>
                ) : (
                  <span className="text-charcoal-400">Not Available</span>
                )}
              </div>

              {service.createdAt && (
                <div className="flex items-center justify-between py-1.5 border-b border-cream-100 text-[11px]">
                  <span className="text-charcoal-400">Created At</span>
                  <span className="text-charcoal-600">
                    {new Date(service.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {service.updatedAt && (
                <div className="flex items-center justify-between py-1.5 text-[11px]">
                  <span className="text-charcoal-400">Last Modified</span>
                  <span className="text-charcoal-600">
                    {new Date(service.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Vedic Scholar Hierarchy */}
          <SectionCard title="Vedic Scholar Hierarchy" icon={Users}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-cream-50 border border-cream-200">
                  <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">Min</span>
                  <span className="text-base font-bold text-charcoal-800">{service.minimumPandits || 2}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-saffron-50 border border-saffron-200">
                  <span className="text-[10px] uppercase font-semibold text-saffron-700 block">Rec</span>
                  <span className="text-base font-bold text-saffron-900">{service.recommendedPandits || 3}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-cream-50 border border-cream-200">
                  <span className="text-[10px] uppercase font-semibold text-charcoal-400 block">Max</span>
                  <span className="text-base font-bold text-charcoal-800">{service.maximumPandits || 11}</span>
                </div>
              </div>

              {service.requiredSkills && (
                <div className="pt-2 border-t border-cream-100">
                  <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                    Scholar Skill Requirements
                  </span>
                  <p className="text-xs text-charcoal-700">{service.requiredSkills}</p>
                </div>
              )}

              <p className="text-[11px] text-charcoal-400 italic">
                Note: Homa customer pricing carries ₹0 surcharge across scholar counts within range.
              </p>
            </div>
          </SectionCard>

          {/* Operational Details */}
          <SectionCard title="Operational Details" icon={Clock}>
            <InfoRow label="Daily Ceremony Hours" value={service.dailyHours || "3 – 4 Hours Daily"} />
            <InfoRow label="Capacity per Priest" value={service.havanCapacityPerPandit || "1 – 2 Havans Daily"} />
            <InfoRow
              label="Location Modes"
              value={
                Array.isArray(service.availableLocations) && service.availableLocations.length > 0
                  ? service.availableLocations.join(", ")
                  : "kashi, remote"
              }
            />
          </SectionCard>

          {/* Sankalpa Requirements */}
          <SectionCard title="Sankalpa Requirements" icon={Gift}>
            <div className="space-y-2">
              {[
                { label: "Gotra (Lineage)", key: "gotra" },
                { label: "Nakshatra (Birth Star)", key: "nakshatra" },
                { label: "Rashi (Moon Sign)", key: "rashi" },
                { label: "Ishta Devata (Deity)", key: "deity" },
                { label: "Special Wish / Sankalp", key: "specialInstructions" },
              ].map((f) => {
                const isReq =
                  service.sankalpaFields &&
                  (service.sankalpaFields as Record<string, boolean | undefined>)[f.key] !== false;
                return (
                  <div
                    key={f.key}
                    className="flex items-center justify-between p-2 rounded-lg border border-cream-100 text-xs"
                  >
                    <span className="text-charcoal-700 font-medium">{f.label}</span>
                    {isReq ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3 text-green-600" /> Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 bg-cream-50 px-2 py-0.5 rounded">
                        <CloseIcon className="w-3 h-3 text-charcoal-400" /> Optional
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Search Engine Optimization */}
          <SectionCard title="Search Engine Optimization" icon={Globe}>
            <InfoRow label="SEO Title" value={service.seo?.title || service.seo?.metaTitle} />
            <InfoRow label="Meta Description" value={service.seo?.description || service.seo?.metaDescription} />
            {seoKeywords && (
              <div className="pt-2 border-t border-cream-100">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1.5">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {seoKeywords.split(",").map((k, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-cream-100 text-charcoal-700 font-mono text-[11px]"
                    >
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Gallery Images */}
          <SectionCard title="Gallery Images" icon={ImageIcon}>
            {Array.isArray(service.galleryImages) && service.galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {service.galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Homa Gallery ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-cream-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs text-charcoal-400 italic">No gallery images uploaded</span>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Homa Service"
        message={`Are you sure you want to deactivate "${service.name}"? This will hide the Homa service from the public catalogue while preserving historical booking records.`}
        confirmText={toggling ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
