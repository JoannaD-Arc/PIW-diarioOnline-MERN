// URL
const API = "http://localhost:5000/api/contenido";

async function pedir(ruta, opciones = {}) {
  // Token
  const token = localStorage.getItem("token");

  // Headers
  const headers = {
    ...opciones.headers,
    "Authorization": `Bearer ${token}`
  };

  // Petición
  const res = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers
  });
  
  // Respuesta
  const datos = await res.json().catch(() => ({}));
  
  // Error
  if (!res.ok) throw new Error(datos.error || datos.mensaje || "Error en la petición");
  return datos;
}

// GET
export const obtenerContenido = async (cuadernoId) => {
  const respuesta = await pedir(`/cuadernos/${cuadernoId}/contenido`);
  return respuesta.data;
};

// PUT
export const guardarContenido = async (cuadernoId, datos) => {
  const respuesta = await pedir(`/cuadernos/${cuadernoId}/contenido`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return respuesta.data;
};

// POST Imagen
export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);
  
  const res = await fetch("http://localhost:5000/api/editor/imagenes", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData
  });

  const datos = await res.json();
  if (!res.ok) throw new Error(datos.error || "Error al subir imagen");
  return datos.url;
}