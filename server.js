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

// const testImage = new Image({
//   image: "testurl here!",
//   updatedTime: "123456789",
// });

// testImage
//   .save()
//   .then((doc) => {
//     console.log("Saved ", doc);
//   })
//   .catch((err) => {
//     console.log("Error 💥", err);
//   });

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

// CRUD Operation

// 1.Create

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

// 2. Read

app.get("/api/v1/images", (req, res) => {
  console.log("All Images");
  // TODO: Write code to get all images from DB
  res.status(200).json({
    status: "Success, images sent",
    images: [],
  });
});

app.get("/api/v1/images/:id", (req, res) => {
  console.log("Image id", req.params);
  // TODO: Write code to get the specific image from DB
  let listOfImages = [];
  const id = req.params.id * 1;
  const image = listOfImages.find((el) => el.id === id);

  if (!image) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "Success, images sent",
    images: req.params.id,
  });
});

// 3. Update

/* There are two ways to update the data , using a) PUT and b) PATCH. 

PUT is used when use receive the entire object you are to update.
PATCH is used when you receive only the specific properties that you are to update.

*/

app.patch("/api/v1/images/:id", (req, res) => {
  // TODO: Write code to update the specific image from DB
  let listOfImages = [];
  const id = req.params.id * 1;
  const image = listOfImages.find((el) => el.id === id);

  if (!image) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "Success, image updated successfully",
    image: ["Updated tour"],
  });
});

// Delete

app.delete("/api/v1/images/:id", (req, res) => {
  // TODO: Write code to delete the specific image from DB
  let listOfImages = [];
  const id = req.params.id * 1;
  const image = listOfImages.find((el) => el.id === id);

  if (!image) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "Success, image deleted successfully",
  });
});
