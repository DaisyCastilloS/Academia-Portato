const express = require("express");
const router = express.Router();

const {
  RegisterAdmin,
  LoginAdmin,
  LogoutAdmin,
} = require("../controllers/auth.controllers.js");

router.post("/registerAdmin", RegisterAdmin);
router.post("/loginAdmin", LoginAdmin);
router.post("/logoutAdmin", LogoutAdmin);
module.exports = router;
