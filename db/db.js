const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Connect Succesfully");
    })
    .catch((error) => {
      console.log("Database Failed");
    });
};
