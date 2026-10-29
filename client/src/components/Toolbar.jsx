import { useRef, useState } from "react";
import { subirImagen } from "../api";

  export default function Toolbar({ editor, estado }) {
  const inputImagen = useRef(null);
  const [previa, setPrevia] = useState(null); // { archivo, url } mientras se confirma la imagen
  const [subiendo, setSubiendo] = useState(false);
  if (!editor) return null;

  //resalta cuando el formato está activo 
  const boton = (texto, titulo, accion, activo = false) => (
    <button
      type="button"
      title={titulo}
      onClick={accion}
      style={{ fontWeight: activo ? "bold" : "normal", background: activo ? "#cfd8dc" : "#fff" }}
    >
      {texto}
    </button>
  );

  const nivelActual = [1, 2, 3].find((n) => editor.isActive("heading", { level: n })) || 0;

  const alineacionImagen = editor.getAttributes("image").align || "none";

  function alinearImagen(align) {
    editor.chain().focus().updateAttributes("image", { align }).run();
  }

  function cambiarEstilo(e) {
    const nivel = Number(e.target.value);
    if (nivel === 0) editor.chain().focus().setParagraph().run();
    else editor.chain().focus().setHeading({ level: nivel }).run();
  }

  function ponerEnlace() {
    const previo = editor.getAttributes("link").href || "";
    const url = window.prompt("URL del enlace:", previo);
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = /^(https?:\/\/|mailto:)/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }


  function alElegirImagen(e) {
  const archivo = e.target.files[0];
  e.target.value = ""; // permite elegir la misma imagen otra vez
  if (!archivo) return;
  setPrevia({ archivo, url: URL.createObjectURL(archivo) }); // solo vista previa local
  }

  function cancelarImagen() {
    URL.revokeObjectURL(previa.url);
    setPrevia(null);
  }

  async function insertarImagen() {
    setSubiendo(true);
    try {
      const url = await subirImagen(previa.archivo); // aquí recién se sube
      editor.chain().focus().setImage({ src: url }).run();
      cancelarImagen();
    } catch (err) {
      alert(`No se pudo subir la imagen: ${err.message}`);
    } finally {
      setSubiendo(false);
    }
  }

  function borrarTodo() {
    const seguro = window.confirm(
      "¿Seguro que quieres borrar todo el contenido del cuaderno?\n\nSe eliminarán el texto y las imágenes (el título se conserva)."
    );
    if (!seguro) return;
    editor.chain().focus().selectAll().deleteSelection().run();
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 6, borderBottom: "1px solid #ccc", background: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>
      <select value={nivelActual} onChange={cambiarEstilo} title="Estilo de párrafo">
        <option value={0}>Texto normal</option>
        <option value={1}>Encabezado 1</option>
        <option value={2}>Encabezado 2</option>
        <option value={3}>Encabezado 3</option>
      </select>

      {boton("N", "Negrita", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {boton("K", "Cursiva", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {boton("S", "Subrayado", () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}

      {boton("• Lista", "Lista con viñetas", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {boton("1. Lista", "Lista numerada", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}

      {boton("Izq", "Alinear a la izquierda", () => editor.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: "left" }))}
      {boton("Centro", "Centrar", () => editor.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: "center" }))}
      {boton("Der", "Alinear a la derecha", () => editor.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: "right" }))}
      {boton("Justificar", "Justificar", () => editor.chain().focus().setTextAlign("justify").run(), editor.isActive({ textAlign: "justify" }))}

      {boton("Enlace", "Insertar o editar enlace", ponerEnlace, editor.isActive("link"))}
      {boton("Imagen", "Insertar imagen", () => inputImagen.current.click())}
      <input ref={inputImagen} type="file" accept="image/*" onChange={alElegirImagen} style={{ display: "none" }} />
            {editor.isActive("image") && (
        <>
          {boton("Img izq.", "Imagen a la izquierda (el texto la rodea)", () => alinearImagen("left"), alineacionImagen === "left")}
          {boton("Img centro", "Imagen centrada (sin texto a los lados)", () => alinearImagen("center"), alineacionImagen === "center")}
          {boton("Img der.", "Imagen a la derecha (el texto la rodea)", () => alinearImagen("right"), alineacionImagen === "right")}
          {boton("Sin ajuste", "Imagen sola en su línea, a la izquierda", () => alinearImagen("none"), alineacionImagen === "none")}
        </>
      )}

      {boton("Deshacer", "Deshacer", () => editor.chain().focus().undo().run())}
      {boton("Rehacer", "Rehacer", () => editor.chain().focus().redo().run())}

            <button
        type="button"
        title="Borrar todo el contenido"
        onClick={borrarTodo}
        disabled={editor.isEmpty}
        style={{ color: "#b00020" }}
      >
        Borrar todo
      </button>

      <span style={{ marginLeft: "auto" }}>{estado}</span>

            {previa && (
        <div
          style={{
            flexBasis: "100%",
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: 6,
            background: "#fff",
            border: "1px solid #ccc",
          }}
        >
          <img src={previa.url} alt="Vista previa" style={{ maxHeight: 120, maxWidth: 200 }} />
          <div>
            <div>{previa.archivo.name}</div>
            <button type="button" onClick={insertarImagen} disabled={subiendo}>
              {subiendo ? "Subiendo..." : "Insertar imagen"}
            </button>{" "}
            <button type="button" onClick={cancelarImagen} disabled={subiendo}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}