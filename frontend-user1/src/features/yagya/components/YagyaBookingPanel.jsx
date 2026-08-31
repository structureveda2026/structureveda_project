import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Clock,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
} from "lucide-react";

const YagyaBookingPanel = ({ yagya }) => {
  if (!yagya) return null;

  const variants = yagya.variants || [
    {
      id: "var-standard",
      name: "11,000 Mantras",
      subtitle: "1 Day Ceremony",
      price: yagya.startingPrice || 2100,
      formattedPrice: yagya.formattedPrice || "₹2,100",
    },
  ];

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.isPopular)?.id || variants[0]?.id
  );

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  // Devotee Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    gotra: "",
    sankalpPurpose: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.fullName.trim()) {
      setFormError("Please enter the devotee's Full Name.");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setFormError("Please enter WhatsApp / Mobile number for ritual updates.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12px] font-medium text-[#75695c]">
        <Link to="/" className="hover:text-[#c77722]">
          Home
        </Link>
        <ChevronRight size={13} className="text-[#c5b59f]" />
        <Link to="/yagya" className="hover:text-[#c77722]">
          Vedic Yagyas
        </Link>
        <ChevronRight size={13} className="text-[#c5b59f]" />
        <span className="truncate text-[#2b241d] font-semibold">{yagya.name}</span>
      </nav>

      {/* 2. Category Pill */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
          <Sparkles size={11} className="text-[#c77722]" />
          {yagya.eyebrow || "VEDIC HOMA • KASHI"}
        </span>
      </div>

      {/* 3. Main Yagya Title */}
      <h1 className="font-serif text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2b241d] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
        {yagya.name}
      </h1>

      {/* 4. Tagline */}
      {yagya.tagline && (
        <p className="font-serif text-[15px] italic leading-snug text-[#9d5b12] sm:text-[16.5px]">
          &ldquo;{yagya.tagline}&rdquo;
        </p>
      )}

      {/* 5. Short Description */}
      <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#5e5143]">
        {yagya.description || yagya.shortDescription}
      </p>

      {/* 6. Metadata Info Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8d5b7] bg-[#fffaf0] px-3 py-1.5 text-[12px] font-semibold text-[#2b241d] shadow-2xs">
          <MapPin size={13} className="text-[#d4872b]" />
          <span>{yagya.location || "Kashi (Varanasi)"}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8d5b7] bg-[#fffaf0] px-3 py-1.5 text-[12px] font-semibold text-[#2b241d] shadow-2xs">
          <Clock size={13} className="text-[#d4872b]" />
          <span>{yagya.duration || "4 to 6 Hours"}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8d5b7] bg-[#fffaf0] px-3 py-1.5 text-[12px] font-semibold text-[#2b241d] shadow-2xs">
          <UserCheck size={13} className="text-[#d4872b]" />
          <span>{yagya.priestCount || "Vedic Acharyas"}</span>
        </div>
      </div>

      {/* 7. Social Proof */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-[#5e5143]">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-[#ecd5a8] bg-[#fbf0d9] px-2 py-0.5 text-[12px] font-bold text-[#9d5b12] shadow-2xs">
            <Star size={12} fill="#d4872b" className="text-[#d4872b]" />
            <span>{yagya.rating || "4.9"}</span>
          </span>
          <span className="font-semibold text-[#2b241d]">
            {yagya.reviewCount || "5.4K"} Reviews
          </span>
        </div>

        <span className="text-[#d6b8a0]">•</span>

        <div className="flex items-center gap-1.5 text-[#5e5143]">
          <Users size={14} className="text-[#d4872b]" />
          <span>
            <strong className="font-bold text-[#2b241d]">{yagya.bookingCount || "14K+"}</strong> devotees blessed
          </span>
        </div>
      </div>

      {/* =========================================================
          8. INTERACTIVE BOOKING / OPTIONS BOX
      ========================================================== */}
      <div className="rounded-[24px] border-2 border-[#e6cca0] bg-[#fffdfa] p-5 sm:p-6 shadow-sm">
        {submitted ? (
          /* Confirmation Preview State */
          <div className="py-4 text-center animate-in fade-in duration-300">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              Sankalp Prepared
            </h3>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-[#685c4f]">
              Thank you, <strong>{formData.fullName}</strong>. Your intention for the <strong>{selectedVariant.name}</strong> ({selectedVariant.formattedPrice}) has been recorded.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-6 py-2 text-[12.5px] font-bold text-[#2b241d] transition hover:bg-white"
            >
              Modify Sankalp Details
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit} className="space-y-4">
            {/* Variant Option Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                Select Yagya Anushthan Option
              </label>

              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
                {variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`relative flex flex-col justify-between rounded-2xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? "border-[#d4872b] bg-[#fffaf0] shadow-sm ring-1 ring-[#eab12c]"
                          : "border-[#ead8b8] bg-[#fffdf9] hover:border-[#d4872b]/60"
                      }`}
                    >
                      {v.isPopular && (
                        <span className="absolute -top-2.5 right-2 rounded-full bg-[#eab12c] px-2 py-0.5 text-[9px] font-bold uppercase text-[#1c1308]">
                          Popular
                        </span>
                      )}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[13.5px] font-bold text-[#2b241d]">
                            {v.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={15} className="text-[#d4872b]" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#7a6d5f]">
                          {v.subtitle}
                        </p>
                      </div>
                      <div className="mt-2 pt-1 border-t border-[#f0e2cd]">
                        <span className="font-serif text-[15px] font-bold text-[#b36c1e]">
                          {v.formattedPrice}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-[12.5px] text-red-700">
                {formError}
              </div>
            )}

            {/* Devotee Input Fields */}
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Devotee Full Name <span className="text-[#c77722]">*</span>
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Shivam Sharma"
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-2.5 text-[13px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  WhatsApp / Mobile <span className="text-[#c77722]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-2.5 text-[13px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Gotra <span className="text-[10px] font-normal text-[#8c7e6c]">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="gotra"
                  value={formData.gotra}
                  onChange={handleInputChange}
                  placeholder="e.g. Kashyap / Bharadwaj"
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-2.5 text-[13px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Sankalp Intention <span className="text-[10px] font-normal text-[#8c7e6c]">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="sankalpPurpose"
                  value={formData.sankalpPurpose}
                  onChange={handleInputChange}
                  placeholder="e.g. Health recovery, peace"
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-2.5 text-[13px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                />
              </div>
            </div>

            {/* Price & Primary CTA Row */}
            <div className="flex flex-col gap-3.5 border-t border-[#ead8b8] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                  Selected Participation
                </span>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-serif text-[28px] font-bold text-[#2b241d]">
                    {selectedVariant.formattedPrice}
                  </span>
                  <span className="text-[11.5px] font-medium text-[#7a6d5f]">
                    (Incl. Samagri & Dakshina)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] hover:-translate-y-0.5"
              >
                <span>Book This Yagya</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 9. Trust & Deliverables Highlights */}
      <div className="grid grid-cols-2 gap-2 text-[11.5px] font-semibold text-[#5e5143] pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#d4872b]" />
          <span>Authentic Vedic Vidhi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-[#d4872b]" />
          <span>Name & Gotra Sankalp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#d4872b]" />
          <span>Video Proof on WhatsApp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-[#d4872b]" />
          <span>Sanctified Bhasma Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default YagyaBookingPanel;
