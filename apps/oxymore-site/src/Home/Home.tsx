import React from "react";
import HeroBanner from "./HeroBanner/HeroBanner";
import PlatformIntro from "./PlatformIntro/PlatformIntro";
import Tournaments from "./Tournaments/Tournaments";
import Leagues from "./Leagues/Leagues";
import FAQ from "./FAQ/FAQ";

const Home = () => (
  <>
    <HeroBanner />
    <PlatformIntro />
    <Tournaments />
    <Leagues />
    <FAQ />
  </>
);

export default Home;
