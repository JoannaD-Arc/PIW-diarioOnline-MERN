import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { ImagenAlineable } from "../../extensions/ImagenAlineable.js";
import Toolbar from "../editor/Toolbar.jsx";
import { guardarContenido, obtenerContenido } from "../../services/contenidoApi";
import "../../styles/editor.css";

const ESPERA_MS = 1000; // se guarda 1 segundo después del último cambio

// Uso: <Editor cuadernoId="..." />
// Carga el título y el contenido del cuaderno y los guarda solos mientras se escribe.
export default function Editor({ cuadernoId }) {
  const [inicial, setInicial] = useState(undefined); // undefined = cargando
  const [error, setError] = useState("");

  useEffect(() => {
    setInicial(undefined);
    obtenerContenido(cuadernoId)
      .then(setInicial)
      .catch((e) => setError(e.message));
  }, [cuadernoId]);

  if (error) return <p className="editor-status-msg editor-error">Error: {error}</p>;
  if (inicial === undefined) return <p className="editor-status-msg">Cargando...</p>;

  return <EditorTexto key={cuadernoId} cuadernoId={cuadernoId} datosIniciales={inicial} />;
}

function EditorTexto({ cuadernoId, datosIniciales }) {
  const [titulo, setTitulo] = useState(datosIniciales.titulo || "");
  const [estado, setEstado] = useState("Guardado");
  const temporizador = useRef(null);
  const sinGuardar = useRef(false);
  // últimos valores del título y del contenido se envía al guardar
  const datos = useRef({
    titulo: datosIniciales.titulo || "",
    contenido: datosIniciales.contenido,
  });

  async function guardarPendiente() {
    clearTimeout(temporizador.current);
    if (!sinGuardar.current) return;
    sinGuardar.current = false;
    setEstado("Guardando...");
    try {
      await guardarContenido(cuadernoId, datos.current);
      if (!sinGuardar.current) setEstado("Guardado");
    } catch (err) {
      sinGuardar.current = true; // se reintenta en el siguiente cambio
      setEstado(`Error al guardar: ${err.message}`);
    }
  }

  function programarGuardado() {
    sinGuardar.current = true;
    setEstado("Sin guardar...");
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(guardarPendiente, ESPERA_MS);
  }

  function cambiarTitulo(e) {
    setTitulo(e.target.value);
    datos.current.titulo = e.target.value;
    programarGuardado();
  }

  const editor = useEditor({
    editorProps: {
      // Ctrl + clic (o Cmd + clic) sobre un enlace lo abre en una pestaña nueva
      handleClick(view, pos, event) {
        const enlace = event.target.closest?.("a");
        if (enlace && (event.ctrlKey || event.metaKey)) {
          window.open(enlace.href, "_blank", "noopener,noreferrer");
          return true;
        }
        return false;
      },
    },
    extensions: [
      // StarterKit ya incluye negrita, cursiva, subrayado, etc.
      StarterKit.configure({ link: { openOnClick: false } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImagenAlineable.configure({
        resize: {
          enabled: true,
          directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true, // mantiene la proporción
        },
      }),
    ],
    content: datosIniciales.contenido || "",
    shouldRerenderOnTransaction: true, // para que la barra marque los formatos activos
    onUpdate: ({ editor }) => {
      datos.current.contenido = editor.getJSON();
      programarGuardado();
    },
  });

  // evita perder cambios al salir del cuaderno o cerrar la pestaña
  useEffect(() => {
    const avisar = (e) => {
      if (sinGuardar.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", avisar);
    return () => {
      window.removeEventListener("beforeunload", avisar);
      guardarPendiente();
    };
  }, []);

  // la librería de redimensión detecta cuándo el dedo empieza y se mueve, pero no cuando se levanta, esto avisa que el gesto terminó para que guarde el tamaño.
  useEffect(() => {
    const terminarGesto = () => {
      if (document.querySelector('[data-resize-state="true"]')) {
        document.dispatchEvent(new MouseEvent("mouseup"));
      }
    };
    document.addEventListener("touchend", terminarGesto);
    document.addEventListener("touchcancel", terminarGesto);
    return () => {
      document.removeEventListener("touchend", terminarGesto);
      document.removeEventListener("touchcancel", terminarGesto);
    };
  }, []);

  return (
    <div className="editor-page">
      <div className="editor-container">
        <input
          className="editor-title-input"
          value={titulo}
          onChange={cambiarTitulo}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              editor?.commands.focus("start"); // pasa el cursor al texto
            }
          }}
          placeholder="Cuaderno sin título"
          maxLength={150}
        />

        <div className="editor-sheet">
          <Toolbar editor={editor} estado={estado} />
          <div className="editor-body">
            <EditorContent editor={editor} className="editor-content" />
          </div>
        </div>
      </div>

      <div className="home-strip" />
    </div>
  );
}