import React, { useState } from 'react';
import { Page, MarketIndex } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Activity, 
  Cpu, 
  Globe, 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  Users, 
  Zap, 
  Menu,
  X,
  Wifi
} from 'lucide-react';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  page, 
  label, 
  icon: Icon, 
  active, 
  onClick 
}: { 
  page: Page; 
  label: string; 
  icon: any; 
  active: boolean; 
  onClick: (p: Page) => void 
}) => (
  <button
    onClick={() => onClick(page)}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group w-full ${
      active 
        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} className={active ? 'text-neon-blue' : 'text-slate-500 group-hover:text-white'} />
    <span className="font-medium tracking-wide">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_#0EA5E9]" />}
  </button>
);

const MarketTicker = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([
    { name: 'SSEC', value: 3050.21, change: 12.4, changePercent: 0.45 },
    { name: 'NDX', value: 16832.90, change: -45.2, changePercent: -0.21 },
    { name: 'BTC', value: 68420.10, change: 1200.5, changePercent: 1.82 },
  ]);

  return (
    <div className="flex items-center space-x-6 text-xs font-mono border-l border-white/10 pl-6 ml-6 h-8">
      {indices.map((idx) => (
        <div key={idx.name} className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold">{idx.name}</span>
          <span className={idx.change >= 0 ? 'text-neon-green' : 'text-neon-red'}>
            {idx.value.toFixed(2)}
          </span>
          <span className={`px-1 rounded ${idx.change >= 0 ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'}`}>
            {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
          </span>
        </div>
      ))}
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [qmtStatus, setQmtStatus] = useState(true);
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-slate-200 font-sans selection:bg-neon-blue/30">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Activity className="text-neon-blue" />
          <span className="font-bold text-lg tracking-wider">QUANT AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/10 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-10 pl-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-neon-blue to-purple-600 flex items-center justify-center shadow-lg shadow-neon-blue/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-wider text-white glow-text">QUANT AI</span>
            <span className="text-[10px] bg-neon-blue/20 text-neon-blue px-1.5 py-0.5 rounded border border-neon-blue/20">PRO</span>
          </div>

          <nav className="space-y-2 flex-1">
            <NavItem page={Page.DASHBOARD} label={t('nav.dashboard')} icon={LayoutDashboard} active={currentPage === Page.DASHBOARD} onClick={onNavigate} />
            <NavItem page={Page.WORKSHOP} label={t('nav.workshop')} icon={Cpu} active={currentPage === Page.WORKSHOP} onClick={onNavigate} />
            <NavItem page={Page.SIGNAL_BRIDGE} label={t('nav.signal_bridge')} icon={Globe} active={currentPage === Page.SIGNAL_BRIDGE} onClick={onNavigate} />
            <NavItem page={Page.MY_STRATEGIES} label={t('nav.my_strategies')} icon={Zap} active={currentPage === Page.MY_STRATEGIES} onClick={onNavigate} />
            <NavItem page={Page.DATA_CENTER} label={t('nav.data_center')} icon={LineChart} active={currentPage === Page.DATA_CENTER} onClick={onNavigate} />
            <NavItem page={Page.COMMUNITY} label={t('nav.community')} icon={Users} active={currentPage === Page.COMMUNITY} onClick={onNavigate} />
            <NavItem page={Page.LIVE_SETUP} label={t('nav.live_setup')} icon={Settings} active={currentPage === Page.LIVE_SETUP} onClick={onNavigate} />
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
             {/* Lang Toggle for Sidebar */}
             <div className="flex items-center justify-center">
                <div className="flex bg-black/40 rounded-lg p-1">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs rounded ${language === 'en' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLanguage('zh')}
                    className={`px-3 py-1 text-xs rounded ${language === 'zh' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                  >
                    中文
                  </button>
                </div>
             </div>

            <div className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-lg border border-white/5">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${qmtStatus ? 'bg-neon-green shadow-[0_0_8px_#10B981]' : 'bg-neon-red'}`} />
                <span className="text-xs font-mono text-slate-400">{t('nav.qmt_terminal')}</span>
              </div>
              <Wifi size={14} className={qmtStatus ? 'text-neon-green' : 'text-slate-600'} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         {/* Top Bar */}
         <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-white tracking-wide">
                {t(`nav.${currentPage.toLowerCase()}`) || currentPage}
              </h2>
              <div className="hidden md:block">
                <MarketTicker />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs hover:bg-neon-blue/20 transition-colors">
                 <span>{t('nav.upgrade_pro')}</span>
              </button>
              <div 
                onClick={() => onNavigate(Page.PROFILE)}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 border border-white/20 cursor-pointer hover:border-neon-blue transition-colors relative"
              >
                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green border-2 border-[#0f172a] rounded-full"></div>
              </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           {children}
         </div>
      </main>
    </div>
  );
};