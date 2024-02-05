const bcrypt = require("bcrypt");
const UserSchema = require("../models/user.models.js");
const { tokenSign, verifyToken } = require("../helpers/generateToken.js");
const Role = require("../models/role.models.js");
module.exports = {
  ValidatePassword: async (password) => {
    // Requiere al menos 7 caracteres con al menos una letra mayúscula y un número
    return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password);
  },
  RegisterUser: async (req, res) => {
    try {
      const { password, nombre, apellido, email, roles } = req.body;
      // Validar la contraseña antes de hash
      if (!(await module.exports.ValidatePassword(password))) {
        return res.status(400).json({
          message: "La contraseña no cumple con los requisitos de seguridad.",
        });
      }
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserSchema({
        password: hashedPassword,
        nombre,
        apellido,
        email,
      });
      if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        //devuelve el id del rol
        newUser.roles = foundRoles.map((role) => role._id);
      } else {
        //si el user no entrega el rol, se le da user por defecto
        const role = await Role.findOne({ name: "user" });
        newUser.roles = [role._id];
      }
      try {
        const savedUser = await newUser.save();
        res.status(201).json({ msg: "Usuario creado con exito" });
        //console.log(savedUser);
      } catch (saveError) {
        console.error(saveError);
        res.status(500).json({ message: saveError.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //este contrlador tiene el login user y admin integrados y compara aca, no los hice a parte

  LoginUA: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await UserSchema.findOne({ email });

      // Check if the user exists
      if (user) {
        // Check if the user is an admin
        if (user.roles.includes("admin")) {
          // For admin login
          // Compare hashed passwords using bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            // Passwords match, generate a token
            const tokenSession = await tokenSign({
              id: user._id,
              role: user.roles,
            });

            // Return the user and token
            return res.status(200).send({
              tokenSession,
            });
          } else {
            // Passwords do not match, return an error message
            return res.status(401).json({ message: "Invalid password" });
          }
        } else {
          // For regular user login
          // Compare hashed passwords using bcrypt
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            // Passwords match, generate a token
            const tokenSession = await tokenSign({
              id: user._id,
              role: user.roles,
            });

            // Return the user and token
            return res.status(200).send({
              tokenSession,
            });
          } else {
            // Passwords do not match, return an error message
            return res.status(401).json({ message: "Invalid password" });
          }
        }
      } else {
        // User not found, return an error message
        return res.status(401).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  LogoutUA: async (req, res) => {
    try {
      const { token } = req.body;

      // Verificar si se proporcionó un token
      if (!token) {
        return res.status(400).json({ message: "Token missing" });
      }

      // Verificar si el token es válido y decodificarlo para obtener la información del usuario
      const decodedToken = await verifyToken(token);

      if (!decodedToken) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Verificar si el token ha expirado
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return res.status(401).json({ message: "Token has expired" });
      }

      // Aquí podrías realizar cualquier otra lógica de sesión necesaria,
      // como invalidar el token en una lista negra o realizar otras acciones de limpieza.

      // Devolver una respuesta exitosa
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  RegisterAdmin: async (req, res) => {
    try {
      const { password, nombre, apellido, email, roles } = req.body;

      // Validar la contraseña antes de hash
      if (!(await module.exports.ValidatePassword(password))) {
        return res.status(400).json({
          message: "La contraseña no cumple con los requisitos de seguridad.",
        });
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Determinar el rol del usuario según la ruta
      const role = req.originalUrl.includes("/loginAdmin") ? "admin" : "user";

      const newUser = new UserSchema({
        password: hashedPassword,
        nombre,
        apellido,
        email,
        role, // Agregar el campo role al modelo de usuario
      });
      if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        //devuelve el id del rol
        newUser.roles = foundRoles.map((role) => role._id);
      } else {
        //si el user no entrega el rol, se le da user por defecto
        const role = await Role.findOne({ name: "admin" });
        newUser.roles = [role._id];
      }
      try {
        const savedUser = await newUser.save();
        res.json(savedUser);
      } catch (saveError) {
        console.error(saveError);
        res.status(500).json({ message: saveError.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
