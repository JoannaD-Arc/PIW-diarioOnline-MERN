import Editor from "./components/Editor.jsx";

//SOLO PARA PRUEBAS
// renderiza <Editor cuadernoId={cuaderno._id} />.
// Para probar otro cuaderno: http://localhost:5173/?cuaderno=<id de 24 caracteres hex>
const ID_PRUEBA = "000000000000000000000001";
const cuadernoId = new URLSearchParams(window.location.search).get("cuaderno") || ID_PRUEBA;

export default function App() {
  return <Editor cuadernoId={cuadernoId} />;
}