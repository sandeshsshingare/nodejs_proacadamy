import * as fs from "fs";

let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

const checkId = (req, res, next, value) => {
  console.log("Movie ID is" + value);
};

const getMovies = (req, res) => {
  res.status(200).json({
    requestedAt: req.requestedAt,
    status: "success",
    data: {
      movies: movies,
    },
  });
};
const createMovie = (req, res) => {
  const newId = movies[movies.length - 1].id + 1;

  const newMovie = Object.assign({ id: newId }, req.body);

  movies.push(newMovie);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err, data) => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  });
};

const getOneMovie = (req, res) => {
  console.log(req.params);
  //   res.send("Request using the id");
  let id = +req.params.id;
  //   let movie = movies[id];
  let movie = movies.find((ele) => {
    return ele.id === id;
  });
  if (!movie) {
    return res.status(404).json({
      status: "failed",
      data: "Movie not found with " + id + " this id",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
};

const updateMovie = (req, res) => {
  let id = +req.params.id;

  let movieToUpdate = movies.find((el) => el.id === id);
  let index = movies.indexOf(movieToUpdate);
  console.log(index, "index");

  if (!movieToUpdate) {
    return res.status(404).json({
      status: "fail",
      data: "NO movie object with ID " + id + " is found",
    });
  }
  Object.assign(movieToUpdate, req.body);
  movies[index] = movieToUpdate;
  fs.writeFile("./data/movies.json", JSON.stringify(movies), () => {
    res.status(200).json({
      status: "success",
      data: {
        movie: movieToUpdate,
      },
    });
  });
};

const deleteMovie = (req, res) => {
  const id = +req.params.id;
  const movieToDelete = movies.find((el) => el.id === id);
  const index = movies.indexOf(movieToDelete);
  if (!movieToDelete) {
    return res.status(404).json({
      status: "fail",
      data: "NO movie object with ID " + id + " is found",
    });
  }
  movies.splice(index, 1);
  console.log(index);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(204).json({
      status: "success",
      data: {
        movie: null,
      },
    });
  });
};
let obj = {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getOneMovie,
};
export default obj;
