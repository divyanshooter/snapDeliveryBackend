const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
  mobileNumber: {
    type: Number,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  gender: String,
  address: {
    type: String,
    trim: true,
    required: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  pincode: Number,
});

module.exports = mongoose.model("User", user);
