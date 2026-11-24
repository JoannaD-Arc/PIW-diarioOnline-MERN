const mongoose = require("mongoose");
const Contenido = require("../models/Contenido");

const idValido = (id) => mongoose.isValidObjectId(id);
const noEncontrado = (res) =>
  res.status(404).json({ exito: false, error: "Diario no encontrado." });

// POST /api/contenido -> crear diario
const crear = async (req, res) => {
  try {
    const nuevo = await Contenido.create({
      owner: req.userId,
      titulo: req.body.titulo || undefined,
      color: req.body.color || "#ffffff",
      contenido: req.body.contenido || {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
    });
    res.status(201).json({ exito: true, data: nuevo });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ exito: false, error: "No se pudo crear el diario." });
  }
};

// GET /api/contenido -> listar diarios del usuario
const listar = async (req, res) => {
  try {
    const diarios = await Contenido.find({ owner: req.userId })
      .select("titulo archivado color createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.status(200).json({ exito: true, data: diarios });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ exito: false, error: "No se pudieron cargar los diarios." });
  }
};

// GET /api/contenido/cuadernos/:id/contenido -> abrir un diario
const obtener = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return noEncontrado(res);
    const diario = await Contenido.findOne({
      _id: req.params.id,
      owner: req.userId,
    });
    if (!diario) return noEncontrado(res);
    res.status(200).json({ exito: true, data: diario });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ exito: false, error: "No se pudo abrir el diario." });
  }
};

// PUT /api/contenido/cuadernos/:id/contenido -> guardar título, color y/o contenido
const guardar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return noEncontrado(res);

    const cambios = {};
    if (typeof req.body.titulo === "string") cambios.titulo = req.body.titulo;
    if (typeof req.body.color === "string") cambios.color = req.body.color;
    if (req.body.contenido !== undefined)
      cambios.contenido = req.body.contenido;

    const diario = await Contenido.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      cambios,
      { new: true, runValidators: true },
    );
    if (!diario) return noEncontrado(res);
    res.status(200).json({ exito: true, data: diario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ exito: false, error: "No se pudo guardar." });
  }
};

// PATCH /api/contenido/:id/archivar body: { archivado: true | false }
const archivar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return noEncontrado(res);
    if (typeof req.body.archivado !== "boolean") {
      return res
        .status(400)
        .json({ exito: false, error: "Falta 'archivado' (true o false)." });
    }
    const diario = await Contenido.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { archivado: req.body.archivado },
      { new: true },
    ).select("titulo archivado color createdAt updatedAt");
    if (!diario) return noEncontrado(res);
    res.status(200).json({ exito: true, data: diario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ exito: false, error: "No se pudo archivar." });
  }
};

// DELETE /api/contenido/:id
const eliminar = async (req, res) => {
  try {
    if (!idValido(req.params.id)) return noEncontrado(res);
    const diario = await Contenido.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });
    if (!diario) return noEncontrado(res);
    res.status(200).json({ exito: true, mensaje: "Diario eliminado." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ exito: false, error: "No se pudo eliminar." });
  }
};

module.exports = { crear, listar, obtener, guardar, archivar, eliminar };