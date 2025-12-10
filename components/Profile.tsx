
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Shield, Key, Bell, CreditCard, CheckCircle, RefreshCcw, Copy, MessageSquare, Mail, Settings, ChevronRight } from 'lucide-react';
import { ModelProvider } from '../types';

export const Profile: React.FC = () => {
  const { t } = useLanguage();
  const [weChatBound, setWeChatBound] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  // API Key State
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('DEEPSEEK');
  const [apiKeys, setApiKeys] = useState<Record<ModelProvider, string>>({
    GEMINI: '',
    DEEPSEEK: '',
    OPENAI: ''
  });

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }));
  };

  const handleSaveKey = () => {
    // In a real app, save to backend or secure storage
    alert(`${selectedProvider} key saved!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Header */}
       <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 p-1 relative">
             <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                <User size={40} className="text-slate-400" />
             </div>
             <div className="absolute bottom-0 right-0 w-6 h-6 bg-neon-green rounded-full border-4 border-[#0f172a]"></div>
          </div>
          <div className="text-center md:text-left flex-1">
             <h2 className="text-2xl font-bold text-white mb-1">Admin User</h2>
             <p className="text-slate-400 text-sm mb-3">admin@quantai.com</p>
             <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2 py-0.5 rounded bg-neon-blue/20 text-neon-blue text-[10px] font-bold border border-neon-blue/20">PRO PLAN</span>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-bold">UID: 882109</span>
             </div>
          </div>
          <button className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-white transition-colors flex items-center gap-2">
             <Settings size={14}/> Edit Profile
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard size={18} className="text-purple-400"/> {t('profile.plan')}
             </h3>
             <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={80}/></div>
                <div className="relative z-10">
                   <div className="text-xs text-purple-300 font-bold tracking-wider mb-1">PROFESSIONAL</div>
                   <div className="text-2xl font-bold text-white mb-4">$99 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                   <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle size={12} className="text-neon-green"/> Unlimited Strategy Generation</li>
                      <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle size={12} className="text-neon-green"/> Real-time Signal Bridge</li>
                      <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle size={12} className="text-neon-green"/> Level-2 Data Access</li>
                   </ul>
                   <button className="w-full py-2 bg-white text-black font-bold text-xs rounded hover:bg-slate-200 transition-colors">
                      {t('profile.btn_upgrade')}
                   </button>
                </div>
             </div>
          </div>

          {/* API Key Management */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
             <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Key size={18} className="text-neon-green"/> {t('profile.api_key')}
             </h3>
             <p className="text-xs text-slate-400 mb-6">
                {t('profile.api_desc')}
             </p>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('profile.provider')}</label>
                 <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                    {(['DEEPSEEK', 'GEMINI', 'OPENAI'] as ModelProvider[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProvider(p)}
                        className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${selectedProvider === p ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{selectedProvider} API KEY</label>
                 <div className="relative">
                    <input 
                      type="password" 
                      value={apiKeys[selectedProvider]}
                      onChange={handleKeyChange}
                      placeholder={t('profile.key_ph')}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-slate-200 text-sm focus:outline-none focus:border-neon-green/50"
                    />
                    <Key size={14} className="absolute right-3 top-3.5 text-slate-600" />
                 </div>
               </div>

               <button 
                 onClick={handleSaveKey}
                 className="w-full py-3 mt-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 <CheckCircle size={14} className="text-neon-green"/> {t('profile.save_key')}
               </button>
             </div>
          </div>
       </div>

       {/* Notifications & Bindings */}
       <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
             <Bell size={18} className="text-neon-blue"/> {t('profile.notifications')}
          </h3>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                      <MessageSquare size={20} />
                   </div>
                   <div>
                      <div className="font-bold text-white text-sm">{t('profile.wechat_status')}</div>
                      <div className="text-xs text-slate-400">{weChatBound ? t('profile.bound') : t('profile.not_bound')}</div>
                   </div>
                </div>
                {weChatBound ? (
                   <span className="text-xs text-neon-green font-bold flex items-center gap-1"><CheckCircle size={12}/> {t('profile.bound')}</span>
                ) : (
                   <button onClick={() => setWeChatBound(true)} className="px-4 py-1.5 bg-neon-green text-white text-xs font-bold rounded hover:bg-emerald-600 transition-colors">
                      {t('profile.btn_bind')}
                   </button>
                )}
             </div>

             <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <Mail size={20} />
                   </div>
                   <div>
                      <div className="font-bold text-white text-sm">{t('profile.email_alerts')}</div>
                      <div className="text-xs text-slate-400">{t('profile.email_desc')}</div>
                   </div>
                </div>
                
                <button 
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${emailAlerts ? 'bg-neon-green' : 'bg-slate-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${emailAlerts ? 'left-6' : 'left-1'}`} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
