import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { UpcomingPuja, PujaPackage, PujaBooking } from "../models/index.js";

const VALID_STATUSES = ["Draft", "Published", "Booking Closed", "Completed", "Cancelled"];

export const sanitizeSlug = (str) => {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// GET /api/admin/upcoming-pujas or /admin/upcoming-pujas
export const getAdminUpcomingPujas = async (req, res) => {
  try {
    const { status, category, occasion, search, isFeatured, sort = "startDateTime", order = "ASC" } = req.query;

    const where = {};

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (occasion) {
      where.occasion = occasion;
    }

    if (typeof isFeatured !== "undefined") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { slug: { [Op.iLike]: searchTerm } },
        { deity: { [Op.iLike]: searchTerm } },
      ];
    }

    const validSortFields = ["startDateTime", "ceremonyDate", "createdAt", "name", "totalCapacity", "bookedCount"];
    const sortField = validSortFields.includes(sort) ? sort : "startDateTime";
    const sortOrder = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const pujas = await UpcomingPuja.findAll({
      where,
      order: [[sortField, sortOrder]],
      include: [
        {
          model: PujaPackage,
          as: "packages",
          attributes: ["id", "name", "price", "maxDevotees", "isDefault"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: pujas.length,
      data: pujas,
    });
  } catch (error) {
    console.error("Get admin upcoming pujas error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Upcoming Pujas list",
    });
  }
};

// GET /api/admin/upcoming-pujas/:id or /admin/upcoming-pujas/:id
export const getAdminUpcomingPujaById = async (req, res) => {
  try {
    const { id } = req.params;

    let puja;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      puja = await UpcomingPuja.findByPk(id, {
        include: [
          {
            model: PujaPackage,
            as: "packages",
          },
        ],
      });
    } else {
      puja = await UpcomingPuja.findOne({
        where: { slug: id },
        include: [
          {
            model: PujaPackage,
            as: "packages",
          },
        ],
      });
    }

    if (!puja) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: puja,
    });
  } catch (error) {
    console.error("Get admin upcoming puja by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Upcoming Puja details",
    });
  }
};

