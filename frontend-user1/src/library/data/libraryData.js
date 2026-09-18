export const VEDA_CATEGORIES = [
  {
    id: "cat-01",
    number: "01",
    slug: "vedic-knowledge",
    title: {
      en: "01. VEDIC KNOWLEDGE",
      hi: "०१. वैदिक ज्ञान (Vedic Knowledge)",
    },
    shortTitle: {
      en: "Vedic Knowledge",
      hi: "वैदिक ज्ञान",
    },
    sanskrit: "वैदिक वाङ्मय",
    tagline: {
      en: "The Primordial Shruti, Vedangas, Brahmanas & Upanishads",
      hi: "सनातन श्रुति, वेदांग, ब्राह्मण, आरण्यक एवं उपनिषद",
    },
    accentColor: "from-amber-600 to-yellow-600",
    iconName: "Scroll",
    subgroups: [
      {
        name: { en: "Veda (वेद)", hi: "वेद (Veda)" },
        items: ["rigveda", "yajurveda", "samaveda", "atharvaveda"],
      },
      {
        name: { en: "Vedanga (वेदांग)", hi: "वेदांग (Vedanga)" },
        items: ["shiksha", "vyakarana", "chandas", "nirukta", "jyotisha", "kalpa"],
      },
      {
        name: { en: "Explanatory & Philosophical Treatises", hi: "व्याख्यात्मक एवं दार्शनिक ग्रंथ" },
        items: ["brahmana", "aranyaka", "upanishad", "sutra"],
      },
    ],
  },
  {
    id: "cat-02",
    number: "02",
    slug: "shastra-darshana",
    title: {
      en: "02. SHASTRA & DARSHANA",
      hi: "०२. शास्त्र एवं दर्शन (Shastra & Darshana)",
    },
    shortTitle: {
      en: "Shastra & Darshana",
      hi: "शास्त्र एवं दर्शन",
    },
    sanskrit: "षड्दर्शन एवं शास्त्र",
    tagline: {
      en: "The Six Orthodox Systems of Indian Philosophy & Logic",
      hi: "भारतीय दर्शन के छह आस्तिक मत एवं तत्त्वमीमांसा",
    },
    accentColor: "from-orange-600 to-amber-600",
    iconName: "Compass",
    subgroups: [
      {
        name: { en: "Shad Darshana (षड् दर्शन)", hi: "षड् दर्शन (छह दार्शनिक धाराएँ)" },
        items: ["vedanta", "mimamsa", "nyaya", "vaisheshika", "sankhya", "yoga"],
      },
    ],
  },
  {
    id: "cat-03",
    number: "03",
    slug: "itihasa-purana",
    title: {
      en: "03. ITIHASA & PURANA",
      hi: "०३. इतिहास एवं पुराण (Itihasa & Purana)",
    },
    shortTitle: {
      en: "Itihasa & Purana",
      hi: "इतिहास एवं पुराण",
    },
    sanskrit: "इतिहास एवं महापुराण",
    tagline: {
      en: "Sacred Epics, Cosmic Chronology & Devotional Lore",
      hi: "रामायण, महाभारत तथा १८ महापुराणों का अमर आख्यान",
    },
    accentColor: "from-red-600 to-amber-700",
    iconName: "BookOpen",
    subgroups: [
      {
        name: { en: "Epics & Puranic Heritage", hi: "महाकाव्य एवं पौराणिक धरोहर" },
        items: ["ramayana", "mahabharata", "purana"],
      },
    ],
  },
  {
    id: "cat-04",
    number: "04",
    slug: "dharma-jeevan",
    title: {
      en: "04. DHARMA & JEEVAN",
      hi: "०४. धर्म एवं जीवन (Dharma & Jeevan)",
    },
    shortTitle: {
      en: "Dharma & Jeevan",
      hi: "धर्म एवं जीवन",
    },
    sanskrit: "धर्म, आचार एवं जीवन पद्धति",
    tagline: {
      en: "Ethical Living, Life Stages, 16 Samskaras & Daily Duties",
      hi: "जीवन के चार आश्रम, १६ संस्कार, सदाचार एवं नित्य कर्म",
    },
    accentColor: "from-emerald-700 to-teal-800",
    iconName: "Sun",
    subgroups: [
      {
        name: { en: "Vedic Lifestyle & Conduct", hi: "वैदिक जीवनशैली एवं कर्तव्य" },
        items: ["dharma", "ashrama", "varna", "samskara", "achara", "nitya-karma"],
      },
    ],
  },
  {
    id: "cat-05",
    number: "05",
    slug: "puja-anushthana",
    title: {
      en: "05. PUJA & ANUSHTHANA",
      hi: "०५. पूजा एवं अनुष्ठान (Puja & Anushthana)",
    },
    shortTitle: {
      en: "Puja & Anushthana",
      hi: "पूजा एवं अनुष्ठान",
    },
    sanskrit: "पूजा, यज्ञ एवं अनुष्ठान",
    tagline: {
      en: "Sacred Fire Sacrifices, Deva Puja, Homa & Vedic Chants",
      hi: "षोडशोपचार पूजा, महायज्ञ, हविष्य, वैदिक मंत्र एवं व्रत",
    },
    accentColor: "from-amber-700 to-orange-800",
    iconName: "Flame",
    subgroups: [
      {
        name: { en: "Rituals & Sacrifices", hi: "यज्ञ, पूजा एवं हविष्य विधान" },
        items: ["puja", "yagya", "homa-havan", "stotra-mantra", "vrata-anushthana"],
      },
    ],
  },
];

