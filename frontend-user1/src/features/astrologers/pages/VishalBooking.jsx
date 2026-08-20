import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  Star,
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  Languages,
  Video,
  PhoneCall,
  FileText,
  Info,
  ChevronDown,
  ArrowRight,
  Lock,
  Headphones,
} from "lucide-react";
import vishalImage from "../../../assets/images/vishal.png";

const PACKAGES = [
  {
    id: "essential",
    duration: "30 Minutes",
    title: "Essential Vedic Clarity",
    price: 1100,
    originalPrice: 1500,
    description: "1 core life topic + Kundali overview & immediate remedies",
    popular: false,
  },
  {
    id: "complete",
    duration: "60 Minutes (1 Hr)",
    title: "Complete Kundali Guidance",
    price: 2100,
    originalPrice: 2800,
    description: "Janam Kundali + Navamsha (D-9) + 12-Month transit forecast",
    popular: true,
  },
  {
    id: "premium",
    duration: "90 Minutes",
    title: "Deep-Dive Life & Destiny",
    price: 5100,
    originalPrice: 6500,
    description: "Exhaustive Kundali + D-10/D-9/D-7 + 3-Year Dasha roadmap",
    popular: false,
  },
  {
    id: "comprehensive",
    duration: "3 Hours",
    title: "Family & Enterprise Session",
    price: 11000,
    originalPrice: 14000,
    description: "Up to 3 family charts + Kundali Milan + Written blueprint",
    popular: false,
  },
];

const TIME_SLOTS = [
  "10:00 AM - 10:30 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "03:30 PM - 04:00 PM",
  "05:00 PM - 05:30 PM",
  "06:30 PM - 07:00 PM",
  "08:00 PM - 08:30 PM",
];

const LANGUAGES = [
  "Hindi (हिंदी)",
  "English",
  "Sanskrit (संस्कृत)",
  "Gujarati (ગુજરાતી)",
  "Marathi (मराठी)",
  "Bengali (বাংলা)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
];

const TOPICS = [
  "Career & Job Growth",
  "Marriage & Compatibility",
  "Wealth & Financial Yogas",
  "Business & Investment Muhurat",
  "Health & Dosha Remedies",
  "Family Harmony",
];

