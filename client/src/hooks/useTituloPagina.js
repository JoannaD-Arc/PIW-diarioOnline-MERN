import { useEffect } from "react";

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `Diary Koi — ${titulo}` : "Diary Koi";
  }, [titulo]);
}