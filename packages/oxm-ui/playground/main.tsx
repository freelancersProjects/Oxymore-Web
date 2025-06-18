import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/layout.scss";
import "./styles/sidebar.scss";
import "./styles/doc.scss";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