const VishalBooking = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  // Package State
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male", // 'Male' | 'Female'
    dateOfBirth: "2000-01-01",
    placeOfBirth: "Varanasi, Uttar Pradesh",
    birthHour: "12",
    birthMinute: "00",
    birthAmPm: "PM",
    isTimeUnknown: false,
    reportLanguage: "Hindi (हिंदी)",
    whatsappNumber: "",
    isPhoneVerified: false,
    email: "",
    consultationDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    consultationTime: TIME_SLOTS[0],
    consultationMode: "Video Call (Google Meet / Zoom)",
    selectedTopics: ["Career & Job Growth"],
    addOnCouple: false, // +3100
    addOnReport: false, // +500
    addOnExpress: false, // +400
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Calculate pricing
  const basePrice = selectedPackage.price;
  const addOnCouplePrice = formData.addOnCouple ? 3100 : 0;
  const addOnReportPrice = formData.addOnReport ? 500 : 0;
  const addOnExpressPrice = formData.addOnExpress ? 400 : 0;
  const totalPrice = basePrice + addOnCouplePrice + addOnReportPrice + addOnExpressPrice;

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenderToggle = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleAmPmToggle = (birthAmPm) => {
    setFormData((prev) => ({ ...prev, birthAmPm }));
  };

  const handleTopicToggle = (topic) => {
    setFormData((prev) => {
      const exists = prev.selectedTopics.includes(topic);
      if (exists) {
        return {
          ...prev,
          selectedTopics: prev.selectedTopics.filter((t) => t !== topic),
        };
      }
      return {
        ...prev,
        selectedTopics: [...prev.selectedTopics, topic],
      };
    });
  };

  const handleSendOtp = () => {
    if (!formData.whatsappNumber || formData.whatsappNumber.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp phone number first.");
      return;
    }
    setOtpSent(true);
    setIsVerifyingOtp(true);
  };

  const handleVerifyOtp = () => {
    if (otpValue.trim() === "1234" || otpValue.trim().length >= 4) {
      setFormData((prev) => ({ ...prev, isPhoneVerified: true }));
      setIsVerifyingOtp(false);
      setOtpSent(false);
    } else {
      alert("Please enter a valid OTP code (e.g. 1234).");
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Please provide your Full Name.");
      return;
    }
    if (!formData.placeOfBirth.trim()) {
      alert("Please provide your Place of Birth for accurate Kundali calculation.");
      return;
    }

    // Generate reference ID and confirm
    const refId = "VB-" + Math.floor(100000 + Math.random() * 900000);
    setBookingReference(refId);
    setIsConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDetails = () => {
    navigate("/astrologers/vishal-bhardwaj");
  };

  // ----------------------------------------------------
  // CONFIRMATION SUCCESS VIEW
  // ----------------------------------------------------
  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-[#fffaf0] py-12 sm:py-16">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[30px] border-2 border-[#d4872b] bg-white p-8 shadow-[0_20px_60px_rgba(212,135,43,0.18)] sm:p-12">
            {/* Success Badge */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f8edd8] text-[#d4872b] shadow-[0_4px_20px_rgba(212,135,43,0.25)]">
                <CheckCircle2 size={48} strokeWidth={2.2} />
              </div>

              <span className="mt-6 inline-block rounded-full bg-[#eab12c] px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1c1308]">
                Booking Confirmed
              </span>

              <h1 className="mt-3 font-serif text-[34px] font-semibold text-[#2b241d] sm:text-[42px]">
                Your Consultation is Scheduled!
              </h1>

              <p className="mt-2 text-[14.5px] text-[#685c4f]">
                Booking Reference: <strong className="font-mono text-[#b36c1e]">{bookingReference}</strong>
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="mt-8 rounded-2xl border border-[#ead8b8] bg-[#fffdf9] p-6">
              <div className="flex items-center gap-4 border-b border-[#f0e2cd] pb-5">
                <img
                  src={vishalImage}
                  alt="Vishal Bhardwaj"
                  className="h-14 w-14 rounded-full border-2 border-[#eab12c] object-cover object-top"
                />
                <div>
                  <h3 className="font-serif text-[20px] font-semibold text-[#2b241d]">
                    Astrologer Vishal Bhardwaj
                  </h3>
                  <p className="text-[12.5px] text-[#8c7e6c]">
                    Vedic Astrologer • Kashi / Varanasi
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#8c7e6c]">Package</p>
                  <p className="font-serif text-[15px] font-semibold text-[#2b241d]">{selectedPackage.title}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#8c7e6c]">Date & Time</p>
                  <p className="font-serif text-[15px] font-semibold text-[#2b241d]">{formData.consultationDate}</p>
                  <p className="text-[12px] text-[#685c4f]">{formData.consultationTime}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#8c7e6c]">Total Paid</p>
                  <p className="font-serif text-[18px] font-bold text-[#c77722]">₹{totalPrice.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#f0e2cd] pt-4 text-[13px] text-[#554739]">
                <p>
                  <strong>Seeker:</strong> {formData.fullName} ({formData.gender}) • <strong>DOB:</strong> {formData.dateOfBirth} at {formData.isTimeUnknown ? "Time Unknown" : `${formData.birthHour}:${formData.birthMinute} ${formData.birthAmPm}`} ({formData.placeOfBirth})
                </p>
                <p className="mt-1">
                  <strong>Language:</strong> {formData.reportLanguage} • <strong>Mode:</strong> {formData.consultationMode}
                </p>
              </div>
            </div>

            {/* Meeting Link Information */}
            <div className="mt-6 rounded-2xl border border-[#e6cca0] bg-[#f8edd8]/60 p-5 text-center">
              <p className="text-[13.5px] font-medium leading-relaxed text-[#5a4d40]">
                A direct meeting link and confirmation message have been sent to your WhatsApp number: <strong className="text-[#2b241d]">+91 {formData.whatsappNumber || "Registered Number"}</strong> and email.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleBackToDetails}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_8px_20px_rgba(234,177,44,0.25)] transition-all hover:bg-[#dfa420]"
              >
                <span>Return to Astrologer Profile</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3 text-[14px] font-semibold text-[#2b241d] transition-all hover:border-[#eab12c] hover:bg-[#fffaf0]"
              >
                Download Summary Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SINGLE-PAGE CHECKOUT / BOOKING VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fffaf0] py-8 sm:py-12">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackToDetails}
            className="group flex items-center gap-2 rounded-full border border-[#ead8b8] bg-white px-4 py-2 text-[13px] font-semibold text-[#5c4f42] shadow-sm transition-all hover:border-[#d4872b] hover:text-[#c77722]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Profile</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[12px] font-medium text-[#75695c] sm:flex">
              <ShieldCheck size={16} className="text-[#d4872b]" />
              100% Encrypted & Private
            </span>
          </div>
        </div>

        {/* Page Title & Package Quick Switcher */}
        <div className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
            Online Kundali Consultation
          </p>
          <h1 className="mt-2 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            Book Consultation with <span className="text-[#c77722]">Vishal Bhardwaj</span>
          </h1>

          {/* Quick Package Selector Row */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg)}
                  className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-[#d4872b] bg-gradient-to-b from-[#fff7e6] to-[#fffdf9] shadow-[0_8px_25px_rgba(212,135,43,0.18)] ring-2 ring-[#eab12c]/40"
                      : "border-[#ead8b8] bg-white hover:border-[#d4872b]/70 hover:shadow-sm"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-[#eab12c] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#1c1308] shadow-sm">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                        {pkg.duration}
                      </span>
                      {isSelected && <CheckCircle2 size={16} className="text-[#d4872b]" />}
                    </div>
                    <p className="mt-1 font-serif text-[16px] font-semibold text-[#2b241d]">
                      {pkg.title}
                    </p>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2 border-t border-[#f0e2cd] pt-2">
                    <span className="font-serif text-[20px] font-bold text-[#2b241d]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[12px] text-[#9c8e7b] line-through">
                      ₹{pkg.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Main Form + Sticky Order Summary Grid */}
        <form onSubmit={handlePayNow} className="grid items-start gap-8 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
          {/* ============================================================
              LEFT: DETAILS REQUIRED FOR YOUR KUNDLI (MATCHING SCREENSHOT)
          ============================================================= */}
          <div className="rounded-[28px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_10px_35px_rgba(80,60,30,0.06)] sm:p-9">
            <div className="mb-7 flex items-center justify-between border-b border-[#f0e2cd] pb-5">
              <div>
                <h2 className="font-serif text-[26px] font-semibold text-[#2b241d]">
                  Details Required for Your Kundli
                </h2>
                <p className="mt-1 text-[13px] text-[#75695c]">
                  Accurate birth details ensure exact Lagna and planetary degree calculation.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Row 1: Full Name + Gender */}
              <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr]">
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Full Name <span className="text-[#c77722]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[14px] font-medium text-[#2b241d] outline-none transition-all placeholder:text-[#a89d91] hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                    />
                  </div>
                </div>

                {/* Gender Toggle Buttons */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Gender <span className="text-[#c77722]">*</span>
                  </label>
                  <div className="grid h-[48px] grid-cols-2 gap-2 rounded-xl border border-[#d6b8a0] bg-[#fffdfa] p-1">
                    <button
                      type="button"
                      onClick={() => handleGenderToggle("Male")}
                      className={`flex items-center justify-center rounded-lg text-[13.5px] font-semibold transition-all ${
                        formData.gender === "Male"
                          ? "bg-[#eab12c] text-[#1c1308] shadow-sm"
                          : "text-[#685c4f] hover:bg-[#f8edd8]/50"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderToggle("Female")}
                      className={`flex items-center justify-center rounded-lg text-[13.5px] font-semibold transition-all ${
                        formData.gender === "Female"
                          ? "bg-[#eab12c] text-[#1c1308] shadow-sm"
                          : "text-[#685c4f] hover:bg-[#f8edd8]/50"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Date of Birth + Place of Birth + Time of Birth */}
              <div className="grid gap-5 sm:grid-cols-3">
                {/* Date of Birth */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Date of Birth <span className="text-[#c77722]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                    />
                  </div>
                </div>

                {/* Place of Birth */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Place of Birth <span className="text-[#c77722]">*</span>
                  </label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    required
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    placeholder="Search and select place of birth"
                    className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all placeholder:text-[#a89d91] hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                  />
                </div>

                {/* Time of Birth */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="flex items-center gap-1 text-[13px] font-semibold text-[#2b241d]">
                      <span>Time of Birth</span>
                      <Info size={13} className="text-[#8c7e6c]" />
                    </label>
                  </div>

                  <div className="flex h-[48px] items-center gap-1.5 rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-2">
                    <input
                      type="text"
                      maxLength={2}
                      name="birthHour"
                      disabled={formData.isTimeUnknown}
                      value={formData.isTimeUnknown ? "--" : formData.birthHour}
                      onChange={handleInputChange}
                      className="w-8 text-center text-[14px] font-bold text-[#2b241d] outline-none disabled:opacity-50"
                      placeholder="12"
                    />
                    <span className="font-bold text-[#8c7e6c]">:</span>
                    <input
                      type="text"
                      maxLength={2}
                      name="birthMinute"
                      disabled={formData.isTimeUnknown}
                      value={formData.isTimeUnknown ? "--" : formData.birthMinute}
                      onChange={handleInputChange}
                      className="w-8 text-center text-[14px] font-bold text-[#2b241d] outline-none disabled:opacity-50"
                      placeholder="00"
                    />

                    {/* AM / PM Toggle */}
                    <div className="ml-auto flex gap-1 rounded-lg bg-[#f8edd8] p-0.5">
                      <button
                        type="button"
                        disabled={formData.isTimeUnknown}
                        onClick={() => handleAmPmToggle("AM")}
                        className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                          formData.birthAmPm === "AM" && !formData.isTimeUnknown
                            ? "bg-[#eab12c] text-[#1c1308]"
                            : "text-[#75695c]"
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        disabled={formData.isTimeUnknown}
                        onClick={() => handleAmPmToggle("PM")}
                        className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                          formData.birthAmPm === "PM" && !formData.isTimeUnknown
                            ? "bg-[#eab12c] text-[#1c1308]"
                            : "text-[#75695c]"
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>

                  {/* Not Sure Checkbox */}
                  <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-[12px] text-[#75695c]">
                    <input
                      type="checkbox"
                      name="isTimeUnknown"
                      checked={formData.isTimeUnknown}
                      onChange={handleInputChange}
                      className="h-3.5 w-3.5 rounded border-[#d6b8a0] text-[#d4872b] focus:ring-[#d4872b]"
                    />
                    <span>Not Sure / Exact Time Unknown</span>
                  </label>
                </div>
              </div>

              {/* Row 3: Report Language + WhatsApp Number + Email */}
              <div className="grid gap-5 sm:grid-cols-3">
                {/* Report Language */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Report Language <span className="text-[#c77722]">*</span>
                  </label>
                  <select
                    name="reportLanguage"
                    value={formData.reportLanguage}
                    onChange={handleInputChange}
                    className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-3 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp Number with +91 */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    WhatsApp Number <span className="text-[#c77722]">*</span>
                  </label>
                  <div className="relative flex h-[48px] items-center rounded-xl border border-[#d6b8a0] bg-[#fffdfa] transition-all hover:border-[#d4872b] focus-within:border-[#d4872b] focus-within:ring-4 focus-within:ring-[#d4872b]/10">
                    <span className="flex items-center gap-1 border-r border-[#d6b8a0] px-3 text-[13px] font-bold text-[#554739]">
                      <span>🇮🇳 +91</span>
                    </span>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      required
                      maxLength={10}
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="WhatsApp Number"
                      className="w-full bg-transparent px-3 text-[13.5px] font-medium text-[#2b241d] outline-none placeholder:text-[#a89d91]"
                    />
                  </div>

                  {/* Verify Now CTA */}
                  <div className="mt-1 flex items-center justify-end">
                    {formData.isPhoneVerified ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700">
                        <Check size={12} /> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11.5px] font-bold text-[#b36c1e] underline underline-offset-2 hover:text-[#2b241d]"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>

                  {/* Inline OTP Verification Modal/Box */}
                  {isVerifyingOtp && !formData.isPhoneVerified && (
                    <div className="mt-2 rounded-xl border border-[#eab12c] bg-[#fffaf0] p-2.5">
                      <p className="text-[11px] text-[#554739]">
                        Enter 4-digit code sent to +91 {formData.whatsappNumber}:
                      </p>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          placeholder="1234"
                          className="h-8 w-24 rounded-lg border border-[#d6b8a0] px-2 text-center font-mono text-[13px] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="rounded-lg bg-[#eab12c] px-3 text-[12px] font-bold text-[#1c1308]"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all placeholder:text-[#a89d91] hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                  />
                </div>
              </div>

              {/* Row 4: Consultation Date + Consultation Time */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Consultation Date */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Consultation Date <span className="text-[#c77722]">*</span>
                  </label>
                  <input
                    type="date"
                    name="consultationDate"
                    required
                    value={formData.consultationDate}
                    onChange={handleInputChange}
                    className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                  />
                </div>

                {/* Consultation Time */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#2b241d]">
                    Consultation Time Slot <span className="text-[#c77722]">*</span>
                  </label>
                  <select
                    name="consultationTime"
                    value={formData.consultationTime}
                    onChange={handleInputChange}
                    className="h-[48px] w-full rounded-xl border border-[#d6b8a0] bg-[#fffdfa] px-4 text-[13.5px] font-medium text-[#2b241d] outline-none transition-all hover:border-[#d4872b] focus:border-[#d4872b] focus:ring-4 focus:ring-[#d4872b]/10"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Consultation Mode */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#2b241d]">
                  Preferred Consultation Mode
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { mode: "Video Call (Google Meet / Zoom)", icon: Video, desc: "Face-to-face interactive video guidance" },
                    { mode: "Audio Call (WhatsApp / Direct)", icon: PhoneCall, desc: "Private direct voice consultation" },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = formData.consultationMode === m.mode;
                    return (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, consultationMode: m.mode }))}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                          isSelected
                            ? "border-[#d4872b] bg-[#fffaf0] shadow-sm"
                            : "border-[#ead8b8] bg-[#fffdfa] hover:border-[#d4872b]/60"
                        }`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-[#eab12c] text-[#1c1308]" : "bg-[#f8edd8] text-[#c77722]"}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2b241d]">{m.mode}</p>
                          <p className="text-[11px] text-[#75695c]">{m.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Guidance Topics */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#2b241d]">
                  Primary Consultation Topics (Select what you want to ask)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => {
                    const isChecked = formData.selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleTopicToggle(topic)}
                        className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all ${
                          isChecked
                            ? "border-[#d4872b] bg-[#eab12c] text-[#1c1308] shadow-sm"
                            : "border-[#d6b8a0] bg-white text-[#5c4f42] hover:border-[#d4872b]"
                        }`}
                      >
                        {isChecked ? `✓ ${topic}` : `+ ${topic}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Add-ons (Matching Screenshot) */}
              <div className="border-t border-[#f0e2cd] pt-5">
                <p className="text-[13px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Add-ons (Optional)
                </p>

                <div className="mt-3 space-y-3">
                  {/* Couple Consultation */}
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#ead8b8] bg-[#fffdf9] p-3.5 transition-colors hover:border-[#d4872b]">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="addOnCouple"
                        checked={formData.addOnCouple}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[#d6b8a0] text-[#d4872b] focus:ring-[#d4872b]"
                      />
                      <div>
                        <span className="text-[13.5px] font-semibold text-[#2b241d]">
                          Couple & Matchmaking Consultation
                        </span>
                        <p className="text-[11.5px] text-[#75695c]">
                          Includes detailed compatibility analysis of partner's Kundali
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-[15px] font-bold text-[#b36c1e]">
                      +₹3,100
                    </span>
                  </label>

                  {/* Detailed Written PDF Report */}
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#ead8b8] bg-[#fffdf9] p-3.5 transition-colors hover:border-[#d4872b]">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="addOnReport"
                        checked={formData.addOnReport}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[#d6b8a0] text-[#d4872b] focus:ring-[#d4872b]"
                      />
                      <div>
                        <span className="text-[13.5px] font-semibold text-[#2b241d]">
                          Comprehensive Written Kundali PDF Summary
                        </span>
                        <p className="text-[11.5px] text-[#75695c]">
                          Detailed post-consultation astrological document & remedy guide
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-[15px] font-bold text-[#b36c1e]">
                      +₹500
                    </span>
                  </label>

                  {/* Express Priority Booking */}
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#ead8b8] bg-[#fffdf9] p-3.5 transition-colors hover:border-[#d4872b]">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="addOnExpress"
                        checked={formData.addOnExpress}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[#d6b8a0] text-[#d4872b] focus:ring-[#d4872b]"
                      />
                      <div>
                        <span className="text-[13.5px] font-semibold text-[#2b241d]">
                          Priority Instant Slot Confirmation
                        </span>
                        <p className="text-[11.5px] text-[#75695c]">
                          Guaranteed priority timing queue with Vishal Bhardwaj
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-[15px] font-bold text-[#b36c1e]">
                      +₹400
                    </span>
                  </label>
                </div>
              </div>

              {/* Terms & Conditions line */}
              <p className="pt-2 text-[12px] text-[#75695c]">
                By clicking "Pay Now", I agree to the{" "}
                <a href="/terms" className="font-semibold text-[#b36c1e] underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="font-semibold text-[#b36c1e] underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* ============================================================
              RIGHT: ORDER SUMMARY CARD (STICKY - MATCHING SCREENSHOT)
          ============================================================= */}
          <div className="sticky top-24 space-y-6">
            <div className="overflow-hidden rounded-[26px] border-2 border-[#d4872b]/50 bg-gradient-to-b from-[#fffaf0] via-[#fffdf9] to-[#fcf4e4] p-6 shadow-[0_16px_40px_rgba(212,135,43,0.12)]">
              {/* Header */}
              <h3 className="font-serif text-[22px] font-semibold text-[#2b241d]">
                Order Summary
              </h3>

              {/* Astrologer Mini-Badge */}
              <div className="mt-4 flex items-center gap-3.5 border-b border-[#f0e2cd] pb-4">
                <img
                  src={vishalImage}
                  alt="Vishal Bhardwaj"
                  className="h-12 w-12 rounded-full border border-[#eab12c] object-cover object-top"
                />
                <div>
                  <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
                    Astrologer Vishal Bhardwaj
                  </h4>
                  <div className="flex items-center gap-2 text-[11.5px] text-[#75695c]">
                    <span className="font-bold text-[#c77722]">4.9 ★</span>
                    <span>•</span>
                    <span>Kashi / Varanasi</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mt-4 space-y-3 text-[13.5px]">
                <div className="flex justify-between text-[#554739]">
                  <span className="max-w-[220px]">
                    {selectedPackage.title} ({selectedPackage.duration})
                  </span>
                  <span className="font-semibold text-[#2b241d]">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {formData.addOnCouple && (
                  <div className="flex justify-between text-[#75695c]">
                    <span>Couple Consultation Add-on</span>
                    <span className="font-medium text-[#2b241d]">+₹3,100</span>
                  </div>
                )}

                {formData.addOnReport && (
                  <div className="flex justify-between text-[#75695c]">
                    <span>Written Kundali PDF Summary</span>
                    <span className="font-medium text-[#2b241d]">+₹500</span>
                  </div>
                )}

                {formData.addOnExpress && (
                  <div className="flex justify-between text-[#75695c]">
                    <span>Priority Express Booking Slot</span>
                    <span className="font-medium text-[#2b241d]">+₹400</span>
                  </div>
                )}

                <div className="border-t border-[#f0e2cd] pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[#2b241d]">
                      Total (Incl. GST)
                    </span>
                    <span className="font-serif text-[26px] font-bold text-[#c77722]">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Now Button (Matching Screenshot) */}
              <button
                type="submit"
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] py-4 text-[15px] font-bold text-[#1c1308] shadow-[0_8px_25px_rgba(234,177,44,0.35)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_12px_32px_rgba(234,177,44,0.45)]"
              >
                <Lock size={16} />
                <span>Pay Now (₹{totalPrice.toLocaleString("en-IN")})</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Selected Slot Information */}
              <div className="mt-4 rounded-xl border border-[#ead8b8] bg-[#f8edd8]/50 p-3 text-center text-[12px] text-[#685c4f]">
                <p>
                  📅 Slot: <strong>{formData.consultationDate}</strong> at <strong>{formData.consultationTime}</strong>
                </p>
              </div>
            </div>

            {/* Trust Badges Row (Matching Screenshot) */}
            <div className="flex items-center justify-between gap-2 px-2 text-center text-[11px] font-medium text-[#75695c]">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-[#d4872b]" />
                <span>10 Lakh+ Users</span>
              </div>
              <span className="text-[#d4872b]/40">✦</span>
              <div className="flex flex-col items-center gap-1">
                <Star size={18} fill="#d4872b" className="text-[#d4872b]" />
                <span>4.9/5 Rated</span>
              </div>
              <span className="text-[#d4872b]/40">✦</span>
              <div className="flex flex-col items-center gap-1">
                <Headphones size={18} className="text-[#d4872b]" />
                <span>24/7 Guidance</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VishalBooking;
