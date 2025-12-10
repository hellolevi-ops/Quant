
import React, { useState, useEffect } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, ShieldCheck, Smartphone, MessageSquare, RefreshCw, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegisterProps {
  onRegister: () => void;
  onNavigateLogin: () => void;
  onBack: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateLogin, onBack }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showWeChatModal, setShowWeChatModal] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(0);

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
    if (smsTimer === 0) {
      setSmsTimer(60);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowWeChatModal(true); 
    }, 1500);
  };

  const handleWeChatBind = () => {
    setTimeout(() => {
      onRegister(); 
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-[#0B0E14]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,#0B0E14_100%)] -z-20"></div>
      
      {/* Logo */}
      <div className="mb-8 cursor-pointer group" onClick={onBack}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-wider text-white">QUANT AI</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-[#151A23] p-8 rounded-2xl border border-white/10 shadow-2xl relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50"></div>

         <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-white mb-2">{t('auth.register_title')}</h2>
           <p className="text-slate-400 text-sm">{t('auth.register_desc')}</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Full Name */}
           <div className="space-y-1">
             <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.fullname')}</label>
             <div className="relative">
               <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
               <input 
                 type="text" 
                 required
                 className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                 placeholder="Real Name"
               />
             </div>
           </div>

           {/* Phone Number */}
           <div className="space-y-1">
             <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.phone')}</label>
             <div className="relative">
               <Smartphone className="absolute left-3 top-3.5 text-slate-500" size={18} />
               <input 
                 type="tel" 
                 required
                 className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                 placeholder="+86 1XX XXXX XXXX"
               />
             </div>
           </div>

            {/* SMS Code */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.sms_code')}</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MessageSquare className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                    placeholder="123456"
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleSendCode}
                  disabled={smsTimer > 0}
                  className={`px-4 rounded-lg text-xs font-medium min-w-[100px] border border-white/10 ${smsTimer > 0 ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20'}`}
                >
                    {smsTimer > 0 ? `${smsTimer}s` : t('auth.get_code')}
                </button>
              </div>
            </div>

           {/* Password */}
           <div className="space-y-1">
             <label className="text-xs font-medium text-slate-400 ml-1">{t('auth.password')}</label>
             <div className="relative">
               <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
               <input 
                 type="password" 
                 required
                 className="w-full bg-[#0B0E14] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50"
                 placeholder="••••••••"
               />
             </div>
           </div>

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

           <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" required className="mt-1 rounded bg-slate-800 border-slate-700 text-neon-blue focus:ring-0 cursor-pointer" />
              <span className="text-xs text-slate-400 leading-relaxed">{t('auth.terms')}</span>
           </div>

           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 flex items-center justify-center space-x-2"
           >
             {isLoading ? (
               <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
             ) : (
               <>
                 <span>{t('auth.signup')}</span>
                 <ArrowRight size={18} />
               </>
             )}
           </button>
         </form>

         <div className="mt-8 text-center">
           <p className="text-slate-400 text-sm">
             {t('auth.have_account')} <button onClick={onNavigateLogin} className="text-neon-blue hover:text-white font-medium transition-colors">{t('auth.signin')}</button>
           </p>
         </div>
      </div>

      {/* Bind WeChat Modal */}
      {showWeChatModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#151A23] p-8 rounded-2xl border border-white/20 text-center relative shadow-2xl">
             <button onClick={onRegister} className="absolute top-4 right-4 text-slate-500 hover:text-white">
               <X size={20} />
             </button>
             
             <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-neon-green" size={32} />
             </div>
             
             <h3 className="text-xl font-bold text-white mb-2">{t('auth.bind_wechat_title')}</h3>
             <p className="text-slate-400 text-sm mb-8">{t('auth.bind_wechat_desc')}</p>
             
             <div className="space-y-3">
               <button 
                  onClick={handleWeChatBind}
                  className="w-full bg-neon-green hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
               >
                 {t('auth.bind')}
               </button>
               <button 
                  onClick={onRegister}
                  className="w-full py-3 text-slate-500 hover:text-white text-sm transition-colors"
               >
                 {t('auth.skip')}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
