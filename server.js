import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
console.log(app.get("env"));
dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.LOCAL_CONN_STR, {
    useNewUrlParser: true,
    dbName: "cineflex",
  })
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successfull....");
  });

const port = process.env.PORT || 3000;
console.log(port);
const server = app.listen(3000, () => {
  console.log("Server has started...");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured!!! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
