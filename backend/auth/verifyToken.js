const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  //get token
  const authToken = req.headers.authorization;

  //Checl token exist or not
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No Token, Authorization Denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.userId = decoded.id;
    req.role = decoded.role;

    next(); //Must be call the next  function
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

exports.restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;
  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  if (patient) {
    user = patient;
  }

  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }
  next();
};
