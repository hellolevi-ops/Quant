import React, { useState } from 'react';
import { Globe, Link as LinkIcon, AlertTriangle, Shield, Check, Activity, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const mockSignals = [
  { id: 1, source: 'Snowball @InvestKing', symbol: 'NVIDIA (NVDA)', action: 'BUY', price: 950.02, time: '10:42:05', delay: 150 },
  { id: 2, source: 'JoinQuant Top1%', symbol: 'TESLA (TSLA)', action: 'SELL', price: 175.40, time: '10:41:12', delay: 320 },
  { id: 3, source: 'Private Alpha', symbol: 'MICROSOFT (MSFT)', action: 'BUY', price: 420.15, time: '10:38:55', delay: 45 },
];

const mockCurve = Array.from({ length: 20 }, (_, i) => ({ val: 10 + i + Math.random() * 5 }));

export const SignalBridge: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'CONNECTED'>('IDLE');
  const [multiplier, setMultiplier] = useState(1.0);
  const [isReverse, setIsReverse] = useState(false);
  const { t } = useLanguage();

  const handleConnect = () => {
    if (!url) return;
    setStatus('ANALYZING');
    setTimeout(() => setStatus('CONNECTED'), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top: Connection Panel */}
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
                <div className="p-4 bg-neon-green/5 border border-neon-green/20 rounded-xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                    <span className="font-bold text-xs">ZH123</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Growth-Engine V4</h4>
                    <p className="text-neon-green text-xs">Annualized: +42.5% | MaxDD: -15%</p>
                  </div>
                  <Check className="text-neon-green" />
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
