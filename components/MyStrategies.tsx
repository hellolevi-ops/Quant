

import React, { useState } from 'react';
import { Strategy, StrategyStatus, Position, Trade } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, Pause, Edit3, TrendingUp, X, Save, BookOpen, Activity, ArrowLeft, BarChart3, Code, FileText, Cpu, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const mockStrategies: Strategy[] = [
  { 
    id: '1', 
    name: 'Alpha-Dragon-V2', 
    type: 'AI_GENERATED', 
    roi: 42.5, 
    todayPnl: 1250, 
    status: StrategyStatus.RUNNING, 
    description: 'RSI Mean Reversion on A-Shares. Focuses on oversold conditions in high-volatility small caps.', 
    assets: 50000, 
    maxDD: -5.2,
    annualizedReturn: 156.4,
    sharpe: 2.8,
    volatility: 0.18,
    winRate: 68.5,
    profitFactor: 2.1,
    alpha: 0.15,
    beta: 0.85
  },
  { 
    id: '2', 
    name: 'Crypto-Grid-Bot', 
    type: 'AI_GENERATED', 
    roi: 12.8, 
    todayPnl: -45, 
    status: StrategyStatus.PAUSED, 
    description: 'Neutral Grid Trading BTC/USDT', 
    assets: 12000, 
    maxDD: -12.1,
    annualizedReturn: 45.2,
    sharpe: 1.5,
    volatility: 0.45,
    winRate: 55.0,
    profitFactor: 1.3,
    alpha: 0.05,
    beta: 1.2
  },
  { 
    id: '3', 
    name: 'Snowball-Copy-ZH1', 
    type: 'FOLLOW_COPY', 
    roi: 156.2, 
    todayPnl: 3420, 
    status: StrategyStatus.RUNNING, 
    platform: 'Snowball', 
    assets: 150000, 
    maxDD: -15.4,
    annualizedReturn: 89.0,
    sharpe: 2.1,
    volatility: 0.25,
    winRate: 62.1,
    profitFactor: 1.8,
    alpha: 0.22,
    beta: 0.95
  },
  { 
    id: '4', 
    name: 'Saved-Mean-Reversion-V1', 
    type: 'AI_GENERATED', 
    roi: 0, 
    todayPnl: 0, 
    status: StrategyStatus.STOPPED, 
    description: 'Strategy saved from AI Workshop. Awaiting deployment.', 
    assets: 0, 
    maxDD: 0,
    annualizedReturn: 0,
    sharpe: 0,
    volatility: 0,
    winRate: 0,
    profitFactor: 0,
    alpha: 0,
    beta: 0
  },
];

// Mock Performance Data
const mockPositions: Position[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', cost: 850.20, price: 920.50, quantity: 100, marketValue: 92050, pnl: 7030, pnlPercent: 8.2 },
  { symbol: 'TSLA', name: 'Tesla Inc', cost: 180.00, price: 175.50, quantity: 200, marketValue: 35100, pnl: -900, pnlPercent: -2.5 },
  { symbol: 'AAPL', name: 'Apple Inc', cost: 170.00, price: 172.50, quantity: 150, marketValue: 25875, pnl: 375, pnlPercent: 1.4 },
];

const mockTrades: Trade[] = [
  { id: 't1', time: '2024-12-10 10:30:00', symbol: 'NVDA', name: 'NVIDIA Corp', action: 'BUY', price: 915.00, volume: 50, fee: 15.2 },
  { id: 't2', time: '2024-12-09 14:15:00', symbol: 'AMD', name: 'AMD', action: 'SELL', price: 178.20, volume: 200, fee: 22.5 },
  { id: 't3', time: '2024-12-08 09:45:00', symbol: 'TSLA', name: 'Tesla Inc', action: 'BUY', price: 172.50, volume: 100, fee: 12.0 },
];

const mockSparkline = Array.from({ length: 20 }, (_, i) => ({ val: Math.random() * 100 }));

// Generate equity curve
const generateEquityCurve = () => {
  let value = 100;
  return Array.from({ length: 90 }, (_, i) => {
    value = value * (1 + (Math.random() - 0.45) * 0.02);
    return {
      date: new Date(Date.now() - (90 - i) * 86400000).toISOString().split('T')[0],
      value: value,
      benchmark: 100 * (1 + (i * 0.005)) // Simple linear benchmark
    };
  });
};

