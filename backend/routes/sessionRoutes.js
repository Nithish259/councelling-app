const express = require("express");
const authClient = require("../middlewares/authClient");
const authCouncellor = require("../middlewares/authCouncellors");
const {
  createSession,
  getSessionByAppointment,
  joinSession,
  endSession,
  getSessionHistory,
} = require("../controllers/sessionController");
const auth = require("../middlewares/auth");

const router = express.Router();

/* CREATE SESSION (Counsellor only) */
router.post("/create", authCouncellor, createSession);

/* GET SESSION BY APPOINTMENT */
router.get("/appointment/:appointmentId", authClient, getSessionByAppointment);
router.get(
  "/appointment/:appointmentId",
  authCouncellor,
  getSessionByAppointment,
);

/* END SESSION (both roles allowed) */
router.post("/end/:roomId", authClient, endSession);
router.post("/end/:roomId", authCouncellor, endSession);

/* JOIN SESSION */
router.get("/join/:roomId", authClient, joinSession);
router.get("/join/:roomId", authCouncellor, joinSession);

// GET SESSION HISTORY
router.get("/history", auth, getSessionHistory);

module.exports = router;
