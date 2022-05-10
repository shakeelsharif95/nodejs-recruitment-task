const axios = require("axios").default;
const { Movie } = require("./model");
const moment = require("moment");
const { verifyToken, extractToken } = require("../../services/auth-service");
const { API_KEY, API_BASE_URL } = process.env;

const BASIC_MAX_MOIVE_LIMIT = 5;
if (!API_KEY || !API_BASE_URL) {
  throw new Error("Api credentials are incorrect or are not provided!");
}

exports.getAllMovies = async function (req, res, next) {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured!");
  }
};

exports.createMovie = async function (req, res, next) {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).send("Bad request! Title not provided");
    }

    const decodedInfo = verifyToken(extractToken(req.headers.authorization));

    if (decodedInfo.role === "basic") {
      const monthStartDate = moment().startOf("month").toDate();
      const monthEndDate = moment().endOf("month").toDate();

      const records = await Movie.find({
        createdBy: decodedInfo.userId,
        createdAt: { $gte: monthStartDate, $lte: monthEndDate },
      });
      if (records.length >= BASIC_MAX_MOIVE_LIMIT) {
        return res
          .status(403)
          .send(
            `You cannot create more than ${BASIC_MAX_MOIVE_LIMIT} per month`
          );
      }
    }

    const { data } = await axios.get(
      `${API_BASE_URL}/?apikey=${API_KEY}&t=${title}`
    );

    const { Title, Genre, Director, Released } = data;
    let movie = await Movie.findOne().where("title").equals(Title);
    if (movie) return res.status(409).send("Movie already exists");

    movie = new Movie({
      title: Title,
      genre: Genre,
      director: Director,
      released: Released,
      createdBy: decodedInfo.userId,
    });

    await movie.save();

    res.status(201).send("Succesfully created");
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("An error occured!");
  }
};
