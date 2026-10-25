/**
 * VEDA STRUCTURE COMMUNITY - MOCK DATA & LOCAL STATE STORE
 * Demonstration mock dataset for Pandits, Astrologers, and Vedic Professionals.
 * All data operations in this phase are client-side only (localStorage backed).
 */

export const PROFESSIONAL_TYPES = [
  { id: "all", label: "All Experts" },
  { id: "Pandit", label: "Pandits & Acharyas" },
  { id: "Astrologer", label: "Vedic Astrologers" },
  { id: "Both", label: "Pandit & Astrologer" },
];

export const EXPERTISE_CATEGORIES = [
  "All",
  "Vedic Karmakand",
  "Kundli Analysis",
  "Maha Rudrabhishek",
  "Vastu Shastra",
  "KP Astrology",
  "Navagraha Shanti",
  "Prashna Shastra",
  "Medical Astrology",
  "Nadi Jyotish",
  "Homa & Yagya",
  "Gemstone Guidance",
  "Vivah Sanskar",
];

export const REGIONS_LIST = [
  "All",
  "Varanasi",
  "Haridwar",
  "Ujjain",
  "Ayodhya",
  "Rishikesh",
  "Delhi NCR",
  "Bengaluru",
  "Ahmedabad",
  "Prayagraj",
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured & Verified" },
  { id: "exp-desc", label: "Experience: High to Low" },
  { id: "exp-asc", label: "Experience: Low to High" },
  { id: "name-asc", label: "Name: A to Z" },
];

