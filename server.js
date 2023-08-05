import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
console.log(app.get("env"));
dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    dbName: "cineflex",
  })
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successfull....");
  })
  .catch((err) => {
    console.log("Some error has occured while connecting mongodb");
  });

const port = process.env.PORT || 3000;
console.log(port);
app.listen(3000, () => {
  console.log("Server has started...");
});
