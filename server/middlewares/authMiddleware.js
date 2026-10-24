
const jwt = require("jsonwebtoken");

const protegerRuta = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Debes iniciar sesión para acceder."
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (typeof payload.sub !== "string") {
      return res.status(401).json({
        mensaje: "Token inválido."
      });
    }

    req.userId = payload.sub;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "La sesión es inválida o ha expirado."
    });
  }
};

module.exports = protegerRuta;
