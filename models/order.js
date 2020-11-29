const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  order: [
    {
      item: String,
      price: Number,
      description: String,
      qty: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  orderPlaced: {
    type: Date,
    required: true,
  },
  eta: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("order", orderSchema);
