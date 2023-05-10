import {
  register,
  login,
  getMe,
  updateLogin,
  addGenre,
  removeGenre,
  addAuthor,
  removeAuthor,
  addTrack,
  removeTrack,
} from "../controllers/userController.js";
import { checkToken } from "../middleware/checkToken.js";
import { Router } from "express";

const route = Router();

route.post("/register", register);
route.post("/login", login);

route.get("/me", checkToken, getMe);

route.patch("/change/login", checkToken, updateLogin);
route.patch("/genre", checkToken, addGenre);
route.patch("/author", checkToken, addAuthor);
route.patch("/track", checkToken, addTrack);

route.delete("/genre/:name", checkToken, removeGenre);
route.delete("/author/:author", checkToken, removeAuthor);
route.delete("/track/:id", checkToken, removeTrack);

export default route;
