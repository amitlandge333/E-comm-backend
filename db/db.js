const mongoose = require("mongoose");
let MONGO_URL = "mongodb://0.0.0.0:27017/e-comm";
exports.connect = () => {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Database Connect Succesfully");
    })
    .catch((error) => {
      console.log("Database Failed");
    });
};
