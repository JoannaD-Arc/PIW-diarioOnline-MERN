
const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio."],
      trim: true,
      maxlength: 120
    },

    contenido: {
      type: String,
      default: "",
      maxlength: 50000
    },

    // Datos opcionales del dibujo, por ejemplo,
    // una estructura JSON de trazos del lienzo.
    dibujo: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Entry", entrySchema);
