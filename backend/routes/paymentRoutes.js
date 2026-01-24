const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", auth, allowRoles("client"), createOrder);

router.post("/verify", auth, allowRoles("client"), verifyPayment);

module.exports = router;
