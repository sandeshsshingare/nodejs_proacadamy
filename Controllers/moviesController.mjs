import Movie from "../models/movieModel.js";

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

const getMovies = async (req, res) => {
  try {
    console.log(req.query);
    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );
    req.query = JSON.parse(queryString);
    console.log(req.query);

    let query = Movie.find();
    console.log("query");

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(req.query.sort);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const movies = await query;
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
      message: error,
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
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getOneMovie,
  validateBody,
};
export default obj;
