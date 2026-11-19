const express = require("express");

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
} = require("../controllers/authController");
const protegerRuta = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);
router.get("/me", protegerRuta, obtenerPerfil);

module.exports = router;
