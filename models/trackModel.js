const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: Array,
    required: true,
  },
  released: {
    type: Number,
    required: true,
  },
  genre: {
    type: Array,
    default: [],
  },
  isRussian: {
    type: Boolean,
    required: true,
  },
  previewPicture: {
    type: String,
    default: "",
  },
  trackUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Track", trackSchema);
