import { Op } from "sequelize";
import { Astrologer, AstrologerPackage, Booking } from "../models/index.js";
import { serializeAdminAstrologerPackage } from "../serializers/astrologer.serializer.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PACKAGE_KEY_REGEX = /^[a-zA-Z0-9_-]{2,50}$/;

const findAstrologerByIdOrIdentifier = async (identifier) => {
  if (!identifier) return null;
  const cleanId = String(identifier).trim();

  if (UUID_REGEX.test(cleanId)) {
    const byPk = await Astrologer.findByPk(cleanId);
    if (byPk) return byPk;
  }

  // Fallback lookup by code or slug
  return await Astrologer.findOne({
    where: {
      [Op.or]: [{ code: cleanId }, { slug: cleanId }],
    },
  });
};

const findPackageForAstrologer = async (packageId, astrologerId) => {
  if (!packageId) return null;
  const cleanId = String(packageId).trim();

  if (UUID_REGEX.test(cleanId)) {
    const byPk = await AstrologerPackage.findOne({
      where: {
        id: cleanId,
        astrologerId,
      },
    });
    if (byPk) return byPk;
  }

  // Fallback lookup by packageKey
  return await AstrologerPackage.findOne({
    where: {
      packageKey: cleanId,
      astrologerId,
    },
  });
};

/**
 * GET /api/admin/astrologers/:id/packages
 * List all packages for an astrologer (active and inactive)
 */
export const getAdminAstrologerPackages = async (req, res) => {
  try {
    const { id } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const { search, isActive, sortBy = "displayOrder-asc" } = req.query;
    const where = {
      astrologerId: astrologer.id,
    };

    // 1. Status Filter
    if (typeof isActive !== "undefined" && isActive !== "") {
      if (isActive === "true" || isActive === true) {
        where.isActive = true;
      } else if (isActive === "false" || isActive === false) {
        where.isActive = false;
      }
    }

    // 2. Search Filter
    if (search && typeof search === "string" && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: term } },
        { packageKey: { [Op.iLike]: term } },
        { subtitle: { [Op.iLike]: term } },
        { duration: { [Op.iLike]: term } },
      ];
    }

    // 3. Sorting
    let order = [
      ["displayOrder", "ASC"],
      ["price", "ASC"],
    ];
    if (sortBy === "price-asc") {
      order = [["price", "ASC"]];
    } else if (sortBy === "price-desc") {
      order = [["price", "DESC"]];
    } else if (sortBy === "title-asc") {
      order = [["title", "ASC"]];
    } else if (sortBy === "title-desc") {
      order = [["title", "DESC"]];
    } else if (sortBy === "created-newest") {
      order = [["createdAt", "DESC"]];
    } else if (sortBy === "created-oldest") {
      order = [["createdAt", "ASC"]];
    }

    const packages = await AstrologerPackage.findAll({
      where,
      order,
    });

    const data = packages.map(serializeAdminAstrologerPackage);

    return res.status(200).json({
      success: true,
      count: data.length,
      astrologer: {
        id: astrologer.id,
        code: astrologer.code,
        slug: astrologer.slug,
        name: astrologer.name,
      },
      data,
    });
  } catch (error) {
    console.error("Admin: Error fetching astrologer packages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load packages catalogue for astrologer.",
    });
  }
};

/**
 * GET /api/admin/astrologers/:id/packages/:packageId
 * Get single package details for an astrologer
 */
