import React from "react";
import HeroBanner from "./HeroBanner/HeroBanner";
import PlatformIntro from "./PlatformIntro/PlatformIntro";
import Tournaments from "./Tournaments/Tournaments";
import Leagues from "./Leagues/Leagues";
import FAQ from "./FAQ/FAQ";
import { OXMGlowOrb } from "@oxymore/ui";
import "./Home.scss";

const Home = () => (
  <main className="home-container">
    <OXMGlowOrb top="25%" left="-20%" size="800px" color="rgba(80, 12, 173, 0.4)" />
    <OXMGlowOrb top="40%" right="-30%" size="1200px" color="rgba(21, 147, 206, 0.3)" />
    <HeroBanner />
    <PlatformIntro />
    <Tournaments />
    <Leagues />
    <OXMGlowOrb bottom="0%" left="-25%" size="1000px" color="rgba(80, 12, 173, 0.35)" />
    <FAQ />
  </main>
);

export default Home;
