import express from "express";
const router = express.Router();
import object from "./../Controllers/authController.js";
import obj from "../Controllers/moviesController.mjs";

router.route("/highest-rated").get(obj.highestRated, obj.getMovies);

router.route("/getMovieStat").get(obj.getMovieStats);

router.route("/movies-geners/:genre").get(obj.getByGeners);

router.route("/").get(object.protect, obj.getMovies).post(obj.createMovie);

router
  .route("/:id")
  .get(obj.getOneMovie)
  .patch(obj.updateMovie)
  .delete(object.protect, object.restrict("admin"), obj.deleteMovie);
const moviesRouter = router;
export default router;
