import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, User, CalendarCheck, CreditCard, StickyNote, CheckCircle,
  CalendarClock, XCircle, Clock, MapPin, Phone, Mail, Video, Phone as PhoneIcon, User as UserIcon,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import { bookings } from '@/data/mockData';

export default function BookingDetail() {
  const { id } = useParams();
  const booking = bookings.find((b) => b.id === id);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [adminNotes, setAdminNotes] = useState(booking?.adminNotes || '');

  if (!booking) {
    return <EmptyState title="Booking not found" message="This booking doesn't exist." action={<Link to="/admin/bookings" className="btn-primary">Back to Bookings</Link>} />;
  }

  const customerInfo = [
    { label: 'Name', value: booking.customerName, icon: UserIcon },
    { label: 'Email', value: booking.customerEmail, icon: Mail },
    { label: 'Phone', value: booking.customerPhone, icon: Phone },
    { label: 'Gender', value: booking.gender, icon: UserIcon },
    { label: 'Date of Birth', value: booking.dateOfBirth, icon: CalendarClock },
    { label: 'Time of Birth', value: booking.timeOfBirth, icon: Clock },
    { label: 'Place of Birth', value: booking.placeOfBirth, icon: MapPin },
    { label: 'Address', value: booking.address, icon: MapPin },
  ];

  const bookingInfo = [
    { label: 'Booking ID', value: booking.id },
    { label: 'Service', value: booking.service },
    { label: 'Expert', value: booking.expert },
    { label: 'Booking Date', value: booking.bookingDate },
    { label: 'Booking Time', value: booking.bookingTime },
    { label: 'Duration', value: booking.duration },
    { label: 'Consultation Mode', value: booking.mode },
    { label: 'Booking Status', value: booking.status, badge: true },
  ];

  const paymentInfo = [
    { label: 'Amount', value: `₹${booking.amount.toLocaleString('en-IN')}` },
    { label: 'Payment Status', value: booking.paymentStatus, badge: true },
    { label: 'Transaction ID', value: booking.transactionId || '—' },
    { label: 'Payment Date', value: booking.paymentDate || '—' },
    { label: 'Payment Method', value: booking.paymentMethod || '—' },
  ];

  const modeIcon = booking.mode === 'Video Call' ? Video : booking.mode === 'Phone' ? PhoneIcon : booking.mode === 'In-Person' ? MapPin : UserIcon;
  const ModeIcon = modeIcon;

  return (
    <div>
      <div className="mb-4">
        <Link to="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-charcoal-800">{booking.id}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-sm text-charcoal-400 mt-1">{booking.service} · {booking.customerName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {booking.status === 'Pending' && (
            <button className="btn-primary"><CheckCircle className="w-4 h-4" /> Confirm Booking</button>
          )}
          {booking.status === 'Confirmed' && (
            <button className="btn-primary"><CheckCircle className="w-4 h-4" /> Mark Completed</button>
          )}
          <button onClick={() => setShowReschedule(true)} className="btn-secondary"><CalendarClock className="w-4 h-4" /> Reschedule</button>
          <button onClick={() => setShowCancel(true)} className="btn-danger"><XCircle className="w-4 h-4" /> Cancel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">Customer Information</h3>
          </div>
          <div className="space-y-0">
            {customerInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-cream-100 last:border-0">
                  <Icon className="w-4 h-4 text-charcoal-300 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-charcoal-400 w-32 flex-shrink-0">{item.label}</span>
                  <span className="text-sm font-medium text-charcoal-700">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Information */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-saffron-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">Booking Information</h3>
          </div>
          <div className="space-y-0">
            {bookingInfo.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-cream-100 last:border-0">
                <span className="text-sm text-charcoal-400">{item.label}</span>
                {item.badge ? <StatusBadge status={item.value} /> : <span className="text-sm font-medium text-charcoal-700">{item.value}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-cream-50 flex items-center gap-2.5">
            <ModeIcon className="w-5 h-5 text-saffron-600" />
            <span className="text-sm text-charcoal-600">This consultation will be conducted via <strong className="text-charcoal-700">{booking.mode}</strong></span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-charcoal-800">Payment Information</h3>
          </div>
          <div className="space-y-0">
            {paymentInfo.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-cream-100 last:border-0">
                <span className="text-sm text-charcoal-400">{item.label}</span>
                {item.badge ? <StatusBadge status={item.value} /> : <span className="text-sm font-medium text-charcoal-700">{item.value}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-6">
          {/* Customer Notes */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">Customer Notes</h3>
            </div>
            <p className="text-sm text-charcoal-600 leading-relaxed bg-cream-50 rounded-lg p-3.5">
              {booking.customerNotes || 'No notes provided by customer.'}
            </p>
          </div>

          {/* Admin Notes */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-charcoal-100 flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-charcoal-600" />
              </div>
              <h3 className="text-base font-semibold text-charcoal-800">Admin Notes</h3>
            </div>
            <textarea
              className="input-field min-h-[100px] resize-y"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this booking..."
            />
            <button className="btn-primary mt-3">Save Notes</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => {}}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking ${booking.id}? The customer will be notified and refund will be processed if applicable.`}
        confirmText="Yes, Cancel Booking"
        danger
      />

      <Modal isOpen={showReschedule} onClose={() => setShowReschedule(false)} title="Reschedule Booking" size="md">
        <div className="space-y-4">
          <div>
            <label className="label-field">New Date</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="label-field">New Time</label>
            <input type="time" className="input-field" />
          </div>
          <div>
            <label className="label-field">Reason for Reschedule</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Add a reason..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowReschedule(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setShowReschedule(false)} className="btn-primary">Reschedule</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
