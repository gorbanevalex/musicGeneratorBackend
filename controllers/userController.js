const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
  const checkedEmail = await userModel.findOne({
    email: req.body.email,
  });
  if (checkedEmail) {
    return res.status(400).json({
      msg: "Упс... Кажется эта почта у нас уже бывалая",
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password.toString(), salt);
    const doc = await new userModel({
      ...req.body,
      password: hashPassword,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Какая то ошибочка на сервере, попробуйте еще раз",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({
        msg: "Хм...Кажется мы вас не знаем, проверьте введенные данные",
      });
    }
    const validatePassword = await bcrypt.compare(
      req.body.password.toString(),
      user.password
    );
    if (!validatePassword) {
      return res.status(404).json({
        msg: "Хм...Кажется мы вас не знаем, проверьте введенные данные",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Кажется произошла какая-то ошибка, попробуйте позже",
    });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось получить данные пользователя",
    });
  }
};
