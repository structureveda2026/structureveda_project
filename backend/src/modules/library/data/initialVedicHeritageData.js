/**
 * Comprehensive Authentic Vedic Heritage Dataset
 * Sourced from the Government of India's Vedic Heritage Portal (vedicheritage.gov.in)
 * Covering all 4 Vedas: Rigveda, Yajurveda, Samaveda, and Atharvaveda
 */

export const INITIAL_VEDAS = [
  {
    "id": "rigveda",
    "slug": "rigveda",
    "name": "ऋग्वेद",
    "enName": "Rigveda",
    "eyebrow": "प्राचीनतम श्रुति ज्ञान • संहिता",
    "intro": "ऋचाओं और सूक्तों का प्राचीनतम वैदिक संग्रह। स्तुति, ज्ञान, विज्ञान और आध्यात्मिक चेतना का मूल स्रोत।",
    "overviewText": "ऋग्वेद सनातन धर्म का सर्वाधिक प्राचीन और सर्वमान्य आधार ग्रंथ है। इसमें १० मण्डल, १०२८ सूक्त और १०,५५२ ऋचाएँ हैं। इसके प्रधान ऋत्विक 'होतृ' हैं। इसमें अग्नि, इन्द्र, सविता, वरुण, सोम, रुद्र, उषा, सरस्वती आदि देवों की स्तुतियाँ तथा पुरुष सूक्त, नासदीय सूक्त, गायत्री महामंत्र और महामृत्युंजय मंत्र जैसे शाश्वत सत्य निहित हैं।",
    "desc": "ऋचाओं और सूक्तों का प्राचीनतम वैदिक संग्रह। स्तुति, ज्ञान, विज्ञान और आध्यात्मिक चेतना का मूल स्रोत।",
    "stats": "१० मण्डल • १०२८ सूक्त • १०,५५२ मंत्र",
    "priest": "होतृ (Hotri)",
    "badge": "प्रधान श्रुति",
    "imageKey": "card-rigveda.jpg",
    "bannerImage": "banner-rigveda.jpg",
    "quickInfo": {
      "type": "Veda (श्रुति)",
      "language": "Vedic Sanskrit",
      "chiefPriest": "होतृ (Hotri)",
      "mandalCount": "१० मण्डल",
      "suktaCount": "१०२८ सूक्त",
      "chiefRishis": "मधुच्छन्दा, विश्वामित्र, वामदेव, अत्रि, भारद्वाज, वसिष्ठ, भृगु, अंगिरा"
    },
    "rishis": [
      {
        "name": "मधुच्छन्दा वैश्वामित्र",
        "role": "प्रथम मण्डल के द्रष्टा ऋषि (अग्नि सूक्त)"
      },
      {
        "name": "महर्षि विश्वामित्र गाथिन",
        "role": "तृतीय मण्डल द्रष्टा (गायत्री महामंत्र)"
      },
      {
        "name": "ब्रह्मर्षि वसिष्ठ",
        "role": "सप्तम मण्डल द्रष्टा (महामृत्युंजय मंत्र)"
      },
      {
        "name": "नारायण ऋषि",
        "role": "दशम मण्डल द्रष्टा (पुरुष सूक्त)"
      },
      {
        "name": "परमेष्ठी प्रजापति",
        "role": "दशम मण्डल द्रष्टा (नासदीय सूक्त)"
      }
    ],
    "deities": [
      {
        "name": "अग्निदेव (Agni)",
        "title": "यज्ञ पुरोहित व प्रकाशक"
      },
      {
        "name": "सविता (Savitri)",
        "title": "दिव्य तेज एवं बुद्धि प्रेरक"
      },
      {
        "name": "रुद्र (Rudra / Shiva)",
        "title": "कल्याणकारी एवं संहारक"
      },
      {
        "name": "इन्द्र (Indra)",
        "title": "सामर्थ्य व शक्ति के अधिपति"
      },
      {
        "name": "सरस्वती / वाक्",
        "title": "ज्ञान एवं वाणी की देवी"
      }
    ],
    "availableTexts": [
      {
        "title": "१. अग्नि सूक्त (मण्डल १, सूक्त १)",
        "desc": "ऋग्वेद का प्रथम मंगलाचरण सूक्त (९ ऋचाएँ)",
        "mantraId": "rv-1-1-1"
      },
      {
        "title": "२. गायत्री महामंत्र (मण्डल ३, सूक्त ६२.१०)",
        "desc": "वेदमाता गायत्री — बुद्धि व तेज की प्रार्थना",
        "mantraId": "rv-3-62-10"
      },
      {
        "title": "३. महामृत्युंजय मंत्र (मण्डल ७, सूक्त ५९.१२)",
        "desc": "संजीवनी महामंत्र — अकाल मृत्यु व भवभय नाशक",
        "mantraId": "rv-7-59-12"
      },
      {
        "title": "४. पुरुष सूक्त (मण्डल १०, सूक्त ९०)",
        "desc": "विराट् पुरुष व सृष्टि का ब्रह्माण्डीय विज्ञान (१६ ऋचाएँ)",
        "mantraId": "rv-10-90-1"
      },
      {
        "title": "५. नासदीय सूक्त (मण्डल १०, सूक्त १२९)",
        "desc": "सृष्टि उत्पत्ति का दार्शनिक चिंतन (७ ऋचाएँ)",
        "mantraId": "rv-10-129-1"
      },
      {
        "title": "६. संगठन सूक्त (मण्डल १०, सूक्त १९१)",
        "desc": "सामूहिक सद्भाव व विश्व बंधुत्व का सूक्त (४ ऋचाएँ)",
        "mantraId": "rv-10-191-2"
      }
    ],
    "relatedGranthas": [
      {
        "name": "ऐतरेय ब्राह्मण",
        "type": "ब्राह्मण",
        "author": "महीदास ऐतरेय",
        "desc": "सोमयाग, राज्याभिषेक एवं अग्निहोत्र विधान।"
      },
      {
        "name": "कौषीतकि ब्राह्मण",
        "type": "ब्राह्मण",
        "author": "कौषीतकि ऋषि",
        "desc": "हविर्यज्ञ एवं ऋत्विजों के नियम।"
      },
      {
        "name": "ऐतरेय आरण्यक",
        "type": "आरण्यक",
        "author": "ऋषि परंपरा",
        "desc": "प्राण विद्या एवं महाव्रत।"
      },
      {
        "name": "ऐतरेय उपनिषद",
        "type": "उपनिषद",
        "author": "ऋग्वेद",
        "desc": "महावाक्य 'प्रज्ञानं ब्रह्म' (चेतना ही ब्रह्म है)।"
      }
    ],
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "yajurveda",
    "slug": "yajurveda",
    "name": "यजुर्वेद",
    "enName": "Yajurveda",
    "eyebrow": "कर्म, याज्ञिक क्रिया एवं ब्रह्मज्ञान • संहिता",
    "intro": "यज्ञ, कर्म एवं अनुष्ठानिक क्रियाओं का वेद। शुक्ल और कृष्ण शाखा परंपरा में विभक्त।",
    "overviewText": "यजुर्वेद यज्ञीय कर्मकाण्ड, हविर्दान, राष्ट्र-कल्याण और दार्शनिक चिंतन का सर्वप्रमुख वेद है। इसके प्रधान ऋत्विक 'अध्वर्यु' हैं। यजुर्वेद दो महान परंपराओं में विभक्त है: १. शुक्ल यजुर्वेद (वाजसनेयि - विशुद्ध मंत्र भाग) और २. कृष्ण यजुर्वेद (चरक - मंत्र व गद्य ब्राह्मण मिश्रित भाग)। इसमें रुद्राध्याय (शतरुद्रिय/रुद्राभिषेक), शिवसंकल्प सूक्त तथा ईशावास्योपनिषद् जैसे दिव्य अध्याय समाहित हैं।",
    "desc": "यज्ञ, कर्म एवं अनुष्ठानिक क्रियाओं का वेद। शुक्ल और कृष्ण शाखा परंपरा में विभक्त।",
    "stats": "४० अध्याय • १९७५ मंत्र • शुक्ल व कृष्ण शाखाएँ",
    "priest": "अध्वर्यु (Adhvaryu)",
    "badge": "कर्मकाण्ड एवं ज्ञान",
    "imageKey": "card-yajurveda.jpg",
    "bannerImage": "banner-yajurveda.jpg",
    "quickInfo": {
      "type": "Veda (श्रुति)",
      "language": "Vedic Sanskrit",
      "chiefPriest": "अध्वर्यु (Adhvaryu)",
      "mandalCount": "४० अध्याय (शुक्ल)",
      "suktaCount": "१९७५ मंत्र (माध्यन्दिना)",
      "chiefRishis": "महर्षि याज्ञवल्क्य, तित्तिरि, वैशम्पायन, कठ, मैत्रेय, कात्यायन"
    },
    "rishis": [
      {
        "name": "महर्षि याज्ञवल्क्य वाजसनेय",
        "role": "शुक्ल यजुर्वेद के प्रधान द्रष्टा ऋषि"
      },
      {
        "name": "महर्षि तित्तिरि",
        "role": "कृष्ण यजुर्वेद तैत्तिरीय शाखा के प्रवर्तक"
      },
      {
        "name": "महर्षि कठ",
        "role": "काठक शाखा एवं कठोपनिषद के द्रष्टा"
      },
      {
        "name": "महर्षि कात्यायन",
        "role": "शुक्ल यजुर्वेद श्रौतसूत्र एवं सर्वानुक्रमणी प्रणेता"
      },
      {
        "name": "महर्षि पारस्कर",
        "role": "शुक्ल यजुर्वेद गृह्यसूत्र प्रणेता"
      }
    ],
    "deities": [
      {
        "name": "भगवान रुद्र (Sri Rudra / Shiva)",
        "title": "अध्याय १६ के अधिष्ठाता (शतरुद्रिय)"
      },
      {
        "name": "सविता / सूर्य",
        "title": "ईश्वर एवं ज्ञान के पोषक"
      },
      {
        "name": "अग्नि एवं सोम",
        "title": "यज्ञ के आधारभूत देवता"
      },
      {
        "name": "प्रजापति / पुरुष",
        "title": "सृष्टिकर्ता परमेश्वर"
      }
    ],
    "availableTexts": [
      {
        "title": "१. दर्शपूर्णमास याग (अध्याय १ - इषे त्वोर्जे त्वा...)",
        "desc": "यजुर्वेद का प्रथम अध्याय व मंगलाचरण",
        "mantraId": "vs-1-1"
      },
      {
        "title": "२. रुद्राध्याय / शतरुद्रिय (अध्याय १६ - नमस्ते रुद्र मन्यव...)",
        "desc": "रुद्राभिषेक का मूल आधार (६६ मंत्र)",
        "mantraId": "vs-16-1"
      },
      {
        "title": "३. शिवसंकल्प सूक्त (अध्याय ३४ - तन्मे मनः शिवसंकल्पमस्तु)",
        "desc": "मन की पवित्रता और दिव्य संकल्प (६ मंत्र)",
        "mantraId": "vs-34-1"
      },
      {
        "title": "४. ईशावास्योपनिषद (अध्याय ४० - ईशा वास्यमिदं सर्वं...)",
        "desc": "कर्मयोग एवं आत्मज्ञान का शिरोमणि ग्रंथ (१८ मंत्र)",
        "mantraId": "vs-40-1"
      },
      {
        "title": "५. तैत्तिरीय संहिता (कृष्ण यजुर्वेद काण्ड १)",
        "desc": "दर्शपूर्णमास एवं सोमयाग विधि",
        "mantraId": "ts-1-1-1"
      }
    ],
    "relatedGranthas": [
      {
        "name": "शतपथ ब्राह्मण",
        "type": "ब्राह्मण",
        "author": "महर्षि याज्ञवल्क्य",
        "desc": "१४ काण्ड, १०० प्रपाठक — सबसे विशाल ब्राह्मण ग्रंथ।"
      },
      {
        "name": "तैत्तिरीय ब्राह्मण",
        "type": "ब्राह्मण",
        "author": "तित्तिरि ऋषि",
        "desc": "नक्षत्रेष्टि, सौत्रामणी एवं अश्वमेध विधान।"
      },
      {
        "name": "तैत्तिरीय आरण्यक",
        "type": "आरण्यक",
        "author": "कृष्ण यजुर्वेद",
        "desc": "१० प्रपाठक — ब्रह्मयज्ञ एवं प्राणोपासना।"
      },
      {
        "name": "बृहदारण्यक उपनिषद",
        "type": "उपनिषद",
        "author": "महर्षि याज्ञवल्क्य",
        "desc": "महावाक्य 'अहं ब्रह्मास्मि' (मैं ही ब्रह्म हूँ)।"
      },
      {
        "name": "ईशावास्योपनिषद",
        "type": "उपनिषद",
        "author": "शुक्ल यजुर्वेद",
        "desc": "त्यागपूर्वक भोग का सनातन सिद्धांत।"
      },
      {
        "name": "कठोपनिषद",
        "type": "उपनिषद",
        "author": "कठ ऋषि",
        "desc": "यम और नचिकेता का आत्मविद्या संवाद।"
      }
    ],
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "samaveda",
    "slug": "samaveda",
    "name": "सामवेद",
    "enName": "Samaveda",
    "eyebrow": "गान, संगीत एवं भक्ति चेतना • संहिता",
    "intro": "गायकी, संगीतमय ऋचाओं एवं सामगान का दिव्य वेद। भगवान श्रीकृष्ण ने गीता में कहा: 'वेदानां सामवेदोऽस्मि'।",
    "overviewText": "सामवेद वैदिक संगीत, स्वर-साधना और उपासना का वेद है। इसमें १८७५ मंत्र हैं। इसके प्रधान ऋत्विक 'उद्गातृ' हैं। इसमें कौथुम, राणायनीय और जैमिनीय शाखाएँ हैं। छान्दोग्योपनिषद (महावाक्य: तत्त्वमसि) इसी वेद का मुख्य अंग है।",
    "desc": "गायकी, संगीतमय ऋचाओं एवं सामगान का दिव्य वेद।",
    "stats": "१८७५ मंत्र • कौथुम, राणायनीय, जैमिनीय",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "संगीत एवं उपासना",
    "imageKey": "card-samaveda.jpg",
    "bannerImage": "banner-samaveda.jpg",
    "quickInfo": {
      "type": "Veda (श्रुति)",
      "language": "Vedic Sanskrit",
      "chiefPriest": "उद्गातृ (Udgatri)",
      "mandalCount": "२ आर्चिक (पूर्व व उत्तर)",
      "suktaCount": "१८७५ मंत्र",
      "chiefRishis": "महर्षि जैमिनि, सुकर्मा, कौथुम, राणायन"
    },
    "rishis": [
      {
        "name": "महर्षि जैमिनि",
        "role": "सामवेद के प्रधान प्रवर्तक ऋषि"
      },
      {
        "name": "महर्षि भारद्वाज",
        "role": "आग्नेय सामगान के द्रष्टा ऋषि"
      },
      {
        "name": "महर्षि कौथुम",
        "role": "कौथुम शाखा के प्रवर्तक"
      },
      {
        "name": "महर्षि राणायन",
        "role": "राणायनीय शाखा के प्रवर्तक"
      }
    ],
    "deities": [
      {
        "name": "अग्निदेव (Agni)",
        "title": "आग्नेय काण्ड के अधिष्ठाता"
      },
      {
        "name": "इन्द्रदेव (Indra)",
        "title": "सामगान द्वारा स्तुत मुख्य देवता"
      },
      {
        "name": "पवमान सोम (Soma)",
        "title": "दिव्य अमृत, उल्लास व आध्यात्मिक चेतना"
      }
    ],
    "availableTexts": [
      {
        "title": "१. आग्नेय काण्ड (अग्न आ याहि वीतये...)",
        "desc": "सामवेद का प्रथम सामगान मंगलाचरण",
        "mantraId": "sv-1-1-1"
      },
      {
        "title": "२. ऐन्द्र पर्व (त्वमग्ने यज्ञानां...)",
        "desc": "इन्द्र व अग्नि स्तुति सामगान",
        "mantraId": "sv-1-1-2"
      },
      {
        "title": "३. पवमान काण्ड (उच्चा ते जातमन्धसो...)",
        "desc": "पवमान सोम का दिव्य सामगान",
        "mantraId": "sv-2-1-1"
      }
    ],
    "relatedGranthas": [
      {
        "name": "ताण्ड्य महाब्राह्मण (पंचविंश)",
        "type": "ब्राह्मण",
        "desc": "विशाल साम वैदिक याग विधान।"
      },
      {
        "name": "षड्विंश ब्राह्मण",
        "type": "ब्राह्मण",
        "desc": "अद्भुत शांति कर्म एवं अनुष्ठान।"
      },
      {
        "name": "सामविधान ब्राह्मण",
        "type": "ब्राह्मण",
        "desc": "सामगानों के प्रायश्चित्त व फल।"
      },
      {
        "name": "छान्दोग्य उपनिषद",
        "type": "उपनिषद",
        "desc": "महावाक्य 'तत्त्वमसि' एवं ओंकार उद्गीथ उपासना।"
      },
      {
        "name": "केनोपनिषद",
        "type": "उपनिषद",
        "desc": "परम ब्रह्म एवं आत्मज्ञान का उपदेश।"
      }
    ],
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "atharvaveda",
    "slug": "atharvaveda",
    "name": "अथर्ववेद",
    "enName": "Atharvaveda",
    "eyebrow": "ब्रह्मविद्या, आयुर्वेद, भैषज्य एवं राष्ट्र रक्षा • संहिता",
    "intro": "ब्रह्मवेद — आयुर्वेद, भैषज्य, शांति-पौष्टिक कर्म, राष्ट्र-रक्षा, गणित, वास्तु एवं गूढ़ अध्यात्म का संग्रह।",
    "overviewText": "अथर्ववेद को ब्रह्मवेद या भैषज्य वेद भी कहा जाता है। इसमें २० काण्ड, ७३० सूक्त और ५,९७७ मंत्र हैं। इसके प्रधान ऋत्विक 'ब्रह्मा' हैं। इसमें भूमि सूक्त (विश्व का प्रथम पर्यावरण गान - 'माता भूमिः पुत्रोऽहं पृथिव्याः'), मुण्डकोपनिषद (सत्यमेव जयते), माण्डूक्योपनिषद और प्रश्नोपनिषद जैसे अमूल्य ग्रंथ हैं।",
    "desc": "ब्रह्मविद्या, आयुर्वेद, भैषज्य एवं राष्ट्र रक्षा का वेद।",
    "stats": "२० काण्ड • ७३० सूक्त • ५,९७७ मंत्र",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "ब्रह्मवेद एवं विज्ञान",
    "imageKey": "card-atharvaveda.jpg",
    "bannerImage": "banner-atharvaveda.jpg",
    "quickInfo": {
      "type": "Veda (श्रुति)",
      "language": "Vedic Sanskrit",
      "chiefPriest": "ब्रह्मा (Brahma)",
      "mandalCount": "२० काण्ड",
      "suktaCount": "७३० सूक्त",
      "chiefRishis": "महर्षि अथर्वा, अंगिरा, शौनक, पिप्पलाद"
    },
    "rishis": [
      {
        "name": "महर्षि अथर्वा",
        "role": "अथर्ववेद के प्रधान द्रष्टा ऋषि"
      },
      {
        "name": "महर्षि अंगिरा",
        "role": "अंगिरस परंपरा एवं भैषज्य विद्या प्रवर्तक"
      },
      {
        "name": "महर्षि शौनक",
        "role": "शौनक शाखा एवं चरणव्यूह प्रणेता"
      },
      {
        "name": "महर्षि पिप्पलाद",
        "role": "पिप्पलाद शाखा एवं प्रश्नोपनिषद द्रष्टा"
      }
    ],
    "deities": [
      {
        "name": "वाचस्पति (Vachaspati)",
        "title": "वाणी, ज्ञान एवं मेधा के अधिपति"
      },
      {
        "name": "माता भूमि (Prithvi Devi)",
        "title": "समस्त प्राणियों की पोषणकर्त्री मातृभूमि"
      },
      {
        "name": "विश्वेदेवा एवं ब्रह्म",
        "title": "सर्वशांति एवं ब्रह्माण्डीय संतुलन"
      }
    ],
    "availableTexts": [
      {
        "title": "१. मेधा जनन सूक्त (काण्ड १, सूक्त १ - ये त्रिषप्ताः परियन्ति...)",
        "desc": "वाचस्पति देव द्वारा बुद्धि व मेधा संवर्धन",
        "mantraId": "av-1-1-1"
      },
      {
        "title": "२. भूमि सूक्त / पृथ्वी सूक्त (काण्ड १२, सूक्त १ - माता भूमिः पुत्रोऽहं...)",
        "desc": "विश्व का प्रथम पर्यावरण व मातृभूमि राष्ट्रगान",
        "mantraId": "av-12-1-12"
      },
      {
        "title": "३. विश्व शांति सूक्त (काण्ड १९, सूक्त ९ - द्यौः शान्तिरन्तरिक्षं...)",
        "desc": "समस्त लोकों एवं प्रकृति में शांति की वैश्विक प्रार्थना",
        "mantraId": "av-19-9-14"
      }
    ],
    "relatedGranthas": [
      {
        "name": "गोपथ ब्राह्मण",
        "type": "ब्राह्मण",
        "desc": "अथर्ववेद का एकमात्र उपलब्ध प्रामाणिक ब्राह्मण ग्रंथ।"
      },
      {
        "name": "मुण्डक उपनिषद",
        "type": "उपनिषद",
        "desc": "राष्ट्रीय आदर्श वाक्य 'सत्यमेव जयते' का मूल स्रोत।"
      },
      {
        "name": "माण्डूक्य उपनिषद",
        "type": "उपनिषद",
        "desc": "महावाक्य 'अयमात्मा ब्रह्म' एवं ओंकार की चार अवस्थाएँ।"
      },
      {
        "name": "प्रश्नोपनिषद",
        "type": "उपनिषद",
        "desc": "महर्षि पिप्पलाद से ६ मुनियों के दार्शनिक प्रश्न।"
      }
    ],
    "orderIndex": 4,
    "status": "ACTIVE"
  }
];

