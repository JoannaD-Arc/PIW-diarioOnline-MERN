import { useEffect, useRef, useState } from "react";
import "../../styles/toolbar.css";

function Icono({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function Toolbar({ editor, estado }) {
  const inputArchivoRef = useRef(null);
  const [previa, setPrevia] = useState(null); // { url, nombre }

  useEffect(() => {
    return () => {
      if (previa?.url) URL.revokeObjectURL(previa.url);
    };
  }, [previa]);

  if (!editor) return null;

  const valorBloque = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  const cambiarBloque = (e) => {
    const val = e.target.value;
    const chain = editor.chain().focus();
    if (val === "paragraph") chain.setParagraph().run();
    if (val === "h1") chain.toggleHeading({ level: 1 }).run();
    if (val === "h2") chain.toggleHeading({ level: 2 }).run();
    if (val === "h3") chain.toggleHeading({ level: 3 }).run();
  };

  const toggleEnlace = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("URL del enlace:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const abrirExplorador = () => {
    inputArchivoRef.current?.click();
  };

  const alSeleccionarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (previa?.url) URL.revokeObjectURL(previa.url);
    setPrevia({
      url: URL.createObjectURL(archivo),
      nombre: archivo.name,
    });
    e.target.value = "";
  };

  const confirmarInsertarImagen = () => {
    if (!previa?.url) return;
    editor.chain().focus().setImage({ src: previa.url }).run();
    setPrevia(null);
  };

  const cancelarPrevia = () => {
    if (previa?.url) URL.revokeObjectURL(previa.url);
    setPrevia(null);
  };

  const imagenSeleccionada = editor.isActive("image");
  const alineacionImagen = editor.getAttributes("image").align || "none";

  const alinearImagen = (align) => {
    const siguiente = alineacionImagen === align ? "none" : align;
    editor.chain().focus().updateAttributes("image", { align: siguiente }).run();
  };

  const eliminarImagen = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <div className="tb" role="toolbar" aria-label="Barra de herramientas">
      <input
        ref={inputArchivoRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={alSeleccionarArchivo}
      />

      <select
        className="tb-select"
        aria-label="Estilo de párrafo"
        value={valorBloque}
        onChange={cambiarBloque}
      >
        <option value="paragraph">Texto normal</option>
        <option value="h1">Título 1</option>
        <option value="h2">Título 2</option>
        <option value="h3">Título 3</option>
      </select>

      <span className="tb-separador" />

      {/* Negrita */}
      <button
        type="button"
        title="Negrita"
        aria-label="Negrita"
        className={`tb-btn ${editor.isActive("bold") ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icono>
          <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
          <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
        </Icono>
      </button>

      {/* Cursiva */}
      <button
        type="button"
        title="Cursiva"
        aria-label="Cursiva"
        className={`tb-btn ${editor.isActive("italic") ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icono>
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </Icono>
      </button>

      {/* Subrayado */}
      <button
        type="button"
        title="Subrayado"
        aria-label="Subrayado"
        className={`tb-btn ${editor.isActive("underline") ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Icono>
          <path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </Icono>
      </button>

      <span className="tb-separador" />

      {/* Lista de viñetas */}
      <button
        type="button"
        title="Lista de viñetas"
        aria-label="Lista de viñetas"
        className={`tb-btn ${editor.isActive("bulletList") ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icono>
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="5" cy="6" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="5" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </Icono>
      </button>

      {/* Lista numerada */}
      <button
        type="button"
        title="Lista numerada"
        aria-label="Lista numerada"
        className={`tb-btn ${editor.isActive("orderedList") ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icono>
          <line x1="10" y1="6" x2="20" y2="6" />
          <line x1="10" y1="12" x2="20" y2="12" />
          <line x1="10" y1="18" x2="20" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </Icono>
      </button>

      <span className="tb-separador" />

      {/* Alinear texto izquierda */}
      <button
        type="button"
        title="Alinear a la izquierda"
        aria-label="Alinear a la izquierda"
        className={`tb-btn ${editor.isActive({ textAlign: "left" }) ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <Icono>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </Icono>
      </button>

      {/* Centrar texto */}
      <button
        type="button"
        title="Centrar"
        aria-label="Centrar"
        className={`tb-btn ${editor.isActive({ textAlign: "center" }) ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <Icono>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </Icono>
      </button>

      {/* Alinear texto derecha */}
      <button
        type="button"
        title="Alinear a la derecha"
        aria-label="Alinear a la derecha"
        className={`tb-btn ${editor.isActive({ textAlign: "right" }) ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <Icono>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="9" y1="12" x2="21" y2="12" />
          <line x1="6" y1="18" x2="21" y2="18" />
        </Icono>
      </button>

      {/* Justificar texto */}
      <button
        type="button"
        title="Justificar"
        aria-label="Justificar"
        className={`tb-btn ${editor.isActive({ textAlign: "justify" }) ? "tb-btn-active" : ""}`}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <Icono>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </Icono>
      </button>

      <span className="tb-separador" />

      {/* Enlace */}
      <button
        type="button"
        title="Insertar enlace"
        aria-label="Insertar enlace"
        className={`tb-btn ${editor.isActive("link") ? "tb-btn-active" : ""}`}
        onClick={toggleEnlace}
      >
        <Icono>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </Icono>
      </button>

      {/* Subir imagen desde explorador */}
      <button
        type="button"
        title="Subir imagen"
        aria-label="Subir imagen"
        className="tb-btn"
        onClick={abrirExplorador}
      >
        <Icono>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </Icono>
      </button>

      {/* Controles de imagen seleccionada */}
      {imagenSeleccionada && (
        <div className="tb-img-grupo" aria-label="Alinear imagen">
          <button
            type="button"
            title="Alinear imagen a la izquierda"
            aria-label="Alinear imagen a la izquierda"
            className={`tb-btn ${alineacionImagen === "left" ? "tb-btn-active" : ""}`}
            onClick={() => alinearImagen("left")}
          >
            <Icono>
              <line x1="4" y1="5" x2="20" y2="5" />
              <rect x="4" y="9" width="8" height="6" rx="1" />
              <line x1="4" y1="19" x2="20" y2="19" />
            </Icono>
          </button>

          <button
            type="button"
            title="Centrar imagen"
            aria-label="Centrar imagen"
            className={`tb-btn ${alineacionImagen === "center" ? "tb-btn-active" : ""}`}
            onClick={() => alinearImagen("center")}
          >
            <Icono>
              <line x1="4" y1="5" x2="20" y2="5" />
              <rect x="8" y="9" width="8" height="6" rx="1" />
              <line x1="4" y1="19" x2="20" y2="19" />
            </Icono>
          </button>

          <button
            type="button"
            title="Alinear imagen a la derecha"
            aria-label="Alinear imagen a la derecha"
            className={`tb-btn ${alineacionImagen === "right" ? "tb-btn-active" : ""}`}
            onClick={() => alinearImagen("right")}
          >
            <Icono>
              <line x1="4" y1="5" x2="20" y2="5" />
              <rect x="12" y="9" width="8" height="6" rx="1" />
              <line x1="4" y1="19" x2="20" y2="19" />
            </Icono>
          </button>

          <button
            type="button"
            title="Eliminar imagen"
            aria-label="Eliminar imagen"
            className="tb-btn tb-btn-danger"
            onClick={eliminarImagen}
          >
            <Icono>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icono>
          </button>
        </div>
      )}

      <span className="tb-separador" />

      {/* Deshacer */}
      <button
        type="button"
        title="Deshacer"
        aria-label="Deshacer"
        className="tb-btn"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Icono>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </Icono>
      </button>

      {/* Rehacer */}
      <button
        type="button"
        title="Rehacer"
        aria-label="Rehacer"
        className="tb-btn"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Icono>
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
        </Icono>
      </button>

      {/* Borrar todo */}
      <button
        type="button"
        title="Borrar todo"
        aria-label="Borrar todo"
        className="tb-btn tb-btn-danger"
        onClick={() => {
          if (window.confirm("¿Borrar todo el contenido del cuaderno?")) {
            editor.chain().focus().clearContent(true).run();
          }
        }}
      >
        <Icono>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </Icono>
      </button>

      {/* Estado de guardado */}
      {estado && <span className="tb-estado">{estado}</span>}

      {/* Caja de vista previa de imagen */}
      {previa && (
        <div className="tb-previa">
          <img
            src={previa.url}
            alt={previa.nombre}
            className="tb-previa-img"
          />
          <div>
            <div className="tb-previa-nombre">{previa.nombre}</div>
            <div className="tb-previa-acciones">
              <button
                type="button"
                className="tb-btn btn-insertar"
                onClick={confirmarInsertarImagen}
              >
                Insertar
              </button>
              <button
                type="button"
                className="tb-btn btn-cancelar"
                onClick={cancelarPrevia}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}