const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Online Counseling Platform",
          email: process.env.SMTP_USER, // MUST be verified in Brevo
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Email send failed:", error.response?.data || error.message);
  }
};

module.exports = sendEmail;
