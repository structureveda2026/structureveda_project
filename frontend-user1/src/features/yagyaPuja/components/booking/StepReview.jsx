import {
  Sparkles,
  Edit3,
  ShieldCheck,
  Lock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRitualBooking } from "../../context/RitualBookingContext";

const StepReview = () => {
  const {
    service,
    configuration,
    yajmanDetails,
    sankalpDetails,
    familyMembers,
    locationDetails,
    addons,
    priceBreakdown,
    setCurrentStep,
    bookingReference,
    bookingStatus,
    isSubmitting,
    isOpeningPayment,
    isVerifyingPayment,
    paymentVerificationStatus,
    checkPaymentStatus,
    isCalculatingPrice,
    priceError,
    submissionError,
    paymentError,
    initiateBookingAndPayment,
  } = useRitualBooking();

  // Helper to jump to step
  const handleEdit = (stepIdx) => {
    setCurrentStep(stepIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Convert canonical modes to human-readable strings
  const getArrangementLabel = (mode) => {
    switch (mode) {
      case "remote":
        return "Remote Sankalpa (Online Live Stream)";
      case "kashi":
        return "Kashi Sacred Ghats & Shrines (Varanasi)";
      case "customer_home":
        return "Devotee Residence / Private Premises";
      case "temple":
        return "Consecrated Mandir / Temple Premises";
      case "veda_structure":
        return "Veda Structure Ashram & Spiritual Centre";
      case "other":
        return "Other Sacred Designated Venue";
      default:
        return mode || "Not specified";
    }
  };

  // Safe formatting helper for dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isRemote =
    (configuration.locationType || configuration.arrangementMode) === "remote";
  const isVedaStructure =
    (configuration.locationType || configuration.arrangementMode) === "veda_structure";
  const isKashi =
    (configuration.locationType || configuration.arrangementMode) === "kashi";

  // Authoritative prices directly from Context / Backend breakdown
  const baseAmount =
    priceBreakdown?.basePrice ??
    priceBreakdown?.baseAmount ??
    service?.startingPrice ??
    null;
  const panditAmount =
    priceBreakdown?.additionalPanditAmount ??
    priceBreakdown?.panditDakshina ??
    null;
  const addonsTotal =
    priceBreakdown?.addonsTotal ??
    null;
  const totalDakshina =
    priceBreakdown?.totalAmount ??
    priceBreakdown?.calculatedAmount ??
    priceBreakdown?.amount ??
    service?.startingPrice ??
    0;

  return (
    <div className="space-y-8">
      {/* Review Header Banner */}
      <div className="rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-4 text-[13px] text-[#685c4f]">
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#2e7d32]" />
          <div>
            <p className="font-semibold text-[#2b241d]">
              Review Your Sacred Ceremony Parameters
            </p>
            <p className="mt-0.5 text-[#7a6f62]">
              Please verify all devotee information, auspicious timings, Gotra details, and venue coordinates before proceeding. You can edit any section at any time.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: CEREMONY / SERVICE */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              1
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Puja / Sacred Service
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(0)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Ceremony Name</span>
            <p className="mt-0.5 font-serif text-[15px] font-bold text-[#2b241d]">
              {service?.name || "Ceremony"}
            </p>
          </div>
          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Ceremony Slug</span>
            <p className="mt-0.5 text-[13px] text-[#685c4f]">
              {service?.slug || "puja-service"}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: CONFIGURATION */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              2
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Ceremony Configuration & Schedule
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(0)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Auspicious Date</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {formatDate(configuration.bookingDate)}
            </p>
          </div>

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Muhurat / Time</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {configuration.bookingTime || "Not selected"}
            </p>
          </div>

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Ceremony Duration</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {configuration.durationSelected || `${configuration.durationHours || 1} Hours`}
            </p>
          </div>

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Officiating Purohits</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {configuration.panditCount || 1} Vedic Scholar{Number(configuration.panditCount) > 1 ? "s" : ""}
            </p>
          </div>

          <div className="col-span-2">
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Arrangement & Venue Mode</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {getArrangementLabel(configuration.arrangementMode)}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: YAJMAN DETAILS */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              3
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Primary Yajman (Devotee) Details
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(1)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Full Name</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {yajmanDetails.name || "—"}
            </p>
          </div>

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Mobile Number</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {yajmanDetails.mobile || "—"}
            </p>
          </div>

          {yajmanDetails.email && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Email</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d] truncate">
                {yajmanDetails.email}
              </p>
            </div>
          )}

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Gender</span>
            <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
              {yajmanDetails.gender || "—"}
            </p>
          </div>

          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Vedic Gotra</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#b36c1e]">
              {yajmanDetails.gotra || "Not specified / Kashyap"}
            </p>
          </div>

          {yajmanDetails.rashi && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Rashi (Moon Sign)</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.rashi}
              </p>
            </div>
          )}

          {yajmanDetails.nakshatra && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Janma Nakshatra</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.nakshatra}
              </p>
            </div>
          )}

          {yajmanDetails.dob && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Date of Birth</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {formatDate(yajmanDetails.dob)}
              </p>
            </div>
          )}

          {yajmanDetails.timeOfBirth && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Time of Birth</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.timeOfBirth}
              </p>
            </div>
          )}

          {yajmanDetails.placeOfBirth && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Place of Birth</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.placeOfBirth}
              </p>
            </div>
          )}

          {yajmanDetails.fatherName && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Father&apos;s Name</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.fatherName}
              </p>
            </div>
          )}

          {yajmanDetails.motherName && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Mother&apos;s Name</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.motherName}
              </p>
            </div>
          )}

          {yajmanDetails.spouseName && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Spouse&apos;s Name</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d]">
                {yajmanDetails.spouseName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: SANKALP */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              4
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Sacred Sankalp & Intentions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(2)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {sankalpDetails.purpose && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Ceremonial Purpose</span>
              <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
                {sankalpDetails.purpose}
              </p>
            </div>
          )}

          {sankalpDetails.mainIntention && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Main Sankalpa Intention</span>
              <p className="mt-0.5 text-[13.5px] text-[#2b241d] whitespace-pre-wrap">
                {sankalpDetails.mainIntention}
              </p>
            </div>
          )}

          {sankalpDetails.specificSankalp && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Specific Prayers & Desires</span>
              <p className="mt-0.5 text-[13.5px] text-[#685c4f] whitespace-pre-wrap">
                {sankalpDetails.specificSankalp}
              </p>
            </div>
          )}

          {sankalpDetails.specialRequest && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Special Deity Chanting Requests</span>
              <p className="mt-0.5 text-[13.5px] text-[#685c4f] whitespace-pre-wrap">
                {sankalpDetails.specialRequest}
              </p>
            </div>
          )}

          {sankalpDetails.specialInstructions && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Custom Instructions for Officiating Purohits</span>
              <p className="mt-0.5 text-[13.5px] text-[#685c4f] whitespace-pre-wrap">
                {sankalpDetails.specialInstructions}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: FAMILY MEMBERS */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              5
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Family Members & Co-Yajamana ({familyMembers.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(3)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4">
          {familyMembers.length === 0 ? (
            <p className="text-[13px] text-[#8a7c6b] italic">
              No additional family members added.
            </p>
          ) : (
            <div className="divide-y divide-[#f0e2cd]">
              {familyMembers.map((member, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13.5px] text-[#2b241d]">
                        {member.name}
                      </span>
                      {member.relation && (
                        <span className="rounded-full bg-[#f4ebe1] px-2 py-0.5 text-[10.5px] font-medium text-[#7a6f62]">
                          {member.relation}
                        </span>
                      )}
                      {member.gender && (
                        <span className="text-[11.5px] text-[#8a7c6b]">
                          ({member.gender})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#7a6f62]">
                    {member.gotra && (
                      <span>
                        Gotra: <strong className="text-[#2b241d]">{member.gotra}</strong>
                      </span>
                    )}
                    {member.rashi && (
                      <span>
                        Rashi: <strong className="text-[#2b241d]">{member.rashi}</strong>
                      </span>
                    )}
                    {member.nakshatra && (
                      <span>
                        Nakshatra: <strong className="text-[#2b241d]">{member.nakshatra}</strong>
                      </span>
                    )}
                    {member.dob && (
                      <span>
                        DOB: <strong className="text-[#2b241d]">{formatDate(member.dob)}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6: LOCATION */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              6
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Location & Ceremony Venue
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(4)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Arrangement Category</span>
            <p className="mt-0.5 text-[13.5px] font-semibold text-[#2b241d]">
              {getArrangementLabel(configuration.locationType || configuration.arrangementMode)}
            </p>
          </div>

          {isRemote && (
            <p className="text-[13px] text-[#2e7d32] font-medium">
              Digital / Remote coordination. No physical venue address required.
            </p>
          )}

          {isVedaStructure && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Sanctuary Address</span>
              <p className="mt-0.5 text-[13px] text-[#685c4f]">
                Veda Structure Spiritual Sanctuary & Yagyashala (Varanasi / NCR Centre).
              </p>
              {locationDetails.contactPerson && (
                <p className="mt-1 text-[12px] text-[#7a6f62]">
                  Attending Devotee: <strong>{locationDetails.contactPerson}</strong>
                </p>
              )}
            </div>
          )}

          {isKashi && (
            <div>
              <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Varanasi Shrines</span>
              <p className="mt-0.5 text-[13px] text-[#685c4f]">
                Consecrated Ghats & Shrines along the holy Ganges, Kashi (Varanasi, UP).
              </p>
              {locationDetails.landmark && (
                <p className="mt-1 text-[12px] text-[#7a6f62]">
                  Stay notes: <strong>{locationDetails.landmark}</strong>
                </p>
              )}
            </div>
          )}

          {!isRemote && !isVedaStructure && !isKashi && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-[13px]">
              <div className="sm:col-span-2">
                <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Venue Address</span>
                <p className="mt-0.5 text-[#2b241d] font-medium">{locationDetails.address || "—"}</p>
              </div>

              <div>
                <span className="block text-[11.5px] font-medium text-[#8a7c6b]">City & State</span>
                <p className="mt-0.5 text-[#2b241d]">
                  {locationDetails.city ? `${locationDetails.city}, ` : ""}
                  {locationDetails.state || ""}
                </p>
              </div>

              <div>
                <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Postal Pincode & Country</span>
                <p className="mt-0.5 text-[#2b241d]">
                  {locationDetails.pincode || "—"}, {locationDetails.country || "India"}
                </p>
              </div>

              {locationDetails.landmark && (
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Landmark</span>
                  <p className="mt-0.5 text-[#685c4f]">{locationDetails.landmark}</p>
                </div>
              )}

              {locationDetails.contactPerson && (
                <div>
                  <span className="block text-[11.5px] font-medium text-[#8a7c6b]">Venue Contact Person</span>
                  <p className="mt-0.5 text-[#685c4f]">{locationDetails.contactPerson}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 7: ADD-ONS */}
      <div className="overflow-hidden rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
              7
            </span>
            <h3 className="font-serif text-[16px] font-semibold text-[#2b241d]">
              Selected Add-ons & Customizations ({addons.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleEdit(5)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e] hover:underline cursor-pointer"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>
        </div>

        <div className="mt-4">
          {addons.length === 0 ? (
            <p className="text-[13px] text-[#8a7c6b] italic">
              No additional services selected.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {addons.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-[#ead8b8] bg-[#fffaf0] p-3 text-[13px] text-[#2b241d]"
                >
                  <Sparkles size={14} className="shrink-0 text-[#b36c1e]" />
                  <span className="font-medium">{item.name || item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 8: PRICING SUMMARY (AUTHORITATIVE BACKEND DAKSHINA ONLY) */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#d4872b]/40 bg-gradient-to-b from-[#fffdfa] to-[#fbf4e8] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#ebd7be] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b36c1e] text-[11px] font-bold text-white">
              8
            </span>
            <h3 className="font-serif text-[17px] font-bold text-[#2b241d]">
              Authoritative Dakshina Summary
            </h3>
          </div>
          <span className="rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold text-[#b36c1e]">
            Backend Verified
          </span>
        </div>

        <div className="space-y-2.5 text-[13.5px]">
          {/* Base Ceremony Dakshina */}
          {baseAmount != null && (
            <div className="flex items-center justify-between text-[#685c4f]">
              <span>Base Ceremony Dakshina</span>
              <span className="font-semibold text-[#2b241d]">
                ₹{Number(baseAmount).toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Additional Purohit Dakshina if applicable */}
          {panditAmount != null && Number(panditAmount) > 0 && (
            <div className="flex items-center justify-between text-[#685c4f]">
              <span>Additional Officiating Purohits</span>
              <span className="font-semibold text-[#2b241d]">
                ₹{Number(panditAmount).toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Add-ons Total if returned by backend */}
          {addonsTotal != null && (
            <div className="flex items-center justify-between text-[#685c4f]">
              <span>Add-ons Total</span>
              <span className="font-semibold text-[#2b241d]">
                ₹{Number(addonsTotal).toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {/* Total Dakshina */}
          <div className="border-t border-[#ead8b8] pt-3 flex items-baseline justify-between text-[#2b241d]">
            <div>
              <p className="font-serif text-[16px] font-bold">Total Sacred Dakshina</p>
              <p className="text-[11.5px] text-[#7a6f62]">Inclusive of all Vedic rites & samagri</p>
            </div>
            <div className="text-right">
              <span className="font-serif text-[26px] font-bold text-[#b36c1e]">
                ₹{Number(totalDakshina).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL REVIEW CTA - PHASE 4B.4A ACTIVE PAYMENT CHECKOUT */}
      <div className="rounded-2xl border border-[#ead8b8] bg-[#fffaf0] p-6 text-center space-y-4">
        {bookingReference ? (
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-[12px] font-semibold text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Reserved Booking Ref: <strong>{bookingReference}</strong> ({bookingStatus})</span>
            {paymentVerificationStatus === "pending" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-800">
                Payment Pending
              </span>
            )}
            {paymentVerificationStatus === "failed" && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10.5px] font-bold text-red-800">
                Payment Not Completed
              </span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-[#f8edd8] px-3.5 py-1 text-[11.5px] font-semibold text-[#b36c1e]">
            <ShieldCheck size={13} className="text-[#b36c1e]" />
            <span>Vedic Ritual & Ceremony Reservation</span>
          </div>
        )}

        <h4 className="font-serif text-[19px] font-bold text-[#2b241d]">
          {bookingReference
            ? "Complete Payment to Finalize Ceremony"
            : "Confirm & Proceed to Payment"}
        </h4>

        <p className="mx-auto max-w-[520px] text-[13px] leading-relaxed text-[#685c4f]">
          {bookingReference
            ? "Your ritual booking details are saved in the system. Click below to open the secure Cashfree checkout modal and complete your ceremony Dakshina."
            : "Review your ceremony parameters above. When you proceed, your sacred booking reference will be generated and the Cashfree payment gateway will open."}
        </p>

        {/* Submission Error Banner */}
        {submissionError && (
          <div className="mx-auto max-w-[560px] rounded-xl border border-red-200 bg-red-50 p-3.5 text-left text-[12.5px] text-red-700 flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Booking Creation Notice</p>
              <p className="mt-0.5">{submissionError}</p>
            </div>
          </div>
        )}

        {/* Payment Error Banner */}
        {paymentError && (
          <div className="mx-auto max-w-[560px] rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-left text-[12.5px] text-amber-800 flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Payment Gateway Notice</p>
              <p className="mt-0.5">{paymentError}</p>
              <p className="mt-1 text-[11.5px] text-amber-700">
                Your booking is safely recorded. You can retry opening checkout below without losing your configuration.
              </p>
            </div>
          </div>
        )}

        {/* Action Button Area */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {/* If verifying payment */}
          {isVerifyingPayment ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-9 py-3.5 text-[14px] font-bold text-[#1c1308] opacity-75 cursor-wait shadow-sm"
            >
              <RefreshCw size={16} className="animate-spin text-[#1c1308]" />
              <span>Verifying Payment...</span>
            </button>
          ) : (
            <>
              {/* Primary Action Button: Proceed or Retry Payment */}
              <button
                type="button"
                onClick={initiateBookingAndPayment}
                disabled={isSubmitting || isOpeningPayment || isCalculatingPrice || !!priceError}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-9 py-3.5 text-[14px] font-bold text-[#1c1308] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_20px_rgba(234,177,44,0.35)] hover:brightness-105 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Creating your sacred booking...</span>
                  </>
                ) : isOpeningPayment ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Connecting to Secure Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>
                      {bookingReference ? "Retry Secure Payment" : "Proceed to Secure Payment"}
                    </span>
                  </>
                )}
              </button>

              {/* Secondary Status Check Button if booking exists */}
              {bookingReference && !isSubmitting && !isOpeningPayment && (
                <button
                  type="button"
                  onClick={checkPaymentStatus}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-3.5 text-[13.5px] font-semibold text-[#5c4e3f] shadow-2xs hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <RefreshCw size={14} className="text-[#b36c1e]" />
                  <span>Check Payment Status</span>
                </button>
              )}
            </>
          )}
        </div>

        <p className="text-[11.5px] text-[#8a7c6b]">
          256-Bit SSL Encrypted • Powered by Cashfree Payment Gateway • Verified Vedic Acharyas
        </p>
      </div>
    </div>
  );
};

export default StepReview;
