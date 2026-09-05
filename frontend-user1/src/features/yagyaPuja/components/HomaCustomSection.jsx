import React, { useState } from 'react';
import { Sparkles, Send, X, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomaCustomSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    homaName: '',
    havanCount: '5',
    days: '2',
    preferredDate: '',
    location: 'Kashi',
    sankalpa: '',
    specialRequirements: '',
    name: '',
    mobile: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setIsModalOpen(false);
    setFormData({
      homaName: '',
      havanCount: '5',
      days: '2',
      preferredDate: '',
      location: 'Kashi',
      sankalpa: '',
      specialRequirements: '',
      name: '',
      mobile: '',
      email: '',
    });
  };

  const WORKFLOW_STEPS = [
    { num: '01', title: 'Custom Request', desc: 'User submits custom Homa name, havan count, and dates' },
    { num: '02', title: 'Acharya Review', desc: 'Scholars review ritual feasibility & determine pandit ratio' },
    { num: '03', title: 'Custom Quote', desc: 'Transparent calculation of samagri, dakshina & logistics' },
    { num: '04', title: 'Customer Approval', desc: 'Devotee confirms sankalpa particulars and scheduling' },
    { num: '05', title: 'Payment Setup', desc: 'Secure booking confirmation and dakshina processing' },
    { num: '06', title: 'Homa Execution', desc: 'Ritual conducted with discipline at selected kshetra or home' },
  ];

  return (
    <section className="py-20 bg-[#faf6ee] border-b border-[#e8dfd1]" id="custom-homa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#ebdcc4] p-8 sm:p-12 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side text */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                BESPOKE & SPECIALIZED VEDIC HAVAN
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mb-4">
                Looking for a Specific Homa?
              </h2>
              <p className="text-sm sm:text-base text-[#685847] leading-relaxed mb-6">
                If your family tradition, Jyotish prescription, or Kuladevata requires a specific ritual,
                unusual Havan count (such as 21 or 51 Ahuti cycles), or multi-day extended Ahuti sessions
                not listed in our standard catalogue, our coordinating Acharyas can structure an authentic bespoke ritual.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-[#524437]">
                  <ShieldCheck className="w-4 h-4 text-[#b36c1e] shrink-0" />
                  <span>Custom Ahuti calculations verified by Vedic Sanskrit scholars</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#524437]">
                  <ShieldCheck className="w-4 h-4 text-[#b36c1e] shrink-0" />
                  <span>Flexible location coordination: Varanasi Kshetra, designated temples, or your home</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#524437]">
                  <ShieldCheck className="w-4 h-4 text-[#b36c1e] shrink-0" />
                  <span>Dedicated Samagri sourcing matching rare Shastric herb requirements</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 bg-[#b36c1e] hover:bg-[#8a4e0c] text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>Request Custom Homa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right side: Future Architecture Workflow preview */}
            <div className="lg:col-span-5 bg-[#faf7f0] rounded-xl p-6 border border-[#ebdcc4]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ebdcc4]">
                <span className="text-xs uppercase font-bold tracking-wider text-[#44362b]">
                  Future Booking Workflow
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#ebdcc4] text-[#5e4a37] px-2 py-0.5 rounded">
                  Pipeline
                </span>
              </div>

              <div className="space-y-3">
                {WORKFLOW_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[11px] font-mono font-bold text-[#b36c1e] bg-white border border-[#ebdcc4] px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2a221b]">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-[#786653] leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightweight Request Custom Homa Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#ebdcc4] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 p-2 text-[#7d6854] hover:text-[#2a221b] rounded-full hover:bg-[#faf4e6] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-[#eaf5ea] text-[#2b7a35] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c1e2c6]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif text-[#2a221b] mb-2">
                  Request Recorded
                </h3>
                <p className="text-sm text-[#685847] max-w-md mx-auto mb-6">
                  Thank you, <span className="font-semibold text-[#2a221b]">{formData.name || 'Devotee'}</span>. Your custom inquiry for{' '}
                  <span className="font-semibold text-[#2a221b]">{formData.homaName || 'Specific Homa'}</span> has been captured in the frontend prototype. Our coordinator would review Shastric requirements in a full release.
                </p>
                <div className="p-4 bg-[#faf6ee] rounded-xl border border-[#ebdcc4] text-xs text-[#7d6854] max-w-md mx-auto mb-6 text-left">
                  <span className="font-bold block text-[#3b2d22] mb-1">Demonstration Notice:</span>
                  This request demonstrates the future intake interface. No live booking or financial commitment has been created.
                </div>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-[#b36c1e] text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#8a4e0c]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#b36c1e] font-bold">
                    BESPOKE RITUAL INTAKE
                  </span>
                  <h3 className="text-2xl font-serif text-[#2a221b] mt-1">
                    Request a Custom Homa
                  </h3>
                  <p className="text-xs text-[#7d6854] mt-1">
                    Please provide your proposed ritual details. Our Acharya coordinator will evaluate the Vidhi, samagri needs, and pandit team scale.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#44362b] mb-1">
                        Homa / Havan Name *
                      </label>
                      <input
                        type="text"
                        name="homaName"
                        required
                        placeholder="e.g. Sudarshana Homa, Pratyangira Homa"
                        value={formData.homaName}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44362b] mb-1">
                        Required Havan Count *
                      </label>
                      <select
                        name="havanCount"
                        value={formData.havanCount}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                      >
                        <option value="1">1 Havan (Standard Single Session)</option>
                        <option value="3">3 Havan (Intermediate)</option>
                        <option value="5">5 Havan (Extended Ahuti)</option>
                        <option value="7">7 Havan (Major Anushthana)</option>
                        <option value="11">11 Havan (Maha Ahuti Cycle)</option>
                        <option value="21+">21+ Custom Havan Cycle</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#44362b] mb-1">
                        Number of Days *
                      </label>
                      <select
                        name="days"
                        value={formData.days}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                      >
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">7 Days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44362b] mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full text-xs p-2 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44362b] mb-1">
                        Location *
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                      >
                        <option value="Kashi">Kashi Kshetra (Varanasi)</option>
                        <option value="Remote">Remote (Live Sankalpa Stream)</option>
                        <option value="Home">Home / Devotee Premises</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44362b] mb-1">
                      Sankalpa & Family Gotra Details
                    </label>
                    <textarea
                      rows="2"
                      name="sankalpa"
                      placeholder="Gotra, Nakshatras of family members, specific prayer intention"
                      value={formData.sankalpa}
                      onChange={handleChange}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44362b] mb-1">
                      Special Requirements / Shastric Notes
                    </label>
                    <textarea
                      rows="2"
                      name="specialRequirements"
                      placeholder="Specific samidha wood preferences, particular herbs, or muhurta constraints"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                    />
                  </div>

                  <div className="border-t border-[#f0e6d6] pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#44362b] block mb-2">
                      Contact Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Your Full Name *"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full text-xs p-2 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          name="mobile"
                          required
                          placeholder="Mobile Number *"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full text-xs p-2 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full text-xs p-2 rounded-lg border border-[#ebdcc4] bg-[#fbf9f4] focus:bg-white focus:outline-none focus:border-[#b36c1e]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-xs font-semibold text-[#685847] hover:text-[#2a221b]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#b36c1e] hover:bg-[#8a4e0c] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
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
}
