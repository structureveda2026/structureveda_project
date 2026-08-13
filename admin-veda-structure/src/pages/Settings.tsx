import { useState } from 'react';
import {
  Settings as SettingsIcon, User, Building, CreditCard, CalendarCheck,
  Bell, Shield, Save,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import type { LucideIcon } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'profile', label: 'Admin Profile', icon: User },
  { id: 'business', label: 'Business Info', icon: Building },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'booking', label: 'Booking', icon: CalendarCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
] as const;

type TabId = typeof tabs[number]['id'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your admin account and platform configuration." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="card p-2 lg:col-span-1 h-fit">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-saffron-50 text-saffron-700'
                      : 'text-charcoal-500 hover:bg-cream-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-saffron-600' : 'text-charcoal-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'general' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Site Name</label>
                    <input className="input-field" defaultValue="Veda Structure" />
                  </div>
                  <div>
                    <label className="label-field">Support Email</label>
                    <input className="input-field" defaultValue="support@vedastructure.com" />
                  </div>
                  <div>
                    <label className="label-field">Support Phone</label>
                    <input className="input-field" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="label-field">Timezone</label>
                    <select className="input-field" defaultValue="IST">
                      <option value="IST">India Standard Time (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Currency</label>
                    <select className="input-field" defaultValue="INR">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Language</label>
                    <select className="input-field" defaultValue="en">
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Admin Profile</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">A</div>
                  <button className="btn-secondary">Change Photo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Full Name</label>
                    <input className="input-field" defaultValue="Admin User" />
                  </div>
                  <div>
                    <label className="label-field">Email</label>
                    <input className="input-field" defaultValue="admin@vedastructure.com" />
                  </div>
                  <div>
                    <label className="label-field">Phone</label>
                    <input className="input-field" defaultValue="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="label-field">Role</label>
                    <input className="input-field" defaultValue="Super Admin" disabled />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Business Name</label>
                    <input className="input-field" defaultValue="Veda Structure Pvt. Ltd." />
                  </div>
                  <div>
                    <label className="label-field">GST Number</label>
                    <input className="input-field" defaultValue="29ABCDE1234F1Z5" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Business Address</label>
                    <textarea className="input-field min-h-[80px] resize-y" defaultValue="123 Commercial Street, Bengaluru, Karnataka 560001" />
                  </div>
                  <div>
                    <label className="label-field">PAN Number</label>
                    <input className="input-field" defaultValue="ABCDE1234F" />
                  </div>
                  <div>
                    <label className="label-field">CIN</label>
                    <input className="input-field" defaultValue="U72200KA2021PTC123456" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">UPI Payments</p>
                      <p className="text-xs text-charcoal-400">Accept payments via UPI (GPay, PhonePe, Paytm)</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">Credit / Debit Cards</p>
                      <p className="text-xs text-charcoal-400">Accept Visa, Mastercard, RuPay cards</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">Cash on Delivery (COD)</p>
                      <p className="text-xs text-charcoal-400">Allow customers to pay on delivery</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">Net Banking</p>
                      <p className="text-xs text-charcoal-400">Accept bank transfers</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'booking' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Booking Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Minimum Booking Advance (hours)</label>
                    <input type="number" className="input-field" defaultValue="12" />
                  </div>
                  <div>
                    <label className="label-field">Maximum Booking Duration (hours)</label>
                    <input type="number" className="input-field" defaultValue="4" />
                  </div>
                  <div>
                    <label className="label-field">Cancellation Window (hours)</label>
                    <input type="number" className="input-field" defaultValue="24" />
                  </div>
                  <div>
                    <label className="label-field">Refund Policy (days)</label>
                    <input type="number" className="input-field" defaultValue="7" />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                  <p className="text-sm font-medium text-charcoal-700">Allow customers to reschedule bookings</p>
                </label>
                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                  <p className="text-sm font-medium text-charcoal-700">Send booking reminders 1 hour before session</p>
                </label>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  {[
                    { label: 'New Order Alerts', desc: 'Get notified when a new order is placed' },
                    { label: 'New Booking Alerts', desc: 'Get notified when a new booking is made' },
                    { label: 'Payment Notifications', desc: 'Get notified about payment status changes' },
                    { label: 'Low Stock Alerts', desc: 'Get notified when products are running low' },
                    { label: 'New Customer Registration', desc: 'Get notified when a new customer joins' },
                    { label: 'Review Notifications', desc: 'Get notified when a new review is posted' },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                      <div>
                        <p className="text-sm font-medium text-charcoal-700">{item.label}</p>
                        <p className="text-xs text-charcoal-400">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-charcoal-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label-field">Current Password</label>
                    <input type="password" className="input-field" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="label-field">New Password</label>
                    <input type="password" className="input-field" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="label-field">Confirm New Password</label>
                    <input type="password" className="input-field" placeholder="Confirm new password" />
                  </div>
                </div>
                <div className="pt-4 border-t border-cream-100 space-y-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">Two-Factor Authentication</p>
                      <p className="text-xs text-charcoal-400">Require OTP verification on login</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3.5 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-300" />
                    <div>
                      <p className="text-sm font-medium text-charcoal-700">IP Whitelist</p>
                      <p className="text-xs text-charcoal-400">Restrict admin access to specific IP addresses</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-cream-100">
              <button className="btn-primary"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
