import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Edit,
  ArrowLeft,
  Power,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  DollarSign,
  BookOpen,
  HelpCircle,
  Layers,
  Star,
  Image as ImageIcon,
  ChevronRight,
  Hash,
  Globe,
  MapPin,
  Tag,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import japaServiceCatalogueService, {
  AdminJapaServiceDetail,
} from "@/services/japaServiceCatalogueService";

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
  let displayValue: React.ReactNode = value;
  if (typeof value === "object" && !React.isValidElement(value)) {
    displayValue =
      (value as any)?.name ||
      (value as any)?.label ||
      JSON.stringify(value);
  }
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-1.5 border-b border-cream-50 last:border-0">
      <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider w-44 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-charcoal-700 flex-1">{displayValue}</span>
    </div>
  );
}

function TagList({
  items,
  colorClass = "bg-cream-100 text-charcoal-700",
}: {
  items: any[];
  colorClass?: string;
}) {
  if (!items?.length)
    return (
      <span className="text-sm text-charcoal-400 italic">None specified</span>
    );
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, idx) => {
        const text =
          typeof item === "string"
            ? item
            : item?.name ||
              item?.item ||
              (typeof item === "object" ? JSON.stringify(item) : String(item));
        return (
          <span
            key={idx}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function JapaServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState<AdminJapaServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/admin/japa-services");
      return;
    }
    setLoading(true);
    japaServiceCatalogueService
      .getJapaService(id)
      .then((data) => setService(data))
      .catch((err: any) => {
        toast.error(err?.message || "Unable to load Japa service.");
        navigate("/admin/japa-services");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleStatus = async () => {
    if (!service || !id) return;
    if (service.isActive) {
      setDeactivateOpen(true);
      return;
    }
    setToggling(true);
    try {
      await japaServiceCatalogueService.updateJapaService(id, {
        isActive: true,
      });
      setService((prev) => (prev ? { ...prev, isActive: true } : prev));
      toast.success(`"${service.name}" activated.`);
    } catch (err: any) {
      toast.error(err?.message || "Unable to activate service.");
    } finally {
      setToggling(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!service || !id) return;
    setToggling(true);
    try {
      await japaServiceCatalogueService.deleteJapaService(id);
      setService((prev) => (prev ? { ...prev, isActive: false } : prev));
      toast.success(`"${service.name}" deactivated.`);
      setDeactivateOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Unable to deactivate service.");
    } finally {
      setToggling(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading Japa service...
        </p>
      </div>
    );

  if (!service) return null;

  const seoKeywords = Array.isArray(service.seo?.keywords)
    ? (service.seo.keywords as string[]).join(", ")
    : (service.seo?.keywords as string) || null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={service.name}
        subtitle={
          <span className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-charcoal-400">
              /{service.slug}
            </span>
            {service.isFeatured && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <StatusBadge status={service.isActive ? "Active" : "Inactive"} />
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/japa-services"
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`btn-secondary flex items-center gap-2 ${
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
              to={`/admin/japa-services/${id}/edit`}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Service
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-5">

          {/* Banner Image */}
          {service.bannerImage && (
            <div className="card overflow-hidden">
              <img
                src={service.bannerImage}
                alt={service.name}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Basic Information */}
          <SectionCard title="Basic Information" icon={Sparkles}>
            <InfoRow label="Name" value={service.name} />
            <InfoRow label="Mantra" value={service.mantra} />
            {service.mantraMeaning && (
              <div className="py-1.5 border-b border-cream-50">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                  Mantra Meaning
                </span>
                <p className="text-sm text-charcoal-700 whitespace-pre-wrap">
                  {service.mantraMeaning}
                </p>
              </div>
            )}
            {service.shortDescription && (
              <div className="py-1.5 border-b border-cream-50">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                  Short Description
                </span>
                <p className="text-sm text-charcoal-700">
                  {service.shortDescription}
                </p>
              </div>
            )}
            {service.description && (
              <div className="py-1.5">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                  Full Description
                </span>
                <p className="text-sm text-charcoal-700 whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}
          </SectionCard>

          {/* Purpose */}
          {(service.purpose || service.purposeSummary || service.purposeDetails) && (
            <SectionCard title="Purpose" icon={Star}>
              <InfoRow
                label="Purpose"
                value={service.purposeDetails?.name || service.purpose}
              />
              <InfoRow
                label="Purpose Summary"
                value={service.purposeSummary}
              />
              {service.purposeCategories?.length > 0 && (
                <div className="py-1.5">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                    Purpose Categories
                  </span>
                  <TagList
                    items={service.purposeCategories}
                    colorClass="bg-saffron-50 text-saffron-800 border border-saffron-200"
                  />
                </div>
              )}
            </SectionCard>
          )}

          {/* Pandit Configuration */}
          <SectionCard title="Pandit Configuration" icon={Users}>
            <InfoRow label="Minimum Pandits" value={service.minimumPandits} />
            <InfoRow
              label="Recommended Pandits"
              value={service.recommendedPandits}
            />
            <InfoRow label="Maximum Pandits" value={service.maximumPandits} />
            <InfoRow
              label="Daily Capacity / Pandit"
              value={
                service.dailyCapacityPerPandit
                  ? `${service.dailyCapacityPerPandit.toLocaleString(
                      "en-IN"
                    )} counts/day`
                  : null
              }
            />
            <InfoRow label="Daily Hours" value={service.dailyHours} />
            <InfoRow
              label="Completion Window"
              value={service.completionWindow}
            />
            <InfoRow label="Required Skills" value={service.requiredSkills} />
          </SectionCard>

          {/* Pricing & Count Variants */}
          <SectionCard title="Pricing & Count Variants" icon={DollarSign}>
            <InfoRow
              label="Starting Price"
              value={
                service.formattedPrice ||
                `\u20b9${service.startingPrice?.toLocaleString("en-IN")}`
              }
            />
            {Array.isArray(service.availableCounts) &&
              service.availableCounts.length > 0 && (
                <div className="py-1.5 border-b border-cream-50">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                    Available Counts
                  </span>
                  <TagList
                    items={service.availableCounts.map((c) =>
                      c.toLocaleString("en-IN")
                    )}
                    colorClass="bg-cream-100 text-charcoal-700 border border-cream-200"
                  />
                </div>
              )}

            {Array.isArray(service.variants) && service.variants.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">
                  Count Variants
                </span>
                <div className="overflow-x-auto overflow-hidden rounded-lg border border-cream-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase">
                        <th className="text-left px-4 py-2.5 font-semibold">Count</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Label</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Price (INR)</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Est. Duration</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Min Pandits</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Rec. Pandits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {service.variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-cream-25">
                          <td className="px-4 py-2.5 font-semibold text-charcoal-800">
                            {v.count.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-2.5 text-charcoal-600">
                            {v.label || "—"}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-charcoal-800">
                            {"\u20b9"}{Number(v.startingPrice).toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-2.5 text-charcoal-600">
                            {v.estimatedDuration || "—"}
                          </td>
                          <td className="px-4 py-2.5 text-charcoal-600">
                            {v.minimumPandits ?? "—"}
                          </td>
                          <td className="px-4 py-2.5 text-charcoal-600">
                            {v.recommendedPandits ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Samagri */}
          {Array.isArray(service.samagri) && service.samagri.length > 0 && (
            <SectionCard title="Samagri (Ritual Materials)" icon={Layers}>
              <TagList
                items={service.samagri}
                colorClass="bg-amber-50 text-amber-800 border border-amber-200"
              />
              {service.prasad && (
                <div className="mt-3">
                  <InfoRow label="Prasad" value={service.prasad} />
                </div>
              )}
            </SectionCard>
          )}

          {/* FAQs */}
          {Array.isArray(service.faqs) && service.faqs.length > 0 && (
            <SectionCard title="Frequently Asked Questions" icon={HelpCircle}>
              <div className="space-y-3 mt-1">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-cream-50 border border-cream-100"
                  >
                    <p className="text-sm font-semibold text-charcoal-800 mb-1">
                      Q: {faq.question}
                    </p>
                    <p className="text-sm text-charcoal-600">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Gallery */}
          {Array.isArray(service.galleryImages) &&
            service.galleryImages.length > 0 && (
              <SectionCard title="Gallery" icon={ImageIcon}>
                <div className="flex flex-wrap gap-3 mt-1">
                  {service.galleryImages.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        className="w-24 h-20 rounded-lg object-cover border border-cream-200 hover:opacity-90 transition"
                      />
                    </a>
                  ))}
                </div>
              </SectionCard>
            )}

          {/* SEO */}
          {service.seo && (
            <SectionCard title="SEO & Metadata" icon={Globe}>
              <InfoRow
                label="Meta Title"
                value={service.seo.metaTitle || service.seo.title}
              />
              <InfoRow
                label="Meta Description"
                value={service.seo.metaDescription || service.seo.description}
              />
              {seoKeywords && (
                <div className="py-1.5">
                  <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">
                    Keywords
                  </span>
                  <TagList
                    items={
                      Array.isArray(service.seo.keywords)
                        ? (service.seo.keywords as string[])
                        : [(service.seo.keywords as string)]
                    }
                    colorClass="bg-blue-50 text-blue-700 border border-blue-200"
                  />
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">

          {/* Status & Flags */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">
              Status & Visibility
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal-600">Active Status</span>
                <StatusBadge status={service.isActive ? "Active" : "Inactive"} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal-600">Featured</span>
                {service.isFeatured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                ) : (
                  <span className="text-xs text-charcoal-400">Regular</span>
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-saffron-600" /> Availability
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-charcoal-500">Kashi / In-Person</span>
                <span
                  className={`text-xs font-medium ${
                    service.isKashiAvailable ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {service.isKashiAvailable ? "\u2713 Available" : "\u2715 Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-charcoal-500">Remote Participation</span>
                <span
                  className={`text-xs font-medium ${
                    service.isRemoteAvailable ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {service.isRemoteAvailable ? "\u2713 Available" : "\u2715 Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Starting Price</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {service.formattedPrice ||
                    `\u20b9${service.startingPrice?.toLocaleString("en-IN")}`}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Variants</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {Array.isArray(service.variants) ? service.variants.length : 0}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Min Pandits</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {service.minimumPandits ?? "—"}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Daily Cap/Pandit</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {service.dailyCapacityPerPandit?.toLocaleString("en-IN") ?? "—"}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">FAQs</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {Array.isArray(service.faqs) ? service.faqs.length : 0}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Gallery</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {Array.isArray(service.galleryImages)
                    ? service.galleryImages.length
                    : 0}{" "}
                  imgs
                </p>
              </div>
            </div>
          </div>

          {/* Purpose Details */}
          {service.purposeDetails && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-saffron-600" /> Purpose Details
              </h3>
              <InfoRow label="Name" value={service.purposeDetails.name} />
              <InfoRow
                label="Description"
                value={service.purposeDetails.description}
              />
              <InfoRow label="Icon" value={service.purposeDetails.iconName} />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-charcoal-500">Purpose Active</span>
                <span
                  className={`text-xs font-medium ${
                    service.purposeDetails.isActive
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {service.purposeDetails.isActive ? "\u2713 Active" : "\u2715 Inactive"}
                </span>
              </div>
            </div>
          )}

          {/* Record Info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">
              Record Info
            </h3>
            <InfoRow
              label="Service ID"
              value={
                <span className="font-mono text-xs break-all">{service.id}</span>
              }
            />
            <InfoRow
              label="Slug"
              value={
                <span className="font-mono text-xs">{service.slug}</span>
              }
            />
            {service.createdAt && (
              <InfoRow
                label="Created"
                value={new Date(service.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            )}
            {service.updatedAt && (
              <InfoRow
                label="Updated"
                value={new Date(service.updatedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            )}
          </div>

          {/* Actions */}
          <div className="card p-5 space-y-2">
            <Link
              to={`/admin/japa-services/${id}/edit`}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Japa Service
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`w-full btn-secondary flex items-center justify-center gap-2 ${
                service.isActive ? "text-red-600" : "text-green-600"
              }`}
            >
              <Power className="w-4 h-4" />
              {toggling
                ? "Saving..."
                : service.isActive
                ? "Deactivate Service"
                : "Activate Service"}
            </button>
            <Link
              to="/admin/japa-services"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Deactivate Confirm */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Japa Service"
        message={`Are you sure you want to deactivate "${service.name}"? It will be hidden from the public catalogue while preserving all data.`}
        confirmText={toggling ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
