import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/layout.scss";

export default function DocLayout({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState("/accordion");

  return (
    <div className="doc-layout">
      <Sidebar current={current} onSelect={setCurrent} />
      <main className="doc-content">{children(current)}</main>
    </div>
  );
}
