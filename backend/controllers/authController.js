const User = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, user: user.role }, process.env.JWT_TOKEN, {
    expiresIn: "10d",
  });
};

//USER REGISTRATION
exports.register = async (req, res) => {
  const { name, email, password, photo, role, gender } = req.body;
  try {
    let user = null;
    if (user === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }
    //check if user exist
    if (user) {
      return res.status(400).json({ message: "User Already exist!" });
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = await new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server Error, Try Again!" });
  }
};

//USER LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    //check if user exist or not
    if (!user) {
      return res.status(200).json({ success: true, message: "User not found" });
    }

    //compare password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    //TO GET TOKEN
    const token = generateToken(user);

    const { password, role, appointment, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      message: "Successfully Login",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to Login!" });
  }
};
