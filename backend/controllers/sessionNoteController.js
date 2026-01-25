const SessionNote = require("../models/sessionNoteModel");
const sessionModel = require("../models/sessionModel");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

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

    // Allow only images or PDFs
    if (!isPdf && !isImage) {
      return res
        .status(400)
        .json({ message: "Only images and PDFs are allowed" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "counselling/session-notes",
        resource_type: isPdf ? "raw" : "image", // ✅ Correct handling
        use_filename: true,
        unique_filename: true,
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Upload failed" });
        }

        try {
          // Generate a proper delivery URL
          let fileUrl;

          if (isPdf) {
            fileUrl = cloudinary.url(result.public_id + ".pdf", {
              resource_type: "raw",
              secure: true,
            });
          } else {
            fileUrl = result.secure_url;
          }

          const note = await SessionNote.findOneAndUpdate(
            { sessionId: session._id },
            {
              $push: {
                attachments: {
                  publicId: result.public_id,
                  url: fileUrl,
                  originalName: req.file.originalname,
                  resourceType: result.resource_type,
                },
              },
            },
            { upsert: true, new: true },
          );

          res.status(200).json({
            success: true,
            attachment: note.attachments.at(-1),
          });
        } catch (dbErr) {
          console.error("Database Error:", dbErr);
          res.status(500).json({ message: "Database update failed" });
        }
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Server Error:", err);
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
