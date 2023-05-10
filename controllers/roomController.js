import roomModel from "../models/roomModel.js";
import trackModel from "../models/trackModel.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel
      .find({
        allUsers: req.userId,
      })
      .select("name _id allUsers adminId");

    res.json(rooms);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Не удалось ваши комнаты",
    });
  }
};

export const add = async (req, res) => {
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

export const addUser = async (req, res) => {
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

export const removeUser = async (req, res) => {
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

export const userOff = async (req, res) => {
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

export const generatePlaylist = async (req, res) => {
  try {
    const room = await roomModel.findById(req.body.roomId);

    const authorList = new Map();
    const someAuthorList = new Map();
    const genreList = new Map();
    const someGenreList = new Map();

    const danceabilityList = [];
    const strengthList = [];

    room.usersOnline.forEach((user) => {
      user.likedAuthor.map((author) => {
        if (authorList.has(author)) {
          authorList.set(author, authorList.get(author) + 1);
        } else {
          authorList.set(author, 1);
        }
      });

      const userDanceability = [];
      user.likedTrack.map((track) => userDanceability.push(track.danceability));
      danceabilityList.push(userDanceability);

      const userStrength = [];
      user.likedTrack.map((track) => userStrength.push(track.strength));
      strengthList.push(userStrength);

      user.subLikedAuthor.map((author) => {
        if (someAuthorList.has(author)) {
          someAuthorList.set(author, someAuthorList.get(author) + 1);
        } else {
          someAuthorList.set(author, 1);
        }
      });

      user.likedGenre.map((genre) => {
        if (genreList.has(genre)) {
          genreList.set(genre, genreList.get(genre) + 1);
        } else {
          genreList.set(genre, 1);
        }
      });

      user.subLikedGenre.map((genre) => {
        if (someGenreList.has(genre)) {
          someGenreList.set(genre, someGenreList.get(genre) + 1);
        } else {
          someGenreList.set(genre, 1);
        }
      });
    });

    authorList.forEach((value, key) => {
      if (value !== room.usersOnline.length) {
        authorList.delete(key);
      }
    });
    someAuthorList.forEach((value, key) => {
      if (value !== room.usersOnline.length) {
        someAuthorList.delete(key);
      }
    });
    genreList.forEach((value, key) => {
      if (value !== room.usersOnline.length) {
        genreList.delete(key);
      }
    });
    someGenreList.forEach((value, key) => {
      if (value !== room.usersOnline.length) {
        someGenreList.delete(key);
      }
    });

    const similarAuthor = Array.from(authorList.keys());
    const someSimilarAuthor = Array.from(someAuthorList.keys());
    const similarGenre = Array.from(genreList.keys());
    const someSimilarGenre = Array.from(someGenreList.keys());

    //Алгоритм нахождения общих харакеристик по danceabilite в +-0.05
    const similarDanceability = [];
    const allDanceability = danceabilityList.sort(
      (a, b) => b.length - a.length
    );
    const baseDanceability = allDanceability[0];
    for (let i = 0; i < baseDanceability.length; i++) {
      let flag = true;
      for (let j = 1; j < allDanceability.length; j++) {
        let someFlag = false;
        for (let z = 0; z < allDanceability[j].length; z++) {
          if (Math.abs(allDanceability[j][z] - baseDanceability[i]) <= 0.05) {
            someFlag = true;
          }
        }
        if (!someFlag) {
          flag = false;
        }
      }
      if (flag) {
        similarDanceability.push(baseDanceability[i]);
      }
    }
    //------------------------------------------------------

    //Алгоритм нахождения общих харакеристик по strength в +-0.05
    const similarStrength = [];
    const allStrength = strengthList.sort((a, b) => b.length - a.length);
    const baseStrength = allStrength[0];
    for (let i = 0; i < baseStrength.length; i++) {
      let flag = true;
      for (let j = 1; j < allStrength.length; j++) {
        let someFlag = false;
        for (let z = 0; z < allStrength[j].length; z++) {
          if (Math.abs(allStrength[j][z] - baseStrength[i]) <= 0.05) {
            someFlag = true;
          }
        }
        if (!someFlag) {
          flag = false;
        }
      }
      if (flag) {
        similarStrength.push(baseStrength[i]);
      }
    }
    //------------------------------------------------------

    const tracks = await trackModel.find();
    let similarCharacteristickTrack = new Map();

    tracks.filter((track) => {
      let priority = 0;
      for (let i = 0; i < similarDanceability.length; i++) {
        if (Math.abs(similarDanceability[i] - track.danceability) <= 0.05) {
          priority = priority + 2;
          break;
        }
      }
      for (let i = 0; i < similarStrength.length; i++) {
        if (Math.abs(similarStrength[i] - track.strength) <= 0.05) {
          priority = priority + 2;
          break;
        }
      }
      for (let i = 0; i < similarAuthor.length; i++) {
        if (track.author.indexOf(similarAuthor[i]) !== -1) {
          priority = priority + 3;
          break;
        }
      }
      for (let i = 0; i < similarGenre.length; i++) {
        if (track.genre.indexOf(similarGenre[i]) !== -1) {
          priority = priority + 1;
          break;
        }
      }

      for (let i = 0; i < someSimilarAuthor.length; i++) {
        if (track.author.indexOf(someSimilarAuthor[i]) !== -1) {
          priority = priority + 1;
          break;
        }
      }
      for (let i = 0; i < someSimilarGenre.length; i++) {
        if (track.genre.indexOf(someSimilarGenre[i]) !== -1) {
          priority = priority + 1;
          break;
        }
      }

      if (priority > 0) {
        similarCharacteristickTrack.set(track, priority);
      }
    });

    similarCharacteristickTrack = Array.from(similarCharacteristickTrack).sort(
      (a, b) => b[1] - a[1]
    );

    res.json({
      similarAuthor,
      similarGenre,
      someSimilarAuthor,
      someSimilarGenre,
      similarDanceability,
      similarStrength,
      similarCharacteristickTrack,
    });
  } catch (error) {}
};
