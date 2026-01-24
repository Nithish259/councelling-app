const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
    required: true,
  },

  councellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "councellor",
    required: true,
  },

  slotDate: {
    type: String, // "2026-01-18"
    required: true,
  },

  slotTime: {
    type: String, // "10:30 AM"
    required: true,
  },

  amount: {
    type: Number, // payment amount
    required: true,
  },

  paymentId: {
    type: String, // Razorpay payment id
    required: true,
  },

  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },

  meetingRoomId: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

module.exports = appointmentModel;
