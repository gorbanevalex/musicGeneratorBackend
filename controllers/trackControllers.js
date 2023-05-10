import trackModel from "../models/trackModel.js";
import fs from "fs";
import { getMusicCharacteristic } from "../utils/musicCharacteristic.js";

export const add = async (req, res) => {
  try {
    const characteristick = await getMusicCharacteristic(req.body.trackUrl);

    const doc = await new trackModel({
      name: req.body.name,
      author: req.body.author,
      released: req.body.released,
      genre: req.body.genre,
      isRussian: req.body.isRussian,
      previewPicture: req.body.previewPicture,
      trackUrl: req.body.trackUrl,
      danceability: characteristick.computedDanceability.danceability,
      duration: characteristick.computedDuration.duration,
      energy: characteristick.computedEnergy.duration,
      scale: characteristick.computedKeyMode.scale,
      strength: characteristick.computedKeyMode.strength,
      bpm: characteristick.computedBpm.bpm,
      dynamicComplexity: characteristick.computedLoudness.dynamicComplexity,
      loudness: characteristick.computedLoudness.loudness,
    });
    const track = await doc.save();
    res.json(track);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Не удалось загрузить трек! Попробуйте еще раз",
    });
  }
};

export const remove = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  trackModel
    .findByIdAndRemove(id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          msg: "Не удалось удалить трек",
        });
      }

      console.log(doc);

      fs.unlink(`.${doc.trackUrl}`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            msg: "Не удалось удалить трек",
          });
        }
        fs.unlink(`.${doc.previewPicture}`, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              msg: " Не удалось удалить трек",
            });
          }

          res.json({
            success: true,
          });
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Не удалось удалить трек",
      });
    });
};

export const getGenre = async (req, res) => {
  try {
    const tracks = await trackModel.find().select("genre");
    const genre = new Set();
    tracks.map((item) => {
      item.genre.map((genreItem) => genre.add(genreItem));
    });
    res.json(Array.from(genre));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Не удалось получить жанры",
    });
  }
};

export const getAuthor = async (req, res) => {
  try {
    const tracks = await trackModel.find().select("author");
    const authors = new Set();
    tracks.map((item) => {
      item.author.map((authorItem) => authors.add(authorItem));
    });
    res.json(Array.from(authors));
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось получить авторов",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const tracks = await trackModel.find();
    res.json(tracks);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось получить всю музыку",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const track = await trackModel.findById(req.params.id);
    if (!track) {
      return res.status(404).json({
        msg: "Не удалось найти трек",
      });
    }
    res.json(track);
  } catch (error) {
    return res.status(500).json({
      msg: " Не удалось найти трек",
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    await trackModel.updateOne(
      {
        _id: id,
      },
      {
        name: req.body.name,
        author: req.body.author,
        released: req.body.released,
        genre: req.body.genre,
        isRussian: req.body.isRussian,
        previewPicture: req.body.previewPicture,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось обновить трек",
    });
  }
};
