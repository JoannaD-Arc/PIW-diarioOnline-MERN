exports.subir = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

  const url = req.file.path; 
  
  res.status(201).json({ url });
};