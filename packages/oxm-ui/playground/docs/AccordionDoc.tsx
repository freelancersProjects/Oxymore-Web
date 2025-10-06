import React from "react";
import "../styles/doc.scss";
import Accordion from "../../src/OXM/OXM.Accordion/Accordion";

export default function AccordionDoc() {
  return (
    <section className="doc-section">
      <h1>OXM.Accordion</h1>
      <p>Composant d'accordéon personnalisable.</p>
      <h2>Exemple</h2>
      <Accordion question="Clique ici" answer="Contenu de l'accordéon" />
      <h2>Props</h2>
      <ul>
        <li><b>title</b> : string — Titre de l'accordéon</li>
      </ul>
    </section>
  );
}
