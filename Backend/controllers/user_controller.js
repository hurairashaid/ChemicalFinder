const User = require("../models/user_model");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodemailer.js");

const handleUserSignUp = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!name || !email || !password) {
      return res.status(401).json({ msg: "all fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "Email is already registered. Please Login " }); // 409 Conflict
    }

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (user) {
      const { _id, name } = user;
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({ msg: "Succesfully Signed Up", token: token });
    }
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.findOne({
      email: email,
    });
    const { _id, name } = user;
    if (user) {
      const validated = await bcrypt.compare(password, user.password);
      if (validated) {
        const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res
          .status(200)
          .json({ msg: "Successfully logged in", token: token });
      } else {
        return res.status(401).json({ msg: "Email or password is incorrect" }); // 401 Unauthorized
      }
    } else {
      return res.status(404).json({ msg: "Email or password is incorrect" }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ err: error.message }); // 500 Internal Server Error
  }
};

const handleUserGoogleLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.findOne({
      email: email,
    });
    const { _id, name } = user;
    if (user) {
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res
        .status(200)
        .json({ msg: "Successfully logged in", token: token });
    } else {
      return res
        .status(404)
        .json({ msg: "Email is not rejistered please sign up" }); // 404 Not Found
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message }); // 500 Internal Server Error
  }
};

const handleViewProfile = async (req, res) => {
  const authHeader = req.headers.authorization;

  // Validate Authorization Header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  // Extract Token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Verify Token
  let verify;
  try {
    verify = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error });
  }

  const { _id } = verify;
  if (!_id) {
    return res.status(400).json({ message: "Invalid token payload" });
  }

  // Find User
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return User Data
  return res.status(200).json({ user });
};

const handleAddQuestion = async (req, res) => {
  console.log("Request received with body:", req.body);

  const Question = {
    sugar: req.body.sugar,
    bloodPressure: req.body.bloodPressure,
    overWeight: req.body.overWeight,
    lactoseIntolerant: req.body.lactoseIntolerant,
  };
  console.log("Constructed Question:", Question);

  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  // Validate Authorization Header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or malformed");
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  // Extract Token
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) {
    console.error("Token not provided");
    return res.status(401).json({ message: "Token not provided" });
  }

  // Verify Token
  let verify;
  try {
    verify = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token Payload:", verify);
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token", error });
  }

  const { _id } = verify;
  console.log("Extracted User ID from Token:", _id);

  if (!_id) {
    console.error("Invalid token payload");
    return res.status(400).json({ message: "Invalid token payload" });
  }

  // Update User Document
  try {
    const Response = await User.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          "questions.0": Question, // Replace the first element in the questions array
        },
        questionAnswered: true, // Set questionAnswered to true
      },
      { new: true } // Return the updated document
    );
    console.log("Database Response:", Response);

    if (!Response) {
      console.error("User not found for ID:", _id);
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Question added successfully", user: Response });
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ message: "Database error", error });
  }
};

const changePassword = async (req, res) => {
  console.log(req.body);
  try {
    // 1. Extract the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // 4. Extract passwords from request body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    // 5. Fetch the user from the database
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 6. Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password); // Adjust the field name as needed

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 7. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 8. Update the user's password in the database
    user.password = hashedPassword; // Adjust the field name as needed
    await user.save();

    // 9. Respond with success message
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const sendSupportEmail = async (req, res) => {
  try {
    const message = req.body;
    sendMail("Reminder App Support Mail", message.message);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserGoogleLogin,
  handleViewProfile,
  handleAddQuestion,
  changePassword,
  sendSupportEmail,
};
