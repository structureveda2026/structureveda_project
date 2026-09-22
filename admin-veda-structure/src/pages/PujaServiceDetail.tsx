import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Power,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  HelpCircle,
  Layers,
  Flame,
  FileText,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import pujaServiceCatalogueService, {
  AdminPujaServiceDetail,
} from "@/services/pujaServiceCatalogueService";

export default function PujaServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [service, setService] = useState<AdminPujaServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await pujaServiceCatalogueService.getPujaService(id);
        setService(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load Puja service details.");
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const handleDeactivate = async () => {
    if (!service) return;
    setDeactivating(true);
    try {
      await pujaServiceCatalogueService.deletePujaService(service.id);
      toast.success(`"${service.name}" deactivated successfully.`);
      setDeactivateOpen(false);
      // Reload service
      const updated = await pujaServiceCatalogueService.getPujaService(service.id);
      setService(updated);
    } catch (err: any) {
      toast.error(err?.message || "Unable to deactivate Puja service.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleReactivate = async () => {
    if (!service) return;
    try {
      await pujaServiceCatalogueService.updatePujaService(service.id, { isActive: true });
      toast.success(`"${service.name}" reactivated successfully.`);
      const updated = await pujaServiceCatalogueService.getPujaService(service.id);
      setService(updated);
    } catch (err: any) {
      toast.error(err?.message || "Unable to reactivate Puja service.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading Puja service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <EmptyState
        title="Puja Service not found"
        message={error || "The requested service record does not exist or has been removed."}
        action={
          <Link to="/admin/puja-services" className="btn-secondary">
            Back to Catalogue
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/puja-services"
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Back to Catalogue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-charcoal-800">{service.name}</h1>
              <StatusBadge status={service.isActive ? "Active" : "Inactive"} />
              {service.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-charcoal-400 mt-1">/{service.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/puja-services/${service.id}/edit`}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Service
          </Link>

          {service.isActive ? (
            <button
              onClick={() => setDeactivateOpen(true)}
              className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
            >
              <Power className="w-4 h-4" />
              Deactivate
            </button>
          ) : (
            <button
              onClick={handleReactivate}
              className="btn-secondary text-green-600 hover:bg-green-50 flex items-center gap-2 text-sm"
            >
              <Power className="w-4 h-4" />
              Reactivate
            </button>
          )}
        </div>
      </div>

      {/* Grid: Main Info + Side Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner & Eyebrow */}
          <div className="card overflow-hidden">
            {service.bannerImage ? (
              <div className="h-64 w-full overflow-hidden bg-charcoal-900 relative">
                <img
                  src={service.bannerImage}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                  <div>
                    {service.eyebrow && (
                      <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                        {service.eyebrow}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-white mt-1">{service.name}</h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-cream-50 text-center">
                <p className="text-sm text-charcoal-400">No banner image uploaded</p>
              </div>
            )}

            <div className="p-5 space-y-4">
              {service.tagline && (
                <p className="text-sm font-medium text-saffron-800 bg-saffron-50/70 p-3 rounded-lg border border-saffron-100">
                  {service.tagline}
                </p>
              )}

              {service.purposeSummary && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal-400 tracking-wider mb-1">
                    Purpose Summary
                  </h4>
                  <p className="text-sm text-charcoal-700 leading-relaxed">{service.purposeSummary}</p>
                </div>
              )}

              {service.shortDescription && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal-400 tracking-wider mb-1">
                    Short Overview
                  </h4>
                  <p className="text-sm text-charcoal-600 leading-relaxed">{service.shortDescription}</p>
                </div>
              )}

              {service.fullDescription && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal-400 tracking-wider mb-1">
                    Full Ceremony Narrative
                  </h4>
                  <p className="text-sm text-charcoal-600 whitespace-pre-line leading-relaxed">
                    {service.fullDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Procedure Steps */}
          {service.procedureSteps && service.procedureSteps.length > 0 && (
            <div className="card p-5">
              <h3 className="text-base font-semibold text-charcoal-800 mb-3 pb-2 border-b border-cream-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-saffron-600" />
                Ritual Procedure Steps
              </h3>
              <ol className="space-y-2.5">
                {service.procedureSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-700">
                    <span className="w-6 h-6 rounded-full bg-saffron-50 text-saffron-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* What's Included */}
          {service.whatsIncluded && service.whatsIncluded.length > 0 && (
            <div className="card p-5">
              <h3 className="text-base font-semibold text-charcoal-800 mb-3 pb-2 border-b border-cream-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                What's Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.whatsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-charcoal-700 bg-cream-50 px-3 py-2 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {service.galleryImages && service.galleryImages.length > 0 && (
            <div className="card p-5">
              <h3 className="text-base font-semibold text-charcoal-800 mb-3 pb-2 border-b border-cream-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-saffron-600" />
                Gallery Visuals ({service.galleryImages.length})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {service.galleryImages.map((img, idx) => (
                  <div key={idx} className="h-28 rounded-lg overflow-hidden border border-cream-200 bg-cream-50">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="card p-5">
              <h3 className="text-base font-semibold text-charcoal-800 mb-3 pb-2 border-b border-cream-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-saffron-600" />
                Frequently Asked Questions ({service.faqs.length})
              </h3>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-cream-200 bg-cream-50/50 space-y-1">
                    <p className="text-sm font-semibold text-charcoal-800">Q: {faq.q}</p>
                    <p className="text-sm text-charcoal-600">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Meta & Parameters */}
        <div className="space-y-6">
          {/* Key Parameters Card */}
          <div className="card p-5 space-y-4">
            <h3 className="text-base font-semibold text-charcoal-800 pb-2 border-b border-cream-100">
              Pricing & Configuration
            </h3>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Starting Price</span>
              <p className="text-2xl font-bold text-charcoal-800 mt-0.5">{service.formattedPrice}</p>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Presiding Deity</span>
              <p className="text-sm font-semibold text-charcoal-800 mt-0.5">{service.deity}</p>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Puja Purpose</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 mt-1">
                {service.purpose?.name || "Vedic Ritual"}
              </span>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Available Mode</span>
              <span className="text-sm font-medium text-charcoal-700 capitalize mt-0.5 block">
                {service.availableMode === "hybrid"
                  ? "Hybrid (In-Person & Remote)"
                  : service.availableMode === "in_person"
                  ? "In-Person Only"
                  : "Remote Only"}
              </span>
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Estimated Duration</span>
              <p className="text-sm text-charcoal-700 mt-0.5">{service.duration || "Custom / Flexible"}</p>
              {service.durationHours && service.durationHours.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  {service.durationHours.map((hr) => (
                    <span key={hr} className="text-xs px-2 py-0.5 bg-cream-100 rounded text-charcoal-600 font-mono">
                      {hr}h
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="text-xs text-charcoal-400 block uppercase font-bold tracking-wider">Location & Temple</span>
              <p className="text-sm text-charcoal-700 mt-0.5">{service.location || "Temple / Ashram"}</p>
              <span className="text-xs text-charcoal-400 capitalize">Type: {service.locationType}</span>
            </div>

            <div className="pt-2 border-t border-cream-100 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-charcoal-500">
                <span>Kashi Available:</span>
                <span className="font-semibold text-charcoal-800">{service.isKashiAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-500">
                <span>Featured in Public:</span>
                <span className="font-semibold text-charcoal-800">{service.isFeatured ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between text-charcoal-500">
                <span>Catalogue Status:</span>
                <span className={`font-semibold ${service.isActive ? "text-green-600" : "text-charcoal-500"}`}>
                  {service.isActive ? "Active (Public)" : "Inactive (Hidden)"}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Trail Card */}
          <div className="card p-4 space-y-2 text-xs text-charcoal-400">
            <h4 className="font-bold text-charcoal-600 uppercase tracking-wider mb-2">Audit Metadata</h4>
            <div>
              <span className="block font-medium text-charcoal-500">Service UUID:</span>
              <span className="font-mono break-all">{service.id}</span>
            </div>
            <div>
              <span className="block font-medium text-charcoal-500">Created:</span>
              <span>{new Date(service.createdAt).toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="block font-medium text-charcoal-500">Last Updated:</span>
              <span>{new Date(service.updatedAt).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Deactivate Dialog */}
      <ConfirmDialog
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Puja Service"
        message={`Are you sure you want to deactivate "${service.name}"? It will be hidden from the public catalogue while retaining all historical records.`}
        confirmText={deactivating ? "Deactivating..." : "Deactivate Service"}
        danger
      />
    </div>
  );
}
