const {
  register,
  login,
  getMe,
  updateLogin,
  addGenre,
  removeGenre,
  addAuthor,
  removeAuthor,
} = require("../controllers/userController");
const { checkToken } = require("../middleware/checkToken");

const route = require("express").Router();

route.post("/register", register);
route.post("/login", login);

route.get("/me", checkToken, getMe);

route.patch("/change/login", checkToken, updateLogin);
route.patch("/genre", checkToken, addGenre);
route.patch("/author", checkToken, addAuthor);

route.delete("/genre/:name", checkToken, removeGenre);
route.delete("/author/:author", checkToken, removeAuthor);

module.exports = route;
