import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#18181b",
          color: "#f4f4f5",
          border: "1px solid #27272a",
        },
      }}
    />
  </StrictMode>,
);