import pujaRudrabhishekImage from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaKashiImage from "../../../assets/images/puja-kashi.jpg";
import pujaMrityunjayaImage from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImage from "../../../assets/images/puja-navagraha.jpg";
import pujaLakshmiImage from "../../../assets/images/puja-lakshmi.jpg";
import pujaGangaImage from "../../../assets/images/puja-ganga.jpg";
import pujaGaneshImage from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImage from "../../../assets/images/puja-vishnu.jpg";

export const PUJA_LIST = [
  {
    id: "puja-001",
    slug: "sawan-special-rudrabhishek",
    name: "Sawan Special Rudrabhishek",
    eyebrow: "VEDIC PUJA • KASHI",
    tagline: "Sacred Shiva Abhishekam on the Holy Banks of River Ganga",
    description: "Traditional Vedic Rudrabhishek performed in Kashi with Panchamrit, bilva patra, and sacred Vedic mantras for family peace, obstacle removal, and spiritual grace.",
    fullDescription: "Rudrabhishek is one of the most revered and potent Vedic rituals dedicated to Lord Shiva. In the holy city of Kashi (Varanasi), where Lord Shiva is eternally present as Vishwanath, this sacred ceremony invokes supreme cosmic grace. Performed by senior Vedic Purohits according to authentic Shukla Yajurveda traditions, this ceremony channels divine energy to dissolve past karmic blockages, bring deep mental tranquility, and bless your family with protection and spiritual elevation.",
    image: pujaRudrabhishekImage,
    date: "2026-09-24",
    startDateTime: "2026-09-24T06:30:00+05:30",
    formattedDate: "24 September 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Kashi Vishwanath Kshetra, Varanasi",
    deity: "Lord Shiva",
    purpose: "Peace • Protection • Spiritual Wellbeing",
    purposeCategory: "Peace",
    purposeCategories: ["Peace", "Protection", "Spiritual Growth"],
    category: "Special Kashi Puja",
    occasion: "Sawan",
    bookingStatus: "Booking Open",
    bookingOpen: true,
    startingPrice: 1100,
    price: 1100,
    formattedPrice: "₹1,100",
    badge: "Upcoming Sawan",
    rating: "4.9",
    reviewCount: "8.4K",
    bookingCount: "18K+",
    bookingCloseAt: "2026-09-24T23:59:59+05:30",
    images: [pujaRudrabhishekImage, pujaKashiImage, pujaGangaImage],
    isFeatured: true,
    featured: true,
    remoteAvailable: true,
    whyPerform: [
      {
        title: "Peace & Clarity",
        description: "Alleviates mental stress, anxiety, and restlessness by calming planetary vibrations through sacred water and milk offerings.",
        icon: "Sparkles",
      },
      {
        title: "Protection & Dosha Shanti",
        description: "Shields against negative energies, evil eye, and chronic planetary afflictions such as Sade Sati and Kaal Sarp dosha.",
        icon: "ShieldCheck",
      },
      {
        title: "Family Wellbeing & Harmony",
        description: "Invokes harmony in relationships, household peace, and long-term health blessings for all family members.",
        icon: "Heart",
      },
      {
        title: "Spiritual Elevation",
        description: "Awakens inner consciousness, burns karmic residue, and accelerates personal and spiritual growth.",
        icon: "Sun",
      },
    ],
    significance: [
      "The holy city of Kashi is hailed in the Skanda Purana as the Moksha-giving realm where every stone is infused with the grace of Lord Shiva.",
      "The chanting of Sri Rudram during the Abhishek creates an acoustic and spiritual vortex of high vibrational energy that purifies the subtlest channels of the mind.",
      "Performing or participating in Rudrabhishek during the auspicious Sawan month magnifies the spiritual merit thousandfold, bringing immediate relief from persistent obstacles.",
    ],
    whatsIncluded: [
      "Complete Vedic Rudrabhishek Vidhi as per Shastric standards",
      "All required 100% pure puja samagri (Panchamrit, Bilva, Bhasma, Gangajal)",
      "Personalized Sankalp chanted with your Name, Gotra & Nakshatra",
      "Performed by certified Kashi Vedic Brahmins",
      "High-definition Puja completion video recording & photos sent to your WhatsApp/Email",
      "Energized sacred Prasadam and Rudraksha delivered to your home address",
    ],
    procedureSteps: [
      {
        step: "01",
        title: "Sankalp",
        description: "The Acharya invokes your Name, Gotra, and specific intention before the sacred Shiva Lingam in Kashi.",
      },
      {
        step: "02",
        title: "Preparation & Aavahan",
        description: "Purification of the altar, chanting of Swasti Vachan, and ritual invocation of Lord Ganesha and planetary deities.",
      },
      {
        step: "03",
        title: "Main Rudrabhishek",
        description: "Continuous Abhishek with Gangajal, milk, honey, curd, and sugarcane juice while chanting Sri Rudra Prashna from Shukla Yajurveda.",
      },
      {
        step: "04",
        title: "Aarti & Blessings",
        description: "Maha Mangal Aarti, Pushpanjali, distribution of sacred bhasma, and special prayer for your family's prosperity.",
      },
    ],
    eligibility: "Anyone seeking peace of mind, health rejuvenation, relief from planetary hardships, or divine grace for new beginnings can participate. You can book this puja for yourself, parents, spouse, or children even if you cannot travel to Kashi.",
    packages: [
      {
        id: "pkg-individual",
        name: "Individual",
        price: 1100,
        formattedPrice: "₹1,100",
        description: "Personal Sankalp for 1 devotee with full ritual participation.",
        includes: [
          "1 Devotee Name & Gotra in Sankalp",
          "HD Ritual Video Highlights",
          "Consecrated Prasadam delivery to home",
        ],
        isDefault: true,
      },
      {
        id: "pkg-couple",
        name: "Couple / Dampati",
        price: 1800,
        formattedPrice: "₹1,800",
        description: "Joint Sankalp for husband and wife invoking marital harmony and mutual prosperity.",
        includes: [
          "2 Devotees (Husband & Wife) in Sankalp",
          "Personalized blessing chant by Acharyas",
          "Full Ceremony Recording & Photos",
          "Energized Rudraksha & Prasad pack",
        ],
        isDefault: false,
      },
      {
        id: "pkg-family",
        name: "Complete Family",
        price: 2500,
        formattedPrice: "₹2,500",
        description: "Comprehensive Sankalp for up to 6 immediate family members.",
        includes: [
          "Up to 6 Family Members with individual Gotras",
          "Special Bilva Patra Archana for each member",
          "Priority Video delivery within 24 hours",
          "Grand Puja Prasadam Box with Kashi Bhasma & Gangajal",
        ],
        isDefault: false,
      },
    ],
    faqs: [
      {
        question: "Do I need to be physically present in Kashi for this Rudrabhishek?",
        answer: "No, physical presence is not required. Our Acharyas take your individual Sankalp (invoking your Name, Gotra, and Rashi) directly before the Shiva Lingam. A complete video update and energized Prasad are sent to your doorstep.",
      },
      {
        question: "What items will I receive in the Prasadam package?",
        answer: "You will receive sanctified Bhasma from Kashi, consecrated Bilva Patra, energized sacred Raksha Sutra, pure Gangajal from Dashashwamedh Ghat, and dry fruit Prasadam.",
      },
      {
        question: "Can I perform this Puja on behalf of my parents or children?",
        answer: "Yes, you can register and provide the details of your family members, parents, or loved ones during the Sankalp step.",
      },
    ],
  },
  {
    id: "puja-002",
    slug: "mahashivratri-maha-rudrabhishek",
    name: "Mahashivratri Maha Rudrabhishek",
    eyebrow: "VEDIC PUJA • KASHI",
    tagline: "The Greatest Night of Shiva: Maha Rudra Yagya in Sacred Varanasi",
    description: "Participate in the auspicious Mahashivratri 4-Prahar Rudrabhishek performed in Kashi for liberation, health, and supreme auspiciousness.",
    fullDescription: "Mahashivratri marks the divine convergence of Shiva and Shakti. Performing the Maha Rudrabhishek in Kashi during this celestial night cleanses deep karmic cycles and bestows supreme peace and divine protection across generations.",
    image: pujaKashiImage,
    date: "2027-02-15",
    startDateTime: "2027-02-15T18:00:00+05:30",
    formattedDate: "15 February 2027",
    location: "Kashi, Varanasi",
    city: "Varanasi",
    temple: "Manikarnika & Vishwanath Kshetra, Varanasi",
    deity: "Lord Shiva",
    purpose: "Karmic Cleansing • Health • Liberation",
    purposeCategory: "Spiritual Growth",
    purposeCategories: ["Spiritual Growth", "Peace", "Health"],
    category: "Special Kashi Puja",
    occasion: "Mahashivratri",
    bookingStatus: "Coming Soon",
    bookingOpen: false,
    startingPrice: 1001,
    price: 1001,
    formattedPrice: "₹1,001",
    badge: "Maha Parva",
    rating: "4.9",
    reviewCount: "9.2K",
    bookingCount: "22K+",
    bookingCloseAt: "2027-02-15T23:59:59+05:30",
    images: [pujaKashiImage, pujaRudrabhishekImage, pujaGangaImage],
    isFeatured: true,
    featured: true,
    remoteAvailable: true,
    whyPerform: [
      { title: "Karmic Liberation", description: "Dissolves deep-rooted karmic debts and grants spiritual liberation.", icon: "Sun" },
      { title: "Divine Shiva Shield", description: "Provides enduring health and fearlessness from untimely obstacles.", icon: "ShieldCheck" },
      { title: "Spiritual Rebirth", description: "Awakens divine awareness during the holiest night in the Vedic calendar.", icon: "Sparkles" },
    ],
    significance: [
      "Mahashivratri is the night when Lord Shiva performed the cosmic dance of creation and preservation (Tandava).",
      "Kashi is the ground zero of Shiva devotion; prayers offered here on Mahashivratri generate limitless spiritual merit.",
    ],
    whatsIncluded: [
      "4-Prahar traditional Rudrabhishek with sacred chants",
      "Personalized family Sankalp chanted through the night",
      "Energized Mahashivratri Prasad and holy bhasma",
    ],
    procedureSteps: [
      { step: "01", title: "Pratham Prahar", description: "Milk Abhishek and Swasti Vachan invocations." },
      { step: "02", title: "Dwitiya Prahar", description: "Curd and Sugarcane juice Abhishek with Sri Rudram." },
      { step: "03", title: "Tritiya Prahar", description: "Ghee and Honey Abhishek with Mahamrityunjaya chanting." },
      { step: "04", title: "Chaturtha Prahar", description: "Sandalwood, Gangajal and Maha Mangal Aarti." },
    ],
    eligibility: "Open to all Shiva devotees, spiritual seekers, and families seeking long-term peace and protection.",
    packages: [
      { id: "pkg-ind", name: "Devotee Sankalp", price: 1001, formattedPrice: "₹1,001", description: "Single devotee registration", includes: ["1 Name in Sankalp", "Video Updates", "Holy Prasadam"], isDefault: true },
      { id: "pkg-fam", name: "Family Prahar Sankalp", price: 2100, formattedPrice: "₹2,100", description: "Full family 4-Prahar prayer", includes: ["Up to 6 Family Members", "Special Bhasma & Rudraksha", "Extended Ritual Video"], isDefault: false },
    ],
    faqs: [
      { question: "Can I perform this if I am fasting at home?", answer: "Yes, your Sankalp in Kashi complements your personal fasting and worship seamlessly." },
      { question: "How long does the ritual take?", answer: "The 4-prahar ritual spans the entire night of Mahashivratri." },
    ],
  },
  {
    id: "puja-003",
    slug: "navgrah-shanti-maha-yagya",
    name: "Navgrah Shanti Maha Yagya",
    eyebrow: "VEDIC YAGYA • KASHI",
    tagline: "Harmonizing the 9 Planetary Energies for Success & Health",
    description: "Complete 9-planet Vedic Homa performed with authentic samagri and planetary mantras to mitigate planetary afflictions and unlock auspicious life yogas.",
    fullDescription: "The nine celestial grahas exert a profound vibrational influence on human life, health, career, and family. The Navgrah Shanti Maha Yagya conducted in Kashi harmonizes discordant planetary frequencies using sacred wood (Samidha), pure herbs, and Vedic planetary sukthams recited by master Purohits.",
    image: pujaNavagrahaImage,
    date: "2026-09-12",
    startDateTime: "2026-09-12T07:00:00+05:30",
    formattedDate: "12 September 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Vedic Yagya Shala, Varanasi",
    deity: "Navagraha Devas",
    purpose: "Career Growth • Planetary Balance • Health",
    purposeCategory: "Prosperity",
    purposeCategories: ["Prosperity", "Health", "Peace"],
    category: "Yagya",
    occasion: "Special Kashi Rituals",
    bookingStatus: "Almost Full",
    bookingOpen: true,
    startingPrice: 1500,
    price: 1500,
    formattedPrice: "₹1,500",
    badge: "Auspicious Timing",
    rating: "4.8",
    reviewCount: "7.3K",
    bookingCount: "15K+",
    bookingCloseAt: "2026-09-12T23:59:59+05:30",
    images: [pujaNavagrahaImage, pujaKashiImage, pujaMrityunjayaImage],
    isFeatured: false,
    featured: false,
    remoteAvailable: true,
    whyPerform: [
      { title: "Planetary Neutralization", description: "Soothes malevolent planetary periods including Rahu-Ketu and Shani Dhaiya.", icon: "ShieldCheck" },
      { title: "Career & Financial Flow", description: "Dissolves professional bottlenecks and clears paths for business expansion.", icon: "Sparkles" },
      { title: "Physical & Mental Balance", description: "Restores vitality by re-aligning internal subtle energy centers with planetary harmony.", icon: "Sun" },
    ],
    significance: [
      "In the Brihat Parashara Hora Shastra, Vedic planetary homa is cited as the supreme remedial measure for dosha alleviation.",
    ],
    whatsIncluded: [
      "Individual Navagraha Mandal Sthapana and Ahuti",
      "Personalized Sankalp addressing your Janma Kundali afflictions",
      "Consecrated Navagraha Yantra and Prasadam courier delivery",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Chanting of Devotee Gotra, Janma Nakshatra, and current planetary Dasha." },
      { step: "02", title: "Mandal Puja", description: "Invoking Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, and Ketu." },
      { step: "03", title: "Sacred Havan", description: "Offering specialized Samidha wood for each of the nine planetary deities." },
      { step: "04", title: "Purna Ahuti", description: "Final offering, Ashirvaad, and energization of the protective talisman." },
    ],
    eligibility: "Recommended for anyone undergoing challenging astrological transits (Sade Sati, Rahu Mahadasha) or seeking general life stability.",
    packages: [
      { id: "pkg-ind", name: "Individual Dasha Shanti", price: 1500, formattedPrice: "₹1,500", description: "Personal Kundali focus", includes: ["1 Name & Kundali in Sankalp", "Video Updates", "Navagraha Yantra & Prasad"], isDefault: true },
      { id: "pkg-fam", name: "Family Graha Shanti", price: 2700, formattedPrice: "₹2,700", description: "All family members included", includes: ["Up to 6 Family Kundalis", "Individual Samidha Ahutis", "Complete Yagya Recording"], isDefault: false },
    ],
    faqs: [
      { question: "What if I do not know my Gotra or Nakshatra?", answer: "Our Acharyas will perform the Sankalp using the universal Kashyap Gotra and your birth date/name as per Shastric sanction." },
    ],
  },
  {
    id: "puja-004",
    slug: "mahalakshmi-dhan-prapti-yagya",
    name: "Mahalakshmi Dhan Prapti & Kuber Yagya",
    eyebrow: "VEDIC YAGYA • KASHI",
    tagline: "Invoking Divine Abundance, Business Growth & Financial Stability",
    description: "Sacred Sri Suktam and Kanakadhara Homa for prosperity, removal of debts, business expansion, and enduring financial stability.",
    fullDescription: "Goddess Mahalakshmi is the eternal embodiment of spiritual and material abundance. This traditional Maha Yagya combines Sri Suktam chanting from the Rigveda with Kanakadhara Stotram and Kuber Havan to eliminate financial stagnation, clear debts, and invoke sustained business and household fortune.",
    image: pujaLakshmiImage,
    date: "2026-10-08",
    startDateTime: "2026-10-08T07:00:00+05:30",
    formattedDate: "08 October 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Sri Lakshmi Kshetra, Varanasi",
    deity: "Goddess Mahalakshmi & Lord Kuber",
    purpose: "Wealth • Business Growth • Debt Relief",
    purposeCategory: "Prosperity",
    purposeCategories: ["Prosperity", "Family"],
    category: "Yagya",
    occasion: "Festival Puja",
    bookingStatus: "Booking Open",
    bookingOpen: true,
    startingPrice: 1250,
    price: 1250,
    formattedPrice: "₹1,250",
    badge: "Popular Yagya",
    rating: "4.9",
    reviewCount: "6.8K",
    bookingCount: "12K+",
    bookingCloseAt: "2026-10-08T23:59:59+05:30",
    images: [pujaLakshmiImage, pujaKashiImage, pujaGangaImage],
    isFeatured: true,
    featured: true,
    remoteAvailable: true,
    whyPerform: [
      { title: "Financial Abundance", description: "Opens pathways for sustained income and business prosperity.", icon: "Sparkles" },
      { title: "Debt Clearance", description: "Removes chronic financial stagnation and clears unexpected monetary losses.", icon: "ShieldCheck" },
      { title: "Auspicious Growth", description: "Blesses new ventures, property investments, and commercial trades.", icon: "Heart" },
    ],
    significance: [
      "Sri Suktam is the foundational Vedic hymn from Rigveda invoking the supreme feminine principle of auspicious wealth.",
    ],
    whatsIncluded: [
      "1,008 Sri Suktam Ahutis with pure cow ghee and lotus seeds",
      "Personalized Sankalp with family details",
      "Energized Sri Yantra & Lakshmi Prasadam delivery",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Invocation of financial goals and family prosperity." },
      { step: "02", title: "Preparation", description: "Altar sanctification with lotus flowers and kumkum." },
      { step: "03", title: "Main Puja", description: "Sri Suktam and Kanakadhara Stotram chanting with Homa." },
      { step: "04", title: "Blessings", description: "Kuber Potli & Sri Yantra consecration." },
    ],
    eligibility: "Recommended for entrepreneurs, traders, homeowners, and seekers of wealth stability.",
    packages: [
      { id: "pkg-ind", name: "Individual", price: 1250, formattedPrice: "₹1,250", description: "Personal wealth Sankalp", includes: ["1 Name in Sankalp", "Video Updates", "Sri Yantra & Prasad"], isDefault: true },
      { id: "pkg-fam", name: "Family & Business", price: 2100, formattedPrice: "₹2,100", description: "Combined household & enterprise", includes: ["Business & Family Names", "Kuber Potli", "Prasadam"], isDefault: false },
    ],
    faqs: [
      { question: "Can I include my business name in the Sankalp?", answer: "Yes, you can specify your business or firm name during registration." },
    ],
  },
  {
    id: "puja-005",
    slug: "baglamukhi-shatru-vinashak-puja",
    name: "Maa Baglamukhi Shatru Vinashak Puja",
    eyebrow: "VEDIC PUJA • PITAMBARA PEETH",
    tagline: "Supreme Protection from Adversaries, Legal Disputes & Envy",
    description: "Potent Tantrokta and Vaidik Baglamukhi Anushthan for victory in court cases, protection against enemies, and removal of black energy.",
    fullDescription: "Goddess Baglamukhi, the eighth Mahavidya, is the cosmic force that paralyzes speech and harmful intentions of adversaries. Conducted under strict traditional vidhi by authorized Tantra-Vaidik Purohits in Kashi, this ceremony creates an impenetrable armor of divine protection around your family and career.",
    image: pujaGaneshImage,
    date: "2026-09-28",
    startDateTime: "2026-09-28T08:00:00+05:30",
    formattedDate: "28 September 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Baglamukhi Mandir, Varanasi",
    deity: "Goddess Baglamukhi (Pitambara)",
    purpose: "Legal Victory • Enemy Protection • Shield",
    purposeCategory: "Protection",
    purposeCategories: ["Protection"],
    category: "Puja",
    occasion: "Navratri",
    bookingStatus: "Booking Open",
    bookingOpen: true,
    startingPrice: 2100,
    price: 2100,
    formattedPrice: "₹2,100",
    badge: "High Potency",
    rating: "4.9",
    reviewCount: "5.1K",
    bookingCount: "9.5K+",
    bookingCloseAt: "2026-09-28T23:59:59+05:30",
    images: [pujaGaneshImage, pujaKashiImage, pujaMrityunjayaImage],
    isFeatured: false,
    featured: false,
    remoteAvailable: true,
    whyPerform: [
      { title: "Victory in Disputes", description: "Immobilizes negative actions of adversaries and brings favorable legal clarity.", icon: "ShieldCheck" },
      { title: "Protection from Envy", description: "Neutralizes evil eye, competitors' ill will, and subtle negative forces.", icon: "Sparkles" },
      { title: "Overcoming Fear", description: "Instills mental courage and restores psychological peace.", icon: "Heart" },
    ],
    significance: [
      "Baglamukhi worship is renowned in the Shaktic canon as the supreme divine shield against unjust litigation and hidden enemies.",
    ],
    whatsIncluded: [
      "Haldi-infused Havan samagri and yellow floral offerings",
      "Special Pitambara Kavach energization with your name",
      "Discreet and private video documentation",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Chanting of protective intention and enemy neutralisation prayer." },
      { step: "02", title: "Nyasa & Dhyana", description: "Invoking the golden radiance of Pitambara Devi." },
      { step: "03", title: "Mool Mantra Homa", description: "Chanting 1,100 Baglamukhi Mool Mantras with yellow mustard seeds." },
      { step: "04", title: "Kavach Dharan", description: "Energizing the consecrated talisman for dispatch." },
    ],
    eligibility: "Recommended for individuals dealing with court cases, harassment, hostile competition, or recurring psychic stress.",
    packages: [
      { id: "pkg-std", name: "Shatru Shanti Sankalp", price: 2100, formattedPrice: "₹2,100", description: "Standard protective prayer", includes: ["1 Name in Sankalp", "Private Video Highlights", "Pitambara Kavach"], isDefault: true },
      { id: "pkg-adv", name: "Intense Anushthan", price: 5100, formattedPrice: "₹5,100", description: "Extended 11,000 Japa count", includes: ["Extended Japa", "Special Homa", "Prasadam"], isDefault: false },
    ],
    faqs: [
      { question: "Is this ritual completely safe and positive?", answer: "Yes, this is an authentic Sattvic-Vedic prayer focused solely on divine protection and truth." },
    ],
  },
  {
    id: "puja-006",
    slug: "kashi-ganga-aarti-special-puja",
    name: "Kashi Ganga Aarti & Deepdaan Special",
    eyebrow: "VEDIC PUJA • DASHASHWAMEDH",
    tagline: "Sacred River Ganga Worship and Ancestral Blessing Ceremony",
    description: "Personalized Ganga Pujan, 108 Deepdaan on Dashashwamedh Ghat, and Brahmin Bhojan for overall peace, pitra shanti, and auspicious fortune.",
    fullDescription: "Maa Ganga in Kashi is revered as the mother of liberation. This auspicious river ceremony includes customized Ganga Puja, floating 108 sacred oil lamps (Deepdaan) on the tranquil waves of the holy river during twilight Aarti, and feeding Vedic Brahmins in honor of your ancestors and family.",
    image: pujaGangaImage,
    date: "2026-11-04",
    startDateTime: "2026-11-04T17:30:00+05:30",
    formattedDate: "04 November 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Dashashwamedh Ghat, Varanasi",
    deity: "Maa Ganga",
    purpose: "Ancestral Peace • Purification • Gratitude",
    purposeCategory: "Peace",
    purposeCategories: ["Peace", "Family", "Spiritual Growth"],
    category: "Special Kashi Puja",
    occasion: "Special Kashi Rituals",
    bookingStatus: "Booking Open",
    bookingOpen: true,
    startingPrice: 1100,
    price: 1100,
    formattedPrice: "₹1,100",
    badge: "Ghat Special",
    rating: "4.9",
    reviewCount: "11.2K",
    bookingCount: "25K+",
    bookingCloseAt: "2026-11-04T23:59:59+05:30",
    images: [pujaGangaImage, pujaKashiImage, pujaRudrabhishekImage],
    isFeatured: false,
    featured: false,
    remoteAvailable: true,
    whyPerform: [
      { title: "Ancestral Blessing", description: "Brings peace to departed souls and removes Pitra dosha hindrances.", icon: "Sparkles" },
      { title: "Purification", description: "Washes away sorrow and infuses life with holy Ganga shakti.", icon: "Heart" },
    ],
    significance: [
      "Offering Deepdaan at Dashashwamedh Ghat illuminates life paths and invokes the maternal benevolence of Mother Ganga.",
    ],
    whatsIncluded: [
      "108 floating lamps (Deepdaan) offered in your name",
      "Personalized Ganga Pujan & Sankalp",
      "Video of Deepdaan on Ganga Ghat",
      "Ganga Jal & holy Prasad kit",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Invocation by the banks of holy Ganga." },
      { step: "02", title: "Ganga Pujan", description: "Milk, floral, and chandan offerings." },
      { step: "03", title: "108 Deepdaan", description: "Lighting and floating lamps on the river." },
      { step: "04", title: "Blessings", description: "Collection of sanctified Gangajal for your altar." },
    ],
    eligibility: "Open to all families seeking peace, ancestral blessings, and life purification.",
    packages: [
      { id: "pkg-ind", name: "Individual", price: 1100, formattedPrice: "₹1,100", description: "108 Deepdaan Sankalp", includes: ["1 Name in Sankalp", "Video clip of lighting", "Holy Gangajal Kit"], isDefault: true },
      { id: "pkg-fam", name: "Family & Pitra", price: 2100, formattedPrice: "₹2,100", description: "Pitra & Family Deepdaan", includes: ["Ancestors & Family Names", "Brahmin Bhojan included", "Complete Kit"], isDefault: false },
    ],
    faqs: [
      { question: "Can I provide names of my departed ancestors for this?", answer: "Yes, you can write ancestor names in the Sankalp notes field." },
    ],
  },
  {
    id: "puja-007",
    slug: "maha-mrityunjaya-shanti-anushthan",
    name: "Maha Mrityunjaya Shanti & Ayushya Yagya",
    eyebrow: "VEDIC ANUSHTHAN • KASHI",
    tagline: "Supreme Vedic Chanting for Longevity, Critical Health & Protection",
    description: "Intense Maha Mrityunjaya Japa & Homa performed by Vedic scholars in Kashi for health recovery, warding off untimely accidents, and longevity.",
    fullDescription: "The Maha Mrityunjaya Mantra from the Rigveda is revered as the ultimate life-restoring mantra. In Kashi's ancient Mrityunjay Mahadev Kshetra, this sacred ceremony summons divine healing vibrations, strengthens biological and spiritual vitality, and guards against untimely perils.",
    image: pujaMrityunjayaImage,
    date: "2026-09-18",
    startDateTime: "2026-09-18T06:00:00+05:30",
    formattedDate: "18 September 2026",
    location: "Kashi, Varanasi",
    city: "Varanasi",
    temple: "Mrityunjay Mahadev Mandir, Varanasi",
    deity: "Lord Shiva (Mrityunjaya)",
    purpose: "Protection • Health • Longevity",
    purposeCategory: "Health",
    purposeCategories: ["Health", "Protection", "Peace"],
    category: "Yagya",
    occasion: "Pradosh",
    bookingStatus: "Filling Fast",
    bookingOpen: true,
    startingPrice: 1101,
    price: 1101,
    formattedPrice: "₹1,101",
    badge: "Health & Ayushya",
    rating: "4.9",
    reviewCount: "7.8K",
    bookingCount: "16K+",
    bookingCloseAt: "2026-09-18T23:59:59+05:30",
    images: [pujaMrityunjayaImage, pujaRudrabhishekImage, pujaKashiImage],
    isFeatured: true,
    featured: true,
    remoteAvailable: true,
    whyPerform: [
      { title: "Critical Health Recovery", description: "Invokes profound healing vibrations to overcome severe ailments.", icon: "ShieldCheck" },
      { title: "Ayushya & Longevity", description: "Strengthens life vitality (Prana Shakti) and removes fear of untimely death.", icon: "Sparkles" },
    ],
    significance: [
      "The Maha Mrityunjaya Mantra from the Rigveda is the supreme rejuvenating mantra capable of warding off physical and psychic distress.",
    ],
    whatsIncluded: [
      "11,000 Maha Mrityunjaya Japa count with herb-infused Homa",
      "Personalized Sankalp for patient or family",
      "Consecrated Shiva Raksha Kavach & holy Vibhuti delivered to your doorstep",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Invocation for the health and vitality of the devotee." },
      { step: "02", title: "Preparation", description: "Kalash Sthapana and invocation of Lord Mrityunjaya." },
      { step: "03", title: "Main Puja", description: "Continuous chanting of Sanjeevani Mrityunjaya hymn & Homa." },
      { step: "04", title: "Blessings", description: "Purna Ahuti and Kavach energization." },
    ],
    eligibility: "Recommended for anyone seeking vitality, recovery from medical complications, or longevity blessings.",
    packages: [
      { id: "pkg-sankalp", name: "Single Sankalp", price: 1101, formattedPrice: "₹1,101", description: "Individual Name & Gotra chanting in Maha Mrityunjaya Homa", includes: ["1 Name in Sankalp", "Video Updates", "Energized Raksha Sutra"], isDefault: true },
      { id: "pkg-ind", name: "Individual Ayushya", price: 2100, formattedPrice: "₹2,100", description: "Personal Health Sankalp with consecrated Kavach", includes: ["1 Name in Sankalp", "Video Updates", "Energized Kavach & Prasad"], isDefault: false },
      { id: "pkg-fam", name: "Family Protection", price: 3500, formattedPrice: "₹3,500", description: "Full Family Vitality Protection with Special Ayushya Homa", includes: ["Family Names in Sankalp", "Special Ayushya Homa", "Prasadam"], isDefault: false },
    ],
    faqs: [
      { question: "Can this be performed for someone in hospital?", answer: "Yes, you can register on their behalf and their Name & Gotra will be invoked in the sacred healing prayer." },
    ],
  },
  {
    id: "puja-008",
    slug: "satyanarayan-maha-puja",
    name: "Sri Satyanarayan Bhagwan Maha Katha & Puja",
    eyebrow: "VEDIC PUJA • VRINDAVAN & KASHI",
    tagline: "Sacred Vishnu Worship for Family Prosperity & New Beginnings",
    description: "Traditional Satyanarayan Vrat Katha, Panchamrit Abhishek, and Maha Bhog offering for auspicious beginnings, housewarmings, and overall family fortune.",
    fullDescription: "Sri Satyanarayan Puja is the supreme prayer for household prosperity, family unity, and gratitude. Performed in Kashi on sacred Full Moon and auspicious Muhurats, this ritual invites Lord Vishnu's benevolent blessings into every facet of domestic life.",
    image: pujaVishnuImage,
    date: "2026-11-15",
    startDateTime: "2026-11-15T09:00:00+05:30",
    formattedDate: "15 November 2026",
    location: "Kashi (Varanasi)",
    city: "Varanasi",
    temple: "Sri Vishnu Altar, Kashi",
    deity: "Lord Vishnu (Satyanarayan)",
    purpose: "New Beginnings • Household Prosperity • Peace",
    purposeCategory: "Family",
    purposeCategories: ["Family", "Prosperity", "Peace"],
    category: "Puja",
    occasion: "Purnima",
    bookingStatus: "Booking Open",
    bookingOpen: true,
    startingPrice: 1100,
    price: 1100,
    formattedPrice: "₹1,100",
    badge: "Purnima Special",
    rating: "4.8",
    reviewCount: "8.1K",
    bookingCount: "17K+",
    bookingCloseAt: "2026-11-15T23:59:59+05:30",
    images: [pujaVishnuImage, pujaKashiImage, pujaGangaImage],
    isFeatured: false,
    featured: false,
    remoteAvailable: true,
    whyPerform: [
      { title: "Auspicious Beginnings", description: "Blesses new homes, marriages, jobs, and ventures with divine abundance.", icon: "Sparkles" },
      { title: "Household Harmony", description: "Brings joy, mutual understanding, and peace to the entire family.", icon: "Heart" },
    ],
    significance: [
      "Revered in the Reva Khanda of Skanda Purana, the Satyanarayan Katha is the universal remedy for removing household strife and multiplying joy.",
    ],
    whatsIncluded: [
      "Complete 5-Adhyaya Satyanarayan Vrat Katha recitation",
      "Special Panchamrit & Tulsi Archana",
      "Personalized Sankalp",
      "Energized Vishnu Prasadam & Panchamrit kit dispatched",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp", description: "Registration of household intention and family names." },
      { step: "02", title: "Preparation", description: "Gauri-Ganesh Pujan and Navagraha invocation." },
      { step: "03", title: "Main Puja", description: "Satyanarayan Vrat Katha chanting and Aarti." },
      { step: "04", title: "Blessings", description: "Distribution of holy Prasad and Ashirvaad." },
    ],
    eligibility: "Recommended for all households seeking peace, new venture blessings, or monthly Purnima rituals.",
    packages: [
      { id: "pkg-ind", name: "Individual", price: 1100, formattedPrice: "₹1,100", description: "1 Devotee Sankalp", includes: ["1 Name in Sankalp", "Video Updates", "Prasadam"], isDefault: true },
      { id: "pkg-fam", name: "Full Household", price: 1800, formattedPrice: "₹1,800", description: "Complete Family Katha", includes: ["All Family Names", "Special Dampati Bhog", "Prasadam"], isDefault: false },
    ],
    faqs: [
      { question: "Is this performed on Purnima (Full Moon)?", answer: "Yes, this ceremony is consecrated on the auspicious Full Moon day." },
    ],
  },
];

