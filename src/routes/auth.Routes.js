const express = require("express");
const router = express.Router();

const {
  LoginUser,
  RegisterUser,
  LoginAdmin,
} = require("../controllers/auth.controllers.js");

router.post("/registerUser", RegisterUser);
router.post("/loginUser", LoginUser);
router.post("/loginAdmin", LoginAdmin);
module.exports = router;
