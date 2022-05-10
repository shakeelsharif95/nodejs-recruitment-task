var express = require("express");
var router = express.Router();
const controller = require("./controller");

router.post("/auth", controller.authorize);
module.exports = router;
