import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  MessageCircle,
  Sparkles,
  Heart,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Home as HomeIcon,
  ChevronDown,
  MapPin,
  Clock,
  Shield
} from "lucide-react";
import acharyaImage from "../../../assets/images/e-1.jpg";

const AcharyaAnuragBhardwajDetails = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBookConsultation = () => {
    navigate("/book-consultation");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Consultation कितने समय की है?",
      answer: "Consultation duration details coming soon."
    },
    {
      question: "Consultation online होगी?",
      answer: "हाँ, online audio/video consultation available."
    },
    {
      question: "क्या consultation confidential है?",
      answer: "हाँ, आपकी personal और birth information को confidential रखा जाता है।"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E1A16] via-[#121212] to-[#1E1A16] px-5 py-20 sm:px-8 lg:px-12">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A227 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A227]">
                VEDIC ASTROLOGY
              </p>

              <h1 className="mt-6 font-serif text-[44px] leading-[1.1] text-[#F7F4ED] sm:text-[54px] lg:text-[58px]">
                Acharya Anurag Bhardwaj
                <br />
                <span className="text-[#E8D28A]">Vedic Astrologer</span>
              </h1>

              <p className="mt-6 text-[16px] leading-8 text-[#C9A085]">
                Traditional Vedic astrology guidance rooted in ancient wisdom.
              </p>

              <p className="mt-4 text-[14px] leading-7 text-[#B8A88F]">
                More details coming soon.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleBookConsultation}
                  className="group flex items-center gap-2 rounded-xl bg-[#C9A227] px-8 py-4 text-[14px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
                >
                  BOOK CONSULTATION
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border-2 border-[#3a3026] bg-transparent px-7 py-4 text-[14px] font-semibold text-[#F7F4ED] transition-all hover:border-[#C9A227] hover:bg-[#1E1A16]"
                >
                  <MessageCircle size={18} />
                  WhatsApp Consultation
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <div className="relative overflow-hidden rounded-[32px] border-2 border-[#C9A227]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/10 to-transparent" />
                <img
                  src={acharyaImage}
                  alt="Acharya Anurag Bhardwaj"
                  className="relative h-full w-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-2 border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/10 to-transparent blur-xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full border-2 border-[#C9A227]/20 bg-gradient-to-tr from-[#C9A227]/10 to-transparent blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-[#F7F4ED] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <h2 className="font-serif text-[40px] text-[#24211D] sm:text-[48px]">
              Seek Clarity Through Vedic Wisdom
            </h2>
            <p className="mt-4 text-[17px] text-[#75695c]">
              Traditional guidance for life's important decisions.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Marriage & Relationships" },
              { icon: Briefcase, title: "Career & Business" },
              { icon: TrendingUp, title: "Finance & Wealth" },
              { icon: HomeIcon, title: "Family & Life Decisions" }
            ].map((area, index) => (
              <div
                key={area.title}
                className="group rounded-2xl border-2 border-[#e3ca97] bg-white p-7 text-center transition-all hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-[0_12px_32px_rgba(201,162,39,0.15)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <area.icon className="mx-auto h-10 w-10 text-[#C9A227] transition-transform group-hover:scale-110" />
                <p className="mt-4 text-[15px] font-semibold text-[#24211D]">
                  {area.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASTROLOGER PROFILE SECTION */}
      <section id="profile" className="bg-gradient-to-br from-[#1E1A16] to-[#121212] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1040px]">
          <div className="text-center">
            <h2 className="font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
              About Acharya Anurag Bhardwaj
            </h2>
            <p className="mt-4 text-[16px] text-[#E8D28A]">
              Vedic Astrologer
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr]">
            <div className="mx-auto">
              <div className="overflow-hidden rounded-[28px] border-2 border-[#C9A227]/30">
                <img
                  src={acharyaImage}
                  alt="Acharya Anurag Bhardwaj"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-7">
                <p className="text-[15px] leading-8 text-[#E8D28A]">
                  <strong className="font-semibold text-[#F7F4ED]">
                    Acharya Anurag Bhardwaj
                  </strong>{" "}
                  is a Vedic astrologer offering guidance rooted in traditional wisdom.
                </p>
                <p className="mt-4 text-[14px] leading-7 text-[#B8A88F]">
                  More details about experience, specializations, and consultation approach coming soon.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border-2 border-[#3a3026] bg-[#1E1A16] p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                    SPECIALIZATION
                  </p>
                  <p className="mt-3 text-[15px] font-semibold text-[#F7F4ED]">
                    Vedic Astrology
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#3a3026] bg-[#1E1A16] p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                    STATUS
                  </p>
                  <p className="mt-3 text-[15px] font-semibold text-[#F7F4ED]">
                    Coming Soon
                  </p>
                </div>
              </div>

              <button
                onClick={handleBookConsultation}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C9A227] bg-transparent px-6 py-4 text-[14px] font-semibold text-[#C9A227] transition-all hover:bg-[#C9A227] hover:text-[#121212]"
              >
                BOOK CONSULTATION
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="bg-gradient-to-br from-[#121212] to-[#1E1A16] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[840px]">
          <div className="text-center">
            <h2 className="font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] transition-all hover:border-[#C9A227]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#24211D]"
                >
                  <span className="pr-4 text-[15px] font-semibold text-[#F7F4ED]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#C9A227] transition-transform duration-200 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="border-t border-[#3a3026] p-6">
                    <p className="text-[14px] leading-7 text-[#B8A88F]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-gradient-to-br from-[#2b241d] via-[#1E1A16] to-[#121212] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[840px] text-center">
          <h2 className="font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
            Seek Guidance
          </h2>
          <p className="mt-4 text-[18px] text-[#E8D28A]">
            Consult Acharya Anurag Bhardwaj
          </p>

          <div className="mt-10 rounded-[28px] border-3 border-[#C9A227] bg-[#1E1A16] p-10">
            <p className="text-[16px] font-semibold text-[#F7F4ED]">
              Vedic Astrology Consultation
            </p>

            <button
              type="button"
              onClick={handleBookConsultation}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-10 py-4 text-[15px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
            >
              BOOK CONSULTATION
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <div className="mt-8 flex flex-wrap justify-center gap-8 text-[13px] text-[#B8A88F]">
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-[#C9A227]" />
                Secure Booking
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#C9A227]" />
                Confidential Consultation
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#C9A227]" />
                Traditional Vedic Guidance
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcharyaAnuragBhardwajDetails;
