import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import APIDevelopers from "./pages/APIDevelopers/APIDevelopers";
import About from "./pages/About/About";
import IntegrateDiscordBot from "./pages/IntegrateDiscordBot/IntegrateDiscordBot";
import CreateTournament from "./pages/CreateTournament/CreateTournament";
import Tournaments from "./pages/Home/Tournaments/Tournaments";
import Resources from "./pages/Resources/Resources";

// components common
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers/api" element={<APIDevelopers />} />
          <Route
            path="/learn/integrate-api-discord"
            element={<IntegrateDiscordBot />}
          />
          <Route
            path="/learn/create-tournament"
            element={<CreateTournament />}
          />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/learn/resources" element={<Resources />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
