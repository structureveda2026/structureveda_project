import api from "../../services/api";

const createConsultation = async (consultationData) => {
  const endpoint =
    import.meta.env.VITE_CONSULTATION_ENDPOINT || "/consultations";
  const response = await api.post(endpoint, consultationData);

  return response.data;
};

export default { createConsultation };
