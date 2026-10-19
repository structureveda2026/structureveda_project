import type { PuranaItihasaShloka } from "../types/puranaItihasa.types";

export interface GranthaOption {
  id: string;
  name: string;
  enName: string;
  category: "purana" | "itihasa";
  sections: string[];
}

export const GRANTHA_CATALOGUE: GranthaOption[] = [
  {
    id: "shrimad-bhagavata",
    name: "श्रीमद्भागवत महापुराण",
    enName: "Shrimad Bhagavata Mahapurana",
    category: "purana",
    sections: [
      "प्रथम स्कन्ध, अध्याय १ (मंगलाचरण एवं नैमिषारण्य षट्-प्रश्न)",
      "प्रथम स्कन्ध, अध्याय २ (भागवत धर्म एवं भक्ति योग)",
      "द्वितीय स्कन्ध, अध्याय ९ (चतुःश्लोकी भागवत)",
      "दशम स्कन्ध, अध्याय ३१ (गोपी गीत)",
      "एकादश स्कन्ध, अध्याय ७ (अवधूत चौबीस गुरु)",
      "द्वादश स्कन्ध, अध्याय १३ (भागवत माहात्म्य)",
    ],
  },
  {
    id: "bhagavad-gita",
    name: "श्रीमद्भगवद्गीता",
    enName: "Srimad Bhagavad Gita",
    category: "itihasa",
    sections: [
      "अध्याय १: अर्जुनविषादयोग",
      "अध्याय २: सांख्ययोग",
      "अध्याय ३: कर्मयोग",
      "अध्याय ४: ज्ञानकर्मसंन्यासयोग",
      "अध्याय ९: राजविद्याराजगुह्ययोग",
      "अध्याय ११: विश्वरूपदर्शनयोग",
      "अध्याय १२: भक्तियोग",
      "अध्याय १८: मोक्षसंन्यासयोग",
    ],
  },
  {
    id: "valmiki-ramayana",
    name: "वाल्मीकि रामायण",
    enName: "Valmiki Ramayana",
    category: "itihasa",
    sections: [
      "बालकाण्ड (प्रथम सर्ग • संक्षेप रामायण)",
      "अयोध्याकाण्ड",
      "अरण्यकाण्ड",
      "किष्किन्धाकाण्ड",
      "सुन्दरकाण्ड (हनुमत् पराक्रम)",
      "युद्धकाण्ड (आदित्यहृदय स्तोत्र)",
      "उत्तरकाण्ड",
    ],
  },
  {
    id: "mahabharata",
    name: "महाभारत",
    enName: "Mahabharata",
    category: "itihasa",
    sections: [
      "आदिपर्व (मंगलाचरण एवं सर्ग)",
      "सभापर्व",
      "वनपर्व (यक्ष प्रश्न)",
      "उद्योगपर्व (विदुर नीति)",
      "भीष्मपर्व (भगवद्गीता)",
      "शान्तिपर्व (भीष्म धर्मोपदेश)",
      "अनुशासनपर्व (विष्णु सहस्रनाम)",
    ],
  },
  {
    id: "vishnu-purana",
    name: "विष्णु पुराण",
    enName: "Vishnu Purana",
    category: "purana",
    sections: [
      "प्रथमांश (सृष्टि उत्पत्ति एवं ध्रुव-प्रह्लाद चरित्र)",
      "द्वितीयांश (भुवनकोश एवं भूगोल)",
      "तृतीयांश (मन्वन्तर एवं वर्णश्रम धर्म)",
      "चतुर्थांश (सूर्य एवं चन्द्र वंश)",
      "पञ्चमांश (श्रीकृष्ण चरित्र)",
      "षष्ठांश (कलियुग धर्म एवं मोक्ष योग)",
    ],
  },
  {
    id: "shiva-purana",
    name: "शिव पुराण",
    enName: "Shiva Purana",
    category: "purana",
    sections: [
      "विद्येश्वर संहिता (शिव पूजा एवं लिंग प्रतिष्ठा)",
      "रुद्र संहिता (सृष्टि, सती एवं पार्वती खण्ड)",
      "शतरुद्र संहिता (शिव के एकादश रुद्र अवतार)",
      "कोटिरुद्र संहिता (द्वादश ज्योतिर्लिंग माहात्म्य)",
      "उमा संहिता",
      "कैलास संहिता",
      "वायवीय संहिता",
    ],
  },
  {
    id: "markandeya-purana",
    name: "मार्कण्डेय पुराण (दुर्गा सप्तशती)",
    enName: "Markandeya Purana (Devi Mahatmya)",
    category: "purana",
    sections: [
      "दुर्गा सप्तशती: प्रथम चरित्र (मधु-कैटभ वध)",
      "दुर्गा सप्तशती: मध्यम चरित्र (महिषासुर मर्दिनी)",
      "दुर्गा सप्तशती: उत्तर चरित्र (शुम्भ-निशुम्भ वध)",
      "ऋषि मार्कण्डेय प्रश्नोत्तरी",
    ],
  },
  {
    id: "garuda-purana",
    name: "गरुड़ पुराण",
    enName: "Garuda Purana",
    category: "purana",
    sections: [
      "पूर्व खण्ड (आचार एवं कर्मकाण्ड)",
      "उत्तर खण्ड (प्रेतकल्प एवं मोक्ष धर्म)",
    ],
  },
  {
    id: "padma-purana",
    name: "पद्म पुराण",
    enName: "Padma Purana",
    category: "purana",
    sections: [
      "सृष्टिखण्ड",
      "भूमिखण्ड",
      "स्वर्गखण्ड",
      "पातालखण्ड (राम अश्वमेध)",
      "उत्तरखण्ड (गीता एवं भागवत माहात्म्य)",
    ],
  },
];

