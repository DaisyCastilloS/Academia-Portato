const UserSchema = require("../models/user.models.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports = {
  GetAllUsers: (req, res) => {
    UserSchema.find()
      .then((data) => {
        if (data.length > 0) {
          res.json(data);
        } else {
          res.json({ message: "Usuarios no encontrados" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
  FindUser: (req, res) => {
    const { id } = req.params;
    UserSchema.findById(id)
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json({ message: "Usuario no encontrado" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },

  UpdateUser: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.id.toString());
      //console.log("Valor de userId:", userId);

      // Verifica que req.body.password y req.body.email existan
      if (!req.body.password) {
        return res.status(400).json({ message: "La contraseña es requerida" });
      }

      const existingUser = await UserSchema.findById(userId).lean();

      // Verifica si el correo electrónico proporcionado es diferente al almacenado en la base de datos
      if (req.body.email && req.body.email !== existingUser.email) {
        return res.status(400).json({
          message:
            "Para actualizar usuario necesitas el correo que usaste para el registro.",
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const updatedUser = await UserSchema.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
      ).lean();

      if (updatedUser) {
        console.log(`Usuario actualizado: ${updatedUser.email}`);
        res.json(updatedUser);
      } else {
        res.status(401).json({ message: "Credenciales inválidas" });
      }
    } catch (error) {
      res.status(404).json({
        status: "no actualizado",
        message: error.message,
      });
    }
  },
  DeleteUser: (req, res) => {
    const { id } = req.params;
    UserSchema.deleteOne({ _id: id })
      .then((data) => {
        if (data.deletedCount > 0) {
          res.json({ message: "Usuario eliminado satisfactoriamente" });
        } else {
          res.json({
            message: "Usuario no encontrado o no puede ser eliminado",
          });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
};

//arreglar update user  update course
