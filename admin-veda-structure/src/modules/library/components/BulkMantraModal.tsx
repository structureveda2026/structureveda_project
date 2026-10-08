import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Code2,
} from "lucide-react";
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
    svara: "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    sanskrit: "ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्।\nहोता॑रं रत्न॒धात॑मम्॥१॥",
    transliteration: "oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam |\nhotāraṃ ratnadhātamam || 1 ||",
    hindiTranslation: "मैं यज्ञ के पुरोहित, दिव्य प्रकाशयुक्त अग्निदेव की स्तुति करता हूँ जो होता और रत्नों को धारण करने वाले हैं।",
    englishTranslation: "I magnify Agni, the divine priest of the sacrifice, the hotar, the greatest bestower of treasures.",
    hinglishTranslation: "Main yagya ke purohit, divya prakashmay Agni Dev ki stuti karta hoon jo ratno ko dharan karne wale hain.",
    padapatha: [
      { word: "अ॒ग्निम्", meaning: "अग्निदेव को" },
      { word: "ई॒ळे", meaning: "स्तुति करता हूँ" },
      { word: "पु॒रो-हि॑तम्", meaning: "सम्मुख स्थापित पुरोहित को" },
      { word: "य॒ज्ञस्य॑", meaning: "यज्ञ के" },
      { word: "दे॒वम्", meaning: "प्रकाशमान देव को" },
      { word: "ऋ॒त्विज॑म्", meaning: "ऋत्विक् को" },
      { word: "होता॑रम्", meaning: "आह्वान करने वाले को" },
      { word: "र॒त्न॒-धात॑मम्", meaning: "उत्कृष्ट रत्नों के दाता को" }
    ],
    shastricContext: "ऋग्वेद का प्रथम मंगलाचरण मंत्र। अग्निदेव को ब्रह्म रूप में सर्वप्रथम वंदन किया गया है।",
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
  const [showSamplePreview, setShowSamplePreview] = useState(false);

  const sampleJsonString = JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setJsonText(sampleJsonString);
    setError(null);
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

  // Quick detect item count in JSON
  const detectedCount = React.useMemo(() => {
    if (!jsonText.trim()) return null;
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) return parsed.length;
      if (parsed && typeof parsed === "object") return 1;
      return null;
    } catch {
      return null;
    }
  }, [jsonText]);

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
    <Modal isOpen={isOpen} onClose={onClose} title="बल्क मंत्र अपलोड (Bulk Vedic Mantras Upload)" size="lg">
      <div className="space-y-4">
        {/* Vedic Subtitle banner */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            एक साथ कई वैदिक मंत्रों, सूक्तों, पदच्छेद एवं ३-भाषी अनुवादों को JSON प्रारूप में डेटाबेस में अपलोड या अद्यतन (Update) करें।
          </p>
        </div>

        {/* Toolbar: File Upload & Template Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-cream-50 rounded-xl border border-cream-200 text-xs">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-charcoal-700 font-bold hover:bg-cream-100 cursor-pointer shadow-2xs transition-colors">
              <Upload className="w-3.5 h-3.5 text-saffron-600" />
              <span>.json फ़ाइल अपलोड करें</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {detectedCount !== null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {detectedCount} मंत्र संकलित
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-cream-100 text-charcoal-700 font-bold border border-cream-300 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>नमूना डेटा भरें</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-50 hover:bg-saffron-100 text-saffron-800 font-bold border border-saffron-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>कॉपी हुआ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>टेम्पलेट कॉपी करें</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample JSON Collapsible Preview */}
        <div className="border border-cream-200 rounded-xl overflow-hidden bg-cream-50/50">
          <button
            type="button"
            onClick={() => setShowSamplePreview(!showSamplePreview)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-charcoal-700 hover:bg-cream-100/80 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-saffron-600" />
              <span>वैदिक JSON संरचना पूर्वावलोकन (Sample JSON Preview & Schema)</span>
            </div>
            {showSamplePreview ? (
              <ChevronUp className="w-4 h-4 text-charcoal-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal-400" />
            )}
          </button>

          {showSamplePreview && (
            <div className="p-3 bg-charcoal-950 border-t border-charcoal-800 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-charcoal-800 text-charcoal-400 font-mono text-[11px]">
                <span>Mantra Structure Template</span>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </button>
              </div>
              <pre className="text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed scrollbar-thin">
                {sampleJsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-charcoal-800">
              JSON डेटा पेस्ट करें (Mantra Array):
            </label>
            {jsonText.trim() && (
              <button
                type="button"
                onClick={() => setJsonText("")}
                className="text-[11px] text-charcoal-500 hover:text-red-600 transition-colors"
              >
                खाली करें (Clear)
              </button>
            )}
          </div>
          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            placeholder={`[\n  {\n    "id": "rv-1-1-1",\n    "vedaId": "${defaultVedaId}",\n    "textName": "ऋग्वेद संहिता",\n    "sectionRef": "मण्डल १, सूक्त १",\n    "mantraNumber": "१.१.१",\n    "sanskrit": "ॐ अग्निमीळे पुरोहितं...",\n    "hindiTranslation": "...",\n    "englishTranslation": "...",\n    "hinglishTranslation": "..."\n  }\n]`}
            className="w-full p-3.5 rounded-xl text-xs font-mono bg-charcoal-950 text-emerald-400 border border-charcoal-800 focus:outline-none focus:border-saffron-500 leading-relaxed shadow-inner"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {result && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>मंत्र सफलतापूर्वक अपलोड किए गए!</span>
            </div>
            <p className="text-emerald-800">
              कुल नए जोड़े गए: <strong>{result.created || 0}</strong> • अपडेट किए गए:{" "}
              <strong>{result.updated || 0}</strong>
            </p>
            {result.errors && result.errors.length > 0 && (
              <p className="text-amber-800">
                त्रुटियाँ ({result.errors.length}):{" "}
                {result.errors.map((e: any) => `${e.item}: ${e.error}`).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            disabled={loading || !jsonText.trim()}
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>अपलोड हो रहा है...</span>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>मंत्र अपलोड करें (Upload)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkMantraModal;
