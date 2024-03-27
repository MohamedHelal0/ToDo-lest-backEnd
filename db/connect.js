const mongoose = require("mongoose");

const connectDB = (url) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url, {})
      .then((connection) => {
        console.log("MongoDB Connected");
        resolve(connection);
      })
      .catch((error) => {
        console.error("MongoDB Connection Error:", error);
        reject(error);
      });
  });
};

module.exports = connectDB;
