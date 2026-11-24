import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor.jsx";
import { useTituloPagina } from "../hooks/useTituloPagina";

export default function InsideDiary() {
  const { id } = useParams();

  useTituloPagina("Editor");

  return <Editor cuadernoId={id} />;
}