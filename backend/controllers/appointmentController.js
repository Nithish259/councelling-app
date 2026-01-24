const appointmentModel = require("../models/appoinmentModel");

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentModel
      .findById(req.params.id)
      .populate("clientId", "name email image")
      .populate("councellorId", "name email image speciality");

    if (!appointment) {
      return res.status(404).json({
        status: "Failed",
        message: "Appointment not found",
      });
    }

    res.json({
      status: "Success",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
