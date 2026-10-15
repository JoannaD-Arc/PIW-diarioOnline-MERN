
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protegerRuta = require("./middleware/authMiddleware");

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en .env");
}

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    mensaje: "La API está funcionando."
  });
});

app.use("/api/auth", authRoutes);

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
