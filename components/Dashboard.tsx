import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Page } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const StatCard = ({ title, value, sub, icon: Icon, trend }: any) => (
  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-neon-blue/30 transition-all duration-300">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className="mt-2 flex items-baseline space-x-2">
        <span className="text-3xl font-mono font-bold text-white">{value}</span>
        {trend && <span className="text-xs text-neon-green font-mono">{trend}</span>}
      </div>
      <p className="mt-1 text-slate-500 text-xs">{sub}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('dash.hero_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-400 glow-text">{t('dash.hero_title_highlight')}</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            {t('dash.hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(Page.WORKSHOP)}
              className="px-8 py-3.5 bg-neon-blue hover:bg-sky-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center space-x-2"
            >
              <Zap size={18} />
              <span>{t('dash.btn_generate')}</span>
            </button>
            <button 
               onClick={() => onNavigate(Page.SIGNAL_BRIDGE)}
               className="px-8 py-3.5 glass-panel hover:bg-white/10 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <TrendingUp size={18} />
              <span>{t('dash.btn_copy')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t('dash.stat_vol')}
          value="$42.8M" 
          sub={t('dash.stat_vol_sub')}
          trend="+12%"
          icon={TrendingUp} 
        />
        <StatCard 
          title={t('dash.stat_active')}
          value="1,248" 
          sub={t('dash.stat_active_sub')}
          trend="+5"
          icon={Zap} 
        />
        <StatCard 
          title={t('dash.stat_apy')}
          value="8.4%" 
          sub={t('dash.stat_apy_sub')}
          trend="High"
          icon={ShieldCheck} 
        />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-neon-blue rounded-full mr-3"></span>
            {t('dash.market_sentiment')}
          </h3>
          <div className="space-y-4">
            {['AI Hardware', 'Biotech', 'Renewable Energy'].map((sector, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                <span className="text-slate-300">{sector}</span>
                <span className="text-neon-green font-mono">+{Math.floor(Math.random() * 5)}.{Math.floor(Math.random() * 9)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
            {t('dash.recent_signals')}
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Snowball-BigV', action: 'BUY NVDA', time: '2m ago' },
              { name: 'JoinQuant-Top10', action: 'SELL TSLA', time: '5m ago' },
              { name: 'AlphaSeeker', action: 'BUY MSTR', time: '12m ago' },
            ].map((sig, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                  <span className="text-slate-300 text-sm">{sig.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                   <span className={`text-xs font-mono px-2 py-1 rounded ${sig.action.includes('BUY') ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'}`}>
                     {sig.action}
                   </span>
                   <span className="text-slate-500 text-xs">{sig.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
