
import React, { useState } from 'react';
import { Strategy, StrategyStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, Pause, Edit3, TrendingUp, X, Save } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const mockStrategies: Strategy[] = [
  { id: '1', name: 'Alpha-Dragon-V2', type: 'AI_GENERATED', roi: 42.5, todayPnl: 1250, status: StrategyStatus.RUNNING, description: 'RSI Mean Reversion on A-Shares', assets: 50000, maxDD: -5.2 },
  { id: '2', name: 'Crypto-Grid-Bot', type: 'AI_GENERATED', roi: 12.8, todayPnl: -45, status: StrategyStatus.PAUSED, description: 'Neutral Grid Trading BTC/USDT', assets: 12000, maxDD: -12.1 },
  { id: '3', name: 'Snowball-Copy-ZH1', type: 'FOLLOW_COPY', roi: 156.2, todayPnl: 3420, status: StrategyStatus.RUNNING, platform: 'Snowball', assets: 150000, maxDD: -15.4 },
];

const mockSparkline = Array.from({ length: 20 }, (_, i) => ({ val: Math.random() * 100 }));

export const MyStrategies: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'SELF' | 'COPY'>('SELF');
  const [selectedStrat, setSelectedStrat] = useState<Strategy | null>(null);

  const filteredStrategies = mockStrategies.filter(s => 
    activeTab === 'SELF' ? s.type === 'AI_GENERATED' : s.type === 'FOLLOW_COPY'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-5"><TrendingUp size={80}/></div>
            <h3 className="text-slate-400 text-sm uppercase">{t('mystrat.assets')}</h3>
            <div className="text-3xl font-mono font-bold text-white mt-2">$212,000.00</div>
            <div className="mt-2 text-xs text-neon-green flex items-center">+4.2% Today</div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-slate-400 text-sm uppercase">{t('mystrat.day_pnl')}</h3>
            <div className="text-3xl font-mono font-bold text-white mt-2">+$4,625.00</div>
            <div className="w-full h-1 bg-slate-700 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-neon-green w-[70%]"></div>
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
               <h3 className="text-slate-400 text-sm uppercase">{t('mystrat.active_count')}</h3>
               <div className="text-3xl font-mono font-bold text-white mt-2">2 <span className="text-sm text-slate-500 font-normal">/ 5</span></div>
            </div>
            <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue animate-pulse">
               <Play fill="currentColor" size={20} />
            </div>
         </div>
      </div>

      {/* Main List */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
         <div className="flex border-b border-white/10">
            <button 
              onClick={() => setActiveTab('SELF')}
              className={`px-8 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'SELF' ? 'border-neon-blue text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              {t('mystrat.tab_self')}
            </button>
            <button 
              onClick={() => setActiveTab('COPY')}
              className={`px-8 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'COPY' ? 'border-neon-blue text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              {t('mystrat.tab_copy')}
            </button>
         </div>

         <div className="p-6 grid grid-cols-1 gap-4">
            {filteredStrategies.map((strat) => (
               <div key={strat.id} onClick={() => setSelectedStrat(strat)} className="group p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  {/* Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${strat.status === StrategyStatus.RUNNING ? 'bg-neon-green/10 text-neon-green' : 'bg-slate-700 text-slate-400'}`}>
                        {strat.status === StrategyStatus.RUNNING ? <TrendingUp size={20} /> : <Pause size={20} />}
                     </div>
                     <div>
                        <h4 className="text-white font-medium group-hover:text-neon-blue transition-colors">{strat.name}</h4>
                        <p className="text-xs text-slate-500">{strat.platform || 'Custom Python'}</p>
                     </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                     <div>
                        <div className="text-xs text-slate-500">{t('mystrat.roi')}</div>
                        <div className={`font-mono font-bold ${strat.roi >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>{strat.roi > 0 ? '+' : ''}{strat.roi}%</div>
                     </div>
                     <div>
                        <div className="text-xs text-slate-500">{t('mystrat.assets')}</div>
                        <div className="font-mono text-white">${strat.assets?.toLocaleString()}</div>
                     </div>
                     <div>
                        <div className="text-xs text-slate-500">{t('mystrat.maxdd')}</div>
                        <div className="font-mono text-neon-red">{strat.maxDD}%</div>
                     </div>
                  </div>

                  {/* Sparkline */}
                  <div className="w-32 h-12 hidden md:block">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockSparkline}>
                           <Line type="monotone" dataKey="val" stroke={strat.roi >= 0 ? "#10B981" : "#F43F5E"} strokeWidth={2} dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                     strat.status === StrategyStatus.RUNNING 
                        ? 'bg-neon-green/10 text-neon-green border-neon-green/20' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600'
                  }`}>
                     {strat.status}
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Edit Modal / Drawer */}
      {selectedStrat && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-2xl bg-[#0f172a] border-l border-white/10 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#020617]">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit3 size={18} className="text-neon-blue"/> {t('mystrat.edit_modal')}
                 </h2>
                 <button onClick={() => setSelectedStrat(null)} className="text-slate-500 hover:text-white">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <div className="space-y-4">
                    <div>
                       <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">{t('mystrat.strat_name')}</label>
                       <input 
                          type="text" 
                          defaultValue={selectedStrat.name}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue/50 focus:outline-none"
                       />
                    </div>
                    <div>
                       <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">{t('mystrat.strat_desc')}</label>
                       <textarea 
                          defaultValue={selectedStrat.description}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-slate-300 focus:border-neon-blue/50 focus:outline-none h-24 resize-none"
                       />
                    </div>
                 </div>

                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-4">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-black/20 rounded">
                          <span className="text-xs text-slate-500">{t('work.sharpe')}</span>
                          <div className="text-lg font-mono text-white">2.14</div>
                       </div>
                       <div className="p-3 bg-black/20 rounded">
                          <span className="text-xs text-slate-500">{t('mystrat.win_rate')}</span>
                          <div className="text-lg font-mono text-white">64.5%</div>
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">{t('mystrat.code_preview')} (Read-Only)</label>
                    <div className="bg-[#0d1117] p-4 rounded-lg border border-white/10 font-mono text-xs text-slate-400 h-48 overflow-auto">
                       <pre>{`class ${selectedStrat.name.replace(/-/g, '')}(bt.Strategy):
    params = (('period', 14),)

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data.close, period=self.params.period)

    def next(self):
        if self.rsi < 30 and not self.position:
            self.buy()
        elif self.rsi > 70 and self.position:
            self.sell()`}
                       </pre>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#020617] flex justify-between items-center">
                 <div className="flex gap-3">
                    {selectedStrat.status === StrategyStatus.RUNNING ? (
                       <button className="px-4 py-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 border border-neon-red/20 flex items-center gap-2 text-sm font-medium">
                          <Pause size={16} /> {t('mystrat.btn_pause')}
                       </button>
                    ) : (
                       <button className="px-4 py-2 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 border border-neon-green/20 flex items-center gap-2 text-sm font-medium">
                          <Play size={16} /> {t('mystrat.btn_start')}
                       </button>
                    )}
                 </div>
                 <button onClick={() => setSelectedStrat(null)} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 flex items-center gap-2">
                    <Save size={16} /> {t('mystrat.btn_save')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
