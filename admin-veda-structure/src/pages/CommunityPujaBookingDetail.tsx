import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CalendarCheck,
  CreditCard,
  Clock,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Users,
  Sparkles,
  Package,
  Info,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import unifiedBookingAdminService, {
  AdminCommunityPujaBooking,
} from "@/services/unifiedBookingAdminService";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/bookingUtils";

export default function CommunityPujaBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<AdminCommunityPujaBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await unifiedBookingAdminService.getCommunityPujaBookingById(id);
      if (res?.success && res.data) {
        setBooking(res.data);
      } else {
        setError("Community puja booking record not found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load community puja booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-sm text-charcoal-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-saffron-500 mb-3" />
        Loading community puja registration...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/bookings/community-puja"
          className="inline-flex items-center gap-2 text-sm text-charcoal-600 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Puja Bookings</span>
        </Link>
        <EmptyState
          title="Registration Not Found"
          message={error || "The requested community puja booking could not be retrieved."}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/admin/bookings/community-puja"
          className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-saffron-600 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Puja Bookings</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-serif text-charcoal-900">
                {booking.bookingReference}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                Community Puja
              </span>
            </div>
            <p className="text-sm text-charcoal-500 mt-1">
              {booking.puja?.name || "Upcoming Public Puja"} • Registered on {formatDateTime(booking.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={booking.paymentStatus || "Not Integrated"} />
            <StatusBadge status={booking.bookingStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Devotee Details */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <User className="w-4 h-4 text-purple-600" />
              Primary Devotee Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-charcoal-400 block">Devotee Name</span>
                <span className="font-semibold text-charcoal-800">
                  {booking.customer?.name || "—"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Phone Number</span>
                <div className="flex items-center gap-1.5 text-charcoal-800 font-medium">
                  <Phone className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.customer?.phone || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Email Address</span>
                <div className="flex items-center gap-1.5 text-charcoal-800">
                  <Mail className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.customer?.email || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Devotee Count</span>
                <span className="font-medium text-charcoal-800">
                  {booking.devoteeCount} Person(s)
                </span>
              </div>
            </div>

            {/* Devotees list */}
            {booking.devotees && booking.devotees.length > 0 && (
              <div className="mt-5 pt-4 border-t border-cream-200">
                <h4 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  Devotees Named in Sankalpa ({booking.devotees.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {booking.devotees.map((dev, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-cream-50 border border-cream-200 space-y-0.5"
                    >
                      <p className="font-semibold text-charcoal-800">
                        {dev.name || `Devotee ${idx + 1}`}
                      </p>
                      <p className="text-charcoal-500">
                        Gotra: {dev.gotra || "—"} • Relation: {dev.relation || "Devotee"}
                      </p>
                      {(dev.rashi || dev.nakshatra) && (
                        <p className="text-charcoal-400 text-[11px]">
                          Rashi: {dev.rashi || "—"} • Nakshatra: {dev.nakshatra || "—"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Upcoming Ceremony Details */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <CalendarCheck className="w-4 h-4 text-purple-600" />
              Ceremony & Temple Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <span className="text-xs text-charcoal-400 block">Puja Title</span>
                <span className="font-bold text-charcoal-900 text-base">
                  {booking.puja?.name || "Upcoming Community Puja"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Presiding Deity</span>
                <span className="font-semibold text-charcoal-800">
                  {booking.puja?.deity || "Sacred Deities"}
                </span>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Ceremony Date</span>
                <div className="flex items-center gap-1.5 font-semibold text-charcoal-800">
                  <CalendarCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>{formatDate(booking.puja?.ceremonyDate)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Temple / Sanctum</span>
                <div className="flex items-center gap-1.5 text-charcoal-700">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                  <span>{booking.puja?.temple || "Kashi Kshetra"}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-charcoal-400 block">Location</span>
                <span className="text-charcoal-700">
                  {booking.puja?.location || "Varanasi (Kashi), Uttar Pradesh"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Sankalpa & Shipping */}
          <div className="card p-5">
            <h3 className="text-base font-semibold text-charcoal-800 mb-4 flex items-center gap-2 border-b border-cream-200 pb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Sankalpa Purpose & Prasad Dispatch
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-charcoal-400 block">Sankalpa Intent</span>
                <p className="font-medium text-charcoal-800 mt-0.5">
                  {booking.sankalpPurpose || "Family Welfare and Spiritual Blessings"}
                </p>
              </div>

              {booking.shippingAddress && Object.keys(booking.shippingAddress).length > 0 && (
                <div className="pt-3 border-t border-cream-100 text-xs">
                  <span className="text-charcoal-400 block mb-1">Prasad Delivery Address</span>
                  <div className="p-2.5 rounded bg-cream-50 border border-cream-200 text-charcoal-700">
                    <pre className="whitespace-pre-wrap font-sans text-xs">
                      {JSON.stringify(booking.shippingAddress, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Selected Package & Payment */}
        <div className="space-y-6">
          {/* Selected Package Card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2 border-b border-cream-200 pb-2.5">
              <Package className="w-4 h-4 text-purple-600" />
              Selected Package
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-charcoal-400 block">Package Name</span>
                <span className="font-bold text-charcoal-900 text-sm">
                  {booking.package?.name || "Standard Registration"}
                </span>
              </div>

              {booking.package?.description && (
                <p className="text-charcoal-600 leading-relaxed">
                  {booking.package.description}
                </p>
              )}

              {booking.package?.features && booking.package.features.length > 0 && (
                <div className="pt-2 border-t border-cream-100">
                  <span className="text-charcoal-400 block mb-1 font-medium">Inclusions:</span>
                  <ul className="list-disc list-inside space-y-1 text-charcoal-600">
                    {booking.package.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-cream-200 flex justify-between items-center text-sm">
                <span className="font-bold text-charcoal-800">Total Dakshina:</span>
                <span className="font-bold text-purple-700 text-base">
                  {formatCurrency(booking.amount, booking.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Integration Card */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2 border-b border-cream-200 pb-2.5">
              <CreditCard className="w-4 h-4 text-charcoal-600" />
              Payment Information
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-charcoal-400 block">Gateway Integration</span>
                <span className="font-semibold text-charcoal-700">
                  {booking.paymentGateway || "Not Integrated"}
                </span>
              </div>

              <div>
                <span className="text-charcoal-400 block">Payment Status</span>
                <div className="mt-1">
                  <StatusBadge status={booking.paymentStatus || "Not Integrated"} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-cream-50 border border-cream-200 text-charcoal-600 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-charcoal-400 inline mr-1" />
                Community Puja registrations are managed offline or via temple counters unless integrated with online payment processing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

