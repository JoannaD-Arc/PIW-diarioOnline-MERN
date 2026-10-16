
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crearToken = (userId) => {
  return jwt.sign(
    { sub: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

// REGISTRO
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        mensaje: "Debes proporcionar nombre, correo y contraseña."
      });
    }

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim().toLowerCase();

    if (nombreLimpio.length < 2 || nombreLimpio.length > 60) {
      return res.status(400).json({
        mensaje: "El nombre debe tener entre 2 y 60 caracteres."
      });
    }

    if (
      emailLimpio.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)
    ) {
      return res.status(400).json({
        mensaje: "El correo electrónico no es válido."
      });
    }

    if (password.length < 12 || password.length > 128) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener entre 12 y 128 caracteres."
      });
    }

    const usuarioExistente = await User.findOne({
      email: emailLimpio
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "No se pudo crear la cuenta."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const nuevoUsuario = await User.create({
      nombre: nombreLimpio,
      email: emailLimpio,
      password: passwordHash
    });

    const token = crearToken(nuevoUsuario._id);

    return res.status(201).json({
      mensaje: "Se creo la cuenta correctamente.",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "No se pudo crear la cuenta."
      });
    }

    console.error("Error en el registro:", error.message);

    return res.status(500).json({
      mensaje: "Ocurrió un error al crear la cuenta."
    });
  }
};

// INICIO DE SESIÓN
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim().length === 0 ||
      password.length === 0
    ) {
      return res.status(400).json({
        mensaje: "Debes proporcionar correo y contraseña."
      });
    }

    const emailLimpio = email.trim().toLowerCase();

    const usuario = await User.findOne({
      email: emailLimpio
    }).select("+password");

    if (
      !usuario ||
      !(await bcrypt.compare(password, usuario.password))
    ) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos."
      });
    }

    const token = crearToken(usuario._id);

    return res.status(200).json({
      mensaje: "Sesión iniciada correctamente.",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error("Error en el login:", error.message);

    return res.status(500).json({
      mensaje: "Ocurrió un error al iniciar sesión."
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};
