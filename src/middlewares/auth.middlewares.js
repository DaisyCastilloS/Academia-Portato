const { verifyToken } = require("../helpers/generateToken.js");
const UserSchema = require("../models/user.models.js");

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
  isAdmin: async (req, res, next) => {
    try {
      const { email } = req;
      const adminUser = await UserSchema.findOne({ where: { email } });
      console.log(adminUser);
      if (!adminUser || adminUser.role !== "admin") {
        throw new Error("You are not an admin");
      }

      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};