export const INITIAL_VEDA_NODES = [
  {
    "id": "shakala-shakha",
    "slug": "shakala-shakha",
    "vedaId": "rigveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "शाकल शाखा (Shakala Shakha)",
    "enName": "Shakala Shakha",
    "desc": "ऋग्वेद की वर्तमान में उपलब्ध मुख्य एवं प्रामाणिक शाखा। पतंजलि के महाभाष्य के अनुसार ऋग्वेद की २१ शाखाएँ थीं, जिनमें शाकल शाखा सर्वाधिक सुरक्षित व मान्य है।",
    "stats": "१० मण्डल • १०२८ सूक्त • १०,५५२ ऋचाएँ",
    "priest": "होतृ (Hotri)",
    "badge": "प्रधान शाखा",
    "imageKey": "card-shakala-shakha.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "rigveda-samhita",
    "slug": "rigveda-samhita",
    "vedaId": "rigveda",
    "parentId": "shakala-shakha",
    "nodeType": "SAMHITA",
    "name": "ऋग्वेद संहिता (मूल मंत्र भाग)",
    "enName": "Rigveda Samhita",
    "desc": "१० मण्डल, १०२८ सूक्त और १०,५५२ ऋचाओं का पवित्रतम संकलन। अग्नि सूक्त, पुरुष सूक्त, नासदीय सूक्त, गायत्री महामंत्र और महामृत्युंजय मंत्र का उद्गम स्थल।",
    "stats": "१० मण्डल • १०२८ सूक्त • १०,५५२ ऋचाएँ",
    "priest": "होतृ (Hotri)",
    "badge": "संहिता ग्रंथ",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-1",
    "slug": "rv-sukta-1",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-1",
    "nodeType": "SUKTA",
    "name": "१. अग्नि सूक्त (मण्डल १, सूक्त १)",
    "enName": "Agni Sukta (Mandala 1, Sukta 1)",
    "desc": "ऋग्वेद का प्रथम सूक्त — ऋषि मधुच्छन्दा वैश्वामित्र कृत ९ ऋचाओं में अग्निदेव की महत्ता, पुरोहित रूप एवं हविर्वाहक स्वरूप का निरूपण।",
    "stats": "९ ऋचाएँ • गायत्री छंद",
    "priest": "होतृ (Hotri)",
    "badge": "प्रथम सूक्त",
    "imageKey": "card-sukta-agni.jpg",
    "mantraId": "rv-1-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-gayatri",
    "slug": "rv-sukta-gayatri",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "SUKTA",
    "name": "२. गायत्री महामंत्र (मण्डल ३, सूक्त ६२)",
    "enName": "Gayatri Mantra (Mandala 3, Sukta 62)",
    "desc": "वेदमाता गायत्री — सविता देव के परम तेज का ध्यान एवं सद्बुद्धि की प्रार्थना।",
    "stats": "मंत्र १० • २४ अक्षर",
    "badge": "महामंत्र",
    "imageKey": "card-sukta-gayatri.jpg",
    "mantraId": "rv-3-62-10",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-mrityunjaya",
    "slug": "rv-sukta-mrityunjaya",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "SUKTA",
    "name": "३. महामृत्युंजय मंत्र (मण्डल ७, सूक्त ५९)",
    "enName": "Mahamrityunjaya Mantra (Mandala 7, Sukta 59)",
    "desc": "संजीवनी महामंत्र — त्र्यम्बक रुद्र की उपासना से मृत्यु-भय व भव-बंधन से मुक्ति।",
    "stats": "मंत्र १२ • अनुष्टुप् छंद",
    "badge": "महामंत्र",
    "imageKey": "card-sukta-mrityunjaya.jpg",
    "mantraId": "rv-7-59-12",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-purusha",
    "slug": "rv-sukta-purusha",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "SUKTA",
    "name": "४. पुरुष सूक्त (मण्डल १०, सूक्त ९०)",
    "enName": "Purusha Sukta (Mandala 10, Sukta 90)",
    "desc": "ब्रह्माण्ड के विराट् पुरुष का स्वरूप और सृष्टि उत्पत्ति का वैदिक विज्ञान।",
    "stats": "१६ ऋचाएँ • अनुष्टुप् छंद",
    "badge": "सूक्त",
    "imageKey": "card-sukta-purusha.jpg",
    "mantraId": "rv-10-90-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-nasadiya",
    "slug": "rv-sukta-nasadiya",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "SUKTA",
    "name": "५. नासदीय सूक्त (मण्डल १०, सूक्त १२९)",
    "enName": "Nasadiya Sukta (Creation Hymn)",
    "desc": "सृष्टि के पूर्व क्या था? विश्व का सर्वाधिक प्राचीन एवं गूढ़ दार्शनिक सूक्त।",
    "stats": "७ ऋचाएँ • त्रिष्टुप् छंद",
    "badge": "दार्शनिक सूक्त",
    "imageKey": "card-sukta-nasadiya.jpg",
    "mantraId": "rv-10-129-1",
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-sangathan",
    "slug": "rv-sukta-sangathan",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "SUKTA",
    "name": "६. संगठन सूक्त (मण्डल १०, सूक्त १९१)",
    "enName": "Sangathan Sukta (Unity Hymn)",
    "desc": "'सं गच्छध्वं सं वदध्वं' — सामूहिक एकता, सद्भाव और विश्व बंधुत्व का संदेश।",
    "stats": "४ ऋचाएँ • अनुष्टुप् छंद",
    "badge": "सूक्त",
    "imageKey": "card-sukta-samgathan.jpg",
    "mantraId": "rv-10-191-2",
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "rigveda-brahmana",
    "slug": "rigveda-brahmana",
    "vedaId": "rigveda",
    "parentId": "shakala-shakha",
    "nodeType": "BRAHMANA",
    "name": "ख. ब्राह्मण ग्रंथ (ऐतरेय, कौषीतकि)",
    "enName": "Rigveda Brahmana Texts",
    "desc": "यज्ञ-विधान, कर्मकाण्ड एवं वैदिक आख्यानों का विस्तृत निरूपण।",
    "stats": "२ ब्राह्मण ग्रंथ",
    "badge": "ब्राह्मण ग्रंथ",
    "imageKey": "card-brahmana.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "rigveda-aranyaka",
    "slug": "rigveda-aranyaka",
    "vedaId": "rigveda",
    "parentId": "shakala-shakha",
    "nodeType": "ARANYAKA",
    "name": "ग. आरण्यक ग्रंथ (ऐतरेय, कौषीतकि)",
    "enName": "Rigveda Aranyaka Texts",
    "desc": "अरण्य (वन) में चिंतन योग्य दार्शनिक एवं प्राण-विद्या परक ग्रंथ।",
    "stats": "२ आरण्यक ग्रंथ",
    "badge": "आरण्यक",
    "imageKey": "card-aranyaka.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "rigveda-upanishad",
    "slug": "rigveda-upanishad",
    "vedaId": "rigveda",
    "parentId": "shakala-shakha",
    "nodeType": "UPANISHAD",
    "name": "घ. उपनिषद ग्रंथ (ऐतरेय, कौषीतकि)",
    "enName": "Rigveda Upanishad Texts",
    "desc": "परम आत्मतत्व एवं ब्रह्मविद्या का अमृतमय उपदेश ('प्रज्ञानं ब्रह्म')।",
    "stats": "२ मुख्य उपनिषद",
    "badge": "उपनिषद",
    "imageKey": "card-upanishad.jpg",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "rigveda-kalpa-sutra",
    "slug": "rigveda-kalpa-sutra",
    "vedaId": "rigveda",
    "parentId": "shakala-shakha",
    "nodeType": "SUTRA",
    "name": "ङ. ऋग्वेद के कल्प, सूत्र व प्रातिशाख्य ग्रंथ",
    "enName": "Rigveda Kalpa, Sutras & Pratishakhya",
    "desc": "आश्वलायन व शांखायन श्रौतसूत्र, गृह्यसूत्र एवं शौनक प्रातिशाख्य।",
    "stats": "सूत्र एवं प्रातिशाख्य",
    "badge": "सूत्र ग्रंथ",
    "imageKey": "card-kalpa.jpg",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "shukla-yajurveda",
    "slug": "shukla-yajurveda",
    "vedaId": "yajurveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "A. शुक्ल यजुर्वेद (Shukla Yajurveda)",
    "enName": "Shukla Yajurveda (Vajasaneyi)",
    "desc": "वाजसनेयि परंपरा — याज्ञवल्क्य ऋषि द्वारा सूर्य देव से प्राप्त विशुद्ध मंत्र भाग। इसमें माध्यन्दिना एवं काण्व शाखाएँ प्रमुख हैं।",
    "stats": "४० अध्याय • १९७५ मन्त्र",
    "priest": "अध्वर्यु (Adhvaryu)",
    "badge": "मुख्य परंपरा",
    "imageKey": "card-yajurveda.jpg",
    "mantraId": "yj-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "madhyandina-shakha",
    "slug": "madhyandina-shakha",
    "vedaId": "yajurveda",
    "parentId": "shukla-yajurveda",
    "nodeType": "SHAKHA",
    "name": "1. माध्यन्दिना शाखा (Madhyandina)",
    "enName": "Madhyandina Shakha",
    "desc": "उत्तर व मध्य भारत में सर्वाधिक प्रचलित वाजसनेयि संहिता शाखा।",
    "stats": "४० अध्याय • १९७५ मन्त्र",
    "badge": "शाखा",
    "imageKey": "card-madhyandina-shakha.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "madhyandina-samhita",
    "slug": "madhyandina-samhita",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-shakha",
    "nodeType": "SAMHITA",
    "name": "क. माध्यन्दिना संहिता (वाजसनेयि संहिता)",
    "enName": "Madhyandina Samhita (Vajasaneyi)",
    "desc": "४० अध्याय, १९७५ मंत्र — रुद्राध्याय (अध्याय १६), शिवसंकल्प (अध्याय ३४), ईशावास्य (अध्याय ४०)।",
    "stats": "४० अध्याय • १९७५ मंत्र",
    "badge": "संहिता",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "vs-adhyaya-1",
    "slug": "vs-adhyaya-1",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-samhita",
    "nodeType": "ADHYAYA",
    "name": "१. अध्याय १: दर्शपूर्णमास याग (इषे त्वोर्जे त्वा...)",
    "enName": "Adhyaya 1: Darshapurnamasa Yagya",
    "desc": "यजुर्वेद का प्रथम अध्याय — पवित्र पलाश शाखा छेदन एवं हवि निर्माण।",
    "stats": "३१ मंत्र",
    "badge": "अध्याय",
    "imageKey": "card-samhita.jpg",
    "mantraId": "vs-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "vs-adhyaya-16",
    "slug": "vs-adhyaya-16",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-samhita",
    "nodeType": "ADHYAYA",
    "name": "२. अध्याय १६: रुद्राध्याय / शतरुद्रिय (नमस्ते रुद्र मन्यव...)",
    "enName": "Adhyaya 16: Sri Rudram / Shatarudriya",
    "desc": "भगवान रुद्र के १००+ पावन नामों एवं विश्वरूप की स्तुति (रुद्राभिषेक का मूल आधार)।",
    "stats": "६६ मंत्र • नमकम-चमकम",
    "badge": "रुद्राध्याय",
    "imageKey": "card-sukta-rudra.jpg",
    "mantraId": "vs-16-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "vs-adhyaya-34",
    "slug": "vs-adhyaya-34",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-samhita",
    "nodeType": "ADHYAYA",
    "name": "३. अध्याय ३४: शिवसंकल्प सूक्त (तन्मे मनः शिवसंकल्पमस्तु)",
    "enName": "Adhyaya 34: Shiva Sankalpa Sukta",
    "desc": "मन की पवित्रता, उदात्त संकल्प एवं मानसिक एकाग्रता का महासूक्त।",
    "stats": "६ मंत्र",
    "badge": "सूक्त",
    "imageKey": "card-sukta-mrityunjaya.jpg",
    "mantraId": "vs-34-1",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "vs-adhyaya-40",
    "slug": "vs-adhyaya-40",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-samhita",
    "nodeType": "ADHYAYA",
    "name": "४. अध्याय ४०: ईशावास्योपनिषद (ईशा वास्यमिदं सर्वं...)",
    "enName": "Adhyaya 40: Isha Upanishad",
    "desc": "यजुर्वेद का अंतिम अध्याय — कर्मयोग, त्याग और आत्मज्ञान का मूल आधार।",
    "stats": "१८ मंत्र",
    "badge": "उपनिषद",
    "imageKey": "card-grantha-isha.jpg",
    "mantraId": "vs-40-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "madhyandina-shatapatha",
    "slug": "madhyandina-shatapatha",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-shakha",
    "nodeType": "BRAHMANA",
    "name": "ख. शतपथ ब्राह्मण (माध्यन्दिना पाठ)",
    "enName": "Shatapatha Brahmana (Madhyandina)",
    "desc": "१४ काण्ड, १०० प्रपाठक, ४३८ ब्राह्मण — वैदिक वांग्मय का सबसे विशाल ब्राह्मण ग्रंथ।",
    "stats": "१४ काण्ड • १०० प्रपाठक",
    "badge": "ब्राह्मण",
    "imageKey": "card-grantha-shatapatha.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "madhyandina-upanishad",
    "slug": "madhyandina-upanishad",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-shakha",
    "nodeType": "UPANISHAD",
    "name": "ग. उपनिषद (ईशावास्योपनिषद और बृहदारण्यकोपनिषद)",
    "enName": "Upanishads (Isha & Brihadaranyaka)",
    "desc": "ईशावास्योपनिषद् और बृहदारण्यकोपनिषद् ('अहं ब्रह्मास्मि')।",
    "stats": "ईश व बृहदारण्यक",
    "badge": "उपनिषद",
    "imageKey": "card-grantha-brihadaranyaka.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "kanva-shakha",
    "slug": "kanva-shakha",
    "vedaId": "yajurveda",
    "parentId": "shukla-yajurveda",
    "nodeType": "SHAKHA",
    "name": "2. काण्व शाखा (Kanva)",
    "enName": "Kanva Shakha",
    "desc": "दक्षिण व पूर्व भारत में प्रचलित वाजसनेयि शाखा।",
    "stats": "४० अध्याय • २०८६ मंत्र",
    "badge": "शाखा",
    "imageKey": "card-kanva-shakha.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "shukla-kalpa-sutras",
    "slug": "shukla-kalpa-sutras",
    "vedaId": "yajurveda",
    "parentId": "shukla-yajurveda",
    "nodeType": "SUTRA",
    "name": "3. शुक्ल यजुर्वेद के कल्प व सूत्र ग्रंथ (पारस्कर, कात्यायन)",
    "enName": "Shukla Yajurveda Kalpa & Sutras",
    "desc": "पारस्कर गृह्यसूत्र, कात्यायन श्रौतसूत्र, शुल्बसूत्र एवं शुक्ल यजुः प्रातिशाख्य।",
    "stats": "पारस्कर, कात्यायन आदि सूत्र",
    "badge": "सूत्र ग्रंथ",
    "imageKey": "card-shrautasutra.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "krishna-yajurveda",
    "slug": "krishna-yajurveda",
    "vedaId": "yajurveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "B. कृष्ण यजुर्वेद (Krishna Yajurveda)",
    "enName": "Krishna Yajurveda (Charaka)",
    "desc": "चरक परंपरा — मन्त्र एवं ब्राह्मण भाग का समन्वित संकलन। तैत्तिरीय, मैत्रायणी, काठक एवं कपिष्ठल शाखाएँ।",
    "stats": "४ मुख्य शाखाएँ",
    "priest": "अध्वर्यु (Adhvaryu)",
    "badge": "मुख्य परंपरा",
    "imageKey": "card-yajurveda.jpg",
    "mantraId": "yj-kr-1-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "taittiriya-shakha",
    "slug": "taittiriya-shakha",
    "vedaId": "yajurveda",
    "parentId": "krishna-yajurveda",
    "nodeType": "SHAKHA",
    "name": "1. तैत्तिरीय शाखा (Taittiriya Shakha)",
    "enName": "Taittiriya Shakha",
    "desc": "दक्षिण भारत में सर्वाधिक प्रचलित एवं संरक्षित कृष्ण यजुर्वेद की मुख्य शाखा।",
    "stats": "७ काण्ड • ४४ प्रपाठक",
    "badge": "शाखा",
    "imageKey": "card-taittiriya-shakha.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "taittiriya-samhita",
    "slug": "taittiriya-samhita",
    "vedaId": "yajurveda",
    "parentId": "taittiriya-shakha",
    "nodeType": "SAMHITA",
    "name": "क. तैत्तिरीय संहिता",
    "enName": "Taittiriya Samhita",
    "desc": "७ काण्ड, ४४ प्रपाठक, ६५१ अनुवाक, २१९८ कण्डिकाएँ। दर्शपूर्णमास, राजसूय, वाजपेय एवं सोमयाग विधान।",
    "stats": "७ काण्ड • ४४ प्रपाठक",
    "badge": "संहिता",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "katha-shakha",
    "slug": "katha-shakha",
    "vedaId": "yajurveda",
    "parentId": "krishna-yajurveda",
    "nodeType": "SHAKHA",
    "name": "2. कठ / काठक शाखा (Kathaka Samhita & कठोपनिषद)",
    "enName": "Katha (Kathaka) Shakha",
    "desc": "काठक संहिता (५ खंड, ४० स्थानक) एवं विश्वप्रसिद्ध कठोपनिषद (यम-नचिकेता संवाद)।",
    "stats": "काठक संहिता व कठोपनिषद",
    "badge": "शाखा",
    "imageKey": "card-grantha-katha.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "maitrayani-shakha",
    "slug": "maitrayani-shakha",
    "vedaId": "yajurveda",
    "parentId": "krishna-yajurveda",
    "nodeType": "SHAKHA",
    "name": "3. मैत्रायणी शाखा (Maitrayani Samhita)",
    "enName": "Maitrayani Shakha",
    "desc": "४ काण्ड, ५४ प्रपाठक — गुजरात व महाराष्ट्र में सुरक्षित प्राचीन शाखा।",
    "stats": "४ काण्ड • ५४ प्रपाठक",
    "badge": "शाखा",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "kapisthala-shakha",
    "slug": "kapisthala-shakha",
    "vedaId": "yajurveda",
    "parentId": "krishna-yajurveda",
    "nodeType": "SHAKHA",
    "name": "4. कपिष्ठल शाखा (Kapisthala Samhita)",
    "enName": "Kapisthala Shakha",
    "desc": "८ अष्टक — कपिष्ठल कठ संहिता (खंडित उपलब्ध अंश)।",
    "stats": "८ अष्टक (अपूर्ण)",
    "badge": "शाखा",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "krishna-kalpa-sutras",
    "slug": "krishna-kalpa-sutras",
    "vedaId": "yajurveda",
    "parentId": "krishna-yajurveda",
    "nodeType": "SUTRA",
    "name": "5. कृष्ण यजुर्वेद के सूत्र ग्रंथ (आपस्तम्ब, बौधायन, मानव)",
    "enName": "Krishna Yajurveda Sutra Texts",
    "desc": "बौधायन, आपस्तम्ब, सत्याषाढ़, वैखानस, भारद्वाज, मानव, वाराह कल्पसूत्र।",
    "stats": "श्रौत, गृह्य, धर्म व शुल्बसूत्र",
    "badge": "सूत्र ग्रंथ",
    "imageKey": "card-kalpa.jpg",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "kauthuma-shakha",
    "slug": "kauthuma-shakha",
    "vedaId": "samaveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "कौथुम शाखा (Kauthuma Shakha)",
    "enName": "Kauthuma Shakha",
    "desc": "सामवेद की सर्वाधिक प्रसिद्ध एवं प्रामाणिक शाखा। उत्तर भारत, गुजरात, मिथिला तथा बंगाल में प्रचलित। इसमें पूर्वार्चिक, उत्तरार्चिक तथा चार प्रकार के गान (ग्रामगेय, आरण्यगेय, ऊह, ऊह्य गान) समाहित हैं।",
    "stats": "१८७५ मन्त्र • पूर्वार्चिक व उत्तरार्चिक",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "प्रधान शाखा",
    "imageKey": "card-kauthuma-shakha.jpg",
    "mantraId": "sv-1-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "kauthuma-samhita",
    "slug": "kauthuma-samhita",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "SAMHITA",
    "name": "क. कौथुम सामवेद संहिता (पूर्वार्चिक व उत्तरार्चिक)",
    "enName": "Kauthuma Samaveda Samhita",
    "desc": "पूर्वार्चिक (६ प्रपाठक, ६५० ऋचाएँ) और उत्तरार्चिक (९ प्रपाठक, १२२५ ऋचाएँ) — कुल १८७५ मंत्र।",
    "stats": "१८७५ मंत्र • सामगान",
    "badge": "संहिता ग्रंथ",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "sv-purvarchika-1",
    "slug": "sv-purvarchika-1",
    "vedaId": "samaveda",
    "parentId": "kauthuma-samhita",
    "nodeType": "SUKTA",
    "name": "१. पूर्वार्चिक: आग्नेय पर्व (अग्न आ याहि वीतये...)",
    "enName": "Purvarchika: Agneya Parva",
    "desc": "सामवेद का प्रथम मंगलाचरण मंत्र — उद्गाता द्वारा अग्निदेव का संगीतमय आवाहन।",
    "stats": "प्रपाठक १ • मंत्र १.१",
    "badge": "पर्व",
    "mantraId": "sv-1-1-1",
    "imageKey": "card-sukta-agni.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "sv-purvarchika-2",
    "slug": "sv-purvarchika-2",
    "vedaId": "samaveda",
    "parentId": "kauthuma-samhita",
    "nodeType": "SUKTA",
    "name": "२. पूर्वार्चिक: ऐन्द्र पर्व (त्वमग्ने यज्ञानां...)",
    "enName": "Purvarchika: Aindra Parva",
    "desc": "इन्द्र व अग्नि स्तुति सामगान — दिव्य तेज एवं सामर्थ्य का सामगान।",
    "stats": "प्रपाठक १ • मंत्र १.२",
    "badge": "पर्व",
    "mantraId": "sv-1-1-2",
    "imageKey": "card-sukta-agni.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "sv-uttararchika-1",
    "slug": "sv-uttararchika-1",
    "vedaId": "samaveda",
    "parentId": "kauthuma-samhita",
    "nodeType": "SUKTA",
    "name": "३. उत्तरार्चिक: पवमान काण्ड (उच्चा ते जातमन्धसो...)",
    "enName": "Uttararchika: Pavamana Kanda",
    "desc": "पवमान सोम का दिव्य सामगान — आत्मिक आनंद एवं अमृतत्व का गान।",
    "stats": "प्रपाठक २ • मंत्र २.१",
    "badge": "पर्व",
    "mantraId": "sv-2-1-1",
    "imageKey": "card-sukta-soma.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "kauthuma-brahmanas",
    "slug": "kauthuma-brahmanas",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "BRAHMANA",
    "name": "ख. कौथुम ब्राह्मण ग्रंथ (ताण्ड्य, षड्विंश, सामविधान आदि)",
    "enName": "Kauthuma Brahmana Texts",
    "desc": "ताण्ड्य (पंचविंश/महाब्राह्मण), षड्विंश, सामविधान, आर्षेय, देवताध्याय, उपनिषद्, संहितोपनिषद्, वंश ब्राह्मण।",
    "stats": "८ ब्राह्मण ग्रंथ",
    "badge": "ब्राह्मण",
    "imageKey": "card-brahmana.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "kauthuma-upanishad",
    "slug": "kauthuma-upanishad",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "UPANISHAD",
    "name": "ग. उपनिषद (छान्दोग्य उपनिषद)",
    "enName": "Chandogya Upanishad",
    "desc": "सामवेद का सबसे विशाल उपनिषद — महावाक्य 'तत्त्वमसि', ओंकार उद्गीथ उपासना एवं शांडिल्य विद्या।",
    "stats": "८ प्रपाठक • 'तत्त्वमसि'",
    "badge": "मुख्य उपनिषद",
    "imageKey": "card-grantha-chandogya.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "jaiminiya-shakha",
    "slug": "jaiminiya-shakha",
    "vedaId": "samaveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "जैमिनीय शाखा (Jaiminiya Shakha / Talavakara)",
    "enName": "Jaiminiya Shakha",
    "desc": "सामवेद की दक्षिण भारत (विशेषतः केरल एवं तमिलनाडु के नम्बूदरी ब्राह्मणों) में संरक्षित प्राचीन शाखा, जिसे तलवकार शाखा भी कहते हैं। इसमें जैमिनीय संहिता (१६८७ मन्त्र), जैमिनीय ब्राह्मण एवं केनोपनिषद् सम्मिलित हैं।",
    "stats": "१६८७ मन्त्र • जैमिनीय ब्राह्मण व केनोपनिषद्",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "शाखा",
    "imageKey": "card-jaiminiya-shakha.jpg",
    "mantraId": null,
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "shaunaka-shakha",
    "slug": "shaunaka-shakha",
    "vedaId": "atharvaveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "शौनक शाखा (Shaunaka Shakha)",
    "enName": "Shaunaka Shakha",
    "desc": "अथर्ववेद की वर्तमान में पूर्णतः सुरक्षित एवं सर्वाधिक प्रचलित प्रधान संहिता शाखा। इसमें २० काण्ड, ७३० सूक्त तथा ५,९७७ मन्त्र संकलित हैं। इसके प्रमुख ऋत्विक् 'ब्रह्मा' हैं, जो सम्पूर्ण यज्ञ की रक्षा व संचालन करते हैं।",
    "stats": "२० काण्ड • ७३० सूक्त • ५,९७७ मन्त्र",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "प्रधान शाखा",
    "imageKey": "card-shaunaka-shakha.jpg",
    "mantraId": "av-1-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "shaunaka-samhita",
    "slug": "shaunaka-samhita",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SAMHITA",
    "name": "क. शौनक अथर्ववेद संहिता",
    "enName": "Shaunaka Atharvaveda Samhita",
    "desc": "२० काण्ड, ७३० सूक्त, ५९७७ मंत्र — मेधा सूक्त, भूमि सूक्त, शांति सूक्त, स्कम्भ सूक्त।",
    "stats": "२० काण्ड • ७३० सूक्त",
    "badge": "संहिता ग्रंथ",
    "imageKey": "card-samhita.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-1",
    "slug": "av-kanda-1",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-samhita",
    "nodeType": "SUKTA",
    "name": "१. मेधा जनन सूक्त (काण्ड १, सूक्त १)",
    "enName": "Medha Janana Sukta (Kanda 1, Sukta 1)",
    "desc": "अथर्ववेद का प्रथम सूक्त — वाणी के अधिपति वाचस्पति से प्रज्ञा, बुद्धि और बल की प्रार्थना।",
    "stats": "४ मंत्र • अनुष्टुप्",
    "badge": "सूक्त",
    "mantraId": "av-1-1-1",
    "imageKey": "card-sukta-vak.jpg",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "av-prithvi-sukta",
    "slug": "av-prithvi-sukta",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-samhita",
    "nodeType": "SUKTA",
    "name": "२. भूमि सूक्त / पृथ्वी सूक्त (काण्ड १२, सूक्त १)",
    "enName": "Bhumi Sukta (Earth Hymn - Kanda 12, Sukta 1)",
    "desc": "विश्व का प्रथम पर्यावरण व राष्ट्रीय गान — 'माता भूमिः पुत्रोऽहं पृथिव्याः' (धरती मेरी माता है, मैं उसका पुत्र हूँ)।",
    "stats": "६३ ऋचाएँ • अनुष्टुप् व त्रिष्टुप्",
    "badge": "राष्ट्रीय सूक्त",
    "mantraId": "av-12-1-12",
    "imageKey": "card-sukta-prithvi.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "av-shanti-sukta",
    "slug": "av-shanti-sukta",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-samhita",
    "nodeType": "SUKTA",
    "name": "३. विश्व शांति सूक्त (काण्ड १९, सूक्त ९)",
    "enName": "Vishva Shanti Sukta (Kanda 19, Sukta 9)",
    "desc": "समस्त लोकों, आकाश, अंतरिक्ष, वनस्पति एवं चेतना में शांति की वैश्विक वैदिक प्रार्थना।",
    "stats": "१४ मंत्र",
    "badge": "शांति सूक्त",
    "mantraId": "av-19-9-14",
    "imageKey": "card-sukta-shanti.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "gopatha-brahmana",
    "slug": "gopatha-brahmana",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "BRAHMANA",
    "name": "ख. गोपथ ब्राह्मण (Gopatha Brahmana)",
    "enName": "Gopatha Brahmana",
    "desc": "अथर्ववेद का एकमात्र उपलब्ध ब्राह्मण — पूर्व गोपथ व उत्तर गोपथ, ओंकार एवं गायत्री की महत्ता।",
    "stats": "११ प्रपाठक",
    "badge": "ब्राह्मण",
    "imageKey": "card-brahmana.jpg",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "atharvaveda-upanishads",
    "slug": "atharvaveda-upanishads",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "UPANISHAD",
    "name": "ग. उपनिषद ग्रंथ (मुण्डक, माण्डूक्य, प्रश्न)",
    "enName": "Atharvaveda Major Upanishads",
    "desc": "मुण्डकोपनिषद ('सत्यमेव जयते'), माण्डूक्य ('अयमात्मा ब्रह्म') एवं प्रश्नोपनिषद।",
    "stats": "३ प्रधान उपनिषद",
    "badge": "उपनिषद",
    "imageKey": "card-upanishad.jpg",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "paippalada-shakha",
    "slug": "paippalada-shakha",
    "vedaId": "atharvaveda",
    "parentId": null,
    "nodeType": "SHAKHA",
    "name": "पिप्पलाद शाखा (Paippalada Shakha)",
    "enName": "Paippalada Shakha",
    "desc": "महर्षि पिप्पलाद द्वारा प्रवर्तित अथर्ववेद की अत्यन्त प्राचीन शाखा। इसके दुर्लभ तालपत्र हस्तलेख उड़ीसा, बंगाल तथा कश्मीर (शारदा लिपि) में सुरक्षित हैं। प्रश्नोपनिषद् इसी शाखा का मुख्य दार्शनिक आधार है।",
    "stats": "२० काण्ड • दुर्लभ प्राचीन पाठ",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "प्राचीन शाखा",
    "imageKey": "card-paippalada-shakha.jpg",
    "mantraId": null,
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "rv-mandala-1",
    "slug": "rv-mandala-1",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "MANDALA",
    "name": "प्रथम मण्डल (Mandala 1)",
    "enName": "Rigveda Mandala 1",
    "desc": "ऋग्वेद का प्रथम मण्डल जिसमें १९१ सूक्त हैं। यह सूक्त १ (अग्नि सूक्त) से प्रारंभ होता है। इसके प्रमुख ऋषि मधुच्छन्दा, मेधातिथि, दीर्घतमा, अगस्त्य आदि हैं।",
    "stats": "१९१ सूक्त • २०१६ मंत्र",
    "priest": "होतृ (Hotri)",
    "badge": "प्रथम मण्डल",
    "imageKey": "card-mandala-1.jpg",
    "mantraId": "rv-1-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "rv-mandala-3",
    "slug": "rv-mandala-3",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "MANDALA",
    "name": "तृतीय मण्डल (Mandala 3 - विश्वामित्र वंश)",
    "enName": "Rigveda Mandala 3 (Vishvamitra Family)",
    "desc": "महर्षि विश्वामित्र और उनके वंशजों द्वारा दृष्ट कुल-मण्डल। इसमें ६२ सूक्त हैं। इसी मण्डल के ६२वें सूक्त में सनातन धर्म का प्राणभूत 'गायत्री महामंत्र' प्रतिष्ठापित है।",
    "stats": "६२ सूक्त • ६१७ मंत्र",
    "priest": "होतृ (Hotri)",
    "badge": "कुल मण्डल",
    "imageKey": "card-mandala-3.jpg",
    "mantraId": "rv-3-62-10",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-3-62",
    "slug": "rv-sukta-3-62",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-3",
    "nodeType": "SUKTA",
    "name": "२. सविता / गायत्री सूक्त (मण्डल ३, सूक्त ६२)",
    "enName": "Savitr / Gayatri Sukta (Mandala 3, Sukta 62)",
    "desc": "महर्षि विश्वामित्र द्वारा दृष्ट सूक्त — वेदमाता गायत्री महामंत्र (३.६२.१०) जिसमें सविता देव के परम तेज का ध्यान एवं सद्बुद्धि की प्रार्थना निहित है।",
    "stats": "१८ ऋचाएँ • निचृद् गायत्री छंद",
    "priest": "होतृ (Hotri)",
    "badge": "गायत्री महामंत्र",
    "imageKey": "card-sukta-gayatri.jpg",
    "mantraId": "rv-3-62-10",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "rv-mandala-7",
    "slug": "rv-mandala-7",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "MANDALA",
    "name": "सप्तम मण्डल (Mandala 7 - वसिष्ठ वंश)",
    "enName": "Rigveda Mandala 7 (Vasishtha Family)",
    "desc": "ब्रह्मर्षि वसिष्ठ और उनके वंशजों द्वारा दृष्ट कुल-मण्डल। इसमें १०४ सूक्त हैं। इसी मण्डल के ५९वें सूक्त में भगवान शिव का अमोघ 'महामृत्युंजय संजीवनी मंत्र' तथा वरुण एवं इंद्र स्तुतियाँ निहित हैं।",
    "stats": "१०४ सूक्त • ८४१ मंत्र",
    "priest": "होतृ (Hotri)",
    "badge": "कुल मण्डल",
    "imageKey": "card-mandala-7.jpg",
    "mantraId": "rv-7-59-12",
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-7-59",
    "slug": "rv-sukta-7-59",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-7",
    "nodeType": "SUKTA",
    "name": "३. महामृत्युंजय सूक्त / रुद्र सूक्त (मण्डल ७, सूक्त ५९)",
    "enName": "Mahamrityunjaya Sukta (Mandala 7, Sukta 59)",
    "desc": "ब्रह्मर्षि वसिष्ठ द्वारा दृष्ट मरुद्गण एवं रुद्र सूक्त — ऋचा १२ में संजीवनी महामृत्युंजय मंत्र निहित है जो अकाल मृत्यु और भव-बंधन से मुक्ति दिलाता है।",
    "stats": "१२ ऋचाएँ • अनुष्टुप् छंद",
    "priest": "होतृ (Hotri)",
    "badge": "संजीवनी महामंत्र",
    "imageKey": "card-sukta-mrityunjaya.jpg",
    "mantraId": "rv-7-59-12",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "rv-mandala-10",
    "slug": "rv-mandala-10",
    "vedaId": "rigveda",
    "parentId": "rigveda-samhita",
    "nodeType": "MANDALA",
    "name": "दशम मण्डल (Mandala 10 - दार्शनिक एवं सृष्टि सूक्त)",
    "enName": "Rigveda Mandala 10",
    "desc": "ऋग्वेद का अंतिम एवं सर्वाधिक गहन दार्शनिक मण्डल। इसमें १९१ सूक्त और १७५४ मंत्र हैं। इसमें पुरुष सूक्त, नासदीय सूक्त, हिरण्यगर्भ सूक्त, वाक् सूक्त (देवी सूक्त) और ऋग्वेद का अंतिम संगठन सूक्त समाहित हैं।",
    "stats": "१९१ सूक्त • १७५४ मंत्र",
    "priest": "होतृ (Hotri)",
    "badge": "दार्शनिक मण्डल",
    "imageKey": "card-mandala-10.jpg",
    "mantraId": "rv-10-90-1",
    "orderIndex": 10,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-10-90",
    "slug": "rv-sukta-10-90",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-10",
    "nodeType": "SUKTA",
    "name": "४. पुरुष सूक्त (मण्डल १०, सूक्त ९०)",
    "enName": "Purusha Sukta (Mandala 10, Sukta 90)",
    "desc": "नारायण ऋषि द्वारा दृष्ट विराट् पुरुष सूक्त — संपूर्ण ब्रह्माण्ड के विराट् स्वरूप, सृष्टि की उत्पत्ति एवं यज्ञीय व्यवस्था का सार्वभौमिक वैदिक विज्ञान।",
    "stats": "१६ ऋचाएँ • अनुष्टुप् व त्रिष्टुप् छंद",
    "priest": "होतृ (Hotri)",
    "badge": "विराट् पुरुष",
    "imageKey": "card-sukta-purusha.jpg",
    "mantraId": "rv-10-90-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-10-121",
    "slug": "rv-sukta-10-121",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-10",
    "nodeType": "SUKTA",
    "name": "५. हिरण्यगर्भ सूक्त (मण्डल १०, सूक्त १२१)",
    "enName": "Hiranyagarbha Sukta (Mandala 10, Sukta 121)",
    "desc": "हिरण्यगर्भ प्राजापत्य द्वारा दृष्ट ब्रह्माण्ड उत्पत्ति सूक्त — 'कस्मै देवाय हविषा विधेम' के ध्रुवपद द्वारा आनंदमय प्रजापति परमेश्वर का निरूपण।",
    "stats": "१० ऋचाएँ • त्रिष्टुप् छंद",
    "priest": "होतृ (Hotri)",
    "badge": "सृष्टि सूक्त",
    "imageKey": "card-sukta-hiranyagarbha.jpg",
    "mantraId": "rv-10-121-1",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-10-125",
    "slug": "rv-sukta-10-125",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-10",
    "nodeType": "SUKTA",
    "name": "६. देवी सूक्त / वाक् सूक्त (मण्डल १०, सूक्त १२५)",
    "enName": "Devi Sukta / Vak Sukta (Mandala 10, Sukta 125)",
    "desc": "ब्रह्मवादिनी विदुषी वागाम्भृणी द्वारा दृष्ट अद्वैत पराशक्ति सूक्त — 'अहं रुद्रेभिर्वसुभिश्चरामि'। शाक्त उपासना एवं दुर्गा सप्तशती का मूल वैदिक आधार।",
    "stats": "८ ऋचाएँ • त्रिष्टुप् व जगती छंद",
    "priest": "होतृ (Hotri)",
    "badge": "पराशक्ति सूक्त",
    "imageKey": "card-sukta-devi.jpg",
    "mantraId": "rv-10-125-1",
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-10-129",
    "slug": "rv-sukta-10-129",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-10",
    "nodeType": "SUKTA",
    "name": "७. नासदीय सूक्त (मण्डल १०, सूक्त १२९)",
    "enName": "Nasadiya Sukta (Mandala 10, Sukta 129)",
    "desc": "परमेष्ठी प्रजापति द्वारा दृष्ट विश्व का सर्वाधिक प्राचीन एवं गूढ़ दार्शनिक सूक्त — सृष्टि के पूर्व क्या था? सत् और असत् के अतीत अनिर्वचनीय सत्य का अन्वेषण।",
    "stats": "७ ऋचाएँ • त्रिष्टुप् छंद",
    "priest": "होतृ (Hotri)",
    "badge": "परम दार्शनिक सूक्त",
    "imageKey": "card-sukta-nasadiya.jpg",
    "mantraId": "rv-10-129-1",
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "rv-sukta-10-191",
    "slug": "rv-sukta-10-191",
    "vedaId": "rigveda",
    "parentId": "rv-mandala-10",
    "nodeType": "SUKTA",
    "name": "८. संज्ञान / संगठन सूक्त (मण्डल १०, सूक्त १९१)",
    "enName": "Samjnana / Sangathan Sukta (Mandala 10, Sukta 191)",
    "desc": "ऋषि संवनन आङ्गिरस द्वारा दृष्ट ऋग्वेद का अंतिम सूक्त — 'सं गच्छध्वं सं वदध्वं'। विश्व बंधुत्व, सामाजिक समरसता, लोकतांत्रिक संवाद एवं सामूहिक एकता का अमर संदेश।",
    "stats": "४ ऋचाएँ • अनुष्टुप् व त्रिष्टुप् छंद",
    "priest": "होतृ (Hotri)",
    "badge": "विश्व एकता सूक्त",
    "imageKey": "card-sukta-samgathan.jpg",
    "mantraId": "rv-10-191-1",
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "vajasaneyi-samhita",
    "slug": "vajasaneyi-samhita",
    "vedaId": "yajurveda",
    "parentId": "madhyandina-shakha",
    "nodeType": "SAMHITA",
    "name": "क. वाजसनेयि संहिता (मूल मन्त्र भाग)",
    "enName": "Vajasaneyi Samhita",
    "desc": "४० अध्याय, ३०३ अनुवाक, १९७५ कण्डिकाएँ — दर्शपूर्णमास, शतरुद्रीय, शिवसंकल्प, ईशावास्योपनिषद।",
    "stats": "४० अध्याय • १९७५ मन्त्र",
    "badge": "संहिता ग्रंथ",
    "imageKey": "card-samhita.jpg",
    "mantraId": "yj-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-1",
    "slug": "yj-adhyaya-1",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "ADHYAYA",
    "name": "१. दर्शपूर्णमास याग (अध्याय १ - इषे त्वोर्जे त्वा...)",
    "enName": "Adhyaya 1 (Darshapurnamasa Yajna)",
    "desc": "यजुर्वेद का प्रथम अध्याय। पलाश शाखा छेदन, वत्स अपाकरण, यज्ञीय पवित्रता एवं अन्न-ऊर्जा संवर्धन।",
    "stats": "३१ मन्त्र • अध्याय १",
    "badge": "अध्याय",
    "imageKey": "card-yagya.jpg",
    "mantraId": "yj-1-1",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-16",
    "slug": "yj-adhyaya-16",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "ADHYAYA",
    "name": "२. शतरुद्रीय / रुद्राध्याय (अध्याय १६ - नमस्ते रुद्र मन्यव...)",
    "enName": "Adhyaya 16 (Shri Rudram / Namakam)",
    "desc": "रुद्राष्टाध्यायी का पंचम अध्याय (नमकम्)। भगवान शिव के सर्वव्यापक, कल्याणकारी एवं संहारक स्वरूप की ६६ ऋचाओं में वन्दना।",
    "stats": "६६ मन्त्र • अध्याय १६",
    "badge": "अध्याय",
    "imageKey": "card-rudra.jpg",
    "mantraId": "yj-16-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-22",
    "slug": "yj-adhyaya-22",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "ADHYAYA",
    "name": "३. राष्ट्र समृद्धि प्रार्थना (अध्याय २२ - आ ब्रह्मन् ब्राह्मणो...)",
    "enName": "Adhyaya 22 (Rashtra Samriddhi & Ashvamedha)",
    "desc": "राष्ट्र की सर्वांगीण समृद्धि, शूरवीर योद्धा, दुग्धवती गौएं, मेधावी युवा और समयानुसार वर्षा की दिव्य वैदिक प्रार्थना।",
    "stats": "३४ मन्त्र • अध्याय २२",
    "badge": "अध्याय",
    "imageKey": "card-rashtra.jpg",
    "mantraId": "yj-22-22",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-34",
    "slug": "yj-adhyaya-34",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "ADHYAYA",
    "name": "४. शिवसंकल्प सूक्त (अध्याय ३४ - तन्मे मनः शिवसंकल्पमस्तु)",
    "enName": "Adhyaya 34 (Shiva Sankalpa Sukta)",
    "desc": "वैदिक मनोविज्ञान का शिखर। मन की असीम शक्ति, ज्योतिर्मय स्वरूप और कल्याणकारी संकल्प की ६ अमर ऋचाएँ।",
    "stats": "६ मन्त्र • अध्याय ३४",
    "badge": "सूक्त / अध्याय",
    "imageKey": "card-shivasankalpa.jpg",
    "mantraId": "yj-34-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-36",
    "slug": "yj-adhyaya-36",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "ADHYAYA",
    "name": "५. विश्व शान्ति पाठ (अध्याय ३६ - द्यौः शान्तिरन्तरिक्षं...)",
    "enName": "Adhyaya 36 (Vishva Shanti Patha)",
    "desc": "ब्रह्माण्डीय पर्यावरण और चराचर जगत में शान्ति, सन्तुलन और सामंजस्य का सार्वभौमिक वैदिक महामन्त्र।",
    "stats": "२४ मन्त्र • अध्याय ३६",
    "badge": "अध्याय",
    "imageKey": "card-shanti.jpg",
    "mantraId": "yj-36-17",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "yj-adhyaya-40",
    "slug": "yj-adhyaya-40",
    "vedaId": "yajurveda",
    "parentId": "vajasaneyi-samhita",
    "nodeType": "UPANISHAD",
    "name": "६. ईशावास्योपनिषद (अध्याय ४० - ईशा वास्यमिदं सर्वम्...)",
    "enName": "Adhyaya 40 (Ishavasya Upanishad)",
    "desc": "यजुर्वेद का अंतिम ४०वाँ अध्याय। उपनिषद् साहित्य का मुकुटमणि — त्यागपूर्वक भोग, कर्मयोग एवं आत्म-साक्षात्कार का अद्वैत दर्शन।",
    "stats": "१८ मन्त्र • अध्याय ४०",
    "badge": "उपनिषद",
    "imageKey": "card-ishavasya.jpg",
    "mantraId": "yj-40-1",
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "taittiriya-upanishad",
    "slug": "taittiriya-upanishad",
    "vedaId": "yajurveda",
    "parentId": "taittiriya-shakha",
    "nodeType": "UPANISHAD",
    "name": "ख. तैत्तिरीय उपनिषद् (शिक्षावल्ली)",
    "enName": "Taittiriya Upanishad (Shikshavalli)",
    "desc": "शिक्षावल्ली, ब्रह्मानन्दवल्ली एवं भृगुवल्ली। 'सत्यं वद धर्मं चर' और 'मातृदेवो भव पितृदेवो भव' के अमर उपदेश।",
    "stats": "३ वल्लियाँ • शिक्षावल्ली",
    "badge": "उपनिषद",
    "imageKey": "card-upanishad.jpg",
    "mantraId": "yj-kr-1-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "sv-poorvarchik",
    "slug": "sv-poorvarchik",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "ARCHIKA",
    "name": "पूर्वार्चिक (Poorvarchik - First Chanting Book)",
    "enName": "Poorvarchik (First Part)",
    "desc": "कौथुम सामवेद संहिता का प्रथम भाग जिसमें ६ प्रपाठक, ६५० ऋचाएँ हैं। यह आग्नेय काण्ड, ऐन्द्र पर्व, पवमान काण्ड तथा आरण्य काण्ड में विभाजित है।",
    "stats": "६ प्रपाठक • ६५० मन्त्र",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "पूर्वार्चिक",
    "imageKey": "card-samhita.jpg",
    "mantraId": "sv-1-1-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "sv-agneya-kanda",
    "slug": "sv-agneya-kanda",
    "vedaId": "samaveda",
    "parentId": "sv-poorvarchik",
    "nodeType": "KANDA",
    "name": "आग्नेय काण्ड (Agneya Kanda)",
    "enName": "Agneya Kanda (Agni Hymns)",
    "desc": "पूर्वार्चिक का प्रथम प्रपाठक (काण्ड)। इसमें अग्निदेव की स्तुति में ११४ सामगान मन्त्र हैं, जिनका शुभारम्भ 'अग्न आ याहि वीतये' से होता है।",
    "stats": "११४ मन्त्र • प्रपाठक १",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "काण्ड",
    "imageKey": "card-sukta-agni.jpg",
    "mantraId": "sv-1-1-1",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "sv-aindra-parva",
    "slug": "sv-aindra-parva",
    "vedaId": "samaveda",
    "parentId": "sv-poorvarchik",
    "nodeType": "PARVA",
    "name": "ऐन्द्र पर्व (Aindra Parva)",
    "enName": "Aindra Parva (Indra Hymns)",
    "desc": "पूर्वार्चिक का द्वितीय, तृतीय एवं चतुर्थ प्रपाठक। इसमें देवाधिदेव इन्द्र की असीम शक्ति, पराक्रम, सोमपान तथा विजय की महिमा में ३५२ सामगान मन्त्र हैं।",
    "stats": "३५२ मन्त्र • प्रपाठक २-४",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "पर्व",
    "imageKey": "card-sukta-indra.jpg",
    "mantraId": "sv-1-2-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "sv-pavamana-kanda",
    "slug": "sv-pavamana-kanda",
    "vedaId": "samaveda",
    "parentId": "sv-poorvarchik",
    "nodeType": "KANDA",
    "name": "पवमान काण्ड (Pavamana Kanda)",
    "enName": "Pavamana Kanda (Soma Hymns)",
    "desc": "पूर्वार्चिक का पंचम प्रपाठक। इसमें पवमान सोम (शोधित अमृत रस) की स्तुति में ११९ साम मन्त्र हैं, जो आन्तरिक शुद्धि और चेतना के उत्थान का सामगान हैं।",
    "stats": "११९ मन्त्र • प्रपाठक ५",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "काण्ड",
    "imageKey": "card-sukta-soma.jpg",
    "mantraId": "sv-2-1-1",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "sv-aranya-kanda",
    "slug": "sv-aranya-kanda",
    "vedaId": "samaveda",
    "parentId": "sv-poorvarchik",
    "nodeType": "KANDA",
    "name": "आरण्य काण्ड (Aranya Kanda)",
    "enName": "Aranya Kanda (Forest Chants)",
    "desc": "पूर्वार्चिक का षष्ठ प्रपाठक। यह अरण्य (वन के एकान्त) में ऋषि-मुनियों द्वारा गाए जाने वाले ५५ अत्यन्त गूढ़, रहस्यमयी एवं आध्यात्मिक सामगानों का संग्रह है।",
    "stats": "५५ मन्त्र • प्रपाठक ६",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "काण्ड",
    "imageKey": "card-aranya-kanda.jpg",
    "mantraId": null,
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "sv-uttararchik",
    "slug": "sv-uttararchik",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "ARCHIKA",
    "name": "उत्तरार्चिक (Uttararchik - Ritual Hymns)",
    "enName": "Uttararchik (Second Part)",
    "desc": "कौथुम संहिता का द्वितीय भाग जिसमें ९ प्रपाठक, ४०० सूक्त (तृच समूह) तथा १२२५ मन्त्र हैं। यह सोमयाग, अग्निष्टोम, राजसूय आदि श्रौत याज्ञिक अनुष्ठानों में उद्गाता द्वारा गाया जाता है।",
    "stats": "९ प्रपाठक • ४०० तृच • १२२५ मन्त्र",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "उत्तरार्चिक",
    "imageKey": "card-uttararchik.jpg",
    "mantraId": "sv-2-1-1",
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "chandogya-udgitha",
    "slug": "chandogya-udgitha",
    "vedaId": "samaveda",
    "parentId": "kauthuma-shakha",
    "nodeType": "UPANISHAD",
    "name": "छान्दोग्योपनिषद्: उद्गीथ विद्या (Chandogya Upanishad: Udgitha Vidya)",
    "enName": "Chandogya Upanishad: Udgitha Vidya",
    "desc": "सामवेदीय छान्दोग्योपनिषद् का प्रथम प्रपाठक। इसमें ओंकार (प्रणव) को उद्गीथ मानकर उसकी रसतम, प्राणमयी, वाङ्मयी तथा ब्रह्म रूप में उपासना का निरूपण है ('ॐ इत्येतदक्षरमुद्गीथमुपासीत')।",
    "stats": "प्रपाठक १ • ओंकार उद्गीथ उपासना",
    "priest": "उद्गातृ (Udgatri)",
    "badge": "उपनिषद्",
    "imageKey": "card-grantha-chandogya.jpg",
    "mantraId": "sv-ch-1-1",
    "orderIndex": 9,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-1-sukta-1",
    "slug": "av-kanda-1-sukta-1",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "मेधा जनन सूक्त (काण्ड १, सूक्त १)",
    "enName": "Medha Janana Sukta (Kanda 1, Sukta 1)",
    "desc": "अथर्ववेद संहिता का प्रथम मङ्गलाचरण सूक्त। वाणी, मेधा, बुद्धि और स्मरण शक्ति के अधिपति वाचस्पति से प्रज्ञा एवं धारणा सामर्थ्य की पावन प्रार्थना।",
    "stats": "४ मन्त्र • अनुष्टुप्",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "मेधा सूक्त",
    "imageKey": "card-sukta-vak.jpg",
    "mantraId": "av-1-1-1",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-1-sukta-2",
    "slug": "av-kanda-1-sukta-2",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "आयुष्य एवं रोगनाशन सूक्त (काण्ड १, सूक्त २)",
    "enName": "Ayushya & Roganashana Sukta (Kanda 1, Sukta 2)",
    "desc": "शारीरिक व्याधियों के निवारण, जल-चिकित्सा, जीवन शक्ति संवर्धन एवं पर्जन्य देव की अनुकम्पा का प्रमुख भैषज्य सूक्त।",
    "stats": "४ मन्त्र • अनुष्टुप्",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "भैषज्य सूक्त",
    "imageKey": "card-sukta-ayushya.jpg",
    "mantraId": "av-1-2-1",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-10-skambha",
    "slug": "av-kanda-10-skambha",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "स्कम्भ सूक्त (काण्ड १०, सूक्त ७)",
    "enName": "Skambha Sukta (Cosmic Pillar Hymn - Kanda 10, Sukta 7)",
    "desc": "ब्रह्माण्ड के आधारभूत परम तत्व 'स्कम्भ' (विराट् ब्रह्म) का अत्यन्त गूढ़ व दार्शनिक सूक्त। समस्त सृष्टि, सत्य, तप, ऋत और देवताओं का मूल आश्रय स्कम्भ ही है।",
    "stats": "४४ मन्त्र • जगती व त्रिष्टुप्",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "ब्रह्मविद्या सूक्त",
    "imageKey": "card-sukta-skambha.jpg",
    "mantraId": "av-10-7-1",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-11-brahmacharya",
    "slug": "av-kanda-11-brahmacharya",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "ब्रह्मचर्य सूक्त (काण्ड ११, सूक्त ५)",
    "enName": "Brahmacharya Sukta (Kanda 11, Sukta 5)",
    "desc": "विद्यार्थी जीवन, तप, आत्मसंयम, ओज, तेज और राष्ट्र-निर्माण में ब्रह्मचारी की असीम शक्ति का वैदिक प्रतिपादन। ब्रह्मचारी अपने तपोबल से लोकों और गुरु को तृप्त करता है।",
    "stats": "२६ मन्त्र • त्रिष्टुप् व जगती",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "तप एवं ज्ञान सूक्त",
    "imageKey": "card-sukta-brahmacharya.jpg",
    "mantraId": "av-11-5-1",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-12-bhumi",
    "slug": "av-kanda-12-bhumi",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "भूमि सूक्त / पृथ्वी सूक्त (काण्ड १२, सूक्त १)",
    "enName": "Bhumi Sukta / Prithvi Sukta (Earth Hymn - Kanda 12, Sukta 1)",
    "desc": "विश्व वांग्मय का प्रथम पर्यावरण महासूक्त व राष्ट्रगान। 'माता भूमिः पुत्रो अहं पृथिव्याः' का सनातन वैदिक उद्घोष, जिसमें पृथ्वी के समस्त पर्वतों, नदियों, वनस्पतियों व मानवों के सामंजस्य का स्तवन है।",
    "stats": "६३ मन्त्र • त्रिष्टुप्, जगती, अनुष्टुप्",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "राष्ट्र व पर्यावरण सूक्त",
    "imageKey": "card-sukta-prithvi.jpg",
    "mantraId": "av-12-1-1",
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "av-kanda-19-shanti",
    "slug": "av-kanda-19-shanti",
    "vedaId": "atharvaveda",
    "parentId": "shaunaka-shakha",
    "nodeType": "SUKTA",
    "name": "विश्व शांति सूक्त (काण्ड १९, सूक्त ९)",
    "enName": "Vishva Shanti Sukta (Peace Hymn - Kanda 19, Sukta 9)",
    "desc": "समस्त ब्रह्माण्ड, द्युलोक, अंतरिक्ष, पृथ्वी, जल, औषधि, वनस्पति तथा समस्त देवों में परम शांति और विश्व कल्याण की सार्वभौमिक वैदिक प्रार्थना।",
    "stats": "१४ मन्त्र • अनुष्टुप्",
    "priest": "ब्रह्मा (Brahma)",
    "badge": "शांति सूक्त",
    "imageKey": "card-sukta-shanti.jpg",
    "mantraId": "av-19-9-1",
    "orderIndex": 7,
    "status": "ACTIVE"
  }
];

