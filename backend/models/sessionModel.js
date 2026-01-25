const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appoinment",
      required: true,
    },

    roomId: {
      type: String,
      required: true,
      unique: true,
    },

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

    status: {
      type: String,
      enum: ["created", "ongoing", "completed", "cancelled"], // 👈 added
      default: "created",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("session", sessionSchema);
