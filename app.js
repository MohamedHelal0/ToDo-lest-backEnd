// Importing necessary modules
require("dotenv").config();
const path = require("path");
const express = require("express"); 
const connectDB = require("./db/connect"); 
const app = express();

app.use(express.json());

// Custom middleware for logging requests
const logger = require("./middleware/logger");
app.use(logger.logger);

app.use(express.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/", require("./routes/tasks"))


// Setting up the port to listen on
const port = process.env.PORT || 5500;

// Function to start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server url http://localhost:${port}`));
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
