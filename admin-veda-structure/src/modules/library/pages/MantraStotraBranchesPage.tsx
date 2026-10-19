import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  BookOpen,
  Flame,
  Scroll,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import libraryBranchService, {
  LibraryBranch,
  DEFAULT_MANTRA_BRANCHES,
} from "../services/libraryBranch.service";

export default function MantraStotraBranchesPage() {
  const { showSuccess, showError, showInfo } = useToast();

  const [branches, setBranches] = useState<LibraryBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "sukta" | "stotra">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<LibraryBranch | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [enName, setEnName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [stats, setStats] = useState("१०+ स्तोत्र व मंत्र");
  const [badge, setBadge] = useState("स्तोत्र व मंत्र");
  const [deity, setDeity] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<LibraryBranch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const data = await libraryBranchService.getBranches("mantra-stotra");
      setBranches(data);
    } catch (err: any) {
      showError(err?.message || "Failed to load mantra branches");
      setBranches(DEFAULT_MANTRA_BRANCHES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openCreateModal = () => {
    setEditingBranch(null);
    setName("");
    setEnName("");
    setSlug("");
    setDesc("");
    setStats("१०+ स्तोत्र व मंत्र");
    setBadge("स्तोत्र व मंत्र");
    setDeity("");
    setImageKey("");
    setOrderIndex(branches.length + 1);
    setStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const openEditModal = (branch: LibraryBranch) => {
    setEditingBranch(branch);
    setName(branch.name);
    setEnName(branch.enName || "");
    setSlug(branch.slug);
    setDesc(branch.desc || "");
    setStats(branch.stats || "१०+ स्तोत्र व मंत्र");
    setBadge(branch.badge || "स्तोत्र व मंत्र");
    setDeity(branch.deity || "");
    setImageKey(branch.imageKey || "");
    setOrderIndex(branch.orderIndex || 1);
    setStatus(branch.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("शाखा का नाम (Hindi Title) आवश्यक है");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        enName: enName.trim() || undefined,
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
        desc: desc.trim() || undefined,
        stats: stats.trim() || "१०+ स्तोत्र व मंत्र",
        badge: badge.trim() || undefined,
        deity: deity.trim() || undefined,
        imageKey: imageKey.trim() || undefined,
        orderIndex: Number(orderIndex) || 1,
        status,
      };

      if (editingBranch) {
        await libraryBranchService.updateBranch("mantra-stotra", editingBranch.id, payload);
        showSuccess("शाखा सफलतापूर्वक अपडेट की गई");
      } else {
        await libraryBranchService.createBranch("mantra-stotra", payload);
        showSuccess("नई शाखा सफलतापूर्वक जोड़ी गई");
      }

      setIsModalOpen(false);
      fetchBranches();
    } catch (err: any) {
      showError(err?.message || "शाखा सहेजने में विफल");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await libraryBranchService.deleteBranch("mantra-stotra", deleteTarget.id);
      showSuccess("शाखा सफलतापूर्वक हटाई गई");
      setDeleteTarget(null);
      fetchBranches();
    } catch (err: any) {
      showError(err?.message || "हटाने में विफल");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveBranch = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= branches.length) return;

    const newBranches = [...branches];
    const temp = newBranches[index];
    newBranches[index] = newBranches[targetIndex];
    newBranches[targetIndex] = temp;

    newBranches.forEach((b, idx) => {
      b.orderIndex = idx + 1;
    });

    setBranches(newBranches);
    try {
      await libraryBranchService.reorderBranches(
        "mantra-stotra",
        newBranches.map((b) => b.id)
      );
      showSuccess("शाखाओं का क्रम सफलतापूर्वक अद्यतित किया गया");
    } catch {
      showError("क्रम अद्यतित करने में विफल");
    }
  };

  const filteredBranches = branches.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      (b.enName && b.enName.toLowerCase().includes(q)) ||
      (b.desc && b.desc.toLowerCase().includes(q)) ||
      (b.deity && b.deity.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === "sukta") {
      return (
        b.name.includes("सूक्त") ||
        (b.badge && b.badge.includes("सूक्त")) ||
        (b.desc && b.desc.includes("सूक्त"))
      );
    }
    if (filterType === "stotra") {
      return (
        b.name.includes("स्तोत्र") ||
        (b.badge && b.badge.includes("स्तोत्र")) ||
        (b.desc && b.desc.includes("स्तोत्र"))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <PageHeader
        title="मंत्र, सूक्त एवं स्तोत्र के प्रमुख उप-विभाग एवं शाखाएँ"
        subtitle="अपनी रुचि के अनुसार किसी भी शाखा या विषय से शुरुआत करें। सभी 7 देव-शाखाओं का गतिशील प्रबंधन।"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchBranches();
                showInfo("शाखा सूची ताज़ा की गई");
              }}
              className="p-2 text-charcoal-500 hover:text-charcoal-800 bg-white border border-cream-200 rounded-lg hover:bg-cream-50 transition shadow-2xs"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-saffron-600 to-saffron-700 hover:from-saffron-500 hover:to-saffron-600 rounded-lg transition shadow-xs hover:shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नई शाखा जोड़ें (Add Branch)</span>
            </button>
          </div>
        }
      />

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-saffron-50 text-saffron-600 border border-saffron-200 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-charcoal-900 leading-tight">
              {branches.length} / {branches.length}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">कुल शाखाएँ उपलब्ध</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-emerald-700 leading-tight">
              {branches.filter((b) => b.status === "ACTIVE").length}
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">सक्रिय शाखाएँ (Active)</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-amber-700 leading-tight">
              १२०+
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">वैदिक मंत्र व स्तोत्र संग्रह</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-cream-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
            <Scroll className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-blue-700 leading-tight">
              ७ प्रमुख देव
            </div>
            <div className="text-[11px] text-charcoal-500 font-medium">शिव, विष्णु, देवी, गायत्री आदि</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-cream-200/90 shadow-2xs p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="शाखा, ग्रंथ या विषय खोजें (उदा. शिव, विष्णु, देवी, गायत्री, हनुमान)..."
            className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm bg-cream-50/40 border border-cream-200 rounded-lg focus:bg-white focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all placeholder:text-charcoal-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mr-1">
            फ़िल्टर:
          </span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === "all"
                ? "bg-saffron-600 text-white shadow-2xs"
                : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
            }`}
          >
            सभी ({branches.length})
          </button>
          <button
            onClick={() => setFilterType("sukta")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === "sukta"
                ? "bg-saffron-600 text-white shadow-2xs"
                : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
            }`}
          >
            सूक्त
          </button>
          <button
            onClick={() => setFilterType("stotra")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filterType === "stotra"
                ? "bg-saffron-600 text-white shadow-2xs"
                : "bg-cream-100/70 text-charcoal-600 hover:bg-cream-100"
            }`}
          >
            स्तोत्र
          </button>
        </div>
      </div>

      {/* Branches Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-charcoal-500 bg-white rounded-2xl border border-cream-200">
          <div className="w-7 h-7 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">शाखाएँ लोड हो रही हैं...</p>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="p-12 text-center text-charcoal-500 bg-white rounded-2xl border border-cream-200">
          <p className="text-sm font-semibold">कोई शाखा नहीं मिली</p>
          <p className="text-xs mt-1 text-charcoal-400">खोज शब्द बदलें या नई शाखा जोड़ें</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBranches.map((branch, idx) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Header & Badges */}
              <div className="p-4 bg-gradient-to-br from-cream-50/70 via-white to-amber-50/30 border-b border-cream-100 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-saffron-100 text-saffron-900 border border-saffron-200 flex items-center justify-center font-bold font-serif text-sm shrink-0 shadow-2xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-charcoal-900 group-hover:text-saffron-700 transition">
                      {branch.name}
                    </h3>
                    {branch.enName && (
                      <p className="text-xs text-charcoal-500 font-medium">
                        {branch.enName}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    branch.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-charcoal-100 text-charcoal-600 border border-charcoal-200"
                  }`}
                >
                  {branch.status === "ACTIVE" ? "सक्रिय" : "निष्क्रिय"}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 space-y-2.5">
                <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2">
                  {branch.desc || "महामृत्युंजय, शिव तांडव, रुद्राष्टकम एवं पञ्चाक्षर मंत्र।"}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/70">
                    {branch.stats || "१०+ स्तोत्र व मंत्र"}
                  </span>
                  {branch.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cream-100 text-charcoal-700 border border-cream-200">
                      {branch.badge}
                    </span>
                  )}
                  {branch.deity && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-saffron-700 bg-saffron-50 border border-saffron-200/60">
                      इष्ट: {branch.deity}
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-charcoal-400 pt-1">
                  slug: /library/mantra-stotra/{branch.slug}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="px-4 py-2.5 bg-cream-50/50 border-t border-cream-100 flex items-center justify-between">
                <a
                  href={`/library/mantra-stotra/${branch.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-600 hover:text-saffron-800 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explore {branch.slug}</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveBranch(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                    title="ऊपर ले जाएँ (Move Up)"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveBranch(idx, "down")}
                    disabled={idx === branches.length - 1}
                    className="p-1.5 text-charcoal-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                    title="नीचे ले जाएँ (Move Down)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(branch)}
                    className="p-1.5 text-charcoal-500 hover:text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                    title="Edit Branch"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(branch)}
                    className="p-1.5 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-bold text-base text-charcoal-900 font-serif">
                {editingBranch ? "शाखा विवरण संपादित करें" : "नई शाखा जोड़ें"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  शाखा का नाम (Hindi Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. शिव मंत्र एवं स्तोत्र"
                  className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  अंग्रेज़ी नाम (English Title)
                </label>
                <input
                  type="text"
                  value={enName}
                  onChange={(e) => setEnName(e.target.value)}
                  placeholder="उदा. Shiva Mantras & Stotras"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    Slug / URL Path
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="उदा. shiva, vishnu"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    इष्टदेवता Key
                  </label>
                  <input
                    type="text"
                    value={deity}
                    onChange={(e) => setDeity(e.target.value)}
                    placeholder="उदा. shiva, vishnu, devi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  शाखा विवरण (Description)
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="उदा. महामृत्युंजय, शिव तांडव, रुद्राष्टकम एवं पञ्चाक्षर मंत्र।"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    मंत्र गणना (Stats Badge)
                  </label>
                  <input
                    type="text"
                    value={stats}
                    onChange={(e) => setStats(e.target.value)}
                    placeholder="उदा. २५+ स्तोत्र व मंत्र"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    बैज (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="उदा. स्तोत्र व मंत्र"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    क्रम (Order Index)
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-200 focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1">
                    स्थिति (Status)
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-cream-200 bg-white focus:ring-1.5 focus:ring-saffron-500 focus:outline-hidden"
                  >
                    <option value="ACTIVE">सक्रिय (ACTIVE)</option>
                    <option value="INACTIVE">निष्क्रिय (INACTIVE)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-cream-100 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold text-white bg-saffron-600 hover:bg-saffron-700 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {isSaving ? "सहेजा जा रहा है..." : editingBranch ? "अपडेट करें" : "शाखा जोड़ें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="शाखा हटाएं"
        message={`क्या आप निश्चित रूप से '${deleteTarget?.name}' को हटाना चाहते हैं?`}
        confirmLabel="हटाएं (Delete)"
        isDestructive
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
