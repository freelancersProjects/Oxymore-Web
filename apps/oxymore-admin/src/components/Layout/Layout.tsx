import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { StatsProvider } from '../../context/StatsContext';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';

const Layout = () => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <StatsProvider>
      <div className="min-h-screen" style={{ backgroundImage: 'var(--page-background)' }}>
        <div className="flex h-screen">
          {/* Sidebar - Fixed width, pushes content */}
          {!isMobile && (
            <div className={`transition-all duration-300 ${
              isCollapsed ? 'w-18' : 'w-70'
            }`}>
              <Sidebar />
            </div>
          )}

          {/* Main Content - Takes remaining space */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Sidebar - Overlay */}
        {isMobile && <Sidebar />}
      </div>
    </StatsProvider>
  );
};

export default Layout;

