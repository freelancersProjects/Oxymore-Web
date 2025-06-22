import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Sidebar } from "./components/ScrollToTop/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import ApiKeysPage from "./pages/ApiKeysPage/ApiKeysPage";

import "./App.css";

// components common
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

export default function App() {
  return (
    <Router>
      <div className="oxm-layout">
        <Sidebar />
        <div className="oxm-main">
          <Header />
          <main>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/api-keys" element={<ApiKeysPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
