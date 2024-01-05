const express = require("express");
const router = express.Router();

const {
  CreateCourse,
  GetAllCourses,
  FindCourse,
  UpdateCourse,
  DeleteCourse,
} = require("../controllers/course.controllers.js");
const { AuthMiddleware } = require("../middlewares/auth.middlewares.js");
router.post("/registerCourse", AuthMiddleware, CreateCourse);
router.get("/", GetAllCourses);
router.get("/:id", FindCourse);
router.put("/:id", UpdateCourse);
router.delete("/:id", DeleteCourse);

module.exports = router;
