const router = require("express").Router();
const upload = require("../middlewares/upload");
const ctrl = require("../controllers/imagenController");

router.post("/imagenes", upload.single("imagen"), ctrl.subir);

module.exports = router;