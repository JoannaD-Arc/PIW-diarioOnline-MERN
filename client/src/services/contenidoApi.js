import { pedir } from "./http";

export const obtenerContenido = async (cuadernoId) => {
  const r = await pedir(`/contenido/cuadernos/${cuadernoId}/contenido`);
  return r.data;
};

export const guardarContenido = async (cuadernoId, datos) => {
  const r = await pedir(`/contenido/cuadernos/${cuadernoId}/contenido`, {
    method: "PUT",
    body: datos,
  });
  return r.data;
};

export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append("imagen", archivo);
  const r = await pedir("/imagenes", { method: "POST", body: formData });
  return r.url;
};
