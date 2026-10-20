
const express = require("express");

const {
  registrarUsuario,
  iniciarSesion
} = require("../controller/authController");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

module.exports = router;
