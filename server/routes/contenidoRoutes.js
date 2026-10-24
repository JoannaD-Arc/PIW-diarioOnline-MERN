const router = require("express").Router();
const ctrl = require("../controllers/contenidoController");

router.get("/cuadernos/:id/contenido", ctrl.obtener);
router.put("/cuadernos/:id/contenido", ctrl.guardar);

module.exports = router;