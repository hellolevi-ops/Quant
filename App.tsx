

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AIWorkshop } from './components/AIWorkshop';
import { SignalBridge } from './components/SignalBridge';
import { MyStrategies } from './components/MyStrategies';
import { DataCenter } from './components/DataCenter';
import { Community } from './components/Community';
import { Profile } from './components/Profile';
import { ResearchReports } from './components/ResearchReports';
import { LiveTradingSetup } from './components/LiveTradingSetup';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboard } from './components/AdminDashboard';
import { Page } from './types';

type ViewState = 'LANDING' | 'LOGIN' | 'REGISTER' | 'APP';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  
  // State to pass from Research to Workshop
  const [workshopPrompt, setWorkshopPrompt] = useState<string | undefined>(undefined);

  const handleGenerateStrategyFromResearch = (factors: string[]) => {
    const prompt = `Generate a quantitative trading strategy based on the following research factors:\n${factors.map(f => `- ${f}`).join('\n')}\n\nThink about how to combine these factors into alpha signals and risk controls.`;
    setWorkshopPrompt(prompt);
    setCurrentPage(Page.WORKSHOP);
  };

  const handleClearWorkshopPrompt = () => {
    setWorkshopPrompt(undefined);
  };

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
        return <AIWorkshop initialPrompt={workshopPrompt} onClearPrompt={handleClearWorkshopPrompt} />;
      case Page.RESEARCH:
        return <ResearchReports onGenerateStrategy={handleGenerateStrategyFromResearch} />;
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
        return <LiveTradingSetup />;
      case Page.ADMIN_DASHBOARD:
        return <AdminDashboard />;
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