export const INITIAL_COMMUNITY_PROFILES = [
  {
    id: "pandit-rameshwar-shastri",
    slug: "pandit-rameshwar-shastri",
    fullName: "Pt. Rameshwar Shastri",
    displayName: "Acharya Rameshwar Shastri",
    headline: "Vedic Karmakand Specialist & Shukla Yajurveda Parayan Acharya from Kashi",
    professionalType: "Pandit",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    coverImage: "/create-profile-hero-bg.jpg",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    location: "Varanasi (Kashi), Uttar Pradesh",
    yearsOfExperience: 24,
    languages: ["Sanskrit", "Hindi", "Bhojpuri"],
    isVerified: true,
    isFeatured: true,
    bio: "Pt. Rameshwar Shastri belongs to a distinguished five-generation family of Vedic scholars residing by Assi Ghat, Varanasi. Formally trained at Sampurnanand Sanskrit University, he specializes in authentic Shrauta rituals, Maha Rudrabhishek, and Mahamrityunjaya Anushthan following strict Vedic injunctions.",
    expertise: [
      "Vedic Karmakand",
      "Maha Rudrabhishek",
      "Navagraha Shanti",
      "Homa & Yagya",
      "Vivah Sanskar",
    ],
    specializations: [
      "Rigveda & Shukla Yajurveda Samhita",
      "Prana Pratishtha of Deities",
      "Graha Dosha Nivarana",
    ],
    education: "Acharya in Shukla Yajurveda, Sampurnanand Sanskrit Vishwavidyalaya, Varanasi",
    lineage: "5th Generation Kashi Vedic Parampara",
    services: [
      {
        name: "Maha Rudrabhishek with 11 Vedic Pandits",
        type: "Vedic Fire & Abhishekam",
        mode: "In-Person & Online Live",
        duration: "3.5 Hours",
        description: "Complete Rudri Path and Panchamrit Abhishekam for health, protection, and liberation.",
      },
      {
        name: "Navagraha Shanti & Homa",
        type: "Planetary Remedial Puja",
        mode: "In-Person & Online Live",
        duration: "2.5 Hours",
        description: "Vedic samidha offerings and planetary mantra japa for peace and prosperity.",
      },
      {
        name: "Griha Pravesh & Vastu Shanti Vidhi",
        type: "Auspicious Home Blessing",
        mode: "In-Person",
        duration: "4 Hours",
        description: "Traditional purification rituals and Vastu Purusha homa for auspicious dwelling.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Varanasi", "Prayagraj", "Ayodhya", "Worldwide via Live Stream"],
    credentials: [
      {
        title: "Acharya (M.A. Sanskrit - Shukla Yajurveda)",
        institution: "Sampurnanand Sanskrit Vishwavidyalaya",
        year: "2000",
      },
      {
        title: "Veda Ratna Puraskar",
        institution: "Kashi Vidvat Parishad",
        year: "2015",
      },
    ],
    socialLinks: {
      website: "https://acharya-rameshwar.org",
      youtube: "https://youtube.com/@vedic_karmakand_kashi",
      instagram: "https://instagram.com/acharya_rameshwar",
      linkedin: "https://linkedin.com/in/rameshwar-shastri-vedic",
    },
    stats: {
      ritualsConducted: "2,400+",
      consultations: "5,800+",
      rating: 4.96,
      reviewsCount: 342,
    },
  },
  {
    id: "dr-sunita-joshi",
    slug: "dr-sunita-joshi",
    fullName: "Dr. Sunita Joshi",
    displayName: "Dr. Sunita Joshi (Ph.D. Jyotish)",
    headline: "KP Astrology & Medical Jyotish Researcher, Gold Medalist Astrologer",
    professionalType: "Astrologer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    city: "Delhi NCR",
    state: "Delhi",
    country: "India",
    location: "New Delhi, Delhi NCR",
    yearsOfExperience: 19,
    languages: ["English", "Hindi"],
    isVerified: true,
    isFeatured: true,
    bio: "Dr. Sunita Joshi is an internationally renowned astrologer specializing in Krishnamurti Paddhati (KP System), Prashna Shastra (Horary Astrology), and Medical Astrology. With over 19 years of practical consulting experience, she provides data-backed, empathetic planetary counseling.",
    expertise: [
      "KP Astrology",
      "Kundli Analysis",
      "Medical Astrology",
      "Prashna Shastra",
      "Gemstone Guidance",
    ],
    specializations: [
      "Sub-Lord Precision Timing of Events",
      "Career Transitions & Business Expansion",
      "Marital Harmony & Synastry",
    ],
    education: "Ph.D. in Astrology from Rashtriya Sanskrit Sansthan, New Delhi",
    lineage: "Vedic Parashara Research Fellowship",
    services: [
      {
        name: "Comprehensive Kundli Blueprint Consultation",
        type: "Astrology Consultation",
        mode: "Video Call (Online)",
        duration: "45 Minutes",
        description: "Detailed analysis of D1, D9, D10 charts, Dasha analysis, and gemstone recommendations.",
      },
      {
        name: "KP Prashna Kundli (Urgent Decision Analysis)",
        type: "Horary Astrology",
        mode: "Phone / Video Call",
        duration: "30 Minutes",
        description: "Exact time chart reading to answer specific critical questions regarding career or health.",
      },
    ],
    availability: "Online Worldwide (Video Call)",
    serviceLocations: ["Delhi NCR", "Worldwide via Video Consultation"],
    credentials: [
      {
        title: "Doctorate in Vedic Astrology (Ph.D.)",
        institution: "Rashtriya Sanskrit Sansthan, New Delhi",
        year: "2007",
      },
      {
        title: "Jyotish Visharad Gold Medal",
        institution: "All India Federation of Astrologers Societies",
        year: "2004",
      },
    ],
    socialLinks: {
      website: "https://drsunitajyotish.com",
      youtube: "https://youtube.com/@drsunitajoshi",
      linkedin: "https://linkedin.com/in/drsunitajoshi-astrology",
    },
    stats: {
      ritualsConducted: "N/A",
      consultations: "8,900+",
      rating: 4.99,
      reviewsCount: 512,
    },
  },
  {
    id: "acharya-devavrat-dixit",
    slug: "acharya-devavrat-dixit",
    fullName: "Acharya Devavrat Dixit",
    displayName: "Acharya Devavrat Dixit",
    headline: "Mahakaleshwar Tradition Priest & Bhrigu Nandi Nadi Astrologer, Ujjain",
    professionalType: "Both",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    city: "Ujjain",
    state: "Madhya Pradesh",
    country: "India",
    location: "Ujjain, Madhya Pradesh",
    yearsOfExperience: 22,
    languages: ["Sanskrit", "Hindi", "Gujarati"],
    isVerified: true,
    isFeatured: true,
    bio: "Serving at the sacred land of Avantika (Ujjain), Acharya Devavrat Dixit combines deep expertise in Kaal Sarp Dosha, Mangal Dosha Nivaran, and Bhrigu Nandi Nadi readings. He has guided thousands of seekers through transformative Vedic remedies.",
    expertise: [
      "Vedic Karmakand",
      "Kundli Analysis",
      "Homa & Yagya",
      "Nadi Jyotish",
      "Navagraha Shanti",
    ],
    specializations: [
      "Kaal Sarp Yoga Shanti at Shipra Ghat",
      "Bhat Pooja for Mangal Dosha",
      "Nadi Transit Calculations",
    ],
    education: "Shastri from Maharshi Sandipani Rashtriya Veda Vidya Pratishthan, Ujjain",
    lineage: "Avantika Kshetra Tirtha Purohit Parampara",
    services: [
      {
        name: "Kaal Sarp Yoga Nivarana Puja",
        type: "Remedial Homa",
        mode: "In-Person & Live Stream",
        duration: "3 Hours",
        description: "Consecrated rituals performed with silver naag-nagin pairs as per ancient text.",
      },
      {
        name: "Nadi Astrological Life Reading",
        type: "Astrology Consultation",
        mode: "Online & In-Person",
        duration: "60 Minutes",
        description: "Past karma patterns, current dasha transitions, and practical remedial solutions.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Ujjain", "Indore", "Worldwide Live Broadcast"],
    credentials: [
      {
        title: "Vedalankar Degree",
        institution: "Sandipani Ashram Vedic Trust, Ujjain",
        year: "2003",
      },
    ],
    socialLinks: {
      youtube: "https://youtube.com/@ujjain_jyotish_parampara",
      instagram: "https://instagram.com/acharya_devavrat_ujjain",
    },
    stats: {
      ritualsConducted: "3,100+",
      consultations: "4,700+",
      rating: 4.94,
      reviewsCount: 289,
    },
  },
  {
    id: "pandit-anand-krishna-shukla",
    slug: "pandit-anand-krishna-shukla",
    fullName: "Pt. Anand Krishna Shukla",
    displayName: "Pt. Anand Krishna Shukla",
    headline: "Ayodhya Dham Purohit & Valmiki Ramayana Samhita Reciter",
    professionalType: "Pandit",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200",
    city: "Ayodhya",
    state: "Uttar Pradesh",
    country: "India",
    location: "Ayodhya Dham, Uttar Pradesh",
    yearsOfExperience: 18,
    languages: ["Hindi", "Sanskrit", "Awadhi"],
    isVerified: true,
    isFeatured: false,
    bio: "Based along the holy banks of the Saryu River in Ayodhya, Pt. Anand Krishna Shukla leads traditional Ramcharitmanas Akhand Path, Sundarkand samput recitation, and Sitaram Aradhana rituals for family peace and spiritual upliftment.",
    expertise: [
      "Vedic Karmakand",
      "Homa & Yagya",
      "Vivah Sanskar",
      "Navagraha Shanti",
    ],
    specializations: [
      "Akhand Ramcharitmanas Parayan",
      "Saryu Aarti & Sankalpa",
      "Vastu Shanti & Shuddhi",
    ],
    education: "Acharya in Sahitya & Karmakand, Jagadguru Rambhadracharya Divyang University",
    lineage: "Saryu Teerth Purohit Parampara",
    services: [
      {
        name: "Akhand Ramcharitmanas Path (24 Hours)",
        type: "Vedic Parayan",
        mode: "In-Person",
        duration: "24 Hours",
        description: "Continuous melodic chanting with dholak and manjeera by certified Vyas team.",
      },
      {
        name: "Sundarkand Samput Path with Havan",
        type: "Hanuman Upasana",
        mode: "In-Person & Online",
        duration: "2.5 Hours",
        description: "Focused recitation for overcoming obstacles, fear, and negative energies.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Ayodhya", "Lucknow", "Gorakhpur", "Online"],
    credentials: [
      {
        title: "Acharya Degree",
        institution: "Shri Sitaram Vedic Trust",
        year: "2008",
      },
    ],
    socialLinks: {
      youtube: "https://youtube.com/@ayodhya_vedic_path",
    },
    stats: {
      ritualsConducted: "1,850+",
      consultations: "2,100+",
      rating: 4.97,
      reviewsCount: 198,
    },
  },
  {
    id: "vidushi-meenakshi-iyer",
    slug: "vidushi-meenakshi-iyer",
    fullName: "Vidushi Meenakshi Iyer",
    displayName: "Vidushi Meenakshi Iyer",
    headline: "Prashna Shastra & Parashara Hora Specialist, Career & Business Astrology",
    professionalType: "Astrologer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    location: "Bengaluru, Karnataka",
    yearsOfExperience: 16,
    languages: ["English", "Tamil", "Kannada", "Hindi"],
    isVerified: true,
    isFeatured: true,
    bio: "Vidushi Meenakshi Iyer bridges ancient Vedic wisdom with contemporary career dynamics. Formerly a tech executive in Bengaluru, she transitioned to full-time astrological counseling, advising founders, executives, and professionals across India, Singapore, and the US.",
    expertise: [
      "Kundli Analysis",
      "Prashna Shastra",
      "Gemstone Guidance",
      "Vastu Shastra",
    ],
    specializations: [
      "Corporate Leadership Timing & Dashas",
      "Vedic Synastry & Compatibility",
      "Gemstone Harmonization without Side Effects",
    ],
    education: "Jyotish Praveena & Jyotish Visharada, Indian Council of Astrological Sciences (ICAS)",
    lineage: "Thanjavur Astrological Heritage",
    services: [
      {
        name: "Career & Business Direction Consultation",
        type: "Executive Astrology",
        mode: "Online Video Call",
        duration: "50 Minutes",
        description: "In-depth chart analysis focusing on 10th house, D10 Dashamsha, and auspicious business timings.",
      },
      {
        name: "Prashna & Immediate Crisis Resolution",
        type: "Horary Consultation",
        mode: "Online Video Call",
        duration: "30 Minutes",
        description: "Real-time query analysis using classical South Indian Prashna techniques.",
      },
    ],
    availability: "Online Worldwide",
    serviceLocations: ["Bengaluru", "Worldwide (Remote)"],
    credentials: [
      {
        title: "Jyotish Visharada (Gold Medal)",
        institution: "Indian Council of Astrological Sciences (ICAS)",
        year: "2010",
      },
    ],
    socialLinks: {
      website: "https://meenakshiiyer-jyotish.com",
      linkedin: "https://linkedin.com/in/meenakshi-iyer-astrology",
      youtube: "https://youtube.com/@meenakshiiyer",
    },
    stats: {
      ritualsConducted: "N/A",
      consultations: "6,200+",
      rating: 4.98,
      reviewsCount: 421,
    },
  },
  {
    id: "acharya-someshwar-nath",
    slug: "acharya-someshwar-nath",
    fullName: "Acharya Someshwar Nath",
    displayName: "Acharya Someshwar Nath",
    headline: "Haridwar Maha Aarti Acharya & Chandi Path specialist, Shantikunj trained",
    professionalType: "Pandit",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    city: "Haridwar",
    state: "Uttarakhand",
    country: "India",
    location: "Haridwar, Uttarakhand",
    yearsOfExperience: 21,
    languages: ["Hindi", "Sanskrit", "Garhwali"],
    isVerified: false,
    isFeatured: false,
    bio: "Practicing at Brahma Kund, Har Ki Pauri in Haridwar, Acharya Someshwar Nath is renowned for his mastery over the Durga Saptashati Chandi Homa, Pitru Tarpan rituals, and sacred Ganga Pujan. His invocations bring immediate spiritual tranquility.",
    expertise: [
      "Vedic Karmakand",
      "Homa & Yagya",
      "Maha Rudrabhishek",
      "Navagraha Shanti",
    ],
    specializations: [
      "Navchandi & Shat Chandi Mahayagya",
      "Pitru Dosh Shanti & Narayan Bali",
      "Ganga Abhishek & Deep Daan",
    ],
    education: "Dev Sanskriti Vishwavidyalaya, Haridwar",
    lineage: "Ganga Tirtha Purohit Samaj",
    services: [
      {
        name: "Navchandi Maha Yagya",
        type: "Sacred Fire Ritual",
        mode: "In-Person & Online Live",
        duration: "5 Hours",
        description: "Full Durga Saptashati parayan with samidha oblations for health and triumph over obstacles.",
      },
      {
        name: "Narayan Bali & Pitru Moksha Vidhi",
        type: "Ancestral Peace Ritual",
        mode: "In-Person at Haridwar",
        duration: "4 Hours",
        description: "Traditional Shraaddha and Tarpan rites at sacred Kushavarta Ghat.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Haridwar", "Rishikesh", "Dehradun", "Online"],
    credentials: [
      {
        title: "Purohit Ratna",
        institution: "Haridwar Tirth Seva Samiti",
        year: "2012",
      },
    ],
    socialLinks: {
      youtube: "https://youtube.com/@haridwar_someshwar_acharya",
    },
    stats: {
      ritualsConducted: "2,700+",
      consultations: "1,900+",
      rating: 4.92,
      reviewsCount: 167,
    },
  },
  {
    id: "pandit-raghavendra-bhatt",
    slug: "pandit-raghavendra-bhatt",
    fullName: "Pt. Raghavendra Bhatt",
    displayName: "Pt. Raghavendra Bhatt",
    headline: "Vaikhanasa & Agama Shastra Scholar, Vedic Vastu Consultant from Gokarna",
    professionalType: "Both",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    location: "Bengaluru & Gokarna, Karnataka",
    yearsOfExperience: 27,
    languages: ["Kannada", "Sanskrit", "Telugu", "Hindi", "English"],
    isVerified: true,
    isFeatured: false,
    bio: "Hailing from the sacred coast of Gokarna, Pt. Raghavendra Bhatt is deeply versed in ancient Agama Shastras and classical Mayamata Vastu. He provides holistic architectural harmonization alongside authentic Vedic consecration rituals.",
    expertise: [
      "Vastu Shastra",
      "Vedic Karmakand",
      "Homa & Yagya",
      "Kundli Analysis",
    ],
    specializations: [
      "Residential & Commercial Vastu Audits",
      "Sudharshana Maha Homa",
      "Lakshmi Kubera Yagya",
    ],
    education: "Agama Praveena, Sanskrit College, Mysore",
    lineage: "Gokarna Mahabaleshwar Archaka Parampara",
    services: [
      {
        name: "Sudharshana Maha Homa & Yagya",
        type: "Protection Ritual",
        mode: "In-Person & Online",
        duration: "3.5 Hours",
        description: "Invoking Lord Sudharshana with 108 herbs for eliminating negative planetary vibrations.",
      },
      {
        name: "Complete On-Site / Remote Vastu Audit",
        type: "Vastu Consultation",
        mode: "In-Person & Online Blueprint Review",
        duration: "90 Minutes",
        description: "Directional energy flow analysis with non-demolition remedial corrections.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Bengaluru", "Gokarna", "Hyderabad", "Chennai"],
    credentials: [
      {
        title: "Agama Praveena",
        institution: "Karnataka Sanskrit University",
        year: "1999",
      },
    ],
    socialLinks: {
      website: "https://raghavendrabhatt-vastu.in",
    },
    stats: {
      ritualsConducted: "3,800+",
      consultations: "4,200+",
      rating: 4.97,
      reviewsCount: 310,
    },
  },
  {
    id: "acharya-vinayak-trivedi",
    slug: "acharya-vinayak-trivedi",
    fullName: "Acharya Vinayak Trivedi",
    displayName: "Acharya Vinayak Trivedi",
    headline: "Jaimini Astrology & Matchmaking Specialist, Kundli Dosha Remedial Guide",
    professionalType: "Astrologer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    location: "Ahmedabad, Gujarat",
    yearsOfExperience: 15,
    languages: ["Gujarati", "Hindi", "English"],
    isVerified: true,
    isFeatured: false,
    bio: "Acharya Vinayak Trivedi is a master of the classical Jaimini Chara Dasha system and Vedic compatibility analysis. He emphasizes practical psychological alignment combined with potent, non-exploitative Vedic remedies.",
    expertise: [
      "Kundli Analysis",
      "Vivah Sanskar",
      "Gemstone Guidance",
      "Prashna Shastra",
    ],
    specializations: [
      "Ashtakoota & Nadi Dosha Nuanced Resolution",
      "Jaimini Karakamsha Career Prediction",
      "Planetary Mantra Upasana",
    ],
    education: "Jyotish Ratna, Gujarat University",
    lineage: "Saurashtra Jyotish Mandali",
    services: [
      {
        name: "In-Depth Kundli Milan & Marriage Analysis",
        type: "Matrimonial Astrology",
        mode: "Online Video Call",
        duration: "45 Minutes",
        description: "Holistic evaluation of mental, emotional, health, and longevity compatibility between couples.",
      },
    ],
    availability: "Online Worldwide",
    serviceLocations: ["Ahmedabad", "Surat", "Worldwide Online"],
    credentials: [
      {
        title: "Jyotish Ratna",
        institution: "Vedic Astrological Council of Gujarat",
        year: "2011",
      },
    ],
    socialLinks: {
      youtube: "https://youtube.com/@vinayaktrivedi_jyotish",
    },
    stats: {
      ritualsConducted: "N/A",
      consultations: "4,600+",
      rating: 4.95,
      reviewsCount: 274,
    },
  },
  {
    id: "pandit-gauri-shankar-upadhyay",
    slug: "pandit-gauri-shankar-upadhyay",
    fullName: "Pt. Gauri Shankar Upadhyay",
    displayName: "Pt. Gauri Shankar Upadhyay",
    headline: "Rishikesh Dhyana Acharya & Gayatri Mahamantra Anushthan Specialist",
    professionalType: "Pandit",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    city: "Rishikesh",
    state: "Uttarakhand",
    country: "India",
    location: "Rishikesh, Uttarakhand",
    yearsOfExperience: 30,
    languages: ["Sanskrit", "Hindi", "English"],
    isVerified: true,
    isFeatured: true,
    bio: "Practicing near Triveni Ghat, Rishikesh for three decades, Pt. Gauri Shankar conducts high-frequency Gayatri Anushthan, Maha Mrityunjaya Japa, and spiritual initiation rituals for seekers seeking deep inner transformation.",
    expertise: [
      "Vedic Karmakand",
      "Homa & Yagya",
      "Maha Rudrabhishek",
      "Navagraha Shanti",
    ],
    specializations: [
      "24,000 Gayatri Laghu Anushthan",
      "Tapovan Dhyana & Sankalpa",
      "Shanti Path & Cosmic Harmonization",
    ],
    education: "Veda Murti Sansthan, Rishikesh",
    lineage: "Himalayan Rishikula Tradition",
    services: [
      {
        name: "Gayatri Mahamantra Anushthan with Purnahuti",
        type: "Ascetic Mantra Ritual",
        mode: "In-Person & Live Stream",
        duration: "7 Days (or 4 Hours Purnahuti)",
        description: "Consecrated Japa conducted on sanctified Ganga soil for purifying karmic patterns.",
      },
    ],
    availability: "Both Online & In-Person",
    serviceLocations: ["Rishikesh", "Worldwide via Live Stream"],
    credentials: [
      {
        title: "Vedacharya Lifetime Honor",
        institution: "Himalayan Sanatan Trust",
        year: "2018",
      },
    ],
    socialLinks: {
      youtube: "https://youtube.com/@rishikesh_vedic_anushthan",
    },
    stats: {
      ritualsConducted: "4,500+",
      consultations: "3,100+",
      rating: 4.99,
      reviewsCount: 480,
    },
  },
];

// Local Storage Keys
const STORAGE_KEY_PROFILES = "veda_community_custom_profiles";
const STORAGE_KEY_DRAFT = "veda_community_profile_draft";

/**
 * Normalizes a profile object into a consistent, robust data shape.
 * Protects against runtime TypeError: specializations.map / expertise.map is not a function.
 */
export const normalizeCommunityProfile = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  // Safely normalize comma-separated strings or arrays into clean string arrays
  const toStringArray = (val) => {
    if (Array.isArray(val)) {
      return val
        .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
        .filter((item) => item.length > 0);
    }
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [];
  };

  const specializations = toStringArray(raw.specializations);
  const expertise = toStringArray(raw.expertise);
  const languages = toStringArray(raw.languages);
  const serviceLocations = toStringArray(raw.serviceLocations);

  // Normalizing services array of objects
  let services = [];
  if (Array.isArray(raw.services)) {
    services = raw.services
      .filter((s) => s && typeof s === "object" && (s.name || s.type))
      .map((s) => ({
        name: typeof s.name === "string" ? s.name.trim() : "Sacred Ritual",
        type: typeof s.type === "string" ? s.type.trim() : "Vedic Service",
        duration: typeof s.duration === "string" ? s.duration.trim() : "Standard Vidhi",
        mode: typeof s.mode === "string" ? s.mode.trim() : "Online & In-Person",
        description: typeof s.description === "string" ? s.description.trim() : "",
      }));
  }

  // Normalizing social links (supports flat and nested object structure)
  const websiteUrl =
    raw.websiteUrl ||
    (raw.socialLinks && raw.socialLinks.website) ||
    "";
  const youtubeUrl =
    raw.youtubeUrl ||
    (raw.socialLinks && raw.socialLinks.youtube) ||
    "";
  const linkedInUrl =
    raw.linkedInUrl ||
    (raw.socialLinks && raw.socialLinks.linkedin) ||
    "";
  const instagramUrl =
    raw.instagramUrl ||
    (raw.socialLinks && raw.socialLinks.instagram) ||
    "";

  const city = typeof raw.city === "string" ? raw.city.trim() : "";
  const state = typeof raw.state === "string" ? raw.state.trim() : "";
  const country = typeof raw.country === "string" ? raw.country.trim() : "India";
  const location =
    typeof raw.location === "string" && raw.location.trim()
      ? raw.location.trim()
      : [city, state, country].filter(Boolean).join(", ") || "Varanasi, India";

  const displayName =
    typeof raw.displayName === "string" && raw.displayName.trim()
      ? raw.displayName.trim()
      : typeof raw.fullName === "string" && raw.fullName.trim()
      ? raw.fullName.trim()
      : "Vedic Professional";

  const slug =
    typeof raw.slug === "string" && raw.slug.trim()
      ? raw.slug.trim()
      : displayName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") || `expert-${Date.now()}`;

  const isCustom = Boolean(raw.isCustomUserCreated);

  return {
    ...raw,
    id: raw.id || slug,
    slug,
    fullName: typeof raw.fullName === "string" ? raw.fullName.trim() : displayName,
    displayName,
    headline:
      typeof raw.headline === "string" && raw.headline.trim()
        ? raw.headline.trim()
        : "Vedic Scholar & Spiritual Practitioner",
    professionalType: ["Pandit", "Astrologer", "Both"].includes(raw.professionalType)
      ? raw.professionalType
      : "Pandit",
    yearsOfExperience:
      typeof raw.yearsOfExperience === "number"
        ? raw.yearsOfExperience
        : parseInt(raw.yearsOfExperience, 10) || 0,
    city,
    state,
    country,
    location,
    avatar: typeof raw.avatar === "string" ? raw.avatar : "",
    coverImage: typeof raw.coverImage === "string" ? raw.coverImage : "",
    bio: typeof raw.bio === "string" ? raw.bio.trim() : "",
    expertise,
    specializations,
    languages: languages.length > 0 ? languages : ["Sanskrit", "Hindi"],
    services,
    serviceLocations,
    education: typeof raw.education === "string" ? raw.education.trim() : "",
    lineage: typeof raw.lineage === "string" ? raw.lineage.trim() : "",
    certificateName: typeof raw.certificateName === "string" ? raw.certificateName.trim() : "",
    issuingInstitution:
      typeof raw.issuingInstitution === "string" ? raw.issuingInstitution.trim() : "",
    credentialFileName:
      typeof raw.credentialFileName === "string" ? raw.credentialFileName.trim() : "",
    websiteUrl,
    youtubeUrl,
    linkedInUrl,
    instagramUrl,
    isVerified: isCustom ? false : Boolean(raw.isVerified),
    isFeatured: Boolean(raw.isFeatured),
    isCustomUserCreated: isCustom,
    status: isCustom ? (raw.status || "PENDING_REVIEW") : (raw.status || "ACTIVE"),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
};

// Safe LocalStorage helpers with robust error handling for SSR and malformed JSON
const safeGetItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage, using fallback:`, err);
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
    return false;
  }
};

/**
 * Retrieve all custom profiles created by the user in this browser session
 */
export const getUserCustomProfiles = () => {
  const customData = safeGetItem(STORAGE_KEY_PROFILES, []);
  if (Array.isArray(customData)) {
    return customData
      .filter((p) => p && p.isCustomUserCreated)
      .map(normalizeCommunityProfile)
      .filter(Boolean);
  }
  return [];
};

export const DEFAULT_NEUTRAL_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" fill="#FFF5E5"/>
    <circle cx="50" cy="40" r="18" fill="#D9A441"/>
    <path d="M22 84C22 68 34 58 50 58C66 58 78 68 78 84" fill="#A94F0A"/>
  </svg>
`);

export const DEFAULT_ACTIVE_USER = {
  id: "user-session-current",
  slug: "acharya-vidyadhar-shastri",
  fullName: "Acharya Vidyadhar Shastri",
  displayName: "Acharya Vidyadhar Shastri",
  professionalType: "Pandit & Astrologer",
  headline: "Shukla Yajurveda & Jyotish Scholar • Kashi Parampara",
  bio: "Preserving sacred Vedic recitation, karmakand rituals, and astrological counseling.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  coverImage: "/create-profile-hero-bg.jpg",
  city: "Varanasi",
  state: "Uttar Pradesh",
  country: "India",
  location: "Varanasi (Kashi), Uttar Pradesh",
  yearsOfExperience: 18,
  languages: ["Sanskrit", "Hindi"],
  isVerified: true,
  isFeatured: true,
  isCustomUserCreated: true,
  status: "APPROVED",
  expertise: ["Vedic Karmakand", "Kundli Analysis", "Maha Rudrabhishek"],
  specializations: ["Shukla Yajurveda Samhita", "Graha Dosha Nivarana"],
  education: "Acharya in Shukla Yajurveda, Sampurnanand Sanskrit Vishwavidyalaya",
  lineage: "Kashi Vedic Parampara",
  services: [
    {
      name: "Maha Rudrabhishek Vidhi",
      type: "Vedic Fire & Abhishekam",
      mode: "In-Person & Online Live",
      duration: "3 Hours",
      description: "Complete Rudri Path and Panchamrit Abhishekam.",
    },
  ],
};

/**
 * Retrieve a specific custom profile by slug, or the primary/latest custom profile if no slug passed
 */
export const getUserCustomProfile = (slug = null) => {
  const customProfiles = getUserCustomProfiles();
  if (customProfiles.length > 0) {
    if (slug) {
      return customProfiles.find((p) => p.slug === slug || p.id === slug) || null;
    }
    return customProfiles[0];
  }
  if (slug && slug !== DEFAULT_ACTIVE_USER.slug) {
    return null;
  }
  return DEFAULT_ACTIVE_USER;
};

/**
 * Retrieve all community profiles (initial mock dataset + user created from localStorage)
 * Every profile returned is guaranteed to have normalized arrays for specializations, expertise, languages, and services.
 */
export const getCommunityProfiles = () => {
  const customProfiles = getUserCustomProfiles();
  const normalizedSeeded = INITIAL_COMMUNITY_PROFILES.map(normalizeCommunityProfile).filter(Boolean);
  if (customProfiles.length > 0) {
    return [...customProfiles, ...normalizedSeeded];
  }
  return [DEFAULT_ACTIVE_USER, ...normalizedSeeded];
};

/**
 * Retrieve a profile by slug (seeded or custom, normalized)
 */
export const getCommunityProfileBySlug = (slug) => {
  if (!slug) return null;
  const all = getCommunityProfiles();
  return all.find((p) => p.slug === slug || p.id === slug) || null;
};

/**
 * Save a newly created or edited custom profile to localStorage
 * Ensures updated profiles update existing entries without duplication.
 */
export const saveCommunityProfile = (profileData) => {
  try {
    const customProfiles = getUserCustomProfiles();

    // Match existing profile by id or slug
    const existingIndex = customProfiles.findIndex(
      (p) =>
        (profileData.id && p.id === profileData.id) ||
        (profileData.slug && p.slug === profileData.slug)
    );

    const existingProfile = existingIndex >= 0 ? customProfiles[existingIndex] : null;

    const id = existingProfile ? existingProfile.id : (profileData.id || `custom-${Date.now()}`);
    const slug = existingProfile
      ? existingProfile.slug
      : profileData.slug ||
        profileData.displayName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") ||
        `expert-${Date.now()}`;

    const normalized = normalizeCommunityProfile({
      ...existingProfile,
      ...profileData,
      id,
      slug,
      isCustomUserCreated: true,
      status: existingProfile?.status || profileData.status || "PENDING_REVIEW",
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...customProfiles];
      updatedList[existingIndex] = normalized;
    } else {
      updatedList = [normalized, ...customProfiles];
    }

    safeSetItem(STORAGE_KEY_PROFILES, updatedList);
    return normalized;
  } catch (err) {
    console.error("Error saving community profile to localStorage:", err);
    return null;
  }
};

/**
 * Retrieve draft profile
 */
export const getCommunityDraft = () => {
  return safeGetItem(STORAGE_KEY_DRAFT, null);
};

/**
 * Save draft profile
 */
export const saveCommunityDraft = (draftData) => {
  return safeSetItem(STORAGE_KEY_DRAFT, draftData);
};

/**
 * Clear draft profile
 */
export const clearCommunityDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_DRAFT);
  } catch (err) {
    console.error("Error clearing draft:", err);
  }
};

// ============================================================================
// SOCIAL COMMUNITY FEED & PRACTITIONER INTERACTION LAYER
// ============================================================================

export const STORAGE_KEY_POSTS = "veda_community_posts";
export const STORAGE_KEY_LIKES = "veda_community_likes";
export const STORAGE_KEY_SAVED = "veda_community_saved";
export const STORAGE_KEY_COMMENTS = "veda_community_comments";
export const STORAGE_KEY_FOLLOWS = "veda_community_follows";

export const COMMUNITY_TOPICS = [
  "All",
  "Vedic Scriptures",
  "Sanskrit Study",
  "Rituals & Vidhi",
  "Jyotish & Kundli",
  "Practitioner Q&A",
  "Events & Sessions",
];

export const TRENDING_TOPICS = [
  { tag: "ShuklaYajurveda", topic: "Vedic Scriptures", count: 28 },
  { tag: "RudrabhishekVidhi", topic: "Rituals & Vidhi", count: 42 },
  { tag: "PrashnaKundli", topic: "Jyotish & Kundli", count: 31 },
  { tag: "PaniniGrammar", topic: "Sanskrit Study", count: 24 },
  { tag: "SamidhaOfferings", topic: "Rituals & Vidhi", count: 19 },
  { tag: "AssiGhatTradition", topic: "Vedic Scriptures", count: 16 },
];

export const UPCOMING_COMMUNITY_SESSIONS = [
  {
    id: "session-1",
    title: "Purusha Suktam: Recitation Nuances & Svara Masterclass",
    hostName: "Acharya Rameshwar Shastri",
    hostSlug: "pandit-rameshwar-shastri",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    date: "Sunday, Oct 26",
    time: "10:00 AM IST",
    mode: "Live Discussion Circle",
    participants: "85 Registered",
  },
  {
    id: "session-2",
    title: "Prashna Shastra: Practical Horary Interpretations for Careers",
    hostName: "Dr. Sunita Joshi",
    hostSlug: "dr-sunita-joshi",
    hostAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    date: "Wednesday, Oct 29",
    time: "07:30 PM IST",
    mode: "Interactive Case Study",
    participants: "120 Registered",
  },
  {
    id: "session-3",
    title: "Vastu Shastra & Home Temple Consecration Vidhi",
    hostName: "Pt. Raghavendra Bhatt",
    hostSlug: "pandit-raghavendra-bhatt",
    hostAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    date: "Saturday, Nov 01",
    time: "05:30 PM IST",
    mode: "Agama Shastra Q&A",
    participants: "64 Registered",
  },
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: "post-seed-1",
    authorSlug: "pandit-rameshwar-shastri",
    authorName: "Acharya Rameshwar Shastri",
    authorRole: "Pandit / Acharya",
    authorHeadline: "Vedic Karmakand Specialist & Shukla Yajurveda Parayan Acharya from Kashi",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Varanasi (Kashi)",
    isVerified: true,
    topic: "Vedic Scriptures",
    tags: ["ShuklaYajurveda", "RudriPath", "AssiGhatTradition"],
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    content: `When reciting the sacred Sri Rudram (Namakam and Chamakam) in accordance with the Madhyandina Shakha of Shukla Yajurveda, the preservation of the three primary svaras—Udatta (high pitch), Anudatta (low pitch), and Svarita (circumflex)—is not merely musical; it is vibrational engineering for prana prathishta.

In our Assi Ghat parampara, we emphasize that during the 11th Anuvaka, when invoking the Sahasrani Sahasraso forms of Rudra, the practitioner must breathe from the navel (Nabhi Sthana) rather than the throat. This maintains uninterrupted flow without agitating the mind.

Fellow Acharyas: which regional variations do your Gurukuls adhere to for Panchamrit abhishekam sankalpa timing? I welcome your shastric reflections below.`,
    mediaImage: "/create-profile-hero-bg.jpg",
    baseLikesCount: 38,
    baseSharesCount: 9,
    comments: [
      {
        id: "c-101",
        authorName: "Acharya Devavrat Dixit",
        authorRole: "Pandit & Astrologer",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        content: "Pranam Shastri ji. In our Haridwar lineage, we perform the Ghrita and Madhu arpanam immediately after the 5th Anuvaka to anchor the tejas before the Chamakam begins. Wonderful guidance on the Nabhi Sthana.",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: "c-102",
        authorName: "Pt. Anand Krishna Shukla",
        authorRole: "Pandit / Acharya",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        content: "Har Har Mahadev. In Ujjain Mahakal Kshetra, the Bhasma arpanam precedes the water stream (Dhara). Pristine explanation of the svara discipline.",
        createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "post-seed-2",
    authorSlug: "dr-sunita-joshi",
    authorName: "Dr. Sunita Joshi",
    authorRole: "Vedic Astrologer",
    authorHeadline: "Ph.D. in Vedic Astrology • KP System & Prashna Shastra Specialist",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Bengaluru, Karnataka",
    isVerified: true,
    topic: "Jyotish & Kundli",
    tags: ["PrashnaKundli", "KP_Astrology", "GuruGochar"],
    createdAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(), // 9 hours ago
    content: `Observing the subtle dynamics of Horary Astrology (Prashna Tantra):

Recently, a seeker inquired about a delayed professional transition. The Prashna Lagna fell in Mithuna with the Moon in Uttarashadha nakshatra. The 10th sub-lord in the KP system directly signaled connection with the 6th and 11th houses, but Jupiter was in retrograde motion through the 8th house from Moon.

A common misunderstanding is to immediately recommend harsh stone remedies. Instead, the Shastras teach us that a retrograde benefic signifies review and internal maturation before external fructification. We prescribed Vishnu Sahasranama parayana on Thursdays alongside patience until the planet turned direct. Within 45 days, the appointment letter arrived smoothly without conflict.

Remember: Vedic Astrology is not fatalism; it is divine diagnosis for dharmic alignment.`,
    baseLikesCount: 54,
    baseSharesCount: 14,
    comments: [
      {
        id: "c-201",
        authorName: "Vidushi Meenakshi Iyer",
        authorRole: "Vedic Astrologer",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        content: "Very well articulated Dr. Sunita. Benefics in retrograde signify internal consolidation. Fast-tracking with gemstones often accelerates friction rather than harmony.",
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "post-seed-3",
    authorSlug: "vidushi-meenakshi-iyer",
    authorName: "Vidushi Meenakshi Iyer",
    authorRole: "Vedic Astrologer",
    authorHeadline: "Parashari & Nadi Jyotish Expert • Sanskrit Shloka Recitation Mentor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Delhi NCR",
    isVerified: true,
    topic: "Sanskrit Study",
    tags: ["PaniniGrammar", "SandhiRules", "MantraChanting"],
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), // 18 hours ago
    content: `A concise note on Visarga Sandhi in daily Stotra recitation:

Many students of the Bhagavad Gita stumble on the transition between verses where a Visarga (:) meets a vowel or soft consonant. According to the Ashtadhyayi sutras, Visarga before voiced consonants often softens into 'O' or drops entirely (Lopa) depending on preceding vowels.

For instance, 'Devāḥ + vadanti' becomes 'Devā vadanti', NOT 'Devāho vadanti'. 

When we chant without recognizing Sandhi rules, the poetic Chandas (meter) breaks, altering the cadence of the mantra. I have compiled a quick 2-page cheatsheet on classical Paninian Sandhi rules for our study group. Drop a comment if you would like me to share it in our next live circle!`,
    baseLikesCount: 67,
    baseSharesCount: 22,
    comments: [
      {
        id: "c-301",
        authorName: "Acharya Vinayak Trivedi",
        authorRole: "Vedic Astrologer",
        authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
        content: "Please share the Sandhi compilation Vidushi ji. Our students at the gurukul will benefit immensely from having the Ashtadhyayi references laid out systematically.",
        createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "post-seed-4",
    authorSlug: "acharya-devavrat-dixit",
    authorName: "Acharya Devavrat Dixit",
    authorRole: "Pandit & Astrologer",
    authorHeadline: "Rigvedic Tradition Scholar, Navagraha Homa & Vastu Shanti Vidhi Acharya",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Haridwar, Uttarakhand",
    isVerified: true,
    topic: "Rituals & Vidhi",
    tags: ["NavagrahaHoma", "SamidhaOfferings", "Rigveda"],
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), // 1 day ago
    content: `The Shastric science behind the 9 Samidha (Sacred Woods) used in Navagraha Havan:

1. Surya (Sun) — Arka (Calotropis gigantea)
2. Chandra (Moon) — Palasha (Butea monosperma)
3. Mangala (Mars) — Khadira (Acacia catechu)
4. Budha (Mercury) — Apamarga (Achyranthes aspera)
5. Guru (Jupiter) — Ashvattha / Peepal (Ficus religiosa)
6. Shukra (Venus) — Audumbara / Gular (Ficus racemosa)
7. Shani (Saturn) — Shami (Prosopis cineraria)
8. Rahu — Durva (Cynodon dactylon)
9. Ketu — Kusha (Desmostachya bipinnata)

Each wood releases specific therapeutic aromas and negative-ion purifying compounds when ignited with pure Desi cow ghee. Using surrogate or artificial wood chips diminishes the ritual's subtler atmospheric purification. Protect the purity of your samagri!`,
    mediaImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200",
    baseLikesCount: 82,
    baseSharesCount: 31,
    comments: [],
  },
  {
    id: "post-seed-5",
    authorSlug: "pandit-anand-krishna-shukla",
    authorName: "Pt. Anand Krishna Shukla",
    authorRole: "Pandit / Acharya",
    authorHeadline: "Kaal Sarp & Pitra Dosha Specialist • Assi Ghat & Mahakaleshwar Parampara",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Ujjain, Madhya Pradesh",
    isVerified: true,
    topic: "Practitioner Q&A",
    tags: ["UjjainTradition", "PitraDosha", "SankalpaVidhi"],
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(), // 1.5 days ago
    content: `Question for Senior Acharyas regarding Tithi timings in Pitra Tarpan:

When a devotee's ancestral Amavasya falls across two solar days—beginning in the afternoon of Trayodashi/Chaturdashi and concluding before noon on Amavasya—do you recommend performing the Aparahna Tarpan on the day where the Aparahna Kala (afternoon period between 1:30 PM to 3:45 PM) coincides with the maximum tithi span, or strictly on the sunrise (Udaya Tithi)?

In the Avanti Kshetra tradition, we place heavy weight on Aparahna Vyapini Amavasya. Let us compare regional shastra injunctions to help guide seekers accurately.`,
    baseLikesCount: 29,
    baseSharesCount: 8,
    comments: [
      {
        id: "c-501",
        authorName: "Pt. Rameshwar Shastri",
        authorRole: "Pandit / Acharya",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        content: "Pranam Shukla ji. In Kashi, the Nirnaya Sindhu rule explicitly prioritizes Aparahna Vyapti for Shraddha and Tarpan, regardless of Udaya Tithi. You are following the authentic Shrauta norm.",
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "post-seed-6",
    authorSlug: "pandit-raghavendra-bhatt",
    authorName: "Pt. Raghavendra Bhatt",
    authorRole: "Pandit & Astrologer",
    authorHeadline: "Gokarna Vedic Heritage • Mayamata Vastu Shastra & Agama Vidhi Acharya",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    authorLocation: "Rishikesh, Uttarakhand",
    isVerified: true,
    topic: "Events & Sessions",
    tags: ["LiveStudy", "AgamaShastra", "RishikeshCircle"],
    createdAt: new Date(Date.now() - 55 * 3600 * 1000).toISOString(), // 2 days ago
    content: `🌿 Vedic Study Session Announcement:

I will be hosting a community study circle this Saturday on 'The Sacred Geometry of Vastu Mandalas: Harmonizing the Brahma Sthana in Modern Living'.

We will explore classical verses from the Mayamata and Vishwakarma Prakash, specifically focusing on remedial alignment without structural demolition. 

Date: Saturday, Nov 01 • 05:30 PM IST
Format: Interactive Community Discussion Circle

Feel free to post your home layout or temple direction questions in the comments beforehand so we can cover them during the live dialogue!`,
    isSession: true,
    sessionDate: "Saturday, Nov 01 • 05:30 PM IST",
    sessionMode: "Agama Shastra Q&A",
    baseLikesCount: 46,
    baseSharesCount: 17,
    comments: [],
  },
];



/**
 * Retrieve user's liked post IDs
 */
export const getLikedPostIds = () => {
  const list = safeGetItem(STORAGE_KEY_LIKES, []);
  return Array.isArray(list) ? list : [];
};

/**
 * Toggle like for a post
 */
export const toggleLikePost = (postId) => {
  const current = getLikedPostIds();
  const isLiked = current.includes(postId);
  const updated = isLiked
    ? current.filter((id) => id !== postId)
    : [...current, postId];
  safeSetItem(STORAGE_KEY_LIKES, updated);
  return !isLiked;
};

/**
 * Retrieve user's saved post IDs
 */
export const getSavedPostIds = () => {
  const list = safeGetItem(STORAGE_KEY_SAVED, []);
  return Array.isArray(list) ? list : [];
};

/**
 * Toggle bookmark/save for a post
 */
export const toggleSavePost = (postId) => {
  const current = getSavedPostIds();
  const isSaved = current.includes(postId);
  const updated = isSaved
    ? current.filter((id) => id !== postId)
    : [...current, postId];
  safeSetItem(STORAGE_KEY_SAVED, updated);
  return !isSaved;
};

/**
 * Retrieve custom comments map { [postId]: Array<comment> }
 */
export const getCustomCommentsMap = () => {
  const map = safeGetItem(STORAGE_KEY_COMMENTS, {});
  return map && typeof map === "object" ? map : {};
};

/**
 * Add a comment to a post
 */
export const addPostComment = (postId, commentData) => {
  const commentsMap = getCustomCommentsMap();
  const existingForPost = Array.isArray(commentsMap[postId]) ? commentsMap[postId] : [];

  const newComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    authorName: commentData.authorName || "Spiritual Seeker",
    authorRole: commentData.authorRole || "Devotee / Practitioner",
    authorAvatar: commentData.authorAvatar || "",
    content: commentData.content.trim(),
    createdAt: new Date().toISOString(),
    isCustom: true,
  };

  const updatedForPost = [...existingForPost, newComment];
  commentsMap[postId] = updatedForPost;
  safeSetItem(STORAGE_KEY_COMMENTS, commentsMap);
  return newComment;
};

/**
 * Retrieve followed practitioner slugs
 */
export const getFollowedPractitioners = () => {
  const list = safeGetItem(STORAGE_KEY_FOLLOWS, []);
  return Array.isArray(list) ? list : [];
};

/**
 * Check if a practitioner is followed
 */
export const isFollowingPractitioner = (slug) => {
  if (!slug) return false;
  return getFollowedPractitioners().includes(slug);
};

/**
 * Toggle follow status for a practitioner slug
 */
export const toggleFollowPractitioner = (slug) => {
  if (!slug) return false;
  const current = getFollowedPractitioners();
  const isFollowing = current.includes(slug);
  const updated = isFollowing
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  safeSetItem(STORAGE_KEY_FOLLOWS, updated);
  return !isFollowing;
};

/**
 * Calculate dynamic follower count for a practitioner
 */
export const getPractitionerFollowerCount = (slug) => {
  if (!slug) return 120;
  // Deterministic base based on slug hash for realism
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 500;
  }
  const baseFollowers = 150 + hash;
  const isUserFollowing = isFollowingPractitioner(slug);
  return baseFollowers + (isUserFollowing ? 1 : 0);
};

/**
 * Retrieve all community posts (user-created custom posts + seeded posts)
 * Injects user's like/save state and dynamically aggregated comments.
 */
export const getCommunityPosts = () => {
  const customPosts = safeGetItem(STORAGE_KEY_POSTS, []);
  const safeCustom = Array.isArray(customPosts) ? customPosts : [];

  const likedIds = new Set(getLikedPostIds());
  const savedIds = new Set(getSavedPostIds());
  const commentsMap = getCustomCommentsMap();

  // Combine custom user posts + initial seeded posts with strict ID deduplication
  const seenIds = new Set();
  const allRaw = [];
  for (const post of [...safeCustom, ...INITIAL_COMMUNITY_POSTS]) {
    if (post && post.id && !seenIds.has(post.id)) {
      seenIds.add(post.id);
      allRaw.push(post);
    }
  }

  return allRaw.map((post) => {
    const isLiked = likedIds.has(post.id);
    const isSaved = savedIds.has(post.id);
    const localComments = Array.isArray(commentsMap[post.id]) ? commentsMap[post.id] : [];
    const baseComments = Array.isArray(post.comments) ? post.comments : [];
    const mergedComments = [...baseComments, ...localComments];

    const baseLikes = typeof post.baseLikesCount === "number" ? post.baseLikesCount : 0;
    const finalLikesCount = Math.max(0, baseLikes + (isLiked ? 1 : 0));

    return {
      ...post,
      isLiked,
      isSaved,
      likesCount: finalLikesCount,
      comments: mergedComments,
      commentsCount: mergedComments.length,
      sharesCount: post.baseSharesCount || post.sharesCount || 3,
    };
  });
};

/**
 * Retrieve posts authored by a specific practitioner slug
 */
export const getCommunityPostsByAuthor = (authorSlug) => {
  if (!authorSlug) return [];
  const allPosts = getCommunityPosts();
  return allPosts.filter(
    (p) => p.authorSlug === authorSlug || p.authorId === authorSlug
  );
};

/**
 * Create a new community post
 */
export const createCommunityPost = (postInput) => {
  const customPosts = safeGetItem(STORAGE_KEY_POSTS, []);
  const safeCustom = Array.isArray(customPosts) ? customPosts : [];

  const userProfile = getUserCustomProfile();

  const authorName =
    postInput.authorName ||
    userProfile?.displayName ||
    userProfile?.fullName ||
    "Vedic Practitioner";

  const authorSlug =
    postInput.authorSlug ||
    userProfile?.slug ||
    "community-member";

  const authorRole =
    postInput.authorRole ||
    (userProfile?.professionalType === "Both"
      ? "Pandit & Astrologer"
      : userProfile?.professionalType || "Spiritual Scholar");

  const authorHeadline =
    postInput.authorHeadline ||
    userProfile?.headline ||
    "Member of Veda Structure Community";

  const authorAvatar =
    postInput.authorAvatar ||
    userProfile?.avatar ||
    "";

  const authorLocation =
    postInput.authorLocation ||
    userProfile?.location ||
    userProfile?.city ||
    "India";

  const newPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    authorSlug,
    authorName,
    authorRole,
    authorHeadline,
    authorAvatar,
    authorLocation,
    isVerified: Boolean(userProfile?.isVerified),
    isCustomUserCreated: true,
    topic: postInput.topic || "Vedic Scriptures",
    tags: Array.isArray(postInput.tags) && postInput.tags.length > 0
      ? postInput.tags
      : ["VedaStructure", "SanatanaWisdom"],
    createdAt: new Date().toISOString(),
    content: postInput.content.trim(),
    mediaImage: postInput.mediaImage || "",
    baseLikesCount: 0,
    baseSharesCount: 0,
    comments: [],
    isSession: Boolean(postInput.isSession),
    sessionDate: postInput.sessionDate || "",
    sessionMode: postInput.sessionMode || "",
  };

  const updatedList = [newPost, ...safeCustom];
  safeSetItem(STORAGE_KEY_POSTS, updatedList);
  return newPost;
};

/**
 * Delete a user-created post
 */
export const deleteCommunityPost = (postId) => {
  const customPosts = safeGetItem(STORAGE_KEY_POSTS, []);
  const safeCustom = Array.isArray(customPosts) ? customPosts : [];
  const filtered = safeCustom.filter((p) => p.id !== postId);
  safeSetItem(STORAGE_KEY_POSTS, filtered);
  return true;
};

/**
 * Format relative timestamp for post and comments
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return "Recently";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
};
