const Appointment = require("./../models/appoinmentModel");
const SessionNote = require("./../models/sessionNoteModel");

exports.getCouncellorDashboard = async (req, res) => {
  try {
    const councellorId = req.user.id;

    // ================= BASIC COUNTS =================
    const totalAppointments = await Appointment.countDocuments({
      councellorId,
    });

    const completedSessions = await Appointment.countDocuments({
      councellorId,
      status: "completed",
    });

    const todayDate = new Date().toISOString().split("T")[0];
    const upcomingSessions = await Appointment.countDocuments({
      councellorId,
      status: { $in: ["upcoming"] },
      slotDate: { $gte: todayDate },
    });

    // ================= UNIQUE CLIENTS =================
    const uniqueClients = await Appointment.distinct("clientId", {
      councellorId,
    });

    // ================= TODAY APPOINTMENTS =================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayAppointments = await Appointment.find({
      councellorId,
      createdAt: { $gte: today, $lt: tomorrow },
    }).populate("clientId", "name email");

    // ================= RECENT APPOINTMENTS =================
    const recentAppointments = await Appointment.find({
      councellorId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("clientId", "name");

    // ================= SESSION NOTES =================
    const recentNotes = await SessionNote.find({
      councellorId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("notes");

    // ================= EARNINGS =================
    const payments = await Appointment.find({
      councellorId,
    }).populate("amount");

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        completedSessions,
        upcomingSessions,
        totalClients: uniqueClients.length,
        totalEarnings,
      },
      todayAppointments,
      recentAppointments,
      recentNotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
