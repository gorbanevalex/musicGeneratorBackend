import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    usersOnline: {
      type: Array,
      default: [],
    },
    allUsers: {
      type: Array,
      default: [],
    },
    adminId: {
      type: String,
      required: true,
    },
    playlist: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", RoomSchema);
