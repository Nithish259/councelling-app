const mongoose = require("mongoose");

const councellorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  speciality: {
    type: String,
    required: true,
  },

  fees: {
    type: Number,
    required: true,
  },

  degree: {
    type: String,
    default: "",
  },

  experience: {
    type: String,
    default: "",
  },

  about: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
  },

  address: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
  },

  available: {
    type: Boolean,
    default: true,
  },

  // ✅ FIXED FIELD NAME
  slots_booked: {
    type: Object,
    default: {},
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("councellor", councellorSchema);
