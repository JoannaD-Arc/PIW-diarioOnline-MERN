
const mongoose = require("mongoose");
const Entry = require("../models/Entry");

// POST /api/entries
const crearEntrada = async (req, res) => {
  try {
    const { titulo, contenido, dibujo } = req.body;

    if (typeof titulo !== "string" || !titulo.trim()) {
      return res.status(400).json({
        mensaje: "El título es obligatorio."
      });
    }

    if (
      contenido !== undefined &&
      typeof contenido !== "string"
    ) {
      return res.status(400).json({
        mensaje: "El contenido debe ser texto."
      });
    }

    const entrada = await Entry.create({
      titulo: titulo.trim(),
      contenido: contenido ?? "",
      dibujo: dibujo ?? null,
      propietario: req.userId
    });

    res.status(201).json({
      mensaje: "Entrada creada correctamente.",
      entrada
    });
  } catch (error) {
    console.error("Error al crear entrada:", error.message);

    res.status(500).json({
      mensaje: "Error al crear la entrada."
    });
  }
};

// GET /api/entries
const obtenerEntradas = async (req, res) => {
  try {
    const entradas = await Entry.find({
      propietario: req.userId
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      total: entradas.length,
      entradas
    });
  } catch (error) {
    console.error("Error al consultar entradas:", error.message);

    res.status(500).json({
      mensaje: "Error al consultar las entradas."
    });
  }
};

// GET /api/entries/:id
const obtenerEntrada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El identificador de la entrada no es válido."
      });
    }

    const entrada = await Entry.findOne({
      _id: id,
      propietario: req.userId
    });

    if (!entrada) {
      return res.status(404).json({
        mensaje: "Entrada no encontrada."
      });
    }

    res.status(200).json({ entrada });
  } catch (error) {
    console.error("Error al consultar entrada:", error.message);

    res.status(500).json({
      mensaje: "Error al consultar la entrada."
    });
  }
};

// PATCH /api/entries/:id
const actualizarEntrada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El identificador de la entrada no es válido."
      });
    }

    const camposPermitidos = ["titulo", "contenido", "dibujo"];
    const camposRecibidos = Object.keys(req.body);

    if (
      camposRecibidos.length === 0 ||
      camposRecibidos.some(
        campo => !camposPermitidos.includes(campo)
      )
    ) {
      return res.status(400).json({
        mensaje: "Los campos permitidos son titulo, contenido y dibujo."
      });
    }

    const actualizaciones = {};

    if (req.body.titulo !== undefined) {
      if (
        typeof req.body.titulo !== "string" ||
        !req.body.titulo.trim()
      ) {
        return res.status(400).json({
          mensaje: "El título debe ser texto no vacío."
        });
      }

      actualizaciones.titulo = req.body.titulo.trim();
    }

    if (req.body.contenido !== undefined) {
      if (typeof req.body.contenido !== "string") {
        return res.status(400).json({
          mensaje: "El contenido debe ser texto."
        });
      }

      actualizaciones.contenido = req.body.contenido;
    }

    if (req.body.dibujo !== undefined) {
      actualizaciones.dibujo = req.body.dibujo;
    }

    const entrada = await Entry.findOneAndUpdate(
      {
        _id: id,
        propietario: req.userId
      },
      { $set: actualizaciones },
      {
        new: true,
        runValidators: true
      }
    );

    if (!entrada) {
      return res.status(404).json({
        mensaje: "Entrada no encontrada."
      });
    }

    res.status(200).json({
      mensaje: "Entrada actualizada correctamente.",
      entrada
    });
  } catch (error) {
    console.error("Error al actualizar entrada:", error.message);

    res.status(500).json({
      mensaje: "Error al actualizar la entrada."
    });
  }
};

// DELETE /api/entries/:id
const eliminarEntrada = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El identificador de la entrada no es válido."
      });
    }

    const entrada = await Entry.findOneAndDelete({
      _id: id,
      propietario: req.userId
    });

    if (!entrada) {
      return res.status(404).json({
        mensaje: "Entrada no encontrada."
      });
    }

    res.status(200).json({
      mensaje: "Entrada eliminada correctamente."
    });
  } catch (error) {
    console.error("Error al eliminar entrada:", error.message);

    res.status(500).json({
      mensaje: "Error al eliminar la entrada."
    });
  }
};

module.exports = {
  crearEntrada,
  obtenerEntradas,
  obtenerEntrada,
  actualizarEntrada,
  eliminarEntrada
};
