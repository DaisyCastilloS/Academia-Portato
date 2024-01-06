const bcrypt = require("bcrypt");
const UserSchema = require("../models/user.models.js");
const { tokenSign } = require("../helpers/generateToken.js");

module.exports = {
  RegisterUser: async (req, res) => {
    try {
      const { password, nombre, apellido, email } = req.body;

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserSchema({
        password: hashedPassword,
        nombre,
        apellido,
        email,
      });
      try {
        const savedUser = await newUser.save();
        res.json(savedUser);
        console.log(savedUser);
      } catch (saveError) {
        console.error(saveError);
        res.status(500).json({ message: saveError.message });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  LoginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await UserSchema.findOne({ email });

      // Check if the user exists
      if (user) {
        // Compare hashed passwords using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        const tokenSession = await tokenSign(user);
        //console.log(tokenSession);
        console.log(user.password);

        if (isPasswordValid) {
          // Passwords match, generate a token

          // Return the user and token
          res.send({
            data: user,
            tokenSession,
          });
        } else {
          // Passwords do not match, return an error message
          res.status(401).json({ message: "Invalid password" });
        }
      } else {
        // User not found, return an error message
        res.status(401).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};