export const getAdminAstrologerPackageById = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const pkg = await findPackageForAstrologer(packageId, astrologer.id);

    if (!pkg) {
      // Check if package exists under another astrologer (cross-astrologer safety check)
      const existsElsewhere = UUID_REGEX.test(packageId)
        ? await AstrologerPackage.findByPk(packageId)
        : await AstrologerPackage.findOne({ where: { packageKey: packageId } });

      if (existsElsewhere) {
        return res.status(404).json({
          success: false,
          message: `Package '${packageId}' does not belong to astrologer '${astrologer.name}'.`,
        });
      }

      return res.status(404).json({
        success: false,
        message: `Package '${packageId}' was not found for this astrologer.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeAdminAstrologerPackage(pkg),
    });
  } catch (error) {
    console.error("Admin: Error fetching package details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load package details.",
    });
  }
};

/**
 * POST /api/admin/astrologers/:id/packages
 * Create a new consultation package for an astrologer
 */
export const createAdminAstrologerPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const body = req.body || {};

    // 1. Validate packageKey
    if (!body.packageKey || typeof body.packageKey !== "string" || !body.packageKey.trim()) {
      return res.status(400).json({
        success: false,
        message: "packageKey is required and must be a non-empty string.",
      });
    }
    const cleanPackageKey = body.packageKey.trim().toLowerCase();
    if (!PACKAGE_KEY_REGEX.test(cleanPackageKey)) {
      return res.status(400).json({
        success: false,
        message: "packageKey must contain only alphanumeric characters, dashes, and underscores (2-50 characters).",
      });
    }

    // Check unique key for this astrologer
    const existingKey = await AstrologerPackage.findOne({
      where: {
        astrologerId: astrologer.id,
        packageKey: cleanPackageKey,
      },
    });
    if (existingKey) {
      return res.status(409).json({
        success: false,
        message: `Package key '${cleanPackageKey}' already exists for this astrologer.`,
      });
    }

    // 2. Validate Title
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be a non-empty string.",
      });
    }
    const cleanTitle = body.title.trim();
    if (cleanTitle.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 150 characters.",
      });
    }

    // 3. Validate Duration
    if (!body.duration || typeof body.duration !== "string" || !body.duration.trim()) {
      return res.status(400).json({
        success: false,
        message: "Duration is required and must be a non-empty string (e.g. '30 Minutes').",
      });
    }
    const cleanDuration = body.duration.trim();
    if (cleanDuration.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Duration cannot exceed 100 characters.",
      });
    }

    // 4. Validate Price
    if (body.price === undefined || body.price === null || body.price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required and must be a non-negative number.",
      });
    }
    const cleanPrice = parseFloat(body.price);
    if (isNaN(cleanPrice) || cleanPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number (>= 0).",
      });
    }

    // 5. Validate Original Price (optional)
    let cleanOriginalPrice = null;
    if (body.originalPrice !== undefined && body.originalPrice !== null && body.originalPrice !== "") {
      cleanOriginalPrice = parseFloat(body.originalPrice);
      if (isNaN(cleanOriginalPrice) || cleanOriginalPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Original price must be a valid non-negative number when specified.",
        });
      }
    }

    // 6. Optional string/boolean fields
    const subtitle = typeof body.subtitle === "string" ? body.subtitle.trim() : null;
    const isPopular = Boolean(body.isPopular);
    const badge = typeof body.badge === "string" && body.badge.trim() ? body.badge.trim() : null;

    // 7. Array fields
    let knownFor = [];
    if (body.knownFor !== undefined) {
      if (!Array.isArray(body.knownFor)) {
        return res.status(400).json({
          success: false,
          message: "knownFor must be an array of strings.",
        });
      }
      knownFor = body.knownFor.map(String).map((s) => s.trim()).filter(Boolean);
    }

    let consultationDetails = [];
    if (body.consultationDetails !== undefined) {
      if (!Array.isArray(body.consultationDetails)) {
        return res.status(400).json({
          success: false,
          message: "consultationDetails must be an array of strings.",
        });
      }
      consultationDetails = body.consultationDetails
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 8. Display Order & Active status
    let displayOrder = 0;
    if (body.displayOrder !== undefined) {
      const orderNum = parseInt(body.displayOrder, 10);
      if (isNaN(orderNum) || orderNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Display order must be a non-negative integer.",
        });
      }
      displayOrder = orderNum;
    } else {
      const existingCount = await AstrologerPackage.count({
        where: { astrologerId: astrologer.id },
      });
      displayOrder = existingCount;
    }

    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    // Reject protected field tampering attempts
    // (id, astrologerId are strictly controlled server-side)
    const newPackage = await AstrologerPackage.create({
      astrologerId: astrologer.id,
      packageKey: cleanPackageKey,
      title: cleanTitle,
      subtitle,
      duration: cleanDuration,
      price: cleanPrice,
      originalPrice: cleanOriginalPrice,
      isPopular,
      badge,
      knownFor,
      consultationDetails,
      displayOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Consultation package created successfully.",
      data: serializeAdminAstrologerPackage(newPackage),
    });
  } catch (error) {
    console.error("Admin: Error creating astrologer package:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create consultation package.",
    });
  }
};

/**
 * PATCH /api/admin/astrologers/:id/packages/:packageId
 * PUT /api/admin/astrologers/:id/packages/:packageId
 * Update an existing package
 */
export const updateAdminAstrologerPackage = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const pkg = await findPackageForAstrologer(packageId, astrologer.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package '${packageId}' was not found for this astrologer.`,
      });
    }

    const body = req.body || {};
    const updates = {};

    // 1. packageKey (if changing)
    if (body.packageKey !== undefined) {
      if (typeof body.packageKey !== "string" || !body.packageKey.trim()) {
        return res.status(400).json({
          success: false,
          message: "packageKey must be a non-empty string.",
        });
      }
      const cleanKey = body.packageKey.trim().toLowerCase();
      if (!PACKAGE_KEY_REGEX.test(cleanKey)) {
        return res.status(400).json({
          success: false,
          message: "packageKey must contain only alphanumeric characters, dashes, and underscores (2-50 characters).",
        });
      }
      if (cleanKey !== pkg.packageKey) {
        const inUse = await AstrologerPackage.findOne({
          where: {
            astrologerId: astrologer.id,
            packageKey: cleanKey,
            id: { [Op.ne]: pkg.id },
          },
        });
        if (inUse) {
          return res.status(409).json({
            success: false,
            message: `Package key '${cleanKey}' is already used by another package for this astrologer.`,
          });
        }
        updates.packageKey = cleanKey;
      }
    }

    // 2. Title
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string.",
        });
      }
      const cleanTitle = body.title.trim();
      if (cleanTitle.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 150 characters.",
        });
      }
      updates.title = cleanTitle;
    }

    // 3. Subtitle
    if (body.subtitle !== undefined) {
      updates.subtitle =
        typeof body.subtitle === "string" && body.subtitle.trim()
          ? body.subtitle.trim()
          : null;
    }

    // 4. Duration
    if (body.duration !== undefined) {
      if (typeof body.duration !== "string" || !body.duration.trim()) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a non-empty string.",
        });
      }
      const cleanDur = body.duration.trim();
      if (cleanDur.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Duration cannot exceed 100 characters.",
        });
      }
      updates.duration = cleanDur;
    }

    // 5. Price
    if (body.price !== undefined) {
      const p = parseFloat(body.price);
      if (isNaN(p) || p < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number.",
        });
      }
      updates.price = p;
    }

    // 6. Original Price
    if (body.originalPrice !== undefined) {
      if (body.originalPrice === null || body.originalPrice === "") {
        updates.originalPrice = null;
      } else {
        const op = parseFloat(body.originalPrice);
        if (isNaN(op) || op < 0) {
          return res.status(400).json({
            success: false,
            message: "Original price must be a valid non-negative number when specified.",
          });
        }
        updates.originalPrice = op;
      }
    }

    // 7. Popular / Badge
    if (body.isPopular !== undefined) {
      updates.isPopular = Boolean(body.isPopular);
    }

    if (body.badge !== undefined) {
      updates.badge =
        typeof body.badge === "string" && body.badge.trim() ? body.badge.trim() : null;
    }

    // 8. KnownFor array
    if (body.knownFor !== undefined) {
      if (!Array.isArray(body.knownFor)) {
        return res.status(400).json({
          success: false,
          message: "knownFor must be an array of strings.",
        });
      }
      updates.knownFor = body.knownFor
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 9. ConsultationDetails array
    if (body.consultationDetails !== undefined) {
      if (!Array.isArray(body.consultationDetails)) {
        return res.status(400).json({
          success: false,
          message: "consultationDetails must be an array of strings.",
        });
      }
      updates.consultationDetails = body.consultationDetails
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // 10. Display Order
    if (body.displayOrder !== undefined) {
      const ord = parseInt(body.displayOrder, 10);
      if (isNaN(ord) || ord < 0) {
        return res.status(400).json({
          success: false,
          message: "Display order must be a non-negative integer.",
        });
      }
      updates.displayOrder = ord;
    }

    // 11. Active status
    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

    // Explicitly reject tampering with protected fields: id, astrologerId, createdAt, updatedAt
    // (These are strictly omitted from updates)
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid or supported package fields were provided to update.",
      });
    }

    await pkg.update(updates);

    return res.status(200).json({
      success: true,
      message: "Consultation package updated successfully.",
      data: serializeAdminAstrologerPackage(pkg),
    });
  } catch (error) {
    console.error("Admin: Error updating astrologer package:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update consultation package.",
    });
  }
};

