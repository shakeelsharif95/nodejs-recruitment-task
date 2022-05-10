var express = require("express");
var router = express.Router();
const controller = require("./controller");

const { authorizeRequest } = require("../../services/auth-service");

const PREFIX = "movie";

router.get(`/${PREFIX}/`, authorizeRequest, controller.getAllMovies);
router.post(`/${PREFIX}/`, authorizeRequest, controller.createMovie);

module.exports = router;
