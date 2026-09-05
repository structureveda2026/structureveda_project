import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import cMantraImg from "../../../assets/images/c-mantra.jpg";
import cGitaImg from "../../../assets/images/c-gita.jpg";
import pSamagriImg from "../../../assets/images/p-samagri.jpg";

/**
 * 6 Core Service Categories for Yagya & Puja Umbrella
 */
export const SERVICE_CATEGORIES = [
  {
    id: "puja",
    title: "Puja",
    subtitle: "Vedic Worship & Offerings",
    description:
      "Personalized sacred worship and deity offerings performed with strict adherence to traditional Vedic vidhi, gotra sankalpa, and authentic samagri.",
    route: "/yagya-puja/puja",
    image: pujaRudrabhishekImg,
    tag: "Individual & Family",
  },
  {
    id: "yagya",
    title: "Yagya",
    subtitle: "Ceremonial Vedic Yagyas",
    description:
      "Large-scale sacred fire yagyas officiated by traditionally trained Vedic acharyas for collective peace, environment sanctification, and ancestral harmony.",
    route: "/yagya-puja/yagya",
    image: pujaMrityunjayaImg,
    tag: "Traditional Hawan & Yagya",
  },
  {
    id: "japa",
    title: "Japa / Chanting",
    subtitle: "Disciplined Mantra Anushthan",
    description:
      "Structured mantra recitation with dedicated count commitments (11,000, 21,000, 1,25,000 counts) conducted by disciplined Vedic sadhakas.",
    route: "/yagya-puja/japa",
    image: cMantraImg,
    tag: "Mantra Anushthan",
  },
  {
    id: "path",
    title: "Path / Recitation",
    subtitle: "Sacred Scriptural Recitation",
    description:
      "Complete, authentic recitation of holy scriptures including Durga Saptashati, Srimad Bhagavad Gita, Sundarkand, and Vishnu Sahasranama.",
    route: "/yagya-puja/path",
    image: cGitaImg,
    tag: "Scriptural Recitation",
  },
  {
    id: "homa",
    title: "Homa / Havan",
    subtitle: "Purification Fire Offerings",
    description:
      "Purifying fire rituals with pure herbs, guggul, and clarified butter offerings to cleanse spaces, balance energies, and invoke auspiciousness.",
    route: "/yagya-puja/homa",
    image: pSamagriImg,
    tag: "Energy Cleansing",
  },
  {
    id: "kashi",
    title: "Puja in Kashi",
    subtitle: "Tirtha Seva on Ganga Ghats",
    description:
      "Sacred rituals performed directly on the sanctified river banks of Varanasi, Baba Vishwanath Kshetra, and ancient Dhams by Kashi-based scholars.",
    route: "/yagya-puja/kashi",
    image: pujaKashiImg,
    tag: "Sacred Kshetra",
  },
];

/**
 * Explore by Purpose Categories
 */
export const PURPOSE_CATEGORIES = [
  {
    id: "shanti",
    title: "Shanti & Wellbeing",
    description: "Rituals focused on peace of mind, family harmony, and planetary balance (Navagraha Shanti).",
    iconName: "HeartHandshake",
    recommendedType: "Homa & Japa",
  },
  {
    id: "family",
    title: "Family Sankalpa",
    description: "Special pujas for family bonding, children's education, and ancestral gratitude (Pitri Seva).",
    iconName: "Users",
    recommendedType: "Puja & Path",
  },
  {
    id: "prosperity",
    title: "Prosperity & Growth",
    description: "Auspicious Lakshmi-Kubera offerings and Ganesha pujas for business and professional endeavors.",
    iconName: "Sparkles",
    recommendedType: "Yagya & Puja",
  },
  {
    id: "spiritual",
    title: "Spiritual Practice",
    description: "Deep meditative japa, Rudrabhishek, and scriptural paths for inner reflection and discipline.",
    iconName: "Flame",
    recommendedType: "Japa & Path",
  },
  {
    id: "occasions",
    title: "Auspicious Occasions",
    description: "Rituals marking birthdays, anniversaries, housewarmings (Griha Pravesh), and new ventures.",
    iconName: "Calendar",
    recommendedType: "Homa & Puja",
  },
  {
    id: "special",
    title: "Special Requirements",
    description: "Customized ritual structures tailored to individual planetary guidance and family traditions.",
    iconName: "Compass",
    recommendedType: "Custom Vidhi",
  },
];

