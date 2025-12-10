
import React, { useState, useEffect } from 'react';
import { Activity, Mail, Lock, ArrowRight, Smartphone, QrCode, MessageSquare, RefreshCw, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: () => void;
  onNavigateRegister: () => void;
  onBack: () => void;
}

type LoginTab = 'ACCOUNT' | 'PHONE' | 'WECHAT';

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateRegister, onBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<LoginTab>('ACCOUNT');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(0);

  // Controlled inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');

  const refreshCaptcha = () => {
    setCaptchaCode(Math.random().toString(36).substring(2, 6).toUpperCase());
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  useEffect(() => {
    let interval: any;
    if (smsTimer > 0) {
      interval = setInterval(() => {
        setSmsTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [smsTimer]);

  const handleSendCode = () => {
    if (smsTimer === 0 && phone) {
      setSmsTimer(60);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (activeTab === 'ACCOUNT' && username === 'admin' && password === 'admin') {
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 500); 
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[#0B0E14]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,#0B0E14_100%)] -z-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      
      {/* Logo */}
      <div className="mb-8 cursor-pointer group" onClick={onBack}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-wider text-white">QUANT AI</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-[#151A23] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>

         {/* Tabs */}
         <div className="flex border-b border-white/10 bg-black/20">
            <button 
              onClick={() => setActiveTab('ACCOUNT')}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'ACCOUNT' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User size={16} />
              {t('auth.tab_account')}
              {activeTab === 'ACCOUNT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_8px_#0EA5E9]" />}
            </button>
            <button 
              onClick={() => setActiveTab('PHONE')}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'PHONE' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Smartphone size={16} />
              {t('auth.tab_phone')}
              {activeTab === 'PHONE' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_8px_#0EA5E9]" />}
            </button>
            <button 
              onClick={() => setActiveTab('WECHAT')}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${activeTab === 'WECHAT' ? 'text-neon-green font-bold' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <MessageSquare size={16} />
              {t('auth.tab_wechat')}
              {activeTab === 'WECHAT' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-green shadow-[0_0_8px_#10B981]" />}
            </button>
         </div>

         <div className="p-8">
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-white mb-2">{t('auth.login_title')}</h2>
             <p className="text-slate-400 text-sm">{t('auth.login_desc')}</p>
           </div>

           {activeTab === 'WECHAT' ? (
             <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <div className="w-48 h-48 bg-white p-2 rounded-xl relative group">
                   <div className="w-full h-full bg-slate-900 rounded border border-slate-200 flex items-center justify-center">
                     <QrCode size={120} className="text-slate-200" />
                   </div>
                   <div className="absolute top-0 left-0 w-full h-1 bg-neon-green/50 shadow-[0_0_10px_#10B981] animate-[scan_2s_ease-in-out_infinite]" style={{top: '10%'}}></div>
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                   <Smartphone size={16} /> {t('auth.scan_wechat')}
                </p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-5">
               {activeTab === 'ACCOUNT' && (
                 <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.email')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                        placeholder="Username / Email"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                 </>
               )}

               {activeTab === 'PHONE' && (
                 <>
                   <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.phone')}</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                        placeholder="+86 1XX XXXX XXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.sms_code')}</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MessageSquare className="absolute left-3 top-3.5 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          required
                          maxLength={6}
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value)}
                          className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                          placeholder="123456"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleSendCode}
                        disabled={smsTimer > 0 || !phone}
                        className={`px-4 rounded-lg text-xs font-medium min-w-[100px] border border-white/10 ${smsTimer > 0 || !phone ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20'}`}
                      >
                         {smsTimer > 0 ? `${smsTimer}s` : t('auth.get_code')}
                      </button>
                    </div>
                  </div>
                 </>
               )}

               {/* Captcha */}
               <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.captcha')}</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      required
                      maxLength={4}
                      className="flex-1 bg-[#0B0E14] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neon-blue/50 text-center tracking-widest uppercase font-mono"
                      placeholder="ABCD"
                    />
                    <div 
                      onClick={refreshCaptcha}
                      className="w-28 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 relative overflow-hidden group select-none"
                    >
                       <span className="font-mono text-xl font-bold text-white tracking-widest relative z-10 italic transform -rotate-2">{captchaCode}</span>
                       <RefreshCw size={12} className="absolute bottom-1 right-1 text-slate-500 opacity-50" />
                    </div>
                  </div>
               </div>

               <div className="flex items-center justify-between text-xs">
                 <label className="flex items-center space-x-2 cursor-pointer">
                   <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-neon-blue focus:ring-0" />
                   <span className="text-slate-400">{t('auth.remember')}</span>
                 </label>
                 <button type="button" className="text-neon-blue hover:text-white transition-colors">{t('auth.forgot')}</button>
               </div>

               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-neon-blue hover:bg-sky-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center space-x-2"
               >
                 {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     <span>{t('auth.signin')}</span>
                     <ArrowRight size={18} />
                   </>
                 )}
               </button>
             </form>
           )}

           <div className="mt-8 text-center border-t border-white/10 pt-6">
             <p className="text-slate-400 text-sm">
               {t('auth.no_account')} <button onClick={onNavigateRegister} className="text-neon-blue hover:text-white font-medium transition-colors">{t('auth.signup')}</button>
             </p>
           </div>
         </div>
      </div>
    </div>
  );
};
