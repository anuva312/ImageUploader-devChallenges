const multer = require("multer");
const Image = require("./../models/imageModel");

// For Uploading image using multer

//store images in uploads folder
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploader-ui/public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
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

exports.uploadPicture = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// CRUD Operation

// 1.Create
exports.uploadImage = (req, res) => {
  console.log("Request ", req.file);
  if (req.file) {
    const currentTime = Date.now();
    const newImage = new Image({
      image: req.file.filename,
      updatedTime: currentTime,
      createdTime: currentTime,
    });

    newImage
      .save()
      .then((doc) => {
        res.status(201).json({
          message: "Image Uploaded Successfully",
          image: req.file.filename,
        });
      })
      .catch((err) => {
        console.log("Error 💥", err);
        return res.status(500).json({
          status: "Fail",
          message: "Unable to upload the image",
        });
      });
  }
};

// 2. Read
exports.getAllImages = (req, res) => {
  console.log("All Images");
  // TODO: Write code to get all images from DB
  res.status(200).json({
    status: "Success, images sent",
    images: [],
  });
};

exports.getImage = (req, res) => {
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
};

// 3. Update

/* There are two ways to update the data , using a) PUT and b) PATCH. 
  
  PUT is used when use receive the entire object you are to update.
  PATCH is used when you receive only the specific properties that you are to update.
  
  */

exports.updateImage = (req, res) => {
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
};

// Delete

exports.deleteImage = (req, res) => {
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
};
