"use strict";

const crypto = require("crypto");

const PURPOSE_SEED_DATA = [
  {
    name: "Health & Wellbeing",
    slug: "health-wellbeing",
    description: "Pujas traditionally associated with wellbeing, healing intentions and protection.",
    icon_name: "ShieldCheck",
    display_order: 1,
    is_active: true,
  },
  {
    name: "Marriage & Relationships",
    slug: "marriage-relationships",
    description: "Pujas associated with marriage, relationships and family harmony.",
    icon_name: "Heart",
    display_order: 2,
    is_active: true,
  },
  {
    name: "Prosperity & Wealth",
    slug: "prosperity-wealth",
    description: "Pujas performed with Sankalpa for prosperity, stability and abundance.",
    icon_name: "Coins",
    display_order: 3,
    is_active: true,
  },
  {
    name: "Career & Success",
    slug: "career-success",
    description: "Rituals associated with professional growth, success and removing obstacles.",
    icon_name: "TrendingUp",
    display_order: 4,
    is_active: true,
  },
  {
    name: "Protection & Peace",
    slug: "protection-peace",
    description: "Pujas performed for spiritual protection, peace and overcoming difficulties.",
    icon_name: "Sparkles",
    display_order: 5,
    is_active: true,
  },
  {
    name: "Family & Home",
    slug: "family-home",
    description: "Pujas for family wellbeing, गृह शांति and auspicious beginnings.",
    icon_name: "Home",
    display_order: 6,
    is_active: true,
  },
  {
    name: "ग्रह / ज्योतिष आधारित",
    slug: "graha-astrological",
    description: "Pujas selected according to specific planetary or astrological considerations.",
    icon_name: "Compass",
    display_order: 7,
    is_active: true,
  },
];

