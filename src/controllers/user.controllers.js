const UserSchema = require("../models/user.models.js");

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
      // Hash the password before updating the user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const updatedUser = await UserSchema.findByIdAndUpdate(
        req.params.id,
        { password: hashedPassword }, // Update the password field with the hashed password
        {
          new: true,
          runValidators: true,
        }
      );

      if (updatedUser) {
        // You don't need to compare passwords here, as you have already updated it with the hashed value
        console.log(`Usuario logueado: ${updatedUser.email}`);
        // Return the updated user
        res.json(updatedUser);
      } else {
        // User not found, return an error message
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
