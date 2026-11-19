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
}

export const listarDiarios = async () => (await pedir("/contenido")).data;

export const crearDiario = async (titulo = "Diario sin título") =>
  (await pedir("/contenido", { method: "POST", body: { titulo } })).data;

export const eliminarDiario = (id) =>
  pedir(`/contenido/${id}`, { method: "DELETE" });

export const archivarDiario = async (id, archivado) =>
  (
    await pedir(`/contenido/${id}/archivar`, {
      method: "PATCH",
      body: { archivado },
    })
  ).data;
