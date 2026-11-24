const mongoose = require("mongoose");

const contenidoSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    titulo: { type: String, default: "Diario sin título", trim: true, maxlength: 150 },
    contenido: { type: mongoose.Schema.Types.Mixed, default: null }, // JSON de TipTap
    color: { type: String, default: "#ffffff" },
    archivado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contenido", contenidoSchema);
