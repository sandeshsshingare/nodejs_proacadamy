import mongoose from "mongoose";
import fs from "fs";
const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: [
        3,
        "Movie validation failed: Name should be greater than 3 characters",
      ],
      maxlength: [
        50,
        "Movie validation failed: Name should be less than 50 characters",
      ],

      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
      default: 1.0,
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 10;
        },
        message: "Rating should be greater than 1 and less than 10",
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required field!"],
    },
    releaseDate: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    genres: {
      type: [String],
      required: [true, "Genres is required field!"],
      // enum: {
      //   values: [
      //     "Action",
      //     "Biography",
      //     "Drama",
      //     "Crime",
      //     "Sci-Fi",
      //     "Adventure",
      //     "Thriller",
      //   ],
      //   message: "This genres does not exist",
      // },
    },
    directors: {
      type: [String],
      required: [true, "Directors is required field!"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover Image is required field!"],
    },
    actors: {
      type: [String],
      required: [true, "Actors is required field!"],
    },
    price: {
      type: Number,
      required: [true, "Price is required field!"],
    },
    createdBy: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Sandesh";
  console.log(this);
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: new Date().toISOString() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post("save", function (doc, next) {
  let content = `A new movie is created with name ${doc.name} and created by ${doc.createdBy}\n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, function (err) {
    console.log("Error while writing log " + err.message);
  });
  next();
});

movieSchema.post(/^find/, async function (docs, next) {
  this.find({ releaseDate: { $lte: new Date().toISOString() } });
  this.endTime = Date.now();
  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the data`;
  next();
});

movieSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { releaseDate: { $lte: new Date().toISOString() } },
  });

  console.log(this.pipeline());

  next();
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
