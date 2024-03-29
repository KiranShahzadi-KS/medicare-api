const mongoose = require("mongoose"); // Erase if already required
const Doctor = require("./Doctor");

// Declare the Schema of the Mongo model
var reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// reviewSchema.static.calcAverageRatings = async function (doctorId) {
//   //this point the current review
//   const stats = await this.aggregate([
//     { $match: { doctor: doctorId } },
//     {
//       $group: {
//         _id: "$doctor",
//         numOfRating: { $sum: 1 },
//         avgRating: { $avg: "$rating" },
//       },
//     },
//   ]);
//   console.log(stats);
// };
// reviewSchema.post("save", function () {
//   this.constructor.calcAverageRatings(this.doctor);
// });

reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  // Note the use of "statics" instead of "static"
  // "this" points to the current model (Review)
  const stats = await this.aggregate([
    { $match: { doctor: doctorId } },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    avgRating: stats[0].avgRating,
  });
};
reviewSchema.post("save", function () {
  this.model("Review").calcAverageRatings(this.doctor); // Use "this.model" to access the model
});

module.exports = mongoose.model("Review", reviewSchema);
