
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const formatosPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (formatosPermitidos.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Formato no permitido. Usa JPG, PNG o WEBP.")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024
  }
});

module.exports = upload;
