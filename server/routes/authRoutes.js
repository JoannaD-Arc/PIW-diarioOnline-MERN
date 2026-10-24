<<<<<<< HEAD

const express = require("express");

const {
  registrarUsuario,
  iniciarSesion
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

module.exports = router;
=======

const express = require("express");

const {
  registrarUsuario,
  iniciarSesion
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

module.exports = router;
>>>>>>> 86613929445d415d216e305e2ca45f53fdbb6d68
