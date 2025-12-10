
import React from 'react';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Page } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const StatCard = ({ title, value, sub, icon: Icon, trend, trendUp }: any) => (
  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300 bg-[#151A23]">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-mono font-bold text-white tracking-tight">{value}</span>
        {trend && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                trendUp 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-rose-500/10 text-rose-400'
            }`}>
                {trend}
            </span>
        )}
      </div>
      <p className="mt-2 text-slate-500 text-xs font-medium">{sub}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 shadow-2xl border border-white/5 bg-[#151A23]">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none opacity-60"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-bold text-sky-400 mb-6 shadow-sm">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
             </span>
             Quant AI Engine V2.0 Live
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t('dash.hero_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                {t('dash.hero_title_highlight')}
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
            {t('dash.hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(Page.WORKSHOP)}
              className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Zap size={18} fill="currentColor" />
              <span>{t('dash.btn_generate')}</span>
            </button>
            <button 
               onClick={() => onNavigate(Page.SIGNAL_BRIDGE)}
               className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
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
          trendUp={true}
          icon={TrendingUp} 
        />
        <StatCard 
          title={t('dash.stat_active')}
          value="1,248" 
          sub={t('dash.stat_active_sub')}
          trend="+5"
          trendUp={true}
          icon={Zap} 
        />
        <StatCard 
          title={t('dash.stat_apy')}
          value="8.4%" 
          sub={t('dash.stat_apy_sub')}
          trend="High"
          trendUp={true}
          icon={ShieldCheck} 
        />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#151A23]">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-sky-500 rounded-full mr-3"></span>
            {t('dash.market_sentiment')}
          </h3>
          <div className="space-y-3">
            {[
                { name: 'AI Hardware', val: '+3.5%' }, 
                { name: 'Biotech', val: '+1.2%' }, 
                { name: 'Renewable Energy', val: '+1.7%' }
            ].map((sector, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors group">
                <span className="text-slate-200 font-medium">{sector.name}</span>
                <span className="text-emerald-400 font-mono font-bold">{sector.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#151A23]">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
            {t('dash.recent_signals')}
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Snowball-BigV', action: 'BUY NVDA', time: '2m ago', isBuy: true },
              { name: 'JoinQuant-Top10', action: 'SELL TSLA', time: '5m ago', isBuy: false },
              { name: 'AlphaSeeker', action: 'BUY MSTR', time: '12m ago', isBuy: true },
            ].map((sig, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${sig.isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span className="text-slate-200 text-sm font-medium">{sig.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                   <span className={`text-xs font-bold px-2 py-1 rounded ${
                       sig.isBuy 
                       ? 'bg-emerald-500/10 text-emerald-400' 
                       : 'bg-rose-500/10 text-rose-400'
                   }`}>
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
