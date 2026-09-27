import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Edit, ArrowLeft, Power, Sparkles, Clock, Users, MapPin,
  CheckCircle2, DollarSign, Calendar, BookOpen, HelpCircle,
  Flame, Layers, Star, Image as ImageIcon, ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import yagyaServiceCatalogueService, {
  AdminYagyaServiceDetail,
} from "@/services/yagyaServiceCatalogueService";

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
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

function InfoRow({ label, value }: { label: string; value?: string | number | null | React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  let displayValue: React.ReactNode = value;
  if (typeof value === "object" && !React.isValidElement(value)) {
    displayValue = (value as any)?.name || (value as any)?.label || JSON.stringify(value);
  }
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 py-1.5 border-b border-cream-50 last:border-0">
      <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-charcoal-700 flex-1">{displayValue}</span>
    </div>
  );
}

function TagList({ items, colorClass = "bg-cream-100 text-charcoal-700" }: { items: any[]; colorClass?: string }) {
  if (!items?.length) return <span className="text-sm text-charcoal-400 italic">None specified</span>;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map((item, idx) => {
        const text = typeof item === "string" ? item : item?.name || item?.item || (typeof item === "object" ? JSON.stringify(item) : String(item));
        const status = typeof item === "object" && item?.status && item.status !== "included" ? ` (${item.status})` : "";
        return (
          <span key={idx} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {text}{status}
          </span>
        );
      })}
    </div>
  );
}

