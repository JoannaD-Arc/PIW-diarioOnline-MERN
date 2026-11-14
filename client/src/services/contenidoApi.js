import { pedir } from "./http";

export const obtenerContenido = async (cuadernoId) =>
  pedir(`/contenido/cuadernos/${cuadernoId}/contenido`);

export const guardarContenido = async (cuadernoId, datos) =>
  pedir(`/contenido/cuadernos/${cuadernoId}/contenido`, {
    method: "PUT",
    body: datos,
  });

export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);
  const r = await pedir("/imagenes", { method: "POST", body: formData });
  return r.url;
}
