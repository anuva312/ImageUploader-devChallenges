const multer = require("multer");
const fs = require("fs");
const Image = require("./../models/imageModel");

const storageLocation = `${__dirname}/../public/images`;

// Middlewares

// Check if the id provided is a valid id
exports.checkId = async (req, res, next, val) => {
  try {
    const image = await Image.findById(val);
    if (!image) {
      throw "Invalid Id";
    }
  } catch (err) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID",
    });
  }
  next();
};

// For Uploading image using multer

//store images in uploads folder
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageLocation);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replaceAll(" ", "-")}`);
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

// CRUD Operations

// 1.Create
exports.uploadImage = async (req, res) => {
  try {
    if (req.file) {
      const currentTime = Date.now();
      const newImage = await Image.create({
        image: req.file.filename,
        originalName: req.file.originalname,
        path: `/images/${req.file.filename}`,
        lastUpdatedTime: currentTime,
        createdTime: currentTime,
      });
      res.status(201).json({
        message: "Image Uploaded Successfully",
        data: newImage,
      });
    }
  } catch (err) {
    console.log("Image Upload Error 💥", err);
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Request",
    });
  }
};

// 2. Read
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json({
      status: "Success",
      count: images.length,
      data: {
        images,
      },
    });
  } catch (err) {
    console.log("Get All Images Error 💥", err);
    return res.status(500).json({
      status: "Fail",
      message: "Unable to fetch the images",
    });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (image) {
      res.status(200).json({
        status: "Success",
        data: {
          image,
        },
      });
    } else {
      throw "Image doesnot exist";
    }
  } catch (err) {
    console.log("Get an Image Error 💥", err);
    return res.status(500).json({
      status: "Fail",
      message: "Unable to fetch the image",
    });
  }
};

// 3. Update

/* There are two ways to update the data , using a) PUT and b) PATCH. 
  
  PUT is used when use receive the entire object you are to update.
  PATCH is used when you receive only the specific properties that you are to update.
  
  */

const removeImageFromServer = (path, file) => {
  try {
    fs.unlinkSync(`${path}/${file}`);
    return true;
  } catch (err) {
    console.log("Error, unable to delete the image 💥", file, err);
    return 0;
  }
};

exports.updateImage = async (req, res) => {
  if (req.file) {
    const oldImage = await Image.findById(req.params.id);
    const newImage = {
      image: req.file.filename,
      originalName: req.file.originalname,
      path: `/images/${req.file.filename}`,
      lastUpdatedTime: Date.now(),
    };

    let oldImageDeleted = false;

    try {
      const image = await Image.findByIdAndUpdate(req.params.id, newImage, {
        new: true,
        runValidators: true,
      });

      if (!image) {
        throw {
          type: "Database",
          message: "Database Error, unable to get the updated image",
        };
      } else {
        oldImageDeleted = removeImageFromServer(
          storageLocation,
          oldImage.image
        );
        if (!oldImageDeleted) {
          throw { type: "Delete", message: "Unable to delete old image" };
        }
        res.status(200).json({
          status: "Success, image updated successfully",
          data: {
            image,
          },
        });
      }
    } catch (err) {
      console.log("Error💥", err);

      if (err.type === "Delete") {
        try {
          const revertedImage = await Image.findByIdAndUpdate(
            req.params.id,
            oldImage,
            {
              new: true,
              runValidators: true,
            }
          );
          if (!revertedImage) {
            throw "Unable to revert image";
          }
        } catch (err) {
          return res.status(500).json({
            status: "Fail",
            message: "Image updated but unable to delete old image in server",
          });
        }
      }
      const deleteNewImageStatus = removeImageFromServer(
        storageLocation,
        req.file.filename
      );
      if (!deleteNewImageStatus) {
        console.log(
          "Unable to update old image in database, but new image saved in server💥"
        );
      } else {
        return res.status(500).json({
          status: "Fail",
          message: "Unable to update the image",
        });
      }
    }
  }
};

// Delete

exports.deleteImage = async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);
    const removeImageStatus = removeImageFromServer(
      storageLocation,
      deletedImage.image
    );
    if (!removeImageStatus) {
      console.log("Image deleted from database but not from server💥");
      throw "Image deleted from database but not from server";
    }
    res.status(204).json({
      status: "Success, image deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "Fail",
      message: err,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Image.deleteMany();
    console.log("Deleted", deleted);
    fs.readdir(storageLocation, (err, files) => {
      if (err) throw err;
      for (const file of files) {
        const fileDeleted = removeImageFromServer(storageLocation, file);
        if (!fileDeleted) {
          console.log(`Unable to delete file : ${file}`);
          throw `Unable to delete file : ${file}`;
        }
      }
    });
    res.status(204).json({
      status: "Success",
      data: {
        deleted,
      },
    });
  } catch (err) {
    console.log("Delete All Images Error 💥", err);
    return res.status(500).json({
      status: "Fail",
      message: "Unable to delete the images",
    });
  }
};
