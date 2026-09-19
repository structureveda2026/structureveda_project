import { Op } from "sequelize";
import { UpcomingPuja, PujaPackage, PujaBooking } from "../models/index.js";

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


export const createPujaBooking = async (req, res) => {
  try {
    const {
      pujaId,
      packageId,
      members,
      city,
      country,
      sankalpPurpose,
    } = req.body;

    const pujaIdentifier = pujaId || req.params.slug;

    if (!pujaIdentifier) {
      return res.status(400).json({
        success: false,
        message: "Puja identifier is required.",
      });
    }

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Participation package tier is required.",
      });
    }

    // 1. Resolve UpcomingPuja
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pujaIdentifier);
    const puja = isUuid
      ? await UpcomingPuja.findByPk(pujaIdentifier)
      : await UpcomingPuja.findOne({ where: { slug: pujaIdentifier.toLowerCase() } });

    if (!puja) {
      return res.status(404).json({
        success: false,
        message: "Upcoming Puja ceremony not found.",
      });
    }

    // 2. Verify booking is open for ceremony
    const isBookingClosedByTime =
      puja.bookingCloseAt && new Date() >= new Date(puja.bookingCloseAt);
    const isCapacityFull =
      puja.totalCapacity > 0 && puja.bookedCount >= puja.totalCapacity;

    if (puja.status !== "Published" || isBookingClosedByTime || isCapacityFull) {
      return res.status(400).json({
        success: false,
        message: isCapacityFull
          ? "This ceremony has reached maximum capacity."
          : "Bookings are currently closed for this ceremony.",
      });
    }

    // 3. Resolve PujaPackage
    const pkg = await PujaPackage.findOne({
      where: { id: packageId, pujaId: puja.id },
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Selected package tier was not found for this ceremony.",
      });
    }

    // 4. Validate Members Array
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least 1 devotee is required for the Sankalp.",
      });
    }

    const maxAllowed = Number(pkg.maxDevotees) || 1;
    if (members.length > maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxAllowed} devotee${maxAllowed > 1 ? "s are" : " is"} allowed for this package.`,
      });
    }

    // 5. Validate member fields
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m || !m.fullName || !m.fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: `Full name is required for Devotee #${i + 1}.`,
        });
      }
    }

    const primary = members[0];
    const primaryPhone = primary.mobileNumber || primary.phone;
    if (!primaryPhone || !primaryPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp / Mobile number is required for the primary devotee.",
      });
    }

    // 6. Generate reference and create booking
    const bookingReference = `VEDA-PUJA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const booking = await PujaBooking.create({
      bookingReference,
      pujaId: puja.id,
      packageId: pkg.id,
      userId: req.user ? req.user.id : null,
      amount: pkg.price,
      primaryDevoteeName: primary.fullName.trim(),
      primaryPhone: primaryPhone.trim(),
      primaryEmail: primary.email ? primary.email.trim() : null,
      devotees: members,
      sankalpPurpose: sankalpPurpose ? sankalpPurpose.trim() : null,
      shippingAddress: {
        city: city ? city.trim() : null,
        country: country ? country.trim() : "India",
      },
      bookingStatus: "Confirmed",
      paymentStatus: "Pending",
    });

    // 7. Increment puja booked count
    await puja.increment("bookedCount", { by: 1 });

    return res.status(201).json({
      success: true,
      message: "Sankalp booking recorded successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("Create puja booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to complete Sankalp booking. Please try again.",
    });
  }
};
