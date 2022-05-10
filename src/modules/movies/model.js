const mongoose = require("mongoose");

const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    title: String,
    released: String,
    genre: String,
    director: String,
    createdBy: String,
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
exports.Movie = Movie;
