const SessionNote = require("../models/sessionNoteModel");
const sessionModel = require("../models/sessionModel");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const path = require("path");

exports.uploadAttachment = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const session = await sessionModel.findOne({ roomId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Authorization
    if (session.councellorId.toString() !== req.councellorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const isPdf = req.file.mimetype === "application/pdf";
    const isImage = req.file.mimetype.startsWith("image/");
    const isTxt = req.file.mimetype === "text/plain";

    if (!isPdf && !isImage && !isTxt) {
      // ✅ UPDATED
      return res
        .status(400)
        .json({ message: "Only images, PDFs, and TXT files are allowed" });
    }

    // Generate a unique filename but keep extension
    const ext = path.extname(req.file.originalname);
    const baseName = path.basename(req.file.originalname, ext);
    const uniqueName = `${baseName}_${Date.now()}${ext}`;

    // Convert buffer to base64 for upload
    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "counselling/session-notes",
      resource_type: isImage ? "image" : "raw", // ✅ UPDATED (txt + pdf = raw)
      use_filename: true,
      unique_filename: false,
      public_id: `counselling/session-notes/${uniqueName}`,
    });

    // Save to DB
    const note = await SessionNote.findOneAndUpdate(
      { sessionId: session._id },
      {
        $push: {
          attachments: {
            publicId: result.public_id,
            url: result.secure_url,
            originalName: req.file.originalname,
            resourceType: result.resource_type,
            format: result.format,
          },
        },
      },
      { upsert: true, new: true },
    );

    res.status(200).json({
      success: true,
      attachment: note.attachments.at(-1),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ================= GET SESSION NOTES ================= */
exports.getSessionNotes = async (req, res) => {
  try {
    const { roomId } = req.params;
    const councellorId = req.councellorId;

    const session = await sessionModel.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        status: "Failed",
        message: "Session not found",
      });
    }

    // 🔐 counsellor only
    if (session.councellorId.toString() !== councellorId) {
      return res.status(403).json({
        status: "Failed",
        message: "Unauthorized",
      });
    }

    const note = await SessionNote.findOne({
      sessionId: session._id,
    });

    res.json({
      status: "Success",
      note, // can be null if not created yet
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

/* ================= UPDATE SESSION NOTES ================= */
exports.updateSessionNotes = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { notes } = req.body;
    const councellorId = req.councellorId;

    const session = await sessionModel.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        status: "Failed",
        message: "Session not found",
      });
    }

    // 🔐 counsellor only
    if (session.councellorId.toString() !== councellorId) {
      return res.status(403).json({
        status: "Failed",
        message: "Unauthorized",
      });
    }

    const updatedNote = await SessionNote.findOneAndUpdate(
      { sessionId: session._id },
      {
        sessionId: session._id,
        councellorId,
        notes,
      },
      {
        new: true,
        upsert: true, // 🔥 create if not exists
      },
    );

    res.json({
      status: "Success",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
