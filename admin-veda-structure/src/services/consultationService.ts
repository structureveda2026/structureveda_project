import api from "@/services/api";

export interface ConsultationRequest {
  id: string;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  dateOfBirth: string;
  timeOfBirth: string;
  message: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const getConsultations = async () => {
  const response = await api.get("/consultations");
  return response.data as ConsultationRequest[];
};

const getConsultation = async (id: string) => {
  const response = await api.get(`/consultations/${id}`);
  return response.data as ConsultationRequest;
};

const markRead = async (id: string) => {
  const response = await api.patch(`/consultations/${id}/read`, {});
  return response.data as ConsultationRequest;
};

export default { getConsultations, getConsultation, markRead };
