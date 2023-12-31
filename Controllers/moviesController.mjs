import Movie from "../models/movieModel.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/CustomError.js";
const validateBody = (req, res, next) => {
  console.log("reached validateBody");
  if (!req.body.name || !req.body.releaseYear) {
    return res.status(400).json({
      status: "failed",
      message: "Bad request!!! Movie must contain name and release year",
    });
  }

  next();
};
const highestRated = asyncErrorHandler(async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";

  next();
});
const getMovies = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(Movie.find(), req.query)
    .sort()
    .limitFields()
    .paginate()
    .filter();

  const movies = await features.query;
  // console.log(req.query);
  // let queryString = JSON.stringify(req.query);
  // queryString = queryString.replace(
  //   /\b(gte|gt|lt|lte)\b/g,
  //   (match) => `$${match}`
  // );
  // let queryObj = JSON.stringify(queryString);
  // console.log(req.query);

  // let queryData = Movie.find();
  // console.log("query");
  // //SORTING THE RESULTS
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   console.log(req.query.sort);
  //   queryData = queryData.sort(sortBy);
  // } else {
  //   queryData = queryData.sort("-createdAt");
  // }
  // //LIMITING FIELDS
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   queryData = queryData.select(fields);
  // } else {
  //   queryData = queryData.select("-__v");
  // }

  // //PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 10;
  // const skip = (page - 1) * limit;
  // console.log("skip is " + skip);
  // console.log(queryData);
  // console.log("limit is", limit);
  // queryData = queryData.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const moviesCount = await Movie.countDocuments();
  //   if (skip >= moviesCount) {
  //     throw new Error("This page is not found!!!");
  //   }
  // }
  // const movies = await queryData;
  // const movies = await Movie.find()
  //   .where("duration")
  //   .equals(req.query.duration)
  //   .where("ratings")
  //   .equals(req.query.ratings);

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movie: movies,
    },
  });
});

const createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({ status: "success", data: { movie } });
});

const getOneMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    const error = new CustomError(
      "Movie with ID " + req.params.id + " is not found"
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      movie: { movie },
    },
  });
});

const updateMovie = asyncErrorHandler(async (req, res, next) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new CustomError(
      "Movie with ID " + req.params.id + " is not found"
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
});

const deleteMovie = asyncErrorHandler(async (req, res, next) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
  if (!deletedMovie) {
    const error = new CustomError(
      "Movie with ID " + req.params.id + " is not found"
    );
    return next(error);
  }
  res.status(204).json({
    data: {
      movie: null,
    },
  });
});

const getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.aggregate([
    { $match: { ratings: { $gte: 4.5 }, price: { $gte: 70 } } },
    {
      $group: {
        _id: "$releaseYear",
        avgRatings: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        sum: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { maxPrice: 1 } },
    // { $match: { maxPrice: { $lte: 111 } } },
  ]);

  res.status(200).json({
    status: "success",
    count: movie.length,
    data: {
      movie: movie,
    },
  });
});

const getByGeners = asyncErrorHandler(async (req, res, next) => {
  const genre = req.params.genre;
  console.log(genre);
  const movie = await Movie.aggregate([
    {
      $unwind: "$genres",
    },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $lds: { genres: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    // { $limit: 4 },
    { $match: { genres: genre } },
  ]);

  res.status(200).json({
    status: "success",
    count: movie.length,
    data: {
      movie: movie,
    },
  });
});

let obj = {
  highestRated,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getOneMovie,
  validateBody,
  getMovieStats,
  getByGeners,
};
export default obj;
