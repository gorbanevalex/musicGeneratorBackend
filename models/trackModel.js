import mongoose from "mongoose";

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
  danceability: Number,
  duration: Number,
  energy: Number,
  scale: String,
  strength: Number,
  bpm: Number,
  dynamicComplexity: Number,
  loudness: Number,
});

export default mongoose.model("Track", trackSchema);
