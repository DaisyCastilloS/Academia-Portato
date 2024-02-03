const jwt = require("jsonwebtoken");
module.exports = {
  //generar un token firmado
  tokenSign: async (user) => {
    return jwt.sign(
      {
        _id: user.id,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );
  },

  verifyToken: async (token) => {
    try {
      return jwt.verify(token, process.env.TOKEN_KEY);
    } catch (e) {
      return null;
    }
  },

  decodeSign: async (token) => {
    //TODO: Verificar que el token sea valido y correcto
    return jwt.decode(token, null);
  },
};
