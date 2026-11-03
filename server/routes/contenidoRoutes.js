const router = require("express").Router();
const ctrl = require("../controllers/contenidoController");
const protegerRuta = require("../middlewares/authMiddleware");

router.use(protegerRuta);

router.post("/", ctrl.crear);
router.get("/", ctrl.listar);
router.get("/cuadernos/:id/contenido", ctrl.obtener);
router.put("/cuadernos/:id/contenido", ctrl.guardar);

module.exports = router;