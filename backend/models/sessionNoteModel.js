const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  publicId: String,
  url: String,
  originalName: String,
  resourceType: String,
});

const sessionNoteSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    councellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Councellor",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: String,
    attachments: [attachmentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("SessionNote", sessionNoteSchema);
