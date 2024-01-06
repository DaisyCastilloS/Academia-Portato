const CourseSchema = require("../models/course.models.js");
const { verifyToken } = require("../helpers/generateToken.js");

module.exports = {
  CreateCourse: async (req, res) => {
    try {
      // Obtener los datos del cuerpo de la solicitud
      const { curso, nivel, precio, nombre, apellido, email } = req.body;

      // Verificar el token
      const token = req.headers.authorization;
      //console.log(token);
      //console.log(req.body.email);
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      try {
        // Utilizar la función verifyToken con await
        await verifyToken(token);
      } catch (err) {
        return res.status(401).json({ message: err.message });
      }

      // Crear una nueva instancia del modelo Course
      const newCourse = new CourseSchema({
        curso,
        nivel,
        precio,
        nombre,
        apellido,
        email,
      });

      // Guardar el nuevo curso en la base de datos
      const savedCourse = await newCourse.save();

      // Devolver el nuevo curso guardado
      res.json(savedCourse);
    } catch (error) {
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
          res.json({ message: "Cursos no encontrados" });
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
