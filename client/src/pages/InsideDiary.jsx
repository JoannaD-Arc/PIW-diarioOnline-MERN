import { useParams } from "react-router-dom";
import Editor from "../components/Editor.jsx";

// Solo para pruebas: si no hay id en la URL, usa este
const ID_PRUEBA = "000000000000000000000001";

export default function InsideDiary() {
  const { id } = useParams();
  return <Editor cuadernoId={id || ID_PRUEBA} />;
}