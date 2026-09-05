import React, { useState } from 'react';
import { User, Users, Home, Sparkles, CheckCircle2 } from 'lucide-react';

const HOMA_MODES = [
  {
    id: 'individual',
    icon: User,
    name: 'Individual Sankalpa',
    tagline: 'Personal health, spiritual progress & astrological relief',
    description: 'The Ahutis and Sankalpa are taken specifically in the name and Gotra of a single individual. Recommended for Nakshatra Shanti, Ayushya Homa, or personal Graha Dosha remedies.',
    attributes: [
      'Single individual Name, Gotra & Nakshatra',
      'Direct Ahuti dedication for personal spiritual alignment',
      'Tailored sankalpa focused on personal life milestones',
    ],
  },
  {
    id: 'couple',
    icon: Users,
    name: 'Dampati / Couple Sankalpa',
    tagline: 'Harmony, progeny & mutual prosperity',
    description: 'Both husband and wife take joint Sankalpa before Agni. Standard practice for Vivaha anniversary rituals, Santana Gopala Homa, and Graha Shanti for household wellbeing.',
    attributes: [
      'Joint Sankalpa for both spouses',
      'Gotra, Janma Rashi & Nakshatra of both partners recorded',
      'Focus on marital harmony and family lineage protection',
    ],
  },
  {
    id: 'family',
    icon: Home,
    name: 'Family & Kula Sankalpa',
    tagline: 'Generational protection, peace & domestic harmony',
    description: 'Involves all immediate family members. Offerings invoke Kuladevata and protect the household from negative influences, Vaastu imbalances, and collective health concerns.',
    attributes: [
      'Names and Nakshatras of all family members recited in Sankalpa',
      'Collective Agnihotra blessings for home and progeny',
      'Particularly suited for Maha Mrityunjaya and Navagraha Homa',
    ],
  },
  {
    id: 'special',
    icon: Sparkles,
    name: 'Special Occasion / Muhurta',
    tagline: 'Griha Pravesh, milestone birthdays & spiritual milestones',
    description: 'Conducted at auspicious Vedic Muhurtas for new beginnings, housewarming (Vastu Homa), Shashti Poorti (60th birthday), or specific vow completions.',
    attributes: [
      'Muhurta alignment supervised by learned Acharyas',
      'Configurable Havan count tailored to the magnitude of the event',
      'Optional Kashi Kshetra or native home premises arrangement',
    ],
  },
];

export default function HomaArrangementModes({ onSelectMode }) {
  const [activeTab, setActiveTab] = useState('individual');
  const activeMode = HOMA_MODES.find(m => m.id === activeTab) || HOMA_MODES[0];

  return (
    <section className="py-20 bg-[#fbf8f2] border-b border-[#e8dfd1]" id="homa-modes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
            SANKALPA ARCHITECTURE • PARTICIPATION SCOPE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mt-2 mb-4">
            Your Homa, Your Sankalpa
          </h2>
          <p className="text-sm sm:text-base text-[#685847] leading-relaxed">
            Every Vedic fire ritual begins with a clearly uttered Sankalpa that articulates the participant’s
            intent and identity before Agni. Applicable Sankalpa configurations depend on the chosen Homa.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {HOMA_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeTab === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveTab(mode.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col items-start gap-2 ${
                  isSelected
                    ? 'bg-white border-[#b36c1e] shadow-md ring-1 ring-[#b36c1e]'
                    : 'bg-[#faf6ee] border-[#ebdcc4] hover:bg-white text-[#685847]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-[#b36c1e] text-white' : 'bg-[#f0e4d0] text-[#7d5329]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-serif font-semibold text-sm ${isSelected ? 'text-[#2a221b]' : 'text-[#44362b]'}`}>
                    {mode.name}
                  </div>
                  <div className="text-xs text-[#8c7863] mt-0.5 line-clamp-1">
                    {mode.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Mode Highlight Box */}
        <div className="bg-white rounded-2xl border border-[#ebdcc4] p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#f0e6d6]">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#b36c1e] bg-[#faf3e3] px-3 py-1 rounded-full border border-[#ebdcc4]">
                Configuration Scope
              </span>
              <h3 className="text-2xl font-serif text-[#2a221b] mt-3">
                {activeMode.name}
              </h3>
              <p className="text-sm text-[#7d6854] mt-1 italic font-serif">
                "{activeMode.tagline}"
              </p>
            </div>
            <div className="text-xs text-[#8c7863] max-w-xs bg-[#fbf9f4] p-3 rounded-lg border border-[#ebdcc4]">
              <span className="font-semibold text-[#3b2d22] block mb-0.5">Vedic Protocol Notice:</span>
              Gotra and Nakshatra are verified prior to the ritual to ensure proper invocation during Sankalpa.
            </div>
          </div>

          <p className="text-[#514336] text-sm sm:text-base leading-relaxed my-6">
            {activeMode.description}
          </p>

          <div className="space-y-3 bg-[#faf7f0] p-5 rounded-xl border border-[#ebdcc4]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#44362b]">
              Sankalpa Parameters Recorded:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeMode.attributes.map((attr, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#685847]">
                  <CheckCircle2 className="w-4 h-4 text-[#b36c1e] shrink-0 mt-0.5" />
                  <span>{attr}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7863] pt-4 border-t border-[#f0e6d6]">
            <p>
              Note: Applicable Sankalpa fields adapt dynamically in the booking demonstrator according to the selected Homa.
            </p>
            <a
              href="#demonstrator"
              className="px-4 py-2 bg-[#2a221b] hover:bg-[#3d3126] text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Test in Demonstrator →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
