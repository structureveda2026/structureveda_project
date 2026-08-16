import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import vishalImage from "../../../assets/images/e-3.jpg";

// Step components
import YourDetailsStep from "../components/booking/YourDetailsStep";
import BirthDetailsStep from "../components/booking/BirthDetailsStep";
import ConsultationPreferencesStep from "../components/booking/ConsultationPreferencesStep";
import ReviewStep from "../components/booking/ReviewStep";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import BookingSummary from "../components/booking/BookingSummary";

const STEPS = [
  { number: 1, label: "Your Details", shortLabel: "Details" },
  { number: 2, label: "Birth Details", shortLabel: "Birth" },
  { number: 3, label: "Consultation", shortLabel: "Consultation" },
  { number: 4, label: "Review", shortLabel: "Review" }
];

const VishalBooking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [bookingData, setBookingData] = useState({
    astrologer: {
      slug: "vishal-bhardwaj",
      name: "Vishal Bhardwaj",
      title: "Vedic Astrologer | Jyotish Consultant",
      specialization: "Vedic Astrology",
      location: "Kashi / Varanasi",
      experience: "10+ Years",
      image: vishalImage
    },
    consultation: {
      duration: 30,
      price: 1100,
      originalPrice: 1500,
      title: "30-Minute Personal Vedic Astrology Consultation"
    },
    user: {
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      country: "India",
      city: ""
    },
    birthDetails: {
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      birthTimeAccuracy: "yes"
    },
    preferences: {
      topics: [],
      mainQuestion: "",
      consultationMode: ""
    }
  });

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem("vishalBookingData");
    const savedStep = sessionStorage.getItem("vishalBookingStep");

    if (savedData) {
      try {
        setBookingData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved booking data");
      }
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem("vishalBookingData", JSON.stringify(bookingData));
    sessionStorage.setItem("vishalBookingStep", currentStep.toString());
  }, [bookingData, currentStep]);

  const updateBookingData = (section, data) => {
    setBookingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleBackToVishal = () => {
    navigate("/astrologers/vishal-bhardwaj");
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    sessionStorage.removeItem("vishalBookingData");
    sessionStorage.removeItem("vishalBookingStep");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isConfirmed) {
    return <BookingConfirmation bookingData={bookingData} onBackToVishal={handleBackToVishal} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 sm:py-12">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        {/* Back Button */}
        <button
          onClick={currentStep === 1 ? handleBackToVishal : handlePrevStep}
          className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[#E8D28A] transition-colors hover:text-[#C9A227]"
        >
          <ArrowLeft size={16} />
          {currentStep === 1 ? "Back to Vishal Bhardwaj" : "Back"}
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A227]">
            BOOK YOUR CONSULTATION
          </p>
          <h1 className="mt-3 font-serif text-[36px] text-[#F7F4ED] sm:text-[42px]">
            Book Your Consultation with
            <br />
            <span className="text-[#E8D28A]">Vishal Bhardwaj</span>
          </h1>
          <p className="mt-3 text-[15px] text-[#B8A88F]">
            30-Minute Personal Vedic Astrology Consultation
          </p>
        </div>

        {/* Astrologer Card */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-[600px] rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#C9A227]/30">
                <img
                  src={vishalImage}
                  alt="Vishal Bhardwaj"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-[20px] font-semibold text-[#F7F4ED]">
                  {bookingData.astrologer.name}
                </h3>
                <p className="mt-1 text-[13px] text-[#B8A88F]">
                  {bookingData.astrologer.title}
                </p>
                <p className="mt-1 text-[12px] text-[#8a7c6b]">
                  {bookingData.astrologer.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#8a7c6b]">{bookingData.consultation.duration} Minutes</p>
                <p className="text-[12px] text-[#8a7c6b]">Audio / Video</p>
                <p className="mt-2 font-serif text-[24px] font-semibold text-[#C9A227]">
                  ₹{bookingData.consultation.price}
                </p>
                <p className="text-[13px] text-[#8a7c6b] line-through">
                  ₹{bookingData.consultation.originalPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > step.number
                        ? "border-[#C9A227] bg-[#C9A227]"
                        : currentStep === step.number
                        ? "border-[#C9A227] bg-[#1E1A16]"
                        : "border-[#3a3026] bg-[#1E1A16]"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check size={20} className="text-[#121212]" />
                    ) : (
                      <span
                        className={`font-semibold ${
                          currentStep === step.number ? "text-[#C9A227]" : "text-[#8a7c6b]"
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-[12px] font-medium sm:block ${
                      currentStep === step.number ? "text-[#C9A227]" : "text-[#8a7c6b]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`mt-2 text-[11px] font-medium sm:hidden ${
                      currentStep === step.number ? "text-[#C9A227]" : "text-[#8a7c6b]"
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-12 sm:mx-4 sm:w-20 ${
                      currentStep > step.number ? "bg-[#C9A227]" : "bg-[#3a3026]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div>
            {currentStep === 1 && (
              <YourDetailsStep
                data={bookingData.user}
                onUpdate={(data) => updateBookingData("user", data)}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <BirthDetailsStep
                data={bookingData.birthDetails}
                onUpdate={(data) => updateBookingData("birthDetails", data)}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {currentStep === 3 && (
              <ConsultationPreferencesStep
                data={bookingData.preferences}
                onUpdate={(data) => updateBookingData("preferences", data)}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep
                bookingData={bookingData}
                onEdit={goToStep}
                onConfirm={handleConfirm}
                onPrev={handlePrevStep}
              />
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <BookingSummary bookingData={bookingData} currentStep={currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VishalBooking;
