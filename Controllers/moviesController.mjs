import Movie from "../models/movieModel.js";
import ApiFeatures from "../utils/ApiFeatures.js";

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
const highestRated = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";

  next();
};
const getMovies = async (req, res) => {
  try {
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
      data: {
        movie: { movies },
      },
    });
  } catch (error) {
    console.log("error while get all movies", error);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
const createMovie = async (req, res) => {
  // const testMovie = new Movie({});
  // testMovie.save();
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({ status: "success", data: { movie } });
  } catch (error) {
    console.log("Error while creating movie", error);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getOneMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  try {
    res.status(200).json({
      status: "success",
      data: {
        movie: { movie },
      },
    });
  } catch (error) {
    console.log("error while getting one movie" + error);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        movie: updatedMovie,
      },
    });
  } catch (error) {
    console.log("error while getting update movie" + error);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      data: {
        movie: null,
      },
    });
  } catch (error) {
    console.log("error while getting delete movie" + error);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
let obj = {
  highestRated,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getOneMovie,
  validateBody,
};
export default obj;
