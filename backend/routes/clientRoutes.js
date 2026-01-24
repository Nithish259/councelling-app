const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const upload = require("../middlewares/multer");

const {
  registerClient,
  loginClient,
  getProfile,
  updateProfile,
  getClientAppointments,
  getCouncellors,
} = require("../controllers/clientController");

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", registerClient);
router.post("/login", loginClient);

/* ================= PROFILE ================= */
router.get("/getProfile", auth, allowRoles("client"), getProfile);

router.post(
  "/updateProfile",
  auth,
  allowRoles("client"),
  upload.single("image"),
  updateProfile,
);

/* ================= APPOINTMENTS ================= */
router.get("/appointments", auth, allowRoles("client"), getClientAppointments);

/* ================= COUNSELLORS ================= */
router.get("/getCouncellors", getCouncellors);

module.exports = router;
