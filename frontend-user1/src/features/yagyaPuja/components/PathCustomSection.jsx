import { useState } from "react";
import { Sparkles, ScrollText, CheckCircle2, ArrowRight, X, MessageSquareCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PathCustomSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    scriptureName: "",
    pathType: "Puranic Scripture",
    preferredDate: "",
    duration: "Single Session (2-4h)",
    days: "1 Day",
    location: "Kashi Shrines",
    pandits: "2 Pandits",
    sankalpa: "",
    specialRequirements: "",
    name: "",
    mobile: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setFormData({
        scriptureName: "",
        pathType: "Puranic Scripture",
        preferredDate: "",
        duration: "Single Session (2-4h)",
        days: "1 Day",
        location: "Kashi Shrines",
        pandits: "2 Pandits",
        sankalpa: "",
        specialRequirements: "",
        name: "",
        mobile: "",
        email: "",
      });
    }, 2800);
  };

  const workflowSteps = [
    { num: "01", label: "Custom Request", desc: "Submit your desired scripture, Stotra, or Granth parayan details." },
    { num: "02", label: "Admin Review", desc: "Senior Acharyas inspect the text chapters, verses, and authenticity." },
    { num: "03", label: "Ritual Configuration", desc: "Required Pandits, samagri, and daily chapter targets are outlined." },
    { num: "04", label: "Custom Quote", desc: "A transparent breakdown for priests, dakshina, and ritual logistics is shared." },
    { num: "05", label: "Customer Approval", desc: "Confirm your auspicious tithi, location (Kashi/Remote), and schedule." },
    { num: "06", label: "Payment", desc: "Secure token or full payment processed via future checkout gateway." },
    { num: "07", label: "Booking", desc: "Scholars are allocated and daily recitation is initiated." },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf3e3] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="overflow-hidden rounded-[30px] border border-[#d8b584] bg-gradient-to-r from-[#fbf5ea] via-[#f7ecd5] to-[#f4e2bf] p-8 shadow-[0_12px_36px_rgba(80,50,20,0.08)] sm:p-12 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Copy & CTA */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c49a62] bg-[#fdf8ee] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e5a1e]">
                <Sparkles size={12} className="text-[#c77722]" />
                <span>BESPOKE SCRIPTURE RECITATION</span>
              </div>

              <h2 className="mt-4 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
                Have a Specific Path in Mind?
              </h2>

              <p className="mt-3 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
                If you are looking for a specific scripture, Stotra, Granth or recitation that is not listed in our standard services, submit a Custom Path Request.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2b241d] px-7 py-3.5 text-[14px] font-semibold text-[#f7ecd5] shadow-[0_6px_18px_rgba(43,36,29,0.2)] transition hover:bg-[#a8641b] hover:text-white cursor-pointer"
                >
                  <ScrollText size={16} />
                  <span>Request Custom Path</span>
                </button>

                <Link
                  to="/book-consultation"
                  className="inline-flex items-center gap-2 rounded-full border border-[#b8956b] bg-white/70 px-6 py-3.5 text-[14px] font-semibold text-[#4e3c28] transition hover:bg-white"
                >
                  <span>Talk to an Astrologer</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 7-Stage Future Workflow Progression */}
            <div className="lg:col-span-6">
              <div className="rounded-[22px] border border-[#d6b78d] bg-[#fffdfa]/85 p-6 shadow-xs backdrop-blur-xs">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a571c]">
                  CUSTOM PATH ARCHITECTURE WORKFLOW
                </span>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {workflowSteps.map((step) => (
                    <div
                      key={step.num}
                      className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-2.5 text-[11.5px]"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#8a571c]">
                        <span>{step.num}.</span>
                        <span className="text-[#2b241d]">{step.label}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#6d5e4f]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Custom Path Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative my-8 w-full max-w-[620px] overflow-hidden rounded-[26px] border border-[#d8b584] bg-[#fffdfa] p-7 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-[#6b5947] hover:bg-[#f2e2cb] hover:text-[#2b241d] cursor-pointer"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcf1dc] text-[#1e6628]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                  Custom Path Request Submitted
                </h3>
                <p className="mx-auto mt-2 max-w-[400px] text-[13.5px] text-[#6d5c4a]">
                  Our Vedic scholars will review the scripture chapters, calculate required Pandit capacity, and contact you with a tailored plan.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                  BESPOKE RECITATION INQUIRY
                </span>
                <h3 className="mt-1 font-serif text-[23px] font-bold text-[#2b241d]">
                  Submit Custom Path Request
                </h3>
                <p className="mt-1 text-[13px] text-[#6d5c4a]">
                  Specify your desired sacred text, preferred format, and ritual arrangements.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-[12.5px]">
                  {/* Scripture Name & Type */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Scripture / Granth Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shiva Purana / Devi Gita"
                        value={formData.scriptureName}
                        onChange={(e) => setFormData({ ...formData, scriptureName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Scripture Type</label>
                      <select
                        value={formData.pathType}
                        onChange={(e) => setFormData({ ...formData, pathType: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>Puranic Scripture</option>
                        <option>Vedic Samhita / Suktam</option>
                        <option>Stotra Recitation</option>
                        <option>Upanishad Recitation</option>
                        <option>Itihasa (Ramayana / Mahabharata)</option>
                        <option>Other Granth</option>
                      </select>
                    </div>
                  </div>

                  {/* Format & Duration & Days */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Preferred Format</label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-2.5 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>Single Session</option>
                        <option>Same-Day Extended</option>
                        <option>Multi-Day Anushthan</option>
                        <option>Akhand (Continuous)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Number of Days</label>
                      <select
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-2.5 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>7 Days (Saptaha)</option>
                        <option>9 Days (Navah)</option>
                        <option>Custom Window</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Location</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-2.5 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>Kashi Shrines</option>
                        <option>Remote Service</option>
                        <option>Devotee Residence (Kashi)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Pandits */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Preferred Auspicious Date</label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Preferred Pandit Squad</label>
                      <select
                        value={formData.pandits}
                        onChange={(e) => setFormData({ ...formData, pandits: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>As Recommended by Acharya</option>
                        <option>2 Pandits</option>
                        <option>3–5 Pandits</option>
                        <option>7+ Pandits (Grand Parayan)</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Mishra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Mobile / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="anand@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sankalpa & Special Requirements */}
                  <div>
                    <label className="block font-semibold text-[#4e3c28]">Sankalpa Intention & Special Guidelines</label>
                    <textarea
                      rows={2}
                      placeholder="Mention Gotra, specific chapters, or personal intentions..."
                      value={formData.sankalpa}
                      onChange={(e) => setFormData({ ...formData, sankalpa: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-1.5 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#b56e20] py-3 font-semibold text-white transition hover:bg-[#8f5211] cursor-pointer"
                    >
                      Submit Custom Path Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PathCustomSection;
