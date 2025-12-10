import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AIWorkshop } from './components/AIWorkshop';
import { SignalBridge } from './components/SignalBridge';
import { MyStrategies } from './components/MyStrategies';
import { DataCenter } from './components/DataCenter';
import { Community } from './components/Community';
import { Profile } from './components/Profile';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Page } from './types';

// Placeholder components for other pages to ensure compilation
const Placeholder = ({ title }: { title: string }) => (
  <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center">
    <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
    <p className="text-slate-400">This module is available in the full deployment.</p>
  </div>
);

type ViewState = 'LANDING' | 'LOGIN' | 'REGISTER' | 'APP';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  // View Routing Logic
  if (currentView === 'LANDING') {
    return (
      <LandingPage 
        onEnterApp={() => setCurrentView('REGISTER')} 
        onLoginClick={() => setCurrentView('LOGIN')}
        onRegisterClick={() => setCurrentView('REGISTER')}
      />
    );
  }

  if (currentView === 'LOGIN') {
    return (
      <Login 
        onLogin={() => setCurrentView('APP')} 
        onNavigateRegister={() => setCurrentView('REGISTER')}
        onBack={() => setCurrentView('LANDING')}
      />
    );
  }

  if (currentView === 'REGISTER') {
    return (
      <Register 
        onRegister={() => setCurrentView('APP')}
        onNavigateLogin={() => setCurrentView('LOGIN')}
        onBack={() => setCurrentView('LANDING')}
      />
    );
  }

  // Main App Logic
  const renderContent = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard onNavigate={setCurrentPage} />;
      case Page.WORKSHOP:
        return <AIWorkshop />;
      case Page.SIGNAL_BRIDGE:
        return <SignalBridge />;
      case Page.MY_STRATEGIES:
        return <MyStrategies />;
      case Page.DATA_CENTER:
        return <DataCenter />;
      case Page.COMMUNITY:
        return <Community />;
      case Page.PROFILE:
        return <Profile />;
      case Page.LIVE_SETUP:
        return <Placeholder title="Live Trading Configuration" />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;