export const getPujaBySlug = (slug) => {
  return PUJA_LIST.find((p) => p.slug === slug) || PUJA_LIST[0];
};

export const getFeaturedPujas = () => {
  return PUJA_LIST.filter((p) => p.isFeatured || p.featured);
};

export const getFeaturedUpcomingPuja = (excludeId = null) => {
  const now = Date.now();
  const upcomingFeatured = PUJA_LIST
    .filter(
      (p) =>
        (p.isFeatured || p.featured) &&
        p.startDateTime &&
        new Date(p.startDateTime).getTime() > now
    )
    .filter((p) => !excludeId || p.id !== excludeId)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  if (upcomingFeatured.length === 0) return null;

  // Prioritize flagship Mahashivratri ceremony if upcoming
  const flagship = upcomingFeatured.find(
    (p) => p.occasion === "Mahashivratri" || p.slug.includes("mahashivratri")
  );
  if (flagship) return flagship;

  return upcomingFeatured[0] || null;
};

export const getNextUpcomingPuja = () => {
  const now = Date.now();
  // Filter future events and sort ascending by startDateTime
  const upcoming = [...PUJA_LIST]
    .filter((p) => p.startDateTime && new Date(p.startDateTime).getTime() > now)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
  return upcoming.length > 0 ? upcoming[0] : PUJA_LIST[0];
};

export const getNextUpcomingPujas = (limit = 5) => {
  const now = Date.now();
  const upcoming = [...PUJA_LIST]
    .filter((p) => p.startDateTime && new Date(p.startDateTime).getTime() > now)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
  return upcoming.slice(0, limit);
};

export const getPujasByCategory = (category) => {
  if (!category || category === "All") return PUJA_LIST;
  return PUJA_LIST.filter((p) => p.category === category);
};

export const getPujasByPurpose = (purpose) => {
  if (!purpose || purpose === "All Purposes") return PUJA_LIST;
  return PUJA_LIST.filter(
    (p) =>
      p.purposeCategory === purpose ||
      (Array.isArray(p.purposeCategories) && p.purposeCategories.includes(purpose))
  );
};

export const getPujasByOccasion = (occasion) => {
  if (!occasion) return PUJA_LIST;
  return PUJA_LIST.filter((p) => p.occasion === occasion);
};

export const getPujasByDate = (dateStr) => {
  return PUJA_LIST.filter((p) => p.date === dateStr);
};
