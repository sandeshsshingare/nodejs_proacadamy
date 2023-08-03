import express from "express";
const router = express.Router();
import obj from "../Controllers/moviesController.mjs";

router.param("id", (req, res, next, value) => {
  console.log("Movie ID is", +value);
  next();
});

router.route("/").get(obj.getMovies).post(obj.createMovie);

router
  .route("/:id")
  .get(obj.getOneMovie)
  .patch(obj.updateMovie)
  .delete(obj.deleteMovie);
const moviesRouter = router;
export default router;
