import {
  add,
  getGenre,
  getAuthor,
  getAll,
  remove,
  getOne,
  update,
} from "../controllers/trackControllers.js";
import { Router } from "express";

const router = Router();

router.post("/add", add);

router.get("/genre", getGenre);
router.get("/author", getAuthor);
router.get("/all", getAll);
router.delete("/:id", remove);
router.get("/:id", getOne);
router.patch("/:id", update);

export default router;
