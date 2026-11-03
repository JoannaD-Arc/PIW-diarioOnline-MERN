const Contenido = require("../models/Contenido");

// Crear
const crear = async (req, res) => {
  try {
    const nuevoContenido = new Contenido({
      owner: req.userId,
      titulo: req.body.titulo || "Cuaderno sin título",
      contenido: req.body.contenido || null,
    });
    
    await nuevoContenido.save();
    res.status(201).json({ exito: true, data: nuevoContenido });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

// Listar
const listar = async (req, res) => {
  try {
    const cuadernos = await Contenido.find({ owner: req.userId });
    res.status(200).json({ exito: true, data: cuadernos });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

// Obtener
const obtener = async (req, res) => {
  try {
    const cuaderno = await Contenido.findOne({ 
      _id: req.params.id, 
      owner: req.userId 
    });

    if (!cuaderno) {
      return res.status(404).json({ exito: false, error: "No encontrado o no tienes permiso" });
    }

    res.status(200).json({ exito: true, data: cuaderno });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

// Guardar
const guardar = async (req, res) => {
  try {
    const cuaderno = await Contenido.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { 
        contenido: req.body.contenido,
        titulo: req.body.titulo 
      },
      { new: true }
    );

    if (!cuaderno) return res.status(404).json({ exito: false, error: "No encontrado" });

    res.status(200).json({ exito: true, data: cuaderno });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

// Eliminar
const eliminar = async (req, res) => {
  try {
    const cuaderno = await Contenido.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.userId 
    });

    if (!cuaderno) return res.status(404).json({ exito: false, error: "No encontrado" });

    res.status(200).json({ exito: true, mensaje: "Cuaderno eliminado" });
  } catch (error) {
    res.status(500).json({ exito: false, error: error.message });
  }
};

module.exports = {
  crear,
  listar,
  obtener,
  guardar,
  eliminar
};