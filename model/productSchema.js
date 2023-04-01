const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
    maxLength: [30, "your name must be under 20 char"],
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  userId: {
    type: String,
  },
});
module.exports = mongoose.model("products", productSchema);
