const express = require("express");
const authCouncellor = require("../middlewares/authCouncellors");
const {
  getSessionNotes,
  updateSessionNotes,
  uploadAttachment,
} = require("../controllers/sessionNoteController");
const upload = require("../middlewares/multer");
const router = express.Router();

router.get("/:roomId", authCouncellor, getSessionNotes);
router.post("/:roomId", authCouncellor, updateSessionNotes);

router.post(
  "/:roomId/attachment",
  authCouncellor,
  upload.single("file"),
  uploadAttachment,
);

module.exports = router;
