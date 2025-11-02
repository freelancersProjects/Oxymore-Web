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
import { CreateTeam } from "./pages/CreateTeam/CreateTeam";
import { UploadVideo } from "./pages/UploadVideo/UploadVideo";
import TeamView from "./pages/Teams/TeamView/TeamView";
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
  if (hasLoaded !== "true") {
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
        {showLoaderAtFirstTime() ? (
          <>
            <LayoutLoader />
          </>
        ) : (
          <LayoutManager>
            {({ hideSidebar, hideHeader, hideProfileSidebar, isOxia }) => {
              const location = useLocation();
              const isLoginPage =
                location.pathname === "/login" ||
                location.pathname === "/register";
              const isFullBackgroundPage =
                location.pathname === "/leagues" ||
                location.pathname === "/subscription" ||
                location.pathname === "/teams" ||
                location.pathname === "/teams/create";
              const isHighlightsPage = location.pathname === "/highlights";
              return (
                <div
                  className={`oxm-layout${
                    isSidebarCollapsed ? " sidebar-collapsed" : ""
                  }${isOxia ? " oxia-mode" : ""}${
                    hideProfileSidebar ? " no-profile-sidebar" : ""
                  }`}
                >
                  {!hideSidebar && (
                    <Sidebar
                      isCollapsed={isSidebarCollapsed}
                      onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    />
                  )}
                  <div
                    className={`oxm-main${
                      isLoginPage ? " oxm-main--no-margin" : ""
                    }`}
                  >
                    {!hideHeader && (
                      <Header
                        isSidebarCollapsed={isSidebarCollapsed}
                        hideProfileSidebar={hideProfileSidebar}
                      />
                    )}
                    <main
                      className={
                        isLoginPage
                          ? "oxm-main--no-margin"
                          : isFullBackgroundPage
                          ? "oxm-main--full-background"
                          : isHighlightsPage
                          ? "oxm-main--no-header-margin"
                          : ""
                      }
                    >
                      <ScrollToTop />
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/api-keys" element={<ApiKeysPage />} />
                          <Route path="/highlights" element={<Highlights />} />
                          <Route path="/upload" element={<UploadVideo />} />
                          <Route path="/teams" element={<Teams />} />
                          <Route path="/teams/create" element={<CreateTeam />} />
                          <Route path="/teams/:id" element={<TeamView />} />
                          <Route path="/friends" element={<Friends />} />
                          <Route path="/messages" element={<Messages />} />
                          <Route path="/oxia" element={<OxiaChat />} />
                          <Route path="/leagues" element={<League />} />
                          <Route
                            path="/tournaments"
                            element={<TournamentPage />}
                          />
                          <Route
                            path="/subscription"
                            element={<Subscription />}
                          />
                        </Route>
                      </Routes>
                    </main>
                  </div>
                </div>
              );
            }}
          </LayoutManager>
        )}
      </AuthProvider>
    </Router>
  );
}
