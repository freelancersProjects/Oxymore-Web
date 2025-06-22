import React from "react";
import { OXMCategorie } from "@oxymore/ui";
import "./PlatformIntro.scss";

const PlatformIntro = () => {
  return (
    <section className="platform-intro">
      <OXMCategorie label="About Our Platform" />

      <h2>
        Oxymore is a competitive esports platform built for gamers who want more
        — more tournaments,{" "}
        <span>
          more stats, more glory. Whether you’re a solo player or part of a
          team, dive into the action and rise through the ranks.
        </span>
      </h2>
    </section>
  );
};

export default PlatformIntro;
