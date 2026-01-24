const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const upload = require("../middlewares/multer");

const {
  registerCouncellor,
  loginCouncellor,
  getCouncellorProfile,
  updateCouncellorProfile,
  getCouncellorAppointments,
} = require("../controllers/councellorController");
const {
  getCouncellorDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", registerCouncellor);
router.post("/login", loginCouncellor);

/* ================= PROFILE ================= */
router.get("/getProfile", auth, allowRoles("councellor"), getCouncellorProfile);
router.post(
  "/updateProfile",
  auth,
  allowRoles("councellor"),
  upload.single("image"),
  updateCouncellorProfile,
);

/* ================= APPOINTMENTS ================= */
router.get(
  "/appointments",
  auth,
  allowRoles("councellor"),
  getCouncellorAppointments,
);

router.get(
  "/dashboard",
  auth,
  allowRoles("councellor"),
  getCouncellorDashboard,
);

module.exports = router;