/**
 * Temporary Frontend Presentation Data for Popular Rituals
 * (To be replaced by Backend / CMS in future steps)
 */
export const POPULAR_RITUALS_PREVIEW = [
  {
    id: "mrityunjaya-japa",
    title: "Maha Mrityunjaya Japa & Homa",
    category: "Japa / Homa",
    duration: "Full Day / Multi-Day",
    location: "Kashi / Vedic Ashrams",
    description: "Rigorous chanting of the sacred Tryambakam mantra with dedicated ahutis for courage and wellbeing.",
    image: pujaMrityunjayaImg,
    route: "/yagya-puja/japa",
  },
  {
    id: "rudrabhishek-kashi",
    title: "Kashi Ganga Ghat Rudrabhishek",
    category: "Puja in Kashi",
    duration: "2 - 3 Hours",
    location: "Varanasi Ghats",
    description: "Sacred milk, honey, and Ganga jal abhishekam dedicated to Lord Shiva with personalized sankalpa.",
    image: pujaRudrabhishekImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "navagraha-shanti",
    title: "Complete Navagraha Shanti Yagya",
    category: "Yagya",
    duration: "4 - 5 Hours",
    location: "Vedic Mandir",
    description: "Vedic fire ritual appeasing the nine planetary deities with authentic samidha and herb ahutis.",
    image: pujaNavagrahaImg,
    route: "/yagya-puja/yagya",
  },
  {
    id: "durga-saptashati",
    title: "Sampoorna Durga Saptashati Path",
    category: "Path / Recitation",
    duration: "1 Day Anushthan",
    location: "Sacred Dham",
    description: "Complete 13-chapter recitation of Devi Mahatmyam with Samput mantra chanting by learned scholars.",
    image: pujaLakshmiImg,
    route: "/yagya-puja/path",
  },
];

/**
 * FAQ Items for Umbrella Page
 */
export const YAGYA_PUJA_FAQS = [
  {
    question: "What services are available in the Yagya & Puja ecosystem?",
    answer:
      "Veda Structure provides six structured ritual services: traditional Puja, ceremonial Yagya, dedicated Japa chanting, sacred scriptural Path recitation, purifying Homa/Havan, and specialized rituals conducted in Kashi (Varanasi).",
  },
  {
    question: "Can I choose a specific ritual or customize the vidhi?",
    answer:
      "Yes. You can explore rituals by tradition, deity, or purpose. Once a category is selected, you can specify your family gotra, sankalpa intentions, preferred language, and samagri preferences.",
  },
  {
    question: "Can rituals be arranged directly in Kashi?",
    answer:
      "Yes. Selected Puja and Yagya services can be organized directly on sacred Ganga ghats and traditional kshetras in Kashi, subject to pandit scheduling and seasonal availability.",
  },
  {
    question: "Can I book a ritual on behalf of my family or loved ones?",
    answer:
      "Yes. You can include family members' names, gotras, and dates of birth during the sankalpa coordination phase so the blessings are invoked in their names.",
  },
  {
    question: "Can rituals be coordinated remotely if I cannot travel?",
    answer:
      "Yes. All rituals include digital updates, video recordings of your specific gotra sankalpa, and dispatch of energized holy prasad and bhasma to your registered address.",
  },
  {
    question: "How does the overall booking process work?",
    answer:
      "You select your desired ritual, choose your preferred date and location format, provide your sankalpa details, review the transparent service summary, and confirm your booking.",
  },
];
