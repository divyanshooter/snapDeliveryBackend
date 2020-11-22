const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("menu", menuSchema);