export const INITIAL_VEDA_MANTRAS = [
  {
    "id": "rv-1-1-1",
    "slug": "rv-1-1-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा १",
    "mantraNumber": "१.१.१",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni - Purohita)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्।\nहोता॑रं रत्न॒धात॑मम्॥१॥",
    "transliteration": "oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam |\nhotāraṃ ratnadhātamam || 1 ||",
    "hindiTranslation": "मैं यज्ञ के पुरोहित, दिव्य प्रकाशयुक्त, देवों को बुलाने वाले ऋत्विक तथा प्रचुर रत्नों (श्रेष्ठ सुखों एवं आध्यात्मिक ऐश्वर्य) को धारण कराने वाले अग्निदेव की स्तुति करता हूँ।",
    "englishTranslation": "I magnify Agni, the divine domestic priest of the sacrifice, the ministrant priest who summons the gods, and the supreme bestower of treasures.",
    "hinglishTranslation": "Main yagya ke purohit, divya prakaash se yukt, devon ka aahvaan karne waale ritvik aur sarvashreshth ratnon/sukhon ko pradaan karne waale Agni Dev ki stuti karta hoon.",
    "padapatha": [
      {
        "word": "अ॒ग्निम्",
        "meaning": "अग्निदेव को"
      },
      {
        "word": "ई॒ळे",
        "meaning": "स्तुति करता हूँ / वंदना करता हूँ"
      },
      {
        "word": "पु॒रःऽहि॑तम्",
        "meaning": "सम्मुख स्थापित पुरोहित को"
      },
      {
        "word": "य॒ज्ञस्य॑",
        "meaning": "यज्ञ कर्म के"
      },
      {
        "word": "दे॒वम्",
        "meaning": "दिव्य प्रकाशमान देव को"
      },
      {
        "word": "ऋ॒त्विज॑म्",
        "meaning": "ऋतु-ऋतु में यज्ञ कराने वाले ऋत्विक को"
      },
      {
        "word": "होता॑रम्",
        "meaning": "देवताओं का आह्वान करने वाले को"
      },
      {
        "word": "र॒त्न॒ऽधात॑मम्",
        "meaning": "सर्वश्रेष्ठ रत्नों/सुखों को धारण कराने वाले को"
      }
    ],
    "shastricContext": "ऋग्वेद का प्रथम मंत्र। समस्त वैदिक वांग्मय का यह प्रथम मंगलाचरण मंत्र है जिसमें भौतिक एवं आध्यात्मिक अग्नि दोनों की सर्वव्यापकता प्रतिपादित की गई है।",
    "audioUrl": null,
    "previousId": null,
    "nextId": "rv-1-1-2",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "rv-1-1-2",
    "slug": "rv-1-1-2",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा २",
    "mantraNumber": "१.१.२",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "अ॒ग्निः पूर्वे॑भि॒रृषि॑भि॒रीड्यो॒ नूत॑नैरु॒त।\nस दे॒वाँ एह व॑क्षति॥२॥",
    "transliteration": "agniḥ pūrvebhir ṛṣibhir īḍyo nūtanair uta |\nsa devāṃ eha vakṣati || 2 ||",
    "hindiTranslation": "अग्निदेव पूर्वकालीन ऋषियों (भृगु, अंगिरा आदि) द्वारा स्तुत्य थे और वर्तमान नवीन ऋषियों द्वारा भी स्तुत्य हैं। वे इस यज्ञ में अन्य देवों को यहाँ लेकर आएं।",
    "englishTranslation": "Agni, worthy of praise by ancient seers as well as by modern ones, may he bring the gods hither.",
    "hinglishTranslation": "Agni Dev puraatan rishiyon (Bhrigu, Angira) dwara bhi poojit the aur aaj ke rishiyon dwara bhi poojya hain. Wo is yagya sthal par sabhi divya shaktiyon aur devtaon ko lekar aaein.",
    "padapatha": [
      {
        "word": "अ॒ग्निः",
        "meaning": "अग्निदेव"
      },
      {
        "word": "पूर्वे॑भिः",
        "meaning": "पुरातन काल के"
      },
      {
        "word": "ऋषि॑भिः",
        "meaning": "ऋषियों द्वारा"
      },
      {
        "word": "ईड्यः॑",
        "meaning": "स्तुति के योग्य हैं"
      },
      {
        "word": "नूत॑नैः",
        "meaning": "नवीन ऋषियों द्वारा"
      },
      {
        "word": "उ॒त",
        "meaning": "और भी"
      },
      {
        "word": "सः",
        "meaning": "वह अग्नि"
      },
      {
        "word": "दे॒वान्",
        "meaning": "दिव्य शक्तियों/देवताओं को"
      },
      {
        "word": "आ",
        "meaning": "यहाँ"
      },
      {
        "word": "इ॒ह",
        "meaning": "इस स्थान पर"
      },
      {
        "word": "व॒क्ष॒ति",
        "meaning": "प्राप्त कराएं/लाएं"
      }
    ],
    "shastricContext": "ऋषि परंपरा की निरंतरता का द्योतक मंत्र, जो बताता है कि सत्य की खोज और अग्नि की उपासना अनादि एवं सनातन है।",
    "audioUrl": null,
    "previousId": "rv-1-1-1",
    "nextId": "rv-1-1-3",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "rv-1-1-3",
    "slug": "rv-1-1-3",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा ३",
    "mantraNumber": "१.१.३",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "अ॒ग्निना॑ र॒यिम॑श्नव॒त्पोष॑मे॒व दि॒वेदि॑वे।\nय॒शसं॑ वी॒रव॑त्तमम्॥३॥",
    "transliteration": "agninā rayim aśnavat poṣam eva dive-dive |\nyaśasaṃ vīravattamam || 3 ||",
    "hindiTranslation": "अग्नि के माध्यम से साधक प्रतिदिन पुष्टिदायक धन, अक्षय यश और श्रेष्ठ सामर्थ्यवान संतानों/सहयोगियों को प्राप्त करता है।",
    "englishTranslation": "Through Agni one attains wealth and daily prosperity, glorious and full of valiant offspring.",
    "hinglishTranslation": "Agni ke madhyam se sadhak ko daily aatmik v bhautik samriddhi, samman aur veer sahyogiyon ki praapti hoti hai.",
    "padapatha": [
      {
        "word": "अ॒ग्निना॑",
        "meaning": "अग्निदेव द्वारा"
      },
      {
        "word": "र॒यिम्",
        "meaning": "दिव्य धन व ऐश्वर्य को"
      },
      {
        "word": "अ॒श्न॒व॒त्",
        "meaning": "प्राप्त करता है"
      },
      {
        "word": "पोष॑म्",
        "meaning": "पुष्टि एवं संवर्धन को"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "दि॒वेऽदि॑वे",
        "meaning": "प्रतिदिन"
      },
      {
        "word": "य॒शस॑म्",
        "meaning": "अक्षय कीर्ति को"
      },
      {
        "word": "वी॒रऽव॑त्ऽतमम्",
        "meaning": "वीर संतानों व सहयोगियों से युक्त"
      }
    ],
    "shastricContext": "दैनिक जीवन में आध्यात्मिक एवं भौतिक ऐश्वर्य की समरसता और पुरुषार्थ का वैदिक निरूपण।",
    "audioUrl": null,
    "previousId": "rv-1-1-2",
    "nextId": "rv-1-1-4",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "rv-3-62-10",
    "slug": "rv-3-62-10",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-3-62",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा / वाजसनेयि",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल ३, सूक्त ६२, ऋचा १०",
    "mantraNumber": "३.६२.१०",
    "rishi": "महर्षि विश्वामित्र गाथिन",
    "devata": "सविता (Savitri / Supreme Effulgence)",
    "chhanda": "निचृद् गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ भूर्भुवः॒ स्वः॑।\nतत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि।\nधियो॒ यो नः॑ प्रचो॒दया॑त्॥१०॥",
    "transliteration": "oṃ bhūr bhuvaḥ svaḥ |\ntat savitur vareṇyaṃ bhargo devasya dhīmahi |\ndhiyo yo naḥ pracodayāt || 10 ||",
    "hindiTranslation": "हम उस सृष्टिकर्ता, पापनाशक, प्रकाशमान सविता परमात्मा के सर्वोत्कृष्ट वरण करने योग्य दिव्य तेज का ध्यान करते हैं; वह परमात्मा हमारी बुद्धियों को सन्मार्ग और सत्य ज्ञान की ओर प्रेरित करे।",
    "englishTranslation": "We meditate upon that supreme, most adorable effulgence of the divine Sun of consciousness, Savitri; may He illuminate, guide, and inspire our intellects towards truth and righteousness.",
    "hinglishTranslation": "Hum us srishtikarta, dukh-nashak, sarvashreshth Savita Parmatma ke divya tej ka dhyan karte hain; wo Prabhu hamari buddhi ko sahi raaste, gyan aur satya ki or prerit karein.",
    "padapatha": [
      {
        "word": "तत्",
        "meaning": "उस अनिर्वचनीय परम"
      },
      {
        "word": "स॒वि॒तुः",
        "meaning": "सृष्टिकर्ता सविता देव के"
      },
      {
        "word": "वरे॑ण्यम्",
        "meaning": "सर्वश्रेष्ठ वरण करने योग्य"
      },
      {
        "word": "भर्गः॑",
        "meaning": "पापनाशक दिव्य ज्योतिर्मय तेज को"
      },
      {
        "word": "दे॒वस्य॑",
        "meaning": "स्वयंप्रकाश देव के"
      },
      {
        "word": "धी॒म॒हि",
        "meaning": "हम अपने अंतःकरण में धारण करते हैं"
      },
      {
        "word": "धियः॑",
        "meaning": "बुद्धियों और अंतःप्रेरणाओं को"
      },
      {
        "word": "यः",
        "meaning": "जो परमात्मा"
      },
      {
        "word": "नः॑",
        "meaning": "हमारी"
      },
      {
        "word": "प्र॒चो॒दया॑त्",
        "meaning": "सन्मार्ग की ओर प्रेरित करे"
      }
    ],
    "shastricContext": "सनातन धर्म का परम पावन वेदमाता गायत्री महामंत्र। यह ऋग्वेद (३.६२.१०), यजुर्वेद (३.३५, २२.९, ३६.३) और सामवेद में समान रूप से प्रतिष्ठापित है। इसके २४ अक्षरों में संपूर्ण ब्रह्माण्डीय प्रज्ञा का सार निहित है।",
    "audioUrl": null,
    "previousId": "rv-1-1-9",
    "nextId": "rv-7-59-12",
    "chapterMantraIds": [
      "rv-3-62-10"
    ],
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "rv-7-59-12",
    "slug": "rv-7-59-12",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-7-59",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा / माध्यन्दिना",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल ७, सूक्त ५९, ऋचा १२",
    "mantraNumber": "७.५९.१२",
    "rishi": "ब्रह्मर्षि वसिष्ठ मैत्रावरुणि",
    "devata": "त्र्यम्बक रुद्र (भगवान सदाशिव)",
    "chhanda": "अनुष्टुप् (८+८+८+८ = ३२ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ त्र्य॑म्बकं यजामहे सु॒गन्धिं॑ पुष्टि॒वर्ध॑नम्।\nउ॒र्वा॒रु॒कमि॑व॒ बन्ध॑नान् मृ॒त्योर्मु॑क्षीय॒ मामृता॑त्॥१२॥",
    "transliteration": "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukam iva bandhanān mṛtyor mukṣīya māmṛtāt || 12 ||",
    "hindiTranslation": "हम त्रिनेत्रधारी, दिव्य सुगंध से युक्त तथा समस्त पुष्टि का संवर्धन करने वाले भगवान शिव की आराधना करते हैं। जिस प्रकार पका हुआ खरबूजा अपनी बेल के बंधन से सहज ही पृथक हो जाता है, उसी प्रकार हम मृत्यु के भय और सांसारिक बंधनों से मुक्त हों, किंतु अमृतत्व (मोक्ष) से कभी विमुख न हों।",
    "englishTranslation": "We worship the Three-eyed Lord Shiva, fragrant and the nourisher of all vitality. As a ripe cucumber is severed effortlessly from its vine, may we be liberated from the bondage of death and ignorance, but never alienated from immortality.",
    "hinglishTranslation": "Hum Trinetradhari, divya sugandh se yukt aur sabhi ko pushti pradan karne waale Bhagwan Shiv ki pooja karte hain. Jaise paka hua phal bail se sahaj azaad ho jaata hai, waise hi hum mrityu ke bhay se mukt hokar Moksha aur amritatva ko praapt karein.",
    "padapatha": [
      {
        "word": "त्र्य॑म्बकम्",
        "meaning": "त्रिनेत्रधारी भगवान शिव को"
      },
      {
        "word": "य॒जा॒म॒हे",
        "meaning": "हम पूजते हैं / ध्यान करते हैं"
      },
      {
        "word": "सु॒गन्धिम्",
        "meaning": "दिव्य सुवास और आत्मिक सौरभ युक्त"
      },
      {
        "word": "पु॒ष्टि॒ऽवर्ध॑नम्",
        "meaning": "समस्त पुष्टि व संवर्धन करने वाले"
      },
      {
        "word": "उ॒र्वा॒रु॒कम्ऽइ॑व",
        "meaning": "पके हुए खरबूजे के समान"
      },
      {
        "word": "बन्ध॑नात्",
        "meaning": "लता/संसार के बंधन से"
      },
      {
        "word": "मृ॒त्योः",
        "meaning": "मृत्यु के भय से"
      },
      {
        "word": "मु॒क्षी॒य॒",
        "meaning": "मुक्त हो जाऊँ"
      },
      {
        "word": "मा",
        "meaning": "न"
      },
      {
        "word": "अ॒मृता॑त्",
        "meaning": "अमृतत्व व मोक्ष से"
      }
    ],
    "shastricContext": "रुद्र सूक्त का संजीवनी महामंत्र। महर्षि मार्कण्डेय और शुक्राचार्य द्वारा सिद्ध अकाल मृत्यु निवारक, रोग नाशक एवं मोक्षदायक महामंत्र।",
    "audioUrl": null,
    "previousId": "rv-3-62-10",
    "nextId": "rv-10-90-1",
    "chapterMantraIds": [
      "rv-7-59-12"
    ],
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-90-1",
    "slug": "rv-10-90-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-90",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा / वाजसनेयि ३१",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त ९०, ऋचा १",
    "mantraNumber": "१०.९०.१",
    "rishi": "नारायण ऋषि",
    "devata": "विराट् पुरुष (Cosmic Being)",
    "chhanda": "अनुष्टुप् (८+८+८+८ = ३२ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ स॒हस्र॑शीर्षा॒ पुरु॑षः सहस्रा॒क्षः स॒हस्र॑पात्।\nस भूमिं॑ वि॒श्वतो॑ वृ॒त्वात्य॑तिष्ठद्दशाङ्गु॒लम्॥१॥",
    "transliteration": "oṃ sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt |\nsa bhūmiṃ viśvato vṛtvāty atiṣṭhad daśāṅgulam || 1 ||",
    "hindiTranslation": "वह विराट् पुरुष अनंत सिरों, अनंत नेत्रों तथा अनंत चरणों वाला है। उसने संपूर्ण ब्रह्माण्ड को सब ओर से व्याप्त करके भी दस अंगुल (अनंत चेतना के विस्तार) में उससे परे स्थित है।",
    "englishTranslation": "The Supreme Purusha has a thousand heads, a thousand eyes, and a thousand feet. Encompassing the entire universe on every side, He transcends and extends beyond it by ten fingers (into transcendent infinite consciousness).",
    "hinglishTranslation": "Wo Virat Purush anant sheesh, anant aankhon aur anant pairon waala hai. Usne poore Universe ko har taraf se dhaanp kar bhi anant guna pare vistar paaya hai.",
    "padapatha": [
      {
        "word": "स॒हस्र॑ऽशीर्षा",
        "meaning": "अनंत शीशों वाला"
      },
      {
        "word": "पुरु॑षः",
        "meaning": "परम विराट पुरुष"
      },
      {
        "word": "स॒ह॒स्र॒ऽअ॒क्षः",
        "meaning": "अनंत नेत्रों वाला"
      },
      {
        "word": "स॒हस्र॑ऽपात्",
        "meaning": "अनंत चरणों वाला"
      },
      {
        "word": "सः",
        "meaning": "वह परमात्मा"
      },
      {
        "word": "भूमि॑म्",
        "meaning": "समस्त ब्रह्मांड को"
      },
      {
        "word": "वि॒श्वतः॑",
        "meaning": "सब ओर से"
      },
      {
        "word": "वृ॒त्वा",
        "meaning": "आवृत्त करके"
      },
      {
        "word": "अति॑",
        "meaning": "परे"
      },
      {
        "word": "अ॒ति॒ष्ठ॒त्",
        "meaning": "स्थित है"
      },
      {
        "word": "द॒शऽअं॒गु॒लम्",
        "meaning": "दशांगुल (अनंतता) में"
      }
    ],
    "shastricContext": "सृष्टि का मूल आधार। पुरुष सूक्त की प्रथम ऋचा संपूर्ण कॉस्मोस को एक सजीव चेतन देह बताती है।",
    "audioUrl": null,
    "previousId": "rv-7-59-12",
    "nextId": "rv-10-90-2",
    "chapterMantraIds": [
      "rv-10-90-1",
      "rv-10-90-2",
      "rv-10-90-16"
    ],
    "orderIndex": 9,
    "status": "ACTIVE"
  },
  {
    "id": "vs-1-1",
    "slug": "vs-1-1",
    "vedaId": "yajurveda",
    "nodeId": "vs-adhyaya-1",
    "vedaName": "शुक्ल यजुर्वेद (Shukla Yajurveda)",
    "shakha": "माध्यन्दिना वाजसनेयि शाखा",
    "textName": "वाजसनेयि संहिता (दर्शपूर्णमास याग)",
    "sectionRef": "अध्याय १, मंत्र १ (मंगलाचरण)",
    "mantraNumber": "१.१",
    "rishi": "महर्षि याज्ञवल्क्य",
    "devata": "पवित्र पलाश / यज्ञीय ऊर्जा (Agni-Soma)",
    "chhanda": "यजुः (गद्यात्मक छंद)",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ इ॒षे त्वो॒र्जे त्वा॑ वा॒यव॑ स्थ दे॒वो वः॑ सवि॒ता प्रार्प॑यतु॒ श्रेष्ठ॑तमाय॒ कर्म॑णे।\nआप्या॑यध्वमघ्न्या इन्द्राय भा॒गं प्र॒जाव॑तीरनमी॒वा अ॑य॒क्ष्मा मा व॑ स्ते॒न ई॑शत॒ माघाशं॑सो ध्रु॒वा अ॒स्मिन् गो॒पतौ॑ स्यात ब॒ह्वीर्यज॑मानस्य प॒शून् पाहि॑॥१॥",
    "transliteration": "oṃ iṣe tvorje tvā vāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe |\nāpyāyadhvam aghnyā indrāya bhāgaṃ prajāvatīr anamīvā ayakṣmā mā va stena īśata māghāśaṃso dhruvā asmin gopatau syāta bahvīr yajamānasya paśūn pāhi || 1 ||",
    "hindiTranslation": "हे पलाश शाखा! मैं आपको अन्न (जीवन सामर्थ्य) के लिए और ऊर्जा (बल) के लिए ग्रहण करता हूँ। आप सब वायु के समान वेगवान हों। सविता देव आप सभी को श्रेष्ठतम कर्म (यज्ञ) के लिए प्रेरित करें। हे अवध्य गौवों! आप इंद्र के भाग के लिए संवर्धित हों, प्रजावती, नीरोग और यक्ष्मारहित रहें। कोई चोर या पापी आप पर अधिकार न कर सके। आप इस गोपति (पालक) के पास स्थिर व बहुसंख्यक रहें। हे यज्ञ! यजमान के पशुओं की रक्षा करें।",
    "englishTranslation": "For food and life-sap I take thee; for strength and vigor I pluck thee. May the Divine Savitri impulse you to the noblest and highest work (Yagya). Flourish, O inviolable ones, as a portion for Indra, endowed with progeny, disease-free, and healthy. Let no thief or evil-doer overpower you. Remain steadfast and multiplied with this guardian, and protect the livestock of the sacrificer.",
    "hinglishTranslation": "Hey Palash Shakha! Main aapko jeevan-shakti aur urja ke liye grahan karta hoon. Savita Dev aapko shreshthata karma (Yagya) ke liye prerit karein. Hey gowon! Aap rog-mukt hokar samriddha banein.",
    "padapatha": [
      {
        "word": "इ॒षे",
        "meaning": "अन्न व जीवन रस के लिए"
      },
      {
        "word": "त्वा",
        "meaning": "तुझे ग्रहण करता हूँ"
      },
      {
        "word": "ऊ॒र्जे",
        "meaning": "दिव्य ऊर्जा व बल के लिए"
      },
      {
        "word": "त्वा",
        "meaning": "तुझे"
      },
      {
        "word": "वा॒यवः॑",
        "meaning": "वायु के सदृश गतिशील"
      },
      {
        "word": "स्थ॒",
        "meaning": "तुम सब हो"
      },
      {
        "word": "दे॒वः",
        "meaning": "प्रकाशमान देव"
      },
      {
        "word": "स॒वि॒ता",
        "meaning": "सृष्टिकर्ता सविता"
      },
      {
        "word": "प्र",
        "meaning": "प्रकृष्ट रूप से"
      },
      {
        "word": "अर्प॑यतु",
        "meaning": "प्रेरित करे"
      },
      {
        "word": "श्रेष्ठ॑ऽतमाय",
        "meaning": "सर्वोत्तम निष्काम"
      },
      {
        "word": "कर्म॑णे",
        "meaning": "यज्ञ कर्म के लिए"
      }
    ],
    "shastricContext": "यजुर्वेद का सुप्रसिद्ध प्रथम मंत्र। भारतीय संस्कृति के 'श्रेष्ठतम कर्म' (यज्ञ) की परिभाषा यहीं से प्रारंभ होती है।",
    "previousId": "rv-10-90-1",
    "nextId": "vs-16-1",
    "chapterMantraIds": [
      "vs-1-1"
    ],
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "vs-16-1",
    "slug": "vs-16-1",
    "vedaId": "yajurveda",
    "nodeId": "vs-adhyaya-16",
    "vedaName": "शुक्ल यजुर्वेद (Shukla Yajurveda)",
    "shakha": "माध्यन्दिना वाजसनेयि शाखा",
    "textName": "वाजसनेयि संहिता (रुद्राध्याय / शतरुद्रिय)",
    "sectionRef": "अध्याय १६, मंत्र १ (रुद्र नमकम)",
    "mantraNumber": "१६.१",
    "rishi": "महर्षि परमेष्ठी प्रजापति / याज्ञवल्क्य",
    "devata": "भगवान श्रीरुद्र (Sada Shiva)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ नम॑स्ते रुद्र म॒न्यव॑ उ॒तोत॒ इष॑वे॒ नमः॑।\nनम॑स्ते अस्तु॒ धन्व॑ने बा॒हुभ्या॑मु॒त ते॒ नमः॑॥१॥",
    "transliteration": "oṃ namas te rudra manyava utota iṣave namaḥ |\nnamas te astu dhanvane bāhubhyām uta te namaḥ || 1 ||",
    "hindiTranslation": "हे दुःखनाशक एवं पापविदारक भगवान रुद्र! आपके क्रोध (अधर्म के प्रति न्यायोचित रोष) को हमारा बारंबार नमस्कार है। आपके बाण को हमारा नमस्कार है। आपके पावन धनुष को नमस्कार है तथा आपकी दोनों भुजाओं (जो शरणागत की रक्षा करती हैं) को हमारा सादर प्रणाम है।",
    "englishTranslation": "O Lord Rudra, destroyer of all sorrows! Homage to Your wrath against evil, and homage to Your arrow. Homage be unto Your bow, and homage to both of Your mighty protective arms.",
    "hinglishTranslation": "Hey dukh-nashak Bhagwan Rudra! Aapke anyay-nashak krodh ko pranam, aapke baan aur dhanush ko pranam, tatha aapki dono rakshak bhujaon ko hamara koti-koti pranam.",
    "padapatha": [
      {
        "word": "नमः॑",
        "meaning": "प्रणाम / नमस्कार"
      },
      {
        "word": "ते॒",
        "meaning": "आपके लिए"
      },
      {
        "word": "रु॒द्र॒",
        "meaning": "हे दुःखों को दूर करने वाले रुद्र"
      },
      {
        "word": "म॒न्यवे॑",
        "meaning": "धर्म-संरक्षक क्रोध को"
      },
      {
        "word": "उ॒तो",
        "meaning": "और भी"
      },
      {
        "word": "ते॒",
        "meaning": "आपके"
      },
      {
        "word": "इष॑वे",
        "meaning": "पापनाशक बाण को"
      },
      {
        "word": "नमः॑",
        "meaning": "प्रणाम"
      },
      {
        "word": "धन्व॑ने",
        "meaning": "आपके धनुष को"
      },
      {
        "word": "बा॒हुभ्या॑म्",
        "meaning": "दोनों भुजाओं को"
      }
    ],
    "shastricContext": "रुद्राष्टाध्यायी एवं श्रीरुद्रम् (नमकम) का प्रथम महामंत्र। समस्त रुद्राभिषेक एवं शिवाराधना का सर्वोच्च मंगलाचरण।",
    "previousId": "vs-1-1",
    "nextId": "vs-34-1",
    "chapterMantraIds": [
      "vs-16-1"
    ],
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "vs-34-1",
    "slug": "vs-34-1",
    "vedaId": "yajurveda",
    "nodeId": "vs-adhyaya-34",
    "vedaName": "शुक्ल यजुर्वेद (Shukla Yajurveda)",
    "shakha": "माध्यन्दिना वाजसनेयि शाखा",
    "textName": "वाजसनेयि संहिता (शिवसंकल्प सूक्त)",
    "sectionRef": "अध्याय ३४, मंत्र १",
    "mantraNumber": "३४.१",
    "rishi": "महर्षि शिवसंकल्प / याज्ञवल्क्य",
    "devata": "मन (Supreme Conscious Mind / Soul)",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ यज्जाग्र॑तो दू॒रमुदै॑ति॒ दैवं॒ तदु॑ सु॒प्तस्य॒ तथैवैति॑।\nदू॒र॒ङ्ग॒मं ज्योति॑षां॒ ज्योति॒रेकं॒ तन्मे॒ मनः॑ शि॒वस॑ङ्क॒ल्पम॑स्तु॥१॥",
    "transliteration": "oṃ yaj jāgrato dūram udaiti daivaṃ tad u suptasya tathaivaiti |\ndūraṅgamaṃ jyotiṣāṃ jyotir ekaṃ tan me manaḥ śivasaṅkalpam astu || 1 ||",
    "hindiTranslation": "जो मन जाग्रत अवस्था में दूर-दूर तक विचरण करता है, दिव्य शक्तियों से युक्त है, और सुप्तावस्था में भी वैसे ही अंतर्जगत में चला जाता है; जो दूरगामी है और समस्त इंद्रियों का एक अद्वितीय प्रकाशक ज्योति है—वह मेरा मन सदा कल्याणकारी, शुभ एवं शिव संकल्पों (सद्विचारों) से युक्त हो।",
    "englishTranslation": "That mind which travels far while awake, and similarly wanders in sleep; that far-reaching light of all lights and senses—may that mind of mine be filled with auspicious, noble, and benevolent resolves (Shiva-Sankalpa).",
    "hinglishTranslation": "Jo mann jaagte hue door tak chala jaata hai aur sote hue bhi sukshma jagat mein rehta hai, jo sabhi indriyon ka ekmatra prakaashak hai—wo mera mann sada shubh, pavitra aur kalyankari sankalpon se yukt ho.",
    "padapatha": [
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "जाग्र॑तः",
        "meaning": "जागते हुए मनुष्य का"
      },
      {
        "word": "दू॒रम्",
        "meaning": "दूर तक"
      },
      {
        "word": "उदै॑ति",
        "meaning": "चला जाता है"
      },
      {
        "word": "दैव॑म्",
        "meaning": "दिव्य सामर्थ्य वाला"
      },
      {
        "word": "सु॒प्तस्य॑",
        "meaning": "सोते हुए का"
      },
      {
        "word": "दू॒रम्ऽग॒मम्",
        "meaning": "दूरगामी"
      },
      {
        "word": "ज्योति॑षाम्",
        "meaning": "समस्त इंद्रियों में"
      },
      {
        "word": "ज्योतिः॑",
        "meaning": "परम प्रकाशक"
      },
      {
        "word": "एक॑म्",
        "meaning": "अद्वितीय"
      },
      {
        "word": "तत्",
        "meaning": "वह"
      },
      {
        "word": "मे",
        "meaning": "मेरा"
      },
      {
        "word": "मनः॑",
        "meaning": "मन"
      },
      {
        "word": "शि॒वऽस॑ङ्कल्पम्",
        "meaning": "कल्याणकारी संकल्प वाला"
      },
      {
        "word": "अ॒स्तु॒",
        "meaning": "होवे"
      }
    ],
    "shastricContext": "वैदिक मनोविज्ञान का शिरोमणि सूक्त। मानसिक शांति, अवसाद-निवारण एवं शुभ इच्छाशक्ति जागृत करने का अमोघ मंत्र।",
    "previousId": "vs-16-1",
    "nextId": "vs-40-1",
    "chapterMantraIds": [
      "vs-34-1"
    ],
    "orderIndex": 9,
    "status": "ACTIVE"
  },
  {
    "id": "vs-40-1",
    "slug": "vs-40-1",
    "vedaId": "yajurveda",
    "nodeId": "vs-adhyaya-40",
    "vedaName": "शुक्ल यजुर्वेद (Shukla Yajurveda)",
    "shakha": "माध्यन्दिना / काण्व शाखा",
    "textName": "वाजसनेयि संहिता (ईशावास्योपनिषद)",
    "sectionRef": "अध्याय ४०, मंत्र १",
    "mantraNumber": "४०.१",
    "rishi": "महर्षि दध्यङ् आथर्वण / याज्ञवल्क्य",
    "devata": "ईश्वर / परमात्मा (All-pervading Supreme Self)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ ई॒शा वा॒स्य॑मि॒दँ सर्वं॒ यत्किञ्च॒ जग॑त्यां॒ जग॑त्।\nतेन॑ त्य॒क्तेन॑ भुञ्जीथा॒ मा गृ॑धः॒ कस्य॑ स्वि॒द्धन॑म्॥१॥",
    "transliteration": "oṃ īśā vāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam || 1 ||",
    "hindiTranslation": "इस संपूर्ण ब्रह्माण्ड में जो कुछ भी गतिशील (परिवर्तनशील चर-अचर संसार) है, वह सब ईश्वर से व्याप्त (आच्छादित) है। अतः त्यागभाव (अनासक्ति) के साथ उसका उपभोग करो; किसी के भी धन या संपदा का लोभ मत करो।",
    "englishTranslation": "All this whatever moves in this moving universe is enveloped by the Lord. By renunciation and detachment, protect yourself and enjoy; do not covet the wealth of anyone.",
    "hinglishTranslation": "Is poore vishva mein jo kuch bhi hai, sabme Ishwar vyapt hain. Isliye tyag bhav ke saath sansaar ka anand lo aur kisi ke dhan ka lalach mat karo.",
    "padapatha": [
      {
        "word": "ई॒शा",
        "meaning": "ईश्वर द्वारा"
      },
      {
        "word": "वा॒स्य॑म्",
        "meaning": "आच्छादित / व्याप्त करने योग्य"
      },
      {
        "word": "इ॒दम्",
        "meaning": "यह"
      },
      {
        "word": "सर्व॑म्",
        "meaning": "सब कुछ"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "किञ्च॑",
        "meaning": "कुछ भी"
      },
      {
        "word": "जग॑त्याम्",
        "meaning": "इस संसार में"
      },
      {
        "word": "जग॑त्",
        "meaning": "गतिशील जगत"
      },
      {
        "word": "तेन॑",
        "meaning": "उस"
      },
      {
        "word": "त्य॒क्तेन॑",
        "meaning": "त्यागपूर्वक भाव से"
      },
      {
        "word": "भु॒ञ्जी॒थाः॑",
        "meaning": "उपभोग करो / रक्षा करो"
      },
      {
        "word": "मा",
        "meaning": "मत"
      },
      {
        "word": "गृ॒धः॒",
        "meaning": "लोभ करो"
      },
      {
        "word": "कस्य॑",
        "meaning": "किसके"
      },
      {
        "word": "स्वित्",
        "meaning": "भला"
      },
      {
        "word": "धन॑म्",
        "meaning": "धन का"
      }
    ],
    "shastricContext": "उपनिषदों का मुकुटमणि मंत्र। महात्मा गांधी ने कहा था: 'यदि समस्त हिंदू धर्म ग्रंथ नष्ट हो जाएं और केवल ईशावास्य का प्रथम मंत्र बच रहे, तो भी सनातन धर्म जीवित रहेगा'।",
    "previousId": "vs-34-1",
    "nextId": "ts-1-1-1",
    "chapterMantraIds": [
      "vs-40-1"
    ],
    "orderIndex": 10,
    "status": "ACTIVE"
  },
  {
    "id": "ts-1-1-1",
    "slug": "ts-1-1-1",
    "vedaId": "yajurveda",
    "nodeId": "taittiriya-samhita",
    "vedaName": "कृष्ण यजुर्वेद (Krishna Yajurveda)",
    "shakha": "तैत्तिरीय शाखा",
    "textName": "तैत्तिरीय संहिता (काण्ड १, प्रपाठक १)",
    "sectionRef": "काण्ड १, प्रपाठक १, अनुवाक १",
    "mantraNumber": "१.१.१",
    "rishi": "महर्षि तित्तिरि",
    "devata": "पवित्र पलाश / यज्ञ",
    "chhanda": "यजुः",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ इ॒षे त्वो॒र्जे त्वा॑ वा॒यव॑ स्थोपा॒यव॑ स्थ दे॒वो वः॑ सवि॒ता प्रार्प॑यतु॒ श्रेष्ठ॑तमाय॒ कर्म॑णे॥",
    "transliteration": "oṃ iṣe tvorje tvā vāyava sthopāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe ||",
    "hindiTranslation": "हे पलाश शाखा! मैं आपको अन्न एवं रस (इष्) तथा ऊर्जा व बल (ऊर्ज) के लिए ग्रहण करता हूँ। आप वायु के समान शीघ्रगामी और समीप आने वाले हैं। सविता देव आपको सर्वोत्तम कर्म (यज्ञ) के लिए प्रवृत्त करें।",
    "englishTranslation": "For food and vigor I touch thee. You are swift like the wind, coming near to us. May the Divine Savitri impulse you to the noblest deed of sacrifice.",
    "hinglishTranslation": "Hey divya vriksha shakha! Main jeevan urja aur aahar ke liye aapko leta hoon. Savita Bhagwan aapko shreshth karma ke liye aashirwad dein.",
    "padapatha": [
      {
        "word": "इ॒षे",
        "meaning": "अन्न के लिए"
      },
      {
        "word": "त्वा",
        "meaning": "तुझे"
      },
      {
        "word": "ऊ॒र्जे",
        "meaning": "ऊर्जा के लिए"
      },
      {
        "word": "त्वा",
        "meaning": "तुझे"
      },
      {
        "word": "वा॒यवः॑",
        "meaning": "वायु रूप"
      },
      {
        "word": "स्थ॒",
        "meaning": "हो"
      },
      {
        "word": "उ॒पा॒यवः॑",
        "meaning": "समीपस्थ"
      },
      {
        "word": "दे॒वः",
        "meaning": "देव"
      },
      {
        "word": "स॒वि॒ता",
        "meaning": "सविता"
      }
    ],
    "shastricContext": "कृष्ण यजुर्वेद तैत्तिरीय संहिता का शुभारंभ।",
    "previousId": "vs-40-1",
    "nextId": "sv-1-1-1",
    "chapterMantraIds": [
      "ts-1-1-1"
    ],
    "orderIndex": 11,
    "status": "ACTIVE"
  },
  {
    "id": "sv-1-1-1",
    "slug": "sv-1-1-1",
    "vedaId": "samaveda",
    "nodeId": "sv-agneya-kanda",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (पूर्वार्चिक - आग्नेय काण्ड)",
    "sectionRef": "पूर्वार्चिक, प्रपाठक १, दशति १, मन्त्र १ (ऋग्वेद ६.१६.१० से सामगान)",
    "mantraNumber": "१.१.१",
    "rishi": "भारद्वाज बार्हस्पत्य",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सामगान सप्त स्वर (कृष्ठ, प्रथम, द्वितीय, तृतीय, चतुर्थ, मन्द्र, अतिस्वार्य)",
    "sanskrit": "ॐ अ॒ग्न आ या॑हि वी॒तये॑ गृणा॒नो ह॒व्यदा॑तये।\nनि होता॑ सत्सि ब॒र्हिषि॑॥१॥",
    "transliteration": "oṃ agna ā yāhi vītaye gṛṇāno havyadātaye |\nni hotā satsi barhiṣi || 1 ||",
    "hindiTranslation": "हे अग्निदेव! आप स्तुति किए जाने पर हमारी हवि ग्रहण करने और यज्ञ की रक्षा के लिए पधारें; और मुख्य होता के रूप में हमारे इस पवित्र कुशासन (बर्हि) पर विराजमान हों।",
    "englishTranslation": "O Agni, invoked and praised by our sacred hymns, come hither to feast upon the oblation; sit down as the divine presiding priest upon the sacred sacrificial grass (barhis).",
    "hinglishTranslation": "Hey Agni Dev! Hamari stuti sunkar yagya mein havi grahan karne ke liye padharein aur mukhya hota ke roop mein hamare pavitra kusha aasan (barhi) par virajman hon.",
    "padapatha": [
      {
        "word": "अग्ने॑",
        "meaning": "हे अग्निदेव!"
      },
      {
        "word": "आ",
        "meaning": "यहाँ"
      },
      {
        "word": "या॒हि॒",
        "meaning": "पधारिए / आइए"
      },
      {
        "word": "वी॒तये॑",
        "meaning": "हवि भक्षण व यज्ञ रक्षा हेतु"
      },
      {
        "word": "गृ॒णा॒नः",
        "meaning": "स्तुति किए जाते हुए / वन्दना सुनते हुए"
      },
      {
        "word": "ह॒व्यऽदा॑तये",
        "meaning": "हवि प्रदान करने के लिए"
      },
      {
        "word": "नि",
        "meaning": "निश्चयपूर्वक / सादर"
      },
      {
        "word": "होता॑",
        "meaning": "यज्ञ के मुख्य होता रूप में"
      },
      {
        "word": "सत्सि",
        "meaning": "बैठिए / आसीन होइए"
      },
      {
        "word": "ब॒र्हिषि॑",
        "meaning": "कुश के पवित्र आसन पर"
      }
    ],
    "shastricContext": "सामवेद का सर्वप्रमुख मंगलाचरण मन्त्र। इस मन्त्र पर गान की अनेक साम प्रवृत्तियाँ (यथा गौतमीय गान) आश्रित हैं। सामवेद में ऋचाओं का गायन भारतीय शास्त्रीय संगीत के सप्तस्वरों (षड्ज, ऋषभ, गान्धार, मध्यम, पञ्चम, धैवत, निषाद) के उद्गम का आधार माना जाता है।",
    "audioUrl": null,
    "previousId": null,
    "nextId": "sv-1-1-2",
    "chapterMantraIds": [
      "sv-1-1-1",
      "sv-1-1-2",
      "sv-1-1-3"
    ],
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "sv-1-1-2",
    "slug": "sv-1-1-2",
    "vedaId": "samaveda",
    "nodeId": "sv-agneya-kanda",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (पूर्वार्चिक - आग्नेय काण्ड)",
    "sectionRef": "पूर्वार्चिक, प्रपाठक १, दशति १, मन्त्र २ (ऋग्वेद ६.१६.१)",
    "mantraNumber": "१.१.२",
    "rishi": "भारद्वाज बार्हस्पत्य",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ त्वम॑ग्ने य॒ज्ञानां॒ होता॒ विश्वा॑षां हि॒तः।\nदे॒वेभि॒र्मानु॑षे॒ जने॑॥२॥",
    "transliteration": "oṃ tvam agne yajñānāṃ hotā viśvāsāṃ hitaḥ |\ndevebhir mānuṣe jane || 2 ||",
    "hindiTranslation": "हे अग्निदेव! समस्त मानवों के कल्याणकारी यज्ञों में देवताओं द्वारा आप ही मुख्य होता (आह्वानकर्ता पुरोहित) एवं सर्वहितैषी के रूप में प्रतिष्ठित किए गए हैं।",
    "englishTranslation": "O Agni, thou art established by the gods among mortal beings as the supreme invoking priest and benefactor of all holy sacrifices.",
    "hinglishTranslation": "Hey Agni Dev! Manushyo ke kalyankari yagyo mein devtaon dwara aap hi mukhya hota aur sarva-hitashi ke roop mein sthapit kiye gaye hain.",
    "padapatha": [
      {
        "word": "त्वम्",
        "meaning": "आप"
      },
      {
        "word": "अग्ने॑",
        "meaning": "हे अग्निदेव!"
      },
      {
        "word": "य॒ज्ञानाम्",
        "meaning": "समस्त यज्ञों के"
      },
      {
        "word": "होता॑",
        "meaning": "आह्वानकर्ता होता"
      },
      {
        "word": "विश्वा॑षाम्",
        "meaning": "समस्त प्रजाओं / यज्ञों के"
      },
      {
        "word": "हि॒तः",
        "meaning": "कल्याणकारी / हितैषी रूप में"
      },
      {
        "word": "दे॒वेभिः॑",
        "meaning": "देवताओं द्वारा"
      },
      {
        "word": "मानु॑षे",
        "meaning": "मानव"
      },
      {
        "word": "जने॑",
        "meaning": "समाज / मनुष्यों में"
      }
    ],
    "shastricContext": "अग्निदेव को मर्त्य (मनुष्य) और अमर्त्य (देवता) के मध्य का सेतु और यज्ञ का सर्वोच्च हितकारी पुरोहित स्वीकार करने वाला पावन सामगान मन्त्र। सामगान में यह मन्त्र देव-मानव समन्वय का गान करता है।",
    "audioUrl": null,
    "previousId": "sv-1-1-1",
    "nextId": "sv-1-1-3",
    "chapterMantraIds": [
      "sv-1-1-1",
      "sv-1-1-2",
      "sv-1-1-3"
    ],
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "sv-2-1-1",
    "slug": "sv-2-1-1",
    "vedaId": "samaveda",
    "nodeId": "sv-pavamana-kanda",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (उत्तरार्चिक - पवमान काण्ड / तृच १)",
    "sectionRef": "उत्तरार्चिक, प्रपाठक २, दशति १, मन्त्र १ (ऋग्वेद ९.६१.१०)",
    "mantraNumber": "२.१.१",
    "rishi": "असित काश्यप अथवा देवल काश्यप",
    "devata": "पवमान सोम (Soma Pavamana)",
    "chhanda": "गायत्री",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ उ॒च्चा ते॑ जा॒तमन्ध॑सो दि॒वि सद्भूम्या॑ ददे।\nउ॒ग्रं शर्म॑ म॒हि श्रवः॑॥१॥",
    "transliteration": "oṃ uccā te jātam andhaso divi sad bhūmyā dade |\nugraṃ śarma mahi śravaḥ || 1 ||",
    "hindiTranslation": "हे सोम! द्युलोक में उत्पन्न आपका जो परम पावन दिव्य रस (अमृत तत्व) है, उसे हम इस पृथ्वी पर यज्ञ में सादर धारण करते हैं। वह हमें परम संरक्षण (सुख) और महती आध्यात्मिक कीर्ति प्रदान करे।",
    "englishTranslation": "High-born in heaven is thy sacred soma-juice, which we receive here on earth; may it grant us mighty shelter and exalted fame.",
    "hinglishTranslation": "Hey Som Dev! Dyulok mein utpann aapka divya amrit tatva hum prithvi par grahan karte hain; yeh hume shreshth raksha, sukh aur mahan aadhyatmik yash pradan kare.",
    "padapatha": [
      {
        "word": "उ॒च्चा",
        "meaning": "उच्च द्युलोक में"
      },
      {
        "word": "ते॒",
        "meaning": "आपका"
      },
      {
        "word": "जा॒तम्",
        "meaning": "उत्पन्न हुआ"
      },
      {
        "word": "अन्ध॑सः",
        "meaning": "सोमरस / अमृतमय अन्न"
      },
      {
        "word": "दि॒वि",
        "meaning": "द्युलोक / स्वर्ग में"
      },
      {
        "word": "सत्",
        "meaning": "विद्यमान रहता हुआ"
      },
      {
        "word": "भूम्या॑",
        "meaning": "पृथ्वी पर"
      },
      {
        "word": "द॒दे॒",
        "meaning": "धारण करते हैं / स्वीकार करते हैं"
      },
      {
        "word": "उ॒ग्रम्",
        "meaning": "प्रचण्ड / परम शक्तिशाली"
      },
      {
        "word": "शर्म॑",
        "meaning": "सुख एवं अभय आश्रय"
      },
      {
        "word": "म॒हि",
        "meaning": "महान"
      },
      {
        "word": "श्रवः॑",
        "meaning": "यश एवं आध्यात्मिक ज्ञान"
      }
    ],
    "shastricContext": "सामवेद उत्तरार्चिक का प्रथम तृच गान (ऋग्वेद ९.६१.१० से गृहीत)। सोमरस के दिव्य स्वर्गीय मूल और पार्थिव यज्ञ में उसके अवतरण का यह स्तवन अंतःकरण के अमृतत्व और महती आध्यात्मिक कीर्ति का उद्घोषक है।",
    "audioUrl": null,
    "previousId": "sv-1-2-2",
    "nextId": "sv-2-1-2",
    "chapterMantraIds": [
      "sv-2-1-1",
      "sv-2-1-2"
    ],
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "av-1-1-1",
    "slug": "av-1-1-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-1-sukta-1",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (मेधा जनन सूक्त)",
    "sectionRef": "काण्ड १, सूक्त १, मन्त्र १",
    "mantraNumber": "१.१.१",
    "rishi": "महर्षि अथर्वा",
    "devata": "वाचस्पतिः (Vachaspati - Lord of Speech & Wisdom)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ ये त्रि॒षप्ताः प॑रि॒यन्ति॒ विश्वा॑ रू॒पाणि॒ बिभ्र॑तः।\nवा॒चस्पति॒र्बला॒ तेषां॑ त॒न्वो३ अ॒द्य द॑धातु मे॥१॥",
    "transliteration": "oṃ ye triṣaptāḥ pariyanti viśvā rūpāṇi bibhrataḥ |\nvācaspatir balā teṣāṃ tanvo adya dadhātu me || 1 ||",
    "hindiTranslation": "जो इक्कीस (तीन गुणा सात - ज्ञानेन्द्रियाँ, कर्मेन्द्रियाँ, पंच महाभूत, मन, बुद्धि आदि) सर्वत्र विद्यमान होकर सम्पूर्ण रूपों को धारण करते हैं; वाणी एवं ज्ञान के अधिपति वाचस्पति देव आज उनके बल और सामर्थ्य को मेरे शरीर एवं आत्मा में स्थापित करें।",
    "englishTranslation": "Those thrice seven that go about, bearing all forms and essences—may the Lord of Speech (Vachaspati) bestow their strength and vital energies upon my body and intellect today!",
    "hinglishTranslation": "Jo ikkis tattva (treen guna saat) sampoorna roopo ko dharan karke charo taraf virajman hain, vani aur vidya ke devta Vachaspati unka bal aur shakti aaj mere sharir aur aatma mein sthapit karein.",
    "padapatha": [
      {
        "word": "ये",
        "meaning": "जो (तत्त्व)"
      },
      {
        "word": "त्रि॒ऽस॒प्ताः",
        "meaning": "इक्कीस (३ × ७ = इन्द्रियाँ, भूत व अन्तःकरण)"
      },
      {
        "word": "प॒रि॒ऽयन्ति॑",
        "meaning": "सर्वत्र व्याप्त होकर गति करते हैं"
      },
      {
        "word": "विश्वा॑",
        "meaning": "समस्त"
      },
      {
        "word": "रू॒पाणि॑",
        "meaning": "आकृतियों व रूपों को"
      },
      {
        "word": "बिभ्र॑तः",
        "meaning": "धारण करते हुए"
      },
      {
        "word": "वा॒चस्पतिः॑",
        "meaning": "वाणी व प्रज्ञा के अधिपति"
      },
      {
        "word": "बला॑",
        "meaning": "बल / सामर्थ्य"
      },
      {
        "word": "तेषा॑म्",
        "meaning": "उनका"
      },
      {
        "word": "त॒न्वः॑",
        "meaning": "शरीर / आत्म-स्वरूप में"
      },
      {
        "word": "अ॒द्य",
        "meaning": "आज ही"
      },
      {
        "word": "द॒धा॒तु",
        "meaning": "स्थापित करें"
      },
      {
        "word": "मे॒",
        "meaning": "मुझमें"
      }
    ],
    "shastricContext": "अथर्ववेद संहिता का प्रथम मंगलाचरण मंत्र। यहाँ 'त्रिषप्ताः' से तात्पर्य सांख्य एवं वैदिक दर्शन के अनुसार ७ धातुएँ, ७ प्राण व ७ छंद अथवा पंचभूत, दश इन्द्रियाँ, मन, बुद्धि, अहंकार, प्रकृति आदि इक्कीस तत्वों से है, जिनके समन्वय से बुद्धि एवं देह बलवान बनती है।",
    "audioUrl": null,
    "previousId": null,
    "nextId": "av-1-1-2",
    "chapterMantraIds": [
      "av-1-1-1",
      "av-1-1-2",
      "av-1-1-4"
    ],
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "av-12-1-12",
    "slug": "av-12-1-12",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-12-bhumi",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (भूमि सूक्त / पृथ्वी सूक्त)",
    "sectionRef": "काण्ड १२, सूक्त १, मन्त्र १२",
    "mantraNumber": "१२.१.१२",
    "rishi": "महर्षि अथर्वा",
    "devata": "भूमिः (Mother Earth)",
    "chhanda": "पुरउष्णिक् / अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ यत्ते॒ मध्यं॑ पृथि॒वि यच्च॒ नभ्यं॒ यास्त॑ ऊ॒र्जस्त॒न्वः॒ संब॑भू॒वुः।\nतासु॑ नो धे॒ह्य॒भि नः॑ पवस्व मा॒ता भूमिः॑ पु॒त्रो अ॒हं पृ॑थि॒व्याः।\nप॒र्जन्यः॑ पि॒ता स उ॑ नः पिपर्तु॥१२॥",
    "transliteration": "oṃ yat te madhyaṃ pṛthivi yac ca nabhyaṃ yās ta ūrjas tanvaḥ saṃbabhūvuḥ |\ntāsu no dhehy abhi naḥ pavasva mātā bhūmiḥ putro ahaṃ pṛthivyāḥ |\nparjanyaḥ pitā sa u naḥ pipartu || 12 ||",
    "hindiTranslation": "हे पृथ्वी माता! जो आपका मध्य भाग है, जो आपकी नाभि (केंद्र) है, और जो आपकी ऊर्जा-प्रदायिनी पावन शक्तियाँ हैं; उन सब में हमें स्थापित कीजिए और हमें निरंतर पवित्र कीजिए। यह संपूर्ण भूमि मेरी माता है और मैं इस पावन पृथ्वी का पुत्र हूँ! पर्जन्य (मेघ) हमारे पिता हैं, वे हमारा पालन-पोषण करें!",
    "englishTranslation": "What is thy middle, O Earth, what thy navel, what the vitalizing energies that have arisen from thy body—therein establish us, and cleanse us with pure grace. Earth is my Mother; I am the son of Earth! Parjanya is my Father; may he nourish and protect us!",
    "hinglishTranslation": "Hey Dharti Mata! Jo aapka madhya hai, jo aapki naabhi hai, aur jo aapki urja-dayini divya shaktiyan hain, unme hume sthapit kijiye aur pavitra kijiye. Dharti meri mata hai aur main iska putra hoon! Parjanya hamare pita hain, ve hamara palan karein!",
    "padapatha": [
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "ते॒",
        "meaning": "तुम्हारा"
      },
      {
        "word": "मध्य॑म्",
        "meaning": "मध्य भाग"
      },
      {
        "word": "पृ॒थि॒वि",
        "meaning": "हे पृथ्वी माता!"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "च॒",
        "meaning": "और"
      },
      {
        "word": "नभ्य॑म्",
        "meaning": "नाभि (केंद्र स्थल)"
      },
      {
        "word": "याः",
        "meaning": "जो"
      },
      {
        "word": "ते॒",
        "meaning": "तुम्हारी"
      },
      {
        "word": "ऊर्जः॑",
        "meaning": "ऊर्जाएँ / जीवन-रस"
      },
      {
        "word": "त॒न्वः॑",
        "meaning": "शरीर से"
      },
      {
        "word": "स॒म्ऽब॒भू॒वुः",
        "meaning": "प्रकट हुईं"
      },
      {
        "word": "तासु॑",
        "meaning": "उनमें"
      },
      {
        "word": "नः॒",
        "meaning": "हमें"
      },
      {
        "word": "धे॒हि॒",
        "meaning": "स्थापित करो"
      },
      {
        "word": "अ॒भि",
        "meaning": "सर्वतोभावेन"
      },
      {
        "word": "नः॒",
        "meaning": "हमें"
      },
      {
        "word": "प॒व॒स्व॒",
        "meaning": "पवित्र करो"
      },
      {
        "word": "मा॒ता",
        "meaning": "माता"
      },
      {
        "word": "भूमिः॑",
        "meaning": "भूमि"
      },
      {
        "word": "पु॒त्रः",
        "meaning": "पुत्र"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं"
      },
      {
        "word": "पृ॒थि॒व्याः",
        "meaning": "इस पृथ्वी का"
      },
      {
        "word": "प॒र्जन्यः॑",
        "meaning": "मेघ / पर्जन्य"
      },
      {
        "word": "पि॒ता",
        "meaning": "पिता"
      },
      {
        "word": "सः",
        "meaning": "वह"
      },
      {
        "word": "उ॒",
        "meaning": "भी"
      },
      {
        "word": "नः॒",
        "meaning": "हमारा"
      },
      {
        "word": "पि॒प॒र्तु॒",
        "meaning": "पालन-पोषण करे"
      }
    ],
    "shastricContext": "सनातन पर्यावरण दर्शन, राष्ट्रीय एकात्मता और मातृभूमि-भक्ति का विश्व-विख्यात उद्घोष — 'माता भूमिः पुत्रो अहं पृथिव्याः'। यह मंत्र मानव और प्रकृति के सम्बंध को उपभोग्य नहीं, अपितु मातृ-पुत्र का पवित्र सम्बंध घोषित करता है।",
    "audioUrl": null,
    "previousId": "av-12-1-3",
    "nextId": "av-12-1-63",
    "chapterMantraIds": [
      "av-12-1-1",
      "av-12-1-3",
      "av-12-1-12",
      "av-12-1-63"
    ],
    "orderIndex": 9,
    "status": "ACTIVE"
  },
  {
    "id": "av-19-9-14",
    "slug": "av-19-9-14",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-19-shanti",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (विश्व शांति सूक्त)",
    "sectionRef": "काण्ड १९, सूक्त ९, मन्त्र १४",
    "mantraNumber": "१९.९.१४",
    "rishi": "महर्षि अथर्वा / भृगु",
    "devata": "विश्वेदेवाः एवं सर्वशान्तिः",
    "chhanda": "निचृदनुष्टुप् / बृहती",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ द्यौः शान्ति॑र॒न्तरि॑क्षं॒ शान्तिः॑ पृथि॒वी शान्ति॒रापः॒ शान्तिरोष॑धयः॒ शान्तिः॑।\nवन॒स्पत॑यः॒ शान्ति॒र्विश्वे॑ दे॒वाः शान्ति॒र्ब्रह्म॒ शान्तिः॒ सर्वं॒ शान्तिः॒ शान्ति॑रे॒व शान्तिः॒ सा मा॒ शान्ति॑रेधि॥१४॥",
    "transliteration": "oṃ dyauḥ śāntir antarikṣaṃ śāntiḥ pṛthivī śāntir āpaḥ śāntir oṣadhayaḥ śāntiḥ |\nvanaspatayaḥ śāntir viśve devāḥ śāntir brahma śāntiḥ sarvaṃ śāntiḥ śāntir eva śāntiḥ sā mā śāntir edhi || 14 ||",
    "hindiTranslation": "द्युलोक में शांति हो, अंतरिक्ष में शांति हो, पृथ्वी पर शांति हो, जल में शांति हो, औषधियों में शांति हो, वनस्पतियों में शांति हो, विश्वेदेवों में शांति हो, परब्रह्म में शांति हो, समस्त चराचर जगत में शांति ही शांति हो; और वह परम शांति मेरे अंतःकरण में प्रविष्ट होकर सदा वृद्धि को प्राप्त हो!",
    "englishTranslation": "May peace radiate in the celestial realms; may peace permeate the atmosphere; peace on earth; peace in waters; peace in medicinal herbs; peace in vegetation and trees; peace in all cosmic divinities; peace in Brahman; may peace prevail everywhere; may peace itself be peaceful; and may that supreme peace abide in me!",
    "hinglishTranslation": "Swarglok mein shanti ho, antariksh mein shanti ho, prithvi par shanti ho, jal aur aushadhiyon mein shanti ho. Samast vanaspati, devta aur parbrahma shant ho. Sabhi jagah shanti hi shanti ho; aur wo divya shanti mere hriday mein vikasit ho!",
    "padapatha": [
      {
        "word": "द्यौः",
        "meaning": "द्युलोक / आकाश"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हो"
      },
      {
        "word": "अ॒न्तरि॑क्षम्",
        "meaning": "अंतरिक्ष"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हो"
      },
      {
        "word": "पृ॒थि॒वी",
        "meaning": "पृथ्वी"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हो"
      },
      {
        "word": "आपः॑",
        "meaning": "जल-राशियाँ"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हों"
      },
      {
        "word": "ओष॑धयः",
        "meaning": "समस्त औषधियाँ"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हों"
      },
      {
        "word": "वन॒स्पत॑यः",
        "meaning": "वनस्पति व वृक्ष"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिमय हों"
      },
      {
        "word": "विश्वे॑",
        "meaning": "समस्त"
      },
      {
        "word": "दे॒वाः",
        "meaning": "देवगण"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांतिदाता हों"
      },
      {
        "word": "ब्रह्म॑",
        "meaning": "परब्रह्म"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांति स्वरूप हो"
      },
      {
        "word": "सर्व॑म्",
        "meaning": "समस्त ब्रह्माण्ड"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांत हो"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांति"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांति हो"
      },
      {
        "word": "सा",
        "meaning": "वह परम शांति"
      },
      {
        "word": "मा॒",
        "meaning": "मेरे भीतर"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शांति रूप होकर"
      },
      {
        "word": "ए॒धि॒",
        "meaning": "विराजमान व वृद्धिंगत हो"
      }
    ],
    "shastricContext": "वैदिक सनातन वांग्मय का महाशांति मंत्र। यजुर्वेद (३६.१७) एवं अथर्ववेद (१९.९.१४) में समान रूप से प्रतिष्ठित यह मंत्र समस्त ब्रह्माण्ड, पारिस्थितिकी (Ecology), और मानव चेतना के मध्य एकात्मता और शांति की पराकाष्ठा है।",
    "audioUrl": null,
    "previousId": "av-19-9-1",
    "nextId": null,
    "chapterMantraIds": [
      "av-19-9-1",
      "av-19-9-14"
    ],
    "orderIndex": 12,
    "status": "ACTIVE"
  },
  {
    "id": "rv-1-1-4",
    "slug": "rv-1-1-4",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा ४",
    "mantraNumber": "१.१.४",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "अग्ने॒ यं य॒ज्ञम॑ध्व॒रं वि॒श्वत॑ः परि॒भूरसि॑।\nस इद्दे॒वेषु॑ गच्छति॥४॥",
    "transliteration": "agne yaṃ yajñam adhvaraṃ viśvataḥ paribhūr asi |\nsa id deveṣu gacchati || 4 ||",
    "hindiTranslation": "हे अग्निदेव! जिस हिंसारहित, पवित्र यज्ञ को आप सब ओर से अपनी रक्षा में घेर लेते हैं (व्याप्त रहते हैं), वही यज्ञ निश्चय ही देवताओं तक पहुँचता है।",
    "englishTranslation": "O Agni, whatever non-violent sacrifice thou encompassest on every side, that alone goes directly unto the gods.",
    "hinglishTranslation": "Hey Agni Dev! Jis ahimsak aur pavitra yagya ko aap chaaron taraf se apni raksha mein gher lete hain, wahi yagya devtaon tak nishchit roop se pahunchta hai.",
    "padapatha": [
      {
        "word": "अग्ने॑",
        "meaning": "हे अग्निदेव"
      },
      {
        "word": "यम्",
        "meaning": "जिस"
      },
      {
        "word": "य॒ज्ञम्",
        "meaning": "यज्ञ को"
      },
      {
        "word": "अ॒ध्व॒रम्",
        "meaning": "हिंसारहित, निर्विघ्न"
      },
      {
        "word": "वि॒श्वतः॑",
        "meaning": "सब ओर से"
      },
      {
        "word": "प॒रि॒ऽभूः",
        "meaning": "रक्षक रूप में व्याप्त"
      },
      {
        "word": "असि॑",
        "meaning": "आप हैं"
      },
      {
        "word": "सः",
        "meaning": "वही यज्ञ"
      },
      {
        "word": "इत्",
        "meaning": "निश्चय ही"
      },
      {
        "word": "दे॒वेषु॑",
        "meaning": "देवताओं के पास"
      },
      {
        "word": "ग॒च्छ॒ति॒",
        "meaning": "पहुँचता है"
      }
    ],
    "shastricContext": "'अध्वर' शब्द का अर्थ है हिंसारहित और अक्षय। अग्निदेव को यज्ञ का परम रक्षक बताया गया है जो दैवी और आसुरी विघ्नों से यज्ञ की रक्षा करते हैं।",
    "audioUrl": null,
    "previousId": "rv-1-1-3",
    "nextId": "rv-1-1-5",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "rv-1-1-5",
    "slug": "rv-1-1-5",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा ५",
    "mantraNumber": "१.१.५",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "अ॒ग्निर्होता॑ क॒विक्र॑तुः स॒त्यश्चि॒त्रश्र॑वस्तमः।\nदे॒वो दे॒वेभि॒रा ग॑मत्॥५॥",
    "transliteration": "agnir hotā kavikratuḥ satyaś citraśravastamaḥ |\ndevo devebhir ā gamat || 5 ||",
    "hindiTranslation": "अग्निदेव जो दिव्य होता हैं, क्रांतदर्शी प्रज्ञा और अमोघ संकल्प से संपन्न हैं, सत्यनिष्ठ हैं तथा अद्भुत एवं विविध यश से परिपूर्ण हैं; वे प्रकाशमान देव अन्य देवों के साथ इस यज्ञ में पधारें।",
    "englishTranslation": "May Agni, the priestly invoker, possessing poetic foresight and divine resolve, true and of wondrous renown, come hither, a God accompanied by all the gods.",
    "hinglishTranslation": "Agni Dev jo divya aahvaankarta hain, jinme divya gyan aur sankalpa shakti hai, jo satyaswaroop aur anupam kirti waale hain, wo baki sabhi devon ke saath yahan padharein.",
    "padapatha": [
      {
        "word": "अ॒ग्निः",
        "meaning": "अग्निदेव"
      },
      {
        "word": "होता॑",
        "meaning": "होता ऋत्विक"
      },
      {
        "word": "क॒विऽक्र॑तुः",
        "meaning": "क्रांतदर्शी प्रज्ञा एवं संकल्पयुक्त"
      },
      {
        "word": "स॒त्यः",
        "meaning": "सत्यस्वरूप व अमोघ"
      },
      {
        "word": "चि॒त्रऽश्र॑वःऽतमः",
        "meaning": "अद्भुत और विविध कीर्ति वाले"
      },
      {
        "word": "दे॒वः",
        "meaning": "प्रकाशमान देव"
      },
      {
        "word": "दे॒वेभिः॑",
        "meaning": "अन्य देवों के साथ"
      },
      {
        "word": "आ",
        "meaning": "यहाँ"
      },
      {
        "word": "ग॒म॒त्",
        "meaning": "पधारें / आएं"
      }
    ],
    "shastricContext": "'कविक्रतु' ऋग्वेद का एक अत्यंत गूढ़ विशेषण है, जिसका अर्थ है ऐसा देव जिसकी क्रिया और संकल्प दूरदर्शी कवि (ऋषि) की चेतना से संचालित हों।",
    "audioUrl": null,
    "previousId": "rv-1-1-4",
    "nextId": "rv-1-1-9",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "rv-1-1-9",
    "slug": "rv-1-1-9",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-1",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १, सूक्त १, ऋचा ९",
    "mantraNumber": "१.१.९",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "अग्नि (Agni)",
    "chhanda": "गायत्री (८+८+८ = २४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "स नः॑ पि॒तेव॑ सू॒नवेऽग्ने॑ सूपाय॒नो भ॑व।\nसच॑स्वा नः स्व॒स्तये॑॥९॥",
    "transliteration": "sa naḥ piteva sūnave'gne sūpāyano bhava |\nsacasvā naḥ svastaye || 9 ||",
    "hindiTranslation": "हे अग्निदेव! जिस प्रकार पिता अपने पुत्र के लिए सहज सुलभ एवं स्नेहमय होता है, उसी प्रकार आप हमारे लिए सुलभ होइए; और हमारे समग्र कल्याण एवं मंगल के लिए हमारे साथ रहिए।",
    "englishTranslation": "O Agni, be thou easily accessible unto us even as a father is unto his son; abide with us for our supreme welfare and enduring peace.",
    "hinglishTranslation": "Hey Agni Dev! Jaise pita apne putra ke liye sahaj aur prem se yukt hota hai, waise hi aap hamare liye sulabh hoiye; aur hamare kalyan aur mangal ke liye sada hamare sath rahiye.",
    "padapatha": [
      {
        "word": "सः",
        "meaning": "वह आप"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे लिए"
      },
      {
        "word": "पि॒ताऽइ॑व",
        "meaning": "पिता के सदृश"
      },
      {
        "word": "सू॒नवे॑",
        "meaning": "पुत्र के प्रति"
      },
      {
        "word": "अग्ने॑",
        "meaning": "हे अग्निदेव"
      },
      {
        "word": "सु॒ऽउ॒पा॒य॒नः",
        "meaning": "सुगमता से प्राप्त होने वाले"
      },
      {
        "word": "भ॒व॒",
        "meaning": "होइए"
      },
      {
        "word": "सच॑स्व",
        "meaning": "साथ रहिए / जुड़े रहिए"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे"
      },
      {
        "word": "स्व॒स्तये॑",
        "meaning": "कल्याण एवं मंगल के लिए"
      }
    ],
    "shastricContext": "अग्नि सूक्त का अंतिम उपसंहार मंत्र। यह मंत्र परमात्मा और साधक के मध्य पिता और पुत्र के परम आत्मीय, वात्सल्यपूर्ण संबंध को स्थापित करता है।",
    "audioUrl": null,
    "previousId": "rv-1-1-5",
    "nextId": "rv-3-62-10",
    "chapterMantraIds": [
      "rv-1-1-1",
      "rv-1-1-2",
      "rv-1-1-3",
      "rv-1-1-4",
      "rv-1-1-5",
      "rv-1-1-9"
    ],
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-90-2",
    "slug": "rv-10-90-2",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-90",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा / वाजसनेयि ३१",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त ९०, ऋचा २",
    "mantraNumber": "१०.९०.२",
    "rishi": "नारायण ऋषि",
    "devata": "विराट् पुरुष (Cosmic Being)",
    "chhanda": "अनुष्टुप् (८+८+८+८ = ३२ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "पुरु॑ष ए॒वेदं सर्वं॒ यद्भू॒तं यच्च॒ भव्य॑म्।\nउ॒तामृ॑त॒त्वस्येशो॑ यदन्ने॑नाति॒रोह॑ति॥२॥",
    "transliteration": "puruṣa evedaṃ sarvaṃ yad bhūtaṃ yac ca bhavyam |\nutāmṛtatvasyeśo yad annenātirohati || 2 ||",
    "hindiTranslation": "यह सब कुछ जो वर्तमान में है, जो भूतकाल में था और जो भविष्य में होगा—वह सब केवल विराट् पुरुष ही है। वह अमृतत्व (अमरता) का भी स्वामी है, और जो कुछ अन्न (भोग्य जगत) द्वारा विकसित होता है, उसका भी वह अतिक्रमण करता है।",
    "englishTranslation": "The Purusha alone is all this universe—what has been in the past and what is yet to come in the future. He is also the Sovereign Lord of immortality, as He transcends all that grows through food and material existence.",
    "hinglishTranslation": "Jo kuch bhi sansaar mein pehle tha, jo aaj hai, aur jo aage hoga—sab kuch wo Virat Purush hi hai. Wo amritatva (Moksha) ka Swami hai aur bhautik jagat se pare hai.",
    "padapatha": [
      {
        "word": "पुरु॑षः",
        "meaning": "विराट् परमपुरुष ही"
      },
      {
        "word": "ए॒व",
        "meaning": "निश्चय ही"
      },
      {
        "word": "इ॒दम्",
        "meaning": "यह दृश्य जगत"
      },
      {
        "word": "सर्व॑म्",
        "meaning": "सब कुछ"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "भू॒तम्",
        "meaning": "भूतकाल में हुआ"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "च॒",
        "meaning": "और"
      },
      {
        "word": "भव्य॑म्",
        "meaning": "भविष्य में होने वाला है"
      },
      {
        "word": "उ॒त",
        "meaning": "और भी"
      },
      {
        "word": "अ॒मृ॒त॒त्वस्य॑",
        "meaning": "अमरत्व का"
      },
      {
        "word": "ईशः॑",
        "meaning": "स्वामी है"
      },
      {
        "word": "यत्",
        "meaning": "जो कि"
      },
      {
        "word": "अन्ने॑न",
        "meaning": "अन्न के द्वारा"
      },
      {
        "word": "अ॒ति॒ऽरोह॑ति",
        "meaning": "संवर्धित होता है और अतिक्रमण करता है"
      }
    ],
    "shastricContext": "यह मंत्र काल (Past, Present, Future) और अमृतत्व दोनों को पुरुष की ही अभिव्यक्ति घोषित करता है।",
    "audioUrl": null,
    "previousId": "rv-10-90-1",
    "nextId": "rv-10-90-16",
    "chapterMantraIds": [
      "rv-10-90-1",
      "rv-10-90-2",
      "rv-10-90-16"
    ],
    "orderIndex": 10,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-90-16",
    "slug": "rv-10-90-16",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-90",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा / वाजसनेयि ३१",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त ९०, ऋचा १६",
    "mantraNumber": "१०.९०.१६",
    "rishi": "नारायण ऋषि",
    "devata": "विराट् पुरुष (Cosmic Being)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "य॒ज्ञेन॑ य॒ज्ञम॑यजन्त दे॒वास्तानि॒ धर्मा॑णि प्रथ॒मान्या॑सन्।\nते ह॒ नाकं॑ महि॒मान॑ः सचन्त॒ यत्र॒ पूर्वे॑ सा॒ध्याः सन्ति॑ दे॒वाः॥१६॥",
    "transliteration": "yajñena yajñam ayajanta devās tāni dharmāṇi prathamāny āsan |\nte ha nākaṃ mahimānaḥ sacanta yatra pūrve sādhyāḥ santi devāḥ || 16 ||",
    "hindiTranslation": "देवताओं ने आत्म-समर्पण रूपी यज्ञ के द्वारा यज्ञस्वरूप विराट् पुरुष की उपासना की; वे ही कर्म सृष्टि के सर्वप्रथम मौलिक धर्म (सनातन नियम) बने। वे ही महिमावान साधक उस परम आनंदमय द्युलोक (स्वर्ग/मोक्ष) को प्राप्त करते हैं, जहाँ पुरातन साध्य देवगण निवास करते हैं।",
    "englishTranslation": "By means of sacrifice the gods worshipped the Cosmic Purusha who is Himself the sacrifice; those deeds became the primordial laws of Dharma. Those glorious ones attain the celestial paradise of bliss, where dwell the ancient gods and Sadhyas.",
    "hinglishTranslation": "Devtaon ne yagya ke dwara yagyaswaroop Virat Purush ki pooja ki; wo hi karm is sansaar ke pehle Dharma ke niyam bane. Aise mahagyani sadhak us divya paramdham ko paate hain jahan puratan devta nivaas karte hain.",
    "padapatha": [
      {
        "word": "य॒ज्ञेन॑",
        "meaning": "यज्ञ के द्वारा"
      },
      {
        "word": "य॒ज्ञम्",
        "meaning": "यज्ञस्वरूप विराट पुरुष को"
      },
      {
        "word": "अ॒य॒ज॒न्त॒",
        "meaning": "पूजन किया"
      },
      {
        "word": "दे॒वाः",
        "meaning": "देवगणों ने"
      },
      {
        "word": "तानि॑",
        "meaning": "वे विधान"
      },
      {
        "word": "धर्मा॑णि",
        "meaning": "धर्म के मौलिक नियम"
      },
      {
        "word": "प्र॒थ॒मानि॑",
        "meaning": "सर्वप्रथम"
      },
      {
        "word": "आ॒स॒न्",
        "meaning": "हुए"
      },
      {
        "word": "ते",
        "meaning": "वे"
      },
      {
        "word": "ह॒",
        "meaning": "निश्चय ही"
      },
      {
        "word": "नाक॑म्",
        "meaning": "परम आनंदमय द्युलोक को"
      },
      {
        "word": "म॒हि॒मानः॑",
        "meaning": "महिमावान सिद्ध पुरुष"
      },
      {
        "word": "स॒च॒न्त॒",
        "meaning": "प्राप्त हुए"
      },
      {
        "word": "यत्र॑",
        "meaning": "जहाँ"
      },
      {
        "word": "पूर्वे॑",
        "meaning": "प्राचीन"
      },
      {
        "word": "सा॒ध्याः",
        "meaning": "साध्य नामक देवगण"
      },
      {
        "word": "सन्ति॑",
        "meaning": "निवास करते हैं"
      },
      {
        "word": "दे॒वाः",
        "meaning": "दिव्य देव"
      }
    ],
    "shastricContext": "पुरुष सूक्त का अत्यंत प्रसिद्ध उपसंहार मंत्र, जो यजुर्वेद (३१.१६) में भी यथावत पठित है। यह यज्ञ को सृष्टि का सर्वोच्च धर्म और मोक्ष का साधन निरूपित करता है।",
    "audioUrl": null,
    "previousId": "rv-10-90-2",
    "nextId": "rv-10-121-1",
    "chapterMantraIds": [
      "rv-10-90-1",
      "rv-10-90-2",
      "rv-10-90-16"
    ],
    "orderIndex": 11,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-121-1",
    "slug": "rv-10-121-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-121",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १२१, ऋचा १",
    "mantraNumber": "१०.१२१.१",
    "rishi": "हिरण्यगर्भ प्राजापत्य",
    "devata": "कः / प्रजापतिः (The Supreme Creator)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ हि॒र॒ण्य॒ग॒र्भः सम॑वर्त॒ताग्रे॑ भू॒तस्य॑ जा॒तः पति॒रेक॑ आसीत्।\nस दा॑धार पृथि॒वीं द्यामु॒तेमां कस्मै॑ दे॒वाय॑ ह॒विषा॑ विधेम॥१॥",
    "transliteration": "oṃ hiraṇyagarbhaḥ samavartatāgre bhūtasya jātaḥ patir eka āsīt |\nsa dādhāra pṛthivīṃ dyām utemāṃ kasmai devāya haviṣā vidhema || 1 ||",
    "hindiTranslation": "सृष्टि के प्रारंभ में ज्योतिर्मय हिरण्यगर्भ ही विद्यमान था। उत्पन्न होते ही वह समस्त चराचर जगत का एकमात्र अधिपति था। उसने इस पृथ्वी और द्युलोक को सुदृढ़ता से धारण कर रखा है। उस 'क' स्वरूप (सुख और आनंद के दाता) प्रजापति परमात्मा की हम हविष्य द्वारा भक्तिपूर्वक आराधना करते हैं।",
    "englishTranslation": "In the beginning the Golden Embryo (Hiranyagarbha) existed; manifested as the sole Sovereign Lord of all created beings. He sustained and established this earth and heaven. Unto that blissful Lord of creation ('Ka' / Prajapati) do we offer worship with our devout oblations.",
    "hinglishTranslation": "Srishti ke shuru mein keval jyotirmay Hiranyagarbha hi tha. Wo paida hote hi poore brahmand ka ekmatra swami bana. Usne prithvi aur swarga ko thambh rakha hai. Us parampita Prajapati Parmatma ki hum shraddhapoorvak aahuti dekar pooja karte hain.",
    "padapatha": [
      {
        "word": "हि॒र॒ण्य॒ऽग॒र्भः",
        "meaning": "ज्योतिर्मय ब्रह्माण्ड का जनक हिरण्यगर्भ"
      },
      {
        "word": "सम्",
        "meaning": "सम्यक् रूप से"
      },
      {
        "word": "अ॒व॒र्त॒त॒",
        "meaning": "विद्यमान था"
      },
      {
        "word": "अग्रे॑",
        "meaning": "सृष्टि के प्रारंभ में"
      },
      {
        "word": "भू॒तस्य॑",
        "meaning": "समस्त उत्पन्न प्राणियों व चराचर जगत का"
      },
      {
        "word": "जा॒तः",
        "meaning": "प्रकट होकर"
      },
      {
        "word": "पतिः॑",
        "meaning": "एकछत्र स्वामी, अधिपति"
      },
      {
        "word": "एकः॑",
        "meaning": "एकमात्र अद्वितीय"
      },
      {
        "word": "आ॒सी॒त्",
        "meaning": "था"
      },
      {
        "word": "सः",
        "meaning": "उस परमात्मा ने"
      },
      {
        "word": "दा॒धा॒र॒",
        "meaning": "धारण कर रखा है"
      },
      {
        "word": "पृ॒थि॒वीम्",
        "meaning": "इस पृथ्वी लोक को"
      },
      {
        "word": "द्याम्",
        "meaning": "द्युलोक को"
      },
      {
        "word": "उ॒त",
        "meaning": "और"
      },
      {
        "word": "इ॒माम्",
        "meaning": "इस दृश्य जगत को"
      },
      {
        "word": "कस्मै॑",
        "meaning": "'क' स्वरूप आनंदमय प्रजापति"
      },
      {
        "word": "दे॒वाय॑",
        "meaning": "देव के लिए"
      },
      {
        "word": "ह॒विषा॑",
        "meaning": "हविष्य द्वारा"
      },
      {
        "word": "वि॒धे॒म॒",
        "meaning": "हम सेवा व आराधना करें"
      }
    ],
    "shastricContext": "ऋग्वेद का सुप्रसिद्ध हिरण्यगर्भ सूक्त। 'कस्मै देवाय हविषा विधेम'—यहाँ 'क' शब्द आनंदस्वरूप प्रजापति परमात्मा का साक्षात वाचक नाम है (को वै प्रजापतिः)।",
    "audioUrl": null,
    "previousId": "rv-10-90-16",
    "nextId": "rv-10-125-1",
    "chapterMantraIds": [
      "rv-10-121-1"
    ],
    "orderIndex": 12,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-125-1",
    "slug": "rv-10-125-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-125",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १२५, ऋचा १",
    "mantraNumber": "१०.१२५.१",
    "rishi": "वागाम्भृणी (Vāg Āmbhṛṇī)",
    "devata": "परमात्मा / आद्यशक्ति वाक् (Parāśakti Vāk)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ अ॒हं रु॒द्रेभि॒र्वसु॑भिश्‍चराम्य॒हमा॑दि॒त्यैरु॒त वि॒श्वदे॑वैः।\nअ॒हं मि॒त्रावरु॑णो॒भा बि॑भर्म्य॒हमि॑न्द्रा॒ग्नी अ॒हम॒श्विनो॒भा॥१॥",
    "transliteration": "oṃ ahaṃ rudrebhir vasubhiś carāmy aham ādityair uta viśvadevaiḥ |\nahaṃ mitrāvaruṇobhā bibharmy aham indrāgnī aham aśvinobhā || 1 ||",
    "hindiTranslation": "मैं (ब्रह्मस्वरूपा वाक्-शक्ति) ही एकादश रुद्रों और अष्ट वसुओं के साथ विचरण करती हूँ; मैं ही द्वादश आदित्यों और समस्त विश्वेदेवों के साथ संचरण करती हूँ। मैं ही मित्र और वरुण दोनों को धारण करती हूँ, मैं ही इन्द्र और अग्नि को तथा दोनों अश्विनीकुमारों को धारण व पोषण करती हूँ।",
    "englishTranslation": "I wander with the Rudras and the Vasus; I wander with the Adityas and all the gods. I uphold both Mitra and Varuna; I sustain Indra and Agni, and both the celestial Ashvins.",
    "hinglishTranslation": "Main (Brahma-swaroopa Adyashakti Vak) hi Rudron aur Vasuon ke sath vicharan karti hoon; main hi Aadityon aur Vishvedevon ke sath chalti hoon. Main hi Mitra-Varun, Indra-Agni aur dono Ashwini Kumar ko dharan karti hoon.",
    "padapatha": [
      {
        "word": "अ॒हम्",
        "meaning": "मैं (ब्रह्मस्वरूपा आद्यशक्ति वाक्)"
      },
      {
        "word": "रु॒द्रेभिः॑",
        "meaning": "एकादश रुद्रों के साथ"
      },
      {
        "word": "वसु॑ऽभिः",
        "meaning": "अष्ट वसुओं के साथ"
      },
      {
        "word": "च॒रा॒मि॒",
        "meaning": "विचरण करती हूँ"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं"
      },
      {
        "word": "आ॒दि॒त्यैः",
        "meaning": "द्वादश आदित्यों के साथ"
      },
      {
        "word": "उ॒त",
        "meaning": "और भी"
      },
      {
        "word": "वि॒श्वऽदे॑वैः",
        "meaning": "समस्त विश्वेदेवों के साथ"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं ही"
      },
      {
        "word": "मि॒त्रावरु॑णा",
        "meaning": "मित्र और वरुण दोनों को"
      },
      {
        "word": "उ॒भा",
        "meaning": "दोनों को"
      },
      {
        "word": "बि॒भ॒र्मि॒",
        "meaning": "धारण और पोषण करती हूँ"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं"
      },
      {
        "word": "इ॒न्द्रा॒ग्नी",
        "meaning": "इंद्र और अग्नि को"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं"
      },
      {
        "word": "अ॒श्विना॑",
        "meaning": "दोनों अश्विनीकुमारों को"
      },
      {
        "word": "उ॒भा",
        "meaning": "दोनों को"
      }
    ],
    "shastricContext": "देवी सूक्त (वाक् सूक्त) सनातन धर्म में शक्ति साधना, शाक्त दर्शन एवं दुर्गा सप्तशती का मूल वैदिक आधार है। विदुषी ब्रह्मवादिनी वागाम्भृणी ने समाधि की अवस्था में स्वयं को संपूर्ण ब्रह्माण्ड की आधारभूत पराशक्ति के रूप में साक्षात्कृत किया।",
    "audioUrl": null,
    "previousId": "rv-10-121-1",
    "nextId": "rv-10-129-1",
    "chapterMantraIds": [
      "rv-10-125-1"
    ],
    "orderIndex": 13,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-129-1",
    "slug": "rv-10-129-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-129",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १२९, ऋचा १",
    "mantraNumber": "१०.१२९.१",
    "rishi": "परमेष्ठी प्रजापति",
    "devata": "भाववृत्त / परमात्मा (Bhāvavṛtta)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "नास॑दासी॒न्नो सदा॑सीत्त॒दानीं॒ नासी॒द्रजो॒ नो व्यो॑मा प॒रो यत्।\nकिमाव॑रीवः॒ कुह॒ कस्य॒ शर्म॒न्नम्भः॒ किमा॑सी॒द्गह॑नं गभी॒रम्॥१॥",
    "transliteration": "nāsad āsīn no sad āsīt tadānīṃ nāsīd rajo no vyomā paro yat |\nkim āvarīvaḥ kuha kasya śarmann ambhaḥ kim āsīd gahanaṃ gabhīram || 1 ||",
    "hindiTranslation": "सृष्टि से पूर्व उस समय न असत् (अभाव) था और न सत् (भाव/दृश्य जगत) था। न कोई अंतरिक्ष था और न उससे परे का आकाश। तब किस तत्व ने किसको ढँक रखा था? वह आवरण कहाँ था और किसके आश्रय में था? क्या तब कोई अगाध और अथाह प्रलयकालीन जल विद्यमान था?",
    "englishTranslation": "Then there was neither non-existence nor existence; there was neither the atmospheric realm nor the celestial sky that lies beyond. What enveloped all, and where, and under whose protection? Was there water in that impenetrable, unfathomable deep?",
    "hinglishTranslation": "Srishti ke banne se pehle na to asat (kuch na hona) tha aur na hi sat (sansaar) tha. Na antariksh tha aur na uske pare ka aakaash. Tab kisne kisko dhaanp rakha tha? Kahan aur kiske aashray mein tha wo sab? Kya koi agadh aur gahra jal tha?",
    "padapatha": [
      {
        "word": "न",
        "meaning": "न तो"
      },
      {
        "word": "अस॑त्",
        "meaning": "अभाव / असत् तत्व"
      },
      {
        "word": "आ॒सी॒त्",
        "meaning": "था"
      },
      {
        "word": "नो",
        "meaning": "न ही"
      },
      {
        "word": "सत्",
        "meaning": "स्थूल दृश्यमान जगत"
      },
      {
        "word": "आ॒सी॒त्",
        "meaning": "था"
      },
      {
        "word": "त॒दानी॑म्",
        "meaning": "सृष्टि उत्पत्ति से पूर्व"
      },
      {
        "word": "न",
        "meaning": "न"
      },
      {
        "word": "आ॒सी॒त्",
        "meaning": "था"
      },
      {
        "word": "रजः॑",
        "meaning": "अंतरिक्ष लोक"
      },
      {
        "word": "नो",
        "meaning": "न"
      },
      {
        "word": "व्योम॑",
        "meaning": "आकाश"
      },
      {
        "word": "प॒रः",
        "meaning": "परे"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "किम्",
        "meaning": "क्या"
      },
      {
        "word": "आ",
        "meaning": "सब ओर"
      },
      {
        "word": "व॒री॒वः॒",
        "meaning": "आच्छादित कर रहा था"
      },
      {
        "word": "कुह॑",
        "meaning": "कहाँ"
      },
      {
        "word": "कस्य॑",
        "meaning": "किसके"
      },
      {
        "word": "शर्म॑न्",
        "meaning": "आश्रय में"
      },
      {
        "word": "अम्भः॑",
        "meaning": "प्रलयकालीन कारण जल"
      },
      {
        "word": "किम्",
        "meaning": "क्या"
      },
      {
        "word": "आ॒सी॒त्",
        "meaning": "था"
      },
      {
        "word": "गहन॑म्",
        "meaning": "अगाध"
      },
      {
        "word": "ग॒भी॒रम्",
        "meaning": "गहरा / अथाह"
      }
    ],
    "shastricContext": "विश्व साहित्य का महानतम ब्रह्माण्डीय उद्भव सूक्त (Cosmological Hymn of Creation)। मैक्स मूलर और स्वामी विवेकानंद ने इसे मानवीय प्रज्ञा की सर्वोच्च दार्शनिक ऊंचाई माना है।",
    "audioUrl": null,
    "previousId": "rv-10-125-1",
    "nextId": "rv-10-129-7",
    "chapterMantraIds": [
      "rv-10-129-1",
      "rv-10-129-7"
    ],
    "orderIndex": 14,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-129-7",
    "slug": "rv-10-129-7",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-129",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १२९, ऋचा ७",
    "mantraNumber": "१०.१२९.७",
    "rishi": "परमेष्ठी प्रजापति",
    "devata": "भाववृत्त / परमात्मा (Bhāvavṛtta)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "इ॒यं विसृ॑ष्टि॒र्यत॑ आब॒भूव॒ यदि॑ वा द॒धे यदि॑ वा॒ न।\nयो अ॒स्याध्य॑क्षः पर॒मे व्यो॑म॒न्त्सो अ॒ङ्ग वे॑द॒ यदि॑ वा॒ न वेद॑॥७॥",
    "transliteration": "iyaṃ visṛṣṭir yata ābabhūva yadi vā dadhe yadi vā na |\nyo asyādhyakṣaḥ parame vyoman tso aṅga veda yadi vā na veda || 7 ||",
    "hindiTranslation": "यह विविध विचित्र सृष्टि जिस परम स्त्रोत से उत्पन्न हुई है, चाहे उसने इसे रचा अथवा नहीं रचा; जो इस संपूर्ण ब्रह्माण्ड का परम साक्षी बनकर सर्वोच्च चिदाकाश में स्थित है, हे साधक! निश्चय ही वह इसे जानता है, अथवा कदाचित् वह भी नहीं जानता (अर्थात यह रहस्य वाणी और बुद्धि की पहुँच से सर्वथा परे अनिर्वचनीय है)!",
    "englishTranslation": "Whence this manifold creation arose, whether divine will fashioned it or whether it did not; He who is the supreme overseer of this universe in the highest heaven—He surely knows, or maybe even He does not know (as this ultimate reality transcends all conceptual knowing).",
    "hinglishTranslation": "Yeh srishti jahan se paida hui, chahe usne ise banaya ya nahi banaya; jo is pure Universe ka supreme witness bankar param aakash mein sthit hai, wo prabhu ise jaanta hai, ya shayad wo bhi nahi jaanta (kyunki yeh rahasya buddhi se pare hai).",
    "padapatha": [
      {
        "word": "इ॒यम्",
        "meaning": "यह विविध रूपों वाली"
      },
      {
        "word": "विऽसृ॑ष्टिः",
        "meaning": "विशेष सृष्टि"
      },
      {
        "word": "यतः॑",
        "meaning": "जिस मूल स्रोत से"
      },
      {
        "word": "आ॒ऽब॒भूव॑",
        "meaning": "प्रकट हुई / उत्पन्न हुई"
      },
      {
        "word": "यदि॑",
        "meaning": "चाहे"
      },
      {
        "word": "वा",
        "meaning": "अथवा"
      },
      {
        "word": "द॒धे",
        "meaning": "उसने इसे धारण किया / रचा"
      },
      {
        "word": "यदि॑",
        "meaning": "चाहे"
      },
      {
        "word": "वा",
        "meaning": "अथवा"
      },
      {
        "word": "न",
        "meaning": "नहीं"
      },
      {
        "word": "यः",
        "meaning": "जो"
      },
      {
        "word": "अ॒स्य",
        "meaning": "इस सृष्टि का"
      },
      {
        "word": "अध्य॑क्षः",
        "meaning": "परम साक्षी / सर्वद्रष्टा प्रभु"
      },
      {
        "word": "प॒र॒मे",
        "meaning": "सर्वोच्च"
      },
      {
        "word": "व्यो॑मन्",
        "meaning": "चिदाकाश में"
      },
      {
        "word": "सः",
        "meaning": "वह"
      },
      {
        "word": "अ॒ङ्ग",
        "meaning": "हे प्रिय / निश्चय ही"
      },
      {
        "word": "वेद॑",
        "meaning": "जानता है"
      },
      {
        "word": "यदि॑",
        "meaning": "अथवा"
      },
      {
        "word": "वा",
        "meaning": "या"
      },
      {
        "word": "न",
        "meaning": "नहीं"
      },
      {
        "word": "वेद॑",
        "meaning": "जानता"
      }
    ],
    "shastricContext": "नासदीय सूक्त की अंतिम ऋचा। यह रहस्योद्घाटन का चरम बिंदु है जहाँ वैदिक ऋषि अगाध विनम्रता से यह उद्घोष करते हैं कि अंतिम सत्य 'अनिर्वचनीय' है।",
    "audioUrl": null,
    "previousId": "rv-10-129-1",
    "nextId": "rv-10-191-1",
    "chapterMantraIds": [
      "rv-10-129-1",
      "rv-10-129-7"
    ],
    "orderIndex": 15,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-191-1",
    "slug": "rv-10-191-1",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-191",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १९१, ऋचा १",
    "mantraNumber": "१०.१९१.१",
    "rishi": "संवनन आङ्गिरस",
    "devata": "अग्नि (Agni - The Unifier)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "सं-स॒मिद्यु॑वसे वृष॒न्नग्ने॒ विश्वा॑न्य॒र्य आ।\nइ॒ळस्प॒दे समि॑ध्यसे॒ स नो॒ वसूं॒न्या भ॑र॥१॥",
    "transliteration": "saṃ-sam id yuvase vṛṣann agne viśvāny arya ā |\niḷas pade sam idhyase sa no vasūny ā bhara || 1 ||",
    "hindiTranslation": "हे सामर्थ्यवान अग्निदेव! आप यज्ञाग्नि के रूप में पृथ्वी की पावन वेदी पर प्रज्वलित होते हैं और समस्त प्राणियों एवं पदार्थों को एक सूत्र में पिरोते हैं। आप हमारे लिए सब प्रकार के ऐश्वर्य और सद्भाव प्रदान कीजिए।",
    "englishTranslation": "O mighty Agni, showerer of bounties, thou gatherest together all things of the faithful; kindled upon the sacred altar-place of Earth, do thou bestow noble treasures upon us.",
    "hinglishTranslation": "Hey shaktishali Agni Dev! Aap sabhi praniyon ko ek sath jodte hain aur pavitra vedi par prajvalit hote hain. Aap hume samast divya sukh aur samriddhi pradaan karein.",
    "padapatha": [
      {
        "word": "सम्ऽस॑म्",
        "meaning": "सम्यक् रूप से, पूर्णतः"
      },
      {
        "word": "इत्",
        "meaning": "निश्चय ही"
      },
      {
        "word": "यु॒व॒से॒",
        "meaning": "तुम एकत्र करते हो / जोड़ते हो"
      },
      {
        "word": "वृ॒ष॒न्",
        "meaning": "हे सामर्थ्यवान् / वर्षक"
      },
      {
        "word": "अग्ने॑",
        "meaning": "हे अग्निदेव"
      },
      {
        "word": "विश्वा॑नि",
        "meaning": "समस्त पदार्थों और प्रजाओं को"
      },
      {
        "word": "अ॒र्यः",
        "meaning": "स्वामियों / उपासकों के"
      },
      {
        "word": "आ",
        "meaning": "सब ओर से"
      },
      {
        "word": "इ॒ळः",
        "meaning": "पृथ्वी की"
      },
      {
        "word": "प॒दे",
        "meaning": "वेदी स्थान पर"
      },
      {
        "word": "सम्",
        "meaning": "सम्यक् रूप से"
      },
      {
        "word": "इ॒ध्य॒से॒",
        "meaning": "प्रज्वलित किए जाते हो"
      },
      {
        "word": "सः",
        "meaning": "वह आप"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे लिए"
      },
      {
        "word": "वसूनि॑",
        "meaning": "समस्त ऐश्वर्यों को"
      },
      {
        "word": "आ",
        "meaning": "प्रचुरता से"
      },
      {
        "word": "भ॒र॒",
        "meaning": "प्रदान करो / लाओ"
      }
    ],
    "shastricContext": "ऋग्वेद संहिता का अंतिम सूक्त (१९१)। यह प्रथम मंत्र में अग्निदेव को समस्त मानव जाति को जोड़ने वाले वैश्विक केंद्र के रूप में स्थापित करता है।",
    "audioUrl": null,
    "previousId": "rv-10-129-7",
    "nextId": "rv-10-191-2",
    "chapterMantraIds": [
      "rv-10-191-1",
      "rv-10-191-2",
      "rv-10-191-3",
      "rv-10-191-4"
    ],
    "orderIndex": 16,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-191-2",
    "slug": "rv-10-191-2",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-191",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १९१, ऋचा २",
    "mantraNumber": "१०.१९१.२",
    "rishi": "संवनन आङ्गिरस",
    "devata": "संज्ञानम् (Unity / Harmony)",
    "chhanda": "अनुष्टुप् (८+८+८+८ = ३२ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "सं ग॑च्छध्वं॒ सं व॑दध्वं॒ सं वो॒ मना॑ंसि जानताम्।\nदे॒वा भा॒गं यथा॒ पूर्वे॑ संजाना॒ना उ॒पास॑ते॥२॥",
    "transliteration": "saṃ gacchadhvaṃ saṃ vadadhvaṃ saṃ vo manāṃsi jānatām |\ndevā bhāgaṃ yathā pūrve sañjānānā upāsate || 2 ||",
    "hindiTranslation": "तुम सब साथ मिलकर चलो, एक स्वर में संवाद करो, तुम्हारे मन एकमत होकर सत्य को जानें; जिस प्रकार प्राचीन काल में देवगण पूर्ण सामंजस्य से अपने-अपने यज्ञभाग को ग्रहण करते थे।",
    "englishTranslation": "Walk together in harmony; speak together with one voice; let your minds be in complete accord, just as the ancient gods of one mind accepted their portions of sacrifice.",
    "hinglishTranslation": "Tum sab ek sath milkar aage badho, ek sur mein baat karo, tumhare mann ek dusre ko samjhein; jaise puratan devta ekjut hokar apna yagyabhag grahan karte the.",
    "padapatha": [
      {
        "word": "सम्",
        "meaning": "साथ-साथ, एकमत होकर"
      },
      {
        "word": "ग॒च्छ॒ध्व॒म्",
        "meaning": "आगे बढ़ो, चलो"
      },
      {
        "word": "सम्",
        "meaning": "मिलकर"
      },
      {
        "word": "व॒द॒ध्व॒म्",
        "meaning": "संवाद करो, बोलो"
      },
      {
        "word": "सम्",
        "meaning": "समान रूप से"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारे"
      },
      {
        "word": "मना॑ंसि",
        "meaning": "मन और विचार"
      },
      {
        "word": "जा॒न॒ता॒म्",
        "meaning": "एक दूसरे को समझें"
      },
      {
        "word": "दे॒वाः",
        "meaning": "प्राचीन देवगण"
      },
      {
        "word": "भा॒गम्",
        "meaning": "यज्ञ के अपने अंश को"
      },
      {
        "word": "यथा॑",
        "meaning": "जिस प्रकार"
      },
      {
        "word": "पूर्वे॑",
        "meaning": "पुरातन काल में"
      },
      {
        "word": "सम्ऽजा॒ना॒नाः",
        "meaning": "एकमत होकर"
      },
      {
        "word": "उ॒पास॑ते",
        "meaning": "ग्रहण करते थे"
      }
    ],
    "shastricContext": "वैश्विक एकता, लोकतांत्रिक संवाद और सामाजिक समरसता का विश्व-प्रसिद्ध वैदिक गान।",
    "audioUrl": null,
    "previousId": "rv-10-191-1",
    "nextId": "rv-10-191-3",
    "chapterMantraIds": [
      "rv-10-191-1",
      "rv-10-191-2",
      "rv-10-191-3",
      "rv-10-191-4"
    ],
    "orderIndex": 17,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-191-3",
    "slug": "rv-10-191-3",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-191",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १९१, ऋचा ३",
    "mantraNumber": "१०.१९१.३",
    "rishi": "संवनन आङ्गिरस",
    "devata": "संज्ञानम् (Unity / Assembly)",
    "chhanda": "त्रिष्टुप् (११x४ = ४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "स॒मा॒नो मन्त्रः॒ समि॑तिः समा॒नी स॑मा॒नं मनः॑ स॒ह चि॒त्तमे॑षाम्।\nस॒मा॒नं मन्त्र॑म॒भि म॑न्त्रये वः समा॒नेन॑ वो ह॒विषा॑ जुहोमि॥३॥",
    "transliteration": "samāno mantraḥ samitiḥ samānī samānaṃ manaḥ saha cittam eṣām |\nsamānaṃ mantram abhi mantraye vaḥ samānena vo haviṣā juhomi || 3 ||",
    "hindiTranslation": "तुम्हारा परामर्श (लक्ष्य) समान हो, तुम्हारी सभा और संगठन निष्पक्ष व एकमत हों, तुम्हारा मन समान हो और तुम्हारी चेतना एक साथ जुड़ी रहे। मैं तुम्हें एक समान उद्देश्य का उपदेश देता हूँ और तुम्हारी एक समान हवि से यज्ञ सम्पन्न करता हूँ।",
    "englishTranslation": "Common be your counsel, common your assembly, common your purpose, and unified your thoughts! A common prayer do I impart unto you, and with a common oblation do I worship for you all.",
    "hinglishTranslation": "Tumhara prayas saman ho, tumhari sabha aur organization ekmat ho, tumhara mann aur chetna aapas mein jude hon. Main tumhe ek saman lakshya ka updesh deta hoon aur ek saman havi se yagya karta hoon.",
    "padapatha": [
      {
        "word": "स॒मा॒नः",
        "meaning": "समान, एकरूप"
      },
      {
        "word": "मन्त्रः॑",
        "meaning": "विचार, परामर्श, लक्ष्य"
      },
      {
        "word": "समि॑तिः",
        "meaning": "सभा, संगठन"
      },
      {
        "word": "स॒मा॒नी",
        "meaning": "समरस, एकाकार"
      },
      {
        "word": "स॒मा॒नम्",
        "meaning": "समान"
      },
      {
        "word": "मनः॑",
        "meaning": "मन"
      },
      {
        "word": "स॒ह",
        "meaning": "साथ-साथ"
      },
      {
        "word": "चि॒त्तम्",
        "meaning": "चेतना, संकल्प"
      },
      {
        "word": "ए॒षा॒म्",
        "meaning": "आप सबका"
      },
      {
        "word": "स॒मा॒नम्",
        "meaning": "समान"
      },
      {
        "word": "मन्त्र॑म्",
        "meaning": "मंत्र व उद्देश्य को"
      },
      {
        "word": "अ॒भि",
        "meaning": "लक्ष्य करके"
      },
      {
        "word": "म॒न्त्र॒ये॒",
        "meaning": "मैं परामर्श देता हूँ"
      },
      {
        "word": "वः॒",
        "meaning": "तुम सबको"
      },
      {
        "word": "स॒मा॒नेन॑",
        "meaning": "समान"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारे"
      },
      {
        "word": "ह॒विषा॑",
        "meaning": "हविष्य से"
      },
      {
        "word": "जु॒हो॒मि॒",
        "meaning": "मैं आहुति देता हूँ"
      }
    ],
    "shastricContext": "वैदिक जनतंत्र, सभा और समिति के नियमों का आधारभूत मंत्र। यह राष्ट्रीय और सामाजिक संगठनों में निष्पक्षता और एकात्मता का विधान करता है।",
    "audioUrl": null,
    "previousId": "rv-10-191-2",
    "nextId": "rv-10-191-4",
    "chapterMantraIds": [
      "rv-10-191-1",
      "rv-10-191-2",
      "rv-10-191-3",
      "rv-10-191-4"
    ],
    "orderIndex": 18,
    "status": "ACTIVE"
  },
  {
    "id": "rv-10-191-4",
    "slug": "rv-10-191-4",
    "vedaId": "rigveda",
    "nodeId": "rv-sukta-10-191",
    "vedaName": "ऋग्वेद (Rigveda)",
    "shakha": "शाकल शाखा",
    "textName": "ऋग्वेद संहिता (शाकल शाखा)",
    "sectionRef": "मण्डल १०, सूक्त १९१, ऋचा ४",
    "mantraNumber": "१०.१९१.४",
    "rishi": "संवनन आङ्गिरस",
    "devata": "संज्ञानम् (Universal Accord)",
    "chhanda": "अनुष्टुप् (८+८+८+८ = ३२ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "स॒मा॒नी व॑ आ॒कूतिः॑ समा॒ना हृद॑यानि वः।\nस॒मा॒नम॑स्तु वो॒ मनो॒ यथा॑ वः॒ सुस॒हाम॑सति॥४॥",
    "transliteration": "samānī va ākūtiḥ samānā hṛdayāni vaḥ |\nsamānam astu vo mano yathā vaḥ susahāsati || 4 ||",
    "hindiTranslation": "तुम्हारे संकल्प एक समान हों, तुम्हारे हृदय एकभाव से युक्त हों, तुम्हारा मन परस्पर संगठित हो; जिससे कि तुम्हारा पारस्परिक सहयोग उत्तम और सुखद रूप से सिद्ध हो सके।",
    "englishTranslation": "United be your resolves, united your hearts, and harmonious be your minds, so that there may be a perfect and blissful union among you all.",
    "hinglishTranslation": "Tumhare sankalpa ek jaise hon, tumhare dilon mein prem aur ekta ho, tumhara mann ekjut ho; jisse tumhara aapsi sahyog behtareen aur safal ban sake.",
    "padapatha": [
      {
        "word": "स॒मा॒नी",
        "meaning": "समान, एकरूप"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारा"
      },
      {
        "word": "आ॒कूतिः॑",
        "meaning": "संकल्प, अभिलाषा"
      },
      {
        "word": "स॒मा॒ना",
        "meaning": "समरस, एकभाव"
      },
      {
        "word": "हृद॑यानि",
        "meaning": "हृदय"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारे"
      },
      {
        "word": "स॒मा॒नम्",
        "meaning": "समान"
      },
      {
        "word": "अ॒स्तु॒",
        "meaning": "होवे"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारा"
      },
      {
        "word": "मनः॑",
        "meaning": "मन"
      },
      {
        "word": "यथा॑",
        "meaning": "जिससे कि"
      },
      {
        "word": "वः॒",
        "meaning": "तुम्हारा"
      },
      {
        "word": "सु॒ऽस॒हा",
        "meaning": "उत्तम सहयोग / सुदृढ़ एकता"
      },
      {
        "word": "अस॑ति",
        "meaning": "सिद्ध हो सके"
      }
    ],
    "shastricContext": "ऋग्वेद संहिता का अंतिम मंत्र (१०.१९१.४)। संपूर्ण ऋग्वेद ज्ञान की पराकाष्ठा विश्व-मानवता की पूर्ण एकता, बंधुत्व और समरसता पर विराम लेती है।",
    "audioUrl": null,
    "previousId": "rv-10-191-3",
    "nextId": null,
    "chapterMantraIds": [
      "rv-10-191-1",
      "rv-10-191-2",
      "rv-10-191-3",
      "rv-10-191-4"
    ],
    "orderIndex": 19,
    "status": "ACTIVE"
  },
  {
    "id": "yj-1-1",
    "slug": "yj-1-1",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-1",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (दर्शपूर्णमास याग)",
    "sectionRef": "अध्याय १, मन्त्र १",
    "mantraNumber": "१.१",
    "rishi": "परमेष्ठी प्रजापति",
    "devata": "यज्ञ एवं सविता",
    "chhanda": "यजुः (गद्यात्मक वैदिक छन्द)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ इ॒षे त्वो॒र्जे त्वा॑ वा॒यव॑ स्थ दे॒वो वः॑ सवि॒ता प्रार्प॑यतु॒ श्रेष्ठ॑तमाय॒ कर्म॑णे॥१॥",
    "transliteration": "oṃ iṣe tvorje tvā vāyava stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe || 1 ||",
    "hindiTranslation": "हे पलाश शाखा! हम तुम्हें अन्न की समृद्धि के लिए ग्रहण करते हैं, और रस/ऊर्जा की वृद्धि के लिए ग्रहण करते हैं। हे बछड़ों! तुम वायु के समान वेगवान और पवित्र बनो। दिव्य सविता देव तुम्हें सर्वोत्तम यज्ञ-कर्म के लिए प्रेरित करें।",
    "englishTranslation": "For nourishment and vigorous energy we accept thee; O calves, be swift and pure as the sacred wind. May the divine inspirer Savitr impel you all unto the highest, most auspicious action.",
    "hinglishTranslation": "Anna aur urja ki vriddhi ke liye hum tumhe grahan karte hain. Hey vatsa, tum vayu ke saman tejaswi bano. Savita Dev tumhe shreshthatam karma ke liye prerit karein.",
    "padapatha": [
      {
        "word": "इ॒षे",
        "meaning": "अन्न व पुष्टि के लिए"
      },
      {
        "word": "त्वा॑",
        "meaning": "तुझे (पलाश शाखा को)"
      },
      {
        "word": "ऊ॒र्जे",
        "meaning": "रस एवं पराक्रम के लिए"
      },
      {
        "word": "त्वा॑",
        "meaning": "तुझे"
      },
      {
        "word": "वा॒यवः॑",
        "meaning": "वायु के समान वेगवान"
      },
      {
        "word": "स्थ॒",
        "meaning": "होओ"
      },
      {
        "word": "दे॒वः",
        "meaning": "प्रकाशमान"
      },
      {
        "word": "स॒वि॒ता",
        "meaning": "सृष्टिकर्ता सविता परमात्मा"
      },
      {
        "word": "प्र",
        "meaning": "प्रकर्ष रूप से"
      },
      {
        "word": "अ॒र्प॒य॒तु॒",
        "meaning": "प्रेरित करे"
      },
      {
        "word": "श्रेष्ठ॑तमाय",
        "meaning": "सर्वोत्तम"
      },
      {
        "word": "कर्म॑णे",
        "meaning": "पवित्र यज्ञ कर्म के लिए"
      }
    ],
    "shastricContext": "यजुर्वेद का प्रथम महामन्त्र। यह मन्त्र मानव जीवन में कर्मयोग का सूत्रपात करता है और यज्ञ को संसार का 'श्रेष्ठतम कर्म' (सर्वोच्च कर्तव्य) घोषित करता है।",
    "orderIndex": 1,
    "status": "ACTIVE"
  },
  {
    "id": "yj-16-1",
    "slug": "yj-16-1",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-16",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (शतरुद्रीय - श्रीरुद्रम्)",
    "sectionRef": "अध्याय १६, मन्त्र १",
    "mantraNumber": "१६.१",
    "rishi": "परमेष्ठी प्रजापति",
    "devata": "रुद्र (Shiva - Rudra)",
    "chhanda": "पंक्ति (४० वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ नम॑स्ते रुद्र म॒न्यव॑ उ॒तो त॒ इष॑वे॒ नमः॑।\nबा॒हुभ्या॑मु॒त ते॒ नमः॑॥१॥",
    "transliteration": "oṃ namas te rudra manyava uto ta iṣave namaḥ |\nbāhubhyām uta te namaḥ || 1 ||",
    "hindiTranslation": "हे दुःखों के नाशक और न्यायकारी भगवान रुद्र! आपके मन्यु (दुष्टों के प्रति सात्त्विक क्रोध) को हमारा नमस्कार है। आपके तीक्ष्ण बाण को नमस्कार है, और आपकी दोनों पराक्रमी भुजाओं को हमारा सादर प्रणाम है।",
    "englishTranslation": "O Rudra, homage unto your righteous wrath, and homage unto your piercing arrow. Homage be unto both of your mighty, protective arms.",
    "hinglishTranslation": "Hey dukh-vinashak Bhagwan Rudra, aapke satvik krodh ko pranam, aapke baan ko pranam aur aapki dono shaktishali bhujaon ko hamara barambar pranam.",
    "padapatha": [
      {
        "word": "नमः॑",
        "meaning": "सादर नमस्कार"
      },
      {
        "word": "ते॒",
        "meaning": "आपके"
      },
      {
        "word": "रु॒द्र॒",
        "meaning": "हे पापनाशक रुद्र"
      },
      {
        "word": "म॒न्यवे॑",
        "meaning": "धार्मिक क्रोध को"
      },
      {
        "word": "उ॒तो",
        "meaning": "और भी"
      },
      {
        "word": "ते॒",
        "meaning": "आपके"
      },
      {
        "word": "इष॑वे",
        "meaning": "दिव्य बाण को"
      },
      {
        "word": "नमः॑",
        "meaning": "प्रणाम"
      },
      {
        "word": "बा॒हुभ्या॑म्",
        "meaning": "दोनों भुजाओं को"
      },
      {
        "word": "उ॒त",
        "meaning": "और"
      },
      {
        "word": "ते॒",
        "meaning": "आपके"
      },
      {
        "word": "नमः॑",
        "meaning": "नमस्कार"
      }
    ],
    "shastricContext": "रुद्राष्टाध्यायी (शतरुद्रीय / नमकम्) का प्रथम और मूल मन्त्र। समस्त रुद्राभिषेक एवं शिवोपासना का यह प्रामाणिक वैदिक उद्गम है।",
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "yj-16-2",
    "slug": "yj-16-2",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-16",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (शतरुद्रीय - श्रीरुद्रम्)",
    "sectionRef": "अध्याय १६, मन्त्र २",
    "mantraNumber": "१६.२",
    "rishi": "परमेष्ठी प्रजापति",
    "devata": "रुद्र (Shiva - Shanta Swarupa)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "या ते॑ रुद्र शि॒वा त॒नूरघो॒राऽपा॑पकाशिनी।\nतया॑ नस्त॒नुवा॒ शंत॑मया गि॑रिश॒न्ताभि॑ चाकशीहि॥२॥",
    "transliteration": "yā te rudra śivā tanūr aghorā'pāpakāśinī |\ntayā nas tanuvā śantamayā giriśantābhi cākaśīhi || 2 ||",
    "hindiTranslation": "हे कैलासवासी मंगलमय रुद्र! आपकी जो परम शान्त, अघोर (अक्रोध) और पापों का नाश करने वाली शिव (कल्याणमयी) मूर्ति है, उस अतिशय सुखदायिनी कान्ति से हमारी ओर कृपापूर्वक दृष्टिपात कीजिए।",
    "englishTranslation": "O Rudra who dwelleth on the holy heights, with that auspicious (Shiva), non-terrific, sin-destroying form of Thine, look upon us with Thine most peaceful and blissful grace.",
    "hinglishTranslation": "Hey Kailashwasi mangalkari Rudra, aapka jo shant, kalyankari aur papnashak swaroop hai, us param sukhdayi roop se hum par kripa drishti banaye rakhiye.",
    "padapatha": [
      {
        "word": "या",
        "meaning": "जो"
      },
      {
        "word": "ते॒",
        "meaning": "आपकी"
      },
      {
        "word": "रु॒द्र॒",
        "meaning": "हे रुद्र"
      },
      {
        "word": "शि॒वा",
        "meaning": "कल्याणकारी"
      },
      {
        "word": "त॒नूः",
        "meaning": "दिव्य मूर्ति/स्वरूप"
      },
      {
        "word": "अ॒घो॒रा",
        "meaning": "भयरहित/शान्त"
      },
      {
        "word": "अपा॑प-काशिनी",
        "meaning": "पुण्य को प्रकाशित करने वाली"
      },
      {
        "word": "तया॑",
        "meaning": "उस"
      },
      {
        "word": "नः॑",
        "meaning": "हमको"
      },
      {
        "word": "त॒नुवा॑",
        "meaning": "स्वरूप से"
      },
      {
        "word": "शंत॑मया",
        "meaning": "परम सुखदायिनी"
      },
      {
        "word": "गि॒रि॒-श॒न्त॒",
        "meaning": "पर्वत पर सुख बरसाने वाले"
      },
      {
        "word": "अ॒भि",
        "meaning": "सम्मुख"
      },
      {
        "word": "चा॒क॒शी॒हि॒",
        "meaning": "कृपापूर्वक देखिए"
      }
    ],
    "shastricContext": "रुद्र के 'घोर' रूप को 'शिव' (कल्याणमय) रूप में परिवर्तित करने वाली परम स्तुति। श्वेताश्वतरोपनिषद् (३.५) में भी यह मन्त्र उद्धृत है।",
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "yj-22-22",
    "slug": "yj-22-22",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-22",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (राष्ट्र समृद्धि प्रार्थना)",
    "sectionRef": "अध्याय २२, मन्त्र २२",
    "mantraNumber": "२२.२२",
    "rishi": "प्रजापति",
    "devata": "राष्ट्र एवं सर्वदेव",
    "chhanda": "यजुः महामन्त्र",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ आ ब्रह्मन् ब्राह्मणो ब्रह्मवर्चसी जायतामा राष्ट्रे राजन्यः शूर इषव्योऽतिव्याधी महारथो जायतां दोग्ध्री धेनुर्वोढाऽनड्वानाशुः सप्तिः पुरन्धिर्योषा जिष्णू रथेष्ठाः सभेयो युवास्य यजमानस्य वीरो जायतां निकामे-निकामे नः पर्जन्यो वर्षतु फलवत्यो न ओषधयः पच्यन्तां योगक्षेमो नः कल्पताम्॥२२॥",
    "transliteration": "oṃ ā brahman brāhmaṇo brahmavarcasī jāyatām ā rāṣṭre rājanyaḥ śūra iṣavyo'tivyādhī mahāratho jāyatāṃ dogdhrī dhenur voḍhā'naḍvān āśuḥ saptiḥ purandhir yoṣā jiṣṇū ratheṣṭhāḥ sabheyo yuvāsya yajamānasya vīro jāyatāṃ nikāme-nikāme naḥ parjanyo varṣatu phalavatyo na oṣadhayaḥ pacyantāṃ yogakṣemo naḥ kalpatām || 22 ||",
    "hindiTranslation": "हे परमेश्वर! हमारे राष्ट्र में ज्ञानवान ब्राह्मण ब्रह्मतेज से युक्त हों; क्षत्रिय शूरवीर, अचूक धनुर्धारी, महारथी हों; गौएं प्रचुर दुग्ध देने वाली हों; बैल उत्तम भारवाहक हों; अश्व द्रुतगामी हों; नारियाँ सुशीला एवं गृहलक्ष्मी हों; युवा विजयी, सभ्य और पराक्रमी हों। हमारी आवश्यकता अनुसार समयानुसार मेघ वर्षा करें, वनस्पतियाँ फलों से लदी हों, और हमारा योगक्षेम (अप्राप्त की प्राप्ति और प्राप्त की रक्षा) सुरक्षित रहे।",
    "englishTranslation": "O Supreme Lord! In our nation, may spiritual seekers be radiant with divine wisdom; may leaders and warriors be valiant archers and great heroes; may the cows yield plentiful milk; may the oxen bear heavy burdens; may the steeds be swift; may the women be noble and cultured; may the youth be victorious and enlightened assembly members. May the rains descend whenever needed; may our plants ripen with abundant fruit, and may our wellbeing and prosperity (Yogakshema) be eternally sustained.",
    "hinglishTranslation": "Hey Ishwar! Hamare rashtra me gyanvan log brahma-tej se yukt hon, yoddha veer hon, gaayein doodh dene wali hon, nariyan shreshtha aur yuva sanskari hon. Samay par varsha ho aur rashtra ka yogakshem surakshit rahe.",
    "padapatha": [
      {
        "word": "आ",
        "meaning": "उत्कृष्ट रूप से"
      },
      {
        "word": "ब्रह्मन्",
        "meaning": "हे ब्रह्म/परमात्मा"
      },
      {
        "word": "ब्राह्मणः",
        "meaning": "ज्ञानवान साधक"
      },
      {
        "word": "ब्रह्म-वर्चसी",
        "meaning": "ब्रह्मतेज से युक्त"
      },
      {
        "word": "जायताम्",
        "meaning": "उत्पन्न हों"
      },
      {
        "word": "राष्ट्रे",
        "meaning": "राष्ट्र में"
      },
      {
        "word": "राजन्यः",
        "meaning": "शासक/क्षत्रिय"
      },
      {
        "word": "शूरः",
        "meaning": "पराक्रमी"
      },
      {
        "word": "महारथः",
        "meaning": "महारथी"
      },
      {
        "word": "दोग्ध्री",
        "meaning": "प्रचुर दूध देने वाली"
      },
      {
        "word": "धेनुः",
        "meaning": "गौएं"
      },
      {
        "word": "योग-क्षेमः",
        "meaning": "अप्राप्त की प्राप्ति व प्राप्त की रक्षा"
      },
      {
        "word": "कल्पताम्",
        "meaning": "सिद्ध होवे"
      }
    ],
    "shastricContext": "वैदिक राष्ट्रगीत और राष्ट्र की समग्र सुरक्षा, सम्पन्नता एवं समृद्धि का विश्व-प्रसिद्ध प्रामाणिक मन्त्र।",
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "yj-34-1",
    "slug": "yj-34-1",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-34",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (शिवसंकल्प सूक्त)",
    "sectionRef": "अध्याय ३४, मन्त्र १",
    "mantraNumber": "३४.१",
    "rishi": "शिवसंकल्प",
    "devata": "मन (Pure Subconscious Mind)",
    "chhanda": "त्रिष्टुप् (४४ वर्ण)",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ यज्जाग्र॑तो दू॒रमुदै॑ति॒ दैवं॒ तदु॑ सु॒प्तस्य॒ तथैवेति॑।\nदू॒रं॒ग॒मं ज्योति॑षां॒ ज्योति॒रेकं॒ तन्मे॒ मनः॑ शि॒वस॑ङ्क॒ल्पम॑स्तु॥१॥",
    "transliteration": "oṃ yaj jāgrato dūram udaiti daivaṃ tad u suptasya tathaivaiti |\ndūraṅ-gamaṃ jyotiṣāṃ jyotir ekaṃ tan me manaḥ śiva-saṅkalpam astu || 1 ||",
    "hindiTranslation": "जागते हुए मनुष्य का जो दिव्य मन दूर-दूर तक विचरण करता है और सोते हुए भी उसी प्रकार सुदूर चला जाता है; जो समस्त इन्द्रिय-ज्योतियों की एकमात्र मूल ज्योति है—वह मेरा मन सदा कल्याणकारी और पवित्र संकल्पों से युक्त बने।",
    "englishTranslation": "That divine mind which wanders far away when awake, and likewise in deep sleep; that far-traveling light of all lights—may that mind of mine be filled with auspicious, noble resolve.",
    "hinglishTranslation": "Jaagte hue jo man door-door tak daudta hai aur sote hue bhi waisa hi karta hai; jo sabhi indriyon ki akeli jyoti hai—mera wah man shubh sankalpo wala bane.",
    "padapatha": [
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "जाग्र॑तः",
        "meaning": "जागते हुए का"
      },
      {
        "word": "दू॒रम्",
        "meaning": "दूर"
      },
      {
        "word": "उदै॑ति",
        "meaning": "जाता है"
      },
      {
        "word": "दैव॑म्",
        "meaning": "दिव्य शक्ति युक्त"
      },
      {
        "word": "तन्मे॑",
        "meaning": "वह मेरा"
      },
      {
        "word": "मनः॑",
        "meaning": "मन"
      },
      {
        "word": "शि॒व-स॑ङ्क॒ल्पम्",
        "meaning": "कल्याणकारी संकल्प वाला"
      },
      {
        "word": "अ॒स्तु॒",
        "meaning": "होवे"
      }
    ],
    "shastricContext": "वैदिक मनोविज्ञान का अमर मन्त्र। मन की दिशा को सदा सकारात्मक और पवित्र रखने की प्रार्थना।",
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "yj-34-2",
    "slug": "yj-34-2",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-34",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (शिवसंकल्प सूक्त)",
    "sectionRef": "अध्याय ३४, मन्त्र २",
    "mantraNumber": "३४.२",
    "rishi": "शिवसंकल्प",
    "devata": "मन",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "येन॒ कर्म्मा॑ण्य॒पसो॑ मनी॒षिणो॑ य॒ज्ञे कृ॒ण्वन्ति॑ वि॒दथे॑षु॒ धीराः॑।\nयद॑पू॒र्वं य॒क्षम॒न्तः प्र॒जानां॒ तन्मे॒ मनः॑ शि॒वस॑ङ्क॒ल्पम॑स्तु॥२॥",
    "transliteration": "yena karmāṇy apaso manīṣiṇo yajñe kṛṇvanti vidatheṣu dhīrāḥ |\nyad apūrvaṃ yakṣam antaḥ prajānāṃ tan me manaḥ śiva-saṅkalpam astu || 2 ||",
    "hindiTranslation": "जिस मन की सामर्थ्य से कर्मनिष्ठ ज्ञानी और धैर्यवान मनीषी यज्ञों और विद्वत्-सभाओं में श्रेष्ठ कर्म सम्पन्न करते हैं; जो समस्त प्राणियों के भीतर प्रतिष्ठित एक अपूर्व, पूजनीय दिव्य तत्त्व है—वह मेरा मन सदा कल्याणकारी संकल्पों से युक्त रहे।",
    "englishTranslation": "Whereby the wise and diligent performers of righteous deeds accomplish sacred rites in assemblies; that peerless, adorable wondrous power residing within all beings—may that mind of mine be filled with auspicious intent.",
    "hinglishTranslation": "Jis man ki shakti se gyani log yagya aur sabhaon me shreshtha kaam karte hain; jo sabhi praniyo ke andar pujya divya tatva hai—mera wah man shubh sankalpo se yukt ho.",
    "padapatha": [
      {
        "word": "येन॑",
        "meaning": "जिसके द्वारा"
      },
      {
        "word": "कर्मा॑णि",
        "meaning": "श्रेष्ठ कर्मों को"
      },
      {
        "word": "अ॒पसः॑",
        "meaning": "कर्मशील जन"
      },
      {
        "word": "म॒नी॒षिणः॑",
        "meaning": "बुद्धिमान मनीषी"
      },
      {
        "word": "य॒ज्ञे",
        "meaning": "यज्ञ में"
      },
      {
        "word": "कृ॒ण्वन्ति॑",
        "meaning": "करते हैं"
      },
      {
        "word": "अ॒पू॒र्वम्",
        "meaning": "अद्भुत/अद्वितीय"
      },
      {
        "word": "य॒क्षम्",
        "meaning": "पूजनीय शक्ति"
      },
      {
        "word": "शि॒व-स॑ङ्क॒ल्पम्",
        "meaning": "कल्याणकारी संकल्प"
      }
    ],
    "shastricContext": "मानव की कर्म-कुशलता और अंतःकरण की पवित्रता का परस्पर सम्बन्ध निरूपित करता है।",
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "yj-34-6",
    "slug": "yj-34-6",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-34",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (शिवसंकल्प सूक्त)",
    "sectionRef": "अध्याय ३४, मन्त्र ६",
    "mantraNumber": "३४.६",
    "rishi": "शिवसंकल्प",
    "devata": "मन",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "सु॒षा॒र॒थिरश्वा॑निव॒ यन्म॑नु॒ष्यान्नेनी॑यते॒ऽभीशु॑भिर्वा॒जिन॑ इव।\nहृत्प्र॑ति॒ष्ठं यद॒जिरं॒ जवि॑ष्ठं॒ तन्मे॒ मनः॑ शि॒वस॑ङ्क॒ल्पम॑स्तु॥६॥",
    "transliteration": "suṣārathir aśvān iva yan manuṣyān nenīyate'bhīśubhir vājina iva |\nhṛt-pratiṣṭhaṃ yad ajiraṃ javiṣṭhaṃ tan me manaḥ śiva-saṅkalpam astu || 6 ||",
    "hindiTranslation": "जैसे एक कुशल सारथी घोड़ों को लगाम के सहारे सही दिशा में ले जाता है, वैसे ही जो मन मनुष्य को सदा संचालित करता है; जो हृदय में प्रतिष्ठित, कभी वृद्ध न होने वाला और तीव्रतम गतिवान है—वह मेरा मन सदा शुभ, कल्याणकारी संकल्पों से युक्त रहे।",
    "englishTranslation": "As a skillful charioteer controls and guides swift horses with reins, so does the mind direct human beings; that unaging, swiftest power anchored in the heart—may that mind of mine be filled with noble, auspicious resolve.",
    "hinglishTranslation": "Jaise kushal sarathi ghodo ko lagam se sahi raste par le jata hai, waise hi jo man manushya ko chalata hai; jo hriday me sthit aur sabse tez hai—mera wah man shubh sankalpo wala bane.",
    "padapatha": [
      {
        "word": "सु॒-सा॒र॒थिः",
        "meaning": "उत्कृष्ट सारथी"
      },
      {
        "word": "अश्वा॑न्-इव",
        "meaning": "घोड़ों के समान"
      },
      {
        "word": "यत्",
        "meaning": "जो मन"
      },
      {
        "word": "म॒नु॒ष्यान्",
        "meaning": "मनुष्यों को"
      },
      {
        "word": "नेनी॑यते",
        "meaning": "संचालित करता है"
      },
      {
        "word": "हृत्-प्र॑ति॒ष्ठम्",
        "meaning": "हृदय में स्थित"
      },
      {
        "word": "अ॒जि॒रम्",
        "meaning": "अजर/सदा नवीन"
      },
      {
        "word": "जवि॑ष्ठम्",
        "meaning": "अत्यंत तीव्रगामी"
      }
    ],
    "shastricContext": "शिवसंकल्प सूक्त का अंतिम मन्त्र। कठोपनिषद् की 'रथी आत्मा, शरीर रथ, बुद्धि सारथी और मन लगाम' की रूपक कथा का यही मूल स्रोत है।",
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "yj-36-17",
    "slug": "yj-36-17",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-36",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "वाजसनेयि संहिता (विश्व शान्ति पाठ)",
    "sectionRef": "अध्याय ३६, मन्त्र १७",
    "mantraNumber": "३६.१७",
    "rishi": "प्रजापति",
    "devata": "विश्वेदेवाः एवं विश्व शान्ति",
    "chhanda": "निचृद् भुरिगनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ द्यौः शान्ति॑र॒न्तरि॑क्षं॒ शान्तिः॑ पृथि॒वी शान्ति॒रापः॒ शान्ति॒रोष॑धयः॒ शान्तिः॑।\nवन॒स्पत॑यः॒ शान्ति॒र्विश्वे॑ दे॒वाः शान्ति॒र्ब्रह्म॒ शान्तिः॒ सर्वं॒ शान्तिः॒ शान्ति॑रेव॒ शान्तिः॒ सा मा॒ शान्ति॑रेधि॥",
    "transliteration": "oṃ dyauḥ śāntir antarikṣaṃ śāntiḥ pṛthivī śāntir āpaḥ śāntir oṣadhayaḥ śāntiḥ |\nvanaspatayaḥ śāntir viśve devāḥ śāntir brahma śāntiḥ sarvaṃ śāntiḥ śāntir eva śāntiḥ sā mā śāntir edhi ||",
    "hindiTranslation": "द्युलोक शांत हो, अंतरिक्ष शांत हो, पृथ्वी शांत हो, जल शांत हो, ओषधियाँ शांत हों, वनस्पतियाँ शांत हों, समस्त देवगण शांत हों, परब्रह्म शांत हो, संपूर्ण विश्व शांत हो; शांति ही चारों ओर शांत हो, और वह दिव्य शांति मुझमें भी प्रतिष्ठित हो।",
    "englishTranslation": "May peace radiate in the celestial realms, in intermediate space, upon earth, within waters, among medicinal herbs, and in trees. May peace reside in all deities, in Brahman, and in all existence. May absolute peace prevail, and may that peace enter into me.",
    "hinglishTranslation": "Aakash, antariksh, prithvi, jal, aushadhi aur ped-paudho me shanti ho. Sabhi devtao aur Brahma me shanti ho. Charo taraf shanti hi shanti ho aur wah shanti mujhe prapt ho.",
    "padapatha": [
      {
        "word": "द्यौः",
        "meaning": "द्युलोक"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शान्त हो"
      },
      {
        "word": "अ॒न्तरि॑क्षम्",
        "meaning": "अंतरिक्ष लोक"
      },
      {
        "word": "शान्तिः॑",
        "meaning": "शान्त हो"
      },
      {
        "word": "पृ॒थि॒वी",
        "meaning": "धरती माता"
      },
      {
        "word": "आपः॑",
        "meaning": "जल तत्त्व"
      },
      {
        "word": "ओष॑धयः",
        "meaning": "औषधियाँ"
      },
      {
        "word": "वन॒स्पत॑यः",
        "meaning": "वृक्ष"
      },
      {
        "word": "विश्वे॑",
        "meaning": "समस्त"
      },
      {
        "word": "दे॒वाः",
        "meaning": "देवगण"
      },
      {
        "word": "ब्रह्म॑",
        "meaning": "परब्रह्म"
      },
      {
        "word": "सर्व॑म्",
        "meaning": "समस्त चराचर"
      }
    ],
    "shastricContext": "सनातन वैदिक संस्कृति का सार्वभौमिक शांति पाठ। पर्यावरण, ब्रह्माण्ड और मानव चेतना के मध्य सामंजस्य का परम सूत्र।",
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "yj-40-1",
    "slug": "yj-40-1",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-40",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "ईशावास्योपनिषद् (वाजसनेयि संहिता ४०वां अध्याय)",
    "sectionRef": "अध्याय ४०, मन्त्र १",
    "mantraNumber": "४०.१",
    "rishi": "दध्यङ् आथर्वण",
    "devata": "ईश्वर / आत्मतत्त्व",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    "sanskrit": "ॐ ई॒शा वा॒स्य॑मि॒दं सर्वं॒ यत्किञ्च॒ जग॑त्यां॒ जग॑त्।\nतेन॑ त्य॒क्तेन॑ भुञ्जीथा॒ मा गृ॑धः॒ कस्य॑ स्वि॒द्धन॑म्॥१॥",
    "transliteration": "oṃ īśā vāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam || 1 ||",
    "hindiTranslation": "इस गतिशील संसार में जो कुछ भी जड़-चेतन जगत है, वह सब ईश्वर से व्याप्त है। अतः त्यागभाव से उसका भोग करो; किसी के धन-ऐश्वर्य का लोभ मत करो।",
    "englishTranslation": "All this, whatever moves in this moving world, is enveloped and indwelt by the Divine Lord. Therefore enjoy through renunciation; covet not the wealth of anyone.",
    "hinglishTranslation": "Is poore jagat me jo kuch bhi hai, sabme Ishwar vyapt hai. Isliye tyagbhav se upbhog karo, kisi ke dhan ka lalach mat karo.",
    "padapatha": [
      {
        "word": "ई॒शा",
        "meaning": "ईश्वर से"
      },
      {
        "word": "वा॒स्य॑म्",
        "meaning": "आच्छादित/व्याप्त"
      },
      {
        "word": "इ॒दम्",
        "meaning": "यह"
      },
      {
        "word": "सर्व॑म्",
        "meaning": "सब कुछ"
      },
      {
        "word": "यत्",
        "meaning": "जो"
      },
      {
        "word": "किञ्च॑",
        "meaning": "कुछ भी"
      },
      {
        "word": "जग॑त्याम्",
        "meaning": "संसार में"
      },
      {
        "word": "जग॑त्",
        "meaning": "जगत"
      },
      {
        "word": "तेन॑",
        "meaning": "उसके द्वारा"
      },
      {
        "word": "त्य॒क्तेन॑",
        "meaning": "त्यागपूर्वक"
      },
      {
        "word": "भु॒ञ्जी॒थाः॒",
        "meaning": "भोग करो"
      },
      {
        "word": "मा",
        "meaning": "मत"
      },
      {
        "word": "गृ॒धः॒",
        "meaning": "लोभ करो"
      }
    ],
    "shastricContext": "उपनिषदों का शिरोमणि आदि मन्त्र। यह मन्त्र वेदान्त और कर्मयोग का प्राण है।",
    "orderIndex": 9,
    "status": "ACTIVE"
  },
  {
    "id": "yj-40-2",
    "slug": "yj-40-2",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-40",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "ईशावास्योपनिषद्",
    "sectionRef": "अध्याय ४०, मन्त्र २",
    "mantraNumber": "४०.२",
    "rishi": "दध्यङ् आथर्वण",
    "devata": "कर्मयोग / आत्मा",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "कु॒र्वन्ने॒वेह कर्मा॑णि जिजीवि॒षेच्छ॒तं समाः॑।\nए॒वं त्वयि॒ नान्यथे॒तो॑ऽस्ति॒ न कर्म॑ लिप्यते॒ नरे॑॥२॥",
    "transliteration": "kurvann eveha karmāṇi jijīviṣec chataṃ samāḥ |\nevaṃ tvayi nānyatheto'sti na karma lipyate nare || 2 ||",
    "hindiTranslation": "इस संसार में निष्काम भाव से शास्त्र-सम्मत कर्तव्य-कर्म करते हुए ही सौ वर्ष जीने की इच्छा करनी चाहिए। तुम्हारे लिए इसके अतिरिक्त अन्य कोई मार्ग नहीं है; इस प्रकार कर्म करने से मनुष्य कर्म-बन्धन में लिप्त नहीं होता।",
    "englishTranslation": "Performing righteous works alone in this world, one should desire to live a hundred years. Thus for thee, and not otherwise, actions will not adhere or bind unto man.",
    "hinglishTranslation": "Is sansar me nishkam bhav se satkarma karte hue hi 100 saal jeene ki iccha karni chahiye. Iske alawa doosra rasta nahi hai, aise karm karne se manushya bandhan me nahi padta.",
    "padapatha": [
      {
        "word": "कु॒र्वन्",
        "meaning": "करता हुआ"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "इ॒ह",
        "meaning": "इस संसार में"
      },
      {
        "word": "कर्मा॑णि",
        "meaning": "कर्तव्य कर्मों को"
      },
      {
        "word": "जि॒जी॒वि॒षेत्",
        "meaning": "जीने की इच्छा करे"
      },
      {
        "word": "श॒तम्",
        "meaning": "सौ"
      },
      {
        "word": "समाः॑",
        "meaning": "वर्ष"
      },
      {
        "word": "न",
        "meaning": "नहीं"
      },
      {
        "word": "कर्म॑",
        "meaning": "कर्म"
      },
      {
        "word": "लि॒प्य॒ते॒",
        "meaning": "लिप्त होता"
      },
      {
        "word": "नरे॑",
        "meaning": "मनुष्य में"
      }
    ],
    "shastricContext": "भगवद्गीता के निष्काम कर्मयोग का वैदिक उद्गम। कर्म का त्याग नहीं, वरन् फल की आसक्ति का त्याग सिखाता है।",
    "orderIndex": 10,
    "status": "ACTIVE"
  },
  {
    "id": "yj-40-16",
    "slug": "yj-40-16",
    "vedaId": "yajurveda",
    "nodeId": "yj-adhyaya-40",
    "vedaName": "यजुर्वेद (Yajurveda)",
    "shakha": "शुक्ल यजुर्वेद वाजसनेयि माध्यन्दिना",
    "textName": "ईशावास्योपनिषद्",
    "sectionRef": "अध्याय ४०, मन्त्र १६",
    "mantraNumber": "४०.१६",
    "rishi": "दध्यङ् आथर्वण",
    "devata": "सूर्य / सोऽहमस्मि",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "पूष॑न्नेकर्षे यम॒ सूर्य॑ प्राजाप॒त्य व्यू॑ह र॒श्मीन्समू॑ह॒ तेजः॑।\nयत्ते॑ रू॒पं क॒ल्या॑णतमं॒ तत्ते॑ पश्यामि॒ योऽसा॑व॒सौ पुरु॑षः॒ सोऽहम॑स्मि॥१६॥",
    "transliteration": "pūṣann ekarṣe yama sūrya prājāpatya vyūha raśmīn samūha tejaḥ |\nyat te rūpaṃ kalyāṇatamaṃ tat te paśyāmi yo'sāv asau puruṣaḥ so'ham asmi || 16 ||",
    "hindiTranslation": "हे पोषक पूषन्! हे एकाकी ज्ञाता! हे यम, हे सूर्य, हे प्रजापति-नन्दन! अपनी तीक्ष्ण किरणों को समेटिए, अपने प्रचण्ड तेज को समेटिए। आपकी जो परम कल्याणमयी ज्योतिर्मय मूर्ति है, मैं उसे आपके अनुग्रह से देख रहा हूँ। वह जो आदित्य-मण्डल में दिव्य पुरुष है, वह 'सोऽहम् अस्मि' (वह मैं ही हूँ)।",
    "englishTranslation": "O Nourisher, solitary seer, controller, O Sun, offspring of Prajapati! Gather thy blinding rays, withdraw thy dazzling brilliance! May I behold Thine most auspicious form. That Supreme Person who dwells yonder—that very Person am I ('So'ham Asmi').",
    "hinglishTranslation": "Hey Surya Dev! Apni tivra kirno ko sametiye. Aapka jo param mangalkari roop hai, use main dekh sakun. Wah jo divya purush hai, wah main hi hoon ('So'ham Asmi').",
    "padapatha": [
      {
        "word": "पूष॑न्",
        "meaning": "हे सबका पोषण करने वाले"
      },
      {
        "word": "एक-ऋषे",
        "meaning": "हे अद्वितीय द्रष्टा"
      },
      {
        "word": "यम॑",
        "meaning": "हे नियन्ता"
      },
      {
        "word": "सूर्य॑",
        "meaning": "हे सूर्य"
      },
      {
        "word": "व्यू॑ह",
        "meaning": "हटाओ/फैलाओ"
      },
      {
        "word": "र॒श्मीन्",
        "meaning": "किरणों को"
      },
      {
        "word": "समू॑ह",
        "meaning": "समेटो"
      },
      {
        "word": "तेजः॑",
        "meaning": "तेज को"
      },
      {
        "word": "क॒ल्या॑ण-तमम्",
        "meaning": "कल्याणकारी"
      },
      {
        "word": "सः",
        "meaning": "वह"
      },
      {
        "word": "अ॒हम्",
        "meaning": "मैं"
      },
      {
        "word": "अ॒स्मि॒",
        "meaning": "हूँ"
      }
    ],
    "shastricContext": "वेदान्त का अमर महावाक्य 'सोऽहमस्मि' (I am He)। जीवात्मा और परमात्मा की ऐक्य अनुभूति का चरम वैदिक उद्घोष।",
    "orderIndex": 11,
    "status": "ACTIVE"
  },
  {
    "id": "yj-kr-1-1",
    "slug": "yj-kr-1-1",
    "vedaId": "yajurveda",
    "nodeId": "taittiriya-upanishad",
    "vedaName": "यजुर्वेद (कृष्ण यजुर्वेद)",
    "shakha": "तैत्तिरीय शाखा",
    "textName": "तैत्तिरीय उपनिषद् (शिक्षावल्ली)",
    "sectionRef": "शिक्षावल्ली, अनुवाक ११",
    "mantraNumber": "१.११.१",
    "rishi": "त्रिशङ्कु",
    "devata": "धर्म एवं सत्य",
    "chhanda": "यजुः सूत्र",
    "svara": "सस्वर वैदिक पाठ (तैत्तिरीय स्वर)",
    "sanskrit": "स॒त्यं व॑द। ध॒र्मं च॑र। स्वा॒ध्या॒यान्मा प्र॑मदः। आ॒चा॒र्या॑य प्रि॒यं धन॒माहृ॑त्य प्र॒जात॑न्तुं मा व्य॑वच्छेत्सीः॥",
    "transliteration": "satyaṃ vada | dharmaṃ cara | svādhyāyān mā pramadaḥ | ācāryāya priyaṃ dhanam āhṛtya prajā-tantuṃ mā vyavacchetsīḥ ||",
    "hindiTranslation": "सदा सत्य बोलो। धर्म का आचरण करो। स्वाध्याय (आत्म-अध्ययन) में कभी प्रमाद मत करो। आचार्य को प्रिय दक्षिणा भेंट कर गृहस्थाश्रम में संतान-परम्परा को मत तोड़ो।",
    "englishTranslation": "Speak the truth. Practice righteousness. Do not neglect self-study and learning. Having offered desirable gifts to the teacher, cut not off the thread of progeny.",
    "hinglishTranslation": "Satya bolo. Dharma ka aacharan karo. Swadhyay me alasya mat karo. Guru ko dakshina dekar vansha parampara ko aage badhao.",
    "padapatha": [
      {
        "word": "स॒त्यम्",
        "meaning": "सत्य को"
      },
      {
        "word": "व॒द॒",
        "meaning": "बोलो"
      },
      {
        "word": "ध॒र्मम्",
        "meaning": "धर्म का"
      },
      {
        "word": "च॒र॒",
        "meaning": "आचरण करो"
      },
      {
        "word": "स्वा॒ध्या॒यात्",
        "meaning": "स्वाध्याय से"
      },
      {
        "word": "मा",
        "meaning": "मत"
      },
      {
        "word": "प्र॒म॒दः॒",
        "meaning": "प्रमाद करो"
      }
    ],
    "shastricContext": "सनातन गुरुकुलों का दीक्षांत अनुशासन। भारतीय जीवन मूल्यों का सर्वोच्च आधार।",
    "orderIndex": 12,
    "status": "ACTIVE"
  },
  {
    "id": "sv-1-1-3",
    "slug": "sv-1-1-3",
    "vedaId": "samaveda",
    "nodeId": "sv-agneya-kanda",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (पूर्वार्चिक - आग्नेय काण्ड)",
    "sectionRef": "पूर्वार्चिक, प्रपाठक १, दशति १, मन्त्र ३ (ऋग्वेद १.१२.१)",
    "mantraNumber": "१.१.३",
    "rishi": "मेधातिथि काण्व",
    "devata": "अग्नि (Agni - Duta)",
    "chhanda": "गायत्री",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ अ॒ग्निं दू॒तं पु॒रो द॑धे हव्य॒वाह॒मुप॑ ब्रुवे।\nदे॒वाँ आ सा॑दया॒दिह॑॥३॥",
    "transliteration": "oṃ agniṃ dūtaṃ puro dadhe havyavāham upa bruve |\ndevāṃ ā sādayād iha || 3 ||",
    "hindiTranslation": "मैं देवदूत रूप अग्नि को अपने सम्मुख (अग्रणी पुरोहित रूप में) स्थापित करता हूँ और हव्यवाह (हवि को देवों तक पहुँचाने वाले) अग्नि की प्रार्थना करता हूँ, जिससे वे समस्त देवों को यहाँ यज्ञवेदी पर लाएँ।",
    "englishTranslation": "I place in front Agni, the divine messenger and bearer of oblations, and invoke him that he may bring and seat the gods here upon our sacrifice.",
    "hinglishTranslation": "Main divya sandeshvahak Agni Dev ko apne aagey sthapit karta hoon aur havi le jane wale Agni ki prarthana karta hoon, taaki ve sabhi devtaon ko is yagya mein aasan par virajman karein.",
    "padapatha": [
      {
        "word": "अ॒ग्निम्",
        "meaning": "अग्निदेव को"
      },
      {
        "word": "दू॒तम्",
        "meaning": "देवदूत रूप में"
      },
      {
        "word": "पु॒रः",
        "meaning": "सम्मुख / आगे"
      },
      {
        "word": "द॒धे॒",
        "meaning": "स्थापित करता हूँ"
      },
      {
        "word": "ह॒व्य॒ऽवाह॑म्",
        "meaning": "हवि को देवताओं तक पहुँचाने वाले को"
      },
      {
        "word": "उप॑",
        "meaning": "समीप आकर"
      },
      {
        "word": "ब्रु॒वे॒",
        "meaning": "प्रार्थना करता हूँ / पुकारता हूँ"
      },
      {
        "word": "दे॒वान्",
        "meaning": "दिव्य देवताओं को"
      },
      {
        "word": "आ",
        "meaning": "यहाँ"
      },
      {
        "word": "सा॒द॒या॒त्",
        "meaning": "विराजमान कराएं"
      },
      {
        "word": "इ॒ह",
        "meaning": "इस यज्ञ स्थल पर"
      }
    ],
    "shastricContext": "अग्नि को 'हव्यवाह' (हवि ले जाने वाला) एवं 'दूत' (यजमान और देवताओं के बीच संदेशवाहक) रूप में प्रतिष्ठापित करने वाला सुप्रसिद्ध मन्त्र। सामगान में यह मन्त्र देवों के पृथ्वी पर आगमन का संगीतमय आह्वान है।",
    "audioUrl": null,
    "previousId": "sv-1-1-2",
    "nextId": "sv-1-2-1",
    "chapterMantraIds": [
      "sv-1-1-1",
      "sv-1-1-2",
      "sv-1-1-3"
    ],
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "sv-1-2-1",
    "slug": "sv-1-2-1",
    "vedaId": "samaveda",
    "nodeId": "sv-aindra-parva",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (पूर्वार्चिक - ऐन्द्र पर्व)",
    "sectionRef": "पूर्वार्चिक, प्रपाठक २, दशति १, मन्त्र १ (ऋग्वेद १.७.१)",
    "mantraNumber": "१.२.१",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "इन्द्र (Indra)",
    "chhanda": "गायत्री",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ इन्द्र॒मिद्गा॒थिनो॑ बृ॒हदिन्द्र॑म॒र्केभि॑र॒र्किनः॑।\nइन्द्रं॒ वाणी॑रनूषत॥१॥",
    "transliteration": "oṃ indram id gāthino bṛhad indram arkebhir arkinaḥ |\nindraṃ vāṇīr anūṣata || 1 ||",
    "hindiTranslation": "गायक (गाथा गाने वाले उद्गाता) विशाल इन्द्र का ही गान करते हैं, ऋचाओं के पाठकर्ता ऋत्विक मन्त्रों से इन्द्र की ही स्तुति करते हैं, और विविध संगीत वाणी (गीतियाँ) इन्द्र का ही जयघोष करती हैं।",
    "englishTranslation": "The singers glorify Indra with vast chants, the worshippers praise Indra with sacred hymns, and the diverse melodies of sacred speech sing Indra's renown.",
    "hinglishTranslation": "Gayan karne wale Udgata vishal Indra ka hi gayan karte hain, archana karne wale rishi mantra-stuti se Indra ko sarhate hain, aur vibhinn sangeet mayi vaniyan Indra ka hi gunogan karti hain.",
    "padapatha": [
      {
        "word": "इन्द्र॑म्",
        "meaning": "इन्द्रदेव को"
      },
      {
        "word": "इत्",
        "meaning": "ही / केवल"
      },
      {
        "word": "गा॒थिनः॑",
        "meaning": "गाथा गाने वाले उद्गाता"
      },
      {
        "word": "बृ॒हत्",
        "meaning": "विशाल / उच्च स्वर से"
      },
      {
        "word": "इन्द्र॑म्",
        "meaning": "इन्द्रदेव को"
      },
      {
        "word": "अ॒र्केभिः॑",
        "meaning": "अर्चन योग्य मन्त्रों से"
      },
      {
        "word": "अ॒र्किनः॑",
        "meaning": "स्तुतिकर्ता ऋत्विक"
      },
      {
        "word": "इन्द्र॑म्",
        "meaning": "इन्द्रदेव का"
      },
      {
        "word": "वाणीः॑",
        "meaning": "विविध स्वर-लहरियाँ व गीतियाँ"
      },
      {
        "word": "अ॒नू॒ष॒त",
        "meaning": "गान करती हैं / जयघोष करती हैं"
      }
    ],
    "shastricContext": "ऐन्द्र पर्व का प्रसिद्ध मन्त्र जो वैदिक संगीत के विभिन्न पक्षों—गाथा (सामगान), अर्क (ऋचा पाठ) एवं वाणी (स्वर-ध्वनि)—का समन्वय इन्द्र की महिमा में प्रस्तुत करता है।",
    "audioUrl": null,
    "previousId": "sv-1-1-3",
    "nextId": "sv-1-2-2",
    "chapterMantraIds": [
      "sv-1-2-1",
      "sv-1-2-2"
    ],
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "sv-1-2-2",
    "slug": "sv-1-2-2",
    "vedaId": "samaveda",
    "nodeId": "sv-aindra-parva",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (पूर्वार्चिक - ऐन्द्र पर्व)",
    "sectionRef": "पूर्वार्चिक, प्रपाठक २, दशति १, मन्त्र २ (ऋग्वेद १.७.२)",
    "mantraNumber": "१.२.२",
    "rishi": "मधुच्छन्दा वैश्वामित्र",
    "devata": "इन्द्र (Indra)",
    "chhanda": "गायत्री",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ इन्द्र॒ इद्धर्योः॒ सचा॒ संमि॑श्ल॒ आ व॑चो॒युजा॑।\nइन्द्रो॑ व॒ज्री हिर॑ण्ययः॥२॥",
    "transliteration": "oṃ indra id dharyoḥ sacā sammiśla ā vacoyujā |\nindro vajrī hiraṇyayaḥ || 2 ||",
    "hindiTranslation": "वाणी के संकेत मात्र से रथ में जुतने वाले अपने दोनों अश्वों (हरियों) के साथ इन्द्रदेव ही सम्मिलित होते हैं। वे इन्द्रदेव वज्रधारी तथा सुवर्णमय दिव्य आभा से सुशोभित हैं।",
    "englishTranslation": "Indra alone is united with his two bay steeds that are yoked at prayer's word; Indra is the wielder of the thunderbolt (vajra) and resplendent like gold.",
    "hinglishTranslation": "Vani ke sanket se jutne wale apne do peele ghodo ke saath Indra Dev aate hain; ve vajradhari Indra swarnamay divya aabha se chamak rahe hain.",
    "padapatha": [
      {
        "word": "इन्द्रः॑",
        "meaning": "इन्द्रदेव"
      },
      {
        "word": "इत्",
        "meaning": "ही"
      },
      {
        "word": "हर्योः॑",
        "meaning": "दोनों हरित/पीत अश्वों के साथ"
      },
      {
        "word": "सचा॑",
        "meaning": "सहित / संयुक्त होकर"
      },
      {
        "word": "सम्ऽमि॑श्लः",
        "meaning": "भली-भांति मिले हुए"
      },
      {
        "word": "आ",
        "meaning": "आते हैं"
      },
      {
        "word": "व॒चः॒ऽयुजा॑",
        "meaning": "वाणी या स्तुति मात्र से जुतने वाले"
      },
      {
        "word": "इन्द्रः॑",
        "meaning": "इन्द्रदेव"
      },
      {
        "word": "व॒ज्री",
        "meaning": "वज्र को धारण करने वाले"
      },
      {
        "word": "हिर॑ण्ययः",
        "meaning": "सुवर्णमय / प्रकाशवान्"
      }
    ],
    "shastricContext": "इन्द्र के रथ, वज्र एवं मनःसंकल्प से चलने वाले अश्वों का सामगान रूप में वर्णन, जो संकल्प-शक्ति की त्वरित गति और सामर्थ्य का द्योतक है।",
    "audioUrl": null,
    "previousId": "sv-1-2-1",
    "nextId": "sv-2-1-1",
    "chapterMantraIds": [
      "sv-1-2-1",
      "sv-1-2-2"
    ],
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "sv-2-1-2",
    "slug": "sv-2-1-2",
    "vedaId": "samaveda",
    "nodeId": "sv-uttararchik",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "सामवेद संहिता (उत्तरार्चिक - पवमान काण्ड)",
    "sectionRef": "उत्तरार्चिक, प्रपाठक २, दशति १, मन्त्र २ (ऋग्वेद ९.१०७.४)",
    "mantraNumber": "२.१.२",
    "rishi": "सप्तर्षयः (भारद्वाज, कश्यप, गोतम, अत्रि, विश्वामित्र, जमदग्नि, वसिष्ठ)",
    "devata": "पवमान सोम (Soma Pavamana)",
    "chhanda": "उष्णिक् / बृहती (सामगान तृच)",
    "svara": "सामगान स्वर",
    "sanskrit": "ॐ पु॒ना॒नः सो॑म धा॒रयापो॒ वसा॑नो अर्षसि।\nआ र॑त्न॒धा योनि॑मृ॒तस्य॑ सीदसि॥२॥",
    "transliteration": "oṃ punānaḥ soma dhārayāpo vasāno arṣasi |\nā ratnadhā yonim ṛtasya sīdasi || 2 ||",
    "hindiTranslation": "हे सोमदेव! आप अपनी पावन अमृत धारा से शुद्ध होते हुए, जल को वस्त्र रूप में धारण कर कलश की ओर प्रवाहित होते हैं; तथा परम रत्नों (अमूल्य आत्मिक गुणों) को प्रदान करते हुए सत्य (ऋत) के मूल स्रोत पर प्रतिष्ठित होते हैं।",
    "englishTranslation": "Purifying thyself in a golden stream, O Soma, clothed in sacred waters thou streamest forth; bestowing precious treasures, thou takest thy seat upon the throne of Eternal Truth (Rta).",
    "hinglishTranslation": "Hey Som Dev! Pavitra dhara se shuddh hokar, jal ko vastra ke roop mein dharan karke aap pravahit hote hain, aur divya ratnon ko pradan karte hue param satya (Rta) ke aasan par virajman hote hain.",
    "padapatha": [
      {
        "word": "पु॒ना॒नः",
        "meaning": "पवित्र होता हुआ / छनता हुआ"
      },
      {
        "word": "सो॒म॒",
        "meaning": "हे सोमदेव!"
      },
      {
        "word": "धा॒रया॑",
        "meaning": "अविच्छिन्न पावन धारा से"
      },
      {
        "word": "अपः॑",
        "meaning": "जलों (वसतीवरी/एकधना) को"
      },
      {
        "word": "वसा॑नः",
        "meaning": "वस्त्र के समान ओढ़ता हुआ"
      },
      {
        "word": "अ॒र्ष॒सि॒",
        "meaning": "कलश की ओर प्रवाहित होता है"
      },
      {
        "word": "आ",
        "meaning": "समन्ततः"
      },
      {
        "word": "र॒त्न॒ऽधाः",
        "meaning": "श्रेष्ठ आध्यात्मिक रत्नों को देने वाला"
      },
      {
        "word": "योनि॑म्",
        "meaning": "स्थान / अधिष्ठान पर"
      },
      {
        "word": "ऋ॒तस्य॑",
        "meaning": "परम सत्य एवं ब्रह्माण्डीय नियम (ऋत) के"
      },
      {
        "word": "सी॒द॒सि॒",
        "meaning": "आसीन होता है"
      }
    ],
    "shastricContext": "उत्तरार्चिक पवमान सामगान (ऋग्वेद ९.१०७.४)। सोम का द्रोणकलश में अवतरण और 'ऋतस्य योनि' (सत्य के अधिष्ठान) पर प्रतिष्ठित होना यह दर्शाता है कि बाह्य यज्ञ वस्तुतः अन्तःचेतना में ऋत और सत्य की स्थापना का प्रतीक है।",
    "audioUrl": null,
    "previousId": "sv-2-1-1",
    "nextId": "sv-ch-1-1",
    "chapterMantraIds": [
      "sv-2-1-1",
      "sv-2-1-2"
    ],
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "sv-ch-1-1",
    "slug": "sv-ch-1-1",
    "vedaId": "samaveda",
    "nodeId": "chandogya-udgitha",
    "vedaName": "सामवेद (Samaveda)",
    "shakha": "कौथुम शाखा",
    "textName": "छान्दोग्य उपनिषद् (प्रथमोऽध्यायः)",
    "sectionRef": "छान्दोग्योपनिषद्, प्रपाठक १, खण्ड १, मन्त्र १",
    "mantraNumber": "१.१.१",
    "rishi": "महर्षि उद्दालक आरुणि / छान्दोग्य उपनिषद् परम्परा",
    "devata": "परब्रह्म ओंकार (Pranava / Udgitha)",
    "chhanda": "ब्राह्मी उपनिषद् गद्य",
    "svara": "उपनिषद् स्वर",
    "sanskrit": "ॐ इत्ये॒तद॒क्षर॑मुद्गी॒थमु॑पासीत।\nओमि॑ति॒ ह्युद्गा॑यति॒ तस्योप॒व्याख्या॑नम्॥१॥",
    "transliteration": "oṃ ity etad akṣaram udgītham upāsīta |\nom iti hy udgāyati tasyopavyākhyānam || 1 ||",
    "hindiTranslation": "परम पावन 'ॐ' इस अविनाशी अक्षर की 'उद्गीथ' रूप में उपासना करनी चाहिए; क्योंकि ओंकार का उच्चारण करके ही उद्गाता सामगान का प्रारम्भ करता है। आगे उसी की विस्तृत व्याख्या (उपव्याख्यान) की जा रही है।",
    "englishTranslation": "One should meditate upon the syllable 'OM' as the Udgitha; for beginning with 'OM', the Udgatri priest chants the sacred Sama. Now follows its profound elucidation.",
    "hinglishTranslation": "Pavitra akshar 'OM' ki Udgitha ke roop mein upasana karni chahiye; kyonki OM bolkar hi Udgata samaveda ka gayan prarambh karta hai. Aage usi ki vishleshatmak vyakhya ki ja rahi hai.",
    "padapatha": [
      {
        "word": "ॐ",
        "meaning": "परमब्रह्म का वाचक प्रणव"
      },
      {
        "word": "इति",
        "meaning": "ऐसा / इस प्रकार"
      },
      {
        "word": "ए॒तत्",
        "meaning": "यह"
      },
      {
        "word": "अ॒क्षर॑म्",
        "meaning": "अविनाशी अक्षर"
      },
      {
        "word": "उ॒द्गी॒थम्",
        "meaning": "सामवेद का प्रधान उद्गीथ भाग"
      },
      {
        "word": "उ॒पा॒सी॒त",
        "meaning": "ध्यान व उपासना करे"
      },
      {
        "word": "ॐ",
        "meaning": "ओम्"
      },
      {
        "word": "इति",
        "meaning": "इस प्रकार"
      },
      {
        "word": "हि",
        "meaning": "क्योंकि"
      },
      {
        "word": "उ॒द्गा॑यति",
        "meaning": "उच्च स्वर से गान प्रारम्भ करता है"
      },
      {
        "word": "तस्य॑",
        "meaning": "उस ओंकार उद्गीथ का"
      },
      {
        "word": "उ॒प॒व्याख्या॑नम्",
        "meaning": "समीपस्थ विस्तृत रहस्यपूर्ण विवेचन"
      }
    ],
    "shastricContext": "छान्दोग्योपनिषद् का प्रथम मंगलाचरण सूत्र। सामवेद के समस्त गानों में ओंकार को ही 'उद्गीथ' का सारभूत प्राण माना गया है। उपनिषद् के अनुसार पृथ्वी का रस जल है, जल का रस वनस्पति है, वनस्पति का रस पुरुष है, पुरुष का रस वाणी है, वाणी का रस ऋक् है, ऋक् का रस साम है और साम का सर्वोत्तम रस उद्गीथ (ॐ) है — रसतमः परमः परार्ध्यः।",
    "audioUrl": null,
    "previousId": "sv-2-1-2",
    "nextId": null,
    "chapterMantraIds": [
      "sv-ch-1-1"
    ],
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "av-1-1-2",
    "slug": "av-1-1-2",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-1-sukta-1",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (मेधा जनन सूक्त)",
    "sectionRef": "काण्ड १, सूक्त १, मन्त्र २",
    "mantraNumber": "१.१.२",
    "rishi": "महर्षि अथर्वा",
    "devata": "वाचस्पतिः (Vachaspati)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ पुन॒रेहि॑ वाचस्पते दे॒वेन॒ मन॑सा स॒ह।\nवसो॑ष्पते॒ नि र॑मय॒ मय्ये॒व श्रु॒तं मयि॑॥२॥",
    "transliteration": "oṃ punar ehi vācaspate devena manasā saha |\nvasoṣpate ni ramaya mayy eva śrutaṃ mayi || 2 ||",
    "hindiTranslation": "हे वाणी एवं ज्ञान के अधिपति वाचस्पते! आप दिव्य एवं पवित्र मन के साथ मेरे अंतःकरण में पुनः पधारिए। हे ज्ञान-धन के स्वामी! आपने जो भी श्रुति (वेद ज्ञान) मुझे प्रदान किया है, उसे मुझमें ही स्थिर एवं सुरक्षित कीजिए।",
    "englishTranslation": "Come again, O Lord of Speech, together with divine intellect and pious thought! O Lord of Treasures, make pleasant and permanently firmly fixed in me all that I have heard and studied (the sacred Vedic wisdom)!",
    "hinglishTranslation": "Hey Vachaspati! Aap divya man ke saath mere hriday mein punah padhariye. Hey divya sampatti ke swami! Maine jo bhi Ved gyan suna aur seekha hai, use sadaiv mere bheetar sthir aur surakshit kijiye.",
    "padapatha": [
      {
        "word": "पुनः॑",
        "meaning": "पुनः / बार-बार"
      },
      {
        "word": "आ । इहि॑",
        "meaning": "आइए"
      },
      {
        "word": "वा॒च॒स्प॒ते॒",
        "meaning": "हे वाणी के अधिपति!"
      },
      {
        "word": "दे॒वेन॑",
        "meaning": "दिव्य / प्रकाशमान"
      },
      {
        "word": "मन॑सा",
        "meaning": "मन के"
      },
      {
        "word": "स॒ह",
        "meaning": "साथ"
      },
      {
        "word": "वसोः॑ । प॒ते॒",
        "meaning": "हे आत्म-ऐश्वर्य के पालक!"
      },
      {
        "word": "नि",
        "meaning": "निश्चित रूप से"
      },
      {
        "word": "र॒म॒य॒",
        "meaning": "स्थिर / रमण कराइए"
      },
      {
        "word": "मयि॑",
        "meaning": "मुझमें"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "श्रु॒तम्",
        "meaning": "अध्ययन किया हुआ वेद ज्ञान"
      },
      {
        "word": "मयि॑",
        "meaning": "मुझमें"
      }
    ],
    "shastricContext": "विद्यार्थी एवं साधक द्वारा विस्मृति (भूलने की दुर्बलता) को दूर कर स्मृति और मेधा को सदा जाग्रत रखने की सर्वश्रेष्ठ वैदिक प्रार्थना। निरुक्त (१०.१७) में वाचस्पति को प्रज्ञा का अधिष्ठाता माना गया है।",
    "audioUrl": null,
    "previousId": "av-1-1-1",
    "nextId": "av-1-1-4",
    "chapterMantraIds": [
      "av-1-1-1",
      "av-1-1-2",
      "av-1-1-4"
    ],
    "orderIndex": 2,
    "status": "ACTIVE"
  },
  {
    "id": "av-1-1-4",
    "slug": "av-1-1-4",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-1-sukta-1",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (मेधा जनन सूक्त)",
    "sectionRef": "काण्ड १, सूक्त १, मन्त्र ४",
    "mantraNumber": "१.१.४",
    "rishi": "महर्षि अथर्वा",
    "devata": "वाचस्पतिः (Vachaspati)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ इ॒हैवाभि वि त॑नू॒भे आर्त्नी॑ इव॒ ज्यया॑।\nवा॒चस्पति॒र्निय॑च्छतु॒ मय्ये॒वास्तु॒ मयि॑ श्रु॒तम्॥४॥",
    "transliteration": "oṃ ihaivābhi vi tanūbhe ārtnī iva jyayā |\nvācaspatir niyacchatu mayy evāstu mayi śrutam || 4 ||",
    "hindiTranslation": "जिस प्रकार धनुष की प्रत्यंचा (डोरी) धनुष के दोनों सिरों (कोटियों) को आपस में दृढ़तापूर्वक बाँधकर तान देती है, उसी प्रकार हे वाचस्पति! आप मेरे चित्त और बुद्धि को ज्ञान से संयुक्त कर दीजिए। समस्त श्रुत (वैदिक ज्ञान) मुझमें ही सदा निवास करे।",
    "englishTranslation": "Even as both ends of the bow are drawn tightly and joined by the bowstring, so right here may the Lord of Speech bind and fix knowledge firmly in me. May all sacred learning remain within me forever!",
    "hinglishTranslation": "Jaise dhanush ki dori dhanush ke dono siro ko majbooti se baandh deti hai, usi tarah hey Vachaspati! Mere man aur buddhi ko gyan se jodkar sthir kar dijiye. Samast Ved gyan sadaiv mujhme sthit rahe.",
    "padapatha": [
      {
        "word": "इ॒ह",
        "meaning": "यहाँ (मेरे अंतःकरण में)"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "अ॒भि",
        "meaning": "सम्मुख"
      },
      {
        "word": "वि",
        "meaning": "विशेष रूप से"
      },
      {
        "word": "त॒नु॒",
        "meaning": "विस्तारित / तान दीजिए"
      },
      {
        "word": "उ॒भे",
        "meaning": "दोनों को"
      },
      {
        "word": "आर्त्नी॑",
        "meaning": "धनुष के दोनों सिरों को"
      },
      {
        "word": "इ॒व",
        "meaning": "जिस प्रकार"
      },
      {
        "word": "ज्यया॑",
        "meaning": "प्रत्यंचा (डोरी) से"
      },
      {
        "word": "वा॒चस्पतिः॑",
        "meaning": "वाणी के स्वामी"
      },
      {
        "word": "नि",
        "meaning": "नियमपूर्वक"
      },
      {
        "word": "य॒च्छ॒तु॒",
        "meaning": "नियंत्रित एवं स्थिर करें"
      },
      {
        "word": "मयि॑",
        "meaning": "मुझमें"
      },
      {
        "word": "ए॒व",
        "meaning": "ही"
      },
      {
        "word": "अ॒स्तु॒",
        "meaning": "रहे"
      },
      {
        "word": "मयि॑",
        "meaning": "मुझमें"
      },
      {
        "word": "श्रु॒तम्",
        "meaning": "श्रुत ज्ञान / धारणा"
      }
    ],
    "shastricContext": "धनुष और प्रत्यंचा का सुंदर रूपक देते हुए एकाग्रता (Conscious Concentration) और अखंड स्मृति का विज्ञान। जैसे प्रत्यंचा धनुष को लक्ष्य-वेधन योग्य बनाती है, वैसे ही वाचस्पति साधक की मेधा को स्थिर करते हैं।",
    "audioUrl": null,
    "previousId": "av-1-1-2",
    "nextId": "av-1-2-1",
    "chapterMantraIds": [
      "av-1-1-1",
      "av-1-1-2",
      "av-1-1-4"
    ],
    "orderIndex": 3,
    "status": "ACTIVE"
  },
  {
    "id": "av-1-2-1",
    "slug": "av-1-2-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-1-sukta-2",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (आयुष्य एवं रोगनाशन सूक्त)",
    "sectionRef": "काण्ड १, सूक्त २, मन्त्र १",
    "mantraNumber": "१.२.१",
    "rishi": "महर्षि अथर्वा",
    "devata": "पर्जन्यः / शरः (रोगनिवारक जल व वनस्पति)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ वि॒द्याम॑ श॒रस्य॑ पि॒तरं॑ प॒र्जन्यं॑ श॒तवृ॑ष्ण्यम्।\nतेना॑ ते त॒न्वे३ शं क॑रं पृथि॒व्यां ते नि॒षेच॑नम्॥१॥",
    "transliteration": "oṃ vidyāma śarasya pitaraṃ parjanyaṃ śatavṛṣṇyam |\ntenā te tanve śaṃ karaṃ pṛthivyāṃ te niṣecanam || 1 ||",
    "hindiTranslation": "हम सौ प्रकार की जीवन-वर्धक शक्तियों से युक्त, शर (जल-प्रवाह / औषधीय तृण) के जनक पर्जन्य (मेघ/वृष्टि देव) को भलीभाँति जानते हैं। उसके द्वारा मैं तुम्हारे शरीर के लिए कल्याणकारी आरोग्य करता हूँ; तुम्हारा समस्त रोग व विष पृथ्वी में विसर्जित हो जाए।",
    "englishTranslation": "We know Parjanya, the father of the healing reed and life-giving rain, endowed with a hundredfold fertilizing and vitalizing powers. Through him I bring healing wellness to thy body; may thy affliction be safely drained into the earth!",
    "hinglishTranslation": "Hum sau guni shaktiyo wale parjanya dev (varsha aur jal ke swami) ko jante hain jo aushadhi ke janak hain. Us divya tatva se main tumhare sharir ko arogya aur kalyan pradan karta hoon; tumhari vyadhi prithvi mein visarjit ho jaye.",
    "padapatha": [
      {
        "word": "वि॒द्याम॑",
        "meaning": "हम जानें"
      },
      {
        "word": "श॒रस्य॑",
        "meaning": "शर (रोगनिवारक औषधीय तृण / जल) के"
      },
      {
        "word": "पि॒तर॑म्",
        "meaning": "जनक / पालक को"
      },
      {
        "word": "प॒र्जन्य॑म्",
        "meaning": "पर्जन्य देव (मेघ) को"
      },
      {
        "word": "श॒तऽवृ॑ष्ण्यम्",
        "meaning": "सैकड़ों जीवन-वर्धक शक्तियों से सम्पन्न"
      },
      {
        "word": "तेन॑",
        "meaning": "उसके द्वारा"
      },
      {
        "word": "ते॒",
        "meaning": "तुम्हारे"
      },
      {
        "word": "त॒न्वे॑",
        "meaning": "शरीर के लिए"
      },
      {
        "word": "शम्",
        "meaning": "आरोग्य / कल्याण"
      },
      {
        "word": "क॒र॒म्",
        "meaning": "मैं करूँ"
      },
      {
        "word": "पृ॒थि॒व्याम्",
        "meaning": "पृथ्वी पर / भूमि में"
      },
      {
        "word": "ते॒",
        "meaning": "तुम्हारा"
      },
      {
        "word": "नि॒ऽसेच॑नम्",
        "meaning": "दोषों का निष्कासन व जल-सिंचन"
      }
    ],
    "shastricContext": "आयुर्वेद एवं भैषज्य विद्या का मूल अथर्ववेदीय मंत्र। इसमें पर्जन्य को जल-चिकित्सा (Hydrotherapy) और औषधियों का मूल स्रोत मानकर शरीर की आधि-व्याधि के शमन एवं शुद्धीकरण का विधान है।",
    "audioUrl": null,
    "previousId": "av-1-1-4",
    "nextId": "av-10-7-1",
    "chapterMantraIds": [
      "av-1-2-1"
    ],
    "orderIndex": 4,
    "status": "ACTIVE"
  },
  {
    "id": "av-10-7-1",
    "slug": "av-10-7-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-10-skambha",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (स्कम्भ सूक्त)",
    "sectionRef": "काण्ड १०, सूक्त ७, मन्त्र १",
    "mantraNumber": "१०.७.१",
    "rishi": "महर्षि अथर्वा / ब्रह्मा",
    "devata": "स्कम्भः (Cosmic Pillar / Supreme Brahman)",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ कस्मि॒न्नङ्गे॒ तपो॑ अस्याधि॑ तिष्ठति॒ कस्मि॒न्नङ्ग॑ ऋ॒तम॒स्याध्या॑हि॒तम्।\nक्व॑ व्र॒तं क्व श्र॒द्धास्य॒ तिष्ठ॑ति॒ कस्मि॒न्नङ्गे॑ स॒त्यमस्य॒ प्रति॑ष्ठितम्॥१॥",
    "transliteration": "oṃ kasminn aṅge tapo asyādhi tiṣṭhati kasminn aṅga ṛtam asyādhyāhitam |\nkva vrataṃ kva śraddhāsya tiṣṭhati kasminn aṅge satyam asya pratiṣṭhitam || 1 ||",
    "hindiTranslation": "इस विराट् स्कम्भ (ब्रह्माण्ड के आधारभूत परम ब्रह्म) के किस अंग में तप अधिष्ठित है? इसके किस अंग में ऋत (सृष्टि का सनातन नियम) स्थापित है? इसका व्रत कहाँ है और इसकी श्रद्धा कहाँ स्थित है? तथा इसके किस अंग में परम सत्य प्रतिष्ठित है?",
    "englishTranslation": "In which of his limbs doth Fervour (Tapas) abide? In which limb is the Cosmic Order (Rita) set? Where lies his holy vow (Vrata), and where his Faith (Shraddha)? And in which limb of his is absolute Truth (Satya) firmly established?",
    "hinglishTranslation": "Is virat Skambha (Brahman) ke kis ang mein tap sthit hai? Iske kis ang mein shashwat niyam (Rit) sthapit hai? Iska vrat kahan hai aur shraddha kahan virajman hai? Aur iske kis ang mein param satya pratishthit hai?",
    "padapatha": [
      {
        "word": "कस्मि॑न्",
        "meaning": "किस"
      },
      {
        "word": "अङ्गे॑",
        "meaning": "अंग में"
      },
      {
        "word": "तपः॑",
        "meaning": "तप (सृजन-ऊर्जा)"
      },
      {
        "word": "अ॒स्य॒",
        "meaning": "इस स्कम्भ के"
      },
      {
        "word": "अधि॑",
        "meaning": "ऊपर / भीतर"
      },
      {
        "word": "ति॒ष्ठ॒ति॒",
        "meaning": "स्थित है"
      },
      {
        "word": "कस्मि॑न्",
        "meaning": "किस"
      },
      {
        "word": "अङ्गे॑",
        "meaning": "अंग में"
      },
      {
        "word": "ऋ॒तम्",
        "meaning": "ऋत (ब्रह्माण्डीय व्यवस्था)"
      },
      {
        "word": "अ॒स्य॒",
        "meaning": "इसके"
      },
      {
        "word": "अधि॑",
        "meaning": "अधिष्ठित"
      },
      {
        "word": "आऽहि॑तम्",
        "meaning": "स्थापित है"
      },
      {
        "word": "क्व॑",
        "meaning": "कहाँ"
      },
      {
        "word": "व्र॒तम्",
        "meaning": "नियम व संकल्प"
      },
      {
        "word": "क्व॑",
        "meaning": "कहाँ"
      },
      {
        "word": "श्र॒द्धा",
        "meaning": "दिव्य श्रद्धा"
      },
      {
        "word": "अ॒स्य॒",
        "meaning": "इसकी"
      },
      {
        "word": "ति॒ष्ठ॒ति॒",
        "meaning": "रहती है"
      },
      {
        "word": "कस्मि॑न्",
        "meaning": "किस"
      },
      {
        "word": "अङ्गे॑",
        "meaning": "अंग में"
      },
      {
        "word": "स॒त्यम्",
        "meaning": "सत्य"
      },
      {
        "word": "अ॒स्य॒",
        "meaning": "इसका"
      },
      {
        "word": "प्रति॑ऽस्थितम्",
        "meaning": "प्रतिष्ठित है"
      }
    ],
    "shastricContext": "अथर्ववेद का सर्वोत्कृष्ट दार्शनिक सूक्त। 'स्कम्भ' का अर्थ है समस्त ब्रह्माण्ड को सम्भाले रखने वाला परम ब्रह्म रूपी स्तम्भ। यह मंत्र उपनिषदों की ब्रह्म-जिज्ञासा ('अथातो ब्रह्मजिज्ञासा') का वैदिक उद्गम है।",
    "audioUrl": null,
    "previousId": "av-1-2-1",
    "nextId": "av-11-5-1",
    "chapterMantraIds": [
      "av-10-7-1"
    ],
    "orderIndex": 5,
    "status": "ACTIVE"
  },
  {
    "id": "av-11-5-1",
    "slug": "av-11-5-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-11-brahmacharya",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (ब्रह्मचर्य सूक्त)",
    "sectionRef": "काण्ड ११, सूक्त ५, मन्त्र १",
    "mantraNumber": "११.५.१",
    "rishi": "महर्षि अथर्वा / ब्रह्मा",
    "devata": "ब्रह्मचारी (The Dedicated Vedic Seeker / Cosmic Student)",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ इ॒यं समि॑त्पृथि॒वी द्यौर्द्वि॑ती॒योता॒न्तरि॑क्षं॒ समि॑धा पृणाति।\nब्र॒ह्म॒चा॒री समि॑धा मे॒खल॑या॒ श्रमे॑ण लो॒कांस्तप॑सा पिपर्ति॥१॥",
    "transliteration": "oṃ iyaṃ samit pṛthivī dyaur dvitīyotāntarikṣaṃ samidhā pṛṇāti |\nbrahmacārī samidhā mekhalayā śrameṇa lokāṃs tapasā piparti || 1 ||",
    "hindiTranslation": "यह पृथ्वी एक पवित्र समिधा है, द्युलोक दूसरी समिधा है और यह विशाल अंतरिक्ष भी ज्ञान-समिधा से परिपूर्ण है। ब्रह्मचारी समिधा (ज्ञान-यज्ञ), मेखला (संयम-कटिबंध), सतत श्रम और कठोर तपस्या के द्वारा सम्पूर्ण लोकों का भरण-पोषण व रक्षण करता है।",
    "englishTranslation": "This Earth is one sacred faggot (samidh), Heaven is the second, and the atmosphere too is filled with holy fuel. The Brahmachari, equipped with his sacrificial fuel, girdle, hard labour, and fervent austerity, nourishes and sustains all the worlds!",
    "hinglishTranslation": "Yeh dharti ek pavitra samidha hai, swarg doosri samidha hai aur antariksh bhi gyan-samidha se paripoorna hai. Brahmachari samidha, mekhala, kade parishram aur tap se samast loko ko trupt karta hai.",
    "padapatha": [
      {
        "word": "इ॒यम्",
        "meaning": "यह"
      },
      {
        "word": "समि॑त्",
        "meaning": "समिधा (यज्ञ-काष्ठ / ऊर्जा)"
      },
      {
        "word": "पृ॒थि॒वी",
        "meaning": "पृथ्वी"
      },
      {
        "word": "द्यौः",
        "meaning": "द्युलोक / आकाश"
      },
      {
        "word": "द्वि॒ती॒या",
        "meaning": "दूसरी"
      },
      {
        "word": "उ॒त",
        "meaning": "और"
      },
      {
        "word": "अ॒न्तरि॑क्षम्",
        "meaning": "अंतरिक्ष को"
      },
      {
        "word": "समि॑धा",
        "meaning": "समिधा से"
      },
      {
        "word": "पृ॒णा॒ति॒",
        "meaning": "परिपूर्ण करता है"
      },
      {
        "word": "ब्र॒ह्म॒ऽचा॒री",
        "meaning": "ब्रह्म का आचरण करने वाला विद्यार्थी"
      },
      {
        "word": "समि॑धा",
        "meaning": "ज्ञान की समिधा से"
      },
      {
        "word": "मे॒खल॑या",
        "meaning": "मेखला (संयम के कटिबंध) से"
      },
      {
        "word": "श्रमे॑ण",
        "meaning": "सतत उद्यम व परिश्रम से"
      },
      {
        "word": "लो॒कान्",
        "meaning": "समस्त लोकों / समाजों को"
      },
      {
        "word": "तप॑सा",
        "meaning": "आत्म-नियंत्रण व तप से"
      },
      {
        "word": "पि॒प॒र्ति॒",
        "meaning": "परितृप्त एवं पुष्ट करता है"
      }
    ],
    "shastricContext": "ब्रह्मचर्य सूक्त का प्रसिद्ध उद्घोष। वैदिक दर्शन में ब्रह्मचारी केवल एक विद्यार्थी नहीं, अपितु सम्पूर्ण राष्ट्र और ब्रह्माण्ड को अपनी तपस्या, संयम (मेखला) और ज्ञानार्जन (समिधा) से संजोने वाली आधारशिला है।",
    "audioUrl": null,
    "previousId": "av-10-7-1",
    "nextId": "av-12-1-1",
    "chapterMantraIds": [
      "av-11-5-1"
    ],
    "orderIndex": 6,
    "status": "ACTIVE"
  },
  {
    "id": "av-12-1-1",
    "slug": "av-12-1-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-12-bhumi",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (भूमि सूक्त / पृथ्वी सूक्त)",
    "sectionRef": "काण्ड १२, सूक्त १, मन्त्र १",
    "mantraNumber": "१२.१.१",
    "rishi": "महर्षि अथर्वा",
    "devata": "भूमिः / पृथिवी (Mother Earth)",
    "chhanda": "जगती",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ स॒त्यं बृ॒हदृत॑मु॒ग्रं दी॒क्षा तपो॒ ब्रह्म॑ य॒ज्ञः पृ॑थि॒वीं धा॑रयन्ति।\nसा नो॑ भू॒तस्य॒ भव्य॑स्य॒ पत्न्यु॒रुं लो॒कं पृ॑थि॒वी नः॑ कृणोतु॥१॥",
    "transliteration": "oṃ satyaṃ bṛhad ṛtam ugraṃ dīkṣā tapo brahma yajñaḥ pṛthivīṃ dhārayanti |\nsā no bhūtasya bhavyasya patny uruṃ lokaṃ pṛthivī naḥ kṛṇotu || 1 ||",
    "hindiTranslation": "परम सत्य, विराट् ब्रह्माण्डीय नियम (ऋत), उग्र साधना, दीक्षा, तप, ब्रह्म-ज्ञान और लोक-कल्याणकारी यज्ञ — ये सात महान दिव्य शक्तियाँ पृथ्वी को धारण करती हैं। भूत (अतीत) और भव्य (भविष्य) की स्वामिनी वह मातृभूमि हमारे लिए विस्तृत, समृद्ध और सुरक्षित लोक का निर्माण करे।",
    "englishTranslation": "Truth, vast Cosmic Order (Rita), unyielding resolve, Dedication, Tapas (Fervour), Spiritual Knowledge (Brahman), and Holy Sacrifice (Yajna) sustain the Earth. May She, the sovereign queen of what has been and what shall be, create for us a wide and glorious world!",
    "hinglishTranslation": "Satya, vishal Rit (brahmandiya niyam), sankalp, deeksha, tap, brahma-gyan aur yagya — ye saat mahan tatva Prithvi ko dharan karte hain. Bhoot aur bhavishya ki swamini yeh Dharti Mata hamare liye vishal aur samriddh sthan pradan kare.",
    "padapatha": [
      {
        "word": "स॒त्यम्",
        "meaning": "शाश्वत सत्य"
      },
      {
        "word": "बृ॒हत्",
        "meaning": "विशाल / महान"
      },
      {
        "word": "ऋ॒तम्",
        "meaning": "प्राकृतिक व नैतिक नियम"
      },
      {
        "word": "उ॒ग्रम्",
        "meaning": "तेजस्वी / दृढ़"
      },
      {
        "word": "दी॒क्षा",
        "meaning": "पवित्र व्रत व दीक्षा"
      },
      {
        "word": "तपः॑",
        "meaning": "तपस्या व साधना"
      },
      {
        "word": "ब्रह्म॑",
        "meaning": "ब्रह्म-विद्या / वेद"
      },
      {
        "word": "य॒ज्ञः",
        "meaning": "यज्ञ व निःस्वार्थ कर्म"
      },
      {
        "word": "पृ॒थि॒वीम्",
        "meaning": "पृथ्वी को"
      },
      {
        "word": "धा॒र॒य॒न्ति॒",
        "meaning": "धारण करते हैं"
      },
      {
        "word": "सा",
        "meaning": "वह"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे लिए"
      },
      {
        "word": "भू॒तस्य॑",
        "meaning": "अतीत के"
      },
      {
        "word": "भव्य॑स्य",
        "meaning": "भविष्य के"
      },
      {
        "word": "पत्नी॑",
        "meaning": "स्वामिनी / रक्षिका"
      },
      {
        "word": "उ॒रुम्",
        "meaning": "विशाल / विस्तृत"
      },
      {
        "word": "लो॒कम्",
        "meaning": "संसार / जीवन क्षेत्र"
      },
      {
        "word": "पृ॒थि॒वी",
        "meaning": "मातृभूमि"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे लिए"
      },
      {
        "word": "कृ॒णो॒तु॒",
        "meaning": "बनाए / सिद्ध करे"
      }
    ],
    "shastricContext": "भूमि सूक्त का प्रथम मन्त्र। यह बताता है कि भूगोल केवल मिट्टी या पत्थर नहीं है; अपितु सत्य, ऋत, तप, यज्ञ और ब्रह्म जैसे आध्यात्मिक और नैतिक मूल्यों पर ही राष्ट्र और धरा टिकी रहती है।",
    "audioUrl": null,
    "previousId": "av-11-5-1",
    "nextId": "av-12-1-3",
    "chapterMantraIds": [
      "av-12-1-1",
      "av-12-1-3",
      "av-12-1-12",
      "av-12-1-63"
    ],
    "orderIndex": 7,
    "status": "ACTIVE"
  },
  {
    "id": "av-12-1-3",
    "slug": "av-12-1-3",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-12-bhumi",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (भूमि सूक्त / पृथ्वी सूक्त)",
    "sectionRef": "काण्ड १२, सूक्त १, मन्त्र ३",
    "mantraNumber": "१२.१.३",
    "rishi": "महर्षि अथर्वा",
    "devata": "भूमिः (Mother Earth)",
    "chhanda": "त्रिष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ यस्यां॑ स॒मुद्र उ॒त सिन्धु॒रापो॒ यस्या॒मन्नं॑ कृ॒ष्टयः॑ संब॒भूवुः॑।\nयस्या॑मि॒दं जिन्व॑ति प्रा॒णदेज॒त् सा नो॒ भूमिः॑ पूर्वपे॒ये द॑धातु॥३॥",
    "transliteration": "oṃ yasyāṃ samudra uta sindhur āpo yasyām annaṃ kṛṣṭayaḥ saṃbabhūvuḥ |\nyasyām idaṃ jinvati prāṇad ejat sā no bhūmiḥ pūrvapeye dadhātu || 3 ||",
    "hindiTranslation": "जिस पृथ्वी पर महासागर, नदियाँ और अमृतमय जल-स्रोत विद्यमान हैं; जिस पर अन्न उत्पन्न होता है और परिश्रमी कृषक व जन-समुदाय समृद्ध होते हैं; जिस पर श्वास लेने वाले और गति करने वाले समस्त प्राणी चेतना पाते हैं; वह मातृभूमि हमें जीवन के प्रथम पेय (सर्वोत्तम पोषण व सुख) में प्रतिष्ठित करे।",
    "englishTranslation": "In whom the oceans, the rivers, and the waters abide; in whom food and cultivating peoples have come into being; in whom all that breathes and moves finds vital sustenance—may that Earth establish us in the foremost nourishment!",
    "hinglishTranslation": "Jis Dharti par samudra, nadiyaan aur pavitra jal-srot hain, jahan ann aur parishrami kisan samriddh hote hain, aur jahan sabhi jeev saans lete aur vikas karte hain — wo Dharti Mata hume sarvottam poshan aur anand pradan kare.",
    "padapatha": [
      {
        "word": "यस्या॑म्",
        "meaning": "जिसमें"
      },
      {
        "word": "स॒मु॒द्रः",
        "meaning": "महासागर"
      },
      {
        "word": "उ॒त",
        "meaning": "और"
      },
      {
        "word": "सिन्धुः॑",
        "meaning": "सिंधु आदि नदियाँ"
      },
      {
        "word": "आपः॑",
        "meaning": "समस्त जल-राशियाँ"
      },
      {
        "word": "यस्या॑म्",
        "meaning": "जिसमें"
      },
      {
        "word": "अन्न॑म्",
        "meaning": "अन्न-धान्य"
      },
      {
        "word": "कृ॒ष्टयः॑",
        "meaning": "कृषि करने वाली प्रजाएँ"
      },
      {
        "word": "स॒म्ऽब॒भू॒वुः",
        "meaning": "उत्पन्न हुईं / पुष्ट हुईं"
      },
      {
        "word": "यस्या॑म्",
        "meaning": "जिसमें"
      },
      {
        "word": "इ॒दम्",
        "meaning": "यह"
      },
      {
        "word": "जिन्व॑ति",
        "meaning": "प्राण पाता है / सचेत होता है"
      },
      {
        "word": "प्रा॒णत्",
        "meaning": "श्वास लेता हुआ"
      },
      {
        "word": "एज॑त्",
        "meaning": "गतिशील प्राणी-जगत"
      },
      {
        "word": "सा",
        "meaning": "वह"
      },
      {
        "word": "नः॒",
        "meaning": "हमें"
      },
      {
        "word": "भूमिः॑",
        "meaning": "मातृभूमि"
      },
      {
        "word": "पूर्व॒ऽपे॒ये",
        "meaning": "सर्वप्रथम पेय / जीवन-रस में"
      },
      {
        "word": "द॒धा॒तु॒",
        "meaning": "स्थापित करे"
      }
    ],
    "shastricContext": "जैव-विविधता (Biodiversity) और जल-संरक्षण का प्राचीनतम सूक्त। पृथ्वी समस्त चराचर जगत, वनस्पति, जीव-जन्तुओं और नदियों की समान पोषणकर्त्री है।",
    "audioUrl": null,
    "previousId": "av-12-1-1",
    "nextId": "av-12-1-12",
    "chapterMantraIds": [
      "av-12-1-1",
      "av-12-1-3",
      "av-12-1-12",
      "av-12-1-63"
    ],
    "orderIndex": 8,
    "status": "ACTIVE"
  },
  {
    "id": "av-12-1-63",
    "slug": "av-12-1-63",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-12-bhumi",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (भूमि सूक्त / पृथ्वी सूक्त)",
    "sectionRef": "काण्ड १२, सूक्त १, मन्त्र ६३",
    "mantraNumber": "१२.१.६३",
    "rishi": "महर्षि अथर्वा",
    "devata": "भूमिः (Mother Earth)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ भूमे॑ मात॒र्नि धे॑हि मा भ॒द्रया॑ सु॒प्रति॑ष्ठितम्।\nसं॒वि॒दा॒ना दि॒वा क॑वे॒ श्रियां॑ मा धेहि॒ भूत्या॑म्॥६३॥",
    "transliteration": "oṃ bhūme mātar ni dhehi mā bhadrayā supratiṣṭhitam |\nsaṃvidānā divā kave śriyāṃ mā dhehi bhūtyām || 63 ||",
    "hindiTranslation": "हे माता भूमि! आप मुझ पर कल्याणमयी कृपा करते हुए मुझे अपने ऊपर भलीभाँति सुप्रतिष्ठित (स्थिर व सुरक्षित) कीजिए। हे क्रांतदर्शी ज्ञानमयी धरा! आप द्युलोक के साथ सामंजस्य स्थापित करके मुझे श्री (शोभा/ऐश्वर्य) और भूति (समृद्धि व सामर्थ्य) में स्थापित कीजिए।",
    "englishTranslation": "O Mother Earth, lovingly set me down well-established and firmly supported with thy auspicious blessing! In concord with the shining heavens, O wise and radiant one, set me in glorious majesty and enduring prosperity!",
    "hinglishTranslation": "Hey Mata Bhumi! Mujh par kalyankari kripa karte hue mujhe achhi tarah sthir aur surakshit kijiye. Hey gyanmayi dhara! Swarg ke saath santulan banakar mujhe shree (shobha) aur samriddhi mein sthapit kijiye.",
    "padapatha": [
      {
        "word": "भूमे॑",
        "meaning": "हे भूमि!"
      },
      {
        "word": "मा॒तः॒",
        "meaning": "हे माता!"
      },
      {
        "word": "नि",
        "meaning": "निश्चित रूप से"
      },
      {
        "word": "धे॒हि॒",
        "meaning": "स्थापित कीजिए"
      },
      {
        "word": "मा॒",
        "meaning": "मुझको"
      },
      {
        "word": "भ॒द्रया॑",
        "meaning": "कल्याणमयी दृष्टि/कृपा से"
      },
      {
        "word": "सु॒ऽप्रति॑ष्ठितम्",
        "meaning": "उत्तम प्रकार से स्थिर व प्रतिष्ठित"
      },
      {
        "word": "स॒म्ऽवि॒दा॒ना",
        "meaning": "सामंजस्य स्थापित करती हुई"
      },
      {
        "word": "दि॒वा",
        "meaning": "द्युलोक / आकाश के साथ"
      },
      {
        "word": "क॒वे॒",
        "meaning": "हे ज्ञानमयी क्रांतदर्शिनी!"
      },
      {
        "word": "श्रिया॑म्",
        "meaning": "श्री / दिव्य तेज में"
      },
      {
        "word": "मा॒",
        "meaning": "मुझको"
      },
      {
        "word": "धे॒हि॒",
        "meaning": "प्रतिष्ठित कीजिए"
      },
      {
        "word": "भूत्या॑म्",
        "meaning": "समृद्धि व ऐश्वर्य में"
      }
    ],
    "shastricContext": "भूमि सूक्त का अंतिम उपसंहार मंत्र। यह मंत्र प्रकृति से कृतज्ञतापूर्वक आशीर्वाद मांगते हुए भौतिक समृद्धि (भूति) और आध्यात्मिक शोभा (श्री) दोनों की समन्वित प्रार्थना करता है।",
    "audioUrl": null,
    "previousId": "av-12-1-12",
    "nextId": "av-19-9-1",
    "chapterMantraIds": [
      "av-12-1-1",
      "av-12-1-3",
      "av-12-1-12",
      "av-12-1-63"
    ],
    "orderIndex": 10,
    "status": "ACTIVE"
  },
  {
    "id": "av-19-9-1",
    "slug": "av-19-9-1",
    "vedaId": "atharvaveda",
    "nodeId": "av-kanda-19-shanti",
    "vedaName": "अथर्ववेद (Atharvaveda)",
    "shakha": "शौनक शाखा",
    "textName": "अथर्ववेद संहिता (विश्व शांति सूक्त)",
    "sectionRef": "काण्ड १९, सूक्त ९, मन्त्र १",
    "mantraNumber": "१९.९.१",
    "rishi": "महर्षि अथर्वा / भृगु",
    "devata": "शान्तिः (Universal Peace - Dyau, Prithvi, Antariksha, Apah, Oshadhayah)",
    "chhanda": "अनुष्टुप्",
    "svara": "सस्वर वैदिक पाठ",
    "sanskrit": "ॐ शान्ता॒ द्यौः शान्ता॑ पृथि॒वी शान्त॑मि॒दमु॒र्व१न्तरि॑क्षम्।\nशान्ता॑ उद॒न्वती॒रापः॒ शान्ता नः॑ सन्त्वोष॑धीः॥१॥",
    "transliteration": "oṃ śāntā dyauḥ śāntā pṛthivī śāntam idam urv antarikṣam |\nśāntā udanvatīr āpaḥ śāntā naḥ santv oṣadhīḥ || 1 ||",
    "hindiTranslation": "द्युलोक शांत हो, पृथ्वी शांत हो, यह विशाल अंतरिक्ष शांत हो, महासागरों एवं नदियों का जल शांत और कल्याणकारी हो तथा समस्त औषधियाँ एवं वनस्पतियाँ हमारे लिए शांतिप्रद हों।",
    "englishTranslation": "Peaceful be the heavens, peaceful be the earth, peaceful be this vast atmosphere! Peaceful be the waters flowing in the ocean, and may all healing herbs and plants be tranquil and benevolent unto us!",
    "hinglishTranslation": "Swarglok shant ho, dharti shant ho, vishal antariksh shant ho! Samudra aur nadiyo ka jal shant ho aur samast aushadhiyaan v vanaspatiyaan hamare liye shantiprad hon.",
    "padapatha": [
      {
        "word": "शान्ता॑",
        "meaning": "शांत / उपद्रव-रहित"
      },
      {
        "word": "द्यौः",
        "meaning": "द्युलोक / आकाश"
      },
      {
        "word": "शान्ता॑",
        "meaning": "शांत"
      },
      {
        "word": "पृ॒थि॒वी",
        "meaning": "पृथ्वी"
      },
      {
        "word": "शान्त॑म्",
        "meaning": "शांत"
      },
      {
        "word": "इ॒दम्",
        "meaning": "यह"
      },
      {
        "word": "उ॒रु",
        "meaning": "विस्तृत / विशाल"
      },
      {
        "word": "अ॒न्तरि॑क्षम्",
        "meaning": "अंतरिक्ष"
      },
      {
        "word": "शान्ताः॑",
        "meaning": "शांत"
      },
      {
        "word": "उ॒द॒न्वतीः॑",
        "meaning": "तरंगित / जलमयी"
      },
      {
        "word": "आपः॑",
        "meaning": "जल-राशियाँ"
      },
      {
        "word": "शान्ताः॑",
        "meaning": "शांतिप्रद"
      },
      {
        "word": "नः॒",
        "meaning": "हमारे लिए"
      },
      {
        "word": "स॒न्तु॒",
        "meaning": "हों"
      },
      {
        "word": "ओष॑धीः",
        "meaning": "समस्त औषधियाँ"
      }
    ],
    "shastricContext": "अथर्ववेदीय विश्व शांति सूक्त का प्रथम मंत्र। यह आंतरिक और बाह्य प्रकृति के समस्त घटकों में आधिभौतिक, आधिदैविक और आध्यात्मिक उपद्रवों की शांति हेतु सार्वभौमिक शांति-मंत्र है।",
    "audioUrl": null,
    "previousId": "av-12-1-63",
    "nextId": "av-19-9-14",
    "chapterMantraIds": [
      "av-19-9-1",
      "av-19-9-14"
    ],
    "orderIndex": 11,
    "status": "ACTIVE"
  }
];

export default {
  INITIAL_VEDAS,
  INITIAL_VEDA_NODES,
  INITIAL_VEDA_MANTRAS,
};