export const VEDA_TOPICS = [
  // =================================================================
  // 01. VEDIC KNOWLEDGE - VEDA
  // =================================================================
  {
    id: "rigveda",
    slug: "rigveda",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Veda",
    title: {
      en: "Rigveda",
      hi: "ऋग्वेद",
    },
    sanskritTitle: "ऋग्वेदसंहिता",
    shortDesc: {
      en: "The world's oldest sacred scripture containing 1,028 hymns (Suktas) celebrating cosmic order (Rita) and universal deities.",
      hi: "मानव सभ्यता का प्राचीनतम धर्मग्रंथ, जिसमें १०२८ सूक्त और १०,५८० ऋचाएँ हैं। यह सृष्टि और वैश्विक व्यवस्था (ऋत) का उद्घोष है।",
    },
    badge: "Primordial Shruti",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "एकं सद्विप्रा बहुधा वदन्त्यग्निं यमं मातरिश्वानमाहुः ॥",
      transliteration: "Ekam sad viprā bahudhā vadanty agnim yamam mātariśvānam āhuḥ.",
      meaningEn: "“Truth is One; sages call It by various names — Agni, Yama, Matarishvan.” (Rigveda 1.164.46)",
      meaningHi: "“परमसत्य एक ही है, जिसे ज्ञानी ऋषिगण अग्नि, यम, मातरिश्वा आदि अनेक नामों से पुकारते हैं।” (ऋग्वेद १.१६४.४६)",
    },
    detailedArticle: {
      summary: {
        en: "The Rigveda is the cornerstone of Sanatana Dharma and humanity's oldest preserved literary monument. Composed by illuminated Rishis such as Vashistha, Vishvamitra, and Bharadvaja, it synthesizes cosmological awe, moral order, and sublime hymns dedicated to Agni, Indra, Varuna, and Ushas.",
        hi: "ऋग्वेद सनातन धर्म का आधारस्तम्भ और मानव जाति की प्राचीनतम साहित्यिक धरोहर है। वशिष्ठ, विश्वामित्र, भारद्वाज आदि दृष्टा ऋषियों द्वारा साक्षात्कृत यह ग्रंथ ब्रह्मांडीय रहस्यों, नैतिक नियमों तथा अग्नि, इंद्र, वरुण और उषा की स्तुतियों से सुशोभित है।",
      },
      structure: [
        {
          name: "10 Mandalas (Books)",
          descEn: "Organized into 10 cycles of varying length. Mandalas 2 to 7 are the ancient 'Family Books' credited to specific rishi lineages.",
          descHi: "१० मण्डलों में विभक्त। मण्डल २ से ७ प्राचीन 'वंश मण्डल' हैं जो विशिष्ट ऋषिकुलों से संबंधित हैं।",
        },
        {
          name: "1,028 Suktas (Hymns)",
          descEn: "Containing 10,580 metered poetic stanzas (Riks) composed primarily in Gayatri, Trishtubh, and Jagati meters.",
          descHi: "कुल १०२८ सूक्त तथा १०,५८० ऋचाएं, जो मुख्यतः गायत्री, त्रिष्टुप् एवं जगती छंदों में निबद्ध हैं।",
        },
        {
          name: "Nasadiya Sukta (Hymn of Creation)",
          descEn: "Rigveda 10.129 asks profound metaphysical questions about what existed before creation, time, and space.",
          descHi: "ऋग्वेद का नासदीय सूक्त (१०.१२९) सृष्टि के पूर्व की स्थिति पर संसार का सबसे गूढ़ दार्शनिक चिंतन प्रस्तुत करता है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Rita — The Eternal Cosmic Harmony",
          headingHi: "ऋत — शाश्वत ब्रह्मांडीय व्यवस्था",
          textEn: "Rita governs both cosmic order (the movements of stars and seasons) and moral harmony in human conscience.",
          textHi: "ऋत वह नैसर्गिक नियम है जो तारों, ऋतुओं और मनुष्य के अंतःकरण के धर्म को एकसूत्र में बाँधता है।",
        },
        {
          headingEn: "Universal Oneness",
          headingHi: "सर्वव्यापी एकात्मता",
          textEn: "Behind the array of luminous deities lies the transcendent supreme consciousness (Tad Ekam).",
          textHi: "अनेक देवों की आभा के पीछे एक ही परम तत्व (तदेकम्) विद्यमान है।",
        },
      ],
      modernRelevance: {
        en: "The Rigveda teaches environmental reverence, scientific curiosity about the cosmos, and harmonious dialogue among differing viewpoints without dogma.",
        hi: "ऋग्वेद हमें प्रकृति के प्रति श्रद्धा, ब्रह्मांड के प्रति वैज्ञानिक कौतूहल और बिना किसी कट्टरता के विभिन्न विचारों का आदर करना सिखाता है।",
      },
    },
    tags: ["Shruti", "Veda", "Sukta", "Gayatri", "Nasadiya"],
  },

  {
    id: "yajurveda",
    slug: "yajurveda",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Veda",
    title: {
      en: "Yajurveda",
      hi: "यजुर्वेद",
    },
    sanskritTitle: "यजुर्वेदसंहिता",
    shortDesc: {
      en: "The manual of sacred rituals, sacrificial prose formulas (Yajus), and the inner psychology of self-surrender through action.",
      hi: "यज्ञीय कर्मकांड, गद्यात्मक मंत्रों (यजुष) तथा कर्म के माध्यम से आत्म-समर्पण की विद्या का दिव्य संकलन।",
    },
    badge: "Ritual Action & Wisdom",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "ईशा वास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥",
      transliteration: "Īśā vāsyam idaṁ sarvaṁ yat kiñca jagatyāṁ jagat, Tena tyaktena bhuñjīthā mā gṛdhaḥ kasya sviddhanam.",
      meaningEn: "“All this is enveloped by the Divine. Enjoy through renunciation; do not covet anyone’s wealth.” (Shukla Yajurveda 40.1 / Isha Upanishad)",
      meaningHi: "“समस्त ब्रह्मांड ईश्वर से व्याप्त है। त्यागपूर्वक उपभोग करो, किसी के धन का लोभ मत करो।” (शुक्ल यजुर्वेद ४०.१ / ईशावास्योपनिषद्)",
    },
    detailedArticle: {
      summary: {
        en: "The Yajurveda bridges sacred thought with tangible action. It provided the Adhvaryu priest with the exact cadence, mantras, and altar dimensions for Vedic sacrifices like Agnihotra, Darshapurnamasa, and Ashvamedha. It exists in two major branches: Shukla (pure mantras) and Krishna (mantras intermingled with prose commentary).",
        hi: "यजुर्वेद विचार और कर्म के मध्य का सेतु है। यह अध्वर्यु पुरोहित को अग्निहोत्र, दर्शपूर्णमास आदि यज्ञों के लिए यथाविधि मंत्र और वेदी निर्माण की प्रक्रिया सिखाता है। इसकी दो मुख्य शाखाएं हैं — शुक्ल यजुर्वेद (वाजसनेयि) एवं कृष्ण यजुर्वेद (तैत्तिरीय)।",
      },
      structure: [
        {
          name: "Shukla Yajurveda (White Yajurveda)",
          descEn: "Preserved in Madhyandina and Kanva recensions; culminates in the famous Isha Upanishad (Chapter 40).",
          descHi: "माध्यन्दिन और काण्व शाखा में उपलब्ध, जिसका ४०वां अध्याय प्रसिद्ध ईशावास्योपनिषद् है।",
        },
        {
          name: "Krishna Yajurveda (Black Yajurveda)",
          descEn: "Preserved in Taittiriya, Maitrayani, Katha, and Kapisthala recensions; rich in theological narrative.",
          descHi: "तैत्तिरीय, मैत्रायणी, कठ और कपिष्ठल शाखाओं में सुरक्षित; इसमें मंत्र और व्याख्या साथ-साथ हैं।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Yajna as Selfless Service",
          headingHi: "यज्ञ भावना — निःस्वार्थ कर्म",
          textEn: "Every action done with surrender to the greater good transforms mundane work into a sacred offering.",
          textHi: "लोककल्याण की भावना से किया गया प्रत्येक कर्म यज्ञ बन जाता है।",
        },
      ],
      modernRelevance: {
        en: "Teaches mindful focus, ecological reciprocity (taking from nature while replenishing it), and ethical stewardship of resources.",
        hi: "यह हमें कार्य में सजगता, प्रकृति के साथ संतुलन और संसाधनों का नैतिक उपयोग सिखाता है।",
      },
    },
    tags: ["Yajus", "Yajna", "Isha Upanishad", "Shukla", "Krishna"],
  },

  {
    id: "samaveda",
    slug: "samaveda",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Veda",
    title: {
      en: "Samaveda",
      hi: "सामवेद",
    },
    sanskritTitle: "सामवेदसंहिता",
    shortDesc: {
      en: "The Veda of divine melody, sacred music, and emotional elevation, forming the origin of Indian classical music (Sangeeta).",
      hi: "दैवीय संगीत, स्वर साधना और भक्ति-गीतों का वेद, जिसे भारतीय शास्त्रीय संगीत की मूल जननी माना जाता है।",
    },
    badge: "Celestial Music",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "वेदानां सामवेदोऽस्मि देवानामस्मि वासवः ॥",
      transliteration: "Vedānāṁ sāmavedo'smi devānām asmi vāsavaḥ.",
      meaningEn: "“Among the Vedas, I am the Samaveda; among gods, I am Indra.” — Bhagavad Gita 10.22",
      meaningHi: "“वेदों में मैं सामवेद हूँ, और देवताओं में मैं इंद्र हूँ।” — भगवद्गीता १०.२२",
    },
    detailedArticle: {
      summary: {
        en: "The Samaveda is the poetic soul of the Vedas. While mostly drawing verses from the Rigveda, it transfigures them into musical notations (Saman) chanted by the Udgatri priest. It illustrates the power of sacred sound (Nada Brahma) to still the mind and dissolve mental friction.",
        hi: "सामवेद वेदों का संगीतात्मक हृदय है। इसके अधिकांश मंत्र ऋग्वेद से लिए गए हैं, परंतु उन्हें उद्गाता ऋषियों द्वारा विशिष्ट स्वर-तालों (साम) में रूपांतरित किया गया है। यह नादब्रह्म की शक्ति से चित्त को शांत करने का मार्ग है।",
      },
      structure: [
        {
          name: "Archika & Gana",
          descEn: "Divided into Purvarchika (verses) and Uttararchika, accompanied by Gana songbooks that dictate melodious chant patterns.",
          descHi: "पूर्वार्चिक और उत्तरार्चिक दो मुख्य भाग हैं, साथ ही गान-ग्रंथ जो स्वर और लय को निर्दिष्ट करते हैं।",
        },
        {
          name: "Chandogya Upanishad",
          descEn: "One of the oldest and deepest Upanishads, containing the Mahavakya 'Tat Tvam Asi' (Thou Art That).",
          descHi: "प्रसिद्ध छान्दोग्य उपनिषद् इसी वेद से संबद्ध है, जिसमें 'तत्त्वमसि' महावाक्य आता है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Nada Brahma — Sound as Divinity",
          headingHi: "नादब्रह्म — दिव्य ध्वनि",
          textEn: "Sacred acoustic frequencies harmonize the nervous system and connect human consciousness to cosmic rhythms.",
          textHi: "पवित्र ध्वनियों की आवृत्ति मन और नाड़ियों को शांत कर चेतना को ब्रह्मांडीय लय से जोड़ती है।",
        },
      ],
      modernRelevance: {
        en: "Forms the foundational root for sound therapy, mantra meditation, classical ragas, and psychological relaxation.",
        hi: "ध्वनि-चिकित्सा, मंत्र-ध्यान, शास्त्रीय संगीत और मानसिक तनाव मुक्ति का आधार।",
      },
    },
    tags: ["Music", "Saman", "Chandogya", "Udgatri", "Nada"],
  },

  {
    id: "atharvaveda",
    slug: "atharvaveda",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Veda",
    title: {
      en: "Atharvaveda",
      hi: "अथर्ववेद",
    },
    sanskritTitle: "अथर्ववेदसंहिता",
    shortDesc: {
      en: "The Veda of practical daily life, botanical medicine (Ayurveda), domestic harmony, statecraft, and spiritual protection.",
      hi: "दैनिक जीवन, आयुर्वेद, जड़ी-बूटी, पारिवारिक सौहार्द, राष्ट्र-संरक्षण और व्यावहारिक कल्याण का पावन वेद।",
    },
    badge: "Holistic Science & Living",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "माता भूमिः पुत्रो अहं पृथिव्याः ॥",
      transliteration: "Mātā bhūmiḥ putro ahaṁ pṛthivyāḥ.",
      meaningEn: "“Earth is my mother, and I am her child.” — Atharvaveda (Bhumi Sukta 12.1.12)",
      meaningHi: "“यह पृथ्वी मेरी माता है और मैं इसका पुत्र हूँ।” — अथर्ववेद (भूमि सूक्त १२.१.१२)",
    },
    detailedArticle: {
      summary: {
        en: "Attributed to Rishis Atharvan and Angiras, the Atharvaveda speaks directly to everyday human life. It covers healing herbs, surgical treatments, longevity (Ayushya), householder welfare, environmental ethics, and protection against negative energies. The revered Ayurveda is considered an Upaveda of Atharvaveda.",
        hi: "महर्षि अथर्वा एवं अंगिरा द्वारा दृष्ट अथर्ववेद मानव के लौकिक व पारलौकिक जीवन से सीधा संवाद करता है। इसमें वनौषधि, रोग-निवारण, वास्तु, राष्ट्र-रक्षा और शांति कर्म का सविस्तार वर्णन है। आयुर्वेद को इसी का उपवेद माना जाता है।",
      },
      structure: [
        {
          name: "Shaunaka & Paippalada Branches",
          descEn: "Comprises 20 Kandas, 730 Suktas, and almost 6,000 mantras in poetic and prose formats.",
          descHi: "२० काण्ड, ७३० सूक्त और लगभग ६,००० मंत्र शौनक एवं पैप्पलाद शाखाओं में सुरक्षित हैं।",
        },
        {
          name: "Bhumi Sukta (Prithvi Sukta)",
          descEn: "A 63-verse ecological masterpiece venerating Mother Earth and bio-diversity.",
          descHi: "६३ ऋचाओं का पृथ्वी सूक्त पर्यावरण संरक्षण का विश्व का सर्वप्रथम व सबसे सुंदर घोषणापत्र है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Integrative Health and Wellness",
          headingHi: "समग्र स्वास्थ्य एवं पर्यावरण चेतना",
          textEn: "Physical health, mental equilibrium, and ecological sanctity must flourish together.",
          textHi: "शारीरिक स्वास्थ्य, मानसिक शांति और पर्यावरण की शुद्धि एक-दूसरे पर निर्भर हैं।",
        },
      ],
      modernRelevance: {
        en: "Pioneers ecological sustainability, herbal wellness, conflict resolution, and stress-free communal living.",
        hi: "पर्यावरण संरक्षण, प्राकृतिक चिकित्सा, मानसिक शांति और पारिवारिक सौहार्द के लिए अत्यंत प्रासंगिक।",
      },
    },
    tags: ["Ayurveda", "Bhumi Sukta", "Healing", "Shaunaka", "Wellbeing"],
  },

  // =================================================================
  // 01. VEDIC KNOWLEDGE - VEDANGA (6 Limbs)
  // =================================================================
  {
    id: "shiksha",
    slug: "shiksha",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Shiksha",
      hi: "शिक्षा (ध्वनिविज्ञान)",
    },
    sanskritTitle: "शिक्षा वेदाङ्ग",
    shortDesc: {
      en: "The Vedic science of phonetics, correct articulation, intonation (Svara), and the resonant power of spoken Sanskrit.",
      hi: "वैदिक ध्वनिविज्ञान, शुद्ध उच्चारण, वर्णमाला का विज्ञान एवं उदात्त-अनुदात्त-स्वरित स्वरों की नियम-संहिता।",
    },
    badge: "Phonetics & Pronunciation",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "मन्त्रो हीनः स्वरतो वर्णतो वा मिथ्याप्रयुक्तो न तमर्थमाह ।",
      transliteration: "Mantro hīnaḥ svarato varṇato vā mithyā-prayukto na tam-artham-āha.",
      meaningEn: "“A mantra devoid of correct pitch or phonetic clarity loses its intended meaning and potency.” — Paniniya Shiksha",
      meaningHi: "“स्वर अथवा वर्ण से हीन मिथ्या प्रयुक्त मंत्र अपने अभीष्ट अर्थ और सामर्थ्य को प्रकट नहीं करता।” — पाणिनीय शिक्षा",
    },
    detailedArticle: {
      summary: {
        en: "Shiksha is likened to the 'nose/breath' of the Veda-Purusha. It codifies the precise vocal tract mechanics required to chant mantras with mathematical purity, preserving the oral tradition untouched for millennia.",
        hi: "शिक्षा को वेद-पुरुष की 'नासिका' कहा गया है। यह कंठ, तालु, मूर्धा, दन्त और ओष्ठ से निकलने वाले वर्णों के शुद्ध उच्चारण की वैज्ञानिक विधि प्रस्तुत करता है।",
      },
      structure: [
        {
          name: "Six Phonetic Elements",
          descEn: "Varna (sound), Svara (pitch/accent), Matra (duration), Balam (strength of effort), Sama (smoothness), Santana (continuity).",
          descHi: "वर्ण, स्वर, मात्रा, बल, साम और सन्तान — ये शिक्षा के छह प्रमुख अंग हैं।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Acoustic Integrity",
          headingHi: "ध्वनि की शुद्धता",
          textEn: "Sanskrit roots vibrate with neurological and psychological significance when resonated accurately.",
          textHi: "शुद्ध उच्चारण से उत्पन्न कंपनों का मस्तिष्क और नाड़ीतंत्र पर गहरा प्रभाव पड़ता है।",
        },
      ],
      modernRelevance: {
        en: "Invaluable for vocal projection, speech therapy, neuro-linguistic studies, and mantra chanting.",
        hi: "वाणी सुधार, स्वर-साधना, ध्यान और ध्वनि-विज्ञान के लिए अत्यंत उपयोगी।",
      },
    },
    tags: ["Vedanga", "Phonetics", "Svara", "Mantra", "Pronunciation"],
  },

  {
    id: "vyakarana",
    slug: "vyakarana",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Vyakarana",
      hi: "व्याकरण (भाषा विज्ञान)",
    },
    sanskritTitle: "व्याकरण वेदाङ्ग",
    shortDesc: {
      en: "The structural linguistic science of grammar, famously codified in Panini's Ashtadhyayi, hailed as a masterpiece of computational logic.",
      hi: "भाषा की संरचना और शब्द-सिद्धि का विज्ञान। महर्षि पाणिनि की अष्टाध्यायी को विश्व का प्रथम औपचारिक व्याकरण माना जाता है।",
    },
    badge: "Grammar & Linguistics",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "मुखं व्याकरणं स्मृतम् ।",
      transliteration: "Mukhaṁ vyākaraṇaṁ smṛtam.",
      meaningEn: "“Grammar is spoken of as the very mouth of the Veda.”",
      meaningHi: "“व्याकरण को वेद-पुरुष का साक्षात् मुख कहा गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "Vyakarana breaks words down into their fundamental roots (Dhatus) and affixes (Pratyayas). Panini's generative framework of ~4,000 sutras operates like a rigorous algorithmic programming language that produces every valid Sanskrit sentence.",
        hi: "व्याकरण शब्दों की प्रकृति और प्रत्यय का विश्लेषण करता है। महर्षि पाणिनि के लगभग ४,००० सूत्र किसी कंप्यूटर एल्गोरिदम की भाँति शुद्ध संस्कृत वाक्यों का निर्माण करते हैं।",
      },
      structure: [
        {
          name: "Panini's Ashtadhyayi",
          descEn: "8 chapters analyzing Shiva Sutras, noun declensions, verbal conjugations, and morpho-phonemics.",
          descHi: "८ अध्यायों में निबद्ध सूत्र जो माहेश्वर सूत्रों पर आधारित हैं।",
        },
        {
          name: "Mahabhashya by Patanjali",
          descEn: "The monumental critical commentary clarifying grammar's role in philosophy and culture.",
          descHi: "महर्षि पतंजलि द्वारा रचित व्याकरण का महाभाष्य।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Mathematical Precision in Language",
          headingHi: "भाषा में गणितीय शुद्धता",
          textEn: "Eliminates ambiguity through modular, reusable rules and context-sensitive operators.",
          textHi: "संक्षिप्त और अचूक नियमों द्वारा भाषा को अस्पष्टता से मुक्त रखना।",
        },
      ],
      modernRelevance: {
        en: "Recognized worldwide in Natural Language Processing (NLP) and computer science as the earliest precursor to context-free grammar.",
        hi: "कंप्यूटर विज्ञान, कोडिंग और प्राकृतिक भाषा प्रसंस्करण (NLP) में अत्यंत सम्मानित।",
      },
    },
    tags: ["Panini", "Ashtadhyayi", "Grammar", "Sanskrit", "Linguistics"],
  },

  {
    id: "chandas",
    slug: "chandas",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Chandas",
      hi: "छन्द (काव्य-माप एवं लय)",
    },
    sanskritTitle: "छन्दःशास्त्र वेदाङ्ग",
    shortDesc: {
      en: "Vedic poetic meter and rhythm, balancing long and short syllables to govern breath control and poetic harmony.",
      hi: "वैदिक छंद-शास्त्र, जिसमें अक्षरों की लघु-गुरु मात्रा और लयबद्धता का अनुशासन होता है। इसे वेद-पुरुष के 'पैर' माना गया है।",
    },
    badge: "Poetic Meter & Rhythm",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "छन्दः पादौ तु वेदस्य ।",
      transliteration: "Chandaḥ pādau tu vedasya.",
      meaningEn: "“Chandas constitutes the steady feet of the Veda.”",
      meaningHi: "“छंद को वेद-पुरुष के चरण कहा गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "Chandas regulates the number of syllables in each quarter (Pada) of a verse. Pingala's Chandas Shastra introduces binary arithmetic, combinations, and the Fibonacci sequence centuries before modern mathematics.",
        hi: "छंद प्रत्येक चरण में अक्षरों और मात्राओं की संख्या को नियंत्रित करता है। आचार्य पिंगल के छंदःशास्त्र में द्वि-आधारी (बाइनरी) गणित और संयोजनों के आरंभिक बीज मिलते हैं।",
      },
      structure: [
        {
          name: "Seven Sacred Vedic Meters",
          descEn: "Gayatri (24 syllables), Ushnik (28), Anushtubh (32), Brihati (36), Pankti (40), Trishtubh (44), Jagati (48).",
          descHi: "गायत्री (२४), उष्णिक् (२८), अनुष्टुप् (३२), बृहती (३६), पंक्ति (४०), त्रिष्टुप् (४४), जगती (४८)।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Pranic Rhythm",
          headingHi: "प्राण और श्वास की लय",
          textEn: "Chanting in precise meters stabilizes breathing patterns and induces deep meditative calm.",
          textHi: "छंदोबद्ध गायन से श्वास-प्रश्वास संतुलित होता है और चित्त ध्यानमग्न होता है।",
        },
      ],
      modernRelevance: {
        en: "Connects to musicology, mathematical combinatorics, poetry, and breath-centered mindfulness.",
        hi: "काव्य-रचना, संगीत और श्वास-आधारित ध्यान में उपयोगी।",
      },
    },
    tags: ["Meter", "Gayatri", "Pingala", "Rhythm", "Poetry"],
  },

  {
    id: "nirukta",
    slug: "nirukta",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Nirukta",
      hi: "निरुक्त (व्युत्पत्ति विज्ञान)",
    },
    sanskritTitle: "निरुक्त वेदाङ्ग",
    shortDesc: {
      en: "The Vedic science of etymology, word origin, and semantic deconstruction authored by Rishi Yaska.",
      hi: "वैदिक शब्दों का व्युत्पत्ति-शास्त्र और शब्दार्थ-विज्ञान, जिसकी रचना महर्षि यास्क ने की थी। इसे वेद-पुरुष के 'कान' कहा गया है।",
    },
    badge: "Etymology & Semantics",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "श्रोत्रं निरुक्तमुच्यते ।",
      transliteration: "Śrotraṁ niruktam ucyate.",
      meaningEn: "“Nirukta is revered as the very ears of the Veda.”",
      meaningHi: "“निरुक्त को वेद-पुरुष के कर्ण कहा गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "Nirukta decodes rare and archaic Vedic terminology by tracing words back to root actions. Rishi Yaska emphasizes that all nouns are derived from verbal roots (Dhatus), revealing that words are not arbitrary labels but descriptions of dynamic functions.",
        hi: "निरुक्त वेदों के कठिन और गूढ़ शब्दों के मूल अर्थ को स्पष्ट करता है। महर्षि यास्क का सिद्धांत है कि सभी नाम धातुओं (क्रियाओं) से उत्पन्न हुए हैं, अतः प्रत्येक शब्द अपने कार्य का परिचायक है।",
      },
      structure: [
        {
          name: "Nighantu and Commentary",
          descEn: "Yaska's commentary on the ancient glossary (Nighantu) classified into synonymous, polysemous, and divine names.",
          descHi: "निघण्टु के शब्दों पर यास्क का भाष्य — नैघण्टुक, नैगम और दैवत काण्ड।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Semantic Truth",
          headingHi: "अर्थ की गहराई",
          textEn: "Understanding a word's inner root unlocks its spiritual, psychological, and cosmic dimensions.",
          textHi: "शब्द की जड़ तक पहुंचकर उसके आध्यात्मिक और गूढ़ अर्थ को समझना।",
        },
      ],
      modernRelevance: {
        en: "Crucial for philology, hermeneutics, semantic web technologies, and cross-linguistic translations.",
        hi: "भाषा-विज्ञान, शब्दों के इतिहास और शुद्ध अर्थ के अध्ययन में अनिवार्य।",
      },
    },
    tags: ["Yaska", "Etymology", "Nighantu", "Semantics", "Roots"],
  },

  {
    id: "jyotisha",
    slug: "jyotisha",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Jyotisha",
      hi: "ज्योतिष (खगोल व काल-विधान)",
    },
    sanskritTitle: "ज्योतिष वेदाङ्ग",
    shortDesc: {
      en: "The Vedic science of astronomy and cosmic time-keeping (Kala Vidya) to determine auspicious celestial alignments for rituals.",
      hi: "वैदिक काल-गणना और खगोलशास्त्र का विज्ञान। इसे वेद-पुरुष के 'नेत्र' माना गया है, जो काल की गति को आलोकित करता है।",
    },
    badge: "Astronomy & Cosmic Time",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "ज्योतिषामयनं चक्षुः ।",
      transliteration: "Jyotiṣām ayanaṁ cakṣuḥ.",
      meaningEn: "“Jyotisha is the luminous eye of the Veda.”",
      meaningHi: "“ज्योतिष को वेद-पुरुष के दिव्य नेत्र कहा गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "Vedanga Jyotisha, attributed to Sage Lagadha, tracked lunar mansions (Nakshatras), solstices (Ayana), seasons (Ritu), and eclipses. It evolved into the threefold branches: Siddhanta (astronomy), Samhita (collective mundane omens), and Hora (natal horoscopy).",
        hi: "वेदांग ज्योतिष के प्रणेता महर्षि लगध हैं। इसमें २७ नक्षत्रों, अयनों, ऋतुओं और सूर्य-चंद्रमा की गति का सूक्ष्म गणितीय अध्ययन किया गया है ताकि यज्ञों के लिए उपयुक्त काल का निर्धारण हो सके।",
      },
      structure: [
        {
          name: "Siddhanta (Astronomy)",
          descEn: "Mathematical calculations of planetary orbits, eclipses, and cosmic cycles (Yugas).",
          descHi: "ग्रहों की गति, ग्रहण और युग-चक्रों की शुद्ध गणितीय गणना।",
        },
        {
          name: "Hora & Samhita",
          descEn: "Analysis of human life cycles, seasonal shifts, and societal transitions.",
          descHi: "मानव जीवन, ऋतु-परिवर्तन और प्राकृतिक घटनाओं का फलादेश।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Cosmic Synchronization",
          headingHi: "ब्रह्मांडीय तालमेल",
          textEn: "Human life resonates with macrocosmic celestial rhythms; harmonizing with them fosters auspicious outcomes.",
          textHi: "पिंड और ब्रह्मांड की लय का समन्वय ही शुभता और सफलता का कारक है।",
        },
      ],
      modernRelevance: {
        en: "Informs Hindu calendar (Panchanga) calculations, cultural festival dates, astrology consultations, and celestial observational sciences.",
        hi: "पंचांग निर्माण, पर्व-त्योहारों के निर्धारण और वैदिक ज्योतिष मार्गदर्शन का मूल आधार।",
      },
    },
    tags: ["Astronomy", "Nakshatras", "Panchanga", "Kala", "Lagadha"],
  },

  {
    id: "kalpa",
    slug: "kalpa",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Vedanga",
    title: {
      en: "Kalpa",
      hi: "कल्प (अनुष्ठान एवं विधि)",
    },
    sanskritTitle: "कल्पसूत्र वेदाङ्ग",
    shortDesc: {
      en: "The codified manual of ritual procedures, domestic rites, social ethics, and sacred geometry (Shulba Sutras).",
      hi: "यज्ञ-विधि, गृहस्थ संस्कारों, सामाजिक नियमों और वेदी-निर्माण के रेखागणित (शुल्ब सूत्र) का विस्तृत विधान। इसे वेद के 'हाथ' कहा गया है।",
    },
    badge: "Ritual Action & Sacred Geometry",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "हस्तौ कल्पोऽथ पठ्यते ।",
      transliteration: "Hastau kalpo'tha paṭhyate.",
      meaningEn: "“Kalpa represents the acting hands of the Veda.”",
      meaningHi: "“कल्प को वेद-पुरुष के क्रियाशील हाथ कहा गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "Kalpa translates abstract Vedic vision into tangible physical reality. It encompasses four major sub-disciplines: Shrauta Sutras (public Vedic rituals), Grihya Sutras (domestic life-cycle rites), Dharma Sutras (laws and social duties), and Shulba Sutras (the sacred geometry foundational to early Indian mathematics and Pythagorean principles).",
        hi: "कल्प वेदों के ज्ञान को कर्म में परिणत करता है। इसके अंतर्गत श्रौतसूत्र (महायज्ञ), गृह्यसूत्र (गृहस्थ संस्कार), धर्मसूत्र (सामाजिक कर्तव्य) और शुल्बसूत्र (वेदी निर्माण का ज्यामितीय विज्ञान) आते हैं।",
      },
      structure: [
        {
          name: "Shulba Sutras (Sacred Geometry)",
          descEn: "Baudhayana and Apastamba Shulba Sutras contained exact geometric formulas, square-circle conversions, and proofs of the right-angle triangle.",
          descHi: "बौधायन व आपस्तम्ब शुल्ब सूत्र, जिनमें समकोण त्रिभुज (पायथागोरस प्रमेय) और ज्यामितीय वेदियों का प्राचीन ज्ञान है।",
        },
        {
          name: "Grihya & Dharma Sutras",
          descEn: "Guides for marriages, house warming, child-rearing, and ethical jurisprudence.",
          descHi: "विवाह, गृहप्रवेश, संस्कार और न्याय व्यवस्था के नियम।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Precision in Action",
          headingHi: "कर्म में सूक्ष्म अनुशासन",
          textEn: "Sacred ceremonies require meticulous environmental setup, geometry, and intentionality.",
          textHi: "यज्ञ और कर्म में स्थान, दिशा और मन की शुद्धि का परम महत्व है।",
        },
      ],
      modernRelevance: {
        en: "Forms the historical foundation of Indian architecture (Vastu Shastra), geometry, civil law, and ritual choreography.",
        hi: "वास्तुशास्त्र, प्राचीन रेखागणित और हिंदू विधि-व्यवस्था की जड़ें यहीं हैं।",
      },
    },
    tags: ["Shulba Sutras", "Geometry", "Ritual", "Grihya", "Baudhayana"],
  },

  // =================================================================
  // 01. VEDIC KNOWLEDGE - BRAHMANA, ARANYAKA, UPANISHAD, SUTRA
  // =================================================================
  {
    id: "brahmana",
    slug: "brahmana",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Explanatory",
    title: {
      en: "Brahmana",
      hi: "ब्राह्मण ग्रंथ",
    },
    sanskritTitle: "ब्राह्मणभाग",
    shortDesc: {
      en: "Prose commentaries explaining the symbolic, liturgical, and mythological meaning of the Vedic Samhitas.",
      hi: "वेदों के मंत्रों का गद्यात्मक भाष्य, यज्ञों के प्रतीकात्मक अर्थ, उत्पत्ति की कथाएँ और कर्मकाण्ड का गूढ़ मर्म।",
    },
    badge: "Symbolic Liturgy",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "यज्ञो वै श्रेष्ठतमं कर्म ।",
      transliteration: "Yajño vai śreṣṭhatamaṁ karma.",
      meaningEn: "“Sacrificial self-offering is indeed the most sublime action.” — Shatapatha Brahmana 1.7.1.5",
      meaningHi: "“यज्ञ निःसंदेह संसार का सर्वश्रेष्ठ और उत्कृष्टतम कर्म है।” — शतपथ ब्राह्मण १.७.१.५",
    },
    detailedArticle: {
      summary: {
        en: "The Brahmanas decode the internal esoteric meaning behind external rites. The monumental Shatapatha Brahmana of the Shukla Yajurveda, attributed to Sage Yajnavalkya, is a masterwork explaining the universe as a continuous cosmic sacrifice.",
        hi: "ब्राह्मण ग्रंथ बाह्य कर्मकांड के पीछे छिपे आंतरिक आध्यात्मिक अर्थ को उजागर करते हैं। महर्षि याज्ञवल्क्य का शतपथ ब्राह्मण इस श्रेणी का सबसे विशाल और महत्त्वपूर्ण ग्रंथ है।",
      },
      structure: [
        {
          name: "Major Brahmana Texts",
          descEn: "Aitareya and Kaushitaki (Rigveda); Shatapatha and Taittiriya (Yajurveda); Jaiminiya and Tandya (Samaveda); Gopatha (Atharvaveda).",
          descHi: "ऐतरेय, शतपथ, तैत्तिरीय, ताण्ड्य एवं गोपथ ब्राह्मण।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Cosmic Correspondence (Bandhuta)",
          headingHi: "आध्यात्मिक एवं ब्रह्मांडीय समानता",
          textEn: "The microcosm within humanity matches the macrocosm of the stars and nature.",
          textHi: "मनुष्य के भीतर का सूक्ष्म जगत बाह्य ब्रह्मांड के साथ पूर्णतः संबद्ध है।",
        },
      ],
      modernRelevance: {
        en: "Provides profound psychological insight into symbols, archetypes, and cultural rituals.",
        hi: "प्रतीकों, मिथकों और सनातन अनुष्ठानों के मनोवैज्ञानिक विश्लेषण में सहायक।",
      },
    },
    tags: ["Shatapatha", "Aitareya", "Liturgy", "Sacrifice", "Yajnavalkya"],
  },

  {
    id: "aranyaka",
    slug: "aranyaka",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Explanatory",
    title: {
      en: "Aranyaka",
      hi: "आरण्यक ग्रंथ",
    },
    sanskritTitle: "आरण्यक",
    shortDesc: {
      en: "Forest treatises bridging active external rituals with interiorized mental contemplation and silent meditation.",
      hi: "वानप्रस्थ आश्रम में वन में अध्ययन किए जाने वाले ग्रंथ, जो बाह्य कर्मकांड से आंतरिक ध्यान की ओर ले जाते हैं।",
    },
    badge: "Forest Meditations",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "आत्मनस्तु कामाय सर्वं प्रियं भवति ।",
      transliteration: "Ātmanas tu kāmāya sarvaṁ priyaṁ bhavati.",
      meaningEn: "“All things are dear not for their own sake, but for the sake of the Divine Self within.” — Brihadaranyaka",
      meaningHi: "“संसार की वस्तुएं अपने लिए नहीं, अपितु अंतरात्मा के कारण ही प्रिय लगती हैं।” — बृहदारण्यक",
    },
    detailedArticle: {
      summary: {
        en: "Composed for seekers who had retired to the stillness of the forests (Aranya), the Aranyakas shift the focus from physical sacrificial fires to the 'inner fire' (Antar-Yajna) burning within human consciousness.",
        hi: "आरण्यक उन साधकों के लिए हैं जिन्होंने वन के एकांत में ध्यान का आश्रय लिया। ये बाह्य अग्निहोत्र को 'आंतरिक प्राण-यज्ञ' में परिवर्तित करने की प्रेरणा देते हैं।",
      },
      structure: [
        {
          name: "Transition to Upanishads",
          descEn: "Contains meditative allegories that naturally graduate into the lofty philosophy of the Upanishads.",
          descHi: "यह ब्राह्मण ग्रंथों के कर्मकांड और उपनिषदों के ज्ञानकांड के बीच का सेतु है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Interiorization of Ritual",
          headingHi: "कर्म का अंतर्मुखीकरण",
          textEn: "Breath, intellect, and pure awareness are the sacred altars of higher contemplation.",
          textHi: "प्राण, बुद्धि और विशुद्ध चेतना ही सर्वोच्च यज्ञ-वेदियां हैं।",
        },
      ],
      modernRelevance: {
        en: "Inspires solitude, digital detox, forest bathing, and reflective contemplation away from city noise.",
        hi: "प्रकृति के सानिध्य में मौन, आत्म-चिंतन और मानसिक शांति की प्रेरणा देता है।",
      },
    },
    tags: ["Forest", "Meditation", "Antar-Yajna", "Brihadaranyaka", "Solitude"],
  },

  {
    id: "upanishad",
    slug: "upanishad",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Explanatory",
    title: {
      en: "Upanishad",
      hi: "उपनिषद (वेदांत सार)",
    },
    sanskritTitle: "उपनिषद् (वेदान्त)",
    shortDesc: {
      en: "The philosophical pinnacle of Vedic thought expounding the ultimate non-dual unity between the individual Soul (Atman) and Brahman.",
      hi: "वैदिक वांग्मय का सर्वोच्च शिखर, जहाँ आत्मा और परब्रह्म की एकात्मता, मोक्ष और आत्मज्ञान का अमृत बरसता है।",
    },
    badge: "Crown of Wisdom",
    readTime: "9 min read",
    keyVerse: {
      sanskrit: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥",
      transliteration: "Asato mā sad gamaya, Tamaso mā jyotir gamaya, Mṛtyor māmṛtaṁ gamaya.",
      meaningEn: "“Lead me from the unreal to the Real; lead me from darkness to Light; lead me from death to Immortality.” — Brihadaranyaka 1.3.28",
      meaningHi: "“मुझे असत्य से सत्य की ओर ले चलो; मुझे अंधकार से प्रकाश की ओर ले चलो; मुझे मृत्यु से अमरता की ओर ले चलो।” — बृहदारण्यक १.३.२८",
    },
    detailedArticle: {
      summary: {
        en: "The word Upanishad signifies 'sitting down near an illumined teacher to receive secret truth'. While the tradition counts 108 Upanishads (Muktika canon), Adi Shankaracharya commented on the 10-11 Principal (Mukhya) Upanishads: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka.",
        hi: "उपनिषद् का अर्थ है — सद्गुरु के चरणों के समीप बैठकर आत्मविद्या का रहस्य ग्रहण करना। मुक्तिकोपनिषद् में १०८ उपनिषदों की गणना है, जिनमें से १०-११ मुख्य उपनिषदों पर आदि शंकराचार्य ने भाष्य लिखा।",
      },
      structure: [
        {
          name: "The 4 Great Mahavakyas",
          descEn: "1. Prajnanam Brahma (Consciousness is Brahman - Rigveda) 2. Ayam Atma Brahma (This Self is Brahman - Atharvaveda) 3. Tat Tvam Asi (Thou Art That - Samaveda) 4. Aham Brahmasmi (I am Brahman - Yajurveda).",
          descHi: "चार महावाक्य: प्रज्ञानं ब्रह्म, अयमात्मा ब्रह्म, तत्त्वमसि, अहं ब्रह्मास्मि।",
        },
        {
          name: "Katha Upanishad",
          descEn: "The immortal dialogue between young seeker Nachiketa and Yama, Lord of Death, on what survives beyond mortality.",
          descHi: "नचिकेता और यमराज का अमर संवाद, जिसमें आत्मा की अमरता का रहस्य उजागर होता है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Self-Realization (Atma-Jnana)",
          headingHi: "आत्म-साक्षात्कार",
          textEn: "You are not merely the fleeting body or restless mind, but the eternal, unchanging witness consciousness.",
          textHi: "आप केवल नाशवान शरीर या चंचल मन नहीं, अपितु नित्य, शुद्ध, बुद्ध साक्षी चैतन्य हैं।",
        },
      ],
      modernRelevance: {
        en: "Addresses the modern existential crisis of identity, anxiety, and purpose through universal non-dual awareness.",
        hi: "तनाव, भय, पहचान के संकट और मानसिक अशांति का स्थायी समाधान प्रस्तुत करता है।",
      },
    },
    tags: ["Vedanta", "Atman", "Brahman", "Nachiketa", "Mahavakya"],
  },

  {
    id: "sutra",
    slug: "sutra",
    categorySlug: "vedic-knowledge",
    categoryNumber: "01",
    group: "Explanatory",
    title: {
      en: "Sutra",
      hi: "सूत्र वांग्मय",
    },
    sanskritTitle: "सूत्रग्रंथ",
    shortDesc: {
      en: "Ultra-condensed, mathematically precise aphorisms that distill vast oceans of philosophical and ritual teachings into memorable formulas.",
      hi: "गागर में सागर भरने वाले अत्यंत संक्षिप्त, अर्थपूर्ण और निर्दोष सूत्र, जो ज्ञान को स्मृति में संजोने की श्रेष्ठ विधा हैं।",
    },
    badge: "Condensed Aphorisms",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "अल्पाक्षरमसंदिग्धं सारवद्विश्वतोमुखम् । अस्तोभमनवद्यं च सूत्रं सूत्रविदो विदुः ॥",
      transliteration: "Alpākṣaram asaṁdigdhaṁ sāravad viśvatomukham, Astobham anavadyaṁ ca sūtraṁ sūtravido viduḥ.",
      meaningEn: "“A sutra is that which uses minimal syllables, is free from doubt, contains the core essence, has universal applicability, and is unassailable.”",
      meaningHi: "“जो कम अक्षरों वाला, संशयहीन, सारयुक्त, सर्वतोमुखी और निर्दोष हो — ज्ञानी उसे सूत्र कहते हैं।”",
    },
    detailedArticle: {
      summary: {
        en: "The Sutra literature emerged to facilitate oral memorization before writing was widespread. Every major branch of Indian learning — from grammar and philosophy (Brahma Sutras, Yoga Sutras) to law and mathematics — was organized into these compact mnemonic keys.",
        hi: "सूत्र साहित्य का प्रादुर्भाव इसलिए हुआ ताकि ज्ञान की विशाल राशियों को कंठस्थ रखा जा सके। व्याकरण, षड्दर्शन (ब्रह्मसूत्र, योगसूत्र) से लेकर गणित और विधि-शास्त्र सब सूत्रों में संजोए गए।",
      },
      structure: [
        {
          name: "Brahma Sutras of Badarayana",
          descEn: "555 aphorisms systematizing the philosophy of the Upanishads into an unbreakable logical sequence.",
          descHi: "बादरायण के ५५५ ब्रह्मसूत्र, जो उपनिषदों के समस्त दार्शनिक सिद्धांतों का समन्वय करते हैं।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Efficiency and Clarity",
          headingHi: "संक्षिप्तता और अचूकता",
          textEn: "Maximum wisdom expressed with minimal linguistic noise.",
          textHi: "कम से कम शब्दों में अधिकतम सत्य और गहरा अर्थ समाहित करना।",
        },
      ],
      modernRelevance: {
        en: "Comparable to algorithmic syntax, executive summaries, design principles, and micro-learning in modern times.",
        hi: "आधुनिक जीवन में सूक्ष्म सिद्धांतों, नियमों और कार्यप्रणाली को व्यवस्थित करने का आदर्श रूप।",
      },
    },
    tags: ["Brahma Sutra", "Aphorism", "Badarayana", "Mnemonics", "Logic"],
  },

  // =================================================================
  // 02. SHASTRA & DARSHANA (6 Orthodox Schools)
  // =================================================================
  {
    id: "vedanta",
    slug: "vedanta",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Vedanta",
      hi: "वेदांत दर्शन",
    },
    sanskritTitle: "उत्तर मीमांसा (वेदान्त)",
    shortDesc: {
      en: "The ultimate culmination of the Vedas (Uttara Mimamsa), exploring the supreme non-dual reality of Brahman and self-realization.",
      hi: "वेदों का अंतिम निष्कर्ष (उत्तर मीमांसा)। अद्वैत, विशिष्टाद्वैत और द्वैत मतों द्वारा जीव, ब्रह्म और जगत का अंतिम विश्लेषण।",
    },
    badge: "Self-Realization & Brahman",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ॥",
      transliteration: "Brahma satyaṁ jagan mithyā jīvo brahmaiva nāparaḥ.",
      meaningEn: "“Brahman alone is real; the changing world is illusory (transient); the individual soul is non-different from Brahman.” — Adi Shankaracharya",
      meaningHi: "“केवल परब्रह्म ही शाश्वत सत्य है; यह परिवर्तनशील जगत मिथ्या (सापेक्ष) है; और जीव स्वयं ब्रह्म ही है, उससे भिन्न नहीं।” — आदि शंकराचार्य",
    },
    detailedArticle: {
      summary: {
        en: "Founded on the Prasthanatrayi (the Upanishads, Bhagavad Gita, and Brahma Sutras), Vedanta is India's preeminent spiritual philosophy. Major traditions include Advaita (Non-dualism of Adi Shankara), Vishishtadvaita (Qualified Non-dualism of Ramanuja), and Dvaita (Dualism of Madhva).",
        hi: "प्रस्थानत्रयी (उपनिषद, भगवद्गीता और ब्रह्मसूत्र) पर आधारित वेदांत दर्शन भारत की सर्वोच्च दार्शनिक उपलब्धि है। इसमें अद्वैत, विशिष्टाद्वैत और द्वैत जैसी अमर धाराएं प्रवाहित हैं।",
      },
      structure: [
        {
          name: "Advaita Vedanta",
          descEn: "Non-duality: the apparent multiplicity of the universe is an appearance caused by Maya, dissolved by direct self-knowledge (Jnana).",
          descHi: "माया के आवरण के हटने पर केवल एक अखंड सच्चिदानंद ब्रह्म ही शेष रहता है।",
        },
        {
          name: "Prasthanatrayi",
          descEn: "The Triple Cannon: Shruti Prasthana (Upanishads), Smriti Prasthana (Gita), Nyaya Prasthana (Brahma Sutras).",
          descHi: "श्रुति प्रस्थान, स्मृति प्रस्थान और न्याय प्रस्थान।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Universal Interconnectedness",
          headingHi: "सर्वव्यापी एकात्म भाव",
          textEn: "Recognizing the single divine thread running through all sentient beings inspires boundless compassion.",
          textHi: "सभी प्राणियों में एक ही चेतना को देखना ही सर्वोच्च प्रेम और करुणा का मूल है।",
        },
      ],
      modernRelevance: {
        en: "Pioneered modern global interest in quantum physics, non-duality, mindfulness, and global spiritual unity.",
        hi: "आधुनिक क्वांटम भौतिकी, ध्यान, और वैश्विक चेतना के एकीकरण में अत्यंत महत्वपूर्ण।",
      },
    },
    tags: ["Advaita", "Shankaracharya", "Brahman", "Maya", "Prasthanatrayi"],
  },

  {
    id: "mimamsa",
    slug: "mimamsa",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Mimamsa",
      hi: "मीमांसा दर्शन",
    },
    sanskritTitle: "पूर्व मीमांसा",
    shortDesc: {
      en: "Purva Mimamsa founded by Sage Jaimini, focused on Vedic hermeneutics, epistemic inquiry into Dharma, and the ethics of duty.",
      hi: "महर्षि जैमिनि द्वारा प्रतिपादित पूर्व मीमांसा। वेदों की व्याख्या, वाक्य-विचार, धर्म के स्वरूप और कर्मफल के सिद्धांतों का विवेचन।",
    },
    badge: "Vedic Hermeneutics & Duty",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "अथातो धर्मजिज्ञासा ॥",
      transliteration: "Athāto dharma-jijñāsā.",
      meaningEn: "“Now, therefore, begins the deep inquiry into Dharma.” — Mimamsa Sutra 1.1.1",
      meaningHi: "“अब, इसके पश्चात धर्म के यथार्थ स्वरूप की जिज्ञासा प्रारंभ होती है।” — मीमांसा सूत्र १.१.१",
    },
    detailedArticle: {
      summary: {
        en: "Purva Mimamsa investigates the nature of obligation, right action, and the infallible authority of sacred words (Shabda Pramana). It developed sophisticated rules of textual interpretation that continue to guide Hindu jurisprudence and philosophy of language.",
        hi: "पूर्व मीमांसा यह सिद्ध करती है कि धर्म का ज्ञान केवल वेदों से हो सकता है। कुमारिल भट्ट और प्रभाकर मिश्र जैसे आचार्यों ने इसमें ज्ञान-मीमांसा (ज्ञान प्राप्ति के साधन) और कर्मफल की व्यवस्था का अद्भुत विश्लेषण किया।",
      },
      structure: [
        {
          name: "Jaimini's Mimamsa Sutras",
          descEn: "12 chapters comprising 2,700 sutras analyzing Vedic injunctions (Vidhi), prohibitions (Nishedha), and eulogies (Arthavada).",
          descHi: "१२ अध्यायों में २७०० सूत्र, जो विधि, निषेध और अर्थवाद का विशद परीक्षण करते हैं।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Unshakable Dharma",
          headingHi: "धर्म की निष्ठा",
          textEn: "Action performed out of sheer ethical duty produces enduring spiritual and societal welfare (Apurva).",
          textHi: "कर्तव्य-बोध से किया गया कार्य समाज और साधक के लिए स्थायी कल्याणकारी ऊर्जा उत्पन्न करता है।",
        },
      ],
      modernRelevance: {
        en: "Critical for legal hermeneutics, semantic text interpretation, moral duty ethics, and linguistic philosophy.",
        hi: "कानूनी व्याख्या, भाषा-दर्शन, और कर्तव्यनिष्ठा के सिद्धांतों के लिए अनिवार्य।",
      },
    },
    tags: ["Jaimini", "Purva Mimamsa", "Dharma", "Hermeneutics", "Duty"],
  },

  {
    id: "nyaya",
    slug: "nyaya",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Nyaya",
      hi: "न्याय दर्शन",
    },
    sanskritTitle: "न्यायदर्शन (तर्कशास्त्र)",
    shortDesc: {
      en: "The classical Indian school of rigorous logic, epistemology, and debate founded by Sage Akshapada Gautama.",
      hi: "महर्षि अक्षपाद गौतम द्वारा रचित तर्कशास्त्र और प्रमाण-विद्या। युक्तिसंगत चिंतन, वाद-विवाद के नियम और सत्य की वैज्ञानिक खोज।",
    },
    badge: "Logic & Epistemology",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "प्रमाणैरर्थपरीक्षणं न्यायः ।",
      transliteration: "Pramāṇair artha-parīkṣaṇaṁ nyāyaḥ.",
      meaningEn: "“Nyaya is the examination of reality through valid means of true knowledge.” — Vatsyayana Bhashya",
      meaningHi: "“प्रमाणों के आधार पर किसी विषय की सूक्ष्म परीक्षा करना ही न्याय है।” — वात्स्यायन भाष्य",
    },
    detailedArticle: {
      summary: {
        en: "Nyaya systematized the tools of valid cognition (Pramana): Pratyaksha (perception), Anumana (inference), Upamana (comparison), and Shabda (credible testimony). Its 5-step syllogism antedated Aristotelian logic and remains a triumph of intellectual rigour.",
        hi: "न्याय दर्शन ने सत्य की पहचान के लिए चार प्रमाण स्थापित किए — प्रत्यक्ष, अनुमान, उपमान और शब्द। इसका पंच-अवयव अनुमान (प्रतिज्ञा, हेतु, उदाहरण, उपनय, निगमन) तर्कशास्त्र का अद्भुत शिखर है।",
      },
      structure: [
        {
          name: "16 Padarthas (Philosophical Categories)",
          descEn: "Pramana, Prameya, Samshaya (doubt), Prayojana, Drishtanta, Siddhanta, Avayava, Tarka, Nirnaya, Vada, Jalpa, Vitanda, Hetvabhasa, Chhala, Jati, Nigrahasthana.",
          descHi: "१६ पदार्थों का सूक्ष्म विवेचन जो भ्रांति को दूर कर मुक्ति का मार्ग प्रशस्त करता है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Discernment of Truth",
          headingHi: "सत्य और असत्य का विवेक",
          textEn: "Liberation from suffering is achieved by eliminating false knowledge through rigorous critical thinking.",
          textHi: "मिथ्या ज्ञान के निवारण और यथार्थ तर्क से ही दुःखों की आत्यंतिक निवृत्ति होती है।",
        },
      ],
      modernRelevance: {
        en: "Foundational to modern debating, legal argumentation, critical thinking courses, and analytical philosophy.",
        hi: "आलोचनात्मक सोच (क्रिटिकल थिंकिंग), न्यायिक तार्किकता और वैज्ञानिक अनुसंधान की रीढ़।",
      },
    },
    tags: ["Gautama", "Logic", "Pramana", "Inference", "Debate"],
  },

  {
    id: "vaisheshika",
    slug: "vaisheshika",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Vaisheshika",
      hi: "वैशेषिक दर्शन",
    },
    sanskritTitle: "वैशेषिकदर्शन (परमाणुवाद)",
    shortDesc: {
      en: "The ancient Indian physical science and atomic ontology founded by Sage Kanada, classifying the material building blocks of reality.",
      hi: "महर्षि कणाद द्वारा प्रतिपादित भौतिक विज्ञान और परमाणुवाद। संपूर्ण दृश्य जगत के मूल द्रव्यों और तत्वों का वैज्ञानिक वर्गीकरण।",
    },
    badge: "Atomic Physics & Ontology",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः ॥",
      transliteration: "Yato'bhyudaya-niḥśreyasa-siddhiḥ sa dharmaḥ.",
      meaningEn: "“Dharma is that from which both material flourishing (Abhyudaya) and supreme spiritual liberation (Nihshreyasa) are attained.” — Vaisheshika Sutra 1.1.2",
      meaningHi: "“जिससे इस लोक में भौतिक उन्नति और परलोक में मोक्ष की प्राप्ति हो, वही धर्म है।” — वैशेषिक सूत्र १.१.२",
    },
    detailedArticle: {
      summary: {
        en: "Sage Kanada proposed that all matter is composed of indivisible, eternal particles called Paramanu (atoms), centuries before Greek philosophers. Vaisheshika classifies reality into categories (Padarthas): Dravya (substance), Guna (quality), Karma (action), Samanya (generality), Vishesha (particularity), and Samavaya (inherence).",
        hi: "महर्षि कणाद ने विश्व में सर्वप्रथम यह प्रतिपादित किया कि समस्त भौतिक संसार 'परमाणु' से निर्मित है। वैशेषिक दर्शन द्रव्य, गुण, कर्म, सामान्य, विशेष और समवाय जैसे पदार्थों द्वारा ब्रह्मांड की रचना की व्याख्या करता है।",
      },
      structure: [
        {
          name: "Nine Fundamental Substances (Dravyas)",
          descEn: "Earth, Water, Fire, Air, Space (Akasha), Time (Kala), Direction (Dik), Soul (Atman), and Mind (Manas).",
          descHi: "पृथ्वी, जल, तेज, वायु, आकाश, काल, दिशा, आत्मा और मन।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Atomic Pluralism",
          headingHi: "परमाणुवाद एवं भौतिक यथार्थ",
          textEn: "The invisible atomic fabric combines in specific proportions to manifest visible diversity in nature.",
          textHi: "अदृश्य परमाणु निश्चित अनुपात में मिलकर संसार के विभिन्न पदार्थों का निर्माण करते हैं।",
        },
      ],
      modernRelevance: {
        en: "A precursor to particle physics, chemistry, material science, and scientific metaphysics.",
        hi: "आधुनिक भौतिकी, रसायन विज्ञान और पदार्थों के वैज्ञानिक अध्ययन का प्राचीनतम रूप।",
      },
    },
    tags: ["Kanada", "Paramanu", "Atoms", "Physics", "Substance"],
  },

  {
    id: "sankhya",
    slug: "sankhya",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Sankhya",
      hi: "सांख्य दर्शन",
    },
    sanskritTitle: "सांख्यदर्शन (द्वैत तत्त्व)",
    shortDesc: {
      en: "The ancient dualistic metaphysics founded by Sage Kapila, distinguishing between pure Consciousness (Purusha) and Nature (Prakriti).",
      hi: "महर्षि कपिल द्वारा स्थापित तत्त्व-मीमांसा। २४ जड़ तत्त्वों वाली प्रकृति और चेतन पुरुष के भेद को समझकर दुःखों से मुक्ति।",
    },
    badge: "Metaphysics & 25 Tattvas",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "सत्त्वरजस्तमसां साम्यावस्था प्रकृतिः ॥",
      transliteration: "Sattva-rajas-tamasāṁ sāmyāvasthā prakṛtiḥ.",
      meaningEn: "“Prakriti is the primordial equilibrium of the three Gunas — Sattva, Rajas, and Tamas.” — Sankhya Pravachana Sutra",
      meaningHi: "“सत्त्व, रज और तम — इन तीनों गुणों की साम्यावस्था ही मूल प्रकृति है।” — सांख्य प्रवचन सूत्र",
    },
    detailedArticle: {
      summary: {
        en: "Sankhya is one of the oldest systematic intellectual models of creation. It enumerates 25 foundational Tattvas: the eternal witness (Purusha), primordial nature (Prakriti), intellect (Mahat/Buddhi), ego-sense (Ahamkara), mind, the 5 senses, the 5 action organs, 5 subtle elements (Tanmatras), and 5 gross elements (Mahabhutas).",
        hi: "सांख्य का अर्थ है गणना अथवा सम्यक् ज्ञान। यह २५ तत्त्वों के माध्यम से संसार की उत्पत्ति को समझाता है। जब पुरुष स्वयं को प्रकृति के तीन गुणों से अलग शुद्ध दृष्टा रूप में जान लेता है, तब कैवल्य (मुक्ति) प्राप्त होती है।",
      },
      structure: [
        {
          name: "The 3 Gunas",
          descEn: "Sattva (clarity, light, harmony), Rajas (passion, dynamism, agitation), and Tamas (inertia, darkness, resistance).",
          descHi: "सत्त्व (प्रकाश, शांति), रज (गति, कामना), और तम (आलस्य, अंधकार)।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Disidentification from Matter",
          headingHi: "प्रकृति-पुरुष का भेद",
          textEn: "You are the untarnished witness (Purusha), not the shifting tides of thoughts, emotions, and physical states.",
          textHi: "आप चंचल मन या विचारों के अधीन नहीं, अपितु निर्मल साक्षी पुरुष हैं।",
        },
      ],
      modernRelevance: {
        en: "Serves as the theoretical backbone for Yoga philosophy, psychology of mind, and modern cognitive science.",
        hi: "मनोविज्ञान, ध्यान और योग साधना का सैद्धांतिक आधार।",
      },
    },
    tags: ["Kapila", "Purusha", "Prakriti", "Gunas", "Tattvas"],
  },

  {
    id: "yoga",
    slug: "yoga",
    categorySlug: "shastra-darshana",
    categoryNumber: "02",
    group: "Shad Darshana",
    title: {
      en: "Yoga",
      hi: "योग दर्शन",
    },
    sanskritTitle: "पातञ्जल योगदर्शन",
    shortDesc: {
      en: "The practical science of inner mastery and mind transcendence codified by Maharishi Patanjali through the 8 Limbs (Ashtanga).",
      hi: "महर्षि पतंजलि द्वारा प्रणीत अष्टांग योग। चित्त की वृत्तियों का निरोध कर समाधि और आत्म-अनुभूति की व्यावहारिक साधना।",
    },
    badge: "Mind Mastery & Ashtanga",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "योगश्चित्तवृत्तिनिरोधः ॥",
      transliteration: "Yogaś citta-vṛtti-nirodhaḥ.",
      meaningEn: "“Yoga is the intentional stilling of the fluctuating modifications of consciousness.” — Patanjali Yoga Sutra 1.2",
      meaningHi: "“चित्त की वृत्तियों (चंचल विचारों और वृत्तियों) का पूर्णतः शांत व निरुद्ध होना ही योग है।” — योगसूत्र १.२",
    },
    detailedArticle: {
      summary: {
        en: "Patanjali's Yoga Shastra provides the practical methodology to experience the truths theoretical Sankhya outlines. Its 196 sutras across four chapters (Samadhi, Sadhana, Vibhuti, Kaivalya) form the universal roadmap for psychological mastery, ethical integrity, and transcendent enlightenment.",
        hi: "योग दर्शन सांख्य के सिद्धांतों का प्रयोगात्मक रूप है। पतंजलि के १९६ योगसूत्र चार पादों (समाधि, साधन, विभूति, कैवल्य) में मनुष्य की चेतना को उच्चतम समाधि तक पहुँचाने की वैज्ञानिक रूपरेखा प्रस्तुत करते हैं।",
      },
      structure: [
        {
          name: "Ashtanga Yoga (The 8 Limbs)",
          descEn: "1. Yama (ethics) 2. Niyama (observances) 3. Asana (posture) 4. Pranayama (breath) 5. Pratyahara (sense withdrawal) 6. Dharana (concentration) 7. Dhyana (meditation) 8. Samadhi (oneness).",
          descHi: "यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान और समाधि।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Mastery Over Mind",
          headingHi: "चित्त की एकाग्रता और शुद्धि",
          textEn: "When thoughts settle like calm water, the true Self shines in its pristine splendour (Tada drashtuh svarupe avasthanam).",
          textHi: "जब मन के विचार शांत हो जाते हैं, तब द्रष्टा अपने वास्तविक स्वरूप में प्रतिष्ठित होता है।",
        },
      ],
      modernRelevance: {
        en: "Universally celebrated for physical vitality, mental clarity, emotional resilience, and deep meditative focus.",
        hi: "शारीरिक स्वास्थ्य, मानसिक शांति, एकाग्रता और आध्यात्मिक जागरण हेतु विश्वभर में मान्य।",
      },
    },
    tags: ["Patanjali", "Ashtanga", "Meditation", "Samadhi", "Pranayama"],
  },

  // =================================================================
  // 03. ITIHASA & PURANA
  // =================================================================
  {
    id: "ramayana",
    slug: "ramayana",
    categorySlug: "itihasa-purana",
    categoryNumber: "03",
    group: "Epics",
    title: {
      en: "Ramayana",
      hi: "वाल्मीकि रामायण",
    },
    sanskritTitle: "श्रीमद्वाल्मीकीय रामायण",
    shortDesc: {
      en: "The Adi Kavya (first epic poem) by Sage Valmiki chronicling the righteous life of Maryada Purushottam Bhagavan Shri Rama across 7 Kandas.",
      hi: "महर्षि वाल्मीकि द्वारा प्रणीत आदिकाव्य। मर्यादा पुरुषोत्तम प्रभु श्रीराम के धर्ममय जीवन, मर्यादा, त्याग और सत्य-निष्ठा का पावन महाकाव्य।",
    },
    badge: "The First Epic (Adi Kavya)",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ॥",
      transliteration: "Rāmo vigrahavān dharmaḥ sādhuḥ satya-parākramaḥ.",
      meaningEn: "“Rama is the living embodiment of Dharma itself, noble and heroic in truth.” — Aranya Kanda 37.13",
      meaningHi: "“श्रीराम साक्षात् धर्म के साकार स्वरूप हैं, परम साधु और सत्य जिनका अमोघ पराक्रम है।” — अरण्यकाण्ड ३७.१३",
    },
    detailedArticle: {
      summary: {
        en: "Comprising 24,000 verses across 7 Kandas, Valmiki Ramayana is more than historical narrative; it is an enduring portrait of human ideal conduct. Shri Rama exemplifies duty as a son, fidelity as a king, compassion as a leader, and steadfast adherence to righteousness even in profound adversity.",
        hi: "२४,००० श्लोकों और ७ काण्डों (बाल, अयोध्या, अरण्य, किष्किन्धा, सुंदर, युद्ध और उत्तर) में फैला यह महाकाव्य आदर्श पुत्र, आदर्श भ्राता, आदर्श पति और प्रजावत्सल राजा की पराकाष्ठा है।",
      },
      structure: [
        {
          name: "The 7 Sacred Kandas",
          descEn: "Bala, Ayodhya, Aranya, Kishkindha, Sundara (devotion of Hanuman), Yuddha (triumph over Ravana), and Uttara Kanda.",
          descHi: "बालकाण्ड, अयोध्याकाण्ड, अरण्यकाण्ड, किष्किन्धाकाण्ड, सुंदरकाण्ड, युद्धकाण्ड, उत्तरकाण्ड।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Maryada (Righteous Restraint)",
          headingHi: "मर्यादा और वचन-पालन",
          textEn: "True nobility lies in sacrificing personal desires for the sanctity of moral duty and societal trust.",
          textHi: "व्यक्तिगत सुखों से ऊपर उठकर धर्म, वचन और प्रजा-कल्याण को प्राथमिकता देना।",
        },
      ],
      modernRelevance: {
        en: "Teaches leadership ethics, family harmony, crisis management, and the indomitable power of devotion (Bhakti).",
        hi: "नेतृत्व क्षमता, पारिवारिक एकता, संकट-प्रबंधन और भक्ति-समर्पण की अद्वितीय शिक्षा।",
      },
    },
    tags: ["Valmiki", "Shri Rama", "Sundara Kanda", "Dharma", "Hanuman"],
  },

  {
    id: "mahabharata",
    slug: "mahabharata",
    categorySlug: "itihasa-purana",
    categoryNumber: "03",
    group: "Epics",
    title: {
      en: "Mahabharata",
      hi: "महाभारत एवं भगवद्गीता",
    },
    sanskritTitle: "महाभारत (पंचम वेद)",
    shortDesc: {
      en: "The world's longest epic by Maharishi Vedavyasa exploring every dimension of human existence, crowned by the Bhagavad Gita.",
      hi: "महर्षि वेदव्यास रचित विश्व का विशालतम महाकाव्य (१ लाख श्लोक)। धर्म, अर्थ, काम और मोक्ष का विश्वकोष तथा श्रीमद्भगवद्गीता का उद्गम।",
    },
    badge: "The Fifth Veda (Panchama Veda)",
    readTime: "9 min read",
    keyVerse: {
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      transliteration: "Karmaṇy evādhikāras te mā phaleṣu kadācana, Mā karma-phala-hetur bhūr mā te saṅgo'stv akarmaṇi.",
      meaningEn: "“You have a right only to perform your prescribed duty, never to the fruits of action. Never let the fruits be your motive, nor be attached to inaction.” — Gita 2.47",
      meaningHi: "“तुम्हारा केवल कर्म करने में अधिकार है, उसके फलों में कभी नहीं। इसलिए कर्मफल के हेतु मत बनो और न ही अकर्मण्यता में तुम्हारी आसक्ति हो।” — भगवद्गीता २.४७",
    },
    detailedArticle: {
      summary: {
        en: "With over 100,000 verses across 18 Parvas, the Mahabharata encapsulates human psychology, ethics, political diplomacy, and cosmic law. In the heart of the battlefield of Kurukshetra, Bhagavan Krishna delivers the 700 verses of the Bhagavad Gita to Arjuna, unveiling Karma Yoga, Bhakti Yoga, and Jnana Yoga.",
        hi: "१८ पर्वों और एक लाख श्लोकों में निबद्ध महाभारत मानव स्वभाव, कूटनीति, पारिवारिक द्वंद्व और धर्म-अधर्म के संघर्ष का अद्भुत दर्पण है। कुरुक्षेत्र के युद्धस्थल पर श्रीकृष्ण द्वारा अर्जुन को दिया गया उपदेश 'श्रीमद्भगवद्गीता' संपूर्ण मानव जाति का मार्गदर्शक है।",
      },
      structure: [
        {
          name: "18 Parvas & The Gita",
          descEn: "From Adi Parva to Svargarohana Parva, with Bhishma Parva housing the divine Shrimad Bhagavad Gita.",
          descHi: "आदि पर्व से स्वर्गारोहण पर्व तक १८ पर्व; भीष्म पर्व में श्रीमद्भगवद्गीता निहित है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Nishkama Karma — Selfless Action",
          headingHi: "निष्काम कर्मयोग",
          textEn: "Perform your highest duty with excellence while releasing anxiety about outcomes to the Supreme Divine.",
          textHi: "परिणाम की चिंता और भय से मुक्त होकर पूर्ण एकाग्रता व समर्पण से अपना श्रेष्ठ कर्म करना।",
        },
      ],
      modernRelevance: {
        en: "The ultimate guide for ethical decision-making, inner conflict resolution, mental resilience, and purposeful work.",
        hi: "आंतरिक द्वंद्वों से मुक्ति, तनाव-प्रबंधन, कर्तव्य-बोध और नेतृत्व कौशल के लिए विश्वविख्यात।",
      },
    },
    tags: ["Bhagavad Gita", "Krishna", "Arjuna", "Kurukshetra", "Karma Yoga"],
  },

  {
    id: "purana",
    slug: "purana",
    categorySlug: "itihasa-purana",
    categoryNumber: "03",
    group: "Puranic Lore",
    title: {
      en: "Purana",
      hi: "अष्टादश महापुराण",
    },
    sanskritTitle: "अष्टादश महापुराणानि",
    shortDesc: {
      en: "The 18 Great Puranas by Maharishi Vedavyasa detailing cosmic cycles, genealogies, sacred geography (Tirthas), and devotional bhakti.",
      hi: "महर्षि वेदव्यास द्वारा प्रणीत १८ महापुराण। सृष्टि की उत्पत्ति, संहार, राजवंशों के इतिहास, तीर्थों की महिमा और भक्ति-साधना का अमृत कोष।",
    },
    badge: "18 Great Puranas",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः । परोपकाराय दुहन्ति गावः परोपकारार्थमिदं शरीरम् ॥",
      transliteration: "Paropakārāya phalanti vṛkṣāḥ paropakārāya vahanti nadyaḥ, Paropakārāya duhanti gāvaḥ paropakārārtham idaṁ śarīram.",
      meaningEn: "“Trees yield fruit for others; rivers flow for others; cows give milk for others. Indeed, this human body is meant for selfless service to others.” — Purana Subhashita",
      meaningHi: "“वृक्ष परोपकार के लिए फल देते हैं, नदियाँ परोपकार के लिए बहती हैं, गायें परोपकार के लिए दूध देती हैं — यह मानव शरीर भी परोपकार के लिए ही है।” — पुराण सुभाषित",
    },
    detailedArticle: {
      summary: {
        en: "The Puranas make the abstract truths of the Vedas accessible to all people through captivating allegories, cosmology, and temple traditions. They are traditionally classified into Sattvika (Vishnu, Bhagavata, Garuda, etc.), Rajasika (Brahma, Markandeya, etc.), and Tamasika (Shiva, Linga, Skanda, etc.).",
        hi: "पुराण वेदों के गूढ़ दर्शन को सुंदर आख्यानों, तीर्थ-माहात्म्य और भक्ति के माध्यम से जन-जन तक पहुँचाते हैं। श्रीमद्भागवत, विष्णु पुराण, शिव पुराण, मार्कंडेय पुराण (दुर्गा सप्तशती का उद्गम) आदि प्रमुख महापुराण हैं।",
      },
      structure: [
        {
          name: "Pancha Lakshana (5 Hallmarks)",
          descEn: "1. Sarga (primary creation) 2. Pratisarga (re-creation after dissolution) 3. Vamsha (genealogies) 4. Manvantara (cosmic epochs) 5. Vamshanucharita (histories of dynasties).",
          descHi: "सर्ग, प्रतिसर्ग, वंश, मन्वंतर और वंशानुचरित — ये पुराणों के पांच शास्त्रीय लक्षण हैं।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Devotion and Service",
          headingHi: "भक्ति और लोक-कल्याण",
          textEn: "Purity of heart, constant remembrance of the Divine, and compassionate service to humanity wash away all impurities.",
          textHi: "ईश्वर-भक्ति, तीर्थ-स्नान, दान और सत्य-आचरण से जीवन में पवित्रता और शांति का संचार होता है।",
        },
      ],
      modernRelevance: {
        en: "Preserves Indian cultural traditions, temple festivals, pilgrim networks, and moral storytelling for generations.",
        hi: "भारतीय उत्सवों, तीर्थ-संस्कृति, नैतिक मूल्यों और पारिवारिक संस्कारों का शाश्वत स्रोत।",
      },
    },
    tags: ["Bhagavata", "Shiva Purana", "Vishnu Purana", "Manvantara", "Tirthas"],
  },

  // =================================================================
  // 04. DHARMA & JEEVAN
  // =================================================================
  {
    id: "dharma",
    slug: "dharma",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Dharma",
      hi: "धर्म (सनातन धर्म का स्वरूप)",
    },
    sanskritTitle: "धर्म लक्षण एवं स्वरूप",
    shortDesc: {
      en: "The foundational cosmic law of righteousness, ethical duty, moral integrity, and social sustenance upholding all existence.",
      hi: "सृष्टि को धारण करने वाला शाश्वत नियम। कर्तव्य-पालन, सत्य, अहिंसा, संयम और सदाचार के दस शास्त्रीय लक्षण।",
    },
    badge: "Cosmic Sustenance & Ethics",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "धृतिः क्षमा दमोऽस्तेयं शौचमिन्द्रियनिग्रहः । धीर्विद्या सत्यमक्रोधो दशकं धर्मलक्षणम् ॥",
      transliteration: "Dhṛtiḥ kṣamā damo'steyaṁ śaucam indriya-nigrahaḥ, Dhīr vidyā satyam akrodho daśakaṁ dharma-lakṣaṇam.",
      meaningEn: "“Patience, forgiveness, self-control, non-stealing, inner purity, restraint of senses, wisdom, knowledge, truthfulness, and freedom from anger — these ten are the cardinal hallmarks of Dharma.” — Manusmriti 6.92",
      meaningHi: "“धैर्य, क्षमा, आत्म-संयम, अस्तेय (चोरी न करना), पवित्रता, इंद्रिय-निग्रह, विवेक, विद्या, सत्य और अक्रोध — ये धर्म के दस शाश्वत लक्षण हैं।” — मनुस्मृति ६.९२",
    },
    detailedArticle: {
      summary: {
        en: "Derived from the Sanskrit root 'Dhri' (to uphold, sustain), Dharma is far broader than sectarian religion. It is the cosmic glue that keeps human societies functioning in justice, nature flourishing in balance, and individual conscience clear and luminous.",
        hi: "'धृ' धातु से उत्पन्न धर्म का अर्थ है जो संपूर्ण जगत को धारण करे। धर्म संप्रदाय नहीं, अपितु जीवन-मूल्य है — सत्य, दया, क्षमा और परोपकार का साक्षात् आचरण।",
      },
      structure: [
        {
          name: "Levels of Dharma",
          descEn: "Samanya Dharma (universal human ethics), Visesha Dharma (contextual duties), Svadharma (personal innate calling), Sanatana Dharma (eternal spiritual truths).",
          descHi: "सामान्य धर्म (मानवता के मूल्य), स्वधर्म (व्यक्तिगत कर्तव्य) और सनातन धर्म।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Dharmo Rakshati Rakshitah",
          headingHi: "धर्मो रक्षति रक्षितः",
          textEn: "Dharma protects those who protect and uphold it.",
          textHi: "जो धर्म की रक्षा करता है, धर्म उसकी समस्त संकटों से रक्षा करता है।",
        },
      ],
      modernRelevance: {
        en: "Guides modern business ethics, bioethics, environmental responsibility, and personal moral compass.",
        hi: "व्यावसायिक नैतिकता, मानवीय संबंध, मानसिक संतुलन और न्यायपूर्ण समाज के निर्माण में मार्गदर्शक।",
      },
    },
    tags: ["Dharma", "Ethics", "Manusmriti", "Svadharma", "Values"],
  },

  {
    id: "ashrama",
    slug: "ashrama",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Ashrama",
      hi: "चतुर्विध आश्रम व्यवस्था",
    },
    sanskritTitle: "आश्रम धर्म",
    shortDesc: {
      en: "The four organic stages of human life: Brahmacharya (student), Grihastha (householder), Vanaprastha (reflective elder), and Sannyasa (renunciant).",
      hi: "मानव जीवन के चार चरण: ब्रह्मचर्य (विद्याध्ययन), गृहस्थ (सामाजिक योगदान), वानप्रस्थ (आत्म-चिंतन) और संन्यास (मुक्ति-साधना)।",
    },
    badge: "The 4 Life Stages",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "यथा नदीनदाः सर्वे समुद्रे यान्ति संस्थितिम् । तथैव सर्व आश्रमा गृहस्थे यान्ति संस्थितिम् ॥",
      transliteration: "Yathā nadī-nadāḥ sarve samudre yānti saṁsthitim, Tathaiva sarva āśramā gṛhasthe yānti saṁsthitim.",
      meaningEn: "“Just as all rivers and streams find their rest in the ocean, even so all other ashramas find their sustenance in the householder (Grihastha).” — Manusmriti 6.89",
      meaningHi: "“जैसे समस्त नदियाँ अंततः समुद्र में विश्राम पाती हैं, वैसे ही अन्य सभी आश्रम गृहस्थ के आश्रय से ही पलते हैं।” — मनुस्मृति ६.८९",
    },
    detailedArticle: {
      summary: {
        en: "The Ashrama system divides a 100-year human life into four well-orchestrated quadrants of 25 years each, systematically harmonizing material desire (Kama), economic stability (Artha), ethical duty (Dharma), and spiritual liberation (Moksha).",
        hi: "आश्रम व्यवस्था मनुष्य के १०० वर्ष के जीवन को चार संतुलित चरणों में विभाजित करती है, जिससे धर्म, अर्थ, काम और मोक्ष — चारों पुरुषार्थों की सहज सिद्धि हो सके।",
      },
      structure: [
        {
          name: "1. Brahmacharya (0-25 yrs)",
          descEn: "Discipline, study of arts and sciences, celibacy, physical prowess, and character building.",
          descHi: "विद्यार्जन, चरित्र-निर्माण, संयम और अनुशासन का काल।",
        },
        {
          name: "2. Grihastha (25-50 yrs)",
          descEn: "Marriage, family, generating wealth, hospitality, charity, and civic duty.",
          descHi: "विवाह, परिवार-पोषण, अर्थोपार्जन और समाज-सेवा का आधारस्तम्भ।",
        },
        {
          name: "3. Vanaprastha & Sannyasa (50-100 yrs)",
          descEn: "Gradual detachment, passing leadership to the youth, meditation, and total spiritual freedom.",
          descHi: "वानप्रस्थ में ज्ञान-दान व सादगी, और संन्यास में पूर्ण वैराग्य व ईश्वर-चिंतन।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Timely Evolution",
          headingHi: "समयबद्ध जीवन-विकास",
          textEn: "Transitioning gracefully between life stages prevents mid-life crises and senior isolation.",
          textHi: "जीवन के प्रत्येक चरण को उसकी सही मर्यादा और समय पर जीना।",
        },
      ],
      modernRelevance: {
        en: "Provides an empowering blueprint for education, work-life balance, healthy retirement, and mental wellness in old age.",
        hi: "कार्य-जीवन संतुलन, सुखद सेवानिवृत्ति और बुजुर्गों के सम्मानजनक जीवन का आदर्श ढांचा।",
      },
    },
    tags: ["Brahmacharya", "Grihastha", "Vanaprastha", "Sannyasa", "Life Stages"],
  },

  {
    id: "varna",
    slug: "varna",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Varna",
      hi: "वर्ण व्यवस्था (गुण-कर्म विभाग)",
    },
    sanskritTitle: "वर्ण व्यवस्था (गुण-कर्म आधारित)",
    shortDesc: {
      en: "The Vedic organic social paradigm founded strictly upon intrinsic psycho-physical tendencies (Gunas) and vocational aptitude (Karma).",
      hi: "गुण और कर्म के आधार पर समाज का प्राकृतिक वर्गीकरण — ब्राह्मण (ज्ञान), क्षत्रिय (सुरक्षा), वैश्य (अर्थ-व्यवस्था) और शूद्र (श्रम-सेवा)।",
    },
    badge: "Vocational Aptitude & Gunas",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "चातुर्वर्ण्यं मया सृष्टं गुणकर्मविभागशः । तस्य कर्तारमपि मां विद्ध्यकर्तारमव्ययम् ॥",
      transliteration: "Cātur-varṇyaṁ mayā sṛṣṭaṁ guṇa-karma-vibhāgaśaḥ, Tasya kartāram api māṁ viddhy akartāram avyayam.",
      meaningEn: "“The four-fold societal order was created by Me categorized according to individual qualities (Gunas) and natural aptitudes (Karma).” — Bhagavad Gita 4.13",
      meaningHi: "“गुण और कर्मों के विभाग के अनुसार मेरे द्वारा चारों वर्णों की रचना की गई है।” — भगवद्गीता ४.१३",
    },
    detailedArticle: {
      summary: {
        en: "In Vedic scriptures like the Purusha Sukta and Gita, Varna is an organic division of labour necessary for any flourishing civilization, not a rigid hereditary hierarchy. Each limb of society corresponds to a part of the cosmic person (Virata Purusha), interdependent and mutually sacred.",
        hi: "वैदिक दृष्टि में वर्ण जन्मना नहीं, अपितु स्वभाव और कर्मणा था। विराट पुरुष के मुख (ज्ञान/ब्राह्मण), बाहु (रक्षा/क्षत्रिय), उरु (वाणिज्य/वैश्य) और पाद (श्रम/शूद्र) के रूप में समाज के चारों अंग परस्पर पूरक और समान रूप से आवश्यक हैं।",
      },
      structure: [
        {
          name: "Interdependence of Society",
          descEn: "Teachers and thinkers (Brahmana), defenders and administrators (Kshatriya), creators of wealth and commerce (Vaishya), artisans and service workers (Shudra).",
          descHi: "ज्ञान, रक्षा, वाणिज्य और सेवा — इन चारों के संतुलन से ही समाज प्रगति करता है।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Dignity of All Labour",
          headingHi: "श्रम और योग्यता का सम्मान",
          textEn: "Every role performed with integrity and dedication leads to supreme spiritual perfection.",
          textHi: "अपने स्वभाव के अनुकूल कर्म को समर्पण भाव से करना ही आत्मोन्नति का साधन है।",
        },
      ],
      modernRelevance: {
        en: "Parallels modern organizational development, career counselling, personality matching, and vocational specialization.",
        hi: "कैरियर काउंसलिंग, व्यक्तित्व के अनुकूल कार्य-चयन और टीम-बिल्डिंग में सहायक।",
      },
    },
    tags: ["Gunas", "Karma", "Bhagavad Gita", "Purusha Sukta", "Society"],
  },

  {
    id: "samskara",
    slug: "samskara",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Samskara",
      hi: "षोडश संस्कार (१६ पावन संस्कार)",
    },
    sanskritTitle: "षोडश संस्काराः",
    shortDesc: {
      en: "The sixteen sacred Vedic life-cycle sacraments refining human consciousness from conception (Garbhadhana) to final departure (Antyeshti).",
      hi: "मानव जीवन को परिष्कृत और संस्कारित करने वाले १६ दिव्य संस्कार — गर्भाधान, नामकरण, उपनयन, विवाह से लेकर अंत्येष्टि तक।",
    },
    badge: "16 Sacred Rites of Passage",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "जन्मना जायते शूद्रः संस्कारात् द्विज उच्यते ।",
      transliteration: "Janmanā jāyate śūdraḥ saṁskārād dvija ucyate.",
      meaningEn: "“By birth everyone is unrefined; through sacred cultivation and sacraments (Samskaras), one is reborn into wisdom.” — Skanda Purana",
      meaningHi: "“जन्म से प्रत्येक मनुष्य असंस्कृत होता है; पावन संस्कारों और विद्या के द्वारा ही उसका दूसरा जन्म (द्विजत्व) होता है।” — स्कन्द पुराण",
    },
    detailedArticle: {
      summary: {
        en: "A Samskara is a sacred catalytic rite that purifies mental impressions, aligns familial support, and anchors the individual in cosmic grace at pivotal thresholds of growth. From prenatal blessings to childhood milestones, graduation, marital union, and peaceful transition, Samskaras sanctify every chapter of existence.",
        hi: "संस्कार का अर्थ है — परिष्कार, शुद्धि और दिव्य गुणों का आरोपण। सनातन परंपरा में गर्भस्थ शिशु से लेकर जीवन के अंतिम क्षण तक १६ प्रमुख संस्कारों का विधान है जो मन, बुद्धि और आत्मा को उच्चतम सात्विक अवस्था प्रदान करते हैं।",
      },
      structure: [
        {
          name: "The 16 Vedic Samskaras",
          descEn: "1. Garbhadhana 2. Pumsavana 3. Simantonnayana 4. Jatakarma 5. Namakarana 6. Nishkramana 7. Annaprashana 8. Chudakarana 9. Karnavedha 10. Vidyarambha 11. Upanayana 12. Vedarambha 13. Keshanta 14. Samavartana 15. Vivaha 16. Antyeshti.",
          descHi: "गर्भाधान, पुंसवन, सीमंतोन्नयन, जातकर्म, नामकरण, निष्क्रमण, अन्नप्राशन, चूडाकर्म, कर्णवेध, विद्यारंभ, उपनयन, वेदारंभ, केशांत, समावर्तन, विवाह एवं अंत्येष्टि।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Conscious Transformation",
          headingHi: "चेतना का क्रमिक परिष्कार",
          textEn: "Celebrating life's transitions with mantras and communal love embeds deep emotional security.",
          textHi: "जीवन के महत्वपूर्ण मोड़ों पर मंत्रोच्चार और पारिवारिक आशीर्वाद से आत्मविश्वास और संस्कार सुदृढ़ होते हैं।",
        },
      ],
      modernRelevance: {
        en: "Offers a rich, sacred alternative to commercialized milestones, deepening family bonds and psychological grounding.",
        hi: "पारिवारिक रिश्तों को प्रगाढ़ बनाने, बच्चों में उच्च संस्कार रोपने और जीवन के हर पड़ाव को उत्सव बनाने का मार्ग।",
      },
    },
    tags: ["Upanayana", "Vivaha", "Namakarana", "Sacraments", "Rites of Passage"],
  },

  {
    id: "achara",
    slug: "achara",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Achara",
      hi: "सदाचार एवं दिनचर्या",
    },
    sanskritTitle: "सदाचार एवं शिष्टाचार",
    shortDesc: {
      en: "The Vedic science of noble personal conduct, hygiene, speech discipline, humility, and daily ethical excellence.",
      hi: "आचार परमो धर्मः — व्यक्तिगत शुद्धि, मधुर वाणी, आचरण की पवित्रता, गुरुजनों का सम्मान और सात्विक जीवन शैली।",
    },
    badge: "Noble Conduct & Discipline",
    readTime: "5 min read",
    keyVerse: {
      sanskrit: "आचारः परमो धर्म आचारः परमं तपः । आचारः परमं ज्ञानम् आचारात्किं न साध्यते ॥",
      transliteration: "Ācāraḥ paramo dharmaḥ ācāraḥ paramaṁ tapaḥ, Ācāraḥ paramaṁ jñānam ācārāt kiṁ na sādhyate.",
      meaningEn: "“Righteous conduct is the highest virtue; right conduct is the highest austerity; right conduct is supreme wisdom. What cannot be accomplished through noble conduct?” — Mahabharata",
      meaningHi: "“सदाचार ही परम धर्म है, सदाचार ही परम तप है, और सदाचार ही परम ज्ञान है। शुद्ध आचरण से संसार में क्या सिद्ध नहीं हो सकता!” — महाभारत",
    },
    detailedArticle: {
      summary: {
        en: "Achara transforms philosophical ideals into daily living reality. It encompasses physical cleanliness (Saucha), dietary awareness (Mitahara), truth in communication (Satya-vachana), respect for elders, and kindness toward animals and guests (Atithi Devo Bhava).",
        hi: "आचार सिद्धांतों को धरातल पर उतारता है। इसमें शौच (शारीरिक व मानसिक शुद्धि), मिताहार (संतुलित सात्विक भोजन), प्रिय और सत्य वाणी, तथा अतिथि-सत्कार जैसे मूलभूत मूल्य सम्मिलित हैं।",
      },
      structure: [
        {
          name: "Dinacharya (Daily Regimen)",
          descEn: "Waking before sunrise (Brahma Muhurta), gratitude to the earth, cleansing, oil massage, pranayama, and mindful work.",
          descHi: "ब्रह्ममुहूर्त में जागरण, आत्म-वंदन, शरीर-शोधन, ध्यान और नियमित दिनचर्या।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Integrity of Thought, Word, and Deed",
          headingHi: "मनसा, वाचा, कर्मणा की एकता",
          textEn: "Inner peace blossoms when your internal thoughts, verbal expressions, and outer deeds are in flawless harmony.",
          textHi: "मन, वचन और कर्म की एकरूपता ही मनुष्य को विश्वसनीय और तेजस्वी बनाती है।",
        },
      ],
      modernRelevance: {
        en: "Essential for circadian rhythm balance, gut health, emotional intelligence, and authentic social grace.",
        hi: "स्वस्थ जीवनशैली, बायोलॉजिकल क्लॉक का संतुलन और सामाजिक सद्भाव के लिए अनिवार्य।",
      },
    },
    tags: ["Dinacharya", "Brahma Muhurta", "Conduct", "Saucha", "Integrity"],
  },

  {
    id: "nitya-karma",
    slug: "nitya-karma",
    categorySlug: "dharma-jeevan",
    categoryNumber: "04",
    group: "Life Principles",
    title: {
      en: "Nitya Karma",
      hi: "नित्य कर्म एवं पञ्च महायज्ञ",
    },
    sanskritTitle: "नित्यकर्म एवं पञ्चमहायज्ञाः",
    shortDesc: {
      en: "Mandatory daily spiritual practices including Sandhyavandanam, Gayatri japa, and the Five Great Daily Sacrifices (Pancha Maha Yagya).",
      hi: "दैनिक अनिवार्य कर्तव्य — प्रातः-सायं संध्यावंदन, गायत्री जप, सूर्योपासना तथा सृष्टि के प्रति आभार प्रकट करने वाले पाँच महायज्ञ।",
    },
    badge: "Daily Spiritual Maintenance",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "अकुर्वन् विहितं कर्म निन्दितं च समाचरन् । अनिग्रहेण चेन्द्रियाणां नरः पतनमृच्छति ॥",
      transliteration: "Akurvan vihitaṁ karma ninditaṁ ca samācaran, Anigraheṇa cendriyāṇāṁ naraḥ patanam ṛcchati.",
      meaningEn: "“By failing to perform prescribed daily duties, engaging in reproachable acts, and failing to restrain the senses, one falls into spiritual degradation.” — Manusmriti 11.44",
      meaningHi: "“विहित नित्य कर्मों का त्याग करने और इंद्रियों के असंयम से मनुष्य की आध्यात्मिक अवनति होती है।” — मनुस्मृति ११.४४",
    },
    detailedArticle: {
      summary: {
        en: "Nitya Karma acts like daily hygiene for the soul. The centerpiece is the Pancha Maha Yagya (Five Daily Offerings) through which a householder repays five fundamental existential debts: to the divine (Deva Yagya), to ancestors (Pitri Yagya), to sages and learning (Brahma Yagya), to human guests (Manushya Yagya), and to animals and nature (Bhuta Yagya).",
        hi: "नित्य कर्म आत्मा के दैनिक स्नान के समान हैं। इसके केंद्र में 'पञ्च महायज्ञ' हैं, जिनसे मनुष्य अपने जीवन के ऋण चुकाता है — देवयज्ञ (अग्निहोत्र), ब्रह्मयज्ञ (स्वाध्याय), पितृयज्ञ (तर्पण), मनुष्ययज्ञ (अतिथि-सेवा) और भूतयज्ञ (पशु-पक्षियों को भोजन)।",
      },
      structure: [
        {
          name: "The 5 Great Sacrifices (Pancha Maha Yagya)",
          descEn: "1. Brahma Yagya (studying scriptures) 2. Deva Yagya (fire offering) 3. Pitri Yagya (revering forebears) 4. Manushya Yagya (feeding guests/poor) 5. Bhuta Yagya (feeding animals/birds).",
          descHi: "ब्रह्मयज्ञ, देवयज्ञ, पितृयज्ञ, मनुष्ययज्ञ और भूतयज्ञ।",
        },
        {
          name: "Sandhyavandanam",
          descEn: "Trikala Sandhya (dawn, noon, dusk) centering on pranayama, solar mantras, and Gayatri Japa.",
          descHi: "गायत्री मंत्र के साथ त्रिकाल संध्या और प्राणायाम।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Cosmic Reciprocity",
          headingHi: "कृतज्ञता और ऋण-मुक्ति",
          textEn: "Everything we enjoy is gifted by nature, ancestors, and society; daily offerings restore ecological balance.",
          textHi: "प्रकृति, पूर्वजों और समाज से जो लिया है, उसके प्रति कृतज्ञ होकर प्रतिदिन कुछ न कुछ लौटाना।",
        },
      ],
      modernRelevance: {
        en: "Cultivates mindfulness, animal welfare, charity habits, and deep gratitude in a hyper-consumerist world.",
        hi: "पशु-पक्षी सेवा, स्वाध्याय, दान और कृतज्ञता की आदत विकसित करने का सबसे सुंदर मार्ग।",
      },
    },
    tags: ["Pancha Maha Yagya", "Sandhyavandanam", "Gayatri", "Gratitude", "Daily Rites"],
  },

  // =================================================================
  // 05. PUJA & ANUSHTHANA
  // =================================================================
  {
    id: "puja",
    slug: "puja",
    categorySlug: "puja-anushthana",
    categoryNumber: "05",
    group: "Rituals",
    title: {
      en: "Puja",
      hi: "पूजा (षोडशोपचार पूजा विधान)",
    },
    sanskritTitle: "देवपूजा एवं षोडशोपचार",
    shortDesc: {
      en: "The devotional ritual of deity adoration through 16 loving offerings (Shodashopachara), invoking the divine presence into sacred forms.",
      hi: "आराध्य देव का सप्रेम पूजन, आवाहन और षोडशोपचार अर्पण — पाद्य, अर्घ्य, स्नान, वस्त्र, गंध, पुष्प, धूप, दीप और नैवेद्य।",
    },
    badge: "16 Steps of Divine Worship",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति । तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥",
      transliteration: "Patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati, Tad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ.",
      meaningEn: "“Whoever offers Me with true devotion a leaf, a flower, a fruit, or even water — that offering of love I joyfully accept.” — Bhagavad Gita 9.26",
      meaningHi: "“जो कोई भक्त प्रेम और भक्ति से मुझे एक पत्ता, फूल, फल या जल भी अर्पित करता है, उस शुद्ध अंतःकरण वाले का वह उपहार मैं सहर्ष स्वीकार करता हूँ।” — भगवद्गीता ९.२६",
    },
    detailedArticle: {
      summary: {
        en: "Puja is an intimate communion between the worshipper and the Divine. Rather than cold formality, it treats the Deity as the most honoured and beloved royal guest, offering sixteen standard courtesies (Shodashopachara) that engage all five sensory faculties in pure devotion.",
        hi: "पूजा भक्त और भगवान के बीच का आत्मीय संवाद है। इसमें परमात्मा को घर के सबसे प्रिय अतिथि के रूप में मानकर सोलह प्रकार के सत्कार (षोडशोपचार) किए जाते हैं, जिससे मन और पांचों इंद्रियां ईश्वर-प्रेम में लीन हो जाती हैं।",
      },
      structure: [
        {
          name: "Shodashopachara (16 Steps of Worship)",
          descEn: "1. Avahana (invocation) 2. Asana (seating) 3. Padya (foot wash) 4. Arghya (water offering) 5. Achamana (sip of water) 6. Snana (holy bath) 7. Vastra (clothing) 8. Yajnopavita (sacred cord) 9. Gandha (sandalwood) 10. Pushpa (flowers) 11. Dhupa (incense) 12. Dipa (light) 13. Naivedya (food) 14. Tambula (betel leaf) 15. Arati (waving flame) 16. Pradakshina (circumambulation).",
          descHi: "आवाहन, आसन, पाद्य, अर्घ्य, आचमन, स्नान, वस्त्र, यज्ञोपवीत, गंध, पुष्प, धूप, दीप, नैवेद्य, ताम्बूल, आरती एवं प्रदक्षिणा।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Bhavana — Soulful Feeling",
          headingHi: "भाव ही सबसे प्रधान है",
          textEn: "Rituals without internal devotion are mechanical; genuine feeling (Bhava) breathes life into any offering.",
          textHi: "बाह्य सामग्री से अधिक भक्त के हृदय का भाव और समर्पण भगवान को प्रिय है।",
        },
      ],
      modernRelevance: {
        en: "Transforms home environments into serene spiritual sanctuaries, anchoring families in daily mindfulness and gratitude.",
        hi: "घर में सात्विक ऊर्जा, शांति, एकाग्रता और सकारात्मक वातावरण के निर्माण का सर्वोत्तम साधन।",
      },
    },
    tags: ["Shodashopachara", "Naivedya", "Arati", "Bhakti", "Deity Worship"],
  },

  {
    id: "yagya",
    slug: "yagya",
    categorySlug: "puja-anushthana",
    categoryNumber: "05",
    group: "Rituals",
    title: {
      en: "Yagya",
      hi: "यज्ञ (वैदिक महायज्ञ एवं विज्ञान)",
    },
    sanskritTitle: "यज्ञविद्या एवं महायज्ञाः",
    shortDesc: {
      en: "The supreme Vedic ceremony of cosmic communion, chanting sacred mantras around consecrated fire altars for planetary well-being.",
      hi: "अग्नि देव के माध्यम से देवताओं को हविष्य पहुँचाने और विश्व-कल्याण की कामना से किया जाने वाला वैदिक महायज्ञ।",
    },
    badge: "Cosmic Communion & Fire Altar",
    readTime: "8 min read",
    keyVerse: {
      sanskrit: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥",
      transliteration: "Agnim īḷe purohitaṁ yajñasya devam ṛtvijam, Hotāraṁ ratnadhātamam.",
      meaningEn: "“I magnify Agni, the chosen priest, the divine minister of sacrifice, the invoker, the bestower of supreme treasures.” — Rigveda 1.1.1",
      meaningHi: "“यज्ञ के पुरोहित, दिव्य ऋत्विज, देवताओं का आह्वान करने वाले और परम रत्नों को धारण करने वाले अग्निदेव की मैं स्तुति करता हूँ।” — ऋग्वेद १.१.१",
    },
    detailedArticle: {
      summary: {
        en: "Yagya is the scientific and spiritual apex of Vedic civilization. Agni (consecrated fire) serves as the divine transformer, converting medicinal herbs, pure Ghee, and sacred woods into vaporized micro-particles that purify the atmosphere, balance rainfall, and harmonize the subtle astral planes.",
        hi: "यज्ञ सनातन धर्म का सर्वोच्च कर्म है। अग्निदेव को हविष्य का वाहक माना जाता है। शुद्ध घृत, समिधा और औषधीय द्रव्यों की आहुतियों से वातावरण का शुद्धिकरण होता है और सूक्ष्म लोकों में सकारात्मक ऊर्जा का विस्तार होता है।",
      },
      structure: [
        {
          name: "Vedic Yagya Classifications",
          descEn: "Nitya (daily Agnihotra), Naimittika (occasional seasonal yagyas like Somayaga, Rajasuya), and Kamya (performed with high specific intent).",
          descHi: "नित्य (अग्निहोत्र), नैमित्तिक (चातुर्मास्य, सोमयाग) और काम्य यज्ञ।",
        },
        {
          name: "The 4 Priestly Roles",
          descEn: "Hota (Rigvedic invoker), Adhvaryu (Yajurvedic executor), Udgata (Samavedic singer), and Brahma (Atharvavedic supervisor who maintains silent oversight).",
          descHi: "होता, अध्वर्यु, उद्गाता और ब्रह्मा — चार मुख्य ऋत्विज।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Idam Na Mama — Not for Me, but for the Whole",
          headingHi: "इदं न मम — यह मेरा नहीं, प्रभु का है",
          textEn: "Every offering into the flame is released with the mantra 'Idam Na Mama', dismantling the ego and affirming cosmic solidarity.",
          textHi: "प्रत्येक आहुति के साथ 'इदं न मम' बोलकर साधक अपने अहंकार को अग्नि में भस्म करता है।",
        },
      ],
      modernRelevance: {
        en: "Scientific research validates Agnihotra's efficacy in neutralizing aerial bacteria, reducing toxic smoke, and revitalizing agricultural soil.",
        hi: "पर्यावरण-शोधन, वर्षा-चक्र, वायु-शुद्धि और नकारात्मक ऊर्जा के निवारण में अत्यंत प्रभावी।",
      },
    },
    tags: ["Agnihotra", "Fire Ritual", "Somayaga", "Atmosphere Cleansing", "Idam Na Mama"],
  },

  {
    id: "homa-havan",
    slug: "homa-havan",
    categorySlug: "puja-anushthana",
    categoryNumber: "05",
    group: "Rituals",
    title: {
      en: "Homa / Havan",
      hi: "होम एवं हवन",
    },
    sanskritTitle: "होम, हवन एवं हविष्य विधान",
    shortDesc: {
      en: "The domestic and temple fire oblations consecrated with Samidha, Ghee, and Guggulu to invoke Navagrahas, Rudra, and Gayatri.",
      hi: "घृत, गुग्गुल, तिल और समिधाओं से अग्नि में दी जाने वाली आहुतियाँ — नवग्रह शांति, रुद्राभिषेक, महामृत्युंजय व गायत्री हवन।",
    },
    badge: "Fire Oblations & Healing",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "स्वाहाकारः सुराणां तु तृप्तये परिकल्पितः ॥",
      transliteration: "Svāhākāraḥ surāṇāṁ tu tṛptaye parikalpitaḥ.",
      meaningEn: "“The utterance of 'Svaha' is consecrated for the satisfaction of celestial forces and the purification of the self.”",
      meaningHi: "“'स्वाहा' का पावन उच्चारण देवताओं की तृप्ति और साधक की अंतःशुद्धि के लिए प्रतिष्ठित किया गया है।”",
    },
    detailedArticle: {
      summary: {
        en: "While grand Yagyas require expansive public pavilions, Homa (or Havan) is the adaptable, domestic fire ceremony performed in homes and temples. Common homas include Ganapati Homa (removal of hurdles), Navagraha Homa (planetary harmonisation), Maha Mrityunjaya Homa (longevity and health), and Chandi Homa (victory and spiritual protection).",
        hi: "होम अथवा हवन साधारण परिवारों में सुगमता से किया जाने वाला अग्नि-अनुष्ठान है। गणपति होम (विघ्न विनाश), नवग्रह होम (ग्रह शांति), महामृत्युंजय होम (आरोग्य व दीर्घायु) और चंडी होम (शक्ति व विजय) प्रमुख हैं।",
      },
      structure: [
        {
          name: "Essential Ingredients (Samagri)",
          descEn: "Cow ghee, dry coconut, camphor, black sesame (Tila), barley (Yava), sacred woods (Palasha, Shami, Peepal), and fragrant herbs.",
          descHi: "शुद्ध गोघृत, काले तिल, जौ, गुग्गुल, समिधा और औषधीय हवन सामग्री।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Purification Through Heat and Sound",
          headingHi: "नाद और अग्नि द्वारा शुद्धि",
          textEn: "Combining synchronized phonetic mantra chanting with sacred fire generates profound emotional elevation and physical detox.",
          textHi: "मंत्रोच्चार की ध्वनि और अग्नि की उष्णता मिलकर मन और पर्यावरण को दोषमुक्त करते हैं।",
        },
      ],
      modernRelevance: {
        en: "Widely practiced for house warmings (Griha Pravesh), new business openings, birthday sanctifications, and removing Vaastu blemishes.",
        hi: "गृहप्रवेश, नूतन व्यापार-आरंभ, जन्मोत्सव और वास्तुदोष निवारण के लिए अत्यंत लोकप्रिय।",
      },
    },
    tags: ["Havan", "Navagraha", "Mrityunjaya", "Ganapati Homa", "Purification"],
  },

  {
    id: "stotra-mantra",
    slug: "stotra-mantra",
    categorySlug: "puja-anushthana",
    categoryNumber: "05",
    group: "Devotional Chants",
    title: {
      en: "Stotra & Mantra",
      hi: "स्तोत्र, मंत्र एवं जप विद्या",
    },
    sanskritTitle: "स्तोत्र, मन्त्र एवं जपानुष्ठान",
    shortDesc: {
      en: "The sacred sonic technology of Mantras (primordial acoustic seeds) and Stotras (hymns of praise by great rishis).",
      hi: "मंत्र और स्तोत्रों की दिव्य शक्ति — बीज मंत्र, गायत्री महामंत्र, शिव तांडव, विष्णु सहस्रनाम और ललिता सहस्रनाम का जप विधान।",
    },
    badge: "Sacred Acoustic Seeds",
    readTime: "7 min read",
    keyVerse: {
      sanskrit: "मननात् त्रायते इति मन्त्रः ॥",
      transliteration: "Mananāt trāyate iti mantraḥ.",
      meaningEn: "“That which protects and liberates the mind through deep continuous contemplation is called a Mantra.” — Pingala Tantra",
      meaningHi: "“जिसके निरंतर मनन, जप और चिंतन से मन समस्त बंधनों व भयों से मुक्त हो जाए, वही मंत्र है।” — पिंगल तंत्र",
    },
    detailedArticle: {
      summary: {
        en: "Mantras are precise acoustic formulas discovered by Rishis in deep meditation, while Stotras are lyrical outpourings of devotion composed by luminaries like Adi Shankara. Chanting with a Rudraksha or Tulsi mala awakens inner chakras, calms erratic brainwaves, and creates protective auric shields.",
        hi: "मंत्र ऋषियों द्वारा अंतर्ध्यान में साक्षात्कृत ध्वनि-तरंगें हैं, जबकि स्तोत्र संतों के हृदय से निकले भक्तिमय काव्य हैं। रुद्राक्ष या तुलसी की माला से जप करने पर मन एकाग्र होता है और आत्मिक तेज बढ़ता है।",
      },
      structure: [
        {
          name: "Types of Japa",
          descEn: "Vachika (spoken aloud), Upamshu (whispered with moving lips), and Manasika (silent mental repetition, considered the most powerful).",
          descHi: "वाचिक (बोलकर), उपांशु (फुसफुसाकर) और मानसिक (मन ही मन — सर्वाधिक फलदायी)।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Vibrational Alignment",
          headingHi: "ध्वनि कंपन और चेतना",
          textEn: "Consistent repetition of sacred syllables re-wires negative subconscious conditioning into positive radiant energy.",
          textHi: "मंत्रों का नियमित जप अवचेतन मन के नकारात्मक संस्कारों को मिटाकर सकारात्मक ऊर्जा भरता है।",
        },
      ],
      modernRelevance: {
        en: "Extensively verified by neuroscience to reduce cortisol, enhance gamma brain waves, and alleviate clinical anxiety.",
        hi: "तनाव मुक्ति, एकाग्रता वृद्धि, अनिद्रा निवारण और स्मरण शक्ति बढ़ाने में अत्यंत प्रभावी।",
      },
    },
    tags: ["Mantra", "Stotra", "Japa", "Gayatri", "Sahasranama"],
  },

  {
    id: "vrata-anushthana",
    slug: "vrata-anushthana",
    categorySlug: "puja-anushthana",
    categoryNumber: "05",
    group: "Spiritual Disciplines",
    title: {
      en: "Vrata & Anushthana",
      hi: "व्रत, उपवास एवं अनुष्ठान",
    },
    sanskritTitle: "व्रत, उपवास एवं अनुष्ठान संकल्प",
    shortDesc: {
      en: "Sacred vows (Vratas), lunar fasts (Ekadashi, Pradosha, Navaratri), and intensive disciplined spiritual sadhana (Anushthana).",
      hi: "संयम और आत्म-शुद्धि का मार्ग — एकादशी, प्रदोष, नवरात्रि, शिवरात्रि व्रत तथा ४० दिवसीय जप-अनुष्ठान के शास्त्रीय नियम।",
    },
    badge: "Vows & Conscious Fasting",
    readTime: "6 min read",
    keyVerse: {
      sanskrit: "उपावृत्तस्य पापेभ्यो यस्तु वासो गुणैः सह । उपवासः स विज्ञेयः सर्वभोगविवर्जितः ॥",
      transliteration: "Upāvṛttasya pāpebhyo yas tu vāso guṇaiḥ saha, Upavāsaḥ sa vijñeyaḥ sarva-bhoga-vivarjitaḥ.",
      meaningEn: "“True fasting (Upavasa) is turning away from negative tendencies and abiding close to the Divine virtues.” — Katyayana",
      meaningHi: "“पापों व बुराइयों से हटकर सद्गुणों के साथ ईश्वर के समीप निवास करना ही सच्चा उपवास कहलाता है।” — कात्यायन",
    },
    detailedArticle: {
      summary: {
        en: "Vrata signifies a conscious, willful spiritual resolve (Sankalpa). Far from mere starvation, Upavasa means 'dwelling close to the Divine' (Upa = near, Vasa = to abide). Anushthana is a fixed-duration intensive practice (e.g. 11, 21, or 40 days) performed with strict discipline for spiritual elevation or resolving obstacles.",
        hi: "व्रत का अर्थ है — संकल्पपूर्वक संयम का पालन। उपवास केवल भूखे रहना नहीं, बल्कि ईश्वर के सानिध्य में समय बिताना है। अनुष्ठान निश्चित दिनों (जैसे ९, २१ या ४० दिन) तक निश्चित संख्या में जप और नियमों का पालन है।",
      },
      structure: [
        {
          name: "Major Lunar Vratas",
          descEn: "Ekadashi (11th lunar day for metabolic rest and Vishnu bhakti), Pradosha (13th day for Shiva), Navaratri (9 nights of divine feminine Shakti), and Shivaratri.",
          descHi: "एकादशी व्रत, प्रदोष व्रत, नवरात्रि साधना और महाशिवरात्रि व्रत।",
        },
      ],
      corePrinciples: [
        {
          headingEn: "Self-Mastery and Willpower",
          headingHi: "इच्छाशक्ति और आत्म-नियंत्रण",
          textEn: "Conquering physical cravings fortifies the intellect and clears cognitive clutter.",
          textHi: "इंद्रियों के आवेगों पर विजय पाने से संकल्प-शक्ति और तेजस्विता बढ़ती है।",
        },
      ],
      modernRelevance: {
        en: "Aligns seamlessly with intermittent fasting, cellular autophagy, digital detox, and executive willpower training.",
        hi: "इंटरमिटेंट फास्टिंग, शरीर का डिटॉक्सिफिकेशन और मानसिक अनुशासन का प्राचीनतम वैज्ञानिक स्वरूप।",
      },
    },
    tags: ["Ekadashi", "Navaratri", "Fasting", "Anushthana", "Sankalpa"],
  },
];
