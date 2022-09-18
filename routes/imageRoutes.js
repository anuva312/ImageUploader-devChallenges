const express = require("express");
const imageController = require("./../controllers/imageController");

const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(
    imageController.uploadPicture.single("image-file"),
    imageController.uploadImage
  );

router
  .route("/:id")
  .get(imageController.getImage)
  .patch(imageController.updateImage)
  .delete(imageController.deleteImage);

module.exports = router;
