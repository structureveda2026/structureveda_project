import api from "./api";

export interface AdminBooking {
  id: string;
  bookingReference: string;
  userId?: string | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
  astrologerId: string;
  astrologerName: string;
  packageId: string;
  packageName: string;
  duration: string;
  amount: number;
  addOns?: Record<string, boolean>;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  reportLanguage: string;
  phone: string;
  email?: string | null;
  consultationDate: string;
  consultationTime: string;
  consultationMode: string;
  selectedTopics?: string[];
  bookingStatus:
    | "Pending"
    | "Confirmed"
    | "Completed"
    | "Cancelled"
    | "Rescheduled"
    | "Payment Review Required";
  paymentStatus:
    | "Pending"
    | "Paid"
    | "Failed"
    | "Refunded"
    | "Refund Pending"
    | "Refund Failed"
    | "Refund In Progress"
    | "Partially Refunded";
  paymentMethod: string;
  transactionId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  search?: string;
  astrologerId?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface BookingListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  page: number;
  data: AdminBooking[];
}

const getBookings = async (
  params?: BookingFilters
): Promise<BookingListResponse> => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.astrologerId) query.append("astrologerId", params.astrologerId);
  if (params?.bookingStatus)
    query.append("bookingStatus", params.bookingStatus);
  if (params?.paymentStatus)
    query.append("paymentStatus", params.paymentStatus);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const queryString = query.toString();
  const endpoint = queryString
    ? `/api/bookings/admin?${queryString}`
    : "/api/bookings/admin";

  return api.get(endpoint);
};

const getBookingById = async (
  id: string
): Promise<{ success: boolean; data: AdminBooking }> => {
  return api.get(`/api/bookings/admin/${id}`);
};

const updateBookingStatus = async (
  id: string,
  bookingStatus: string,
  notes?: string
): Promise<{ success: boolean; message: string; data: AdminBooking }> => {
  return api.patch(`/api/bookings/admin/${id}/status`, {
    bookingStatus,
    notes,
  });
};

const rescheduleBooking = async (
  id: string,
  consultationDate: string,
  consultationTime: string,
  notes?: string
): Promise<{ success: boolean; message: string; data: AdminBooking }> => {
  return api.patch(`/api/bookings/admin/${id}/reschedule`, {
    consultationDate,
    consultationTime,
    notes,
  });
};

const initiateBookingRefund = async (
  id: string,
  refundAmount?: number,
  refundNote?: string
): Promise<{ success: boolean; message: string; data: any }> => {
  return api.post(`/api/bookings/admin/${id}/initiate-refund`, {
    refundAmount,
    refundNote,
  });
};

const verifyBookingRefund = async (
  id: string,
  refundId?: string
): Promise<{ success: boolean; verified: boolean; message: string; data: AdminBooking }> => {
  return api.post(`/api/bookings/admin/${id}/verify-refund`, {
    refundId,
  });
};

const bookingAdminService = {
  getBookings,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  initiateBookingRefund,
  verifyBookingRefund,
};

export default bookingAdminService;
