const SessionNote = require("../models/sessionNoteModel");
const sessionModel = require("../models/sessionModel");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

exports.uploadAttachment = async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await sessionModel.findOne({ roomId });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Authorization
    if (session.councellorId.toString() !== req.councellorId)
      return res.status(403).json({ message: "Unauthorized" });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "counselling/session-notes",
        resource_type: "auto",
      },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        const note = await SessionNote.findOneAndUpdate(
          { sessionId: session._id },
          {
            $push: {
              attachments: {
                publicId: result.public_id,
                url: result.secure_url,
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
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
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
