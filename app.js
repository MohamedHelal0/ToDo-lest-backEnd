require("dotenv").config();
const ex = require("express");
const app = ex();



const port = process.env.PORT ||5500;
const start = async () => {
  try {
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
