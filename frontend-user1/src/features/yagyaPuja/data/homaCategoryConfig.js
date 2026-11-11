/**
 * Central Category Presentation & Visual Configuration for Vedic Homa Traditions
 * Route: /yagya-puja/homa/category/:categorySlug
 */

// Hero Visuals
import shivaHeroImg from "../../../assets/images/homa/shiva-rudra-homa-hero.jpg";
import ganapatiHeroImg from "../../../assets/images/yagya/yagya-sacred-fire-detail.webp.png";
import durgaHeroImg from "../../../assets/images/yagya/yagya-purnahuti.webp.png";
import lakshmiHeroImg from "../../../assets/images/library/cards/card-yagya-fire.jpg";
import navagrahaHeroImg from "../../../assets/images/homa/navagraha-hero-sacred-fire.jpg";
import vastuHeroImg from "../../../assets/images/library/banners/banner-fire-ritual.png";
import ayushyaHeroImg from "../../../assets/images/homa/homa-hero-morning-sanctum.jpg";
import defaultHeroImg from "../../../assets/images/homa/homa-hero-kashi-ceremony.jpg";

// About Visuals
import navagrahaAboutImg from "../../../assets/images/homa/navagraha-mandala-yantra.jpg";
import shivaAboutImg from "../../../assets/images/library/banners/banner-ritual-setup.png";
import ganapatiAboutImg from "../../../assets/images/library/banners/banner-altar.png";
import durgaAboutImg from "../../../assets/images/yagya/yagya-fire-ritual.webp.png";
import lakshmiAboutImg from "../../../assets/images/library/banners/banner-temple-hero.jpg";
import vastuAboutImg from "../../../assets/images/library/banners/banner-temple-ghat.jpg";
import ayushyaAboutImg from "../../../assets/images/library/banners/banner-sanctum.png";

// Samagri Visuals
import navagrahaSamagriImg from "../../../assets/images/homa/navagraha-sacred-samagri.jpg";
import shivaSamagriImg from "../../../assets/images/samagri/samagri-pushpa-bilva.jpg";
import ganapatiSamagriImg from "../../../assets/images/samagri/samagri-havan-mix.jpg";
import durgaSamagriImg from "../../../assets/images/samagri/samagri-special-ahuti.jpg";
import lakshmiSamagriImg from "../../../assets/images/samagri/samagri-desi-ghee.jpg";
import vastuSamagriImg from "../../../assets/images/samagri/samagri-copper-agni-kund.jpg";
import ayushyaSamagriImg from "../../../assets/images/samagri/samagri-herbal-decoction.jpg";
import defaultSamagriImg from "../../../assets/images/samagri/homa-samagri-banner.jpg";

// Ceremony / Showcase Visuals
import navagrahaShowcaseImg from "../../../assets/images/homa/navagraha-ritual-showcase.jpg";
import shivaShowcaseImg from "../../../assets/images/puja-mrityunjaya.jpg";
import rudraShowcaseImg from "../../../assets/images/puja-rudrabhishek.jpg";
import ganapatiShowcaseImg from "../../../assets/images/puja-ganesh.jpg";
import durgaShowcaseImg from "../../../assets/images/devi_durga_card.jpg";
import lakshmiShowcaseImg from "../../../assets/images/puja-lakshmi.jpg";
import vastuShowcaseImg from "../../../assets/images/c-vastu.jpg";
import ayushyaShowcaseImg from "../../../assets/images/yagya_hero.png";

export const HOMA_CATEGORY_VISUALS = {
  "shiva-rudra-homa": {
    hero: shivaHeroImg,
    about: shivaAboutImg,
    samagri: shivaSamagriImg,
    showcase: shivaShowcaseImg,
  },
  "ganapati-homa": {
    hero: ganapatiHeroImg,
    about: ganapatiAboutImg,
    samagri: ganapatiSamagriImg,
    showcase: ganapatiShowcaseImg,
  },
  "durga-chandi-homa": {
    hero: durgaHeroImg,
    about: durgaAboutImg,
    samagri: durgaSamagriImg,
    showcase: durgaShowcaseImg,
  },
  "lakshmi-kubera-homa": {
    hero: lakshmiHeroImg,
    about: lakshmiAboutImg,
    samagri: lakshmiSamagriImg,
    showcase: lakshmiShowcaseImg,
  },
  "navagraha-planetary-homa": {
    hero: navagrahaHeroImg,
    about: navagrahaAboutImg,
    samagri: navagrahaSamagriImg,
    showcase: navagrahaShowcaseImg,
  },
  "vastu-griha-homa": {
    hero: vastuHeroImg,
    about: vastuAboutImg,
    samagri: vastuSamagriImg,
    showcase: vastuShowcaseImg,
  },
  "ayushya-longevity-homa": {
    hero: ayushyaHeroImg,
    about: ayushyaAboutImg,
    samagri: ayushyaSamagriImg,
    showcase: ayushyaShowcaseImg,
  },
};

