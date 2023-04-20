const { register, login, getMe } = require("../controllers/userController");
const { checkToken } = require("../middleware/checkToken");

const route = require("express").Router();

route.post("/register", register);
route.post("/login", login);
route.get("/me", checkToken, getMe);

module.exports = route;
