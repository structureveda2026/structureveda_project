import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import consultationService, {
  ConsultationRequest,
} from "@/services/consultationService";
import EmptyState from "@/components/EmptyState";

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<ConsultationRequest | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await consultationService.getConsultation(id);
        setConsultation(data);
      } catch (err) {
        setError(
          (err as Error).message || "Unable to load consultation details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [id]);

  const handleMarkRead = async () => {
    if (!id) return;
    try {
      const data = await consultationService.markRead(id);
      setConsultation(data);
    } catch (err) {
      setError((err as Error).message || "Unable to update status");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">Loading consultation details...</div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!consultation) {
    return (
      <EmptyState
        title="Consultation not found"
        message="This consultation request does not exist."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Consultation Detail"
        subtitle="Review user consultation request details and mark it as read."
      />

      <div className="card p-6 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/consultations")}
          className="inline-flex items-center gap-2 text-saffron-600 hover:text-saffron-700 mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to consultations
        </button>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-3xl border border-cream-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-saffron-600" />
                <h3 className="font-semibold text-charcoal-800">
                  Personal information
                </h3>
              </div>
              <p className="text-sm text-charcoal-600">
                <strong>Name:</strong> {consultation.fullName}
              </p>
              <p className="text-sm text-charcoal-600">
                <strong>Email:</strong> {consultation.email}
              </p>
              <p className="text-sm text-charcoal-600">
                <strong>Phone:</strong> {consultation.phone}
              </p>
              <p className="text-sm text-charcoal-600">
                <strong>Age:</strong> {consultation.age}
              </p>
            </div>

            <div className="rounded-3xl border border-cream-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-saffron-600" />
                <h3 className="font-semibold text-charcoal-800">
                  Birth details
                </h3>
              </div>
              <p className="text-sm text-charcoal-600">
                <strong>Date of birth:</strong> {consultation.dateOfBirth}
              </p>
              <p className="text-sm text-charcoal-600">
                <strong>Time of birth:</strong> {consultation.timeOfBirth}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-saffron-600" />
              <h3 className="font-semibold text-charcoal-800">
                Consultation message
              </h3>
            </div>
            <p className="text-sm text-charcoal-600 whitespace-pre-line">
              {consultation.message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-charcoal-500">Status</p>
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-charcoal-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {consultation.isRead ? "Read" : "Pending"}
            </div>
          </div>

          {!consultation.isRead && (
            <button
              type="button"
              onClick={handleMarkRead}
              className="btn-primary px-5 py-3"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
