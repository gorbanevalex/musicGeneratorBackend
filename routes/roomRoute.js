import {
  add,
  addUser,
  removeUser,
  userOff,
  getRooms,
  generatePlaylist,
} from "../controllers/roomController.js";
import { checkToken } from "../middleware/checkToken.js";
import { Router } from "express";

const router = Router();

router.get("/", checkToken, getRooms);
router.post("/", checkToken, add);
router.post("/user", checkToken, addUser);
router.delete("/remove/:id", checkToken, removeUser);
router.post("/off", checkToken, userOff);

router.patch("/generate", generatePlaylist);

export default router;