export const HOMA_CATEGORY_CONFIGS = {
  "shiva-rudra-homa": {
    eyebrow: "VEDIC SHAIVA TRADITION • RUDRA SHANTI",
    iconName: "Flame",
    subtitle: "Potent Vedic Fire Sacrifice for Health, Transformation & Liberation",
    trustIndicators: [
      "Shastric Rudrashtadhyayi Vidhi",
      "Initiated Kashi Acharyas",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "The Transformative Power of Shiva & Rudra Homa",
    aboutDescription:
      "In Vedic tradition, Bhagwan Shiva as Rudra represents the transformative fire of consciousness that dissolves negative karmic imprints, ailments, and fear. Oblations of pure cow ghee, sacred Belpatra, and Amrita herbs into consecrated Agni bestow supreme vitality, inner peace, and spiritual shielding.",
    aboutCards: [
      {
        title: "Sri Rudram & Chamakam",
        desc: "Continuous swara chanting of the ancient Krishna Yajurvedic Rudrashtadhyayi hymns by initiated purohits.",
        iconName: "ScrollText",
      },
      {
        title: "Bilva & Amrita Offerings",
        desc: "Offering sacred Belpatra leaves, black sesame seeds, and pure cow ghee into the sacrificial flame.",
        iconName: "Flame",
      },
      {
        title: "Maha Mrityunjaya Anushthana",
        desc: "Personalized Yajman Sankalpa for health, longevity, and overcoming acute physical or mental afflictions.",
        iconName: "ShieldCheck",
      },
    ],
    faqs: [
      {
        q: "What is the difference between Maha Mrityunjaya Homa and Rudra Homa?",
        a: "Maha Mrityunjaya Homa focuses specifically on health, longevity, vitality, and overcoming grave ailments using the Sanjeevani Mrityunjaya mantra. Rudra Homa invokes the cosmic form of Lord Shiva through the Sri Rudram to dissolve deep-seated karmas and bestow spiritual elevation.",
      },
      {
        q: "What offerings are made during a Shiva Homa?",
        a: "Offerings include pure Desi Cow Ghee (Ghrita), dry Belpatra leaves, black sesame (Tila), Durva grass, medicinal herbs, and unbroken akshat, accompanied by traditional Vedic swaras.",
      },
      {
        q: "How many Pandits perform this ceremony?",
        a: "Depending on the Havan count (1, 3, 5, 7, or 11 Havans), the ceremony engages between 2 to 7 initiated Vedic scholars who maintain continuous swara chanting.",
      },
      {
        q: "Can this Homa be conducted in Kashi or remotely?",
        a: "Yes. Shiva Homas can be arranged directly at our consecrated Kashi sanctum along the holy Ganga, or performed on your behalf with high-definition live video streaming and consecrated Bhasma mailed to your residence.",
      },
      {
        q: "What Prasad is delivered after the ritual?",
        a: "You will receive consecrated Homa Bhasma (sacred vibhuti from Agni), blessed Rudraksha beads, energized Raksha Sutra, and sanctified Akshat.",
      },
      {
        q: "Can family members be included in the Sankalpa?",
        a: "Yes, up to 5 immediate family members can be formally included with their Gotra and Nakshatra in the collective household Sankalpa.",
      },
    ],
    finalCta: {
      eyebrow: "INVOKE SHIVA'S SUPREME GRACE",
      heading: "Arrange Your Consecrated Shiva & Rudra Homa",
      description:
        "Choose your ceremony, configure your Havan cadence, and receive divine blessings for holistic health, longevity, and liberation.",
      buttonText: "Book Shiva Homa",
    },
  },

  "ganapati-homa": {
    eyebrow: "VIGHNAHARTA INVOCATION • AUSPICIOUS BEGINNINGS",
    iconName: "Sparkles",
    subtitle: "Sacred Fire Ritual for Obstacle Removal, Intellect & Prosperity",
    trustIndicators: [
      "Rigvedic Atharvashirsha Vidhi",
      "Initiated Vedic Acharyas",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "The Grace of Maha Ganapati Fire Invocations",
    aboutDescription:
      "Lord Ganesha is the Prathama Pujya—the first to be propitiated before commencing any noble enterprise, venture, or spiritual journey. The Maha Ganapati Homa removes subtle and physical obstacles, sharpens intellect (Buddhi), and invites divine auspiciousness into home and workplace.",
    aboutCards: [
      {
        title: "Prathama Agni Invocation",
        desc: "First oblations into the sacred fire establishing divine presence and dissolving impending impediments.",
        iconName: "Sparkles",
      },
      {
        title: "Modaka & Sugarcane Ahuti",
        desc: "Offering sacred Modakas, sugarcane, honey, and Durva grass to please Lord Vighnaharta.",
        iconName: "Flame",
      },
      {
        title: "Buddhi & Siddhi Sankalpa",
        desc: "Personalized Sankalpa for educational pursuits, business inauguration, or domestic harmony.",
        iconName: "CheckCircle2",
      },
    ],
    faqs: [
      {
        q: "When is the ideal time to perform Ganapati Homa?",
        a: "Maha Ganapati Homa is traditionally performed during Brahma Muhurta (before sunrise) or at sunrise. It is highly recommended before starting new businesses, housewarmings, weddings, or on Sankashti Chaturthi.",
      },
      {
        q: "What sacred materials are offered into Agni?",
        a: "Prescribed ahutis include pure cow ghee, Durva grass, Modakas, puffed rice (Laja), sesame seeds, sugarcane pieces, and fragrant herbs.",
      },
      {
        q: "How many Havan sessions are recommended?",
        a: "A 1-Havan session (completed in 2.5–3 hours) is standard for housewarmings and birthdays. A 3-Havan cadence is chosen for major commercial ventures or comprehensive obstacle removal.",
      },
      {
        q: "Can this ceremony be done remotely?",
        a: "Yes. Devotees worldwide participate via live private stream. Your Gotra and Nakshatra are recited directly before the sacrificial fire in Kashi.",
      },
      {
        q: "What Prasad is dispatched after the Homa?",
        a: "You will receive consecrated Ganapati Homa Bhasma, blessed Raksha Sutra, and sanctified Akshat.",
      },
    ],
    finalCta: {
      eyebrow: "DISSOLVE ALL IMPEDIMENTS",
      heading: "Begin Your Enterprise with Maha Ganapati Homa",
      description:
        "Invite auspiciousness, sharp intellect, and divine protection into your life through authentic Vedic fire rituals.",
      buttonText: "Book Ganapati Homa",
    },
  },

  "durga-chandi-homa": {
    eyebrow: "SHAKTI UPASANA • SUPREME SPIRITUAL SHIELD",
    iconName: "ShieldCheck",
    subtitle: "Consecrated Fire Ceremony for Invincible Protection, Courage & Victory",
    trustIndicators: [
      "Devi Mahatmya Chandi Vidhi",
      "Initiated Shakta Scholars",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "The Protective Splendor of Durga & Chandi Homa",
    aboutDescription:
      "Durga and Chandi Homas invoke the supreme fiery energy of the Divine Mother (Para Shakti) to eliminate negative planetary forces, jealousy, chronic adversaries, and fear. Oblations accompanied by the Durga Saptashati create an impenetrable spiritual armor around the Yajman's family.",
    aboutCards: [
      {
        title: "Durga Saptashati Recitation",
        desc: "Chanting of the 700 sacred verses of Devi Mahatmya by initiated Shakta scholars.",
        iconName: "ScrollText",
      },
      {
        title: "Crimson Offerings & Samidhas",
        desc: "Offering red lotus, kumkum, pure cow ghee, and fragrant herbs into the blazing Kund.",
        iconName: "Flame",
      },
      {
        title: "Abhayaprada Sankalpa",
        desc: "Specific vows for legal relief, victory over hardships, and ancestral spiritual elevation.",
        iconName: "ShieldCheck",
      },
    ],
    faqs: [
      {
        q: "What is the significance of Durga Chandi Homa?",
        a: "It is considered the ultimate protective ritual in Vedic and Shakta traditions, invoking Goddess Chandi to vanquish insurmountable obstacles, court struggles, and negative energies.",
      },
      {
        q: "What are the prescribed offerings?",
        a: "Offerings include pure cow ghee, red flowers, sweet Payasam, Bilva fruit, Navadhanya, and medicinal samagri accompanied by Navarna and Chandi mantras.",
      },
      {
        q: "Can it be performed on specific tithis?",
        a: "Yes, Navami, Ashtami, Amavasya, Purnima, and during Navaratri are exceptionally auspicious, though it can be performed on any verified Shastric muhurta.",
      },
      {
        q: "What Prasad is delivered after the Homa?",
        a: "Blessed Chandi Bhasma, sanctified red Raksha Sutra, energized Devi coin, and consecrated Akshat.",
      },
    ],
    finalCta: {
      eyebrow: "INVOKE DIVINE SHIELD",
      heading: "Seek the Protection of Goddess Durga & Chandi",
      description:
        "Experience the boundless grace, courage, and spiritual shielding of the Divine Mother through consecrated fire oblations.",
      buttonText: "Book Chandi Homa",
    },
  },

  "lakshmi-kubera-homa": {
    eyebrow: "MAHALAKSHMI & KUBERA • WEALTH & HARMONY",
    iconName: "Coins",
    subtitle: "Sacred Prosperity Fire Ritual for Sustained Abundance & Growth",
    trustIndicators: [
      "Rigvedic Sri Suktam Vidhi",
      "Initiated Vedic Purohits",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "Divine Abundance Through Lakshmi & Kubera Homa",
    aboutDescription:
      "Lakshmi is the goddess of auspicious fortune, while Lord Kubera is the celestial custodian of wealth. Performing their combined Homa through the Sri Suktam purges financial stagnancy, attracts sustainable business opportunities, and establishes peace and harmony in the home.",
    aboutCards: [
      {
        title: "Sri Suktam Swara Recital",
        desc: "Chanting of the ancient Rigvedic Sri Suktam invoking the golden deity of fortune.",
        iconName: "Coins",
      },
      {
        title: "Lotus & Pure Ghee Ahutis",
        desc: "Oblations of pink lotus flowers, honey, cow milk, ghee, and golden coins into Agni.",
        iconName: "Flame",
      },
      {
        title: "Lakshmi-Kubera Mandala",
        desc: "Consecration of the Dhanada Yantra for business growth and family stability.",
        iconName: "CheckCircle2",
      },
    ],
    faqs: [
      {
        q: "How does Lakshmi Kubera Homa aid financial growth?",
        a: "By pacifying financial doshas and realigning subtle energies through Sri Suktam oblations, it opens ethical avenues for wealth generation and protects existing assets.",
      },
      {
        q: "Who should perform this Homa?",
        a: "Business owners, entrepreneurs, working professionals seeking career elevation, and families desiring financial stability and peace.",
      },
      {
        q: "What sacred items are offered into the fire?",
        a: "Dry lotus seeds (Kamal Gatta), fresh lotus blossoms, bilva fruit, pure cow ghee, and sweet kheer.",
      },
      {
        q: "What Prasad is received post-ceremony?",
        a: "Consecrated Lakshmi-Kubera coin, energized Homa Bhasma, sanctified yellow Akshat, and a blessed Raksha Sutra.",
      },
    ],
    finalCta: {
      eyebrow: "INVITE CONTINUOUS ABUNDANCE",
      heading: "Perform the Auspicious Lakshmi & Kubera Homa",
      description:
        "Propitiate Goddess Mahalakshmi and Lord Kubera through authentic Vedic fire offerings for lasting prosperity.",
      buttonText: "Book Prosperity Homa",
    },
  },

  "navagraha-planetary-homa": {
    eyebrow: "VEDIC GRAHA SHANTI • 9 CELESTIAL DEITIES",
    iconName: "Compass",
    subtitle: "Sacred Fire Oblations with 9 Prescribed Botanical Samidhas",
    trustIndicators: [
      "9 Shastric Botanical Woods",
      "Initiated Vedic Purohits",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "The Vedic Science of Navagraha Shanti",
    aboutDescription:
      "In Vedic cosmology, human life is intimately interwoven with the nine cosmic energy centers (Navagrahas). When planetary alignments create disharmony or during significant dasha periods, traditional fire oblations into consecrated Agni pacify adverse influences and invoke divine grace.",
    aboutCards: [
      {
        title: "Nine Celestial Deities",
        desc: "Invoking Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu through prescribed Beeja mantras and Samhita hymns.",
        iconName: "Compass",
      },
      {
        title: "Sacred Botanical Woods",
        desc: "Offering nine specific botanical woods (Arka, Palasha, Khadira, Apamarga, Ashvattha, Audumbara, Shami, Durva, Kusha) matched to each planetary vibration.",
        iconName: "Flame",
      },
      {
        title: "Yajman Sankalpa Vidhi",
        desc: "Conducted with personalized Gotra, Nakshatra, and Rashi Sankalpa, preliminary Ganapati Pujan, Navagraha Sthapana, Ahuti cadence, and Purnahuti.",
        iconName: "ScrollText",
      },
    ],
    faqs: [
      {
        q: "Why are nine distinct sacred woods (Samidhas) used in Navagraha Homa?",
        a: "In Vedic Shastras, each celestial deity corresponds to a specific botanical Samidha—such as Arka for Surya, Palasha for Chandra, Khadira for Mangala, Apamarga for Budha, Ashvattha for Guru, Audumbara for Shukra, Shami for Shani, Durva for Rahu, and Kusha for Ketu. Offering these prescribed woods into consecrated Agni attracts harmonic planetary vibrations.",
      },
      {
        q: "Can I participate in the Navagraha Homa remotely?",
        a: "Yes. Devotees unable to visit Kashi (Varanasi) in person can participate remotely via a private, high-definition live video stream. Your Gotra, Nakshatra, and Rashi Sankalpa will be recited verbatim before the sacred fire, and energized Prasad will be safely dispatched to your residence.",
      },
      {
        q: "Which astrological details are required for the Sankalpa?",
        a: "To ensure precise cosmic resonance, you will provide the primary Yajman's full name, Gotra, Janma Nakshatra, and Rashi. If your Gotra is unknown, our Acharyas invoke the universal Kashyapa Gotra in accordance with traditional Vedic injunctions.",
      },
      {
        q: "How do I choose between 1, 3, or 5 Havan sessions?",
        a: "A 1-Havan ceremony is completed in a single 3–4 hour morning session, ideal for general planetary peace and birthday blessings. A 3-Havan ceremony extends Ahutis across multiple Sandhyas or 2 days for significant dasha transitions. A 5-Havan anushthan is a grand ritual recommended for pacifying deep doshas or during Sade Sati peaks.",
      },
      {
        q: "Can immediate family members be included in the Sankalpa?",
        a: "Yes. You can add up to 5 family members (spouse, children, parents) during the booking process. Their names and birth stars will be formally joined into the unified family Sankalpa during the Agni invocation.",
      },
      {
        q: "What consecrated Prasad will I receive after the ceremony?",
        a: "Following the Purnahuti, you will receive sanctified Agni Bhasma (sacred Homa ash), a blessed Navagraha coin token, consecrated Akshat (blessed unbroken rice), and energized Raksha Sutra threads dispatched by express post.",
      },
      {
        q: "How many Pandits perform the Navagraha Homa?",
        a: "A standard 1-day single Havan is conducted by 2 initiated Vedic scholars. For 3 or 5 Havan configurations, the Acharya team scales from 3 up to 9 initiated priests specializing in the Navagraha Samhita and Beeja Mantra traditions.",
      },
    ],
    finalCta: {
      eyebrow: "HARMONIZE YOUR COSMIC SPHERES",
      heading: "Arrange Your Consecrated Navagraha Homa",
      description:
        "Select your Havan cadence, formulate your sacred Sankalpa, and receive blessings from the nine celestial deities through authentic Vedic fire rituals.",
      buttonText: "Book Navagraha Homa",
    },
  },

  "vastu-griha-homa": {
    eyebrow: "VASTU PURUSHA PUJAN • RESIDENTIAL PURITY",
    iconName: "Home",
    subtitle: "Purifying Fire Sacrifice to Consecrate Dwellings & Harmonize Spatial Energies",
    trustIndicators: [
      "Shastric Vastu Shanti Vidhi",
      "Initiated Vedic Sthapatis & Purohits",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "Consecrating Living Spaces with Vastu & Griha Homa",
    aboutDescription:
      "Every physical structure interacts with cosmic directions and planetary forces. Vastu Griha Homa propitiates the Vastu Purusha, clears negative residual energies, and purifies the Pancha Mahabhutas (five elements) within residential or commercial premises.",
    aboutCards: [
      {
        title: "Vastu Purusha Mandala",
        desc: "Consecration of the 81-grid Vastu Mandala aligning the 8 cardinal and inter-cardinal directions.",
        iconName: "Home",
      },
      {
        title: "Panchabhuta Purification",
        desc: "Fire oblations to harmonize Earth, Water, Fire, Air, and Space within the property.",
        iconName: "Flame",
      },
      {
        title: "Griha Shanti & Prosperity",
        desc: "Yajman Sankalpa for health, harmony, and joyful habitation for all residents.",
        iconName: "CheckCircle2",
      },
    ],
    faqs: [
      {
        q: "When should Vastu Shanti Homa be performed?",
        a: "Before moving into a newly constructed or renovated home (Griha Pravesh), purchasing a commercial building, or when experiencing prolonged domestic disharmony.",
      },
      {
        q: "Can Vastu Homa be performed for existing homes?",
        a: "Yes, it can be performed annually or after significant remodeling to rejuvenate spatial energies and rectify subtle directional defects (Vastu doshas).",
      },
      {
        q: "What materials are offered in this Homa?",
        a: "Navadhanya grains, holy water from sacred rivers, white mustard seeds, cow ghee, peepal and mango samidha woods.",
      },
      {
        q: "What Prasad is delivered?",
        a: "Consecrated Vastu Bhasma, energized copper Vastu Yantra, holy Akshat, and blessed Raksha Sutra.",
      },
    ],
    finalCta: {
      eyebrow: "CONSECRATE YOUR HOME",
      heading: "Harmonize Your Living Space with Vastu Homa",
      description:
        "Purify your premises and invoke cosmic harmony through traditional Vedic Vastu fire ceremonies.",
      buttonText: "Book Vastu Homa",
    },
  },

  "ayushya-longevity-homa": {
    eyebrow: "AYUR DEVATA • LONGEVITY & VITALITY",
    iconName: "Heart",
    subtitle: "Vedic Health Fire Sacrifice for Vitality, Rejuvenation & Disease Recovery",
    trustIndicators: [
      "Rigvedic Ayushya Sukta Vidhi",
      "Initiated Vedic Purohits",
      "Kashi Sanctum & Remote",
    ],
    aboutTitle: "Holistic Vitality Through Ayushya & Longevity Homa",
    aboutDescription:
      "Ayushya Homa is an ancient Vedic rite dedicated to Ayur Devata, Markandeya, and the celestial physicians (Ashwini Kumaras). Performed with medicinal herbs, Durva grass, and pure cow ghee, it rejuvenates Prana, supports swift convalescence, and shields the physical body.",
    aboutCards: [
      {
        title: "Ayushya Sukta Chanting",
        desc: "Recitation of Vedic longevity suktas to stimulate life energy and cellular vitality.",
        iconName: "Heart",
      },
      {
        title: "Medicinal Herbal Offerings",
        desc: "Ahutis of Amrita-valli, sacred Durva grass, and pure A2 cow ghee into the fire.",
        iconName: "Flame",
      },
      {
        title: "Ayu & Arogya Sankalpa",
        desc: "Personalized prayer for health recovery, birthday milestones, and prolonged life.",
        iconName: "ShieldCheck",
      },
    ],
    faqs: [
      {
        q: "Who should perform Ayushya Homa?",
        a: "Individuals recovering from severe illnesses, seniors celebrating 60th, 70th, or 80th birthdays, young children on annual birthdays, or anyone seeking robust physical vitality.",
      },
      {
        q: "What are the key ingredients offered into the fire?",
        a: "Pure cow milk, ghee, honey, Durva grass roots, Amrita herbs, and white flowers.",
      },
      {
        q: "How does this differ from Maha Mrityunjaya Homa?",
        a: "While Maha Mrityunjaya is a Shaiva ritual to conquer life-threatening fears and deep afflictions, Ayushya Homa specifically propitiates Ayur Devata for nourishing life span, vitality, and cellular rejuvenation.",
      },
      {
        q: "What Prasad will be received?",
        a: "Consecrated Ayushya Bhasma, energized Raksha Sutra, and sanctified Akshat.",
      },
    ],
    finalCta: {
      eyebrow: "STRENGTHEN LIFE ENERGY",
      heading: "Invoke Divine Vitality with Ayushya Homa",
      description:
        "Perform the sacred Ayushya fire ritual for health, recuperation, and blessed longevity.",
      buttonText: "Book Ayushya Homa",
    },
  },
};

export const DEFAULT_HOMA_CATEGORY_CONFIG = {
  eyebrow: "VEDIC SACRED FIRE CEREMONY",
  iconName: "Flame",
  subtitle: "Authentic Shastric Fire Rituals Performed with Prescribed Mantras & Ahutis",
  trustIndicators: [
    "Authentic Vedic Vidhi",
    "Initiated Kashi Acharyas",
    "Kashi Sanctum & Remote",
  ],
  aboutTitle: "The Sacred Significance of Vedic Fire Rituals",
  aboutDescription:
    "In Vedic tradition, Agni is the divine intermediary (Havya-vahana) carrying consecrated offerings directly to the devatas. Every Homa ceremony is performed according to Shastric injunctions with pure Cow Ghrita, botanical Samidha, and personalized Yajman Sankalpa.",
  aboutCards: [
    {
      title: "Prescribed Veda Mantras",
      desc: "Chanting of authentic Vedic suktas and hymns by initiated Acharyas.",
      iconName: "ScrollText",
    },
    {
      title: "Consecrated Samidhas",
      desc: "Offering pure botanical woods, ghee, and sacred grains directly into the flames.",
      iconName: "Flame",
    },
    {
      title: "Yajman Sankalpa Vidhi",
      desc: "Formal invocation of your Gotra, Nakshatra, and family intentions before Agni.",
      iconName: "CheckCircle2",
    },
  ],
  faqs: [
    {
      q: "What is the difference between Homa and Havan?",
      a: "In Vedic practice, 'Homa' and 'Havan' are synonymous terms referring to fire rituals where sacred Ahutis are made into consecrated Agni with specific Mantras and Sankalpa.",
    },
    {
      q: "Can I choose the number of Havan sessions?",
      a: "Yes, available Havan counts are ceremony-specific (typically 1, 3, 5, 7, or 11 Havans).",
    },
    {
      q: "Can I participate in this Homa remotely?",
      a: "Yes. Devotees participate via private live video stream from our consecrated Kashi sanctum.",
    },
    {
      q: "What Prasad is delivered after the ceremony?",
      a: "Sanctified Agni Bhasma (sacred vibhuti), blessed Raksha Sutra, and energized Akshat.",
    },
  ],
  finalCta: {
    eyebrow: "BEGIN WITH AGNI & SANKALPA",
    heading: "Arrange Your Sacred Vedic Homa Ceremony",
    description:
      "Select your tradition, configure your ceremony parameters, and arrange your fire offering with initiated Vedic Acharyas.",
    buttonText: "Explore Homa Rituals",
  },
};

/**
 * Resolves category visual assets safely with fallback
 */
export const getCategoryVisuals = (slug) => {
  return HOMA_CATEGORY_VISUALS[slug] || {
    hero: defaultHeroImg,
    about: navagrahaAboutImg,
    samagri: defaultSamagriImg,
    showcase: navagrahaShowcaseImg,
  };
};

/**
 * Resolves category presentation configuration safely with fallback
 */
export const getHomaCategoryConfig = (slug) => {
  return HOMA_CATEGORY_CONFIGS[slug] || DEFAULT_HOMA_CATEGORY_CONFIG;
};

export default {
  HOMA_CATEGORY_VISUALS,
  HOMA_CATEGORY_CONFIGS,
  DEFAULT_HOMA_CATEGORY_CONFIG,
  getCategoryVisuals,
  getHomaCategoryConfig,
};

