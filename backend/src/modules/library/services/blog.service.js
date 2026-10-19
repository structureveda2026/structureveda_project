import { Op } from "sequelize";
import BlogPost from "../models/blog.model.js";
import {
  sanitizeSlug,
  calculateReadTime,
  extractExcerpt,
  normalizeTags,
  sanitizeSEO,
} from "../helpers/blog.helper.js";

const VALID_STATUSES = ["Draft", "Published", "Archived"];

export const DEFAULT_MEMORY_BLOGS = [
  {
    id: "blog-rudram-1",
    slug: "shri-rudram-significance-sacred-benefits",
    title: "The Esoteric Significance and Spiritual Benefits of Shri Rudram",
    titleHi: "श्रीरुद्रम्: आध्यात्मिक रहस्य, उत्पत्ति एवं पावन फल",
    subtitle: "A deep dive into the Krishna Yajurveda's timeless hymn to Rudra-Shiva",
    subtitleHi: "कृष्ण यजुर्वेद के अमर रुद्राध्याय का शास्त्रीय एवं प्रायोगिक विश्लेषण",
    excerpt: "Explore the supreme Vedic chant found in the Taittiriya Samhita of Yajurveda, invoking the cosmic and all-pervading energy of Lord Shiva through Namakam and Chamakam.",
    excerptHi: "यजुर्वेद की तैत्तिरीय संहिता में वर्णित श्रीरुद्रम् की महिमा, नमकम्-चमकम् के गूढ़ मंत्रों का अर्थ तथा इसके पाठ से प्राप्त होने वाली आधिदैविक व आत्मिक शांति का विस्तृत विवरण।",
    content: "## The Majesty of Shri Rudram\n\nShri Rudram is one of the most venerable and sacred portions of the Krishna Yajurveda.",
    contentHi: "## श्रीरुद्रम् की दिव्यता एवं महत्त्व\n\nश्रीरुद्रम् कृष्ण यजुर्वेद की तैत्तिरीय संहिता के चतुर्थ काण्ड का एक परम पावन भाग है।",
    category: "Puja & Rituals",
    postType: "article",
    author: "Dr. Acharya Vidyadhar",
    authorAvatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    featuredImage: "https://images.unsplash.com/photo-1609358905581-e5382c16c68b?w=1200&auto=format&fit=crop&q=80",
    tags: ["Lord Shiva", "Rudrabhishek", "Krishna Yajurveda", "Mantra Sadhana"],
    status: "Published",
    isFeatured: true,
    readTime: "7 min read",
    viewsCount: 1420,
    metaTitle: "Shri Rudram Significance & Benefits | Veda Library",
    metaDescription: "Understand the spiritual benefits and deep meaning of Shri Rudram from Krishna Yajurveda.",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "blog-gayatri-2",
    slug: "gayatri-mantra-scientific-spiritual-significance",
    title: "Gayatri Mantra: The Supreme Vedic Illumination for Mind and Soul",
    titleHi: "गायत्री महामंत्र: बुद्धि, चेतना एवं आत्मोत्थान का वैज्ञानिक व आध्यात्मिक मर्म",
    subtitle: "Understanding the 24 syllables of Rigveda 3.62.10 and their cosmic resonance",
    subtitleHi: "ऋग्वेद के २४ अक्षरों की दिव्य शक्ति एवं सविता देवता की उपासना",
    excerpt: "An in-depth exposition of the revered Gayatri Mahamantra revealed to Brahmarshi Vishwamitra in the 3rd Mandala of the Rigveda.",
    excerptHi: "ऋग्वेद के तृतीय मण्डल में ब्रह्मर्षि विश्वामित्र को प्रकट हुए गायत्री महामंत्र का शास्त्रीय विश्लेषण।",
    content: "## The Eternal Radiance of Gayatri\n\nThe Gayatri Mantra is venerated as the mother of the Vedas (Vedamata).",
    contentHi: "## गायत्री महामंत्र की शाश्वत महिमा\n\nगायत्री महामंत्र को समस्त वेदों का सार और वेदमाता कहा गया है।",
    category: "Mantras & Stotrams",
    postType: "mantra",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
    transliteration: "oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||",
    deity: "gayatri",
    rishi: "ब्रह्मर्षि विश्वामित्र (Brahmarshi Vishwamitra)",
    chhandas: "गायत्री (Gayatri)",
    meaning: "हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का ध्यान करते हैं।",
    vidhi: "त्रिकाल संध्या (प्रातः, मध्याह्न, सायं) में पूर्व या उत्तर मुख होकर गायत्री जप करें।",
    benefits: "बुद्धि का विकास, एकाग्रता, आत्मज्ञान, मानसिक शांति एवं सकारात्मक ऊर्जा का संचार।",
    author: "Veda Structure Team",
    tags: ["Gayatri Mantra", "Rigveda", "Vedic Wisdom", "Daily Sadhana"],
    status: "Published",
    isFeatured: true,
    readTime: "6 min read",
    viewsCount: 2350,
    metaTitle: "Gayatri Mantra Spiritual & Scientific Analysis",
    metaDescription: "Explore the profound meaning and sadhana method of Gayatri Mahamantra.",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let MEMORY_BLOGS = JSON.parse(JSON.stringify(DEFAULT_MEMORY_BLOGS));

class BlogService {
  /**
   * Fetch blogs with search, filters and pagination
   */
  async getAllBlogs(options = {}) {
    const {
      status,
      category,
      postType,
      tag,
      search,
      isFeatured,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
      isAdmin = false,
    } = options;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const sortFieldMap = {
      createdAt: "createdAt",
      created_at: "createdAt",
      updatedAt: "updatedAt",
      updated_at: "updatedAt",
      publishedAt: "publishedAt",
      published_at: "publishedAt",
      title: "title",
      viewsCount: "viewsCount",
      views_count: "viewsCount",
      category: "category",
      status: "status",
    };
    const sortField = sortFieldMap[sort] || "createdAt";
    const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const where = {};
    if (!isAdmin) {
      where.status = "Published";
    } else if (status && status !== "All" && VALID_STATUSES.includes(status)) {
      where.status = status;
    }
    if (category && category !== "All") {
      where.category = category;
    }
    if (postType && postType !== "All") {
      where.postType = postType;
    }
    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    if (tag && String(tag).trim()) {
      where.tags = { [Op.contains]: [String(tag).trim().replace(/^#/, "")] };
    }
    if (search && String(search).trim()) {
      const searchTerm = `%${String(search).trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: searchTerm } },
        { titleHi: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { excerpt: { [Op.iLike]: searchTerm } },
        { excerptHi: { [Op.iLike]: searchTerm } },
        { author: { [Op.iLike]: searchTerm } },
        { category: { [Op.iLike]: searchTerm } },
      ];
    }

    try {
      const { count, rows: blogs } = await BlogPost.findAndCountAll({
        where,
        order: [[sortField, sortOrder]],
        limit: limitNum,
        offset,
      });

      return {
        blogs,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum) || 1,
        },
      };
    } catch (dbErr) {
      console.warn("Database query error in getAllBlogs, falling back to memory store:", dbErr.message);
      let filtered = [...MEMORY_BLOGS];
      if (!isAdmin) {
        filtered = filtered.filter((b) => b.status === "Published");
      } else if (status && status !== "All" && VALID_STATUSES.includes(status)) {
        filtered = filtered.filter((b) => b.status === status);
      }
      if (category && category !== "All") {
        filtered = filtered.filter((b) => b.category === category);
      }
      if (postType && postType !== "All") {
        filtered = filtered.filter((b) => (b.postType || "article").toLowerCase() === postType.toLowerCase());
      }
      if (typeof isFeatured !== "undefined" && isFeatured !== "") {
        const featBool = isFeatured === "true" || isFeatured === true;
        filtered = filtered.filter((b) => Boolean(b.isFeatured) === featBool);
      }
      if (tag && String(tag).trim()) {
        const cleanTag = String(tag).trim().replace(/^#/, "").toLowerCase();
        filtered = filtered.filter((b) => Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase() === cleanTag));
      }
      if (search && String(search).trim()) {
        const q = String(search).trim().toLowerCase();
        filtered = filtered.filter((b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.titleHi && b.titleHi.toLowerCase().includes(q)) ||
          (b.slug && b.slug.toLowerCase().includes(q)) ||
          (b.author && b.author.toLowerCase().includes(q)) ||
          (b.category && b.category.toLowerCase().includes(q))
        );
      }

      filtered.sort((a, b) => {
        const dateA = new Date(a[sortField] || a.createdAt || 0).getTime();
        const dateB = new Date(b[sortField] || b.createdAt || 0).getTime();
        return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
      });

      const total = filtered.length;
      const paginated = filtered.slice(offset, offset + limitNum);

      return {
        blogs: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      };
    }
  }

  /**
   * Get single blog by ID
   */
  async getBlogById(id) {
    if (!id) {
      const err = new Error("Blog ID is required");
      err.statusCode = 400;
      throw err;
    }
    try {
      const blog = await BlogPost.findByPk(id);
      if (blog) return blog;
    } catch (err) {
      console.warn("DB findByPk failed for BlogPost, checking memory store:", err.message);
    }
    const memBlog = MEMORY_BLOGS.find((b) => b.id === id || b.slug === id);
    if (memBlog) return memBlog;

    const err = new Error("Blog post not found");
    err.statusCode = 404;
    throw err;
  }

  /**
   * Get single public blog by slug and optionally increment views
   */
  async getBlogBySlug(slug, incrementViews = true) {
    if (!slug) {
      const err = new Error("Slug is required");
      err.statusCode = 400;
      throw err;
    }

    let blog = null;
    try {
      blog = await BlogPost.findOne({
        where: { slug, status: "Published" },
      });
      if (blog && incrementViews) {
        await blog.increment("viewsCount", { by: 1 }).catch(() => {});
      }
    } catch (err) {
      console.warn("DB getBlogBySlug failed, checking memory store:", err.message);
    }

    if (!blog) {
      blog = MEMORY_BLOGS.find((b) => b.slug === slug && b.status === "Published");
      if (blog && incrementViews) {
        blog.viewsCount = (blog.viewsCount || 0) + 1;
      }
    }

    if (!blog) {
      const err = new Error("Blog post not found or not published");
      err.statusCode = 404;
      throw err;
    }

    const relatedBlogs = MEMORY_BLOGS.filter(
      (b) => b.status === "Published" && b.category === blog.category && b.id !== blog.id
    ).slice(0, 3);

    return { blog, relatedBlogs };
  }

  /**
   * Create a new blog post
   */
  async createBlog(data) {
    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      titleHi,
      subtitleHi,
      excerptHi,
      contentHi,
      featuredImage,
      author,
      authorAvatar,
      category,
      tags,
      status = "Draft",
      isFeatured = false,
      readTime,
      metaTitle,
      metaDescription,
      metaTitleHi,
      metaDescriptionHi,
      metaKeywords,
      publishedAt,
      // Sacred Mantra/Sukta/Stotra & Dynamic Post Type
      postType = "article",
      sanskrit,
      transliteration,
      deity,
      rishi,
      chhandas,
      meaning,
      vidhi,
      benefits,
    } = data;

    if (!title || !String(title).trim()) {
      const err = new Error("Blog title (English) is required");
      err.statusCode = 400;
      throw err;
    }

    if (String(title).trim().length < 3) {
      const err = new Error("Blog title must be at least 3 characters long");
      err.statusCode = 400;
      throw err;
    }

    if (!content || !String(content).trim()) {
      const err = new Error("Blog content is required");
      err.statusCode = 400;
      throw err;
    }

    const plainContent = String(content).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
    if (!plainContent) {
      const err = new Error("Blog article content cannot be empty");
      err.statusCode = 400;
      throw err;
    }

    // Generate unique slug
    let finalSlug = sanitizeSlug(customSlug || title);
    if (!finalSlug) {
      finalSlug = `post-${Date.now()}`;
    }

    let existingSlug = null;
    try {
      existingSlug = await BlogPost.findOne({ where: { slug: finalSlug } });
    } catch {
      existingSlug = MEMORY_BLOGS.find((b) => b.slug === finalSlug);
    }

    if (existingSlug) {
      if (customSlug && String(customSlug).trim()) {
        const err = new Error(`Slug '${finalSlug}' is already taken. Please choose a different URL slug.`);
        err.statusCode = 409;
        throw err;
      }
      finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Auto excerpt if not provided
    const finalExcerpt = excerpt?.trim() || extractExcerpt(content, 160);
    const finalExcerptHi = excerptHi?.trim() || (contentHi ? extractExcerpt(contentHi, 160) : null);

    // Auto read time if not provided
    const finalReadTime = readTime?.trim() || calculateReadTime(content);

    // Normalize tags & SEO
    const finalTags = normalizeTags(tags);
    const seo = sanitizeSEO({
      metaTitle,
      metaDescription,
      metaKeywords,
      title,
      excerpt: finalExcerpt,
    });

    let finalPublishedAt = publishedAt || null;
    if (status === "Published" && !finalPublishedAt) {
      finalPublishedAt = new Date().toISOString();
    }

    const recordData = {
      id: `post-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: String(title).trim(),
      slug: finalSlug,
      subtitle: subtitle ? String(subtitle).trim() : null,
      excerpt: finalExcerpt,
      content,
      titleHi: titleHi ? String(titleHi).trim() : null,
      subtitleHi: subtitleHi ? String(subtitleHi).trim() : null,
      excerptHi: finalExcerptHi,
      contentHi: contentHi || null,
      featuredImage: featuredImage ? String(featuredImage).trim() : null,
      author: author ? String(author).trim() : "Veda Structure Team",
      authorAvatar: authorAvatar ? String(authorAvatar).trim() : null,
      category: category ? String(category).trim() : "Vedic Wisdom",
      tags: finalTags,
      status: VALID_STATUSES.includes(status) ? status : "Draft",
      isFeatured: Boolean(isFeatured),
      readTime: finalReadTime,
      viewsCount: 0,
      metaTitle: seo.metaTitle || null,
      metaDescription: seo.metaDescription || null,
      metaTitleHi: metaTitleHi ? String(metaTitleHi).trim() : null,
      metaDescriptionHi: metaDescriptionHi ? String(metaDescriptionHi).trim() : null,
      metaKeywords: seo.metaKeywords,
      publishedAt: finalPublishedAt,
      postType: postType ? String(postType).trim() : "article",
      sanskrit: sanskrit ? String(sanskrit).trim() : null,
      transliteration: transliteration ? String(transliteration).trim() : null,
      deity: deity ? String(deity).trim() : null,
      rishi: rishi ? String(rishi).trim() : null,
      chhandas: chhandas ? String(chhandas).trim() : null,
      meaning: meaning ? String(meaning).trim() : null,
      vidhi: vidhi ? String(vidhi).trim() : null,
      benefits: benefits ? String(benefits).trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await BlogPost.create(recordData);
      const plain = created.toJSON ? created.toJSON() : created;
      MEMORY_BLOGS.unshift(plain);
      return created;
    } catch (dbErr) {
      console.warn("Database create failed for BlogPost, saving to memory store:", dbErr.message);
      MEMORY_BLOGS.unshift(recordData);
      return recordData;
    }
  }

  /**
   * Update existing blog post
   */
  async updateBlog(id, data) {
    const blog = await this.getBlogById(id);

    const {
      title,
      slug: customSlug,
      subtitle,
      excerpt,
      content,
      titleHi,
      subtitleHi,
      excerptHi,
      contentHi,
      featuredImage,
      author,
      authorAvatar,
      category,
      tags,
      status,
      isFeatured,
      readTime,
      metaTitle,
      metaDescription,
      metaTitleHi,
      metaDescriptionHi,
      metaKeywords,
      publishedAt,
      // Sacred Mantra/Sukta/Stotra & Dynamic Post Type
      postType,
      sanskrit,
      transliteration,
      deity,
      rishi,
      chhandas,
      meaning,
      vidhi,
      benefits,
    } = data;

    if (typeof title !== "undefined" && (!title || !String(title).trim())) {
      const err = new Error("Blog title (English) cannot be empty");
      err.statusCode = 400;
      throw err;
    }

    if (typeof content !== "undefined") {
      const plain = String(content).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
      if (!plain) {
        const err = new Error("Blog content cannot be empty");
        err.statusCode = 400;
        throw err;
      }
    }

    let finalSlug = blog.slug;
    if (customSlug && String(customSlug).trim()) {
      const sanitized = sanitizeSlug(customSlug);
      if (sanitized !== blog.slug) {
        let slugExists = null;
        try {
          slugExists = await BlogPost.findOne({
            where: { slug: sanitized, id: { [Op.ne]: id } },
          });
        } catch {
          slugExists = MEMORY_BLOGS.find((b) => b.slug === sanitized && b.id !== id);
        }
        if (slugExists) {
          const err = new Error(`Slug '${sanitized}' is already in use by another article. Please enter a unique slug.`);
          err.statusCode = 409;
          throw err;
        }
        finalSlug = sanitized;
      }
    }

    let finalPublishedAt = blog.publishedAt;
    if (publishedAt) {
      finalPublishedAt = new Date(publishedAt).toISOString();
    } else if (status === "Published" && !blog.publishedAt) {
      finalPublishedAt = new Date().toISOString();
    }

    const updatedContent = typeof content !== "undefined" ? content : blog.content;
    const finalExcerpt =
      typeof excerpt !== "undefined"
        ? (excerpt ? String(excerpt).trim() : null)
        : blog.excerpt || extractExcerpt(updatedContent);

    const updatedContentHi = typeof contentHi !== "undefined" ? contentHi : blog.contentHi;
    const finalExcerptHi =
      typeof excerptHi !== "undefined"
        ? (excerptHi ? String(excerptHi).trim() : null)
        : blog.excerptHi || (updatedContentHi ? extractExcerpt(updatedContentHi) : null);

    const finalReadTime =
      typeof readTime !== "undefined"
        ? readTime
        : calculateReadTime(updatedContent);

    const updatePayload = {
      title: typeof title !== "undefined" ? String(title).trim() : blog.title,
      slug: finalSlug,
      subtitle: typeof subtitle !== "undefined" ? (subtitle ? String(subtitle).trim() : null) : blog.subtitle,
      excerpt: finalExcerpt,
      content: updatedContent,
      titleHi: typeof titleHi !== "undefined" ? (titleHi ? String(titleHi).trim() : null) : blog.titleHi,
      subtitleHi: typeof subtitleHi !== "undefined" ? (subtitleHi ? String(subtitleHi).trim() : null) : blog.subtitleHi,
      excerptHi: finalExcerptHi,
      contentHi: updatedContentHi,
      featuredImage: typeof featuredImage !== "undefined" ? (featuredImage ? String(featuredImage).trim() : null) : blog.featuredImage,
      author: typeof author !== "undefined" ? String(author).trim() : blog.author,
      authorAvatar: typeof authorAvatar !== "undefined" ? (authorAvatar ? String(authorAvatar).trim() : null) : blog.authorAvatar,
      category: typeof category !== "undefined" ? String(category).trim() : blog.category,
      tags: typeof tags !== "undefined" ? normalizeTags(tags) : blog.tags,
      status: status && VALID_STATUSES.includes(status) ? status : blog.status,
      isFeatured: typeof isFeatured !== "undefined" ? Boolean(isFeatured) : blog.isFeatured,
      readTime: finalReadTime,
      metaTitle: typeof metaTitle !== "undefined" ? (metaTitle ? String(metaTitle).trim() : null) : blog.metaTitle,
      metaDescription: typeof metaDescription !== "undefined" ? (metaDescription ? String(metaDescription).trim() : null) : blog.metaDescription,
      metaTitleHi: typeof metaTitleHi !== "undefined" ? (metaTitleHi ? String(metaTitleHi).trim() : null) : blog.metaTitleHi,
      metaDescriptionHi: typeof metaDescriptionHi !== "undefined" ? (metaDescriptionHi ? String(metaDescriptionHi).trim() : null) : blog.metaDescriptionHi,
      metaKeywords: typeof metaKeywords !== "undefined" ? normalizeTags(metaKeywords) : blog.metaKeywords,
      publishedAt: finalPublishedAt,
      postType: typeof postType !== "undefined" ? String(postType).trim() : blog.postType,
      sanskrit: typeof sanskrit !== "undefined" ? (sanskrit ? String(sanskrit).trim() : null) : blog.sanskrit,
      transliteration: typeof transliteration !== "undefined" ? (transliteration ? String(transliteration).trim() : null) : blog.transliteration,
      deity: typeof deity !== "undefined" ? (deity ? String(deity).trim() : null) : blog.deity,
      rishi: typeof rishi !== "undefined" ? (rishi ? String(rishi).trim() : null) : blog.rishi,
      chhandas: typeof chhandas !== "undefined" ? (chhandas ? String(chhandas).trim() : null) : blog.chhandas,
      meaning: typeof meaning !== "undefined" ? (meaning ? String(meaning).trim() : null) : blog.meaning,
      vidhi: typeof vidhi !== "undefined" ? (vidhi ? String(vidhi).trim() : null) : blog.vidhi,
      benefits: typeof benefits !== "undefined" ? (benefits ? String(benefits).trim() : null) : blog.benefits,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (typeof blog.update === "function") {
        await blog.update(updatePayload);
      }
    } catch (err) {
      console.warn("DB update failed for BlogPost, updating memory store:", err.message);
    }

    const memIdx = MEMORY_BLOGS.findIndex((b) => b.id === id || b.slug === id);
    if (memIdx !== -1) {
      MEMORY_BLOGS[memIdx] = { ...MEMORY_BLOGS[memIdx], ...updatePayload };
      return MEMORY_BLOGS[memIdx];
    }
    return { ...blog, ...updatePayload };
  }

  /**
   * Delete blog post
   */
  async deleteBlog(id) {
    try {
      const blog = await BlogPost.findByPk(id);
      if (blog && typeof blog.destroy === "function") {
        await blog.destroy();
      }
    } catch (err) {
      console.warn("DB delete failed for BlogPost, mutating memory store:", err.message);
    }
    const beforeLen = MEMORY_BLOGS.length;
    MEMORY_BLOGS = MEMORY_BLOGS.filter((b) => b.id !== id && b.slug !== id);
    return true;
  }

  /**
   * Quick status toggle
   */
  async updateBlogStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
      err.statusCode = 400;
      throw err;
    }
    return await this.updateBlog(id, { status });
  }

  /**
   * Toggle featured post
   */
  async toggleFeatured(id, isFeatured) {
    return await this.updateBlog(id, { isFeatured: Boolean(isFeatured) });
  }

  /**
   * Aggregate metrics & stats
   */
  async getBlogStats() {
    try {
      const totalBlogs = await BlogPost.count();
      const publishedBlogs = await BlogPost.count({ where: { status: "Published" } });
      const draftBlogs = await BlogPost.count({ where: { status: "Draft" } });
      const archivedBlogs = await BlogPost.count({ where: { status: "Archived" } });
      const totalViewsResult = await BlogPost.sum("viewsCount");
      const totalViews = isNaN(totalViewsResult) || !totalViewsResult ? 0 : Number(totalViewsResult);

      const categories = await BlogPost.findAll({
        attributes: [
          "category",
          [BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "count"],
        ],
        group: ["category"],
        order: [[BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "DESC"]],
        raw: true,
      });

      return {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs,
        totalViews,
        categories: categories || [],
      };
    } catch (err) {
      console.warn("Database stats query failed for BlogPost, using memory store:", err.message);
      const catCounts = {};
      MEMORY_BLOGS.forEach((b) => {
        catCounts[b.category] = (catCounts[b.category] || 0) + 1;
      });
      const categories = Object.keys(catCounts).map((category) => ({
        category,
        count: String(catCounts[category]),
      }));

      return {
        totalBlogs: MEMORY_BLOGS.length,
        publishedBlogs: MEMORY_BLOGS.filter((b) => b.status === "Published").length,
        draftBlogs: MEMORY_BLOGS.filter((b) => b.status === "Draft").length,
        archivedBlogs: MEMORY_BLOGS.filter((b) => b.status === "Archived").length,
        totalViews: MEMORY_BLOGS.reduce((acc, b) => acc + (b.viewsCount || 0), 0),
        categories,
      };
    }
  }

  /**
   * Unique categories list with published count
   */
  async getCategoriesWithCount() {
    try {
      return await BlogPost.findAll({
        where: { status: "Published" },
        attributes: [
          "category",
          [BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "count"],
        ],
        group: ["category"],
        order: [[BlogPost.sequelize.fn("COUNT", BlogPost.sequelize.col("id")), "DESC"]],
        raw: true,
      });
    } catch (err) {
      console.warn("Database category count failed for BlogPost, using memory store:", err.message);
      const catCounts = {};
      MEMORY_BLOGS.filter((b) => b.status === "Published").forEach((b) => {
        catCounts[b.category] = (catCounts[b.category] || 0) + 1;
      });
      return Object.keys(catCounts).map((category) => ({
        category,
        count: String(catCounts[category]),
      }));
    }
  }
}

export default new BlogService();
