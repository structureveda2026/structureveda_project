import Consultation from "../models/consultationModel.js";

export const createConsultation = async (req, res) => {
  try {
    const { fullName, age, phone, email, dateOfBirth, timeOfBirth, message } =
      req.body;

    if (
      !fullName ||
      !age ||
      !phone ||
      !email ||
      !dateOfBirth ||
      !timeOfBirth ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All consultation fields are required",
      });
    }

    const consultation = await Consultation.create({
      fullName: fullName.trim(),
      age,
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth,
      timeOfBirth,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully",
      data: consultation,
    });
  } catch (error) {
    console.error("Create consultation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the consultation request",
    });
  }
};

export const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error("Get consultations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load consultation requests",
    });
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error("Get consultation by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load consultation request",
    });
  }
};

export const markConsultationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation request not found",
      });
    }

    await consultation.update({ isRead: true });

    return res.status(200).json({
      success: true,
      message: "Consultation request marked as read",
      data: consultation,
    });
  } catch (error) {
    console.error("Mark consultation read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update consultation request",
    });
  }
};
