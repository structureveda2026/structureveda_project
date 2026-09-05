import React from 'react';
import { Sliders, Users, Flame, Layers, ScrollText, Landmark } from 'lucide-react';

const PILLARS = [
  {
    icon: Sliders,
    title: 'Ritual-Specific Configuration',
    description:
      'Rather than one-size-fits-all puja packages, each Homa respects its traditional Shastric requirements with dedicated offerings, count limits, and ritual days.',
  },
  {
    icon: Users,
    title: 'Pandit Coordination',
    description:
      'We coordinate learned Vedic Acharyas and Ritviks versed in prescribed Veda Shakhas, ensuring authentic pronunciation, Vidhi observance, and proper team ratios.',
  },
  {
    icon: Flame,
    title: 'Samagri Arrangement',
    description:
      'From pure Desi Cow Ghee (Ghrita) and specific dry Samidha wood to prescribed herbs and dhanya, every sacred offering is verified per Shastric standards.',
  },
  {
    icon: Layers,
    title: 'Flexible Havan Count',
    description:
      'Scale your ritual with service-verified configurations (1, 3, 5, 7, 11, or Custom Havan) based strictly on scriptural capability and user Sankalpa.',
  },
  {
    icon: ScrollText,
    title: 'Sankalpa Management',
    description:
      'Structured intake of Gotra, Nakshatra, Janma Rashi, and ritual intent ensures that every Ahuti offered into Agni carries the precise dedication of your family.',
  },
  {
    icon: Landmark,
    title: 'Kashi-Based Services',
    description:
      'Option to perform selected Homas directly in the sacred Kshetra of Kashi (Varanasi), or participate via verified remote streaming arrangements where eligible.',
  },
];

export default function HomaWhyVedaStructure() {
  return (
    <section className="py-20 bg-[#faf6ee] border-b border-[#e8dfd1]" id="why-veda-structure">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
            VEDIC AUTHENTICITY • SYSTEMATIC ARRANGEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mt-2 mb-4">
            A Structured Way to Arrange Your Homa
          </h2>
          <p className="text-sm sm:text-base text-[#685847] leading-relaxed">
            Veda Structure replaces ambiguous ritual arrangements with transparent, Shastric parameters.
            Every fire ritual is organized with discipline, verified Samagri, and dedicated Pandits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-7 border border-[#ebdcc4] shadow-sm hover:shadow-md hover:border-[#b36c1e]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#faf3e3] border border-[#ebdcc4] flex items-center justify-center text-[#b36c1e] mb-5 group-hover:bg-[#b36c1e] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#2a221b] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#685847] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Shastric Trust Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#2a221b] to-[#44362b] text-white rounded-2xl p-8 max-w-4xl mx-auto shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#c77722] font-semibold mb-1">
              VEDA STRUCTURE ETHOS
            </div>
            <h4 className="text-xl font-serif text-[#faf4e6]">
              Preserving Vedic Discipline Without Commercial Compromise
            </h4>
            <p className="text-xs text-[#d1c7bc] mt-1">
              No arbitrary pricing, no unverified claims. Transparent ritual dimensions for genuine seekers.
            </p>
          </div>
          <a
            href="#explore"
            className="px-6 py-3 bg-[#c77722] hover:bg-[#b36c1e] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
