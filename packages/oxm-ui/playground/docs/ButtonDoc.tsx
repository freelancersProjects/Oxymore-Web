import React from "react";
import "../styles/doc.scss";
import Button from "../../src/OXM/OXM.Button/Button";

export default function ButtonDoc() {
  return (
    <section className="doc-section">
      <h1>OXM.Button</h1>
      <p>Bouton personnalisable.</p>

      <h2>Exemples</h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Button variant="primary">Bouton Primaire</Button>
        <Button variant="secondary">Bouton Secondaire</Button>
      </div>

      <h2>Props</h2>
      <ul>
        <li>
          <b>children</b> : ReactNode — Contenu du bouton
        </li>
        <li>
          <b>variant</b> : "primary" | "secondary" — Variante de style
        </li>
      </ul>
    </section>
  );
}
