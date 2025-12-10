
import React, { useState, useEffect } from 'react';
import { Page, MarketIndex, UserTier } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { 
  Activity, Cpu, Globe, LayoutDashboard, LineChart, Settings, Users, Zap, Menu, X, Wifi, FileText, Award, Crown, ShieldAlert, Repeat, Languages, ChevronDown
} from 'lucide-react';
import { MembershipModal } from './MembershipModal';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
  { id: Page.DASHBOARD, icon: LayoutDashboard, label: 'nav.dashboard' },
  { id: Page.WORKSHOP, icon: Cpu, label: 'nav.workshop' },
  { id: Page.RESEARCH, icon: FileText, label: 'nav.research' },
  { id: Page.SIGNAL_BRIDGE, icon: Globe, label: 'nav.signal_bridge' },
  { id: Page.MY_STRATEGIES, icon: Zap, label: 'nav.my_strategies' },
  { id: Page.DATA_CENTER, icon: LineChart, label: 'nav.data_center' },
  { id: Page.COMMUNITY, icon: Users, label: 'nav.community' },
  { id: Page.LIVE_SETUP, icon: Wifi, label: 'nav.live_setup' },
];

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  const { t, language, setLanguage } = useLanguage();
  const { userTier, pointsBalance, userInfo, currentRole, switchRole } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Market Ticker (Mock)
  const [marketIndices] = useState<MarketIndex[]>([
    { name: 'SSEC', value: 3050.21, change: 12.45, changePercent: 0.45 },
    { name: 'NDX', value: 16832.90, change: -45.20, changePercent: -0.21 },
    { name: 'BTC', value: 68420.10, change: 1250.00, changePercent: 1.82 },
  ]);

  const navItems = currentRole === 'ADMIN' 
    ? [{ id: Page.ADMIN_DASHBOARD, icon: ShieldAlert, label: 'nav.admin_dashboard' }]
    : SIDEBAR_ITEMS;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 font-sans selection:bg-neon-blue/20">
      {/* Sidebar - Desktop */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-[#0B0E14] border-r border-white/5`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B0E14]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(Page.DASHBOARD)}>
             <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Activity className="text-white w-5 h-5" />
             </div>
             <div>
                <span className="font-bold text-lg tracking-wider text-white">QUANT AI</span>
                <span className="text-[10px] text-slate-500 tracking-[0.2em] block leading-none">PRO TERMINAL</span>
             </div>
          </div>
        </div>

        <div className="py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white bg-white/5 font-medium' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue rounded-r-full shadow-[0_0_10px_#0EA5E9]"></div>}
                <Icon size={18} className={`transition-colors ${isActive ? 'text-neon-blue' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="text-sm">{t(item.label)}</span>
              </button>
            );
          })}
        </div>
        
        {/* Role Switcher */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
           <div className="relative">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 border border-white/5"
              >
                 <span className="flex items-center gap-2">
                    <Repeat size={12}/> {t('role.current')}: <span className="text-white font-bold">{currentRole}</span>
                 </span>
                 <ChevronDown size={12}/>
              </button>
              
              {showRoleMenu && (
                 <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#151A23] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                    <button onClick={() => { switchRole('USER'); setShowRoleMenu(false); onNavigate(Page.DASHBOARD); }} className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5">
                       {t('role.switch_to_user')}
                    </button>
                    <button onClick={() => { switchRole('ADMIN'); setShowRoleMenu(false); onNavigate(Page.ADMIN_DASHBOARD); }} className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5">
                       {t('role.switch_to_admin')}
                    </button>
                 </div>
              )}
           </div>
        </div>

        {/* User Profile Snippet */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0B0E14]">
          <div 
             className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => onNavigate(Page.PROFILE)}
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-white/10">
               {userInfo.avatar ? <img src={userInfo.avatar} className="w-full h-full rounded-full"/> : <span className="font-bold text-xs">{userInfo.name.charAt(0)}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userInfo.name}</p>
              <div className="flex items-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${userTier === UserTier.DIAMOND ? 'bg-purple-500' : 'bg-yellow-500'}`}></div>
                 <p className="text-[10px] text-slate-500 truncate">{t(`mem.tier_${userTier.toLowerCase()}`)}</p>
              </div>
            </div>
            <Settings size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden mr-4 text-slate-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
              
              {/* Market Ticker */}
              <div className="hidden lg:flex items-center space-x-6 text-xs font-mono">
                 {marketIndices.map((idx) => (
                   <div key={idx.name} className="flex items-center space-x-2">
                      <span className="text-slate-500 font-bold">{idx.name}</span>
                      <span className={idx.change >= 0 ? 'text-neon-green' : 'text-neon-red'}>
                        {idx.value.toFixed(2)}
                      </span>
                      <span className={`px-1 rounded ${idx.change >= 0 ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'}`}>
                        {idx.change >= 0 ? '+' : ''}{idx.changePercent}%
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative group">
                 <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors">
                    <Languages size={14}/>
                    <span>{language === 'en' ? 'EN' : 'CN'}</span>
                 </button>
                 <div className="absolute right-0 top-full mt-2 w-24 bg-[#151A23] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <button onClick={() => setLanguage('zh')} className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5">简体中文</button>
                    <button onClick={() => setLanguage('en')} className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/5">English</button>
                 </div>
              </div>

              {/* Membership Badge */}
              <button 
                onClick={() => setShowMemberModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all hover:brightness-110 ${
                  userTier === UserTier.DIAMOND 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                    : userTier === UserTier.GOLD 
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                      : 'bg-slate-700/30 border-slate-600 text-slate-400'
                }`}
              >
                 {userTier === UserTier.DIAMOND ? <Crown size={12} fill="currentColor"/> : <Award size={12} />}
                 <span>{t(`mem.tier_${userTier.toLowerCase()}`)}</span>
              </button>
              
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                 <div className="w-full h-full rounded-full border-2 border-[#0B0E14]"></div>
                 <div className="absolute w-2 h-2 bg-neon-green rounded-full bottom-0 right-0 border border-[#0B0E14]"></div>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-x-hidden">
           {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Membership Modal */}
      {showMemberModal && <MembershipModal onClose={() => setShowMemberModal(false)} />}
    </div>
  );
};
