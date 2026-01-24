const Razorpay = require("razorpay");
const crypto = require("crypto");
const appointmentModel = require("../models/appoinmentModel");
const councellorModel = require("../models/councellorModel");
const clientModel = require("../models/clientModel");
const sendEmail = require("./../utils/sendEmail");
const { bookingEmail, paymentEmail } = require("./../emails/template");
const conversationModel = require("../models/conversationModel");

const createOrder = async (req, res) => {
  try {
    const { councellorId, slotDate, slotTime } = req.body;

    const councellor = await councellorModel.findById(councellorId);
    if (!councellor)
      return res
        .status(404)
        .json({ status: "Failed", message: "Counsellor not found" });

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInRupee = councellor.fees * 100;

    const options = {
      amount: amountInRupee,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ status: "Success", order });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      councellorId,
      slotDate,
      slotTime,
    } = req.body;

    const clientId = req.user.id;

    /* ================= VERIFY SIGNATURE ================= */
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: "Failed",
        message: "Payment verification failed",
      });
    }

    /* ================= FIND USERS ================= */
    const councellor = await councellorModel.findById(councellorId);
    const client = await clientModel.findById(clientId);

    if (!councellor || !client) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
    }

    /* ================= ATOMIC SLOT BOOKING ================= */
    const updateResult = await councellorModel.updateOne(
      {
        _id: councellorId,
        [`slots_booked.${slotDate}`]: { $ne: slotTime }, // ❌ prevent duplicate slot
      },
      {
        $push: { [`slots_booked.${slotDate}`]: slotTime }, // ✅ add slot atomically
      },
    );

    // If no document modified → slot already booked
    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        status: "Failed",
        message: "Slot already booked",
      });
    }

    /* ================= CREATE APPOINTMENT ================= */
    const appointment = await appointmentModel.create({
      clientId,
      councellorId,
      slotDate,
      slotTime,
      amount: councellor.fees,
      paymentId: razorpay_payment_id,
      status: "upcoming",
    });

    /* ================= CREATE CHAT CONVERSATION ================= */
    await conversationModel.create({
      appointmentId: appointment._id,
      clientId: appointment.clientId,
      councellorId: appointment.councellorId,
    });

    /* ================= SEND EMAILS ================= */

    // Payment success email
    await sendEmail({
      to: client.email,
      subject: "Payment Successful",
      html: paymentEmail({ name: client.name, amount: councellor.fees }),
      text: `Hi ${client.name},\n\nYour payment of ₹${councellor.fees} has been successfully received.\n\nThanks,\nOnline Counseling Platform`,
    });

    // Booking confirmation email
    await sendEmail({
      to: client.email,
      subject: "Appointment Confirmed",
      html: bookingEmail({
        name: client.name,
        date: slotDate,
        time: slotTime,
        counsellor: councellor.name,
      }),
      text: `Hi ${client.name},\n\nYour appointment with ${councellor.name} is confirmed on ${slotDate} at ${slotTime}.\n\nThanks,\nOnline Counseling Platform`,
    });

    /* ================= SUCCESS RESPONSE ================= */
    res.status(200).json({
      status: "Success",
      message: "Payment verified, slot booked, appointment created",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
