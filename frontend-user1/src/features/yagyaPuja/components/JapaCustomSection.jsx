import { useState } from "react";
import { ArrowRight, Sparkles, MessageSquareCheck, Send, CheckCircle2, Shield, X, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const JapaCustomSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    mantraName: "",
    desiredCount: "51,000 Japa",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setFormData({ name: "", phone: "", mantraName: "", desiredCount: "51,000 Japa", notes: "" });
    }, 2800);
  };

  const workflowSteps = [
    { num: "01", label: "Custom Request", desc: "Share your specific mantra, gotra, or custom count requirement." },
    { num: "02", label: "Admin Review", desc: "Acharyas verify Vedic Chandas and calculate required scholar capacity." },
    { num: "03", label: "Tailored Quote", desc: "Receive transparent breakdown for pandits, samagri, and timeline." },
    { num: "04", label: "Approval", desc: "Confirm your custom dates, location (Kashi/Remote), and schedule." },
    { num: "05", label: "Payment", desc: "Secure token or full payment processed via future checkout engine." },
    { num: "06", label: "Booking", desc: "Scholars are allocated and daily recitation is commenced." },
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
                <span>BESPOKE VEDIC ANUSHTHAN</span>
              </div>

              <h2 className="mt-4 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
                Looking for a Specific Mantra or Japa Count?
              </h2>

              <p className="mt-3 text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
                If the Mantra or Japa count you require is not available in our standard configurations, you can submit a custom Japa request for review.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2b241d] px-7 py-3.5 text-[14px] font-semibold text-[#f7ecd5] shadow-[0_6px_18px_rgba(43,36,29,0.2)] transition hover:bg-[#a8641b] hover:text-white cursor-pointer"
                >
                  <MessageSquareCheck size={16} />
                  <span>Request Custom Japa</span>
                </button>

                <Link
                  to="/book-consultation"
                  className="inline-flex items-center gap-2 rounded-full border border-[#b8956b] bg-white/70 px-6 py-3.5 text-[14px] font-semibold text-[#4e3c28] transition hover:bg-white"
                >
                  <span>Talk to an Astrologer</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 6-Stage Future Workflow Progression */}
            <div className="lg:col-span-6">
              <div className="rounded-[22px] border border-[#d6b78d] bg-[#fffdfa]/85 p-6 shadow-xs backdrop-blur-xs">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a571c]">
                  CUSTOM REQUEST ARCHITECTURE WORKFLOW
                </span>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {workflowSteps.map((step) => (
                    <div
                      key={step.num}
                      className="rounded-xl border border-[#ebd8c1] bg-[#faf4e6] p-3 text-[12px]"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#8a571c]">
                        <span>{step.num}.</span>
                        <span className="text-[#2b241d]">{step.label}</span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-[#6d5e4f]">
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

      {/* Custom Japa Request Modal Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-[540px] overflow-hidden rounded-[26px] border border-[#d8b584] bg-[#fffdfa] p-7 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-[#6b5947] hover:bg-[#f2e2cb] hover:text-[#2b241d] cursor-pointer"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcf1dc] text-[#1e6628]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                  Request Submitted for Review
                </h3>
                <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] text-[#6d5c4a]">
                  Our Vedic scholars will evaluate the Chandas and capacity requirements and provide a structured plan.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                  BESPOKE CONFIGURATION
                </span>
                <h3 className="mt-1 font-serif text-[23px] font-bold text-[#2b241d]">
                  Request Custom Mantra Japa
                </h3>
                <p className="mt-1 text-[13px] text-[#6d5c4a]">
                  Specify your desired deity, traditional mantra, or custom count.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-[13px]">
                  <div>
                    <label className="block font-semibold text-[#4e3c28]">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3.5 py-2.5 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4e3c28]">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3.5 py-2.5 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Mantra / Deity</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Baglamukhi / Mritunjaya"
                        value={formData.mantraName}
                        onChange={(e) => setFormData({ ...formData, mantraName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3.5 py-2.5 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4e3c28]">Desired Count</label>
                      <select
                        value={formData.desiredCount}
                        onChange={(e) => setFormData({ ...formData, desiredCount: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3 py-2.5 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                      >
                        <option>11,000 Japa</option>
                        <option>21,000 Japa</option>
                        <option>51,000 Japa</option>
                        <option>1,25,000 Japa</option>
                        <option>Other / Special Count</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4e3c28]">Specific Sankalpa or Guidelines</label>
                    <textarea
                      rows={3}
                      placeholder="Share any preferred dates, Gotra, or ritual instructions..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#d6b78d] bg-white px-3.5 py-2 text-[#2b241d] focus:border-[#c77722] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#b56e20] py-3 font-semibold text-white transition hover:bg-[#8f5211] cursor-pointer"
                    >
                      Submit Custom Request
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

export default JapaCustomSection;
