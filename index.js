const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
require("dotenv").config();

const courseRoutes = require("./src/routes/course.Routes.js");
const userRoutes = require("./src/routes/user.Routes.js");
const authUserRoutes = require("./src/routes/authUser.Routes.js");
const authAdminRoutes = require("./src/routes/authAdmin.Routes.js");
const cors = require("cors");

//middleware:
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/courses", courseRoutes);
app.use("/users", userRoutes);
app.use("/authUser", authUserRoutes);
app.use("/authAdmin", authAdminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my api");
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Mongo DB"))
  .catch((error) => console.log(error));
app.listen(port, () => console.log(`Server listening in port`, port));
