const Contenido = require("../models/Contenido");

exports.obtener = async (req, res, next) => {
  try {
    const doc = await Contenido.findOne({ cuaderno: req.params.id });
    res.status(200).json({
      titulo: doc ? doc.titulo || "" : "",
      contenido: doc ? doc.contenido : null,
    });
  } catch (err) {
    next(err);
  }
};

//Crea el contenido si no existe, o lo actualiza si ya existe
exports.guardar = async (req, res, next) => {
  try {
    const cambios = {};
    if (req.body.titulo !== undefined) cambios.titulo = req.body.titulo;
    if (req.body.contenido !== undefined) cambios.contenido = req.body.contenido;

    const doc = await Contenido.findOneAndUpdate({ cuaderno: req.params.id }, cambios, {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    });

    //cuando exista el modelo Cuaderno (en el manejo de cuaderno), actualizar también su título:
    // if (req.body.titulo !== undefined)
    //   await Cuaderno.findByIdAndUpdate(req.params.id, { titulo: req.body.titulo });

    res.status(200).json({ ok: true, actualizado: doc.updatedAt });
  } catch (err) {
    next(err);
  }
};