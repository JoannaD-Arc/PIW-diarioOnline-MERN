
require("dotenv").config();

// Prueba temporal para ver si lee el archivo
console.log("El secreto de mi Diario Koi es:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");

const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protegerRuta = require("./middlewares/authMiddleware");

const contenidoRoutes = require("./routes/contenidoRoutes");
const imagenRoutes = require("./routes/imagenRoutes");

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en .env");
}

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));

app.use(express.json({ limit: "50mb" }));

//BORRAR

const Prueba = require("./models/Prueba");


app.post("/api/prueba", async (req, res) => {
  try {
    const nuevaPrueba = new Prueba({ mensaje: req.body.mensaje });
    await nuevaPrueba.save(); // Aquí se guarda en Atlas
    res.status(201).json({ exito: true, data: nuevaPrueba });
  } catch (error) {
    console.error("EL ERROR EXACTO ES:", error);
    res.status(500).json({ exito: false, error: error.message });
  }
});

//BORRAR

app.get("/api/health", (req, res) => {
  res.status(200).json({
    mensaje: "La API está funcionando."
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/editor", contenidoRoutes);
app.use("/api/editor", imagenRoutes);


// Ruta temporal para probar la autenticación.
app.get("/api/auth/me", protegerRuta, (req, res) => {
  res.status(200).json({
    mensaje: "Token válido.",
    userId: req.userId
  });
});

const iniciarServidor = async () => {
  await conectarDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
  });
};

iniciarServidor();
