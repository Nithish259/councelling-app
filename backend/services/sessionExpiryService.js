const sessionModel = require("../models/sessionModel");
const appointmentModel = require("../models/appoinmentModel");

exports.expireOldSessions = async () => {
  try {
    const now = new Date();

    // Only sessions that haven't started
    const sessions = await sessionModel.find({
      status: { $in: ["upcoming"] },
    });

    for (const session of sessions) {
      const appointment = await appointmentModel.findById(
        session.appointmentId,
      );
      if (!appointment) continue;

      const sessionDateTime = new Date(
        `${appointment.slotDate} ${appointment.slotTime}`,
      );

      const cancelTime = new Date(sessionDateTime.getTime() + 30 * 60 * 1000);

      if (now > cancelTime) {
        session.status = "cancelled";
        session.endedAt = new Date();
        await session.save();

        await appointmentModel.findByIdAndUpdate(session.appointmentId, {
          status: "cancelled",
        });

        console.log(`Session ${session._id} auto-cancelled`);
      }
    }
  } catch (err) {
    console.error("Session expiry job failed:", err.message);
  }
};
