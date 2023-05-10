import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    login: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    likedAuthor: {
      type: Array,
      default: [],
    },
    subLikedAuthor: {
      type: Array,
      default: [],
    },
    likedGenre: {
      type: Array,
      default: [],
    },
    subLikedGenre: {
      type: Array,
      default: [],
    },
    likedTrack: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
