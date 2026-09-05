import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
  Users,
  Package,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { HOMA_SERVICES } from '../data/homaCatalogueData';
import HomaServiceCard from '../components/HomaServiceCard';

export default function HomaServiceDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find Homa by slug, or fallback to first
  const service =
    HOMA_SERVICES.find((h) => h.slug === slug) || HOMA_SERVICES[0];

  const galleryImages =
    Array.isArray(service.gallery) && service.gallery.length > 0
      ? service.gallery
      : [service.image];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Configuration demonstrator state
  const [selectedHavanCount, setSelectedHavanCount] = useState(
    service.availableHavanCounts[0] || 1
  );
  const [selectedDays, setSelectedDays] = useState(
    service.availableDays[0] || 1
  );
  const [selectedLocation, setSelectedLocation] = useState(
    service.kashiAvailable ? 'Kashi' : 'Remote'
  );
  const [sankalpaScope, setSankalpaScope] = useState('Family');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentSlide(0);
    if (service) {
      setSelectedHavanCount(service.availableHavanCounts[0] || 1);
      setSelectedDays(service.availableDays[0] || 1);
      setSelectedLocation(service.kashiAvailable ? 'Kashi' : 'Remote');
      document.title = `${service.name} | Vedic Homa & Havan | Veda Structure`;
    }
  }, [slug, service]);

  const relatedHomas = HOMA_SERVICES.filter(
    (h) => h.slug !== service.slug
  ).slice(0, 3);

  // Approximate illustrative preview calculations
  const havanMultiplier =
    typeof selectedHavanCount === 'number' ? selectedHavanCount : 3;
  const estimatedPandits = Math.min(
    service.maximumPandits,
    Math.max(
      service.minimumPandits,
      Math.ceil(havanMultiplier * 0.8) + (selectedDays > 1 ? 1 : 0)
    )
  );

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-3.5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12.5px] text-[#78644e]">
          <Link to="/" className="hover:text-[#a8641b]">
            Home
          </Link>
          <span>/</span>
          <Link to="/yagya-puja" className="hover:text-[#a8641b]">
            Yagya & Puja
          </Link>
          <span>/</span>
          <Link to="/yagya-puja/homa" className="hover:text-[#a8641b]">
            Homa & Havan
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2b241d]">{service.name}</span>
        </div>
      </div>

      {/* Main Detail Header Section */}
      <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Gallery Column */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-[26px] border border-[#d6b78d] bg-[#22170f] shadow-[0_12px_36px_rgba(60,40,20,0.12)]">
                <div className="relative h-[360px] w-full sm:h-[420px]">
                  <img
                    src={galleryImages[currentSlide]}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Slider controls if multiple images */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentSlide((prev) =>
                            prev === 0 ? galleryImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentSlide((prev) =>
                            prev === galleryImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-[#faf4e6] backdrop-blur-xs">
                      {currentSlide + 1} / {galleryImages.length}
                    </div>
                  )}

                  {/* Category Pill on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#1f1711]/85 border border-[#ebdcc4]/40 text-[11px] uppercase tracking-wider text-[#e89b4f] font-semibold backdrop-blur-xs">
                      {service.homaType}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto bg-[#1c130d] p-3">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          currentSlide === idx
                            ? 'border-[#c77722] opacity-100'
                            : 'border-transparent opacity-60 hover:opacity-80'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Badges */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#faf6ee] p-3 rounded-xl border border-[#ebdcc4] text-center">
                  <span className="text-[10px] uppercase text-[#7d6854] block">
                    Starting Dakshina
                  </span>
                  <span className="text-sm font-bold font-serif text-[#2a221b]">
                    ₹{service.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-[#faf6ee] p-3 rounded-xl border border-[#ebdcc4] text-center">
                  <span className="text-[10px] uppercase text-[#7d6854] block">
                    Supported Havans
                  </span>
                  <span className="text-sm font-bold font-serif text-[#2a221b]">
                    {service.availableHavanCounts.join(', ')}
                  </span>
                </div>
                <div className="bg-[#faf6ee] p-3 rounded-xl border border-[#ebdcc4] text-center">
                  <span className="text-[10px] uppercase text-[#7d6854] block">
                    Pandit Scale
                  </span>
                  <span className="text-sm font-bold font-serif text-[#2a221b]">
                    {service.minimumPandits}–{service.maximumPandits} Acharyas
                  </span>
                </div>
                <div className="bg-[#faf6ee] p-3 rounded-xl border border-[#ebdcc4] text-center">
                  <span className="text-[10px] uppercase text-[#7d6854] block">
                    Daily Hours
                  </span>
                  <span className="text-sm font-bold font-serif text-[#2a221b]">
                    {service.dailyHours} hrs / day
                  </span>
                </div>
              </div>
            </div>

            {/* Overview & Quick Info Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf3e3] border border-[#ebdcc4] text-xs font-semibold uppercase tracking-wider text-[#b36c1e] mb-3">
                  <Flame className="w-3.5 h-3.5" />
                  <span>VEDIC FIRE CEREMONY SPECIFICATION</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mb-3">
                  {service.name}
                </h1>

                <p className="text-sm text-[#7d6854] font-serif italic mb-4">
                  "{service.purpose}"
                </p>

                <p className="text-sm text-[#524437] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Location Availability Alert */}
                <div className="bg-[#faf6ee] rounded-xl p-4 border border-[#ebdcc4] mb-6">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#44362b] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#b36c1e]" />
                    <span>Location & Venue Eligibility</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          service.kashiAvailable
                            ? 'text-[#2b7a35]'
                            : 'text-gray-300'
                        }`}
                      />
                      <span>
                        Kashi Kshetra: {service.kashiAvailable ? 'Available' : 'Not Supported'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          service.remoteAvailable
                            ? 'text-[#2b7a35]'
                            : 'text-gray-300'
                        }`}
                      />
                      <span>
                        Remote Live Stream: {service.remoteAvailable ? 'Available' : 'Not Supported'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Required Vedic Skills */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#44362b] mb-2">
                    Prescribed Pandit Qualifications:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#f4ebe1] text-[#6b553e] px-2.5 py-1 rounded-md border border-[#ebdcc4]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Jump to demonstrator CTA */}
              <div className="pt-6 border-t border-[#ebdcc4]">
                <a
                  href="#configuration-demonstrator"
                  className="w-full py-3.5 bg-[#b36c1e] hover:bg-[#8a4e0c] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Configure Ritual Parameters</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service-Specific Configuration Demonstrator Area */}
      <section
        className="py-16 bg-[#faf6ee] border-b border-[#e8dfd1]"
        id="configuration-demonstrator"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
              ILLUSTRATIVE SERVICE CONFIGURATOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2a221b] mt-1 mb-2">
              Configure {service.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#685847]">
              Select from this service's specific authorized Havan counts, day durations, and venue availability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Options Form (Illustrative) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#ebdcc4] shadow-xs space-y-6">
              {/* Architecture Preview Banner */}
              <div className="bg-[#fff9ed] border border-[#ebdcc4] p-3.5 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-[#b36c1e] shrink-0 mt-0.5" />
                <div className="text-xs text-[#7d6854]">
                  <strong className="text-[#3b2d22]">Architecture Preview:</strong> Parameters below react directly to{' '}
                  <span className="font-semibold">{service.name}</span>'s catalogue data. Live pricing engine and schedule confirmation will activate upon full platform release.
                </div>
              </div>

              {/* 1. Select Havan Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#44362b] mb-2">
                  1. Supported Number of Havan:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {service.availableHavanCounts.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSelectedHavanCount(cnt)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedHavanCount === cnt
                          ? 'bg-[#b36c1e] text-white border-[#b36c1e] shadow-xs'
                          : 'bg-[#fbf9f4] border-[#ebdcc4] text-[#685847] hover:bg-white'
                      }`}
                    >
                      {cnt === 'Custom' ? 'Custom' : `${cnt} Havan`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#8c7863] mt-1.5">
                  Every Homa does not support every count. Only scripturally viable options are shown.
                </p>
              </div>

              {/* 2. Select Days */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#44362b] mb-2">
                  2. Ritual Duration (Days):
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {service.availableDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDays(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedDays === day
                          ? 'bg-[#b36c1e] text-white border-[#b36c1e] shadow-xs'
                          : 'bg-[#fbf9f4] border-[#ebdcc4] text-[#685847] hover:bg-white'
                      }`}
                    >
                      {day} {day === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#44362b] mb-2">
                  3. Ritual Location:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!service.kashiAvailable}
                    onClick={() => setSelectedLocation('Kashi')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      !service.kashiAvailable
                        ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed'
                        : selectedLocation === 'Kashi'
                        ? 'bg-[#faf3e3] border-[#b36c1e] text-[#2a221b] ring-1 ring-[#b36c1e]'
                        : 'bg-[#fbf9f4] border-[#ebdcc4] text-[#685847]'
                    }`}
                  >
                    <span className="font-semibold block text-sm">Kashi (Varanasi)</span>
                    <span className="text-[11px] text-[#8c7863]">
                      {service.kashiAvailable ? 'Conducted at sacred kshetra' : 'Not available for this Homa'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={!service.remoteAvailable}
                    onClick={() => setSelectedLocation('Remote')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      !service.remoteAvailable
                        ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed'
                        : selectedLocation === 'Remote'
                        ? 'bg-[#faf3e3] border-[#b36c1e] text-[#2a221b] ring-1 ring-[#b36c1e]'
                        : 'bg-[#fbf9f4] border-[#ebdcc4] text-[#685847]'
                    }`}
                  >
                    <span className="font-semibold block text-sm">Remote Live Stream</span>
                    <span className="text-[11px] text-[#8c7863]">
                      {service.remoteAvailable ? 'HD Live Sankalpa transmission' : 'Not available for this Homa'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 4. Sankalpa Scope */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#44362b] mb-2">
                  4. Sankalpa Dedication Scope:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Individual', 'Couple', 'Family'].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setSankalpaScope(sc)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        sankalpaScope === sc
                          ? 'bg-[#2a221b] text-white border-[#2a221b]'
                          : 'bg-[#fbf9f4] border-[#ebdcc4] text-[#685847]'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-[#2a221b] text-white rounded-2xl p-6 sm:p-8 border border-[#44362b] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#44362b] mb-5">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#c77722]">
                    CONFIGURATION SUMMARY
                  </span>
                  <span className="text-[10px] uppercase font-mono bg-[#3d3126] text-[#e89b4f] px-2 py-0.5 rounded border border-[#524437]">
                    PREVIEW
                  </span>
                </div>

                <h3 className="font-serif text-xl text-[#faf4e6] mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-[#d1c7bc] mb-5">
                  {service.shortDescription}
                </p>

                <div className="space-y-3 text-xs bg-[#1f1711] p-4 rounded-xl border border-[#3d3126] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Havan Count:</span>
                    <span className="font-semibold text-[#faf4e6]">
                      {selectedHavanCount} Havan
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Duration:</span>
                    <span className="font-semibold text-[#faf4e6]">
                      {selectedDays} {selectedDays === 1 ? 'Day' : 'Days'} ({service.dailyHours}h / day)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Location:</span>
                    <span className="font-semibold text-[#faf4e6]">
                      {selectedLocation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Dedication:</span>
                    <span className="font-semibold text-[#faf4e6]">
                      {sankalpaScope} Sankalpa
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Required Pandits:</span>
                    <span className="font-semibold text-[#faf4e6]">
                      {estimatedPandits} Acharyas (Estimated)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#a39382]">Samagri Status:</span>
                    <span className="font-semibold text-[#66bb6a]">
                      Verified Shastric Included
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#3d3126] text-sm">
                    <span className="text-[#a39382]">Starting Dakshina:</span>
                    <span className="font-bold text-[#e89b4f] font-serif">
                      ₹{service.startingPrice.toLocaleString('en-IN')}*
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#9c8b7c] leading-relaxed">
                  * Starting dakshina provides an initial baseline. Custom samagri additions, location dakshina, and exact dates will be confirmed during the upcoming booking release.
                </p>
              </div>

              <div className="pt-6 border-t border-[#44362b] mt-6">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Configuration Demonstrator: Your selection for ${service.name} (${selectedHavanCount} Havan, ${selectedDays} Day(s), ${selectedLocation}) has been recorded. Payment and live booking engines are scheduled for future platform phases.`
                    )
                  }
                  className="w-full py-3 bg-[#c77722] hover:bg-[#b36c1e] text-white text-xs uppercase tracking-wider font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Booking Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Samagri & Sankalpa Specification Details */}
      <section className="py-16 bg-[#fffdf9] border-b border-[#e8dfd1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Samagri Itemization */}
            <div className="bg-[#faf6ee] p-7 rounded-2xl border border-[#ebdcc4]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#b36c1e] mb-2">
                <Package className="w-4 h-4" />
                <span>Sacred Samagri Specifications</span>
              </div>
              <h3 className="font-serif text-xl text-[#2a221b] mb-4">
                Materials Provided for {service.name}
              </h3>
              <p className="text-xs text-[#685847] mb-5">
                Every fire offering is sourced per classical recommendations to ensure pure smoke and sattvic atmosphere:
              </p>

              <div className="space-y-3">
                {service.samagri && service.samagri.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#ebdcc4] text-xs"
                  >
                    <span className="font-semibold text-[#2a221b]">{item.item || item.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        item.status === 'Included'
                          ? 'bg-[#eaf5ea] text-[#2b7a35] border border-[#c1e2c6]'
                          : 'bg-[#faf3e3] text-[#b36c1e] border border-[#ebdcc4]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Sankalpa Fields */}
            <div className="bg-[#faf6ee] p-7 rounded-2xl border border-[#ebdcc4]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#b36c1e] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Sankalpa Parameters</span>
              </div>
              <h3 className="font-serif text-xl text-[#2a221b] mb-4">
                Information Required for Agni Sankalpa
              </h3>
              <p className="text-xs text-[#685847] mb-5">
                The coordinating Acharya invokes the supreme deities referencing the following sacred coordinates:
              </p>

              <div className="space-y-3">
                {(Array.isArray(service.sankalpaFields)
                  ? service.sankalpaFields
                  : typeof service.sankalpaFields === 'object' && service.sankalpaFields !== null
                  ? Object.entries(service.sankalpaFields)
                      .filter(([_, val]) => Boolean(val))
                      .map(([key]) => {
                        if (key === 'name') return 'Yajamana / Devotee Full Name';
                        if (key === 'gotra') return 'Family Vedic Gotra';
                        if (key === 'nakshatra') return 'Janma Nakshatra (Birth Star)';
                        if (key === 'rashi') return 'Janma Rashi (Moon Sign)';
                        if (key === 'familyMembers') return 'Co-Yajamana & Family Names';
                        if (key === 'specialSankalpa') return 'Specific Sankalpa Intent / Prayer';
                        return key.charAt(0).toUpperCase() + key.slice(1);
                      })
                  : ['Yajamana Name', 'Family Gotra', 'Janma Nakshatra', 'Special Prayer Intent']
                ).map((field, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#ebdcc4] text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#b36c1e] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#2a221b] block">{field}</span>
                      <span className="text-[11px] text-[#7d6854]">
                        Essential coordinate for authentic Vedic dedication during fire kindling.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related / Other Homa Services */}
      <section className="py-16 bg-[#faf6ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
                COMPREHENSIVE AGNI RITUALS
              </span>
              <h3 className="text-2xl font-serif text-[#2a221b] mt-1">
                Other Traditional Homa Services
              </h3>
            </div>
            <Link
              to="/yagya-puja/homa"
              className="text-xs font-semibold text-[#b36c1e] hover:underline flex items-center gap-1"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedHomas.map((h) => (
              <HomaServiceCard
                key={h.id}
                homa={h}
                onConfigure={(selected) => navigate(`/yagya-puja/homa/${selected.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