/**
 * Authentic baseline Shlokas for immediate display and seeding verification
 */
export const INITIAL_PURANA_ITIHASA_SHLOKAS: PuranaItihasaShloka[] = [
  {
    id: "shloka-sb-1-1-1",
    slug: "shrimad-bhagavata-1-1-1",
    vedaId: "shrimad-bhagavata",
    textId: "shrimad-bhagavata",
    nodeId: "sb-skandha-1-adhyaya-1",
    vedaName: "श्रीमद्भागवत महापुराण",
    shakha: "गीताप्रेस गोरखपुर • व्यास परम्परा",
    textName: "प्रथम स्कन्ध, अध्याय १ (मंगलाचरण)",
    sectionRef: "स्कन्ध १, अध्याय १, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "महर्षि कृष्णद्वैपायन वेदव्यास",
    devata: "परमसत्य / भगवान् श्रीकृष्ण",
    chhanda: "शार्दूलविक्रीड़ित",
    sanskrit:
      "ॐ जन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञः स्वराट्\nतेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरयः।\nतेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा\nधाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि॥१॥",
    hindiTranslation:
      "जिससे इस संपूर्ण विश्व की उत्पत्ति, स्थिति और प्रलय होते हैं; जो अन्वय (सृष्टि में व्याप्त) और व्यतिरेक (सृष्टि से परे) रूप से समस्त पदार्थों को जानने वाला तथा स्वराट् (परम स्वतंत्र) है; जिसने आदि-कवि ब्रह्मा के हृदय में संकल्प मात्र से वेद-ज्ञान का विस्तार किया; जिस सत्यस्वरूप परमेश्वर में यह त्रिगुणात्मक प्रपंच उसी प्रकार सत्य प्रतीत होता है जैसे सूर्य की किरणों में जल (मरीचिका) का भ्रम होता है; जो अपने नित्य प्रकाशमय धाम से माया और कपट को सदा दूर रखता है—उस 'परम सत्य' का हम ध्यान करते हैं।",
    englishTranslation:
      "From whom arises the origin, sustenance, and dissolution of this universe; who is directly and indirectly cognizant of all manifestations and is fully self-luminous; who imparted Vedic knowledge into the heart of the first poet Brahma, concerning whom even wise sages are bewildered; in whom the threefold material creation appears real like the illusion of water in sunbeams; who by His own self-luminous abode eternally casts off all illusion—upon that Supreme Absolute Truth we meditate.",
    hinglishTranslation:
      "Jisse is poore brahmaand ki utpatti, sthiti aur pralaya hota hai; jo har vastu ko direct aur indirect roop se jaanta hai aur poornatah swatantra hai; jisne Brahmaji ke hriday mein veda-gyan prakat kiya; jismein maya ka yeh sansaar jal ke bhram ki tarah satya lagta hai—us param satya parmeshwar ka hum dhyan karte hain.",
    padapatha: [
      { word: "जन्मादि", meaning: "उत्पत्ति, स्थिति और प्रलय" },
      { word: "अस्य", meaning: "इस विश्व का" },
      { word: "यतः", meaning: "जिससे होता है" },
      { word: "अन्वयात्", meaning: "व्याप्त रूप से" },
      { word: "इतरतः", meaning: "तथा पृथक रूप से" },
      { word: "अर्थेषु", meaning: "समस्त अर्थों में" },
      { word: "अभिज्ञः", meaning: "सर्वज्ञ" },
      { word: "स्वराट्", meaning: "स्वतंत्र प्रकाशमान" },
      { word: "तेने", meaning: "विस्तार किया" },
      { word: "ब्रह्म", meaning: "वेद ज्ञान को" },
      { word: "हृदा", meaning: "हृदय द्वारा" },
      { word: "सत्यम् परम्", meaning: "परम सत्य का" },
      { word: "धीमहि", meaning: "हम ध्यान करते हैं" },
    ],
    shastricContext:
      "श्रीमद्भागवत का सर्वोच्च मंगलाचरण श्लोक (गायत्री-मंत्र-गर्भित)। ब्रह्मसूत्र के 'जन्माद्यस्य यतः' सूत्र का साक्षात भाष्य।",
    purport:
      "भागवत का यह प्रथम श्लोक ब्रह्मसूत्र (१.१.२) और गायत्री महामंत्र का समन्वय करता है। यहाँ किसी सम्प्रदाय विशेष के देवता के स्थान पर 'सत्यं परं धीमहि' कहकर सनातन धर्म की सार्वभौमिक चेतना को स्थापित किया गया है।",
    orderIndex: 1,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-sb-1-1-2",
    slug: "shrimad-bhagavata-1-1-2",
    vedaId: "shrimad-bhagavata",
    textId: "shrimad-bhagavata",
    nodeId: "sb-skandha-1-adhyaya-1",
    vedaName: "श्रीमद्भागवत महापुराण",
    shakha: "गीताप्रेस गोरखपुर • व्यास परम्परा",
    textName: "प्रथम स्कन्ध, अध्याय १ (परम धर्म)",
    sectionRef: "स्कन्ध १, अध्याय १, श्लोक २",
    mantraNumber: "१.१.२",
    rishi: "महर्षि वेदव्यास",
    devata: "भगवान् नारायण",
    chhanda: "प्रहर्षिणी",
    sanskrit:
      "धर्मः प्रोज्झितकैतवोऽत्र परमो निर्मत्सराणां सतां\nवेद्यं वास्तवमत्र वस्तु शिवदं तापत्रयोन्मूलनम्।\nश्रीमद्भागवते महामुनिकृते किं वा परैरीश्वरः\nसद्यो हृद्यवरुध्यतेऽत्र कृतिभिः शुश्रूषुभिस्तत्क्षणात्॥२॥",
    hindiTranslation:
      "इस श्रीमद्भागवत महापुराण में कपट-रहित (मोक्ष-कामना से भी मुक्त) परम धर्म का निरूपण हुआ है, जो मत्सर (ईर्ष्या) रहित सत्पुरुषों के द्वारा जानने योग्य है। यहाँ कल्याणकारी, तीनों तापों (आधिभौतिक, आधिदैविक, आध्यात्मिक) को समूल नष्ट करने वाला वास्तविक परम तत्त्व जानने योग्य है। महर्षि व्यास द्वारा रचित इस महाग्रन्थ के रहते अन्य शास्त्रों की क्या आवश्यकता? इसके श्रवण की इच्छा मात्र से भगवान तत्क्षण साधक के हृदय में आबद्ध हो जाते हैं।",
    englishTranslation:
      "Completely rejecting all religious activities which are materially motivated, this Bhagavata Purana propounds the highest truth, which is understandable by those devotees who are fully pure in heart. The highest truth is reality distinguished from illusion for the welfare of all. Such truth uproots the threefold miseries. What is the need of any other scripture? As soon as one cultivates the desire to hear this message, the Supreme Lord becomes captive within his heart.",
    hinglishTranslation:
      "Is Shrimad Bhagavata mein kisi bhi swarth ya kapat ke bina param nishkam bhakti dharm bataya gaya hai, jo teeno tapon ko nasht karta hai. Is granth ke shravan ki ichha maatra se bhagwan hriday mein bandh jaate hain.",
    padapatha: [
      { word: "धर्मः", meaning: "परम धर्म" },
      { word: "प्रोज्झित-कैतवः", meaning: "कपट से सर्वथा रहित" },
      { word: "निर्मत्सराणाम्", meaning: "ईर्ष्या-रहित जनों का" },
      { word: "वेद्यम्", meaning: "जानने योग्य" },
      { word: "शिवदम्", meaning: "परम कल्याणकारी" },
      { word: "तापत्रय-उन्मूलनम", meaning: "तीनों तापों को मिटाने वाला" },
    ],
    shastricContext:
      "भागवत धर्म का वैशिष्ट्य: निष्काम प्रेम-भक्ति। सकाम कर्म व कैतव का सर्वथा त्याग।",
    purport:
      "वेदों के कर्मकाण्ड से आगे बढ़कर यह ग्रन्थ केवल विशुद्ध प्रेम और अहैतुकी भक्ति का प्रतिपादन करता है।",
    orderIndex: 2,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-sb-1-1-3",
    slug: "shrimad-bhagavata-1-1-3",
    vedaId: "shrimad-bhagavata",
    textId: "shrimad-bhagavata",
    nodeId: "sb-skandha-1-adhyaya-1",
    vedaName: "श्रीमद्भागवत महापुराण",
    shakha: "गीताप्रेस गोरखपुर • व्यास परम्परा",
    textName: "प्रथम स्कन्ध, अध्याय १ (रसामृत पान)",
    sectionRef: "स्कन्ध १, अध्याय १, श्लोक ३",
    mantraNumber: "१.१.३",
    rishi: "महर्षि वेदव्यास",
    devata: "शुकदेव जी / रसस्वरूप श्रीकृष्ण",
    chhanda: "मालिनी",
    sanskrit:
      "निगमकल्पतरोर्गलितं फलं शुकमुखादमृतद्रवसंयुतम्।\nपिबत भागवतं रसमालयं मुहुरहो रसिका भुवि भावुकाः॥३॥",
    hindiTranslation:
      "हे रसिक एवं भावुक जनो! वेद रूपी कल्पवृक्ष का यह परिपक्व फल (श्रीमद्भागवत), श्रीशुकदेव जी के मुखारविन्द रूपी स्पर्श से अमृत-रस से परिपूर्ण होकर भूतल पर उतरा है। इसमें न छिलका है, न गुठली, यह केवल अमृतमय रस ही रस है। जब तक शरीर में चेतना है, बार-बार इस दिव्य भागवत-रस का आस्वादन करते रहो!",
    englishTranslation:
      "O thoughtful and appreciative souls, drink deeply the nectar of Srimad-Bhagavatam, the fully mature fruit of the desire tree of Vedic literatures. It emanated from the lips of Sri Sukadeva Goswami, and thus it has become even more tasteful, though its nectarean juice was already relishable for all, including liberated souls.",
    hinglishTranslation:
      "Hey rasik aur bhavuk bhakton! Veda roopi kalpavriksha ka yeh paka hua meetha phal, Shukadev ji ke mukh se amrit ban kar aya hai. Is divine ras ka baar-baar paan karo!",
    padapatha: [
      { word: "निगम-कल्पतरोः", meaning: "वेदरूपी कल्पवृक्ष का" },
      { word: "गलितम् फलम्", meaning: "पका हुआ गिरा फल" },
      { word: "शुक-मुखात्", meaning: "शुकदेवजी के मुख से" },
      { word: "अमृत-द्रव-संयुतम्", meaning: "अमृत रस से परिपूर्ण" },
      { word: "पिबत", meaning: "पान करो" },
      { word: "भागवतम् रसम्", meaning: "भागवत के दिव्य रस का" },
    ],
    shastricContext:
      "रसशास्त्र का शिखर श्लोक। समस्त वैदिक वांग्मय का पका हुआ मधुरतम फल श्रीमद्भागवत है।",
    purport:
      "वेदों को कल्पतरु कहा गया है और भागवत को उसका अंतिम परिपक्व फल, जिसमें केवल रस का सार ही निहित है।",
    orderIndex: 3,
    isFeatured: false,
    status: "ACTIVE",
  },
  {
    id: "shloka-bg-2-47",
    slug: "bhagavad-gita-2-47",
    vedaId: "bhagavad-gita",
    textId: "bhagavad-gita",
    nodeId: "bg-adhyaya-2",
    vedaName: "श्रीमद्भगवद्गीता",
    shakha: "महाभारत भीष्मपर्व • श्रीकृष्णार्जुन संवाद",
    textName: "अध्याय २: सांख्ययोग (निष्काम कर्मयोग)",
    sectionRef: "अध्याय २, श्लोक ४७",
    mantraNumber: "२.४७",
    rishi: "भगवान् श्रीकृष्ण",
    devata: "कर्मयोग के अधिष्ठाता परमेश्वर",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥४७॥",
    hindiTranslation:
      "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल की वासना वाले मत बनो और तुम्हारी अकर्म (कर्म न करने/प्रमाद) में भी आसक्ति न हो।",
    englishTranslation:
      "You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
    hinglishTranslation:
      "Tumhara adhikaar sirf karma karne par hai, uske results (fal) par kabhi nahi. Isliye results ki chinta karke karm mat chhodna, aur aalsya/akarma mein bhi mat fasna.",
    padapatha: [
      { word: "कर्मणि", meaning: "कर्म करने में" },
      { word: "एव", meaning: "ही" },
      { word: "अधिकारः", meaning: "तुम्हारा अधिकार" },
      { word: "ते", meaning: "तुम्हारा" },
      { word: "मा", meaning: "मत हो" },
      { word: "फलेषु", meaning: "फलों में" },
      { word: "कदाचन", meaning: "कभी भी" },
      { word: "कर्मफलहेतुः", meaning: "फल का कारण बनने वाला" },
      { word: "सङ्गः", meaning: "आसक्ति" },
      { word: "अकर्मणि", meaning: "कर्म न करने में" },
    ],
    shastricContext:
      "सनातन कर्मयोग का अमर महामंत्र। जीवन में अनासक्ति एवं कर्तव्यनिष्ठा का सर्वकालिक सूत्र।",
    purport:
      "यह श्लोक सनातन दर्शन का आधारस्तंभ है। यह व्यक्ति को फल की चिंता से मुक्त कर वर्तमान कर्म में पूर्ण समर्पण की प्रेरणा देता है।",
    orderIndex: 4,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-bg-4-7",
    slug: "bhagavad-gita-4-7",
    vedaId: "bhagavad-gita",
    textId: "bhagavad-gita",
    nodeId: "bg-adhyaya-4",
    vedaName: "श्रीमद्भगवद्गीता",
    shakha: "महाभारत भीष्मपर्व • श्रीकृष्णार्जुन संवाद",
    textName: "अध्याय ४: ज्ञानकर्मसंन्यासयोग (अवतार रहस्य)",
    sectionRef: "अध्याय ४, श्लोक ७",
    mantraNumber: "४.७",
    rishi: "भगवान् श्रीकृष्ण",
    devata: "परमेश्वर / अवतारी पुरुष",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥७॥",
    hindiTranslation:
      "हे भरतवंशी अर्जुन! जब-जब धर्म की हानि और अधर्म की अभ्युन्नति (वृद्धि) होती है, तब-तब मैं अपने आपको साकार रूप में प्रकट करता हूँ।",
    englishTranslation:
      "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.",
    hinglishTranslation:
      "Jab bhi sansaar mein dharma kamzor hota hai aur adharma badhta hai, tab-tab main khud avatar lekar prakat hota hoon.",
    padapatha: [
      { word: "यदा यदा", meaning: "जब-जब" },
      { word: "हि", meaning: "निश्चय ही" },
      { word: "धर्मस्य", meaning: "धर्म की" },
      { word: "ग्लानिः", meaning: "हानि / पतन" },
      { word: "भवति", meaning: "होती है" },
      { word: "भारत", meaning: "हे अर्जुन" },
      { word: "अभ्युत्थानम्", meaning: "वृद्धि" },
      { word: "अधर्मस्य", meaning: "अधर्म की" },
      { word: "तदा", meaning: "तब" },
      { word: "आत्मानम्", meaning: "अपने स्वरूप को" },
      { word: "सृजामि अहम्", meaning: "मैं प्रकट करता हूँ" },
    ],
    shastricContext:
      "अवतारवाद का मूल सिद्धांत। सृष्टि में धर्म-संतुलन की शाश्वत ईश्वरीय प्रतिज्ञा।",
    purport:
      "सृष्टि का चक्र ईश्वरीय संतुलन पर आधारित है। जब अधर्म की शक्ति बढ़ जाती है, तब परमात्मा लोककल्याण हेतु युगानुरूप अवतरित होते हैं।",
    orderIndex: 5,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-vr-1-1-1",
    slug: "valmiki-ramayana-1-1-1",
    vedaId: "valmiki-ramayana",
    textId: "valmiki-ramayana",
    nodeId: "vr-balakanda-sarga-1",
    vedaName: "वाल्मीकि रामायण",
    shakha: "आदिकाव्य • महर्षि वाल्मीकि विरचित",
    textName: "बालकाण्ड, प्रथम सर्ग (संक्षेप रामायण)",
    sectionRef: "बालकाण्ड, सर्ग १, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "महर्षि वाल्मीकि",
    devata: "देवर्षि नारद / मर्यादा पुरुषोत्तम श्रीराम",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "तपःस्वाध्यायनीरतां तपस्वी वाग्विदां वरम्।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम्॥१॥",
    hindiTranslation:
      "तपस्या और स्वाध्याय में सदा लीन रहने वाले, वाणी के मर्मज्ञों में श्रेष्ठ, मुनिश्रेष्ठ देवर्षि नारद जी से तपस्वी महर्षि वाल्मीकि ने आदरपूर्वक प्रश्न पूछा।",
    englishTranslation:
      "The ascetic sage Valmiki respectfully enquired of the divine sage Narada, who is ever devoted to penance and study of scriptures, and the foremost among eloquent speakers.",
    hinglishTranslation:
      "Tapasya aur shastra-adhyayan mein sadaiv lage rehne wale Devrishi Narad ji se Maharshi Valmiki ne aadar sahit prashna kiya.",
    padapatha: [
      { word: "तपः-स्वाध्याय-निरतम्", meaning: "तप व स्वाध्याय में लीन" },
      { word: "तपस्वी", meaning: "तपस्वी वाल्मीकि ने" },
      { word: "वाग्विदां वरम्", meaning: "वाक्-निपुणों में श्रेष्ठ" },
      { word: "नारदम्", meaning: "देवर्षि नारद से" },
      { word: "परिपप्रच्छ", meaning: "पूछा" },
      { word: "मुनिपुङ्गवम्", meaning: "मुनिश्रेष्ठ को" },
    ],
    shastricContext:
      "संसार के प्रथम काव्य 'रामायण' का मंगलाचरण। मर्यादा पुरुषोत्तम के प्राकट्य का आदि बीज।",
    purport:
      "यहाँ वाल्मीकि जी ने पूछा कि इस संसार में गुणवान, वीर्यवान, धर्मज्ञ और सत्यवक्ता कौन नर है, जिसके उत्तर में नारद जी ने श्रीराम की कथा सुनाई।",
    orderIndex: 6,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-mb-1-1-1",
    slug: "mahabharata-1-1-1",
    vedaId: "mahabharata",
    textId: "mahabharata",
    nodeId: "mb-adiprava-1",
    vedaName: "महाभारत",
    shakha: "महाकाव्य • महर्षि वेदव्यास विरचित",
    textName: "आदिपर्व (मंगलाचरण)",
    sectionRef: "आदिपर्व, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "महर्षि वेदव्यास",
    devata: "नारायण, नर एवं देवी सरस्वती",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "नारायणं नमस्कृत्य नरं चैव नरोत्तमम्।\nदेवीं सरस्वतीं व्यासं ततो जयमुदीरयेत्॥१॥",
    hindiTranslation:
      "सर्वप्रथम भगवान् नारायण, नरों में श्रेष्ठ नर (अर्जुन), भगवती सरस्वती और महर्षि वेदव्यास को नमस्कार करके 'जय' नामक इतिहास-ग्रंथ का उच्चारण करना चाहिए।",
    englishTranslation:
      "Having bowed down unto Narayana, unto Nara the foremost of male beings, unto Goddess Saraswati, and unto sage Vyasa, one should recite the sacred chronicle named Jaya (Mahabharata).",
    hinglishTranslation:
      "Bhagwan Narayana, Nara (Arjuna), Saraswati Mata aur Maharshi Vyasa ko pranam karke 'Jaya' (Mahabharata) ka paath aarambh karein.",
    padapatha: [
      { word: "नारायणम्", meaning: "भगवान नारायण को" },
      { word: "नमस्कृत्य", meaning: "प्रणाम करके" },
      { word: "नरम्", meaning: "नर (अर्जुन) को" },
      { word: "नरोत्तमम्", meaning: "नरों में श्रेष्ठ" },
      { word: "देवीं सरस्वतीम्", meaning: "सरस्वती देवी को" },
      { word: "व्यासम्", meaning: "व्यास जी को" },
      { word: "जयम्", meaning: "'जय' ग्रन्थ को" },
      { word: "उदीरयेत्", meaning: "उच्चारित करे" },
    ],
    shastricContext:
      "महाभारत, समस्त अठारह महापुराणों एवं उपपुराणों का सार्वभौमिक मंगलाचरण श्लोक।",
    purport:
      "व्यास परम्परा के किसी भी ग्रन्थ के आरम्भ में इस मंगलाचरण का पाठ अनिवार्य रूप से किया जाता है।",
    orderIndex: 7,
    isFeatured: true,
    status: "ACTIVE",
  },
  {
    id: "shloka-vp-1-1-1",
    slug: "vishnu-purana-1-1-1",
    vedaId: "vishnu-purana",
    textId: "vishnu-purana",
    nodeId: "vp-amsha-1-adhyaya-1",
    vedaName: "विष्णु पुराण",
    shakha: "वैष्णव महापुराण • महर्षि पराशर प्रोक्त",
    textName: "प्रथमांश, अध्याय १ (मंगलाचरण)",
    sectionRef: "अंश १, अध्याय १, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "महर्षि पराशर",
    devata: "भगवान् विष्णु / वासुदेव",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "ॐ नमो भगवते वासुदेवाय।\nस जयति विबुधवरैर्नमस्कृताङ्घ्रिः सुरवर-दैत्यवरैश्च वन्द्यमानः।\nप्रणतभयहरः सुरासुरार्च्यो विमलयशाः पुरुषोत्तमोऽखिलात्मा॥१॥",
    hindiTranslation:
      "भगवान् वासुदेव को नमस्कार है। वे पुरुषोत्तम भगवान् विष्णु सर्वोत्कृष्ट हैं, जिनके चरणकमलों की वंदना देवश्रेष्ठ और दैत्यश्रेष्ठ दोनों करते हैं, जो शरणागतों के भय का नाश करने वाले, निर्मल यश वाले तथा समस्त चराचर जगत के अंतरात्मा हैं।",
    englishTranslation:
      "Om Namo Bhagavate Vasudevaya. Glorious is Lord Vishnu, the Supreme Person, whose lotus feet are adored by gods and demons alike, who relieves the fears of the surrendered, and who is the inner soul of all beings.",
    hinglishTranslation:
      "Bhagwan Vasudeva ko naman hai. Unke charan-kamal sabhi devo aur asuron dwara poojya hain, aur wo sabhi ke bhay ko door karne wale aatma hain.",
    padapatha: [
      { word: "ॐ नमो भगवते वासुदेवाय", meaning: "भगवान वासुदेव को प्रणाम" },
      { word: "सः जयति", meaning: "उनकी जय हो" },
      { word: "प्रणतभयहरः", meaning: "शरणागतों का भय हरने वाले" },
      { word: "पुरुषोत्तमः", meaning: "पुरुषोत्तम भगवान्" },
      { word: "अखिलात्मा", meaning: "समस्त सृष्टि के आत्मा" },
    ],
    shastricContext:
      "विष्णु पुराण का आदि मंगलाचरण श्लोक। पराशर मुनि द्वारा मैत्रेय के प्रश्नों का प्रारम्भ।",
    purport:
      "विष्णु पुराण को पुराणों में सबसे अधिक व्यवस्थित और प्रामाणिक माना गया है, जिसमें अद्वैत और भक्ति का अद्भुत समन्वय है।",
    orderIndex: 8,
    isFeatured: false,
    status: "ACTIVE",
  },
  {
    id: "shloka-sp-1-1-1",
    slug: "shiva-purana-1-1-1",
    vedaId: "shiva-purana",
    textId: "shiva-purana",
    nodeId: "sp-vidyeshvara-1",
    vedaName: "शिव पुराण",
    shakha: "शैव महापुराण • व्यास परम्परा",
    textName: "विद्येश्वर संहिता (मंगलाचरण)",
    sectionRef: "विद्येश्वर संहिता, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "सूत जी / महर्षि व्यास",
    devata: "भगवान् सदाशिव / महादेव",
    chhanda: "अनुष्टुप्",
    sanskrit:
      "निष्कलं निर्मलं शान्तं सच्चिदानन्दमव्ययम्।\nशिवं वन्दे जगद्वन्द्यं मङ्गलानां च मङ्गलम्॥१॥",
    hindiTranslation:
      "जो कला-रहित (अखण्ड), निर्मल, परम शान्त, सच्चिदानन्द स्वरूप तथा अविनाशी हैं, समस्त मङ्गलों के भी मङ्गल तथा सम्पूर्ण जगत द्वारा वन्दनीय उन भगवान् शिव की मैं वन्दना करता हूँ।",
    englishTranslation:
      "I bow down to Lord Shiva, who is indivisible, pure, peaceful, of the nature of Truth-Consciousness-Bliss, imperishable, the auspiciousness of all auspicious things, and adored by the entire universe.",
    hinglishTranslation:
      "Jo nirmal, shant, sacchidanand swaroop aur amritmay hain, jo sabhi mangalon ke mangal hain, un bhagwan Shiva ko mera pranam.",
    padapatha: [
      { word: "निष्कलम्", meaning: "अखण्ड / निष्कल" },
      { word: "निर्मलम्", meaning: "पवित्र" },
      { word: "शान्तम्", meaning: "परम शान्त" },
      { word: "सच्चिदानन्दम्", meaning: "सत्य-ज्ञान-आनन्द स्वरूप" },
      { word: "अव्ययम्", meaning: "अविनाशी" },
      { word: "शिवम् वन्दे", meaning: "भगवान शिव की वंदना करता हूँ" },
    ],
    shastricContext:
      "शिव पुराण का प्रधान स्तुति मंगलाचरण। निर्गुण और सगुण शिव के तादात्म्य का निरूपण।",
    purport:
      "यह श्लोक सिद्ध करता है कि भगवान शिव केवल संहारकर्ता नहीं अपितु सच्चिदानन्द ब्रह्म हैं।",
    orderIndex: 9,
    isFeatured: false,
    status: "ACTIVE",
  },
];
