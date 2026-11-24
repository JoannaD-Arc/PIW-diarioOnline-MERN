const router = require("express").Router();
const upload = require("../middlewares/upload");
const ctrl = require("../controllers/imagenController");
const protegerRuta = require("../middlewares/authMiddleware");

router.post("/", protegerRuta, upload.single("imagen"), ctrl.subir);

module.exports = router;