// POST /api/admin/upcoming-pujas or /admin/upcoming-pujas
export const createUpcomingPuja = async (req, res) => {
  try {
    const {
      name,
      slug,
      eyebrow,
      tagline,
      shortDescription,
      fullDescription,
      bannerImage,
      galleryImages = [],
      location,
      temple,
      deity,
      category,
      occasion,
      purposeCategories = [],
      ceremonyDate,
      startDateTime,
      bookingCloseAt,
      totalCapacity = 100,
      isFeatured = false,
      remoteAvailable = true,
      benefits = [],
      significance = [],
      whatsIncluded = [],
      procedureSteps = [],
      status = "Draft",
      packages = [],
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Puja name is required.",
      });
    }

    const rawSlug = slug || name;
    const formattedSlug = sanitizeSlug(rawSlug);
    if (!formattedSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required.",
      });
    }

    if (!ceremonyDate) {
      return res.status(400).json({
        success: false,
        message: "Ceremony date is required.",
      });
    }

    if (isNaN(new Date(ceremonyDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Ceremony date must be a valid date.",
      });
    }

    if (!startDateTime) {
      return res.status(400).json({
        success: false,
        message: "Ceremony start date and time is required.",
      });
    }

    const startDateObj = new Date(startDateTime);
    if (isNaN(startDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Ceremony start date and time must be a valid timestamp.",
      });
    }

    let bookingCloseAtObj = null;
    if (bookingCloseAt) {
      bookingCloseAtObj = new Date(bookingCloseAt);
      if (isNaN(bookingCloseAtObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Booking close time must be a valid timestamp.",
        });
      }

      if (bookingCloseAtObj > startDateObj) {
        return res.status(400).json({
          success: false,
          message: "Booking close cutoff cannot be after the ceremony start date and time.",
        });
      }
    }

    const parsedCapacity = parseInt(totalCapacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total capacity must be a positive integer greater than zero.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
      });
    }

    const existingSlug = await UpcomingPuja.findOne({ where: { slug: formattedSlug } });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: `An Upcoming Puja with slug '${formattedSlug}' already exists. Please provide a unique slug.`,
      });
    }

    if (Array.isArray(packages) && packages.length > 0) {
      let defaultCount = 0;
      for (let i = 0; i < packages.length; i++) {
        const pkg = packages[i];
        if (!pkg.name || !pkg.name.trim()) {
          return res.status(400).json({
            success: false,
            message: `Package #${i + 1} must have a valid name.`,
          });
        }
        const priceNum = Number(pkg.price);
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({
            success: false,
            message: `Package '${pkg.name}' must have a valid price >= 0.`,
          });
        }
        const maxDev = parseInt(pkg.maxDevotees, 10);
        if (isNaN(maxDev) || maxDev <= 0) {
          return res.status(400).json({
            success: false,
            message: `Package '${pkg.name}' max devotees must be at least 1.`,
          });
        }
        if (pkg.isDefault) {
          defaultCount++;
        }
      }

      if (defaultCount > 1) {
        return res.status(400).json({
          success: false,
          message: "Only one package can be designated as the default package.",
        });
      }
    }

    const createdId = await sequelize.transaction(async (t) => {
      if (isFeatured) {
        await UpcomingPuja.update({ isFeatured: false }, { where: { isFeatured: true }, transaction: t });
      }

      const newPuja = await UpcomingPuja.create(
        {
          name: name.trim(),
          slug: formattedSlug,
          eyebrow: eyebrow ? eyebrow.trim() : null,
          tagline: tagline ? tagline.trim() : null,
          shortDescription: shortDescription ? shortDescription.trim() : null,
          fullDescription: fullDescription ? fullDescription.trim() : null,
          bannerImage: bannerImage ? bannerImage.trim() : null,
          galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
          location: location ? location.trim() : null,
          temple: temple ? temple.trim() : null,
          deity: deity ? deity.trim() : null,
          category: category ? category.trim() : null,
          occasion: occasion ? occasion.trim() : null,
          purposeCategories: Array.isArray(purposeCategories) ? purposeCategories : [],
          ceremonyDate,
          startDateTime: startDateObj,
          bookingCloseAt: bookingCloseAtObj,
          totalCapacity: parsedCapacity,
          bookedCount: 0,
          isFeatured: Boolean(isFeatured),
          remoteAvailable: Boolean(remoteAvailable),
          benefits: Array.isArray(benefits) ? benefits : [],
          significance: Array.isArray(significance) ? significance : [],
          whatsIncluded: Array.isArray(whatsIncluded) ? whatsIncluded : [],
          procedureSteps: Array.isArray(procedureSteps) ? procedureSteps : [],
          status,
        },
        { transaction: t }
      );

      if (Array.isArray(packages) && packages.length > 0) {
        const hasDefault = packages.some((p) => Boolean(p.isDefault));
        const packageRecords = packages.map((pkg, idx) => ({
          pujaId: newPuja.id,
          name: pkg.name.trim(),
          price: Number(pkg.price),
          maxDevotees: parseInt(pkg.maxDevotees, 10),
          description: pkg.description ? pkg.description.trim() : null,
          features: Array.isArray(pkg.features) ? pkg.features : [],
          isDefault: hasDefault ? Boolean(pkg.isDefault) : idx === 0,
        }));

        await PujaPackage.bulkCreate(packageRecords, { transaction: t });
      }

      return newPuja.id;
    });

    const completePuja = await UpcomingPuja.findByPk(createdId, {
      include: [{ model: PujaPackage, as: "packages" }],
    });

    return res.status(201).json({
      success: true,
      message: "Upcoming Puja created successfully",
      data: completePuja,
    });
  } catch (error) {
    console.error("Create upcoming puja error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the Upcoming Puja.",
    });
  }
};

