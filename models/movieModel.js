import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  ratings: {
    type: Number,
    default: 1.0,
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "Release year is required field!"],
  },
  releaseDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  genres: {
    type: [String],
    required: [true, "Genres is required field!"],
  },
  directors: {
    type: [String],
    required: [true, "Directors is required field!"],
  },
  coverImage: {
    type: String,
    required: [true, "Cover Image is required field!"],
  },
  actors: {
    type: [String],
    required: [true, "Actors is required field!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required field!"],
  },
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
