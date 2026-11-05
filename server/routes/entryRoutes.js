
const express = require("express");
const router = express.Router();

const protegerRuta = require("../middleware/authMiddleware");

const {
  crearEntrada,
  obtenerEntradas,
  obtenerEntrada,
  actualizarEntrada,
  eliminarEntrada
} = require("../controller/entryController");

router.use(protegerRuta);

router.post("/", crearEntrada);
router.get("/", obtenerEntradas);
router.get("/:id", obtenerEntrada);
router.patch("/:id", actualizarEntrada);
router.delete("/:id", eliminarEntrada);

module.exports = router;
