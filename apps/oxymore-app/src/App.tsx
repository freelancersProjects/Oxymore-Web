import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import ApiKeysPage from "./pages/ApiKeysPage/ApiKeysPage";
import Highlights from "./pages/Highlights/Highlights";
import Login from "./pages/Login/Login";
import OxiaChat from "./pages/OxiaChat/OxiaChat";
import Register from "./pages/Register/Register";
import { Teams } from "./pages/Teams/Teams";
import League from "./pages/League/League";
import TournamentPage from "./pages/Tournament/Tournament";
import Subscription from "./pages/Subscription/Subscription";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { OXMLoader } from "@oxymore/ui";

import "./App.css";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import {
  updateBodyClass,
  shouldHideSidebar,
  shouldHideHeader,
  shouldHideProfileSidebar,
  isOxiaPage,
} from "./config/layoutConfig";
import Friends from "./pages/Friends/Friends";
import Messages from "./pages/Messages/Messages";

const LayoutManager: React.FC<{
  children: (layout: {
    hideSidebar: boolean;
    hideHeader: boolean;
    hideProfileSidebar: boolean;
    isOxia: boolean;
  }) => React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    updateBodyClass(location.pathname);
  }, [location.pathname]);

  const hideSidebar = shouldHideSidebar(location.pathname);
  const hideHeader = shouldHideHeader(location.pathname);
  const hideProfileSidebar = shouldHideProfileSidebar(location.pathname);
  const isOxia = isOxiaPage(location.pathname);

  return (
    <>{children({ hideSidebar, hideHeader, hideProfileSidebar, isOxia })}</>
  );
};

const LayoutLoader: React.FC = () => {
  return (
    <div className="oxm-loader-container">
      <OXMLoader />
    </div>
  );
};

const initLoaderStateOnSessionStorage = () => {
  const hasLoaded = sessionStorage.getItem("hasLoaded");
  if (!hasLoaded) {
    sessionStorage.setItem("hasLoaded", "true");
    return true;
  }
  return false;
};

const showLoaderAtFirstTime = () => {
  const [loading, setLoading] = useState(() =>
    initLoaderStateOnSessionStorage()
  );

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return loading;
};

export default function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <AuthProvider>
        {/* {showLoaderAtFirstTime() ? ( */}
        <>
          <LayoutLoader />
        </>
      </AuthProvider>
    </Router>
  );
}
