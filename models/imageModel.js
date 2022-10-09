const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "The image cannot be empty!"],
  },
  originalName: String,
  path: {
    type: String,
    required: [true, "The image path cannot be empty!"],
    unique: true,
  },
  createdTime: {
    type: Date,
    default: Date.now(),
  },
  lastUpdatedTime: Date,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
