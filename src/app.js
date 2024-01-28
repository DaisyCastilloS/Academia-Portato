//2 archivo hijo

const express = require("express");
const { CreateRoles } = require("./libs/createRoles.js");
const courseRoutes = require("./routes/course.Routes.js");
const userRoutes = require("./routes/user.Routes.js");
const authUserRoutes = require("./routes/authUser.Routes.js");
const authAdminRoutes = require("./routes/authAdmin.Routes.js");
const cors = require("cors");
const app = express();

//middleware:
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
CreateRoles();
app.use("/courses", courseRoutes);
app.use("/users", userRoutes);
app.use("/authUser", authUserRoutes);
app.use("/authAdmin", authAdminRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to my api");
});

module.exports = app;
