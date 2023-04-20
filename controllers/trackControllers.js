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
