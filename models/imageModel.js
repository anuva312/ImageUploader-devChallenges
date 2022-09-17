const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "The image cannot be empty!"],
    unique: true,
  },
  createdTime: {
    type: String,
    default: Date.now(),
  },
  updatedTime: String,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
