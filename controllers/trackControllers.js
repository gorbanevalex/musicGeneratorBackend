const trackModel = require("../models/trackModel");

module.exports.add = async (req, res) => {
  try {
    const doc = await new trackModel({
      name: req.body.name,
      author: req.body.author,
      released: req.body.released,
      genre: req.body.genre,
      isRussian: req.body.isRussian,
      previewPicture: req.body.previewPicture,
      trackUrl: req.body.trackUrl,
    });
    const track = await doc.save();
    res.json(track);
  } catch (error) {
    res.status(500).json({
      msg: "Не удалось загрузить трек! Попробуйте еще раз",
    });
  }
};

module.exports.getGenre = async (req, res) => {
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

module.exports.getAuthor = async (req, res) => {
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

module.exports.getAll = async (req, res) => {
  try {
    const tracks = await trackModel.find();
    res.json(tracks);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось получить всю музыку",
    });
  }
};
