import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Package as PackageIcon,
  Check,
  Share2,
  Layers,
  FileText,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import upcomingPujaService, {
  UpcomingPujaData,
} from "@/services/upcomingPujaService";

export default function UpcomingPujaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [puja, setPuja] = useState<UpcomingPujaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await upcomingPujaService.getUpcomingPuja(id);
        setPuja(data);
      } catch (err) {
        setError(
          (err as Error).message || "Unable to load Upcoming Puja details.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!puja) return;
    setDeleting(true);
    setError("");
    try {
      await upcomingPujaService.deleteUpcomingPuja(puja.id);
      navigate("/admin/upcoming-pujas");
    } catch (err) {
      setError(
        (err as Error).message ||
          "Cannot delete this Puja. If devotee bookings already exist, deletion is restricted.",
      );
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-charcoal-500">Loading ceremony details...</p>
      </div>
    );
  }

  if (!puja) {
    return (
      <EmptyState
        title="Upcoming Puja not found"
        message={error || "The requested ceremony record does not exist or has been removed."}
        action={
          <Link to="/admin/upcoming-pujas" className="btn-secondary">
            Back to Upcoming Pujas
          </Link>
        }
      />
    );
  }

  const capacity = puja.totalCapacity || 1;
  const booked = puja.bookedCount || 0;
  const percent = Math.min(100, Math.round((booked / capacity) * 100));

  const ceremonyDateFormatted = new Date(puja.ceremonyDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const startTimeFormatted = new Date(puja.startDateTime).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );

  const bookingCloseFormatted = puja.bookingCloseAt
    ? new Date(puja.bookingCloseAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Until Ceremony Start";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/admin/upcoming-pujas"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Upcoming Pujas
        </Link>
      </div>

      {/* Header & Actions */}
      <PageHeader
        title={puja.name}
        subtitle={puja.tagline || `Ceremony on ${ceremonyDateFormatted}`}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to={`/admin/upcoming-pujas/${puja.id}/edit`}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" /> Edit Puja
            </Link>
            <button
              onClick={() => setDeleteOpen(true)}
              className="btn-danger flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete Puja
            </button>
          </div>
        }
      />

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Operation Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {puja.bannerImage ? (
            <img
              src={puja.bannerImage}
              alt={puja.name}
              className="w-full lg:w-72 h-48 object-cover rounded-xl border border-cream-200 flex-shrink-0"
            />
          ) : (
            <div className="w-full lg:w-72 h-48 rounded-xl bg-saffron-50 border border-saffron-100 flex flex-col items-center justify-center text-saffron-700 font-serif text-lg font-bold flex-shrink-0">
              <Sparkles className="w-8 h-8 mb-2 opacity-60" />
              <span>Veda Structure</span>
              <span className="text-xs font-sans font-normal text-saffron-600 mt-1">Sacred Ceremony</span>
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={puja.status} />
              {puja.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Featured Ceremony
                </span>
              )}
              {puja.eyebrow && (
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200">
                  {puja.eyebrow}
                </span>
              )}
              <span className="text-xs font-mono text-charcoal-400 bg-cream-100 px-2.5 py-1 rounded-full">
                slug: /{puja.slug}
              </span>
            </div>

            <p className="text-sm text-charcoal-600 leading-relaxed">
              {puja.shortDescription || "No short description provided for this ceremony."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div>
                <span className="text-charcoal-400 block font-medium">Category</span>
                <span className="font-semibold text-charcoal-800">{puja.category || "—"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Occasion</span>
                <span className="font-semibold text-charcoal-800">{puja.occasion || "—"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Temple / Ghat</span>
                <span className="font-semibold text-charcoal-800">{puja.temple || "—"}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Location</span>
                <span className="font-semibold text-charcoal-800">{puja.location || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capacity vs Booked */}
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-medium uppercase tracking-wider">
            <span>Quota & Bookings</span>
            <Users className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-charcoal-900">{booked}</span>
            <span className="text-sm text-charcoal-400">/ {capacity} booked</span>
          </div>
          <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-saffron-500"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[11px] text-charcoal-500 flex justify-between pt-0.5">
            <span>{percent}% allocated</span>
            <span>{capacity - booked} slots left</span>
          </div>
        </div>

        {/* Ceremony Date */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-medium uppercase tracking-wider">
            <span>Ceremony Date</span>
            <Calendar className="w-4 h-4 text-charcoal-500" />
          </div>
          <p className="text-base font-bold text-charcoal-900 pt-1">{ceremonyDateFormatted}</p>
          <p className="text-xs text-charcoal-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Start: {startTimeFormatted}
          </p>
        </div>

        {/* Booking Cutoff */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-medium uppercase tracking-wider">
            <span>Booking Cutoff</span>
            <Clock className="w-4 h-4 text-charcoal-500" />
          </div>
          <p className="text-sm font-bold text-charcoal-800 pt-1">{bookingCloseFormatted}</p>
          <p className="text-xs text-charcoal-400">Slots close automatically</p>
        </div>

        {/* Packages Available */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-medium uppercase tracking-wider">
            <span>Packages</span>
            <PackageIcon className="w-4 h-4 text-charcoal-500" />
          </div>
          <p className="text-3xl font-bold text-charcoal-900 pt-1">
            {puja.packages?.length || 0}
          </p>
          <p className="text-xs text-charcoal-400">Configured booking tiers</p>
        </div>
      </div>

      {/* Packages Section */}
      <div className="card p-6 space-y-4">
        <div className="border-b border-cream-200 pb-3">
          <h3 className="text-base font-bold text-charcoal-800">
            Configured Devotee Packages
          </h3>
          <p className="text-xs text-charcoal-400 mt-0.5">
            Booking tiers available for devotees to register names and gotras.
          </p>
        </div>

        {!puja.packages || puja.packages.length === 0 ? (
          <p className="text-sm text-charcoal-400 italic">No packages configured for this ceremony.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {puja.packages.map((pkg, idx) => (
              <div
                key={pkg.id || idx}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  pkg.isDefault
                    ? "border-saffron-400 bg-saffron-50/20 shadow-sm"
                    : "border-cream-200 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-charcoal-800 text-base">{pkg.name}</span>
                    {pkg.isDefault && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-100 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-bold text-saffron-700 mb-2">
                    ₹{Number(pkg.price).toLocaleString("en-IN")}
                  </div>

                  <div className="text-xs text-charcoal-600 mb-3 inline-flex items-center gap-1.5 bg-cream-100 px-2.5 py-1 rounded-md">
                    <Users className="w-3.5 h-3.5 text-charcoal-500" />
                    <span>Max Devotees: <strong>{pkg.maxDevotees}</strong></span>
                  </div>

                  {pkg.description && (
                    <p className="text-xs text-charcoal-500 mb-4">{pkg.description}</p>
                  )}

                  {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-charcoal-700 border-t border-cream-100 pt-3">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Description & Ritual Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Description Card */}
        <div className="card p-6 space-y-3">
          <h3 className="text-base font-bold text-charcoal-800 border-b border-cream-200 pb-2">
            Ceremony Narrative & Background
          </h3>
          <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">
            {puja.fullDescription || "No detailed narrative provided."}
          </p>
        </div>

        {/* Benefits & Significance Card */}
        <div className="card p-6 space-y-5">
          <h3 className="text-base font-bold text-charcoal-800 border-b border-cream-200 pb-2">
            Spiritual Benefits & Significance
          </h3>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">
              Key Benefits
            </h4>
            {Array.isArray(puja.benefits) && puja.benefits.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-charcoal-700">
                {puja.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 flex-shrink-0 mt-1.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-charcoal-400 italic">None listed.</p>
            )}
          </div>

          <div className="border-t border-cream-100 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">
              Sacred Significance
            </h4>
            {Array.isArray(puja.significance) && puja.significance.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-charcoal-700">
                {puja.significance.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-charcoal-400 italic">None listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Procedure Steps & Inclusions */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-charcoal-800 border-b border-cream-200 pb-2">
          Ritual Inclusions & Procedure Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">
              What's Included
            </h4>
            {Array.isArray(puja.whatsIncluded) && puja.whatsIncluded.length > 0 ? (
              <ul className="space-y-2 text-xs text-charcoal-700">
                {puja.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-charcoal-400 italic">No inclusions listed.</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2">
              Procedure Steps
            </h4>
            {Array.isArray(puja.procedureSteps) && puja.procedureSteps.length > 0 ? (
              <ol className="space-y-2 text-xs text-charcoal-700">
                {puja.procedureSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cream-100 text-charcoal-600 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-charcoal-400 italic">No procedure steps listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      {Array.isArray(puja.galleryImages) && puja.galleryImages.length > 0 && (
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-bold text-charcoal-800 border-b border-cream-200 pb-2">
            Ceremony Gallery
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {puja.galleryImages.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-36 object-cover rounded-xl border border-cream-200 hover:opacity-90 transition"
              />
            ))}
          </div>
        </div>
      )}

      {/* Audit Info Footer */}
      <div className="p-4 rounded-xl bg-white border border-cream-200 text-xs text-charcoal-400 flex flex-wrap items-center justify-between gap-2">
        <span>System ID: <code className="font-mono text-charcoal-600">{puja.id}</code></span>
        <div className="flex items-center gap-4">
          <span>Created: {new Date(puja.createdAt || "").toLocaleString("en-IN")}</span>
          <span>Updated: {new Date(puja.updatedAt || "").toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Upcoming Puja"
        message={`Are you sure you want to delete "${puja.name}"? This action cannot be undone. If any devotee bookings reference this ceremony, deletion will be rejected by the backend.`}
        confirmText={deleting ? "Deleting..." : "Delete Ceremony"}
        danger={true}
      />
    </div>
  );
}
