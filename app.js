require("dotenv").config();
const path = require("path");
const ex = require("express");
const connectDB = require("./db/connect");
const app = ex();

const logger = require("./middleware/logger");
app.use(logger.logger);

app.use(ex.static(path.join(__dirname, "static")));

app.get("/tasks", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

const port = process.env.PORT || 5500;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
