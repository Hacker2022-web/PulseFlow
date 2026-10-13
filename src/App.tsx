import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { HabitsView } from './components/habits/HabitsView';
import { GoalsView } from './components/goals/GoalsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { CollaboratorView } from './components/collaborator/CollaboratorView';
import { SettingsModal } from './components/modals/SettingsModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { SignOutModal } from './components/modals/SignOutModal';
import { DemoOne } from './components/ui/demo';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // On the auth/login screen, render it full-screen without chrome
  if (activeTab === 'auth') {
    return (
      <>
        <DemoOne />
        <SignOutModal />
      </>
    );
  }

  return (
    <div className="bg-obsidian text-indigo-100 min-h-screen font-sans antialiased flex selection:bg-indigo-600 selection:text-white relative overflow-x-hidden h-screen">
      {/* Dynamic Ambient Mesh Blobs (Pure CSS Radial Gradients, Zero Filter Overhead) */}
      <div className="aurora-blob-1" />
      <div className="aurora-blob-2" />
      <div className="aurora-blob-3" style={{ opacity: 0.25 }} />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Render standalone header only for non-dashboard tabs */}
        {activeTab !== 'dashboard' && (
          <Header onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
        )}

        {/* Scrollable View Container */}
        <main
          className={`flex-1 overflow-y-auto overscroll-y-contain [transform:translateZ(0)] ${
            activeTab === 'dashboard'
              ? 'px-3.5 py-4 sm:p-6 lg:p-8 max-w-[1750px] w-full mx-auto'
              : 'px-3.5 sm:px-8 py-4 sm:py-6 max-w-7xl w-full mx-auto'
          } pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-10`}
        >
          {activeTab === 'dashboard'    && <DashboardView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />}
          {activeTab === 'habits'       && <HabitsView />}
          {activeTab === 'goals'        && <GoalsView />}
          {activeTab === 'expenses'     && <ExpensesView />}
          {activeTab === 'collaborator' && <CollaboratorView />}
          {activeTab === 'settings'     && <SettingsModal />}
        </main>

        {/* Mobile Sticky Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Global Quick Add Modal */}
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />

      {/* Global Sign Out Confirmation Prompt Modal */}
      <SignOutModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
