const { verifyToken } = require("../helpers/generateToken");

module.exports = {
  AuthMiddleware: async (req, res, next) => {
    try {
      // Verificar si la ruta es pública (accesible sin autenticación)
      const isPublicRoute =
        req.path === "/" ||
        req.path === "/registerUser" ||
        req.path === "/loginUser";

      // Si es una ruta pública, permitir acceso sin verificar el token
      if (isPublicRoute) {
        next();
        return;
      }

      // Check if the Authorization header is present
      const token = req.headers.authorization?.split(" ").pop();
      if (!token) {
        res
          .status(401)
          .send({ error: "Debes estar logueado para registrar un curso" });
        return;
      }

      // Verify the token
      const tokenData = await verifyToken(token);

      // Check if the token is valid and contains user information
      if (tokenData && tokenData._id) {
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(401).send({ error: "Invalid or malformed token" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Internal server error" });
    }
  },

  // LoginUser: async (req, res) => {
  //   try {
  //     const { email, password } = req.body;

  //     // Find the user by email
  //     const user = await UserSchema.findOne({ email });

  //     // Check if the user exists
  //     if (user) {
  //       // Compare hashed passwords using bcrypt
  //       const isPasswordValid = await bcrypt.compare(password, user.password);
  //       const tokenSession = await tokenSign(user);
  //       if (isPasswordValid) {
  //         // Passwords match, generate a token

  //         // Return the user and token
  //         res.send({
  //           data: user,
  //           tokenSession,
  //         });
  //       } else {
  //         // Passwords do not match, return an error message
  //         res.status(401).json({ message: "Invalid password" });
  //       }
  //     } else {
  //       // User not found, return an error message

  //       res.status(401).json({ message: "Usuario no encontrado" });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
};
