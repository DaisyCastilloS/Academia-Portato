const express = require("express");
const router = express.Router();

const {
  GetAllUsers,
  FindUser,
  UpdateUser,
  DeleteUser,
} = require("../controllers/user.controllers.js");

router.get("/", GetAllUsers);
router.get("/:id", FindUser);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

module.exports = router;