// PUT /api/admin/upcoming-pujas/:id or /admin/upcoming-pujas/:id
export const updateUpcomingPuja = async (req, res) => {
  try {
    const { id } = req.params;

    const puja = await UpcomingPuja.findByPk(id, {
      include: [{ model: PujaPackage, as: "packages" }],
    });

    if (!puja) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja not found",
      });
    }

    const {
      name,
      slug,
      eyebrow,
      tagline,
      shortDescription,
      fullDescription,
      bannerImage,
      galleryImages,
      location,
      temple,
      deity,
      category,
      occasion,
      purposeCategories,
      ceremonyDate,
      startDateTime,
      bookingCloseAt,
      totalCapacity,
      isFeatured,
      remoteAvailable,
      benefits,
      significance,
      whatsIncluded,
      procedureSteps,
      status,
      packages,
    } = req.body;

    const updateFields = {};

    if (typeof name !== "undefined") {
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Name cannot be empty." });
      }
      updateFields.name = name.trim();
    }

    if (typeof slug !== "undefined") {
      const formattedSlug = sanitizeSlug(slug);
      if (!formattedSlug) {
        return res.status(400).json({ success: false, message: "Valid slug is required." });
      }
      if (formattedSlug !== puja.slug) {
        const existing = await UpcomingPuja.findOne({
          where: { slug: formattedSlug, id: { [Op.ne]: id } },
        });
        if (existing) {
          return res.status(409).json({
            success: false,
            message: `An Upcoming Puja with slug '${formattedSlug}' already exists.`,
          });
        }
        updateFields.slug = formattedSlug;
      }
    }

    if (typeof ceremonyDate !== "undefined") {
      if (isNaN(new Date(ceremonyDate).getTime())) {
        return res.status(400).json({ success: false, message: "Ceremony date must be valid." });
      }
      updateFields.ceremonyDate = ceremonyDate;
    }

    const effectiveStart = startDateTime ? new Date(startDateTime) : new Date(puja.startDateTime);
    if (typeof startDateTime !== "undefined") {
      if (isNaN(effectiveStart.getTime())) {
        return res.status(400).json({ success: false, message: "Start date time must be valid." });
      }
      updateFields.startDateTime = effectiveStart;
    }

    if (typeof bookingCloseAt !== "undefined") {
      if (bookingCloseAt === null || bookingCloseAt === "") {
        updateFields.bookingCloseAt = null;
      } else {
        const closeDateObj = new Date(bookingCloseAt);
        if (isNaN(closeDateObj.getTime())) {
          return res.status(400).json({ success: false, message: "Booking close cutoff must be valid." });
        }
        if (closeDateObj > effectiveStart) {
          return res.status(400).json({
            success: false,
            message: "Booking close cutoff cannot be after ceremony start.",
          });
        }
        updateFields.bookingCloseAt = closeDateObj;
      }
    }

    if (typeof totalCapacity !== "undefined") {
      const parsedCapacity = parseInt(totalCapacity, 10);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Total capacity must be a positive integer greater than zero.",
        });
      }
      if (parsedCapacity < puja.bookedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total capacity to ${parsedCapacity} because ${puja.bookedCount} slots are already booked.`,
        });
      }
      updateFields.totalCapacity = parsedCapacity;
    }

    if (typeof status !== "undefined") {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
        });
      }
      updateFields.status = status;
    }

    if (typeof isFeatured !== "undefined") {
      updateFields.isFeatured = Boolean(isFeatured);
    }
    if (typeof remoteAvailable !== "undefined") {
      updateFields.remoteAvailable = Boolean(remoteAvailable);
    }
    if (typeof eyebrow !== "undefined") updateFields.eyebrow = eyebrow ? eyebrow.trim() : null;
    if (typeof tagline !== "undefined") updateFields.tagline = tagline ? tagline.trim() : null;
    if (typeof shortDescription !== "undefined") updateFields.shortDescription = shortDescription ? shortDescription.trim() : null;
    if (typeof fullDescription !== "undefined") updateFields.fullDescription = fullDescription ? fullDescription.trim() : null;
    if (typeof bannerImage !== "undefined") updateFields.bannerImage = bannerImage ? bannerImage.trim() : null;
    if (typeof galleryImages !== "undefined") updateFields.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];
    if (typeof location !== "undefined") updateFields.location = location ? location.trim() : null;
    if (typeof temple !== "undefined") updateFields.temple = temple ? temple.trim() : null;
    if (typeof deity !== "undefined") updateFields.deity = deity ? deity.trim() : null;
    if (typeof category !== "undefined") updateFields.category = category ? category.trim() : null;
    if (typeof occasion !== "undefined") updateFields.occasion = occasion ? occasion.trim() : null;
    if (typeof purposeCategories !== "undefined") updateFields.purposeCategories = Array.isArray(purposeCategories) ? purposeCategories : [];
    if (typeof benefits !== "undefined") updateFields.benefits = Array.isArray(benefits) ? benefits : [];
    if (typeof significance !== "undefined") updateFields.significance = Array.isArray(significance) ? significance : [];
    if (typeof whatsIncluded !== "undefined") updateFields.whatsIncluded = Array.isArray(whatsIncluded) ? whatsIncluded : [];
    if (typeof procedureSteps !== "undefined") updateFields.procedureSteps = Array.isArray(procedureSteps) ? procedureSteps : [];

    if (Array.isArray(packages)) {
      let defaultCount = 0;
      for (let i = 0; i < packages.length; i++) {
        const pkg = packages[i];
        if (!pkg.name || !pkg.name.trim()) {
          return res.status(400).json({ success: false, message: `Package #${i + 1} must have a name.` });
        }
        const priceNum = Number(pkg.price);
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({ success: false, message: `Package '${pkg.name}' price must be >= 0.` });
        }
        const maxDev = parseInt(pkg.maxDevotees, 10);
        if (isNaN(maxDev) || maxDev <= 0) {
          return res.status(400).json({ success: false, message: `Package '${pkg.name}' max devotees must be >= 1.` });
        }
        if (pkg.isDefault) defaultCount++;
      }
      if (defaultCount > 1) {
        return res.status(400).json({ success: false, message: "Only one package can be marked as default." });
      }
    }

    await sequelize.transaction(async (t) => {
      if (updateFields.isFeatured) {
        await UpcomingPuja.update(
          { isFeatured: false },
          { where: { isFeatured: true, id: { [Op.ne]: id } }, transaction: t }
        );
      }

      await puja.update(updateFields, { transaction: t });

      if (Array.isArray(packages)) {
        const existingPackages = puja.packages || [];
        const incomingIds = packages.filter((p) => p.id).map((p) => p.id);
        const toDelete = existingPackages.filter((ep) => !incomingIds.includes(ep.id));

        if (toDelete.length > 0) {
          const deleteIds = toDelete.map((p) => p.id);
          const activeBookingsCount = await PujaBooking.count({
            where: { packageId: deleteIds },
            transaction: t,
          });

          if (activeBookingsCount > 0) {
            throw new Error(
              `Cannot remove package(s) because ${activeBookingsCount} existing booking(s) reference them.`
            );
          }

          await PujaPackage.destroy({
            where: { id: deleteIds, pujaId: id },
            transaction: t,
          });
        }

        const hasDefault = packages.some((p) => Boolean(p.isDefault));
        for (let i = 0; i < packages.length; i++) {
          const pkg = packages[i];
          const isDef = hasDefault ? Boolean(pkg.isDefault) : i === 0;

          if (pkg.id && existingPackages.some((ep) => ep.id === pkg.id)) {
            await PujaPackage.update(
              {
                name: pkg.name.trim(),
                price: Number(pkg.price),
                maxDevotees: parseInt(pkg.maxDevotees, 10),
                description: pkg.description ? pkg.description.trim() : null,
                features: Array.isArray(pkg.features) ? pkg.features : [],
                isDefault: isDef,
              },
              { where: { id: pkg.id, pujaId: id }, transaction: t }
            );
          } else {
            await PujaPackage.create(
              {
                pujaId: id,
                name: pkg.name.trim(),
                price: Number(pkg.price),
                maxDevotees: parseInt(pkg.maxDevotees, 10),
                description: pkg.description ? pkg.description.trim() : null,
                features: Array.isArray(pkg.features) ? pkg.features : [],
                isDefault: isDef,
              },
              { transaction: t }
            );
          }
        }
      }
    });

    const updatedPuja = await UpcomingPuja.findByPk(id, {
      include: [{ model: PujaPackage, as: "packages" }],
    });

    return res.status(200).json({
      success: true,
      message: "Upcoming Puja updated successfully",
      data: updatedPuja,
    });
  } catch (error) {
    console.error("Update upcoming puja error:", error);
    const isClientError = error.message && error.message.includes("Cannot remove package");
    return res.status(isClientError ? 409 : 500).json({
      success: false,
      message: error.message || "An unexpected error occurred while updating the Upcoming Puja.",
    });
  }
};

// DELETE /api/admin/upcoming-pujas/:id or /admin/upcoming-pujas/:id
export const deleteUpcomingPuja = async (req, res) => {
  try {
    const { id } = req.params;

    const puja = await UpcomingPuja.findByPk(id);

    if (!puja) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja not found",
      });
    }

    const bookingCount = await PujaBooking.count({ where: { pujaId: id } });
    if (bookingCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete Upcoming Puja '${puja.name}' because it already has ${bookingCount} existing booking(s). You can change its status to 'Cancelled' instead.`,
      });
    }

    await sequelize.transaction(async (t) => {
      await PujaPackage.destroy({ where: { pujaId: id }, transaction: t });
      await puja.destroy({ transaction: t });
    });

    return res.status(200).json({
      success: true,
      message: "Upcoming Puja and associated packages deleted successfully",
    });
  } catch (error) {
    console.error("Delete upcoming puja error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the Upcoming Puja.",
    });
  }
};
