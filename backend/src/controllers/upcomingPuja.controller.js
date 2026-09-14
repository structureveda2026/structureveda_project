import { Op } from "sequelize";
import { UpcomingPuja, PujaPackage } from "../models/index.js";

const PUBLIC_VISIBLE_STATUSES = ["Published", "Booking Closed"];


export const serializePublicPackage = (pkg) => ({
  id: pkg.id,
  name: pkg.name,
  price: Number(pkg.price),
  maxDevotees: Number(pkg.maxDevotees),
  description: pkg.description || null,
  features: Array.isArray(pkg.features) ? pkg.features : [],
  isDefault: Boolean(pkg.isDefault),
});


export const serializePublicPuja = (puja) => {
  const isBookingClosedByTime =
    puja.bookingCloseAt && new Date() >= new Date(puja.bookingCloseAt);
  const isCapacityFull =
    puja.totalCapacity > 0 && puja.bookedCount >= puja.totalCapacity;
  const isBookingOpen =
    puja.status === "Published" && !isBookingClosedByTime && !isCapacityFull;

  const publicStatus = isBookingOpen ? "Published" : "Booking Closed";

  return {
    id: puja.id,
    name: puja.name,
    slug: puja.slug,
    eyebrow: puja.eyebrow || null,
    tagline: puja.tagline || null,
    shortDescription: puja.shortDescription || null,
    fullDescription: puja.fullDescription || null,
    ceremonyDate: puja.ceremonyDate,
    startDateTime: puja.startDateTime,
    bookingCloseAt: puja.bookingCloseAt || null,
    location: puja.location || null,
    temple: puja.temple || null,
    deity: puja.deity || null,
    category: puja.category || null,
    occasion: puja.occasion || null,
    purposeCategories: Array.isArray(puja.purposeCategories)
      ? puja.purposeCategories
      : [],
    remoteAvailable: Boolean(puja.remoteAvailable),
    bannerImage: puja.bannerImage || null,
    galleryImages: Array.isArray(puja.galleryImages) ? puja.galleryImages : [],
    benefits: Array.isArray(puja.benefits) ? puja.benefits : [],
    significance: Array.isArray(puja.significance) ? puja.significance : [],
    whatsIncluded: Array.isArray(puja.whatsIncluded) ? puja.whatsIncluded : [],
    procedureSteps: Array.isArray(puja.procedureSteps)
      ? puja.procedureSteps
      : [],
    isFeatured: Boolean(puja.isFeatured),
    status: publicStatus,
    isBookingOpen: Boolean(isBookingOpen),
    packages: Array.isArray(puja.packages)
      ? puja.packages.map(serializePublicPackage)
      : [],
  };
};


export const getPublicUpcomingPujas = async (req, res) => {
  try {
    const {
      category,
      occasion,
      purpose,
      isFeatured,
      search,
      includePast,
    } = req.query;

    const where = {
      status: { [Op.in]: PUBLIC_VISIBLE_STATUSES },
    };

    // By default, only return upcoming ceremonies (startDateTime >= now)
    if (includePast !== "true") {
      where.startDateTime = {
        [Op.gte]: new Date(),
      };
    }

    if (category) {
      where.category = category;
    }

    if (occasion) {
      where.occasion = occasion;
    }

    if (purpose) {
      where.purposeCategories = {
        [Op.contains]: [purpose],
      };
    }

    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      where.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { deity: { [Op.iLike]: searchTerm } },
        { temple: { [Op.iLike]: searchTerm } },
        { location: { [Op.iLike]: searchTerm } },
      ];
    }

    const pujas = await UpcomingPuja.findAll({
      where,
      order: [
        ["startDateTime", "ASC"],
        [{ model: PujaPackage, as: "packages" }, "isDefault", "DESC"],
        [{ model: PujaPackage, as: "packages" }, "price", "ASC"],
      ],
      include: [
        {
          model: PujaPackage,
          as: "packages",
        },
      ],
    });

    const serializedData = pujas.map(serializePublicPuja);

    return res.status(200).json({
      success: true,
      count: serializedData.length,
      data: serializedData,
    });
  } catch (error) {
    console.error("Public get upcoming pujas error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load upcoming pujas",
    });
  }
};


export const getPublicUpcomingPujaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja ceremony not found",
      });
    }

    const puja = await UpcomingPuja.findOne({
      where: {
        slug: slug.trim().toLowerCase(),
        status: { [Op.in]: PUBLIC_VISIBLE_STATUSES },
      },
      order: [
        [{ model: PujaPackage, as: "packages" }, "isDefault", "DESC"],
        [{ model: PujaPackage, as: "packages" }, "price", "ASC"],
      ],
      include: [
        {
          model: PujaPackage,
          as: "packages",
        },
      ],
    });

    if (!puja) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja ceremony not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializePublicPuja(puja),
    });
  } catch (error) {
    console.error("Public get upcoming puja by slug error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load upcoming puja details",
    });
  }
};
