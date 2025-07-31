import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ui/error-boundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
