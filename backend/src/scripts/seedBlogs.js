import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import sequelize, { connectDatabase } from "../config/database.js";
import BlogPost from "../modules/library/models/blog.model.js";

const SEED_BLOGS = [
  {
    slug: "shri-rudram-significance-sacred-benefits",
    title: "The Esoteric Significance and Spiritual Benefits of Shri Rudram",
    titleHi: "श्रीरुद्रम्: आध्यात्मिक रहस्य, उत्पत्ति एवं पावन फल",
    subtitle: "A deep dive into the Krishna Yajurveda's timeless hymn to Rudra-Shiva",
    subtitleHi: "कृष्ण यजुर्वेद के अमर रुद्राध्याय का शास्त्रीय एवं प्रायोगिक विश्लेषण",
    excerpt: "Explore the supreme Vedic chant found in the Taittiriya Samhita of Yajurveda, invoking the cosmic and all-pervading energy of Lord Shiva through Namakam and Chamakam.",
    excerptHi: "यजुर्वेद की तैत्तिरीय संहिता में वर्णित श्रीरुद्रम् की महिमा, नमकम्-चमकम् के गूढ़ मंत्रों का अर्थ तथा इसके पाठ से प्राप्त होने वाली आधिदैविक व आत्मिक शांति का विस्तृत विवरण।",
    category: "Puja & Rituals",
    author: "Dr. Acharya Vidyadhar",
    authorAvatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    featuredImage: "https://images.unsplash.com/photo-1609358905581-e5382c16c68b?w=1200&auto=format&fit=crop&q=80",
    tags: ["Lord Shiva", "Rudrabhishek", "Krishna Yajurveda", "Mantra Sadhana", "Puja & Rituals"],
    status: "Published",
    isFeatured: true,
    readTime: "7 min read",
    viewsCount: 1420,
    metaTitle: "Shri Rudram Significance & Benefits | Veda Library",
    metaDescription: "Understand the spiritual benefits and deep meaning of Shri Rudram from Krishna Yajurveda.",
    publishedAt: new Date(),
    content: `## The Majesty of Shri Rudram

Shri Rudram (also known as *Rudradhyaya* or *Shatarudriya*) is one of the most venerable and sacred portions of the **Krishna Yajurveda** (Taittiriya Samhita, 4th Kanda, 5th Prapathaka). It holds a central position in Vedic ritualism, especially in the performance of *Maha Rudrabhishekam* and *Atirudra Mahayajna*.

### Structure of the Text
Shri Rudram is traditionally composed of two vital sections:
1. **Namakam (नमकम्):** Comprising 11 *Anuvakas* (sections), this hymn glorifies the supreme reality in every conceivable aspect of existence.
2. **Chamakam (चमकम्):** Following the Namakam, the 11 Anuvakas of Chamakam invoke divine grace for both spiritual liberation and material well-being.

### Sacred Mantra from Anuvaka 1
> **नमस्ते रुद्र मन्यव उतो त इषवे नमः।**  
> **नमस्ते अस्तु धन्वने बाहुभ्यामुत ते नमः॥**  
> *(यजुर्वेद तैत्तिरीय संहिता ४.५.१)*  
>
> *Salutations to your wrath, O Lord Rudra, and obeisance to your arrow. Salutations to your sacred bow, and to both your divine arms!*`,
    contentHi: `## श्रीरुद्रम् की दिव्यता एवं महत्त्व

श्रीरुद्रम् कृष्ण यजुर्वेद की तैत्तिरीय संहिता के चतुर्थ काण्ड का एक परम पावन भाग है। सनातन परंपरा में भगवान शिव के रुद्र स्वरूप की आराधना तथा रुद्राभिषेक में इसका सर्वोपरि स्थान है।

### ग्रंथ की संरचना
1. **नमकम् (Namakam):** इसमें ११ अनुवाक हैं, जिनमें 'नमो नमः' के उद्घोष के साथ चराचर जगत में व्याप्त ईश्वर के अनन्त रूपों को नमन किया गया है।
2. **चमकम् (Chamakam):** इसमें भी ११ अनुवाक हैं, जिनमें 'च मे' की प्रार्थना के साथ लौकिक समृद्धि एवं पारलौकिक मोक्ष की याचना की गई है।

### मूल वैदिक मंत्र
> **नमस्ते रुद्र मन्यव उतो त इषवे नमः।**  
> **नमस्ते अस्तु धन्वने बाहुभ्यामुत ते नमः॥**`
  },
  {
    slug: "navagraha-shanti-vedic-astrology-remedies",
    title: "Navagraha Shanti: Vedic Astrological Remedies & Cosmic Alignment",
    titleHi: "नवग्रह शांति: वैदिक ज्योतिष के उपाय एवं ब्रह्मांडीय ऊर्जा संतुलन",
    subtitle: "Understanding how planetary energies influence human destiny and methods of pacification",
    subtitleHi: "कुंडली में नवग्रहों का प्रभाव, बीज मंत्र एवं शास्त्रीय उपाय",
    excerpt: "Learn how ancient sages developed systematic homas, stotras, and gemstones to harmonize the subtle planetary radiations affecting body and mind.",
    excerptHi: "वैदिक ज्योतिष के अनुसार नवग्रहों की अनुकूलता जीवन में सुख, शांति एवं समृद्धि का आधार है। जानिए सूर्य से लेकर केतु तक के विशेष अनुष्ठान और मंत्र।",
    category: "Vedic Astrology",
    author: "Pt. Radheshyam Shastri",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    featuredImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&auto=format&fit=crop&q=80",
    tags: ["Vedic Astrology", "Navgrah", "Kundali Dosha", "Grah Shanti", "Sanatan Dharma"],
    status: "Published",
    isFeatured: false,
    readTime: "6 min read",
    viewsCount: 980,
    metaTitle: "Navagraha Shanti Remedies & Astrology | Veda Library",
    metaDescription: "Comprehensive guide to Navagraha pacification, mantras, and homas in Vedic astrology.",
    publishedAt: new Date(),
    content: `## The Cosmic Influence of Navagrahas

In Vedic Jyotisha, the nine celestial bodies—Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu—are not mere physical masses in space, but conscious cosmic agents delivering karmic fruits.

### Navagraha Shanti Pillars
1. **Mantra Japa:** Chanting authentic Vedic and Tantric Beej mantras.
2. **Dana:** Astrological charity according to planetary rulerships.
3. **Navagraha Homa:** Sacrificial offerings into consecrated Agni.`,
    contentHi: `## नवग्रहों का ब्रह्मांडीय प्रभाव

वैदिक ज्योतिष में नवग्रह कर्मफल के अधिष्ठाता देव हैं।

### नवग्रह शांति के तीन मुख्य स्तंभ
1. **मंत्र जप:** संबंधित ग्रह के वैदिक या बीज मंत्र का जप।
2. **दान:** संबंधित वस्तुओं का सुपात्र को दान।
3. **हवन:** विशिष्ट समिधाओं द्वारा नवग्रह आहुति।`
  },
  {
    slug: "gayatri-mantra-science-of-sound-vibration",
    title: "Gayatri Mantra: The Supreme Science of Sound, Light, and Consciousness",
    titleHi: "गायत्री महामंत्र: ध्वनि, प्रकाश एवं चेतना का दिव्य विज्ञान",
    subtitle: "Decoding the 24 syllables of the Rigvedic mother of all mantras",
    subtitleHi: "ऋग्वेद के अमर मंत्र के २४ अक्षरों का वैज्ञानिक एवं यौगिक रहस्य",
    excerpt: "Discovered by Maharshi Vishwamitra in Rigveda Mandala 3, the Gayatri Mantra is an unmatched sonic formula that awakens the higher intellect (Dhi).",
    excerptHi: "ऋग्वेद के तृतीय मण्डल में प्रकट गायत्री महामंत्र के २४ अक्षरों में सम्पूर्ण वेदों का सार समाहित है। जानिए इसकी साधना विधि और आध्यात्मिक प्रभाव।",
    category: "Mantras & Stotrams",
    author: "Dr. Acharya Vidyadhar",
    authorAvatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    featuredImage: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1200&auto=format&fit=crop&q=80",
    tags: ["Mantras", "Rigveda", "Daily Sadhana", "Meditation", "Spiritual Rituals"],
    status: "Published",
    isFeatured: true,
    readTime: "8 min read",
    viewsCount: 2150,
    metaTitle: "Gayatri Mantra Science & Meaning | Veda Library",
    metaDescription: "Spiritual and yogic science behind the 24 syllables of Gayatri Mantra.",
    publishedAt: new Date(),
    content: `## The Crown Jewel of Vedic Revelation

The Gayatri Mantra appears in the **Rigveda (3.62.10)** and is dedicated to **Savitr**, the solar deity of supreme illumination.

### The Sacred Text
> **ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥**  
> *(ऋग्वेद ३.६२.१०)*`,
    contentHi: `## वेदों का मुकुटमणि: गायत्री महामंत्र

ऋग्वेद के तृतीय मण्डल (३.६२.१०) में महर्षि विश्वामित्र द्वारा दृष्ट यह मंत्र सविता देवता को समर्पित है।`
  }
];

async function seedBlogs() {
  try {
    console.log("Connecting to database...");
    await connectDatabase();
    await BlogPost.sync({ alter: true });

    for (const blogData of SEED_BLOGS) {
      const [blog, created] = await BlogPost.findOrCreate({
        where: { slug: blogData.slug },
        defaults: blogData,
      });

      if (created) {
        console.log(`✅ Created blog: ${blog.title}`);
      } else {
        console.log(`ℹ️ Blog already exists: ${blog.title}`);
      }
    }

    console.log("🎉 Blog seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    process.exit(1);
  }
}

seedBlogs();
