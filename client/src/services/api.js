// URL base del backend. En el mismo dominio queda vacía ("") y usa rutas relativas /api/...
const API_URL = import.meta.env.VITE_API_URL || "";

// Petición con token. Devuelve el JSON; si falla lanza un Error con el mensaje del servidor.
async function pedir(ruta, opciones = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      ...opciones.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const datos = await res.json().catch(() => ({}));

  // Sesión vencida o inválida: se limpia el token y se manda al login
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.assign("/auth");
    throw new Error(datos.mensaje || "Sesión expirada.");
  }

  if (!res.ok)
    throw new Error(datos.error || datos.mensaje || "Error en la petición");
  return datos;
}

const json = (metodo, cuerpo) => ({
  method: metodo,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(cuerpo),
});

// ---------- Diarios ----------
// Devuelve [{ _id, titulo, archivado, createdAt, updatedAt }]
export const listarDiarios = async () => (await pedir("/api/contenido")).data;

// Devuelve el diario creado
export const crearDiario = async (titulo = "Diario sin título") =>
  (await pedir("/api/contenido", json("POST", { titulo }))).data;

export const eliminarDiario = (id) =>
  pedir(`/api/contenido/${id}`, { method: "DELETE" });

// archivado: true | false
export const archivarDiario = async (id, archivado) =>
  (await pedir(`/api/contenido/${id}/archivar`, json("PATCH", { archivado })))
    .data;

// ---------- Editor ----------
// Devuelve { _id, titulo, contenido, ... }
export const obtenerContenido = async (id) =>
  (await pedir(`/api/contenido/cuadernos/${id}/contenido`)).data;

// datos = { titulo, contenido }
export const guardarContenido = async (id, datos) =>
  (await pedir(`/api/contenido/cuadernos/${id}/contenido`, json("PUT", datos)))
    .data;

// ---------- Imágenes ----------
// Sube la imagen a Cloudinary a través del backend y devuelve su URL
export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);
  const datos = await pedir("/api/imagenes", {
    method: "POST",
    body: formData,
  });
  return datos.url;
}