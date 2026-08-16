import { useState } from "react";
import { ArrowRight } from "lucide-react";

const YourDetailsStep = ({ data, onUpdate, onNext }) => {
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[+]?[\d\s-]{10,}$/.test(phone);
  };

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(data.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!data.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-8">
      <h2 className="font-serif text-[28px] text-[#F7F4ED]">Tell Us About You</h2>
      <p className="mt-2 text-[14px] text-[#B8A88F]">
        We'll use this information to contact you about your consultation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-[13px] font-medium text-[#E8D28A]">
            Full Name <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.fullName ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-[12px] text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-[#E8D28A]">
            Email Address <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.email ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-[13px] font-medium text-[#E8D28A]">
            Phone / WhatsApp Number <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.phone ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-[12px] text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[13px] font-medium text-[#E8D28A]">
            Gender <span className="text-[#8a7c6b]">(Optional)</span>
          </label>
          <div className="mt-3 flex flex-wrap gap-3">
            {["Male", "Female", "Prefer not to say"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleChange("gender", option)}
                className={`rounded-lg border-2 px-5 py-2.5 text-[13px] font-medium transition-all ${
                  data.gender === option
                    ? "border-[#C9A227] bg-[#C9A227] text-[#121212]"
                    : "border-[#3a3026] text-[#E8D28A] hover:border-[#C9A227]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-[13px] font-medium text-[#E8D28A]">
            Country <span className="text-[#C9A227]">*</span>
          </label>
          <select
            id="country"
            value={data.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.country ? "border-red-500" : "border-[#3a3026]"
            }`}
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-[12px] text-red-400">{errors.country}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-[13px] font-medium text-[#E8D28A]">
            City <span className="text-[#C9A227]">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Enter your city"
            className={`mt-2 w-full rounded-lg border-2 bg-[#121212] px-4 py-3 text-[14px] text-[#F7F4ED] placeholder-[#8a7c6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.city ? "border-red-500" : "border-[#3a3026]"
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-[12px] text-red-400">{errors.city}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-6 py-4 text-[14px] font-semibold text-[#121212] transition-all hover:bg-[#E8D28A]"
        >
          Continue to Birth Details
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
};

export default YourDetailsStep;
