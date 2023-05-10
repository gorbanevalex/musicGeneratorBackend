import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
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

export const login = async (req, res) => {
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

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось получить данные пользователя",
    });
  }
};

export const updateLogin = async (req, res) => {
  try {
    userModel
      .findOneAndUpdate(
        {
          _id: req.userId,
        },
        {
          $set: { login: req.body.login },
        },
        {
          returnDocument: "after",
        }
      )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            msg: "Не удалось обновить логин",
          });
        }
        res.json(doc);
      });
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось обновить логин",
    });
  }
};

export const addGenre = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedGenre.unshift(req.body.genre);
    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось добавить жанр",
    });
  }
};

export const removeGenre = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedGenre = doc.likedGenre.filter((item) => item !== req.params.name);
    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось удалить жанр",
    });
  }
};

export const addAuthor = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedAuthor.unshift(req.body.author);
    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось добавить автора",
    });
  }
};

export const removeAuthor = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedAuthor = doc.likedAuthor.filter(
      (item) => item !== req.params.author
    );
    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось удалить автора",
    });
  }
};

export const addTrack = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedTrack.unshift(req.body.track);

    const subLikedAuthor = new Set(doc.subLikedAuthor);
    req.body.track.author.map((item) => subLikedAuthor.add(item));
    doc.subLikedAuthor = Array.from(subLikedAuthor);

    const subLikedGenre = new Set(doc.subLikedGenre);
    req.body.track.genre.map((item) => subLikedGenre.add(item));
    doc.subLikedGenre = Array.from(subLikedGenre);

    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось добавить трек",
    });
  }
};

export const removeTrack = async (req, res) => {
  try {
    const doc = await userModel.findById(req.userId);
    doc.likedTrack = doc.likedTrack.filter(
      (item) => item._id !== req.params.id
    );
    const user = await doc.save();
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      msg: "Не удалось удалить трек",
    });
  }
};
