const {
  add,
  addUser,
  removeUser,
  userOff,
} = require("../controllers/roomController");
const { checkToken } = require("../middleware/checkToken");

const router = require("express").Router();

router.post("/", checkToken, add);
router.post("/user", checkToken, addUser);
router.delete("/remove/:id", checkToken, removeUser);
router.post("/off", checkToken, userOff);

module.exports = router;
