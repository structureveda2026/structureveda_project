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
import vishalImage from "../../../assets/images/e-3.jpg";

const VishalBhardwajDetails = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBookConsultation = () => {
    navigate("/astrologers/vishal-bhardwaj/book-consultation");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Consultation कितने समय की है?",
      answer: "30 minutes."
    },
    {
      question: "Consultation online होगी?",
      answer: "हाँ, online audio/video consultation."
    },
    {
      question: "क्या मुझे अपनी Kundali पहले से बनवानी होगी?",
      answer: "नहीं, यदि आपके पास birth details हैं तो आवश्यक chart analysis consultation के दौरान किया जा सकता है।"
    },
    {
      question: "क्या मैं multiple questions पूछ सकता हूँ?",
      answer: "हाँ, लेकिन consultation का समय सीमित होने के कारण पहले अपने सबसे महत्वपूर्ण questions को प्राथमिकता देना बेहतर है।"
    },
    {
      question: "क्या consultation confidential है?",
      answer: "हाँ, आपकी personal और birth information को confidential रखा जाता है।"
    },
    {
      question: "क्या remedies भी बताई जाएंगी?",
      answer: "यदि आपकी consultation के संदर्भ में आवश्यक हो, तो suitable Vedic remedies बताए जा सकते हैं।"
    },
    {
      question: "क्या consultation के बाद Puja/Rudrabhishek करवाना जरूरी है?",
      answer: "नहीं। किसी भी remedy को आपकी specific situation और आवश्यकता के अनुसार समझाया जाना चाहिए।"
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
                VEDIC ASTROLOGY • KASHI
              </p>

              <h1 className="mt-6 font-serif text-[44px] leading-[1.1] text-[#F7F4ED] sm:text-[54px] lg:text-[58px]">
                Your Kundali Holds the Answers.
                <br />
                <span className="text-[#E8D28A]">Let's Understand Them.</span>
              </h1>

              <p className="mt-6 text-[16px] leading-8 text-[#C9A085]">
                वैदिक ज्योतिष के माध्यम से अपनी कुंडली, समय और जीवन के महत्वपूर्ण
                निर्णयों को बेहतर समझें।
              </p>

              <p className="mt-4 text-[14px] leading-7 text-[#B8A88F]">
                Personalized Vedic Astrology Consultation with Astrologer Vishal
                Bhardwaj
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleBookConsultation}
                  className="group flex items-center gap-2 rounded-xl bg-[#C9A227] px-8 py-4 text-[14px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
                >
                  BOOK 30-MIN CONSULTATION — ₹1,100
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
                  src={vishalImage}
                  alt="Vishal Bhardwaj"
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
              Life Feels Uncertain?
            </h2>
            <p className="mt-4 text-[17px] text-[#75695c]">
              Your Kundali Can Give You Perspective.
            </p>
            <p className="mt-3 text-[14px] leading-7 text-[#8a7c6b]">
              कभी-कभी समस्या यह नहीं होती कि रास्ता नहीं है — समस्या यह होती है कि सही समय और सही दिशा स्पष्ट नहीं होती।
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

      {/* WHY CONSULT SECTION */}
      <section className="bg-gradient-to-br from-[#1E1A16] to-[#121212] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A227]">
              WHY CONSULT
            </p>
            <h2 className="mt-4 font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
              Astrology That Helps You Understand — Not Fear.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Vedic Approach",
                description: "Traditional Vedic astrology principles और जन्म कुंडली के आधार पर analysis."
              },
              {
                number: "02",
                title: "Personalized Analysis",
                description: "हर व्यक्ति की कुंडली अलग होती है। इसलिए guidance भी personalized होगी।"
              },
              {
                number: "03",
                title: "Timing Matters",
                description: "दशा, गोचर और planetary periods के आधार पर महत्वपूर्ण समय को समझना।"
              },
              {
                number: "04",
                title: "Practical Guidance",
                description: "सिर्फ prediction नहीं — जहाँ उचित हो वहाँ practical remedies और actionable guidance."
              }
            ].map((item) => (
              <div
                key={item.number}
                className="group rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-6 transition-all hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-[0_12px_32px_rgba(201,162,39,0.15)]"
              >
                <span className="inline-block rounded-lg bg-[#C9A227] px-3 py-1.5 text-[15px] font-bold text-[#121212]">
                  {item.number}
                </span>
                <h3 className="mt-5 text-[17px] font-semibold text-[#F7F4ED]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[#B8A88F]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION OFFER SECTION */}
      <section className="bg-[#F7F4ED] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1040px]">
          <div className="rounded-[32px] border-3 border-[#C9A227] bg-white p-10 shadow-[0_20px_60px_rgba(201,162,39,0.2)] sm:p-12">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A227]">
                SPECIAL OFFER
              </p>
              <h2 className="mt-4 font-serif text-[38px] text-[#24211D]">
                30-Minute Personal Astrology Consultation
              </h2>

              <div className="mt-8 flex flex-wrap justify-center gap-8 text-[14px]">
                <span className="flex items-center gap-2 text-[#675b50]">
                  <Check size={18} className="text-[#C9A227]" />
                  One-on-One
                </span>
                <span className="flex items-center gap-2 text-[#675b50]">
                  <Check size={18} className="text-[#C9A227]" />
                  30 Minutes
                </span>
                <span className="flex items-center gap-2 text-[#675b50]">
                  <Check size={18} className="text-[#C9A227]" />
                  Audio / Video
                </span>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="font-serif text-[52px] text-[#24211D]">
                  ₹1,100
                </span>
                <span className="text-[28px] text-[#b4aa9d] line-through">
                  ₹1,500
                </span>
              </div>

              <button
                type="button"
                onClick={handleBookConsultation}
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-10 py-4 text-[15px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
              >
                BOOK MY CONSULTATION
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <p className="mt-6 text-[13px] text-[#75695c]">
                Consultation is personalized according to your birth details and specific concerns.
              </p>
            </div>

            <div className="mt-12 border-t border-[#e3ca97] pt-10">
              <p className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-[#75695c]">
                TOPICS COVERED IN YOUR CONSULTATION
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Career & Job",
                  "Business",
                  "Marriage",
                  "Relationship",
                  "Finance",
                  "Family",
                  "Education",
                  "Property",
                  "Foreign Travel",
                  "Kundali-based Life Guidance",
                  "Remedies & Muhurat"
                ].map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-2 text-[13px] text-[#5f554a]"
                  >
                    <Check size={16} className="shrink-0 text-[#C9A227]" />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION PROCESS SECTION */}
      <section className="bg-gradient-to-br from-[#121212] to-[#1E1A16] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <h2 className="font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
              What Happens During Your Consultation?
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Kundali Analysis",
                description: "आपकी birth details के आधार पर chart analysis."
              },
              {
                number: "02",
                title: "Understand the Situation",
                description: "वर्तमान planetary influences और relevant life areas को समझना।"
              },
              {
                number: "03",
                title: "Timing & Possibilities",
                description: "दशा/गोचर आदि के आधार पर important periods पर चर्चा।"
              },
              {
                number: "04",
                title: "Guidance & Remedies",
                description: "जहाँ आवश्यक हो, suitable Vedic remedies और practical guidance."
              }
            ].map((step, index) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-7 transition-all hover:-translate-y-2 hover:border-[#C9A227] hover:shadow-[0_16px_40px_rgba(201,162,39,0.2)]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227] font-serif text-[20px] font-bold text-[#121212]">
                  {step.number}
                </div>
                <h3 className="text-[17px] font-semibold text-[#F7F4ED]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[#B8A88F]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AREAS OF GUIDANCE SECTION */}
      <section className="bg-[#F7F4ED] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C9A227]">
              AREAS OF GUIDANCE
            </p>
            <h2 className="mt-4 font-serif text-[40px] text-[#24211D] sm:text-[48px]">
              What Can We Discuss?
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Briefcase, title: "Career & Job", description: "Professional direction और career decisions" },
              { icon: Heart, title: "Marriage & Relationship", description: "Partnership और relationship guidance" },
              { icon: TrendingUp, title: "Business & Finance", description: "Financial planning और business timing" },
              { icon: GraduationCap, title: "Education", description: "Educational choices और learning paths" },
              { icon: HomeIcon, title: "Family & Property", description: "Family matters और property decisions" },
              { icon: Sparkles, title: "Remedies & Spiritual Guidance", description: "Vedic remedies और spiritual practices" }
            ].map((area) => (
              <div
                key={area.title}
                className="group rounded-2xl border-2 border-[#e3ca97] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-[0_12px_32px_rgba(201,162,39,0.15)]"
              >
                <area.icon className="h-9 w-9 text-[#C9A227] transition-transform group-hover:scale-110" />
                <h3 className="mt-4 text-[16px] font-semibold text-[#24211D]">
                  {area.title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-[#75695c]">
                  {area.description}
                </p>
                <button className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#C9A227] transition-all group-hover:gap-2">
                  Explore Consultation
                  <ArrowRight size={14} />
                </button>
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
              Meet Astrologer Vishal Bhardwaj
            </h2>
            <p className="mt-4 text-[16px] text-[#E8D28A]">
              Vedic Astrologer | Jyotish Consultant | Spiritual Guide
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr]">
            <div className="mx-auto">
              <div className="overflow-hidden rounded-[28px] border-2 border-[#C9A227]/30">
                <img
                  src={vishalImage}
                  alt="Vishal Bhardwaj"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-7">
                <p className="text-[15px] leading-8 text-[#E8D28A]">
                  <strong className="font-semibold text-[#F7F4ED]">
                    Vishal Bhardwaj
                  </strong>{" "}
                  is a dedicated Vedic astrologer from{" "}
                  <strong className="font-semibold text-[#F7F4ED]">
                    Kashi (Varanasi)
                  </strong>
                  , offering personalized Kundali-based consultations with over{" "}
                  <strong className="font-semibold text-[#F7F4ED]">
                    10 years of experience
                  </strong>
                  .
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
                    LOCATION
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <MapPin size={16} className="text-[#C9A227]" />
                    <p className="text-[15px] font-semibold text-[#F7F4ED]">
                      Kashi / Varanasi
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-[#3a3026] bg-[#1E1A16] p-7">
                <p className="text-[15px] leading-8 text-[#B8A88F]">
                  He provides practical guidance on career, marriage,
                  relationships, finance, family, and life decisions. His
                  approach focuses on understanding planetary positions, timing,
                  and remedies rooted in traditional Vedic wisdom.
                </p>
              </div>

              <button
                onClick={handleBookConsultation}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C9A227] bg-transparent px-6 py-4 text-[14px] font-semibold text-[#C9A227] transition-all hover:bg-[#C9A227] hover:text-[#121212]"
              >
                KNOW MORE ABOUT VISHAL BHARDWAJ
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KASHI DIFFERENTIATOR SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2b241d] via-[#1E1A16] to-[#121212] px-5 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A227 1px, transparent 0)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative mx-auto max-w-[1040px] text-center">
          <h2 className="font-serif text-[40px] text-[#F7F4ED] sm:text-[48px]">
            Guidance From The Spiritual Heart of India
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-[#E8D28A]">
            Based in Kashi — a land deeply connected with the living traditions of Sanatan Dharma and Jyotish.
          </p>

          <button
            onClick={handleBookConsultation}
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-10 py-4 text-[15px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
          >
            BOOK A CONSULTATION
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* BEFORE CONSULTATION SECTION */}
      <section className="bg-[#F7F4ED] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[840px]">
          <div className="rounded-[28px] border-2 border-[#C9A227] bg-white p-10">
            <h2 className="text-center font-serif text-[36px] text-[#24211D]">
              Before Your Consultation
            </h2>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="mb-4 text-[15px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                  PREPARE THE FOLLOWING
                </h3>
                <div className="space-y-3">
                  {["Date of Birth", "Exact Time of Birth", "Place of Birth"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[14px] text-[#5f554a]">
                      <Clock size={16} className="shrink-0 text-[#C9A227]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#e3ca97] bg-[#faf6ed] p-5">
                <p className="text-[14px] leading-7 text-[#675b50]">
                  <strong className="font-semibold text-[#24211D]">Note:</strong>{" "}
                  "Note down the 2–3 questions you most want clarity on before your session."
                </p>
              </div>
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
            Your Questions Deserve Clarity.
          </h2>
          <p className="mt-4 text-[18px] text-[#E8D28A]">
            Consult Astrologer Vishal Bhardwaj
          </p>

          <div className="mt-10 rounded-[28px] border-3 border-[#C9A227] bg-[#1E1A16] p-10">
            <p className="text-[16px] font-semibold text-[#F7F4ED]">
              30-Minute Personal Vedic Astrology Consultation
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="font-serif text-[44px] text-[#F7F4ED]">
                ₹1,100
              </span>
              <span className="text-[24px] text-[#8a7c6b] line-through">
                ₹1,500
              </span>
            </div>

            <button
              type="button"
              onClick={handleBookConsultation}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-10 py-4 text-[15px] font-semibold text-[#121212] shadow-[0_12px_32px_rgba(201,162,39,0.3)] transition-all hover:scale-105 hover:bg-[#E8D28A]"
            >
              BOOK MY CONSULTATION
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
                Personalized Vedic Guidance
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VishalBhardwajDetails;
