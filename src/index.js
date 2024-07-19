import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PublicResourcesProvider } from "./contexts/PublicResourcesContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
function Preload() {
  useEffect(() => {
    const img = new Image();
    img.src = "/images/logo.webp"; // Cambia esto por la ruta a tu recurso
    const img2 = new Image();
    img2.src = "/images/logo_cas_mas_pcia_2024_crop_2.webp"; // Cambia esto por la ruta a tu recurso
  }, []);

  return null;
}

root.render(
  <React.StrictMode>
    <PublicResourcesProvider>
      <Preload />
      <App />
    </PublicResourcesProvider>
  </React.StrictMode>
);

