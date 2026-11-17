import { useParams } from "react-router-dom";
import Editor from "../components/editor/Editor.jsx";

export default function InsideDiary() {
  const { id } = useParams();
  return <Editor cuadernoId={id} />;
}
