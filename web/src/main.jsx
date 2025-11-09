import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n.js"; // ⬅️ ПЕРЕМІСТІТЬ СЮДИ, ПЕРЕД App!
import "./styles/breakpoints.css";
import App from "./App"; // ⬅️ App після i18n!

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);