
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { User, Shield, Key, Bell, CreditCard, CheckCircle, RefreshCcw, Copy, MessageSquare, Mail, Settings, ChevronRight, Edit3, X, Save, Lock, Zap, Award, Coins, QrCode } from 'lucide-react';
import { ModelProvider, UserTier, PointPackage, PaymentMethod } from '../types';

const POINT_PACKAGES: PointPackage[] = [
  { id: 'p1', points: 100, price: 9.9 },
  { id: 'p2', points: 500, price: 45, bonus: 50 },
  { id: 'p3', points: 1000, price: 88, bonus: 120 },
  { id: 'p4', points: 5000, price: 399, bonus: 800 },
];

export const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { 
    userTier, setUserTier, 
    pointsBalance, setPointsBalance, 
    dailyClonesUsed, 
    userInfo, setUserInfo, 
    weChatBound, setWeChatBound 
  } = useUser();

  const [emailAlerts, setEmailAlerts] = useState(true);
  
  // Payment Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [payItem, setPayItem] = useState<{name: string, price: number} | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('WECHAT');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Profile Editing State
  const [isEditing, setIsEditing] = useState(false);

  // Password Modal State
  const [showPwdModal, setShowPwdModal] = useState(false);

  // API Key State
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('DEEPSEEK');
  const [apiKeys, setApiKeys] = useState<Record<ModelProvider, string>>({
    GEMINI: '',
    DEEPSEEK: '',
    OPENAI: '',
    ANTHROPIC: '',
    MISTRAL: ''
  });

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }));
  };

  const handleSaveKey = () => {
    alert(`${selectedProvider} key saved!`);
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    // Mock save
  };

  const openPayment = (item: {name: string, price: number}) => {
     setPayItem(item);
     setShowPayModal(true);
     setIsProcessingPay(false);
  };

  const handlePaymentSuccess = () => {
    setIsProcessingPay(true);
    setTimeout(() => {
       setIsProcessingPay(false);
       setShowPayModal(false);
       
       // Update state based on purchase
       if (payItem?.name.includes('Diamond')) {
          setUserTier(UserTier.DIAMOND);
       } else if (payItem?.name.includes('Gold')) {
          setUserTier(UserTier.GOLD);
       } else if (payItem?.name.includes('Points')) {
          const pkg = POINT_PACKAGES.find(p => p.price === payItem.price);
          if (pkg) {
             setPointsBalance(prev => prev + pkg.points + (pkg.bonus || 0));
          }
       }
       alert("Payment Successful!");
    }, 1500);
  };

  const getTierColor = (tier: UserTier) => {
    switch(tier) {
      case UserTier.DIAMOND: return 'text-purple-400 border-purple-400 bg-purple-500/10';
      case UserTier.GOLD: return 'text-yellow-400 border-yellow-400 bg-yellow-500/10';
      default: return 'text-slate-400 border-slate-400 bg-slate-500/10';
    }
  };

  const getCloneLimit = () => {
     if (userTier === UserTier.DIAMOND) return 20;
     if (userTier === UserTier.GOLD) return 5;
     return 0;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative pb-20">
       {/* Header / Personal Info */}
       <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 p-1 relative z-10">
             <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                <User size={40} className="text-slate-400" />
             </div>
             <div className="absolute bottom-0 right-0 w-6 h-6 bg-neon-green rounded-full border-4 border-[#0f172a]"></div>
          </div>
          
          <div className="flex-1 w-full text-center md:text-left space-y-2 z-10">
             {isEditing ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] uppercase text-slate-500 font-bold">{t('auth.fullname')}</label>
                     <input 
                       value={userInfo.name} 
                       onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                       className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] uppercase text-slate-500 font-bold">{t('auth.email')}</label>
                     <input 
                       value={userInfo.email} 
                       onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                       className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] uppercase text-slate-500 font-bold">{t('auth.phone')}</label>
                     <input 
                       value={userInfo.phone} 
                       onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                       className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm"
                     />
                  </div>
               </div>
             ) : (
               <>
                 <h2 className="text-2xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-3">
                    {userInfo.name}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTierColor(userTier)}`}>
                       {t(`mem.tier_${userTier.toLowerCase()}`)}
                    </span>
                 </h2>
                 <p className="text-slate-400 text-sm">{userInfo.email}</p>
                 <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                    <span className="text-xs text-slate-500">UID: {userInfo.id}</span>
                 </div>
               </>
             )}
          </div>

          <div className="flex flex-col gap-2 min-w-[140px] z-10">
             {isEditing ? (
               <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors">
                     {t('profile.cancel_btn')}
                  </button>
                  <button onClick={handleProfileSave} className="flex-1 px-3 py-2 bg-neon-blue hover:bg-sky-500 rounded-lg text-xs text-white transition-colors font-bold">
                     {t('profile.save_btn')}
                  </button>
               </div>
             ) : (
               <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-white transition-colors flex items-center justify-center gap-2">
                  <Edit3 size={14}/> {t('profile.edit_btn')}
               </button>
             )}
             
             <button onClick={() => setShowPwdModal(true)} className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2">
                <Lock size={14}/> {t('profile.change_pwd')}
             </button>
          </div>
          
          {/* Background Decor */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Award size={120} />
          </div>
       </div>

       {/* Middle Section: Assets & Plan (2 Col) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Membership Tier Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Shield size={100} />
             </div>

             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Award size={18} className="text-purple-400"/> {t('profile.plan')}
             </h3>
             
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <div className="text-xs text-slate-400 font-bold tracking-wider mb-1 uppercase">Current Level</div>
                      <div className={`text-2xl font-bold ${
                         userTier === UserTier.DIAMOND ? 'text-purple-400' :
                         userTier === UserTier.GOLD ? 'text-yellow-400' : 'text-slate-200'
                      }`}>
                         {t(`mem.tier_${userTier.toLowerCase()}`)}
                      </div>
                   </div>
                   {userTier !== UserTier.FREE && (
                     <div className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded font-bold">Active</div>
                   )}
                </div>

                {/* Benefits List */}
                <ul className="space-y-3 mb-6 flex-1">
                   <li className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle size={16} className={userTier !== UserTier.FREE ? 'text-neon-green' : 'text-slate-600'}/>
                      {userTier === UserTier.DIAMOND ? t('mem.ben_clone_20') : t('mem.ben_clone_5')}
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle size={16} className={userTier !== UserTier.FREE ? 'text-neon-green' : 'text-slate-600'}/>
                      {userTier === UserTier.FREE ? t('mem.ben_ai_basic') : t('mem.ben_ai_adv')}
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle size={16} className={userTier === UserTier.DIAMOND ? 'text-neon-green' : 'text-slate-600'}/>
                      {t('mem.ben_support')}
                   </li>
                </ul>

                {/* Usage Stats */}
                <div className="mb-6">
                   <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>{t('mem.daily_limit')}</span>
                      <span>{dailyClonesUsed} / {getCloneLimit()}</span>
                   </div>
                   <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${userTier === UserTier.DIAMOND ? 'bg-purple-500' : 'bg-yellow-500'}`} 
                        style={{width: `${(dailyClonesUsed / (getCloneLimit() || 1)) * 100}%`}}
                      ></div>
                   </div>
                </div>

                {/* Upgrade Buttons */}
                <div className="space-y-3 mt-auto">
                   {userTier !== UserTier.DIAMOND && (
                      <button 
                         onClick={() => openPayment({ name: 'Diamond Membership', price: 199 })}
                         className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex justify-between px-4 items-center"
                      >
                         <span>{t('mem.btn_upgrade_diamond')}</span>
                         <span>¥199{t('mem.price_mo')}</span>
                      </button>
                   )}
                   {userTier === UserTier.FREE && (
                      <button 
                         onClick={() => openPayment({ name: 'Gold Membership', price: 99 })}
                         className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-sm rounded-lg transition-all flex justify-between px-4 items-center"
                      >
                         <span>{t('mem.btn_upgrade_gold')}</span>
                         <span>¥99{t('mem.price_mo')}</span>
                      </button>
                   )}
                </div>
             </div>
          </div>

          {/* Points Shop */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins size={18} className="text-yellow-400"/> {t('mem.pts_shop')}
               </h3>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold">
                  <Coins size={14} fill="currentColor" /> {pointsBalance}
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 flex-1">
                {POINT_PACKAGES.map((pkg) => (
                   <div 
                      key={pkg.id} 
                      onClick={() => openPayment({ name: `${pkg.points} Points Pack`, price: pkg.price })}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 rounded-xl p-4 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
                   >
                      {pkg.bonus && (
                         <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                            +{pkg.bonus}
                         </div>
                      )}
                      <div className="text-yellow-400 font-bold text-xl group-hover:scale-110 transition-transform origin-left mb-2">
                         {pkg.points} <span className="text-xs text-yellow-500/70">pts</span>
                      </div>
                      <div className="text-white font-medium text-sm flex justify-between items-end">
                         <span>¥{pkg.price}</span>
                         <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">+</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Bottom Section: Settings & Config (2 Col) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
                 <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as ModelProvider)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-slate-200 text-sm focus:outline-none focus:border-neon-green/50 appearance-none"
                 >
                    <option value="DEEPSEEK">DeepSeek</option>
                    <option value="GEMINI">Google Gemini</option>
                    <option value="OPENAI">OpenAI (GPT-4)</option>
                    <option value="ANTHROPIC">Anthropic (Claude)</option>
                    <option value="MISTRAL">Mistral AI</option>
                 </select>
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

          {/* Notifications & Bindings */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell size={18} className="text-neon-blue"/> {t('profile.notifications')}
             </h3>
             
             <div className="space-y-4 flex-1">
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

       {/* Payment Modal */}
       {showPayModal && payItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
             <div className="w-full max-w-sm glass-panel p-8 rounded-2xl border border-white/20 relative shadow-2xl animate-in slide-in-from-bottom-8 mx-4">
                <button onClick={() => setShowPayModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                
                <h3 className="text-xl font-bold text-white mb-2 text-center">{t('mem.pay_title')}</h3>
                <p className="text-slate-400 text-sm text-center mb-6">{t('mem.pay_desc')}</p>
                
                {/* Order Info */}
                <div className="bg-white/5 rounded-lg p-4 mb-6 flex justify-between items-center">
                   <span className="text-sm font-bold text-slate-300">{payItem.name}</span>
                   <span className="text-lg font-mono font-bold text-neon-green">¥{payItem.price}</span>
                </div>

                {/* Method Select */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <button 
                      onClick={() => setPayMethod('WECHAT')}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                         payMethod === 'WECHAT' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                   >
                      <MessageSquare size={14}/> {t('mem.pay_wechat')}
                   </button>
                   <button 
                      onClick={() => setPayMethod('ALIPAY')}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                         payMethod === 'ALIPAY' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                   >
                      <CreditCard size={14}/> {t('mem.pay_alipay')}
                   </button>
                </div>

                {/* Mock QR */}
                <div className="flex justify-center mb-6 relative group cursor-pointer">
                   <div className="p-2 bg-white rounded-xl">
                      <QrCode size={150} className="text-black" />
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`w-8 h-8 rounded p-1 shadow-lg ${payMethod === 'WECHAT' ? 'bg-green-500' : 'bg-blue-500'}`}>
                         {payMethod === 'WECHAT' ? <MessageSquare className="text-white w-full h-full"/> : <CreditCard className="text-white w-full h-full"/>}
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handlePaymentSuccess}
                  disabled={isProcessingPay}
                  className="w-full py-3 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex justify-center items-center gap-2"
                >
                  {isProcessingPay ? <RefreshCcw className="animate-spin" size={16}/> : <CheckCircle size={16}/>}
                  {t('mem.pay_confirm')}
                </button>
             </div>
          </div>
       )}

       {/* Change Password Modal */}
       {showPwdModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 rounded-2xl">
             <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/20 shadow-2xl relative mx-4">
                <button onClick={() => setShowPwdModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                <h3 className="text-xl font-bold text-white mb-6">{t('profile.change_pwd')}</h3>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">{t('profile.pwd_current')}</label>
                      <input type="password" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue/50"/>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">{t('profile.pwd_new')}</label>
                      <input type="password" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue/50"/>
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">{t('profile.pwd_confirm')}</label>
                      <input type="password" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue/50"/>
                   </div>
                   <button 
                     onClick={() => setShowPwdModal(false)}
                     className="w-full py-3 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-lg transition-colors mt-2"
                   >
                      {t('profile.save_btn')}
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};
