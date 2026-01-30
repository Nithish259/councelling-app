const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const councellorModel = require("../models/councellorModel");
const appointmentModel = require("../models/appoinmentModel");
const validator = require("validator");

const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("one number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("one special character");

  return errors;
};

/* ================= REGISTER COUNSELLOR ================= */
exports.registerCouncellor = async (req, res) => {
  try {
    const { name, email, password, speciality, fees } = req.body;

    // ✅ Missing fields
    if (!name || !email || !password || !speciality || !fees) {
      return res
        .status(400)
        .json({ status: "Fail", message: "All fields are required" });
    }

    // ✅ Email validation
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Invalid email address" });
    }

    // ✅ Password validation with detailed message
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        status: "Fail",
        message: `Password must contain ${passwordErrors.join(", ")}`,
      });
    }

    // ✅ Existing user check
    const existing = await councellorModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Counsellor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const councellor = await councellorModel.create({
      name,
      email,
      password: hashedPassword,
      speciality,
      fees,
    });

    const token = jwt.sign(
      { id: councellor._id, role: "councellor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      status: "Success",
      token,
      role: "councellor",
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};


/* ================= LOGIN COUNSELLOR ================= */
exports.loginCouncellor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const councellor = await councellorModel.findOne({ email });
    if (!councellor)
      return res
        .status(400)
        .json({ status: "Fail", message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, councellor.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "Fail", message: "Invalid credentials" });

    const token = jwt.sign(
      { id: councellor._id, role: "councellor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ status: "Success", token, role: "councellor" });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= GET COUNSELLOR PROFILE ================= */
exports.getCouncellorProfile = async (req, res) => {
  try {
    const councellor = await councellorModel
      .findById(req.user.id)
      .select("-password");

    res.json({ status: "Success", councellor });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= UPDATE COUNSELLOR PROFILE ================= */
exports.updateCouncellorProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ If image uploaded
    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "counsellor_profiles" }, // optional folder
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadResult = await uploadFromBuffer();
      updateData.image = uploadResult.secure_url;
    }

    const updated = await councellorModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true },
    );

    res.json({
      status: "Success",
      message: "Profile updated",
      councellor: updated,
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

/* ================= GET COUNSELLOR APPOINTMENTS ================= */
exports.getCouncellorAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ councellorId: req.user.id })
      .populate("clientId", "name email image")
      .sort({ createdAt: -1 });

    res.json({ status: "Success", appointments });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};
