import React from "react";
import "../styles/sidebar.scss";

const components = [
  { name: "Accordion", path: "/accordion" },
  { name: "Button", path: "/button" },
  { name: "Categorie", path: "/categorie" },
];

export default function Sidebar({ current, onSelect }: { current: string; onSelect: (path: string) => void }) {
  return (
    <aside className="sidebar">
      <h2>OXM UI Docs</h2>
      <nav>
        <ul>
          {components.map((comp) => (
            <li
              key={comp.path}
              className={current === comp.path ? "active" : ""}
              onClick={() => onSelect(comp.path)}
            >
              {comp.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
