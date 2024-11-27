const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/Bond")
    .then(() => console.log("database connecteed successfully"))
    .catch(() => console.log("database connection Error"));
};

module.exports = connectDB;
