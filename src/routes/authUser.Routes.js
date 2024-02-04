const express = require("express");
const router = express.Router();

const {
  LoginUA,
  RegisterUser,
  LogoutUser,
} = require("../controllers/auth.controllers.js");

router.post("/registerUser", RegisterUser);
router.post("/loginUser", LoginUA);
router.post("/logoutUser", LogoutUser);
module.exports = router;
