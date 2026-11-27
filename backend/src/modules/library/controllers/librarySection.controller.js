import LibrarySectionService from "../services/librarySection.service.js";

export const getPublicSections = async (_req, res) => {
  try {
    const sections = await LibrarySectionService.getSections(false);
    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Error in getPublicSections:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch library sections",
    });
  }
};

export const getAdminSections = async (_req, res) => {
  try {
    const sections = await LibrarySectionService.getSections(true);
    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Error in getAdminSections:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch library sections",
    });
  }
};

export const createAdminSection = async (req, res) => {
  try {
    const section = await LibrarySectionService.createSection(req.body);
    return res.status(201).json({
      success: true,
      data: section,
      message: "Library section created successfully",
    });
  } catch (error) {
    console.error("Error in createAdminSection:", error);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Failed to create library section",
    });
  }
};

export const deleteAdminSection = async (req, res) => {
  try {
    const { id } = req.params;
    await LibrarySectionService.deleteSection(id);
    return res.status(200).json({
      success: true,
      message: "Library section removed successfully",
    });
  } catch (error) {
    console.error("Error in deleteAdminSection:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete library section",
    });
  }
};