const mockEquityData = generateEquityCurve();

type DetailTab = 'SUMMARY' | 'CODE' | 'PERF' | 'ANALYSIS';

export const MyStrategies: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'LIVE' | 'LIBRARY'>('LIVE');
  const [selectedStrat, setSelectedStrat] = useState<Strategy | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('SUMMARY');

  // Filter Logic
  const filteredStrategies = mockStrategies.filter(s => {
    if (activeTab === 'LIVE') {
      return s.status === StrategyStatus.RUNNING;
    } else {
      return true;
    }
  });

  // --- DETAIL VIEW ---
  if (selectedStrat) {
     return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
           {/* Top Bar */}
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedStrat(null)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                       {selectedStrat.name}
                       <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                          selectedStrat.status === StrategyStatus.RUNNING 
                             ? 'bg-neon-green/10 text-neon-green border-neon-green/20' 
                             : 'bg-slate-700/50 text-slate-400 border-slate-600'
                       }`}>
                          {selectedStrat.status}
                       </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">{selectedStrat.description}</p>
                 </div>
              </div>
              
              <div className="flex gap-3">
                 {selectedStrat.status === StrategyStatus.RUNNING ? (
                    <button className="px-4 py-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 border border-neon-red/20 flex items-center gap-2 text-sm font-bold">
                       <Pause size={16} /> {t('mystrat.btn_pause')}
                    </button>
                 ) : (
                    <button className="px-4 py-2 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 border border-neon-green/20 flex items-center gap-2 text-sm font-bold">
                       <Play size={16} /> {t('mystrat.btn_start')}
                    </button>
                 )}
                 <button className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm">
                    <Edit3 size={16} /> {t('mystrat.edit_modal')}
                 </button>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex space-x-1 p-1 bg-black/20 rounded-xl border border-white/10 w-fit mb-6">
              {[
                 { id: 'SUMMARY', label: t('strat.tab_summary'), icon: Activity },
                 { id: 'CODE', label: t('strat.tab_code'), icon: Code },
                 { id: 'PERF', label: t('strat.tab_perf'), icon: BarChart3 },
                 { id: 'ANALYSIS', label: t('strat.tab_analysis'), icon: Cpu },
              ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setDetailTab(tab.id as DetailTab)} 
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      detailTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                   }`}
                 >
                   <tab.icon size={16}/> {tab.label}
                 </button>
              ))}
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto">
              {detailTab === 'SUMMARY' && (
                 <div className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                          { label: t('strat.annualized'), value: `${selectedStrat.annualizedReturn}%`, color: 'text-neon-green' },
                          { label: t('mystrat.maxdd'), value: `${selectedStrat.maxDD}%`, color: 'text-neon-red' },
                          { label: t('strat.sharpe'), value: selectedStrat.sharpe, color: 'text-white' },
                          { label: t('strat.volatility'), value: selectedStrat.volatility, color: 'text-slate-300' },
                          { label: t('mystrat.win_rate'), value: `${selectedStrat.winRate}%`, color: 'text-neon-blue' },
                          { label: t('strat.profit_factor'), value: selectedStrat.profitFactor, color: 'text-white' },
                          { label: t('strat.alpha'), value: selectedStrat.alpha, color: 'text-purple-400' },
                          { label: t('strat.beta'), value: selectedStrat.beta, color: 'text-white' },
                       ].map((m, i) => (
                          <div key={i} className="glass-panel p-4 rounded-xl border border-white/10">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">{m.label}</div>
                             <div className={`text-xl font-mono font-bold ${m.color}`}>{m.value}</div>
                          </div>
                       ))}
                    </div>

                    {/* Equity Curve */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 h-[400px]">
                       <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp size={16} className="text-neon-green"/> Equity Curve vs Benchmark
                       </h3>
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockEquityData}>
                             <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                             <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#10B981' }}
                             />
                             <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" name="Strategy" />
                             <Area type="monotone" dataKey="benchmark" stroke="#64748b" strokeWidth={1} fill="transparent" strokeDasharray="5 5" name="Benchmark" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              )}

              {detailTab === 'PERF' && (
                 <div className="space-y-6">
                    {/* Holdings Table */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                       <h3 className="text-lg font-bold text-white mb-4">{t('strat.holdings')}</h3>
                       <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-slate-400">
                             <thead className="text-xs text-slate-500 uppercase bg-white/5">
                                <tr>
                                   <th className="px-6 py-3 rounded-l-lg">{t('strat.col_symbol')}</th>
                                   <th className="px-6 py-3">{t('strat.col_cost')}</th>
                                   <th className="px-6 py-3">{t('strat.col_price')}</th>
                                   <th className="px-6 py-3">{t('strat.col_qty')}</th>
                                   <th className="px-6 py-3">{t('strat.col_mkt_val')}</th>
                                   <th className="px-6 py-3 rounded-r-lg">{t('strat.col_pnl')}</th>
                                </tr>
                             </thead>
                             <tbody>
                                {mockPositions.map((pos, i) => (
                                   <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                      <td className="px-6 py-4 font-bold text-white">
                                         {pos.symbol} 
                                         <span className="ml-2 text-xs font-normal text-slate-500">{pos.name}</span>
                                      </td>
                                      <td className="px-6 py-4 font-mono">{pos.cost.toFixed(2)}</td>
                                      <td className="px-6 py-4 font-mono text-white">{pos.price.toFixed(2)}</td>
                                      <td className="px-6 py-4 font-mono">{pos.quantity}</td>
                                      <td className="px-6 py-4 font-mono text-white">${pos.marketValue.toLocaleString()}</td>
                                      <td className={`px-6 py-4 font-mono font-bold ${pos.pnl >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                                         {pos.pnl > 0 ? '+' : ''}{pos.pnl.toLocaleString()} ({pos.pnlPercent}%)
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    {/* Trade History */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/10">
                       <h3 className="text-lg font-bold text-white mb-4">{t('strat.transactions')}</h3>
                       <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-slate-400">
                             <thead className="text-xs text-slate-500 uppercase bg-white/5">
                                <tr>
                                   <th className="px-6 py-3 rounded-l-lg">{t('strat.col_time')}</th>
                                   <th className="px-6 py-3">{t('strat.col_symbol')}</th>
                                   <th className="px-6 py-3">{t('strat.col_action')}</th>
                                   <th className="px-6 py-3">{t('strat.col_price')}</th>
                                   <th className="px-6 py-3">{t('strat.col_volume')}</th>
                                   <th className="px-6 py-3 rounded-r-lg">{t('strat.col_fee')}</th>
                                </tr>
                             </thead>
                             <tbody>
                                {mockTrades.map((tr, i) => (
                                   <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                      <td className="px-6 py-4 font-mono text-xs">{tr.time}</td>
                                      <td className="px-6 py-4 text-white font-bold">{tr.symbol}</td>
                                      <td className="px-6 py-4">
                                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${tr.action === 'BUY' ? 'bg-neon-red/10 text-neon-red' : 'bg-neon-green/10 text-neon-green'}`}>
                                            {tr.action}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 font-mono">{tr.price.toFixed(2)}</td>
                                      <td className="px-6 py-4 font-mono">{tr.volume}</td>
                                      <td className="px-6 py-4 font-mono text-xs">${tr.fee}</td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>
              )}

              {detailTab === 'CODE' && (
                 <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
                    <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                       <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <FileText size={16} className="text-neon-blue"/> Python Source
                       </h3>
                       <div className="text-xs text-slate-500">Read-Only</div>
                    </div>
                    <div className="flex-1 bg-[#1e1e1e] p-6 overflow-auto">
                       <pre className="font-mono text-xs text-slate-300 leading-relaxed">
{`import backtrader as bt
import datetime

class ${selectedStrat.name.replace(/-/g, '')}(bt.Strategy):
    params = (
        ('rsi_period', 14),
        ('rsi_upper', 70),
        ('rsi_lower', 30),
    )

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data.close, period=self.params.rsi_period)
        self.sma = bt.indicators.SMA(self.data.close, period=200)

    def next(self):
        if not self.position:
            # Entry Condition: RSI Oversold + Above 200 SMA (Trend Filter)
            if self.rsi < self.params.rsi_lower and self.data.close > self.sma:
                self.buy()
        else:
            # Exit Condition: RSI Overbought
            if self.rsi > self.params.rsi_upper:
                self.sell()

    def stop(self):
        print(f'Strategy Finished. Final Value: {self.broker.getvalue()}')
`}
                       </pre>
                    </div>
                 </div>
              )}

              {detailTab === 'ANALYSIS' && (
                 <div className="glass-panel p-8 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                       <Cpu size={32} className="text-purple-400"/>
                       <div>
                          <h3 className="font-bold text-white">{t('strat.analysis_title')}</h3>
                          <p className="text-xs text-slate-400">Generated by Quant AI Engine (DeepSeek-R1)</p>
                       </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                       <h3 className="text-white font-bold mb-4">Strategy Logic</h3>
                       <p className="mb-4">
                          This strategy employs a classic <strong>Mean Reversion</strong> approach augmented with a trend filter. 
                          It assumes that price extensions (as measured by RSI) are temporary and will revert to the mean.
                       </p>
                       <ul className="list-disc pl-5 mb-6 space-y-2">
                          <li><strong className="text-neon-blue">Entry:</strong> Buys when RSI drops below 30, but only if the asset is in a long-term uptrend (Price {'>'} 200 SMA).</li>
                          <li><strong className="text-neon-red">Exit:</strong> Sells when RSI becomes overbought (above 70).</li>
                       </ul>

                       <h3 className="text-white font-bold mb-4">Strengths & Weaknesses</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                             <div className="text-neon-green font-bold mb-2 flex items-center gap-2"><TrendingUp size={16}/> Strengths</div>
                             <ul className="list-disc pl-4 text-sm text-slate-400 space-y-1">
                                <li>High win rate in ranging markets.</li>
                                <li>Trend filter prevents buying falling knives in bear markets.</li>
                                <li>Low drawdown due to quick exits.</li>
                             </ul>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                             <div className="text-neon-red font-bold mb-2 flex items-center gap-2"><AlertCircle size={16}/> Weaknesses</div>
                             <ul className="list-disc pl-4 text-sm text-slate-400 space-y-1">
                                <li>Underperforms in strong parabolic bull runs (sells too early).</li>
                                <li>Subject to whipsaws if the 200 SMA is flat.</li>
                             </ul>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
     );
  }

  // --- LIST VIEW (Default) ---
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview Cards (Same as before) */}
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
               <div className="text-3xl font-mono font-bold text-white mt-2">
                 {mockStrategies.filter(s => s.status === StrategyStatus.RUNNING).length} 
                 <span className="text-sm text-slate-500 font-normal"> / {mockStrategies.length}</span>
               </div>
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
              onClick={() => setActiveTab('LIVE')}
              className={`px-8 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'LIVE' ? 'border-neon-blue text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              <Activity size={16}/> {t('mystrat.tab_live')}
            </button>
            <button 
              onClick={() => setActiveTab('LIBRARY')}
              className={`px-8 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'LIBRARY' ? 'border-neon-blue text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-white'}`}
            >
              <BookOpen size={16}/> {t('mystrat.tab_lib')}
            </button>
         </div>

         <div className="p-6 grid grid-cols-1 gap-4">
            {filteredStrategies.length === 0 ? (
               <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                     {activeTab === 'LIVE' ? <Activity size={32} className="opacity-50"/> : <BookOpen size={32} className="opacity-50"/>}
                  </div>
                  <p>{activeTab === 'LIVE' ? t('mystrat.empty_live') : t('mystrat.empty_lib')}</p>
               </div>
            ) : (
               filteredStrategies.map((strat) => (
                  <div key={strat.id} onClick={() => setSelectedStrat(strat)} className="group p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6">
                     
                     {/* Info */}
                     <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${strat.status === StrategyStatus.RUNNING ? 'bg-neon-green/10 text-neon-green' : 'bg-slate-700 text-slate-400'}`}>
                           {strat.status === StrategyStatus.RUNNING ? <TrendingUp size={20} /> : <Pause size={20} />}
                        </div>
                        <div>
                           <h4 className="text-white font-medium group-hover:text-neon-blue transition-colors">{strat.name}</h4>
                           <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className={`px-1.5 rounded ${strat.type === 'FOLLOW_COPY' ? 'bg-purple-500/20 text-purple-400' : 'bg-neon-blue/20 text-neon-blue'}`}>
                                 {strat.type === 'FOLLOW_COPY' ? 'COPY' : 'AI'}
                              </span>
                              <span>{strat.platform || 'Custom Python'}</span>
                           </div>
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
               ))
            )}
         </div>
      </div>
    </div>
  );
};
