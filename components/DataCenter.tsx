
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DataSource } from '../types';
import { Database, Search, Download, Copy, Check } from 'lucide-react';

const mockDataSources: DataSource[] = [
  { id: '1', name: 'A-Share Level-2 Tick', region: 'CN', type: 'High Frequency', price: 'Free', status: 'ACTIVE', description: 'Real-time transaction data for Shanghai and Shenzhen exchanges. Includes bid/ask queues.' },
  { id: '2', name: 'US Equities EOD (Adjusted)', region: 'US', type: 'Historical', price: 'Pro', status: 'SUBSCRIBE', description: 'End-of-day OHLCV data adjusted for splits and dividends. Coverage: NASDAQ, NYSE, AMEX.' },
  { id: '3', name: 'Binance Futures AggTrade', region: 'Global', type: 'Crypto', price: 'Free', status: 'ACTIVE', description: 'Aggregated trade streams for all USDT-M futures pairs. Sub-millisecond latency.' },
  { id: '4', name: 'Macro Economic Indicators', region: 'Global', type: 'Macro', price: 'Pro', status: 'SUBSCRIBE', description: 'GDP, CPI, PMI, and Interest Rates from major economies via World Bank & Fred.' },
  { id: '5', name: 'HKEX Stock Options', region: 'HK', type: 'Derivatives', price: 'Pro', status: 'SUBSCRIBE', description: 'Historical options chain data for Hong Kong Blue Chips.' },
];

export const DataCenter: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedData, setSelectedData] = useState<DataSource | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTabLabel = (cat: string) => {
    switch(cat) {
      case 'ALL': return t('data.tab_all');
      case 'Stock': return t('data.tab_stock');
      case 'Crypto': return t('data.tab_crypto');
      case 'Macro': return t('data.tab_macro');
      case 'Derivatives': return t('data.tab_deriv');
      default: return cat;
    }
  };

  const filteredData = activeTab === 'ALL' 
    ? mockDataSources 
    : mockDataSources.filter(ds => {
        if (activeTab === 'Stock') return ['CN', 'US'].includes(ds.region);
        if (activeTab === 'Crypto') return ds.type === 'Crypto';
        if (activeTab === 'Macro') return ds.type === 'Macro';
        if (activeTab === 'Derivatives') return ds.type === 'Derivatives';
        return true;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">{t('data.title')}</h2>
           <p className="text-slate-400 text-sm">Institutional quality PIT (Point-in-Time) data for backtesting and live trading.</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
           <input 
             type="text" 
             placeholder="Search datasets..."
             className="bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 w-64"
           />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
         {['ALL', 'Stock', 'Crypto', 'Macro', 'Derivatives'].map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveTab(cat)}
             className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
               activeTab === cat 
                 ? 'bg-neon-blue text-white border-neon-blue' 
                 : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30'
             }`}
           >
             {getTabLabel(cat)}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredData.map((ds) => (
            <div 
              key={ds.id} 
              onClick={() => setSelectedData(ds)}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-blue/40 transition-all cursor-pointer group flex flex-col h-full"
            >
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${ds.status === 'ACTIVE' ? 'bg-neon-green/10 text-neon-green' : 'bg-purple-500/10 text-purple-400'}`}>
                     <Database size={24} />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ds.status === 'ACTIVE' ? 'border-neon-green/20 text-neon-green' : 'border-purple-500/20 text-purple-400'}`}>
                     {ds.price === 'Free' ? t('data.price_free') : t('data.price_pro')}
                  </span>
               </div>
               <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">{ds.name}</h3>
               <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{ds.description}</p>
               
               <div className="flex items-center gap-2 mt-auto">
                  <span className="px-2 py-1 rounded bg-white/5 text-slate-400 text-[10px] uppercase">{ds.region}</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-slate-400 text-[10px] uppercase">{ds.type}</span>
               </div>
            </div>
         ))}
      </div>

      {selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-2xl glass-panel rounded-2xl border border-white/20 overflow-hidden relative m-4">
              <button onClick={() => setSelectedData(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                 <Search className="rotate-45" size={24} />
              </button>

              <div className="p-8">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${selectedData.status === 'ACTIVE' ? 'bg-neon-green/10 text-neon-green' : 'bg-purple-500/10 text-purple-400'}`}>
                       <Database size={32} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-white">{selectedData.name}</h2>
                       <div className="flex gap-2 mt-2 text-xs">
                          <span className="px-2 py-0.5 rounded border border-white/10 text-slate-300">{selectedData.region}</span>
                          <span className="px-2 py-0.5 rounded border border-white/10 text-slate-300">{selectedData.type}</span>
                       </div>
                    </div>
                 </div>

                 <p className="text-slate-300 mb-8 leading-relaxed">
                    {selectedData.description}
                    <br/><br/>
                    This dataset is cleaned using point-in-time methodology to prevent look-ahead bias in backtests. Updates are pushed via WebSocket or available via REST API daily at 00:00 UTC.
                 </p>

                 <div className="bg-[#0d1117] rounded-xl border border-white/10 p-4 mb-8">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-500 uppercase">{t('data.sample')} (JSON)</span>
                       <span 
                         onClick={handleCopy}
                         className="text-xs text-neon-blue cursor-pointer hover:underline flex items-center gap-1"
                       >
                         {copied ? <Check size={12}/> : <Copy size={12}/>} {t('data.api')}
                       </span>
                    </div>
                    <pre className="text-xs text-slate-400 font-mono overflow-x-auto p-2">
{`{
  "symbol": "AAPL",
  "date": "2023-11-01",
  "open": 174.24,
  "high": 175.80,
  "low": 173.35,
  "close": 174.90,
  "volume": 56782100,
  "adj_close": 174.90,
  "factors": {
     "pe_ttm": 29.5,
     "pb_mrq": 42.1
  }
}`}
                    </pre>
                 </div>

                 <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                       {selectedData.status === 'ACTIVE' ? t('data.btn_download') : t('data.status_subscribe')}
                    </button>
                    <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10">
                       {t('data.btn_copy_token')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
