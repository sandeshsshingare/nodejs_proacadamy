import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Movie from "../models/movieModel.js";

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.LOCAL_CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB connection successfully...");
  })
  .catch((error) => {
    console.log("Error occurred while DB connection... ");
  });

const MoviesData = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const deleteMovie = async () => {
  try {
    await Movie.deleteMany();
    console.log(" Movie deleted");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};
const insertMovie = async () => {
  try {
    await Movie.create(MoviesData);
    console.log("Movie inserted...");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

console.log(process.argv[2]);
if (process.argv[2] === "--import") {
  insertMovie();
} else if (process.argv[2] === "--delete") {
  deleteMovie();
}
