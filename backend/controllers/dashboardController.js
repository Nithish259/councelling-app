const Appointment = require("./../models/appoinmentModel");
const SessionNote = require("./../models/sessionNoteModel");

exports.getCouncellorDashboard = async (req, res) => {
  try {
    const councellorId = req.user.id;

    /* ================= BASIC COUNTS ================= */

    const totalAppointments = await Appointment.countDocuments({
      councellorId,
    });

    const completedSessions = await Appointment.countDocuments({
      councellorId,
      status: "completed",
    });

    const todayStr = new Date().toISOString().split("T")[0];

    const upcomingSessions = await Appointment.countDocuments({
      councellorId,
      status: "upcoming",
      slotDate: { $gte: todayStr },
    });

    /* ================= UNIQUE CLIENTS ================= */

    const uniqueClients = await Appointment.distinct("clientId", {
      councellorId,
    });

    /* ================= TODAY APPOINTMENTS ================= */

    const todayAppointments = await Appointment.find({
      councellorId,
      slotDate: todayStr,
    })
      .sort({ slotTime: 1 })
      .populate("clientId", "name email");

    /* ================= RECENT APPOINTMENTS ================= */

    const recentAppointments = await Appointment.find({ councellorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("clientId", "name");

    /* ================= SESSION NOTES ================= */

    const recentNotes = await SessionNote.find({ councellorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("clientId", "name"); // FIXED

    /* ================= EARNINGS ================= */

    const earningsData = await Appointment.find({
      councellorId,
      status: "completed",
    }).select("amount");

    const totalEarnings = earningsData.reduce(
      (sum, appt) => sum + (appt.amount || 0),
      0,
    );

    /* ================= WEEKLY SESSIONS (FOR LINE CHART) ================= */

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklySessions = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const count = await Appointment.countDocuments({
        councellorId,
        slotDate: dateStr,
        status: "completed",
      });

      weeklySessions.push({
        day: days[d.getDay()],
        sessions: count,
      });
    }

    /* ================= RESPONSE ================= */

    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        completedSessions,
        upcomingSessions,
        totalClients: uniqueClients.length,
        totalEarnings,
        weeklySessions,
      },
      todayAppointments,
      recentAppointments,
      recentNotes,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
