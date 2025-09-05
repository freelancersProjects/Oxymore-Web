import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Shield,
  Ban,
  Edit,
  History as HistoryIcon,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import { User, UserRole } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CustomCheckbox } from '../../components/CustomCheckbox/CustomCheckbox';
import Loader from '../../components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';
import Tooltip, { getTooltipMessage } from '../../components/Tooltip/Tooltip';
import { useUserStats } from '../../hooks/useUserStats';
import UserStats from '../../components/UserStats/UserStats';

const Users = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole>>({});
  const [filters, setFilters] = useState({
    isVerified: null as boolean | null,
    isPremium: null as boolean | null,
    isAdmin: null as boolean | null
  });

  // Utiliser le hook personnalisé pour les statistiques
  const { statsData, isRefreshing: isRefreshingStats, refreshStats } = useUserStats();

const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const role = await apiService.get<UserRole>(`/roles/${userId}`);
    return role;
  } catch (error) {
    console.error(`Error fetching role for user ${userId}:`, error);
    return null;
  }
};

  const isUserAdmin = (user: User): boolean => {
    const userRole = userRoles[user.id_user];
    return userRole?.name === 'admin';
  };

  const canModifyUser = (user: User) => {
    if (!currentUser) return false;

    if (currentUser.id === user.id_user) {
      return false;
    }

    if (isUserAdmin(user)) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const filterContainer = target.closest('.filter-container');
      const filterMenu = target.closest('.filter-menu');

      if (!filterContainer && !filterMenu) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<User[]>('/users');

      setUsers(data);
      setFilteredUsers(data);

      const rolesPromises = data.map(user => fetchUserRole(user.id_user));
      const rolesResults = await Promise.allSettled(rolesPromises);

      const newUserRoles: Record<string, any> = {};
      rolesResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          newUserRoles[data[index].id_user] = result.value;
        }
      });

      setUserRoles(newUserRoles);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des utilisateurs');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.isVerified !== null) {
      result = result.filter(user => {
        const userVerified = Boolean(user.verified);
        return userVerified === filters.isVerified;
      });
    }

    if (filters.isPremium !== null) {
      result = result.filter(user => {
        const userPremium = Boolean(user.is_premium);
        return userPremium === filters.isPremium;
      });
    }

    if (filters.isAdmin !== null) {
      result = result.filter(user => {
        const isAdmin = isUserAdmin(user);
        return isAdmin === filters.isAdmin;
      });
    }

    setFilteredUsers(result);
  };

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === null ? true : prev[key] === true ? false : null
    }));
  };

  const getFilterButtonClass = (value: boolean | null) => {
    if (value === null) return 'text-secondary bg-[var(--overlay-hover)]';
    if (value === true) return 'text-green-400 bg-green-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const clearFilters = () => {
    setFilters({
      isVerified: null,
      isPremium: null,
      isAdmin: null
    });
    setSearchQuery('');
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedUsers(checked ? filteredUsers.map(user => user.id_user) : []);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];

      setSelectAll(newSelection.length === filteredUsers.length);
      return newSelection;
    });
  };







  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-secondary mt-1">Manage and monitor users</p>
        </div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-secondary mt-1">Manage and monitor users</p>
        </div>
        <div className="card-base p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="button-primary px-4 py-2 rounded-xl"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Users</h1>
        <p className="text-secondary mt-1">Manage and monitor users</p>
      </div>

      {/* Stats */}
      <UserStats
        statsData={statsData}
        isRefreshing={isRefreshingStats}
        onRefresh={refreshStats}
      />

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="input-base w-full pl-10"
          />
        </div>

        <div className="relative filter-container">
          <button
            className={`button-secondary px-4 py-2 rounded-xl flex items-center gap-2 ${showFilters ? 'bg-oxymore-purple text-white' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
            {(filters.isVerified !== null || filters.isPremium !== null || filters.isAdmin !== null) && (
              <span className="w-2 h-2 rounded-full bg-oxymore-purple absolute -top-1 -right-1" />
            )}
          </button>

          {/* Filter Menu */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--card-background)] rounded-xl shadow-lg border border-[var(--border-color)] p-4 z-10 filter-menu">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => toggleFilter('isVerified')}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(filters.isVerified)}`}
                >
                  {filters.isVerified === null && 'Any verification status'}
                  {filters.isVerified === true && 'Verified only'}
                  {filters.isVerified === false && 'Unverified only'}
                </button>

                <button
                  onClick={() => toggleFilter('isPremium')}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(filters.isPremium)}`}
                >
                  {filters.isPremium === null && 'Any premium status'}
                  {filters.isPremium === true && 'Premium only'}
                  {filters.isPremium === false && 'Non-premium only'}
                </button>

                <button
                  onClick={() => toggleFilter('isAdmin')}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${getFilterButtonClass(filters.isAdmin)}`}
                >
                  {filters.isAdmin === null && 'Any role'}
                  {filters.isAdmin === true && 'Admins only'}
                  {filters.isAdmin === false && 'Users only'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(filters.isVerified !== null || filters.isPremium !== null || filters.isAdmin !== null) && (
        <div className="flex flex-wrap gap-2">
          {filters.isVerified !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>{filters.isVerified ? 'Verified only' : 'Unverified only'}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, isVerified: null }))}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.isPremium !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>{filters.isPremium ? 'Premium only' : 'Non-premium only'}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, isPremium: null }))}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.isAdmin !== null && (
            <div className="px-3 py-1 bg-[var(--overlay-hover)] rounded-full text-sm flex items-center gap-2">
              <span>{filters.isAdmin ? 'Admins only' : 'Users only'}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, isAdmin: null }))}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count - Only show when filtering or searching */}
      {(searchQuery || filters.isVerified !== null || filters.isPremium !== null || filters.isAdmin !== null) && (
        <div className="text-secondary">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Table */}
      <div className="card-base p-6">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="w-10 px-4 py-4">
                  <CustomCheckbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">User</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Country</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">ELO</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-secondary">Joined</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id_user}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)] cursor-pointer"
                  onClick={() => navigate(`/users/${user.id_user}`)}
                >
                  <td className="w-10 px-4 py-4" onClick={e => e.stopPropagation()}>
                    <CustomCheckbox
                      checked={selectedUsers.includes(user.id_user)}
                      onChange={() => toggleUserSelection(user.id_user)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{
                        backgroundImage: `url(${user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`})`
                      }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                        <p className="text-primary font-medium break-words hyphens-auto leading-tight">{user.username}</p>
                                {user.is_premium ? (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-oxymore-purple text-white rounded-full">
                                    Premium
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-green-400/10 text-green-400 rounded-full">
                                    Free
                                  </span>
                                )}
                        </div>
                        <p className="text-muted text-sm break-words hyphens-auto">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.verified ? 'status-active' : 'status-inactive'
                    }`}>
                      {user.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-secondary">
                    {user.country_code || '-'}
                  </td>
                  <td className="px-4 py-4 text-secondary">
                    {user.elo || '-'}
                  </td>
                  <td className="px-4 py-4 text-secondary">
                    {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip
                        content={canModifyUser(user)
                          ? "Gérer les permissions de l'utilisateur"
                          : getTooltipMessage(
                              canModifyUser(user),
                              currentUser?.id === user.id_user,
                              user.role === 'admin',
                              'Gérer les permissions'
                            )
                        }
                      >
                        <button
                          className={`p-2 rounded-lg ${canModifyUser(user) ? 'hover-overlay' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!canModifyUser(user)}
                        >
                          <Shield className="w-4 h-4 text-secondary" />
                        </button>
                      </Tooltip>

                      <Tooltip
                        content={canModifyUser(user)
                          ? "Modifier les informations de l'utilisateur"
                          : getTooltipMessage(
                              canModifyUser(user),
                              currentUser?.id === user.id_user,
                              user.role === 'admin',
                              'Modifier'
                            )
                        }
                      >
                        <button
                          className={`p-2 rounded-lg ${canModifyUser(user) ? 'hover-overlay' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!canModifyUser(user)}
                        >
                          <Edit className="w-4 h-4 text-secondary" />
                        </button>
                      </Tooltip>

                      <Tooltip
                        content={canModifyUser(user)
                          ? "Voir l'historique des actions de l'utilisateur"
                          : getTooltipMessage(
                              canModifyUser(user),
                              currentUser?.id === user.id_user,
                              user.role === 'admin',
                              'Voir l\'historique'
                            )
                        }
                      >
                        <button
                          className={`p-2 rounded-lg ${canModifyUser(user) ? 'hover-overlay' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!canModifyUser(user)}
                        >
                          <HistoryIcon className="w-4 h-4 text-secondary" />
                        </button>
                      </Tooltip>

                      <Tooltip
                        content={canModifyUser(user)
                          ? "Bannir l'utilisateur"
                          : getTooltipMessage(
                              canModifyUser(user),
                              currentUser?.id === user.id_user,
                              user.role === 'admin',
                              'Bannir'
                            )
                        }
                      >
                        <button
                          className={`p-2 rounded-lg ${canModifyUser(user) ? 'hover-overlay' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={!canModifyUser(user)}
                        >
                          <Ban className="w-4 h-4 text-red-400" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;


