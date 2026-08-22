import { useState } from "react";
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

const SankalpForm = ({ selectedPackage, pujaTitle }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    gotra: "",
    fatherName: "",
    motherName: "",
    city: "",
    country: "India",
    sankalpPurpose: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="sankalp-form" className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[960px]">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-[700px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            VEDIC SANKALP REGISTRATION
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            Sankalp Details
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            These sacred details will be ritually chanted by the Acharya in Kashi during your ritual.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-white p-6 shadow-[0_20px_50px_rgba(43,36,29,0.08)] sm:p-10">
          
          {/* Selected Package Banner */}
          {selectedPackage && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e6cca0] bg-[#fffaf0] p-4 text-[#2b241d]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Selected Participation Tier
                </span>
                <p className="font-serif text-[18px] font-bold">
                  {selectedPackage.name} Plan • {pujaTitle}
                </p>
              </div>
              <div className="text-right">
                <span className="font-serif text-[24px] font-bold text-[#d4872b]">
                  {selectedPackage.formattedPrice}
                </span>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="py-10 text-center animate-in fade-in duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-[26px] font-bold text-[#2b241d]">
                Sankalp Details Recorded
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] text-[#685c4f]">
                Thank you, <strong>{formData.fullName || "Devotee"}</strong>. Your sacred intention for {pujaTitle} has been previewed. In production, this proceeds directly to the secure checkout step.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-6 py-2.5 text-[13px] font-bold text-[#2b241d]"
              >
                Edit Sankalp Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Contact Details */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name * */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Full Name <span className="text-[#c77722]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Chandra Sharma"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>

                {/* Mobile Number * */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    WhatsApp / Mobile Number <span className="text-[#c77722]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                  <span className="mt-1 block text-[11px] text-[#8c7e6c]">
                    Ritual video updates will be shared on this number.
                  </span>
                </div>
              </div>

              {/* Email & Gotra */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Email (Optional) */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Email Address <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>

                {/* Gotra */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Gotra <span className="text-[11px] font-normal text-[#8c7e6c]">(Leave blank if unknown)</span>
                  </label>
                  <input
                    type="text"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleChange}
                    placeholder="e.g. Bharadwaj / Kashyap"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>
              </div>

              {/* Lineage / Parents Names */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Father's Name */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Father's Name <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Father's full name"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Mother's Name <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    placeholder="Mother's full name"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* City */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    City / Town
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai / New Delhi / London"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>
              </div>

              {/* Purpose / Sankalp */}
              <div>
                <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Specific Purpose / Intention for Sankalp <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  name="sankalpPurpose"
                  value={formData.sankalpPurpose}
                  onChange={handleChange}
                  placeholder="Mention any specific wish or prayer e.g. health recovery for parents, career promotion, marriage obstacles removal, child's education..."
                  className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] py-4 text-[14px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(234,177,44,0.28)] transition-all duration-300 hover:brightness-105"
                >
                  <span>Submit Sankalp & Proceed ({selectedPackage?.formattedPrice || "₹1,001"})</span>
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Reassurance text */}
              <div className="flex items-center justify-center gap-2 pt-2 text-center text-[12px] text-[#75695c]">
                <ShieldCheck size={15} className="text-[#d4872b]" />
                <span>Your sacred information is kept strictly confidential and used solely for the Vedic ritual.</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
};

export default SankalpForm;