const SERVICE_SEED_DATA = [
  {
    slug: "rudrabhishek-puja",
    name: "Sacred Rudrabhishek Puja",
    eyebrow: "VEDIC PUJA • SHIVA SEVA",
    tagline: "Consecrated Jal & Panchamrit Abhishekam for Inner Peace & Protection",
    short_description: "Traditional Vedic abhishekam performed with Shukla Yajurveda Sri Rudram chanting, bilva patra, and panchamrit for family peace and spiritual elevation.",
    full_description: "Rudrabhishek is one of the most venerable Vedic ceremonies dedicated to Lord Shiva. Officiated by knowledgeable Vedic purohits, this sacred ritual involves continuous bathing of the sanctified Shiva Lingam with 11 holy dravyas while reciting the ancient hymns of Sri Rudra Prashna. The ceremony is traditionally conducted to harmonize household energies, relieve mental unrest, and invoke divine grace for family wellbeing.",
    deity: "Lord Shiva",
    purpose_slug: "protection-peace",
    purpose_summary: "Protection, inner peace and spiritual wellbeing",
    available_durations: JSON.stringify(["2 Hours", "3 Hours", "5 Hours"]),
    duration: "2 - 3 Hours",
    duration_hours: [2, 3, 5],
    location_type: "Kashi Ghats & Consecrated Mandirs",
    location: "Kashi (Varanasi) / Consecrated Shrines",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1100,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Authentic Vedic Rudrabhishek Vidhi as per Shastric standards",
      "All required 100% pure puja samagri (Panchamrit, Bilva, Bhasma, Gangajal)",
      "Personalized Sankalp chanted with your Name & Gotra",
      "Conducted by traditionally qualified Vedic Acharyas",
      "High-definition video update of your personalized Gotra Sankalp",
      "Energized sacred Prasadam and Bhasma delivered to your address",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Peace of Mind & Clarity",
        description: "Traditionally performed to calm mental restlessness and dissolve anxiety through sacred acoustic resonance.",
        icon: "Sparkles",
      },
      {
        title: "Protection & Harmony",
        description: "Invokes divine shielding for household members and mitigates disruptive environmental vibrations.",
        icon: "ShieldCheck",
      },
      {
        title: "Spiritual Rejuvenation",
        description: "Awakens inner awareness and aligns seeker consciousness with universal cosmic order.",
        icon: "Sun",
      },
      {
        title: "Family Wellbeing",
        description: "Nurtures longevity, mutual harmony, and auspicious positivity across generations.",
        icon: "Heart",
      },
    ]),
    significance: JSON.stringify([
      "Sri Rudram is an ancient Shukla Yajurveda text whose vibrational cadence is hailed for cleansing deep psychic channels.",
      "The offering of Bilva patra and Ganga jal symbolizes the surrender of ego and absorption of sattvic divine grace.",
      "Conducted with formal Gotra Sankalpa, the spiritual merit is dedicated to the devotee and their designated family lineage.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Pratham Sankalp", description: "Formal recitation of seeker Name, Gotra, and devotional intention by the Acharya." },
      { step: "02", title: "Swasti Vachan & Aavahan", description: "Purification of the altar, kalash sthapana, and invocation of Ganesha and Shiva Parivar." },
      { step: "03", title: "Continuous Abhishek", description: "Chanting of Sri Rudra Prashna with Panchamrit, honey, sugarcane juice, and Gangajal." },
      { step: "04", title: "Maha Aarti & Prasadam", description: "Closing Karpura Aarti, pushpanjali, distribution of sacred bhasma, and prasad dispatch." },
    ]),
    faqs: JSON.stringify([
      { question: "Can this Puja be arranged specifically in Kashi?", answer: "Yes, this ritual can be coordinated directly on sacred Ganga ghats and temple shrines in Varanasi." },
      { question: "Do I need to know my exact Gotra?", answer: "If your Gotra is uncertain, the Acharya will invoke the universal Kashyapa Gotra as prescribed in traditional shastras." },
      { question: "Will I receive recorded footage of my Sankalpa?", answer: "Yes, video footage of your individual Name and Gotra Sankalpa is shared with you upon ritual completion." },
    ]),
  },
  {
    slug: "maha-mrityunjaya-puja",
    name: "Maha Mrityunjaya Puja",
    eyebrow: "VEDIC PUJA • HEALTH & LONGEVITY",
    tagline: "Ancient Tryambakam Recitation for Health, Courage & Life Vitality",
    short_description: "Potent Vedic worship invoking Lord Mrityunjaya through continuous chanting of the nectar-bestowing mantra for courage, rejuvenation, and physical wellbeing.",
    full_description: null,
    deity: "Lord Shiva (Mrityunjaya)",
    purpose_slug: "health-wellbeing",
    purpose_summary: "Healing intentions, vitality, fearlessness and protection",
    available_durations: JSON.stringify(["3 Hours", "5 Hours"]),
    duration: "3 - 5 Hours",
    duration_hours: [3, 5],
    location_type: "Vedic Yagya Shala & Sacred Kshetras",
    location: "Kashi / Consecrated Vedic Mandirs",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1500,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Authentic Maha Mrityunjaya Japa with committed count vidhi",
      "Pure herbal samagri, cow ghee, and lotus seeds for sacred offerings",
      "Personalized Gotra Sankalp for devotee or designated family member",
      "Officiated by trained Vedic sadhakas",
      "Video recording of the Sankalpa and closing Purnahuti",
      "Energized Mrityunjaya Raksha thread and Prasadam dispatched home",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Vitality & Resilience",
        description: "Traditionally chanted for recovering strength during prolonged fatigue and cultivating physical vitality.",
        icon: "ShieldCheck",
      },
      {
        title: "Mental Fearlessness",
        description: "Dispels persistent anxieties, fears of unforeseen setbacks, and negative thought patterns.",
        icon: "Sparkles",
      },
      {
        title: "Karmic Balancing",
        description: "Mitigates planetary imbalances connected with Saturn, Rahu, and chronic astrological afflictions.",
        icon: "Sun",
      },
    ]),
    significance: JSON.stringify([
      "The Maha Mrityunjaya mantra appears in the Rigveda and Yajurveda as the prime mantra for liberation from spiritual and physical decay.",
      "The sonic resonance creates a protective auric field that fosters deep calm and emotional endurance.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Sankalp & Nyasa", description: "Purification of breath and recitation of seeker Gotra with dedicated prayer intention." },
      { step: "02", title: "Ganesha & Shiva Sthapana", description: "Consecration of the altar and invoking the presence of Lord Tryambaka." },
      { step: "03", title: "Mantra Chanting", description: "Disciplined recitation of the sacred Mrityunjaya hymn by learned priests." },
      { step: "04", title: "Aarti & Raksha", description: "Concluding prayers, distribution of energized sacred thread, and prasad blessing." },
    ]),
    faqs: JSON.stringify([
      { question: "Can I perform this for an elderly parent?", answer: "Yes, you can register on behalf of parents, children, or loved ones by providing their details during Sankalp." },
      { question: "How does remote participation work?", answer: "The Sankalpa is recited in your name, with complete video verification and prasad delivery to your address." },
    ]),
  },
  {
    slug: "navagraha-shanti-puja",
    name: "Navagraha Shanti Puja",
    eyebrow: "VEDIC PUJA • PLANETARY HARMONY",
    tagline: "Harmonizing the 9 Planetary Energies for Balance, Growth & Auspiciousness",
    short_description: "Comprehensive 9-planet Vedic propitiation invoking Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu to balance planetary influences.",
    full_description: null,
    deity: "Navagraha Devas",
    purpose_slug: "graha-astrological",
    purpose_summary: "Planetary balance, career hurdles mitigation and dosha shanti",
    available_durations: JSON.stringify(["3 Hours", "5 Hours"]),
    duration: "3 - 5 Hours",
    duration_hours: [3, 5],
    location_type: "Consecrated Vedic Mandirs",
    location: "Vedic Yagya Shala, Varanasi",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1500,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Individual samidha and grain offerings for each of the 9 planetary deities",
      "Chanting of authentic Vedic Navagraha Suktam mantras",
      "Personalized Gotra Sankalp for astrological alignment",
      "Performed by certified Vedic Jyotish Acharyas",
      "HD video update of the ritual",
      "Energized Navagraha Yantra coin and Prasadam sent to your home",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Planetary Balance",
        description: "Softens challenging astrological transits like Sade Sati, Dhaiya, and Mahadasha transitions.",
        icon: "Sparkles",
      },
      {
        title: "Professional Endeavors",
        description: "Clears subtle stagnations in career, education, and professional decision-making.",
        icon: "Sun",
      },
      {
        title: "Household Equilibrium",
        description: "Brings balanced temperament and mutual understanding among family members.",
        icon: "Heart",
      },
    ]),
    significance: JSON.stringify([
      "Vedic astrology recognizes the Navagrahas as cosmic administrators influencing human karmic experiences.",
      "Propitiating all nine deities simultaneously creates a balanced equilibrium across all life dimensions.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Navagraha Mandala Sthapana", description: "Drawing the sacred 9-deity mandala using sanctified colored grains." },
      { step: "02", title: "Gotra Sankalp", description: "Invoking seeker name, gotra, and birth rashi for planetary alignment." },
      { step: "03", title: "Mantra Ahuti & Pujan", description: "Specific herbal offerings dedicated to each planet in accordance with shastras." },
      { step: "04", title: "Maha Mangal Aarti", description: "Blessings and consecration of protective Navagraha prasadam." },
    ]),
    faqs: JSON.stringify([
      { question: "Should I know my birth chart before booking?", answer: "It is helpful to provide your Rashi and Nakshatra if known; otherwise, the Acharya performs the universal gotra vidhi." },
    ]),
  },
  {
    slug: "maha-lakshmi-sri-suktam-puja",
    name: "Maha Lakshmi Sri Suktam Puja",
    eyebrow: "VEDIC PUJA • PROSPERITY & GRACE",
    tagline: "Sacred Rigvedic Sri Suktam Recitation for Abundance, Harmony & Grace",
    short_description: "Venerable Lakshmi-Kubera puja with lotus flower offerings and continuous recitation of Rigvedic Sri Suktam to invoke auspiciousness and household wellbeing.",
    full_description: null,
    deity: "Goddess Mahalakshmi",
    purpose_slug: "prosperity-wealth",
    purpose_summary: "Prosperity, financial stability, abundance and grace",
    available_durations: JSON.stringify(["2 Hours", "3 Hours"]),
    duration: "2 - 3 Hours",
    duration_hours: [2, 3],
    location_type: "Sacred Dhams & Consecrated Mandirs",
    location: "Kashi / Vedic Mandir",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1200,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Rigvedic 16-verse Sri Suktam recitation with Samput vidhi",
      "Fresh lotus flowers, bilva fruits, pure ghee, and kumkum offerings",
      "Personalized Gotra Sankalp for family prosperity and ventures",
      "Vedic priests specializing in Devi worship",
      "Video updates of the Lakshmi archana",
      "Energized Lakshmi coin, dry fruits, and holy prasadam delivery",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Auspicious Prosperity",
        description: "Invokes positive wealth consciousness and ethical abundance in personal and professional life.",
        icon: "Sparkles",
      },
      {
        title: "Household Peace",
        description: "Fosters warmth, mutual respect, and gracious atmosphere in the family dwelling.",
        icon: "Heart",
      },
    ]),
    significance: JSON.stringify([
      "Sri Suktam is the foundational Vedic hymn from the Rigveda celebrating the divine feminine principle of prosperity and light.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Lakshmi Aavahan", description: "Consecration of the kalash and invoking Maa Lakshmi and Lord Kubera." },
      { step: "02", title: "Gotra Sankalp", description: "Recitation of seeker details and auspicious family intentions." },
      { step: "03", title: "Sri Suktam Archana", description: "16-verse chanting with lotus offerings and kumkum abhishekam." },
      { step: "04", title: "Deepa Aarti", description: "Grand ghee lamp aarti and prasadam consecration." },
    ]),
    faqs: JSON.stringify([
      { question: "Is this suitable for a new business launch?", answer: "Yes, this puja is traditionally performed to mark new enterprises, commercial milestones, and Griha Pravesh." },
    ]),
  },
  {
    slug: "ganesh-vighnaharta-puja",
    name: "Ganesha Vighnaharta Puja",
    eyebrow: "VEDIC PUJA • OBSTACLE REMOVAL",
    tagline: "Sacred Ganapati Atharvashirsha Pujan for Clarity, Wisdom & New Ventures",
    short_description: "Traditional worship of Lord Ganesha with 21 Durva grass offerings, modaks, and Atharvashirsha avartan to dissolve hurdles and bless new beginnings.",
    full_description: null,
    deity: "Lord Ganesha",
    purpose_slug: "career-success",
    purpose_summary: "Professional growth, success and removing obstacles",
    available_durations: JSON.stringify(["2 Hours", "3 Hours"]),
    duration: "2 - 3 Hours",
    duration_hours: [2, 3],
    location_type: "Consecrated Ganesha Mandirs",
    location: "Kashi / Vedic Mandir",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1100,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Ganapati Atharvashirsha 11-Avartan recitation",
      "21 Durva grass bundles, red flowers, modak offerings, and pure sindoor",
      "Personalized Gotra Sankalp for auspicious beginnings",
      "Vedic purohits following authentic Ganapatya vidhi",
      "Video updates of the main archana",
      "Energized Ganesha Raksha thread and holy prasadam delivery",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Clear Roadblocks",
        description: "Traditionally performed before starting new projects, education journeys, and major life decisions.",
        icon: "Sparkles",
      },
      {
        title: "Mental Clarity",
        description: "Enhances intellect, discernment, and steady focus during critical transitions.",
        icon: "Sun",
      },
    ]),
    significance: JSON.stringify([
      "Lord Ganesha is hailed in the Vedas as the Prathama Pujya—the first deity worshipped to secure harmony in all subsequent endeavors.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Sthapana & Sankalp", description: "Altar sanctification and formal gotra prayer dedication." },
      { step: "02", title: "Durva Archana", description: "Chanting Atharvashirsha while offering sanctified Durva grass." },
      { step: "03", title: "Naivedya & Modak Seva", description: "Offering traditional sweets and fragrant incense." },
      { step: "04", title: "Maha Aarti", description: "Closing prayers and holy prasad packing." },
    ]),
    faqs: JSON.stringify([
      { question: "Can I perform this on a Wednesday or Chaturthi?", answer: "Yes, you can request your preferred auspicious day during the coordination step." },
    ]),
  },
  {
    slug: "kashi-ganga-pujan",
    name: "Kashi Ganga Ghat Pujan & Aarti",
    eyebrow: "VEDIC PUJA • TIRTHA SEVA",
    tagline: "Sacred Jal Pujan & Deep Daan on the Ancient Ghats of Varanasi",
    short_description: "Venerable River Ganga worship on Dashashwamedh and Manikarnika Ghats in Kashi with milk abhishekam, flower chadar, and 108 oil lamp offerings.",
    full_description: null,
    deity: "Maa Ganga",
    purpose_slug: "family-home",
    purpose_summary: "Family wellbeing, spiritual purification and ancestral peace",
    available_durations: JSON.stringify(["2 Hours"]),
    duration: "2 Hours",
    duration_hours: [2],
    location_type: "Dashashwamedh & Manikarnika Ghats",
    location: "Kashi (Varanasi)",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1100,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Complete Ganga Stotram chanting and Panchamrit jal offering",
      "108 deep daan (oil lamps) floated on the sacred river",
      "Personalized Gotra Sankalp on the riverbank",
      "Experienced Kashi Ghat Purohits",
      "High-definition video of the Ganga Aarti with your name invoked",
      "Energized Gangajal bottle, dry prasadam, and sacred threads delivered home",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Spiritual Cleansing",
        description: "Purifies subtle karmic impressions through direct devotion to the holy waters of Ganga.",
        icon: "Sparkles",
      },
      {
        title: "Pitri & Family Peace",
        description: "Invokes ancestral blessings and peace for departed lineage elders.",
        icon: "Heart",
      },
    ]),
    significance: JSON.stringify([
      "The holy river Ganga in Kashi is celebrated in the Puranas as the descending stream of cosmic purity that bestows spiritual liberation.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Ghat Sankalp", description: "Priests hold Gangajal in hand and recite your family Name & Gotra." },
      { step: "02", title: "Panchamrit Abhishek", description: "Bathing the riverbank altar with milk, honey, and sacred flowers." },
      { step: "03", title: "Deep Daan", description: "Lighting 108 sanctified clay lamps on the holy river waters." },
      { step: "04", title: "Ganga Aarti", description: "Maha Aarti dedicated to Maa Ganga with conch sounds and bells." },
    ]),
    faqs: JSON.stringify([
      { question: "Is physical travel to Kashi required?", answer: "No, the Purohits conduct the ceremony directly on the ghat with your Gotra Sankalp and send full video proof." },
    ]),
  },
  {
    slug: "shiva-parvati-vivah-puja",
    name: "Gauri Shankar & Vivah Badha Nivaran Puja",
    eyebrow: "VEDIC PUJA • MARRIAGE & HARMONY",
    tagline: "Sacred Shiva-Parvati Archana for Relationship Harmony & Timely Marriage",
    short_description: "Venerable Vedic prayer invoking Gauri-Shankar to resolve delays in marriage, promote relationship harmony, and bless couples with mutual understanding.",
    full_description: null,
    deity: "Lord Shiva & Mata Parvati",
    purpose_slug: "marriage-relationships",
    purpose_summary: "Marriage, relationship harmony and conjugal blessing",
    available_durations: JSON.stringify(["2 Hours", "3 Hours"]),
    duration: "2 - 3 Hours",
    duration_hours: [2, 3],
    location_type: "Consecrated Shiva Shrines",
    location: "Kashi / Vedic Mandir",
    available_mode: "hybrid",
    is_kashi_available: true,
    starting_price: 1350,
    is_featured: true,
    is_active: true,
    banner_image: null,
    gallery_images: JSON.stringify([]),
    whats_included: JSON.stringify([
      "Gauri Shankar Vivah Stotram and traditional Rudra recitation",
      "Yellow flowers, sacred sindoor, suhag samagri, and fruit offerings",
      "Personalized Gotra Sankalp for marriage intentions and relationship harmony",
      "Vedic priests specializing in Saiva-Shakta rituals",
      "HD video update of the Sankalp and archana",
      "Energized Gauri-Shankar Raksha thread and holy prasadam sent home",
    ]),
    why_perform: JSON.stringify([
      {
        title: "Overcoming Delays",
        description: "Addresses subtle planetary blockages delaying marital prospects.",
        icon: "Sparkles",
      },
      {
        title: "Conjugal Harmony",
        description: "Fosters deeper empathy, mutual respect, and long-lasting partnership peace.",
        icon: "Heart",
      },
    ]),
    significance: JSON.stringify([
      "The divine union of Shiva and Parvati represents the ultimate harmony of cosmic consciousness and creative energy.",
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Gauri Ganesh Sthapana", description: "Consecration of the sacred kalash and invoking Maa Gauri." },
      { step: "02", title: "Gotra Sankalp", description: "Dedication of seeker name, gotra, and marriage intention." },
      { step: "03", title: "Gauri-Shankar Archana", description: "Sacred offerings with bilateral suhag dravyas and stotram chanting." },
      { step: "04", title: "Mangal Aarti", description: "Consecration of holy prasad and concluding mangal blessings." },
    ]),
    faqs: JSON.stringify([
      { question: "Can parents perform this for their child?", answer: "Yes, parents can provide their son or daughter's name and gotra during the Sankalpa step." },
    ]),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const purposeRows = [];
    const purposeMap = {};

    for (const p of PURPOSE_SEED_DATA) {
      const existing = await queryInterface.rawSelect(
        "puja_purposes",
        { where: { slug: p.slug } },
        ["id"]
      );

      let id = existing;
      if (!id) {
        id = crypto.randomUUID();
        purposeRows.push({
          id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          icon_name: p.icon_name,
          display_order: p.display_order,
          is_active: p.is_active,
          created_at: now,
          updated_at: now,
        });
      }
      purposeMap[p.slug] = id;
    }

    if (purposeRows.length > 0) {
      await queryInterface.bulkInsert("puja_purposes", purposeRows);
    }

    const serviceRows = [];

    for (const s of SERVICE_SEED_DATA) {
      const existing = await queryInterface.rawSelect(
        "puja_services",
        { where: { slug: s.slug } },
        ["id"]
      );

      if (!existing) {
        serviceRows.push({
          id: crypto.randomUUID(),
          slug: s.slug,
          name: s.name,
          eyebrow: s.eyebrow,
          tagline: s.tagline,
          short_description: s.short_description,
          full_description: s.full_description,
          deity: s.deity,
          purpose_id: purposeMap[s.purpose_slug],
          purpose_summary: s.purpose_summary,
          available_durations: s.available_durations,
          duration: s.duration,
          duration_hours: s.duration_hours,
          location_type: s.location_type,
          location: s.location,
          available_mode: s.available_mode,
          is_kashi_available: s.is_kashi_available,
          starting_price: s.starting_price,
          is_featured: s.is_featured,
          is_active: s.is_active,
          banner_image: s.banner_image,
          gallery_images: s.gallery_images,
          whats_included: s.whats_included,
          why_perform: s.why_perform,
          significance: s.significance,
          procedure_steps: s.procedure_steps,
          faqs: s.faqs,
          created_at: now,
          updated_at: now,
        });
      }
    }

    if (serviceRows.length > 0) {
      await queryInterface.bulkInsert("puja_services", serviceRows);
    }
  },

  async down(queryInterface, Sequelize) {
    const serviceSlugs = SERVICE_SEED_DATA.map((s) => s.slug);
    const purposeSlugs = PURPOSE_SEED_DATA.map((p) => p.slug);

    await queryInterface.bulkDelete("puja_services", {
      slug: serviceSlugs,
    });

    await queryInterface.bulkDelete("puja_purposes", {
      slug: purposeSlugs,
    });
  },
};