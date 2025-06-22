import { useState } from "react";
import Sidebar from "./Sidebar";

import AccordionDoc from "../docs/AccordionDoc";
import ButtonDoc from "../docs/ButtonDoc";
import CategorieDoc from "../docs/CategorieDoc";
import ToastDoc from "../docs/ToastDoc";

const componentsMap: Record<string, React.ReactNode> = {
  "/accordion": <AccordionDoc />,
  "/button": <ButtonDoc />,
  "/categorie": <CategorieDoc />,
  "/toast": <ToastDoc />,
};

export default function DocLayout() {
  const [current, setCurrent] = useState("/button");

  return (
    <div className="doc-layout">
      <Sidebar current={current} onSelect={setCurrent} />
      <main className="doc-content">{componentsMap[current]}</main>
    </div>
  );
}
