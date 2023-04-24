const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const socket = require("socket.io");

const trackRoutes = require("./routes/trackRoute");
const userRoutes = require("./routes/userRoute");
const roomRoutes = require("./routes/roomRoute");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/previews", express.static("previews"));
app.use("/tracks", express.static("tracks"));

app.use("/track", trackRoutes);
app.use("/auth", userRoutes);
app.use("/room", roomRoutes);

const storagePreviews = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "previews");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const storageTracks = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "tracks");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadPreviews = multer({ storage: storagePreviews });
const uploadTrackss = multer({ storage: storageTracks });

app.post("/previews", uploadPreviews.single("preview"), (req, res) => {
  try {
    res.json({
      url: `/previews/${req.file.originalname}`,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Не удалось загрузить файл, попробуйте еще раз",
    });
  }
});
app.post("/tracks", uploadTrackss.single("track"), (req, res) => {
  try {
    res.json({
      url: `/tracks/${req.file.originalname}`,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Не удалось загрузить файл, попробуйте еще раз",
    });
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log("Server started!");
});

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@musicgenerator.bhkt8op.mongodb.net/musicGenerator?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("MongoDb already!");
  });

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentialds: true,
  },
});

io.on("connection", (socket) => {
  socket.on("add-user", (room) => {
    socket.join(room._id);
    socket.to(room._id).emit("newUser-room", room);
  });
  socket.on("remove-user", (room) => {
    socket.to(room._id).emit("removeUser-room", room);
  });
});
