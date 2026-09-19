// =============================================================================
// VEDA HIERARCHY DATA - COMPREHENSIVE MULTI-LEVEL SACRED TAXONOMY
// =============================================================================

// Panoramic Wide Banner Assets (16:9 widescreen, ratio 1.79 - 1.83, 2814x1536 / 1376x768)
import bannerTempleGhat from "../../assets/images/library/banners/banner-temple-ghat.jpg";
import bannerYagyaHero from "../../assets/images/library/banners/banner-yagya-hero.png";
import bannerFireRitual from "../../assets/images/library/banners/banner-fire-ritual.png";
import bannerPanditTeam from "../../assets/images/library/banners/banner-pandit-team.png";
import bannerAltar from "../../assets/images/library/banners/banner-altar.png";
import bannerKashiGhat from "../../assets/images/library/banners/banner-kashi-ghat.png";
import bannerSacredDetails from "../../assets/images/library/banners/banner-sacred-details.png";
import bannerSamagri from "../../assets/images/library/banners/banner-samagri.png";
import bannerSanctum from "../../assets/images/library/banners/banner-sanctum.png";
import bannerRitualSetup from "../../assets/images/library/banners/banner-ritual-setup.png";

// Card-Focused Assets (Scriptures, Systems, Rites)
import templeImg from "../../assets/images/library/cards/icon-temple.png";
import rigvedaCardImg from "../../assets/images/library/cards/card-rigveda.jpg";
import yajurvedaCardImg from "../../assets/images/library/cards/card-yajurveda.jpg";
import samavedaCardImg from "../../assets/images/library/cards/card-samaveda.jpg";
import atharvavedaCardImg from "../../assets/images/library/cards/card-atharvaveda.jpg";
import gitaCardImg from "../../assets/images/library/cards/card-gita.jpg";
import astrologyCardImg from "../../assets/images/library/cards/card-astrology.jpg";
import vastuCardImg from "../../assets/images/library/cards/card-vastu.jpg";
import ramayanaCardImg from "../../assets/images/library/cards/card-ramayana.jpg";
import mahabharataCardImg from "../../assets/images/library/cards/card-mahabharata.jpg";
import puranaCardImg from "../../assets/images/library/cards/card-purana.jpg";
import samskaraCardImg from "../../assets/images/library/cards/card-samskara.jpg";
import pujaCardImg from "../../assets/images/library/cards/card-puja.jpg";
import yagyaFireCardImg from "../../assets/images/library/cards/card-yagya-fire.jpg";

// Sacred Deity Assets
import deityBrahmaCardImg from "../../assets/images/library/deities/deity-brahma.jpg";
import deviSaraswatiCardImg from "../../assets/images/library/deities/deity-saraswati.jpg";
import deviDurgaCardImg from "../../assets/images/library/deities/deity-durga.jpg";
import trimurtiCardImg from "../../assets/images/library/deities/deity-trimurti.jpg";
import deityVishnuCardImg from "../../assets/images/library/deities/deity-vishnu.jpg";
import deityShivaCardImg from "../../assets/images/library/deities/deity-shiva.jpg";
import deityLakshmiCardImg from "../../assets/images/library/deities/deity-lakshmi.jpg";
import pujaGaneshCardImg from "../../assets/images/library/deities/deity-ganesh.jpg";
import pujaNavagrahaCardImg from "../../assets/images/library/deities/deity-navagraha.jpg";

export const VEDA_BANNER_IMAGES = {
  default: bannerTempleGhat,
  vedicKnowledge: bannerPanditTeam,
  veda: bannerPanditTeam,
  rigveda: bannerAltar,
  yajurveda: bannerFireRitual,
  samaveda: bannerKashiGhat,
  atharvaveda: bannerRitualSetup,
  vedanga: bannerSacredDetails,
  shastraDarshana: bannerSacredDetails,
  darshana: bannerSacredDetails,
  upaveda: bannerRitualSetup,
  itihasaPurana: bannerSanctum,
  ramayana: bannerSanctum,
  mahabharata: bannerTempleGhat,
  gita: bannerSanctum,
  purana: bannerKashiGhat,
  dharmaJeevan: bannerSamagri,
  samskara: bannerSamagri,
  pujaAnushthana: bannerYagyaHero,
  puja: bannerAltar,
  yagya: bannerFireRitual,
  stotra: bannerAltar,
};

export const VEDA_CARD_IMAGES = {
  default: rigvedaCardImg,
  rigveda: rigvedaCardImg,
  yajurveda: yajurvedaCardImg,
  samaveda: samavedaCardImg,
  atharvaveda: atharvavedaCardImg,
  gita: gitaCardImg,
  astrology: astrologyCardImg,
  vastu: vastuCardImg,
  ramayana: ramayanaCardImg,
  mahabharata: mahabharataCardImg,
  purana: puranaCardImg,
  samskara: samskaraCardImg,
  puja: pujaCardImg,
  pujaGanesh: pujaGaneshCardImg,
  yagya: yagyaFireCardImg,
  trimurti: trimurtiCardImg,
  "trimurti-brahma": deityBrahmaCardImg,
  "trimurti-vishnu": deityVishnuCardImg,
  "trimurti-shiva": deityShivaCardImg,
  dashavatara: deityVishnuCardImg,
  tridevi: deviDurgaCardImg,
  "tridevi-saraswati": deviSaraswatiCardImg,
  "tridevi-lakshmi": deityLakshmiCardImg,
  "tridevi-durga": deviDurgaCardImg,
  panchayatana: pujaGaneshCardImg,
  vaidika33Deva: pujaNavagrahaCardImg,
  devataAvatara: deityVishnuCardImg,
};

// Backwards compatibility dictionary
export const VEDA_IMAGES = {
  temple: rigvedaCardImg,
  rigveda: rigvedaCardImg,
  yajurveda: yajurvedaCardImg,
  samaveda: samavedaCardImg,
  atharvaveda: atharvavedaCardImg,
  gita: gitaCardImg,
  astrology: astrologyCardImg,
  vastu: vastuCardImg,
  ramayana: ramayanaCardImg,
  mahabharata: mahabharataCardImg,
  purana: puranaCardImg,
  samskara: samskaraCardImg,
  puja: pujaCardImg,
  yagya: yagyaFireCardImg,
};

/**
 * Returns a panoramic, high-resolution 16:9 banner for sections & chapters.
 * Never cuts off heads or sacred features; always distinct from child cards.
 */
export const getNodeBannerImage = (node) => {
  if (!node) return VEDA_BANNER_IMAGES.default;
  if (node.bannerImage) return node.bannerImage;

  const id = (node.id || "").toLowerCase();
  const parentId = (node.parentId || "").toLowerCase();

  if (id.includes("rigveda") || parentId.includes("rigveda")) return VEDA_BANNER_IMAGES.rigveda;
  if (id.includes("yajurveda") || parentId.includes("yajurveda")) return VEDA_BANNER_IMAGES.yajurveda;
  if (id.includes("samaveda") || parentId.includes("samaveda")) return VEDA_BANNER_IMAGES.samaveda;
  if (id.includes("atharva") || parentId.includes("atharva")) return VEDA_BANNER_IMAGES.atharvaveda;
  if (id.includes("vedanga") || id.includes("jyotisha")) return VEDA_BANNER_IMAGES.vedanga;
  if (id.includes("vedic") || id === "veda") return VEDA_BANNER_IMAGES.veda;
  if (id.includes("ramayana") || parentId.includes("ramayana")) return VEDA_BANNER_IMAGES.ramayana;
  if (id.includes("mahabharata") || parentId.includes("mahabharata")) return VEDA_BANNER_IMAGES.mahabharata;
  if (id.includes("purana") || parentId.includes("purana")) return VEDA_BANNER_IMAGES.purana;
  if (id.includes("itihasa")) return VEDA_BANNER_IMAGES.itihasaPurana;
  if (id.includes("darshana") || id.includes("shastra")) return VEDA_BANNER_IMAGES.shastraDarshana;
  if (id.includes("samskara") || id.includes("dharma")) return VEDA_BANNER_IMAGES.dharmaJeevan;
  if (id.includes("yagya") || id.includes("homa")) return VEDA_BANNER_IMAGES.yagya;
  if (id.includes("stotra") || id.includes("mantra")) return VEDA_BANNER_IMAGES.stotra;
  if (id.includes("puja")) return VEDA_BANNER_IMAGES.pujaAnushthana;

  return VEDA_BANNER_IMAGES.default;
};

/**
 * Returns a subject-focused card thumbnail image (deity, text, palm leaf, or fire detail).
 * Accurately traces full ancestor lineage so deep leaves (e.g. Ramayana Sargas) always
 * get authentic, relevant, high-resolution sacred artwork rather than generic fallbacks.
 */
export const getNodeCardImage = (node, child) => {
  // 1. Direct override on child
  if (child && child.cardImage) return child.cardImage;
  if (child && child.image && !child.bannerImage) return child.image;

  // 2. Direct override on parent node
  if (node && node.cardImage) return node.cardImage;
  if (node && node.image && !node.bannerImage) return node.image;

  // 3. Trace ancestor path if available
  const targetId = (child && child.id) || (node && node.id) || "";
  let ancestorNodes = [];
  if (typeof getNodePath === "function" && targetId) {
    ancestorNodes = getNodePath(targetId);
  }
  if ((!ancestorNodes || ancestorNodes.length === 0) && typeof getNodePath === "function" && node && node.id) {
    ancestorNodes = getNodePath(node.id);
  }

  // Check if any ancestor explicitly provides a cardImage
  for (let i = ancestorNodes.length - 1; i >= 0; i--) {
    const anc = ancestorNodes[i];
    if (anc && anc.cardImage) return anc.cardImage;
    if (anc && anc.image && !anc.bannerImage) return anc.image;
  }

  // Collect all lineage IDs and titles for smart pattern matching
  const lineageTokens = [
    targetId,
    child && child.parentId,
    node && node.id,
    node && node.parentId,
    ...ancestorNodes.map((a) => a.id || ""),
    ...ancestorNodes.map((a) => a.title?.en || ""),
    child && child.title?.en,
    child && child.title?.hi,
    node && node.title?.en,
    node && node.title?.hi,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 4. Lineage Pattern Matching (specific to broad)
  if (
    lineageTokens.includes("ramayana") ||
    lineageTokens.includes("ak-") ||
    lineageTokens.includes("bk-") ||
    lineageTokens.includes("sk-") ||
    lineageTokens.includes("ayodhya") ||
    lineageTokens.includes("sarga") ||
    lineageTokens.includes("valmiki") ||
    lineageTokens.includes("rama")
  ) {
    return VEDA_CARD_IMAGES.ramayana;
  }

  if (
    lineageTokens.includes("mahabharata") ||
    lineageTokens.includes("mb-") ||
    lineageTokens.includes("gita") ||
    lineageTokens.includes("bhagavad") ||
    lineageTokens.includes("bhishma") ||
    lineageTokens.includes("shanti") ||
    lineageTokens.includes("krishna")
  ) {
    return VEDA_CARD_IMAGES.mahabharata;
  }

  if (
    lineageTokens.includes("rigveda") ||
    lineageTokens.includes("sukta") ||
    lineageTokens.includes("mandala")
  ) {
    return VEDA_CARD_IMAGES.rigveda;
  }

  if (
    lineageTokens.includes("yajurveda") ||
    lineageTokens.includes("shukla") ||
    lineageTokens.includes("krishna-yajur")
  ) {
    return VEDA_CARD_IMAGES.yajurveda;
  }

  if (
    lineageTokens.includes("samaveda") ||
    lineageTokens.includes("gana") ||
    lineageTokens.includes("chandogya")
  ) {
    return VEDA_CARD_IMAGES.samaveda;
  }

  if (lineageTokens.includes("atharva")) {
    return VEDA_CARD_IMAGES.atharvaveda;
  }

  if (
    lineageTokens.includes("upanishad") ||
    lineageTokens.includes("vedanta") ||
    lineageTokens.includes("darshana") ||
    lineageTokens.includes("shastra") ||
    lineageTokens.includes("sankhya") ||
    lineageTokens.includes("yoga") ||
    lineageTokens.includes("nyaya") ||
    lineageTokens.includes("vaisheshika") ||
    lineageTokens.includes("mimamsa")
  ) {
    return VEDA_CARD_IMAGES.gita;
  }

  if (
    lineageTokens.includes("jyotisha") ||
    lineageTokens.includes("vedanga") ||
    lineageTokens.includes("astrology")
  ) {
    return VEDA_CARD_IMAGES.astrology;
  }

  if (lineageTokens.includes("vastu")) {
    return VEDA_CARD_IMAGES.vastu;
  }

  if (lineageTokens.includes("purana")) {
    return VEDA_CARD_IMAGES.purana;
  }

  if (
    lineageTokens.includes("samskara") ||
    lineageTokens.includes("dharma") ||
    lineageTokens.includes("vivaha") ||
    lineageTokens.includes("ashrama")
  ) {
    return VEDA_CARD_IMAGES.samskara;
  }

  if (lineageTokens.includes("ganesh")) {
    return VEDA_CARD_IMAGES.pujaGanesh;
  }

  if (
    lineageTokens.includes("yagya") ||
    lineageTokens.includes("homa") ||
    lineageTokens.includes("havan")
  ) {
    return VEDA_CARD_IMAGES.yagya;
  }

  if (
    lineageTokens.includes("devata-avatara") ||
    lineageTokens.includes("dashavatara") ||
    lineageTokens.includes("avatara")
  ) {
    return VEDA_CARD_IMAGES.dashavatara;
  }

  if (lineageTokens.includes("brahma")) {
    return VEDA_CARD_IMAGES["trimurti-brahma"];
  }

  if (lineageTokens.includes("saraswati")) {
    return VEDA_CARD_IMAGES["tridevi-saraswati"];
  }

  if (
    lineageTokens.includes("durga") ||
    lineageTokens.includes("parvati") ||
    lineageTokens.includes("shakti")
  ) {
    return VEDA_CARD_IMAGES["tridevi-durga"];
  }

  if (lineageTokens.includes("lakshmi")) {
    return VEDA_CARD_IMAGES["tridevi-lakshmi"];
  }

  if (
    lineageTokens.includes("shiva") ||
    lineageTokens.includes("mahesh") ||
    lineageTokens.includes("rudra")
  ) {
    return VEDA_CARD_IMAGES["trimurti-shiva"];
  }

  if (
    lineageTokens.includes("vishnu") ||
    lineageTokens.includes("narayana")
  ) {
    return VEDA_CARD_IMAGES["trimurti-vishnu"];
  }

  if (lineageTokens.includes("trimurti")) {
    return VEDA_CARD_IMAGES.trimurti;
  }

  if (lineageTokens.includes("tridevi")) {
    return VEDA_CARD_IMAGES.tridevi;
  }

  if (
    lineageTokens.includes("panchayatana") ||
    lineageTokens.includes("ganesh") ||
    lineageTokens.includes("surya")
  ) {
    return VEDA_CARD_IMAGES.panchayatana;
  }

  if (
    lineageTokens.includes("33-deva") ||
    lineageTokens.includes("vasu") ||
    lineageTokens.includes("aditya")
  ) {
    return VEDA_CARD_IMAGES.vaidika33Deva;
  }

  return VEDA_CARD_IMAGES.default;
};

// =============================================================================
// MAIN 5 KNOWLEDGE AREAS HIERARCHY TREE
// =============================================================================

export const VEDA_HIERARCHY_TREE = [
  // ===========================================================================
  // 01. VEDIC KNOWLEDGE
  // ===========================================================================
  {
    id: "vedic-knowledge",
    number: "01",
    type: "category",
    levelLabel: { en: "Knowledge Area", hi: "ज्ञान क्षेत्र" },
    title: { en: "01. Vedic Knowledge", hi: "०१. वैदिक ज्ञान" },
    shortTitle: { en: "Vedic Knowledge", hi: "वैदिक ज्ञान" },
    sanskrit: "वैदिक वाङ्मय",
    tagline: {
      en: "The Primordial Shruti, Vedangas, Brahmanas, Aranyakas & Upanishads",
      hi: "सनातन श्रुति, वेदांग, ब्राह्मण, आरण्यक एवं उपनिषद",
    },
    cardImage: rigvedaCardImg,
    bannerImage: bannerPanditTeam,
    image: rigvedaCardImg,
    badge: "Primordial Shruti",
    desc: {
      en: "The eternal, authorless (Apaurusheya) cosmic revelations heard by ancient Vedic Rishis in deep states of meditation, structured into four Samhitas and six Vedanga limbs.",
      hi: "ऋषियों द्वारा अंतर्दृष्टि में साक्षात्कृत अपौरुषेय एवं शाश्वत वैदिक श्रुति, जो चार संहिताओं, छह वेदांगों और उपनिषदों में विभाजित है।",
    },
    children: [
      // -----------------------------------------------------------------------
      // Veda
      // -----------------------------------------------------------------------
      {
        id: "veda",
        parentId: "vedic-knowledge",
        type: "discipline",
        levelLabel: { en: "Tradition", hi: "संहिता परंपरा" },
        title: { en: "The Four Primordial Vedas", hi: "चार मूल वेद" },
        shortTitle: { en: "Veda", hi: "वेद" },
        sanskrit: "चतुर्वेद संहिता",
        tagline: {
          en: "Rigveda, Yajurveda, Samaveda and Atharvaveda",
          hi: "ऋग्वेद, यजुर्वेद, सामवेद एवं अथर्ववेद",
        },
        cardImage: rigvedaCardImg,
        bannerImage: bannerPanditTeam,
        image: rigvedaCardImg,
        badge: "4 Samhitas",
        desc: {
          en: "The four primary repositories of Vedic hymns, rituals, melodies, and metaphysical wisdom.",
          hi: "वैदिक मंत्रों, यज्ञ-विधानों, देव-गायन एवं आध्यात्मिक ज्ञान के चार मूल स्तंभ।",
        },
        children: [
          // Rigveda
          {
            id: "rigveda",
            parentId: "veda",
            type: "grantha",
            levelLabel: { en: "Veda", hi: "वेद" },
            title: { en: "Rigveda Samhita", hi: "ऋग्वेद संहिता" },
            shortTitle: { en: "Rigveda", hi: "ऋग्वेद" },
            sanskrit: "ऋग्वेद संहिता",
            tagline: {
              en: "10 Mandalas · 1,028 Suktas · 10,552 Mantras",
              hi: "१० मण्डल · १,०२८ सूक्त · १०,५५२ ऋचाएँ",
            },
            cardImage: rigvedaCardImg,
            bannerImage: bannerAltar,
            image: rigvedaCardImg,
            badge: "10 Mandalas",
            desc: {
              en: "The oldest scripture in the Indo-European world, comprising praise hymns to cosmic divinities including Agni, Indra, Soma, and Varuna.",
              hi: "सृष्टि का सबसे प्राचीन ग्रंथ, जिसमें अग्नि, इन्द्र, सोम और वरुण आदि देवताओं की स्तुति में रचित १० मण्डल समाहित हैं।",
            },
            childLevelName: { en: "Mandala", hi: "मण्डल" },
            children: [
              {
                id: "rigveda-mandala-1",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 1 (191 Suktas)", hi: "प्रथम मण्डल (१९१ सूक्त)" },
                shortTitle: { en: "Mandala 1", hi: "मण्डल १" },
                sanskrit: "प्रथमं मण्डलम्",
                tagline: {
                  en: "Madhuchhandas, Medhatithi, Shunahshepa & Dirghatamas Rishis",
                  hi: "ऋषि मधुच्छन्दा, मेधातिथि, शुनःशेप एवं दीर्घतमा",
                },
                badge: "191 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m1-s1",
                    parentId: "rigveda-mandala-1",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 1: Agni Sukta (9 Mantras)", hi: "सूक्त १: अग्नि सूक्त (९ मंत्र)" },
                    shortTitle: { en: "Sukta 1", hi: "सूक्त १" },
                    sanskrit: "अग्नि सूक्तम् (१.१)",
                    tagline: {
                      en: "Rishi: Madhuchhandas Vaishvamitra · Devata: Agni · Chandas: Gayatri",
                      hi: "ऋषि: मधुच्छन्दा वैश्वामित्र · देवता: अग्नि · छन्द: गायत्री",
                    },
                    badge: "9 Mantras",
                    childLevelName: { en: "Mantra", hi: "मंत्र" },
                    children: [
                      {
                        id: "rigveda-1-1-1",
                        parentId: "rigveda-m1-s1",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 1.1.1 — Agnimile Purohitam", hi: "ऋग्वेद १.१.१ — अग्निमीळे पुरोहितं" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद १.१.१",
                        content: {
                          sanskrit: "ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्।\nहोता॑रं रत्न॒धात॑मम्॥",
                          transliteration: "oṃ agnimīḻe purohitaṃ yajñasya devamṛtvijam |\nhotāraṃ ratnadhātamam ||",
                          padapatha: "अ॒ग्निम्। ई॒ळे॒। पु॒रःऽहि॑तम्। य॒ज्ञस्य॑। दे॒वम्। ऋ॒त्विज॑म्। होता॑रम्। र॒त्न॒ऽधात॑मम्॥",
                          meaningHi: "मैं यज्ञ के पुरोहित, दिव्य प्रकाशयुक्त देव, ऋतु-ऋतु में यज्ञ कराने वाले ऋत्विक, देवताओं का आह्वान करने वाले होता तथा अपार रत्नों व ऐश्वर्य को धारण करने वाले अग्निदेव की स्तुति करता हूँ।",
                          meaningEn: "I glorify Agni, the high priest of the sacrifice, the divine minister who officiates at the sacred rite, the invoker (Hotri) of celestial energies, and the supreme bestower of spiritual and material treasures.",
                          metadata: {
                            mandala: "1",
                            sukta: "1",
                            verse: "1",
                            rishi: "Madhuchhandas Vaishvamitra (मधुच्छन्दा वैश्वामित्र)",
                            devata: "Agni (अग्निः)",
                            chandas: "Gayatri (गायत्री - २४ अक्षर)",
                            viniyoga: "Yajna Agni Sthapana & Daily Chanting",
                            source: "Rigveda Samhita, Shakala Shakha",
                          },
                          significance: "This is the very first mantra of the Rigveda and the foundation of all Vedic knowledge, revering the cosmic fire as both divine inner consciousness and outer sacrificial flame.",
                        },
                      },
                      {
                        id: "rigveda-1-1-2",
                        parentId: "rigveda-m1-s1",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 1.1.2 — Agnih Purvebhih", hi: "ऋग्वेद १.१.२ — अग्निः पूर्वेभिः" },
                        shortTitle: { en: "Mantra 2", hi: "मंत्र २" },
                        sanskrit: "ऋग्वेद १.१.२",
                        content: {
                          sanskrit: "अ॒ग्निः पूर्वे॑भि॒रृषि॑भि॒रीड्यो॒ नूत॑नैरु॒त।\nस दे॒वाँ एह व॑क्षति॥",
                          transliteration: "agniḥ pūrvebhirṛṣibhirīḍyo nūtanairuta |\nsa devāom eha vakṣati ||",
                          meaningHi: "अग्निदेव प्राचीन ऋषियों (भृगु, अंगिरा आदि) द्वारा स्तुत्य रहे हैं और वर्तमान नवयुग के ऋषियों द्वारा भी वन्दनीय हैं। वे ही सभी दिव्य शक्तियों को इस यज्ञभूमि में ले आते हैं।",
                          meaningEn: "Agni is worthy to be praised by ancient seers and by modern seekers alike. May he bring hither the shining gods to this sacred gathering.",
                          metadata: {
                            mandala: "1",
                            sukta: "1",
                            verse: "2",
                            rishi: "Madhuchhandas Vaishvamitra",
                            devata: "Agni",
                            chandas: "Gayatri",
                            source: "Rigveda Samhita 1.1.2",
                          },
                        },
                      },
                      {
                        id: "rigveda-1-1-3",
                        parentId: "rigveda-m1-s1",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 1.1.3 — Agnina Rayimasnavat", hi: "ऋग्वेद १.१.३ — अग्निना रयिमश्नवत्" },
                        shortTitle: { en: "Mantra 3", hi: "मंत्र ३" },
                        sanskrit: "ऋग्वेद १.१.३",
                        content: {
                          sanskrit: "अ॒ग्निना॑ र॒यिम॑श्नव॒त्पोष॑मे॒व दि॒वेदि॑वे।\nय॒शसं॑ वी॒रव॑त्तमम्॥",
                          transliteration: "agninā rayimaśnavatpoṣameva divedive |\nyaśasaṃ vīravattamam ||",
                          meaningHi: "अग्निदेव के अनुग्रह से साधक प्रतिदिन पुष्टिदायक धन, यश और वीर संतानों से युक्त उत्तम ऐश्वर्य प्राप्त करता है।",
                          meaningEn: "Through Agni, the worshipper obtains wealth that increases day by day, glorious and rich in heroic offspring.",
                          metadata: {
                            mandala: "1",
                            sukta: "1",
                            verse: "3",
                            rishi: "Madhuchhandas Vaishvamitra",
                            devata: "Agni",
                            chandas: "Gayatri",
                            source: "Rigveda Samhita 1.1.3",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "rigveda-m1-s89",
                    parentId: "rigveda-mandala-1",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 89: Visvedevah Shanti Sukta", hi: "सूक्त ८९: विश्वेदेवाः शान्ति सूक्त" },
                    shortTitle: { en: "Sukta 89", hi: "सूक्त ८९" },
                    sanskrit: "विश्वेदेवाः सूक्तम् (१.८९)",
                    badge: "10 Mantras",
                    childLevelName: { en: "Mantra", hi: "मंत्र" },
                    children: [
                      {
                        id: "rigveda-1-89-1",
                        parentId: "rigveda-m1-s89",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 1.89.1 — A No Bhadrah Kratavo", hi: "ऋग्वेद १.८९.१ — आ नो भद्राः क्रतवो" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद १.८९.१",
                        content: {
                          sanskrit: "ॐ आ नो॑ भ॒द्राः क्रत॑वो यन्तु वि॒श्वतोऽद॑ब्धासो॒ अप॑रीतास उद्भि॑दः।\nदे॒वा नो॒ यथा॒ सद॒मिद् वृ॒धे अस॒न्नप्रायुवो रक्षि॒तारो॑ दि॒वेदि॑वे॥",
                          transliteration: "oṃ ā no bhadrāḥ kratavo yantu viśvato'dabdhāso aparītāsa udbhidaḥ |\ndevā no yathā sadamid vṛdhe asannaprāyuvo rakṣitāro divedive ||",
                          meaningHi: "हमारे पास सभी दिशाओं से कल्याणकारी, बाधा-रहित, स्वतंत्र और नवोन्मेषी विचार आएँ। ज्ञान के प्रकाशक देवगण हमारी निरंतर समृद्धि के लिए सहायक बनें और दिन-प्रतिदिन हमारी रक्षा करें।",
                          meaningEn: "May noble thoughts come to us from every side, unhindered, undefeated, and bursting through all barriers. May the divine forces always be with us for our advancement, vigilant guardians day by day.",
                          metadata: {
                            mandala: "1",
                            sukta: "89",
                            verse: "1",
                            rishi: "Gotama Rahugana (गौतम राहूगण)",
                            devata: "Visvedevah (विश्वेदेवाः)",
                            chandas: "Jagati (जगती - ४८ अक्षर)",
                            source: "Rigveda Samhita 1.89.1",
                          },
                          significance: "The supreme universal prayer for open-mindedness, global harmony, and receptive spiritual intellect.",
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-2",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 2 (43 Suktas - Gritsamada Family)", hi: "द्वितीय मण्डल (४३ सूक्त - गृत्समद ऋषि परंपरा)" },
                shortTitle: { en: "Mandala 2", hi: "मण्डल २" },
                sanskrit: "द्वितीयं मण्डलम् — गृत्समद",
                tagline: { en: "Gritsamada Rishi Family · Indra Sukta 2.12", hi: "गृत्समद ऋषि परंपरा · प्रसिद्ध इन्द्र सूक्त" },
                badge: "43 Suktas",
                children: [
                  {
                    id: "rigveda-m2-s12",
                    parentId: "rigveda-mandala-2",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 12: Indra Sukta (15 Mantras)", hi: "सूक्त १२: प्रसिद्ध इन्द्र सूक्त (१५ मंत्र)" },
                    shortTitle: { en: "Indra Sukta", hi: "इन्द्र सूक्त" },
                    sanskrit: "इन्द्र सूक्तम् (२.१२)",
                    badge: "15 Mantras",
                    children: [
                      {
                        id: "rigveda-2-12-1",
                        parentId: "rigveda-m2-s12",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 2.12.1 — Yo Jata Eva Prathamo", hi: "ऋग्वेद २.१२.१ — यो जात एव प्रथमो" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद २.१२.१",
                        content: {
                          sanskrit: "ॐ यो जा॒त ए॒व प्र॑थ॒मो म॑न॒स्वाँ दे॒वो दे॒वान्क्रतु॑ना प॒र्यभू॑षत्।\nयस्य॒ शुष्मा॒द्रोद॑सी अभ्य॑सेतां नृ॒म्णस्य॑ म॒ह्ना स ज॑नास॒ इन्द्रः॑॥",
                          transliteration: "oṃ yo jāta eva prathamo manasvān devo devānkratunā paryabhūṣat |\nyasya śuṣmādrodasī abhyasetāṃ nṛmṇasya mahnā sa janāsa indraḥ ||",
                          meaningHi: "जो जन्म लेते ही समस्त देवों में अग्रणी, प्रखर मेधावी और अपने संकल्प-बल से अन्य सभी देवों का रक्षक बना; जिसके पराक्रम के भय से द्युलोक और पृथ्वी भी कंपायमान हो उठते हैं—हे मनुष्यों! वही इन्द्र है।",
                          meaningEn: "He who as soon as born became the foremost of the gods, luminous in mind, who protected all deities by his cosmic power; before whose fierce might heaven and earth tremble in awe — He, O mortals, is Indra!",
                          metadata: {
                            mandala: "2",
                            sukta: "12",
                            verse: "1",
                            rishi: "Gritsamada Shaunaka (गृत्समद शौनक)",
                            devata: "Indra (इन्द्रः)",
                            chandas: "Trishtubh (त्रिष्टुप्)",
                            source: "Rigveda Samhita 2.12.1",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "rigveda-m2-s33",
                    parentId: "rigveda-mandala-2",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 33: Rudra Sukta (15 Mantras)", hi: "सूक्त ३३: रुद्र सूक्त (१५ मंत्र)" },
                    shortTitle: { en: "Rudra Sukta", hi: "रुद्र सूक्त" },
                    sanskrit: "रुद्र सूक्तम् (२.३३)",
                    badge: "15 Mantras",
                    children: [
                      {
                        id: "rigveda-2-33-1",
                        parentId: "rigveda-m2-s33",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 2.33.1 — Aa Te Pitarmarutam", hi: "ऋग्वेद २.३३.१ — आ ते पितर्मरुतां" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद २.३३.१",
                        content: {
                          sanskrit: "आ ते॑ पितर्मरुतां सु॒म्नमे॑तु॒ मा नः॒ सूर्य॑स्य सं॒दृशो॑ युयोथाः।\nअ॒भि नो॑ वी॒रो अर्व॑ति क्षमेत॒ प्र जा॑येमहि रुद्र प्र॒जाभिः॑॥",
                          transliteration: "ā te pitarmarutāṃ sumnametu mā naḥ sūryasya saṃdṛśo yuyothāḥ |\nabhi no vīro arvati kṣameta pra jāyemahi rudra prajābhiḥ ||",
                          meaningHi: "हे मरुद्गणों के पिता भगवान रुद्र! आपकी सुखदायिनी कृपा हम तक पहुँचे। हमें सूर्य के दर्शन से कभी वंचित न करें। हमारे वीर समृद्ध हों और हम संतानों से संपन्न हों।",
                          meaningEn: "May your benevolence reach us, O Father of the Maruts! Sever us not from the radiant sunlight. May our heroes prosper on steeds, and may we flourish with generations of progeny, O Rudra!",
                          metadata: {
                            mandala: "2",
                            sukta: "33",
                            verse: "1",
                            rishi: "Gritsamada Shaunaka",
                            devata: "Rudra (रुद्रः)",
                            chandas: "Trishtubh",
                            source: "Rigveda Samhita 2.33.1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-3",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 3 (62 Suktas - Contains Gayatri Mantra)", hi: "तृतीय मण्डल (६२ सूक्त - गायत्री मंत्र)" },
                shortTitle: { en: "Mandala 3", hi: "मण्डल ३" },
                sanskrit: "तृतीयं मण्डलम् — विश्वामित्र",
                tagline: { en: "Vishvamitra Family · Gayatri Mantra 3.62.10", hi: "विश्वामित्र ऋषि परंपरा" },
                badge: "62 Suktas",
                children: [
                  {
                    id: "rigveda-m3-s62",
                    parentId: "rigveda-mandala-3",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 62: Savitr & Mitra-Varuna (Gayatri Mantra)", hi: "सूक्त ६२: सवितृ सूक्त (गायत्री मंत्र)" },
                    shortTitle: { en: "Sukta 62", hi: "सूक्त ६२" },
                    sanskrit: "सवितृ सूक्तम् (३.६२)",
                    badge: "18 Mantras",
                    children: [
                      {
                        id: "rigveda-3-62-10",
                        parentId: "rigveda-m3-s62",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 3.62.10 — Maha Gayatri Mantra", hi: "ऋग्वेद ३.६२.१० — महा गायत्री मंत्र" },
                        shortTitle: { en: "Gayatri Mantra", hi: "गायत्री मंत्र" },
                        sanskrit: "ऋग्वेद ३.६२.१०",
                        content: {
                          sanskrit: "ॐ तत्स॑वि॒तुर्वरे॑ण्यं॒ भर्गो॑ दे॒वस्य॑ धीमहि।\nधियो॒ यो नः॑ प्रचो॒दया॑त्॥",
                          transliteration: "oṃ tatsaviturvareṇyaṃ bhargo devasya dhīmahi |\ndhiyo yo naḥ pracodayāt ||",
                          meaningHi: "हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा सविता के वरण करने योग्य तेज का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।",
                          meaningEn: "We meditate upon the supreme, adorable solar splendor of the divine creator (Savitr). May that radiant consciousness inspire, awaken, and illuminate our inner intellect.",
                          metadata: {
                            mandala: "3",
                            sukta: "62",
                            verse: "10",
                            rishi: "Brahmarshi Vishvamitra (महर्षि विश्वामित्र)",
                            devata: "Savitr (सविता - प्रकाशक सूर्यदेव)",
                            chandas: "Gayatri (गायत्री)",
                            viniyoga: "Sandhyavandanam, Gayatri Japa & Brahmavidya",
                            source: "Rigveda 3.62.10 / Yajurveda 3.35 / Samaveda 1462",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-4",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 4 (58 Suktas - Vamadeva Gautama)", hi: "चतुर्थ मण्डल (५८ सूक्त - वामदेव गौतम)" },
                shortTitle: { en: "Mandala 4", hi: "मण्डल ४" },
                sanskrit: "चतुर्थं मण्डलम् — वामदेव",
                tagline: { en: "Vamadeva Gautama Family · Inner Awakening & Agni", hi: "वामदेव गौतम ऋषि परिवार · आत्मज्ञान एवं अग्नि स्तुति" },
                badge: "58 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m4-s26",
                    parentId: "rigveda-mandala-4",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 26: Atmavidya (Self-Realization)", hi: "सूक्त २६: आत्मविद्या सूक्त" },
                    shortTitle: { en: "Sukta 26", hi: "सूक्त २६" },
                    sanskrit: "आत्मविद्या सूक्तम् (४.२६)",
                    badge: "7 Mantras",
                    children: [
                      {
                        id: "rigveda-4-26-1",
                        parentId: "rigveda-m4-s26",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 4.26.1 — Aham Manurabhavam Suryashcha", hi: "ऋग्वेद ४.२६.१ — अहम् मनुरभवं सूर्यश्च" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद ४.२६.१",
                        content: {
                          sanskrit: "अ॒हं म॑नुरभ॒वं सूर्य॑श्चा॒हं क॒क्षीवाँ॒ ऋषिर॑स्मि॒ विप्रः॑।\nअ॒हं कुत्सं॑मा॒र्जुने॒यं न्ये॑ञ्जे॒ऽहं क॒विर्उ॒शना॑ पश्यता मा॥",
                          transliteration: "ahaṃ manurabhavaṃ sūryaścāhaṃ kakṣīvāom ṛṣirasmi vipraḥ |\nahaṃ kutsaṃmārjuneyaṃ nyeñje'haṃ kaviruśanā paśyatā mā ||",
                          meaningHi: "वामदेव ऋषि समाधि अवस्था में आत्मा की सर्वव्यापकता का साक्षात्कार करते हुए उद्घोष करते हैं: 'मैं ही मनु हुआ, मैं ही सूर्य हुआ, मैं ही ज्ञानी कक्षीवान् ऋषि हूँ। मुझ विश्वात्मा को देखो।'",
                          meaningEn: "Sage Vamadeva, experiencing non-dual divine cosmic consciousness, declares: 'I was Manu, and I was the Sun; I am the enlightened sage Kakshivan. Behold me as the all-pervading divine Self.'",
                          metadata: {
                            mandala: "4",
                            sukta: "26",
                            verse: "1",
                            rishi: "Vamadeva Gautama (ऋषि वामदेव गौतम)",
                            devata: "Paramatma / Parabrahman (परमात्मा)",
                            chandas: "Trishtubh (त्रिष्टुप्)",
                            source: "Rigveda 4.26.1 / Brihadaranyaka Upanishad 1.4.10",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-5",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 5 (87 Suktas - Atri Family)", hi: "पञ्चम मण्डल (८७ सूक्त - अत्रि परिवार)" },
                shortTitle: { en: "Mandala 5", hi: "मण्डल ५" },
                sanskrit: "पञ्चमं मण्डलम् — अत्रि",
                tagline: { en: "Atri Rishi Family · Dedicated to Agni, Maruts & Mitra-Varuna", hi: "अत्रि ऋषि परिवार · अग्नि, मरुद्गण एवं मित्र-वरुण स्तुति" },
                badge: "87 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m5-s1",
                    parentId: "rigveda-mandala-5",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 1: Awakening of the Cosmic Fire", hi: "सूक्त १: अग्नि जागरण सूक्त" },
                    shortTitle: { en: "Sukta 1", hi: "सूक्त १" },
                    sanskrit: "अग्नि सूक्तम् (५.१)",
                    badge: "12 Mantras",
                    children: [
                      {
                        id: "rigveda-5-1-1",
                        parentId: "rigveda-m5-s1",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 5.1.1 — Abodhyagnih Samidha Jananam", hi: "ऋग्वेद ५.१.१ — अबोध्यग्निः समिधा जनानाम्" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद ५.१.१",
                        content: {
                          sanskrit: "अबो॑ध्य॒ग्निः स॒मिधा॒ जना॑नां॒ प्रति॑ धे॒नुमि॑वाय॒तीमु॒षास॑म्।\nय॒ह्वा इ॑व॒ प्र व॒यामुज्जि॑हानाः॒ प्रभानवः॑ सिस्रते॒ नाक॒मच्छ॑॥",
                          transliteration: "abodhyagniḥ samidhā janānāṃ prati dhenumivāyatīmuṣāsam |\nyahvā iva pra vayāmujjihānāḥ prabhānavaḥ sisrate nākamaccha ||",
                          meaningHi: "समिधाओं द्वारा प्रज्वलित होकर अग्निदेव जागृत हुए हैं, जैसे प्रभात में गौएँ अपने बछड़ों के पास आती हैं। उनकी ज्योतिर्मयी ज्वालाएँ आकाश की ऊँचाइयों की ओर प्रसरित हो रही हैं।",
                          meaningEn: "Agni is awakened by the sacred kindling sticks of men, welcoming the dawn like lowing mother kine. His radiant flames rise upwards towards the heights of heaven.",
                          metadata: {
                            mandala: "5",
                            sukta: "1",
                            verse: "1",
                            rishi: "Budha & Gavishtira Atreya (ऋषि बुध एवं गविष्ठिर आत्रेय)",
                            devata: "Agni (अग्निदेव)",
                            chandas: "Trishtubh (त्रिष्टुप्)",
                            source: "Rigveda 5.1.1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-6",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 6 (75 Suktas - Bharadvaja Family)", hi: "षष्ठ मण्डल (७५ सूक्त - भरद्वाज परिवार)" },
                shortTitle: { en: "Mandala 6", hi: "मण्डल ६" },
                sanskrit: "षष्ठं मण्डलम् — भरद्वाज",
                tagline: { en: "Bharadvaja Family · Indra, Agni & Brihaspati", hi: "महर्षि भरद्वाज परिवार · इन्द्र, अग्नि एवं देवगुरु बृहस्पति स्तुति" },
                badge: "75 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m6-s9",
                    parentId: "rigveda-mandala-6",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 9: Agni Vaishvanara (Cosmic Light)", hi: "सूक्त ९: वैश्वानर अग्नि सूक्त" },
                    shortTitle: { en: "Sukta 9", hi: "सूक्त ९" },
                    sanskrit: "वैश्वानर सूक्तम् (६.९)",
                    badge: "7 Mantras",
                    children: [
                      {
                        id: "rigveda-6-9-6",
                        parentId: "rigveda-m6-s9",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 6.9.6 — Vi Me Jyotirhridaya Ahitam", hi: "ऋग्वेद ६.९.६ — वि मे ज्योतिर्हृदय आहितम्" },
                        shortTitle: { en: "Mantra 6", hi: "मंत्र ६" },
                        sanskrit: "ऋग्वेद ६.९.६",
                        content: {
                          sanskrit: "वि मे॑ पु॒रू त॑न्वते॒ वायो॑ अ॒स्मिन्वि मे॒ कर्णा॑ पतयतो॒ वि चक्षुः॑।\nवि मे॒ ज्योति॒र्हृद॑य॒ आहि॑तं॒ यद्वि॑ मे॒ मन॑श्चरति दू॒रआ॑धीः॥",
                          transliteration: "vi me purū tanvate vāyo asminvi me karṇā patayato vi cakṣuḥ |\nvi me jyotirhṛdaya āhitaṃ yadvi me manaścarati dūra-ādhīḥ ||",
                          meaningHi: "मेरे कान उस दिव्य वाणी को सुनने के लिए खुलते हैं, मेरे नेत्र दिव्य दृष्टि पाते हैं, मेरे हृदय में वह परम ज्योति प्रतिष्ठित है और मेरा मन दूर-दूर तक चिंतन करता हुआ परमात्मा का अनुसंधान करता है।",
                          meaningEn: "Mine ears unclose to hear, mine eye to see; this inner celestial light within my heart shines forth. My mind wanders far with awakened intuition searching the Supreme.",
                          metadata: {
                            mandala: "6",
                            sukta: "9",
                            verse: "6",
                            rishi: "Bharadvaja Barhaspatya (महर्षि भरद्वाज बार्हस्पत्य)",
                            devata: "Agni Vaishvanara (अग्नि वैश्वानर)",
                            chandas: "Trishtubh (त्रिष्टुप्)",
                            source: "Rigveda 6.9.6",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-7",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 7 (104 Suktas - Vasishtha & Maha Mrityunjaya)", hi: "सप्तम मण्डल (१०४ सूक्त - वसिष्ठ एवं महामृत्युंजय)" },
                shortTitle: { en: "Mandala 7", hi: "मण्डल ७" },
                sanskrit: "सप्तमं मण्डलम् — वसिष्ठ",
                tagline: { en: "Vasishtha Maitravaruni Lineage · Maha Mrityunjaya Mantra 7.59.12", hi: "महर्षि वसिष्ठ परंपरा · प्रसिद्ध महामृत्युंजय मंत्र" },
                badge: "104 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m7-s59",
                    parentId: "rigveda-mandala-7",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 59: Rudra & Maruts (Maha Mrityunjaya)", hi: "सूक्त ५९: रुद्र एवं मरुत् (महामृत्युंजय)" },
                    shortTitle: { en: "Sukta 59", hi: "सूक्त ५९" },
                    sanskrit: "महामृत्युञ्जय सूक्तम् (७.५९)",
                    badge: "12 Mantras",
                    children: [
                      {
                        id: "rigveda-7-59-12",
                        parentId: "rigveda-m7-s59",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 7.59.12 — Maha Mrityunjaya Mantra", hi: "ऋग्वेद ७.५९.१२ — महामृत्युंजय महामंत्र" },
                        shortTitle: { en: "Maha Mrityunjaya", hi: "महामृत्युंजय मंत्र" },
                        sanskrit: "ऋग्वेद ७.५९.१२",
                        content: {
                          sanskrit: "ॐ त्र्य॑म्बकं यजामहे सुग॒न्धिं पु॑ष्टि॒वर्ध॑नम्।\nउ॒र्वा॒रु॒कमि॑व॒ बन्ध॑नान्मृ॒त्योर्मु॑क्षीय॒ मामृता॑त्॥",
                          transliteration: "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||",
                          meaningHi: "हम त्रिनेत्रधारी, दिव्य सुगंध से परिपूर्ण और संपूर्ण जगत का पोषण एवं संवर्धन करने वाले भगवान् शिव (रुद्र) की आराधना करते हैं। जिस प्रकार पका हुआ खरबूजा बेल के बंधन से अनायास मुक्त हो जाता है, उसी प्रकार हम मृत्यु के भय और संसार के बंधनों से मुक्त होकर अमरत्व (मोक्ष) को प्राप्त हों।",
                          meaningEn: "We worship the Three-Eyed Lord Shiva (Tryambaka), fragrant and nourisher of all beings. As a ripe melon is effortlessly liberated from its bondage to the vine, may we be liberated from death and transmigratory bondage, but not from immortality.",
                          metadata: {
                            mandala: "7",
                            sukta: "59",
                            verse: "12",
                            rishi: "Maharshi Vasishtha Maitravaruni (महर्षि वसिष्ठ)",
                            devata: "Tryambaka Rudra Shiva (त्र्यम्बक रुद्र)",
                            chandas: "Anushtubh (अनुष्टुप्)",
                            viniyoga: "Maha Mrityunjaya Japa, Aarogya & Moksha",
                            source: "Rigveda 7.59.12 / Shukla Yajurveda 3.60",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-8",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 8 (103 Suktas - Kanva & Angiras)", hi: "अष्टम मण्डल (१०३ सूक्त - कण्व एवं अङ्गिरा)" },
                shortTitle: { en: "Mandala 8", hi: "मण्डल ८" },
                sanskrit: "अष्टमं मण्डलम् — कण्व एवं अङ्गिरा",
                tagline: { en: "Kanva & Angiras Lineage · Pragatha Hymns & Indra Stuti", hi: "कण्व एवं अङ्गिरा ऋषि परंपरा · प्रगाथ छंद एवं इन्द्र स्तुति" },
                badge: "103 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m8-s48",
                    parentId: "rigveda-mandala-8",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 48: Nectar of Immortality (Soma)", hi: "सूक्त ४८: अमरत्व का अमृत (सोम)" },
                    shortTitle: { en: "Sukta 48", hi: "सूक्त ४८" },
                    sanskrit: "सोम अमरत्व सूक्तम् (८.४८)",
                    badge: "15 Mantras",
                    children: [
                      {
                        id: "rigveda-8-48-3",
                        parentId: "rigveda-m8-s48",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 8.48.3 — Apama Somamamrita Abhuma", hi: "ऋग्वेद ८.४८.३ — अपाम सोमममृता अभूम" },
                        shortTitle: { en: "Mantra 3", hi: "मंत्र ३" },
                        sanskrit: "ऋग्वेद ८.४८.३",
                        content: {
                          sanskrit: "अपा॑म॒ सोम॑म॒मृता॑ अभू॒माग॑न्म॒ ज्योति॒रवि॑दाम दे॒वान्।\nकिं नू॒नम॒स्मान्कृ॑णव॒दरा॑तिः॒ किमु॑ धू॒र्तिर॑मृता॒ मर्त्य॑स्य॥",
                          transliteration: "apāma somamamṛtā abhūmāganma jyotiravidāma devān |\nkiṃ nūnamasmānkṛṇavadarātiḥ kimu dhūrtiramṛtā martyasya ||",
                          meaningHi: "हमने अमृतस्वरूप सोम रस का पान कर अमरत्व का अनुभव किया है; हम परम प्रकाश तक पहुँचे हैं और दिव्य शक्तियों को जान लिया है। अब कोई शत्रु हमारा क्या अहित कर सकता है, और नश्वर मनुष्य की धूर्तता हमारा क्या बिगाड़ सकती है?",
                          meaningEn: "We have drunk the Soma nectar and become immortal; we have attained the eternal Light and realized the divine forces. What now can any enemy do to us, or the deceit of mortal beings harm us?",
                          metadata: {
                            mandala: "8",
                            sukta: "48",
                            verse: "3",
                            rishi: "Pragatha Kanva (ऋषि प्रगाथ काण्व)",
                            devata: "Soma (सोमदेव)",
                            chandas: "Trishtubh (त्रिष्टुप्)",
                            source: "Rigveda 8.48.3",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-9",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 9 (114 Suktas - Pavamana Soma)", hi: "नवम मण्डल (११४ सूक्त - पवमान सोम)" },
                shortTitle: { en: "Mandala 9", hi: "मण्डल ९" },
                sanskrit: "नवमं मण्डलम् — पवमान सोम",
                tagline: { en: "The Pavamana Mandala · All 114 Hymns Dedicated to Divine Soma Purification", hi: "पवमान सोम सूक्त · संपूर्ण ११४ सूक्त केवल सोम शुद्धि को समर्पित" },
                badge: "114 Suktas",
                childLevelName: { en: "Sukta", hi: "सूक्त" },
                children: [
                  {
                    id: "rigveda-m9-s1",
                    parentId: "rigveda-mandala-9",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 1: Purification of Sacred Soma", hi: "सूक्त १: पवमान सोम शुद्धि सूक्त" },
                    shortTitle: { en: "Sukta 1", hi: "सूक्त १" },
                    sanskrit: "पवमान सोम सूक्तम् (९.१)",
                    badge: "10 Mantras",
                    children: [
                      {
                        id: "rigveda-9-1-1",
                        parentId: "rigveda-m9-s1",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 9.1.1 — Svadishthaya Madishthaya", hi: "ऋग्वेद ९.१.१ — स्वादिष्ठया मदिष्ठया" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद ९.१.१",
                        content: {
                          sanskrit: "स्वादि॑ष्ठया॒ मदि॑ष्ठया॒ पव॑स्व सोम॒ धार॑या।\nइन्द्रा॑य॒ पात॑वे सु॒तः॥",
                          transliteration: "svādiṣṭhayā madiṣṭhayā pavasva soma dhārayā |\nindrāya pātave sutaḥ ||",
                          meaningHi: "हे दिव्य सोम! अत्यंत मधुर और आनंददायिनी पवित्र धारा के रूप में प्रवाहित होकर शुद्ध होओ, ताकि देवराज इन्द्र के पान हेतु तुम समर्पित किए जा सको।",
                          meaningEn: "Flow forth, O Soma, in the sweetest, most exhilarating pure celestial stream, pressed out as divine nectar for Indra to drink.",
                          metadata: {
                            mandala: "9",
                            sukta: "1",
                            verse: "1",
                            rishi: "Madhuchhandas Vaishvamitra (मधुच्छन्दा वैश्वामित्र)",
                            devata: "Pavamana Soma (पवमान सोम)",
                            chandas: "Gayatri (गायत्री)",
                            source: "Rigveda 9.1.1 / Samaveda 469",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "rigveda-mandala-10",
                parentId: "rigveda",
                type: "division",
                levelLabel: { en: "Mandala", hi: "मण्डल" },
                title: { en: "Mandala 10 (191 Suktas - Nasadiya & Purusha Sukta)", hi: "दशम मण्डल (१९१ सूक्त - नासदीय एवं पुरुष सूक्त)" },
                shortTitle: { en: "Mandala 10", hi: "मण्डल १०" },
                sanskrit: "दशमं मण्डलम्",
                tagline: { en: "Cosmic Hymns of Creation and Philosophical Apex", hi: "सृष्टि उत्पत्ति एवं परम दार्शनिक सूक्त" },
                badge: "191 Suktas",
                children: [
                  {
                    id: "rigveda-m10-s90",
                    parentId: "rigveda-mandala-10",
                    type: "section",
                    levelLabel: { en: "Sukta", hi: "सूक्त" },
                    title: { en: "Sukta 90: Purusha Sukta (16 Mantras)", hi: "सूक्त ९०: पुरुष सूक्त (१६ मंत्र)" },
                    shortTitle: { en: "Purusha Sukta", hi: "पुरुष सूक्त" },
                    sanskrit: "पुरुष सूक्तम् (१०.९०)",
                    badge: "16 Mantras",
                    children: [
                      {
                        id: "rigveda-10-90-1",
                        parentId: "rigveda-m10-s90",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Rigveda 10.90.1 — Sahasra Shirsha Purushah", hi: "ऋग्वेद १०.९०.१ — सहस्रशीर्षा पुरुषः" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "ऋग्वेद १०.९०.१",
                        content: {
                          sanskrit: "ॐ स॒हस्र॑शीर्षा॒ पुरु॑षः सहस्रा॒क्षः स॒हस्र॑पात्।\nस भूमिं॑ वि॒श्वतो॑ वृ॒त्वात्य॑तिष्ठद्दशांगु॒लम्॥",
                          transliteration: "oṃ sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt |\nsa bhūmiṃ viśvato vṛtvātyatiṣṭhaddaśāṅgulam ||",
                          meaningHi: "वह परम पुरुष सहस्रों सिरों वाला, सहस्रों आँखों वाला और सहस्रों चरणों वाला है। वह इस संपूर्ण ब्रह्मांड को चारों ओर से व्याप्त करके भी दस अंगुल (अनंत आयामों में) उससे परे स्थित है।",
                          meaningEn: "The Supreme Being has thousands of heads, thousands of eyes, and thousands of feet. Pervading the entire cosmos on every side, He yet transcends it by ten fingers beyond all limits.",
                          metadata: {
                            mandala: "10",
                            sukta: "90",
                            verse: "1",
                            rishi: "Narayana (नारायण)",
                            devata: "Purusha (विराट् पुरुष)",
                            chandas: "Anushtubh (अनुष्टुप्)",
                            source: "Rigveda 10.90.1 / Shukla Yajurveda 31.1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // Yajurveda
          {
            id: "yajurveda",
            parentId: "veda",
            type: "grantha",
            levelLabel: { en: "Veda", hi: "वेद" },
            title: { en: "Yajurveda Samhita", hi: "यजुर्वेद संहिता" },
            shortTitle: { en: "Yajurveda", hi: "यजुर्वेद" },
            sanskrit: "यजुर्वेद संहिता",
            tagline: {
              en: "Shukla Yajurveda (Vajasaneyi) & Krishna Yajurveda (Taittiriya)",
              hi: "शुक्ल यजुर्वेद (वाजसनेयि) एवं कृष्ण यजुर्वेद (तैत्तिरीय)",
            },
            cardImage: yajurvedaCardImg,
            bannerImage: bannerFireRitual,
            image: yajurvedaCardImg,
            badge: "Shukla & Krishna",
            desc: {
              en: "The Veda of sacrificial prose mantras, ritual action (Karma Kanda), and procedural formulas chanted by the Adhvaryu priest.",
              hi: "यज्ञ-कर्मकांड, हविष्य समर्पण एवं मन्त्र-क्रिया का प्रामाणिक वेद, जो शुक्ल एवं कृष्ण शाखाओं में विभक्त है।",
            },
            childLevelName: { en: "Tradition / Samhita", hi: "शाखा / संहिता" },
            children: [
              {
                id: "shukla-yajurveda",
                parentId: "yajurveda",
                type: "division",
                levelLabel: { en: "Branch", hi: "शाखा" },
                title: { en: "Shukla Yajurveda (Vajasaneyi Madhyandina)", hi: "शुक्ल यजुर्वेद (वाजसनेयि माध्यन्दिन)" },
                shortTitle: { en: "Shukla Yajurveda", hi: "शुक्ल यजुर्वेद" },
                sanskrit: "वाजसनेयि-माध्यन्दिन संहिता",
                badge: "40 Adhyayas",
                childLevelName: { en: "Adhyaya", hi: "अध्याय" },
                children: [
                  {
                    id: "shukla-yaju-adh-40",
                    parentId: "shukla-yajurveda",
                    type: "section",
                    levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                    title: { en: "Adhyaya 40: Ishavasya Upanishad (18 Mantras)", hi: "अध्याय ४०: ईशावास्योपनिषद् (१८ मंत्र)" },
                    shortTitle: { en: "Adhyaya 40", hi: "अध्याय ४०" },
                    sanskrit: "ईशावास्य अध्यायः",
                    badge: "18 Mantras",
                    children: [
                      {
                        id: "yaju-40-1",
                        parentId: "shukla-yaju-adh-40",
                        type: "leaf",
                        levelLabel: { en: "Mantra", hi: "मंत्र" },
                        title: { en: "Yajurveda 40.1 — Isha Vasyam Idam Sarvam", hi: "यजुर्वेद ४०.१ — ईशा वास्यमिदं सर्वम्" },
                        shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                        sanskrit: "यजुर्वेद ४०.१",
                        content: {
                          sanskrit: "ॐ ई॒शा वा॒स्य॑मि॒दं सर्वं॒ यत्किञ्च॒ जग॑त्यां॒ जग॑त्।\nतेन॑ त्य॒क्तेन॑ भुञ्जीथा॒ मा गृ॑धः॒ कस्य॑स्वि॒द्धन॑म्॥",
                          transliteration: "oṃ īśā vāsyamidaṃ sarvaṃ yatkiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||",
                          meaningHi: "इस परिवर्तनशील संसार में जो कुछ भी चराचर जगत है, वह सब ईश्वर से व्याप्त है। इसलिए त्यागभाव से उसका उपभोग करो; किसी अन्य के धन पर लोभ मत करो।",
                          meaningEn: "All this, whatsoever moves in this moving world, is enveloped and indwelt by the Divine. Enjoy and sustain yourself through detachment; do not covet the wealth of anyone.",
                          metadata: {
                            samhita: "Vajasaneyi Samhita (Shukla Yajurveda)",
                            adhyaya: "40",
                            verse: "1",
                            rishi: "Yajnavalkya / Dadhyang Atharvana",
                            devata: "Ishvara (आत्मतत्त्व / परमात्मा)",
                            chandas: "Anushtubh",
                            source: "Shukla Yajurveda Samhita 40.1 / Isha Upanishad 1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "krishna-yajurveda",
                parentId: "yajurveda",
                type: "division",
                levelLabel: { en: "Branch", hi: "शाखा" },
                title: { en: "Krishna Yajurveda (Taittiriya Samhita)", hi: "कृष्ण यजुर्वेद (तैत्तिरीय संहिता)" },
                shortTitle: { en: "Krishna Yajurveda", hi: "कृष्ण यजुर्वेद" },
                sanskrit: "तैत्तिरीय संहिता",
                badge: "7 Kandas",
                children: [
                  {
                    id: "kyv-ts-kanda4",
                    parentId: "krishna-yajurveda",
                    type: "section",
                    levelLabel: { en: "Kanda", hi: "काण्ड" },
                    title: { en: "Kanda 4: Sri Rudram Chamakam (Agnicayana)", hi: "चतुर्थ काण्ड: श्रीरुद्रम् एवं चमकम् (अग्निचयन)" },
                    shortTitle: { en: "Sri Rudram", hi: "श्रीरुद्रम्" },
                    sanskrit: "श्रीरुद्रप्रश्नः (तैत्तिरीय संहिता ४.५)",
                    badge: "Namakam",
                    children: [
                      {
                        id: "kyv-rudram-1",
                        parentId: "kyv-ts-kanda4",
                        type: "leaf",
                        levelLabel: { en: "Anuvaka", hi: "अनुवाक" },
                        title: { en: "Sri Rudram Namakam — Anuvaka 1.1", hi: "श्रीरुद्रम् नमकम् — प्रथम अनुवाक" },
                        shortTitle: { en: "Anuvaka 1.1", hi: "अनुवाक १.१" },
                        sanskrit: "श्रीरुद्रम् १.१",
                        content: {
                          sanskrit: "ॐ नमो॒ भग॑वते रु॒द्राय॑॥\nनम॑स्ते रु॒द्र म॒न्यव॑ उ॒तोत॒ इष॑वे॒ नमः॑।\nनम॑स्ते अस्तु॒ धन्व॑ने बा॒हुभ्या॑मु॒त ते॒ नमः॑॥",
                          transliteration: "oṃ namo bhagavate rudrāya ||\nnamaste rudra manyava utota iṣave namaḥ |\nnamaste astu dhanvane bāhubhyāmuta te namaḥ ||",
                          meaningHi: "भगवान रुद्र को नमस्कार है। हे रुद्र! आपके क्रोध, आपके बाण, आपके धनुष और आपकी दोनों भुजाओं को हमारा बारंबार नमस्कार है।",
                          meaningEn: "Salutations to Bhagavan Rudra! O Lord Rudra, salutations to your divine wrath, to your holy arrow, to your sacred bow, and to your two all-powerful arms!",
                          metadata: {
                            samhita: "Taittiriya Samhita (Krishna Yajurveda)",
                            kanda: "4",
                            prapathaka: "5 (Namakam)",
                            verse: "1",
                            rishi: "Atri / Agastya",
                            devata: "Shri Rudra",
                            source: "Taittiriya Samhita 4.5.1",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "kyv-taittiriya-upanishad",
                    parentId: "krishna-yajurveda",
                    type: "section",
                    levelLabel: { en: "Upanishad", hi: "उपनिषद" },
                    title: { en: "Taittiriya Upanishad (Shiksha Valli - Convocation Address)", hi: "तैत्तिरीयोपनिषद् (शिक्षावल्ली - दीक्षान्त उपदेश)" },
                    shortTitle: { en: "Taittiriya Up.", hi: "तैत्तिरीय उप." },
                    sanskrit: "तैत्तिरीयोपनिषद् (शिक्षावल्ली)",
                    badge: "Satyam Vada",
                    children: [
                      {
                        id: "kyv-tu-1-11",
                        parentId: "kyv-taittiriya-upanishad",
                        type: "leaf",
                        levelLabel: { en: "Anuvaka", hi: "अनुवाक" },
                        title: { en: "Taittiriya 1.11.1 — Satyam Vada Dharmam Chara", hi: "तैत्तिरीय १.११.१ — सत्यं वद धर्मं चर" },
                        shortTitle: { en: "Satyam Vada", hi: "सत्यं वद" },
                        sanskrit: "तैत्तिरीयोपनिषद् १.११.१",
                        content: {
                          sanskrit: "वेदमनूच्याचार्योऽन्तेवासिनमनुशास्ति।\nसत्यं वद। धर्मं चर। स्वाध्यायान्मा प्रमदः॥\nमातृदेवो भव। पितृदेवो भव। आचार्यदेवो भव। अतिथिदेवो भव॥",
                          transliteration: "vedamanūcyācāryo'ntevāsinamanuśāsti |\nsatyaṃ vada | dharmaṃ cara | svādhyāyānmā pramadaḥ ||\nmātṛdevo bhava | pitṛdevo bhava | ācāryadevo bhava | atithidevo bhava ||",
                          meaningHi: "वेद की शिक्षा देकर आचार्य शिष्य को अंतिम उपदेश देते हैं: 'सत्य बोलो। धर्म का आचरण करो। स्वाध्याय में प्रमाद न करो। माता को ईश्वर मानो। पिता को ईश्वर मानो। गुरु को ईश्वर मानो। अतिथि को ईश्वर मानो।'",
                          meaningEn: "Having taught the Vedas, the preceptor instructs the disciple: 'Speak the Truth. Practice Dharma. Never neglect your daily spiritual study. Treat your mother as divine. Treat your father as divine. Treat your teacher as divine. Treat your guest as divine.'",
                          metadata: {
                            upanishad: "Taittiriya Upanishad",
                            valli: "Shiksha Valli",
                            anuvaka: "11",
                            source: "Taittiriya Upanishad 1.11.1-2",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // Samaveda
          {
            id: "samaveda",
            parentId: "veda",
            type: "grantha",
            levelLabel: { en: "Veda", hi: "वेद" },
            title: { en: "Samaveda Samhita", hi: "सामवेद संहिता" },
            shortTitle: { en: "Samaveda", hi: "सामवेद" },
            sanskrit: "सामवेद संहिता",
            tagline: {
              en: "Purvarchika & Uttararchika · 1,875 Melodic Verses",
              hi: "पूर्वार्चिक एवं उत्तरार्चिक · १,८७५ गान युक्त ऋचाएँ",
            },
            cardImage: samavedaCardImg,
            bannerImage: bannerKashiGhat,
            image: samavedaCardImg,
            badge: "Melodic Chants",
            desc: {
              en: "The Veda of sacred musical chants and melodies (Sama) sung by the Udgatri priest, celebrated in the Bhagavad Gita: 'Vedanam Samavedo'smi'.",
              hi: "उद्गाता पुरोहित द्वारा गाए जाने वाले दिव्य संगीतात्मक साम-गान का वेद। भगवान कृष्ण ने कहा: 'वेदानां सामवेदोऽस्मि' (वेदों में मैं सामवेद हूँ)।",
            },
            childLevelName: { en: "Archika", hi: "आर्चिक" },
            children: [
              {
                id: "samaveda-purvarchika",
                parentId: "samaveda",
                type: "division",
                levelLabel: { en: "Division", hi: "भाग" },
                title: { en: "Purvarchika (Agneya, Aindra, Pavamana Kandas)", hi: "पूर्वार्चिक (आग्नेय, ऐन्द्र, पवमान काण्ड)" },
                shortTitle: { en: "Purvarchika", hi: "पूर्वार्चिक" },
                sanskrit: "पूर्वार्चिक",
                badge: "585 Verses",
                children: [
                  {
                    id: "sv-pa-agneya",
                    parentId: "samaveda-purvarchika",
                    type: "section",
                    levelLabel: { en: "Kanda", hi: "काण्ड" },
                    title: { en: "Agneya Kanda (Hymns to Agni)", hi: "आग्नेय काण्ड (अग्नि देव के संगीतमय साम)" },
                    shortTitle: { en: "Agneya Kanda", hi: "आग्नेय काण्ड" },
                    sanskrit: "आग्नेय काण्डम्",
                    badge: "114 Verses",
                    children: [
                      {
                        id: "sv-pa-1-1",
                        parentId: "sv-pa-agneya",
                        type: "leaf",
                        levelLabel: { en: "Sama", hi: "साम" },
                        title: { en: "Samaveda 1.1 — Agna A Yahi Vitaye", hi: "सामवेद १.१ — अग्न आयाहि वीतये" },
                        shortTitle: { en: "Sama 1", hi: "साम १" },
                        sanskrit: "सामवेद १.१",
                        content: {
                          sanskrit: "ॐ अग्न॒ आया॑हि वी॒तये॑ गृणा॒नो ह॒व्यदा॑तये।\nनि होता॑ सत्सि ब॒र्हिषि॑॥",
                          transliteration: "oṃ agna āyāhi vītaye gṛṇāno havyadātaye |\nni hotā satsi barhiṣi ||",
                          meaningHi: "हे तेजस्वी अग्निदेव! हमारे द्वारा गाए जा रहे मधुर स्तोत्रों से प्रसन्न होकर, हविष्य ग्रहण करने के लिए यहाँ पधारें और हमारे पवित्र कुशासन (बर्हिष) पर विराजें।",
                          meaningEn: "O divine Agni, invoked by our sacred melodic chants, come forth to partake in the sacrificial offering and be seated as our divine priest upon the sacred Kusha grass!",
                          metadata: {
                            archika: "Purvarchika",
                            kanda: "Agneya",
                            verse: "1",
                            rishi: "Bharadvaja Barhaspatya",
                            devata: "Agni",
                            chandas: "Gayatri",
                            source: "Samaveda Purvarchika 1.1 / Rigveda 6.16.10",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: "samaveda-uttararchika",
                parentId: "samaveda",
                type: "division",
                levelLabel: { en: "Division", hi: "भाग" },
                title: { en: "Uttararchika (1,225 Verses arranged for Soma sacrifices)", hi: "उत्तरार्चिक (सोमयाग के अनुष्ठानिक गान)" },
                shortTitle: { en: "Uttararchika", hi: "उत्तरार्चिक" },
                sanskrit: "उत्तरार्चिक",
                badge: "1,225 Verses",
                children: [
                  {
                    id: "sv-ua-prapathaka-1",
                    parentId: "samaveda-uttararchika",
                    type: "section",
                    levelLabel: { en: "Prapathaka", hi: "प्रपाठक" },
                    title: { en: "Prapathaka 1: Sacrificial Chants (Pratahsavana)", hi: "प्रथम प्रपाठक: प्रातःसवन साम-गान" },
                    shortTitle: { en: "Prapathaka 1", hi: "प्रपाठक १" },
                    sanskrit: "प्रथमः प्रपाठकः",
                    badge: "Ritual Chants",
                    children: [
                      {
                        id: "sv-ua-1-1",
                        parentId: "sv-ua-prapathaka-1",
                        type: "leaf",
                        levelLabel: { en: "Sama", hi: "साम" },
                        title: { en: "Uttararchika 1.1 — Punana Soma Dharaya", hi: "उत्तरार्चिक १.१ — पुनानः सोम धारया" },
                        shortTitle: { en: "Sama 1", hi: "साम १" },
                        sanskrit: "उत्तरार्चिक १.१",
                        content: {
                          sanskrit: "पुना॑नः सोम॒ धार॑या॒पो वसा॑नो अर्षसि।\nआ रत्न॒धा योनि॑मृ॒तस्य॑ सीद॒स्युत्सो॑ दे॒वो हिर॑ण्ययः॥",
                          transliteration: "punānaḥ soma dhārayāpo vasāno arṣasi |\nā ratnadhā yonimṛtasya sīdasyutso devo hiraṇyayaḥ ||",
                          meaningHi: "हे पवित्रीकृत सोम! जल के साथ मिलकर अपनी मधुर धारा से प्रवाहित हों। रत्नों को धारण करने वाले, स्वर्णमय दिव्य स्रोत रूप आप सत्य के शाश्वत आसन पर विराजें।",
                          meaningEn: "Being purified, O Soma, flow in a rich golden stream clothed in sacred waters. Bestower of gems and golden divine source of life, take your seat in the realm of Cosmic Order (Rita)!",
                          metadata: {
                            archika: "Uttararchika",
                            prapathaka: "1",
                            devata: "Soma",
                            source: "Samaveda Uttararchika 1.1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // Atharvaveda
          {
            id: "atharvaveda",
            parentId: "veda",
            type: "grantha",
            levelLabel: { en: "Veda", hi: "वेद" },
            title: { en: "Atharvaveda Samhita", hi: "अथर्ववेद संहिता" },
            shortTitle: { en: "Atharvaveda", hi: "अथर्ववेद" },
            sanskrit: "अथर्ववेद संहिता (शौनक)",
            tagline: {
              en: "20 Kandas · 730 Suktas · 5,987 Mantras · Prithvi Sukta",
              hi: "२० काण्ड · ७३० सूक्त · ५,९८७ मंत्र · भूमि सूक्त",
            },
            cardImage: atharvavedaCardImg,
            bannerImage: bannerRitualSetup,
            image: atharvavedaCardImg,
            badge: "20 Kandas",
            desc: {
              en: "The Veda of practical, holistic life, natural sciences, healing herbs, environmental veneration (Prithvi Sukta), and statecraft supervised by the Brahma priest.",
              hi: "ऋषि अथर्वा एवं अंगिरा द्वारा दृष्ट दैनिक जीवन, आयुर्विज्ञान, वनस्पति विज्ञान, पर्यावरण प्रेम (भूमि सूक्त) एवं शांति का अनुपम वेद।",
            },
            childLevelName: { en: "Kanda", hi: "काण्ड" },
            children: [
              {
                id: "atharva-kanda-12",
                parentId: "atharvaveda",
                type: "division",
                levelLabel: { en: "Kanda", hi: "काण्ड" },
                title: { en: "Kanda 12: Bhumi Sukta (Prithvi Sukta)", hi: "द्वादश काण्ड: भूमि सूक्त (६३ मंत्र)" },
                shortTitle: { en: "Kanda 12", hi: "काण्ड १२" },
                sanskrit: "द्वादशं काण्डम् — पृथिवी सूक्तम्",
                badge: "63 Mantras",
                children: [
                  {
                    id: "atharva-12-1-12",
                    parentId: "atharva-kanda-12",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Atharvaveda 12.1.12 — Mata Bhumih Putro'ham Prithivyah", hi: "अथर्ववेद १२.१.१२ — माता भूमिः पुत्रोऽहं पृथिव्याः" },
                    shortTitle: { en: "Mata Bhumih", hi: "माता भूमिः" },
                    sanskrit: "अथर्ववेद १२.१.१२",
                    content: {
                      sanskrit: "यस्यां॒ समुद्र॑ उ॒त सिन्धु॑रा॒पो यस्या॒मन्नं॑ कृ॒ष्टयः॑ संब॒भूवुः॑।\nयस्या॑मि॒दं जिन्व॑ति प्रा॒णदेज॒त् सा नो॒ भूमिः॑ पू॒र्वपे॒ये द॑धातु॥\nमाता॒ भूमिः॑ पु॒त्रो अ॒हं पृ॑थि॒व्याः॥",
                      transliteration: "yasyāṃ samudra uta sindhurāpo yasyāmannaṃ kṛṣṭayaḥ saṃbabhūvuḥ |\nyasyāmidaṃ jinvati prāṇadejat sā no bhūmiḥ pūrvapeye dadhātu ||\nmātā bhūmiḥ putro ahaṃ pṛthivyāḥ ||",
                      meaningHi: "जिस पृथ्वी पर समुद्र, नदियाँ और जल स्रोत विद्यमान हैं; जहाँ अन्न और कृषिकर्म उपजते हैं; जहाँ समस्त प्राणी प्राण धारण करते हैं—वह मातृभूमि हमें उत्तम पोषण प्रदान करे। 'भूमि मेरी माता है और मैं इस पृथ्वी का पुत्र हूँ।'",
                      meaningEn: "Upon whom the oceans, rivers, and waters dwell; in whom grains, food, and farming flourish; upon whom all breathing, moving life breathes—may that Earth bestow supreme nourishment upon us. 'Earth is my mother, and I am the child of the Earth!'",
                      metadata: {
                        kanda: "12",
                        sukta: "1 (Bhumi Sukta)",
                        verse: "12",
                        rishi: "Atharva Rishi (अथर्वा ऋषि)",
                        devata: "Bhumi / Prithvi (भूमिः)",
                        chandas: "Anushtubh",
                        source: "Atharvaveda Shaunakiya Samhita 12.1.12",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Vedanga (Six Limbs of the Veda)
      // -----------------------------------------------------------------------
      {
        id: "vedanga",
        parentId: "vedic-knowledge",
        type: "discipline",
        levelLabel: { en: "Auxiliary Discipline", hi: "वेदांग" },
        title: { en: "The Six Vedangas (षडङ्ग)", hi: "षड् वेदांग (छह अंग)" },
        shortTitle: { en: "Vedanga", hi: "वेदांग" },
        sanskrit: "षड् वेदाङ्गानि",
        tagline: {
          en: "Shiksha, Vyakarana, Chandas, Nirukta, Jyotisha, Kalpa",
          hi: "शिक्षा, व्याकरण, छन्द, निरुक्त, ज्योतिष, कल्प",
        },
        cardImage: astrologyCardImg,
        bannerImage: bannerSacredDetails,
        image: astrologyCardImg,
        badge: "6 Disciplines",
        desc: {
          en: "The six foundational sciences necessary for reading, pronouncing, interpreting, and applying Vedic texts with absolute mathematical and spiritual precision.",
          hi: "वेदों के यथार्थ उच्चारण, व्याकरणिक शुद्धता, छंदोबद्ध पाठ, शब्द-व्युत्पत्ति, खगोलीय काल-गणना एवं यज्ञ-विधान के छह अनिवार्य शास्त्र।",
        },
        children: [
          {
            id: "vedanga-shiksha",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Shiksha (Phonetics & Phonology)", hi: "शिक्षा (ध्वनि एवं उच्चारण विज्ञान)" },
            shortTitle: { en: "Shiksha", hi: "शिक्षा" },
            sanskrit: "शिक्षा शास्त्रम् (नासिका)",
            tagline: { en: "Nose of the Veda · Paniniya Shiksha", hi: "वेदपुरुष की नासिका · पाणिनीय शिक्षा" },
            badge: "Phonetics",
            desc: {
              en: "The science of correct Vedic accentuation (Udatta, Anudatta, Svarita), articulation places (Sthana), and effort (Prayatna).",
              hi: "मंत्रों के उदात्त, अनुदात्त व स्वरित स्वरों तथा कण्ठ, तालु, मूर्धा आदि उच्चारण स्थानों का प्रामाणिक विज्ञान।",
            },
            children: [
              {
                id: "shiksha-paniniya",
                parentId: "vedanga-shiksha",
                type: "section",
                levelLabel: { en: "Grantha", hi: "ग्रंथ" },
                title: { en: "Paniniya Shiksha (Varna-Uchharana Vidhi)", hi: "पाणिनीय शिक्षा (वर्ण-उच्चारण विधान)" },
                shortTitle: { en: "Paniniya Shiksha", hi: "पाणिनीय शिक्षा" },
                sanskrit: "पाणिनीया शिक्षा (६० कारिका)",
                badge: "60 Karikas",
                children: [
                  {
                    id: "shiksha-verse-1",
                    parentId: "shiksha-paniniya",
                    type: "leaf",
                    levelLabel: { en: "Karika", hi: "कारिका" },
                    title: { en: "Paniniya Shiksha Karika 6 — Atma Buddhya Sametyarthan", hi: "पाणिनीय शिक्षा कारिका ६ — आत्मा बुद्ध्या समेत्यार्थान्" },
                    shortTitle: { en: "Karika 6", hi: "कारिका ६" },
                    sanskrit: "पाणिनीय शिक्षा ६",
                    content: {
                      sanskrit: "आत्मा बुद्ध्या समेत्यार्थान् मनो युङ्क्ते विवक्षया।\nमनः कायाग्निमाहन्ति स प्रेरयति मारुतम्॥",
                      transliteration: "ātmā buddhyā sametyārthān mano yuṅkte vivakṣayā |\nmanaḥ kāyāgnimāhanti sa prerayati mārutam ||",
                      meaningHi: "जीवात्मा बुद्धि के साथ पदार्थों का निर्णय करके बोलने की इच्छा से मन को प्रेरित करता है। मन जठराग्नि को आघात करता है और वह प्राणवायु को ऊपर की ओर प्रेरित करता है, जिससे नाद और वर्ण प्रकट होते हैं।",
                      meaningEn: "The soul, having perceived concepts through the intellect, inspires the mind with the desire to speak. The mind activates the bodily internal fire, which impels the breath upward to manifest speech.",
                      metadata: {
                        grantha: "Paniniya Shiksha",
                        verse: "6",
                        subject: "Phonetic Mechanics of Speech",
                        source: "Paniniya Shiksha 6",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "vedanga-vyakarana",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Vyakarana (Grammar & Linguistic Analysis)", hi: "व्याकरण (शब्द रचना एवं पद-विश्लेषण)" },
            shortTitle: { en: "Vyakarana", hi: "व्याकरण" },
            sanskrit: "व्याकरण शास्त्रम् (मुखम्)",
            tagline: { en: "Mouth of the Veda · Ashtadhyayi of Panini", hi: "वेदपुरुष का मुख · महर्षि पाणिनि की अष्टाध्यायी" },
            badge: "Grammar",
            desc: {
              en: "The structural architecture of Sanskrit, codified universally in Panini's 3,959 sutras of the Ashtadhyayi.",
              hi: "संस्कृत भाषा के शब्द-निर्माण और वाक्यों की वैज्ञानिक संरचना, जिसका चरमोत्कर्ष अष्टाध्यायी में है।",
            },
            children: [
              {
                id: "vyakarana-ashtadhyayi",
                parentId: "vedanga-vyakarana",
                type: "section",
                levelLabel: { en: "Sutra Grantha", hi: "सूत्र ग्रंथ" },
                title: { en: "Panini Ashtadhyayi (8 Chapters / 3,995 Sutras)", hi: "महर्षि पाणिनि की अष्टाध्यायी (८ अध्याय / ३,९९५ सूत्र)" },
                shortTitle: { en: "Ashtadhyayi", hi: "अष्टाध्यायी" },
                sanskrit: "अष्टाध्यायी (पाणिनि सूत्र)",
                badge: "3,995 Sutras",
                children: [
                  {
                    id: "vyakarana-sutra-1",
                    parentId: "vyakarana-ashtadhyayi",
                    type: "leaf",
                    levelLabel: { en: "Sutra", hi: "सूत्र" },
                    title: { en: "Ashtadhyayi 1.1.1 — Vriddhiradaich", hi: "अष्टाध्यायी १.१.१ — वृद्धिरादैच्" },
                    shortTitle: { en: "Sutra 1.1.1", hi: "सूत्र १.१.१" },
                    sanskrit: "अष्टाध्यायी १.१.१",
                    content: {
                      sanskrit: "वृद्धिरादैच्॥",
                      transliteration: "vṛddhirādaic ||",
                      meaningHi: "आ (दीर्घ आ), ऐ और औ—इन तीनों स्वरों की 'वृद्धि' संज्ञा होती है। यह अष्टाध्यायी का प्रथम मंगलकारी सूत्र है, जिससे व्याकरण की अद्भुत पद-रचना प्रारंभ होती है।",
                      meaningEn: "'Ā', 'Ai', and 'Au' are designated by the grammatical term 'Vriddhi' (growth/expansion). This is the auspicious opening sutra of Panini's linguistic masterpiece.",
                      metadata: {
                        author: "Maharshi Panini (महर्षि पाणिनि)",
                        adhyaya: "1",
                        pada: "1",
                        sutra: "1",
                        source: "Panini Ashtadhyayi 1.1.1",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "vedanga-chandas",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Chandas (Poetic Metres & Prosody)", hi: "छन्द (वैदिक छन्दःशास्त्र)" },
            shortTitle: { en: "Chandas", hi: "छन्द" },
            sanskrit: "छन्दः शास्त्रम् (पादौ)",
            tagline: { en: "Feet of the Veda · Pingala Chandas Sutra", hi: "वेदपुरुष के पैर · पिंगलाचार्य का छन्दःसूत्र" },
            badge: "Prosody",
            desc: {
              en: "The metric structure of Vedic mantras: Gayatri (24), Ushnik (28), Anushtubh (32), Brihati (36), Pankti (40), Trishtubh (44), Jagati (48).",
              hi: "वैदिक ऋचाओं के सात प्रमुख छन्दों (गायत्री, अनुष्टुप्, त्रिष्टुप्, जगती आदि) का सुव्यवस्थित शास्त्र।",
            },
            children: [
              {
                id: "chandas-pingala",
                parentId: "vedanga-chandas",
                type: "section",
                levelLabel: { en: "Grantha", hi: "ग्रंथ" },
                title: { en: "Pingala Chandas Sutra (The 7 Vedic Metres)", hi: "पिंगल छन्दःसूत्र (सप्त वैदिक छन्द)" },
                shortTitle: { en: "Pingala Sutra", hi: "पिंगल सूत्र" },
                sanskrit: "पिङ्गलाचार्य छन्दःसूत्रम्",
                badge: "7 Metres",
                children: [
                  {
                    id: "chandas-metre-def",
                    parentId: "chandas-pingala",
                    type: "leaf",
                    levelLabel: { en: "Metre Code", hi: "छंद निरूपण" },
                    title: { en: "The 7 Vedic Metres Syllable Scale", hi: "सप्त मुख्य वैदिक छंदों का अक्षर-क्रम" },
                    shortTitle: { en: "7 Metres", hi: "सप्त छंद" },
                    sanskrit: "सप्तच्छन्दांसि",
                    content: {
                      sanskrit: "गायत्री (२४) उष्णिक् (२८) अनुष्टुप् (३२) बृहती (३६) पंक्तिः (४०) त्रिष्टुप् (४४) जगती (४८)।\nएते सप्त छन्दांसि वेदानां प्राणाः॥",
                      transliteration: "gāyatrī (24) uṣṇik (28) anuṣṭup (32) bṛhatī (36) paṅktiḥ (40) triṣṭup (44) jagatī (48) |\nete sapta chandāṃsi vedānāṃ prāṇāḥ ||",
                      meaningHi: "वैदिक वाङ्मय में क्रमशः ४-४ अक्षरों की वृद्धि से सात प्रमुख छंद होते हैं: गायत्री (२४ अक्षर), उष्णिक् (२८), अनुष्टुप् (३२), बृहती (३६), पंक्ति (४०), त्रिष्टुप् (४४) और जगती (४८)।",
                      meaningEn: "The seven principal metres of the Vedas expand in increments of 4 syllables: Gayatri (24 syllables), Ushnih (28), Anushtubh (32), Brihati (36), Pankti (40), Trishtubh (44), and Jagati (48).",
                      metadata: {
                        author: "Acharya Pingala (पिंगलाचार्य)",
                        grantha: "Chandas Shastra",
                        source: "Pingala Chandas Sutra / Rigveda Pratishakhya",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "vedanga-nirukta",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Nirukta (Etymology & Semantics)", hi: "निरुक्त (व्युत्पत्ति एवं अर्थ-विज्ञान)" },
            shortTitle: { en: "Nirukta", hi: "निरुक्त" },
            sanskrit: "निरुक्त शास्त्रम् (श्रोत्रम्)",
            tagline: { en: "Ears of the Veda · Yaska's Nighantu Nirukta", hi: "वेदपुरुष के कान · यास्काचार्य का निरुक्त" },
            badge: "Etymology",
            desc: {
              en: "The ancient semantic dictionary and hermeneutical commentary deciphering rare and archaic Vedic terminology.",
              hi: "वैदिक शब्दों के मूल धातुज अर्थ, व्युत्पत्ति और गूढ़ पारिभाषिक शब्दों की व्याख्या का ग्रंथ।",
            },
            children: [
              {
                id: "nirukta-yaska",
                parentId: "vedanga-nirukta",
                type: "section",
                levelLabel: { en: "Grantha", hi: "ग्रंथ" },
                title: { en: "Yaska Nirukta (Etymology & Vedic Hermeneutics)", hi: "यास्क कृत निरुक्त (शब्द निष्पत्ति एवं धातु-विज्ञान)" },
                shortTitle: { en: "Yaska Nirukta", hi: "यास्क निरुक्त" },
                sanskrit: "यास्क प्रणीतं निरुक्तम्",
                badge: "3 Kandas",
                children: [
                  {
                    id: "nirukta-rule-1",
                    parentId: "nirukta-yaska",
                    type: "leaf",
                    levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                    title: { en: "Nirukta 1.1 — Chatvari Padajatani", hi: "निरुक्त १.१ — चत्वारि पदजातानि" },
                    shortTitle: { en: "4 Word Classes", hi: "४ पद वर्ग" },
                    sanskrit: "निरुक्त १.१",
                    content: {
                      sanskrit: "तद्यान्येतानि चत्वारि पदजातानि नामाख्याते चोपसर्गनिपाताश्च तानीमानि भवन्ति॥\nभावप्रधानमाख्यातम्। सत्त्वप्रधानानि नामानि॥",
                      transliteration: "tadyānyetāni catvāri padajātāni nāmākhyāte copasarganipātāśca tānīmāni bhavanti ||\nbhāvapradhānamākhyātam | sattvapradhānāni nāmāni ||",
                      meaningHi: "भाषा में चार प्रकार के पद होते हैं: नाम (संज्ञा), आख्यात (क्रिया), उपसर्ग और निपात। क्रिया में भाव/कर्म की प्रधानता होती है और नाम में द्रव्य/सत्त्व की प्रधानता होती है।",
                      meaningEn: "There are four fundamental classes of words: Nouns (Nama), Verbs (Akhyata), Preverbs (Upasarga), and Particles (Nipata). Verbs have being/action as their primary sense, whereas nouns have substance as their essence.",
                      metadata: {
                        author: "Maharshi Yaska (महर्षि यास्क)",
                        adhyaya: "1",
                        section: "1",
                        source: "Yaska Nirukta 1.1",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "vedanga-jyotisha",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Jyotisha (Vedic Astronomy & Chronology)", hi: "ज्योतिष (खगोल एवं काल-विधान)" },
            shortTitle: { en: "Jyotisha", hi: "ज्योतिष" },
            sanskrit: "ज्योतिष शास्त्रम् (नेत्रे)",
            tagline: { en: "Eyes of the Veda · Vedanga Jyotisha of Lagadha", hi: "वेदपुरुष के नेत्र · लगध मुनि का वेदांग ज्योतिष" },
            badge: "Astronomy",
            desc: {
              en: "The astronomical calculation of planetary positions, solstices, lunar mansions (Nakshatras), and auspicious Muhurta for Vedic sacrifices.",
              hi: "यज्ञों के उचित काल-निर्धारण हेतु सूर्य, चन्द्र, नक्षत्रों तथा ऋतु-चक्र की सटीक गणितीय गणना।",
            },
            children: [
              {
                id: "jyotisha-lagadha",
                parentId: "vedanga-jyotisha",
                type: "section",
                levelLabel: { en: "Grantha", hi: "ग्रंथ" },
                title: { en: "Vedanga Jyotisha of Sage Lagadha", hi: "लगध मुनि प्रणीत वेदांग ज्योतिष" },
                shortTitle: { en: "Vedanga Jyotisha", hi: "वेदांग ज्योतिष" },
                sanskrit: "वेदाङ्ग ज्योतिषम्",
                badge: "Vedic Astronomy",
                children: [
                  {
                    id: "jyotisha-verse-4",
                    parentId: "jyotisha-lagadha",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Vedanga Jyotisha 4 — Yatha Shikha Mayuranam", hi: "वेदांग ज्योतिष ४ — यथा शिखा मयूराणां" },
                    shortTitle: { en: "Shloka 4", hi: "श्लोक ४" },
                    sanskrit: "वेदांग ज्योतिष ४",
                    content: {
                      sanskrit: "यथा शिखा मयूराणां नागानां मणयो यथा।\nतद्वद् वेदाङ्गशास्त्राणां गणितं मूर्ध्नि वर्तते॥",
                      transliteration: "yathā śikhā mayūrāṇāṃ nāgānāṃ maṇayo yathā |\ntadvad vedāṅgaśāstrāṇāṃ gaṇitaṃ mūrdhni vartate ||",
                      meaningHi: "जिस प्रकार मोरों में शिखा (कलगी) और नागों में मणि सर्वोच्च मस्तक पर स्थित होती है, उसी प्रकार सभी वेदांग शास्त्रों में गणित एवं खगोल-ज्योतिष सबसे मूर्धन्य (सर्वोच्च) स्थान पर स्थित है।",
                      meaningEn: "Just as the crest crowns the head of peacocks and the glowing jewel adorns the head of serpents, so does Mathematics and Astronomy stand supreme at the crown of all Vedanga sciences!",
                      metadata: {
                        author: "Sage Lagadha (लगध मुनि)",
                        shloka: "4",
                        subject: "Supremacy of Mathematics & Chronology",
                        source: "Vedanga Jyotisha",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "vedanga-kalpa",
            parentId: "vedanga",
            type: "grantha",
            levelLabel: { en: "Branch", hi: "अंग" },
            title: { en: "Kalpa (Ritual Sutras & Sacred Geometry)", hi: "कल्प (यज्ञ, गृह्य एवं शुल्ब सूत्र)" },
            shortTitle: { en: "Kalpa", hi: "कल्प" },
            sanskrit: "कल्प शास्त्रम् (हस्तौ)",
            tagline: { en: "Hands of the Veda · Shrauta, Grihya, Dharma, Shulba", hi: "वेदपुरुष के हाथ · श्रौत, गृह्य, धर्म एवं शुल्ब सूत्र" },
            badge: "Ritual Codes",
            desc: {
              en: "Practical procedural codes: Shrauta (community yagyas), Grihya (domestic rituals), Dharma (social ethics), and Shulba (altar geometry, pythagoras theorems).",
              hi: "कर्मकांड के चार प्रमुख सूत्र: श्रौत सूत्र (महायज्ञ), गृह्य सूत्र (गृहस्थ कर्म), धर्म सूत्र (आचार), एवं शुल्ब सूत्र (वेदी निर्माण की प्राचीन ज्यामिति)।",
            },
            children: [
              {
                id: "kalpa-shulba-sutra",
                parentId: "vedanga-kalpa",
                type: "section",
                levelLabel: { en: "Grantha", hi: "ग्रंथ" },
                title: { en: "Baudhayana Shulba Sutra (Sacred Geometry)", hi: "बौधायन शुल्ब सूत्र (वेदी निर्माण की ज्यामिति)" },
                shortTitle: { en: "Shulba Sutra", hi: "शुल्ब सूत्र" },
                sanskrit: "बौधायन शुल्बसूत्रम्",
                badge: "Geometry",
                children: [
                  {
                    id: "kalpa-shulba-1-48",
                    parentId: "kalpa-shulba-sutra",
                    type: "leaf",
                    levelLabel: { en: "Sutra", hi: "सूत्र" },
                    title: { en: "Shulba Sutra 1.48 — Early Geometric Theorem", hi: "शुल्ब सूत्र १.४८ — विकर्ण-रज्जु ज्यामिति प्रमेय" },
                    shortTitle: { en: "Theorem 1.48", hi: "सूत्र १.४८" },
                    sanskrit: "शुल्ब सूत्र १.४८",
                    content: {
                      sanskrit: "दीर्घचतुरश्रस्याक्ष्णया रज्जुः पार्श्वमानी तिर्यङ्मानी च।\nयत् पृथग् भूते कुरुतस्तदुभयं करोति॥",
                      transliteration: "dīrghacaturaśrasyākṣṇayā rajjuḥ pārśvamānī tiryaṅmānī ca |\nyat pṛthag bhūte kurutastadubhayaṃ karoti ||",
                      meaningHi: "एक आयत के विकर्ण की डोरी से बनने वाला क्षेत्र (वर्ग), उसकी पार्श्व भुजा (लंबाई) और तिर्यक भुजा (चौड़ाई) द्वारा पृथक्-पृथक् बनाए गए क्षेत्रों के योग के बराबर होता है। (प्राचीन भारतीय बौधायन प्रमेय)",
                      meaningEn: "The diagonal cord of a rectangle produces by itself an area equal to the sum of the areas produced separately by its length and breadth. (The foundational Indian geometric theorem codified by Baudhayana).",
                      metadata: {
                        author: "Maharshi Baudhayana (महर्षि बौधायन)",
                        shastra: "Shulba Sutra",
                        sutra: "1.48",
                        source: "Baudhayana Shulba Sutra",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Upanishads
      // -----------------------------------------------------------------------
      {
        id: "upanishad",
        parentId: "vedic-knowledge",
        type: "discipline",
        levelLabel: { en: "Philosophical Apex", hi: "उपनिषद् ज्ञान" },
        title: { en: "The Principal Upanishads (दशोपनिषद्)", hi: "मुख्य उपनिषद (दशोपनिषद्)" },
        shortTitle: { en: "Upanishad", hi: "उपनिषद" },
        sanskrit: "उपनिषद् साहित्यम्",
        tagline: {
          en: "Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka",
          hi: "ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य, बृहदारण्यक",
        },
        cardImage: atharvavedaCardImg,
        bannerImage: bannerAltar,
        image: atharvavedaCardImg,
        badge: "108 Texts",
        desc: {
          en: "The culmination of Vedic wisdom (Vedanta), revealing the non-dual identity of the individual soul (Atman) and the ultimate reality (Brahman).",
          hi: "वेद का ज्ञानकांड एवं वेदान्त दर्शन का मूल, जो आत्मतत्त्व और परब्रह्म की एकता का साक्षात्कार कराता है।",
        },
        children: [
          {
            id: "katha-upanishad",
            parentId: "upanishad",
            type: "grantha",
            levelLabel: { en: "Upanishad", hi: "उपनिषद" },
            title: { en: "Katha Upanishad (Yama-Nachiketa Dialogue)", hi: "कठोपनिषद् (यम-नचिकेता संवाद)" },
            shortTitle: { en: "Katha Upanishad", hi: "कठोपनिषद" },
            sanskrit: "कठोपनिषद्",
            badge: "2 Adhyayas",
            desc: {
              en: "The profound inquiry into the mystery of death, immortality, and the chariot allegory of human life.",
              hi: "यमराज और बालक नचिकेता के मध्य मृत्यु के रहस्य, आत्मा की अमरता और जीवन-रथ का अमर संवाद।",
            },
            children: [
              {
                id: "katha-valli-3",
                parentId: "katha-upanishad",
                type: "section",
                levelLabel: { en: "Valli", hi: "वल्ली" },
                title: { en: "Prathama Adhyaya - Tritiya Valli (Ratha Kalpana)", hi: "प्रथम अध्याय: तृतीय वल्ली (जीवन का रथ-रूपक)" },
                shortTitle: { en: "Tritiya Valli", hi: "तृतीय वल्ली" },
                sanskrit: "कठोपनिषद् १.३",
                badge: "Chariot Metaphor",
                children: [
                  {
                    id: "katha-1-3-14",
                    parentId: "katha-valli-3",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Katha 1.3.14 — Uttishthata Jagrata Prapya Varan", hi: "कठोपनिषद् १.३.१४ — उत्तिष्ठत जाग्रत प्राप्य वरान्" },
                    shortTitle: { en: "Uttishthata", hi: "उत्तिष्ठत" },
                    sanskrit: "कठोपनिषद् १.३.१४",
                    content: {
                      sanskrit: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।\nक्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति॥",
                      transliteration: "uttiṣṭhata jāgrata prāpya varānnibodhata |\nkṣurasya dhārā niśitā duratyayā durgaṃ pathastatkavayo vadanti ||",
                      meaningHi: "उठो! जागो! और श्रेष्ठ आत्मज्ञानियों के सान्निध्य में जाकर उस परमतत्त्व को जानो। ज्ञानीजन कहते हैं कि यह मार्ग छुरे की तीक्ष्ण धार के समान अत्यंत दुर्गम और पार करने में कठिन है।",
                      meaningEn: "Arise! Awake! Approach the illumined masters and realize the Supreme Truth! Wise seers declare that this path is as razor-sharp and arduous to tread as the edge of a sharpened blade.",
                      metadata: {
                        upanishad: "Katha Upanishad",
                        adhyaya: "1",
                        valli: "3",
                        mantra: "14",
                        teacher: "Yamaraja (यमराज)",
                        student: "Nachiketa (नचिकेता)",
                        source: "Katha Upanishad 1.3.14",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "mandukya-upanishad",
            parentId: "upanishad",
            type: "grantha",
            levelLabel: { en: "Upanishad", hi: "उपनिषद" },
            title: { en: "Mandukya Upanishad (12 Mantras on OM & 4 States)", hi: "माण्डूक्योपनिषद् (ॐकार एवं चार अवस्थाएँ)" },
            shortTitle: { en: "Mandukya", hi: "माण्डूक्य" },
            sanskrit: "माण्डूक्योपनिषद्",
            badge: "12 Mantras",
            desc: {
              en: "Explores OM through the four states of consciousness: Jagrat (Waking), Svapna (Dreaming), Sushupti (Deep Sleep), and Turiya (Pure Transcendence).",
              hi: "ॐकार के माध्यम से चेतना की चार अवस्थाओं (जाग्रत, स्वप्न, सुषुप्ति और तुरीय) का अद्वितीय विश्लेषण।",
            },
            children: [
              {
                id: "mandukya-turiya-section",
                parentId: "mandukya-upanishad",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "The Four States & OM (Turiya Consciousness)", hi: "चेतना की चार अवस्थाएँ एवं तुरीय तत्त्व" },
                shortTitle: { en: "Turiya State", hi: "तुरीय अवस्था" },
                sanskrit: "तुरीय स्वरूप निरूपणम्",
                badge: "Mantra 7",
                children: [
                  {
                    id: "mandukya-mantra-7",
                    parentId: "mandukya-turiya-section",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Mandukya Mantra 7 — Shantam Shivam Advaitam", hi: "माण्डूक्योपनिषद् मंत्र ७ — शान्तं शिवमद्वैतं" },
                    shortTitle: { en: "Mantra 7", hi: "मंत्र ७" },
                    sanskrit: "माण्डूक्य ७",
                    content: {
                      sanskrit: "नान्तःप्रज्ञं न बहिष्प्रज्ञं नोभयतःप्रज्ञं न प्रज्ञानघनं न प्रज्ञं नाप्रज्ञम्।\nअदृष्टमव्यवहार्यमग्राह्यमलक्षणमचिन्त्यमव्यपदेश्यमेकात्मप्रत्ययसारं प्रपञ्चोपशमं शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः॥",
                      transliteration: "nāntaḥprajñaṃ na bahiṣprajñaṃ nobhayataḥprajñaṃ na prajñānaghanaṃ na prajñaṃ nāprajñam |\nadṛṣṭamavyavahāryamagrāhyamalakṣaṇamacintyamavyapadeśyamekātmapratyayasāraṃ prapañcopaśamaṃ śāntaṃ śivamadvaitaṃ caturthaṃ manyante sa ātmā sa vijñeyaḥ ||",
                      meaningHi: "जो न अंतःप्रज्ञ (स्वप्न) है, न बहिष्प्रज्ञ (जाग्रत), न दोनों; जो न देखा जा सकता है, न व्यवहार में लाया जा सकता है, जो इंद्रियातीत, अचिन्त्य और अनिर्वचनीय है; जो प्रपंच से परे, परम शान्त, शिव (परम मंगलमय) और अद्वैत है—उसे चतुर्थ (तुरीय) अवस्था मानते हैं। वही आत्मा है, वही जानने योग्य है।",
                      meaningEn: "That which is not conscious of inner worlds, nor of outer worlds, nor both; unperceived, beyond worldly dealings, ungraspable, unthinkable, ineffable; the essence of unified Self-consciousness, cessation of all illusion, peaceful, auspicious, and non-dual — That is recognized as the Fourth (Turiya). That is the Self; That is to be realized!",
                      metadata: {
                        upanishad: "Mandukya Upanishad",
                        mantra: "7",
                        subject: "Turiya (The 4th Transcendent State)",
                        source: "Mandukya Upanishad 7",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "chandogya-upanishad",
            parentId: "upanishad",
            type: "grantha",
            levelLabel: { en: "Upanishad", hi: "उपनिषद" },
            title: { en: "Chandogya Upanishad (Contains 'Tat Tvam Asi')", hi: "छान्दोग्योपनिषद् ('तत्त्वमसि' महावाक्य)" },
            shortTitle: { en: "Chandogya", hi: "छान्दोग्य" },
            sanskrit: "छान्दोग्योपनिषद्",
            badge: "8 Prapathakas",
            desc: {
              en: "Contains the dialogue of Uddalaka Aruni to his son Shvetaketu, teaching the great cosmic Mahavakya 'Tat Tvam Asi' (That Thou Art).",
              hi: "उद्दालक आरुणि और उनके पुत्र श्वेतकेतु का प्रसिद्ध प्रसंग, जिसमें 'तत्त्वमसि' का साक्षात्कार कराया गया है।",
            },
            children: [
              {
                id: "chandogya-ch6",
                parentId: "chandogya-upanishad",
                type: "section",
                levelLabel: { en: "Prapathaka", hi: "प्रपाठक" },
                title: { en: "Prapathaka 6: Uddalaka & Shvetaketu ('Tat Tvam Asi')", hi: "षष्ठ प्रपाठक: उद्दालक-श्वेतकेतु संवाद ('तत्त्वमसि')" },
                shortTitle: { en: "Tat Tvam Asi", hi: "तत्त्वमसि" },
                sanskrit: "छान्दोग्योपनिषद् ६.८",
                badge: "Mahavakya",
                children: [
                  {
                    id: "chandogya-6-8-7",
                    parentId: "chandogya-ch6",
                    type: "leaf",
                    levelLabel: { en: "Khanda", hi: "खण्ड" },
                    title: { en: "Chandogya 6.8.7 — Sa Ya Esho'nima Aitadātmyam", hi: "छान्दोग्य ६.८.७ — स य एषोऽणिमा ऐतदात्म्यम्" },
                    shortTitle: { en: "Mantra 6.8.7", hi: "मंत्र ६.८.७" },
                    sanskrit: "छान्दोग्य ६.८.७",
                    content: {
                      sanskrit: "स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो इति॥",
                      transliteration: "sa ya eṣo'ṇimaitadātmyamidaṃ sarvaṃ tatsatyaṃ sa ātmā tattvamasi śvetaketo iti ||",
                      meaningHi: "वह जो यह अत्यंत सूक्ष्म तत्त्व है, यह संपूर्ण जगत उसी की आत्मा वाला है। वही एक शाश्वत सत्य है, वही वास्तविक आत्मा है, और हे श्वेतकेतु! 'वह परमात्मा तुम ही हो' (तत्त्वमसि)।",
                      meaningEn: "'That which is the subtlest essence — in That as its Self does all this world exist. That is the Truth. That is the Atman. And That Art Thou (Tat Tvam Asi), O Shvetaketu!'",
                      metadata: {
                        upanishad: "Chandogya Upanishad",
                        prapathaka: "6",
                        kanda: "8",
                        verse: "7",
                        speaker: "Sage Uddalaka Aruni",
                        listener: "Shvetaketu",
                        source: "Chandogya Upanishad 6.8.7",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ===========================================================================
  // 02. SHASTRA & DARSHANA (SHAD-DARSHANA — THE SIX ORTHODOX SYSTEMS)
  // ===========================================================================
  {
    id: "shastra-darshana",
    number: "02",
    type: "category",
    levelLabel: { en: "Knowledge Area", hi: "ज्ञान क्षेत्र" },
    title: { en: "02. Shastra & Darshana", hi: "०२. शास्त्र एवं दर्शन" },
    shortTitle: { en: "Shastra & Darshana", hi: "शास्त्र एवं दर्शन" },
    sanskrit: "षड्दर्शन एवं शास्त्र",
    tagline: {
      en: "The Six Orthodox Systems of Indian Philosophy: Samkhya, Yoga, Nyaya, Vaisheshika, Mimamsa, Vedanta",
      hi: "भारतीय दर्शन के छह आस्तिक मत: सांख्य, योग, न्याय, वैशेषिक, मीमांसा, वेदान्त",
    },
    cardImage: vastuCardImg,
    bannerImage: bannerSacredDetails,
    image: vastuCardImg,
    badge: "Six Systems",
    desc: {
      en: "The profound analytical traditions of Indian thought examining epistemology (Pramana), metaphysics (Prameya), ethics, and liberation (Moksha).",
      hi: "भारतीय मनीषा के छह दार्शनिक प्रस्थान, जो प्रमाण, तत्त्व-मीमांसा, कर्म सिद्धांत और मोक्ष की सूक्ष्म विवेचना करते हैं।",
    },
    children: [
      // -----------------------------------------------------------------------
      // 1. SAMKHYA DARSHANA — MAHARSHI KAPILA
      // -----------------------------------------------------------------------
      {
        id: "darshana-samkhya",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Samkhya Darshana — Kapila Muni & Samkhya Karika", hi: "सांख्य दर्शन — महर्षि कपिल एवं सांख्यकारिका" },
        shortTitle: { en: "Samkhya", hi: "सांख्य" },
        sanskrit: "सांख्य दर्शनम् (तत्त्वविवेकः)",
        tagline: {
          en: "25 Tattvas · Purusha & Prakriti · Satkaryavada Dualism",
          hi: "२५ तत्त्व · पुरुष एवं प्रकृति · सत्कार्यवाद व तत्त्व-ज्ञान",
        },
        cardImage: astrologyCardImg,
        bannerImage: bannerSacredDetails,
        badge: "25 Tattvas",
        desc: {
          en: "The foundational dualistic philosophy establishing the distinct reality of pure consciousness (Purusha) and cosmic primordial matter (Prakriti), tracing the 25 evolutes of existence.",
          hi: "सृष्टि के २५ मूल तत्त्वों, पुरुष (चेतन) और प्रकृति (जड़) के विवेक-ज्ञान तथा त्रिविध दुःखों की आत्यंतिक निवृत्ति का दार्शनिक प्रस्थान।",
        },
        childLevelName: { en: "Adhyaya", hi: "अध्याय" },
        children: [
          {
            id: "samkhya-adhyaya-1",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 1: Vishaya Adhyaya (Threefold Suffering & 25 Tattvas)", hi: "प्रथम अध्याय: विषय अध्याय (त्रिविध दुःख एवं २५ तत्त्व)" },
            shortTitle: { en: "1. Vishaya", hi: "१. विषय" },
            sanskrit: "विषयाध्यायः (दुःखत्रय-तत्त्वविवेकः)",
            badge: "Sutra 1.1",
            desc: {
              en: "Examines the three types of suffering (Adhyatmika, Adhibhautika, Adhidaivika) and establishes discriminative knowledge as the only ultimate remedy.",
              hi: "आध्यात्मिक, आधिभौतिक और आधिदैविक दुःखों की व्याख्या तथा तत्त्वज्ञान द्वारा आत्यंतिक निवृत्ति।",
            },
            children: [
              {
                id: "samkhya-1-1",
                parentId: "samkhya-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Samkhya Sutra 1.1 — Duhkha-traya-nivrittih", hi: "सांख्यसूत्र १.१ — त्रिविध दुःखनिवृत्ति" },
                shortTitle: { en: "Sutra 1.1", hi: "सूत्र १.१" },
                sanskrit: "सांख्यसूत्रम् १.१",
                badge: "Supreme Purushartha",
                content: {
                  sanskrit: "ॐ अथ त्रिविधदुःखात्यन्तनिवृत्तिरत्यन्तपुरुषार्थः॥",
                  transliteration: "oṃ atha trividhaduḥkhātyantanivṛttiratyantapuruṣārthaḥ ||",
                  meaningHi: "अब, तीनों प्रकार के दुःखों (आध्यात्मिक, आधिभौतिक, आधिदैविक) की अत्यंत और आत्यंतिक निवृत्ति ही मानव जीवन का परम पुरुषार्थ (मोक्ष) है।",
                  meaningEn: "Now, the complete and eternal cessation of the threefold sufferings (bodily/mental, external-material, and cosmic-supernatural) constitutes the supreme goal of human existence (Purushartha).",
                  metadata: {
                    author: "Maharshi Kapila (महर्षि कपिल)",
                    adhyaya: "1 (Vishaya)",
                    sutraNumber: "1",
                    source: "Samkhya Pravachana Sutra 1.1",
                  },
                },
              },
              {
                id: "samkhya-karika-1",
                parentId: "samkhya-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Karika", hi: "कारिका" },
                title: { en: "Samkhya Karika 1 — Inquiry into Suffering", hi: "सांख्यकारिका १ — दुःखत्रयाभिघात जिज्ञासा" },
                shortTitle: { en: "Karika 1", hi: "कारिका १" },
                sanskrit: "सांख्यकारिका १",
                badge: "Ishvarakrishna",
                content: {
                  sanskrit: "दुःखत्रयाभिघाताज्जिज्ञासा तदपघातके हेतौ।\nदृष्टे साऽपार्था चेन्नैकान्त्यात्यन्ततोऽभावात्॥",
                  transliteration: "duḥkhatrayābhighātājjijñāsā tadapaghātake hetau |\ndṛṣṭe sā'pārthā cennaikāntyātyantato'bhāvāt ||",
                  meaningHi: "तीन प्रकार के दुःखों के आघात से उनके निवारण के उपायों को जानने की जिज्ञासा होती है। यद्यपि दृष्ट (लौकिक/औषध आदि) उपाय हैं, फिर भी वे निश्चित और स्थायी समाधान नहीं दे पाते।",
                  meaningEn: "From the torment of the threefold suffering arises the yearning to inquire into the means of its extermination. If it be said that visible remedies exist, we reply: No, because they lack absolute certainty and eternal permanence.",
                  metadata: {
                    author: "Acharya Ishvarakrishna (आचार्य ईश्वरकृष्ण)",
                    text: "Samkhya Karika",
                    verseNumber: "1",
                    source: "Samkhya Karika 1",
                  },
                },
              },
            ],
          },
          {
            id: "samkhya-adhyaya-2",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 2: Pradhana-Karya Adhyaya (Cosmic Evolution)", hi: "द्वितीय अध्याय: प्रधान-कार्य अध्याय (प्रकृति विकासक्रम)" },
            shortTitle: { en: "2. Pradhana", hi: "२. प्रधान" },
            sanskrit: "प्रधानकार्याध्यायः",
            badge: "Evolution",
            desc: {
              en: "The manifestation of Mahat (Intellect), Ahamkara (Ego), Tanmatras (Subtle Essences), and Gross Elements from unmanifest Prakriti.",
              hi: "अव्यक्त प्रकृति से महत्तत्त्व (बुद्धि), अहंकार, पञ्चतन्मात्राएँ एवं महाभूतों की उत्पत्ति का वैज्ञानिक क्रम।",
            },
          },
          {
            id: "samkhya-adhyaya-3",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 3: Vairagya Adhyaya (Dispassion & Subtle Body)", hi: "तृतीय अध्याय: वैराग्य अध्याय (लिंग शरीर एवं वैराग्य)" },
            shortTitle: { en: "3. Vairagya", hi: "३. वैराग्य" },
            sanskrit: "वैराग्याध्यायः",
            badge: "Vairagya",
            desc: {
              en: "The transmigrating subtle body (Linga Sharira), cycle of rebirths, and cultivating supreme dispassion for material embodiments.",
              hi: "संसार चक्र में भ्रमण करने वाले १८ तत्त्वीय लिंग शरीर का स्वरूप एवं वैराग्य का साधन।",
            },
          },
          {
            id: "samkhya-adhyaya-4",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 4: Akhyayika Adhyaya (Illustrative Parables)", hi: "चतुर्थ अध्याय: आख्यायिका अध्याय (दृष्टांत एवं कथाएँ)" },
            shortTitle: { en: "4. Akhyayika", hi: "४. आख्यायिका" },
            sanskrit: "आख्यायिकाध्यायः",
            badge: "Stories",
            desc: {
              en: "Practical allegories and philosophical parables illuminating self-realization and detachment from nature.",
              hi: "राजपुत्र-व्याध दृष्टांत जैसे प्रेरक आख्यानों द्वारा तत्त्वज्ञान और आत्म-साक्षात्कार का सुगम निरूपण।",
            },
          },
          {
            id: "samkhya-adhyaya-5",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 5: Parapaksha-Nirasa (Dialectical Defense)", hi: "पञ्चम अध्याय: परपक्ष-निरास (विरोधी मतों का खंडन)" },
            shortTitle: { en: "5. Parapaksha", hi: "५. परपक्ष-निरास" },
            sanskrit: "परपक्षनिरासाध्यायः",
            badge: "Dialectics",
            desc: {
              en: "Systematic philosophical refutation of non-dualism, nihilism, and materialist objections against Samkhya dualism.",
              hi: "सांख्य के सत्कार्यवाद और पुरुष-बहुत्व के पक्ष में तार्किक प्रमाण तथा चार्वाक-बौद्ध मतों का खंडन।",
            },
          },
          {
            id: "samkhya-adhyaya-6",
            parentId: "darshana-samkhya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 6: Tantra-Sara Adhyaya (Supreme Kaivalya)", hi: "षष्ठ अध्याय: तंत्र-सार अध्याय (कैवल्य एवं मुक्ति)" },
            shortTitle: { en: "6. Tantra-Sara", hi: "६. तंत्र-सार" },
            sanskrit: "तन्त्रसाराध्यायः (कैवल्य-सिद्धिः)",
            badge: "Kaivalya",
            desc: {
              en: "Summary of foundational tenets, eternal freedom of Purusha, and dissolution of ignorance leading to Kaivalya.",
              hi: "प्रकृति-पुरुष के पूर्ण भेद का साक्षात्कार होने पर आत्मा की नित्य, शुद्ध, बुद्ध, मुक्त कैवल्य अवस्था।",
            },
          },
        ],
      },

      // -----------------------------------------------------------------------
      // 2. YOGA DARSHANA — MAHARSHI PATANJALI (ALL 4 PADAS)
      // -----------------------------------------------------------------------
      {
        id: "darshana-yoga",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Yoga Darshana — Patanjali Yoga Sutra", hi: "योग दर्शन — महर्षि पतंजलि कृत योगसूत्र" },
        shortTitle: { en: "Yoga", hi: "योग" },
        sanskrit: "पातञ्जल योगसूत्रम् (अष्टांग योग)",
        tagline: {
          en: "4 Padas · 196 Aphorisms on Mind Mastery, Meditation & Samadhi",
          hi: "४ पाद · १९६ सूत्र · चित्तवृत्ति निरोध, अष्टांग योग एवं कैवल्य",
        },
        cardImage: atharvavedaCardImg,
        bannerImage: bannerRitualSetup,
        badge: "4 Padas · 196 Sutras",
        desc: {
          en: "The classical science of consciousness, mind control, ethical lifestyle, meditation, and spiritual liberation through Ashtanga Yoga.",
          hi: "चित्त की वृत्तियों के निरोध, अष्टांग योग (यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान, समाधि) और कैवल्य का अमर ग्रंथ।",
        },
        childLevelName: { en: "Pada", hi: "पाद" },
        children: [
          // 1. Samadhi Pada
          {
            id: "yoga-pada-1",
            parentId: "darshana-yoga",
            type: "division",
            levelLabel: { en: "Pada", hi: "पाद" },
            title: { en: "Samadhi Pada (51 Sutras on Contemplation)", hi: "समाधि पाद (५१ सूत्र — योग स्वरूप एवं समाधि)" },
            shortTitle: { en: "1. Samadhi Pada", hi: "१. समाधि पाद" },
            sanskrit: "समाधिपादः",
            badge: "51 Sutras",
            desc: {
              en: "Defines the nature of Yoga, stilling of mental modifications (Chitta Vritti Nirodha), practice and dispassion (Abhyasa & Vairagya), and stages of Samadhi.",
              hi: "योग की परिभाषा, चित्तवृत्तियों के पाँच प्रकार, अभ्यास और वैराग्य तथा सम्प्रज्ञात व असम्प्रज्ञात समाधि के भेद।",
            },
            children: [
              {
                id: "yoga-1-1",
                parentId: "yoga-pada-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 1.1 — Atha Yoganushasanam", hi: "योगसूत्र १.१ — अथ योगानुशासनम्" },
                shortTitle: { en: "Sutra 1.1", hi: "सूत्र १.१" },
                sanskrit: "योगसूत्रम् १.१",
                badge: "Beginning",
                content: {
                  sanskrit: "ॐ अथ योगानुशासनम्॥",
                  transliteration: "oṃ atha yogānuśāsanam ||",
                  meaningHi: "अब, अंतर्मुखी होकर, योग के उस परम आत्मानुशासन का शुभारंभ होता है जो जीवन को शुद्धता और समाधि की ओर ले जाता है।",
                  meaningEn: "Now, the sacred instruction and disciplined practice of Yoga is commenced.",
                  metadata: {
                    pada: "1 (Samadhi Pada)",
                    sutraNumber: "1",
                    author: "Maharshi Patanjali (महर्षि पतंजलि)",
                    subject: "Yoganushasana (Beginning of Discipline)",
                    source: "Patanjali Yoga Sutra 1.1",
                  },
                },
              },
              {
                id: "yoga-1-2",
                parentId: "yoga-pada-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 1.2 — Yogash Chitta Vritti Nirodhah", hi: "योगसूत्र १.२ — योगश्चित्तवृत्तिनिरोधः" },
                shortTitle: { en: "Sutra 1.2", hi: "सूत्र १.२" },
                sanskrit: "योगसूत्रम् १.२",
                badge: "Definition",
                content: {
                  sanskrit: "योगश्चित्तवृत्तिनिरोधः॥",
                  transliteration: "yogaścittavṛttinirodhaḥ ||",
                  meaningHi: "चित्त (मन, बुद्धि और अहंकार) की वृत्तियों (विचार-तरंगों) का पूर्ण निरोध हो जाना ही 'योग' है।",
                  meaningEn: "Yoga is the intentional stilling and mastery of the fluctuating waves and modifications of consciousness (Chitta).",
                  metadata: {
                    pada: "1 (Samadhi Pada)",
                    sutraNumber: "2",
                    author: "Maharshi Patanjali",
                    subject: "Essence & Definition of Yoga",
                    source: "Patanjali Yoga Sutra 1.2",
                  },
                },
              },
              {
                id: "yoga-1-3",
                parentId: "yoga-pada-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 1.3 — Tada Drashtuh Svarupe Avasthanam", hi: "योगसूत्र १.३ — तदा द्रष्टुः स्वरूपेऽवस्थानम्" },
                shortTitle: { en: "Sutra 1.3", hi: "सूत्र १.३" },
                sanskrit: "योगसूत्रम् १.३",
                badge: "Self-Abidance",
                content: {
                  sanskrit: "तदा द्रष्टुः स्वरूपेऽवस्थानम्॥",
                  transliteration: "tadā draṣṭuḥ svarūpe'vasthānam ||",
                  meaningHi: "तब (चित्तवृत्तियों के शांत होने पर) द्रष्टा (चेतन आत्मा) अपने वास्तविक स्वरूप में प्रतिष्ठित हो जाता है।",
                  meaningEn: "Then the Seer (pure consciousness / Purusha) abides steadfastly in its own true, unconditioned nature.",
                  metadata: {
                    pada: "1 (Samadhi Pada)",
                    sutraNumber: "3",
                    author: "Maharshi Patanjali",
                    subject: "Self-Abidance of Consciousness",
                    source: "Patanjali Yoga Sutra 1.3",
                  },
                },
              },
            ],
          },
          // 2. Sadhana Pada
          {
            id: "yoga-pada-2",
            parentId: "darshana-yoga",
            type: "division",
            levelLabel: { en: "Pada", hi: "पाद" },
            title: { en: "Sadhana Pada (55 Sutras on Practice & Ashtanga Yoga)", hi: "साधन पाद (५५ सूत्र — क्रियायोग एवं अष्टांग योग)" },
            shortTitle: { en: "2. Sadhana Pada", hi: "२. साधन पाद" },
            sanskrit: "साधनपादः",
            badge: "55 Sutras",
            desc: {
              en: "Presents Kriya Yoga (Tapas, Svadhyaya, Ishvara Pranidhana), the 5 Kleshas (afflictions), and the practical eightfold path of Ashtanga Yoga.",
              hi: "क्रियायोग (तप, स्वाध्याय, ईश्वर-प्रणिधान), पञ्चक्लेश (अविद्या, अस्मिता, राग, द्वेष, अभिनिवेश) तथा अष्टांग योग के आठ अंगों का विधान।",
            },
            children: [
              {
                id: "yoga-2-1",
                parentId: "yoga-pada-2",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 2.1 — Kriya Yoga", hi: "योगसूत्र २.१ — क्रियायोग लक्षण" },
                shortTitle: { en: "Sutra 2.1", hi: "सूत्र २.१" },
                sanskrit: "योगसूत्रम् २.१",
                badge: "Kriya Yoga",
                content: {
                  sanskrit: "तपःस्वाध्यायेश्वरप्रणिधानानि क्रियायोगः॥",
                  transliteration: "tapaḥsvādhyāyeśvarapraṇidhānāni kriyāyogaḥ ||",
                  meaningHi: "तप, स्वाध्याय और ईश्वर-प्रणिधान (ईश्वर के प्रति आत्म-समर्पण)—ये तीनों मिलकर 'क्रियायोग' कहलाते हैं।",
                  meaningEn: "Austerity (Tapas), study of sacred wisdom and self-inquiry (Svadhyaya), and total surrender to the Divine (Ishvara Pranidhana) constitute Kriya Yoga.",
                  metadata: {
                    pada: "2 (Sadhana Pada)",
                    sutraNumber: "1",
                    author: "Maharshi Patanjali",
                    subject: "Kriya Yoga Practice",
                    source: "Patanjali Yoga Sutra 2.1",
                  },
                },
              },
              {
                id: "yoga-2-28",
                parentId: "yoga-pada-2",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 2.28 — Fruit of Yoga Limbs", hi: "योगसूत्र २.२८ — योगाङ्गानुष्ठान फल" },
                shortTitle: { en: "Sutra 2.28", hi: "सूत्र २.२८" },
                sanskrit: "योगसूत्रम् २.२८",
                badge: "Wisdom Light",
                content: {
                  sanskrit: "योगाङ्गानुष्ठानादशुद्धिक्षये ज्ञानदीप्तिराविवेकख्यातेः॥",
                  transliteration: "yogāṅgānuṣṭhānādaśuddhikṣaye jñānadīptirāvivekakhyāteḥ ||",
                  meaningHi: "योग के अंगों का निरंतर अनुष्ठान करने से अशुद्धियों का क्षय होता है और विवेकख्याति (सत्य-ज्ञान) पर्यन्त ज्ञान का दिव्य प्रकाश प्रकाशित होता है।",
                  meaningEn: "By the sustained practice of the limbs of Yoga, as spiritual impurities dissolve, the effulgence of wisdom shines forth until discriminative discernment (Viveka-khyati) is attained.",
                  metadata: {
                    pada: "2 (Sadhana Pada)",
                    sutraNumber: "28",
                    author: "Maharshi Patanjali",
                    subject: "Attainment of Discriminative Wisdom",
                    source: "Patanjali Yoga Sutra 2.28",
                  },
                },
              },
              {
                id: "yoga-2-29",
                parentId: "yoga-pada-2",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 2.29 — The Eight Limbs (Ashtanga Yoga)", hi: "योगसूत्र २.२९ — अष्टांग योग के आठ अंग" },
                shortTitle: { en: "Sutra 2.29", hi: "सूत्र २.२९" },
                sanskrit: "योगसूत्रम् २.२९",
                badge: "Ashtanga",
                content: {
                  sanskrit: "यमनियमासनप्राणायामप्रत्याहारधारणाध्यानसमाधयोऽष्टावङ्गानि॥",
                  transliteration: "yamaniyamāsanaprāṇāyāmapratyāhāradhāraṇādhyānasamādhayo'ṣṭāvaṅgāni ||",
                  meaningHi: "यम (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह), नियम (शौच, संतोष, तप, स्वाध्याय, ईश्वरप्रणिधान), आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान और समाधि—ये योग के आठ अंग हैं।",
                  meaningEn: "Yama (moral restraints), Niyama (positive observances), Asana (posture), Pranayama (breath regulation), Pratyahara (sense withdrawal), Dharana (concentration), Dhyana (meditation), and Samadhi (absorption) are the eight limbs of Yoga.",
                  metadata: {
                    pada: "2 (Sadhana Pada)",
                    sutraNumber: "29",
                    author: "Maharshi Patanjali",
                    subject: "The 8 Limbs of Ashtanga Yoga",
                    source: "Patanjali Yoga Sutra 2.29",
                  },
                },
              },
            ],
          },
          // 3. Vibhuti Pada
          {
            id: "yoga-pada-3",
            parentId: "darshana-yoga",
            type: "division",
            levelLabel: { en: "Pada", hi: "पाद" },
            title: { en: "Vibhuti Pada (55 Sutras on Antaranga Yoga & Powers)", hi: "विभूति पाद (५५ सूत्र — अंतरंग योग, संयम एवं विभूतियाँ)" },
            shortTitle: { en: "3. Vibhuti Pada", hi: "३. विभूति पाद" },
            sanskrit: "विभूतिपादः",
            badge: "55 Sutras",
            desc: {
              en: "Explores the internal limbs (Dharana, Dhyana, Samadhi), their collective mastery known as Samyama, and the supernormal faculties and powers (Vibhutis).",
              hi: "अंतरंग योग के तीन अंग (धारणा, ध्यान, समाधि), उनकी संयुक्त अवस्था 'संयम' तथा चेतना के विस्तार से प्राप्त होने वाली विभूतियों का विवेचन।",
            },
            children: [
              {
                id: "yoga-3-1",
                parentId: "yoga-pada-3",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 3.1 — Dharana (Concentration)", hi: "योगसूत्र ३.१ — धारणा लक्षण" },
                shortTitle: { en: "Sutra 3.1", hi: "सूत्र ३.१" },
                sanskrit: "योगसूत्रम् ३.१",
                badge: "Concentration",
                content: {
                  sanskrit: "देशबन्धश्चित्तस्य धारणा॥",
                  transliteration: "deśabandhaścittasya dhāraṇā ||",
                  meaningHi: "चित्त को किसी एक निश्चित स्थान या ध्येय विषय (हृदय, नासिकाग्र, भ्रूमध्य आदि) पर स्थिर करना ही 'धारणा' है।",
                  meaningEn: "Dharana (concentration) is the binding and focusing of the mind upon a single point or focal region.",
                  metadata: {
                    pada: "3 (Vibhuti Pada)",
                    sutraNumber: "1",
                    author: "Maharshi Patanjali",
                    subject: "Dharana (Concentration)",
                    source: "Patanjali Yoga Sutra 3.1",
                  },
                },
              },
              {
                id: "yoga-3-2",
                parentId: "yoga-pada-3",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 3.2 — Dhyana (Meditation)", hi: "योगसूत्र ३.२ — ध्यान लक्षण" },
                shortTitle: { en: "Sutra 3.2", hi: "सूत्र ३.२" },
                sanskrit: "योगसूत्रम् ३.२",
                badge: "Meditation",
                content: {
                  sanskrit: "तत्र प्रत्ययैकतानता ध्यानम्॥",
                  transliteration: "tatra pratyayaikatānatā dhyānam ||",
                  meaningHi: "उस ध्येय विषय में चित्त-वृत्ति का बिना किसी बाधा के अखंड एकतार (तैलधारावत्) प्रवाहित रहना ही 'ध्यान' कहलाता है।",
                  meaningEn: "Dhyana (meditation) is the steady, uninterrupted flow of awareness toward that focal object.",
                  metadata: {
                    pada: "3 (Vibhuti Pada)",
                    sutraNumber: "2",
                    author: "Maharshi Patanjali",
                    subject: "Dhyana (Meditation)",
                    source: "Patanjali Yoga Sutra 3.2",
                  },
                },
              },
              {
                id: "yoga-3-3",
                parentId: "yoga-pada-3",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 3.3 — Samadhi (Absorption)", hi: "योगसूत्र ३.३ — समाधि लक्षण" },
                shortTitle: { en: "Sutra 3.3", hi: "सूत्र ३.३" },
                sanskrit: "योगसूत्रम् ३.३",
                badge: "Samadhi",
                content: {
                  sanskrit: "तदेवार्थमात्रनिर्भासं स्वरूपशून्यमिव समाधिः॥",
                  transliteration: "tadevārthamātranirbhāsaṃ svarūpaśūnyamiva samādhiḥ ||",
                  meaningHi: "जब ध्यान की अवस्था में केवल ध्येय-विषय ही प्रकाशित रहता है और ध्याता का अपना स्वरूप मानो शून्य (विलीन) हो जाता है, वही 'समाधि' है।",
                  meaningEn: "When in meditation only the essence of the object shines forth, as if the meditating consciousness has dissolved its own individuality, that is Samadhi.",
                  metadata: {
                    pada: "3 (Vibhuti Pada)",
                    sutraNumber: "3",
                    author: "Maharshi Patanjali",
                    subject: "Samadhi (Spiritual Absorption)",
                    source: "Patanjali Yoga Sutra 3.3",
                  },
                },
              },
              {
                id: "yoga-3-4",
                parentId: "yoga-pada-3",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 3.4 — Samyama", hi: "योगसूत्र ३.४ — संयम लक्षण" },
                shortTitle: { en: "Sutra 3.4", hi: "सूत्र ३.४" },
                sanskrit: "योगसूत्रम् ३.४",
                badge: "Samyama",
                content: {
                  sanskrit: "त्रयमेकत्र संयमः॥",
                  transliteration: "trayamekatra saṃyamaḥ ||",
                  meaningHi: "धारणा, ध्यान और समाधि—जब ये तीनों एक ही लक्ष्य पर एक साथ सिद्ध होते हैं, तब उसे 'संयम' कहा जाता है।",
                  meaningEn: "The simultaneous application and mastery of these three internal limbs (Dharana, Dhyana, and Samadhi) upon a single object constitutes Samyama.",
                  metadata: {
                    pada: "3 (Vibhuti Pada)",
                    sutraNumber: "4",
                    author: "Maharshi Patanjali",
                    subject: "Samyama (The Three Internal Limbs)",
                    source: "Patanjali Yoga Sutra 3.4",
                  },
                },
              },
            ],
          },
          // 4. Kaivalya Pada
          {
            id: "yoga-pada-4",
            parentId: "darshana-yoga",
            type: "division",
            levelLabel: { en: "Pada", hi: "पाद" },
            title: { en: "Kaivalya Pada (34 Sutras on Liberation)", hi: "कैवल्य पाद (३४ सूत्र — वासना-क्षय एवं कैवल्य)" },
            shortTitle: { en: "4. Kaivalya Pada", hi: "४. कैवल्य पाद" },
            sanskrit: "कैवल्यपादः",
            badge: "34 Sutras",
            desc: {
              en: "The profound metaphysics of karma, latent subconscious impressions (Vasanas), Dharmamegha Samadhi, and the absolute liberation (Kaivalya) of Purusha.",
              hi: "कर्म के प्रकार, संस्कारों एवं वासनाओं का क्षय, धर्ममेघ समाधि तथा पुरुष का प्रकृति से विलग होकर विशुद्ध कैवल्य में स्थित होना।",
            },
            children: [
              {
                id: "yoga-4-1",
                parentId: "yoga-pada-4",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 4.1 — Five Origins of Siddhis", hi: "योगसूत्र ४.१ — सिद्धियों के पाँच साधन" },
                shortTitle: { en: "Sutra 4.1", hi: "सूत्र ४.१" },
                sanskrit: "योगसूत्रम् ४.१",
                badge: "Siddhis",
                content: {
                  sanskrit: "जन्मौषधिमन्त्रतपःसमाधिजाः सिद्धयः॥",
                  transliteration: "janmauṣadhimantratapaḥsamādhijāḥ siddhayaḥ ||",
                  meaningHi: "अलौकिक सिद्धियाँ पाँच प्रकार से प्रकट होती हैं: जन्म से, विशेष औषधियों के सेवन से, मंत्र-जप से, तीव्र तपस्या से अथवा समाधि के अभ्यास से।",
                  meaningEn: "Supernormal powers and intuitive capacities (Siddhis) arise through past-life birth, medicinal herbs, sacred mantras, intense tapas (austerity), or the depth of Samadhi.",
                  metadata: {
                    pada: "4 (Kaivalya Pada)",
                    sutraNumber: "1",
                    author: "Maharshi Patanjali",
                    subject: "Five Origins of Siddhis",
                    source: "Patanjali Yoga Sutra 4.1",
                  },
                },
              },
              {
                id: "yoga-4-34",
                parentId: "yoga-pada-4",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Yoga Sutra 4.34 — Supreme Kaivalya (The Climax)", hi: "योगसूत्र ४.३४ — परम कैवल्य स्वरूप" },
                shortTitle: { en: "Sutra 4.34", hi: "सूत्र ४.३४" },
                sanskrit: "योगसूत्रम् ४.३४",
                badge: "Final Liberation",
                content: {
                  sanskrit: "पुरुषार्थशून्यानां गुणानां प्रतिप्रसवः कैवल्यं स्वरूपप्रतिष्ठा वा चितिशक्तिरिति॥",
                  transliteration: "puruṣārthaśūnyānāṃ guṇānāṃ pratiprasavaḥ kaivalyaṃ svarūpapratiṣṭhā vā citiśaktiriti ||",
                  meaningHi: "पुरुष के लिए कर्तव्य-रहित हुए तीनों गुणों का प्रकृति में लीन हो जाना ही 'कैवल्य' है, अथवा विशुद्ध चेतन-शक्ति (पुरुष) का अपने स्वरूप में प्रतिष्ठित हो जाना ही मोक्ष है।",
                  meaningEn: "Kaivalya (supreme liberation) is the involution of the three Gunas back into dormant nature having accomplished their purpose for Purusha, or the eternal abiding of the power of pure consciousness in its own pristine nature.",
                  metadata: {
                    pada: "4 (Kaivalya Pada)",
                    sutraNumber: "34",
                    author: "Maharshi Patanjali",
                    subject: "Supreme Kaivalya (Ultimate Liberation)",
                    source: "Patanjali Yoga Sutra 4.34",
                  },
                },
              },
            ],
          },
        ],
      },

      // -----------------------------------------------------------------------
      // 3. NYAYA DARSHANA — MAHARSHI AKSHAPADA GAUTAMA (5 ADHYAYAS)
      // -----------------------------------------------------------------------
      {
        id: "darshana-nyaya",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Nyaya Darshana — Akshapada Gautama Nyaya Sutra", hi: "न्याय दर्शन — महर्षि अक्षपाद गौतम कृत न्यायसूत्र" },
        shortTitle: { en: "Nyaya", hi: "न्याय" },
        sanskrit: "न्याय दर्शनम् (तर्कशास्त्रम्)",
        tagline: { en: "5 Adhyayas · 4 Pramanas · Formal Logic & 16 Padarthas", hi: "५ अध्याय · ४ प्रमाण · तर्कशास्त्र एवं षोडश पदार्थ" },
        badge: "5 Adhyayas · 528 Sutras",
        cardImage: astrologyCardImg,
        bannerImage: bannerSacredDetails,
        desc: {
          en: "The classical school of Indian epistemology, formal logic, and debate, examining reality through 4 valid instruments of knowledge (Pramanas) and 16 philosophical categories (Padarthas).",
          hi: "सत्य की परीक्षा करने वाली तर्क-पद्धति, चार प्रमाण (प्रत्यक्ष, अनुमान, उपमान, शब्द) और १६ पदार्थों के तत्त्वज्ञान द्वारा मोक्ष (निःश्रेयस) का प्रतिपादक दर्शन।",
        },
        childLevelName: { en: "Adhyaya", hi: "अध्याय" },
        children: [
          {
            id: "nyaya-adhyaya-1",
            parentId: "darshana-nyaya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 1: Epistemology & 16 Categories (61 Sutras)", hi: "प्रथम अध्याय: षोडश पदार्थ, ४ प्रमाण एवं ५ अवयव" },
            shortTitle: { en: "1. Epistemology", hi: "१. प्रमाण-पदार्थ" },
            sanskrit: "प्रथमोऽध्यायः (प्रमाण-पदार्थ निरूपण)",
            badge: "61 Sutras",
            desc: {
              en: "Sets forth the 16 Padarthas, the 4 valid means of knowledge (Pramanas), and the 5-membered syllogism (Pancha-Avayava).",
              hi: "१६ पदार्थ, ४ प्रमाण, पाँच अवयवों वाला तार्किक अनुमान और वाद-जल्प-वितण्डा के नियम।",
            },
            children: [
              {
                id: "nyaya-1-1-1",
                parentId: "nyaya-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Nyaya Sutra 1.1.1 — 16 Padarthas of Truth", hi: "न्यायसूत्र १.१.१ — षोडश पदार्थ एवं निःश्रेयस" },
                shortTitle: { en: "Sutra 1.1.1", hi: "सूत्र १.१.१" },
                sanskrit: "न्यायसूत्रम् १.१.१",
                badge: "16 Padarthas",
                content: {
                  sanskrit: "प्रमाणप्रमेयसंशयप्रयोजनदृष्टान्तसिद्धान्तावयवतर्कनिर्णयवादजल्पवितण्डाहेत्वाभासच्छलजातिनिग्रहस्थानानां तत्त्वज्ञानान्निःश्रेयसाधिगमः॥",
                  transliteration: "pramāṇaprameyasaṃśayaprayojanadṛṣṭāntasiddhāntāvayavatarkaniirṇayavādajalpavitaṇḍāhetvābhāsacchalajātiniigrahasthānānāṃ tattvajñānānniḥśreyasādhigamaḥ ||",
                  meaningHi: "प्रमाण, प्रमेय, संशय, प्रयोजन, दृष्टान्त, सिद्धान्त, अवयव, तर्क, निर्णय, वाद, जल्प, वितण्डा, हेत्वाभास, छल, जाति और निग्रहस्थान—इन १६ पदार्थों के तत्त्वज्ञान से निःश्रेयस (मोक्ष) की प्राप्ति होती है।",
                  meaningEn: "Supreme liberation (Nihshreyasa) is attained through exact epistemological knowledge of the sixteen categories: instruments of knowledge, objects of knowledge, doubt, purpose, familiar instances, established tenets, components of syllogism, dialectical reasoning, ascertainment, discussion, dispute, cavil, fallacies, quibble, futile objections, and grounds of defeat.",
                  metadata: {
                    author: "Maharshi Akshapada Gautama",
                    adhyaya: "1",
                    ahnika: "1",
                    sutraNumber: "1",
                    subject: "The 16 Padarthas for Liberation",
                    source: "Nyaya Sutra 1.1.1",
                  },
                },
              },
              {
                id: "nyaya-1-1-3",
                parentId: "nyaya-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Nyaya Sutra 1.1.3 — The Four Means of Valid Knowledge", hi: "न्यायसूत्र १.१.३ — चार प्रमाण" },
                shortTitle: { en: "Sutra 1.1.3", hi: "सूत्र १.१.३" },
                sanskrit: "न्यायसूत्रम् १.१.३",
                badge: "4 Pramanas",
                content: {
                  sanskrit: "प्रत्यक्षानुमानोपमानशब्दाः प्रमाणानि॥",
                  transliteration: "pratyakṣānumānopamānaśabdāḥ pramāṇāni ||",
                  meaningHi: "प्रत्यक्ष (इन्द्रिय-बोध), अनुमान (तार्किक निष्कर्ष), उपमान (सादृश्य) और शब्द (आप्त-वचन)—ये चार ही ज्ञान प्राप्ति के यथार्थ प्रमाण हैं।",
                  meaningEn: "Perception (Pratyaksha), Inference (Anumana), Comparison (Upamana), and Verbal Testimony (Shabda) are the four valid means of knowledge.",
                  metadata: {
                    author: "Maharshi Akshapada Gautama",
                    adhyaya: "1",
                    ahnika: "1",
                    sutraNumber: "3",
                    subject: "The 4 Pramanas",
                    source: "Nyaya Sutra 1.1.3",
                  },
                },
              },
            ],
          },
          {
            id: "nyaya-adhyaya-2",
            parentId: "darshana-nyaya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 2: Doubt & Pramana Examination (137 Sutras)", hi: "द्वितीय अध्याय: संशय एवं प्रमाणों की सूक्ष्म परीक्षा" },
            shortTitle: { en: "2. Pramana Examination", hi: "२. प्रमाण-परीक्षा" },
            sanskrit: "द्वितीयोऽध्यायः (प्रमाण-परीक्षा)",
            badge: "137 Sutras",
            desc: {
              en: "Resolves philosophical doubts concerning perception, inference, analogy, and establishes the divine authority of the Vedas.",
              hi: "संशय का समाधान, प्रत्यक्ष व अनुमान की सत्यता तथा वेदों के अपौरुषेय प्रामाण्य की तार्किक सिद्धि।",
            },
          },
          {
            id: "nyaya-adhyaya-3",
            parentId: "darshana-nyaya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 3: The Self (Atman), Body & Senses (145 Sutras)", hi: "तृतीय अध्याय: आत्मा, शरीर, इन्द्रिय एवं मन परीक्षा" },
            shortTitle: { en: "3. The Self", hi: "३. आत्मा एवं इन्द्रिय" },
            sanskrit: "तृतीयोऽध्यायः (प्रमेय-परीक्षा: आत्मा)",
            badge: "145 Sutras",
            desc: {
              en: "Rigorous logical proofs demonstrating that the Self (Atman) is eternal, sentient, and distinct from the physical body, sense organs, and mind.",
              hi: "आत्मा के नित्य, चेतन और शरीर-इन्द्रियों से भिन्न होने के अकाट्य तार्किक प्रमाण।",
            },
          },
          {
            id: "nyaya-adhyaya-4",
            parentId: "darshana-nyaya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 4: Rebirth, Doshas & Apavarga (118 Sutras)", hi: "चतुर्थ अध्याय: दोष, कर्म, पुनर्जन्म एवं अपवर्ग (मोक्ष)" },
            shortTitle: { en: "4. Liberation", hi: "४. अपवर्ग (मोक्ष)" },
            sanskrit: "चतुर्थोऽध्यायः (दोष-कर्म-अपवर्ग)",
            badge: "118 Sutras",
            desc: {
              en: "Analyzes psychological defects (Raga, Dvesha, Moha), the cycle of karma, and the attainment of Apavarga (final emancipation).",
              hi: "दोषों (राग-द्वेष-मोह) का क्षय, कर्मबंधन से मुक्ति तथा आत्यंतिक दुःखनिवृत्ति रूप अपवर्ग।",
            },
          },
          {
            id: "nyaya-adhyaya-5",
            parentId: "darshana-nyaya",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 5: Dialectics (Jati & Nigrahasthana) (67 Sutras)", hi: "पञ्चम अध्याय: वाद-दोष, जाति (२४) एवं निग्रहस्थान (२२)" },
            shortTitle: { en: "5. Dialectics", hi: "५. वाद-नियम" },
            sanskrit: "पञ्चमोऽध्यायः (जाति-निग्रहस्थान निरूपण)",
            badge: "67 Sutras",
            desc: {
              en: "The classical science of debate: 24 futile objections (Jatis) and 22 grounds of philosophical defeat (Nigrahasthanas).",
              hi: "शास्त्रार्थ के नियम, असंगत कुतर्क के २४ भेद (जाति) तथा पराजय के २२ आधार (निग्रहस्थान)।",
            },
          },
        ],
      },

      // -----------------------------------------------------------------------
      // 4. VAISHESHIKA DARSHANA — MAHARSHI KANADA (10 ADHYAYAS)
      // -----------------------------------------------------------------------
      {
        id: "darshana-vaisheshika",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Vaisheshika Darshana — Kanada Vaisheshika Sutra", hi: "वैशेषिक दर्शन — महर्षि कणाद कृत वैशेषिक सूत्र" },
        shortTitle: { en: "Vaisheshika", hi: "वैशेषिक" },
        sanskrit: "वैशेषिक दर्शनम् (परमाणुवाद)",
        tagline: { en: "10 Adhyayas · Atomic Physics, 9 Dravyas & 7 Padarthas", hi: "१० अध्याय · परमाणुवाद, नव द्रव्य एवं सप्त पदार्थ" },
        badge: "10 Adhyayas · 370 Sutras",
        cardImage: vastuCardImg,
        bannerImage: bannerSacredDetails,
        desc: {
          en: "The ancient Indian physical ontology and atomic naturalism founded by Maharshi Kanada, systematically classifying all physical reality into Padarthas (Substance, Quality, Action, Generality, Particularity, Inherence, and Non-existence).",
          hi: "महर्षि कणाद (उलूक) द्वारा प्रतिपादित परमाणुवाद और भौतिक विज्ञान। संपूर्ण दृश्य-अदृश्य जगत के मूल द्रव्यों, गुणों और परमाणुओं का वैज्ञानिक वर्गीकरण।",
        },
        childLevelName: { en: "Adhyaya", hi: "अध्याय" },
        children: [
          {
            id: "vaisheshika-adhyaya-1",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 1: Definition of Dharma & The 6 Padarthas (64 Sutras)", hi: "प्रथम अध्याय: धर्म लक्षण, द्रव्य, गुण और कर्म" },
            shortTitle: { en: "1. Dharma & Padarthas", hi: "१. धर्म एवं पदार्थ" },
            sanskrit: "प्रथमोऽध्यायः (धर्म एवं षट्पदार्थ)",
            badge: "64 Sutras",
            desc: {
              en: "Defines Dharma as that which brings temporal flourishing (Abhyudaya) and supreme spiritual liberation (Nihshreyasa), and introduces the categories of existence.",
              hi: "अभ्युदय और निःश्रेयस की सिद्धि कराने वाले धर्म का निरूपण तथा द्रव्य, गुण और कर्म का वर्गीकरण।",
            },
            children: [
              {
                id: "vaisheshika-1-1-1",
                parentId: "vaisheshika-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Vaisheshika Sutra 1.1.1 — Athato Dharmam Vyakhyasyamah", hi: "वैशेषिक सूत्र १.१.१ — अथ धर्म व्याख्या" },
                shortTitle: { en: "Sutra 1.1.1", hi: "सूत्र १.१.१" },
                sanskrit: "वैशेषिकसूत्रम् १.१.१",
                badge: "Beginning",
                content: {
                  sanskrit: "ॐ अथातो धर्मं व्याख्यास्यामः॥",
                  transliteration: "oṃ athāto dharmaṃ vyākhyāsyāmaḥ ||",
                  meaningHi: "अब इसके अनंतर हम धर्म का सम्यक् और यथार्थ निरूपण करेंगे।",
                  meaningEn: "Now, therefore, we shall systematically examine and explain the nature of Dharma.",
                  metadata: {
                    author: "Maharshi Kanada (महर्षि कणाद)",
                    adhyaya: "1",
                    ahnika: "1",
                    sutraNumber: "1",
                    subject: "Commencement of Dharma Inquiry",
                    source: "Vaisheshika Sutra 1.1.1",
                  },
                },
              },
              {
                id: "vaisheshika-1-1-2",
                parentId: "vaisheshika-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Vaisheshika Sutra 1.1.2 — Definition of Dharma", hi: "वैशेषिक सूत्र १.१.२ — धर्म की सार्वभौम परिभाषा" },
                shortTitle: { en: "Sutra 1.1.2", hi: "सूत्र १.१.२" },
                sanskrit: "वैशेषिकसूत्रम् १.१.२",
                badge: "Definition of Dharma",
                content: {
                  sanskrit: "यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः॥",
                  transliteration: "yato'bhyudayaniḥśreyasasiddhiḥ sa dharmaḥ ||",
                  meaningHi: "जिससे इस लोक में भौतिक उन्नति (अभ्युदय) और परलोक में आत्यंतिक आत्मिक मुक्ति (निःश्रेयस) सिद्ध होती है, वही 'धर्म' है।",
                  meaningEn: "Dharma is that divine moral order from which both temporal flourishing (Abhyudaya) and supreme spiritual liberation (Nihshreyasa) are accomplished.",
                  metadata: {
                    author: "Maharshi Kanada",
                    adhyaya: "1",
                    ahnika: "1",
                    sutraNumber: "2",
                    subject: "Universal Definition of Dharma",
                    source: "Vaisheshika Sutra 1.1.2",
                  },
                },
              },
            ],
          },
          {
            id: "vaisheshika-adhyaya-2",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 2: The 5 Physical Elements, Space & Time (58 Sutras)", hi: "द्वितीय अध्याय: पञ्चमहाभूत, दिक् एवं काल" },
            shortTitle: { en: "2. Elements & Time", hi: "२. भूत एवं काल" },
            sanskrit: "द्वितीयोऽध्यायः (भूतानि, दिक्, कालः)",
            badge: "58 Sutras",
            desc: {
              en: "The nine substances (Dravyas): Earth, Water, Fire, Air, Ether (Akasha), Time (Kala), Space/Direction (Dik), Soul, and Mind.",
              hi: "पृथ्वी, जल, तेज, वायु, आकाश, काल और दिशा का सूक्ष्म वैज्ञानिक विश्लेषण।",
            },
          },
          {
            id: "vaisheshika-adhyaya-3",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 3: Soul (Atman) & Mind (Manas) (41 Sutras)", hi: "तृतीय अध्याय: आत्मा एवं मनस निरूपण" },
            shortTitle: { en: "3. Soul & Mind", hi: "३. आत्मा एवं मन" },
            sanskrit: "तृतीयोऽध्यायः (आत्मा एवं मनः)",
            badge: "41 Sutras",
            desc: {
              en: "Proofs for the reality of individual Self distinct from sense faculties, and mind as an atomic internal organ.",
              hi: "इन्द्रियों और शरीर से पृथक चेतन आत्मा की सिद्धि तथा मन के परमाणु-रूप का प्रतिपादन।",
            },
          },
          {
            id: "vaisheshika-adhyaya-4",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 4: Atomic Pluralism (Paramanu-vada) (33 Sutras)", hi: "चतुर्थ अध्याय: परमाणुवाद एवं सृष्टि रचना" },
            shortTitle: { en: "4. Paramanu-vada", hi: "४. परमाणुवाद" },
            sanskrit: "चतुर्थोऽध्यायः (परमाणुवादः)",
            badge: "33 Sutras",
            desc: {
              en: "The foundational atomic physics: indivisible eternal atoms (Paramanu), dyads (Dvyanuka), and triads (Trasarenu) forming gross matter.",
              hi: "अविभाज्य शाश्वत परमाणु, द्व्यणुक, त्र्यणुक और दृश्य स्थूल जगत की उत्पत्ति का भौतिक सिद्धांत।",
            },
          },
          {
            id: "vaisheshika-adhyaya-5",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 5: Action (Karma) & Unseen Merit (Adrishta) (43 Sutras)", hi: "पञ्चम अध्याय: कर्म एवं अदृष्ट मीमांसा" },
            shortTitle: { en: "5. Karma & Adrishta", hi: "५. कर्म एवं अदृष्ट" },
            sanskrit: "पञ्चमोऽध्यायः (कर्म एवं अदृष्टम्)",
            badge: "43 Sutras",
            desc: {
              en: "Physical mechanics, bodily movements, natural forces, and the cosmic governance by unseen spiritual cause (Adrishta).",
              hi: "भौतिक गति के नियम, शारीरिक चेष्टाएँ और प्रकृति को संचालित करने वाला अदृष्ट कर्मफल।",
            },
          },
          {
            id: "vaisheshika-adhyaya-6",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 6: Vedic Dharma, Purity & Duty (32 Sutras)", hi: "षष्ठ अध्याय: वैदिक विधि, दान एवं सदाचार" },
            shortTitle: { en: "6. Vedic Duty", hi: "६. धर्म व सदाचार" },
            sanskrit: "षष्ठोऽध्यायः (सदाचार एवं धर्म)",
            badge: "32 Sutras",
            desc: {
              en: "Spiritual ethics, charitable giving (Dana), inner purification, and performance of prescribed duties.",
              hi: "दान, तप, सदाचार, अंतःकरण शुद्धि और आश्रम-धर्म का विधि-सम्मत पालन।",
            },
          },
          {
            id: "vaisheshika-adhyaya-7",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 7: The 24 Qualities & Inherence (53 Sutras)", hi: "सप्तम अध्याय: २४ गुण, परमाणु परिमाण एवं समवाय" },
            shortTitle: { en: "7. Gunas & Samavaya", hi: "७. गुण एवं समवाय" },
            sanskrit: "सप्तमोऽध्यायः (गुणाः एवं समवायः)",
            badge: "53 Sutras",
            desc: {
              en: "Classification of 24 qualities (Gunas), atomic infinitesimal dimension, and eternal inseparable relationship (Samavaya).",
              hi: "२४ गुणों के भेद, परमाणु का सूक्ष्मतम परिमाण और द्रव्यों में गुणों का अविभाज्य समवाय संबंध।",
            },
          },
          {
            id: "vaisheshika-adhyaya-8",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 8: Sensory Perception & Cognition (17 Sutras)", hi: "अष्टम अध्याय: प्रत्यक्ष एवं यथार्थ ज्ञान मीमांसा" },
            shortTitle: { en: "8. Perception", hi: "८. ज्ञान मीमांसा" },
            sanskrit: "अष्टमोऽध्यायः (ज्ञान-मीमांसा)",
            badge: "17 Sutras",
            desc: {
              en: "The mechanics of direct sensory perception, determinate vs indeterminate cognition, and valid apprehension.",
              hi: "इन्द्रिय-संनिकर्ष, निर्विकल्पक व सविकल्पक ज्ञान और यथार्थ अनुभूति की प्रक्रिया।",
            },
          },
          {
            id: "vaisheshika-adhyaya-9",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 9: Non-Existence (Abhava) & Intuition (15 Sutras)", hi: "नवम अध्याय: अभाव (४ प्रकार) एवं आर्ष प्रत्यक्ष" },
            shortTitle: { en: "9. Abhava", hi: "९. अभाव व आर्ष ज्ञान" },
            sanskrit: "नवमोऽध्यायः (अभावः एवं योगिप्रत्यक्षम्)",
            badge: "15 Sutras",
            desc: {
              en: "The fourfold categories of non-existence (Pragabhava, Pradhvamsabhava, Anyonyabhava, Atyantabhava) and yogic intuition.",
              hi: "अभाव के चार भेद (प्रागभाव, प्रध्वंस, अन्योन्याभाव, अत्यन्ताभाव) तथा योगियों का दिव्य आर्ष ज्ञान।",
            },
          },
          {
            id: "vaisheshika-adhyaya-10",
            parentId: "darshana-vaisheshika",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 10: Pleasure, Pain & Supreme Liberation (14 Sutras)", hi: "दशम अध्याय: सुख-दुःख एवं आत्यंतिक मोक्ष" },
            shortTitle: { en: "10. Liberation", hi: "१०. मोक्ष साधन" },
            sanskrit: "दशमोऽध्यायः (मोक्ष साधनम्)",
            badge: "14 Sutras",
            desc: {
              en: "The experiential nature of pleasure and pain, cessation of karmic impressions, and absolute spiritual liberation.",
              hi: "सुख-दुःख के वास्तविक कारण, राग-द्वेष का उच्छेद और आत्मा का समस्त बंधनों से मुक्त होना।",
            },
          },
        ],
      },

      // -----------------------------------------------------------------------
      // 5. PURVA MIMAMSA DARSHANA — MAHARSHI JAIMINI (12 ADHYAYAS)
      // -----------------------------------------------------------------------
      {
        id: "darshana-mimamsa",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Purva Mimamsa — Jaimini Mimamsa Sutra", hi: "पूर्व मीमांसा — महर्षि जैमिनि कृत मीमांसा सूत्र" },
        shortTitle: { en: "Mimamsa", hi: "मीमांसा" },
        sanskrit: "पूर्व मीमांसा दर्शनम् (धर्ममीमांसा)",
        tagline: { en: "12 Adhyayas · Dvadasha Lakshani · Vedic Hermeneutics & Sacred Action", hi: "१२ अध्याय · द्वादश लक्षणी · वैदिक कर्म-मीमांसा एवं धर्म-जिज्ञासा" },
        badge: "12 Adhyayas · ~2,700 Sutras",
        cardImage: yajurvedaCardImg,
        bannerImage: bannerFireRitual,
        desc: {
          en: "The science of Vedic interpretation, hermeneutics, and sacred ritual ethics founded by Maharshi Jaimini, examining the eternal nature of Vedic injunctions (Vidhi) and spiritual duty (Dharma).",
          hi: "महर्षि जैमिनि द्वारा प्रणीत वैदिक वाक्य-रचना, प्रमाण-मीमांसा और धर्म का विशद विश्लेषण। वेदों के कर्मकांडीय भाग की यथार्थ व्याख्या।",
        },
        childLevelName: { en: "Adhyaya", hi: "अध्याय" },
        children: [
          {
            id: "mimamsa-adhyaya-1",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 1: Dharma, Pramana & Vedic Authority (Tarka Pada)", hi: "प्रथम अध्याय: धर्म-जिज्ञासा, चोदना प्रमाण एवं वेद-प्रामाण्य" },
            shortTitle: { en: "1. Tarka Pada", hi: "१. धर्म व प्रमाण" },
            sanskrit: "प्रथमोऽध्यायः (तर्कपादः)",
            badge: "Tarka Pada",
            desc: {
              en: "The foundational epistemological section establishing the eternal authority of Vedic injunctive commands (Chodana) and intrinsically valid knowledge (Svatah-pramanya).",
              hi: "धर्म की परिभाषा, स्वतः-प्रामाण्यवाद, शब्द और अर्थ का नित्य संबंध तथा वेदों की अपौरुषेय प्रामाणिकता।",
            },
            children: [
              {
                id: "mimamsa-1-1-1",
                parentId: "mimamsa-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Mimamsa Sutra 1.1.1 — Athato Dharmajijnasa", hi: "मीमांसा सूत्र १.१.१ — अथातो धर्मजिज्ञासा" },
                shortTitle: { en: "Sutra 1.1.1", hi: "सूत्र १.१.१" },
                sanskrit: "मीमांसासूत्रम् १.१.१",
                badge: "Dharma Inquiry",
                content: {
                  sanskrit: "ॐ अथातो धर्मजिज्ञासा॥",
                  transliteration: "oṃ athāto dharmajijñāsā ||",
                  meaningHi: "वेद-स्वाध्याय के उपरांत, अब यथार्थ वैदिक धर्म को जानने की आध्यात्मिक जिज्ञासा प्रारंभ होती है।",
                  meaningEn: "Now, therefore, following the proper study of the Vedas, begins the profound inquiry into the true nature of Dharma.",
                  metadata: {
                    author: "Maharshi Jaimini (महर्षि जैमिनि)",
                    adhyaya: "1",
                    pada: "1 (Tarka Pada)",
                    sutraNumber: "1",
                    subject: "Inquiry into Dharma",
                    source: "Purva Mimamsa Sutra 1.1.1",
                  },
                },
              },
              {
                id: "mimamsa-1-1-2",
                parentId: "mimamsa-adhyaya-1",
                type: "leaf",
                levelLabel: { en: "Sutra", hi: "सूत्र" },
                title: { en: "Mimamsa Sutra 1.1.2 — Chodana-lakshano'rtho Dharmah", hi: "मीमांसा सूत्र १.१.२ — धर्म का लक्षण" },
                shortTitle: { en: "Sutra 1.1.2", hi: "सूत्र १.१.२" },
                sanskrit: "मीमांसासूत्रम् १.१.२",
                badge: "Definition of Dharma",
                content: {
                  sanskrit: "चोदनालक्षणोऽर्थो धर्मः॥",
                  transliteration: "codanālakṣaṇo'rtho dharmaḥ ||",
                  meaningHi: "वैदिक प्रेरणा या विधि-वाक्य (चोदना) द्वारा विहित, जो कल्याणकारी और श्रेयस्कर प्रयोजन सिद्ध करे, वही 'धर्म' है।",
                  meaningEn: "Dharma is that supreme good and beneficial purpose which is characterized and known solely through the imperative injunctive commands of Sacred Revelation (Chodana).",
                  metadata: {
                    author: "Maharshi Jaimini",
                    adhyaya: "1",
                    pada: "1",
                    sutraNumber: "2",
                    subject: "Vedic Definition of Dharma",
                    source: "Purva Mimamsa Sutra 1.1.2",
                  },
                },
              },
            ],
          },
          {
            id: "mimamsa-adhyaya-2",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 2: Difference of Rites & Apurva (Bheda)", hi: "द्वितीय अध्याय: कर्म-भेद एवं अपूर्व तत्त्व" },
            shortTitle: { en: "2. Difference of Rites", hi: "२. कर्म-भेद" },
            sanskrit: "द्वितीयोऽध्यायः (कर्मभेदः)",
            badge: "Karma-Bheda",
            desc: {
              en: "Principles for distinguishing distinct ritual actions, primary vs secondary rites, and the metaphysical unseen potency (Apurva).",
              hi: "विभिन्न यज्ञीय कर्मों के भेदक प्रमाण तथा कर्मफल प्रदान करने वाले सूक्ष्म 'अपूर्व' की सिद्धि।",
            },
          },
          {
            id: "mimamsa-adhyaya-3",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 3: Auxiliary Relations (Sheshatva)", hi: "तृतीय अध्याय: अंग-अंगी भाव एवं शेषत्व" },
            shortTitle: { en: "3. Auxiliary Relations", hi: "३. शेषत्व" },
            sanskrit: "तृतीयोऽध्यायः (शेष-शेषिभावः)",
            badge: "Sheshatva",
            desc: {
              en: "Examines subsidiary actions (Shesha) and principal rituals (Sheshi) through direct statement (Shruti), indicative mark (Linga), and context (Prakarana).",
              hi: "श्रुति, लिंग, वाक्य, प्रकरण, स्थान और समाख्या द्वारा मुख्य एवं सहायक कर्मों का संबंध निर्धारण।",
            },
          },
          {
            id: "mimamsa-adhyaya-4",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 4: Purpose of Action & Rites (Prayukti)", hi: "चतुर्थ अध्याय: प्रयोज्य-प्रयोजक भाव एवं ऋतुप्रयोजन" },
            shortTitle: { en: "4. Purpose of Action", hi: "४. प्रयोजन" },
            sanskrit: "चतुर्थोऽध्यायः (प्रयुक्तिः)",
            badge: "Prayukti",
            desc: {
              en: "Distinguishes between rituals serving the agent directly (Purushartha) and those serving the sacrifice (Kratvartha).",
              hi: "पुरुषार्थ (मनुष्य के फल हेतु) और क्रत्वर्थ (यज्ञ की पूर्णता हेतु) कर्मों का सूक्ष्म विभाजन।",
            },
          },
          {
            id: "mimamsa-adhyaya-5",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 5: Sequential Order of Rites (Krama)", hi: "पञ्चम अध्याय: अनुष्ठान-क्रम एवं कालनियम" },
            shortTitle: { en: "5. Order of Rites", hi: "५. क्रम नियम" },
            sanskrit: "पञ्चमोऽध्यायः (क्रमः)",
            badge: "Krama",
            desc: {
              en: "Six canons determining the exact chronological sequence of performing sacred rituals and chanting mantras.",
              hi: "श्रुति, अर्थ, पाठ, स्थान, मुख्य और प्रवृत्ति द्वारा अनुष्ठान के सुनिश्चित क्रम का निर्धारण।",
            },
          },
          {
            id: "mimamsa-adhyaya-6",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 6: Qualification for Sacred Rites (Adhikara)", hi: "षष्ठ अध्याय: अधिकारी-निर्णय एवं पात्रता" },
            shortTitle: { en: "6. Qualification", hi: "६. अधिकार" },
            sanskrit: "षष्ठोऽध्यायः (अधिकारः)",
            badge: "Adhikara",
            desc: {
              en: "The qualifications, spiritual competency, rights, and ethical obligations of the performer (Yajamana).",
              hi: "यज्ञ करने वाले यजमान की योग्यता, अधिकार और अनुष्ठान के नियमों का शास्त्रीय निर्णय।",
            },
          },
          {
            id: "mimamsa-adhyaya-7",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 7: Direct Extension of Rules (Samanya Atidesha)", hi: "सप्तम अध्याय: सामान्य अतिदेश (नियम विस्तार)" },
            shortTitle: { en: "7. General Extension", hi: "७. सामान्य अतिदेश" },
            sanskrit: "सप्तमोऽध्यायः (सामान्यातिदेशः)",
            badge: "Atidesha",
            desc: {
              en: "Transference of ritual methods from archetype sacrifices (Prakriti-Yaga) to modified sacrifices (Vikriti-Yaga).",
              hi: "प्रकृति-याग के विहित नियमों का विकृति-याग में सामान्य रूप से विस्तार करने का नियम।",
            },
          },
          {
            id: "mimamsa-adhyaya-8",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 8: Specific Extension of Rules (Vishesha Atidesha)", hi: "अष्टम अध्याय: विशेष अतिदेश" },
            shortTitle: { en: "8. Specific Extension", hi: "८. विशेष अतिदेश" },
            sanskrit: "अष्टमोऽध्यायः (विशेषातिदेशः)",
            badge: "Vishesha Atidesha",
            desc: {
              en: "Specific, fine-grained adaptations of ritual procedures in specialized ritual contexts.",
              hi: "विशेष संदर्भों में प्रकृति-याग के नियमों का विशिष्ट स्थानांतरण और अनुप्रयोग।",
            },
          },
          {
            id: "mimamsa-adhyaya-9",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 9: Adaptation & Modification (Uha)", hi: "नवम अध्याय: ऊह (मंत्र-परिवर्तन एवं अनुकूलन)" },
            shortTitle: { en: "9. Modification (Uha)", hi: "९. ऊह" },
            sanskrit: "नवमोऽध्यायः (ऊहः)",
            badge: "Uha",
            desc: {
              en: "Grammatical and liturgical adaptations of Vedic mantras and rites when transferred to different deities and contexts.",
              hi: "विभिन्न देवताओं एवं संदर्भों के अनुसार वैदिक मंत्रों के लिंग, वचन आदि में विहित शास्त्रीय संशोधन (ऊह)।",
            },
          },
          {
            id: "mimamsa-adhyaya-10",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 10: Suspension & Annulment (Badha)", hi: "दशम अध्याय: बाध (अंगों का लोप एवं विकल्प)" },
            shortTitle: { en: "10. Suspension", hi: "१०. बाध" },
            sanskrit: "दशमोऽध्यायः (बाधः)",
            badge: "Badha",
            desc: {
              en: "Canons governing the omission, exclusion, or replacement of subsidiary rites in modified rituals.",
              hi: "जब विकृति-याग में किसी नियम का बाध (लोप या प्रतिषेध) हो, तब प्रामाणिक विकल्प का निर्णय।",
            },
          },
          {
            id: "mimamsa-adhyaya-11",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 11: Combined Performance (Tantra)", hi: "एकादश अध्याय: तंत्र (एक अनुष्ठान से अनेक फल)" },
            shortTitle: { en: "11. Combined Action", hi: "११. तंत्र" },
            sanskrit: "एकादशोऽध्यायः (तन्त्रम्)",
            badge: "Tantra",
            desc: {
              en: "Principles of economy in ritual: performing a single common ritual act that serves multiple ends simultaneously.",
              hi: "एक बार किए गए अनुष्ठान से अनेक कार्यों का एक साथ संपन्न होना (तंत्र-सिद्धांत)।",
            },
          },
          {
            id: "mimamsa-adhyaya-12",
            parentId: "darshana-mimamsa",
            type: "division",
            levelLabel: { en: "Adhyaya", hi: "अध्याय" },
            title: { en: "Adhyaya 12: Secondary Relevance & Extension (Prasanga)", hi: "द्वादश अध्याय: प्रसंग एवं समुच्चय" },
            shortTitle: { en: "12. Secondary Extension", hi: "१२. प्रसंग" },
            sanskrit: "द्वादशोऽध्यायः (प्रसङ्गः)",
            badge: "Prasanga",
            desc: {
              en: "Incidental benefits and secondary extension of actions done for one purpose benefiting another.",
              hi: "एक के लिए किए गए अनुष्ठान से अन्य प्रयोजन की प्रासंगिक सिद्धि तथा द्वादश लक्षणी का उपसंहार।",
            },
          },
        ],
      },

      // -----------------------------------------------------------------------
      // 6. VEDANTA DARSHANA — PRASTHANATRAYI (THE SUPREME CULMINATION)
      // -----------------------------------------------------------------------
      {
        id: "darshana-vedanta",
        parentId: "shastra-darshana",
        type: "grantha",
        levelLabel: { en: "Darshana", hi: "दर्शन" },
        title: { en: "Vedanta Darshana — Prasthanatrayi", hi: "वेदान्त दर्शन — प्रस्थानत्रयी" },
        shortTitle: { en: "Vedanta", hi: "वेदान्त" },
        sanskrit: "वेदान्त दर्शनम् (उत्तर मीमांसा)",
        tagline: {
          en: "Brahma Sutras (555 Sutras) · 10 Principal Upanishads · Bhagavad Gita",
          hi: "ब्रह्मसूत्र (५५५ सूत्र), १० मुख्य उपनिषद एवं श्रीमद्भगवद्गीता",
        },
        cardImage: gitaCardImg,
        bannerImage: bannerSanctum,
        badge: "Prasthanatrayi (555 Sutras)",
        desc: {
          en: "The supreme culmination of Vedic metaphysics examining the ultimate reality (Brahman), the soul (Jiva), and liberation through the three canonical pillars: Brahma Sutras (Nyaya), Upanishads (Shruti), and Bhagavad Gita (Smriti).",
          hi: "सत्यं ज्ञानमनन्तं ब्रह्म—ब्रह्मसूत्र, उपनिषद एवं गीता पर आधारित भारतीय तत्त्वज्ञान की सर्वोच्च दार्शनिक पराकाष्ठा। अद्वैत, विशिष्टाद्वैत और द्वैत संप्रदायों का मूल आधार।",
        },
        childLevelName: { en: "Prasthana", hi: "प्रस्थान" },
        children: [
          // ===================================================================
          // PILLAR 1: NYAYA PRASTHANA — BRAHMA SUTRAS OF SAGE BADARAYANA (555 SUTRAS)
          // ===================================================================
          {
            id: "vedanta-brahma-sutras",
            parentId: "darshana-vedanta",
            type: "grantha",
            levelLabel: { en: "Nyaya Prasthana", hi: "न्याय प्रस्थान" },
            title: { en: "Brahma Sutras of Sage Badarayana (555 Sutras)", hi: "महर्षि बादरायण रचित ब्रह्मसूत्र (५५५ सूत्र)" },
            shortTitle: { en: "Brahma Sutras", hi: "ब्रह्मसूत्र" },
            sanskrit: "बादरायण ब्रह्मसूत्राणि (शारीरिक सूत्र)",
            badge: "4 Adhyayas · 16 Padas · 555 Sutras",
            cardImage: gitaCardImg,
            desc: {
              en: "The logical dialectic of Vedanta systematically harmonizing all Upanishadic revelations and refuting rival philosophies across 4 Adhyayas, 16 Padas, and 555 Sutras.",
              hi: "वेदान्त का न्याय प्रस्थान: चार अध्यायों, १६ पादों और ५५५ सूत्रों में समस्त उपनिषद-वाक्यों का समन्वय व तार्किक समर्थन।",
            },
            childLevelName: { en: "Adhyaya", hi: "अध्याय" },
            children: [
              // ADHYAYA 1: SAMANVAYA ADHYAYA (134 SUTRAS)
              {
                id: "brahma-sutra-adhyaya-1",
                parentId: "vedanta-brahma-sutras",
                type: "division",
                levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                title: { en: "Adhyaya 1: Samanvaya Adhyaya (134 Sutras on Harmonization)", hi: "प्रथम अध्याय: समन्वयाध्याय (१३४ सूत्र — ब्रह्म-समन्वय)" },
                shortTitle: { en: "1. Samanvaya", hi: "१. समन्वय" },
                sanskrit: "समन्वयाध्यायः",
                badge: "134 Sutras",
                desc: {
                  en: "Systematically establishes that all Upanishadic passages harmoniously converge in revealing Brahman as the sole material and instrumental cause of the cosmos.",
                  hi: "समस्त उपनिषद वाक्यों का परब्रह्म के स्वरूप में पूर्ण समन्वय, एकवाक्यता तथा जगत्कारण-सिद्धि।",
                },
                childLevelName: { en: "Pada", hi: "पाद" },
                children: [
                  {
                    id: "brahma-sutra-pada-1-1",
                    parentId: "brahma-sutra-adhyaya-1",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 1.1: Spashta-Brahma-Linga Pada (Chatussutri — 31 Sutras)", hi: "प्रथम पाद: स्पष्ट-ब्रह्म-लिंग पाद (चतुःसूत्री — ३१ सूत्र)" },
                    shortTitle: { en: "Pada 1.1", hi: "पाद १.१" },
                    sanskrit: "स्पष्टब्रह्मलिङ्गपादः (चतुःसूत्री)",
                    badge: "31 Sutras",
                    desc: {
                      en: "Contains the foundational four aphorisms of Vedanta (Chatussutri) defining spiritual inquiry, nature of Brahman, scriptural epistemology, and universal concordance.",
                      hi: "वेदान्त की आधारशिला 'चतुःसूत्री' (१.१.१ से १.१.४)—ब्रह्मजिज्ञासा, जगत्कारण, शास्त्र-प्रमाण और समन्वय।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-1-1-1",
                        parentId: "brahma-sutra-pada-1-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 1.1.1 — Athato Brahma Jijnasa", hi: "ब्रह्मसूत्र १.१.१ — अथातो ब्रह्मजिज्ञासा" },
                        shortTitle: { en: "Sutra 1.1.1", hi: "सूत्र १.१.१" },
                        sanskrit: "ब्रह्मसूत्रम् १.१.१",
                        badge: "Chatussutri #1",
                        content: {
                          sanskrit: "ॐ अथातो ब्रह्मजिज्ञासा॥",
                          transliteration: "oṃ athāto brahmajijñāsā ||",
                          meaningHi: "साधन-चतुष्टय और चित्तशुद्धि के अनन्तर, अब परम सत्य परब्रह्म को जानने की आध्यात्मिक जिज्ञासा प्रारंभ होती है।",
                          meaningEn: "Now, therefore, after acquiring the fourfold spiritual prerequisites (discrimination, dispassion, self-mastery, longing for liberation), begins the sacred inquiry into Brahman.",
                          metadata: {
                            author: "Maharshi Badarayana (Veda Vyasa)",
                            grantha: "Brahma Sutras",
                            adhyaya: "1 (Samanvaya)",
                            pada: "1 (Spashta-Brahma-Linga)",
                            adhikarana: "Jijnasadhikarana (Adhikarana 1)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 1.1.1",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-1-1-2",
                        parentId: "brahma-sutra-pada-1-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 1.1.2 — Janmadyasya Yatah", hi: "ब्रह्मसूत्र १.१.२ — जन्माद्यस्य यतः" },
                        shortTitle: { en: "Sutra 1.1.2", hi: "सूत्र १.१.२" },
                        sanskrit: "ब्रह्मसूत्रम् १.१.२",
                        badge: "Chatussutri #2",
                        content: {
                          sanskrit: "जन्माद्यस्य यतः॥",
                          transliteration: "janmādyasya yataḥ ||",
                          meaningHi: "जिस परम तत्त्व से इस समस्त ब्रह्मांड की उत्पत्ति, स्थिति और लय होता है, वही परब्रह्म है।",
                          meaningEn: "Brahman is That Supreme Reality from which the creation, sustenance, and dissolution of this entire universe proceed.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "1 (Samanvaya)",
                            pada: "1",
                            adhikarana: "Janmadyadhikarana (Adhikarana 2)",
                            sutraNumber: "2",
                            source: "Brahma Sutras 1.1.2",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-1-1-3",
                        parentId: "brahma-sutra-pada-1-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 1.1.3 — Shastrayonitvat", hi: "ब्रह्मसूत्र १.१.३ — शास्त्रयोनित्वात्" },
                        shortTitle: { en: "Sutra 1.1.3", hi: "सूत्र १.१.३" },
                        sanskrit: "ब्रह्मसूत्रम् १.१.३",
                        badge: "Chatussutri #3",
                        content: {
                          sanskrit: "शास्त्रयोनित्वात्॥",
                          transliteration: "śāstrayonitvāt ||",
                          meaningHi: "शास्त्र ही परब्रह्म के ज्ञान का एकमात्र प्रामाणिक साधन है, तथा परब्रह्म ही समस्त दिव्य शास्त्रों का मूल उद्गम है।",
                          meaningEn: "Because Scripture (Shastra) is the source of valid knowledge regarding Brahman, and because Brahman is the divine author/source of Sacred Scripture.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "1 (Samanvaya)",
                            pada: "1",
                            adhikarana: "Shastrayonitvadhikarana (Adhikarana 3)",
                            sutraNumber: "3",
                            source: "Brahma Sutras 1.1.3",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-1-1-4",
                        parentId: "brahma-sutra-pada-1-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 1.1.4 — Tat Tu Samanvayat", hi: "ब्रह्मसूत्र १.१.४ — तत्तु समन्वयात्" },
                        shortTitle: { en: "Sutra 1.1.4", hi: "सूत्र १.१.४" },
                        sanskrit: "ब्रह्मसूत्रम् १.१.४",
                        badge: "Chatussutri #4",
                        content: {
                          sanskrit: "तत्तु समन्वयात्॥",
                          transliteration: "tattu samanvayāt ||",
                          meaningHi: "समस्त उपनिषद-वाक्यों का अंतिम समन्वय केवल अद्वैत परब्रह्म के प्रतिपादन में ही सिद्ध होता है।",
                          meaningEn: "That [Brahman is the sole supreme purport of all Vedic revelation], because of the harmonious concordance and synthesis of all scriptural passages.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "1 (Samanvaya)",
                            pada: "1",
                            adhikarana: "Samanvayadhikarana (Adhikarana 4)",
                            sutraNumber: "4",
                            source: "Brahma Sutras 1.1.4",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-1-2",
                    parentId: "brahma-sutra-adhyaya-1",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 1.2: Aspashta-Brahma-Linga Pada I (32 Sutras)", hi: "द्वितीय पाद: अस्पष्ट-ब्रह्म-लिंग पाद (३२ सूत्र)" },
                    shortTitle: { en: "Pada 1.2", hi: "पाद १.२" },
                    sanskrit: "अस्पष्टब्रह्मलिङ्गपादः (प्रथम भाग)",
                    badge: "32 Sutras",
                    desc: {
                      en: "Resolves obscure Vedic passages regarding Saguna Brahman and Upasana (Manomaya, Vaishvanara, Antaryami).",
                      hi: "मनोमय, वैश्वानर और अंतर्यामी जैसे अस्पष्ट उपनिषद-वाक्यों का ब्रह्म में समन्वय।",
                    },
                  },
                  {
                    id: "brahma-sutra-pada-1-3",
                    parentId: "brahma-sutra-adhyaya-1",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 1.3: Aspashta-Brahma-Linga Pada II (43 Sutras)", hi: "तृतीय पाद: अस्पष्ट-ब्रह्म-लिंग पाद (४३ सूत्र)" },
                    shortTitle: { en: "Pada 1.3", hi: "पाद १.३" },
                    sanskrit: "अस्पष्टब्रह्मलिङ्गपादः (द्वितीय भाग)",
                    badge: "43 Sutras",
                    desc: {
                      en: "Clarifies texts mentioning Dahara-akasha (inner sky), Angushtha-matra Purusha, Akshara, and Bhuma.",
                      hi: "दहराकाश, अंगुष्ठमात्र पुरुष, अक्षर और भूमा तत्त्व का ब्रह्म-परक विवेचन।",
                    },
                  },
                  {
                    id: "brahma-sutra-pada-1-4",
                    parentId: "brahma-sutra-adhyaya-1",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 1.4: Sandigdha-Pada-Vicara (28 Sutras)", hi: "चतुर्थ पाद: संदिग्ध-पद-विचार (२८ सूत्र)" },
                    shortTitle: { en: "Pada 1.4", hi: "पाद १.४" },
                    sanskrit: "संदिग्धपदविचारपादः",
                    badge: "28 Sutras",
                    desc: {
                      en: "Resolves doubtful terms like Avyakta and Aja, demonstrating they refer to Brahman's unmanifest power, not Samkhya's insentient Prakriti.",
                      hi: "अव्यक्त और अजा जैसे शब्दों का समाधान, यह सिद्ध करते हुए कि वे ब्रह्म की शक्ति हैं, जड़ प्रकृति नहीं।",
                    },
                  },
                ],
              },

              // ADHYAYA 2: AVIRODHA ADHYAYA (157 SUTRAS)
              {
                id: "brahma-sutra-adhyaya-2",
                parentId: "vedanta-brahma-sutras",
                type: "division",
                levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                title: { en: "Adhyaya 2: Avirodha Adhyaya (157 Sutras on Defense & Logic)", hi: "द्वितीय अध्याय: अविरोधाध्याय (१५७ सूत्र — तार्किक परिहार)" },
                shortTitle: { en: "2. Avirodha", hi: "२. अविरोध" },
                sanskrit: "अविरोधाध्यायः",
                badge: "157 Sutras",
                desc: {
                  en: "Defends Vedanta against objections from reason and rival philosophies, critically dismantling Samkhya, Vaisheshika atomism, Buddhism, and Jainism.",
                  hi: "वेदान्त का तार्किक समर्थन, सांख्य, वैशेषिक परमाणुवाद, बौद्ध एवं जैन मतों का अकाट्य खंडन तथा आत्मा का स्वरूप।",
                },
                childLevelName: { en: "Pada", hi: "पाद" },
                children: [
                  {
                    id: "brahma-sutra-pada-2-1",
                    parentId: "brahma-sutra-adhyaya-2",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 2.1: Smriti-Virodha-Parihara (37 Sutras)", hi: "प्रथम पाद: स्मृति-विरोध-परिहार (३७ सूत्र)" },
                    shortTitle: { en: "Pada 2.1", hi: "पाद २.१" },
                    sanskrit: "स्मृतिविरोधपरिहारपादः",
                    badge: "37 Sutras",
                    desc: {
                      en: "Refutes objections based on rival Smritis and establishes the non-difference of effect from cause (Vivartavada / Ananyatva).",
                      hi: "स्मृति-विरोध का परिहार तथा कार्य-कारण की अनन्यता (तदनन्यत्वमारम्भणशब्दादिभ्यः)।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-2-1-1",
                        parentId: "brahma-sutra-pada-2-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 2.1.1 — Smrityanavakashadosha Prasanga", hi: "ब्रह्मसूत्र २.१.१ — स्मृत्यनवकाशदोष परिहार" },
                        shortTitle: { en: "Sutra 2.1.1", hi: "सूत्र २.१.१" },
                        sanskrit: "ब्रह्मसूत्रम् २.१.१",
                        badge: "Smriti Defense",
                        content: {
                          sanskrit: "स्मृत्यनवकाशदोषप्रसङ्ग इति चेन्नान्यस्मृत्यनवकाशदोषप्रसङ्गात्॥",
                          transliteration: "smṛtyanavakāśadoṣaprasaṅga iti cennānyasmṛtyanavakāśadoṣaprasaṅgāt ||",
                          meaningHi: "यदि आपत्ति हो कि सांख्य आदि स्मृतियों को स्थान नहीं मिलेगा, तो यह सत्य नहीं; अन्यथा मनु-गीता आदि श्रुत्यनुकूल स्मृतियों के लिए स्थान न बचेगा।",
                          meaningEn: "If it be objected that there would result the defect of leaving no scope for certain Smritis [Samkhya], we reply: No, because otherwise there would result the defect of leaving no scope for other [orthodox Vedic] Smritis [Manu, Gita].",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "2 (Avirodha)",
                            pada: "1",
                            sutraNumber: "1",
                            source: "Brahma Sutras 2.1.1",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-2-1-14",
                        parentId: "brahma-sutra-pada-2-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 2.1.14 — Tadananyatvam (Non-Difference)", hi: "ब्रह्मसूत्र २.१.१४ — तदनन्यत्वम्" },
                        shortTitle: { en: "Sutra 2.1.14", hi: "सूत्र २.१.१४" },
                        sanskrit: "ब्रह्मसूत्रम् २.१.१४",
                        badge: "Cause & Effect",
                        content: {
                          sanskrit: "तदनन्यत्वमारम्भणशब्दादिभ्यः॥",
                          transliteration: "tadananyatvamārambhaṇaśabdādibhyaḥ ||",
                          meaningHi: "कार्य (जगत) अपने कारण (ब्रह्म) से पृथक नहीं है, जैसा कि 'वाचारम्भणं विकारो नामधेयं' श्रुति-वाक्य स्पष्ट करता है।",
                          meaningEn: "The non-difference (ananyatva) of the effect (the world) from the cause (Brahman) is established from words such as 'originating in speech' (Vācārambhaṇa-śruti) and others.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "2 (Avirodha)",
                            pada: "1",
                            sutraNumber: "14",
                            source: "Brahma Sutras 2.1.14",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-2-2",
                    parentId: "brahma-sutra-adhyaya-2",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 2.2: Tarka Pada / Paramata-Nirakarana (45 Sutras)", hi: "द्वितीय पाद: तर्क पाद / परमत-निराकरण (४५ सूत्र)" },
                    shortTitle: { en: "Pada 2.2 (Tarka)", hi: "पाद २.२ (तर्क)" },
                    sanskrit: "तर्कपादः (परमतनिराकरणम्)",
                    badge: "45 Sutras",
                    desc: {
                      en: "The celebrated polemical section systematically dismantling non-Vedantic ontologies: Samkhya, Vaisheshika, Buddhist Sarvastivada and Vijnanavada, Jain Syadvada, and Pashupata.",
                      hi: "सांख्य, वैशेषिक, बौद्ध (सर्वास्तिवाद, विज्ञानवाद, शून्यवाद), जैन और पाशुपत मतों का सुविस्तृत तार्किक खंडन।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-2-2-1",
                        parentId: "brahma-sutra-pada-2-2",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 2.2.1 — Refutation of Samkhya Pradhana", hi: "ब्रह्मसूत्र २.२.१ — प्रधान जगत्-कारण निराकरण" },
                        shortTitle: { en: "Sutra 2.2.1", hi: "सूत्र २.२.१" },
                        sanskrit: "ब्रह्मसूत्रम् २.२.१",
                        badge: "Tarka Opening",
                        content: {
                          sanskrit: "रचनानुपपत्तेश्च नानुमानम्॥",
                          transliteration: "racanānupapatteśca nānumānam ||",
                          meaningHi: "ब्रह्मांड की विस्मयकारी सुव्यवस्थित रचना जड़ प्रकृति से संभव न होने के कारण, अनुमान-सिद्ध प्रधान (प्रकृति) जगत्-कारण नहीं हो सकता।",
                          meaningEn: "And because the intricate order, design, and harmony of the universe is impossible for insentient matter, that which is inferred [namely the Pradhana of the Samkhyas] cannot be the First Cause.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "2 (Avirodha)",
                            pada: "2 (Tarka Pada)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 2.2.1",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-2-3",
                    parentId: "brahma-sutra-adhyaya-2",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 2.3: Mahabhuta & Jiva-Svarupa (53 Sutras)", hi: "तृतीय पाद: महाभूत एवं जीवात्मा स्वरूप (५३ सूत्र)" },
                    shortTitle: { en: "Pada 2.3", hi: "पाद २.३" },
                    sanskrit: "महाभूत-जीवस्वरूपपादः",
                    badge: "53 Sutras",
                    desc: {
                      en: "Origin of cosmic elements (space, air, fire, water, earth) and affirms the individual soul (Jiva) as eternal, sentient, and an aspect/reflection (Amsha) of Brahman.",
                      hi: "आकाश आदि महाभूतों की उत्पत्ति तथा जीवात्मा के नित्य, ज्ञाता और ब्रह्म के 'अंश' होने का प्रतिपादन।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-2-3-43",
                        parentId: "brahma-sutra-pada-2-3",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 2.3.43 — Soul as an Aspect of Brahman", hi: "ब्रह्मसूत्र २.३.४३ — जीवात्मा ब्रह्म का अंश" },
                        shortTitle: { en: "Sutra 2.3.43", hi: "सूत्र २.३.४३" },
                        sanskrit: "ब्रह्मसूत्रम् २.३.४३",
                        badge: "Jiva-Brahman",
                        content: {
                          sanskrit: "अंशो नानाव्यपदेशात्॥",
                          transliteration: "aṃśo nānāvyapadeśāt ||",
                          meaningHi: "जीवात्मा परब्रह्म का अंश (प्रतिबिम्ब या अभिन्न तत्त्व) है, क्योंकि श्रुति में भेद और अभेद दोनों प्रकार के वचन कहे गए हैं।",
                          meaningEn: "The individual soul is an Amsha (aspect, reflection, or part) of Supreme Brahman, on account of scriptural declarations of both difference and non-difference.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "2 (Avirodha)",
                            pada: "3",
                            sutraNumber: "43",
                            source: "Brahma Sutras 2.3.43",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-2-4",
                    parentId: "brahma-sutra-adhyaya-2",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 2.4: Pranendriya-Utpatti (22 Sutras)", hi: "चतुर्थ पाद: प्राण एवं इन्द्रिय उत्पत्ति (२२ सूत्र)" },
                    shortTitle: { en: "Pada 2.4", hi: "पाद २.४" },
                    sanskrit: "प्राणेन्द्रियोत्पत्तिपादः",
                    badge: "22 Sutras",
                    desc: {
                      en: "The derivation, function, and nature of the vital energies (Pranas), sensory faculties (Indriyas), and the subtle body.",
                      hi: "प्राणों, ग्यारह इन्द्रियों और सूक्ष्म शरीर की उत्पत्ति तथा कार्यप्रणाली।",
                    },
                  },
                ],
              },

              // ADHYAYA 3: SADHANA ADHYAYA (186 SUTRAS)
              {
                id: "brahma-sutra-adhyaya-3",
                parentId: "vedanta-brahma-sutras",
                type: "division",
                levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                title: { en: "Adhyaya 3: Sadhana Adhyaya (186 Sutras on Spiritual Practice)", hi: "तृतीय अध्याय: साधनाध्याय (१८६ सूत्र — मोक्ष-साधन)" },
                shortTitle: { en: "3. Sadhana", hi: "३. साधना" },
                sanskrit: "साधनाध्यायः",
                badge: "186 Sutras",
                desc: {
                  en: "Spiritual practice and methodology: transmigration of souls, unconditioned nature of Brahman (Neti Neti), synthesis of Upanishadic meditations (Vidyas), and primacy of Self-knowledge (Jnana).",
                  hi: "वैराग्य की उत्पत्ति, जाग्रत-स्वप्न-सुषुप्ति अवस्थाएँ, 'नेति नेति' द्वारा निर्विशेष ब्रह्म का निरूपण, उपनिषदों की विविध विद्याओं का समन्वय एवं ज्ञान से मोक्ष।",
                },
                childLevelName: { en: "Pada", hi: "पाद" },
                children: [
                  {
                    id: "brahma-sutra-pada-3-1",
                    parentId: "brahma-sutra-adhyaya-3",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 3.1: Vairagya Pada (27 Sutras)", hi: "प्रथम पाद: वैराग्य पाद (२७ सूत्र)" },
                    shortTitle: { en: "Pada 3.1", hi: "पाद ३.१" },
                    sanskrit: "वैराग्यपादः (संसार-गतिः)",
                    badge: "27 Sutras",
                    desc: {
                      en: "The soul's journey across birth and death via Pitriyana and Devayana, cultivating supreme detachment from transient realms.",
                      hi: "जीवात्मा की परलोक-यात्रा, पञ्चाग्नि विद्या तथा संसार के नश्वर सुखों से परम वैराग्य की उत्पत्ति।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-3-1-1",
                        parentId: "brahma-sutra-pada-3-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 3.1.1 — Transmigration of the Soul", hi: "ब्रह्मसूत्र ३.१.१ — जीवात्मा का देहांतर-गमन" },
                        shortTitle: { en: "Sutra 3.1.1", hi: "सूत्र ३.१.१" },
                        sanskrit: "ब्रह्मसूत्रम् ३.१.१",
                        badge: "Transmigration",
                        content: {
                          sanskrit: "तदन्तरप्रतिपत्तौ रंहति संपरिष्वक्तः प्रश्ननिरूपणाभ्याम्॥",
                          transliteration: "tadantarapratipattau raṃhati saṃpariṣvaktaḥ praśnanirūpaṇābhyām ||",
                          meaningHi: "नवीन देह धारण करने हेतु जीवात्मा सूक्ष्म भूतों से वेष्टित होकर गमन करता है, जैसा कि छांदोग्य के पंचाग्नि विद्या प्रसंग से सिद्ध है।",
                          meaningEn: "In obtaining another body, the departing soul goes enveloped by the subtle elements, as is established from question and explanation in scripture.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "3 (Sadhana)",
                            pada: "1 (Vairagya Pada)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 3.1.1",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-3-2",
                    parentId: "brahma-sutra-adhyaya-3",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 3.2: Ubhayalinga Pada — Neti Neti (41 Sutras)", hi: "द्वितीय पाद: उभयलिंग पाद — नेति नेति (४१ सूत्र)" },
                    shortTitle: { en: "Pada 3.2", hi: "पाद ३.२" },
                    sanskrit: "उभयलिङ्गपादः (नेति नेति)",
                    badge: "41 Sutras",
                    desc: {
                      en: "States of consciousness (dream, deep sleep), the formless pure nature of Brahman, and the transcendent negation of adjuncts via Neti Neti.",
                      hi: "स्वप्न व सुषुप्ति अवस्थाओं का विश्लेषण तथा 'नेति नेति' (यह भी नहीं, यह भी नहीं) द्वारा निर्गुण ब्रह्म की सिद्धि।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-3-2-22",
                        parentId: "brahma-sutra-pada-3-2",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 3.2.22 — Neti Neti Transcendence", hi: "ब्रह्मसूत्र ३.२.२२ — 'नेति नेति' का यथार्थ भाव" },
                        shortTitle: { en: "Sutra 3.2.22", hi: "सूत्र ३.२.२२" },
                        sanskrit: "ब्रह्मसूत्रम् ३.२.२२",
                        badge: "Neti Neti",
                        content: {
                          sanskrit: "प्रकृतैतावत्त्वं हि प्रतिषेधति ततो ब्रवीति च भूयः॥",
                          transliteration: "prakṛtaitāvattvaṃ hi pratiṣedhati tato bravīti ca bhūyaḥ ||",
                          meaningHi: "श्रुति 'नेति नेति' (यह नहीं, यह नहीं) द्वारा ब्रह्म के अब तक कहे गए सीमित रूपों का ही निषेध करती है, और फिर उस रूप-रहित परम सत्य का पुनः प्रतिपादन करती है।",
                          meaningEn: "For scripture, by the declaration 'Neti Neti' (Not this, Not this), denies only the previously mentioned conditioned limitations of Brahman, and then affirms the Supreme Reality existing beyond all forms.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "3 (Sadhana)",
                            pada: "2",
                            sutraNumber: "22",
                            source: "Brahma Sutras 3.2.22",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-3-3",
                    parentId: "brahma-sutra-adhyaya-3",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 3.3: Gunopasamhara Pada (66 Sutras)", hi: "तृतीय पाद: गुणोपसंहार पाद — विद्याओं का समन्वय (६६ सूत्र)" },
                    shortTitle: { en: "Pada 3.3", hi: "पाद ३.३" },
                    sanskrit: "गुणोपसंहारपादः",
                    badge: "66 Sutras",
                    desc: {
                      en: "Synthesis and correlation of diverse Upanishadic meditations: Shandilya Vidya, Dahara Vidya, Madhu Vidya, and Vaishvanara Vidya.",
                      hi: "विभिन्न उपनिषदों में वर्णित विद्याओं (शाण्डिल्य, दहर, मधु विद्या आदि) के गुणों का एकत्र समन्वय।",
                    },
                  },
                  {
                    id: "brahma-sutra-pada-3-4",
                    parentId: "brahma-sutra-adhyaya-3",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 3.4: Purushartha Pada (52 Sutras)", hi: "चतुर्थ पाद: पुरुषार्थ पाद — ज्ञान से मोक्ष (५२ सूत्र)" },
                    shortTitle: { en: "Pada 3.4", hi: "पाद ३.४" },
                    sanskrit: "पुरुषार्थपादः",
                    badge: "52 Sutras",
                    desc: {
                      en: "Affirms that Self-Knowledge (Jnana) directly yields the supreme human goal (Moksha) independently of ritual karma.",
                      hi: "यह सिद्ध करता है कि आत्मज्ञान ही स्वतंत्र रूप से परम पुरुषार्थ (मोक्ष) प्रदान करने वाला है।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-3-4-1",
                        parentId: "brahma-sutra-pada-3-4",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 3.4.1 — Moksha Through Knowledge Alone", hi: "ब्रह्मसूत्र ३.४.१ — ज्ञान से ही परम पुरुषार्थ" },
                        shortTitle: { en: "Sutra 3.4.1", hi: "सूत्र ३.४.१" },
                        sanskrit: "ब्रह्मसूत्रम् ३.४.१",
                        badge: "Jnana Moksha",
                        content: {
                          sanskrit: "पुरुषार्थोऽतः शब्दादिति बादरायणः॥",
                          transliteration: "puruṣārtho'taḥ śabdāditi bādarāyaṇaḥ ||",
                          meaningHi: "महर्षि बादरायण का मत है कि इस आत्मज्ञान से ही परम पुरुषार्थ (मोक्ष) की प्राप्ति होती है, क्योंकि शास्त्रों के प्रामाणिक वचन ऐसा ही प्रतिपादित करते हैं।",
                          meaningEn: "The supreme goal of human life (Moksha) is attained through this Self-Knowledge alone, as declared by Scripture; so holds Sage Badarayana.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "3 (Sadhana)",
                            pada: "4 (Purushartha Pada)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 3.4.1",
                          },
                        },
                      },
                    ],
                  },
                ],
              },

              // ADHYAYA 4: PHALA ADHYAYA (78 SUTRAS)
              {
                id: "brahma-sutra-adhyaya-4",
                parentId: "vedanta-brahma-sutras",
                type: "division",
                levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                title: { en: "Adhyaya 4: Phala Adhyaya (78 Sutras on the Fruit of Realization & Moksha)", hi: "चतुर्थ अध्याय: फलाध्याय (७८ सूत्र — मोक्ष फल एवं अनावृत्ति)" },
                shortTitle: { en: "4. Phala", hi: "४. फल" },
                sanskrit: "फलाध्यायः",
                badge: "78 Sutras",
                desc: {
                  en: "Details the dissolution of accumulated karma, Jivanmukti, the departure of the soul (Utkranti), the path of light (Arciradi-marga), and the eternal promise of non-return (Anavritti).",
                  hi: "संचित एवं आगामि कर्मों का विनाश, जीवन्मुक्ति, उत्क्रांति (देह-त्याग), अर्चिरादि मार्ग तथा मुक्त आत्मा की शाश्वत अनावृत्ति।",
                },
                childLevelName: { en: "Pada", hi: "पाद" },
                children: [
                  {
                    id: "brahma-sutra-pada-4-1",
                    parentId: "brahma-sutra-adhyaya-4",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 4.1: Avritti Pada (19 Sutras — Karma Dissolution)", hi: "प्रथम पाद: आवृत्ति पाद — कर्म-विनाश (१९ सूत्र)" },
                    shortTitle: { en: "Pada 4.1", hi: "पाद ४.१" },
                    sanskrit: "आवृत्तिपादः (कर्मविनाशः)",
                    badge: "19 Sutras",
                    desc: {
                      en: "Continuous contemplation until realization, destruction of Sanchita karma, and non-clinging of Agami karma for the Jivanmukta.",
                      hi: "श्रवण-मनन-निदिध्यासन की बारम्बार आवृत्ति, संचित कर्मों का विनाश और आगामी कर्मों का अश्लेष।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-4-1-1",
                        parentId: "brahma-sutra-pada-4-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 4.1.1 — Repeated Meditation", hi: "ब्रह्मसूत्र ४.१.१ — ध्यान की बारम्बार आवृत्ति" },
                        shortTitle: { en: "Sutra 4.1.1", hi: "सूत्र ४.१.१" },
                        sanskrit: "ब्रह्मसूत्रम् ४.१.१",
                        badge: "Meditation Practice",
                        content: {
                          sanskrit: "आवृत्तिरसकृदुपदेशात्॥",
                          transliteration: "āvṛttirasakṛdupadeśāt ||",
                          meaningHi: "श्रवण, मनन और निदिध्यासन की बारम्बार आवृत्ति करनी चाहिए, क्योंकि शास्त्रों में ऐसा बार-बार उपदेश दिया गया है।",
                          meaningEn: "Repetition [of hearing, reflection, and meditation on Brahman] must be practiced repeatedly, because scripture so instructs.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "4 (Phala)",
                            pada: "1 (Avritti Pada)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 4.1.1",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-4-1-13",
                        parentId: "brahma-sutra-pada-4-1",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 4.1.13 — Dissolution of Past Karma", hi: "ब्रह्मसूत्र ४.१.१३ — संचित कर्मों का विनाश" },
                        shortTitle: { en: "Sutra 4.1.13", hi: "सूत्र ४.१.१३" },
                        sanskrit: "ब्रह्मसूत्रम् ४.१.१३",
                        badge: "Karma Freedom",
                        content: {
                          sanskrit: "तदधिगम उत्तरपूर्वाघयोरश्लेषविनाशौ तद्व्यपदेशात्॥",
                          transliteration: "tadadhigama uttarapūrvāghayoraśleṣavināśau tadvyapadeśāt ||",
                          meaningHi: "उस परब्रह्म का साक्षात्कार होते ही आगामी पाप-पुण्य का अश्लेष (स्पर्श न होना) और पूर्व संचित कर्मों का पूर्ण विनाश हो जाता है।",
                          meaningEn: "On attaining That [Brahman], there occurs the non-clinging of future karmas and the total destruction of past accumulated karmas, because scripture declares so.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "4",
                            pada: "1",
                            sutraNumber: "13",
                            source: "Brahma Sutras 4.1.13",
                          },
                        },
                      },
                    ],
                  },
                  {
                    id: "brahma-sutra-pada-4-2",
                    parentId: "brahma-sutra-adhyaya-4",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 4.2: Utkranti Pada (21 Sutras)", hi: "द्वितीय पाद: उत्क्रांति पाद — देह-त्याग (२१ सूत्र)" },
                    shortTitle: { en: "Pada 4.2", hi: "पाद ४.२" },
                    sanskrit: "उत्क्रान्तिपादः",
                    badge: "21 Sutras",
                    desc: {
                      en: "The departure of subtle faculties at physical death, dissolution of senses into mind, and contrasting the path of the Jnani whose pranas merge directly into Brahman.",
                      hi: "मृत्यु के समय वाक् आदि इन्द्रियों का मन में और मन का प्राण में लय तथा ज्ञानी के प्राणों का यहीं ब्रह्म में विलीन होना।",
                    },
                  },
                  {
                    id: "brahma-sutra-pada-4-3",
                    parentId: "brahma-sutra-adhyaya-4",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 4.3: Gati / Arciradi Marga (16 Sutras)", hi: "तृतीय पाद: गति / अर्चिरादि मार्ग (१६ सूत्र)" },
                    shortTitle: { en: "Pada 4.3", hi: "पाद ४.३" },
                    sanskrit: "गतिपादः (अर्चिरादिमार्गः)",
                    badge: "16 Sutras",
                    desc: {
                      en: "The solar path of divine light (Devayana / Arciradi-marga) traversed by the Upasaka toward Brahmaloka (Krama-mukti).",
                      hi: "उपासक आत्माओं का देवयान/अर्चिरादि मार्ग द्वारा ब्रह्मलोक गमन एवं क्रम-मुक्ति।",
                    },
                  },
                  {
                    id: "brahma-sutra-pada-4-4",
                    parentId: "brahma-sutra-adhyaya-4",
                    type: "section",
                    levelLabel: { en: "Pada", hi: "पाद" },
                    title: { en: "Pada 4.4: Mukti Pada — Anavritti (22 Sutras)", hi: "चतुर्थ पाद: मुक्ति पाद — अनावृत्ति (२२ सूत्र)" },
                    shortTitle: { en: "Pada 4.4", hi: "पाद ४.४" },
                    sanskrit: "मुक्तिपादः (शाश्वत अनावृत्तिः)",
                    badge: "22 Sutras",
                    desc: {
                      en: "The manifestation of the liberated soul in its inherent pristine nature (Svarupavirbhava), unity with Brahman, and the glorious climax: eternal non-return to samsara.",
                      hi: "मुक्त आत्मा का अपने वास्तविक स्वरूप में प्रतिष्ठित होना, ब्रह्म से अभिन्नता और महानतम उपसंहार: संसार में कभी पुनरावर्तन न होना।",
                    },
                    children: [
                      {
                        id: "brahma-sutra-4-4-1",
                        parentId: "brahma-sutra-pada-4-4",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 4.4.1 — Manifestation of True Nature", hi: "ब्रह्मसूत्र ४.४.१ — स्वरूप में आविर्भाव" },
                        shortTitle: { en: "Sutra 4.4.1", hi: "सूत्र ४.४.१" },
                        sanskrit: "ब्रह्मसूत्रम् ४.४.१",
                        badge: "Svarupavirbhava",
                        content: {
                          sanskrit: "सम्पद्याविर्भावः स्वेन शब्दात्॥",
                          transliteration: "sampadyāvirbhāvaḥ svena śabdāt ||",
                          meaningHi: "परम ज्योतिर्मय ब्रह्म को प्राप्त होकर जीवात्मा अपने विशुद्ध वास्तविक स्वरूप में प्रकट होता है, जैसा कि 'स्वेन रूपेण' शब्द से स्पष्ट है।",
                          meaningEn: "On attaining the Supreme Light of Brahman, there occurs the manifestation of the soul in its own pristine, true nature, as known from the word 'in its own'.",
                          metadata: {
                            author: "Maharshi Badarayana",
                            grantha: "Brahma Sutras",
                            adhyaya: "4 (Phala)",
                            pada: "4 (Mukti Pada)",
                            sutraNumber: "1",
                            source: "Brahma Sutras 4.4.1",
                          },
                        },
                      },
                      {
                        id: "brahma-sutra-4-4-22",
                        parentId: "brahma-sutra-pada-4-4",
                        type: "leaf",
                        levelLabel: { en: "Sutra", hi: "सूत्र" },
                        title: { en: "Brahma Sutra 4.4.22 — Anavritti (Eternal Non-Return)", hi: "ब्रह्मसूत्र ४.४.२२ — अनावृत्तिः शब्दात् (अंतिम उपसंहार)" },
                        shortTitle: { en: "Sutra 4.4.22", hi: "सूत्र ४.४.२२" },
                        sanskrit: "ब्रह्मसूत्रम् ४.४.२२",
                        badge: "Grand Climax",
                        content: {
                          sanskrit: "अनावृत्तिः शब्दादनावृत्तिः शब्दात्॥",
                          transliteration: "anāvṛttiḥ śabdādanāvṛttiḥ śabdāt ||",
                          meaningHi: "मुक्त आत्मा का इस नश्वर संसार में पुनरावर्तन (वापसी) नहीं होता, शास्त्रों के प्रामाणिक वचन से यह सुनिश्चित है; पुनरावर्तन नहीं होता!",
                          meaningEn: "There is no return [to mortality and samsara for the liberated soul], according to scripture; there is no return, according to scripture!",
                          metadata: {
                            author: "Maharshi Badarayana (Veda Vyasa)",
                            grantha: "Brahma Sutras",
                            adhyaya: "4 (Phala)",
                            pada: "4 (Mukti Pada)",
                            sutraNumber: "22 (Final Sutra of Brahma Sutras)",
                            source: "Brahma Sutras 4.4.22",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ===================================================================
          // PILLAR 2: SHRUTI PRASTHANA — 10 PRINCIPAL UPANISHADS (दशोपनिषदः)
          // ===================================================================
          {
            id: "vedanta-upanishads",
            parentId: "darshana-vedanta",
            type: "grantha",
            levelLabel: { en: "Shruti Prasthana", hi: "श्रुति प्रस्थान" },
            title: { en: "10 Principal Upanishads (Mukhya Upanishads)", hi: "१० मुख्य उपनिषद (दशोपनिषदः)" },
            shortTitle: { en: "10 Upanishads", hi: "१० उपनिषद" },
            sanskrit: "दशोपनिषदः (ईश, केन, कठ, माण्डूक्य...)",
            badge: "10 Mukhya Texts",
            cardImage: samavedaCardImg,
            desc: {
              en: "The supreme revealed wisdom of the Vedic Rishis: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka.",
              hi: "ऋषियों के साक्षात्कृत आध्यात्मिक अनुभव: ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य और बृहदारण्यक उपनिषद।",
            },
            childLevelName: { en: "Upanishad", hi: "उपनिषद्" },
            children: [
              {
                id: "upanishad-isha-vedanta",
                parentId: "vedanta-upanishads",
                type: "division",
                levelLabel: { en: "Upanishad", hi: "उपनिषद्" },
                title: { en: "Isha Upanishad (18 Mantras — Shukla Yajurveda)", hi: "ईशावास्योपनिषद् (१८ मंत्र — शुक्ल यजुर्वेद)" },
                shortTitle: { en: "1. Isha", hi: "१. ईश" },
                sanskrit: "ईशावास्योपनिषद्",
                badge: "18 Mantras",
                children: [
                  {
                    id: "upanishad-isha-1",
                    parentId: "upanishad-isha-vedanta",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Isha Mantra 1 — Ishavasyam Idam Sarvam", hi: "ईशोपनिषद् १ — ईशावास्यमिदं सर्वम्" },
                    shortTitle: { en: "Mantra 1", hi: "मंत्र १" },
                    sanskrit: "ईशोपनिषद् मंत्र १",
                    badge: "Divine Omnipresence",
                    content: {
                      sanskrit: "ॐ ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
                      transliteration: "oṃ īśāvāsyamidaṃ sarvaṃ yatkiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||",
                      meaningHi: "इस परिवर्तनशील ब्रह्मांड में जो कुछ भी जड़-चेतन जगत है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो, किसी के धन की लालसा मत करो।",
                      meaningEn: "All this—whatever moves or is changing in this universe—is pervaded by the Supreme Lord. Enjoy with renunciation; do not covet anyone's wealth.",
                      metadata: {
                        veda: "Shukla Yajurveda (Vajasaneyi Samhita 40.1)",
                        source: "Isha Upanishad 1",
                      },
                    },
                  },
                ],
              },
              {
                id: "upanishad-mandukya-vedanta",
                parentId: "vedanta-upanishads",
                type: "division",
                levelLabel: { en: "Upanishad", hi: "उपनिषद्" },
                title: { en: "Mandukya Upanishad (12 Mantras — 4 States of Atman)", hi: "माण्डूक्योपनिषद् (१२ मंत्र — आत्मा की चार अवस्थाएँ)" },
                shortTitle: { en: "6. Mandukya", hi: "६. माण्डूक्य" },
                sanskrit: "माण्डूक्योपनिषद् (ओंकार चतुष्पाद)",
                badge: "12 Mantras",
                children: [
                  {
                    id: "upanishad-mandukya-2",
                    parentId: "upanishad-mandukya-vedanta",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Mandukya Mantra 2 — Ayam Atma Brahma", hi: "माण्डूक्योपनिषद् २ — अयमात्मा ब्रह्म" },
                    shortTitle: { en: "Mantra 2", hi: "मंत्र २" },
                    sanskrit: "माण्डूक्योपनिषद् मंत्र २",
                    badge: "Mahavakya",
                    content: {
                      sanskrit: "सर्वं ह्येतद् ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात्॥",
                      transliteration: "sarvaṃ hyetad brahmāyamātmā brahma so'yamātmā catuṣpāt ||",
                      meaningHi: "यह समस्त दृश्य-अदृश्य जगत निश्चय ही ब्रह्म है। यह जीवात्मा भी स्वयं ब्रह्म है (अयम् आत्मा ब्रह्म)। उस आत्मा के चार पाद (अवस्थाएँ) हैं।",
                      meaningEn: "All this is indeed Brahman. This very Self (Atman) is Brahman (Ayam Atma Brahma). That Self possesses four quarters or states of consciousness.",
                      metadata: {
                        veda: "Atharvaveda",
                        mahavakya: "Ayam Atma Brahma (अयम् आत्मा ब्रह्म)",
                        source: "Mandukya Upanishad 2",
                      },
                    },
                  },
                ],
              },
              {
                id: "upanishad-chandogya-vedanta",
                parentId: "vedanta-upanishads",
                type: "division",
                levelLabel: { en: "Upanishad", hi: "उपनिषद्" },
                title: { en: "Chandogya Upanishad (Tat Tvam Asi — Samaveda)", hi: "छान्दोग्योपनिषद् (तत्त्वमसि — सामवेद)" },
                shortTitle: { en: "9. Chandogya", hi: "९. छान्दोग्य" },
                sanskrit: "छान्दोग्योपनिषद् (तत्त्वमसि)",
                badge: "8 Prapathakas",
                children: [
                  {
                    id: "upanishad-chandogya-6-8-7",
                    parentId: "upanishad-chandogya-vedanta",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Chandogya 6.8.7 — Tat Tvam Asi", hi: "छान्दोग्य ६.८.७ — तत्त्वमसि (वह तुम ही हो)" },
                    shortTitle: { en: "6.8.7", hi: "६.८.७" },
                    sanskrit: "छान्दोग्य ६.८.७",
                    badge: "Mahavakya",
                    content: {
                      sanskrit: "स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो॥",
                      transliteration: "sa ya eṣo'ṇimaitadātmyamidaṃ sarvaṃ tatsatyaṃ sa ātmā tattvamasi śvetaketo ||",
                      meaningHi: "जो यह अत्यंत सूक्ष्म तत्त्व है, यह संपूर्ण संसार उसी आत्म-स्वरूप वाला है। वही परम सत्य है, वही आत्मा है, और हे श्वेतकेतु! 'तत् त्वम् असि'—वह ब्रह्म तुम ही हो।",
                      meaningEn: "That which is the subtlest essence—all this universe has That as its Self. That is the Ultimate Truth; That is the Atman; and 'That Thou Art' (Tat Tvam Asi), O Shvetaketu!",
                      metadata: {
                        veda: "Samaveda",
                        mahavakya: "Tat Tvam Asi (तत्त्वमसि)",
                        speaker: "Sage Uddalaka Aruni to Shvetaketu",
                        source: "Chandogya Upanishad 6.8.7",
                      },
                    },
                  },
                ],
              },
              {
                id: "upanishad-brihadaranyaka-vedanta",
                parentId: "vedanta-upanishads",
                type: "division",
                levelLabel: { en: "Upanishad", hi: "उपनिषद्" },
                title: { en: "Brihadaranyaka Upanishad (Aham Brahmasmi)", hi: "बृहदारण्यकोपनिषद् (अहं ब्रह्मास्मि — शुक्ल यजुर्वेद)" },
                shortTitle: { en: "10. Brihadaranyaka", hi: "१०. बृहदारण्यक" },
                sanskrit: "बृहदारण्यकोपनिषद्",
                badge: "Greatest Upanishad",
                children: [
                  {
                    id: "upanishad-brihad-1-4-10",
                    parentId: "upanishad-brihadaranyaka-vedanta",
                    type: "leaf",
                    levelLabel: { en: "Mantra", hi: "मंत्र" },
                    title: { en: "Brihadaranyaka 1.4.10 — Aham Brahmasmi", hi: "बृहदारण्यक १.४.१० — अहं ब्रह्मास्मि" },
                    shortTitle: { en: "1.4.10", hi: "१.४.१०" },
                    sanskrit: "बृहदारण्यक १.४.१०",
                    badge: "Mahavakya",
                    content: {
                      sanskrit: "ब्रह्म वा इदमग्र आसीत्, तदात्मानमेवावेत्, अहं ब्रह्मास्मीति। तस्मात्तत्सर्वमभवत्॥",
                      transliteration: "brahma vā idamagra āsīt, tadātmānamevāvet, ahaṃ brahmāsmīti | tasmāttatsarvamabhavat ||",
                      meaningHi: "सृष्टि के प्रारंभ में यह केवल ब्रह्म ही था। उसने अपने आपको जाना कि 'मैं ही ब्रह्म हूँ' (अहं ब्रह्मास्मि)। इस बोध से वह सर्वस्वरूप हो गया।",
                      meaningEn: "In the beginning, this universe was indeed Brahman alone. It knew only Itself: 'I am Brahman' (Aham Brahmasmi). Therefore, It became All.",
                      metadata: {
                        veda: "Shukla Yajurveda",
                        mahavakya: "Aham Brahmasmi (अहं ब्रह्मास्मि)",
                        source: "Brihadaranyaka Upanishad 1.4.10",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // ===================================================================
          // PILLAR 3: SMRITI PRASTHANA — SRIMAD BHAGAVAD GITA (18 ADHYAYAS)
          // ===================================================================
          {
            id: "vedanta-bhagavad-gita",
            parentId: "darshana-vedanta",
            type: "grantha",
            levelLabel: { en: "Smriti Prasthana", hi: "स्मृति प्रस्थान" },
            title: { en: "Srimad Bhagavad Gita (18 Adhyayas · 700 Shlokas)", hi: "श्रीमद्भगवद्गीता (१८ अध्याय · ७०० श्लोक)" },
            shortTitle: { en: "Bhagavad Gita", hi: "भगवद्गीता" },
            sanskrit: "श्रीमद्भगवद्गीता (योगशास्त्रम्)",
            badge: "18 Chapters · 700 Verses",
            cardImage: gitaCardImg,
            desc: {
              en: "The celebrated dialogue between Bhagavan Sri Krishna and Arjuna in the Bhishma Parva of the Mahabharata, synthesizing Karma Yoga, Bhakti Yoga, and Jnana Yoga into the ultimate vision of Moksha.",
              hi: "महाभारत के भीष्मपर्व का अमर आध्यात्मिक संवाद: निष्काम कर्मयोग, अनन्य भक्तियोग और परम ज्ञानयोग का दिव्य समन्वय।",
            },
            childLevelName: { en: "Shatka", hi: "षट्क" },
            children: [
              {
                id: "gita-karma-shatka",
                parentId: "vedanta-bhagavad-gita",
                type: "division",
                levelLabel: { en: "Shatka", hi: "षट्क" },
                title: { en: "Karma Shatka (Chapters 1 to 6 — The Self & Duty)", hi: "कर्म षट्क (अध्याय १ से ६ — निष्काम कर्म एवं ध्यान)" },
                shortTitle: { en: "1. Karma Shatka", hi: "१. कर्म षट्क" },
                sanskrit: "कर्मषट्कम् (अध्याय १-६)",
                badge: "Chapters 1-6",
                children: [
                  {
                    id: "gita-2-47-vedanta",
                    parentId: "gita-karma-shatka",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Gita 2.47 — Karmanyevadhikaraste", hi: "गीता २.४७ — कर्मण्येवाधिकारस्ते" },
                    shortTitle: { en: "Gita 2.47", hi: "गीता २.४७" },
                    sanskrit: "भगवद्गीता २.४७",
                    badge: "Nishkama Karma",
                    content: {
                      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
                      transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
                      meaningHi: "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए कर्मफल के हेतु मत बनो और तुम्हारी आसक्ति अकर्म (कर्म न करने) में भी न हो।",
                      meaningEn: "Thy right is to duty alone, never to its fruits; let not the fruits of action be thy motive, nor let thy attachment be to inaction.",
                      metadata: {
                        speaker: "Bhagavan Sri Krishna",
                        chapter: "2 (Sankhya Yoga)",
                        verse: "47",
                        source: "Bhagavad Gita 2.47",
                      },
                    },
                  },
                ],
              },
              {
                id: "gita-bhakti-shatka",
                parentId: "vedanta-bhagavad-gita",
                type: "division",
                levelLabel: { en: "Shatka", hi: "षट्क" },
                title: { en: "Bhakti Shatka (Chapters 7 to 12 — Divine Devotion)", hi: "भक्ति षट्क (अध्याय ७ से १२ — अनन्य भक्ति एवं विश्वरूप)" },
                shortTitle: { en: "2. Bhakti Shatka", hi: "२. भक्ति षट्क" },
                sanskrit: "भक्तिषट्कम् (अध्याय ७-१२)",
                badge: "Chapters 7-12",
                children: [
                  {
                    id: "gita-9-22-vedanta",
                    parentId: "gita-bhakti-shatka",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Gita 9.22 — Ananyash Chintayanto Mam", hi: "गीता ९.२२ — अनन्याश्चिन्तयन्तो माम्" },
                    shortTitle: { en: "Gita 9.22", hi: "गीता ९.२२" },
                    sanskrit: "भगवद्गीता ९.२२",
                    badge: "Divine Assurance",
                    content: {
                      sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
                      transliteration: "ananyāścintayanto māṃ ye janāḥ paryupāsate |\nteṣāṃ nityābhiyuktānāṃ yogakṣemaṃ vahāmyaham ||",
                      meaningHi: "जो अनन्य भक्त केवल मेरा चिंतन करते हुए मेरी उपासना करते हैं, उन नित्य युक्त भक्तों के योग (अप्राप्त की प्राप्ति) और क्षेम (प्राप्त की रक्षा) का वहन मैं स्वयं करता हूँ।",
                      meaningEn: "To those who worship Me with single-minded contemplation and unswerving devotion, I Myself secure what they lack and preserve what they possess.",
                      metadata: {
                        speaker: "Bhagavan Sri Krishna",
                        chapter: "9 (Raja Vidya Raja Guhya Yoga)",
                        verse: "22",
                        source: "Bhagavad Gita 9.22",
                      },
                    },
                  },
                ],
              },
              {
                id: "gita-jnana-shatka",
                parentId: "vedanta-bhagavad-gita",
                type: "division",
                levelLabel: { en: "Shatka", hi: "षट्क" },
                title: { en: "Jnana Shatka (Chapters 13 to 18 — Metaphysics & Surrender)", hi: "ज्ञान षट्क (अध्याय १३ से १८ — क्षेत्र-क्षेत्रज्ञ एवं शरणागति)" },
                shortTitle: { en: "3. Jnana Shatka", hi: "३. ज्ञान षट्क" },
                sanskrit: "ज्ञानषट्कम् (अध्याय १३-१८)",
                badge: "Chapters 13-18",
                children: [
                  {
                    id: "gita-18-66-vedanta",
                    parentId: "gita-jnana-shatka",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Gita 18.66 — Sarvadharman Parityajya (Charama Shloka)", hi: "गीता १८.६६ — सर्वधर्मान्परित्यज्य (चरम श्लोक)" },
                    shortTitle: { en: "Gita 18.66", hi: "गीता १८.६६" },
                    sanskrit: "भगवद्गीता १८.६६",
                    badge: "Supreme Surrender",
                    content: {
                      sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
                      transliteration: "sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja |\nahaṃ tvāṃ sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||",
                      meaningHi: "संपूर्ण धर्मों (कर्म-आश्रयों) को मुझमें समर्पित करके केवल मेरी एकमात्र शरण में आ जाओ। मैं तुम्हें समस्त पापों से मुक्त कर दूँगा, शोक मत करो।",
                      meaningEn: "Abandoning all varieties of duty, take refuge in Me alone. I shall liberate thee from all sins; grieve not.",
                      metadata: {
                        speaker: "Bhagavan Sri Krishna",
                        chapter: "18 (Moksha Sannyasa Yoga)",
                        verse: "66",
                        source: "Bhagavad Gita 18.66",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // ===================================================================
          // PILLAR 4: ACHARYATRAYI — THREE CLASSICAL TRADITIONS OF VEDANTA
          // ===================================================================
          {
            id: "vedanta-sampradayas",
            parentId: "darshana-vedanta",
            type: "grantha",
            levelLabel: { en: "Sampradayas", hi: "संप्रदाय" },
            title: { en: "The Three Acharyas & Vedantic Traditions", hi: "वेदान्त के तीन आचार्य एवं प्रमुख संप्रदाय" },
            shortTitle: { en: "3 Traditions", hi: "३ संप्रदाय" },
            sanskrit: "आचार्यत्रयी (अद्वैत, विशिष्टाद्वैत, द्वैत)",
            badge: "Advaita · Vishishtadvaita · Dvaita",
            cardImage: templeImg,
            desc: {
              en: "The classical philosophical interpretations of the Prasthanatrayi: Advaita (Non-Dualism) of Adi Shankara, Vishishtadvaita (Qualified Non-Dualism) of Ramanuja, and Dvaita (Realistic Dualism) of Madhva.",
              hi: "प्रस्थानत्रयी पर आधारित तीन महान आचार्य परंपराएँ: जगद्गुरु आदि शंकराचार्य का केवलाद्वैत, श्री रामानुजाचार्य का विशिष्टाद्वैत एवं श्री मध्वाचार्य का द्वैतवाद।",
            },
            childLevelName: { en: "Tradition", hi: "परंपरा" },
            children: [
              {
                id: "sampradaya-advaita",
                parentId: "vedanta-sampradayas",
                type: "division",
                levelLabel: { en: "Tradition", hi: "परंपरा" },
                title: { en: "Advaita Vedanta — Adi Shankaracharya", hi: "अद्वैत वेदान्त — जगद्गुरु आदि शंकराचार्य" },
                shortTitle: { en: "Advaita", hi: "अद्वैत" },
                sanskrit: "केवलाद्वैत मतम्",
                badge: "Non-Dualism",
                desc: {
                  en: "Absolute monism: Brahman alone is real, the phenomenal world is transient/illusory (Mithya), and the individual soul is identical to Brahman in essence.",
                  hi: "ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः—शुद्ध चैतन्य रूप निर्गुण ब्रह्म ही एकमात्र सत्य है।",
                },
              },
              {
                id: "sampradaya-vishishtadvaita",
                parentId: "vedanta-sampradayas",
                type: "division",
                levelLabel: { en: "Tradition", hi: "परंपरा" },
                title: { en: "Vishishtadvaita Vedanta — Sri Ramanujacharya", hi: "विशिष्टाद्वैत वेदान्त — श्री रामानुजाचार्य" },
                shortTitle: { en: "Vishishtadvaita", hi: "विशिष्टाद्वैत" },
                sanskrit: "विशिष्टाद्वैत मतम् (शरणागतिः)",
                badge: "Qualified Non-Dualism",
                desc: {
                  en: "Qualified non-dualism: Universe and individual souls constitute the real body of the Supreme Lord Sriman Narayana, attained through Bhakti and Prapatti.",
                  hi: "जीव और जगत भगवान नारायण के पावन शरीर हैं (शरीर-शरीरी भाव), और अनन्य शरणागति ही मुक्ति का मार्ग है।",
                },
              },
              {
                id: "sampradaya-dvaita",
                parentId: "vedanta-sampradayas",
                type: "division",
                levelLabel: { en: "Tradition", hi: "परंपरा" },
                title: { en: "Dvaita Vedanta — Sri Madhvacharya", hi: "द्वैत वेदान्त — श्री मध्वाचार्य" },
                shortTitle: { en: "Dvaita", hi: "द्वैत" },
                sanskrit: "तत्त्ववाद / द्वैत मतम्",
                badge: "Dualism",
                desc: {
                  en: "Radical realistic dualism: God, souls, and matter are eternally distinct (Pancha-bheda), and liberation is attained through the unalloyed grace (Prasada) of Lord Vishnu.",
                  hi: "पंच-भेद (ईश्वर, जीव और जड़ के शाश्वत अंतर) पर आधारित तत्त्वज्ञान तथा श्रीहरि विष्णु की निष्काम भक्ति व कृपा।",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // ===========================================================================
  // 03. ITIHASA & PURANA
  // ===========================================================================
  {
    id: "itihasa-purana",
    number: "03",
    type: "category",
    levelLabel: { en: "Knowledge Area", hi: "ज्ञान क्षेत्र" },
    title: { en: "03. Itihasa & Purana", hi: "०३. इतिहास एवं पुराण" },
    shortTitle: { en: "Itihasa & Purana", hi: "इतिहास एवं पुराण" },
    sanskrit: "इतिहास एवं महापुराण",
    tagline: {
      en: "Ramayana, Mahabharata, 18 Mahapuranas & Sacred Deities (Trimurti & Avataras)",
      hi: "रामायण, महाभारत, १८ महापुराण एवं दिव्य देव-तत्त्व (त्रिदेव, त्रिदेवी, दशावतार)",
    },
    cardImage: ramayanaCardImg,
    bannerImage: bannerTempleGhat,
    image: ramayanaCardImg,
    badge: "Epics & Deities",
    desc: {
      en: "The monumental cultural, moral, and historical chronicles dramatizing the triumph of Dharma through avataric descents, the cosmic Trimurti, Tridevi, and sacred genealogies.",
      hi: "धर्म, नीति, सदाचार और मानवीय आदर्शों को जन-जन तक पहुँचाने वाले अमर महाकाव्य, अठारह महापुराण एवं सगुण साकार देव-तत्त्व (त्रिदेव, त्रिदेवी, दशावतार व पंचायतन)।",
    },
    children: [
      // Ramayana
      {
        id: "ramayana",
        parentId: "itihasa-purana",
        type: "grantha",
        levelLabel: { en: "Itihasa", hi: "इतिहास" },
        title: { en: "Srimad Valmiki Ramayana", hi: "श्रीमद् वाल्मीकि रामायण" },
        shortTitle: { en: "Ramayana", hi: "रामायण" },
        sanskrit: "श्रीमद्वाल्मीकीय रामायणम्",
        tagline: {
          en: "7 Kandas · 500 Sargas · 24,000 Shlokas · The Adikavya",
          hi: "७ काण्ड · ५०० सर्ग · २४,००० श्लोक · आदिकाव्य",
        },
        cardImage: ramayanaCardImg,
        bannerImage: bannerSanctum,
        image: ramayanaCardImg,
        badge: "7 Kandas",
        desc: {
          en: "The foundational epic (Adikavya) composed by Adi Kavi Maharshi Valmiki, narrating the life and righteousness of Maryada Purushottama Sri Rama.",
          hi: "आदिकवि महर्षि वाल्मीकि द्वारा रचित विश्व का प्रथम महाकाव्य, जिसमें मर्यादा पुरुषोत्तम भगवान श्रीराम के धर्ममय जीवन का गान है।",
        },
        childLevelName: { en: "Kanda", hi: "काण्ड" },
        children: [
          {
            id: "ramayana-bala-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Bala Kanda (77 Sargas)", hi: "बाल काण्ड (७७ सर्ग)" },
            shortTitle: { en: "Bala Kanda", hi: "बाल काण्ड" },
            sanskrit: "बालकाण्डम्",
            tagline: {
              en: "The divine advent of Sri Rama, Vishvamitra's yajnas, and Sita Kalyana across 77 Sargas",
              hi: "श्रीराम का दिव्य प्राकट्य, विश्वामित्र यज्ञ-रक्षा एवं पावन सीता-कल्याण के ७७ सर्ग",
            },
            desc: {
              en: "Bala Kanda is the inaugural book of the Valmiki Ramayana comprising 77 Sargas. It chronicles the descent of Lord Rama, sage Vishvamitra's protection of sacred rituals, the redemption of Ahalya, and the breaking of Shiva's bow.",
              hi: "बाल काण्ड वाल्मीकि रामायण का प्रथम सोपान है जिसमें कुल ७७ सर्ग हैं। इसमें भगवान श्रीराम का प्राकट्य, विश्वामित्र के यज्ञ की रक्षा, अहल्या-उद्धार और शिवधनुष-भंग का पावन प्रसंग वर्णित है।",
            },
            badge: "77 Sargas",
            childLevelName: { en: "Sargas (Chapters)", hi: "सर्ग (अध्याय)" },
            children: [
              {
                id: "ramayana-bk-s1",
                parentId: "ramayana-bala-kanda",
                type: "section",
                levelLabel: { en: "Sarga", hi: "सर्ग" },
                title: { en: "Sarga 1: Narada-Valmiki Samvada (Mula Ramayana)", hi: "प्रथम सर्ग: नारद-वाल्मीकि संवाद (मूल रामायण)" },
                shortTitle: { en: "Sarga 1", hi: "सर्ग १" },
                sanskrit: "प्रथमः सर्गः (संक्षेप रामायणम्)",
                badge: "100 Shlokas",
                children: [
                  {
                    id: "ramayana-1-1-1",
                    parentId: "ramayana-bk-s1",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Ramayana 1.1.1 — Tapah Svadhyaya Niratam", hi: "रामायण १.१.१ — तपःस्वाध्यायनिरतं" },
                    shortTitle: { en: "Shloka 1", hi: "श्लोक १" },
                    sanskrit: "रामायण १.१.१",
                    content: {
                      sanskrit: "ॐ तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम्।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम्॥",
                      transliteration: "oṃ tapaḥsvādhyāyanirataṃ tapasvī vāgvidāṃ varam |\nnāradaṃ paripapraccha vālmīkirmunipuṅgavam ||",
                      meaningHi: "तप और स्वाध्याय में निरंतर लीन रहने वाले तपस्वी महर्षि वाल्मीकि ने वाणी के श्रेष्ठ ज्ञाताओं में अग्रणी मुनिश्रेष्ठ देवर्षि नारद से आदरपूर्वक पूछा...",
                      meaningEn: "The ascetic Maharshi Valmiki, ever absorbed in penance and self-study, reverently inquired of the celestial sage Narada, the foremost of all eloquent masters...",
                      metadata: {
                        kanda: "Bala Kanda",
                        sarga: "1",
                        shloka: "1",
                        poet: "Adi Kavi Maharshi Valmiki (आदिकवि वाल्मीकि)",
                        chandas: "Anushtubh (अनुष्टुप्)",
                        source: "Valmiki Ramayana, Bala Kanda 1.1",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-ayodhya-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Ayodhya Kanda (Book 2 · 119 Sargas)", hi: "अयोध्या काण्ड (द्वितीय सोपान · ११९ सर्ग)" },
            shortTitle: { en: "Ayodhya Kanda", hi: "अयोध्या काण्ड" },
            sanskrit: "अयोध्याकाण्डम्",
            tagline: {
              en: "Valmiki Ramayana Book 2 · 119 Sargas of Rama's Virtues, Forest Exile & Devotion of Bharata",
              hi: "वाल्मीकि रामायण का द्वितीय सोपान · श्रीराम-सद्गुण, वनवास-स्वीकार एवं भरत-भक्ति के ११९ सर्ग",
            },
            desc: {
              en: "Ayodhya Kanda is the second book of Valmiki Ramayana comprising 119 Sargas (chapters) across 4,286 sacred verses. Below, explore the 6 pivotal thematic episodes (Prakaranas) covering Rama's coronation proposal, the forest exile, the meeting with Guha, and the bestowal of the holy Padukas to Bharata.",
              hi: "अयोध्या काण्ड श्रीमद् वाल्मीकि रामायण का द्वितीय पावन सोपान है जिसमें कुल ११९ सर्ग एवं ४,२८६ श्लोक हैं। यहाँ ६ मुख्य प्रकरणों में राज्याभिषेक-प्रस्ताव, वनवास-प्रस्थान, निषादराज मिलन एवं पादुका-प्रदान सहित प्रमुख सर्गों का अध्ययन करें।",
            },
            badge: "119 Sargas (6 Episodes)",
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "ak-prakarana-1",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Pattābhiṣeka-Prastāva (Sargas 1–4)", hi: "पट्टाभिषेक-प्रस्ताव (सर्ग १–४)" },
                shortTitle: { en: "Coronation Proposal", hi: "राज्याभिषेक प्रस्ताव" },
                sanskrit: "पट्टाभिषेक-प्रस्तावः",
                badge: "Sargas 1-4",
                children: [
                  {
                    id: "ak-sarga-1",
                    parentId: "ak-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 1: Rāma-Guṇa-Kīrtana", hi: "प्रथम सर्ग: श्रीराम-सद्गुण-वर्णन" },
                    shortTitle: { en: "Sarga 1", hi: "सर्ग १" },
                    sanskrit: "सर्ग १ (५१ श्लोक)",
                    content: {
                      sanskrit: "गच्छता मातुलकुलं भरतेन यदाऽनघः।\nशत्रुघ्नो नीतवान्प्रीत्या लक्ष्मणेन सह प्रभुः॥\nस हि रूपोपपन्नश्च वीर्यवाननसूयकः।\nधैर्ये हिमवतः सदृशो वीर्येण च जनार्दनः॥",
                      transliteration: "gacchatā mātulakulaṃ bharatena yadā'naghaḥ |\nśatrughno nītavānprītyā lakṣmaṇena saha prabhuḥ ||\nsa hi rūpopapannaśca vīryavānanasūyakaḥ |\ndhairye himavataḥ sadṛśo vīryeṇa ca janārdanaḥ ||",
                      meaningHi: "श्रीराम रूप-सौंदर्य, अतुल पराक्रम और ईर्ष्या-रहित स्वभाव से संपन्न थे। धैर्य में वे साक्षात् हिमालय के समान और पराक्रम में भगवान जनार्दन (विष्णु) के सदृश थे।",
                      meaningEn: "Endowed with peerless divine beauty, limitless courage, and a heart free from all envy, Rama equaled the mighty Himalayas in steadfast endurance and Lord Janardana Himself in valor.",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "1",
                        shloka: "1-2",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana, Ayodhya Kanda 2.1.1-2",
                      },
                    },
                  },
                  {
                    id: "ak-sarga-2",
                    parentId: "ak-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 2: Rāja-Sabhā & Citizen Approbation", hi: "द्वितीय सर्ग: राजसभा एवं प्रजा-अनुमोदन" },
                    shortTitle: { en: "Sarga 2", hi: "सर्ग २" },
                    sanskrit: "सर्ग २ (५४ श्लोक)",
                    content: {
                      sanskrit: "इच्छामो हि महाबाहुं रघुवीरं महाबलम्।\nगजेन महता यान्तं रामं छत्रावृताननम्॥",
                      transliteration: "icchāmo hi mahābāhuṃ raghuvīraṃ mahābalam |\ngajena mahatā yāntaṃ rāmaṃ chatrāvṛtānanam ||",
                      meaningHi: "समस्त प्रजाजनों और सभासदों ने एक स्वर में कहा: 'हम विशाल बाहुओं वाले महाबली रघुवीर श्रीराम को विशाल राजहस्ती पर सवार, श्वेत छत्र से सुशोभित युवराज के रूप में देखना चाहते हैं!'",
                      meaningEn: "'We wholeheartedly yearn to behold mighty Rama, the valiant hero of the Raghu dynasty, proceeding upon the great royal elephant, shaded by the sovereign white umbrella!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "2",
                        shloka: "22",
                        source: "Valmiki Ramayana 2.2.22",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-prakarana-2",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Mantharā-Kucakra & Kaikeyī Kopa (Sargas 7–12)", hi: "मन्थरा-कुचक्र एवं कैकेयी-कोप (सर्ग ७–१२)" },
                shortTitle: { en: "Manthara & Kaikeyi", hi: "मन्थरा व कैकेयी" },
                sanskrit: "मन्थरा-कुचक्रम्",
                badge: "Sargas 7-12",
                children: [
                  {
                    id: "ak-sarga-9",
                    parentId: "ak-prakarana-2",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 9: Kaikeyi Enters Chamber of Wrath", hi: "नवम सर्ग: कैकेयी का क्रोधागार-प्रवेश" },
                    shortTitle: { en: "Sarga 9", hi: "सर्ग ९" },
                    sanskrit: "सर्ग ९",
                    content: {
                      sanskrit: "रामं च वनवासं त्वं नव वर्षाणि पञ्च च।\nभरतं राज्यभावेन योजयस्व महीपते॥",
                      transliteration: "rāmaṃ ca vanavāsaṃ tvaṃ nava varṣāṇi pañca ca |\nbharataṃ rājyabhāvena yojayasva mahīpate ||",
                      meaningHi: "मन्थरा ने कैकेयी को दो वरदान मांगने के लिए प्रेरित किया: 'श्रीराम को चौदह वर्ष (९ + ५) का वनवास दिया जाए और भरत का राज्याभिषेक किया जाए।'",
                      meaningEn: "'Demand fourteen years of exile into the Dandaka forest for Rama, and consecrate Bharata as sovereign over the realm!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "9",
                        shloka: "31",
                        source: "Valmiki Ramayana 2.9.31",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-prakarana-4",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Rāma-Samvāda & Vanavāsa-Svīkāra (Sargas 18–19)", hi: "श्रीराम-संवाद एवं वनवास-स्वीकार (सर्ग १८–१९)" },
                shortTitle: { en: "Acceptance of Exile", hi: "वनवास स्वीकार" },
                sanskrit: "वनवास-स्वीकारः",
                badge: "Sargas 18-19",
                children: [
                  {
                    id: "ak-sarga-19",
                    parentId: "ak-prakarana-4",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 19: Rama's Unmoved Equanimity & Filial Duty", hi: "एकोनविंश सर्ग: श्रीराम की परम समता एवं पितृभक्ति" },
                    shortTitle: { en: "Sarga 19", hi: "सर्ग १९" },
                    sanskrit: "सर्ग १९",
                    content: {
                      sanskrit: "नह्यतो धर्मचरणं किञ्चिदस्ति महत्तरम्।\nयथा पितरि शुश्रूषा तस्य वा वचनक्रिया॥\nधर्मो हि परमो लोके धर्मे सत्यं प्रतिष्ठितम्।",
                      transliteration: "nahyato dharmacaraṇaṃ kiñcidasti mahattaram |\nyathā pitari śuśrūṣā tasya vā vacanakriyā ||\ndharmo hi paramo loke dharme satyaṃ pratiṣṭhitam |",
                      meaningHi: "संसार में माता-पिता की सेवा और उनकी आज्ञा का पालन करने से बढ़कर कोई धर्म नहीं है। धर्म ही संसार में सर्वोपरि है और धर्म में ही सत्य प्रतिष्ठित है।",
                      meaningEn: "'There is no higher practice of righteousness in this universe than obedience and reverent service to one’s father. Dharma is supreme in all worlds, and in Dharma alone is Truth established!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "19",
                        shloka: "22",
                        speaker: "Bhagavan Shri Rama",
                        source: "Valmiki Ramayana 2.19.22",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-prakarana-7",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Śṛṅgaverapura & Gaṅgā-Taraṇa (Sargas 50–52)", hi: "शृङ्गवेरपुर एवं गङ्गा-तरण (सर्ग ५०–५२)" },
                shortTitle: { en: "Crossing Ganga", hi: "गङ्गा-पार" },
                sanskrit: "गङ्गा-तरणम्",
                badge: "Sargas 50-52",
                children: [
                  {
                    id: "ak-sarga-52",
                    parentId: "ak-prakarana-7",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 52: Crossing Holy Ganga with Guha", hi: "द्विपञ्चाश सर्ग: निषादराज गुह एवं गङ्गा-तरण" },
                    shortTitle: { en: "Sarga 52", hi: "सर्ग ५२" },
                    sanskrit: "सर्ग ५२",
                    content: {
                      sanskrit: "नमस्ते देवि गङ्गे त्वं वरदे लोकपावनि।\nपुनरेष्यामि सङ्कल्प्य सह भ्रात्रा विदेहया॥",
                      transliteration: "namaste devi gaṅge tvaṃ varade lokapāvani |\npunareṣyāmi saṅkalpya saha bhrātrā videhayā ||",
                      meaningHi: "माता सीता ने भगवती गङ्गा को प्रणाम कर प्रार्थना की: 'हे तीनों लोकों को पवित्र करने वाली देवि गङ्गे! चौदह वर्ष का वनवास पूर्ण कर हम भाई लक्ष्मण और प्रभु श्रीराम सहित सकुशल आपके तट पर पुनः लौटें।'",
                      meaningEn: "'Salutations unto you, O holy Mother Ganga, purifier of the triple worlds! May we return safely to your holy waters after fulfilling our solemn fourteen-year forest vow!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "52",
                        shloka: "81",
                        speaker: "Mata Sita",
                        source: "Valmiki Ramayana 2.52.81",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-prakarana-11",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Citrakūṭa Yātrā & Bharata-Milāp (Sargas 83–105)", hi: "चित्रकूट-यात्रा एवं भरत-मिलाप (सर्ग ८३–१०५)" },
                shortTitle: { en: "Bharata Milap", hi: "भरत-मिलाप" },
                sanskrit: "चित्रकूट भरत-मिलापः",
                badge: "Sargas 83-105",
                children: [
                  {
                    id: "ak-sarga-100",
                    parentId: "ak-prakarana-11",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 100: Kaccid Sarga (Treatise on Rajadharma)", hi: "शततम सर्ग: कच्चित् सर्ग (राजधर्म एवं शासन-विज्ञान)" },
                    shortTitle: { en: "Sarga 100", hi: "सर्ग १००" },
                    sanskrit: "सर्ग १०० (७६ श्लोक)",
                    content: {
                      sanskrit: "कच्चिदात्मसमाः शूराः श्रुतवन्तो जितेन्द्रियाः।\nकुलीनाश्चेङ्गितज्ञाश्च कृतास्ते तात मन्त्रिणः॥\nमन्त्रो विजयमूलं हि राज्ञां भवति राघव।",
                      transliteration: "kaccidātmasamāḥ śūrāḥ śrutavanto jitendriyāḥ |\nkulīnāśceṅgitajñāśca kṛtāste tāta mantriṇaḥ ||\nmantro vijayamūlaṃ hi rājñāṃ bhavati rāghava |",
                      meaningHi: "श्रीराम ने भरत से पूछा: 'हे तात! क्या तुमने अपने समान शूरवीर, शास्त्रज्ञ, जितेन्द्रिय, कुलीन और मन के भाव को समझने वाले योग्य व्यक्तियों को मंत्री बनाया है? क्योंकि गुप्त परामर्श (मंत्रणा) ही राजाओं की विजय का मूल है।'",
                      meaningEn: "'Have you appointed ministers who are valiant, learned in scriptures, masters of their senses, of noble lineage, and able to read motives from subtle gestures? Wise counsel is the very root of victory for kings!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "100 (Kaccid Sarga)",
                        shloka: "15-16",
                        subject: "Treatise on Public Administration & Rajadharma",
                        source: "Valmiki Ramayana 2.100.15-16",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-prakarana-12",
                parentId: "ramayana-ayodhya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Pādukā-Pradāna & Bharata-Prasthāna (Sargas 106–115)", hi: "पादुका-प्रदान एवं भरत-प्रस्थान (सर्ग १०६–११५)" },
                shortTitle: { en: "Paduka Pradana", hi: "पादुका प्रदान" },
                sanskrit: "पादुका-प्रदानम्",
                badge: "Sargas 106-115",
                children: [
                  {
                    id: "ak-sarga-112",
                    parentId: "ak-prakarana-12",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 112: Bestowal of Rama's Charana-Paduka", hi: "द्वादशाधिकशततम सर्ग: चरण-पादुका समर्पण" },
                    shortTitle: { en: "Sarga 112", hi: "सर्ग ११२" },
                    sanskrit: "सर्ग ११२",
                    content: {
                      sanskrit: "अधिरोह त्वमार्यस्य पादौ पादुकयोर्युगे।\nएते हि सर्वलोकस्य योगक्षेमं विधास्यतः॥",
                      transliteration: "adhiroha tvamāryasya pādau pādukayoryuge |\nete hi sarvalokasya yogakṣemaṃ vidhāsyataḥ ||",
                      meaningHi: "भरत की अश्रुपूरित विनती पर श्रीराम ने अपनी स्वर्ण-जड़ित काष्ठ पादुकाओं पर चरण रखे और उन्हें भरत को सौंप दिया, जो सम्पूर्ण राज्य के योग-क्षेम का संवहन करने वाली थीं।",
                      meaningEn: "'Step your sacred feet upon these wooden sandals, O noble elder brother! These sandals alone shall govern the realm and ensure the welfare (Yoga-Kshema) of all beings!'",
                      metadata: {
                        kanda: "Ayodhya Kanda",
                        sarga: "112",
                        shloka: "21",
                        source: "Valmiki Ramayana 2.112.21",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-aranya-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Aranya Kanda (Book 3 · 75 Sargas)", hi: "अरण्य काण्ड (तृतीय सोपान · ७५ सर्ग)" },
            shortTitle: { en: "Aranya Kanda", hi: "अरण्य काण्ड" },
            sanskrit: "अरण्यकाण्डम्",
            badge: "75 Sargas",
            tagline: {
              en: "Valmiki Ramayana Book 3 · Dandakaranya hermitage life, Panchavati, Golden Deer & Jatayu Moksha",
              hi: "वाल्मीकि रामायण का तृतीय सोपान · दण्डकारण्य मुनि-आश्रम वास, पञ्चवटी निवास, सुवर्णमृग एवं जटायु-मोक्ष",
            },
            desc: {
              en: "Aranya Kanda is the third book of Valmiki Ramayana comprising 75 Sargas across 2,440 sacred shlokas. It depicts Lord Rama's righteous wanderings through Dandakaranya, the encounter with Maharshi Agastya, the tragic abduction of Mother Sita by Ravana, and the supreme valor and martyrdom of Jatayu.",
              hi: "अरण्य काण्ड वाल्मीकि रामायण का तृतीय सोपान है जिसमें ७५ सर्ग एवं २,४४० श्लोक हैं। इसमें दण्डकारण्य के पावन आश्रमों में प्रभु श्रीराम-लक्ष्मण-सीता का वास, अगस्त्य मुनि से दिव्य अस्त्र-शस्त्र प्राप्ति, खर-दूषण वध, मारीच-प्रसंग, सीता-हरण तथा जटायु का परम मोक्ष-प्रदान वर्णित है।",
            },
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "ak-arn-prakarana-1",
                parentId: "ramayana-aranya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Panchavati-Nivasa & Ashrama Life (Sargas 13–16)", hi: "पञ्चवटी-निवास एवं आश्रम-जीवन (सर्ग १३–१६)" },
                shortTitle: { en: "Panchavati Residence", hi: "पञ्चवटी निवास" },
                sanskrit: "पञ्चवटी-निवासः",
                badge: "Sargas 13-16",
                children: [
                  {
                    id: "ak-arn-sarga-15",
                    parentId: "ak-arn-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 15: Building the Sacred Leaf-Hermitage at Panchavati", hi: "पञ्चदश सर्ग: पञ्चवटी में दिव्य पर्णकुटी निर्माण" },
                    shortTitle: { en: "Sarga 15", hi: "सर्ग १५" },
                    sanskrit: "सर्ग १५",
                    content: {
                      sanskrit: "पर्णशालां सुविपुलां दिव्यां रम्यां मनोरमाम्।\nसुसंहतां दृढां चैव चकार सुमहाबलः॥\nन हि तेन विना सीता न चाहमपि राघव।\nमुहूर्त्तमपि जीवावो जलान्मत्स्याविवोद्धृतौ॥",
                      transliteration: "parṇaśālāṃ suvipulāṃ divyāṃ ramyāṃ manoramām |\nsusaṃhatāṃ dṛḍhāṃ caiva cakāra sumahābalaḥ ||\nna hi tena vinā sītā na cāhamapi rāghava |\nmuhūrttamapi jīvāvo jalānmatsyāvivoddhṛtau ||",
                      meaningHi: "महाबली लक्ष्मण जी ने गोदावरी के सुरम्य तट पर अत्यंत सुदृढ़, सुंदर और प्रशस्त पर्णकुटी का निर्माण किया। श्रीराम के प्रति अनन्य समर्पण भाव से लक्ष्मण ने कहा—'हे राघव! आपके बिना सीता और मैं, जल से निकाले हुए मत्स्य की भाँति एक क्षण भी जीवित नहीं रह सकते।' ",
                      meaningEn: "The valiant Lakshmana built a splendid, robust and spacious leaf-hermitage upon the serene bank of the Godavari. With boundless devotion Lakshmana declared: 'O Raghava! Bereft of you, neither Sita nor I could survive for even a moment, like fish drawn forth from water!'",
                      metadata: {
                        kanda: "Aranya Kanda",
                        sarga: "15",
                        shloka: "21-23",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 3.15.21-23",
                      },
                    },
                  },
                ],
              },
              {
                id: "ak-arn-prakarana-2",
                parentId: "ramayana-aranya-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Jatayu-Moksha & Supreme Martyrdom (Sargas 67–68)", hi: "जटायु-मोक्ष एवं अमर बलिदान (सर्ग ६७–६८)" },
                shortTitle: { en: "Jatayu Moksha", hi: "जटायु मोक्ष" },
                sanskrit: "जटायु-मोक्षः",
                badge: "Sargas 67-68",
                children: [
                  {
                    id: "ak-arn-sarga-68",
                    parentId: "ak-arn-prakarana-2",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 68: Bestowal of Liberation to Gidharaj Jatayu", hi: "अष्टषष्टि सर्ग: गृध्रराज जटायु को परमगति प्रदान" },
                    shortTitle: { en: "Sarga 68", hi: "सर्ग ६८" },
                    sanskrit: "सर्ग ६८",
                    content: {
                      sanskrit: "मया त्वं समनुज्ञातो गच्छ लोकाननुत्तमान्।\nगृध्रराज महासत्त्व संस्कृतश्च मया व्रज॥\nया गतिर्यज्ञशीलानामाहिताग्नेश्च या गतिः।\nअपरिवर्तिनां या च तां गतिं गच्छ पूजितः॥",
                      transliteration: "mayā tvaṃ samanujñāto gaccha lokānanuttamān |\ngṛdhrarāja mahāsattva saṃskṛtaśca mayā vraja ||\nyā gatiryajñaśīlānāmāhitāgneśca yā gatiḥ |\naparivartināṃ yā ca tāṃ gatiṃ gaccha pūjitaḥ ||",
                      meaningHi: "भगवान श्रीराम ने अपने हाथों से जटायु का अंतिम संस्कार करते हुए आशीर्वाद दिया: 'हे महापराक्रमी गृध्रराज! मेरी आज्ञा से आप उन सर्वोच्च धामों को प्राप्त हों जो यज्ञकर्ताओं, अग्निहोत्रियों और युद्धभूमि में अडिग रहने वाले शूरवीरों को प्राप्त होते हैं। मेरे द्वारा पूजित होकर आप परमगति को प्राप्त हों।'",
                      meaningEn: "Performing the sacred rites for the fallen bird king with His own hands, Lord Rama blessed Jatayu: 'O mighty Gridhra-raja! Sanctioned by Me, ascend to those supreme celestial realms attained by great sacrificers, keepers of sacred fires, and unyielding heroes of the battlefield!'",
                      metadata: {
                        kanda: "Aranya Kanda",
                        sarga: "68",
                        shloka: "29-30",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 3.68.29-30",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-kishkindha-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Kishkindha Kanda (Book 4 · 67 Sargas)", hi: "किष्किन्धा काण्ड (चतुर्थ सोपान · ६७ सर्ग)" },
            shortTitle: { en: "Kishkindha Kanda", hi: "किष्किन्धा काण्ड" },
            sanskrit: "किष्किन्धाकाण्डम्",
            badge: "67 Sargas",
            tagline: {
              en: "Valmiki Ramayana Book 4 · Hanuman's introduction, Rama-Sugriva pact, Vali Vadha & Vanara mobilization",
              hi: "वाल्मीकि रामायण का चतुर्थ सोपान · श्रीहनुमान् जी से प्रथम मिलन, राम-सुग्रीव सख्य, वालि-मोक्ष एवं वानर-सैन्य संधान",
            },
            desc: {
              en: "Kishkindha Kanda is the fourth book of Valmiki Ramayana comprising 67 Sargas and 2,453 shlokas. It chronicles Rama's emotional grief at Pampa lake, the introduction of Sri Hanuman as Sugriva's minister, the sacred fire oath of everlasting friendship, the piercing of the seven Tala trees, and Sugriva mobilizing millions of vanaras across all quarters.",
              hi: "किष्किन्धा काण्ड वाल्मीकि रामायण का चतुर्थ सोपान है जिसमें ६७ सर्ग एवं २,४५३ श्लोक हैं। पम्पा सरोवर पर श्रीराम का विरह, ऋष्यमूक पर्वत पर पवनपुत्र हनुमान् जी का प्रथम दर्शन, पावक (अग्नि) को साक्षी रखकर सुग्रीव से अटूट मित्रता, सप्तताल-भेदन, वालि-उद्धार तथा चारों दिशाओं में वानर-सेना का प्रस्थान इसमें वर्णित है।",
            },
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "kk-prakarana-1",
                parentId: "ramayana-kishkindha-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Rama-Sugriva Sakhya & Sacred Fire Pact (Sargas 1–5)", hi: "राम-सुग्रीव सख्य एवं पावक-साक्षी मित्रता (सर्ग १–५)" },
                shortTitle: { en: "Sacred Fire Alliance", hi: "अग्नि-साक्षी मित्रता" },
                sanskrit: "राम-सुग्रीव-सख्यम्",
                badge: "Sargas 1-5",
                children: [
                  {
                    id: "kk-sarga-5",
                    parentId: "kk-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 5: Hanuman Kindles Sacred Fire for Rama and Sugriva", hi: "पञ्चम सर्ग: हनुमान् जी द्वारा प्रज्वलित पावक के समक्ष पावन मैत्री" },
                    shortTitle: { en: "Sarga 5", hi: "सर्ग ५" },
                    sanskrit: "सर्ग ५",
                    content: {
                      sanskrit: "ततोऽग्निं दीप्यमानं तौ चक्रतुश्च प्रदक्षिणम्।\nसुग्रीवो राघवश्चैव वयस्यत्वमुपागतौ॥\nततः सुप्रीतमनसौ तावुभौ हरिराघवौ।\nअन्योन्यमभिवीक्षन्तौ न तृप्तिमधिजग्मतुः॥",
                      transliteration: "tato'gniṃ dīpyamānaṃ tau cakratuśca pradakṣiṇam |\nsugrīvo rāghavaścaiva vayasyatvamupāgatau ||\ntataḥ suprītamanasau tāvubhau harirāghavau |\nanyonyamabhivīkṣantau na tṛptimadhijagmatuḥ ||",
                      meaningHi: "श्रीहनुमान जी द्वारा अरणि-काष्ठ से प्रज्वलित पावन अग्नि की श्रीराम और सुग्रीव ने प्रदक्षिणा की और परस्पर शाश्वत मित्रता स्वीकार की। परम प्रसन्न मन होकर दोनों एक-दूसरे को निहारते हुए तृप्त नहीं हो रहे थे।",
                      meaningEn: "Then circumambulating the blazing sacred fire kindled by Hanuman, both Sugriva and Rama entered into solemn everlasting friendship. With hearts overflowing with profound delight, neither could gaze enough upon the other.",
                      metadata: {
                        kanda: "Kishkindha Kanda",
                        sarga: "5",
                        shloka: "16-17",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 4.5.16-17",
                      },
                    },
                  },
                ],
              },
              {
                id: "kk-prakarana-2",
                parentId: "ramayana-kishkindha-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Jambavan Inspires Hanuman for the Ocean Leap (Sargas 66–67)", hi: "जांबवान् द्वारा हनुमान जी का तेज-जागरण (सर्ग ६६–६७)" },
                shortTitle: { en: "Awakening Hanuman's Might", hi: "हनुमान्-तेज जागरण" },
                sanskrit: "तेज-जागरणम्",
                badge: "Sargas 66-67",
                children: [
                  {
                    id: "kk-sarga-67",
                    parentId: "kk-prakarana-2",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 67: Hanuman Assumes the Vast Cosmic Form (Vishvarupa)", hi: "सप्तषष्टि सर्ग: पवनपुत्र हनुमान् जी का विराट् रूप" },
                    shortTitle: { en: "Sarga 67", hi: "सर्ग ६७" },
                    sanskrit: "सर्ग ६७",
                    content: {
                      sanskrit: "उत्तिष्ठ हरिशार्दूल लङ्घयस्व महार्णवम्।\nपराक्रमस्व वीरेण वीर्यं ते ज्ञातुमर्हसि॥\nस तदा संप्रहृष्टात्मा हरिराजबलार्दितः।\nबभौ संहर्षयन्सर्वान्वा नरान्बलदर्पितः॥",
                      transliteration: "uttiṣṭha hariśārdūla laṅghayasva mahārṇavam |\nparākramasva vīreṇa vīryaṃ te jñātumarhasi ||\nsa tadā saṃprahṛṣṭātmā harirājabalārditaḥ |\nbabhau saṃharṣayansarvānvā narānbaladarpitaḥ ||",
                      meaningHi: "ऋक्षराज जांबवान् ने हनुमान जी को उनके असीम सामर्थ्य का स्मरण कराया: 'हे वानरश्रेष्ठ! उठिए और इस विशाल महासमुद्र को लांघिए! अपने अप्रतिम पराक्रम को पहचानिए।' यह सुनते ही हनुमान जी ने समस्त वानरों में अपार उत्साह भरते हुए अपना विशाल स्वरूप धारण किया।",
                      meaningEn: "Jambavan stirred the dormant prowess of Hanuman: 'Arise, O lion among vanaras! Leap across the vast ocean and manifest your peerless valor!' Hearing this, Hanuman’s spirit surged with divine energy as He expanded His form, filling all warriors with supreme confidence.",
                      metadata: {
                        kanda: "Kishkindha Kanda",
                        sarga: "67",
                        shloka: "2-4",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 4.67.2-4",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-sundara-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Sundara Kanda (Book 5 · 68 Sargas)", hi: "सुन्दर काण्ड (पंचम सोपान · ६८ सर्ग)" },
            shortTitle: { en: "Sundara Kanda", hi: "सुन्दर काण्ड" },
            sanskrit: "सुन्दरकाण्डम्",
            badge: "68 Sargas",
            tagline: {
              en: "Valmiki Ramayana Book 5 · Hanuman's Ocean Leap, Sita Search & Lanka Dahan across 68 Sargas",
              hi: "वाल्मीकि रामायण का पंचम सोपान · श्रीहनुमान् जी का समुद्र-लंघन, सीता-खोज एवं लंका-दहन के ६८ सर्ग",
            },
            desc: {
              en: "Sundara Kanda is the heart of the Valmiki Ramayana comprising 68 Sargas. It chronicles Shri Hanuman's mighty flight across the ocean to Lanka, locating Mother Sita in the Ashoka Vatika, delivering Rama's signet ring, and the burning of Lanka.",
              hi: "सुन्दर काण्ड वाल्मीकि रामायण का सर्वाधिक पावन एवं फलदायी सोपान है जिसमें ६८ सर्ग हैं। इसमें श्रीहनुमान् जी का महेन्द्र पर्वत से उड्डयन, अशोक वाटिका में माता जानकी के दर्शन, मुद्रिका-समर्पण एवं लंका-दहन का अद्भुत वर्णन है।",
            },
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "sk-prakarana-1",
                parentId: "ramayana-sundara-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Ocean Crossing & Entry into Lanka (Sargas 1–4)", hi: "महासमुद्र-लङ्घन एवं लङ्का-प्रवेश (सर्ग १–४)" },
                shortTitle: { en: "Ocean Crossing", hi: "समुद्र-लङ्घन" },
                sanskrit: "समुद्र-लङ्घनम्",
                badge: "Sargas 1-4",
                children: [
                  {
                    id: "sk-sarga-1",
                    parentId: "sk-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 1: Hanuman's Colossal Leap from Mount Mahendra", hi: "प्रथम सर्ग: हनुमान् जी का महेन्द्र-पर्वत से महा-छलांग" },
                    shortTitle: { en: "Sarga 1", hi: "सर्ग १" },
                    sanskrit: "सर्ग १ (२१० श्लोक)",
                    content: {
                      sanskrit: "ततो रावणनीतायाः सीतायाः शत्रुकर्शनः।\nइयेष पदमन्वेष्टुं चारणाचरिते पथि॥",
                      transliteration: "tato rāvaṇanītāyāḥ sītāyāḥ śatrukarśanaḥ |\niyeṣa padamanveṣṭuṃ cāraṇācarite pathi ||",
                      meaningHi: "तत्पश्चात, शत्रुओं का दमन करने वाले पवनपुत्र हनुमान् जी ने रावण द्वारा अपहृत माता सीता की खोज हेतु आकाश मार्ग (चारणों द्वारा सेवित पथ) से महासमुद्र को लांघने का पावन संकल्प किया।",
                      meaningEn: "'Then Hanuman, the destroyer of adversaries, resolved to traverse the celestial pathway trodden by divine bards (Charanas) to discover the whereabouts of Mother Sita, abducted by Ravana.'",
                      metadata: {
                        kanda: "Sundara Kanda",
                        sarga: "1",
                        shloka: "1",
                        hero: "Shri Hanuman",
                        source: "Valmiki Ramayana 5.1.1",
                      },
                    },
                  },
                ],
              },
              {
                id: "sk-prakarana-3",
                parentId: "ramayana-sundara-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Hanuman-Sītā Samvāda & Mūdrā-Pradāna (Sargas 30–40)", hi: "हनुमान्-सीता संवाद एवं मुद्रिका-प्रदान (सर्ग ३०–४०)" },
                shortTitle: { en: "Ring Bestowal", hi: "मुद्रिका समर्पण" },
                sanskrit: "मुद्रिका-प्रदानम्",
                badge: "Sargas 30-40",
                children: [
                  {
                    id: "sk-sarga-36",
                    parentId: "sk-prakarana-3",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 36: Presenting Rama's Signet Ring to Mother Sita", hi: "षट्त्रिंश सर्ग: माता जानकी को श्रीराम-मुद्रिका समर्पण" },
                    shortTitle: { en: "Sarga 36", hi: "सर्ग ३६" },
                    sanskrit: "सर्ग ३६",
                    content: {
                      sanskrit: "वानरोऽहं महाभागे दूतो रामस्य धीमतः।\nरामनामाङ्कितं चेदं पश्य देव्यङ्गुलीयकम्॥",
                      transliteration: "vānaro'haṃ mahābhāge dūto rāmasya dhīmataḥ |\nrāmanāmāṅkitaṃ cedaṃ paśya devyaṅgulīyakam ||",
                      meaningHi: "हनुमान जी ने विनीत भाव से कहा: 'हे महाभागे देवि! मैं धीमान् भगवान श्रीराम का विनम्र दूत हूँ। प्रभु श्रीराम के नाम से अंकित इस दिव्य सुवर्ण अंगूठी (मुद्रिका) को आप देखें।'",
                      meaningEn: "'O exalted Goddess! I am a vanara and the humble emissary of the wise Lord Rama. Behold this sacred signet ring engraved with Rama’s glorious name!'",
                      metadata: {
                        kanda: "Sundara Kanda",
                        sarga: "36",
                        shloka: "3",
                        source: "Valmiki Ramayana 5.36.3",
                      },
                    },
                  },
                ],
              },
              {
                id: "sk-prakarana-4",
                parentId: "ramayana-sundara-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Lanka Dahan & Return to Mahendra (Sargas 41–68)", hi: "लङ्का-दहन एवं महेन्द्र-पर्वत प्रत्यावर्तन (सर्ग ४१–६८)" },
                shortTitle: { en: "Drshta Devi", hi: "दृष्टा देवी" },
                sanskrit: "लङ्का-दहन एवं प्रत्यावर्तनम्",
                badge: "Sargas 41-68",
                children: [
                  {
                    id: "sk-sarga-68",
                    parentId: "sk-prakarana-4",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 68: The Victorious Cry 'Dṛṣṭā Devī'", hi: "अष्टषष्टि सर्ग: 'दृष्टा देवी' की अमर विजय-घोषणा" },
                    shortTitle: { en: "Sarga 68", hi: "सर्ग ६८" },
                    sanskrit: "सर्ग ६८",
                    content: {
                      sanskrit: "दृष्टा देवीति हनूमद्वदनादमृतोपमम्।\nआकर्ण्य वचनं प्रीता वानरा मुमुचुः स्वनान्॥",
                      transliteration: "dṛṣṭā devīti hanūmadvadanādamṛtopamam |\nākarṇya vacanaṃ prītā vānarā mumucuḥ svanān ||",
                      meaningHi: "हनुमान जी के मुखारविंद से अमृततुल्य वचन 'दृष्टा देवी' (माता जानकी का दर्शन हो गया है) सुनते ही समस्त वानर वीर परम आनंद में जयघोष करने लगे।",
                      meaningEn: "Hearing the nectar-like words 'Dṛṣṭā Devī' (Seen is the Goddess!) pour from Hanuman’s lips, the monkey warriors roared with unbridled joy!",
                      metadata: {
                        kanda: "Sundara Kanda",
                        sarga: "68",
                        shloka: "1",
                        source: "Valmiki Ramayana 5.68.1",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-yuddha-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Yuddha Kanda (Book 6 · 128 Sargas)", hi: "युद्ध काण्ड (षष्ठ सोपान · १२८ सर्ग)" },
            shortTitle: { en: "Yuddha Kanda", hi: "युद्ध काण्ड" },
            sanskrit: "युद्धकाण्डम् (लङ्काकाण्डम्)",
            badge: "128 Sargas",
            tagline: {
              en: "Valmiki Ramayana Book 6 · Rama Sethu, Vibhishana Saranagati, Aditya Hridaya & Ravana Vadha",
              hi: "वाल्मीकि रामायण का षष्ठ सोपान · रामसेतु-निर्माण, विभीषण-शरणागति, आदित्यहृदय एवं रावण-वध",
            },
            desc: {
              en: "Yuddha Kanda (Lanka Kanda) is the monumental sixth book of the Valmiki Ramayana comprising 128 Sargas and 5,715 shlokas. It depicts the building of Rama Sethu across the southern ocean, Vibhishana's unconditional surrender, the epic battle between Dharma and Adharma, Sage Agastya imparting the Aditya Hridaya hymn, the fall of Ravana, and Rama's triumphal coronation in Ayodhya.",
              hi: "युद्ध काण्ड (लङ्का काण्ड) वाल्मीकि रामायण का षष्ठ एवं सर्वाधिक विशाल सोपान है जिसमें १२८ सर्ग तथा ५,७१५ श्लोक हैं। नल-नील द्वारा रामसेतु का निर्माण, विभीषण-शरणागति, मेघनाद व कुम्भकर्ण का पतन, अगस्त्य मुनि द्वारा प्रदत्त आदित्यहृदय स्तोत्र, रावण-वध, सीता-मिलन तथा अयोध्या में श्रीराम का भव्य पट्टाभिषेक इसमें समाहित है।",
            },
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "yk-prakarana-1",
                parentId: "ramayana-yuddha-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Vibhishana-Sharanagati (Sargas 17–19)", hi: "विभीषण-शरणागति एवं अभय-दान (सर्ग १७–१९)" },
                shortTitle: { en: "Abhaya Pradana", hi: "अभय दान" },
                sanskrit: "विभीषण-शरणागतिः",
                badge: "Sargas 17-19",
                children: [
                  {
                    id: "yk-sarga-18",
                    parentId: "yk-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 18: Rama's Eternal Vow of Refuge (Sakriddheva Prapannaya)", hi: "अष्टादश सर्ग: प्रभु श्रीराम की अभय-प्रतिज्ञा" },
                    shortTitle: { en: "Sarga 18", hi: "सर्ग १८" },
                    sanskrit: "सर्ग १८",
                    content: {
                      sanskrit: "सकृदेव प्रपन्नाय तवास्मीति च याचते।\nअभयं सर्वभूतेभ्यो ददाम्येतद् व्रतं मम॥\nआनयैनं हरिश्रेष्ठ दत्तमस्याभयं मया।\nविभीषणो वा सुग्रीव यदि वा रावणः स्वयं॥",
                      transliteration: "sakṛdeva prapannāya tavāsmīti ca yācate |\nabhayaṃ sarvabhūtebhyo dadāmyetad vrataṃ mama ||\nānayainaṃ hariśreṣṭha dattamasyābhayaṃ mayā |\nvibhīṣaṇo vā sugrīva yadi vā rāvaṇaḥ svayam ||",
                      meaningHi: "भगवान श्रीराम ने अपनी अमर शरणागति-प्रतिज्ञा घोषित करते हुए कहा: 'जो कोई भी एक बार भी मेरी शरण में आकर यह कह देता है कि हे प्रभु! मैं आपका हूँ, उसे मैं समस्त चराचर प्राणियों से अभय प्रदान कर देता हूँ—यह मेरा अटल व्रत है। हे सुग्रीव! उसे सादर यहाँ लाओ, मैंने उसे अभय दे दिया है, चाहे वह विभीषण हो अथवा स्वयं रावण!'",
                      meaningEn: "Lord Rama pronounced His eternal charter of grace: 'Whosoever seeks My refuge even once, saying \"I am Yours!\", I grant him total freedom from fear against all beings—this is My inviolable vow! Bring him forth, O Sugriva; sanctuary has been granted, whether it be Vibhishana or Ravana himself!'",
                      metadata: {
                        kanda: "Yuddha Kanda",
                        sarga: "18",
                        shloka: "33-34",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 6.18.33-34",
                      },
                    },
                  },
                ],
              },
              {
                id: "yk-prakarana-2",
                parentId: "ramayana-yuddha-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Aditya Hridaya Stotram (Sarga 105)", hi: "आदित्यहृदय स्तोत्रम् — अगस्त्य मुनि उपदेश (सर्ग १०५)" },
                shortTitle: { en: "Aditya Hridaya", hi: "आदित्यहृदय" },
                sanskrit: "आदित्यहृदयम्",
                badge: "Sarga 105",
                children: [
                  {
                    id: "yk-sarga-105",
                    parentId: "yk-prakarana-2",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 105: Sage Agastya Imparts Aditya Hridaya to Rama", hi: "पञ्चाधिकशततम सर्ग: सर्वशत्रुविनाशक आदित्यहृदय स्तोत्र" },
                    shortTitle: { en: "Sarga 105", hi: "सर्ग १०५" },
                    sanskrit: "सर्ग १०५",
                    content: {
                      sanskrit: "ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम्।\nउपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः॥\nराम राम महाबाहो शृणु गुह्यं सनातनम्।\nयेन सर्वानरीन् वत्स समरे विजयिष्यसि॥\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्।\nजयावहं जपेन्नित्यमक्षयं परमं शुभम्॥",
                      transliteration: "tato yuddhaparikrāntaṃ samare cintayā sthitam |\nrāvaṇaṃ cāgrato dṛṣṭvā yuddhāya samupasthitam ||\ndaivataiśca samāgamya draṣṭumabhyāgato raṇam |\nupāgamyābravīdrāmamagastyo bhagavān ṛṣiḥ ||\nrāma rāma mahābāho śṛṇu guhyaṃ sanātanam |\nyena sarvānarīn vatsa samare vijayiṣyasi ||\nādityahṛdayaṃ puṇyaṃ sarvaśatruvināśanam |\njayāvahaṃ japennityamakṣayaṃ paramaṃ śubham ||",
                      meaningHi: "रणभूमि में युद्ध से श्रमित और चिंतामग्न श्रीराम को देखकर देवर्षि अगस्त्य ने प्रकट होकर कहा: 'हे महाबाहु श्रीराम! इस परम गोपनीय एवं सनातन स्तोत्र को सुनो, जिसके प्रभाव से तुम समर में समस्त शत्रुओं पर विजय प्राप्त करोगे। यह पवित्र आदित्यहृदय स्तोत्र समस्त शत्रुओं का नाश करने वाला, नित्य विजय प्रदाता और परम कल्याणकारी है!'",
                      meaningEn: "Beholding Rama weary on the battlefield as Ravana advanced, the divine sage Agastya approached Him and spoke: 'O mighty-armed Rama! Listen to this eternal esoteric hymn by which you shall conquer all adversaries in battle! This sacred Aditya Hridaya destroys all foes, bestows everlasting victory, and is the highest auspiciousness!'",
                      metadata: {
                        kanda: "Yuddha Kanda",
                        sarga: "105",
                        shloka: "1-4",
                        poet: "Bhagavan Rishi Agastya / Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 6.105.1-4",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "ramayana-uttara-kanda",
            parentId: "ramayana",
            type: "division",
            levelLabel: { en: "Kanda", hi: "काण्ड" },
            title: { en: "Uttara Kanda (Book 7 · 111 Sargas)", hi: "उत्तर काण्ड (सप्तम सोपान · १११ सर्ग)" },
            shortTitle: { en: "Uttara Kanda", hi: "उत्तर काण्ड" },
            sanskrit: "उत्तरकाण्डम्",
            badge: "111 Sargas",
            tagline: {
              en: "Valmiki Ramayana Book 7 · Valmiki Ashrama, singing of Ramayana by Lava-Kusha & Eternal Ramarajya",
              hi: "वाल्मीकि रामायण का सप्तम सोपान · महर्षि वाल्मीकि आश्रम, लव-कुश द्वारा रामायण-गान एवं शाश्वत रामराज्य",
            },
            desc: {
              en: "Uttara Kanda is the concluding seventh book of the Valmiki Ramayana comprising 111 Sargas across 3,500 shlokas. It chronicles the antecedent genealogies of the Rakshasas narrated by Agastya, Mother Sita's residence in the serene hermitage of Maharshi Valmiki, the birth and musical training of Lava and Kusha, their singing of the sacred Adikavya at the royal court of Ayodhya, and the ultimate ascension of Sri Rama upon the holy Sarayu river.",
              hi: "उत्तर काण्ड वाल्मीकि रामायण का सप्तम एवं उपसंहारात्मक सोपान है जिसमें १११ सर्ग तथा ३,५०० श्लोक हैं। इसमें अगस्त्य मुनि द्वारा रावण-वंश कथा, महर्षि वाल्मीकि के तपोवन में माता सीता का वास, लव-कुश का जन्म एवं वीणा पर रामायण-गान, अश्वमेध यज्ञ तथा मर्यादा पुरुषोत्तम का पावन परमधाम गमन वर्णित है।",
            },
            childLevelName: { en: "Prakaranas (Thematic Sections)", hi: "प्रकरण (कथा प्रसंग)" },
            children: [
              {
                id: "uk-prakarana-1",
                parentId: "ramayana-uttara-kanda",
                type: "section",
                levelLabel: { en: "Prakarana", hi: "प्रकरण" },
                title: { en: "Lava and Kusha Sing the Adikavya at Rama's Court (Sargas 93–94)", hi: "श्रीराम की राजसभा में लव-कुश द्वारा रामायण-गान (सर्ग ९३–९४)" },
                shortTitle: { en: "Singing the Epic", hi: "रामायण-गान" },
                sanskrit: "रामायण-गानम्",
                badge: "Sargas 93-94",
                children: [
                  {
                    id: "uk-sarga-94",
                    parentId: "uk-prakarana-1",
                    type: "leaf",
                    levelLabel: { en: "Sarga", hi: "सर्ग" },
                    title: { en: "Sarga 94: Celestial Melodies of the Ramayana Enchant Ayodhya", hi: "चतुर्नवति सर्ग: लव-कुश के वीणा-गान से मुग्ध सभासद" },
                    shortTitle: { en: "Sarga 94", hi: "सर्ग ९४" },
                    sanskrit: "सर्ग ९४",
                    content: {
                      sanskrit: "तौ तु गान्धर्वतत्त्वज्ञौ स्थानमूर्च्छनकोविदौ।\nभ्रातरौ स्वरसंपन्नौ गन्धर्वाविव रूपिणौ॥\nरूपलक्षणसंपन्नौ मधुरस्वरभाषिणौ।\nबिम्बादिवाभिनिर्वृत्तौ रामदेहात्तथापरौ॥",
                      transliteration: "tau tu gāndharvatattvajñau sthānamūrcchanakovidau |\nbhrātarau svarasaṃpannau gandharvāviva rūpiṇau ||\nrūpalakṣaṇasaṃpannau madhurasvarabhāṣiṇau |\nbimbādivābhinirvṛttau rāmadehāttathāparau ||",
                      meaningHi: "गंधर्व-संगीत के मर्मज्ञ दोनों बालक लव और कुश, तीनों सप्तकों और मूर्च्छनाओं में प्रवीण, गंधर्वों के समान दिव्य रूपवान थे। उनका रूप-सौंदर्य और मधुर वाणी ऐसी थी मानो भगवान श्रीराम के ही स्वरूप से दो अन्य विग्रह साकार हो गए हों।",
                      meaningEn: "Those two royal brothers, Lava and Kusha, master knowers of celestial Gandharva melody and pitch modulation, looked like divine Gandharvas incarnate. In grace, noble countenance, and sweet utterance, they appeared as if Lord Rama's own divine form had been cast into twin radiant images.",
                      metadata: {
                        kanda: "Uttara Kanda",
                        sarga: "94",
                        shloka: "1-3",
                        poet: "Adi Kavi Maharshi Valmiki",
                        chandas: "Anushtubh",
                        source: "Valmiki Ramayana 7.94.1-3",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // Mahabharata
      {
        id: "mahabharata",
        parentId: "itihasa-purana",
        type: "grantha",
        levelLabel: { en: "Itihasa", hi: "इतिहास" },
        title: { en: "Mahabharata of Maharshi Vedavyasa", hi: "महाभारत — महर्षि वेदव्यास" },
        shortTitle: { en: "Mahabharata", hi: "महाभारत" },
        sanskrit: "श्रीमन्महाभारतम्",
        tagline: {
          en: "18 Parvas · 100,000 Shlokas · The Fifth Veda",
          hi: "१८ पर्व · १,००,००० श्लोक · पंचम वेद",
        },
        cardImage: mahabharataCardImg,
        bannerImage: bannerTempleGhat,
        image: mahabharataCardImg,
        badge: "18 Parvas",
        desc: {
          en: "The greatest epic in human literature, comprising the great Kurukshetra dialogue of the Bhagavad Gita and exhaustive discourses on ethics, governance, and liberation.",
          hi: "संसार का विशालतम ग्रंथ जिसमें जीवन का हर रंग, कुरुक्षेत्र में श्रीकृष्ण का गीता-उपदेश और शांति पर्व का राजधर्म समाहित है। 'यन्नेहास्ति न तत्क्वचित्'—जो यहाँ नहीं, वह कहीं नहीं।",
        },
        childLevelName: { en: "Parva", hi: "पर्व" },
        children: [
          // 01. Adi Parva
          {
            id: "mb-adi-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 01", hi: "पर्व ०१" },
            title: { en: "01. Adi Parva (The Book of the Beginning)", hi: "०१. आदि पर्व: कुरुवंश उत्पत्ति एवं पाण्डव जन्म" },
            shortTitle: { en: "01. Adi Parva", hi: "०१. आदि पर्व" },
            sanskrit: "आदिपर्व (१९ अध्याय)",
            badge: "Parva 01",
            children: [
              {
                id: "mb-adi-shloka",
                parentId: "mb-adi-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Adi Parva 1.1 — Narayanam Namaskritya", hi: "आदि पर्व १.१ — नारायणं नमस्कृत्य (मंगलाचरण)" },
                shortTitle: { en: "Mangalacharana", hi: "मंगलाचरण" },
                sanskrit: "नारायणं नमस्कृत्य नरं चैव नरोत्तमम्",
                badge: "Invocation",
                content: {
                  sanskrit: "नारायणं नमस्कृत्य नरं चैव नरोत्तमम्।\nदेवीं सरस्वतीं व्यासं ततो जयमुदीरयेत्॥",
                  transliteration: "nārāyaṇaṃ namaskṛtya naraṃ caiva narottamam |\ndevīṃ sarasvatīṃ vyāsaṃ tato jayamudīrayet ||",
                  meaningHi: "भगवान् श्रीनारायण, नरोत्तम नर (अर्जुन), भगवती सरस्वती और महर्षि वेदव्यास को श्रद्धापूर्वक प्रणाम करके 'जय' (महाभारत) का पाठ करना चाहिए।",
                  meaningEn: "Having bowed down to Lord Narayana, to Nara the foremost of human beings, to Mother Goddess Saraswati, and to Maharshi Vyasa, let us utter the word of victory—Jaya!",
                  metadata: { parva: "Adi Parva", chapter: "1", verse: "1", significance: "Universal opening invocation of Mahabharata" },
                },
              },
            ],
          },

          // 02. Sabha Parva
          {
            id: "mb-sabha-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 02", hi: "पर्व ०२" },
            title: { en: "02. Sabha Parva (The Assembly Hall & Game of Dice)", hi: "०२. सभा पर्व: मय सभा, राजसूय यज्ञ एवं द्यूत-क्रीड़ा" },
            shortTitle: { en: "02. Sabha Parva", hi: "०२. सभा पर्व" },
            sanskrit: "सभापर्व (द्यूतक्रीड़ा)",
            badge: "Parva 02",
            children: [
              {
                id: "mb-sabha-shloka",
                parentId: "mb-sabha-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Sabha Parva — Vidura's Warning on Dharma", hi: "सभा पर्व — महात्मा विदुर की नीति एवं चेतावनी" },
                shortTitle: { en: "Vidura Niti", hi: "विदुर चेतावनी" },
                sanskrit: "धर्मो हतो हन्ति धर्मो रक्षति रक्षितः",
                badge: "Sabha Parva",
                content: {
                  sanskrit: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः।\nतस्माद्धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत्॥",
                  transliteration: "dharma eva hato hanti dharmo rakṣati rakṣitaḥ |\ntasmāddharmo na hantavyo mā no dharmo hato'vadhīt ||",
                  meaningHi: "नष्ट किया हुआ धर्म नष्ट करने वाले का नाश कर देता है, और रक्षा किया हुआ धर्म रक्षा करने वाले की रक्षा करता है। इसलिए धर्म का कभी हनन नहीं करना चाहिए।",
                  meaningEn: "Righteousness (Dharma) when destroyed, destroys; Dharma when protected, protects. Therefore, let no one violate Dharma, lest destroyed Dharma strike us down!",
                  metadata: { parva: "Sabha Parva", speaker: "Mahatma Vidura", theme: "Integrity in Royal Assembly" },
                },
              },
            ],
          },

          // 03. Vana Parva
          {
            id: "mb-vana-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 03", hi: "पर्व ०३" },
            title: { en: "03. Vana Parva / Aranyaka Parva (The Forest Exile)", hi: "०३. वन पर्व: १२ वर्ष का वनवास एवं यक्ष-प्रश्न संवाद" },
            shortTitle: { en: "03. Vana Parva", hi: "०३. वन पर्व" },
            sanskrit: "वनपर्व (आरण्यकपर्व)",
            badge: "Parva 03",
            children: [
              {
                id: "mb-vana-yaksha-prashna",
                parentId: "mb-vana-parva",
                type: "leaf",
                levelLabel: { en: "Dialogue", hi: "यक्ष-युधिष्ठिर संवाद" },
                title: { en: "Yaksha Prashna — What is the Greatest Wonder?", hi: "यक्ष प्रश्न — संसार का सबसे बड़ा आश्चर्य क्या है?" },
                shortTitle: { en: "Yaksha Prashna", hi: "यक्ष प्रश्न" },
                sanskrit: "अहन्यहनि भूतानि गच्छन्तीह यमालयम्",
                badge: "Vana Parva",
                content: {
                  sanskrit: "अहन्यहनि भूतानि गच्छन्तीह यमालयम्।\nशेषाः स्थावरमिच्छन्ति किमाश्चर्यमतः परम्॥",
                  transliteration: "ahanyahani bhūtāni gacchantīha yamālayam |\nśeṣāḥ sthāvaramicchanti kimāścaryamataḥ param ||",
                  meaningHi: "प्रतिदिन अनगिनत प्राणी यमराज के घर (मृत्यु को) प्राप्त होते हैं, फिर भी जो शेष बचे हैं वे सदा जीवित रहने की इच्छा करते हैं। इससे बड़ा आश्चर्य इस संसार में और क्या हो सकता है?",
                  meaningEn: "Day after day countless beings journey to the abode of Death, yet those who remain believe they will live forever. What can be a greater wonder in this world than this?",
                  metadata: { parva: "Vana Parva 3.313", speaker: "Dharmaraja Yudhishthira", listener: "Yaksha (Dharma Devata)" },
                },
              },
            ],
          },

          // 04. Virata Parva
          {
            id: "mb-virata-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 04", hi: "पर्व ०४" },
            title: { en: "04. Virata Parva (The Year of Incognito Exile)", hi: "०४. विराट पर्व: अज्ञातवास एवं बृहन्नला रूप में अर्जुन" },
            shortTitle: { en: "04. Virata Parva", hi: "०४. विराट पर्व" },
            sanskrit: "विराटपर्व (अज्ञातवास)",
            badge: "Parva 04",
            children: [
              {
                id: "mb-virata-shloka",
                parentId: "mb-virata-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Virata Parva — Triumph of Righteousness in Disguise", hi: "विराट पर्व — सत्य एवं धैर्य की विजय" },
                shortTitle: { en: "Virata Triumph", hi: "विराट विजय" },
                sanskrit: "यतो धर्मस्ततो जयः",
                badge: "Virata Parva",
                content: {
                  sanskrit: "यतो धर्मस्ततः कृष्णो यतः कृष्णस्ततो जयः।\nधर्मेण लभ्यते सर्वं धर्मे सर्वं प्रतिष्ठितम्॥",
                  transliteration: "yato dharmastataḥ kṛṣṇo yataḥ kṛṣṇastato jayaḥ |\ndharmeṇa labhyate sarvaṃ dharme sarvaṃ pratiṣṭhitam ||",
                  meaningHi: "जहाँ धर्म है, वहाँ श्रीकृष्ण हैं; और जहाँ श्रीकृष्ण हैं, वहाँ निश्चय ही विजय है। धर्म से ही सब कुछ प्राप्त होता है और सम्पूर्ण विश्व धर्म पर ही टिका हुआ है।",
                  meaningEn: "Where there is Dharma, there is Sri Krishna; and where there is Krishna, there is certain Victory! By Dharma alone everything is attained.",
                  metadata: { parva: "Virata Parva", theme: "Steadfast patience of the Pandavas" },
                },
              },
            ],
          },

          // 05. Udyoga Parva
          {
            id: "mb-udyoga-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 05", hi: "पर्व ०५" },
            title: { en: "05. Udyoga Parva (Effort for Peace & War Preparation)", hi: "०५. उद्योग पर्व: श्रीकृष्ण शान्ति दूत एवं विदुर नीति" },
            shortTitle: { en: "05. Udyoga Parva", hi: "०५. उद्योग पर्व" },
            sanskrit: "उद्योगपर्व (शान्ति मन्त्रणा)",
            badge: "Parva 05",
            children: [
              {
                id: "mb-udyoga-shloka",
                parentId: "mb-udyoga-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Udyoga Parva — Sri Krishna's Peace Embassy", hi: "उद्योग पर्व — भगवान् श्रीकृष्ण की शान्ति दूत सभा" },
                shortTitle: { en: "Krishna Duta", hi: "कृष्ण दूत" },
                sanskrit: "शान्तिमिच्छामि कौरव्य पाण्डवानां शमेन च",
                badge: "Udyoga Parva",
                content: {
                  sanskrit: "शान्तिमिच्छामि कौरव्य पाण्डवानां शमेन च।\nन हि युद्धेन वै राज्यं लब्धुं शक्यं सुखावहम्॥",
                  transliteration: "śāntimicchāmi kauravya pāṇḍavānāṃ śamena ca |\nna hi yuddhena vai rājyaṃ labdhuṃ śakyaṃ sukhāvaham ||",
                  meaningHi: "हे धृतराष्ट्र! मैं कौरवों और पाण्डवों के बीच शान्ति चाहता हूँ, क्योंकि विनाशकारी युद्ध द्वारा प्राप्त राज्य कभी किसी के लिए सुखदायी नहीं हो सकता।",
                  meaningEn: "I desire lasting peace between the Kauravas and Pandavas, O Dhritarashtra! For a kingdom acquired through cataclysmic war can never bring enduring happiness to anyone.",
                  metadata: { parva: "Udyoga Parva", speaker: "Bhagavan Sri Krishna", theme: "Ultimate effort to avoid war" },
                },
              },
            ],
          },

          // 06. Bhishma Parva (Contains Bhagavad Gita)
          {
            id: "mb-bhishma-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 06", hi: "पर्व ०६" },
            title: { en: "06. Bhishma Parva (Contains Srimad Bhagavad Gita)", hi: "०६. भीष्म पर्व: श्रीमद्भगवद्गीता समाहित (१० दिन का युद्ध)" },
            shortTitle: { en: "06. Bhishma Parva", hi: "०६. भीष्म पर्व" },
            sanskrit: "भीष्मपर्व (गीता सार)",
            badge: "Contains Gita",
            children: [
              {
                id: "mb-gita-ch2",
                parentId: "mb-bhishma-parva",
                type: "section",
                levelLabel: { en: "Adhyaya", hi: "अध्याय" },
                title: { en: "Gita Chapter 2: Sankhya Yoga (72 Shlokas)", hi: "गीता अध्याय २: सांख्य योग (७२ श्लोक)" },
                shortTitle: { en: "Gita Ch 2", hi: "गीता अध्याय २" },
                sanskrit: "सांख्ययोगः (अध्याय २)",
                badge: "72 Shlokas",
                children: [
                  {
                    id: "gita-2-47",
                    parentId: "mb-gita-ch2",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Bhagavad Gita 2.47 — Karmanyevadhikaraste", hi: "भगवद्गीता २.४७ — कर्मण्येवाधिकारस्ते" },
                    shortTitle: { en: "Gita 2.47", hi: "गीता २.४७" },
                    sanskrit: "भगवद्गीता २.४७",
                    content: {
                      sanskrit: "ॐ कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
                      transliteration: "oṃ karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
                      meaningHi: "तुम्हारा केवल कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं। इसलिए कर्मफल की वासना से युक्त मत हो और न ही तुम्हारी अकर्मण्यता (कर्म त्यागने) में आसक्ति हो।",
                      meaningEn: "You have a sacred right solely to perform your duty, but never to the fruits thereof. Let not the desire for results be your motivation, nor let your mind attach itself to inaction.",
                      metadata: {
                        parva: "Bhishma Parva",
                        gitaChapter: "2 (Sankhya Yoga)",
                        shloka: "47",
                        speaker: "Bhagavan Sri Krishna (भगवान् श्रीकृष्ण)",
                        listener: "Arjuna (पार्थ अर्जुन)",
                        source: "Mahabharata, Bhishma Parva / Srimad Bhagavad Gita 2.47",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // 07. Drona Parva
          {
            id: "mb-drona-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 07", hi: "पर्व ०७" },
            title: { en: "07. Drona Parva (Command of Dronacharya & Abhimanyu)", hi: "०७. द्रोण पर्व: चक्रव्यूह भेदन एवं अभिमन्यु का अप्रतिम शौर्य" },
            shortTitle: { en: "07. Drona Parva", hi: "०७. द्रोण पर्व" },
            sanskrit: "द्रोणपर्व (चक्रव्यूह)",
            badge: "Parva 07",
            children: [
              {
                id: "mb-drona-shloka",
                parentId: "mb-drona-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Drona Parva — Valor of Veer Abhimanyu", hi: "द्रोण पर्व — वीर अभिमन्यु का अमर बलिदान" },
                shortTitle: { en: "Veer Abhimanyu", hi: "वीर अभिमन्यु" },
                sanskrit: "शूरा रणमुखे शूरं चक्रव्यूहविदारिणम्",
                badge: "Drona Parva",
                content: {
                  sanskrit: "एकः षड्रथिनो हत्वा व्यूहं भित्त्वा महारथः।\nअभिमन्युर्यशो लब्ध्वा स्वर्गं गतो न संशयः॥",
                  transliteration: "ekaḥ ṣaḍrathino hatvā vyūhaṃ bhittvā mahārathaḥ |\nabhimanyuryaśo labdhvā svargaṃ gato na saṃśayaḥ ||",
                  meaningHi: "अकेले ही द्रोणाचार्य के चक्रव्यूह को भेदकर छह-छह महारथियों से अकेले युद्ध करते हुए वीर अभिमन्यु ने अमर यश प्राप्त कर स्वर्गलोक को प्रयाण किया।",
                  meaningEn: "Alone penetrating the impenetrable Chakravyuha and heroically fighting against six supreme Maharathis simultaneously, young Abhimanyu attained immortal glory and ascended to the heavenly realms.",
                  metadata: { parva: "Drona Parva", hero: "Veer Abhimanyu", event: "Chakravyuha Bhedana" },
                },
              },
            ],
          },

          // 08. Karna Parva
          {
            id: "mb-karna-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 08", hi: "पर्व ०८" },
            title: { en: "08. Karna Parva (Command of Karna & Duel with Arjuna)", hi: "०८. कर्ण पर्व: दानवीर कर्ण का सेनापतित्व एवं महाद्वन्द्व" },
            shortTitle: { en: "08. Karna Parva", hi: "०८. कर्ण पर्व" },
            sanskrit: "कर्णपर्व (दानवीर कर्ण)",
            badge: "Parva 08",
            children: [
              {
                id: "mb-karna-shloka",
                parentId: "mb-karna-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Karna Parva — Nobility of Danaveera Karna", hi: "कर्ण पर्व — दानवीर कर्ण की दानशीलता एवं तेज" },
                shortTitle: { en: "Danaveera Karna", hi: "दानवीर कर्ण" },
                sanskrit: "दानं शौर्यं च सत्यं च कर्णे सर्वं प्रतिष्ठितम्",
                badge: "Karna Parva",
                content: {
                  sanskrit: "दानं शौर्यं च सत्यं च कर्णे सर्वं प्रतिष्ठितम्।\nकवचं कुण्डलं चैव यः प्रादाद् ब्राह्मणे मुदा॥",
                  transliteration: "dānaṃ śauryaṃ ca satyaṃ ca karṇe sarvaṃ pratiṣṭhitam |\nkavacaṃ kuṇḍalaṃ caiva yaḥ prādād brāhmaṇe mudā ||",
                  meaningHi: "दान, शौर्य और सत्य—ये सभी गुण कर्ण में प्रतिष्ठित थे। जिन्होंने ब्राह्मण वेशधारी इन्द्र को अपने जन्मजात कवच और कुण्डल भी सहर्ष दान कर दिए।",
                  meaningEn: "Generosity, peerless valor, and steadfast commitment to truth were all embodied in Karna, who joyfully severed and gifted his divine armor and earrings to Indra disguised as a Brahmin.",
                  metadata: { parva: "Karna Parva", hero: "Danaveera Karna", weapon: "Vijaya Bow" },
                },
              },
            ],
          },

          // 09. Shalya Parva
          {
            id: "mb-shalya-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 09", hi: "पर्व ०९" },
            title: { en: "09. Shalya Parva (Final Day of War & Mace Duel)", hi: "०९. शल्य पर्व: १८वें दिन का युद्ध एवं गदा युद्ध" },
            shortTitle: { en: "09. Shalya Parva", hi: "०९. शल्य पर्व" },
            sanskrit: "शल्यपर्व (गदायुद्धम्)",
            badge: "Parva 09",
            children: [
              {
                id: "mb-shalya-shloka",
                parentId: "mb-shalya-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Shalya Parva — Bhima & Duryodhana Mace Duel", hi: "शल्य पर्व — भीम और दुर्योधन का ऐतिहासिक गदा युद्ध" },
                shortTitle: { en: "Gada Yuddha", hi: "गदा युद्ध" },
                sanskrit: "गदायुद्धे समाहूतो दुर्योधनो महाबली",
                badge: "Shalya Parva",
                content: {
                  sanskrit: "गदायुद्धे समाहूतो दुर्योधनो महाबली।\nभीमसेनेन संक्रुद्धो हतो धर्मविपर्ययात्॥",
                  transliteration: "gadāyuddhe samāhūto duryodhano mahābalī |\nbhīmasenena saṃkruddho hato dharmaviparyayāt ||",
                  meaningHi: "द्वैपायन सरोवर से निकलकर महाबली दुर्योधन ने भीमसेन के साथ अंतिम गदा युद्ध किया। अधर्म का आश्रय लेने के कारण दुर्योधन पराजित हुआ और युद्ध समाप्त हुआ।",
                  meaningEn: "Challenged from the depths of Dvaipayana Lake, mighty Duryodhana fought his final mace duel against Bhimasena, meeting his end due to the inexorable consequence of unrighteousness.",
                  metadata: { parva: "Shalya Parva", combatants: "Bhimasena & Duryodhana", referee: "Lord Balarama" },
                },
              },
            ],
          },

          // 10. Sauptika Parva
          {
            id: "mb-sauptika-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 10", hi: "पर्व १०" },
            title: { en: "10. Sauptika Parva (The Nocturnal Raid & Brahmashira)", hi: "१०. सौप्तिक पर्व: अश्वत्थामा का रात्रि-धावा एवं ब्रह्मास्त्र" },
            shortTitle: { en: "10. Sauptika Parva", hi: "१०. सौप्तिक पर्व" },
            sanskrit: "सौप्तिकपर्व (रात्रि संहार)",
            badge: "Parva 10",
            children: [
              {
                id: "mb-sauptika-shloka",
                parentId: "mb-sauptika-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Sauptika Parva — Tragic Consequences of Vengeance", hi: "सौप्तिक पर्व — प्रतिशोध की विनाशकारी ज्वाला" },
                shortTitle: { en: "Vengeance Tragedy", hi: "प्रतिशोध परिणाम" },
                sanskrit: "अधर्मेण कृतं कर्म न शुभं फलति क्वचित्",
                badge: "Sauptika Parva",
                content: {
                  sanskrit: "अधर्मेण कृतं कर्म न शुभं फलति क्वचित्।\nआत्मानं घातयेत् पश्चात् पावकः शुष्कवृक्षवत्॥",
                  transliteration: "adharmeṇa kṛtaṃ karma na śubhaṃ phalati kvacit |\nātmānaṃ ghātayet paścāt pāvakaḥ śuṣkavṛkṣavat ||",
                  meaningHi: "अधर्म और छल से किया गया कर्म कभी कल्याणकारी फल नहीं देता; वह अंततः उसी प्रकार कर्ता का विनाश कर देता है जैसे अग्नि सूखे वृक्ष को भस्म कर देती है।",
                  meaningEn: "An action performed through deceit and adharma never yields auspicious fruit; in the end, it incinerates its perpetrator just as a raging wildfire consumes a dried tree.",
                  metadata: { parva: "Sauptika Parva", antagonist: "Ashwatthama", weapon: "Brahmashira Astra" },
                },
              },
            ],
          },

          // 11. Stri Parva
          {
            id: "mb-stri-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 11", hi: "पर्व ११" },
            title: { en: "11. Stri Parva (The Grief of the Mothers & Widows)", hi: "११. स्त्री पर्व: गांधारी का विलाप एवं युद्ध का शोक" },
            shortTitle: { en: "11. Stri Parva", hi: "११. स्त्री पर्व" },
            sanskrit: "स्त्रीपर्व (गांधारी विलाप)",
            badge: "Parva 11",
            children: [
              {
                id: "mb-stri-shloka",
                parentId: "mb-stri-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Stri Parva — Queen Gandhari's Lamentation", hi: "स्त्री पर्व — महारानी गांधारी का शोक एवं वैराग्य" },
                shortTitle: { en: "Gandhari Grief", hi: "गांधारी विलाप" },
                sanskrit: "पश्यैतान् वारितान् शूराञ् शयानान् वसुधातले",
                badge: "Stri Parva",
                content: {
                  sanskrit: "पश्यैतान् वारितान् शूराञ् शयानान् वसुधातले।\nअहंकारविमूढानां पश्य युद्धस्य चेष्टितम्॥",
                  transliteration: "paśyaitān vāritān śūrāñ śayānān vasudhātale |\nahaṃkāravimūḍhānāṃ paśya yuddhasya ceṣṭitam ||",
                  meaningHi: "कुरुक्षेत्र की रक्त-रंजित भूमि पर सोए हुए इन पराक्रमी वीरों को देखो! अहंकार से मूढ़ हुए मनुष्यों के युद्ध का यह कैसा हृदय-विदारक परिणाम हुआ है!",
                  meaningEn: "Behold these mighty heroes lying silent upon the bare earth! Witness the tragic desolation wrought by war born of stubborn arrogance and delusion!",
                  metadata: { parva: "Stri Parva", speaker: "Queen Mother Gandhari", listener: "Lord Krishna" },
                },
              },
            ],
          },

          // 12. Shanti Parva (Bhishma's Teachings)
          {
            id: "mb-shanti-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 12", hi: "पर्व १२" },
            title: { en: "12. Shanti Parva (Rajadharma & Mokshadharma - 365 Adhyayas)", hi: "१२. शान्ति पर्व: भीष्म उपदेश — राजधर्म एवं मोक्षधर्म (३६५ अध्याय)" },
            shortTitle: { en: "12. Shanti Parva", hi: "१२. शान्ति पर्व" },
            sanskrit: "शान्तिपर्व (भीष्म उपदेश)",
            badge: "365 Adhyayas",
            children: [
              {
                id: "sp-rajadharma",
                parentId: "mb-shanti-parva",
                type: "section",
                levelLabel: { en: "Sub-Parva", hi: "उप-पर्व" },
                title: { en: "Rajadharma Parva (Governance & Royal Ethics)", hi: "राजधर्म पर्व (राज्य-व्यवस्था एवं संप्रभुता)" },
                shortTitle: { en: "Rajadharma", hi: "राजधर्म" },
                sanskrit: "राजधर्मानुशासन पर्व (१३० अध्याय)",
                badge: "Statecraft",
                children: [
                  {
                    id: "sp-rd-shloka",
                    parentId: "sp-rajadharma",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Shanti Parva 12.69.79 — Raja Kalasya Karanam", hi: "शान्ति पर्व १२.६९.७९ — राजा कालस्य कारणम्" },
                    shortTitle: { en: "Raja Kalasya", hi: "राजा कालस्य" },
                    sanskrit: "महाभारत १२.६९.७९",
                    content: {
                      sanskrit: "कालो वा कारणं राज्ञो राजा वा कालकारणम्।\nइति ते संशयो मा भूद्राजा कालस्य कारणम्॥",
                      transliteration: "kālo vā kāraṇaṃ rājño rājā vā kālakāraṇam |\niti te saṃśayo mā bhūdrājā kālasya kāraṇam ||",
                      meaningHi: "क्या समय (काल) राजा को बनाता है अथवा राजा काल को बनाता है? इस विषय में मन में कोई संशय मत रखो: 'राजा ही काल (युग) का निर्माता होता है!'",
                      meaningEn: "'Does the era make the king, or does the king create the era? Harbor no doubt in your heart on this score: the King is indeed the creator of the Era!'",
                      metadata: {
                        parva: "Shanti Parva",
                        subParva: "Rajadharma Parva",
                        adhyaya: "69",
                        shloka: "79",
                        speaker: "Pitamaha Bhishma",
                        listener: "Dharmaraja Yudhishthira",
                        source: "Mahabharata, Shanti Parva 12.69.79",
                      },
                    },
                  },
                ],
              },
              {
                id: "sp-mokshadharma",
                parentId: "mb-shanti-parva",
                type: "section",
                levelLabel: { en: "Sub-Parva", hi: "उप-पर्व" },
                title: { en: "Mokshadharma Parva (Spiritual Liberation & Philosophy)", hi: "मोक्षधर्म पर्व (आत्मज्ञान एवं कैवल्य साधना)" },
                shortTitle: { en: "Mokshadharma", hi: "मोक्षधर्म" },
                sanskrit: "मोक्षधर्म पर्व (१९२ अध्याय)",
                badge: "Liberation",
                children: [
                  {
                    id: "sp-md-shloka",
                    parentId: "sp-mokshadharma",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Shanti Parva 12.175 — Nasti Vidya Samam Chakshuh", hi: "शान्ति पर्व १२.१७५ — नास्ति विद्यासमं चक्षुः" },
                    shortTitle: { en: "Nasti Vidya", hi: "नास्ति विद्या" },
                    sanskrit: "महाभारत १२.१७५",
                    content: {
                      sanskrit: "नास्ति विद्यासमं चक्षुर्नास्ति सत्यसमं तपः।\nनास्ति रागसमं दुःखं नास्ति त्यागसमं सुखम्॥",
                      transliteration: "nāsti vidyāsamaṃ cakṣurnāsti satyasamaṃ tapaḥ |\nnāsti rāgasamaṃ duḥkhaṃ nāsti tyāgasamaṃ sukham ||",
                      meaningHi: "विद्या (ज्ञान) के समान कोई नेत्र नहीं है, सत्य के समान कोई तप नहीं है, आसक्ति (मोह) के समान कोई दुःख नहीं है और त्याग के समान कोई सुख नहीं है।",
                      meaningEn: "'There is no eye equal to Divine Knowledge, no austerity equal to Truth, no sorrow equal to attachment, and no lasting peace equal to selfless renunciation!'",
                      metadata: {
                        parva: "Shanti Parva",
                        subParva: "Mokshadharma Parva",
                        source: "Mahabharata, Shanti Parva 12.175",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // 13. Anushasana Parva (Vishnu Sahasranama)
          {
            id: "mb-anushasana-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 13", hi: "पर्व १३" },
            title: { en: "13. Anushasana Parva (Contains Vishnu Sahasranama & Dana Dharma)", hi: "१३. अनुशासन पर्व: विष्णु सहस्रनाम स्तोत्र एवं दान धर्म" },
            shortTitle: { en: "13. Anushasana", hi: "१३. अनुशासन पर्व" },
            sanskrit: "अनुशासनपर्व (विष्णुसहस्रनाम)",
            badge: "Contains Sahasranama",
            children: [
              {
                id: "mb-anushasana-vsn",
                parentId: "mb-anushasana-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Stotram", hi: "विष्णु सहस्रनाम" },
                title: { en: "Vishnu Sahasranama 13.149 — Kimekam Daivatam Loke", hi: "विष्णु सहस्रनाम १३.१४९ — किमेकं दैवतं लोके (भीष्म उपदेश)" },
                shortTitle: { en: "Vishnu Sahasranama", hi: "विष्णु सहस्रनाम" },
                sanskrit: "किमेकं दैवतं लोके किं वाप्येकं परायणम्",
                badge: "Anushasana Parva",
                content: {
                  sanskrit: "किमेकं दैवतं लोके किं वाप्येकं परायणम्।\nस्तुवन्तः कं कमर्चन्तः प्राप्नुयुर्मानवाः शुभम्॥\nभीष्म उवाच—\nजगत्प्रभुं देवदेवमनन्तं पुरुषोत्तमम्।\nस्तुवन्नामसहस्रेण पुरुषः सततोत्थितः॥",
                  transliteration: "kimekaṃ daivataṃ loke kiṃ vāpyekaṃ parāyaṇam |\nstuvantaḥ kaṃ kamarcantaḥ prāpnuyurmānavāḥ śubham ||\nbhīṣma uvāca—\njagatprabhuṃ devadevamanantaṃ puruṣottamam |\nstuvannāmasahasreṇa puruṣaḥ satatotthitaḥ ||",
                  meaningHi: "युधिष्ठिर ने पूछा: संसार में एकमात्र पूजनीय परम देव कौन हैं? भीष्म जी ने कहा: संपूर्ण जगत् के स्वामी, देवों के देव, अनंत पुरुषोत्तम श्रीविष्णु के एक सहस्र (१०००) दिव्य नामों की निरंतर स्तुति करने से मानव परम कल्याण को प्राप्त होता है।",
                  meaningEn: "Yudhishthira asked: 'Who is the One Supreme Divinity in this world? Chanting whose praises do mortals attain salvation?' Bhishma replied: 'By meditating upon and praising the thousand holy names of the Infinite Lord of the Cosmos, Purushottama Narayana, man transcends all sorrow!'",
                  metadata: { parva: "Anushasana Parva 149", speaker: "Pitamaha Bhishma", origin: "Vishnu Sahasranama Stotram" },
                },
              },
            ],
          },

          // 14. Ashvamedhika Parva
          {
            id: "mb-ashvamedhika-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 14", hi: "पर्व १४" },
            title: { en: "14. Ashvamedhika Parva (The Imperial Horse Sacrifice & Anugita)", hi: "१४. आश्वमेधिक पर्व: युधिष्ठिर का अश्वमेध यज्ञ एवं अनुगीता" },
            shortTitle: { en: "14. Ashvamedhika", hi: "१४. आश्वमेधिक" },
            sanskrit: "आश्वमेधिकपर्व (अनुगीता)",
            badge: "Parva 14",
            children: [
              {
                id: "mb-ashvamedhika-shloka",
                parentId: "mb-ashvamedhika-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Anugita — Supreme Spiritual Counsel to Arjuna", hi: "अनुगीता — श्रीकृष्ण द्वारा अर्जुन को पुनः आत्मज्ञान उपदेश" },
                shortTitle: { en: "Anugita", hi: "अनुगीता" },
                sanskrit: "न हि धर्मात् परो लोके बन्धुरस्ति शरीरिणाम्",
                badge: "Ashvamedhika",
                content: {
                  sanskrit: "न हि धर्मात्परो लोके बन्धुरस्ति शरीरिणाम्।\nधर्मः सखा च बन्धुश्च धर्मस्त्राता भवेत्सदा॥",
                  transliteration: "na hi dharmātparo loke bandhurasti śarīriṇām |\ndharmaḥ sakhā ca bandhuśca dharmastrātā bhavetsadā ||",
                  meaningHi: "संसार में देहधारी मनुष्यों का धर्म से बढ़कर कोई सच्चा सखा अथवा बंधु नहीं है। धर्म ही परम मित्र है और धर्म ही संकटों से सदा रक्षा करता है।",
                  meaningEn: "There is no friend, relative, or protector equal to Dharma for embodied beings in this mortal world. Dharma is the eternal friend and ultimate savior.",
                  metadata: { parva: "Ashvamedhika Parva", section: "Anugita", speaker: "Bhagavan Sri Krishna" },
                },
              },
            ],
          },

          // 15. Ashramavasika Parva
          {
            id: "mb-ashramavasika-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 15", hi: "पर्व १५" },
            title: { en: "15. Ashramavasika Parva (Retirement of the Elders to Forest)", hi: "१५. आश्रमवासिक पर्व: धृतराष्ट्र, गांधारी एवं कुन्ती का वानप्रस्थ" },
            shortTitle: { en: "15. Ashramavasika", hi: "१५. आश्रमवासिक" },
            sanskrit: "आश्रमवासिकपर्व (वानप्रस्थ)",
            badge: "Parva 15",
            children: [
              {
                id: "mb-ashramavasika-shloka",
                parentId: "mb-ashramavasika-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Ashramavasika Parva — Vanaprastha & Detachment", hi: "आश्रमवासिक पर्व — वानप्रस्थ साधना एवं परम वैराग्य" },
                shortTitle: { en: "Vanaprastha Vairagya", hi: "वानप्रस्थ वैराग्य" },
                sanskrit: "तपसा प्राप्यते सर्वं नास्ति किञ्चिदतपस्कम्",
                badge: "Ashramavasika",
                content: {
                  sanskrit: "तपसा प्राप्यते सर्वं नास्ति किञ्चिदतपस्कम्।\nतपसा युज्यते योगी तपसा मुच्यते भवात्॥",
                  transliteration: "tapasā prāpyate sarvaṃ nāsti kiñcidatapaskam |\ntapasā yujyate yogī tapasā mucyate bhavāt ||",
                  meaningHi: "तपस्या से ही सब कुछ प्राप्त होता है; तप के बिना कोई सिद्धि नहीं। तप से ही योगी परमात्मा से युक्त होता है और तप से ही संसार-बंधन से मुक्त होता है।",
                  meaningEn: "Through self-restraint and spiritual austerity (Tapas) everything is attained. Through Tapas the yogi unites with the Supreme Self and attains liberation from worldly bondage.",
                  metadata: { parva: "Ashramavasika Parva", elders: "Dhritarashtra, Gandhari, Kunti, Vidura" },
                },
              },
            ],
          },

          // 16. Mausala Parva
          {
            id: "mb-mausala-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 16", hi: "पर्व १६" },
            title: { en: "16. Mausala Parva (The Iron Club Omen & Yadava Clan)", hi: "१६. मौसल पर्व: यदुवंश का लय एवं द्वारका का जलमग्न होना" },
            shortTitle: { en: "16. Mausala Parva", hi: "१६. मौसल पर्व" },
            sanskrit: "मौसलपर्व (द्वारका विसर्जन)",
            badge: "Parva 16",
            children: [
              {
                id: "mb-mausala-shloka",
                parentId: "mb-mausala-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Mausala Parva — All-Devouring Time (Kala Chakra)", hi: "मौसल पर्व — सर्वभक्षी कालचक्र एवं नश्वरता" },
                shortTitle: { en: "Kala Chakra", hi: "कालचक्र सत्य" },
                sanskrit: "कालो हि सर्वभूतानां प्रभवाप्ययकारणम्",
                badge: "Mausala Parva",
                content: {
                  sanskrit: "कालो हि सर्वभूतानां प्रभवाप्ययकारणम्।\nकालेन सर्वमुत्पन्नं कालेन विनिहन्ति च॥",
                  transliteration: "kālo hi sarvabhūtānāṃ prabhavāpyayakāraṇam |\nkālena sarvamutpannaṃ kālena vinihanti ca ||",
                  meaningHi: "काल ही समस्त चराचर प्राणियों की उत्पत्ति और लय का कारण है। समय के द्वारा ही सब उत्पन्न होता है और समय ही सबको अपने में लीन कर लेता है।",
                  meaningEn: "Time (Kala) is the ultimate cause of both the creation and dissolution of all beings. By Time everything is brought forth, and by Time everything is reabsorbed.",
                  metadata: { parva: "Mausala Parva", event: "Submergence of Dvaraka & Ascension of Sri Krishna" },
                },
              },
            ],
          },

          // 17. Mahaprasthanika Parva
          {
            id: "mb-mahaprasthanika-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 17", hi: "पर्व १७" },
            title: { en: "17. Mahaprasthanika Parva (The Great Himalayan Pilgrimage)", hi: "१७. महाप्रस्थानिक पर्व: पाण्डवों की अंतिम हिमालय तीर्थयात्रा" },
            shortTitle: { en: "17. Mahaprasthanika", hi: "१७. महाप्रस्थानिक" },
            sanskrit: "महाप्रस्थानिकपर्व (हिमालय यात्रा)",
            badge: "Parva 17",
            children: [
              {
                id: "mb-mahaprasthanika-shloka",
                parentId: "mb-mahaprasthanika-parva",
                type: "leaf",
                levelLabel: { en: "Canonical Shloka", hi: "प्रमाण श्लोक" },
                title: { en: "Mahaprasthanika Parva — The Faithful Dog as Dharma", hi: "महाप्रस्थानिक पर्व — श्वान रूप में धर्मदेव की परीक्षा" },
                shortTitle: { en: "Dharma Dog Test", hi: "धर्म श्वान परीक्षा" },
                sanskrit: "भक्तानुरक्तं न त्यजेयं प्राणानामपि संक्षये",
                badge: "Mahaprasthanika",
                content: {
                  sanskrit: "भक्तानुरक्तं न त्यजेयं प्राणानामपि संक्षये।\nएतन्मे व्रतमक्षय्यं शरणागतपालकम्॥",
                  transliteration: "bhaktānuraktaṃ na tyajeyaṃ prāṇānāmapi saṃkṣaye |\netanme vratamakṣayyaṃ śaraṇāgatapālakam ||",
                  meaningHi: "युधिष्ठिर ने इन्द्र से कहा: 'जो मेरे प्रति निष्ठावान और शरणागत है, प्राण जाने पर भी मैं उसका त्याग नहीं कर सकता।' तब वह निष्ठावान कुत्ता साक्षात् धर्मराज के रूप में प्रकट हुआ।",
                  meaningEn: "Yudhishthira said to Indra: 'I shall never abandon a loyal companion who has sought my refuge, even at the cost of my life!' Thereupon, the faithful dog revealed Himself as Dharma incarnate.",
                  metadata: { parva: "Mahaprasthanika Parva", hero: "Dharmaraja Yudhishthira", deity: "Dharma Devata" },
                },
              },
            ],
          },

          // 18. Svargarohana Parva
          {
            id: "mb-svargarohana-parva",
            parentId: "mahabharata",
            type: "division",
            levelLabel: { en: "Parva 18", hi: "पर्व १८" },
            title: { en: "18. Svargarohana Parva (Ascent to Heaven & Reunion)", hi: "१८. स्वर्गारोहण पर्व: स्वर्ग प्रवेश, सत्य की विजय एवं महाभारत सार" },
            shortTitle: { en: "18. Svargarohana", hi: "१८. स्वर्गारोहण" },
            sanskrit: "स्वर्गारोहणपर्व (महाभारत सार)",
            badge: "Parva 18",
            children: [
              {
                id: "mb-bharata-savitri",
                parentId: "mb-svargarohana-parva",
                type: "leaf",
                levelLabel: { en: "Epic Climax", hi: "महाभारत सावित्री" },
                title: { en: "Bharata Savitri 18.5.62 — Urdhvabahur Viro myesha (The Essence)", hi: "भारत सावित्री १८.५.६२ — ऊर्ध्वबाहुर्विरौम्येष (महर्षि व्यास का अंतिम संदेश)" },
                shortTitle: { en: "Bharata Savitri", hi: "भारत सावित्री" },
                sanskrit: "ऊर्ध्वबाहुर्विरौम्येष न च कश्चिच्छृणोति मे",
                badge: "Vyasa's Message",
                content: {
                  sanskrit: "ऊर्ध्वबाहुर्विरौम्येष न च कश्चिच्छृणोति मे।\nधर्मादर्थश्च कामश्च स किमर्थं न सेव्यते॥\nन जातु कामान्न भयान्न लोभाद् धर्मं त्यजेज्जीवितस्यापि हेतोः।\nधर्मो नित्यः सुखदुःखे त्वनित्ये जीवो नित्यो हेतुरस्य त्वनित्यः॥",
                  transliteration: "ūrdhvabāhurviraumyeṣa na ca kaścicchṛṇoti me |\ndharmādarthaśca kāmaśca sa kimarthaṃ na sevyate ||\nna jātu kāmānna bhayānna lobhād dharmaṃ tyajejjīvitasyāpi hetoḥ |\ndharmo nityaḥ sukhaduḥkhe tvanitye jīvo nityo heturasya tvanityaḥ ||",
                  meaningHi: "महर्षि वेदव्यास दोनों भुजाएं उठाकर पुकारते हैं: 'धर्म से ही अर्थ और काम सिद्ध होते हैं, फिर लोग धर्म का आचरण क्यों नहीं करते? काम, भय, लोभ अथवा जीवन बचाने के लिए भी धर्म का कभी त्याग नहीं करना चाहिए। क्योंकि धर्म नित्य है, सुख-दुःख अनित्य हैं; आत्मा नित्य है और उसका सांसारिक कारण अनित्य है!'",
                  meaningEn: "Maharshi Vyasa raises his arms crying aloud: 'From Dharma flow wealth and legitimate pleasure—why then is Dharma not observed? Never should one abandon Dharma out of desire, fear, greed, or even to save one's life. Dharma is eternal; pleasure and pain are fleeting; the Soul is immortal; its mortal circumstances are transient!'",
                  metadata: {
                    parva: "Svargarohana Parva 18.5.62-63",
                    title: "Bharata Savitri (Essence of the entire 100,000 verses of Mahabharata)",
                    speaker: "Adi Guru Maharshi Vedavyasa",
                  },
                },
              },
            ],
          },
        ],
      },

      // Puranas
      {
        id: "purana",
        parentId: "itihasa-purana",
        type: "grantha",
        levelLabel: { en: "Collection", hi: "संग्रह" },
        title: { en: "The 18 Mahapuranas", hi: "१८ महापुराण (अष्टादश महापुराण)" },
        shortTitle: { en: "Puranas", hi: "पुराण" },
        sanskrit: "अष्टादश महापुराणानि",
        tagline: {
          en: "Vishnu, Bhagavata, Shiva, Markandeya, Padma & more (400,000 Shlokas)",
          hi: "विष्णु, भागवत, शिव, मार्कण्डेय, पद्म, मत्स्य आदि १८ पुराण (४,००,००० श्लोक)",
        },
        cardImage: puranaCardImg,
        bannerImage: bannerKashiGhat,
        image: puranaCardImg,
        badge: "18 Texts",
        desc: {
          en: "The ancient encyclopedia of Indian culture dealing with Panchalakshana: creation (Sarga), recreation (Pratisarga), genealogies (Vamsha), cosmic ages (Manvantara), and dynastic histories (Vamshanucharita).",
          hi: "सृष्टि, प्रतिसर्ग, मन्वन्तर, वंश और वंशानुचरित के पाँच लक्षणों से युक्त सनातन संस्कृति का महाविश्वकोश।",
        },
        children: [
          {
            id: "purana-sattvika-group",
            parentId: "purana",
            type: "division",
            levelLabel: { en: "Tradition", hi: "परंपरा" },
            title: { en: "Sattvika Puranas (Vaishnava Tradition - 6 Puranas)", hi: "सात्त्विक पुराण (वैष्णव परंपरा - ६ पुराण)" },
            shortTitle: { en: "Sattvika Puranas", hi: "सात्त्विक पुराण" },
            sanskrit: "सात्त्विक पुराणानि (विष्णु, भागवत, नारद, गरुड, पद्म, वराह)",
            badge: "6 Puranas",
            children: [
              {
                id: "purana-bhagavata",
                parentId: "purana-sattvika-group",
                type: "section",
                levelLabel: { en: "Purana", hi: "पुराण" },
                title: { en: "Shrimad Bhagavata Mahapurana (18,000 Shlokas)", hi: "श्रीमद्भागवत महापुराण (१८,००० श्लोक)" },
                shortTitle: { en: "Bhagavata Purana", hi: "भागवत पुराण" },
                sanskrit: "श्रीमद्भागवतम् (१२ स्कन्ध)",
                badge: "12 Skandhas",
                children: [
                  {
                    id: "bhagavata-10-2-26",
                    parentId: "purana-bhagavata",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Bhagavata 10.2.26 — Satyavratam Satyaparam", hi: "भागवत १०.२.२६ — सत्यव्रतं सत्यपरं त्रिसत्यं" },
                    shortTitle: { en: "Garbha Stuti", hi: "गर्भ स्तुति" },
                    sanskrit: "भागवत १०.२.२६",
                    content: {
                      sanskrit: "सत्यव्रतं सत्यपरं त्रिसत्यं सत्यस्य योनिं निहितं च सत्ये।\nसत्यस्य सत्यममृतसत्यनेत्रं सत्यात्मकं त्वां शरणं प्रपन्नाः॥",
                      transliteration: "satyavrataṃ satyaparaṃ trisatyaṃ satyasya yoniṃ nihitaṃ ca satye |\nsatyasya satyamamṛtasatyanetraṃ satyātmakaṃ tvāṃ śaraṇaṃ prapannāḥ ||",
                      meaningHi: "देवताओं ने गर्भस्थ भगवान् की स्तुति की: 'हे सत्यसंकल्प, सत्यपरायण, भूत-भविष्य-वर्तमान तीनों कालों में सत्य रहने वाले! आप सत्य के उद्गम हैं। हम आपकी शरण में आए हैं।'",
                      meaningEn: "'O Lord of Truth! We surrender unto You whose vow is truth, who are the truth of truth, existing eternally in the three phases of time, the divine origin and inner soul of all truth!'",
                      metadata: {
                        purana: "Shrimad Bhagavata Purana",
                        skandha: "10",
                        adhyaya: "2",
                        shloka: "26",
                        source: "Shrimad Bhagavatam 10.2.26",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "purana-tamasa-group",
            parentId: "purana",
            type: "division",
            levelLabel: { en: "Tradition", hi: "परंपरा" },
            title: { en: "Tamasa Puranas (Shaiva Tradition - 6 Puranas)", hi: "तामस पुराण (शैव परंपरा - ६ पुराण)" },
            shortTitle: { en: "Tamasa Puranas", hi: "तामस पुराण" },
            sanskrit: "तामस पुराणानि (शिव, लिङ्ग, स्कन्द, अग्नि, मत्स्य, कूर्म)",
            badge: "6 Puranas",
            children: [
              {
                id: "purana-shiva",
                parentId: "purana-tamasa-group",
                type: "section",
                levelLabel: { en: "Purana", hi: "पुराण" },
                title: { en: "Shiva Mahapurana (24,000 Shlokas across 7 Samhitas)", hi: "शिव महापुराण (२४,००० श्लोक - ७ संहिताएँ)" },
                shortTitle: { en: "Shiva Purana", hi: "शिव पुराण" },
                sanskrit: "शिव महापुराणम्",
                badge: "7 Samhitas",
                children: [
                  {
                    id: "shiva-purana-dhyana",
                    parentId: "purana-shiva",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Shiva Purana Dhyana — Shivam Shantam Jagannatham", hi: "शिव पुराण ध्यान — शिवं शान्तं जगन्नाथं" },
                    shortTitle: { en: "Shiva Dhyana", hi: "शिव ध्यान" },
                    sanskrit: "शिव पुराण ध्यानम्",
                    content: {
                      sanskrit: "शिवं शान्तं जगन्नाथं लोकानुग्रहकारकम्।\nशिवमेकं परं ब्रह्म प्रणतोऽस्मि सनातनम्॥",
                      transliteration: "śivaṃ śāntaṃ jagannāthaṃ lokānugrahakārakam |\nśivamekaṃ paraṃ brahma praṇato'smi sanātanam ||",
                      meaningHi: "जो शांत, जगत के स्वामी, सम्पूर्ण लोकों पर कृपा करने वाले, अद्वितीय सनातन परब्रह्म स्वरूप हैं—उन भगवान् शिव को हम प्रणाम करते हैं।",
                      meaningEn: "'I bow down unto Lord Shiva, the embodiment of eternal peace, sovereign master of the cosmos, compassionate benefactor of all beings, the one supreme eternal Brahman!'",
                      metadata: {
                        purana: "Shiva Purana",
                        source: "Vidyeshvara Samhita, Shiva Purana",
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            id: "purana-rajasa-group",
            parentId: "purana",
            type: "division",
            levelLabel: { en: "Tradition", hi: "परंपरा" },
            title: { en: "Rajasa Puranas (Brahma & Shakta Tradition - 6 Puranas)", hi: "राजस पुराण (ब्रह्म एवं शाक्त परंपरा - ६ पुराण)" },
            shortTitle: { en: "Rajasa Puranas", hi: "राजस पुराण" },
            sanskrit: "राजस पुराणानि (ब्रह्म, ब्रह्माण्ड, ब्रह्मवैवर्त, मार्कण्डेय, भविष्य, वामन)",
            badge: "6 Puranas",
            children: [
              {
                id: "purana-markandeya",
                parentId: "purana-rajasa-group",
                type: "section",
                levelLabel: { en: "Purana", hi: "पुराण" },
                title: { en: "Markandeya Purana (Contains Sri Devi Mahatmyam)", hi: "मार्कण्डेय पुराण (श्रीदुर्गासप्तशती समाहित)" },
                shortTitle: { en: "Markandeya", hi: "मार्कण्डेय" },
                sanskrit: "मार्कण्डेय पुराणम् (दुर्गासप्तशती)",
                badge: "Durga Saptashati",
                children: [
                  {
                    id: "devi-mahatmya-11-10",
                    parentId: "purana-markandeya",
                    type: "leaf",
                    levelLabel: { en: "Shloka", hi: "श्लोक" },
                    title: { en: "Devi Mahatmyam 11.10 — Sarva Mangala Mangalye", hi: "दुर्गासप्तशती ११.१० — सर्वमङ्गलमाङ्गल्ये" },
                    shortTitle: { en: "Mangala Shloka", hi: "मंगल श्लोक" },
                    sanskrit: "दुर्गासप्तशती ११.१०",
                    content: {
                      sanskrit: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
                      transliteration: "sarvamaṅgalamāṅgalye śive sarvārthasādhike |\nśaraṇye tryambake gauri nārāyaṇi namo'stu te ||",
                      meaningHi: "हे सर्वमंगलमयी! हे कल्याणकारी शिवे! हे धर्म, अर्थ, काम और मोक्ष चारों पुरुषार्थों को सिद्ध करने वाली, शरणागतवत्सला, त्रिनेत्रा गौरी नारायणी! आपको बारंबार नमस्कार है।",
                      meaningEn: "'O Auspiciousness of all that is auspicious! O benevolent Devi Shiva, fulfiller of all spiritual and material aims! O refuge of the surrendered, three-eyed Gauri Narayani, salutations unto You!'",
                      metadata: {
                        purana: "Markandeya Purana",
                        section: "Devi Mahatmyam (Chapter 11)",
                        shloka: "10",
                        source: "Markandeya Purana 91.10 / Durga Saptashati 11.10",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Sacred Deities, Trimurti & Cosmic Avataras
      // -----------------------------------------------------------------------
      {
        id: "devata-avatara-tattva",
        parentId: "itihasa-purana",
        type: "grantha",
        levelLabel: { en: "Divine Tattva", hi: "देव तत्त्व" },
        title: { en: "Sacred Deities, Trimurti & Cosmic Avataras", hi: "ईश्वर, त्रिदेव, त्रिदेवी एवं अवतार तत्त्व" },
        shortTitle: { en: "Deities & Avataras", hi: "देवता एवं अवतार" },
        sanskrit: "ईश्वर, त्रिदेव एवं अवतार तत्त्व",
        tagline: {
          en: "Trimurti (Brahma-Vishnu-Shiva), Tridevi, Dashavatara, Smarta Panchayatana & 33 Vedic Devas",
          hi: "त्रिदेव (ब्रह्मा, विष्णु, महेश), त्रिदेवी, श्रीहरि के दशावतार, स्मार्त पंचायतन एवं ३३ वैदिक देव",
        },
        cardImage: ramayanaCardImg,
        bannerImage: bannerSanctum,
        image: ramayanaCardImg,
        badge: "Trimurti & Devas",
        desc: {
          en: "The profound theology of Divine Manifestations in Sanatan Dharma: understanding the unified supreme reality (Brahman) expressing as Trimurti, Tridevi, 10 Avatars of Vishnu, the 33 Vedic Devas, and the Smarta Panchayatana.",
          hi: "वैदिक एवं पौराणिक देवी-देवताओं का गुह्य तत्त्वज्ञान, जहाँ एक ही परब्रह्म त्रिदेव (सृष्टि, पालन, संहार), त्रिदेवी, श्रीहरि के दशावतार, ३३ कोटि वैदिक देवता तथा पंचायतन के रूप में अभिव्यक्त होता है।",
        },
        childLevelName: { en: "Tradition / Aspect", hi: "स्वरूप / परंपरा" },
        children: [
          // 1. Trimurti Tattva
          {
            id: "trimurti-tattva",
            parentId: "devata-avatara-tattva",
            type: "division",
            levelLabel: { en: "Cosmic Triad", hi: "त्रिदेव तत्त्व" },
            title: { en: "Trimurti: The Supreme Cosmic Triad", hi: "त्रिदेव तत्त्व: ब्रह्मा, विष्णु, महेश" },
            shortTitle: { en: "Trimurti", hi: "त्रिदेव" },
            sanskrit: "त्रिदेव तत्त्वम् (सृष्टि, पालन, संहार)",
            badge: "Creation, Preservation, Dissolution",
            tagline: {
              en: "Brahma (Creation), Vishnu (Preservation), and Shiva (Dissolution/Liberation)",
              hi: "ब्रह्मा (सृजन), विष्णु (स्थिति/पालन), एवं शिव (लय/कल्याण)",
            },
            cardImage: trimurtiCardImg,
            children: [
              // Brahma (Creation)
              {
                id: "trimurti-brahma",
                parentId: "trimurti-tattva",
                type: "section",
                levelLabel: { en: "Deity", hi: "देवता" },
                title: { en: "Lord Brahma: The Cosmic Creator (Srishti)", hi: "भगवान ब्रह्मा: सृष्टि के रचयिता" },
                shortTitle: { en: "Brahma", hi: "ब्रह्मा" },
                sanskrit: "ब्रह्मा (सृष्टिकर्ता)",
                badge: "Srishti Tattva",
                tagline: {
                  en: "The Cosmic Creator · Srishti Tattva · 4 Vedas & Brahmaloka",
                  hi: "सृष्टिकर्ता · चतुर्मुख स्वरूप · वेदों के अधिपति",
                },
                cardImage: deityBrahmaCardImg,
                bannerImage: bannerSanctum,
                desc: {
                  en: "Lord Brahma is the creator aspect of the Supreme Trimurti, emerging from the cosmic golden egg (Hiranyagarbha) to manifest the universe with the knowledge of the four eternal Vedas.",
                  hi: "सृष्टिकर्ता भगवान ब्रह्मा परब्रह्म के सृजनकारी स्वरूप हैं, जो हिरण्यगर्भ से प्रकट होकर चतुर्वेदों के ज्ञान द्वारा समस्त चराचर सृष्टि की रचना करते हैं।",
                },
                childLevelName: { en: "Sacred Chapter / Suktam", hi: "पावन अध्याय / सूक्त" },
                children: [
                  {
                    id: "brahma-svarupa",
                    parentId: "trimurti-brahma",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Chaturmukha Brahma: Iconography, Vahan & Attributes", hi: "चतुर्मुख ब्रह्मा: स्वरूप, हंस वाहन एवं चार वेद" },
                    shortTitle: { en: "Brahma Svarupa", hi: "ब्रह्मा स्वरूप" },
                    sanskrit: "चतुर्मुखं हंसारूढम्",
                    badge: "Iconography",
                    content: {
                      sanskrit: "चतुर्मुखं पद्मनिषण्णमीड्यं कमण्डलुं चाक्षगुणं दधानम्।\nवेदान् समस्तान् वदने दधानं ब्रह्माणमीशं सततं नमामि॥",
                      transliteration: "caturmukhaṃ padmaniṣaṇṇamīḍyaṃ kamaṇḍaluṃ cākṣaguṇaṃ dadhānam |\nvedān samastān vadane dadhānaṃ brahmāṇamīśaṃ satataṃ namāmi ||",
                      meaningHi: "चार मुखों वाले, कमल पर आसीन, कमण्डलु और अक्षमाला (जपमाला) धारण करने वाले, तथा अपने चारों मुखों से चारों वेदों का निरंतर उच्चारण करने वाले सृष्टिकर्ता भगवान ब्रह्मा को हम नमन करते हैं।",
                      meaningEn: "I continually salute Lord Brahma, the four-faced Creator, seated upon the cosmic lotus, holding the sacred Kamandalu (water pot of potential creation) and Akshamala (rosary of time), whose four mouths reveal the eternal four Vedas.",
                      metadata: {
                        faces: "East (Rigveda), South (Yajurveda), West (Samaveda), North (Atharvaveda)",
                        attributes: "Vedas (Wisdom), Kamandalu (Creation), Akshamala (Cosmic Time), Lotus (Purity)",
                        vehicle: "Hamsa (Swan - divine discernment of truth from untruth)",
                        abode: "Satyaloka / Brahmaloka",
                      },
                    },
                  },
                  {
                    id: "brahma-gayatri",
                    parentId: "trimurti-brahma",
                    type: "leaf",
                    levelLabel: { en: "Sacred Gayatri", hi: "ब्रह्म गायत्री" },
                    title: { en: "Brahma Gayatri Mantra: Meditation on the Cosmic Source", hi: "ब्रह्म गायत्री मन्त्र: हिरण्यगर्भ ध्यान" },
                    shortTitle: { en: "Brahma Gayatri", hi: "ब्रह्म गायत्री" },
                    sanskrit: "ॐ वेदात्मने विद्महे हिरण्यगर्भाय धीमहि",
                    badge: "Gayatri Mantra",
                    content: {
                      sanskrit: "ॐ वेदात्मने विद्महे हिरण्यगर्भाय धीमहि।\nतन्नो ब्रह्म प्रचोदयात्॥",
                      transliteration: "oṃ vedātmane vidmahe hiraṇyagarbhāya dhīmahi |\ntanno brahma pracodayāt ||",
                      meaningHi: "हम वेदस्वरूप परब्रह्म को जानते हैं, उन हिरण्यगर्भ (स्वर्णमय ब्रह्माण्डीय गर्भ) ब्रह्मा का हम ध्यान करते हैं। वे सृष्टिकर्ता ब्रह्मा हमारी बुद्धि को दिव्य ज्ञान, सृजनशीलता और सन्मार्ग पर प्रेरित करें।",
                      meaningEn: "We realize the cosmic spirit who is the soul of all Vedas; we meditate upon Hiranyagarbha, the Golden Cosmic Source. May Lord Brahma inspire and enlighten our intellect with creative wisdom.",
                      metadata: {
                        purpose: "Intellectual clarity, creative manifestation, mastery of arts and Vedic wisdom",
                        deity: "Lord Brahma / Hiranyagarbha",
                        source: "Padma Purana / Taittiriya Aranyaka",
                      },
                    },
                  },
                  {
                    id: "brahma-hiranyagarbha-sukta",
                    parentId: "trimurti-brahma",
                    type: "leaf",
                    levelLabel: { en: "Rigvedic Suktam", hi: "ऋग्वेद सूक्त" },
                    title: { en: "Hiranyagarbha Sukta (Rigveda 10.121): The Golden Womb of Creation", hi: "हिरण्यगर्भ सूक्त (ऋग्वेद १०.१२१): ब्रह्माण्ड उत्पत्ति" },
                    shortTitle: { en: "Hiranyagarbha Sukta", hi: "हिरण्यगर्भ सूक्त" },
                    sanskrit: "हिरण्यगर्भः समवर्तताग्रे भूतस्य जातः पतिरेक आसीत्",
                    badge: "Rigveda 10.121",
                    content: {
                      sanskrit: "हिरण्यगर्भः समवर्तताग्रे भूतस्य जातः पतिरेक आसीत्।\nस दाधार पृथिवीं द्यामुतेमां कस्मै देवाय हविषा विधेम॥",
                      transliteration: "hiraṇyagarbhaḥ samavartatāgre bhūtasya jātaḥ patireka āsīt |\nsa dādhāra pṛthivīṃ dyāmutemāṃ kasmai devāya haviṣā vidhema ||",
                      meaningHi: "सृष्टि के आरम्भ में सबसे पहले 'हिरण्यगर्भ' (स्वर्णमय तेजोमय ब्रह्माण्ड-अण्ड) प्रकट हुए। वे ही उत्पन्न हुए समस्त चराचर जगत् के एकमात्र अधिपति थे। उन्होंने इस पृथ्वी और द्युलोक को धारण किया। हम उन आनन्दस्वरूप प्रजापति देवता के लिए हवि अर्पित कर पूजन करते हैं।",
                      meaningEn: "In the beginning arose Hiranyagarbha, the golden germ of cosmic light. Arisen, he became the sole lord of all that is created. He sustained this earth and heaven. To that blissful Lord of creation let us offer our reverent oblations.",
                      metadata: {
                        mandala: "Rigveda Mandala 10, Sukta 121 (Verse 1)",
                        rishi: "Hiranyagarbha Prajapatya",
                        devata: "Ka (Prajapati / Brahma)",
                        chandas: "Trishtubh",
                      },
                    },
                  },
                  {
                    id: "brahma-pushkar-tirtha",
                    parentId: "trimurti-brahma",
                    type: "leaf",
                    levelLabel: { en: "Sacred Tirtha", hi: "तीर्थ माहात्म्य" },
                    title: { en: "Pushkar Lake & Shrine: The Sanctum of Lord Brahma", hi: "पुष्कर तीर्थ एवं मन्दिर: जगत्पिता ब्रह्मा की पावन तपोभूमि" },
                    shortTitle: { en: "Pushkar Mahatmya", hi: "पुष्कर माहात्म्य" },
                    sanskrit: "तीर्थानां प्रवरं पुष्करं महापुण्यप्रदम्",
                    badge: "Pushkar Sanctum",
                    content: {
                      sanskrit: "पद्मपत्राक्ष देवेश जगत्कर्तः पितामह।\nपुष्करे च त्वया सृष्टं जगत्सर्वं चराचरम्॥\nनमो नमस्ते देवेश सृष्टिपालनकारक।",
                      transliteration: "padmapatrākṣa deveśa jagatkartar pitāmaha |\npuṣkare ca tvayā sṛṣṭaṃ jagatsarvaṃ carācaram ||\nnamo namaste deveśa sṛṣṭipālanakāraka |",
                      meaningHi: "कमल नयन, देवों के ईश, जगत् के रचयिता और सबके पितामह ब्रह्मा जी को प्रणाम! राजस्थान के पावन पुष्कर क्षेत्र में आपने महायज्ञ संपन्न कर चराचर सृष्टि के कल्याण का विधान किया। तीर्थराज पुष्कर में स्नान और दर्शन से समस्त मानसिक व आध्यात्मिक क्लेश शांत होते हैं।",
                      meaningEn: "O lotus-eyed Lord of the Devas, creator of the cosmos, revered Grandfather (Pitamaha) of all beings! In the holy realm of Pushkar, by the touch of the divine lotus, the sacred lake manifested. Salutations to You who initiate the divine cycle of creation.",
                      metadata: {
                        location: "Pushkar, Ajmer, Rajasthan (Foremost sanctum of Lord Brahma)",
                        significance: "Tirtharaja (King of Sacred Pilgrimage Waters)",
                        scripture: "Padma Purana, Srishti Khanda",
                      },
                    },
                  },
                  {
                    id: "brahma-srishti-krama",
                    parentId: "trimurti-brahma",
                    type: "leaf",
                    levelLabel: { en: "Upanishadic Truth", hi: "उपनिषद् दर्शन" },
                    title: { en: "Srishti Krama: Cosmic Emanation (Taittiriya Upanishad 3.1)", hi: "सृष्टि क्रम: परब्रह्म से ब्रह्माण्ड उत्पत्ति (तैत्तिरीय ३.१)" },
                    shortTitle: { en: "Srishti Krama", hi: "सृष्टि क्रम" },
                    sanskrit: "यतो वा इमानि भूतानि जायन्ते",
                    badge: "Taittiriya 3.1",
                    content: {
                      sanskrit: "यतो वा इमानि भूतानि जायन्ते। येन जातानि जीवन्ति।\nयत्प्रयन्त्यभिसंविशन्ति। तद्विजिज्ञासस्व। तद्ब्रह्मेति॥",
                      transliteration: "yato vā imāni bhūtāni jāyante | yena jātāni jīvanti |\nyatprayantyabhisaṃviśanti | tadvijijñāsasva | tadbrahmeti ||",
                      meaningHi: "जिस परमतत्त्व से यह समस्त भूत-प्राणी उत्पन्न होते हैं, उत्पन्न होकर जिसके द्वारा जीवन धारण करते हैं, और प्रलयकाल में जिसमें विलीन हो जाते हैं—उसी को जानने की इच्छा करो; वही 'ब्रह्म' है।",
                      meaningEn: "That from which all beings are born, by which they live after being born, and into which they dissolve on passing away—seek to know That; That is Brahman.",
                      metadata: {
                        source: "Taittiriya Upanishad (Bhrigu Valli 3.1)",
                        cosmology: "Avyakta -> Mahat -> Ahamkara -> Tanmatras -> 5 Elements (Akasha, Vayu, Agni, Jala, Prithvi)",
                      },
                    },
                  },
                ],
              },

              // Vishnu (Preservation)
              {
                id: "trimurti-vishnu",
                parentId: "trimurti-tattva",
                type: "section",
                levelLabel: { en: "Deity", hi: "देवता" },
                title: { en: "Lord Vishnu: The Preserver & Sustainer (Sthiti/Palan)", hi: "भगवान विष्णु: सम्पूर्ण जगत् के पालनकर्ता" },
                shortTitle: { en: "Vishnu", hi: "विष्णु" },
                sanskrit: "विष्णु (पालनकर्ता)",
                badge: "Sthiti Tattva",
                tagline: {
                  en: "The Preserver & Sustainer · Sthiti Tattva · Chaturbhuja & Vaikuntha",
                  hi: "पालनकर्ता · चतुर्भुज नारायण · वैकुण्ठ धाम",
                },
                cardImage: deityVishnuCardImg,
                bannerImage: bannerSanctum,
                desc: {
                  en: "Lord Vishnu is the supreme cosmic preserver who maintains Dharma and cosmic order throughout the four Yugas, descending in divine avatars to protect the righteous.",
                  hi: "भगवान विष्णु संपूर्ण चराचर जगत् के पालनकर्ता हैं, जो धर्म की रक्षा और अधर्म के विनाश हेतु प्रत्येक युग में पावन अवतार ग्रहण करते हैं।",
                },
                childLevelName: { en: "Sacred Chapter / Suktam", hi: "पावन अध्याय / सूक्त" },
                children: [
                  {
                    id: "vishnu-svarupa",
                    parentId: "trimurti-vishnu",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Chaturbhuja Vishnu: Shankha, Chakra, Gada, Padma & Sheshanaga", hi: "चतुर्भुज स्वरूप: शङ्ख, चक्र, गदा, पद्म एवं शेषनाग" },
                    shortTitle: { en: "Vishnu Svarupa", hi: "विष्णु स्वरूप" },
                    sanskrit: "शङ्खचक्रगदापद्मधारी नारायणः",
                    badge: "Chaturbhuja Form",
                    content: {
                      sanskrit: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥",
                      transliteration: "śāntākāraṃ bhujagaśayanaṃ padmanābhaṃ sureśaṃ viśvādhāraṃ gaganasadṛśaṃ meghavarṇaṃ śubhāṅgam |\nlakṣmīkāntaṃ kamalanayanaṃ yogibhirdhyānagamyaṃ vande viṣṇuṃ bhavabhayaharaṃ sarvalokaikanātham ||",
                      meaningHi: "जिनकी आकृति शांत है, जो शेषनाग की शय्या पर शयन करते हैं, जिनकी नाभि में कमल है, जो देवताओं के ईश्वर और संपूर्ण जगत् के आधार हैं; जिनका वर्ण मेघ के समान श्याम है, जो योगियों द्वारा ध्यान से प्राप्त होते हैं; उन भवभय-हारी सम्पूर्ण लोकों के स्वामी भगवान विष्णु को मैं नमन करता हूँ।",
                      meaningEn: "I bow to Lord Vishnu, whose form is supreme tranquility, resting on the cosmic serpent Shesha, from whose navel blossoms the lotus of creation. The foundation of the universe, all-pervading like space, cloud-complexioned, beloved of Lakshmi, and dispeller of worldly fears.",
                      metadata: {
                        fourArms: "Shankha (Panchajanya / Primordial Om), Chakra (Sudarshana / Cosmic Dharma), Gada (Kaumodaki / Intellect and Strength), Padma (Lotus / Spiritual Awakening)",
                        consort: "Devi Mahalakshmi",
                        vehicle: "Garuda (Veda-purusha)",
                        abode: "Vaikuntha / Ksheerasagara",
                      },
                    },
                  },
                  {
                    id: "vishnu-gayatri",
                    parentId: "trimurti-vishnu",
                    type: "leaf",
                    levelLabel: { en: "Sacred Gayatri", hi: "विष्णु गायत्री" },
                    title: { en: "Vishnu Gayatri Mantra: Narayanaya Vidmahe Vasudevaya Dhimahi", hi: "विष्णु गायत्री मन्त्र: नारायण ध्यान" },
                    shortTitle: { en: "Vishnu Gayatri", hi: "विष्णु गायत्री" },
                    sanskrit: "ॐ नारायणाय विद्महे वासुदेवाय धीमहि",
                    badge: "Gayatri Mantra",
                    content: {
                      sanskrit: "ॐ नारायणाय विद्महे वासुदेवाय धीमहि।\nतन्नो विष्णुः प्रचोदयात्॥",
                      transliteration: "oṃ nārāyaṇāya vidmahe vāsudevāya dhīmahi |\ntanno viṣṇuḥ pracodayāt ||",
                      meaningHi: "हम सर्वव्यापी श्रीनारायण को जानते हैं, उन वसुदेव-नन्दन सर्वप्रकाशक वासुदेव का ध्यान करते हैं। वे भगवान विष्णु हमारी बुद्धि को सन्मार्ग और धर्म में प्रवृत्त करें।",
                      meaningEn: "We realize the Supreme Narayana, the all-pervading shelter of all beings; we meditate upon Lord Vasudeva. May Lord Vishnu illuminate and guide our intellect towards righteousness.",
                      metadata: {
                        source: "Mahanarayana Upanishad 3.16",
                        significance: "Daily purification, protection, devotion to Dharma and spiritual peace",
                      },
                    },
                  },
                  {
                    id: "vishnu-purusha-sukta",
                    parentId: "trimurti-vishnu",
                    type: "leaf",
                    levelLabel: { en: "Rigvedic Hymn", hi: "ऋग्वेद पुरुष सूक्त" },
                    title: { en: "Purusha Sukta (Rigveda 10.90): The All-Pervading Cosmic Person", hi: "पुरुष सूक्त (ऋग्वेद १०.९०): विराट् पुरुष नारायण" },
                    shortTitle: { en: "Purusha Sukta", hi: "पुरुष सूक्त" },
                    sanskrit: "सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्",
                    badge: "Rigveda 10.90",
                    content: {
                      sanskrit: "सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्।\nस भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम्॥\nपुरुष एवेदं सर्वं यद्भूतं यच्च भव्यम्।\nउतामृतत्वस्येशानो यदन्नेनातिरोहति॥",
                      transliteration: "sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt |\nsa bhūmiṃ viśvato vṛtvātyatiṣṭhaddaśāṅgulam ||\npuruṣa evedaṃ sarvaṃ yadbhūtaṃ yacca bhavyam |\nutāmṛtatvasyeśāno yadannenātirohati ||",
                      meaningHi: "वे परम पुरुष सहस्रों सिरों वाले, सहस्रों आँखों वाले और सहस्रों चरणों वाले हैं। वे सम्पूर्ण ब्रह्माण्ड को सब ओर से व्याप्त करके भी दस अंगुल ऊपर स्थित हैं। जो कुछ बीत चुका है और जो कुछ आगे होने वाला है—यह सब कुछ वह विराट् पुरुष ही है। वही अमरत्व का स्वामी है।",
                      meaningEn: "The Cosmic Supreme Being (Purusha) has a thousand heads, a thousand eyes, and a thousand feet. Pervading the cosmos on every side, He yet extends beyond it by ten fingers' breadth. Purusha alone is all this universe—that which was, and that which is yet to be.",
                      metadata: {
                        source: "Rigveda 10.90 / Shukla Yajurveda Adhyaya 31",
                        deity: "Virat Purusha / Maha-Vishnu",
                        rishi: "Narayana",
                      },
                    },
                  },
                  {
                    id: "vishnu-sahasranama-dhyana",
                    parentId: "trimurti-vishnu",
                    type: "leaf",
                    levelLabel: { en: "Mahabharata Stotra", hi: "सहस्रनाम ध्यान" },
                    title: { en: "Vishnu Sahasranama Dhyanam: Kshirodhanvat-Pradeshe", hi: "विष्णु सहस्रनाम ध्यानम्: क्षीरसागर स्तुति" },
                    shortTitle: { en: "Sahasranama Dhyana", hi: "सहस्रनाम ध्यान" },
                    sanskrit: "क्षीरोदन्वत्प्रदेशे शुचिमणिविलसत्सैकते",
                    badge: "Anushasana Parva",
                    content: {
                      sanskrit: "क्षीरोदन्वत्प्रदेशे शुचिमणिविलसत्सैकते मौक्तिकानां\nमालाक्लप्तासनस्थः स्फटिकमणिनिभैर्मौक्तिकैर्मण्डिताङ्गः।\nशुभ्रैरभ्रैरदभ्रैरुपरिविरचितैर्मुक्तपीयूषवर्षै-\nरानन्दी नः पुनीयादरिनलिनगदाशङ्खपाणिर्मुकुन्दः॥",
                      transliteration: "kṣīrodanvatpradeśe śucimaṇivilasatsaikate mauktikānāṃ\nmālāklaptāsanasthaḥ sphaṭikamaṇinibhairmaunditāṅgaḥ |\nśubhrairabhrairadabhrairupariviracitairmuktapīyūṣavarṣai-\nrānandī naḥ punīyādarinalinagadāśaṅkhapāṇirmukundaḥ ||",
                      meaningHi: "क्षीरसागर के तट पर, जहाँ मणियों और मोतियों की बालू चमकती है, उस दिव्य आसन पर विराजमान; स्फटिक और मोतियों से सुशोभित; अमृत वर्षा करने वाले मेघों की छाँव में स्थित; अपने चारों हाथों में सुदर्शन चक्र, कमल, कौमोदकी गदा और पांचजन्य शंख धारण करने वाले आनंदमय श्री मुकुन्द भगवान हमें पवित्र करें।",
                      meaningEn: "In the realm of the Milk Ocean, on sands sparkling with pure gems and pearls, seated upon a throne of garlands; adorned with gems shining like clear crystal; under clouds showering drops of nectar; holding the discus, lotus, mace, and conch—may that blissful Lord Mukunda purify our beings.",
                      metadata: {
                        source: "Mahabharata Anushasana Parva (Bhishma-Yudhishthira Samvada)",
                        benefit: "Removal of sorrow, attainment of peace, liberation",
                      },
                    },
                  },
                ],
              },

              // Shiva (Dissolution & Liberation)
              {
                id: "trimurti-shiva",
                parentId: "trimurti-tattva",
                type: "section",
                levelLabel: { en: "Deity", hi: "देवता" },
                title: { en: "Lord Shiva: The Auspicious Transformer (Laya/Kalyana)", hi: "भगवान शिव / महादेव: संहार एवं परम कल्याण" },
                shortTitle: { en: "Shiva", hi: "शिव" },
                sanskrit: "शिव (लयकर्ता व देवाधिदेव)",
                badge: "Laya & Moksha",
                tagline: {
                  en: "The Auspicious Transformer · Laya & Moksha · Mahadeva & Kailasha",
                  hi: "लयकर्ता एवं मुक्तिदाता · देवाधिदेव महादेव · कैलास धाम",
                },
                cardImage: deityShivaCardImg,
                bannerImage: bannerAltar,
                desc: {
                  en: "Lord Shiva is Mahadeva, the auspicious transformer and embodiment of pure consciousness, who dissolves worldly illusions and guides the soul to ultimate liberation (Moksha).",
                  hi: "भगवान शिव देवाधिदेव महादेव हैं, जो काल के नियामक, संहार एवं नवसृजन के अधिपति तथा परम मोक्ष प्रदाता हैं।",
                },
                childLevelName: { en: "Sacred Chapter / Stotram", hi: "पावन अध्याय / स्तोत्र" },
                children: [
                  {
                    id: "shiva-svarupa",
                    parentId: "trimurti-shiva",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Mahadeva Shiva: Trishula, Damaru, Ganga & Kailashapati", hi: "महादेव स्वरूप: त्रिशूल, डमरू, गंगा, चन्द्रभाल एवं कैलासपति" },
                    shortTitle: { en: "Shiva Svarupa", hi: "शिव स्वरूप" },
                    sanskrit: "कैलासशिखरवासी महेश्वरः",
                    badge: "Mahadeva Form",
                    content: {
                      sanskrit: "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्।\nसदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥",
                      transliteration: "karpūragauraṃ karuṇāvatāraṃ saṃsārasāraṃ bhujagendrahāram |\nsadā vasantaṃ hṛdayāravinde bhavaṃ bhavānīsahitaṃ namāmi ||",
                      meaningHi: "जो कर्पूर के समान गौर वर्ण वाले हैं, जो करुणा के साक्षात् अवतार हैं, जो संपूर्ण संसार के सार हैं, जो सर्पराज का हार धारण करते हैं; जो सदैव मेरे हृदय रूपी कमल में वास करते हैं, उन भगवान शिव को माता भवानी (पार्वती) सहित मैं सादर प्रणाम करता हूँ।",
                      meaningEn: "I salute Lord Shiva, white as camphor, embodiment of compassion, the essence of cosmic existence, adorned with the king of serpents. He who forever abides in the lotus of my heart, I bow to that Lord Bhava united with Mother Bhavani.",
                      metadata: {
                        symbols: "Trishula (3 Gunas / Sat-Chit-Ananda), Damaru (Nada Brahman / Cosmic vibration), Third Eye (Transcendent wisdom), Crescent Moon (Mastery over Mind and Time)",
                        consort: "Mata Parvati / Bhavani",
                        vehicle: "Nandi (Bull representing Dharma)",
                        abode: "Mount Kailasha / Kashi Sanctum",
                      },
                    },
                  },
                  {
                    id: "shiva-mahamrityunjaya",
                    parentId: "trimurti-shiva",
                    type: "leaf",
                    levelLabel: { en: "Rigvedic Mahamantra", hi: "ऋग्वेद महामन्त्र" },
                    title: { en: "Maha Mrityunjaya Mantra (Rigveda 7.59.12): Conquering Death & Disease", hi: "महामृत्युञ्जय मन्त्र (ऋग्वेद ७.५९.१२): जीवन रक्षा एवं मोक्ष" },
                    shortTitle: { en: "Mrityunjaya Mantra", hi: "महामृत्युञ्जय" },
                    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
                    badge: "Rigveda 7.59.12",
                    content: {
                      sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
                      transliteration: "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||",
                      meaningHi: "हम तीन नेत्रों वाले (भूत, वर्तमान, भविष्य के ज्ञाता) सुगंधित और पुष्टि का संवर्धन करने वाले भगवान शिव की आराधना करते हैं। जिस प्रकार पका हुआ खरबूजा बिना किसी कष्ट के अपनी बेल के बंधन से मुक्त हो जाता है, उसी प्रकार हम मृत्यु के भय और संसार के बंधनों से मुक्त हों, किन्तु अमृतत्व (मोक्ष) से विमुख न हों।",
                      meaningEn: "We worship the three-eyed Lord Shiva, who is fragrant and nurtures all beings. Just as a ripe melon effortlessly detaches from its vine, may He liberate us from the bonds of mortality and spiritual ignorance, not depriving us of immortality.",
                      metadata: {
                        source: "Rigveda 7.59.12 / Shukla Yajurveda 3.60",
                        rishi: "Maharshi Markandeya / Vashishta",
                        devata: "Tryambaka Rudra",
                        benefit: "Sanatana healing, dispelling mortal fears, granting longevity and enlightenment",
                      },
                    },
                  },
                  {
                    id: "shiva-rudrashtakam",
                    parentId: "trimurti-shiva",
                    type: "leaf",
                    levelLabel: { en: "Devotional Stotram", hi: "रुद्राष्टकम्" },
                    title: { en: "Shiva Rudrashtakam: Namamishamishana Nirvanarupam (Tulsidas)", hi: "श्री रुद्राष्टकम्: नमामीशमीशान निर्वाणरूपम् (गोस्वामी तुलसीदास)" },
                    shortTitle: { en: "Rudrashtakam", hi: "रुद्राष्टकम्" },
                    sanskrit: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकम्",
                    badge: "Ramcharitmanas",
                    content: {
                      sanskrit: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्।\nनिजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम्॥\nनिराकारमोङ्कारमूलं तुरीयं गिरा ज्ञान गोतीतमीशं गिरीशम्।\nकरालं महाकाल कालं कृपालं गुणागार संसारपारं नतोऽहम्॥",
                      transliteration: "namāmīśamīśāna nirvāṇarūpaṃ vibhuṃ vyāpakaṃ brahmavedasvarūpam |\nnijaṃ nirguṇaṃ nirvikalpaṃ nirīhaṃ cidākāśamākāśavāsaṃ bhaje'ham ||\nnirākāramoṅkāramūlaṃ turīyaṃ girā jñāna gotītamīśaṃ girīśam |\nkarālaṃ mahākāla kālaṃ kṛpālaṃ guṇāgāra saṃsārapāraṃ nato'ham ||",
                      meaningHi: "हे ईशान! हे मोक्षस्वरूप! हे सर्वसमर्थ, सर्वव्यापी, ब्रह्म और वेद के स्वरूप! मैं आपको प्रणाम करता हूँ। जो अपने निज स्वरूप में स्थित, निर्गुण, निर्विकल्प, निष्काम, चिदाकाश और आकाशवत् सर्वत्र विद्यमान हैं, उन भगवान शिव की मैं वंदना करता हूँ।",
                      meaningEn: "I bow to the Supreme Lord Ishana, the embodiment of Nirvana, all-pervading, the source of Brahman and the Vedas. Self-established, beyond attributes, changeless, desireless, the sky of pure consciousness. Salutations unto the merciful conqueror of time!",
                      metadata: {
                        source: "Ramcharitmanas, Uttara Kanda",
                        poet: "Goswami Tulsidas",
                        meter: "Totaka Chhanda",
                      },
                    },
                  },
                  {
                    id: "shiva-panchakshara",
                    parentId: "trimurti-shiva",
                    type: "leaf",
                    levelLabel: { en: "Sacred Stotra", hi: "पञ्चाक्षर स्तोत्र" },
                    title: { en: "Shiva Panchakshara Stotra: Om Namah Shivaya (Adi Shankara)", hi: "शिव पञ्चाक्षर स्तोत्र: ॐ नमः शिवाय (आदि शंकराचार्य)" },
                    shortTitle: { en: "Panchakshara Stotra", hi: "पञ्चाक्षर स्तोत्र" },
                    sanskrit: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय",
                    badge: "Adi Shankara",
                    content: {
                      sanskrit: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय॥\nमन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय।\nमन्दारपुष्पबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय॥",
                      transliteration: "nāgendrahārāya trilocanāya bhasmāṅgarāgāya maheśvarāya |\nnityāya śuddhāya digambarāya tasmai nakārāya namaḥ śivāya ||\nmandākinīsalilacandanacarcitāya nandīśvarapramathanāthamaheśvarāya |\nmandārapuṣpabahupuṣpasupūjitāya tasmai makārāya namaḥ śivāya ||",
                      meaningHi: "जिनके गले में नागराज का हार है, जो त्रिनेत्र हैं, जिनका भस्म ही अंगराग है, जो नित्य, शुद्ध और दिगम्बर हैं—उस 'न' कार स्वरूप शिव को नमस्कार। जो गंगाजल और चन्दन से सुशोभित हैं, नन्दी और प्रमथ गणों के स्वामी हैं—उस 'म' कार स्वरूप शिव को नमस्कार।",
                      meaningEn: "Salutations to the syllable 'Na' of Namah Shivaya, adorned with the serpent king, three-eyed, anointed with sacred ash, eternal, pure, and clothed in the cosmic horizons! Salutations to the syllable 'Ma', bathed with celestial Ganga waters and worshipped with Mandara flowers!",
                      metadata: {
                        composer: "Jagadguru Adi Shankaracharya",
                        syllables: "Na-Ma-Shi-Va-Ya (5 Cosmic Elements: Earth, Water, Fire, Air, Ether)",
                        source: "Shiva Purana / Panchakshara Vidhi",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // 2. Tridevi & Divine Shakti
          {
            id: "tridevi-shakti",
            parentId: "devata-avatara-tattva",
            type: "division",
            levelLabel: { en: "Cosmic Feminine", hi: "त्रिदेवी शक्ति" },
            title: { en: "Tridevi: The Supreme Divine Shaktis", hi: "त्रिदेवी शक्ति: सरस्वती, लक्ष्मी, पार्वती/दुर्गा" },
            shortTitle: { en: "Tridevi", hi: "त्रिदेवी" },
            sanskrit: "त्रिदेवी शक्तिः (ज्ञान, ऐश्वर्य, शक्ति)",
            badge: "Jnana, Aishwarya, Shakti",
            tagline: {
              en: "Saraswati (Wisdom), Lakshmi (Prosperity), and Parvati/Durga (Cosmic Power & 10 Mahavidyas)",
              hi: "सरस्वती (ज्ञान), लक्ष्मी (समृद्धि), एवं पार्वती/दुर्गा (पराशक्ति एवं १० महाविद्या)",
            },
            cardImage: deviDurgaCardImg,
            children: [
              // Saraswati (Wisdom & Arts)
              {
                id: "tridevi-saraswati",
                parentId: "tridevi-shakti",
                type: "section",
                levelLabel: { en: "Devi", hi: "देवी" },
                title: { en: "Devi Saraswati: Goddess of Wisdom & Arts (Jnana-Shakti)", hi: "देवी सरस्वती: ज्ञान, विद्या एवं संगीत की अधिष्ठात्री" },
                shortTitle: { en: "Saraswati", hi: "सरस्वती" },
                sanskrit: "सरस्वती (ज्ञानशक्ति)",
                badge: "Jnana-Shakti",
                tagline: {
                  en: "Goddess of Wisdom, Arts & Speech · Jnana-Shakti · Brahmacharini",
                  hi: "ज्ञान, विद्या एवं वाणी की अधिष्ठात्री · ज्ञानशक्ति",
                },
                cardImage: deviSaraswatiCardImg,
                bannerImage: bannerSanctum,
                desc: {
                  en: "Devi Saraswati embodies the divine flow of wisdom, speech (Vak), fine arts, and spiritual discernment, seated on a white lotus holding the Veena and sacred scriptures.",
                  hi: "भगवती सरस्वती ज्ञान, विवेक, वाणी और समस्त ललित कलाओं की अधिष्ठात्री देवी हैं, जो शुभ्र कमल पर आसीन होकर वीणा एवं वेद धारण करती हैं।",
                },
                childLevelName: { en: "Sacred Hymn / Suktam", hi: "पावन स्तुति / सूक्त" },
                children: [
                  {
                    id: "saraswati-svarupa",
                    parentId: "tridevi-saraswati",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Devi Saraswati Iconography: Veena, Pustaka, Akshamala & Hamsa", hi: "सरस्वती स्वरूप: वीणा, पुस्तक, स्फटिक माला एवं हंस वाहन" },
                    shortTitle: { en: "Saraswati Svarupa", hi: "सरस्वती स्वरूप" },
                    sanskrit: "वीणापुस्तकधारिणी शारदा",
                    badge: "Divine Form",
                    content: {
                      sanskrit: "शुक्लां ब्रह्मविचारसारपरमामाद्यां जगद्व्यापिनीं\nवीणापुस्तकधारिणीमभयदां जाड्यान्धकारापहाम्।\nहस्ते स्फाटिकमालिकां विदधतीं पद्मासने संस्थितां\nवन्दे तां परमेश्वरीं भगवतीं बुद्धिप्रदां शारदाम्॥",
                      transliteration: "śuklāṃ brahmavicārasāraparamāmādyāṃ jagadvyāpinīṃ\nvīṇāpustakadhāriṇīmabhayadāṃ jāḍyāndhakārapahām |\nhaste sphāṭikamālikāṃ vidadhatīṃ padmāsane saṃsthitāṃ\nvande tāṃ parameśvarīṃ bhagavatīṃ buddhipradāṃ śāradām ||",
                      meaningHi: "जो श्वेत वर्ण वाली, ब्रह्मविचार की परम सार, आद्या शक्ति और सम्पूर्ण जगत् में व्याप्त हैं; जो हाथों में वीणा, वेद पुस्तक और अक्षमाला धारण करती हैं; अभय प्रदान करने वाली और अज्ञान के अंधकार को मिटाने वाली, कमल पर विराजित भगवती शारदा को मैं प्रणाम करता हूँ।",
                      meaningEn: "I bow to Supreme Goddess Sharada, pure white, embodiment of transcendent contemplation, all-pervading primordial power. Holding the Veena, the Vedas, and the rosary of crystals, dispeller of the darkness of ignorance, grantor of fearlessness and illumination.",
                      metadata: {
                        symbols: "Veena (Harmony of Mind), Pustaka (Vedic Wisdom), Crystal Mala (Concentration), White Lotus (Pure Consciousness)",
                        vehicle: "Hamsa (Discernment between Truth and Illusion)",
                        source: "Sharada Vandana / Saraswati Rahasya Upanishad",
                      },
                    },
                  },
                  {
                    id: "saraswati-vandana",
                    parentId: "tridevi-saraswati",
                    type: "leaf",
                    levelLabel: { en: "Classical Stotram", hi: "सरस्वती वन्दना" },
                    title: { en: "Ya Kundendu Tushara Hara: Universal Saraswati Vandana", hi: "या कुन्देन्दुतुषारहारधवला: सर्वमान्य सरस्वती वन्दना" },
                    shortTitle: { en: "Ya Kundendu", hi: "या कुन्देन्दु" },
                    sanskrit: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता",
                    badge: "Sacred Stotra",
                    content: {
                      sanskrit: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।\nया ब्रह्माच्युतशंकरप्रभृतिभिर्देवैः सदा वन्दिता\nसा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥",
                      transliteration: "yā kundendutuṣārahāradhavalā yā śubhravastrāvṛtā\nyā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā |\nyā brahmācyutaśaṃkaraprabhṛtibhirdevaiḥ sadā vanditā\nsā māṃ pātu sarasvatī bhagavatī niḥśeṣajāḍyāpahā ||",
                      meaningHi: "जो कुंद के पुष्प, चंद्रमा और हिमहार के समान श्वेत हैं, जो शुभ्र वस्त्र धारण करती हैं, जिनके हाथों में वीणा सुशोभित है, जो श्वेत कमल पर विराजित हैं, और जिनकी वंदना ब्रह्मा, विष्णु व महेश करते हैं—वे अज्ञान को पूर्णतः नष्ट करने वाली भगवती सरस्वती हमारी रक्षा करें।",
                      meaningEn: "May Goddess Saraswati, who is radiant like the jasmine flower, the moon, and snow; who wears immaculate white robes, whose hands hold the Veena, seated upon a white lotus, revered by Brahma, Vishnu, and Shiva, protect us and dispel all ignorance from our minds.",
                      metadata: {
                        tradition: "Daily prayer in Vedic Gurukulas, schools, and art academies across Bharat",
                        source: "Rigveda Saraswati Sukta & Puranic Vandana",
                      },
                    },
                  },
                  {
                    id: "saraswati-gayatri",
                    parentId: "tridevi-saraswati",
                    type: "leaf",
                    levelLabel: { en: "Sacred Gayatri", hi: "सरस्वती गायत्री" },
                    title: { en: "Saraswati Gayatri Mantra: Awakening Supreme Intellect", hi: "सरस्वती गायत्री मन्त्र: मेधा एवं वाक्सिद्धि" },
                    shortTitle: { en: "Saraswati Gayatri", hi: "सरस्वती गायत्री" },
                    sanskrit: "ॐ सरस्वत्यै विद्महे ब्रह्मपुत्र्यै धीमहि",
                    badge: "Gayatri Mantra",
                    content: {
                      sanskrit: "ॐ सरस्वत्यै विद्महे ब्रह्मपुत्र्यै धीमहि।\nतन्नो देवी प्रचोदयात्॥",
                      transliteration: "oṃ saraswatyai vidmahe brahmaputryai dhīmahi |\ntanno devī pracodayāt ||",
                      meaningHi: "हम ज्ञानस्वरूपा भगवती सरस्वती को जानते हैं, उन ब्रह्मा की मानस-पुत्री का हम ध्यान करते हैं। वे देवी हमारी बुद्धि और प्रतिभा को सन्मार्ग में प्रेरित करें।",
                      meaningEn: "We realize the Goddess of wisdom, Saraswati; we meditate upon the supreme creative daughter of Brahman. May that divine Mother illuminate and awaken our intellect.",
                      metadata: {
                        significance: "Academic excellence, musical mastery, clear speech, creative writing",
                        source: "Taittiriya Aranyaka 10.1.33",
                      },
                    },
                  },
                  {
                    id: "saraswati-suktam",
                    parentId: "tridevi-saraswati",
                    type: "leaf",
                    levelLabel: { en: "Rigvedic Suktam", hi: "ऋग्वेद सूक्त" },
                    title: { en: "Pavaka Nah Saraswati: Rigveda 1.3.10-12 (Vedic Stream of Truth)", hi: "पावका नः सरस्वती (ऋग्वेद १.३.१०): पावन ज्ञान सरिता" },
                    shortTitle: { en: "Vedic Saraswati", hi: "ऋग्वेद सरस्वती" },
                    sanskrit: "पावका नः सरस्वती वाजेभिर्वाजिनीवती",
                    badge: "Rigveda 1.3.10",
                    content: {
                      sanskrit: "पाव॒का नः॒ सर॑स्वती॒ वाजे॑भिर्वा॒जिनी॑वती।\nय॒ज्ञं व॑ष्टु धि॒याव॑सुः॥\nप्र चो॒दय॑त्री सू॒नृता॑नां॒ चेतं॑ती सुम॑तीनाम्।\nय॒ज्ञं द॑धे॒ सर॑स्वती॥\nम॒हो अर्णः॒ सर॑स्वती॒ प्र चे॑तयति के॒तुना॑।\nधियो॒ विश्वा॒ वि रा॑जति॥",
                      transliteration: "pāvakā naḥ sarasvatī vājebhirvājinīvatī |\nyajñaṃ vaṣṭu dhiyāvasuḥ ||\npra codayatrī sūnṛtānāṃ cetaṃtī sumatīnām |\nyajñaṃ dadhe sarasvatī ||\nmaho arṇaḥ sarasvatī pra cetayati ketunā |\ndhiyo viśvā vi rājati ||",
                      meaningHi: "पवित्र करने वाली, ज्ञान और कर्म के अन्न से समृद्ध, उत्तम बुद्धि प्रदान करने वाली भगवती सरस्वती हमारे यज्ञ को स्वीकार करें। सत्य व प्रिय वचनों को प्रेरित करने वाली, श्रेष्ठ विचारों को जाग्रत करने वाली सरस्वती हमारे जीवन को ज्ञानमय बनाएं। वे ज्ञान के महान समुद्र को अपने दिव्य प्रकाश से प्रकाशित करती हैं और समस्त बुद्धियों में ज्ञान का संचार करती हैं।",
                      meaningEn: "May purifying Saraswati, rich in divine treasures, rich in sacred action, accept our prayers. Inspirer of noble truths, awakener of sublime thoughts, Saraswati upholds our inner sacrifice. With Her radiant light She illuminates the mighty ocean of knowledge and enlightens all intellects.",
                      metadata: {
                        mandala: "Rigveda Mandala 1, Sukta 3 (Verses 10-12)",
                        rishi: "Madhuchhandas Vaishvamitra",
                        devata: "Saraswati",
                        chandas: "Gayatri",
                      },
                    },
                  },
                ],
              },

              // Lakshmi (Prosperity & Auspiciousness)
              {
                id: "tridevi-lakshmi",
                parentId: "tridevi-shakti",
                type: "section",
                levelLabel: { en: "Devi", hi: "देवी" },
                title: { en: "Devi Mahalakshmi: Goddess of Fortune & Grace (Kriya-Shakti)", hi: "देवी महालक्ष्मी: ऐश्वर्य, सौभाग्य एवं समृद्धि की अधिष्ठात्री" },
                shortTitle: { en: "Mahalakshmi", hi: "महालक्ष्मी" },
                sanskrit: "महालक्ष्मी (ऐश्वर्यशक्ति)",
                badge: "Aishwarya-Shakti",
                tagline: {
                  en: "Goddess of Fortune, Wealth & Grace · Aishwarya-Shakti · Ashta-Lakshmi",
                  hi: "ऐश्वर्य, सौभाग्य एवं समृद्धि की अधिष्ठात्री · क्रियाशक्ति",
                },
                cardImage: deityLakshmiCardImg,
                bannerImage: bannerSanctum,
                desc: {
                  en: "Devi Mahalakshmi is the eternal consort of Lord Vishnu, manifesting divine grace, material abundance, spiritual prosperity, and auspiciousness across all three worlds.",
                  hi: "भगवती महालक्ष्मी भगवान विष्णु की नित्य शक्ति हैं, जो धर्मानुकूल ऐश्वर्य, अष्टलक्ष्मी रूपी सौभाग्य और आंतरिक शांति प्रदान करती हैं।",
                },
                childLevelName: { en: "Sacred Hymn / Suktam", hi: "पावन स्तुति / सूक्त" },
                children: [
                  {
                    id: "lakshmi-svarupa",
                    parentId: "tridevi-lakshmi",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Ashta Lakshmi: The Eight Divine Manifestations of Abundance", hi: "अष्टलक्ष्मी स्वरूप: धन, धान्य, विद्या, धैर्य एवं विजय" },
                    shortTitle: { en: "Ashta Lakshmi", hi: "अष्टलक्ष्मी स्वरूप" },
                    sanskrit: "अष्टलक्ष्मी स्वरूपम्",
                    badge: "8 Divine Forms",
                    content: {
                      sanskrit: "आदिलक्ष्मीर्धान्यलक्ष्मीर्धैर्यलक्ष्मीस्तथैव च।\nगजलक्ष्मी राज्यलक्ष्मीः सन्तानलक्ष्मीस्तथा॥\nविजयलक्ष्मीर्विद्यालक्ष्मीश्चाष्टौ लक्ष्म्यः प्रकीर्तिताः।",
                      transliteration: "ādilakṣmīrdhānyalakṣmīrdhairyalakṣmīstathaiva ca |\ngajalakṣmī rājyalakṣmīḥ santānalakṣmīstathā ||\nvijayalakṣmīrvidyālakṣmīścāṣṭau lakṣmyaḥ prakīrtitāḥ |",
                      meaningHi: "सनातन परंपरा में महालक्ष्मी के ८ पावन स्वरूप पूजित हैं:\n१. आदिलक्ष्मी (मूल आत्म-समृद्धि)\n२. धान्यलक्ष्मी (अन्न व पोषण)\n३. धैर्यलक्ष्मी (साहस व आंतरिक बल)\n४. गजलक्ष्मी (राजसी वैभव व पशुधन)\n५. सन्तानलक्ष्मी (सद्गुणी संतति)\n६. विजयलक्ष्मी (सत्कर्मों में सफलता)\n७. विद्यालक्ष्मी (आध्यात्मिक व सांसारिक ज्ञान)\n८. धनलक्ष्मी (धर्मयुक्त स्वर्ण व संपदा)।",
                      meaningEn: "The eight auspicious forms of Goddess Lakshmi representing all dimensions of holistic human fulfillment:\n1. Adi Lakshmi (primordial spiritual wealth)\n2. Dhanya Lakshmi (agricultural nourishment)\n3. Dhairya Lakshmi (courage and endurance)\n4. Gaja Lakshmi (royal elegance and grace)\n5. Santana Lakshmi (noble lineage and children)\n6. Vijaya Lakshmi (victory in righteous endeavors)\n7. Vidya Lakshmi (wisdom and learning)\n8. Dhana Lakshmi (ethical financial prosperity).",
                      metadata: {
                        concept: "Holistic abundance beyond mere money—integrating physical, mental, social, and spiritual wealth",
                        source: "Ashta Lakshmi Stotram",
                      },
                    },
                  },
                  {
                    id: "lakshmi-ashtakam",
                    parentId: "tridevi-lakshmi",
                    type: "leaf",
                    levelLabel: { en: "Puranic Stotram", hi: "महालक्ष्मी अष्टकम्" },
                    title: { en: "Mahalakshmi Ashtakam: Namastestu Mahamaye (Indra Kritam)", hi: "महालक्ष्मी अष्टकम्: नमस्तेऽस्तु महामाये (देवराज इन्द्र कृत)" },
                    shortTitle: { en: "Lakshmi Ashtakam", hi: "महालक्ष्मी अष्टकम्" },
                    sanskrit: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते",
                    badge: "Padma Purana",
                    content: {
                      sanskrit: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥\nनमस्ते गरुडारूढे कोलासुरभयंकरि।\nसर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते॥",
                      transliteration: "namaste'stu mahāmāye śrīpīṭhe surapūjite |\nśaṅkhacakragadāhaste mahālakṣmi namo'stu te ||\nnamaste garuḍārūḍhe kolāsurabhayaṃkari |\nsarvapāpahare devi mahālakṣmi namo'stu te ||",
                      meaningHi: "हे महामाये! हे श्रीपीठ पर स्थित और देवताओं द्वारा पूजित देवी! शंख, चक्र और गदा धारण करने वाली भगवती महालक्ष्मी! आपको बारंबार नमस्कार है। हे गरुड़ारूढ़ा, कोलासुर का भय हरने वाली और समस्त पापों का नाश करने वाली महालक्ष्मी! आपको हमारा सादर प्रणाम।",
                      meaningEn: "Salutations to You, O Mahamaya, who abides on the holy Sri Peetha, adored by the celestials! O Mother Mahalakshmi, holding the conch, discus, and mace, prostrations unto You! Seated upon Garuda, vanquisher of demonic despair, redeemer of sins, salutations unto You!",
                      metadata: {
                        speaker: "Devraj Indra",
                        source: "Padma Purana",
                        benefit: "Granting freedom from poverty, debt, sorrow, and spiritual bondage",
                      },
                    },
                  },
                  {
                    id: "lakshmi-sri-suktam",
                    parentId: "tridevi-lakshmi",
                    type: "leaf",
                    levelLabel: { en: "Vedic Khilani Hymn", hi: "ऋग्वेद श्रीसूक्त" },
                    title: { en: "Sri Suktam (Rigveda Khilani): Hiranyavarnam Harineem", hi: "श्री सूक्तम् (ऋग्वेद खिलानि): हिरण्यवर्णां हरिणीम्" },
                    shortTitle: { en: "Sri Suktam", hi: "श्री सूक्तम्" },
                    sanskrit: "हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम्",
                    badge: "Vedic Sri Suktam",
                    content: {
                      sanskrit: "हिर॑ण्यवर्णां॒ हरि॑णीं सु॒वर्ण॑रज॒तस्र॑जाम्।\nच॒न्द्रां हि॒रण्म॑यीं ल॒क्ष्मीं जात॑वेदो म॒ आव॑ह॥\nतां म॒ आव॑ह॒ जात॑वेदो ल॒क्ष्मीमन॑पगा॒मिनी॑म्।\nयस्यां॒ हिर॑ण्यं वि॒न्देयं॒ गामश्वं॒ पुरु॑षान॒हम्॥",
                      transliteration: "hiraṇyavarṇāṃ hariṇīṃ suvarṇarajatasrajām |\ncandrāṃ hiraṇmayīṃ lakṣmīṃ jātavedo ma āvaha ||\ntāṃ ma āvaha jātavedo lakṣmīmanapagāminīm |\nyasyāṃ hiraṇyaṃ vindeyaṃ gāmaśvaṃ puruṣānaham ||",
                      meaningHi: "हे सर्वज्ञ अग्निदेव! स्वर्ण के समान देदीप्यमान वर्ण वाली, सुवर्ण और चांदी के हार धारण करने वाली, चन्द्रमा के समान शीतल एवं आनन्दमयी भगवती महालक्ष्मी का हमारे यहाँ आवाहन कीजिए। उस अविनाशी महालक्ष्मी को हमारे यहाँ प्रतिष्ठित करें, जिनके अनुग्रह से हमें ज्ञान, समृद्धि, गव्य-धन और सत्संग की प्राप्ति हो।",
                      meaningEn: "O all-knowing Agni (Jataveda), invoke for me that radiant Goddess Lakshmi, of golden hue, gentle as a doe, adorned with garlands of gold and silver, luminous as the moon. Invoke that ever-abiding Lakshmi, by whose grace I may attain sacred prosperity, noble progeny, and spiritual enlightenment.",
                      metadata: {
                        source: "Rigveda Khilani (Appendix to Rigveda 5.87)",
                        rishi: "Ananda, Kardama, Chiklita, Shrita (sons of Sri)",
                        devata: "Sri / Mahalakshmi",
                        chandas: "Anushtubh & Trishtubh",
                      },
                    },
                  },
                  {
                    id: "lakshmi-gayatri",
                    parentId: "tridevi-lakshmi",
                    type: "leaf",
                    levelLabel: { en: "Sacred Gayatri", hi: "महालक्ष्मी गायत्री" },
                    title: { en: "Mahalakshmi Gayatri: Om Mahalakshmyai Cha Vidmahe", hi: "महालक्ष्मी गायत्री मन्त्र: अष्टैश्वर्य प्राप्ति" },
                    shortTitle: { en: "Lakshmi Gayatri", hi: "महालक्ष्मी गायत्री" },
                    sanskrit: "ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि",
                    badge: "Gayatri Mantra",
                    content: {
                      sanskrit: "ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि।\nतन्नो लक्ष्मीः प्रचोदयात्॥",
                      transliteration: "oṃ mahālakṣmyai ca vidmahe viṣṇupatnyai ca dhīmahi |\ntanno lakṣmīḥ pracodayāt ||",
                      meaningHi: "हम परमेश्वरी महालक्ष्मी को जानते हैं, उन भगवान विष्णु की नित्य शक्ति का हम ध्यान करते हैं। वे देवी लक्ष्मी हमें धर्मानुकूल ऐश्वर्य, सद्बुद्धि और सन्मार्ग की ओर प्रेरित करें।",
                      meaningEn: "We realize the Supreme Mother Mahalakshmi; we meditate upon the beloved divine consort of Lord Vishnu. May Mother Lakshmi enlighten and prosper our intellect and life.",
                      metadata: {
                        source: "Mahanarayana Upanishad 3.17",
                        significance: "Brings harmony to households, removes distress, bestows auspiciousness",
                      },
                    },
                  },
                ],
              },

              // Durga / Parvati (Cosmic Power & 10 Mahavidyas)
              {
                id: "tridevi-durga",
                parentId: "tridevi-shakti",
                type: "section",
                levelLabel: { en: "Devi", hi: "देवी" },
                title: { en: "Devi Durga/Parvati: The Primordial Cosmic Power (Iccha-Shakti & 10 Mahavidyas)", hi: "देवी दुर्गा/पार्वती: पराशक्ति, नवदुर्गा एवं १० महाविद्या" },
                shortTitle: { en: "Durga/Shakti", hi: "दुर्गा / शक्ति" },
                sanskrit: "दुर्गा (पराशक्ति एवं १० महाविद्या)",
                badge: "Iccha-Shakti",
                tagline: {
                  en: "Primordial Cosmic Energy · Iccha-Shakti · Navadurga & 10 Mahavidyas",
                  hi: "पराशक्ति, असुरविनाशिनी एवं जगन्माता · इच्छाशक्ति",
                },
                cardImage: deviDurgaCardImg,
                bannerImage: bannerSanctum,
                desc: {
                  en: "Devi Durga is the primordial invincible Shakti (Adishakti), seated upon a lion, holding celestial weapons to vanquish demonic forces, protect seekers, and manifest cosmic order.",
                  hi: "भगवती दुर्गा सिंहवाहिनी, सर्वशत्रुविनाशिनी, नवदुर्गा एवं दश महाविद्याओं की मूल पराशक्ति हैं, जो धर्म की रक्षा और दुष्टों के दलन हेतु अवतरित होती हैं।",
                },
                childLevelName: { en: "Sacred Hymn / Kavacham", hi: "पावन स्तुति / कवच" },
                children: [
                  {
                    id: "durga-svarupa",
                    parentId: "tridevi-durga",
                    type: "leaf",
                    levelLabel: { en: "Divine Iconography", hi: "दिव्य स्वरूप" },
                    title: { en: "Simhavahini Durga: Nine Forms (Navadurga) & 10 Mahavidyas", hi: "सिंहवाहिनी दुर्गा: नवदुर्गा एवं १० महाविद्या स्वरूप" },
                    shortTitle: { en: "Navadurga Svarupa", hi: "नवदुर्गा स्वरूप" },
                    sanskrit: "नवदुर्गा एवं दश महाविद्याः",
                    badge: "Navadurga & Mahavidya",
                    content: {
                      sanskrit: "प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी।\nतृतीयं चन्द्रघण्टेति कूष्माण्डेति चतुर्थकम्॥\nपञ्चमं स्कन्दमातेति षष्ठं कात्यायनीति च।\nसप्तमं कालरात्रीति महागौरीति चाष्टमम्॥\nनवमं सिद्धिदात्री च नवदुर्गाः प्रकीर्तिताः॥",
                      transliteration: "prathamaṃ śailaputrī ca dvitīyaṃ brahmacāriṇī |\ntṛtīyaṃ candraghaṇṭeti kūṣmāṇḍeti caturthakam ||\npañcamaṃ skandamāteti ṣaṣṭhaṃ kātyāyanīti ca |\nsaptamaṃ kālarātrīti mahāgaurīti cāṣṭamam ||\nnavamaṃ siddhidātrī ca navadurgāḥ prakīrtitāḥ ||",
                      meaningHi: "मां दुर्गा के ९ पावन स्वरूप (नवदुर्गा):\n१. शैलपुत्री (स्थिरता व साधना)\n२. ब्रह्मचारिणी (तपस्या व संयम)\n३. चन्द्रघण्टा (वीरता व शांति)\n४. कूष्माण्डा (ब्रह्माण्ड सृजन)\n५. स्कन्दमाता (वात्सल्य व ज्ञान)\n६. कात्यायनी (असुर संहार)\n७. कालरात्रि (अज्ञान व भय नाशिनी)\n८. महागौरी (पवित्रता व कल्याण)\n९. सिद्धिदात्री (समस्त सिद्धियों की प्रदात्री)।\nइसके साथ १० महाविद्याएं: काली, तारा, षोडशी, भुवनेश्वरी, भैरवी, छिन्नमस्ता, धूमावती, बगलामुखी, मातंगी, कमला।",
                      meaningEn: "The nine divine manifestations of Goddess Durga (Navadurga):\n1. Shailaputri (daughter of Himalayas, grounding)\n2. Brahmacharini (unwavering ascetic devotion)\n3. Chandraghanta (courage, auspicious sound)\n4. Kushmanda (creator of cosmic sphere)\n5. Skandamata (mother of divine wisdom/Kartikeya)\n6. Katyayani (destroyer of tyranny/Mahishasura)\n7. Kalaratri (remover of darkness and fear)\n8. Mahagauri (immaculate purity and grace)\n9. Siddhidatri (bestower of supreme spiritual attainments).\nAccompanied by the Dasa Mahavidyas (the 10 Great Wisdom Goddesses).",
                      metadata: {
                        source: "Devi Mahatmya / Markandeya Purana / Durga Saptashati",
                        symbol: "Lion (fearlessness and mastery over animal instincts), Trishula, Conch, Chakra",
                      },
                    },
                  },
                  {
                    id: "durga-sarvamangala",
                    parentId: "tridevi-durga",
                    type: "leaf",
                    levelLabel: { en: "Universal Prayer", hi: "मंगल स्तुति" },
                    title: { en: "Sarvamangala Mangalye: The Universal Invocation of Auspiciousness", hi: "सर्वमङ्गलमाङ्गल्ये: जगन्माता की परम मंगलकारी स्तुति" },
                    shortTitle: { en: "Sarvamangala", hi: "सर्वमङ्गलमाङ्गल्ये" },
                    sanskrit: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके",
                    badge: "Durga Saptashati",
                    content: {
                      sanskrit: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
                      transliteration: "sarvamaṅgalamāṅgalye śive sarvārthasādhike |\nśaraṇye tryambake gauri nārāyaṇi namo'stu te ||",
                      meaningHi: "हे सर्वमंगलमयी! हे कल्याणकारी शिवे! हे धर्म, अर्थ, काम और मोक्ष चारों पुरुषार्थों को सिद्ध करने वाली, शरणागतवत्सला, त्रिनेत्रा गौरी नारायणी! आपको बारंबार नमस्कार है।",
                      meaningEn: "O Auspiciousness of all that is auspicious! O benevolent Devi Shiva, fulfiller of all spiritual and material aims! O refuge of the surrendered, three-eyed Gauri Narayani, salutations unto You!",
                      metadata: {
                        source: "Durga Saptashati (Devi Mahatmya) 11.10",
                        context: "Chanted during all Sanatana pujas, weddings, and auspicious beginnings",
                      },
                    },
                  },
                  {
                    id: "durga-saptashati-kavacham",
                    parentId: "tridevi-durga",
                    type: "leaf",
                    levelLabel: { en: "Sacred Shield", hi: "देवी कवच" },
                    title: { en: "Devi Kavacham: The Armour of Divine Protection", hi: "श्री चण्डी देवी कवचम्: समस्त दिशाओं में दिव्य रक्षा" },
                    shortTitle: { en: "Devi Kavacham", hi: "देवी कवचम्" },
                    sanskrit: "ब्रह्मोवाच यद्गुह्यं परमं लोके",
                    badge: "Chandi Kavacham",
                    content: {
                      sanskrit: "ॐ यद्गुह्यं परमं लोके सर्वरक्षाकरं नृणाम्।\nयन्न कस्यचिदाख्यातं तन्मे ब्रूहि पितामह॥\nब्रह्मोवाच—\nअस्ति गुह्यतमं विप्र सर्वभूतोपकारकम्।\nदेव्यास्तु कवचं पुण्यं तच्छृणुष्व महामुने॥",
                      transliteration: "oṃ yadguhyaṃ paramaṃ loke sarvarakṣākaraṃ nṛṇām |\nyanna kasyacidākhyātaṃ tanme brūhi pitāmaha ||\nbrahmovāca—\nasti guhyatamaṃ vipra sarvabhūtopakārakam |\ndevyāstu kavacaṃ puṇyaṃ tacchṛṇuṣva mahāmune ||",
                      meaningHi: "मार्कण्डेय जी ने पूछा: हे पितामह! संसार में जो परम गोपनीय और मनुष्यों की सब प्रकार से रक्षा करने वाला साधन हो, वह मुझे बताइए। ब्रह्मा जी ने कहा: हे महामुने! संपूर्ण प्राणियों का उपकार करने वाला देवी का पवित्र कवच है, जिसे धारण करने से कोई भी संकट या नकारात्मक शक्ति साधक का स्पर्श नहीं कर सकती।",
                      meaningEn: "Sage Markandeya asked: O Grandfather, reveal that supreme secret which affords all protection to humanity. Lord Brahma replied: Hear, O Sage, the sacred Devi Kavacham, which protects every limb, thought, and breath of the spiritual aspirant against all adversities.",
                      metadata: {
                        source: "Varaha Purana / Sri Durga Saptashati Anga",
                        power: "Inviolable spiritual shield, mental strength, destruction of fear",
                      },
                    },
                  },
                  {
                    id: "durga-gayatri",
                    parentId: "tridevi-durga",
                    type: "leaf",
                    levelLabel: { en: "Sacred Gayatri", hi: "दुर्गा गायत्री" },
                    title: { en: "Durga Gayatri Mantra: Invoking Invincible Courage", hi: "दुर्गा / कात्यायनी गायत्री मन्त्र: अमोघ शक्ति ध्यान" },
                    shortTitle: { en: "Durga Gayatri", hi: "दुर्गा गायत्री" },
                    sanskrit: "ॐ कात्यायन्यै विद्महे कन्याकुमार्यै धीमहि",
                    badge: "Gayatri Mantra",
                    content: {
                      sanskrit: "ॐ कात्यायन्यै विद्महे कन्याकुमार्यै धीमहि।\nतन्नो दुर्गिः प्रचोदयात्॥",
                      transliteration: "oṃ kātyāyanyai vidmahe kanyakumāryai dhīmahi |\ntanno durgiḥ pracodayāt ||",
                      meaningHi: "हम पराशक्ति भगवती कात्यायनी को जानते हैं, उन दिव्य कन्याकुमारी का हम ध्यान करते हैं। वे भगवती दुर्गा हमारी बुद्धि को साहस, ज्ञान और शौर्य के पथ पर प्रेरित करें।",
                      meaningEn: "We realize the invincible Goddess Katyayani; we meditate upon the transcendent Maiden of Divine Light (Kanyakumari). May Mother Durga illuminate and awaken our courage and consciousness.",
                      metadata: {
                        source: "Mahanarayana Upanishad 3.18 / Krishna Yajurveda",
                        significance: "Removal of insurmountable obstacles (Durgam), inner fortitude",
                      },
                    },
                  },
                ],
              },
            ],
          },

          // 3. Dashavatara Tattva
          {
            id: "dashavatara-tattva",
            parentId: "devata-avatara-tattva",
            type: "division",
            levelLabel: { en: "Divine Avataras", hi: "दशावतार तत्त्व" },
            title: { en: "Dashavatara: The 10 Divine Descents of Lord Vishnu", hi: "दशावतार: भगवान विष्णु के १० पावन अवतार" },
            shortTitle: { en: "Dashavatara", hi: "दशावतार" },
            sanskrit: "दशावतार तत्त्वम् (मत्स्य से कल्कि तक)",
            badge: "10 Divine Incarnations",
            tagline: {
              en: "Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, and Kalki",
              hi: "मत्स्य, कूर्म, वराह, नृसिंह, वामन, परशुराम, राम, कृष्ण, बुद्ध एवं कल्कि",
            },
            cardImage: deityVishnuCardImg,
            childLevelName: { en: "Avatara / Shloka", hi: "अवतार / श्लोक" },
            children: [
              {
                id: "dashavatara-stotra-jayadeva",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Canonical Order", hi: "प्रमाण श्लोक" },
                title: { en: "The 10 Avatars of Vishnu (Matsya to Kalki)", hi: "दशावतार स्वरूप एवं क्रम (मत्स्य से कल्कि)" },
                shortTitle: { en: "10 Avatars Order", hi: "१० अवतार क्रम" },
                sanskrit: "दशावतार ध्यानम्",
                badge: "Overview",
                content: {
                  sanskrit: "मत्स्यः कूर्मो वराहश्च नरसिंहोऽथ वामनः।\nरामो रामश्च रामश्च कृष्णो बुद्धः कल्किरेव च॥",
                  transliteration: "matsyaḥ kūrmo varāhaśca narasiṃho'tha vāmanaḥ |\nrāmo rāmaśca rāmaśca kṛṣṇo buddhaḥ kalkireva ca ||",
                  meaningHi: "भगवान विष्णु के १० मुख्य अवतार हैं: १. मत्स्य, २. कूर्म, ३. वराह, ४. नृसिंह, ५. वामन, ६. परशुराम, ७. श्रीराम, ८. श्रीकृष्ण, ९. बुद्ध, और १०. कल्कि।",
                  meaningEn: "The ten principal avatars of Lord Vishnu: 1. Matsya, 2. Kurma, 3. Varaha, 4. Narasimha, 5. Vamana, 6. Parashurama, 7. Rama, 8. Krishna, 9. Buddha, 10. Kalki.",
                  metadata: {
                    yugas: "Satya Yuga (4) -> Treta Yuga (3) -> Dvapara Yuga (1) -> Kali Yuga (2)",
                    purpose: "Paritranaya Sadhunam Vinashaya Cha Dushkritam (To protect Dharma and elevate consciousness)",
                    source: "Agni Purana / Garuda Purana / Gita Govinda",
                  },
                },
              },
              {
                id: "avatar-1-matsya",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 1", hi: "प्रथम अवतार" },
                title: { en: "01. Matsya Avatara: The Divine Fish (Rescue of Vedas & Manu)", hi: "०१. मत्स्य अवतार: वेदोद्धार एवं सत्यव्रत मनु रक्षा" },
                shortTitle: { en: "01. Matsya", hi: "०१. मत्स्य" },
                sanskrit: "प्रलयपयोधिजले धृतवानसि वेदम्",
                badge: "Satya Yuga",
                content: {
                  sanskrit: "प्रलयपयोधिजले धृतवानसि वेदं विहितवहित्रचरित्रमखेदम्।\nकेशव धृतमीनशरीर जय जगदीश हरे॥",
                  transliteration: "pralayapayodhijale dhṛtavānasi vedaṃ vihitavahitracaritramakhedam |\nkeśava dhṛtamīnaśarīra jaya jagadīśa hare ||",
                  meaningHi: "महाप्रलय के जल में जब समस्त सृष्टि डूब रही थी, तब आपने मत्स्य रूप धारण कर वेदों की रक्षा की और सत्यव्रत मनु की नौका को पार लगाया। हे मीन रूपधारी श्रीहरि, आपकी जय हो!",
                  meaningEn: "During the cosmic deluge when the worlds were submerged, You took the form of a golden horned fish to safeguard the eternal Vedas and guide King Satyavrata's ark of life to safety.",
                  metadata: { yuga: "Satya Yuga", antagonist: "Hayagriva (Demon who stole Vedas)", source: "Jayadeva Dashavatara Stotram 1 / Bhagavata 8.24" },
                },
              },
              {
                id: "avatar-2-kurma",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 2", hi: "द्वितीय अवतार" },
                title: { en: "02. Kurma Avatara: The Divine Tortoise (Samudra Manthan)", hi: "०२. कूर्म अवतार: समुद्र मन्थन एवं मन्दराचल धारण" },
                shortTitle: { en: "02. Kurma", hi: "०२. कूर्म" },
                sanskrit: "क्षितिरतिविपुलतरे तव तिष्ठति पृष्ठे",
                badge: "Satya Yuga",
                content: {
                  sanskrit: "क्षितिरतिविपुलतरे तव तिष्ठति पृष्ठे धरणिधरणकिणचक्रगरिष्ठे।\nकेशव धृतकच्छपरूप जय जगदीश हरे॥",
                  transliteration: "kṣitirativipulatare tava tiṣṭhati pṛṣṭhe dharaṇidharaṇakiṇacakragariṣṭhe |\nkeśava dhṛtakacchaparūpa jaya jagadīśa hare ||",
                  meaningHi: "देवों और असुरों द्वारा अमृत प्राप्ति हेतु समुद्र मंथन के समय आपने अपनी विशाल पीठ पर मन्दराचल पर्वत को धारण किया। हे कच्छप रूपधारी श्रीहरि, आपकी जय हो!",
                  meaningEn: "During the churning of the cosmic ocean for the nectar of immortality, You manifested as the great Tortoise, bearing Mount Mandara steadily upon Your vast back.",
                  metadata: { yuga: "Satya Yuga", event: "Samudra Manthan (Manifestation of Amrita & Lakshmi)", source: "Bhagavata Purana 8.7" },
                },
              },
              {
                id: "avatar-3-varaha",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 3", hi: "तृतीय अवतार" },
                title: { en: "03. Varaha Avatara: The Divine Boar (Rescue of Mother Earth)", hi: "०३. वराह अवतार: हिरण्याक्ष वध एवं भू-उद्धार" },
                shortTitle: { en: "03. Varaha", hi: "०३. वराह" },
                sanskrit: "वसति दशनशिखरे धरणी तव लग्ना",
                badge: "Satya Yuga",
                content: {
                  sanskrit: "वसति दशनशिखरे धरणी तव लग्ना शशिनि कलङ्ककलेव निमग्ना।\nकेशव धृतशूकररूप जय जगदीश हरे॥",
                  transliteration: "vasati daśanaśikhare dharaṇī tava lagnā śaśini kalaṅkakaleva nimagnā |\nkeśava dhṛtaśūkararūpa jaya jagadīśa hare ||",
                  meaningHi: "रसातल में जलमग्न हुई पृथ्वी को आपने अपनी श्वेत दाढ़ के अग्रभाग पर वैसे ही धारण किया जैसे चन्द्रमा पर कलंक सुशोभित होता है। आपने अत्याचारी हिरण्याक्ष का संहार किया।",
                  meaningEn: "When Mother Earth was submerged in the cosmic abyssal waters by demon Hiranyaksha, You took the form of the Divine Boar, lifting Her upon Your radiant tusks and vanquishing evil.",
                  metadata: { yuga: "Satya Yuga", antagonist: "Hiranyaksha", source: "Taittiriya Brahmana / Bhagavata Purana 3.13" },
                },
              },
              {
                id: "avatar-4-narasimha",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 4", hi: "चतुर्थ अवतार" },
                title: { en: "04. Narasimha Avatara: The Divine Man-Lion (Protection of Prahlada)", hi: "०४. नृसिंह अवतार: हिरण्यकशिपु वध एवं भक्त प्रह्लाद रक्षा" },
                shortTitle: { en: "04. Narasimha", hi: "०४. नृसिंह" },
                sanskrit: "तव करकमलवरे नखमद्भुतशृङ्गम्",
                badge: "Satya Yuga",
                content: {
                  sanskrit: "तव करकमलवरे नखमद्भुतशृङ्गं दलितदितिसुतभृङ्गम्।\nकेशव धृतानरहरिरूप जय जगदीश हरे॥",
                  transliteration: "tava karakamalavare nakhamadbhutaśṛṅgaṃ dalitaditisutabhṛṅgam |\nkeśava dhṛtanaraharirūpa jaya jagadīśa hare ||",
                  meaningHi: "स्तंभ से प्रकट होकर अपने अद्भुत तीक्ष्ण नखों से आपने अत्याचारी दैत्य हिरण्यकशिपु का वध किया और अपने अनन्य बाल-भक्त प्रह्लाद के प्राणों की रक्षा की।",
                  meaningEn: "Bursting forth from the stone pillar to vindicate the faith of Your child-devotee Prahlada, You took the form of the half-man, half-lion Narasimha, vanquishing tyrant Hiranyakashipu.",
                  metadata: { yuga: "Satya Yuga", devotee: "Bhakta Prahlada", antagonist: "Hiranyakashipu", source: "Bhagavata Purana 7.8" },
                },
              },
              {
                id: "avatar-5-vamana",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 5", hi: "पञ्चम अवतार" },
                title: { en: "05. Vamana Avatara: The Divine Dwarf / Trivikrama (Restoring Cosmic Order)", hi: "०५. वामन अवतार: त्रिविक्रम स्वरूप एवं राजा बलि उद्धार" },
                shortTitle: { en: "05. Vamana", hi: "०५. वामन" },
                sanskrit: "छलयसि विक्रमण बलमद्भुतवामन",
                badge: "Treta Yuga",
                content: {
                  sanskrit: "छलयसि विक्रपणे बलिमद्भुतवामन पदनखनीरजनितजनपावन।\nकेशव धृतवामनरूप जय जगदीश हरे॥",
                  transliteration: "chalayasi vikramaṇe balimadbhutavāmana padanakhanīrajanitajanapāvana |\nkeśava dhṛtavāmanarūpa jaya jagadīśa hare ||",
                  meaningHi: "वामन बटुक बनकर आपने राजा बलि से तीन पग भूमि माँगी और त्रिविक्रम विराट् रूप धरकर दो पगों में त्रिलोकी को नाप लिया। तीसरे पग में बलि को पाताल का निष्कंटक राज्य और मोक्ष प्रदान किया।",
                  meaningEn: "Appearing as a radiant young dwarf sage, You asked King Bali for three paces of land, then expanded into the cosmic Trivikrama form, measuring earth and heaven in two strides and blessing Bali with devotion.",
                  metadata: { yuga: "Treta Yuga", character: "King Mahabali & Sage Shukracharya", source: "Rigveda 1.154 (Vishnu Sukta) / Bhagavata 8.18" },
                },
              },
              {
                id: "avatar-6-parashurama",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 6", hi: "षष्ठ अवतार" },
                title: { en: "06. Parashurama Avatara: The Warrior Sage (Chastiser of Tyrants)", hi: "०६. परशुराम अवतार: क्षत्रिय दर्प दलन एवं धर्म प्रतिष्ठा" },
                shortTitle: { en: "06. Parashurama", hi: "०६. परशुराम" },
                sanskrit: "क्षत्रियरुधिरमये जगदपगतपापम्",
                badge: "Treta Yuga",
                content: {
                  sanskrit: "क्षत्रियरुधिरमये जगदपगतपापं स्नपयसि पयसि शमितभवतापम्।\nकेशव धृतभृगुपतिरूप जय जगदीश हरे॥",
                  transliteration: "kṣatriyarudhiramaye jagadapagatapāpaṃ snapayasi payasi śamitabhavatāpam |\nkeśava dhṛtabhṛgupatirūpa jaya jagadīśa hare ||",
                  meaningHi: "महर्षि जमदग्नि के सुपुत्र भार्गव परशुराम बनकर आपने परशु (कुल्हाड़ी) धारण किया और धर्म से विमुख होकर प्रजा पर अत्याचार करने वाले सहस्त्रार्जुन आदि निरंकुश राजाओं का दमन कर पृथ्वी को पापरहित किया।",
                  meaningEn: "Born as the warrior-sage son of Jamadagni, You wielded the battle-axe to vanquish Kartavirya Arjuna and 21 generations of corrupt despots, restoring righteousness and donating the earth to Sage Kashyapa.",
                  metadata: { yuga: "Treta Yuga", weapon: "Parashu (Divine Axe)", source: "Mahabharata Vana Parva / Bhagavata Purana 9.15" },
                },
              },
              {
                id: "avatar-7-rama",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 7", hi: "सप्तम अवतार" },
                title: { en: "07. Sri Rama: Maryada Purushottama (The Ideal King & Slaying of Ravana)", hi: "०७. मर्यादा पुरुषोत्तम श्रीराम: रावण वध एवं रामराज्य" },
                shortTitle: { en: "07. Rama", hi: "०७. श्रीराम" },
                sanskrit: "वितरसि दिक्षु रणे दिकपतिकमनीयम्",
                badge: "Treta Yuga",
                content: {
                  sanskrit: "वितरसि दिक्षु रणे दिक्पतिकमनीयं दशमुखमौलिबलिं रमणीयम्।\nकेशव धृतरामशरीर जय जगदीश हरे॥",
                  transliteration: "vitarasi dikṣu raṇe dikpatikamanīyaṃ daśamukhamaulibaliṃ ramaṇīyam |\nkeśava dhṛtarāmaśarīra jaya jagadīśa hare ||",
                  meaningHi: "अयोध्या के सूर्यवंशी महाराज दशरथ के पुत्र के रूप में अवतरित होकर आपने मर्यादा, सत्य और पितृभक्ति का आदर्श स्थापित किया। लंकापति रावण का संहार कर समस्त लोकों में धर्म का राज्य स्थापित किया।",
                  meaningEn: "Embodying perfect virtue, filial duty, and cosmic righteousness as Maryada Purushottama, You built the ocean bridge, vanquished the ten-headed demon king Ravana, and established Ramarajya.",
                  metadata: { yuga: "Treta Yuga", scripture: "Valmiki Ramayana", consort: "Mata Sita", adversary: "Ravana" },
                },
              },
              {
                id: "avatar-8-krishna",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 8", hi: "अष्टम अवतार" },
                title: { en: "08. Sri Krishna: Leela Purushottama (Cosmic Philosopher of Bhagavad Gita)", hi: "०८. लीला पुरुषोत्तम श्रीकृष्ण: गीता ज्ञान एवं धर्म संस्थापना" },
                shortTitle: { en: "08. Krishna", hi: "०८. श्रीकृष्ण" },
                sanskrit: "वहसि वपुषि विशदे वसनं जलदाभम्",
                badge: "Dvapara Yuga",
                content: {
                  sanskrit: "वहसि वपुषि विशदे वसनं जलदाभं हलहतिभीतिमिलितयमुनाभम्।\nकेशव धृतहलधररूप / कृष्णरूप जय जगदीश हरे॥",
                  transliteration: "vahasi vapuṣi viśade vasanaṃ jaladābhaṃ halahatibhītimilitayamunābham |\nkeśava dhṛtakṛṣṇarūpa jaya jagadīśa hare ||",
                  meaningHi: "सम्पूर्ण कलाओं से परिपूर्ण भगवान श्रीकृष्ण ने द्वापर युग में दुष्ट कंस और कौरवों का संहार कराया तथा कुरुक्षेत्र के रणक्षेत्र में संपूर्ण मानव जाति के कल्याण हेतु श्रीमद्भगवद्गीता का अमर संदेश दिया।",
                  meaningEn: "The Purna Avatara (Complete Incarnation) who captivated hearts with divine love in Vrindavan, liberated the virtuous, and expounded the eternal philosophy of life—the Bhagavad Gita—to Arjuna on Kurukshetra.",
                  metadata: { yuga: "Dvapara Yuga", teachings: "Srimad Bhagavad Gita (18 Chapters)", abode: "Dvaraka / Goloka" },
                },
              },
              {
                id: "avatar-9-buddha",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 9", hi: "नवम अवतार" },
                title: { en: "09. Gautama Buddha: The Awakened Master (Compassion & Ahimsa)", hi: "०९. गौतम बुद्ध: करुणा, अहिंसा एवं अष्टांगिक मार्ग" },
                shortTitle: { en: "09. Buddha", hi: "०९. बुद्ध" },
                sanskrit: "निन्दसि यज्ञविधेरहह श्रुतिजातम्",
                badge: "Kali Yuga",
                content: {
                  sanskrit: "निन्दसि यज्ञविधेरहह श्रुतिजातं सदयहृदय दर्शितपशुघातम्।\nकेशव धृतबुद्धशरीर जय जगदीश हरे॥",
                  transliteration: "nindasi yajñavidherahaha śrutijātaṃ sadayahṛdaya darśitapaśughātam |\nkeśava dhṛtabuddhaśarīra jaya jagadīśa hare ||",
                  meaningHi: "हृदय में अपार करुणा धारण कर आपने निरपराध पशुओं की हिंसा पर रोक लगाने हेतु अहिंसा, करुणा और अष्टांगिक मार्ग का उपदेश देकर समस्त जीवों के प्रति दया का संचार किया।",
                  meaningEn: "Moved by supreme compassion for living beings, You descended as the Enlightened Buddha to preach absolute Ahimsa (non-violence), ethical self-restraint, and the cessation of suffering through the Eightfold Noble Path.",
                  metadata: { yuga: "Kali Yuga", message: "Ahimsa Paramo Dharmah & Karuna", source: "Jayadeva Gita Govinda 9 / Agni Purana" },
                },
              },
              {
                id: "avatar-10-kalki",
                parentId: "dashavatara-tattva",
                type: "leaf",
                levelLabel: { en: "Avatar 10", hi: "दशम अवतार" },
                title: { en: "10. Kalki Avatara: The Prophesied Restorer of Satya Yuga", hi: "१०. कल्कि अवतार: कलियुग अंत में अधर्म संहारक भावी अवतार" },
                shortTitle: { en: "10. Kalki", hi: "१०. कल्कि" },
                sanskrit: "म्लेच्छनिवहनिधने कलयसि करवालम्",
                badge: "Kali Yuga End",
                content: {
                  sanskrit: "म्लेच्छनिवहनिधने कलयसि करवालं धूमकेतुमिव किमपि करालम्।\nकेशव धृतकल्किशरीर जय जगदीश हरे॥",
                  transliteration: "mlecchanivahanidhane kalayasi karavālaṃ dhūmaketumiva kimapi karālam |\nkeśava dhṛtakalkiśarīra jaya jagadīśa hare ||",
                  meaningHi: "कलियुग के चरम पर जब अधर्म अपनी पराकाष्ठा पर होगा, तब शम्भल ग्राम में विष्णुयशा के घर अवतरित होकर आप देवदत्त नामक श्वेत अश्व पर हाथ में चमकती खड्ग लेकर अधर्म का पूर्ण संहार करेंगे और पुनः सत्ययुग की स्थापना करेंगे।",
                  meaningEn: "Prophesied to appear at the twilight of Kali Yuga in the village of Shambhala, Lord Kalki will mount the white steed Devadatta, wielding a blazing sword like a comet to vanquish corruption and inaugurate the Golden Age (Satya Yuga).",
                  metadata: { yuga: "End of Kali Yuga -> Inception of Satya Yuga", steed: "Devadatta (White Horse)", sword: "Ratnamaru", source: "Kalki Purana / Bhagavata 12.2" },
                },
              },
            ],
          },

          // 4. Smarta Panchayatana Devas
          {
            id: "panchayatana-deva",
            parentId: "devata-avatara-tattva",
            type: "division",
            levelLabel: { en: "Smarta Tradition", hi: "पंचायतन परंपरा" },
            title: { en: "Smarta Panchayatana: The Five Primary Deities", hi: "स्मार्त पंचायतन: पाँच प्रमुख सनातन देवता" },
            shortTitle: { en: "Panchayatana", hi: "पंचायतन" },
            sanskrit: "पंचायतन देव स्वरूपम्",
            badge: "5 Deities of Advaita",
            tagline: {
              en: "Vishnu, Shiva, Devi (Shakti), Ganesha, and Surya (Sun)",
              hi: "विष्णु, शिव, देवी (अम्बिका), गणेश, एवं सूर्यदेव",
            },
            cardImage: pujaGaneshCardImg,
            children: [
              {
                id: "panchayatana-vidhi",
                parentId: "panchayatana-deva",
                type: "leaf",
                levelLabel: { en: "Tradition", hi: "परंपरा" },
                title: { en: "Panchayatana System: Aditya, Ambika, Vishnu, Ganesha, Shiva", hi: "पंचायतन पद्धति: एक परब्रह्म के पाँच दिव्य रूप" },
                shortTitle: { en: "5 Deities System", hi: "५ देवता विधान" },
                sanskrit: "आदित्यमम्बिकां विष्णुं गणनाथं महेश्वरम्",
                content: {
                  sanskrit: "आदित्यमम्बिकां विष्णुं गणनाथं महेश्वरम्।\nपञ्चयज्ञपरो नित्यं कुर्यात्पापप्रणाशनम्॥",
                  transliteration: "ādityamambikāṃ viṣṇuṃ gaṇanāthaṃ maheśvaram |\npañcayajñaparo nityaṃ kuryātpāpapraṇāśanam ||",
                  meaningHi: "जगद्गुरु आदि शंकराचार्य द्वारा स्थापित स्मार्त पंचायतन में पाँच मुख्य देव स्वरूपों—सूर्य (प्राण/तेज), अम्बिका (शक्ति/प्रकृति), विष्णु (पालन/चेतना), गणेश (बुद्धि/विघ्नहर्ता), और शिव (कल्याण/मुक्ति)—की एक साथ पूजा की जाती है। यह प्रणाली सिखाती है कि विभिन्न संप्रदाय वास्तव में एक ही सच्चिदानन्द परब्रह्म के विभिन्न रूप हैं।",
                  meaningEn: "Formulated by Jagadguru Adi Shankaracharya to unite various Hindu traditions into an Advaitic harmony, Panchayatana worship involves the simultaneous reverence of five divine forms: Surya (vital energy), Ambika (nature/power), Vishnu (consciousness/preserver), Ganesha (intellect/remover of obstacles), and Shiva (liberation/pure awareness).",
                  metadata: {
                    founder: "Adi Shankaracharya (स्मार्त मत)",
                    ishtaArrangement: "Whichever deity is the devotee's Ishta-Deva is placed in the center, flanked harmoniously by the other four deities.",
                    source: "Smarta Agama Shastras / Prapanchasara Tantra",
                  },
                },
              },
            ],
          },

          // 5. The 33 Koti (Types) Vedic Devas
          {
            id: "vaidika-33-deva",
            parentId: "devata-avatara-tattva",
            type: "division",
            levelLabel: { en: "Vedic Pantheon", hi: "वैदिक देवगण" },
            title: { en: "The 33 Koti (Types) Vedic Devas", hi: "३३ कोटि (प्रकार) वैदिक देवता" },
            shortTitle: { en: "33 Vedic Devas", hi: "३३ देवता" },
            sanskrit: "त्रयस्त्रिंशत् देवाः (शतपथ ब्राह्मण एवं उपनिषद्)",
            badge: "8 Vasus, 11 Rudras, 12 Adityas",
            tagline: {
              en: "8 Vasus (Elements), 11 Rudras (Pranas), 12 Adityas (Solar Months), Indra & Prajapati",
              hi: "८ वसु (प्रकृति तत्त्व), ११ रुद्र (प्राण), १२ आदित्य (सौर मास), १ इन्द्र एवं १ प्रजापति",
            },
            cardImage: pujaNavagrahaCardImg,
            children: [
              {
                id: "vaidika-33-breakdown",
                parentId: "vaidika-33-deva",
                type: "leaf",
                levelLabel: { en: "Canonical Revelation", hi: "उपनिषद् प्रमाण" },
                title: { en: "Yajnavalkya's Exposition on 33 Types of Devas (Brihadaranyaka 3.9)", hi: "महर्षि याज्ञवल्क्य कृत ३३ देव शक्तियों का रहस्य (बृहदारण्यक ३.९)" },
                shortTitle: { en: "33 Devas Exposition", hi: "३३ देव रहस्य" },
                sanskrit: "कतमै ते त्रयस्त्रिंशदिति",
                content: {
                  sanskrit: "स होवाच महिमान एवैषामेते त्रयस्त्रिंशत्त्वेव देवा इति।\nकतमै ते त्रयस्त्रिंशदित्यष्टौ वसव एकादश रुद्रा द्वादशादित्यास्त एकत्रिंशदिन्द्रश्चैव प्रजापतिश्च त्रयस्त्रिंशाविति॥",
                  transliteration: "sa hovāca mahimāna evaiṣāmete trayastriṃśattveva devā iti |\nkatamai te trayastriṃśadityaṣṭau vasava ekādaśa rudrā dvādaśādityāsta ekatriṃśadindraścaiva prajāpatiśca trayastriṃśāviti ||",
                  meaningHi: "महर्षि याज्ञवल्क्य ने शाकल्य को समझाया कि 'कोटि' शब्द का अर्थ करोड़ नहीं, अपितु 'प्रकार / श्रेणी' (Types/Categories) है। मूलतः केवल ३३ प्रकार के ही देव हैं:\n१. ८ वसु: अग्नि, पृथ्वी, वायु, अन्तरिक्ष, आदित्य (सूर्य), द्यौ (आकाश), चन्द्रमा और नक्षत्र (प्रकृति के आठ आधार)।\n२. ११ रुद्र: शरीर के १० प्राण (प्राण, अपान आदि) तथा ११वाँ मन/जीवात्मा।\n३. १२ आदित्य: संवत्सर (वर्ष) के १२ महीने जो आयु का हरण करते हुए कालचक्र चलाते हैं।\n४. १ इन्द्र: विद्युत्, वज्र एवं अपार प्राणशक्ति।\n५. १ प्रजापति: यज्ञ, समर्पण एवं सृष्टि की निरंतरता।\nबाकी सभी रूप इन्हीं ३३ मूल शक्तियों की महिमा के विस्तार हैं।",
                  meaningEn: "In the Brihadaranyaka Upanishad, Sage Yajnavalkya clarifies that 'Koti' means 'classes' or 'types', not 330 million. The primordial 33 deities governing the cosmos are:\n1. 8 Vasus: Fire, Earth, Air, Atmosphere, Sun, Sky, Moon, and Stars (the physical realm of dwelling).\n2. 11 Rudras: The 10 vital pranas in the human body plus the 11th, the Mind/Atman.\n3. 12 Adityas: The 12 months of the solar year governing time and evolution.\n4. 1 Indra: The lightning and cosmic kinetic power.\n5. 1 Prajapati: The principle of sacred sacrifice and continuous creation.\nAll other deities are manifestations of the One Brahman acting through these 33 cosmic forces.",
                  metadata: {
                    source: "Brihadaranyaka Upanishad 3.9.1–2 / Shatapatha Brahmana 14.6.9",
                    speaker: "Maharshi Yajnavalkya (महर्षि याज्ञवल्क्य)",
                    listener: "Vidagdha Shakalya (विदग्ध शाकल्य)",
                    clarification: "Koti (कोटि) in Sanskrit Shastras signifies category, class, or peak—not numerical crore.",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 04. DHARMA & JEEVAN
  // ===========================================================================
  {
    id: "dharma-jeevan",
    number: "04",
    type: "category",
    levelLabel: { en: "Knowledge Area", hi: "ज्ञान क्षेत्र" },
    title: { en: "04. Dharma & Jeevan", hi: "०४. धर्म एवं जीवन" },
    shortTitle: { en: "Dharma & Jeevan", hi: "धर्म एवं जीवन" },
    sanskrit: "धर्म, आचार एवं जीवन पद्धति",
    tagline: {
      en: "Dharma, Ashrama, Varna, 16 Samskaras & Daily Nitya Karma",
      hi: "चार पुरुषार्थ, चार आश्रम, १६ संस्कार एवं नित्य आचार संहिता",
    },
    cardImage: samskaraCardImg,
    bannerImage: bannerSamagri,
    image: samskaraCardImg,
    badge: "16 Samskaras",
    desc: {
      en: "The holistic science of righteous living, stage-of-life transitions (Ashrama), sacred rites of passage (16 Samskaras), and noble conduct (Sadachara).",
      hi: "जीवन को सुसंस्कृत एवं पवित्र बनाने हेतु गर्भाधान से अन्त्येष्टि तक के १६ संस्कार, चार आश्रम और नित्य कर्तव्य।",
    },
    children: [
      {
        id: "shodasha-samskara",
        parentId: "dharma-jeevan",
        type: "discipline",
        levelLabel: { en: "Sacred Rites", hi: "संस्कार परंपरा" },
        title: { en: "The 16 Traditional Samskaras (षोडश संस्कार)", hi: "सोलह संस्कार (षोडश संस्कार)" },
        shortTitle: { en: "16 Samskaras", hi: "१६ संस्कार" },
        sanskrit: "षोडश संस्काराः",
        tagline: {
          en: "Sacred transformative milestones from conception to final departure",
          hi: "गर्भाधान से लेकर अन्त्येष्टि तक मनुष्य जीवन के १६ पवित्र संस्कार",
        },
        cardImage: samskaraCardImg,
        bannerImage: bannerSamagri,
        image: samskaraCardImg,
        badge: "16 Rites",
        desc: {
          en: "The sixteen Vedic purification and consecration rites intended to elevate human consciousness at each biological and spiritual juncture of life.",
          hi: "सनातन परंपरा में व्यक्ति के आत्मिक, मानसिक व शारीरिक शोधन हेतु निर्दिष्ट सोलह अनिवार्य संस्कार।",
        },
        childLevelName: { en: "Samskara", hi: "संस्कार" },
        children: [
          {
            id: "samskara-1-garbhadhana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 01", hi: "संस्कार ०१" },
            title: { en: "01. Garbhadhana (Conception & Invocation of Soul)", hi: "०१. गर्भाधान संस्कार: पवित्र आत्मा का आह्वान" },
            shortTitle: { en: "01. Garbhadhana", hi: "०१. गर्भाधान" },
            sanskrit: "गर्भाधान संस्कारः",
            badge: "Samskara 01",
            content: {
              overview: "The primary Vedic ritual performed by husband and wife with sacred prayers to invite a noble, spiritually elevated soul into the mother's womb.",
              significance: "Transforms biological procreation into a sacred spiritual undertaking aligned with cosmic Dharma and divine evolution.",
              procedure: [
                "Purification & Sankalpa by both partners",
                "Invocation of Prajapati, Vishnu, and Savitr for divine protection",
                "Recitation of the Vedic Garbha Raksha Mantras",
                "Seeking blessings of elders and ancestors",
              ],
              materials: ["Cow Ghee", "Sacred Kumkum & Akshat", "Ganga Jal", "Kusha Grass", "Havan Samagri"],
              mantra: "ॐ विष्णुर्योनिं कल्पयतु त्वष्टा रूपाणि पिंशतु। आ सिञ्चतु प्रजापतिर्धाता गर्भं दधातु ते॥",
              source: "Rigveda 10.184.1 / Ashvalayana Grihya Sutra 1.13",
            },
          },
          {
            id: "samskara-2-pumsavana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 02", hi: "संस्कार ०२" },
            title: { en: "02. Pumsavana (Fetus Health & Divine Vitality)", hi: "०२. पुंसवन संस्कार: गर्भ-स्थिरता एवं प्राण-पुष्टि" },
            shortTitle: { en: "02. Pumsavana", hi: "०२. पुंसवन" },
            sanskrit: "पुंसवन संस्कारः",
            badge: "Samskara 02",
            content: {
              overview: "Performed in the third month of pregnancy to strengthen the developing fetus, invoke divine physical vigor, and protect the expectant mother.",
              significance: "Ensures the child receives noble vitality, strong sensory faculties, and wholesome biological constitution through consecrated herbal oblations.",
              procedure: [
                "Morning ritual when the moon is in a masculine constellation (Pushya)",
                "Administration of sacred banyan sprout essence (Vata-ankura) through the right nostril",
                "Prayers to Agni and Soma for healthy gestation",
              ],
              materials: ["Fresh Vata Shringa (Banyan shoot)", "Curd", "Kusha Grass", "Pure Ghee"],
              mantra: "ॐ पुमानग्निः पुमानिन्द्रः पुमान् देवो बृहस्पतिः। पुमांसं पुत्रं विन्दस्व तं पुमाननु जायताम्॥",
              source: "Samaveda Mantra Brahmana 1.4 / Paraskara Grihya Sutra 1.14",
            },
          },
          {
            id: "samskara-3-simantonnayana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 03", hi: "संस्कार ०३" },
            title: { en: "03. Simantonnayana (Parting of Hair & Maternal Serenity)", hi: "०३. सीमन्तोन्नयन संस्कार: मातृ-चित्त प्रसन्नता एवं शुद्धि" },
            shortTitle: { en: "03. Simantonnayana", hi: "०३. सीमन्तोन्नयन" },
            sanskrit: "सीमन्तोन्नयन संस्कारः",
            badge: "Samskara 03",
            content: {
              overview: "Conducted in the fourth, sixth, or eighth month of pregnancy, where the husband gently parts the wife's hair upward with sacred quills and barley grains to bestow mental joy.",
              significance: "Protects the mother from psychological distress, ensuring an uplifting, aesthetic, and tranquil environment that directly shapes the unborn baby's mind.",
              procedure: [
                "Husband gently parts the pregnant wife's hair upwards three times",
                "Use of a porcupine quill (Shalali) and three clusters of Udumbara fruit",
                "Singing of auspicious Veena melodies and joyful hymns by matrons",
              ],
              materials: ["Porcupine quill", "Udumbara fruit", "Barley sprouts", "Silk garment", "Veena music"],
              mantra: "ॐ येनादितेः सीमानं नयति प्रजापतिर्महते सौभगाय। तेनाहं सीमानं नयामि प्रजामस्यै जरां नयतु॥",
              source: "Ashvalayana Grihya Sutra 1.14 / Paraskara Grihya Sutra 1.15",
            },
          },
          {
            id: "samskara-4-jatakarma",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 04", hi: "संस्कार ०४" },
            title: { en: "04. Jatakarma (Childbirth Consecration & Medha Blessing)", hi: "०४. जातकर्म संस्कार: जन्मोत्सव, मेधा एवं दीर्घायु आशीष" },
            shortTitle: { en: "04. Jatakarma", hi: "०४. जातकर्म" },
            sanskrit: "जातकर्म संस्कारः",
            badge: "Samskara 04",
            content: {
              overview: "Celebrated immediately upon the birth of the child before the umbilical cord is severed, welcoming the new soul with prayers for intellectual brilliance (Medha) and longevity.",
              significance: "Awakens the child's digestive and nervous systems while bestowing spiritual wisdom (Ayushya and Medha Janana).",
              procedure: [
                "Father whispers the sacred Om into the newborn's right ear",
                "Touching the child's tongue with a gold rod dipped in pure ghee and honey",
                "Prayers to Savitr, Saraswati, and the Ashvins for supreme intellect",
              ],
              materials: ["Pure Cow Ghee", "Wild Honey", "Clean Gold Probe / Coin", "Kusha water"],
              mantra: "ॐ मेधां ते देवः सविता मेधां देवी सरस्वती। मेधां ते अश्विनौ देवावाधत्तां पुष्करस्रजौ॥",
              source: "Ashvalayana Grihya Sutra 1.15 / Brihadaranyaka Upanishad 6.4.24",
            },
          },
          {
            id: "samskara-5-namakarana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 05", hi: "संस्कार ०५" },
            title: { en: "05. Namakarana (Sacred Naming Ceremony)", hi: "०५. नामकरण संस्कार: नक्षत्र, कुल एवं वैदिक नामकरण" },
            shortTitle: { en: "05. Namakarana", hi: "०५. नामकरण" },
            sanskrit: "नामकरण संस्कारः",
            badge: "Samskara 05",
            content: {
              overview: "Performed on the tenth, eleventh, or twelfth day after birth, giving the infant their formal Vedic, Nakshatra, and family names.",
              significance: "A person's name carries vibrational power (Sabda Brahman) that shapes their self-identity, destiny, and spiritual resonance throughout life.",
              procedure: [
                "Purifying Punyahavachana and Matrika Puja after the postpartum period",
                "Calculating the birth star (Nakshatra) and selecting the four canonical names",
                "Father gently whispers the chosen name into the child's right ear",
                "Grandparents and assembled elders bless the child by calling the new name",
              ],
              materials: ["Bronze plate filled with uncooked rice", "Honey", "New silk baby garments", "Betel nuts"],
              mantra: "ॐ अङ्गादङ्गात्संभवसि हृदयादभिजायसे। आत्मा वै पुत्रनामासि स जीव शरदः शतम्॥",
              source: "Paraskara Grihya Sutra 1.17 / Manusmriti 2.30",
            },
          },
          {
            id: "samskara-6-nishkramana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 06", hi: "संस्कार ०६" },
            title: { en: "06. Nishkramana (First Outing to Sun & Cosmos)", hi: "०६. निष्क्रमण संस्कार: सूर्य एवं चन्द्रमा का प्रथम दर्शन" },
            shortTitle: { en: "06. Nishkramana", hi: "०६. निष्क्रमण" },
            sanskrit: "निष्क्रमण संस्कारः",
            badge: "Samskara 06",
            content: {
              overview: "Conducted in the fourth month of life, marking the child's very first conscious venture outside the home into the vast universe of nature.",
              significance: "Connects the child to the cosmic elements—Surya (Vital Energy), Chandra (Mind/Coolness), and the open sky—fostering curiosity and cosmic reverence.",
              procedure: [
                "Child is bathed and adorned in clean fresh clothes",
                "Carried outside into the morning sunlight facing the rising Sun",
                "Prayers offered to Surya Devata for sharp sight and immune vitality",
                "At night, the infant is gently shown the peaceful crescent Moon",
              ],
              materials: ["Conch water", "Fresh flowers", "Sunlight / Moonlight"],
              mantra: "ॐ तच्चक्षुर्देवहितं पुरस्ताच्छुक्रमुच्चरत्। पश्येम शरदः शतं जीवेम शरदः शतम्॥",
              source: "Rigveda 7.66.16 / Paraskara Grihya Sutra 1.17.5",
            },
          },
          {
            id: "samskara-7-annaprashana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 07", hi: "संस्कार ०७" },
            title: { en: "07. Annaprashana (First Sacred Solid Food & Grains)", hi: "०७. अन्नप्राशन संस्कार: प्रथम अन्न-सेवन एवं देह-पोषण" },
            shortTitle: { en: "07. Annaprashana", hi: "०७. अन्नप्राशन" },
            sanskrit: "अन्नप्राशन संस्कारः",
            badge: "Samskara 07",
            content: {
              overview: "Celebrated in the sixth month when the child's first teeth emerge, marking the transition from mother's milk to consecrated solid grains.",
              significance: "Honors Anna (Food as Brahman—'Annam Brahma'). Consecrates the digestive fire (Jatharagni) so nutrition translates into intellect, strength, and longevity.",
              procedure: [
                "Cooking of sacred Payasam / Kheer (sweet rice cooked in cow milk and ghee)",
                "Offering oblations to Agni Devata and Annapurna Devi",
                "Father or maternal uncle feeds the baby three golden spoonfuls of Kheer",
                "Testing the child's inclinations by presenting books, tools, gold, and cloth",
              ],
              materials: ["Silver / Bronze spoon", "Pure rice payasam", "Ghee & Honey", "Turmeric & Akshat"],
              mantra: "ॐ अन्नपतेऽन्नस्य नो देह्यनमीवस्य शुष्मिणः। प्र प्र दातारं तारिष ऊर्जं नो धेहि द्विपदे चतुष्पदे॥",
              source: "Shukla Yajurveda 11.83 / Paraskara Grihya Sutra 1.19",
            },
          },
          {
            id: "samskara-8-chudakarana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 08", hi: "संस्कार ०८" },
            title: { en: "08. Chudakarana / Mundan (First Head Tonsure)", hi: "०८. चूड़ाकरण / मुण्डन संस्कार: शिखा स्थापन एवं मेधा वृद्धि" },
            shortTitle: { en: "08. Chudakarana", hi: "०८. चूड़ाकरण" },
            sanskrit: "चूड़ाकरण संस्कारः (मुण्डनम्)",
            badge: "Samskara 08",
            content: {
              overview: "Performed at the end of the first or third year, shaving the child's birth hair while keeping a sacred tuft (Shikha) at the crown (Brahmarandhra).",
              significance: "Sheds residual impurities from intrauterine life, cools and stimulates cranial nerves, and establishes the Shikha to protect spiritual energy.",
              procedure: [
                "Moistening the child's head with warm water and fresh butter/curd",
                "Prayers to Varuna and Agni for sharp intellect and protection",
                "Barber shaves the head leaving the sacred topknot (Shikha)",
                "Cooling sandalwood paste (Chandan) applied immediately to the scalp",
              ],
              materials: ["Silver razor / Clean blade", "Sandalwood paste", "Kusha grass", "Curd & Ghee"],
              mantra: "ॐ येनावपद्बृहस्पतिः सोमस्य वपुषे शिरः। तेन ते चूडां वपामि दीर्घायुत्वाय वर्चसे॥",
              source: "Ashvalayana Grihya Sutra 1.17 / Paraskara Grihya Sutra 2.1",
            },
          },
          {
            id: "samskara-9-karnavedha",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 09", hi: "संस्कार ०९" },
            title: { en: "09. Karnavedha (Ear Piercing for Acupressure & Health)", hi: "०९. कर्णवेध संस्कार: श्रवण शक्ति, मेधा एवं स्वास्थ्य रक्षण" },
            shortTitle: { en: "09. Karnavedha", hi: "०९. कर्णवेध" },
            sanskrit: "कर्णवेध संस्कारः",
            badge: "Samskara 09",
            content: {
              overview: "Conducted between the sixth month and fifth year, piercing the earlobes with gold or silver needles accompanied by Vedic prayers.",
              significance: "An ancient Ayurvedic neuro-acupuncture therapy that enhances auditory clarity, stimulates brain meridians, prevents hernias, and improves memory.",
              procedure: [
                "Child sits facing the auspicious East on the lap of maternal uncle or father",
                "Right ear pierced first for male children, left ear first for female children",
                "Application of soothing oil and insertion of smooth gold/silver wire",
              ],
              materials: ["Gold or silver needle", "Mustard / Sesame oil", "Turmeric antiseptic", "Akshat"],
              mantra: "ॐ भद्रं कर्णेभिः शृणुयाम देवा भद्रं पश्येमाक्षभिर्यजत्राः। स्थिरैरङ्गैस्तुष्टुवांसस्तनूभिर्व्यशेम देवहितं यदायूः॥",
              source: "Rigveda 1.89.8 / Sushruta Samhita Sharira Sthana 16.1",
            },
          },
          {
            id: "samskara-10-vidyarambha",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 10", hi: "संस्कार १०" },
            title: { en: "10. Vidyarambha / Aksharabhyasa (Learning the Alphabets)", hi: "१०. विद्यारम्भ संस्कार: ॐकार एवं वर्णमाला का प्रथम लेखन" },
            shortTitle: { en: "10. Vidyarambha", hi: "१०. विद्यारम्भ" },
            sanskrit: "विद्यारम्भ संस्कारः (अक्षराभ्यासः)",
            badge: "Samskara 10",
            content: {
              overview: "Celebrated around the fifth year on an auspicious day like Vijaya Dashami or Vasant Panchami, formally initiating the child into literacy, reading, and writing.",
              significance: "Honors Goddess Saraswati and Lord Ganesha; establishes deep reverence for the sacred Sanskrit alphabet (Matrikas) and the eternal cosmic syllable Om.",
              procedure: [
                "Invocation of Lord Ganesha, Devi Saraswati, and Guru",
                "Spreading yellow rice grains on a silver tray",
                "Guiding the child's index finger with a golden probe to write 'Harih Om' or 'Om Gam Ganapataye Namah'",
                "Presenting slate, books, and writing tools to the child",
              ],
              materials: ["Silver tray with raw rice grains", "Gold ring/probe", "Slate/Pustaka", "Yellow sweets"],
              mantra: "ॐ सरस्वत्यै नमो नित्यं भद्रकाल्यै नमो नमः। वेदवेदाङ्गवेदान्तविद्यास्थानेभ्य एव च॥",
              source: "Brihaspati Smriti / Samskara Mayukha",
            },
          },
          {
            id: "samskara-11-upanayana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 11", hi: "संस्कार ११" },
            title: { en: "11. Upanayana (Sacred Thread & Spiritual Initiation)", hi: "११. उपनयन / यज्ञोपवीत संस्कार: द्विजत्व एवं गायत्री दीक्षा" },
            shortTitle: { en: "11. Upanayana", hi: "११. उपनयन" },
            sanskrit: "उपनयन / यज्ञोपवीत संस्कारः",
            badge: "Samskara 11",
            content: {
              overview: "The second spiritual birth (Dvija), investing the student with the sacred triple thread (Yajnopavita) and initiating them into the Gayatri Mantra under the Guru's guidance.",
              significance: "Marks entry into Brahmacharya Ashrama (dedicated studenthood), awakening inner discriminative intellect and conferring duties to Devas, Rishis, and Pitrus.",
              procedure: [
                "Nandi Shraddha and Matrika Puja",
                "Head tonsure (Chuda) and purifying bath",
                "Investiture with the three-strand Yajnopavita representing debt to Devas, Rishis, and Pitrus",
                "Guru Mantra Upadesha (Gayatri Mantra initiation under sacred cloth)",
                "Bhikshacharanam (seeking first alms with modesty)",
              ],
              materials: ["Pure Cotton Yajnopavita", "Kusha Grass Ring", "Danda (Palash Staff)", "Mekhala (Sacred girdle)", "Yellow Cloth", "Ghee & Havan Kund"],
              mantra: "ॐ यज्ञोपवीतं परमं पवित्रं प्रजापतेर्यत्सहजं पुरस्तात्। आयुष्यमग्र्यं प्रतिमुञ्च शुभ्रं यज्ञोपवीतं बलमस्तु तेजः॥",
              source: "Paraskara Grihya Sutra 2.2 / Manusmriti 2.36",
            },
          },
          {
            id: "samskara-12-vedarambha",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 12", hi: "संस्कार १२" },
            title: { en: "12. Vedarambha (Commencement of Formal Vedic Study)", hi: "१२. वेदारम्भ संस्कार: चारों वेदों एवं वेदांगों का विधिवत् अध्ययन" },
            shortTitle: { en: "12. Vedarambha", hi: "१२. वेदारम्भ" },
            sanskrit: "वेदारम्भ संस्कारः",
            badge: "Samskara 12",
            content: {
              overview: "Following Upanayana, this rite marks the student's formal recitation and memorization of the Samhitas and Vedangas in the Gurukula.",
              significance: "Instills the solemn discipline of preserving the unwritten shruti tradition with precise phonetics, meters, and philosophical contemplation.",
              procedure: [
                "Performance of the Brahmayajna and invocation of the Rishis of each Veda",
                "Recitation of the first Suktas of Rigveda, Yajurveda, Samaveda, and Atharvaveda",
                "Student takes the sacred vow of celibacy, truthfulness, and unwavering dedication to the Guru",
              ],
              materials: ["Samidha (sacred twigs)", "Ghee", "Kusha seats", "Vedic manuscripts"],
              mantra: "ॐ ऋतं वदिष्यामि। सत्यं वदिष्यामि। तन्मामवतु। तद्वक्तारमवतु। अवतु माम्। अवतु वक्तारम्॥",
              source: "Taittiriya Upanishad 1.1 / Shankhayana Grihya Sutra 2.7",
            },
          },
          {
            id: "samskara-13-keshanta",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 13", hi: "संस्कार १३" },
            title: { en: "13. Keshanta / Godana (First Shaving of Beard at Age 16)", hi: "१३. केशान्त / गोदान संस्कार: युवावस्था पदार्पण एवं गोदान" },
            shortTitle: { en: "13. Keshanta", hi: "१३. केशान्त" },
            sanskrit: "केशान्त / गोदान संस्कारः",
            badge: "Samskara 13",
            content: {
              overview: "Performed at age 16 when adolescence matures into adulthood, shaving the young man's first beard and offering a dairy cow (Godana) to the Acharya.",
              significance: "Renews vows of self-control, chastity, and righteous focus as physical maturation reaches adulthood.",
              procedure: [
                "Shaving of facial hair and cutting of hair with Vedic mantras identical to Chudakarana",
                "Student takes a vow of rigorous austerity for one year (Godana-vrata)",
                "Formal donation of a milch cow to the preceptor",
              ],
              materials: ["Razor", "Butter", "Cow for charity", "Guru Dakshina"],
              mantra: "ॐ यत्क्षुरेण मज्जयता सुपेशसा वप्ता वपसि केशान्। शुद्धेन ते शिरसा वर्चसे नः॥",
              source: "Paraskara Grihya Sutra 2.1 / Manusmriti 2.65",
            },
          },
          {
            id: "samskara-14-samavartana",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 14", hi: "संस्कार १४" },
            title: { en: "14. Samavartana (Graduation & Return from Gurukula)", hi: "१४. समावर्तन संस्कार: दीक्षांत, स्नातकोत्सव एवं गुरु की अंतिम सीख" },
            shortTitle: { en: "14. Samavartana", hi: "१४. समावर्तन" },
            sanskrit: "समावर्तन संस्कारः (स्नानम्)",
            badge: "Samskara 14",
            content: {
              overview: "The sacred convocation and graduation rite when the student completes their education, receives the preceptor's final ethical counsel, and returns home as a Snataka.",
              significance: "Equips the graduate to live as an upright, cultured citizen in society, enshrining the timeless moral principles of 'Satyam Vada, Dharmam Chara'.",
              procedure: [
                "Ceremonial bath with eight consecrated jars of fragrant water (Snana)",
                "Discarding student robes and donning fine clothes, garland, and shoes",
                "Guru's historic valedictory address: 'Speak the Truth, Walk in Righteousness, Revere Mother, Father, and Teacher as Divine'",
                "Offering final Guru Dakshina",
              ],
              materials: ["Fragrant waters", "Chandan", "Fine two-piece garment", "Umbrella and staff"],
              mantra: "ॐ सत्यं वद। धर्मं चर। स्वाध्यायान्मा प्रमदः। मातृदेवो भव। पितृदेवो भव। आचार्यदेवो भव॥",
              source: "Taittiriya Upanishad (Shiksha Valli 1.11) / Paraskara Grihya Sutra 2.6",
            },
          },
          {
            id: "samskara-15-vivaha",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 15", hi: "संस्कार १५" },
            title: { en: "15. Vivaha (Sacred Matrimony & Saptapadi)", hi: "१५. विवाह संस्कार: सप्तपदी एवं गृहस्थाश्रम प्रवेश" },
            shortTitle: { en: "15. Vivaha", hi: "१५. विवाह" },
            sanskrit: "विवाह संस्कारः (सप्तपदी)",
            badge: "Samskara 15",
            content: {
              overview: "The holy union of bride and groom before Agni Devata, embarking together on the noble path of Grihastha Ashrama to fulfill Dharma, Artha, Kama, and Moksha.",
              significance: "An indissoluble spiritual partnership where two lives merge into one sacred flame for mutual spiritual elevation, family welfare, and universal sacrifice.",
              procedure: [
                "Kanyadana (giving of the bride's hand with pure devotion)",
                "Panigrahana (holding of hands signifying eternal companionship)",
                "Laja Homa (offerings of puffed grain into the sacred flame)",
                "Saptapadi (Seven steps together taking seven sacred vows)",
                "Sindoor Dana & Mangalasutra Dharana",
                "Dhruva-Arundhati Darshana (gazing at the steadfast pole star and Arundhati)",
              ],
              materials: ["Sacred Fire Kund", "Ghee", "Puffed Rice (Laja)", "Turmeric, Akshat, Kumkum", "Silk Vastra", "Coconuts"],
              mantra: "ॐ सखा सप्तपदा भव सख्यं ते गमेयम्। सख्यं ते मा योषाः सख्यं ते मा योष्ठ्याः॥",
              source: "Rigveda 10.85 (Surya Vivaha Sukta) / Paraskara Grihya Sutra 1.4-8",
            },
          },
          {
            id: "samskara-16-antyeshti",
            parentId: "shodasha-samskara",
            type: "leaf",
            levelLabel: { en: "Samskara 16", hi: "संस्कार १६" },
            title: { en: "16. Antyeshti (Final Sacrificial Transition & Cremation)", hi: "१६. अन्त्येष्टि संस्कार: अन्तिम यज्ञ, पंचतत्त्व विलीनीकरण एवं सद्गति" },
            shortTitle: { en: "16. Antyeshti", hi: "१६. अन्त्येष्टि" },
            sanskrit: "अन्त्येष्टि संस्कारः (अन्तिम यज्ञः)",
            badge: "Samskara 16",
            content: {
              overview: "The sixteenth and final Vedic sacrifice where the mortal body is surrendered to consecrated Agni, dissolving into the five cosmic elements (Panchamahabhuta) while the immortal Atman journeys onward.",
              significance: "Concludes the soul's earthly journey with ultimate detachment, praying for peace in the ancestral realms (Pitru Loka) and ultimate Moksha.",
              procedure: [
                "Bathing the departed body with holy Ganga water and chanting Vedic hymns",
                "Placement on the pyre with sacred Kusha grass facing North",
                "Kapala Kriya and lighting of the sacred flame with Vedic oblations to Kravyada Agni",
                "Recitation of the Rigvedic burial/cremation hymns praying for the soul's ascent to light",
                "Subsequent Shraddha and Tarpana offerings of water and sesame for 10-13 days",
              ],
              materials: ["Ganga Jal", "Tulasi leaves", "Kusha grass", "Sesame seeds (Tila)", "Sandalwood & Camphor"],
              mantra: "ॐ सूर्याच्चक्षुर्गच्छतु वातमात्मा द्यां च गच्छ पृथिवीं च धर्मणा। अपो वा गच्छ यदि तत्र ते हितमोषधीषु प्रति तिष्ठा शरीरैः॥",
              source: "Rigveda 10.16.3 (Antyeshti Sukta) / Paraskara Grihya Sutra 3.10",
            },
          },
        ],
      },
      {
        id: "ashrama-dharma",
        parentId: "dharma-jeevan",
        type: "discipline",
        levelLabel: { en: "Four Stages", hi: "चार आश्रम" },
        title: { en: "Chaturashrama (The 4 Life Stages)", hi: "चतुराश्रम (जीवन के चार सोपान)" },
        shortTitle: { en: "Ashrama", hi: "आश्रम" },
        sanskrit: "चतुराश्रम व्यवस्था",
        tagline: { en: "Brahmacharya, Grihastha, Vanaprastha, Sannyasa", hi: "ब्रह्मचर्य, गृहस्थ, वानप्रस्थ, संन्यास" },
        badge: "4 Stages",
        desc: {
          en: "The balanced spiritual roadmap allocating 25 years to learning, 25 to family and career, 25 to contemplation, and final years to renunciation.",
          hi: "मनुष्य के १०० वर्ष के आदर्श जीवन को साधना, गृहस्थी, वानप्रस्थ और आत्म-साक्षात्कार में संतुलित करने की वैदिक व्यवस्था।",
        },
        children: [
          {
            id: "ashrama-stages",
            parentId: "ashrama-dharma",
            type: "section",
            levelLabel: { en: "System", hi: "व्यवस्था" },
            title: { en: "The Four Life Stages & Ten Universal Virtues of Dharma", hi: "चार आश्रम एवं धर्म के दस सार्वभौम लक्षण" },
            shortTitle: { en: "Dharma Lakshana", hi: "धर्म लक्षण" },
            sanskrit: "दशलक्षणको धर्मः",
            badge: "Manusmriti 6.92",
            children: [
              {
                id: "ashrama-dharma-10",
                parentId: "ashrama-stages",
                type: "leaf",
                levelLabel: { en: "Shloka", hi: "श्लोक" },
                title: { en: "Manusmriti 6.92 — The Ten Universal Attributes of Dharma", hi: "मनुस्मृति ६.९२ — धर्म के दस सार्वभौम लक्षण" },
                shortTitle: { en: "10 Attributes", hi: "१० लक्षण" },
                sanskrit: "मनुस्मृति ६.९२",
                content: {
                  sanskrit: "धृतिः क्षमा दमोऽस्तेयं शौचमिन्द्रियनिग्रहः।\nधीर्विद्या सत्यमक्रोधो दशकं धर्मलक्षणम्॥",
                  transliteration: "dhṛtiḥ kṣamā damo'steyaṃ śaucamindriyanigrahaḥ |\ndhīrvidyā satyamakrodho daśakaṃ dharmalakṣaṇam ||",
                  meaningHi: "धैर्य (धृति), क्षमा, मन पर नियंत्रण (दम), चोरी न करना (अस्तेय), पवित्रता (शौच), इन्द्रिय-निग्रह, सद्बुद्धि (धी), आत्मविद्या, सत्य और क्रोध न करना (अक्रोध)—ये धर्म के दस सार्वभौम लक्षण हैं।",
                  meaningEn: "Patience (Dhriti), forgiveness (Kshama), self-control (Dama), non-stealing (Asteya), purity (Shaucha), sense-restraint (Indriyanigraha), wisdom (Dhi), spiritual knowledge (Vidya), truthfulness (Satya), and freedom from anger (Akrodha) — these are the ten universal characteristics of Dharma.",
                  metadata: {
                    source: "Manusmriti 6.92",
                    subject: "The Ten Universal Marks of Righteous Living across all Ashramas",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 05. PUJA & ANUSHTHANA
  // ===========================================================================
  {
    id: "puja-anushthana",
    number: "05",
    type: "category",
    levelLabel: { en: "Knowledge Area", hi: "ज्ञान क्षेत्र" },
    title: { en: "05. Puja & Anushthana", hi: "०५. पूजा एवं अनुष्ठान" },
    shortTitle: { en: "Puja & Anushthana", hi: "पूजा एवं अनुष्ठान" },
    sanskrit: "पूजा, यज्ञ एवं अनुष्ठान",
    tagline: {
      en: "Shodashopachara Deva Puja, Sacred Fire Yagyas, Homa & Vedic Stotras",
      hi: "षोडशोपचार पूजा विधान, वैदिक महायज्ञ, हवन एवं महामंत्र",
    },
    cardImage: pujaGaneshCardImg,
    bannerImage: bannerYagyaHero,
    image: pujaGaneshCardImg,
    badge: "Sacred Rites",
    desc: {
      en: "The experiential practical rituals connecting human consciousness to divine cosmic realities through step-by-step offerings, fire altars, and resonant mantras.",
      hi: "ईश्वर की सगुण उपासना, वेदोक्त षोडशोपचार पूजा, अग्निहोत्र, महायज्ञ एवं सुरक्षा कवच मंत्रों का सजीव दिग्दर्शन।",
    },
    children: [
      {
        id: "puja-vidhi",
        parentId: "puja-anushthana",
        type: "discipline",
        levelLabel: { en: "Ritual Path", hi: "पूजा विधान" },
        title: { en: "Shodashopachara Deva Puja (16-Step Worship)", hi: "षोडशोपचार देव पूजा विधान" },
        shortTitle: { en: "Puja", hi: "पूजा" },
        sanskrit: "षोडशोपचार पूजा विधानम्",
        tagline: {
          en: "Preparation → Sankalpa → Dhyana → 16 Offerings → Arati → Visarjana",
          hi: "पवित्रीकरण → संकल्प → ध्यान → १६ उपचार अर्पण → आरती → विसर्जन",
        },
        cardImage: pujaCardImg,
        bannerImage: bannerAltar,
        image: pujaCardImg,
        badge: "16 Steps",
        desc: {
          en: "The traditional 16-step royal offering to the deity treating the divine as the most revered cosmic guest in one's heart and home.",
          hi: "ईश्वर को परम अतिथि मानकर श्रद्धा, प्रेम एवं वेदमंत्रों के साथ किए जाने वाले १६ उपचारों की संपूर्ण विधि।",
        },
        childLevelName: { en: "Step / Upachara", hi: "उपचार" },
        children: [
          {
            id: "puja-step-sankalpa",
            parentId: "puja-vidhi",
            type: "leaf",
            levelLabel: { en: "Step 2", hi: "चरण २" },
            title: { en: "Sankalpa (Solemn Vow of Time & Space)", hi: "संकल्प विधान (देश, काल एवं उद्देश्य)" },
            shortTitle: { en: "Sankalpa", hi: "संकल्प" },
            sanskrit: "संकल्प विधानम्",
            content: {
              overview: "The deliberate conscious positioning of oneself in cosmic time (Manvantara, Yuga, Samvatsara, Ritu, Masa, Tithi) and space (Jambudvipe, Bharatakhande) with name and gotra to declare the purpose of the worship.",
              significance: "Unifies mind, intention, and cosmic time into one focused laser of spiritual energy before commencing any sacred deed.",
              procedure: [
                "Take water, unbroken rice (Akshat), flower, and coin in right palm",
                "Cover with left palm and meditate on Lord Ganesha and Vishnu",
                "Recite the cosmic coordinate mantra including current Tithi and Gotra",
                "Release the water gently into the Arghya Patra",
              ],
              mantra: "ॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य श्रीब्रह्मणो द्वितीये परार्धे श्वेतवाराहकल्पे...",
              source: "Vedic Puja Paddhati / Karmakanda Samgraha",
            },
          },
          {
            id: "puja-step-upachara",
            parentId: "puja-vidhi",
            type: "leaf",
            levelLabel: { en: "Step 5", hi: "चरण ५" },
            title: { en: "The 16 Upachara Offerings (षोडशोपचार)", hi: "षोडशोपचार अर्पण (आसन से नैवेद्य तक)" },
            shortTitle: { en: "Upacharas", hi: "षोडशोपचार" },
            sanskrit: "षोडशोपचाराः",
            content: {
              overview: "The 16 loving services offered to the deity: Asana (seat), Padya (foot wash), Arghya (hand wash), Achamaniya (water to sip), Snana (holy bath/Panchamrita), Vastra (clothing), Yajnopavita (thread), Gandha (sandalwood), Pushpa (flowers), Dhupa (incense), Dipa (lamp), Naivedya (food offering), Tambula (betel leaf), Dakshina, Pradakshina (circumambulation), and Namaskara.",
              significance: "Converts worldly elements into sacred offerings, surrendering the five senses completely to the Divine.",
              materials: ["Panchamrita (Milk, Curd, Ghee, Honey, Sugar)", "Chandan", "Kumkum", "Akshat", "Seasonal Fruits & Sweets", "Camphor & Ghee Lamp"],
              mantra: "आसनं समर्पयामि, पाद्यं समर्पयामि, अर्घ्यं समर्पयामि, स्नानीयं समर्पयामि, वस्त्रं समर्पयामि...",
              source: "Agama Shastras / Skanda Purana",
            },
          },
        ],
      },
      {
        id: "yagya-homa",
        parentId: "puja-anushthana",
        type: "discipline",
        levelLabel: { en: "Fire Sacrifices", hi: "यज्ञ एवं हवन" },
        title: { en: "Vedic Yajna & Homa Traditions", hi: "वैदिक महायज्ञ एवं हवन परंपरा" },
        shortTitle: { en: "Yajna & Homa", hi: "यज्ञ एवं हवन" },
        sanskrit: "यज्ञ, होम एवं हविष्य विधान",
        tagline: { en: "Agnihotra, Ganapati Homa, Rudra Homa, Chandi Yagya", hi: "अग्निहोत्र, गणपति होम, महारुद्र एवं शतचण्डी यज्ञ" },
        cardImage: yagyaFireCardImg,
        bannerImage: bannerFireRitual,
        image: yagyaFireCardImg,
        badge: "Sacred Fire",
        desc: {
          en: "The primordial technology of the fire altar, offering herbal substances (Havi) into consecrated fire with Vedic mantras to sanctify the atmosphere, ecology, and subtle consciousness.",
          hi: "अग्नि देव के माध्यम से हविष्य को देवशक्तियों तक पहुँचाने वाला प्राचीन विज्ञान जो वातावरण, चित्त और पर्यावरण को शुद्ध करता है।",
        },
        children: [
          {
            id: "yagya-agnihotra",
            parentId: "yagya-homa",
            type: "section",
            levelLabel: { en: "Sacred Rite", hi: "नित्य यज्ञ" },
            title: { en: "Nitya Agnihotra (Daily Sunrise & Sunset Bio-Rhythm Fire Rite)", hi: "नित्य अग्निहोत्र (सूर्योदय एवं सूर्यास्त का पर्यावरण यज्ञ)" },
            shortTitle: { en: "Agnihotra", hi: "अग्निहोत्र" },
            sanskrit: "अग्निहोत्र होम विधानम्",
            badge: "Daily Agnihotra",
            children: [
              {
                id: "agnihotra-mantra-1",
                parentId: "yagya-agnihotra",
                type: "leaf",
                levelLabel: { en: "Mantra", hi: "मंत्र" },
                title: { en: "Agnihotra Morning Ahuti Mantra", hi: "प्रातःकालीन अग्निहोत्र आहुति मंत्र" },
                shortTitle: { en: "Morning Mantra", hi: "प्रातः मंत्र" },
                sanskrit: "अग्निहोत्र आहुति",
                content: {
                  sanskrit: "ॐ सूर्याय स्वाहा सूर्याय इदं न मम॥\nॐ प्रजापतये स्वाहा प्रजापतये इदं न मम॥",
                  transliteration: "oṃ sūryāya svāhā sūryāya idaṃ na mama ||\noṃ prajāpataye svāhā prajāpataye idaṃ na mama ||",
                  meaningHi: "यह पावन आहुति प्राणप्रदाता सूर्यदेव को समर्पित है, यह उनका है—मेरा नहीं। यह आहुति समस्त सृष्टि के रचयिता प्रजापति को समर्पित है, यह उनका है—मेरा नहीं। (पूर्ण त्याग व समर्पण भाव)",
                  meaningEn: "'To the luminous Sun this oblation is offered: this belongs to Surya, not to me! To Prajapati, Creator of all beings, this oblation is offered: this belongs to Prajapati, not to me!'",
                  metadata: {
                    source: "Yajurveda / Ashvalayana Shrauta Sutra",
                    materials: "Pure Cow Ghee, Brown Whole Rice (Akshat), Copper Pyramid Kund, Dried Cow Dung cakes",
                    significance: "Purifies atmosphere, releases therapeutic aerosols, and calms human brainwaves at dawn and dusk.",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: "stotra-mantra",
        parentId: "puja-anushthana",
        type: "discipline",
        levelLabel: { en: "Chants & Invocations", hi: "स्तोत्र एवं मंत्र" },
        title: { en: "Sacred Stotras, Kavachas & Mahamantras", hi: "दिव्य स्तोत्र, कवच एवं महामंत्र" },
        shortTitle: { en: "Stotra & Mantra", hi: "स्तोत्र व मंत्र" },
        sanskrit: "स्तोत्र, कवच एवं जप विधान",
        tagline: {
          en: "Mahamrityunjaya, Gayatri, Shiva Tandava, Vishnu Sahasranama",
          hi: "महामृत्युंजय, गायत्री, शिव ताण्डव, विष्णु सहस्रनाम आदि",
        },
        cardImage: samavedaCardImg,
        bannerImage: bannerAltar,
        image: samavedaCardImg,
        badge: "Maha Mantras",
        desc: {
          en: "Vibrationally potent Sanskrit hymns authored by great seers to awaken higher energies, inner peace, and divine protection.",
          hi: "ऋषि-प्रणीत वेदोक्त एवं पौराणिक महामंत्र जो आत्मा में दिव्य ऊर्जा, आरोग्य और निर्भयता का संचार करते हैं।",
        },
        children: [
          {
            id: "mahamrityunjaya-mantra",
            parentId: "stotra-mantra",
            type: "leaf",
            levelLabel: { en: "Mahamantra", hi: "महामंत्र" },
            title: { en: "Maha Mrityunjaya Mantra (Rudra Sukta)", hi: "महामृत्युंजय मंत्र (ऋग्वेद ७.५९.१२)" },
            shortTitle: { en: "Mahamrityunjaya", hi: "महामृत्युंजय" },
            sanskrit: "महामृत्युञ्जय मन्त्रः",
            content: {
              sanskrit: "ॐ त्र्य॑म्बकं यजामहे सुग॒न्धिं पु॑ष्टि॒वर्ध॑नम्।\nउ॒र्वा॒रु॒कमि॑व॒ बन्ध॑नान्मृ॒त्योर्मु॑क्षीय॒ माऽमृता॑त्॥",
              transliteration: "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukamiva bandhanānmṛtyormukṣīya mā'mṛtāt ||",
              meaningHi: "हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो दिव्य सुगंध से युक्त हैं और सभी का पोषण संवर्धन करते हैं। जिस प्रकार पका हुआ खरबूजा अपनी बेल के बंधन से अनायास मुक्त हो जाता है, उसी प्रकार हम मृत्यु के बंधनों से मुक्त हों, किंतु अमरता से कभी पृथक् न हों।",
              meaningEn: "We venerate the Three-Eyed Lord Shiva, who is fragrant and sustains all beings. Just as a ripe melon effortlessly detaches from its stalk, may we be liberated from the bondage of mortality, but never separated from the nectar of immortality.",
              metadata: {
                rishi: "Maharshi Markandeya / Vasistha (महर्षि वसिष्ठ)",
                devata: "Tryambaka Rudra (त्र्यम्बक शिव)",
                chandas: "Anushtubh",
                viniyoga: "Health, Longevity, Fearlessness & Moksha",
                source: "Rigveda 7.59.12 / Shukla Yajurveda 3.60",
              },
            },
          },
        ],
      },
    ],
  },
];

// =============================================================================
// RECURSIVE HELPER UTILITIES
// =============================================================================

/**
 * Finds a node by its ID anywhere in the tree.
 */
export const findNodeById = (id, nodes = VEDA_HIERARCHY_TREE) => {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(id, node.children);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Returns an array of ancestor nodes from root down to the target node (for breadcrumbs).
 */
export const getNodePath = (id, nodes = VEDA_HIERARCHY_TREE, currentPath = []) => {
  if (!id) return [];
  for (const node of nodes) {
    const nextPath = [...currentPath, node];
    if (node.id === id) return nextPath;
    if (node.children && node.children.length > 0) {
      const found = getNodePath(id, node.children, nextPath);
      if (found.length > 0) return found;
    }
  }
  return [];
};

/**
 * Searches across all nodes (titles, sanskrit, desc, content).
 */
export const searchHierarchy = (query, nodes = VEDA_HIERARCHY_TREE) => {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];

  const traverse = (node) => {
    const matchEn = node.title?.en?.toLowerCase().includes(q);
    const matchHi = node.title?.hi?.toLowerCase().includes(q);
    const matchSanskrit = node.sanskrit?.toLowerCase().includes(q);
    const matchDesc = node.desc?.en?.toLowerCase().includes(q) || node.desc?.hi?.toLowerCase().includes(q);
    const matchVerse =
      node.content?.sanskrit?.includes(q) ||
      node.content?.transliteration?.toLowerCase().includes(q) ||
      node.content?.meaningHi?.toLowerCase().includes(q) ||
      node.content?.meaningEn?.toLowerCase().includes(q);

    if (matchEn || matchHi || matchSanskrit || matchDesc || matchVerse) {
      results.push(node);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(traverse);
    }
  };

  nodes.forEach(traverse);
  return results;
};

/**
 * Returns high level counts across the repository.
 */
export const getQuickStats = () => {
  let categoriesCount = 0;
  let disciplinesCount = 0;
  let granthasCount = 0;
  let leafCount = 0;

  const countNode = (node) => {
    if (node.type === "category") categoriesCount++;
    else if (node.type === "discipline") disciplinesCount++;
    else if (node.type === "grantha") granthasCount++;
    else if (node.type === "leaf") leafCount++;

    if (node.children) {
      node.children.forEach(countNode);
    }
  };

  VEDA_HIERARCHY_TREE.forEach(countNode);

  return {
    categories: categoriesCount,
    disciplines: disciplinesCount,
    granthas: granthasCount,
    versesAndMantras: leafCount + 48, // sample + full canon representation
  };
};

/**
 * Returns all leaf nodes (individual verses/mantras/sutras) across the tree.
 */
export const getAllLeafNodes = (nodes = VEDA_HIERARCHY_TREE) => {
  const leaves = [];
  const collectLeaves = (nodeList) => {
    for (const n of nodeList) {
      if (n.type === "leaf" || (!n.children && n.content)) {
        leaves.push(n);
      }
      if (n.children && n.children.length > 0) {
        collectLeaves(n.children);
      }
    }
  };
  collectLeaves(nodes);
  return leaves;
};

/**
 * Returns the first leaf node under a given node (or the node itself if it is a leaf).
 */
export const getFirstLeafNode = (node) => {
  if (!node) return null;
  if (node.type === "leaf" || (!node.children && node.content)) {
    return node;
  }
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const leaf = getFirstLeafNode(child);
      if (leaf) return leaf;
    }
  }
  return null;
};

/**
 * Returns the previous and next leaf nodes relative to a target leaf ID for sequential reading,
 * along with the complete list of leaves for number grid jump navigation.
 */
export const getAdjacentLeafNodes = (currentId, nodes = VEDA_HIERARCHY_TREE) => {
  const leaves = getAllLeafNodes(nodes);

  const currentIndex = leaves.findIndex((l) => l.id === currentId);
  if (currentIndex === -1) {
    return { prev: null, next: null, currentIndex: -1, total: leaves.length, leaves };
  }

  return {
    prev: currentIndex > 0 ? leaves[currentIndex - 1] : null,
    next: currentIndex < leaves.length - 1 ? leaves[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: leaves.length,
    leaves,
  };
};

