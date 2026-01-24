const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const { getAppointmentById } = require("../controllers/appointmentController");

const router = express.Router();

router.get(
  "/:id",
  auth,
  allowRoles("client", "councellor"),
  getAppointmentById,
);

module.exports = router;
