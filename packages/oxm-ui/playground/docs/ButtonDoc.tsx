import React from "react";
import "../styles/doc.scss";
import Button from "../../src/OXM/OXM.Button/Button";

export default function ButtonDoc() {
  return (
    <section className="doc-section">
      <h1>OXM.Button</h1>
      <p>Bouton personnalisable.</p>
      <h2>Exemple</h2>
      <Button>Mon bouton</Button>
      <h2>Props</h2>
      <ul>
        <li><b>children</b> : ReactNode — Contenu du bouton</li>
        {/* Ajouter d'autres props ici */}
      </ul>
    </section>
  );
}
