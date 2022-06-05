const express = require("express");
var multer = require("multer");
const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.listen(PORT, () => {
  console.log("Server running");
});

//store images in uploads folder
var storage = multer.diskStorage({
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

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

app.post("/uploadForm", upload.single("myImage"), async (req, res, next) => {
  if (req.file) {
    console.log("Uploaded to", req.file.path);
    const pathName = req.file.path;
    res.status(200).send(req.file);
  }
});
