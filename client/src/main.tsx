import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Import Firebase configuration
import "./lib/firebase";

createRoot(document.getElementById("root")!).render(<App />);
