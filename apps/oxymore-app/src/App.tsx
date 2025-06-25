import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import ApiKeysPage from "./pages/ApiKeysPage/ApiKeysPage";
import Highlights from "./pages/Highlights/Highlights";
import Login from "./pages/Login/Login";
import OxiaChat from "./pages/OxiaChat/OxiaChat";
import Register from "./pages/Register/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

import "./App.css";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import { updateBodyClass, shouldHideSidebar, shouldHideHeader, isOxiaPage } from "./config/layoutConfig";

const LayoutManager: React.FC<{
  children: (layout: { hideSidebar: boolean; hideHeader: boolean; isOxia: boolean }) => React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    updateBodyClass(location.pathname);
  }, [location.pathname]);

  const hideSidebar = shouldHideSidebar(location.pathname);
  const hideHeader = shouldHideHeader(location.pathname);
  const isOxia = isOxiaPage(location.pathname);

  return <>{children({ hideSidebar, hideHeader, isOxia })}</>;
};

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <LayoutManager>
          {({ hideSidebar, hideHeader, isOxia }) => {
            return (
              <div className={`oxm-layout${isSidebarCollapsed ? " sidebar-collapsed" : ""}${isOxia ? " oxia-mode" : ""}`}>
                {!hideSidebar && (
                  <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)} />
                )}
                <div className="oxm-main">
                  {!hideHeader && <Header isSidebarCollapsed={isSidebarCollapsed} />}
                  <main>
                    <ScrollToTop />
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/api-keys" element={<ApiKeysPage />} />
                        <Route path="/highlights" element={<Highlights />} />
                        <Route path="/oxia" element={<OxiaChat />} />
                      </Route>
                    </Routes>
                  </main>
                </div>
              </div>
            );
          }}
        </LayoutManager>
      </AuthProvider>
    </Router>
  );
}
