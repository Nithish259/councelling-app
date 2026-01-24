const express = require("express");
const router = express.Router();
const {
  getConversationByAppointment,
  getMessages,
} = require("./../controllers/chatController");

const authMiddleware = require("./../middlewares/auth");

router.get(
  "/conversation/:appointmentId",
  authMiddleware,
  getConversationByAppointment,
);

router.get("/messages/:conversationId", authMiddleware, getMessages);

module.exports = router;
