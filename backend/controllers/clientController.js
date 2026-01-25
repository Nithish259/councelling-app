const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");

const clientModel = require("../models/clientModel");
const appointmentModel = require("../models/appoinmentModel");
const councellorModel = require("../models/councellorModel");

/* ================= REGISTER CLIENT ================= */
exports.registerClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ status: "Fail", message: "Missing fields" });

    if (!validator.isEmail(email))
      return res.status(400).json({ status: "Fail", message: "Invalid email" });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ status: "Fail", message: "Weak password" });

    const existing = await clientModel.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ status: "Fail", message: "Client already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await clientModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: client._id, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      status: "Success",
      token,
      role: "client",
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= LOGIN CLIENT ================= */
exports.loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await clientModel.findOne({ email });
    if (!client)
      return res
        .status(400)
        .json({ status: "Fail", message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "Fail", message: "Invalid credentials" });

    const token = jwt.sign(
      { id: client._id, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ status: "Success", token, role: "client" });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= GET CLIENT PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const client = await clientModel.findById(req.user.id).select("-password");

    res.json({ status: "Success", clientData: client });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= UPDATE CLIENT PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: address ? JSON.parse(address) : undefined,
    };

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      updateData.image = upload.secure_url;
    }

    await clientModel.findByIdAndUpdate(req.user.id, updateData);

    res.json({ status: "Success", message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= GET CLIENT APPOINTMENTS ================= */
exports.getClientAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ clientId: req.user.id })
      .populate("councellorId", "name speciality image")
      .sort({ createdAt: -1 });

    res.json({ status: "Success", appointments });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= GET ALL COUNSELLORS ================= */
exports.getCouncellors = async (req, res) => {
  try {
    const councellors = await councellorModel
      .find({ available: true })
      .select("-password");

    res.json({ status: "Success", councellors });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};
