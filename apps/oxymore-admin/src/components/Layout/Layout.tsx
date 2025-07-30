import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { StatsProvider } from '../../context/StatsContext';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';

const Layout = () => {
  const { isCollapsed } = useSidebar();

  return (
    <StatsProvider>
      <div className="min-h-screen" style={{ backgroundImage: 'var(--page-background)' }}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header />
            
            {/* Page Content */}
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-18' : 'ml-70'}`}>
              <div className="p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </StatsProvider>
  );
};

export default Layout; 
 
 