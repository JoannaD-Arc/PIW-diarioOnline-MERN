const mongoose= require("mongoose");
//"Contenido" de un cuaderno, solo hay un documento por cuaderno, es una hoja continua
//Aquí solo se guarda el id del cuaderno

const contenidoSchema = new mongoose.Schema(
  {
    cuaderno: { type: mongoose.Schema.Types.ObjectId, ref: "Cuaderno", required: true, unique: true },
    titulo: { type: String, default: "", trim: true },
    contenido: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contenido", contenidoSchema);