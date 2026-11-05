
const express = require("express");
const router = express.Router();

const protegerRuta = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  obtenerMiPerfil,
  actualizarMiPerfil,
  actualizarFotoPerfil
} = require("../controller/userController");

router.get("/me", protegerRuta, obtenerMiPerfil);
router.patch("/me", protegerRuta, actualizarMiPerfil);
router.patch("/me/avatar",protegerRuta,upload.single("imagen"),actualizarFotoPerfil);

module.exports = router;
