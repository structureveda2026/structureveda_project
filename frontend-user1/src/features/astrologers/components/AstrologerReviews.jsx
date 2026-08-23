import { Star, Quote } from "lucide-react";

export const defaultReviews = [
  {
    name: "Rohit Sharma",
    city: "Bangalore, India",
    session: "Career & Financial Dasha Timing",
    quote:
      "Vishal Ji accurately identified the exact timeline when my job transition would manifest. His guidance on navigating my Saturn transit gave me immense peace of mind and direction.",
    rating: 5,
    initials: "RS",
  },
  {
    name: "Ananya Mukherjee",
    city: "Delhi NCR, India",
    session: "Kundali Milan & Marriage Timing",
    quote:
      "Very practical and grounded consultation. No fear-mongering about Manglik dosha — he explained the remedies in simple terms. The clarity we received was truly remarkable.",
    rating: 5,
    initials: "AM",
  },
  {
    name: "Vikramaditya Patel",
    city: "London / Mumbai",
    session: "Business Venture & Foreign Muhurat",
    quote:
      "Astrologer Vishal's analysis of my D-10 chart and planetary Mahadasha was spot-on. His suggested auspicious timings for launching our new venture worked out exceptionally well.",
    rating: 5,
    initials: "VP",
  },
];

const AstrologerReviews = ({
  eyebrow = "Voices of Seekers",
  heading = "Client Experiences & Guidance Stories",
  description = "Authentic reflections from individuals who sought astrological clarity on career, relationships, timing, and life decisions.",
  reviews = defaultReviews,
  averageRating = "4.9 / 5.0 Average Rating",
  seekersGuidedText = "Over 1,500+ Seekers Guided Across India & Worldwide",
}) => {
  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="pointer-events-none absolute right-1/3 top-10 h-[450px] w-[450px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              {eyebrow}
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
            {heading}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {description}
            </p>
          )}
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between rounded-[26px] border-2 border-[#ead8b8] bg-white p-7 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_20px_45px_rgba(212,135,43,0.14)]"
            >
              <div>
                {/* Rating Stars & Topic Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#eab12c]">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} size={16} fill="#eab12c" />
                    ))}
                  </div>

                  <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                    Verified Seeker
                  </span>
                </div>

                {/* Consultation Topic */}
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#c77722]">
                  {review.session}
                </p>

                {/* Quote Body */}
                <div className="relative mt-3">
                  <Quote size={24} className="mb-2 text-[#d4872b]/25" />
                  <p className="text-[14px] leading-relaxed text-[#554739]">
                    "{review.quote}"
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-[#f0e2cd] pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eab12c] font-serif text-[14px] font-bold text-[#2b241d] shadow-[0_3px_10px_rgba(234,177,44,0.25)]">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
                    {review.name}
                  </h4>
                  <p className="text-[12px] text-[#8c7e6c]">{review.city}</p>
                </div>
              </div>

              {/* Bottom Gold Accent */}
              <span className="absolute bottom-0 left-6 h-[2.5px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
            </div>
          ))}
        </div>

        {/* Rating Summary Banner */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/70 px-6 py-4 text-center">
          <div className="flex items-center gap-2">
            <Star size={18} fill="#c77722" className="text-[#c77722]" />
            <span className="font-serif text-[17px] font-bold text-[#2b241d]">
              {averageRating}
            </span>
          </div>
          <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
          <span className="text-[13px] font-medium text-[#5a4d40]">
            {seekersGuidedText}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AstrologerReviews;
