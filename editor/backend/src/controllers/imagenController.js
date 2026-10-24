exports.subir = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

  const url = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
};