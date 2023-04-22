const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const trackRoutes = require("./routes/trackRoute");
const userRoutes = require("./routes/userRoute");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/previews", express.static("previews"));
app.use("/tracks", express.static("tracks"));

app.use("/track", trackRoutes);
app.use("/auth", userRoutes);

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
