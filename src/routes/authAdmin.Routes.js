const express = require("express");
const router = express.Router();

const {
  RegisterAdmin,
  LoginUA,
  LogoutAdmin,
} = require("../controllers/auth.controllers.js");

router.post("/registerAdmin", RegisterAdmin);
router.post("/loginAdmin", LoginUA);
router.post("/logoutAdmin", LogoutAdmin);
module.exports = router;
