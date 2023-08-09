import express, { json } from "express";
import moviesRouter from "./Routes/moviesRoutes.mjs";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use(express.static("./public"));
const logger = function (req, res, next) {
  console.log("custom middleware called");
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(logger);

//GET api/movies

// app.get("/api/v1/movies", getMovies);

// app.post("/api/v1/movies", creteMovie);

// app.get("/api/v1/movies/:id/:name?/:age?", getOneMovie);

// app.patch("/api/v1/movies/:id", updateMovie);

// app.delete("/api/v1/movies/:id", deleteMovie);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/movies", moviesRouter); //this is called mounting middleware
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });
  const error = new Error(`Can't find ${req.originalUrl} on the server`);
  error.statusCode = 404;
  error.status = "failed";
  next(error);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
  next();
});
export default app;
