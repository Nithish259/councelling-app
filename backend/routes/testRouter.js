const express = require("express");
const sendEmail = require("./../utils/sendEmail");

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "nithishpini@gmail.com",
      subject: "Test Email",
      html: "<p>Hello from Brevo test!</p>",
    });
    res.send("Email sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed: " + err.message);
  }
});

module.exports = router;
