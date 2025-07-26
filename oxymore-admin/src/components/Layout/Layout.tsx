import React from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { useSidebar } from '../../context/SidebarContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-[var(--page-background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 
 
 