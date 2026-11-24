require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contenidoRoutes = require("./routes/contenidoRoutes");
const imagenRoutes = require("./routes/imagenRoutes");

if (!process.env.JWT_SECRET) {
  throw new Error("Falta configurar JWT_SECRET en .env");
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ mensaje: "La API está funcionando." });
});

app.use("/api/auth", authRoutes); // POST /register, POST /login, GET /me
app.use("/api/contenido", contenidoRoutes); // diarios + contenido (requiere token)
app.use("/api/imagenes", imagenRoutes); // subir imagen (requiere token)

// Servir archivos estáticos del frontend compilado
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

// Cualquier ruta que no sea /api devuelve el index.html de React
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Rutas que no existen
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// Errores (multer: imagen muy pesada / formato no permitido, JSON mal formado, etc.)
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "La imagen pesa más de 5 MB." });
  }
  if (err.message === "Solo se permiten imágenes") {
    return res.status(400).json({ error: err.message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido." });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

const iniciarServidor = async () => {
  await conectarDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
};

iniciarServidor();