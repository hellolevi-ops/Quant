
import React, { useState } from 'react';
import { Globe, Link as LinkIcon, AlertTriangle, Shield, Check, Activity, Search, Plus, Trash2, Edit2, Save, ArrowLeft, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface FollowTask {
   id: string;
   name: string;
   sourceUrl: string;
   status: 'ACTIVE' | 'PAUSED' | 'SYNCING';
   roi: number;
   multiplier: number;
}

const mockTasks: FollowTask[] = [
   { id: '1', name: 'Snowball-BigV-001', sourceUrl: 'https://xueqiu.com/P/ZH123', status: 'ACTIVE', roi: 42.5, multiplier: 1.0 },
   { id: '2', name: 'JoinQuant-Top10', sourceUrl: 'https://joinquant.com/P/JQ888', status: 'SYNCING', roi: 12.4, multiplier: 0.5 },
];

const mockSignals = [
  { id: 1, source: 'Snowball @InvestKing', symbol: 'NVIDIA (NVDA)', action: 'BUY', price: 950.02, time: '10:42:05', delay: 150 },
  { id: 2, source: 'JoinQuant Top1%', symbol: 'TESLA (TSLA)', action: 'SELL', price: 175.40, time: '10:41:12', delay: 320 },
  { id: 3, source: 'Private Alpha', symbol: 'MICROSOFT (MSFT)', action: 'BUY', price: 420.15, time: '10:38:55', delay: 45 },
];

const mockCurve = Array.from({ length: 20 }, (_, i) => ({ val: 10 + i + Math.random() * 5 }));

export const SignalBridge: React.FC = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [tasks, setTasks] = useState<FollowTask[]>(mockTasks);
  
  // Create State
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'CONNECTED'>('IDLE');
  const [multiplier, setMultiplier] = useState(1.0);
  const [isReverse, setIsReverse] = useState(false);
  const [taskName, setTaskName] = useState('');

  const handleConnect = () => {
    if (!url) return;
    setStatus('ANALYZING');
    setTimeout(() => {
       setStatus('CONNECTED');
       setTaskName('New Follow Task ' + (tasks.length + 1));
    }, 2000);
  };

  const handleSaveTask = () => {
     if (status !== 'CONNECTED' || !taskName) return;
     const newTask: FollowTask = {
        id: `ft_${Date.now()}`,
        name: taskName,
        sourceUrl: url,
        status: 'ACTIVE',
        roi: 0,
        multiplier
     };
     setTasks(prev => [...prev, newTask]);
     setViewMode('LIST');
     // Reset form
     setUrl('');
     setStatus('IDLE');
     setMultiplier(1.0);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     setTasks(prev => prev.filter(t => t.id !== id));
  };

  // --- LIST VIEW ---
  if (viewMode === 'LIST') {
     return (
        <div className="max-w-6xl mx-auto space-y-8">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-bold text-white mb-2">{t('bridge.title')}</h2>
                 <p className="text-slate-400">{t('bridge.list_title')}</p>
              </div>
              <button 
                 onClick={() => setViewMode('CREATE')}
                 className="px-6 py-2.5 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-neon-blue/20 flex items-center gap-2 transition-all"
              >
                 <Plus size={18} /> {t('bridge.btn_add_task')}
              </button>
           </div>

           {tasks.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Globe size={32} className="text-slate-500"/>
                 </div>
                 <p className="text-slate-400 mb-8 max-w-md">{t('bridge.empty')}</p>
                 <button onClick={() => setViewMode('CREATE')} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
                    {t('bridge.btn_add_task')}
                 </button>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tasks.map(task => (
                    <div key={task.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-blue/40 transition-all group relative">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/5 bg-purple-500/10 text-purple-400`}>
                                <Activity size={20} />
                             </div>
                             <div>
                                <h3 className="font-bold text-white">{task.name}</h3>
                                <div className="text-xs text-slate-400 truncate max-w-[150px]">{task.sourceUrl}</div>
                             </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${task.status === 'ACTIVE' ? 'bg-neon-green shadow-[0_0_8px_#10B981]' : 'bg-yellow-500'}`}></div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-3 bg-white/5 rounded-lg text-center">
                             <div className="text-xs text-slate-500 uppercase">ROI</div>
                             <div className="text-lg font-mono font-bold text-neon-green">+{task.roi}%</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg text-center">
                             <div className="text-xs text-slate-500 uppercase">Multiplier</div>
                             <div className="text-lg font-mono font-bold text-white">{task.multiplier}x</div>
                          </div>
                       </div>

                       <div className="flex gap-2 mt-auto">
                          <button 
                             className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-2 transition-colors"
                          >
                             <Activity size={14} /> Monitor
                          </button>
                          <button 
                             onClick={(e) => handleDeleteTask(task.id, e)}
                             className="px-3 py-2 bg-neon-red/10 hover:bg-neon-red/20 text-neon-red rounded-lg border border-neon-red/20 transition-colors"
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
     );
  }

  // --- CREATE VIEW (Original Bridge UI) ---
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top: Header */}
      <div className="flex items-center justify-between mb-4">
         <button onClick={() => setViewMode('LIST')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} /> Back to List
         </button>
         <button 
            onClick={handleSaveTask}
            disabled={status !== 'CONNECTED' || !taskName}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${
               status === 'CONNECTED' && taskName 
                  ? 'bg-neon-blue hover:bg-sky-500 text-white shadow-neon-blue/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
         >
            <Save size={16} /> {t('bridge.btn_save_task')}
         </button>
      </div>

      {/* Connection Panel */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10">
         <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex-1 w-full space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="text-neon-blue" /> {t('bridge.title')}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{t('bridge.desc')}</p>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t('bridge.input_placeholder')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-slate-200 focus:ring-1 focus:ring-neon-blue focus:outline-none transition-all"
                />
                <LinkIcon className="absolute left-4 top-4.5 text-slate-500" size={20}/>
                <button 
                  onClick={handleConnect}
                  disabled={status !== 'IDLE' && status !== 'CONNECTED'}
                  className="absolute right-2 top-2 bottom-2 bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-white px-6 rounded-lg font-medium transition-all"
                >
                  {status === 'ANALYZING' ? t('bridge.btn_analyzing') : status === 'CONNECTED' ? t('bridge.btn_connected') : t('bridge.btn_connect')}
                </button>
              </div>

              {status === 'CONNECTED' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="p-4 bg-neon-green/5 border border-neon-green/20 rounded-xl flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                        <span className="font-bold text-xs">ZH123</span>
                     </div>
                     <div className="flex-1">
                        <h4 className="text-white font-medium">Growth-Engine V4</h4>
                        <p className="text-neon-green text-xs">Annualized: +42.5% | MaxDD: -15%</p>
                     </div>
                     <Check className="text-neon-green" />
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Task Name</label>
                     <input 
                        type="text" 
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-blue/50"
                     />
                  </div>
                </div>
              )}
            </div>

            {/* Visual Metaphor / Preview */}
            <div className="w-full md:w-1/3 h-48 bg-black/20 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
               {status === 'IDLE' && <p className="text-slate-600 text-sm">{t('bridge.status_waiting')}</p>}
               {status === 'ANALYZING' && (
                 <div className="flex flex-col items-center gap-2">
                   <Activity className="text-neon-blue animate-spin" size={32} />
                   <p className="text-neon-blue text-xs animate-pulse">{t('bridge.status_crawling')}</p>
                 </div>
               )}
               {status === 'CONNECTED' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockCurve}>
                      <Line type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} dot={false} />
                      <Tooltip contentStyle={{background: '#000', border: 'none'}} itemStyle={{color: '#10B981'}} labelStyle={{display: 'none'}} />
                    </LineChart>
                  </ResponsiveContainer>
               )}
            </div>
         </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Shield className="text-neon-red" size={18} /> {t('bridge.risk_title')}
          </h3>
          
          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-sm text-slate-400 mb-2">
                 <span>{t('bridge.risk_multiplier')}</span>
                 <span className="text-white font-mono">{multiplier}x</span>
               </div>
               <input 
                 type="range" 
                 min="0.1" 
                 max="5.0" 
                 step="0.1"
                 value={multiplier}
                 onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                 className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
               />
             </div>

             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <span className="text-sm text-slate-300">{t('bridge.risk_reverse')}</span>
                <button 
                  onClick={() => setIsReverse(!isReverse)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isReverse ? 'bg-neon-red' : 'bg-slate-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${isReverse ? 'left-6' : 'left-1'}`} />
                </button>
             </div>

             <div className="p-3 bg-neon-red/10 border border-neon-red/20 rounded-lg">
                <p className="text-[10px] text-neon-red flex items-start gap-1">
                   <AlertTriangle size={12} className="mt-0.5"/>
                   {t('bridge.risk_slippage')}
                </p>
             </div>
          </div>
        </div>

        {/* Live Signal Stream */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="text-neon-green" size={18} /> {t('bridge.stream_title')}
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-2">
            {mockSignals.map((sig) => (
              <div key={sig.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border ${sig.action === 'BUY' ? 'border-neon-green/30 text-neon-green bg-neon-green/5' : 'border-neon-red/30 text-neon-red bg-neon-red/5'}`}>
                    {sig.action}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{sig.symbol}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Globe size={10} /> {sig.source}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                   <div className="text-white font-mono text-sm">${sig.price.toFixed(2)}</div>
                   <div className="text-[10px] text-slate-500 font-mono">Delay: {sig.delay}ms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
