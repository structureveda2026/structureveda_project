import api from "../../services/api";

const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

const getBookingByReferenceOrId = async (identifier) => {
  const response = await api.get(`/bookings/${identifier}`);
  return response.data;
};

const getMyBookings = async () => {
  const response = await api.get("/bookings/my-bookings");
  return response.data;
};

const bookingService = {
  createBooking,
  getBookingByReferenceOrId,
  getMyBookings,
};

export default bookingService;
