const sessionModel = require("../models/sessionModel");
const SessionNote = require("../models/sessionNoteModel");
const appointmentModel = require("../models/appoinmentModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const clientModel = require("../models/clientModel");
const councellorModel = require("../models/councellorModel");
const { sessionCompletedEmail } = require("./../emails/template");

/* ================= CREATE SESSION ================= */
exports.createSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        status: "Failed",
        message: "Appointment not found",
      });
    }

    const existingSession = await sessionModel.findOne({ appointmentId });
    if (existingSession) {
      return res.json({
        status: "Success",
        session: existingSession,
      });
    }

    const roomId = crypto.randomBytes(6).toString("hex");

    const session = await sessionModel.create({
      appointmentId,
      roomId,
      clientId: appointment.clientId,
      councellorId: appointment.councellorId,
      status: "created",
      startedAt: null,
      endedAt: null,
    });

    res.json({ status: "Success", session });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

/* ================= GET SESSION BY APPOINTMENT ================= */
exports.getSessionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const session = await sessionModel
      .findOne({ appointmentId })
      .populate("clientId", "name email image")
      .populate("councellorId", "name email image");

    if (!session) {
      return res.status(404).json({
        status: "Failed",
        message: "Session not found",
      });
    }

    res.json({ status: "Success", session });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

/* ================= JOIN SESSION (START TIMER) ================= */
exports.joinSession = async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await sessionModel.findOne({ roomId });
    if (!session) {
      return res.status(404).json({
        status: "Failed",
        message: "Session not found",
      });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({
        status: "Failed",
        message: "Session expired and has been cancelled",
      });
    }

    // ✅ START SESSION ONLY ONCE
    if (!session.startedAt) {
      session.startedAt = new Date();
      session.status = "ongoing";
      await session.save();

      const client = await clientModel.findById(session.clientId);
      const councellor = await councellorModel.findById(session.councellorId);

      await sendEmail({
        to: client.email,
        subject: "Your counseling session has started",
        text: `Hi ${client.name},
Your session with ${councellor.name} has started.`,
      });

      await sendEmail({
        to: councellor.email,
        subject: "Counseling session started",
        text: `Hi ${councellor.name},
Your session with ${client.name} has started.`,
      });
    }

    res.json({ status: "Success", session });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

/* ================= END SESSION (STOP TIMER) ================= */
exports.endSession = async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await sessionModel.findOne({ roomId });
    if (!session) {
      return res.status(404).json({
        status: "Failed",
        message: "Session not found",
      });
    }

    // ⛔ prevent double end
    if (session.status === "completed") {
      return res.json({
        status: "Success",
        message: "Session already completed",
      });
    }

    session.endedAt = new Date();
    session.status = "completed";
    await session.save();

    await appointmentModel.findByIdAndUpdate(session.appointmentId, {
      status: "completed",
    });

    const client = await clientModel.findById(session.clientId);
    const councellor = await councellorModel.findById(session.councellorId);

    const duration =
      session.startedAt && session.endedAt
        ? Math.floor((session.endedAt - session.startedAt) / 60000)
        : 0;

    await sendEmail({
      to: client.email,
      subject: "Session completed",
      html: sessionCompletedEmail({
        name: client.name,
        attender: councellor.name,
      }),
      text: `Hi ${client.name},
Your session with ${councellor.name} is completed.
Duration: ${duration} minutes.`,
    });

    await sendEmail({
      to: councellor.email,
      subject: "Session completed",
      html: sessionCompletedEmail({
        name: councellor.name,
        attender: client.name,
      }),
      text: `Hi ${councellor.name},
Session with ${client.name} completed.
Duration: ${duration} minutes.`,
    });

    res.json({
      status: "Success",
      message: "Session ended successfully",
      duration,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

/* ================= SESSION HISTORY ================= */
exports.getSessionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const filter =
      role === "client"
        ? { clientId: userId, status: "completed" }
        : { councellorId: userId, status: "completed" };

    const sessions = await sessionModel
      .find(filter)
      .populate("clientId", "name image")
      .populate("councellorId", "name image")
      .sort({ endedAt: -1 });

    const history = await Promise.all(
      sessions.map(async (session) => {
        const note = await SessionNote.findOne({ sessionId: session._id });

        const duration =
          session.startedAt && session.endedAt
            ? Math.floor((session.endedAt - session.startedAt) / 1000)
            : 0;

        return {
          _id: session._id,
          roomId: session.roomId,
          date: session.startedAt,
          duration,
          client: session.clientId,
          councellor: session.councellorId,
          notes: note?.notes || null,

          // ✅ ADD THIS
          attachments: note?.attachments || [],
        };
      }),
    );

    res.json({ status: "Success", history });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};
