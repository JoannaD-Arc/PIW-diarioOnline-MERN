
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

// GET /api/users/me
const obtenerMiPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.userId)
      .select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "No se encontró el usuario."
      });
    }

    res.status(200).json({
      usuario
    });
  } catch (error) {
    console.error("Error al consultar el perfil:", error.message);

    res.status(500).json({
      mensaje: "Error al consultar el perfil."
    });
  }
};

// PATCH /api/users/me
const actualizarMiPerfil = async (req, res) => {
  try {
    const camposPermitidos = ["nombre"];
    const camposRecibidos = Object.keys(req.body);

    if (
      camposRecibidos.length === 0 ||
      camposRecibidos.some(
        campo => !camposPermitidos.includes(campo)
      )
    ) {
      return res.status(400).json({
        mensaje: "Solo puedes actualizar el campo nombre."
      });
    }

    const actualizaciones = {};

    if (req.body.nombre !== undefined) {
      if (
        typeof req.body.nombre !== "string" ||
        !req.body.nombre.trim()
      ) {
        return res.status(400).json({
          mensaje: "El nombre debe ser un texto no vacío."
        });
      }

      actualizaciones.nombre = req.body.nombre.trim();
    }

    const usuario = await User.findByIdAndUpdate(
      req.userId,
      { $set: actualizaciones },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!usuario) {
      return res.status(404).json({
        mensaje: "No se encontró el usuario."
      });
    }

    res.status(200).json({
      mensaje: "Perfil actualizado correctamente.",
      usuario
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error.message);

    res.status(500).json({
      mensaje: "Error al actualizar el perfil."
    });
  }
};

const actualizarFotoPerfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje: "Debes seleccionar una imagen."
      });
    }

    const usuario = await User.findById(req.userId);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "No se encontró el usuario."
      });
    }

    // Subir imagen a Cloudinary
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "diario_online/perfiles",
          resource_type: "image",
          transformation: [
            {
              width: 500,
              height: 500,
              crop: "limit"
            }
          ]
        },
        (error, resultado) => {
          if (error) {
            reject(error);
          } else {
            resolve(resultado);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    // Actualizar perfil del usuario
    usuario.fotoPerfil = {
      url: resultado.secure_url,
      public_id: resultado.public_id
    };

    await usuario.save();

    res.status(200).json({
      mensaje: "Fotografía de perfil actualizada correctamente.",
      fotoPerfil: usuario.fotoPerfil
    });

  } catch (error) {
    console.error("Error al actualizar fotografía:", error.message);

    res.status(500).json({
      mensaje: "Error al actualizar la fotografía de perfil."
    });
  }
};


module.exports = {
  obtenerMiPerfil,
  actualizarMiPerfil,
  actualizarFotoPerfil
};
