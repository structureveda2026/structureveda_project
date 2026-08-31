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
  Heart,
  AlertCircle,
  X,
} from "lucide-react";
import { validateMemberEligibility } from "../utils/sankalpValidation";

// Helper to determine plan mode from package
const getPlanType = (pkg) => {
  if (!pkg) return "individual";
  const name = (pkg.name || "").toLowerCase();
  const id = (pkg.id || "").toLowerCase();
  if (name.includes("couple") || id.includes("couple")) return "couple";
  if (name.includes("family") || id.includes("family") || name.includes("household")) return "family";
  if (name.includes("group") || name.includes("enterprise") || id.includes("group")) return "group";
  return "individual";
};

const RELATIONSHIP_OPTIONS = [
  "Primary Member",
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Other Family Member",
];

const SankalpForm = ({ selectedPackage, pujaTitle }) => {
  const planType = getPlanType(selectedPackage);

  // Maximum allowed members per plan
  const maxMembers = planType === "individual" ? 1 : planType === "couple" ? 2 : planType === "group" ? 10 : 6;

  // Dynamic Members State
  const [members, setMembers] = useState([
    {
      id: "mem-1",
      relationship: "Primary Member",
      fullName: "",
      gender: "Male",
      maritalStatus: "Married",
      dateOfBirth: "",
      gotra: "",
      mobileNumber: "",
      email: "",
    },
  ]);

  // Common Address & Intention State
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
    relationship: "Primary Member",
    fullName: "",
    gender: "Male",
    maritalStatus: "Married",
    dateOfBirth: "",
    gotra: "",
    mobileNumber: "",
    email: "",
  });
  const [modalError, setModalError] = useState(null);
  const [formGlobalError, setFormGlobalError] = useState(null);

  // Submission State
  const [submitted, setSubmitted] = useState(false);

  // Handle plan switching: adapt members state appropriately
  useEffect(() => {
    setFormGlobalError(null);
    setMembers((prev) => {
      if (planType === "individual") {
        // Keep only 1 primary member
        const primary = prev[0] || {
          id: "mem-1",
          relationship: "Primary Member",
          fullName: "",
          gender: "Male",
          maritalStatus: "Unmarried",
          dateOfBirth: "",
          gotra: "",
          mobileNumber: "",
          email: "",
        };
        return [{ ...primary, relationship: "Primary Member" }];
      }

      if (planType === "couple") {
        // Keep up to 2 members (Primary and Spouse)
        const primary = prev[0]
          ? { ...prev[0], relationship: "Primary Devotee" }
          : {
              id: "mem-1",
              relationship: "Primary Devotee",
              fullName: "",
              gender: "Male",
              maritalStatus: "Married",
              dateOfBirth: "",
              gotra: "",
              mobileNumber: "",
              email: "",
            };

        const spouse = prev[1]
          ? { ...prev[1], relationship: "Spouse" }
          : null;

        return spouse ? [primary, spouse] : [primary];
      }

      // Family or Group: trim to maximum limit if previously exceeded
      if (prev.length > maxMembers) {
        return prev.slice(0, maxMembers);
      }

      return prev;
    });
  }, [selectedPackage?.id, planType, maxMembers]);

  // Open Modal to Add
  const handleOpenAddModal = (presetRelationship = "Other Family Member") => {
    setModalMode("add");
    setEditingMemberId(null);
    setModalForm({
      relationship: presetRelationship,
      fullName: "",
      gender: presetRelationship === "Spouse" ? "Female" : "Male",
      maritalStatus: presetRelationship === "Spouse" ? "Married" : "Unmarried",
      dateOfBirth: "",
      gotra: members[0]?.gotra || "",
      mobileNumber: "",
      email: "",
    });
    setModalError(null);
    setModalOpen(true);
  };

  // Open Modal to Edit
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

  // Save Modal Form (Add or Edit)
  const handleSaveModal = (e) => {
    e.preventDefault();
    setModalError(null);

    // 1. Basic validation
    if (!modalForm.fullName.trim()) {
      setModalError("Please enter the full name.");
      return;
    }

    // 2. Business Rule Validation
    const eligibility = validateMemberEligibility(modalForm);
    if (!eligibility.isValid) {
      setModalError(eligibility.message);
      return;
    }

    if (modalMode === "edit") {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMemberId ? { ...modalForm, id: editingMemberId } : m))
      );
    } else {
      if (members.length >= maxMembers) {
        setModalError(`Maximum ${maxMembers} members reached.`);
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

  // Remove Member
  const handleRemoveMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Handle direct inputs in Individual mode
  const handleIndividualMemberChange = (e) => {
    const { name, value } = e.target;
    setMembers((prev) => [
      {
        ...prev[0],
        [name]: value,
      },
    ]);
  };

  // Common inputs change
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));
  };

  // Overall Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormGlobalError(null);

    // Validation per plan
    if (planType === "individual") {
      const primary = members[0];
      if (!primary?.fullName?.trim() || !primary?.mobileNumber?.trim()) {
        setFormGlobalError("Please provide both Full Name and WhatsApp / Mobile Number.");
        return;
      }
    } else if (planType === "couple") {
      if (members.length < 2) {
        setFormGlobalError("Please add both the Primary Devotee and Spouse to proceed with the Couple Plan.");
        return;
      }
      const hasEmptyName = members.some((m) => !m.fullName?.trim());
      if (hasEmptyName) {
        setFormGlobalError("Please ensure both devotees have valid full names.");
        return;
      }
      const primary = members.find((m) => (m.relationship || "").toLowerCase().includes("primary")) || members[0];
      if (!primary.mobileNumber?.trim()) {
        setFormGlobalError("Please provide WhatsApp / Mobile number for ritual video updates.");
        return;
      }
    } else {
      // Family / Group
      if (members.length === 0 || !members[0]?.fullName?.trim()) {
        setFormGlobalError("Please add at least 1 primary family member.");
        return;
      }
      const primary = members[0];
      if (!primary.mobileNumber?.trim()) {
        setFormGlobalError("Please ensure the primary member has a valid WhatsApp / Mobile number.");
        return;
      }
    }

    setSubmitted(true);
  };

  // Helper for Couple slots
  const primaryCoupleMember = members.find((m) =>
    (m.relationship || "").toLowerCase().includes("primary")
  ) || (members[0]?.relationship !== "Spouse" ? members[0] : null);

  const spouseCoupleMember = members.find((m) =>
    (m.relationship || "").toLowerCase().includes("spouse")
  ) || (members[1]?.relationship === "Spouse" ? members[1] : null);

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
            These sacred details will be ritually chanted by the Acharya in Kashi during your ritual.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-white p-6 shadow-[0_20px_50px_rgba(43,36,29,0.08)] sm:p-10">
          
          {/* Selected Plan Summary Banner */}
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
            /* =========================================================
               SUBMISSION CONFIRMATION / PREVIEW STATE
            ========================================================== */
            <div className="py-8 text-center animate-in fade-in duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-[26px] font-bold text-[#2b241d]">
                Sankalp Details Recorded
              </h3>
              <p className="mx-auto mt-2 max-w-[540px] text-[14.5px] leading-relaxed text-[#685c4f]">
                Thank you. The sacred Sankalp for <strong>{pujaTitle}</strong> ({selectedPackage?.name} Plan) has been prepared with the following devotee details:
              </p>

              {/* Recorded Devotees Pill List */}
              <div className="mx-auto mt-6 max-w-[560px] space-y-2.5 rounded-2xl border border-[#e6cca0] bg-[#fffaf0] p-5 text-left text-[13.5px]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Registered Devotees ({members.length} {members.length === 1 ? "Member" : "Members"})
                </p>
                {members.map((m, idx) => (
                  <div key={m.id || idx} className="flex items-center justify-between border-b border-[#f0e2cd] py-1.5 last:border-0">
                    <span className="font-semibold text-[#2b241d]">
                      {m.fullName || "Devotee"} <span className="text-[12px] font-normal text-[#8c7e6c]">({m.relationship})</span>
                    </span>
                    <span className="text-[12px] text-[#75695c]">
                      {m.gotra ? `Gotra: ${m.gotra}` : "Gotra: Kashyap"}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-7 py-3 text-[13px] font-bold text-[#2b241d] transition hover:border-[#d4872b] hover:bg-white"
              >
                Edit Sankalp Details
              </button>
            </div>
          ) : (
            /* =========================================================
               DYNAMIC PLAN-BASED SANKALP FORMS
            ========================================================== */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Global Error Banner if any */}
              {formGlobalError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] font-medium text-red-700">
                  <AlertCircle size={17} className="shrink-0 text-red-500" />
                  <span>{formGlobalError}</span>
                </div>
              )}

              {/* =======================================================
                  PLAN 1: INDIVIDUAL MODE (1 / 1 Member)
              ======================================================== */}
              {planType === "individual" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
                    <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                      Devotee Details
                    </h3>
                    <span className="rounded-full bg-[#f8edd8] px-3 py-0.5 text-[11.5px] font-bold text-[#b36c1e]">
                      1 / 1 Member
                    </span>
                  </div>

                  {/* Primary Member Direct Form */}
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
                        value={members[0]?.fullName || ""}
                        onChange={handleIndividualMemberChange}
                        placeholder="e.g. Ramesh Chandra Sharma"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                    </div>

                    {/* WhatsApp / Mobile Number * */}
                    <div>
                      <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        WhatsApp / Mobile Number <span className="text-[#c77722]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        name="mobileNumber"
                        value={members[0]?.mobileNumber || ""}
                        onChange={handleIndividualMemberChange}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                      <span className="mt-1 block text-[11px] text-[#8c7e6c]">
                        Ritual video updates will be shared on this number.
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                        Email Address <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={members[0]?.email || ""}
                        onChange={handleIndividualMemberChange}
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
                        value={members[0]?.gotra || ""}
                        onChange={handleIndividualMemberChange}
                        placeholder="e.g. Bharadwaj / Kashyap"
                        className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =======================================================
                  PLAN 2: COUPLE MODE (0 / 2, 1 / 2, 2 / 2 Members)
              ======================================================== */}
              {planType === "couple" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#f0e2cd] pb-3">
                    <div>
                      <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                        Couple Members
                      </h3>
                      <p className="text-[12.5px] text-[#75695c]">
                        Both Primary Devotee & Spouse details are required for the couple Sankalp.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f8edd8] px-3.5 py-1 text-[12px] font-bold text-[#b36c1e]">
                      {members.filter((m) => m.fullName?.trim()).length} / 2 Members
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Slot 1: Primary Devotee Card */}
                    {primaryCoupleMember && primaryCoupleMember.fullName?.trim() ? (
                      <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#e6cca0] bg-[#fffaf0] p-5 shadow-sm transition hover:border-[#d4872b]">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                              <User size={13} />
                              Primary Devotee
                            </span>
                            <CheckCircle2 size={16} className="text-green-600" />
                          </div>
                          <h4 className="mt-2 font-serif text-[18px] font-bold text-[#2b241d]">
                            {primaryCoupleMember.fullName}
                          </h4>
                          <p className="mt-1 text-[12.5px] text-[#685c4f]">
                            {primaryCoupleMember.gender || "Male"} • {primaryCoupleMember.maritalStatus || "Married"}
                          </p>
                          {primaryCoupleMember.gotra && (
                            <p className="text-[12px] font-medium text-[#8c7e6c]">
                              Gotra: {primaryCoupleMember.gotra}
                            </p>
                          )}
                          {primaryCoupleMember.mobileNumber && (
                            <p className="text-[12px] text-[#8c7e6c]">
                              Mobile: {primaryCoupleMember.mobileNumber}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#f0e2cd] pt-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(primaryCoupleMember)}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#b36c1e] hover:underline"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal("Primary Devotee")}
                        className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6b8a0] bg-[#fffdfa] p-8 text-center transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f8edd8] text-[#c77722] transition group-hover:scale-110">
                          <Plus size={20} />
                        </div>
                        <span className="mt-3 font-serif text-[15.5px] font-bold text-[#2b241d]">
                          + Add Primary Devotee
                        </span>
                        <span className="mt-0.5 text-[11.5px] text-[#8c7e6c]">
                          Husband / First Devotee
                        </span>
                      </button>
                    )}

                    {/* Slot 2: Spouse Card */}
                    {spouseCoupleMember && spouseCoupleMember.fullName?.trim() ? (
                      <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#e6cca0] bg-[#fffaf0] p-5 shadow-sm transition hover:border-[#d4872b]">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                              <Heart size={13} />
                              Spouse
                            </span>
                            <CheckCircle2 size={16} className="text-green-600" />
                          </div>
                          <h4 className="mt-2 font-serif text-[18px] font-bold text-[#2b241d]">
                            {spouseCoupleMember.fullName}
                          </h4>
                          <p className="mt-1 text-[12.5px] text-[#685c4f]">
                            {spouseCoupleMember.gender || "Female"} • Married
                          </p>
                          {spouseCoupleMember.gotra && (
                            <p className="text-[12px] font-medium text-[#8c7e6c]">
                              Gotra: {spouseCoupleMember.gotra}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#f0e2cd] pt-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(spouseCoupleMember)}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#b36c1e] hover:underline"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(spouseCoupleMember.id)}
                            className="inline-flex items-center gap-1 text-[12px] font-medium text-red-600 hover:underline"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal("Spouse")}
                        className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d6b8a0] bg-[#fffdfa] p-8 text-center transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f8edd8] text-[#c77722] transition group-hover:scale-110">
                          <Plus size={20} />
                        </div>
                        <span className="mt-3 font-serif text-[15.5px] font-bold text-[#2b241d]">
                          + Add Spouse
                        </span>
                        <span className="mt-0.5 text-[11.5px] text-[#8c7e6c]">
                          Wife / Second Devotee
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* =======================================================
                  PLAN 3 & 4: FAMILY / GROUP MODE (Up to 6 or 10 members)
              ======================================================== */}
              {(planType === "family" || planType === "group") && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e2cd] pb-3">
                    <div>
                      <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                        Family Members
                      </h3>
                      <p className="text-[12.5px] text-[#75695c]">
                        Add up to {maxMembers} family members to be blessed in the collective Sankalp.
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f8edd8] px-3.5 py-1 text-[12px] font-bold text-[#b36c1e]">
                      {members.length} / {maxMembers} Members
                    </span>
                  </div>

                  {/* List of Member Cards */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {members.map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className="relative flex flex-col justify-between rounded-2xl border-2 border-[#e6cca0] bg-[#fffaf0] p-5 shadow-sm transition hover:border-[#d4872b]"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                              <CheckCircle2 size={14} className="text-green-600" />
                              {member.relationship}
                            </span>
                          </div>

                          <h4 className="mt-2 font-serif text-[18px] font-bold text-[#2b241d]">
                            {member.fullName || "Unnamed Member"}
                          </h4>

                          <p className="mt-1 text-[12.5px] text-[#685c4f]">
                            {member.gender || "Male"} {member.maritalStatus ? `• ${member.maritalStatus}` : ""} {member.dateOfBirth ? `• Age/DOB: ${member.dateOfBirth}` : ""}
                          </p>

                          {member.gotra && (
                            <p className="text-[12px] font-medium text-[#8c7e6c]">
                              Gotra: {member.gotra}
                            </p>
                          )}
                          {member.mobileNumber && (
                            <p className="text-[12px] text-[#8c7e6c]">
                              Mobile: {member.mobileNumber}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3 border-t border-[#f0e2cd] pt-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(member)}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#b36c1e] hover:underline"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          {members.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-red-600 hover:underline"
                            >
                              <Trash2 size={12} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Family Member Action */}
                  <div className="pt-2">
                    {members.length < maxMembers ? (
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal("Son")}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-[#fffdf9] px-6 py-3 text-[13px] font-bold text-[#2b241d] shadow-sm transition hover:border-[#d4872b] hover:bg-[#fffaf0]"
                      >
                        <Plus size={16} className="text-[#c77722]" />
                        <span>+ Add Family Member ({members.length} / {maxMembers})</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#f8edd8] px-4 py-2 text-[12px] font-bold text-[#8c6a2f]">
                        <CheckCircle2 size={14} className="text-green-600" />
                        <span>Maximum {maxMembers} members reached</span>
                      </div>
                    )}
                  </div>
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
                    <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                      City / Town <span className="text-[#c77722]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={commonData.city}
                      onChange={handleCommonChange}
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
                      value={commonData.country}
                      onChange={handleCommonChange}
                      placeholder="e.g. India"
                      className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Purpose / Sankalp Wish */}
                <div className="mt-4">
                  <label className="block text-[12.5px] font-bold uppercase tracking-wider text-[#4a3d31]">
                    Specific Wish / Intention for Sankalp <span className="text-[11px] font-normal text-[#8c7e6c]">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    name="sankalpPurpose"
                    value={commonData.sankalpPurpose}
                    onChange={handleCommonChange}
                    placeholder="Mention any specific wish e.g. health recovery for parents, career progress, removal of marriage obstacles..."
                    className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-[#fffaf0] p-3.5 text-[14px] text-[#2b241d] outline-none transition focus:border-[#d4872b] focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] py-4 text-[14px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(234,177,44,0.28)] transition-all duration-300 hover:brightness-105"
                >
                  <span>
                    Submit Sankalp & Proceed ({selectedPackage?.formattedPrice || "₹1,001"})
                  </span>
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
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
          MODAL: ADD / EDIT MEMBER DETAILS
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
                  {modalMode === "add" ? "Add Member Details" : "Edit Member Details"}
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

              {/* Contact (Optional for secondary members) */}
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
                  className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-sm hover:bg-[#dda018]"
                >
                  {modalMode === "add" ? "Add Member" : "Save Changes"}
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
