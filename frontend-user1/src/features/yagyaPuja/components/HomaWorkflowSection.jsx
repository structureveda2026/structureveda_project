import React from 'react';
import {
  Flame,
  Sliders,
  ScrollText,
  CalendarCheck,
  CreditCard,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const BOOKING_STEPS = [
  {
    step: '01',
    title: 'Select Homa',
    icon: Flame,
    desc: 'Browse our Shastric catalogue and choose the fire ritual suited to your spiritual or astrological purpose.',
  },
  {
    step: '02',
    title: 'Configure',
    icon: Sliders,
    desc: 'Choose supported Havan counts (1, 3, 5, 7, 11), multi-day duration, and location preference (Kashi or Remote).',
  },
  {
    step: '03',
    title: 'Share Sankalpa',
    icon: ScrollText,
    desc: 'Provide your family Gotra, Nakshatras, Janma Rashis, and specific prayer intentions for sacred recitation.',
  },
  {
    step: '04',
    title: 'Check Availability',
    icon: CalendarCheck,
    desc: 'Future scheduler checks Acharya team availability and verifies auspicious Vedic Muhurtas for fire kindling.',
  },
  {
    step: '05',
    title: 'Confirm Booking',
    icon: CreditCard,
    desc: 'Secure confirmation with transparent breakdown of Pandit Dakshina, sacred Samagri, and ritual logistics.',
  },
  {
    step: '06',
    title: 'Homa Is Performed',
    icon: Sparkles,
    desc: 'Ritual conducted with rigorous Agnihotra vidhi, prescribed Ahuti counts, and devoted mantra recitation.',
  },
  {
    step: '07',
    title: 'Completion',
    icon: CheckCircle2,
    desc: 'Purnahuti, Agni pradakshina, and ritual blessings conclude the fire ceremony with spiritual discipline.',
  },
];

export default function HomaWorkflowSection() {
  return (
    <section className="py-20 bg-[#fffdf9] border-b border-[#e8dfd1]" id="booking-workflow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
            TRANSPARENT CEREMONY ARRANGEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mt-2 mb-4">
            From Configuration to Completion
          </h2>
          <p className="text-sm sm:text-base text-[#685847] leading-relaxed">
            Organizing an authentic Vedic Homa should be seamless and transparent. Here is how your ritual
            is planned, scheduled, and brought to sacred fulfillment.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {BOOKING_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#faf6ee] rounded-xl p-6 border border-[#ebdcc4] relative hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#b36c1e] bg-white border border-[#ebdcc4] px-2.5 py-1 rounded-md">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#f0e4d0] text-[#7d5329] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif font-semibold text-base text-[#2a221b] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#685847] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Explanatory notice card */}
          <div className="bg-[#2a221b] text-white rounded-xl p-6 border border-[#44362b] flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c77722] mb-1">
              SYSTEM DISCLOSURE
            </span>
            <h4 className="font-serif font-semibold text-sm text-[#faf4e6] mb-2">
              Architecture Overview
            </h4>
            <p className="text-[11px] text-[#d1c7bc] leading-relaxed">
              This 7-step sequence illustrates the full end-to-end journey. The landing page demonstrates configuration parameters prior to full booking engine rollout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
