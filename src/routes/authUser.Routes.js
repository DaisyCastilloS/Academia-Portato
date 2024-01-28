const express = require("express");
const router = express.Router();

const {
  LoginUser,
  RegisterUser,
  LogoutUser,
} = require("../controllers/auth.controllers.js");

router.post("/registerUser", RegisterUser);
router.post("/loginUser", LoginUser);
router.post("/logoutUser", LogoutUser);
module.exports = router;
