const {
  add,
  getGenre,
  getAuthor,
  getAll,
} = require("../controllers/trackControllers");

const router = require("express").Router();

router.post("/add", add);

router.get("/genre", getGenre);
router.get("/author", getAuthor);
router.get("/all", getAll);

module.exports = router;
