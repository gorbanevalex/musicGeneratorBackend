const { add } = require("../controllers/trackControllers");

const router = require("express").Router();

router.post("/add", add);

module.exports = router;
