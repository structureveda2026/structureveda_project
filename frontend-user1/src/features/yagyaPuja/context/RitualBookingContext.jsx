/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import ritualBookingService from "../../../services/ritualBookingService";

const RitualBookingContext = createContext(null);

export const CANONICAL_ARRANGEMENT_MODES = [
  "remote",
  "customer_home",
  "veda_structure",
  "temple",
  "kashi",
  "other",
];

export const CANONICAL_LOCATION_TYPES = [
  "kashi",
  "customer_home",
  "temple",
  "veda_structure",
  "remote",
  "other",
];

export const VEDIC_RASHIS = [
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
];

export const VEDIC_NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

export const FAMILY_RELATIONS = [
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Other",
];

export const AVAILABLE_ADDONS = [
  {
    type: "prasad",
    name: "Sacred Maha Prasad Dispatch",
    tagline: "Consecrated dry fruits, Vibhuti, Kumkum & sacred thread delivered to your doorstep.",
  },
  {
    type: "additional_pandit",
    name: "Additional Vedic Purohit",
    tagline: "Co-officiating Brahmin scholar for synchronized Vedic chanting and expanded mantra recitation.",
  },
  {
    type: "additional_day",
    name: "Additional Day Ritual Extension",
    tagline: "Extension of the homa rituals over multiple consecutive days for intensified sankalpa.",
  },
  {
    type: "special_samagri",
    name: "Special Sacred Dravya & Samagri",
    tagline: "Indigenous desi cow bilona ghee, rare Ayurvedic herbs, lotus seeds, and sacred havan woods.",
  },
  {
    type: "live_participation",
    name: "Interactive Live Video Stream",
    tagline: "Two-way high-definition video link for real-time sankalpa participation and priest interaction.",
  },
  {
    type: "video_recording",
    name: "Full Ceremony Video Recording",
    tagline: "Complete archival quality HD recording of the ritual, mantra recitations, and final Aarti.",
  },
  {
    type: "certificate",
    name: "Sanctified Sankalpa Certificate",
    tagline: "Traditional physical certificate signed by the presiding Acharya detailing gotra and muhurat tithi.",
  },
  {
    type: "other_service",
    name: "Brahmin Bhojan & Gau Seva",
    tagline: "Sacred cow feeding (Gau Grass) and traditional Prasad Bhojan offered to officiating scholars.",
  },
];

export const RITUAL_STORAGE_KEY = "veda_active_ritual_booking";

/**
 * Calculates Yagya completion date (start date + days - 1)
 */
