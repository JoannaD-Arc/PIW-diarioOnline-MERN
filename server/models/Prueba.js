const mongoose = require("mongoose");

const pruebaSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Prueba", pruebaSchema);