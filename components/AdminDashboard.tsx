
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, DollarSign, Activity, Server, Settings, AlertTriangle, FileText, Upload, CheckCircle, XCircle, Terminal, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockActivityData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  users: 50 + Math.random() * 20,
  revenue: 2000 + Math.random() * 1000
}));

type AdminTab = 'OVERVIEW' | 'USERS' | 'CONTENT' | 'SYSTEM';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');

  // Content Audit Mock Data
  const [pendingStrategies, setPendingStrategies] = useState([
     { id: 'st_01', user: 'Trader_X', name: 'High Freq Arb', status: 'PENDING', time: '10m ago' },
     { id: 'st_02', user: 'Newbie_1', name: 'Simple MA', status: 'PENDING', time: '1h ago' },
  ]);

  // System Logs
  const [systemLogs, setSystemLogs] = useState<string[]>([
     "[SYSTEM] Service initialized.",
     "[DATA] Connected to Binance Stream.",
     "[AUTH] User_992 upgraded to Diamond.",
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     // Simulate incoming logs
     const interval = setInterval(() => {
        const actions = [
            "[DATA] Received 4200 ticks from QMT.",
            "[RISK] Rejected order for User_552 (Slippage > 2%).",
            "[API] AI Strategy Generation requested by User_102.",
            "[SYS] CPU Load: 45%, Memory: 2.1GB.",
        ];
        const randomLog = actions[Math.floor(Math.random() * actions.length)];
        setSystemLogs(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
     }, 3000);
     return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
        <Icon size={48} />
      </div>
      <h3 className="text-slate-400 text-sm uppercase">{title}</h3>
      <div className="text-3xl font-mono font-bold text-white mt-2">{value}</div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <StatCard title={t('admin.total_users')} value="2,842" icon={Users} color="text-neon-blue" />
               <StatCard title={t('admin.total_revenue')} value="¥482.5k" icon={DollarSign} color="text-neon-green" />
               <StatCard title={t('admin.active_instances')} value="142" icon={Server} color="text-purple-400" />
               <StatCard title={t('admin.system_health')} value="99.9%" icon={Activity} color="text-teal-400" />
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-6">
                <h3 className="text-lg font-bold text-white mb-6">Revenue Trend (30 Days)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockActivityData}>
                            <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </>
        );

      case 'USERS':
         return (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users size={20} className="text-neon-blue"/> {t('admin.user_mgmt')}
               </h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-400">
                     <thead className="text-xs text-slate-500 uppercase bg-white/5">
                        <tr>
                           <th className="px-6 py-3 rounded-l-lg">User</th>
                           <th className="px-6 py-3">Role</th>
                           <th className="px-6 py-3">Status</th>
                           <th className="px-6 py-3">Plan</th>
                           <th className="px-6 py-3 rounded-r-lg">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="border-b border-white/5 hover:bg-white/5">
                           <td className="px-6 py-4 font-medium text-white">Admin User (You)</td>
                           <td className="px-6 py-4"><span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs border border-purple-500/20">ADMIN</span></td>
                           <td className="px-6 py-4"><span className="text-neon-green">Active</span></td>
                           <td className="px-6 py-4">Unlimited</td>
                           <td className="px-6 py-4">--</td>
                        </tr>
                        <tr className="border-b border-white/5 hover:bg-white/5">
                           <td className="px-6 py-4 font-medium text-white">Trader_001</td>
                           <td className="px-6 py-4">USER</td>
                           <td className="px-6 py-4"><span className="text-neon-green">Active</span></td>
                           <td className="px-6 py-4 text-yellow-400">GOLD</td>
                           <td className="px-6 py-4 text-neon-blue cursor-pointer hover:underline">Edit</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                           <td className="px-6 py-4 font-medium text-white">Bot_Network_X</td>
                           <td className="px-6 py-4">USER</td>
                           <td className="px-6 py-4"><span className="text-neon-red flex items-center gap-1"><AlertTriangle size={12}/> Suspended</span></td>
                           <td className="px-6 py-4">FREE</td>
                           <td className="px-6 py-4 text-neon-blue cursor-pointer hover:underline">Review</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         );

      case 'CONTENT':
         return (
            <div className="space-y-6">
                {/* Strategy Audit */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle size={20} className="text-yellow-400"/> {t('admin.strategy_audit')}
                   </h3>
                   {pendingStrategies.length > 0 ? (
                      <div className="space-y-3">
                         {pendingStrategies.map(st => (
                            <div key={st.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                               <div>
                                  <div className="font-bold text-white">{st.name}</div>
                                  <div className="text-xs text-slate-500">by {st.user} • {st.time}</div>
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={() => setPendingStrategies(prev => prev.filter(p => p.id !== st.id))} className="px-3 py-1 bg-neon-green/10 text-neon-green rounded hover:bg-neon-green/20 text-xs font-bold">
                                     {t('admin.audit_approve')}
                                  </button>
                                  <button onClick={() => setPendingStrategies(prev => prev.filter(p => p.id !== st.id))} className="px-3 py-1 bg-neon-red/10 text-neon-red rounded hover:bg-neon-red/20 text-xs font-bold">
                                     {t('admin.audit_reject')}
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="text-slate-500 text-center py-8 text-sm">No pending strategies to review.</div>
                   )}
                </div>

                {/* Research Upload */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                         <FileText size={20} className="text-neon-blue"/> {t('admin.research_mgmt')}
                      </h3>
                      <button className="px-4 py-2 bg-neon-blue hover:bg-sky-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                         <Upload size={16}/> {t('admin.research_upload')}
                      </button>
                   </div>
                   <div className="p-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-white/20 transition-colors">
                       <Upload size={32} className="mb-2 opacity-50"/>
                       <p className="text-sm">Drag & Drop PDF reports here</p>
                   </div>
                </div>
            </div>
         );

      case 'SYSTEM':
         return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
               <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Terminal size={20} className="text-neon-green"/> {t('admin.log_stream')}
                  </h3>
                  <div className="flex-1 bg-[#0d1117] rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-1 border border-white/10">
                     {systemLogs.map((log, i) => (
                        <div key={i} className="text-slate-300 border-b border-white/5 pb-0.5 mb-0.5 last:border-0">
                           <span className="text-slate-500">{log.split(']')[0]}]</span> 
                           <span className={log.includes('ERROR') || log.includes('Rejected') ? 'text-neon-red' : log.includes('SYSTEM') ? 'text-neon-blue' : 'text-slate-300'}>
                              {log.split(']').slice(1).join(']')}
                           </span>
                        </div>
                     ))}
                     <div ref={logsEndRef} />
                  </div>
               </div>
               
               <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Activity size={20} className="text-purple-400"/> Services Status
                  </h3>
                  <div className="space-y-4">
                     {[
                        { name: 'Data Feed (Quote)', status: 'Operational', color: 'text-neon-green' },
                        { name: 'Trade Execution', status: 'Operational', color: 'text-neon-green' },
                        { name: 'AI Inference API', status: 'High Latency', color: 'text-yellow-400' },
                        { name: 'Docker Orchestrator', status: 'Operational', color: 'text-neon-green' },
                     ].map((service, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                           <span className="text-sm font-medium text-white">{service.name}</span>
                           <span className={`text-xs font-bold flex items-center gap-1.5 ${service.color}`}>
                              <div className={`w-2 h-2 rounded-full bg-current`}></div>
                              {service.status}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         );
      
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('nav.admin_dashboard')}</h1>
            <p className="text-slate-400">System overview and management console</p>
         </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex space-x-1 p-1 bg-black/20 rounded-xl border border-white/10 w-fit">
         <button 
           onClick={() => setActiveTab('OVERVIEW')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'OVERVIEW' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
         >
           {t('admin.tab_overview')}
         </button>
         <button 
           onClick={() => setActiveTab('USERS')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'USERS' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
         >
           {t('admin.tab_users')}
         </button>
         <button 
           onClick={() => setActiveTab('CONTENT')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CONTENT' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
         >
           {t('admin.tab_content')}
         </button>
         <button 
           onClick={() => setActiveTab('SYSTEM')} 
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'SYSTEM' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
         >
           {t('admin.tab_system')}
         </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {renderContent()}
      </div>
    </div>
  );
};
