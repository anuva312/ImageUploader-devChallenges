const express = require("express");
const imageController = require("./../controllers/imageController");

const router = express.Router();

router.param("id", imageController.checkId);

router
  .route("/")
  .get(imageController.getAllImages)
  .post(
    imageController.uploadPicture.single("image-file"),
    imageController.uploadImage
  )
  .delete(imageController.deleteAll);

router
  .route("/:id")
  .get(imageController.getImage)
  .patch(
    imageController.uploadPicture.single("image-file"),
    imageController.updateImage
  )
  .delete(imageController.deleteImage);

module.exports = router;
