const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  photo: { type: String },
  ticketPrice: { type: String },
  role: { type: String },

  //Fields for doctors only
  specialization: { type: String },
  qualifications: { type: Array },
  experiences: { type: Array },

  bio: { type: String, maxLength: 50 },
  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: {
    type: String,
    default: 0,
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

//Export the model
module.exports = mongoose.model("Doctor", doctorSchema);
