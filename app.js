import express, { json } from "express";
import moviesRouter from "./Routes/moviesRoutes.mjs";
import morgan from "morgan";
const app = express();
app.use(express.json());

const logger = function (req, res, next) {
  console.log("custom middleware called");
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(logger);

app.use(morgan("dev"));
//GET api/movies

// app.get("/api/v1/movies", getMovies);

// app.post("/api/v1/movies", creteMovie);

// app.get("/api/v1/movies/:id/:name?/:age?", getOneMovie);

// app.patch("/api/v1/movies/:id", updateMovie);

// app.delete("/api/v1/movies/:id", deleteMovie);

app.use("/api/v1/movies", moviesRouter); //this is called mounting middleware

export default app;
