/* ===== se creó una nueva carpeta llamada extensions ===== */
/* ===== client/src/extensions/ImagenAlineable.js ===== */
/* ===== ImagenAlineable.js ===== */

import Image from "@tiptap/extension-image";

// "left" y "right" hacen que el texto rodee la imagen (lo resuelve el CSS)
export const ImagenAlineable = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "none",
        parseHTML: (el) => el.getAttribute("data-align") || "none",
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
    };
  },

  addNodeView() {
    const crearVista = this.parent?.();
    if (!crearVista) return null;

    return (props) => {
      const vista = crearVista(props);
      const aplicar = (node) => {
        vista.dom.dataset.align = node.attrs.align || "none";
      };
      aplicar(props.node);

      const actualizarOriginal = vista.update.bind(vista);
      vista.update = (node, decorations, innerDecorations) => {
        const aceptado = actualizarOriginal(node, decorations, innerDecorations);
        if (aceptado) aplicar(node);
        return aceptado;
      };
      return vista;
    };
  },
});