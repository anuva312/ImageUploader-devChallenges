const express = require("express");
const cors = require("cors");
var multer = require("multer");
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

//store images in uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

app.post(
  "/api/v1/images",
  upload.single("image-file"),
  async (req, res, next) => {
    console.log(req.file);
    if (req.file) {
      console.log("Uploaded to", req.file.path);
      const pathName = req.file.path;
      res.status(201).json({
        message: "Image Uploaded Successfully",
      });
    }
  }
);
