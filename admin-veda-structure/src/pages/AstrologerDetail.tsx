import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Power,
  RefreshCw,
  AlertCircle,
  MapPin,
  Clock,
  Star,
  Globe,
  Award,
  Layers,
  HelpCircle,
  Calendar,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import astrologerAdminService, {
  AdminAstrologer,
} from "@/services/astrologerAdminService";

export default function AstrologerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [astrologer, setAstrologer] = useState<AdminAstrologer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAstrologer = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await astrologerAdminService.getAstrologerById(id);
      if (res && res.data) {
        setAstrologer(res.data);
      } else {
        setError("Astrologer not found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load astrologer details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAstrologer();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!astrologer) return;
    setActionLoading(true);
    try {
      const newStatus = !astrologer.isActive;
      await astrologerAdminService.updateAstrologerStatus(astrologer.id, newStatus);
      toast.success(
        `${astrologer.name} has been ${newStatus ? "activated" : "deactivated"}.`
      );
      setConfirmOpen(false);
      setAstrologer({ ...astrologer, isActive: newStatus });
    } catch (err: any) {
      toast.error(err?.message || "Failed to toggle status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-charcoal-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
        <p className="text-sm">Loading astrologer profile...</p>
      </div>
    );
  }

  if (error || !astrologer) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/astrologers"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Astrologers</span>
        </Link>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Profile Not Found</span>
          </div>
          <p className="text-sm">{error || "The requested astrologer does not exist."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and page actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/astrologers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Astrologers</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setConfirmOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg border transition cursor-pointer ${
              astrologer.isActive
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{astrologer.isActive ? "Deactivate" : "Activate"}</span>
          </button>

          <button
            onClick={() => navigate(`/admin/astrologers/${astrologer.id}/edit`)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm transition cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar / Portrait */}
          <div className="flex-shrink-0">
            {astrologer.profileImage ? (
              <img
                src={astrologer.profileImage}
                alt={astrologer.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-saffron-200 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold text-3xl border border-saffron-200">
                {astrologer.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-charcoal-900 font-serif">
                {astrologer.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cream-100 text-charcoal-700">
                {astrologer.code}
              </span>
              <StatusBadge status={astrologer.isActive ? "Active" : "Inactive"} />
            </div>

            <p className="text-base text-charcoal-700 font-medium">{astrologer.title}</p>
            {astrologer.eyebrow && (
              <p className="text-xs font-semibold tracking-wider text-saffron-700 uppercase">
                {astrologer.eyebrow}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-charcoal-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-saffron-500" />
                {astrologer.holySeat} ({astrologer.location})
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                {astrologer.experienceYears} Years Experience
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {astrologer.rating} Rating ({astrologer.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-charcoal-400" />
                {astrologer.sessionsCount} Sessions Conducted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial & Biography Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Quote & Description */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-saffron-600" />
              Philosophy & Bio Overview
            </h2>

            {astrologer.quote && (
              <blockquote className="p-3.5 border-l-3 border-saffron-500 bg-saffron-50/50 italic text-sm text-charcoal-700 rounded-r-lg">
                &ldquo;{astrologer.quote}&rdquo;
              </blockquote>
            )}

            {astrologer.description && (
              <p className="text-sm text-charcoal-600 leading-relaxed">
                {astrologer.description}
              </p>
            )}

            {astrologer.bioParagraphs && astrologer.bioParagraphs.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                  Detailed Narrative
                </h3>
                {astrologer.bioParagraphs.map((p, idx) => (
                  <p key={idx} className="text-sm text-charcoal-600 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Pillars */}
          {astrologer.pillars && astrologer.pillars.length > 0 && (
            <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-saffron-600" />
                Consultation Pillars
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {astrologer.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-cream-200 bg-cream-50/30 space-y-1"
                  >
                    <h4 className="text-sm font-semibold text-charcoal-800">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-charcoal-600">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Packages */}
          <div className="bg-white rounded-xl border border-cream-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-saffron-600" />
                Consultation Packages & Pricing ({astrologer.packages?.length || 0})
              </h2>
              <Link
                to={`/admin/astrologers/${astrologer.id}/packages`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-saffron-700 bg-saffron-50 hover:bg-saffron-100 rounded-lg border border-saffron-200 transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Manage Packages</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {astrologer.packages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-xl border space-y-2 transition ${
                    pkg.isActive
                      ? "border-cream-200 bg-cream-50/20"
                      : "border-cream-200/60 bg-cream-50/40 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-charcoal-800 text-sm">
                          {pkg.title}
                        </span>
                        {pkg.isPopular && (
                          <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded text-[10px] font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-charcoal-400">
                        key: {pkg.packageKey}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200 block">
                        ₹{Number(pkg.price).toLocaleString("en-IN")}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-[11px] text-charcoal-400 line-through">
                          ₹{Number(pkg.originalPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-saffron-600" />
                      {pkg.duration}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        pkg.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-charcoal-100 text-charcoal-600"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {pkg.subtitle && (
                    <p className="text-xs text-charcoal-600 italic">{pkg.subtitle}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          {/* Languages, Expertise, Specializations */}
          <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-saffron-500" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {astrologer.languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium bg-cream-100 text-charcoal-700 rounded-md"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-cream-100 pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                Core Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {astrologer.expertise?.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium bg-saffron-50 text-saffron-800 rounded-md border border-saffron-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-cream-100 pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 mb-2">
                Specializations
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {astrologer.specializations?.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium bg-cream-100 text-charcoal-700 rounded-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots & Availability */}
          <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-saffron-500" />
              Daily Consultation Slots ({astrologer.availableTimeSlots?.length || 0})
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {astrologer.availableTimeSlots?.map((slot, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 text-xs font-medium bg-cream-50 text-charcoal-700 rounded border border-cream-200"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          {/* Add-On Pricing */}
          <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-saffron-500" />
              Add-On Consultation Pricing
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(astrologer.addOnPricing || {}).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 rounded bg-cream-50/50 border border-cream-100"
                >
                  <span className="font-medium text-charcoal-700 capitalize">
                    {key.replace("addOn", "")}
                  </span>
                  <span className="font-bold text-saffron-700">
                    ₹{Number(val).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleToggleStatus}
        title={
          astrologer.isActive
            ? `Deactivate ${astrologer.name}?`
            : `Activate ${astrologer.name}?`
        }
        message={
          astrologer.isActive
            ? "Deactivating this astrologer will remove them from the public website listings."
            : "Activating this astrologer will make them visible to website visitors."
        }
        confirmText={astrologer.isActive ? "Deactivate" : "Activate"}
        confirmVariant={astrologer.isActive ? "danger" : "primary"}
        loading={actionLoading}
      />
    </div>
  );
}
