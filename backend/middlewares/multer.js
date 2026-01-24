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
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
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
