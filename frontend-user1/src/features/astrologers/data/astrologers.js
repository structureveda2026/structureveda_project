import rahulImage from "../../../assets/images/e-1.jpg";
import meeraImage from "../../../assets/images/e-2.jpg";
import keshavImage from "../../../assets/images/e-3.jpg";
import ananyaImage from "../../../assets/images/e-4.jpg";

// This shape mirrors the data required from a future astrologer API.
export const mockAstrologers = [
  {
    id: "ast-vishal", slug: "vishal-bhardwaj", name: "Vishal Bhardwaj", image: keshavImage,
    title: "Vedic Astrologer | Jyotish Consultant | Spiritual Guide", experience: 10, languages: ["Hindi", "English"],
    expertise: ["Vedic Astrology", "Kundali Analysis", "Life Guidance"], rating: 4.9, reviews: "1,500+", sessions: "3,800+",
    pricePerMinute: 36.67, currency: "₹", online: true, availability: "Available now",
    about: "Vishal Bhardwaj is a dedicated Vedic astrologer from Kashi (Varanasi), offering personalized Kundali-based consultations. With over 10 years of experience, he provides practical guidance on career, marriage, relationships, finance, family, and life decisions. His approach focuses on understanding planetary positions, timing, and remedies rooted in traditional Vedic wisdom.",
    specializations: ["Career & Job", "Business & Finance", "Marriage & Relationship", "Education", "Family & Property", "Remedies & Spiritual Guidance", "Foreign Travel", "Kundali-based Life Guidance"],
    consultationTypes: ["Audio Call", "Video Call"],
    availableSlots: { today: ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"], tomorrow: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"], next: ["10:30 AM", "12:30 PM", "3:30 PM", "5:30 PM", "7:30 PM"] },
    unavailableSlots: ["3:00 PM"],
  },
  {
    id: "ast-anurag", slug: "acharya-anurag-bhardwaj", name: "Acharya Anurag Bhardwaj", image: rahulImage,
    title: "Vedic Astrologer", experience: 0, languages: [], expertise: [], rating: 0, reviews: "0", sessions: "0",
    pricePerMinute: 0, currency: "₹", online: false, availability: "Coming soon",
    about: "Acharya Anurag Bhardwaj is a Vedic astrologer. More details coming soon.",
    specializations: [], consultationTypes: [],
    availableSlots: { today: [], tomorrow: [], next: [] }, unavailableSlots: [],
  },
  {
    id: "ast-001", slug: "acharya-sanjay-sati", name: "Acharya Sanjay Sati", image: rahulImage,
    title: "Vedic Astrology & Life Guidance", experience: 18, languages: ["Hindi", "English", "Sanskrit"],
    expertise: ["Vedic Astrology", "Vastu", "Lal Kitab", "Marriage"], rating: 4.8, reviews: "2,100+", sessions: "5,400+",
    pricePerMinute: 21, currency: "₹", online: true, availability: "Available now",
    about: "With more than 18 years of experience in Vedic astrology, Acharya Sanjay Sati offers grounded, compassionate guidance for relationships, career, family and important life decisions.",
    specializations: ["Vedic Astrology", "Vastu", "Lal Kitab", "Marriage", "Career", "Finance"],
    consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: ["10:00 AM", "10:30 AM", "11:00 AM", "12:30 PM", "2:00 PM", "4:30 PM", "6:00 PM", "8:00 PM"], tomorrow: ["9:30 AM", "11:00 AM", "1:00 PM", "3:30 PM", "5:00 PM", "7:30 PM"], next: ["10:00 AM", "12:00 PM", "2:30 PM", "4:00 PM", "6:30 PM"] },
    unavailableSlots: ["10:30 AM", "2:00 PM"],
  },
  {
    id: "ast-002", slug: "dr-ananya-rao", name: "Dr. Ananya Rao", image: ananyaImage,
    title: "Vastu & Numerology Consultant", experience: 11, languages: ["English", "Kannada", "Hindi"],
    expertise: ["Vastu", "Numerology", "Career"], rating: 4.9, reviews: "1,450+", sessions: "3,200+",
    pricePerMinute: 24, currency: "₹", online: true, availability: "Available now",
    about: "Dr. Ananya Rao blends practical Vastu principles with numerology to help seekers bring clarity to homes, workspaces and significant career choices.",
    specializations: ["Vastu", "Numerology", "Career", "Finance", "Home Energy"], consultationTypes: ["Audio Call", "Chat", "Video Call"],
    availableSlots: { today: ["11:00 AM", "12:30 PM", "3:00 PM", "5:30 PM", "7:00 PM"], tomorrow: ["10:00 AM", "12:00 PM", "2:00 PM", "4:30 PM", "6:00 PM"], next: ["9:30 AM", "1:30 PM", "3:30 PM", "6:30 PM"] }, unavailableSlots: ["3:00 PM"],
  },
  {
    id: "ast-003", slug: "pandit-keshav-joshi", name: "Pandit Keshav Joshi", image: keshavImage,
    title: "Kundli, Muhurat & Marriage Expert", experience: 28, languages: ["Hindi", "Sanskrit", "Marathi"],
    expertise: ["Vedic Astrology", "Marriage", "Muhurat"], rating: 4.9, reviews: "2,310+", sessions: "6,800+",
    pricePerMinute: 27, currency: "₹", online: false, availability: "Available tomorrow",
    about: "Pandit Keshav Joshi is a traditional practitioner with decades of experience in kundli analysis, auspicious timings and marriage compatibility.",
    specializations: ["Kundli", "Marriage", "Muhurat", "Vedic Astrology", "Family"], consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: [], tomorrow: ["10:30 AM", "12:00 PM", "2:30 PM", "5:00 PM", "7:00 PM"], next: ["9:00 AM", "11:30 AM", "3:00 PM", "6:00 PM"] }, unavailableSlots: ["12:00 PM"],
  },
  {
    id: "ast-004", slug: "smt-meera-iyer", name: "Smt. Meera Iyer", image: meeraImage,
    title: "Tarot & Spiritual Counsellor", experience: 13, languages: ["English", "Tamil", "Hindi"],
    expertise: ["Tarot", "Relationships", "Career"], rating: 4.8, reviews: "980+", sessions: "2,700+",
    pricePerMinute: 19, currency: "₹", online: true, availability: "Available now",
    about: "Smt. Meera Iyer provides warm, intuitive readings that help people reflect on relationships, transitions and their next meaningful step.",
    specializations: ["Tarot", "Relationships", "Career", "Spiritual Counselling"], consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: ["10:00 AM", "1:00 PM", "2:30 PM", "4:00 PM", "6:30 PM", "8:00 PM"], tomorrow: ["11:00 AM", "1:30 PM", "3:00 PM", "5:30 PM"], next: ["10:30 AM", "12:30 PM", "4:30 PM"] }, unavailableSlots: ["4:00 PM"],
  },
  {
    id: "ast-005", slug: "acharya-rahul-sharma", name: "Acharya Rahul Sharma", image: rahulImage,
    title: "Kundli & Career Astrology", experience: 15, languages: ["Hindi", "English", "Sanskrit"],
    expertise: ["Vedic Astrology", "Career", "Finance"], rating: 4.9, reviews: "1,820+", sessions: "4,100+",
    pricePerMinute: 22, currency: "₹", online: false, availability: "Available at 4:30 PM",
    about: "Acharya Rahul Sharma uses classical Vedic methods to offer practical direction on career, business decisions, education and financial planning.",
    specializations: ["Kundli", "Vedic Astrology", "Career", "Finance", "Education"], consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: ["4:30 PM", "6:00 PM", "7:30 PM"], tomorrow: ["10:00 AM", "11:30 AM", "2:00 PM", "5:00 PM"], next: ["9:30 AM", "1:00 PM", "3:30 PM"] }, unavailableSlots: [],
  },
  {
    id: "ast-006", slug: "priya-kulkarni", name: "Priya Kulkarni", image: ananyaImage,
    title: "Numerology & Relationship Guide", experience: 9, languages: ["Marathi", "Hindi", "English"],
    expertise: ["Numerology", "Relationships", "Marriage"], rating: 4.7, reviews: "760+", sessions: "1,900+",
    pricePerMinute: 18, currency: "₹", online: true, availability: "Available now",
    about: "Priya Kulkarni makes numerology approachable, helping seekers understand relationship patterns, personal cycles and everyday choices.",
    specializations: ["Numerology", "Relationships", "Marriage", "Life Path"], consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: ["9:30 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"], tomorrow: ["10:30 AM", "12:30 PM", "4:00 PM", "6:30 PM"], next: ["11:00 AM", "1:00 PM", "5:30 PM"] }, unavailableSlots: ["2:00 PM"],
  },
  {
    id: "ast-007", slug: "arjun-nair", name: "Arjun Nair", image: keshavImage,
    title: "Prashna Kundli & Finance Expert", experience: 16, languages: ["Malayalam", "English", "Hindi"],
    expertise: ["Vedic Astrology", "Finance", "Career"], rating: 4.8, reviews: "1,180+", sessions: "3,500+",
    pricePerMinute: 23, currency: "₹", online: true, availability: "Available now",
    about: "Arjun Nair specialises in precise, question-led Vedic readings and offers considered guidance for business, wealth and career matters.",
    specializations: ["Prashna Kundli", "Finance", "Career", "Vedic Astrology"], consultationTypes: ["Audio Call", "Chat", "Video Call"],
    availableSlots: { today: ["10:00 AM", "12:00 PM", "2:30 PM", "5:30 PM", "7:30 PM"], tomorrow: ["9:30 AM", "11:00 AM", "3:00 PM", "6:00 PM"], next: ["10:30 AM", "1:30 PM", "4:00 PM"] }, unavailableSlots: ["7:30 PM"],
  },
  {
    id: "ast-008", slug: "kavita-desai", name: "Kavita Desai", image: meeraImage,
    title: "Tarot, Healing & Life Guidance", experience: 10, languages: ["Hindi", "English", "Gujarati"],
    expertise: ["Tarot", "Relationships", "Career"], rating: 4.7, reviews: "870+", sessions: "2,100+",
    pricePerMinute: 20, currency: "₹", online: false, availability: "Available tomorrow",
    about: "Kavita Desai offers calm and confidential tarot consultations for those seeking perspective on emotional wellbeing, relationships and life transitions.",
    specializations: ["Tarot", "Relationships", "Career", "Wellbeing"], consultationTypes: ["Audio Call", "Chat"],
    availableSlots: { today: [], tomorrow: ["10:00 AM", "12:30 PM", "3:30 PM", "5:00 PM", "7:00 PM"], next: ["9:30 AM", "11:30 AM", "2:00 PM", "4:30 PM"] }, unavailableSlots: ["5:00 PM"],
  },
];

export const getAstrologerBySlug = (slug) => mockAstrologers.find((astrologer) => astrologer.slug === slug);
