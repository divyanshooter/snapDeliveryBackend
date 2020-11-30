const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    trim: true,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  menuId: {
    type: Schema.Types.ObjectId,
    ref: "menu",
  },
  pincode: {
    type: Number,
    required: true,
  },
  avgPrice: {
    type: Number,
  },
});

module.exports = mongoose.model("restaurant", restaurantSchema);
