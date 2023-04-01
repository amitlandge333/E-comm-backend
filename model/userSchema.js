const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
    maxLength: [20, "your name must be under 20 char"],
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
  },
});
module.exports=mongoose.model("users",userSchema)