/**
 * PATCH /api/admin/astrologers/:id/packages/:packageId/status
 * Quick toggle or explicit active status update
 */
export const updateAdminAstrologerPackageStatus = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const { isActive } = req.body || {};

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Field 'isActive' must be a boolean (true or false).",
      });
    }

    const astrologer = await findAstrologerByIdOrIdentifier(id);
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const pkg = await findPackageForAstrologer(packageId, astrologer.id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package '${packageId}' was not found for this astrologer.`,
      });
    }

    await pkg.update({ isActive });

    return res.status(200).json({
      success: true,
      message: `Package '${pkg.title}' has been ${isActive ? "activated" : "deactivated"}.`,
      data: {
        id: pkg.id,
        packageKey: pkg.packageKey,
        isActive: pkg.isActive,
      },
    });
  } catch (error) {
    console.error("Admin: Error updating package status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update package status.",
    });
  }
};

/**
 * DELETE /api/admin/astrologers/:id/packages/:packageId
 * Safe delete: verifies no historical customer bookings reference this package
 */
export const deleteAdminAstrologerPackage = async (req, res) => {
  try {
    const { id, packageId } = req.params;
    const astrologer = await findAstrologerByIdOrIdentifier(id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: `Astrologer '${id}' was not found.`,
      });
    }

    const pkg = await findPackageForAstrologer(packageId, astrologer.id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package '${packageId}' was not found for this astrologer.`,
      });
    }

    // Safety check: ensure no bookings reference this packageKey
    const bookingCount = await Booking.count({
      where: {
        [Op.or]: [
          { packageId: pkg.packageKey },
          { packageId: pkg.id },
        ],
      },
    });

    if (bookingCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete package '${pkg.title}' because ${bookingCount} customer booking(s) reference it. Please deactivate the package instead to preserve booking audit trails.`,
      });
    }

    const deletedInfo = {
      id: pkg.id,
      packageKey: pkg.packageKey,
      title: pkg.title,
    };

    await pkg.destroy();

    return res.status(200).json({
      success: true,
      message: `Package '${deletedInfo.title}' was successfully removed.`,
      data: deletedInfo,
    });
  } catch (error) {
    console.error("Admin: Error deleting package:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete consultation package.",
    });
  }
};
