const CourseSchema = require("../models/course.models.js");
const { verifyToken } = require("../helpers/generateToken.js");

module.exports = {
  CreateCourse: async (req, res) => {
    try {
      // Validate request body for required fields
      const { curso, nivel, precio } = req.body;
      const user = req.user;

      if (!curso || !nivel || !precio) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      // Crear una nueva instancia del modelo Course
      const newCourse = new CourseSchema({
        curso,
        nivel,
        precio,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      });

      // Guardar el nuevo curso en la base de datos
      const savedCourse = await newCourse.save();

      // Devolver el nuevo curso guardado
      res.status(201).json(savedCourse);
    } catch (error) {
      // Log the error
      console.error(error);
      // Manejar errores durante el proceso de creación y guardado del curso
      res.status(500).json({ message: error.message });
    }
  },

  GetAllCourses: (req, res) => {
    CourseSchema.find()
      .then((data) => {
        if (data.length > 0) {
          res.json(data);
        } else {
          res.status(404).json({ message: "Courses not found" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
  FindCourse: (req, res) => {
    const { id } = req.params;
    CourseSchema.findById(id)
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json({ message: "Curso no encontrado" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
  UpdateCourse: async (req, res) => {
    try {
      const updatedCourse = await CourseSchema.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "actualizado",
        data: {
          user: updatedCourse,
        },
      });
    } catch (error) {
      res.status(404).json({
        status: "no actualizado",
        message: error.message,
      });
    }
  },
  DeleteCourse: (req, res) => {
    const { id } = req.params;
    CourseSchema.deleteOne({ _id: id })
      .then((data) => {
        if (data.deletedCount > 0) {
          res.json({ message: "Curso eliminado satisfactoriamente" });
        } else {
          res.json({ message: "Curso no encontrado o no puede ser eliminado" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
};
