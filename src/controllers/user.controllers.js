const UserSchema = require("../models/user.models.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports = {
  GetAllUsers: (req, res) => {
    UserSchema.find()
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json(data);
        } else {
          res.status(204).json({ message: "Users not found" });
        }
      })
      .catch((error) => res.status(500).json({ message: error }));
  },
  FindUser: (req, res) => {
    const { id } = req.params;
    UserSchema.findOne({ _id: id })
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

    // Verificar si el usuario está autenticado y es un administrador
    if (!req.user || !req.user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      UserSchema.deleteOne({ _id: id }).then((data) => {
        if (data.deletedCount > 0) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({
            message: "User not found or cannot be deleted",
          });
        }
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};

//arreglar update user  update course
