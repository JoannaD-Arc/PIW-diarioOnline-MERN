const cloudinary = require("../config/cloudinary");

exports.subir = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

  try {
    //sube el archivo que está en memoria a la carpeta "cuadernos" de Cloudinary
    const resultado = await new Promise((resolve, reject) => {
      const flujo = cloudinary.uploader.upload_stream(
        { folder: "cuadernos", resource_type: "image" },
        (error, resultado) => (error ? reject(error) : resolve(resultado))
      );
      flujo.end(req.file.buffer);
    });

    res.status(201).json({ url: resultado.secure_url });
  } catch (err) {
    console.error("Error al subir a Cloudinary:", err.message);
    res.status(500).json({ error: "No se pudo subir la imagen" });
  }
};