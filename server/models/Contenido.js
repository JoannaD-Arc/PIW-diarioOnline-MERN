const mongoose = require("mongoose");

const contenidoSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    titulo: { type: String, default: "Cuaderno sin título", trim: true },
    contenido: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contenido", contenidoSchema);