
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const protegerRuta = require("./middleware/authMiddleware");

const app = express();

if (!process.env.MONGODB_URI) {
  throw new Error("Falta configurar MONGODB_URI en .env");
}

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

app.get("/", (req, res) => {
  res.send("Servidor del diario online funcionando.");
});

app.use("/api/auth", authRoutes);

app.get("/api/auth/me", protegerRuta, (req, res) => {
  res.status(200).json({
    mensaje: "Token válido.",
    userId: req.userId
  });
});

const PORT = process.env.PORT || 5000;

async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("¡Conexión exitosa con MongoDB Atlas!");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:");
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();
