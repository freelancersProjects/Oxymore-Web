
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Crown
} from 'lucide-react';

const mockTeams = [
  {
    id: '1',
    name: 'Team Liquid',
    logo_url: null,
    members: 12,
    max_members: 15,
    captain: 'John Doe',
    is_premium: true,
    subscription_status: 'active',
    created_at: '2023-12-01'
  },
  {
    id: '2',
    name: 'Fnatic',
    logo_url: null,
    members: 8,
    max_members: 10,
    captain: 'Jane Smith',
    is_premium: true,
    subscription_status: 'active',
    created_at: '2023-11-15'
  },
  {
    id: '3',
    name: 'Cloud9',
    logo_url: null,
    members: 5,
    max_members: 10,
    captain: 'Mike Johnson',
    is_premium: false,
    subscription_status: 'expired',
    created_at: '2023-12-10'
  }
];

const Teams = () => {
  const navigate = useNavigate();


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Teams</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage and monitor teams</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Teams</p>
              <h3 className="stat-value">156</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Premium Teams</p>
              <h3 className="stat-value">48</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-up">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Active Members</p>
              <h3 className="stat-value">1.2k</h3>
            </div>
            <div className="flex items-center gap-1 stat-trend-down">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">-2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="card-base p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search teams..."
              className="input-base w-full pl-10"
            />
          </div>
          <button className="button-secondary px-4 py-2 rounded-xl">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Team</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Members</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Captain</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Created</th>
              </tr>
            </thead>
            <tbody>
              {mockTeams.map((team) => (
                <tr
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="border-b border-[var(--border-color)] hover:bg-[var(--overlay-hover)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-oxymore flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[var(--text-primary)] font-medium">{team.name}</p>
                          {team.is_premium && (
                            <Star className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm">
                          {team.members}/{team.max_members} members
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">{team.members}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">{team.captain}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      team.subscription_status === 'active' ? 'status-active' : 'status-inactive'
                    }`}>
                      {team.subscription_status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {team.created_at}
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

export default Teams;

