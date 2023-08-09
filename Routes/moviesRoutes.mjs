import express from "express";
const router = express.Router();
import obj from "../Controllers/moviesController.mjs";

router.route("/highest-rated").get(obj.highestRated, obj.getMovies);

router.route("/getMovieStat").get(obj.getMovieStats);

router.route("/movies-geners/:genre").get(obj.getByGeners);

router.route("/").get(obj.getMovies).post(obj.createMovie);

router
  .route("/:id")
  .get(obj.getOneMovie)
  .patch(obj.updateMovie)
  .delete(obj.deleteMovie);
const moviesRouter = router;
export default router;
