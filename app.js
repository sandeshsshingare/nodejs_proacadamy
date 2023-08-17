import express, { json } from "express";
import moviesRouter from "./Routes/moviesRoutes.mjs";
import morgan from "morgan";
import customError from "./utils/CustomError.js";
import globalErrorHandler from "./Controllers/errorController.js";
import authRouter from "./Routes/authRouter.js";
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
app.use("/api/v1/users", authRouter);
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });
  // const error = new Error(`Can't find ${req.originalUrl} on the server`);
  // error.statusCode = 404;
  // error.status = "failed";
  // next(error);
  const error = new customError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(error);
});

app.use(globalErrorHandler);
export default app;
