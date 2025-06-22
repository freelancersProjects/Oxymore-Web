import React from "react";
import DocLayout from "./components/DocLayout";
import AccordionDoc from "./docs/AccordionDoc";
import ButtonDoc from "./docs/ButtonDoc";
import CategorieDoc from "./docs/CategorieDoc";

export default function App() {
  return (
    <DocLayout>
      {(current: string) => {
        switch (current) {
          case "/button":
            return <ButtonDoc />;
          case "/categorie":
            return <CategorieDoc />;
          case "/accordion":
          default:
            return <AccordionDoc />;
        }
      }}
    </DocLayout>
  );
}
