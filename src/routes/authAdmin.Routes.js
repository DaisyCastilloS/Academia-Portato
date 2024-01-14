const express = require("express");
const router = express.Router();

const {
  RegisterAdmin,
  LoginAdmin,
} = require("../controllers/auth.controllers.js");

router.post("/registerAdmin", RegisterAdmin);
router.post("/loginAdmin", LoginAdmin);

module.exports = router;
