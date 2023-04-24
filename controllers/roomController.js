const roomModel = require("../models/roomModel");

module.exports.add = async (req, res) => {
  try {
    const doc = await new roomModel({
      name: req.body.name,
      adminId: req.userId,
    });
    const room = await doc.save();
    res.json(room._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Не удалось создать комнату",
    });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const doc = await roomModel.findById(req.body.roomId);
    let uniqueUser = true;
    doc.allUsers.map((item) => {
      if (item === req.body.user._id) {
        uniqueUser = false;
      }
    });
    uniqueUser && doc.allUsers.unshift(req.body.user._id);
    let changeOnline = false;
    doc.usersOnline = doc.usersOnline.map((item) => {
      if (item._id === req.body.user._id) {
        changeOnline = true;
        return req.body.user;
      }
      return item;
    });

    !changeOnline && doc.usersOnline.unshift(req.body.user);

    const room = await doc.save();
    res.json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Не удалось подключиться к комнате",
    });
  }
};

module.exports.removeUser = async (req, res) => {
  try {
    const doc = await roomModel.findById(req.params.id);
    doc.allUsers = doc.allUsers.filter((item) => item !== req.userId);
    doc.usersOnline = doc.usersOnline.filter((item) => item._id !== req.userId);
    const room = await doc.save();
    res.json(room);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось выйти из комнаты",
    });
  }
};

module.exports.userOff = async (req, res) => {
  try {
    const doc = await roomModel.findById(req.body.roomId);
    doc.usersOnline = doc.usersOnline.filter((item) => item._id !== req.userId);
    const room = await doc.save();
    res.json(room);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось выйти из комнаты",
    });
  }
};
