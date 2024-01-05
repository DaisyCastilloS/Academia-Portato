const express = require("express");
const router = express.Router();

const {
  LoginUser,
  RegisterUser,
} = require("../controllers/auth.controllers.js");

router.post("/registerUser", RegisterUser);
router.post("/loginUser", LoginUser);
router.get("/loginUser", LoginUser);
module.exports = router;
