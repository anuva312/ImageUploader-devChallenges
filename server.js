const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
var multer = require("multer");
const PORT = process.env.PORT || 4000;
const app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("Connection to DB Successful🤩"));

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

//store images in uploads folder
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploader-ui/public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // TODO: Create a new error
    console.error("Wrong filetype ERROR!!!💥", file);
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

app.post(
  "/api/v1/images",
  upload.single("image-file"),
  async (req, res, next) => {
    console.log("Request ", req.file);
    if (req.file) {
      res.status(201).json({
        message: "Image Uploaded Successfully",
        image: req.file.filename,
      });
    }
  }
);
