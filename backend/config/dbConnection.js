const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// mongoose.set("StrictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true, // Use the new URL parser (recommended)
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
