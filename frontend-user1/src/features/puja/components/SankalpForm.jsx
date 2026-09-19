import { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  User,
  Users,
  AlertCircle,
  AlertTriangle,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import upcomingPujaService from "../../../services/upcomingPujaService";
import { validateMemberEligibility } from "../utils/sankalpValidation";

const RELATIONSHIP_OPTIONS = [
  "Primary Devotee",
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Other Family Member",
];

const SankalpForm = ({ selectedPackage, pujaTitle, puja }) => {
  // Maximum devotees allowed - solely derived from selected package (default 1)
  const maxDevotees = Math.max(1, Number(selectedPackage?.maxDevotees) || 1);
  const isSingleDevotee = maxDevotees === 1;

  // Saved Devotees List
  const [members, setMembers] = useState([]);

  // Empty Member 1 Form State (used when members list is empty in multi-devotee mode)
  const [member1Form, setMember1Form] = useState({
    relationship: "Primary Devotee",
    fullName: "",
    gender: "Male",
    maritalStatus: "Married",
    dateOfBirth: "",
    gotra: "",
    mobileNumber: "",
    email: "",
  });
  const [member1Error, setMember1Error] = useState(null);

  // Common Address & Sacred Sankalp Intention State
  const [commonData, setCommonData] = useState({
    city: "",
    country: "India",
    sankalpPurpose: "",
  });

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [modalForm, setModalForm] = useState({
    relationship: "Other Family Member",
    fullName: "",
    gender: "Male",
    maritalStatus: "Unmarried",
    dateOfBirth: "",
    gotra: "",
    mobileNumber: "",
    email: "",
  });
  const [modalError, setModalError] = useState(null);

  // Global validation / booking submission states
  const [formGlobalError, setFormGlobalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Clear transient errors on package switch
  useEffect(() => {
    setFormGlobalError(null);
    setMember1Error(null);
  }, [selectedPackage?.id]);

  // Devotee count overflow state when switching to a smaller tier
  const isOverflow = members.length > maxDevotees;
  const excessDevotees = members.length - maxDevotees;

  // Handle single devotee field changes
  const handleSingleDevoteeChange = (e) => {
    const { name, value } = e.target;
    setMembers((prev) => {
      const existing = prev[0] || {
        id: "mem-primary",
        relationship: "Primary Devotee",
        fullName: "",
        gender: "Male",
        maritalStatus: "Married",
        dateOfBirth: "",
        gotra: "",
        mobileNumber: "",
        email: "",
      };
      return [{ ...existing, [name]: value }];
    });
  };

  // Handle Member 1 direct inline form changes (multi-devotee mode)
  const handleMember1Change = (e) => {
    const { name, value } = e.target;
    setMember1Form((prev) => ({ ...prev, [name]: value }));
  };

  // Save Member 1 from inline form in multi-devotee mode
  const handleSaveMember1 = (e) => {
    e.preventDefault();
    setMember1Error(null);

    if (!member1Form.fullName.trim()) {
      setMember1Error("Please enter the full name for Devotee #1.");
      return;
    }
    if (!member1Form.mobileNumber.trim()) {
      setMember1Error("Please enter a WhatsApp / Mobile number for ceremony video updates.");
      return;
    }

    const eligibility = validateMemberEligibility(member1Form);
    if (!eligibility.isValid) {
      setMember1Error(eligibility.message);
      return;
    }

    const newPrimary = {
      ...member1Form,
      id: `mem-${Date.now()}`,
    };
    setMembers([newPrimary]);
  };

  // Common inputs change
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Modal to Add Subsequent Devotee
  const handleOpenAddModal = (presetRelationship = "Other Family Member") => {
    if (members.length >= maxDevotees) return;
    setModalMode("add");
    setEditingMemberId(null);
    const primaryGotra = members[0]?.gotra || "";
    setModalForm({
      relationship: presetRelationship,
      fullName: "",
      gender: presetRelationship === "Spouse" ? "Female" : "Male",
      maritalStatus: presetRelationship === "Spouse" ? "Married" : "Unmarried",
      dateOfBirth: "",
      gotra: primaryGotra,
      mobileNumber: "",
      email: "",
    });
    setModalError(null);
    setModalOpen(true);
  };

  // Open Modal to Edit existing devotee
  const handleOpenEditModal = (member) => {
    setModalMode("edit");
    setEditingMemberId(member.id);
    setModalForm({
      relationship: member.relationship || "Other Family Member",
      fullName: member.fullName || "",
      gender: member.gender || "Male",
      maritalStatus: member.maritalStatus || "Unmarried",
      dateOfBirth: member.dateOfBirth || "",
      gotra: member.gotra || "",
      mobileNumber: member.mobileNumber || "",
      email: member.email || "",
    });
    setModalError(null);
    setModalOpen(true);
  };

  // Save Modal Form (In-place edit or progressive addition)
  const handleSaveModal = (e) => {
    e.preventDefault();
    setModalError(null);

    if (!modalForm.fullName.trim()) {
      setModalError("Please enter the devotee's full name.");
      return;
    }

    // Shastric eligibility check
    const eligibility = validateMemberEligibility(modalForm);
    if (!eligibility.isValid) {
      setModalError(eligibility.message);
      return;
    }

    if (modalMode === "edit") {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMemberId ? { ...modalForm, id: editingMemberId } : m
        )
      );
    } else {
      if (members.length >= maxDevotees) {
        setModalError(`Maximum ${maxDevotees} devotees reached for this tier.`);
        return;
      }
      const newMember = {
        ...modalForm,
        id: `mem-${Date.now()}`,
      };
      setMembers((prev) => [...prev, newMember]);
    }

    setModalOpen(false);
  };

  // Remove Devotee
  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Main Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormGlobalError(null);

    // Resolve active devotees list
    let finalDevotees = [...members];

    if (isSingleDevotee) {
      const primary = members[0];
      if (!primary?.fullName?.trim()) {
        setFormGlobalError("Please provide the full name for the Sankalp.");
        return;
      }
      if (!primary?.mobileNumber?.trim()) {
        setFormGlobalError("Please provide a WhatsApp / Mobile number for ceremony updates.");
        return;
      }
      finalDevotees = [primary];
    } else {
      if (finalDevotees.length === 0) {
        setFormGlobalError("Please fill and save Member 1 details before submitting.");
        return;
      }
      const primary = finalDevotees[0];
      if (!primary?.fullName?.trim() || !primary?.mobileNumber?.trim()) {
        setFormGlobalError("Devotee #1 requires both Full Name and WhatsApp / Mobile number.");
        return;
      }
    }

    if (finalDevotees.length > maxDevotees) {
      setFormGlobalError(
        `The selected tier permits a maximum of ${maxDevotees} devotee(s). Please remove ${finalDevotees.length - maxDevotees} devotee(s) before proceeding.`
      );
      return;
    }

    if (!commonData.city?.trim()) {
      setFormGlobalError("Please enter your City / Town for the Sankalp record.");
      return;
    }

    // Submit booking to backend API
    setSubmitting(true);
    try {
      const payload = {
        pujaId: puja?.id,
        packageId: selectedPackage?.id,
        members: finalDevotees,
        city: commonData.city,
        country: commonData.country || "India",
        sankalpPurpose: commonData.sankalpPurpose || "",
      };

      const res = await upcomingPujaService.bookUpcomingPuja(payload);
      if (res && (res.success || res.data)) {
        setBookingResult(res.data || res);
      } else {
        setFormGlobalError(res?.message || "Failed to record Sankalp booking.");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred while booking. Please try again.";
      setFormGlobalError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Primary devotee accessor for Single Devotee mode
  const singlePrimary = members[0] || {
    fullName: "",
    mobileNumber: "",
    email: "",
    gotra: "",
    gender: "Male",
    maritalStatus: "Married",
  };

  return (
    <section
      id="sankalp-details"
      className="scroll-mt-20 sm:scroll-mt-24 border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[960px]">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-[700px] text-center sm:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            VEDIC SANKALP REGISTRATION
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            Sankalp Details
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            These sacred details will be chanted with Vedic pronunciation by the Acharyas during your ceremony.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-white p-6 shadow-[0_20px_50px_rgba(43,36,29,0.08)] sm:p-10">
          
          {/* Selected Plan Summary Banner */}
          {selectedPackage && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6cca0] bg-[#fffaf0] p-4 text-[#2b241d]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Selected Participation Tier
                </span>
                <p className="font-serif text-[19px] font-bold">
                  {selectedPackage.name} {pujaTitle ? `• ${pujaTitle}` : ""}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#8f4a13]">
                    <Users size={13} className="text-[#c87620]" />
                    {maxDevotees === 1 ? "1 Devotee Included" : `Up to ${maxDevotees} Devotees Included`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-serif text-[26px] font-bold text-[#d4872b]">
                  {selectedPackage.formattedPrice}
                </span>
                <p className="text-[11px] text-[#75695c]">All ritual offerings included</p>
              </div>
            </div>
          )}

          {/* Devotee Count Overflow Warning Banner (if package switched to smaller tier) */}
          {isOverflow && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
              <div>
                <h4 className="font-serif text-[15px] font-bold text-amber-950">
                  Devotees Exceed Selected Tier Capacity
                </h4>
                <p className="mt-1 text-[13px] leading-relaxed text-amber-800">
                  The <strong>{selectedPackage.name}</strong> tier allows a maximum of <strong>{maxDevotees} devotee{maxDevotees > 1 ? "s" : ""}</strong>, but you currently have <strong>{members.length} devotees</strong> recorded. Please remove {excessDevotees} devotee{excessDevotees > 1 ? "s" : ""} below or choose a larger tier before proceeding.
                </p>
              </div>
            </div>
          )}

          {bookingResult ? (
            /* =========================================================
               SUBMISSION CONFIRMATION / SUCCESS STATE
            ========================================================== */
            <div className="py-8 text-center animate-in fade-in duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <CheckCircle2 size={38} />
              </div>
              <h3 className="font-serif text-[28px] font-bold text-[#2b241d]">
                Sankalp Confirmed
              </h3>
              <p className="mx-auto mt-2 max-w-[560px] text-[15px] leading-relaxed text-[#685c4f]">
                May the divine blessings be upon you. Your Vedic Sankalp for <strong>{pujaTitle}</strong> has been registered with booking code:
              </p>

              {/* Booking Reference Badge */}
              <div className="mx-auto my-4 inline-block rounded-xl border border-[#d6b8a0] bg-[#fffaf0] px-5 py-2 text-[16px] font-mono font-bold tracking-wide text-[#b36c1e]">
                {bookingResult.bookingReference || "VEDA-PUJA-CONFIRMED"}
              </div>

              {/* Devotees Summary Card */}
              <div className="mx-auto mt-6 max-w-[560px] space-y-3 rounded-2xl border border-[#e6cca0] bg-[#fffaf0] p-5 text-left text-[13.5px]">
                <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                    Devotees in Sankalp ({members.length} {members.length === 1 ? "Devotee" : "Devotees"})
                  </span>
                  <span className="text-[12px] font-semibold text-[#2b241d]">
                    {selectedPackage?.name}
                  </span>
                </div>
                {members.map((m, idx) => (
                  <div key={m.id || idx} className="flex items-center justify-between py-1 border-b border-[#f4e6d4] last:border-0">
                    <span className="font-semibold text-[#2b241d]">
                      {m.fullName} <span className="text-[12px] font-normal text-[#8c7e6c]">({m.relationship || "Devotee"})</span>
                    </span>
                    <span className="text-[12px] text-[#75695c]">
                      {m.gotra ? `Gotra: ${m.gotra}` : "Gotra: Kashyap"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBookingResult(null);
                    setMembers([]);
                  }}
                  className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-7 py-3 text-[13px] font-bold text-[#2b241d] transition hover:border-[#d4872b] hover:bg-white"
                >
                  Book Another Sankalp
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================
               DYNAMIC SANKALP FORM
            ========================================================== */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Global Error Alert */}
              {formGlobalError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] font-medium text-red-700">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span>{formGlobalError}</span>
                </div>
              )}

              {/* =======================================================
                  CASE A: SINGLE DEVOTEE TIER (maxDevotees === 1)
              ======================================================== */}
              {isSingleDevotee && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
                    <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                      Devotee Details
                    </h3>
                    <span className="rounded-full bg-[#f8edd8] px-3.5 py-1 text-[11.5px] font-bold text-[#b36c1e]">
                      1 / 1 Devotee
                    </span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Full Name * */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        Full Name <span className="text-[#c77722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={singlePrimary.fullName || ""}
                        onChange={handleSingleDevoteeChange}
                        placeholder="e.g. Ramesh Chandra Sharma"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                    </div>

                    {/* WhatsApp / Mobile Number * */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        WhatsApp / Mobile Number <span className="text-[#c77722]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        name="mobileNumber"
                        value={singlePrimary.mobileNumber || ""}
                        onChange={handleSingleDevoteeChange}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                      <span className="mt-1 block text-[11px] text-[#8c7e6c]">
                        Ceremony video highlights will be shared on WhatsApp.
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    {/* Gotra */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        Gotra <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="gotra"
                        value={singlePrimary.gotra || ""}
                        onChange={handleSingleDevoteeChange}
                        placeholder="e.g. Bharadwaj / Kashyap"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={singlePrimary.gender || "Male"}
                        onChange={handleSingleDevoteeChange}
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        Email <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={singlePrimary.email || ""}
                        onChange={handleSingleDevoteeChange}
                        placeholder="name@example.com"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =======================================================
                  CASE B: MULTI DEVOTEE TIER (maxDevotees > 1)
              ======================================================== */}
              {!isSingleDevotee && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e2cd] pb-3">
                    <div>
                      <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                        Devotee Roster
                      </h3>
                      <p className="text-[12.5px] text-[#75695c]">
                        Add up to {maxDevotees} devotees to be blessed in this collective Sankalp.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f8edd8] px-3.5 py-1 text-[12px] font-bold text-[#b36c1e]">
                      {members.length} / {maxDevotees} Devotees Added
                    </span>
                  </div>

                  {/* 1. If NO members are added yet: show clean, empty Member 1 form */}
                  {members.length === 0 && (
                    <div className="rounded-2xl border-2 border-[#e6cca0] bg-[#fffdf9] p-6 shadow-xs">
                      <div className="mb-4 flex items-center justify-between border-b border-[#f0e2cd] pb-3">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#b36c1e]">
                          <User size={14} /> Devotee #1 (Primary Devotee)
                        </span>
                        <span className="text-[11px] text-[#8c7e6c]">Member 1 of {maxDevotees}</span>
                      </div>

                      {member1Error && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] text-red-700">
                          <AlertCircle size={16} className="shrink-0 text-red-500" />
                          <span>{member1Error}</span>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Relationship */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            Relationship
                          </label>
                          <select
                            name="relationship"
                            value={member1Form.relationship}
                            onChange={handleMember1Change}
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          >
                            {RELATIONSHIP_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Full Name * */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            Full Name <span className="text-[#c77722]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="fullName"
                            value={member1Form.fullName}
                            onChange={handleMember1Change}
                            placeholder="e.g. Ramesh Chandra Sharma"
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {/* Gender */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={member1Form.gender}
                            onChange={handleMember1Change}
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Marital Status */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            Marital Status
                          </label>
                          <select
                            name="maritalStatus"
                            value={member1Form.maritalStatus}
                            onChange={handleMember1Change}
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          >
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {/* WhatsApp / Mobile * */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            WhatsApp / Mobile <span className="text-[#c77722]">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            name="mobileNumber"
                            value={member1Form.mobileNumber}
                            onChange={handleMember1Change}
                            placeholder="+91 98765 43210"
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          />
                        </div>

                        {/* Gotra */}
                        <div>
                          <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                            Gotra <span className="text-[10.5px] font-normal text-[#8c7e6c]">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            name="gotra"
                            value={member1Form.gotra}
                            onChange={handleMember1Change}
                            placeholder="e.g. Kashyap / Bharadwaj"
                            className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveMember1}
                          className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-xs hover:bg-[#dda018]"
                        >
                          <CheckCircle2 size={15} />
                          <span>Save Devotee #1 Details</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. List of Saved Devotees Cards */}
                  {members.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {members.map((member, idx) => (
                        <div
                          key={member.id || idx}
                          className="relative flex flex-col justify-between rounded-2xl border-2 border-[#e6cca0] bg-[#fffaf0] p-5 shadow-xs transition hover:border-[#d4872b]"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                                <CheckCircle2 size={14} className="text-green-600" />
                                {member.relationship || `Devotee #${idx + 1}`}
                              </span>
                              <span className="text-[11px] font-medium text-[#8c7e6c]">
                                #{idx + 1}
                              </span>
                            </div>

                            <h4 className="mt-2 font-serif text-[18px] font-bold text-[#2b241d]">
                              {member.fullName}
                            </h4>

                            <p className="mt-1 text-[12.5px] text-[#685c4f]">
                              {member.gender || "Male"}
                              {member.maritalStatus ? ` • ${member.maritalStatus}` : ""}
                              {member.dateOfBirth ? ` • ${member.dateOfBirth}` : ""}
                            </p>

                            {member.gotra && (
                              <p className="mt-0.5 text-[12px] font-medium text-[#8c7e6c]">
                                Gotra: {member.gotra}
                              </p>
                            )}

                            {member.mobileNumber && (
                              <p className="mt-0.5 text-[12px] text-[#8c7e6c]">
                                Mobile: {member.mobileNumber}
                              </p>
                            )}
                          </div>

                          {/* Actions: In-place edit and removal */}
                          <div className="mt-4 flex items-center justify-end gap-3 border-t border-[#f0e2cd] pt-3">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(member)}
                              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#b36c1e] hover:underline"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-red-600 hover:underline"
                            >
                              <Trash2 size={12} />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Add Family Member Action */}
                  {members.length > 0 && (
                    <div className="pt-2">
                      {members.length < maxDevotees ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenAddModal(
                              members.length === 1 ? "Spouse" : "Son"
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-[#fffdf9] px-6 py-3 text-[13px] font-bold text-[#2b241d] shadow-xs transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
                        >
                          <Plus size={16} className="text-[#c77722]" />
                          <span>+ Add Family Member ({members.length} / {maxDevotees})</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f8edd8] px-4 py-2 text-[12px] font-bold text-[#8c6a2f]">
                          <CheckCircle2 size={14} className="text-green-600" />
                          <span>Maximum {maxDevotees} devotees reached for this tier</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* =======================================================
                  COMMON LOCATION & SANKALP PURPOSE FIELDS
              ======================================================== */}
              <div className="border-t border-[#f0e2cd] pt-6">
                <h4 className="font-serif text-[17px] font-bold text-[#2b241d]">
                  Location & Sacred Sankalp Intention
                </h4>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {/* City * */}
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                      City / Town <span className="text-[#c77722]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={commonData.city}
                      onChange={handleCommonChange}
                      placeholder="e.g. Varanasi / Mumbai / London"
                      className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={commonData.country}
                      onChange={handleCommonChange}
                      placeholder="e.g. India"
                      className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Purpose / Sankalp Wish */}
                <div className="mt-4">
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Specific Wish / Intention for Sankalp <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="sankalpPurpose"
                    value={commonData.sankalpPurpose}
                    onChange={handleCommonChange}
                    placeholder="Mention any specific wish e.g. health & longevity for parents, children's education, peace, or business prosperity..."
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || isOverflow}
                  className={`group flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[14px] font-bold transition-all duration-300 ${
                    isOverflow
                      ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                      : "bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] text-[#1c1308] shadow-[0_10px_28px_rgba(234,177,44,0.28)] hover:brightness-105"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-[#1c1308]" />
                      <span>Recording Sacred Sankalp...</span>
                    </>
                  ) : isOverflow ? (
                    <span>Remove {excessDevotees} devotee(s) to proceed with {selectedPackage?.name}</span>
                  ) : (
                    <>
                      <span>
                        Submit Sankalp & Proceed ({selectedPackage?.formattedPrice || "₹1,100"})
                      </span>
                      <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Security reassurance */}
              <div className="flex items-center justify-center gap-2 pt-1 text-center text-[12px] text-[#75695c]">
                <ShieldCheck size={15} className="text-[#d4872b]" />
                <span>Your sacred details are kept strictly confidential and used solely for the Vedic ritual.</span>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* =======================================================
          MODAL: PROGRESSIVE ADD / IN-PLACE EDIT DEVOTEE
      ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-[28px] border-2 border-[#d6b8a0] bg-[#fffaf0] p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ead8b8] pb-4">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  {modalMode === "add" ? "NEW DEVOTEE" : "UPDATE DEVOTEE"}
                </span>
                <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
                  {modalMode === "add" ? "Add Devotee Details" : "Edit Devotee Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#f8edd8] text-[#2b241d] transition hover:bg-[#eab12c]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Error Alert */}
            {modalError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] font-medium text-red-700">
                <AlertCircle size={17} className="shrink-0 text-red-500 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="mt-5 space-y-4">
              {/* Relationship */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Relationship <span className="text-[#c77722]">*</span>
                </label>
                <select
                  value={modalForm.relationship}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, relationship: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                >
                  {RELATIONSHIP_OPTIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name * */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                  Full Name <span className="text-[#c77722]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.fullName}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="e.g. Priya Sharma"
                  className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                />
              </div>

              {/* Gender & Marital Status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Gender <span className="text-[#c77722]">*</span>
                  </label>
                  <select
                    value={modalForm.gender}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Marital Status
                  </label>
                  <select
                    value={modalForm.maritalStatus}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, maritalStatus: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  >
                    <option value="Married">Married</option>
                    <option value="Unmarried">Unmarried</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth / Age & Gotra */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Date of Birth / Age <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={modalForm.dateOfBirth}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    placeholder="e.g. 15 Aug 1990 or 8 yrs"
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Gotra <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={modalForm.gotra}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, gotra: e.target.value }))}
                    placeholder="e.g. Kashyap"
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  />
                </div>
              </div>

              {/* Contact (Optional for secondary devotees) */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Mobile <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={modalForm.mobileNumber}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Email <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={modalForm.email}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="devotee@example.com"
                    className="mt-1 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d] outline-none focus:border-[#d4872b]"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ead8b8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-[#d6b8a0] bg-white px-5 py-2.5 text-[13px] font-bold text-[#2b241d] hover:bg-[#f8edd8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-xs hover:bg-[#dda018]"
                >
                  {modalMode === "add" ? "Add Devotee" : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
};

export default SankalpForm;
