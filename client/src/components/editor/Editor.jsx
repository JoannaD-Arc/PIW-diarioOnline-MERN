import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Toolbar from "./Toolbar.jsx";
import { guardarContenido, obtenerContenido } from "../api";

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

  if (error) return <p>Error: {error}</p>;
  if (inicial === undefined) return <p>Cargando...</p>;

  return <EditorTexto key={cuadernoId} cuadernoId={cuadernoId} datosIniciales={inicial} />;
}

function EditorTexto({ cuadernoId, datosIniciales }) {
  const [titulo, setTitulo] = useState(datosIniciales.titulo || "");
  const [estado, setEstado] = useState("Guardado");
  const temporizador = useRef(null);
  const sinGuardar = useRef(false);
  //últimos valores del título y del contenido se envía al guardar
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
    extensions: [
      //StarterKit ya incluye negrita, cursiva, subrayado,etc
      StarterKit.configure({ link: { openOnClick: false } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({
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

  //evita perder cambios al salir del cuaderno o cerrar la pestaña
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

    //la librería de redimensión detecta cuándo el dedo empieza y se mueve, pero no cuando se levanta, esto avisa que el gesto terminó para que guarde el tamaño.
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
    <div>
      <input
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
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontSize: 28,
          fontWeight: "bold",
          border: "none",
          outline: "none",
          padding: "12px 0",
        }}
      />

      <div style={{ border: "1px solid #ccc" }}>
        <Toolbar editor={editor} estado={estado} />
        <div style={{ padding: 12 }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}