export const calculateYagyaCompletionDate = (startDateStr, days) => {
  if (!startDateStr || !days || Number(days) < 1) return "";
  try {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return "";
    const end = new Date(start);
    end.setDate(start.getDate() + (Number(days) - 1));
    return end.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

/**
 * Calculates Japa completion date (start date + days - 1)
 */
export const calculateJapaCompletionDate = calculateYagyaCompletionDate;

/**
 * Resolves safe default configuration from actual service properties.
 * Supports both PUJA and YAGYA services without inventing missing values.
 */
const getDefaultConfiguration = (service, serviceType = "PUJA") => {
  if (!service) {
    return {
      bookingDate: "",
      bookingTime: "",
      durationSelected: "",
      durationHours: null,
      panditCount: 1,
      arrangementMode: "",
      locationType: "",
      days: null,
      dailyHours: null,
      completionDate: "",
      selectedPricingTier: null,
    };
  }

  const isJapa =
    serviceType === "JAPA" ||
    service?.serviceType === "JAPA" ||
    service?.ritualType === "JAPA" ||
    (Array.isArray(service?.availableCounts) && service.availableCounts.length > 0);

  if (isJapa) {
    const availableCounts =
      Array.isArray(service.availableCounts) && service.availableCounts.length > 0
        ? service.availableCounts.map(Number).filter((n) => !isNaN(n) && n > 0)
        : Array.isArray(service.variants) && service.variants.length > 0
        ? service.variants.map((v) => Number(v.count)).filter((n) => !isNaN(n) && n > 0)
        : [11000];

    const defaultCount = availableCounts[0] || 11000;
    const matchedVariant = Array.isArray(service.variants)
      ? service.variants.find((v) => Number(v.count) === defaultCount)
      : null;

    const minPandits = Number(matchedVariant?.minimumPandits || service.minimumPandits || 2);
    const recPandits = Number(matchedVariant?.recommendedPandits || service.recommendedPandits || 3);
    const maxPandits = Number(service.maximumPandits || 11);
    const dailyCapacity = Number(matchedVariant?.dailyCapacity || service.dailyCapacityPerPandit || 2000);
    const totalCap = recPandits * dailyCapacity;
    const reqDays = Math.max(1, Math.ceil(defaultCount / Math.max(1, totalCap)));

    let arrangementMode = "kashi";
    if (service.isKashiAvailable === false && service.isRemoteAvailable !== false) {
      arrangementMode = "remote";
    }

    return {
      bookingDate: "",
      bookingTime: "06:00 AM",
      japaCount: defaultCount,
      panditCount: Math.max(1, recPandits),
      minimumPandits: minPandits,
      recommendedPandits: recPandits,
      maximumPandits: maxPandits,
      dailyCapacityPerPandit: dailyCapacity,
      totalDailyCapacity: totalCap,
      requiredDays: reqDays,
      days: reqDays,
      dailyHours: service.dailyHours || "4 Hours / Day",
      arrangementMode,
      locationType: arrangementMode,
      completionDate: "",
      selectedVariant: matchedVariant,
      durationSelected: `${defaultCount.toLocaleString("en-IN")} Japa`,
      selectedPricingTier: null,
    };
  }

  const isYagya =
    serviceType === "YAGYA" ||
    service?.ritualType === "YAGYA" ||
    service?.dailyRitualHours != null;

  if (isYagya) {
    const availableDurations =
      Array.isArray(service.availableDurations) && service.availableDurations.length > 0
        ? service.availableDurations.map((d) => Number(d)).filter((d) => !isNaN(d) && d > 0)
        : [3];
    const defaultDays = Number(service.defaultDurationDays) || availableDurations[0] || 3;
    const daily = Number(service.dailyRitualHours) || 4;
    const minPandits =
      service.panditRequirement?.minPandits != null
        ? Number(service.panditRequirement.minPandits)
        : 3;

    // Matching pricing tier
    const matchedTier = Array.isArray(service.pricingTiers)
      ? service.pricingTiers.find((t) => Number(t.days) === defaultDays) || null
      : null;
    const pandits = matchedTier?.panditCount ? Number(matchedTier.panditCount) : minPandits;

    let arrangementMode = "kashi";
    if (Array.isArray(service.locationModes) && service.locationModes.length > 0) {
      const first = String(service.locationModes[0]).toLowerCase();
      if (first.includes("kashi")) arrangementMode = "kashi";
      else if (first.includes("home")) arrangementMode = "customer_home";
      else if (first.includes("remote")) arrangementMode = "remote";
      else arrangementMode = "kashi";
    } else if (service.isKashiAvailable === false) {
      arrangementMode = "remote";
    }

    return {
      bookingDate: "",
      bookingTime: "",
      durationSelected: `${defaultDays} Days`,
      durationHours: defaultDays * daily,
      panditCount: Math.max(1, pandits),
      arrangementMode,
      locationType: arrangementMode,
      days: defaultDays,
      dailyHours: daily,
      completionDate: "",
      selectedPricingTier: matchedTier,
    };
  }

  // 1. Duration defaults (Puja)
  let durationSelected = "";
  let durationHours = null;

  if (Array.isArray(service.availableDurations) && service.availableDurations.length > 0) {
    durationSelected = service.availableDurations[0];
  } else if (typeof service.duration === "string") {
    durationSelected = service.duration;
  }

  if (Array.isArray(service.durationHours) && service.durationHours.length > 0) {
    durationHours = Number(service.durationHours[0]) || null;
  } else if (durationSelected) {
    const parsed = parseInt(durationSelected, 10);
    durationHours = !isNaN(parsed) && parsed > 0 ? parsed : null;
  }

  // 2. Canonical arrangement mode & location type defaults (Puja)
  let arrangementMode = "";
  let locationType = "";

  const rawMode = String(service.rawAvailableMode || service.availableMode || "").toLowerCase();

  if (rawMode === "remote" || rawMode === "online") {
    arrangementMode = "remote";
    locationType = "remote";
  } else if (service.isKashiAvailable !== false) {
    arrangementMode = "kashi";
    locationType = "kashi";
  } else if (CANONICAL_ARRANGEMENT_MODES.includes(rawMode)) {
    arrangementMode = rawMode;
    locationType = rawMode;
  }

  return {
    bookingDate: "",
    bookingTime: "",
    durationSelected,
    durationHours,
    panditCount: 1,
    arrangementMode,
    locationType,
    days: null,
    dailyHours: null,
    completionDate: "",
    selectedPricingTier: null,
  };
};

const INITIAL_STATE = {
  currentStep: 0,

  service: null,

  configuration: {
    bookingDate: "",
    bookingTime: "",
    durationSelected: "",
    durationHours: null,
    panditCount: 1,
    arrangementMode: "",
    locationType: "",
    days: null,
    dailyHours: null,
    completionDate: "",
    selectedPricingTier: null,
    japaCount: null,
    minimumPandits: null,
    recommendedPandits: null,
    maximumPandits: null,
    dailyCapacityPerPandit: null,
    totalDailyCapacity: null,
    requiredDays: null,
    selectedVariant: null,
  },

  yajmanDetails: {
    name: "",
    mobile: "",
    email: "",
    gender: "Male",
    dob: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gotra: "",
    rashi: "",
    nakshatra: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
  },

  sankalpDetails: {
    purpose: "",
    mainIntention: "",
    specificSankalp: "",
    specialRequest: "",
    specialInstructions: "",
  },

  familyMembers: [],

  locationDetails: {
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    landmark: "",
    contactPerson: "",
  },

  addons: [],

  priceBreakdown: null,
  isCalculatingPrice: false,
  priceError: null,

  bookingReference: null,
  bookingStatus: "Draft",

  isSubmitting: false,
  isOpeningPayment: false,
  isConfirmed: false,

  paymentSessionId: null,
  submissionError: null,
  paymentError: null,
};

export const RitualBookingProvider = ({
  children,
  initialService = null,
  serviceType = null,
}) => {
  const { user } = useSelector((state) => state.auth || {});

  const resolvedServiceType =
    serviceType ||
    (initialService?.dailyRitualHours != null || initialService?.ritualType === "YAGYA"
      ? "YAGYA"
      : (Array.isArray(initialService?.availableCounts) && initialService.availableCounts.length > 0) ||
        initialService?.serviceType === "JAPA" ||
        initialService?.ritualType === "JAPA"
      ? "JAPA"
      : "PUJA");

  const [currentStep, setCurrentStep] = useState(INITIAL_STATE.currentStep);
  const [service, setServiceState] = useState(initialService);
  const [configuration, setConfiguration] = useState(() =>
    getDefaultConfiguration(initialService, resolvedServiceType)
  );
  const [yajmanDetails, setYajmanDetails] = useState(() => ({
    ...INITIAL_STATE.yajmanDetails,
    name: user?.fullName || "",
    mobile: user?.phone || "",
    email: user?.email || "",
  }));
  const [sankalpDetails, setSankalpDetails] = useState(() => ({
    ...INITIAL_STATE.sankalpDetails,
    purpose: initialService?.purposeSummary || initialService?.purpose || "",
  }));
  const [familyMembers, setFamilyMembers] = useState(INITIAL_STATE.familyMembers);
  const [locationDetails, setLocationDetails] = useState(INITIAL_STATE.locationDetails);
  const [addons, setAddonsState] = useState(INITIAL_STATE.addons);

  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);

  const [bookingReference, setBookingReference] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("Draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningPayment, setIsOpeningPayment] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Phase 4B.4B Payment verification, recovery, and authoritative confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isRecoveringPayment, setIsRecoveringPayment] = useState(false);
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState("idle");

  const [paymentSessionId, setPaymentSessionId] = useState(INITIAL_STATE.paymentSessionId);
  const [submissionError, setSubmissionError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Stale request cancellation controller ref
  const abortControllerRef = useRef(null);

  // ---------------------------------------------------------------------------
  // ACTIVE BOOKING RECOVERY ON MOUNT (PHASE 4B.4B)
  // Checks localStorage for veda_active_ritual_booking.
  // Queries backend for authoritative booking status. Never trusts localStorage alone.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const recoverStoredBooking = async () => {
      const storedRef = localStorage.getItem(RITUAL_STORAGE_KEY);
      if (!storedRef || typeof storedRef !== "string") return;

      const trimmedRef = storedRef.trim();
      if (
        !trimmedRef.startsWith("VEDA-PUJA-") &&
        !trimmedRef.startsWith("VEDA-YAGYA-") &&
        !trimmedRef.startsWith("VEDA-JAPA-")
      ) {
        localStorage.removeItem(RITUAL_STORAGE_KEY);
        return;
      }

      setIsRecoveringPayment(true);
      try {
        const res = await ritualBookingService.getBookingStatus(trimmedRef);
        if (res?.success && res?.data) {
          const booking = res.data;

          if (booking.bookingStatus === "Confirmed" && booking.paymentStatus === "Paid") {
            setBookingReference(booking.bookingReference);
            setBookingStatus("Confirmed");
            setConfirmedBooking(booking);
            setIsConfirmed(true);
            setPaymentVerificationStatus("confirmed");
            localStorage.removeItem(RITUAL_STORAGE_KEY);
          } else if (booking.bookingStatus === "Cancelled") {
            localStorage.removeItem(RITUAL_STORAGE_KEY);
            setBookingStatus("Cancelled");
            setPaymentVerificationStatus("cancelled");
            setPaymentError("Previous ceremony booking was cancelled.");
          } else {
            // Pending booking awaiting payment
            setBookingReference(booking.bookingReference);
            setBookingStatus(booking.bookingStatus || "Pending");
            setPaymentVerificationStatus("pending");
            if (booking.amount) {
              setPriceBreakdown((prev) => prev || { totalAmount: booking.amount, basePrice: booking.amount });
            }
            // Move directly to step 7 (Review) to allow payment completion
            setCurrentStep(6);
          }
        } else {
          localStorage.removeItem(RITUAL_STORAGE_KEY);
        }
      } catch (err) {
        console.warn("Could not recover ritual booking from storage:", err);
        if (err.response?.status === 404) {
          localStorage.removeItem(RITUAL_STORAGE_KEY);
        }
      } finally {
        setIsRecoveringPayment(false);
      }
    };

    recoverStoredBooking();
  }, []);

  // Prefill authenticated user information if available, without overwriting user-entered edits
  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        setYajmanDetails((prev) => ({
          ...prev,
          name: prev.name || user.fullName || "",
          mobile: prev.mobile || user.phone || "",
          email: prev.email || user.email || "",
        }));
      });
    }
  }, [user]);

  /**
   * Sets or updates service data and re-initializes configuration if appropriate
   */
  const setService = useCallback(
    (newService) => {
      setServiceState(newService);
      if (newService) {
        setConfiguration((prev) => {
          const defaults = getDefaultConfiguration(newService, resolvedServiceType);
          return {
            ...defaults,
            ...prev,
            durationSelected: prev.durationSelected || defaults.durationSelected,
            durationHours: prev.durationHours || defaults.durationHours,
            arrangementMode: prev.arrangementMode || defaults.arrangementMode,
            locationType: prev.locationType || defaults.locationType,
            days: prev.days || defaults.days,
            dailyHours: prev.dailyHours || defaults.dailyHours,
            completionDate: prev.completionDate || defaults.completionDate,
            selectedPricingTier: prev.selectedPricingTier || defaults.selectedPricingTier,
            japaCount: prev.japaCount || defaults.japaCount,
            panditCount: prev.panditCount || defaults.panditCount,
            minimumPandits: prev.minimumPandits || defaults.minimumPandits,
            recommendedPandits: prev.recommendedPandits || defaults.recommendedPandits,
            maximumPandits: prev.maximumPandits || defaults.maximumPandits,
            dailyCapacityPerPandit: prev.dailyCapacityPerPandit || defaults.dailyCapacityPerPandit,
            totalDailyCapacity: prev.totalDailyCapacity || defaults.totalDailyCapacity,
            requiredDays: prev.requiredDays || defaults.requiredDays,
            selectedVariant: prev.selectedVariant || defaults.selectedVariant,
          };
        });
        setSankalpDetails((prev) => ({
          ...prev,
          purpose: prev.purpose || newService.purposeSummary || newService.purpose || "",
        }));
      }
    },
    [resolvedServiceType],
  );

  /**
   * Action helpers for state slices
   */
  const updateConfiguration = useCallback((partial) => {
    setConfiguration((prev) => ({ ...prev, ...partial }));
    // Clear relevant errors on field update
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(partial).forEach((key) => {
        delete updated[key];
      });
      return updated;
    });
  }, []);

  const updateYajmanDetails = useCallback((partial) => {
    setYajmanDetails((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(partial).forEach((key) => {
        delete updated[key];
      });
      return updated;
    });
  }, []);

  const updateSankalpDetails = useCallback((partial) => {
    setSankalpDetails((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(partial).forEach((key) => {
        delete updated[key];
      });
      return updated;
    });
  }, []);

  const updateLocationDetails = useCallback((partial) => {
    setLocationDetails((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(partial).forEach((key) => {
        delete updated[key];
      });
      return updated;
    });
  }, []);

  const setAddons = useCallback((newAddons) => {
    setAddonsState(Array.isArray(newAddons) ? newAddons : []);
  }, []);

  const addFamilyMember = useCallback(() => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        name: "",
        relation: "Spouse",
        gender: "Male",
        dob: "",
        gotra: "",
        rashi: "",
        nakshatra: "",
      },
    ]);
  }, []);

  const updateFamilyMember = useCallback((index, partial) => {
    setFamilyMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, ...partial } : member))
    );
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[`familyMember_${index}_name`];
      delete updated.familyMembers;
      return updated;
    });
  }, []);

  const removeFamilyMember = useCallback((index) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith("familyMember_")) {
          delete updated[key];
        }
      });
      delete updated.familyMembers;
      return updated;
    });
  }, []);

  const toggleAddon = useCallback((addonItem) => {
    setAddonsState((prev) => {
      const exists = prev.some((item) => item.type === addonItem.type);
      if (exists) {
        return prev.filter((item) => item.type !== addonItem.type);
      } else {
        return [...prev, { type: addonItem.type, name: addonItem.name }];
      }
    });
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  /**
   * Validates active step before advancing
   */
  const validateStep = useCallback(
    (stepIndex) => {
      const stepErrors = {};

      if (stepIndex === 0) {
        if (resolvedServiceType === "YAGYA") {
          // Step 1: Yagya Configuration Validation
          if (!service) {
            stepErrors.service = "Yagya ceremony details are missing.";
          }
          if (!configuration.days || Number(configuration.days) < 1) {
            stepErrors.days = "Please select the Yagya duration in days.";
          }
          if (
            Array.isArray(service?.availableDurations) &&
            service.availableDurations.length > 0 &&
            !service.availableDurations.map(Number).includes(Number(configuration.days))
          ) {
            stepErrors.days = "Selected duration is not supported for this Yagya.";
          }
          if (!configuration.dailyHours || Number(configuration.dailyHours) <= 0) {
            stepErrors.dailyHours = "Daily ritual hours specification is missing.";
          }
          const minP = Number(service?.panditRequirement?.minPandits) || 1;
          if (!configuration.panditCount || Number(configuration.panditCount) < minP) {
            stepErrors.panditCount = `This Yagya requires a minimum of ${minP} officiating Vedic scholars.`;
          }
          if (!configuration.bookingDate) {
            stepErrors.bookingDate = "Please select a Yagya commencement date.";
          } else {
            const today = new Date().toISOString().split("T")[0];
            if (configuration.bookingDate < today) {
              stepErrors.bookingDate = "Yagya commencement date cannot be in the past.";
            }
          }
          if (!configuration.bookingTime || !configuration.bookingTime.trim()) {
            stepErrors.bookingTime = "Please enter or select a daily commencement time.";
          }
          if (!configuration.arrangementMode) {
            stepErrors.arrangementMode = "Please select an arrangement mode.";
          }
          if (!configuration.locationType) {
            stepErrors.locationType = "Please select a location classification.";
          }
          if (isCalculatingPrice) {
            stepErrors.pricing = "Please wait while authoritative Dakshina is being calculated.";
          }
          if (priceError) {
            stepErrors.pricing = "Please resolve the price calculation error before continuing.";
          }
        } else if (resolvedServiceType === "JAPA") {
          // Step 1: Japa Configuration Validation
          if (!service) {
            stepErrors.service = "Japa ceremony details are missing.";
          }
          if (!configuration.japaCount) {
            stepErrors.japaCount = "Please select a Japa recitation count.";
          } else {
            const allowedCounts = Array.isArray(service?.availableCounts)
              ? service.availableCounts.map(Number)
              : Array.isArray(service?.variants)
              ? service.variants.map((v) => Number(v.count))
              : [];
            if (allowedCounts.length > 0 && !allowedCounts.includes(Number(configuration.japaCount))) {
              stepErrors.japaCount = "Selected recitation count is not offered for this Japa.";
            }
          }
          const minP = Number(configuration.minimumPandits || service?.minimumPandits || 1);
          const maxP = Number(configuration.maximumPandits || service?.maximumPandits || 21);
          if (!configuration.panditCount || Number(configuration.panditCount) < minP) {
            stepErrors.panditCount = `This Japa requires a minimum of ${minP} officiating Vedic scholars.`;
          } else if (Number(configuration.panditCount) > maxP) {
            stepErrors.panditCount = `Maximum permitted scholars for this service is ${maxP}.`;
          }
          if (!configuration.bookingDate) {
            stepErrors.bookingDate = "Please select a Japa commencement date.";
          } else {
            const today = new Date().toISOString().split("T")[0];
            if (configuration.bookingDate < today) {
              stepErrors.bookingDate = "Japa commencement date cannot be in the past.";
            }
          }
          if (!configuration.bookingTime || !configuration.bookingTime.trim()) {
            stepErrors.bookingTime = "Please enter or select a daily chanting commencement time.";
          }
          if (!configuration.arrangementMode) {
            stepErrors.arrangementMode = "Please select an arrangement mode.";
          }
          if (!configuration.locationType) {
            stepErrors.locationType = "Please select a location classification.";
          }
          if (isCalculatingPrice) {
            stepErrors.pricing = "Please wait while authoritative Dakshina is being calculated.";
          }
          if (priceError) {
            stepErrors.pricing = "Please resolve the price calculation error before continuing.";
          }
        } else {
          // Step 1: Puja Configuration Validation
          if (!configuration.durationSelected) {
            stepErrors.durationSelected = "Please select a ceremony duration.";
          }
          if (!configuration.bookingDate) {
            stepErrors.bookingDate = "Please select a ceremony date.";
          } else {
            const today = new Date().toISOString().split("T")[0];
            if (configuration.bookingDate < today) {
              stepErrors.bookingDate = "Ceremony date cannot be in the past.";
            }
          }
          if (!configuration.bookingTime || !configuration.bookingTime.trim()) {
            stepErrors.bookingTime = "Please enter or select a ceremony time.";
          }
          if (!configuration.panditCount || configuration.panditCount < 1) {
            stepErrors.panditCount = "At least 1 officiating purohit is required.";
          }
          if (!configuration.arrangementMode) {
            stepErrors.arrangementMode = "Please select an arrangement mode.";
          }
          if (!configuration.locationType) {
            stepErrors.locationType = "Please select a location type.";
          }
          if (isCalculatingPrice) {
            stepErrors.pricing = "Please wait while authoritative Dakshina is being calculated.";
          }
          if (priceError) {
            stepErrors.pricing = "Please resolve the price calculation error before continuing.";
          }
        }
      } else if (stepIndex === 1) {
        // Step 2: Yajman Details Validation
        if (!yajmanDetails.name || !yajmanDetails.name.trim()) {
          stepErrors.name = "Please enter the primary Yajman full name.";
        }
        if (!yajmanDetails.mobile || !yajmanDetails.mobile.trim()) {
          stepErrors.mobile = "Please provide a valid mobile number for ceremony updates.";
        } else {
          const cleanPhone = yajmanDetails.mobile.replace(/\D/g, "");
          if (cleanPhone.length < 10) {
            stepErrors.mobile = "Please enter a valid 10-digit mobile number.";
          }
        }
        if (yajmanDetails.email && yajmanDetails.email.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(yajmanDetails.email.trim())) {
            stepErrors.email = "Please enter a valid email address.";
          }
        }
      } else if (stepIndex === 2) {
        // Step 3: Sankalp Validation
        const hasPurpose = sankalpDetails.purpose && sankalpDetails.purpose.trim();
        const hasIntention = sankalpDetails.mainIntention && sankalpDetails.mainIntention.trim();
        if (!hasPurpose && !hasIntention) {
          stepErrors.mainIntention = "Please specify a ritual purpose or main intention for the Sankalp.";
        }
      } else if (stepIndex === 3) {
        // Step 4: Family Members Validation
        // Family members are optional, but if rows exist, each must have a valid name
        familyMembers.forEach((member, idx) => {
          if (!member.name || !member.name.trim()) {
            stepErrors[`familyMember_${idx}_name`] = "Please enter the family member's name.";
            stepErrors.familyMembers = "Please ensure all added family members have a valid name.";
          }
        });
      } else if (stepIndex === 4) {
        // Step 5: Location Validation
        const locType = configuration.locationType || configuration.arrangementMode;
        if (locType === "customer_home" || locType === "other") {
          if (!locationDetails.address || !locationDetails.address.trim()) {
            stepErrors.address = "Please enter the ceremony address.";
          }
          if (!locationDetails.city || !locationDetails.city.trim()) {
            stepErrors.city = "Please enter the city.";
          }
          if (!locationDetails.state || !locationDetails.state.trim()) {
            stepErrors.state = "Please enter the state.";
          }
          if (!locationDetails.pincode || !locationDetails.pincode.trim()) {
            stepErrors.pincode = "Please enter the postal pincode.";
          } else {
            const cleanPincode = locationDetails.pincode.replace(/\D/g, "");
            if (cleanPincode.length !== 6) {
              stepErrors.pincode = "Please enter a valid 6-digit postal pincode.";
            }
          }
        } else if (locType === "temple") {
          if (!locationDetails.address || !locationDetails.address.trim()) {
            stepErrors.address = "Please enter the temple address or landmark.";
          }
          if (!locationDetails.city || !locationDetails.city.trim()) {
            stepErrors.city = "Please enter the city where the mandir is located.";
          }
        }
        // remote, veda_structure, kashi do not require customer-entered physical addresses
      } else if (stepIndex === 5) {
        // Step 6: Addons are optional; returns true
      } else if (stepIndex === 6) {
        // Step 7: Review step
      }

      setErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    },
    [
      resolvedServiceType,
      service,
      configuration,
      yajmanDetails,
      sankalpDetails,
      familyMembers,
      locationDetails,
      isCalculatingPrice,
      priceError,
    ],
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetBooking = useCallback(() => {
    localStorage.removeItem(RITUAL_STORAGE_KEY);
    setCurrentStep(INITIAL_STATE.currentStep);
    setConfiguration(getDefaultConfiguration(service));
    setYajmanDetails(INITIAL_STATE.yajmanDetails);
    setSankalpDetails(INITIAL_STATE.sankalpDetails);
    setFamilyMembers(INITIAL_STATE.familyMembers);
    setLocationDetails(INITIAL_STATE.locationDetails);
    setAddonsState(INITIAL_STATE.addons);
    setPriceBreakdown(null);
    setPriceError(null);
    setBookingReference(null);
    setBookingStatus("Draft");
    setPaymentSessionId(null);
    setSubmissionError(null);
    setPaymentError(null);
    setErrors({});
    setIsSubmitting(false);
    setIsOpeningPayment(false);
    setIsConfirmed(false);
    setConfirmedBooking(null);
    setIsVerifyingPayment(false);
    setIsRecoveringPayment(false);
    setPaymentVerificationStatus("idle");
  }, [service]);

  /**
   * Validates all wizard steps sequentially.
   * If any step fails, switches the wizard to that step and scrolls up.
   */
  const validateAllSteps = useCallback(() => {
    for (let step = 0; step <= 4; step++) {
      const isValid = validateStep(step);
      if (!isValid) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return { isValid: false, failedStep: step };
      }
    }
    return { isValid: true };
  }, [validateStep]);

  /**
   * Maps current context state into the exact payload expected by POST /api/ritual-bookings.
   */
  const buildBookingPayload = useCallback(() => {
    if (!service?.id) return null;

    const locType = configuration.locationType || configuration.arrangementMode || "remote";
    let venueDetails = {};
    if (locType !== "remote") {
      venueDetails = {
        address: locationDetails.address || "",
        city: locationDetails.city || "",
        state: locationDetails.state || "",
        country: locationDetails.country || "India",
        pincode: locationDetails.pincode || "",
        landmark: locationDetails.landmark || "",
        contactPerson: locationDetails.contactPerson || "",
      };
    }

    const cleanYajman = {
      name: (yajmanDetails.name || "").trim(),
      phone: (yajmanDetails.mobile || "").trim(),
      mobile: (yajmanDetails.mobile || "").trim(),
      email: yajmanDetails.email ? yajmanDetails.email.trim() : null,
      gender: yajmanDetails.gender || "Male",
      dob: yajmanDetails.dob || null,
      timeOfBirth: yajmanDetails.timeOfBirth || null,
      placeOfBirth: yajmanDetails.placeOfBirth || null,
      gotra: yajmanDetails.gotra || null,
      rashi: yajmanDetails.rashi || null,
      nakshatra: yajmanDetails.nakshatra || null,
      fatherName: yajmanDetails.fatherName || null,
      motherName: yajmanDetails.motherName || null,
      spouseName: yajmanDetails.spouseName || null,
    };

    const cleanSankalp = {
      purpose: sankalpDetails.purpose || "",
      mainIntention: sankalpDetails.mainIntention || "",
      specificSankalp: sankalpDetails.specificSankalp || "",
      specialRequest: sankalpDetails.specialRequest || "",
      specialInstructions: sankalpDetails.specialInstructions || "",
    };

    const cleanFamily = (familyMembers || [])
      .filter((m) => m && m.name && m.name.trim())
      .map((m) => ({
        name: m.name.trim(),
        relation: m.relation || "Other",
        gender: m.gender || "Male",
        dob: m.dob || null,
        gotra: m.gotra || null,
        rashi: m.rashi || null,
        nakshatra: m.nakshatra || null,
      }));

    const cleanAddons = (addons || []).map((a) => ({
      type: a.type,
      name: a.name,
    }));

    if (resolvedServiceType === "YAGYA") {
      return {
        serviceType: "YAGYA",
        serviceId: service.id,
        serviceSlug: service.slug,
        bookingDate: configuration.bookingDate,
        bookingTime: configuration.bookingTime,
        durationSelected: configuration.durationSelected || `${configuration.days} Days`,
        days: configuration.days,
        dailyHours: configuration.dailyHours,
        durationHours: configuration.durationHours,
        completionDate: configuration.completionDate,
        panditCount: Math.max(
          Number(service?.panditRequirement?.minPandits) || 1,
          Number(configuration.panditCount) || 1,
        ),
        arrangementMode: configuration.arrangementMode || "kashi",
        locationType: locType,
        selectedPricingTier: configuration.selectedPricingTier || null,
        venueDetails,
        yajmanDetails: cleanYajman,
        sankalpDetails: cleanSankalp,
        familyMembers: cleanFamily,
        addons: cleanAddons,

        configuration: {
          date: configuration.bookingDate,
          timeSlot: configuration.bookingTime,
          durationSelected: configuration.durationSelected || `${configuration.days} Days`,
          days: configuration.days,
          dailyHours: configuration.dailyHours,
          durationHours: configuration.durationHours,
          completionDate: configuration.completionDate,
          panditCount: Math.max(
            Number(service?.panditRequirement?.minPandits) || 1,
            Number(configuration.panditCount) || 1,
          ),
          arrangementMode: configuration.arrangementMode || "kashi",
          selectedPricingTier: configuration.selectedPricingTier || null,
        },
        location: {
          locationType: locType,
          venueDetails,
        },
        yajman: cleanYajman,
        sankalp: cleanSankalp,
      };
    }

    if (resolvedServiceType === "JAPA") {
      const requiredDays = priceBreakdown?.requiredDays || configuration.requiredDays || 3;
      const completionDate = priceBreakdown?.completionDate || configuration.completionDate || "";

      return {
        serviceType: "JAPA",
        serviceId: service.id,
        serviceSlug: service.slug,
        bookingDate: configuration.bookingDate,
        commencementDate: configuration.bookingDate,
        bookingTime: configuration.bookingTime,
        timeSlot: configuration.bookingTime,
        japaCount: Number(configuration.japaCount),
        panditCount: Number(configuration.panditCount),
        requiredDays,
        completionDate,
        dailyHours: configuration.dailyHours || service.dailyHours || null,
        arrangementMode: configuration.arrangementMode || "kashi",
        locationType: locType,
        venueDetails,
        yajmanDetails: cleanYajman,
        sankalpDetails: {
          ...cleanSankalp,
          japaMetadata: {
            japaCount: Number(configuration.japaCount),
            panditCount: Number(configuration.panditCount),
            dailyCapacityPerPandit: priceBreakdown?.dailyCapacityPerPandit || configuration.dailyCapacityPerPandit || 2000,
            totalDailyCapacity: priceBreakdown?.totalDailyCapacity || configuration.totalDailyCapacity,
            requiredDays,
            commencementDate: configuration.bookingDate,
            completionDate,
            pricingSource: priceBreakdown?.pricingSource || "JAPA_VARIANT_PRICING",
          },
        },
        familyMembers: cleanFamily,
        addons: cleanAddons,

        configuration: {
          commencementDate: configuration.bookingDate,
          date: configuration.bookingDate,
          timeSlot: configuration.bookingTime,
          japaCount: Number(configuration.japaCount),
          panditCount: Number(configuration.panditCount),
          requiredDays,
          completionDate,
          dailyHours: configuration.dailyHours || service.dailyHours || null,
          arrangementMode: configuration.arrangementMode || "kashi",
        },
        location: {
          locationType: locType,
          venueDetails,
        },
        yajman: cleanYajman,
        sankalp: cleanSankalp,
      };
    }

    return {
      serviceType: "PUJA",
      serviceId: service.id,
      serviceSlug: service.slug,
      bookingDate: configuration.bookingDate,
      bookingTime: configuration.bookingTime,
      durationSelected: configuration.durationSelected || "",
      durationHours: configuration.durationHours || null,
      panditCount: Math.max(1, Number(configuration.panditCount) || 1),
      arrangementMode: configuration.arrangementMode || "remote",
      locationType: locType,
      venueDetails,
      yajmanDetails: cleanYajman,
      sankalpDetails: cleanSankalp,
      familyMembers: cleanFamily,
      addons: cleanAddons,

      // Phase 2 backend controller structure mappings
      configuration: {
        date: configuration.bookingDate,
        timeSlot: configuration.bookingTime,
        durationSelected: configuration.durationSelected || "",
        durationHours: configuration.durationHours || null,
        panditCount: Math.max(1, Number(configuration.panditCount) || 1),
        arrangementMode: configuration.arrangementMode || "remote",
      },
      location: {
        locationType: locType,
        venueDetails,
      },
      yajman: cleanYajman,
      sankalp: cleanSankalp,
    };
  }, [
    resolvedServiceType,
    service,
    configuration,
    locationDetails,
    yajmanDetails,
    sankalpDetails,
    familyMembers,
    addons,
  ]);

  /**
   * Orchestrates Phase 4B.4A:
   * 1. Validates all steps
   * 2. Creates ritual booking record (or reuses existing bookingReference to prevent duplicates)
   * 3. Creates Cashfree payment order
   * 4. Loads Cashfree JS SDK in sandbox mode
   * 5. Opens Cashfree checkout modal
   */
  const initiateBookingAndPayment = useCallback(async () => {
    if (isSubmitting || isOpeningPayment) return;

    // 1. Final client-side validation
    const validation = validateAllSteps();
    if (!validation.isValid) {
      return;
    }

    setSubmissionError(null);
    setPaymentError(null);

    let activeBookingRef = bookingReference;

    // 2. Create ritual booking if not already created (Duplicate submission protection)
    if (!activeBookingRef) {
      try {
        setIsSubmitting(true);
        const payload = buildBookingPayload();
        if (!payload) {
          throw new Error("Missing ceremony service details to initiate booking.");
        }

        const createRes = await ritualBookingService.createRitualBooking(payload);
        const createdData = createRes?.data || createRes;
        activeBookingRef = createdData?.bookingReference;

        if (!activeBookingRef) {
          throw new Error(createRes?.message || "Failed to receive booking reference from server.");
        }

        setBookingReference(activeBookingRef);
        setBookingStatus(createdData?.bookingStatus || "Pending");
        if (createdData?.pricing) {
          setPriceBreakdown(createdData.pricing);
        }
        // Persist only non-sensitive booking reference for reload recovery
        localStorage.setItem(RITUAL_STORAGE_KEY, activeBookingRef);
      } catch (err) {
        console.error("Ritual booking creation failed:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create ritual booking. Please review your details and try again.";
        setSubmissionError(msg);
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Ensure reference is safely persisted for recovery
      localStorage.setItem(RITUAL_STORAGE_KEY, activeBookingRef);
    }

    // 3. Create Cashfree payment order
    let sessionId;
    try {
      setIsOpeningPayment(true);
      const orderRes = await ritualBookingService.createPaymentOrder(activeBookingRef);

      // Check if backend resolved this booking as already paid
      if (orderRes?.alreadyPaid) {
        setIsConfirmed(true);
        setBookingStatus("Confirmed");
        setPaymentVerificationStatus("confirmed");
        localStorage.removeItem(RITUAL_STORAGE_KEY);
        if (orderRes.data) {
          setConfirmedBooking(orderRes.data);
        }
        setIsOpeningPayment(false);
        return;
      }

      const orderData = orderRes?.data || orderRes;
      sessionId = orderData?.paymentSessionId;
      if (!sessionId) {
        throw new Error(orderRes?.message || "Failed to receive payment session from gateway.");
      }
      setPaymentSessionId(sessionId);
    } catch (err) {
      console.error("Cashfree order creation failed:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to initiate payment session. Please retry.";
      setPaymentError(msg);
      setIsOpeningPayment(false);
      return;
    }

    // 4. Load Cashfree JS SDK in sandbox mode
    let cashfree;
    try {
      const { load } = await import("@cashfreepayments/cashfree-js");
      cashfree = await load({ mode: "sandbox" });
    } catch (err) {
      console.error("Cashfree SDK loading failed:", err);
      setPaymentError("Payment gateway could not be loaded. Please check your internet connection.");
      setIsOpeningPayment(false);
      return;
    }

    if (!cashfree) {
      setPaymentError("Payment gateway initialisation failed. Please try again.");
      setIsOpeningPayment(false);
      return;
    }

    // 5. Open Cashfree checkout modal
    try {
      setIsOpeningPayment(false);
      const checkoutResult = await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      });
      console.log("Cashfree checkout returned:", checkoutResult);
    } catch (err) {
      console.error("Cashfree checkout modal returned with notice:", err);
      setPaymentError("Payment window was closed or interrupted. You can retry secure payment.");
    }

    // 6. Server-Side Authoritative Payment Verification (Phase 4B.4B)
    // Never confirm based solely on client callback; verify directly with server.
    setIsVerifyingPayment(true);
    setPaymentVerificationStatus("verifying");
    try {
      const verifyResult = await ritualBookingService.verifyPayment(activeBookingRef);
      console.log("Payment verification response:", verifyResult);

      if (verifyResult?.success && verifyResult?.confirmed) {
        setBookingStatus("Confirmed");
        setPaymentVerificationStatus("confirmed");
        setIsConfirmed(true);
        localStorage.removeItem(RITUAL_STORAGE_KEY);
        setConfirmedBooking({
          bookingReference: activeBookingRef,
          bookingStatus: "Confirmed",
          paymentStatus: "Paid",
          serviceName: service?.name,
          bookingDate: configuration.bookingDate,
          bookingTime: configuration.bookingTime,
          customerName: yajmanDetails?.name,
          amount: verifyResult.data?.amount,
          ...verifyResult.data,
        });
        return;
      } else if (
        verifyResult?.orderStatus === "ACTIVE" ||
        verifyResult?.data?.paymentStatus === "Pending"
      ) {
        setBookingStatus("Pending");
        setPaymentVerificationStatus("pending");
        setPaymentError(
          verifyResult?.message ||
            "Payment is still being processed with the payment gateway. You can check status below.",
        );
      } else {
        setBookingStatus("Pending");
        setPaymentVerificationStatus("failed");
        setPaymentError(
          verifyResult?.message ||
            "Payment was not completed. You can retry secure payment without re-entering your details.",
        );
      }
    } catch (verifyErr) {
      console.error("Payment verification API error:", verifyErr);
      setPaymentVerificationStatus("pending");
      setPaymentError(
        verifyErr.response?.data?.message ||
          "Payment status could not be confirmed yet. Please click 'Check Payment Status'.",
      );
    } finally {
      setIsVerifyingPayment(false);
    }
  }, [
    resolvedServiceType,
    isSubmitting,
    isOpeningPayment,
    validateAllSteps,
    bookingReference,
    buildBookingPayload,
    service,
    configuration.bookingDate,
    configuration.bookingTime,
    yajmanDetails,
  ]);

  /**
   * Synchronizes / verifies authoritative payment status for pending reservations.
   * Uses GET /api/payments/booking-status/:bookingReference
   */
  const checkPaymentStatus = useCallback(async () => {
    const ref = bookingReference;
    if (!ref) return;

    setIsVerifyingPayment(true);
    setPaymentError(null);
    try {
      const res = await ritualBookingService.getBookingStatus(ref);
      if (res?.success && res?.data) {
        const data = res.data;
        if (data.bookingStatus === "Confirmed" && data.paymentStatus === "Paid") {
          setBookingStatus("Confirmed");
          setPaymentVerificationStatus("confirmed");
          setIsConfirmed(true);
          setConfirmedBooking(data);
          localStorage.removeItem(RITUAL_STORAGE_KEY);
        } else if (data.bookingStatus === "Cancelled") {
          setBookingStatus("Cancelled");
          setPaymentVerificationStatus("cancelled");
          setPaymentError("This ritual booking has been cancelled.");
        } else {
          setBookingStatus(data.bookingStatus || "Pending");
          setPaymentVerificationStatus("pending");
          setPaymentError("Payment is still being processed with the payment gateway.");
        }
      }
    } catch (err) {
      console.error("Payment status check failed:", err);
      setPaymentError(
        err.response?.data?.message ||
          "Payment status could not be confirmed yet. Please try again.",
      );
    } finally {
      setIsVerifyingPayment(false);
    }
  }, [bookingReference]);

  /**
   * Triggers authoritative price calculation with backend.
   * Cancels in-flight requests to prevent stale out-of-order responses.
   */
  const calculatePrice = useCallback(
    async (overrideConfig = null) => {
      const activeConfig = overrideConfig || configuration;

      if (!service?.id || !service?.slug) {
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      await Promise.resolve();
      setIsCalculatingPrice(true);
      setPriceError(null);

      let payload;
      if (resolvedServiceType === "YAGYA") {
        payload = {
          serviceType: "YAGYA",
          serviceId: service.id,
          serviceSlug: service.slug,
          durationSelected: activeConfig.durationSelected || `${activeConfig.days} Days`,
          days: activeConfig.days,
          dailyHours: activeConfig.dailyHours,
          durationHours: activeConfig.durationHours,
          panditCount: Math.max(
            Number(service?.panditRequirement?.minPandits) || 1,
            Number(activeConfig.panditCount) || 1
          ),
          arrangementMode: activeConfig.arrangementMode || "kashi",
          locationType: activeConfig.locationType || activeConfig.arrangementMode || "kashi",
          addons: addons || [],
        };
      } else if (resolvedServiceType === "JAPA") {
        payload = {
          serviceType: "JAPA",
          serviceId: service.id,
          serviceSlug: service.slug,
          japaCount: Number(activeConfig.japaCount),
          panditCount: Number(activeConfig.panditCount),
          commencementDate: activeConfig.bookingDate || activeConfig.commencementDate || null,
          dailyHours: activeConfig.dailyHours || service.dailyHours || null,
          arrangementMode: activeConfig.arrangementMode || "kashi",
          locationType: activeConfig.locationType || activeConfig.arrangementMode || "kashi",
          addons: addons || [],
        };
      } else {
        payload = {
          serviceType: "PUJA",
          serviceId: service.id,
          serviceSlug: service.slug,
          durationHours: activeConfig.durationHours || null,
          durationSelected: activeConfig.durationSelected || "",
          panditCount: Math.max(1, Number(activeConfig.panditCount) || 1),
          arrangementMode: activeConfig.arrangementMode || "kashi",
          locationType: activeConfig.locationType || activeConfig.arrangementMode || "kashi",
          addons: addons || [],
        };
      }

      try {
        const response = await ritualBookingService.calculatePrice(payload, controller.signal);
        const breakdown = response?.data || response;
        setPriceBreakdown(breakdown);
        if (resolvedServiceType === "JAPA" && breakdown?.completionDate) {
          setConfiguration((prev) => ({
            ...prev,
            completionDate: breakdown.completionDate,
            requiredDays: breakdown.requiredDays || prev.requiredDays,
            totalDailyCapacity: breakdown.totalDailyCapacity || prev.totalDailyCapacity,
          }));
        }
        setIsCalculatingPrice(false);
        setPriceError(null);
      } catch (err) {
        if (err.name === "AbortError" || err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }
        console.error("Ritual price calculation failed:", err);
        setPriceError(
          err.response?.data?.message || err.message || "Failed to calculate authoritative price",
        );
        setIsCalculatingPrice(false);
      }
    },
    [resolvedServiceType, service, configuration, addons],
  );

  // Automatically trigger price calculation when service and key parameters change
  useEffect(() => {
    if (!service?.id || !service?.slug) return;

    let isCancelled = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const runCalculation = async () => {
      await Promise.resolve();
      if (isCancelled) return;
      setIsCalculatingPrice(true);
      setPriceError(null);

      let payload;
      if (resolvedServiceType === "YAGYA") {
        payload = {
          serviceType: "YAGYA",
          serviceId: service.id,
          serviceSlug: service.slug,
          durationSelected: configuration.durationSelected || `${configuration.days} Days`,
          days: configuration.days,
          dailyHours: configuration.dailyHours,
          durationHours: configuration.durationHours,
          panditCount: Math.max(
            Number(service?.panditRequirement?.minPandits) || 1,
            Number(configuration.panditCount) || 1
          ),
          arrangementMode: configuration.arrangementMode || "kashi",
          locationType: configuration.locationType || configuration.arrangementMode || "kashi",
          addons: addons || [],
        };
      } else if (resolvedServiceType === "JAPA") {
        payload = {
          serviceType: "JAPA",
          serviceId: service.id,
          serviceSlug: service.slug,
          japaCount: Number(configuration.japaCount),
          panditCount: Number(configuration.panditCount),
          commencementDate: configuration.bookingDate || configuration.commencementDate || null,
          dailyHours: configuration.dailyHours || service.dailyHours || null,
          arrangementMode: configuration.arrangementMode || "kashi",
          locationType: configuration.locationType || configuration.arrangementMode || "kashi",
          addons: addons || [],
        };
      } else {
        payload = {
          serviceType: "PUJA",
          serviceId: service.id,
          serviceSlug: service.slug,
          durationHours: configuration.durationHours || null,
          durationSelected: configuration.durationSelected || "",
          panditCount: Math.max(1, Number(configuration.panditCount) || 1),
          arrangementMode: configuration.arrangementMode || "kashi",
          locationType: configuration.locationType || configuration.arrangementMode || "kashi",
          addons: addons || [],
        };
      }

      try {
        const response = await ritualBookingService.calculatePrice(payload, controller.signal);
        if (!isCancelled) {
          const breakdown = response?.data || response;
          setPriceBreakdown(breakdown);
          if (resolvedServiceType === "JAPA" && breakdown?.completionDate) {
            setConfiguration((prev) => ({
              ...prev,
              completionDate: breakdown.completionDate,
              requiredDays: breakdown.requiredDays || prev.requiredDays,
              totalDailyCapacity: breakdown.totalDailyCapacity || prev.totalDailyCapacity,
            }));
          }
          setIsCalculatingPrice(false);
          setPriceError(null);
        }
      } catch (err) {
        if (
          !isCancelled &&
          err.name !== "AbortError" &&
          err.name !== "CanceledError" &&
          err.code !== "ERR_CANCELED"
        ) {
          console.error("Ritual price calculation failed:", err);
          setPriceError(
            err.response?.data?.message || err.message || "Failed to calculate authoritative price",
          );
          setIsCalculatingPrice(false);
        }
      }
    };

    runCalculation();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [
    resolvedServiceType,
    service?.id,
    service?.slug,
    configuration.durationHours,
    configuration.durationSelected,
    configuration.panditCount,
    configuration.arrangementMode,
    configuration.locationType,
    configuration.days,
    configuration.dailyHours,
    configuration.japaCount,
    configuration.bookingDate,
    configuration.commencementDate,
    service?.panditRequirement?.minPandits,
    addons,
  ]);

  const value = {
    serviceType: resolvedServiceType,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,

    service,
    setService,

    configuration,
    updateConfiguration,

    yajmanDetails,
    updateYajmanDetails,

    sankalpDetails,
    updateSankalpDetails,

    familyMembers,
    setFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,

    locationDetails,
    updateLocationDetails,

    addons,
    setAddons,
    toggleAddon,

    priceBreakdown,
    isCalculatingPrice,
    priceError,
    calculatePrice,

    bookingReference,
    setBookingReference,
    bookingStatus,
    setBookingStatus,

    paymentSessionId,
    setPaymentSessionId,
    submissionError,
    setSubmissionError,
    paymentError,
    setPaymentError,

    isSubmitting,
    setIsSubmitting,
    isOpeningPayment,
    setIsOpeningPayment,
    isConfirmed,
    setIsConfirmed,

    confirmedBooking,
    isVerifyingPayment,
    isRecoveringPayment,
    paymentVerificationStatus,
    checkPaymentStatus,

    errors,
    clearError,
    validateStep,
    validateAllSteps,
    buildBookingPayload,
    initiateBookingAndPayment,

    resetBooking,
  };

  return <RitualBookingContext.Provider value={value}>{children}</RitualBookingContext.Provider>;
};

export const useRitualBooking = () => {
  const context = useContext(RitualBookingContext);
  if (!context) {
    throw new Error("useRitualBooking must be used within a RitualBookingProvider");
  }
  return context;
};

export default RitualBookingContext;
