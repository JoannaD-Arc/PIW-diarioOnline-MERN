const router = require("express").Router();
const ctrl = require("../controllers/contenidoController");

router.get("/:id/contenido", ctrl.obtener);
router.put("/:id/contenido", ctrl.guardar);

module.exports = router;