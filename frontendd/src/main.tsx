import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CustomRainbowKitProvider from "./providers/RainbowKit.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomRainbowKitProvider>
      <App />
    </CustomRainbowKitProvider>
  </StrictMode>
);
