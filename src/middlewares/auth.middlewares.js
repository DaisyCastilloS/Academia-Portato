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
        res.status(401).send({ error: "Debes estar logueado" });
        return;
      }

      // Verify the token
      const tokenData = await verifyToken(token);
      //comparara si la id del token es igual al id del user
      const user = await UserSchema.findById(tokenData._id);
      req.user = user;
      console.log(user);
      next();
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Internal server error" });
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      const authToken = req.headers.authorization;
      console.log("Auth token:", authToken);
      if (!authToken) {
        throw new Error("Token not provided");
      }
      //aqui esta el problem,no se puede verificar el token
      const userData = await verifyToken(authToken);
      console.log("Token data:", userData);
      if (!userData || !userData._id) {
        throw new Error("Invalid token data");
      }

      const user = await UserSchema.findById(userData._id);
      if (!user) {
        throw new Error("User not found");
      }
      const isAdmin = user.role === "admin";
      if (isAdmin) {
        throw new Error("You are not an admin");
      }

      req.adminId = user._id;

      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};
