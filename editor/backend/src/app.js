require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const conectarDB = require("./config/db");
const contenidoRoutes = require("./routes/contenidoRoutes");
const imagenRoutes = require("./routes/imagenRoutes");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "5mb" }));

//sirve las imágenes guardadas en backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/v1/cuadernos", contenidoRoutes);
app.use("/api/v1/imagenes", imagenRoutes);

//manejo de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  const es400 =
    err.name === "MulterError" ||
    err.name === "CastError" ||
    err.message === "Solo se permiten imágenes";
  res.status(es400 ? 400 : 500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;

conectarDB()
  .then(() => app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB:", err.message);
    process.exit(1);
  });