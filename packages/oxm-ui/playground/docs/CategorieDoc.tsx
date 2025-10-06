import React from "react";
import "../styles/doc.scss";
import Categorie from "../../src/OXM/OXM.Categorie/Categorie";

export default function CategorieDoc() {
  return (
    <section className="doc-section">
      <h1>OXM.Categorie</h1>
      <p>Composant de catégorie personnalisable.</p>
      <h2>Exemple</h2>
      <Categorie label="Catégorie" />
      <h2>Props</h2>
      <ul>
        <li><b>label</b> : string — Libellé de la catégorie</li>
      </ul>
    </section>
  );
}
