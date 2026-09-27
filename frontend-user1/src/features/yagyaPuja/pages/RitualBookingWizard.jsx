import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";
import pujaCatalogueService, {
  getServiceFallbackImage,
} from "../../../services/pujaCatalogueService";
import {
  RitualBookingProvider,
  useRitualBooking,
} from "../context/RitualBookingContext";
import StepConfiguration from "../components/booking/StepConfiguration";
import StepYajman from "../components/booking/StepYajman";
import StepSankalp from "../components/booking/StepSankalp";
import StepFamilyMembers from "../components/booking/StepFamilyMembers";
import StepLocation from "../components/booking/StepLocation";
import StepAddons from "../components/booking/StepAddons";
import StepReview from "../components/booking/StepReview";
import RitualBookingConfirmation from "../components/booking/RitualBookingConfirmation";

const STEP_TITLES = [
  "1. Configuration",
  "2. Yajman Details",
  "3. Sankalp",
  "4. Family Members",
  "5. Location",
  "6. Add-ons",
  "7. Review",
];

/**
 * Inner wizard component consuming RitualBookingContext
 */
const RitualBookingWizardContent = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    service,
    configuration,
    priceBreakdown,
    isCalculatingPrice,
    priceError,
    calculatePrice,
    errors,
    validateStep,
    isConfirmed,
    isRecoveringPayment,
  } = useRitualBooking();

  // If active booking is recovering from reload/storage, show loading spinner
  if (isRecoveringPayment) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#fffaf0] py-16 px-4 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722] shadow-[0_4px_20px_rgba(212,135,43,0.18)]">
            <RefreshCw size={28} className="animate-spin text-[#b36c1e]" />
          </div>
          <h3 className="font-serif text-[20px] font-semibold text-[#2b241d]">
            Checking for Active Ceremony Reservation...
          </h3>
          <p className="text-[13.5px] text-[#75695c]">
            Synchronizing payment state with the authoritative Vedic registry.
          </p>
        </div>
      </div>
    );
  }

  // Once backend confirms payment, swap editable wizard with dedicated Confirmation UI
  if (isConfirmed) {
    return <RitualBookingConfirmation />;
  }

  const fallbackImg = getServiceFallbackImage(service?.slug);
  const primaryImg = service?.image || service?.bannerImage || fallbackImg;

  // Format canonical mode for display in summary
  const formatDisplayMode = (mode) => {
    switch (mode) {
      case "remote":
        return "Remote Sankalpa (Live)";
      case "kashi":
        return "Kashi Ghats & Shrines";
      case "customer_home":
        return "At Devotee Residence";
      case "temple":
        return "Consecrated Mandir";
      case "veda_structure":
        return "Veda Structure Centre";
      case "other":
        return "Other Sacred Venue";
      default:
        return mode || "To be configured";
    }
  };

  // Derive total display amount from authoritative backend response or fallback starting price
  const displayTotal =
    priceBreakdown?.totalAmount != null
      ? priceBreakdown.totalAmount
      : priceBreakdown?.calculatedAmount != null
      ? priceBreakdown.calculatedAmount
      : priceBreakdown?.amount != null
      ? priceBreakdown.amount
      : service?.startingPrice || 0;

  const handleContinue = () => {
    if (isCalculatingPrice) return;
    if (priceError) return;

    const isValid = validateStep(currentStep);
    if (isValid) {
      nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    previousStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (idx) => {
    // Devotees can freely navigate back to previously completed steps
    if (idx < currentStep) {
      setCurrentStep(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 pt-6 sm:pb-32 sm:pt-10">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ead8b8] pb-4">
          <div className="flex items-center gap-2 text-[12.5px] text-[#786a5b]">
            <Link to="/" className="hover:text-[#2b241d]">
              Home
            </Link>
            <span>/</span>
            <Link to="/yagya-puja/puja" className="hover:text-[#2b241d]">
              Puja Catalogue
            </Link>
            <span>/</span>
            <Link
              to={`/yagya-puja/puja/${service.slug}`}
              className="hover:text-[#2b241d]"
            >
              {service.name}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#b36c1e]">
              Ritual Booking Wizard
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/yagya-puja/puja/${service.slug}`)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#685c4f] hover:text-[#2b241d] cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Ceremony Overview</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4872b]/30 bg-[#f8edd8] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>SACRED CEREMONY WIZARD • PHASE 4B.4A ACTIVE</span>
          </div>
          <h1 className="mt-3 font-serif text-[28px] font-bold text-[#2b241d] sm:text-[36px]">
            Arrange {service.name}
          </h1>
          <p className="mt-1 text-[14.5px] text-[#685c4f]">
            Configure your personalized Vedic ceremony parameters, Gotra recitations, and venue details.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-10 rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
            {STEP_TITLES.map((title, idx) => {
              const isCurrent = idx === currentStep;
              const isCompleted = idx < currentStep;
              const isLocked = idx > currentStep;

              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  disabled={!isCompleted}
                  className={`flex items-center gap-2 whitespace-nowrap text-[12px] font-semibold transition-colors ${
                    isCurrent
                      ? "text-[#c77722]"
                      : isCompleted
                      ? "text-[#2e7d32] cursor-pointer hover:underline"
                      : isLocked
                      ? "text-[#aba094] cursor-not-allowed opacity-75"
                      : "text-[#9a8d7e] cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      isCurrent
                        ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                        : isCompleted
                        ? "bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7]"
                        : isLocked
                        ? "bg-[#f1ebe4] text-[#9a8d7e]"
                        : "bg-[#f4ebe1] text-[#7a6f62]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={14} />
                    ) : isLocked ? (
                      <Lock size={11} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="hidden md:inline">{title.replace(/^\d+\.\s*/, "")}</span>
                  {idx < STEP_TITLES.length - 1 && (
                    <div className="hidden lg:block h-[1px] w-6 bg-[#e6d7c3] mx-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Step Title Progress Bar */}
          <div className="mt-3 block md:hidden border-t border-[#f0e4d0] pt-2">
            <div className="flex items-center justify-between text-[11.5px] text-[#7a6f62]">
              <span>
                Step {currentStep + 1} of 7:{" "}
                <strong className="text-[#2b241d]">
                  {STEP_TITLES[currentStep].replace(/^\d+\.\s*/, "")}
                </strong>
              </span>
              <span>{Math.round(((currentStep + 1) / 7) * 100)}% Complete</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#f0e4d0] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#eab12c] to-[#d4872b] transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Wizard Layout */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: Active Step (65% width) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-[22px] border border-[#ead8b8] bg-[#fffdfa] p-6 sm:p-8 shadow-[0_8px_30px_rgba(80,60,30,0.04)]">
              {/* Step Header */}
              <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722] font-serif font-bold text-[16px] shadow-2xs">
                    {currentStep + 1}
                  </div>
                  <div>
                    <h2 className="font-serif text-[21px] font-semibold text-[#2b241d]">
                      {STEP_TITLES[currentStep]}
                    </h2>
                    <p className="text-[12.5px] text-[#8a7c6b]">
                      Generic Ritual Booking Engine • Step {currentStep + 1} of 7
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold text-[#b36c1e]">
                  Step {currentStep + 1} / 7
                </span>
              </div>

              {/* ACTIVE STEP CONTENT */}
              <div className="mt-6">
                {currentStep === 0 && <StepConfiguration />}
                {currentStep === 1 && <StepYajman />}
                {currentStep === 2 && <StepSankalp />}
                {currentStep === 3 && <StepFamilyMembers />}
                {currentStep === 4 && <StepLocation />}
                {currentStep === 5 && <StepAddons />}
                {currentStep === 6 && <StepReview />}
              </div>

              {/* Global Step Validation Notice */}
              {errors.pricing && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-800 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-600" />
                  <span>{errors.pricing}</span>
                </div>
              )}

              {/* Wizard Navigation Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-[#f0e2cd] pt-5">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-6 py-2.5 text-[13px] font-semibold text-[#5c4e3f] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#faf4e8] transition cursor-pointer"
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>

                {currentStep < 6 && (
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={isCalculatingPrice || !!priceError}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] px-7 py-2.5 text-[13px] font-bold text-[#1c1308] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(234,177,44,0.25)] hover:brightness-105 transition cursor-pointer"
                  >
                    <span>
                      {currentStep === 0
                        ? "Continue to Yajman Details"
                        : currentStep === 1
                        ? "Continue to Sankalp"
                        : currentStep === 2
                        ? "Continue to Family Members"
                        : currentStep === 3
                        ? "Continue to Location"
                        : currentStep === 4
                        ? "Continue to Add-ons"
                        : "Continue to Review"}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky Sacred Order Summary (35% width) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="overflow-hidden rounded-[22px] border border-[#ead8b8] bg-[#fffdfa] shadow-[0_10px_32px_rgba(80,60,30,0.06)]">
              {/* Service Preview Card */}
              <div className="relative h-36 w-full overflow-hidden bg-[#2b241d]">
                <img
                  src={primaryImg}
                  alt={service.name}
                  className="h-full w-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1308]/90 via-[#1c1308]/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#eab12c]">
                    VEDIC CEREMONY
                  </span>
                  <h3 className="font-serif text-[17px] font-bold leading-tight line-clamp-1">
                    {service.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Configuration Summary Badges */}
                <div className="space-y-2 border-b border-[#f0e2cd] pb-4 text-[12.5px]">
                  <div className="flex items-center justify-between text-[#685c4f]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#b36c1e]" />
                      Duration:
                    </span>
                    <strong className="text-[#2b241d]">
                      {configuration.durationSelected || `${configuration.durationHours || 2} Hours`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#685c4f]">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} className="text-[#b36c1e]" />
                      Pandit Team:
                    </span>
                    <strong className="text-[#2b241d]">
                      {configuration.panditCount || 1} Officiating Purohit
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[#685c4f]">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#b36c1e]" />
                      Location / Mode:
                    </span>
                    <strong className="text-[#2b241d]">
                      {formatDisplayMode(configuration.arrangementMode)}
                    </strong>
                  </div>
                </div>

                {/* Authoritative Dakshina Breakdown */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                      Authoritative Dakshina
                    </span>
                    {isCalculatingPrice && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#c77722] animate-pulse">
                        <RefreshCw size={11} className="animate-spin" />
                        Calculating...
                      </span>
                    )}
                  </div>

                  {priceError ? (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
                      <div className="flex items-start gap-1.5">
                        <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-600" />
                        <div>
                          <p>{priceError}</p>
                          <button
                            type="button"
                            onClick={() => calculatePrice()}
                            className="mt-1.5 text-[11px] font-bold underline cursor-pointer hover:text-red-900"
                          >
                            Retry Calculation
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2 text-[13px]">
                      {priceBreakdown ? (
                        <>
                          <div className="flex items-center justify-between text-[#685c4f]">
                            <span>Ceremony Base Dakshina:</span>
                            <span className="font-medium text-[#2b241d]">
                              ₹{Number(priceBreakdown.basePrice || service.startingPrice || 0).toLocaleString("en-IN")}
                            </span>
                          </div>

                          {(priceBreakdown.additionalPanditsCharge > 0 ||
                            priceBreakdown.additionalPanditCharge > 0) && (
                            <div className="flex items-center justify-between text-[#685c4f]">
                              <span>Additional Purohit Charge:</span>
                              <span className="font-medium text-[#2b241d]">
                                +₹{Number(priceBreakdown.additionalPanditsCharge || priceBreakdown.additionalPanditCharge).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}

                          {priceBreakdown.addonsTotal > 0 && (
                            <div className="flex items-center justify-between text-[#685c4f]">
                              <span>Sacred Add-ons Total:</span>
                              <span className="font-medium text-[#2b241d]">
                                +₹{Number(priceBreakdown.addonsTotal).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-[#685c4f]">
                          <span>Starting Dakshina:</span>
                          <span className="font-medium text-[#2b241d]">
                            {service.formattedPrice}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-[#ebdcc4] pt-3 flex items-baseline justify-between">
                        <div>
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                            Total Dakshina
                          </span>
                          <span className="text-[10px] text-[#8a7c6b]">
                            (Backend Authoritative)
                          </span>
                        </div>
                        <span className="font-serif text-[24px] font-bold text-[#c77722]">
                          ₹{Number(displayTotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shastric Trust Guarantees */}
                <div className="rounded-xl border border-[#f0e2cd] bg-[#fbf5eb] p-3 text-[11.5px] text-[#706254] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-[#2b241d]">
                    <ShieldCheck size={14} className="text-[#2e7d32]" />
                    <span>Vedic Inclusions & Guarantees</span>
                  </div>
                  <p>• Authentic learned Purohits versed in prescribed Vedic Shakhas</p>
                  <p>• Pure unadulterated Shastric samagri & consecrated flowers</p>
                  <p>• Verified Gotra recitation during ceremony Sankalp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Ritual Booking Wizard Page
 * Loads service by slug and wraps in RitualBookingProvider
 */
const RitualBookingWizard = () => {
  const { slug } = useParams();
  const location = useLocation();

  // Optimistic initial service from router state (if matching slug)
  const initialFromState =
    location.state?.service?.slug === slug ? location.state.service : null;

  const [service, setService] = useState(initialFromState);
  const [loading, setLoading] = useState(!initialFromState);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialFromState) {
      return;
    }

    if (!slug) {
      Promise.resolve().then(() => {
        setError("Ceremony identifier missing.");
        setLoading(false);
      });
      return;
    }

    let isMounted = true;
    pujaCatalogueService
      .getPujaServiceBySlug(slug)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setService(data);
            setError(null);
          } else {
            setError("The requested Vedic ceremony is not available in our catalogue.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load ceremony for wizard:", err);
          setError("Unable to load ceremony details. Please check your connection and try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, initialFromState]);

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6 text-center bg-[#fffaf0]">
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722] animate-spin">
            <Sparkles size={24} />
          </div>
          <h3 className="font-serif text-[20px] font-semibold text-[#2b241d]">
            Preparing Sacred Ritual Wizard...
          </h3>
          <p className="text-[13.5px] text-[#75695c]">
            Loading authoritative Vedic ceremony parameters.
          </p>
        </div>
      </div>
    );
  }

  // Error / 404 State
  if (error || !service) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-6 text-center bg-[#fffaf0]">
        <div className="max-w-[460px] rounded-2xl border border-[#ead8b8] bg-[#fffdfa] p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
            Ceremony Not Found
          </h2>
          <p className="mt-2 text-[14px] text-[#685c4f]">
            {error || "The selected Vedic ceremony could not be identified."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] hover:bg-[#dda018] cursor-pointer"
            >
              Retry
            </button>
            <Link
              to="/yagya-puja/puja"
              className="rounded-full border border-[#ebdcc4] bg-white px-6 py-2.5 text-[13px] font-bold text-[#5c4e3f] hover:bg-[#faf4e8]"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RitualBookingProvider initialService={service}>
      <RitualBookingWizardContent />
    </RitualBookingProvider>
  );
};

export default RitualBookingWizard;
