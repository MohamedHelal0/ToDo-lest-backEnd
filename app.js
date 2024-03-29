// Importing necessary modules
require("dotenv").config();
const path = require("path");
const express = require("express"); 
const connectDB = require("./db/connect"); 
const {handleMissingRoute}=require('./middleware/redirect')
const app = express();
const helmet = require("helmet");
const cors = require("cors");


// middleware 
app.use(express.json());
const logger = require("./middleware/logger");
app.use(logger.logger);

app.use(helmet());
app.use(cors())

app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

app.use("/", require("./routes/tasks"))
app.use("/auth", require("./routes/auth"))


app.use(handleMissingRoute);


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
