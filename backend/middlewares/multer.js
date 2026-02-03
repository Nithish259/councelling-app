const multer = require("multer");

/**
 * MEMORY STORAGE
 * --------------
 * Required for Cloudinary
 * Safe replacement for diskStorage
 */
const storage = multer.memoryStorage();

/**
 * FILE FILTER
 * -----------
 * Keeps app secure
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "text/plain", // .txt files
  ];

  // Allow any image format (png, jpg, jpeg, webp, gif, svg, etc.)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image, PDF, and TXT files are allowed"), false);
  }
};


/**
 * UPLOAD INSTANCE
 * ---------------
 * DOES NOT break existing code
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
