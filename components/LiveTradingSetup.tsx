import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DockerConfig } from '../types';
import { Server, Wifi, Play, Activity, Terminal, ShieldCheck, Box, RefreshCw, Send, Lock, Plus, Edit2, Trash2, ArrowLeft, Save } from 'lucide-react';

// Mock Instances
const MOCK_INSTANCES = [
  { id: 'inst_1', name: 'Aliyun-QMT-01', provider: 'ALIYUN', host: '47.100.22.10', status: 'CONNECTED', brokerType: 'QMT' },
  { id: 'inst_2', name: 'AWS-Ptrade-Hedge', provider: 'AWS', host: '52.14.88.91', status: 'DISCONNECTED', brokerType: 'PTRADE' },
];

export const LiveTradingSetup: React.FC = () => {
  const { t } = useLanguage();
  
  // View State: LIST | EDIT
  const [viewMode, setViewMode] = useState<'LIST' | 'EDIT'>('LIST');
  const [instances, setInstances] = useState(MOCK_INSTANCES);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);

  // Form State
  const [config, setConfig] = useState<DockerConfig>({
    provider: 'ALIYUN',
    host: '',
    port: '8888',
    authToken: '',
    brokerType: 'QMT',
    accountId: '',
    status: 'DISCONNECTED'
  });
  
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Logic to switch to Edit Mode
  const handleEdit = (inst: any) => {
     setConfig({
        ...config,
        provider: inst.provider,
        host: inst.host,
        brokerType: inst.brokerType,
        status: inst.status
     });
     setActiveInstanceId(inst.id);
     setViewMode('EDIT');
  };

  const handleCreate = () => {
     setConfig({
        provider: 'ALIYUN',
        host: '',
        port: '8888',
        authToken: '',
        brokerType: 'QMT',
        accountId: '',
        status: 'DISCONNECTED'
     });
     setActiveInstanceId(null);
     setViewMode('EDIT');
  };

  const handleSave = () => {
     if (activeInstanceId) {
        // Update existing
        setInstances(prev => prev.map(i => i.id === activeInstanceId ? { ...i, host: config.host, provider: config.provider, brokerType: config.brokerType } : i));
     } else {
        // Create new
        const newInst = {
           id: `inst_${Date.now()}`,
           name: `Custom-${config.provider}-${instances.length + 1}`,
           provider: config.provider,
           host: config.host || '127.0.0.1',
           status: 'DISCONNECTED',
           brokerType: config.brokerType
        };
        setInstances(prev => [...prev, newInst]);
     }
     setViewMode('LIST');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     if(confirm('Are you sure you want to delete this instance?')) {
        setInstances(prev => prev.filter(i => i.id !== id));
     }
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleConnect = () => {
    setConfig(prev => ({ ...prev, status: 'CONNECTING' }));
    addLog(`Initiating handshake with ${config.provider} container at ${config.host}...`);
    
    setTimeout(() => {
       addLog(`Handshake successful. Latency: 12ms.`);
       addLog(`Verifying Broker Client (${config.brokerType})...`);
       setTimeout(() => {
          setConfig(prev => ({ ...prev, status: 'CONNECTED' }));
          addLog(`Client Connected. Account: ${config.accountId}. Ready for strategy injection.`);
       }, 1500);
    }, 1500);
  };

  const handlePushStrategy = () => {
     if (config.status !== 'CONNECTED') return;
     addLog(`Pushing Strategy 'Alpha-Dragon-V2' to /app/strategies/...`);
     setTimeout(() => {
        addLog(`Upload complete. Verifying dependencies...`);
        addLog(`Strategy daemon started. PID: 4021.`);
     }, 1000);
  };

  // --- LIST VIEW ---
  if (viewMode === 'LIST') {
      return (
         <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('live.title')}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{t('live.list_title')}</p>
               </div>
               <button 
                 onClick={handleCreate}
                 className="px-6 py-2.5 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-neon-blue/20 flex items-center gap-2 transition-all"
               >
                  <Plus size={18} /> {t('live.btn_add')}
               </button>
            </div>

            {instances.length === 0 ? (
               <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                     <Server size={32} className="text-slate-500"/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Instances Configured</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">{t('live.empty')}</p>
                  <button onClick={handleCreate} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white rounded-lg font-bold transition-colors">
                     {t('live.btn_add')}
                  </button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instances.map((inst) => (
                     <div key={inst.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-blue/40 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inst.status === 'CONNECTED' ? 'bg-neon-green/10 text-neon-green' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                 <Server size={20} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-slate-800 dark:text-white">{inst.name}</h3>
                                 <div className="text-xs text-slate-500">{inst.provider} • {inst.brokerType}</div>
                              </div>
                           </div>
                           <div className={`w-2 h-2 rounded-full ${inst.status === 'CONNECTED' ? 'bg-neon-green shadow-[0_0_8px_#10B981]' : 'bg-slate-400 dark:bg-slate-600'}`}></div>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                           <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Host IP</span>
                              <span className="text-slate-700 dark:text-slate-300 font-mono">{inst.host}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Status</span>
                              <span className={inst.status === 'CONNECTED' ? 'text-neon-green' : 'text-slate-500'}>{inst.status}</span>
                           </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                           <button 
                             onClick={() => handleEdit(inst)}
                             className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-white/5 flex items-center justify-center gap-2 transition-colors"
                           >
                              <Edit2 size={14} /> {t('live.btn_edit')}
                           </button>
                           <button 
                             onClick={(e) => handleDelete(inst.id, e)}
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

  // --- EDIT VIEW ---
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
         <button onClick={() => setViewMode('LIST')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ArrowLeft size={18} /> {t('live.btn_cancel')}
         </button>
         <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-neon-blue hover:bg-sky-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-neon-blue/20">
            <Save size={16} /> {t('live.btn_save')}
         </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
         {/* Left: Configuration Panel */}
         <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
               <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Server className="text-neon-blue" size={20}/> {t('live.config')}
               </h2>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.provider')}</label>
                     <select 
                        value={config.provider}
                        onChange={(e) => setConfig({...config, provider: e.target.value as any})}
                        className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                     >
                        <option value="ALIYUN">Aliyun (ECS)</option>
                        <option value="TENCENT">Tencent Cloud</option>
                        <option value="AWS">AWS (EC2)</option>
                        <option value="CUSTOM">Custom Host</option>
                     </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.host')}</label>
                        <input 
                           type="text" 
                           value={config.host}
                           onChange={(e) => setConfig({...config, host: e.target.value})}
                           className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.port')}</label>
                        <input 
                           type="text" 
                           value={config.port}
                           onChange={(e) => setConfig({...config, port: e.target.value})}
                           className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.token')}</label>
                     <div className="relative">
                        <input 
                           type="password" 
                           value={config.authToken}
                           onChange={(e) => setConfig({...config, authToken: e.target.value})}
                           placeholder="••••••••••••"
                           className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 pl-3 pr-10 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                        />
                        <Lock className="absolute right-3 top-2.5 text-slate-500" size={16}/>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.broker')}</label>
                           <select 
                              value={config.brokerType}
                              onChange={(e) => setConfig({...config, brokerType: e.target.value as any})}
                              className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                           >
                              <option value="QMT">QMT</option>
                              <option value="PTRADE">Ptrade</option>
                              <option value="MINI_QMT">MiniQMT</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{t('live.account')}</label>
                           <input 
                              type="text" 
                              value={config.accountId}
                              onChange={(e) => setConfig({...config, accountId: e.target.value})}
                              className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-3 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-neon-blue/50"
                           />
                        </div>
                     </div>
                  </div>
                  
                  <button 
                     onClick={handleConnect}
                     disabled={config.status === 'CONNECTED' || config.status === 'CONNECTING'}
                     className={`w-full py-3 mt-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        config.status === 'CONNECTED' 
                           ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' 
                           : 'bg-neon-blue hover:bg-sky-500 text-white shadow-lg shadow-neon-blue/20'
                     }`}
                  >
                     {config.status === 'CONNECTING' ? (
                        <RefreshCw className="animate-spin" size={18}/> 
                     ) : config.status === 'CONNECTED' ? (
                        <ShieldCheck size={18}/>
                     ) : (
                        <Wifi size={18}/>
                     )}
                     {config.status === 'CONNECTING' ? t('live.status_connecting') : config.status === 'CONNECTED' ? t('live.status_connected') : t('live.btn_connect')}
                  </button>
               </div>
            </div>

            {/* Connection Topology Status */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1 flex flex-col">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('live.topology')}</h3>
               <div className="flex-1 flex flex-col justify-center items-center gap-2 relative">
                  {/* Nodes */}
                  <div className="flex items-center w-full justify-between relative z-10 px-4">
                     {/* Platform Node */}
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-lg">
                           <Activity className="text-neon-blue"/>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">Platform</span>
                     </div>

                     {/* Cloud Node */}
                     <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg transition-colors duration-500 ${
                           config.status === 'CONNECTED' ? 'bg-white dark:bg-slate-800 border-neon-green/50' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-white/5'
                        }`}>
                           <Box className={config.status === 'CONNECTED' ? 'text-neon-green' : 'text-slate-600'}/>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">{config.provider} Docker</span>
                     </div>

                     {/* Broker Node */}
                     <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg transition-colors duration-500 ${
                           config.status === 'CONNECTED' ? 'bg-white dark:bg-slate-800 border-neon-green/50' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-white/5'
                        }`}>
                           <ShieldCheck className={config.status === 'CONNECTED' ? 'text-neon-green' : 'text-slate-600'}/>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">{config.brokerType}</span>
                     </div>
                  </div>

                  {/* Connecting Lines */}
                  <div className="absolute top-[32px] left-[15%] right-[15%] h-0.5 bg-slate-300 dark:bg-slate-800 -z-0">
                     <div className={`h-full bg-neon-green transition-all duration-1000 ease-out ${config.status === 'CONNECTED' ? 'w-full' : config.status === 'CONNECTING' ? 'w-1/2' : 'w-0'}`}></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right: Remote Terminal */}
         <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
            <div className="h-12 bg-[#1e1e1e] border-b border-white/10 flex items-center justify-between px-4">
               <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Terminal size={14}/> 
                  <span>root@{config.host.replace(/\.X+$/, '') || 'server'}:~</span>
               </div>
               <div className="flex gap-2">
                  <button 
                     onClick={handlePushStrategy}
                     disabled={config.status !== 'CONNECTED'}
                     className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${
                        config.status === 'CONNECTED' 
                        ? 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-white' 
                        : 'bg-white/5 text-slate-600 cursor-not-allowed'
                     }`}
                  >
                     <Send size={12}/> {t('live.push_strat')}
                  </button>
               </div>
            </div>
            
            <div className="flex-1 bg-[#0d1117] p-4 overflow-y-auto font-mono text-xs space-y-1">
               <div className="text-slate-500"># System initialized. Waiting for connection...</div>
               {logs.map((log, i) => (
                  <div key={i} className="text-neon-green">{log}</div>
               ))}
               <div ref={logsEndRef}/>
            </div>
         </div>
      </div>
    </div>
  );
};