const API = "http://localhost:4000/api/v1";

async function pedir(ruta, opciones) {
  const res = await fetch(`${API}${ruta}`, opciones);
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(datos.error || "Error en la petición");
  return datos;
}

export const obtenerContenido = (cuadernoId) => pedir(`/cuadernos/${cuadernoId}/contenido`);

export const guardarContenido = (cuadernoId, datos) =>
  pedir(`/cuadernos/${cuadernoId}/contenido`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos), // { titulo, contenido }
  });

//Sube una imagen al servidor y devuelve su URL
export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);
  const datos = await pedir("/imagenes", { method: "POST", body: formData });
  return datos.url;
}