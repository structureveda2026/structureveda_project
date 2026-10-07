import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import Modal from "@/components/Modal";
import VedaMantraAdminService from "../services/vedaMantra.service";

interface BulkMantraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultVedaId?: string;
}

const SAMPLE_JSON_TEMPLATE = [
  {
    id: "rv-1-1-1",
    vedaId: "rigveda",
    nodeId: "rv-sukta-1",
    vedaName: "ऋग्वेद (Rigveda)",
    shakha: "शाकल शाखा",
    textName: "ऋग्वेद संहिता (अग्नि सूक्त)",
    sectionRef: "मण्डल १, सूक्त १",
    mantraNumber: "१.१.१",
    rishi: "मधुच्छन्दा वैश्वामित्र",
    devata: "अग्नि",
    chhanda: "गायत्री",
    svara: "सस्वर वैदिक पाठ",
    sanskrit: "ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्।\nहोता॑रं रत्न॒धात॑मम्॥१॥",
    transliteration: "oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam |\nhotāraṃ ratnadhātamam || 1 ||",
    hindiTranslation: "मैं यज्ञ के पुरोहित, दिव्य प्रकाशयुक्त अग्निदेव की स्तुति करता हूँ।",
    englishTranslation: "I magnify Agni, the divine domestic priest of the sacrifice.",
    hinglishTranslation: "Main yagya ke purohit Agni Dev ki stuti karta hoon.",
    padapatha: [
      { word: "अ॒ग्निम्", meaning: "अग्निदेव को" },
      { word: "ई॒ळे", meaning: "स्तुति करता हूँ" }
    ],
    shastricContext: "ऋग्वेद का प्रथम मंगलाचरण मंत्र।",
    orderIndex: 1,
    status: "ACTIVE"
  }
];

export const BulkMantraModal: React.FC<BulkMantraModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultVedaId = "rigveda",
}) => {
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        setError(null);
      } catch (err: any) {
        setError("फ़ाइल पढ़ने में त्रुटि: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (!jsonText.trim()) {
        throw new Error("कृपया JSON डेटा पेस्ट करें या फ़ाइल अपलोड करें।");
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err: any) {
        throw new Error("अमान्य JSON प्रारूप (Invalid JSON): " + err.message);
      }

      const list = Array.isArray(parsed) ? parsed : [parsed];
      if (list.length === 0) {
        throw new Error("JSON सूची में कोई मंत्र नहीं मिला।");
      }

      const res = await VedaMantraAdminService.bulkUpload(list);
      setResult(res);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "बल्क अपलोड विफल हुआ।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="बल्क मंत्र अपलोड (Bulk Mantra Upload)" size="lg">
      <div className="space-y-4">
        <p className="text-xs text-charcoal-500">
          एक साथ कई मंत्रों, सूक्तों या अध्यायों को JSON फ़ॉर्मेट में अपलोड करें। आप सीधे JSON फ़ाइल अपलोड कर सकते हैं या नीचे टेक्स्ट एरिया में पेस्ट कर सकते हैं।
        </p>

        {/* Toolbar: File Upload & Template Copy */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-cream-50 rounded-xl border border-cream-200 text-xs">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-charcoal-700 font-bold hover:bg-cream-100 cursor-pointer shadow-2xs transition-colors">
              <Upload className="w-3.5 h-3.5 text-saffron-600" />
              <span>.json फ़ाइल चुनें</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleCopyTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-50 hover:bg-saffron-100 text-saffron-800 font-bold border border-saffron-200 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "टेम्पलेट कॉपी हुआ!" : "नमूना टेम्पलेट (Sample JSON)"}</span>
          </button>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1">
            JSON डेटा (Array of Mantra objects):
          </label>
          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            placeholder={`[\n  {\n    "id": "rv-1-1-1",\n    "vedaId": "${defaultVedaId}",\n    "textName": "ऋग्वेद संहिता",\n    "sectionRef": "मण्डल १, सूक्त १",\n    "mantraNumber": "१.१.१",\n    "sanskrit": "ॐ अग्निमीळे पुरोहितं...",\n    "hindiTranslation": "...",\n    "englishTranslation": "...",\n    "hinglishTranslation": "..."\n  }\n]`}
            className="w-full p-3 rounded-xl text-xs font-mono bg-charcoal-950 text-emerald-400 border border-charcoal-800 focus:outline-none focus:border-saffron-500 leading-relaxed"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {result && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>सफलतापूर्वक अपलोड संपन्न!</span>
            </div>
            <p>
              कुल नए जोड़े गए: <strong>{result.created || 0}</strong> • अपडेट किए गए:{" "}
              <strong>{result.updated || 0}</strong>
            </p>
            {result.errors && result.errors.length > 0 && (
              <p className="text-amber-700">
                त्रुटियाँ ({result.errors.length}):{" "}
                {result.errors.map((e: any) => `${e.item}: ${e.error}`).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? "अपलोड हो रहा है..." : "मंत्र अपलोड करें (Upload)"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkMantraModal;