function NumberedList({ items }: { items: any[] }) {
  if (!items?.length) return <span className="text-sm text-charcoal-400 italic">None specified</span>;
  return (
    <ol className="space-y-2.5 mt-1">
      {items.map((item, idx) => {
        if (typeof item === "object" && item !== null) {
          const stepNumber = item.step || item.stepNumber || idx + 1;
          return (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-charcoal-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {stepNumber}
              </span>
              <div className="flex-1">
                {item.title && <p className="font-semibold text-charcoal-800 mb-0.5">{item.title}</p>}
                {item.description && <p className="text-xs text-charcoal-600">{item.description}</p>}
              </div>
            </li>
          );
        }
        return (
          <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-700">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs font-bold flex items-center justify-center mt-0.5">
              {idx + 1}
            </span>
            <span>{String(item)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BulletList({ items }: { items: any[] }) {
  if (!items?.length) return <span className="text-sm text-charcoal-400 italic">None specified</span>;
  return (
    <ul className="space-y-2 mt-1">
      {items.map((item, idx) => {
        if (typeof item === "object" && item !== null) {
          return (
            <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-700">
              <ChevronRight className="w-4 h-4 text-saffron-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {item.title && <span className="font-semibold text-charcoal-800">{item.title}: </span>}
                <span className="text-charcoal-600">{item.description || item.text || (typeof item.title === "undefined" ? JSON.stringify(item) : "")}</span>
              </div>
            </li>
          );
        }
        return (
          <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-700">
            <ChevronRight className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0 mt-0.5" />
            <span>{String(item)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function YagyaServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState<AdminYagyaServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!id) { navigate("/admin/yagya-services"); return; }
    setLoading(true);
    yagyaServiceCatalogueService.getYagyaService(id)
      .then((data) => setService(data))
      .catch((err: any) => {
        toast.error(err?.message || "Unable to load Yagya service.");
        navigate("/admin/yagya-services");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleStatus = async () => {
    if (!service || !id) return;
    if (service.isActive) { setDeactivateOpen(true); return; }
    setToggling(true);
    try {
      await yagyaServiceCatalogueService.updateYagyaService(id, { isActive: true });
      setService((prev) => prev ? { ...prev, isActive: true } : prev);
      toast.success(`"${service.name}" activated.`);
    } catch (err: any) {
      toast.error(err?.message || "Unable to activate service.");
    } finally { setToggling(false); }
  };

  const handleDeactivateConfirm = async () => {
    if (!service || !id) return;
    setToggling(true);
    try {
      await yagyaServiceCatalogueService.deleteYagyaService(id);
      setService((prev) => prev ? { ...prev, isActive: false } : prev);
      toast.success(`"${service.name}" deactivated.`);
      setDeactivateOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Unable to deactivate service.");
    } finally { setToggling(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium text-charcoal-500">Loading Yagya service...</p>
    </div>
  );

  if (!service) return null;

  const req = service.panditRequirement || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={service.name}
        subtitle={
          <span className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-charcoal-400">/{service.slug}</span>
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
            <Link to="/admin/yagya-services" className="btn-secondary flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`btn-secondary flex items-center gap-2 ${service.isActive ? "text-red-600 hover:border-red-300" : "text-green-600 hover:border-green-300"}`}
            >
              <Power className="w-4 h-4" />
              {toggling ? "Saving..." : service.isActive ? "Deactivate" : "Activate"}
            </button>
            <Link to={`/admin/yagya-services/${id}/edit`} className="btn-primary flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit Service
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column: main content */}
        <div className="xl:col-span-2 space-y-5">

          {/* Banner Image */}
          {service.bannerImage && (
            <div className="card overflow-hidden">
              <img src={service.bannerImage} alt={service.name}
                className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Basic Information */}
          <SectionCard title="Basic Information" icon={Flame}>
            <InfoRow label="Name" value={service.name} />
            <InfoRow label="Deity" value={service.deity} />
            <InfoRow label="Eyebrow" value={service.eyebrow} />
            <InfoRow label="Tagline" value={service.tagline} />
            {service.shortDescription && (
              <div className="py-1.5 border-b border-cream-50">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">Short Description</span>
                <p className="text-sm text-charcoal-700">{service.shortDescription}</p>
              </div>
            )}
            {service.fullDescription && (
              <div className="py-1.5">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">Full Description</span>
                <p className="text-sm text-charcoal-700 whitespace-pre-wrap">{service.fullDescription}</p>
              </div>
            )}
          </SectionCard>

          {/* Purpose */}
          <SectionCard title="Purpose" icon={Star}>
            <InfoRow label="Purpose" value={service.purpose || (service.purposeDetails?.name)} />
            <InfoRow label="Purpose Summary" value={service.purposeSummary} />
          </SectionCard>

          {/* Duration */}
          <SectionCard title="Duration & Ritual Configuration" icon={Clock}>
            <InfoRow label="Available Durations"
              value={Array.isArray(service.availableDurations) && service.availableDurations.length > 0
                ? service.availableDurations.join(", ") + " Days"
                : "�"} />
            <InfoRow label="Duration Display" value={service.durationDisplay} />
            <InfoRow label="Daily Ritual Hours" value={service.dailyRitualHours ? `${service.dailyRitualHours} hours` : null} />
            <InfoRow label="Daily Hours Display" value={service.dailyHoursDisplay} />
          </SectionCard>

          {/* Pandit Requirement */}
          <SectionCard title="Pandit Requirement" icon={Users}>
            <InfoRow label="Minimum Pandits" value={(req as any).minPandits} />
            <InfoRow label="Senior Pandits" value={(req as any).seniorPandits} />
            <InfoRow label="Description" value={(req as any).description} />
          </SectionCard>

          {/* Pricing */}
          <SectionCard title="Pricing" icon={DollarSign}>
            <InfoRow label="Starting Price" value={service.formattedPrice || `₹${service.startingPrice?.toLocaleString("en-IN")}`} />
            {Array.isArray(service.pricingTiers) && service.pricingTiers.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-2">Pricing Tiers</span>
                <div className="overflow-hidden rounded-lg border border-cream-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase">
                        <th className="text-left px-4 py-2.5 font-semibold">Label</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Days</th>
                        <th className="text-left px-4 py-2.5 font-semibold">Price (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {service.pricingTiers.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-cream-25">
                          <td className="px-4 py-2.5 font-medium text-charcoal-700">{tier.label || "�"}</td>
                          <td className="px-4 py-2.5 text-charcoal-600">{tier.days} Days</td>
                          <td className="px-4 py-2.5 font-semibold text-charcoal-800">₹{Number(tier.price).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Daily Schedule */}
          {Array.isArray(service.dailySchedule) && service.dailySchedule.length > 0 && (
            <SectionCard title="Daily Schedule" icon={Calendar}>
              <div className="space-y-2.5 mt-1">
                {service.dailySchedule.map((slot: any, idx: number) => {
                  const dayBadge = slot.time || (slot.day ? `Day ${slot.day}` : `Day ${idx + 1}`);
                  const title = slot.title;
                  const text = slot.activity || slot.details || "";
                  return (
                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-cream-50 last:border-0">
                      <span className="text-xs font-semibold text-saffron-700 bg-saffron-50 border border-saffron-200 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                        {dayBadge}
                      </span>
                      <div className="flex-1">
                        {title && <p className="text-sm font-semibold text-charcoal-800 mb-0.5">{title}</p>}
                        {text && <p className="text-sm text-charcoal-600">{text}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Samagri */}
          {Array.isArray(service.samagri) && service.samagri.length > 0 && (
            <SectionCard title="Samagri (Ritual Materials)" icon={Layers}>
              <TagList items={service.samagri as string[]} colorClass="bg-amber-50 text-amber-800 border border-amber-200" />
              {service.prasad && (
                <div className="mt-3">
                  <InfoRow label="Prasad" value={service.prasad} />
                </div>
              )}
            </SectionCard>
          )}

          {/* Service Content */}
          <SectionCard title="Service Content" icon={BookOpen}>
            {Array.isArray(service.whatsIncluded) && service.whatsIncluded.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">What's Included</span>
                <BulletList items={service.whatsIncluded} />
              </div>
            )}
            {Array.isArray(service.procedureSteps) && service.procedureSteps.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">Ritual Procedure</span>
                <NumberedList items={service.procedureSteps} />
              </div>
            )}
            {Array.isArray(service.whyPerform) && service.whyPerform.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">Why Perform</span>
                <BulletList items={service.whyPerform} />
              </div>
            )}
            {Array.isArray(service.significance) && service.significance.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider block mb-1">Scriptural Significance</span>
                <BulletList items={service.significance} />
              </div>
            )}
          </SectionCard>

          {/* FAQs */}
          {Array.isArray(service.faqs) && service.faqs.length > 0 && (
            <SectionCard title="Frequently Asked Questions" icon={HelpCircle}>
              <div className="space-y-3 mt-1">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-cream-50 border border-cream-100">
                    <p className="text-sm font-semibold text-charcoal-800 mb-1">Q: {faq.question}</p>
                    <p className="text-sm text-charcoal-600">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Gallery */}
          {Array.isArray(service.galleryImages) && service.galleryImages.length > 0 && (
            <SectionCard title="Gallery" icon={ImageIcon}>
              <div className="flex flex-wrap gap-3 mt-1">
                {service.galleryImages.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Gallery ${idx + 1}`}
                      className="w-24 h-20 rounded-lg object-cover border border-cream-200 hover:opacity-90 transition" />
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-5">

          {/* Status & Flags */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">Status & Visibility</h3>
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

          {/* Location & Mode */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-saffron-600" /> Location & Mode
            </h3>
            <div className="space-y-2">
              <InfoRow label="Mode"
                value={service.availableMode === "hybrid" ? "Hybrid" : service.availableMode === "in_person" ? "In-Person" : "Remote"} />
              <InfoRow label="Location Type" value={service.locationType} />
              <InfoRow label="Location" value={service.location} />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-charcoal-500">Kashi Venue</span>
                <span className={`text-xs font-medium ${service.isKashiAvailable ? "text-green-600" : "text-red-500"}`}>
                  {service.isKashiAvailable ? "✓ Available" : "✕ Not Available"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal-500">Remote Participation</span>
                <span className={`text-xs font-medium ${service.isRemoteAvailable ? "text-green-600" : "text-red-500"}`}>
                  {service.isRemoteAvailable ? "✓ Available" : "✕ Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Starting Price</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {service.formattedPrice || `₹${service.startingPrice?.toLocaleString("en-IN")}`}
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Daily Hours</p>
                <p className="text-sm font-bold text-charcoal-800">{service.dailyRitualHours || "�"}h</p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Durations</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {Array.isArray(service.availableDurations) ? service.availableDurations.length : 0} options
                </p>
              </div>
              <div className="bg-cream-50 rounded-lg p-3 text-center">
                <p className="text-xs text-charcoal-400 mb-1">Pricing Tiers</p>
                <p className="text-sm font-bold text-charcoal-800">
                  {Array.isArray(service.pricingTiers) ? service.pricingTiers.length : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-3">Record Info</h3>
            <InfoRow label="Service ID" value={<span className="font-mono text-xs break-all">{service.id}</span>} />
            <InfoRow label="Slug" value={<span className="font-mono text-xs">{service.slug}</span>} />
            {service.createdAt && (
              <InfoRow label="Created" value={new Date(service.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
            )}
            {service.updatedAt && (
              <InfoRow label="Updated" value={new Date(service.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
            )}
          </div>

          {/* Actions */}
          <div className="card p-5 space-y-2">
            <Link to={`/admin/yagya-services/${id}/edit`} className="btn-primary w-full flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" /> Edit Yagya Service
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`w-full btn-secondary flex items-center justify-center gap-2 ${service.isActive ? "text-red-600" : "text-green-600"}`}
            >
              <Power className="w-4 h-4" />
              {toggling ? "Saving..." : service.isActive ? "Deactivate Service" : "Activate Service"}
            </button>
            <Link to="/admin/yagya-services" className="btn-secondary w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Deactivate dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Yagya Service"
        message={`Are you sure you want to deactivate "${service.name}"? It will be hidden from the public catalogue while preserving all data.`}
        confirmText={toggling ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
