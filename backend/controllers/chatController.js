const Conversation = require("./../models/conversationModel");
const Message = require("./../models/messageModel");
const Appointment = require("../models/appoinmentModel");

/**
 * GET conversation by appointment
 */

exports.getConversationByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // 1️⃣ Check appointment exists
    const appointment = await Appointment.findById(appointmentId).select(
      "clientId councellorId",
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2️⃣ Find or create conversation
    let conversation = await Conversation.findOne({ appointmentId });

    if (!conversation) {
      conversation = await Conversation.create({
        appointmentId: appointment._id,
        clientId: appointment.clientId,
        councellorId: appointment.councellorId,
      });
    }

    // 3️⃣ 🔥 FETCH MESSAGES FROM Message COLLECTION
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 }); // oldest → newest

    return res.json({
      conversationId: conversation._id,
      messages,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * GET messages of a conversation
 */
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate("senderId", "name role");

  res.json(messages);
};
