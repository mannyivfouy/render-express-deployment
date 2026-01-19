const multer = require("multer");
const path = require("path");
const fs = require("fs");

const allowTypes = ["image/jpg", "image/png", "image/jpeg"];

function fileFilter(req, file, cb) {
  if (allowTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(
      "Invalid File Type. Only jpeg, jpg And png Are Allowed"
    );
    err.status = 400;
    cb(err, false);
  }
}

function createStorage(folderName) {
  const uploadPath = path.join("uploads", folderName);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s+/g, "");
      cb(null, uniqueName);
    },
  });
}

const userUpload = multer({
  storage: createStorage("users"),
  fileFilter: fileFilter,
});

const productUpload = multer({
  storage: createStorage("products"),
  fileFilter: fileFilter,
});

module.exports = { userUpload, productUpload };
