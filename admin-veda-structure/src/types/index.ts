export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';
export type BookingType = 'Astrology Consultation' | 'Pandit Booking' | 'Vastu Consultation' | 'Numerology' | 'Other Services';
export type ConsultationMode = 'Online' | 'Phone' | 'In-Person' | 'Video Call';
export type ExpertType = 'Pandit' | 'Astrologer' | 'Spiritual Expert';
export type ExpertStatus = 'Active' | 'On Leave' | 'Inactive';
export type CourseStatus = 'Published' | 'Draft' | 'Archived';
export type ReviewStatus = 'Approved' | 'Pending' | 'Hidden';
export type CouponStatus = 'Active' | 'Expired' | 'Inactive';
export type Gender = 'Male' | 'Female' | 'Other';
export type CustomerStatus = 'Active' | 'Inactive';
export type CategoryStatus = 'Active' | 'Inactive';
export type DiscountType = 'Percentage' | 'Fixed';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockThreshold: number;
  weight: string;
  dimensions: string;
  images: string[];
  thumbnail: string;
  tags: string[];
  status: ProductStatus;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  createdAt: string;
  sales: number;
}

export interface Category {
  id: string;
  name: string;
  productsCount: number;
  status: CategoryStatus;
  createdAt: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  students: number;
  lessons: number;
  duration: string;
  status: CourseStatus;
  createdAt: string;
  thumbnail: string;
  description: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gender: Gender;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  address: string;
  service: BookingType;
  expert: string;
  expertId: string;
  bookingDate: string;
  bookingTime: string;
  duration: string;
  status: BookingStatus;
  mode: ConsultationMode;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  customerNotes: string;
  adminNotes: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  orderStatus: OrderStatus;
  shippingAddress: string;
  date: string;
  timeline: { status: string; date: string; done: boolean }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  orders: number;
  bookings: number;
  totalSpent: number;
  joinedDate: string;
  status: CustomerStatus;
  avatar: string;
  address: string;
}

export interface Expert {
  id: string;
  name: string;
  type: ExpertType;
  specialization: string;
  experience: number;
  rating: number;
  bookings: number;
  status: ExpertStatus;
  photo: string;
  bio: string;
  languages: string[];
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
}

export interface Payment {
  id: string;
  transactionId: string;
  customerName: string;
  refId: string;
  refType: 'Order' | 'Booking';
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
}

export interface Review {
  id: string;
  customerName: string;
  itemType: 'Product' | 'Course' | 'Service';
  itemName: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrder: number;
  maximumDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: CouponStatus;
}

export interface Notification {
  id: string;
  type: 'order' | 'booking' | 'payment' | 'stock' | 'customer' | 'cancellation';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}
