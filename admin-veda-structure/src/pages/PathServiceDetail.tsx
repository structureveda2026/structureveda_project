import React, { useEffect, useState } from "react";
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
  Scroll,
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
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import pathServiceCatalogueService, {
  AdminPathServiceDetail,
  PathSamagriItem,
  PATH_FORMAT_LABELS,
  PathFormatType,
} from "@/services/pathServiceCatalogueService";

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
      <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider w-48 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-charcoal-700 flex-1">{value}</span>
    </div>
  );
}

export default function PathServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState<AdminPathServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchService = () => {
    if (!id) {
      navigate("/admin/path-services");
      return;
    }
    setLoading(true);
    setError("");
    setIsAuthError(false);
    setIsNotFound(false);

    pathServiceCatalogueService
      .getPathService(id)
      .then((data) => setService(data))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unable to load Path service.";
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
      await pathServiceCatalogueService.updatePathService(id, { isActive: true });
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
      await pathServiceCatalogueService.deletePathService(id);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-saffron-500 animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading Path service details...</p>
      </div>
    );
  }

  if (isAuthError) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-charcoal-800 mb-1">Admin Access Required</h3>
        <p className="text-sm text-charcoal-500 mb-4">
          You do not have administrative privileges to view this Path service.
        </p>
        <Link to="/admin/login" className="btn-primary inline-flex items-center gap-2 text-sm">
          <LogIn className="w-4 h-4" /> Go to Login
        </Link>
      </div>
    );
  }

  if (isNotFound || !service) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <EmptyState
          title="Path Service Not Found"
          description="The requested Path recitation service does not exist or may have been permanently removed."
          action={
            <Link to="/admin/path-services" className="btn-primary text-sm inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Path Services
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/path-services"
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Back to Catalogue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-charcoal-900">{service.name}</h1>
              <StatusBadge status={service.isActive ? "active" : "inactive"} />
              {service.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-400 font-mono mt-0.5">/{service.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/path-services/${service.id}/edit`}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            Edit Service
          </Link>
          <button
            type="button"
            disabled={toggling}
            onClick={handleToggleStatus}
            className={`btn-secondary text-sm flex items-center gap-1.5 ${
              service.isActive ? "hover:text-red-600 hover:border-red-300" : "hover:text-green-600"
            }`}
          >
            <Power className="w-4 h-4" />
            {service.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
            Starting Price
          </span>
          <span className="text-2xl font-bold text-charcoal-900">
            {service.formattedPrice || `₹${Number(service.startingPrice).toLocaleString("en-IN")}`}
          </span>
          <span className="text-[10px] text-charcoal-400 block mt-0.5">Flat Seva Offering</span>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
            Duration Hierarchy
          </span>
          <span className="text-xl font-bold text-charcoal-800">
            {service.minimumDays === service.maximumDays
              ? `${service.minimumDays} Day`
              : `${service.minimumDays} – ${service.maximumDays} Days`}
          </span>
          <span className="text-[10px] text-charcoal-400 block mt-0.5">
            Recommended: {service.recommendedDays} Day(s)
          </span>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
            Vedic Scholars
          </span>
          <span className="text-xl font-bold text-charcoal-800">
            {service.minimumPandits === service.maximumPandits
              ? `${service.minimumPandits} Pandits`
              : `${service.minimumPandits} – ${service.maximumPandits} Pandits`}
          </span>
          <span className="text-[10px] text-charcoal-400 block mt-0.5">
            Recommended: {service.recommendedPandits} Pandits
          </span>
        </div>

        <div className="card p-4">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
            Arrangement Modes
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {service.isKashiAvailable && (
              <span className="text-xs px-2 py-0.5 rounded bg-saffron-50 text-saffron-700 font-medium">
                Kashi
              </span>
            )}
            {service.isRemoteAvailable && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                Remote
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 1. Basic Information */}
      <SectionCard title="Basic Information" icon={BookOpen}>
        <InfoRow label="Service Name" value={service.name} />
        <InfoRow label="Slug Identifier" value={<code className="font-mono text-xs">{service.slug}</code>} />
        <InfoRow label="Scripture / Sacred Text" value={service.scripture} />
        <InfoRow label="Classification" value={service.pathType || "Vedic Path"} />
        <InfoRow
          label="Created At"
          value={service.createdAt ? new Date(service.createdAt).toLocaleString("en-IN") : null}
        />
        <InfoRow
          label="Last Updated"
          value={service.updatedAt ? new Date(service.updatedAt).toLocaleString("en-IN") : null}
        />
      </SectionCard>

      {/* 2. Purpose & Summary */}
      <SectionCard title="Spiritual Purpose & Intention" icon={Tag}>
        <InfoRow label="Primary Purpose" value={service.purpose || service.purposeDetails?.name} />
        <InfoRow label="Purpose Summary" value={service.purposeSummary} />
        {service.purposeCategories && service.purposeCategories.length > 0 && (
          <InfoRow
            label="Purpose Tags"
            value={
              <div className="flex flex-wrap gap-1.5">
                {service.purposeCategories.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2 py-0.5 rounded-full bg-cream-100 text-charcoal-700 border border-cream-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            }
          />
        )}
      </SectionCard>

      {/* 3. Descriptions */}
      <SectionCard title="Descriptions" icon={Layers}>
        <InfoRow label="Short Description" value={service.shortDescription} />
        <InfoRow
          label="Full Description"
          value={
            service.description ? (
              <p className="whitespace-pre-line text-sm text-charcoal-700 leading-relaxed">
                {service.description}
              </p>
            ) : null
          }
        />
      </SectionCard>

      {/* 4. Recitation Configuration */}
      <SectionCard title="Recitation Configuration & Schedule" icon={Calendar}>
        <InfoRow
          label="Available Formats"
          value={
            <div className="flex flex-wrap gap-1.5">
              {service.availableFormats && service.availableFormats.length > 0 ? (
                service.availableFormats.map((f) => (
                  <span
                    key={f}
                    className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                  >
                    {PATH_FORMAT_LABELS[f as PathFormatType] || f}
                  </span>
                ))
              ) : (
                <span>Standard Recitation</span>
              )}
            </div>
          }
        />
        <InfoRow
          label="Duration Options"
          value={
            <div className="flex flex-wrap gap-1.5">
              {service.availableDurations && service.availableDurations.length > 0 ? (
                service.availableDurations.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-2.5 py-1 rounded-full bg-cream-100 text-charcoal-700 border border-cream-200"
                  >
                    {d}
                  </span>
                ))
              ) : (
                <span>Standard Duration</span>
              )}
            </div>
          }
        />
        <InfoRow label="Daily Recitation Hours" value={service.dailyHours} />
        <InfoRow label="Daily Recitation Target" value={service.dailyRecitationTarget} />
        <InfoRow label="Recitation Capacity" value={service.dailyRecitationCapacity} />
        <InfoRow
          label="Estimated Hours"
          value={
            service.estimatedRecitationHours ? `${service.estimatedRecitationHours} Hours` : null
          }
        />
      </SectionCard>

      {/* 5. Scripture Structure */}
      <SectionCard title="Scripture Structure & Scope" icon={Scroll}>
        <InfoRow label="Structure Summary" value={service.chapterStructure} />
        <InfoRow label="Total Chapters" value={service.totalChapters} />
        <InfoRow label="Total Sections / Sargas" value={service.totalSections} />
        <InfoRow label="Total Verses / Shlokas" value={service.totalVerses} />
      </SectionCard>

      {/* 6. Scholars & Skills */}
      <SectionCard title="Vedic Scholars Requirements" icon={Users}>
        <InfoRow
          label="Days Span"
          value={`${service.minimumDays} Min / ${service.recommendedDays} Recommended / ${service.maximumDays} Max Day(s)`}
        />
        <InfoRow
          label="Scholars Count"
          value={`${service.minimumPandits} Min / ${service.recommendedPandits} Recommended / ${service.maximumPandits} Max Pandits`}
        />
        <InfoRow label="Required Skills" value={service.requiredSkills} />
      </SectionCard>

      {/* 7. Pricing Safety */}
      <SectionCard title="Pricing Architecture" icon={DollarSign}>
        <InfoRow
          label="Starting Price"
          value={
            <span className="font-bold text-base text-charcoal-900">
              {service.formattedPrice || `₹${Number(service.startingPrice).toLocaleString("en-IN")}`}
            </span>
          }
        />
        <InfoRow
          label="Pricing Principle"
          value="Fixed seva offering with pure startingPrice. Pandit allocations carry zero surcharge in accordance with traditional recitation seva guidelines."
        />
      </SectionCard>

      {/* 8. Arrangement & Locations */}
      <SectionCard title="Arrangement & Holy Locations" icon={MapPin}>
        <InfoRow
          label="Kashi Available"
          value={service.isKashiAvailable ? "Yes — Holy Ganga Ghats / Ashrams in Kashi" : "No"}
        />
        <InfoRow
          label="Remote Available"
          value={service.isRemoteAvailable ? "Yes — Live Stream & Digital Sankalpa" : "No"}
        />
        <InfoRow
          label="Canonical Modes"
          value={
            <div className="flex gap-2">
              {service.availableLocations?.map((loc) => (
                <span
                  key={loc}
                  className="text-xs px-2 py-0.5 rounded bg-cream-100 text-charcoal-700 font-mono"
                >
                  {loc}
                </span>
              ))}
            </div>
          }
        />
      </SectionCard>

      {/* 9. Ritual Offerings & Prasad */}
      <SectionCard title="Ritual Inclusions & Offerings" icon={Package}>
        <InfoRow
          label="Samagri Items"
          value={
            service.samagri && service.samagri.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-700">
                {service.samagri.map((item, idx) => (
                  <li key={idx}>
                    {typeof item === "string" ? item : `${item.name} (${item.status || "included"})`}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-charcoal-400 italic">No specific samagri items specified.</span>
            )
          }
        />
        <InfoRow label="Consecrated Prasad" value={service.prasad} />
        <InfoRow
          label="Sankalpa Requirements"
          value={
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(service.sankalpaFields || {})
                .filter(([_, v]) => Boolean(v))
                .map(([k]) => (
                  <span
                    key={k}
                    className="text-xs px-2 py-0.5 rounded bg-cream-100 text-charcoal-600 font-medium capitalize"
                  >
                    {k}
                  </span>
                ))}
            </div>
          }
        />
      </SectionCard>

      {/* 10. Media Preview */}
      <SectionCard title="Media & Imagery" icon={ImageIcon}>
        {service.bannerImage ? (
          <div className="mb-4">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1.5">
              Banner Image
            </span>
            <div className="max-w-md aspect-video rounded-lg overflow-hidden border border-cream-200">
              <img
                src={service.bannerImage}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-charcoal-400 italic mb-4">No banner image uploaded.</p>
        )}

        <div>
          <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1.5">
            Gallery Photos
          </span>
          {service.galleryImages && service.galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {service.galleryImages.map((url, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-lg overflow-hidden border border-cream-200 bg-cream-50"
                >
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-400 italic">No gallery images uploaded.</p>
          )}
        </div>
      </SectionCard>

      {/* 11. SEO & FAQs */}
      <SectionCard title="SEO & Frequently Asked Questions" icon={HelpCircle}>
        <InfoRow label="Meta Title" value={service.seo?.title} />
        <InfoRow label="Meta Description" value={service.seo?.description} />
        <InfoRow
          label="Keywords"
          value={
            Array.isArray(service.seo?.keywords)
              ? service.seo?.keywords.join(", ")
              : service.seo?.keywords
          }
        />
        {service.faqs && service.faqs.length > 0 && (
          <div className="pt-3">
            <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
              FAQs ({service.faqs.length})
            </span>
            <div className="space-y-2">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-cream-100 bg-cream-50/50">
                  <p className="font-semibold text-xs text-charcoal-800 mb-1">Q: {faq.question}</p>
                  <p className="text-xs text-charcoal-600">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Confirm Deactivation Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        title="Deactivate Path Service?"
        message={`Are you sure you want to deactivate "${service.name}"? It will immediately be hidden from the public Path catalogue. Existing bookings remain intact.`}
        confirmText={toggling ? "Deactivating..." : "Deactivate Service"}
        cancelText="Cancel"
        danger={true}
        onConfirm={handleDeactivateConfirm}
        onClose={() => setDeactivateOpen(false)}
      />
    </div>
  );
}
