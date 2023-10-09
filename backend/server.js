const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Long } = require("mongodb");
dotenv.config();
const connectDB = require("./config/dbConnection");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const doctorRouter = require("./routes/doctorRoute");
const reviewRouter = require("./routes/reviewRoute");

const port = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/reviews", reviewRouter);

//TO TEST THE SERVER
app.listen(port, () => {
  connectDB(); //DATABASE CONNECTION
  console.log("Server is running " + port);
});
