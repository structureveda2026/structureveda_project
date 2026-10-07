import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Sparkles,
  Layers,
  Scroll,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  FolderTree,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Veda } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

export const VedaListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [vedas, setVedas] = useState<Veda[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Veda | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);

  const fetchVedas = async () => {
    try {
      setLoading(true);
      const data = await VedaAdminService.getVedas();
      setVedas(data);
    } catch (err: any) {
      showToast(err.message || "वेद सूची लोड करने में विफल", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVedas();
  }, []);

  const handleSeedDefaultData = async () => {
    try {
      setSeeding(true);
      const res = await VedaAdminService.seedDefaultVedas(true);
      showToast(
        `वैदिक डेटा सफलतापूर्वक सीड हुआ! (${res.vedasCount} वेद, ${res.nodesCount} शाखाएँ/सूक्त, ${res.mantrasCount} मंत्र)`,
        "success"
      );
      setSeedConfirm(false);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "सीड विफल हुआ", "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaAdminService.deleteVeda(deleteTarget.id);
      showToast(`वेद "${deleteTarget.name}" सफलतापूर्वक हटाया गया`, "success");
      setDeleteTarget(null);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "हटाने में विफल", "error");
    }
  };

  const filteredVedas = vedas.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.enName.toLowerCase().includes(search.toLowerCase()) ||
      (v.desc && v.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const totalMantras = vedas.reduce(
    (acc, v) => acc + (v.statsMeta?.mantraCount || 0),
    0
  );
  const totalNodes = vedas.reduce(
    (acc, v) => acc + (v.statsMeta?.nodeCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="वेद प्रबंधन (Veda Heritage Library)"
        subtitle="ऋग्वेद, यजुर्वेद (शुक्ल व कृष्ण) एवं समस्त वेदों की शाखाएँ, सूक्त एवं मंत्रों का केंद्रीय प्रबंधन"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeedConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>डिफ़ॉल्ट वैदिक डेटा लोड करें (Seed Data)</span>
            </button>

            <Link
              to="/admin/library/mantras"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 text-charcoal-800 text-xs font-bold border border-cream-300 transition-colors shadow-2xs"
            >
              <Scroll className="w-3.5 h-3.5 text-saffron-600" />
              <span>समस्त मंत्र सूची</span>
            </Link>

            <Link
              to="/admin/library/vedas/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया वेद जोड़ें</span>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="कुल वेद (Vedas)"
          value={vedas.length}
          icon={BookOpen}
          color="saffron"
        />
        <StatCard
          label="उपलब्ध शाखाएँ व सूक्त"
          value={totalNodes}
          icon={Layers}
          color="blue"
        />
        <StatCard
          label="अपलोडेड मंत्र (Mantras)"
          value={totalMantras}
          icon={Scroll}
          color="emerald"
        />
        <StatCard
          label="भाषा समर्थन"
          value="3 भाषाएँ"
          sublabel="हिंदी • English • Hinglish"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-cream-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="वेद का नाम खोजें (e.g. ऋग्वेद, यजुर्वेद, Rigveda)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari"
          />
        </div>

        <button
          type="button"
          onClick={fetchVedas}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 text-charcoal-700 text-xs font-medium border border-cream-200 transition-colors self-end sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>रिफ्रेश</span>
        </button>
      </div>

      {/* Vedas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white border border-cream-200 animate-pulse p-6"
            />
          ))}
        </div>
      ) : filteredVedas.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200 shadow-2xs space-y-3">
          <p className="font-serif text-lg font-bold text-charcoal-800">
            कोई वेद नहीं मिला।
          </p>
          <p className="text-xs text-charcoal-500">
            कृपया डिफ़ॉल्ट वैदिक डेटा लोड करने के लिए "Seed Data" बटन दबाएं।
          </p>
          <button
            type="button"
            onClick={() => setSeedConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white text-xs font-bold shadow-xs hover:bg-saffron-700"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>डिफ़ॉल्ट वैदिक डेटा लोड करें</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredVedas.map((veda) => (
            <div
              key={veda.id}
              className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-200 font-devanagari">
                        {veda.badge || "श्रुति"}
                      </span>
                      {veda.priest && (
                        <span className="text-[11px] font-semibold text-charcoal-500">
                          ऋत्विक: {veda.priest}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1.5">
                      {veda.name}
                    </h3>
                    <p className="text-xs font-semibold text-saffron-700">
                      {veda.enName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      veda.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-charcoal-100 text-charcoal-600"
                    }`}
                  >
                    {veda.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-charcoal-600 font-devanagari line-clamp-2 leading-relaxed">
                  {veda.intro || veda.desc || veda.overviewText}
                </p>

                {/* Quick Info Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-cream-100 text-xs">
                  <div className="bg-cream-50/70 p-2 rounded-xl">
                    <span className="block text-[10px] font-bold uppercase text-charcoal-400">
                      शाखाएँ व सूक्त
                    </span>
                    <strong className="text-charcoal-800 text-xs font-mono">
                      {veda.statsMeta?.nodeCount || 0} नोड्स
                    </strong>
                  </div>
                  <div className="bg-cream-50/70 p-2 rounded-xl">
                    <span className="block text-[10px] font-bold uppercase text-charcoal-400">
                      अपलोडेड मंत्र
                    </span>
                    <strong className="text-charcoal-800 text-xs font-mono">
                      {veda.statsMeta?.mantraCount || 0} मंत्र
                    </strong>
                  </div>
                  <div className="bg-cream-50/70 p-2 rounded-xl col-span-2 sm:col-span-1">
                    <span className="block text-[10px] font-bold uppercase text-charcoal-400">
                      संरचना
                    </span>
                    <span className="text-charcoal-800 text-[11px] truncate block font-devanagari">
                      {veda.stats || "प्रामाणिक संहिता"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3.5 bg-cream-50/50 border-t border-cream-200 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/library/vedas/${veda.id}/structure`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold transition-all shadow-2xs"
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>संरचना व सूक्त (Structure Tree)</span>
                  </Link>

                  <Link
                    to={`/admin/library/mantras?vedaId=${veda.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-cream-100 text-charcoal-700 font-semibold border border-cream-300 transition-colors"
                  >
                    <Scroll className="w-3.5 h-3.5 text-saffron-600" />
                    <span>मंत्र देखें</span>
                  </Link>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/library/vedas/${veda.id}/edit`}
                    className="p-1.5 text-charcoal-500 hover:text-saffron-700 rounded-lg hover:bg-white border border-transparent hover:border-cream-300 transition-colors"
                    title="संपादित करें"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(veda)}
                    className="p-1.5 text-charcoal-500 hover:text-red-600 rounded-lg hover:bg-white border border-transparent hover:border-cream-300 transition-colors"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="वेद हटाएं (Delete Veda)"
        message={`क्या आप निश्चित रूप से वेद "${deleteTarget?.name}" को हटाना चाहते हैं? इसके अंतर्गत सभी शाखाएँ व सूक्त भी हट सकते हैं।`}
        confirmLabel="हटाएं (Delete)"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Seed Dataset Confirmation */}
      <ConfirmDialog
        isOpen={seedConfirm}
        title="डिफ़ॉल्ट वैदिक हेरिटेज डेटा लोड करें"
        message="यह क्रिया ऋग्वेद और यजुर्वेद (शुक्ल व कृष्ण) के प्रामाणिक अग्नि सूक्त, गायत्री महामंत्र, महामृत्युंजय, पुरुष सूक्त, रुद्राध्याय, शिवसंकल्प, ईशावास्योपनिषद आदि की संरचना व मंत्रों को डेटाबेस में लोड करेगी। क्या आप जारी रखना चाहते हैं?"
        confirmLabel={seeding ? "लोड हो रहा है..." : "हाँ, लोड करें (Seed Data)"}
        variant="warning"
        onConfirm={handleSeedDefaultData}
        onCancel={() => setSeedConfirm(false)}
      />
    </div>
  );
};

export default VedaListPage;
