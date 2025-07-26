import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { LiveMatchProvider } from './context/LiveMatchContext';
import { MapPickerProvider } from './context/MapPickerContext';
import { GameSelectorProvider } from './context/GameSelectorContext';
import { UserProvider } from './context/UserContext';
import LiveMatch from './components/LiveMatch/LiveMatch';
import MapPicker from './components/MapPicker/MapPicker';
import GameSelector from './components/GameSelector/GameSelector';
import { useState, useEffect } from 'react';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Tournaments from './pages/Tournaments/Tournaments';
import Teams from './pages/Teams/Teams';
import TeamDetails from './pages/Teams/TeamDetails';
import Leagues from './pages/Leagues/Leagues';
import LeagueDetails from './pages/Leagues/LeagueDetails';
import CreateLeague from './pages/Leagues/Create/Create';
import Matches from './pages/Matches/Matches';
import MatchDetails from './pages/Matches/MatchDetails';
import Badges from './pages/Badges/Badges';
import Settings from './pages/Settings/Settings';
import CreateBadge from './pages/Badges/Create/Create';
import CreateTournament from './pages/Tournaments/Create/Create';
import Login from './pages/Auth/Login';
import Analytics from './pages/Analytics/Analytics';
import Activity from './pages/Activity/Activity';
import UserDetails from './pages/Users/UserDetails';

const queryClient = new QueryClient();

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <SidebarProvider>
          <LiveMatchProvider>
            <MapPickerProvider>
              <GameSelectorProvider>
                <div className="min-h-screen">
                  <Router>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:id" element={<UserDetails />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/tournaments/create" element={<CreateTournament />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/teams/:id" element={<TeamDetails />} />
                        <Route path="/leagues" element={<Leagues />} />
                        <Route path="/leagues/:id" element={<LeagueDetails />} />
                        <Route path="/leagues/create" element={<CreateLeague />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/matches/:id" element={<MatchDetails />} />
                        <Route path="/badges" element={<Badges />} />
                        <Route path="/badges/create" element={<CreateBadge />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<Login />} />
                      </Routes>
                    </Layout>
                    <Toaster position="top-right" />
                    <LiveMatch />
                    <MapPicker />
                    <GameSelector />
                  </Router>
                </div>
              </GameSelectorProvider>
            </MapPickerProvider>
          </LiveMatchProvider>
        </SidebarProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App; 
 
 