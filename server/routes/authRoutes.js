const express = require("express");

const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil,
} = require("../controllers/authController");
const protegerRuta = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);
router.get("/me", protegerRuta, obtenerPerfil);
router.patch("/me", protegerRuta, actualizarPerfil);

module.exports = router;