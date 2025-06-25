import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import ApiKeysPage from "./pages/ApiKeysPage/ApiKeysPage";
import Highlights from "./pages/Highlights/Highlights";
import Login from "./pages/Login/Login";
import OxiaChat from "./pages/OxiaChat/OxiaChat";

import "./App.css";

// components common
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// Layout configuration
import { updateBodyClass, shouldHideSidebar, shouldHideHeader, isOxiaPage } from "./config/layoutConfig";

// Component to handle layout updates and conditional rendering
const LayoutManager: React.FC<{
  children: (layout: { hideSidebar: boolean; hideHeader: boolean }) => React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    updateBodyClass(location.pathname);
  }, [location.pathname]);

  const hideSidebar = shouldHideSidebar(location.pathname);
  const hideHeader = shouldHideHeader(location.pathname);

  return <>{children({ hideSidebar, hideHeader })}</>;
};

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <LayoutManager>
        {({ hideSidebar, hideHeader }) => {
          const location = window.location;
          const isOxia = isOxiaPage(location.pathname);
          return (
            <div className={`oxm-layout${isSidebarCollapsed ? " sidebar-collapsed" : ""}${isOxia ? " oxia-mode" : ""}`}>
              {!hideSidebar && (
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)} />
              )}
              <div className="oxm-main">
                {!hideHeader && <Header />}
                <main>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/api-keys" element={<ApiKeysPage />} />
                    <Route path="/highlights" element={<Highlights />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/oxia" element={<OxiaChat />} />
                  </Routes>
                </main>
              </div>
            </div>
          );
        }}
      </LayoutManager>
    </Router>
  );
}
