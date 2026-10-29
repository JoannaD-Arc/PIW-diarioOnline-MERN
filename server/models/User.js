
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Agregue un nombre"],
      trim: true,
      minlength: 2,
      maxlength: 60
    },

    email: {
      type: String,
      required: [true, "Por favor, ingrese un correo electrónico"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },

    password: {
      type: String,
      required: [true, "Ingrese una contraseña"],
      select: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
