import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { LiveMatchProvider } from './context/LiveMatchContext';
import { MapPickerProvider } from './context/MapPickerContext';
import { GameSelectorProvider } from './context/GameSelectorContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LiveMatch from './components/LiveMatch/LiveMatch';
import GameMapPicker from './components/MapPicker/MapPicker';
import GameSelector from './components/GameSelector/GameSelector';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import UserDetails from './pages/Users/UserDetails';
import Tournaments from './pages/Tournaments/Tournaments';
import TournamentDetails from './pages/Tournaments/TournamentDetails';
import CreateTournament from './pages/Tournaments/Create/Create';
import Teams from './pages/Teams/Teams';
import TeamDetails from './pages/Teams/TeamDetails';
import Leagues from './pages/Leagues/Leagues';
import LeagueDetails from './pages/Leagues/LeagueDetails';
import CreateLeague from './pages/Leagues/Create/Create';
import EditLeague from './pages/Leagues/Edit/Edit';
import Matches from './pages/Matches/Matches';
import MatchDetails from './pages/Matches/MatchDetails';
import Badges from './pages/Badges/Badges';
import CreateBadge from './pages/Badges/Create/Create';
import EditBadge from './pages/Badges/Edit/Edit';
import Settings from './pages/Settings/Settings';
import Analytics from './pages/Analytics/Analytics';
import Activity from './pages/Activity/Activity';

const queryClient = new QueryClient();

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <SidebarProvider>
          <LiveMatchProvider>
            <MapPickerProvider>
              <GameSelectorProvider>
                <QueryClientProvider client={queryClient}>
                  <Router>
                    <AuthProvider>
                      <div className="min-h-screen">
                        <Routes>
                          <Route path="/login" element={<Login />} />

                          <Route
                            path="/"
                            element={
                              <ProtectedRoute>
                                <Layout />
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<Users />} />
                            <Route path="users/:id" element={<UserDetails />} />
                            <Route path="tournaments" element={<Tournaments />} />
                            <Route path="tournaments/:id" element={<TournamentDetails />} />
                            <Route path="tournaments/create" element={<CreateTournament />} />
                            <Route path="teams" element={<Teams />} />
                            <Route path="teams/:id" element={<TeamDetails />} />
                            <Route path="leagues" element={<Leagues />} />
                            <Route path="leagues/create" element={<CreateLeague />} />
                            <Route path="leagues/:id/edit" element={<EditLeague />} />
                            <Route path="leagues/:id" element={<LeagueDetails />} />
                            <Route path="matches" element={<Matches />} />
                            <Route path="matches/:id" element={<MatchDetails />} />
                            <Route path="badges" element={<Badges />} />
                            <Route path="badges/create" element={<CreateBadge />} />
                            <Route path="badges/edit/:id" element={<EditBadge />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="activity" element={<Activity />} />
                            <Route path="settings" element={<Settings />} />
                          </Route>
                        </Routes>
                        <LiveMatch />
                        <GameMapPicker />
                        <GameSelector />
                      </div>
                    </AuthProvider>
                  </Router>
                </QueryClientProvider>
              </GameSelectorProvider>
            </MapPickerProvider>
          </LiveMatchProvider>
        </SidebarProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;

