const mongoose = require("mongoose");

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
