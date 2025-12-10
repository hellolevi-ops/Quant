import React, { useState } from 'react';
import { Activity, Zap, Globe, Shield, ArrowRight, Code, Cpu, BarChart3, Lock, LogIn, UserPlus, Link as LinkIcon, Check, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onEnterApp: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onLoginClick, onRegisterClick }) => {
  const { t, language, setLanguage } = useLanguage();
  const [demoUrl, setDemoUrl] = useState('');
  const [demoStatus, setDemoStatus] = useState<'IDLE' | 'PARSING' | 'SUCCESS'>('IDLE');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoConnect = () => {
    if (!demoUrl) return;
    setDemoStatus('PARSING');
    setTimeout(() => {
        setDemoStatus('SUCCESS');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-200 selection:bg-neon-blue/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-panel border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
             <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-neon-blue to-purple-600 flex items-center justify-center shadow-lg shadow-neon-blue/20">
                  <Activity className="text-white w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-xl tracking-wider text-white glow-text block leading-none">QUANT AI</span>
                  <span className="text-[10px] text-slate-400 tracking-[0.2em] block leading-none mt-1">PROFESSIONAL</span>
                </div>
            </div>
            
            {/* Links */}
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
                <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">{t('landing.nav_engine')}</button>
                <button onClick={() => scrollToSection('bridge-section')} className="hover:text-white transition-colors">{t('landing.nav_bridge')}</button>
                <button onClick={() => scrollToSection('data')} className="hover:text-white transition-colors">{t('landing.nav_data')}</button>
            </div>

            {/* CTA & Lang */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="text-xs font-mono text-slate-500 hover:text-white uppercase"
              >
                {language === 'en' ? 'CN' : 'EN'}
              </button>
              
              <div className="h-6 w-px bg-white/10 mx-2"></div>

              <button 
                onClick={onLoginClick}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t('landing.login')}
              </button>

              <button 
                  onClick={onRegisterClick}
                  className="px-5 py-2 bg-white text-black hover:bg-slate-200 rounded-full text-sm font-bold transition-all flex items-center gap-2"
              >
                  <span>{t('landing.signup')}</span>
                  <ArrowRight size={14} />
              </button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 relative overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-green mb-8 backdrop-blur-sm animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_#10B981]" />
                {t('landing.status')}
             </div>

             <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                {t('landing.hero_title_1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-neon-red animate-gradient-x">
                  {t('landing.hero_title_2')}
                </span>
             </h1>

             <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                {t('landing.hero_desc')}
             </p>

             <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                <button 
                    onClick={onRegisterClick}
                    className="px-8 py-4 bg-neon-blue hover:bg-sky-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] transition-all flex items-center gap-3 text-lg group"
                >
                    <Zap size={20} fill="currentColor" className="group-hover:text-yellow-300 transition-colors" />
                    {t('landing.btn_start')}
                </button>
                <button 
                    onClick={() => scrollToSection('bridge-section')}
                    className="px-8 py-4 glass-panel border border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-medium rounded-xl transition-all flex items-center gap-3 text-lg backdrop-blur-md"
                >
                    <Globe size={20} className="text-slate-400" />
                    {t('landing.nav_bridge')}
                </button>
             </div>

             {/* UI Mockup / Visual Hint */}
             <div className="mt-20 relative mx-auto max-w-5xl rounded-t-2xl border border-white/10 bg-[#020617]/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]/90 z-10 pointer-events-none" />
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 h-4 w-64 rounded-full bg-white/10" />
                </div>
                <div className="p-8 grid grid-cols-12 gap-8 font-mono text-xs text-left opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="col-span-4 space-y-2 text-slate-500">
                      <div className="text-purple-400"># AI Generated Strategy</div>
                      <div>class AlphaStrategy(bt.Strategy):</div>
                      <div className="pl-4">params = (('period', 14),)</div>
                      <div className="pl-4">def next(self):</div>
                      <div className="pl-8 text-neon-blue">if self.rsi &lt; 30:</div>
                      <div className="pl-12 text-neon-green">self.buy()</div>
                   </div>
                   <div className="col-span-8 h-32 flex items-end gap-1">
                      {Array.from({length: 40}).map((_,i) => (
                        <div key={i} className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/60 transition-colors rounded-t-sm" style={{height: `${Math.random() * 100}%`}} />
                      ))}
                   </div>
                </div>
             </div>
        </div>
      </section>

      {/* Core Features Grid (Info Only) */}
      <section id="features" className="py-24 px-6 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('landing.core_engines')}</h2>
              <p className="text-slate-400">{t('landing.core_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-blue/40 transition-all duration-300 group hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-neon-blue/20">
                        <Cpu className="text-neon-blue" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">{t('landing.feat_gen_title')}</h3>
                    <p className="text-slate-400 leading-relaxed">{t('landing.feat_gen_desc')}</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-purple-500/20">
                        <Globe className="text-purple-400" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{t('landing.feat_bridge_title')}</h3>
                    <p className="text-slate-400 leading-relaxed">{t('landing.feat_bridge_desc')}</p>
                </div>

                 <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon-green/40 transition-all duration-300 group hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-neon-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-neon-green/20">
                        <Shield className="text-neon-green" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">{t('landing.feat_risk_title')}</h3>
                    <p className="text-slate-400 leading-relaxed">{t('landing.feat_risk_desc')}</p>
                </div>
            </div>
        </div>
      </section>

      {/* Signal Bridge Interactive Demo Section (NEW/UPDATED) */}
      <section id="bridge-section" className="py-24 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">
                  <Globe size={12} /> GLOBAL SIGNAL SYNC
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  {t('landing.feat_bridge_title')}
               </h2>
               <p className="text-lg text-slate-400 leading-relaxed">
                  {t('landing.feat_bridge_desc')} <br/>
                  Instantly parse position data, calculate historical ROI, and begin auto-trading in your QMT terminal.
               </p>
               
               <div className="flex flex-col gap-4 max-w-md">
                 <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">1</div>
                    <span>Copy URL from Snowball/JoinQuant</span>
                 </div>
                 <div className="w-px h-6 bg-white/10 ml-4"></div>
                 <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">2</div>
                    <span>Paste into Signal Bridge</span>
                 </div>
                 <div className="w-px h-6 bg-white/10 ml-4"></div>
                 <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">3</div>
                    <span>Start Auto-Execution</span>
                 </div>
               </div>

               <button onClick={onRegisterClick} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
                 {t('landing.btn_copy')} <ArrowRight size={16} />
               </button>
            </div>

            {/* Interactive Demo Box */}
            <div className="flex-1 w-full max-w-lg">
               <div className="glass-panel p-6 rounded-2xl border border-white/10 relative shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>SOURCE URL</span>
                        <span className="text-neon-green">SECURE CONNECTION</span>
                     </div>
                     <div className="relative">
                        <input 
                           type="text" 
                           value={demoUrl}
                           onChange={(e) => setDemoUrl(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                           placeholder="https://xueqiu.com/P/ZH000192"
                        />
                        <LinkIcon className="absolute left-4 top-4 text-slate-500" size={18} />
                     </div>
                     
                     <button 
                        onClick={handleDemoConnect}
                        className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                     >
                        {demoStatus === 'IDLE' ? (
                           <>
                             <Search size={16} /> Parse Strategy
                           </>
                        ) : demoStatus === 'PARSING' ? (
                           <>
                             <Activity className="animate-spin" size={16} /> Analyzing...
                           </>
                        ) : (
                           <>
                             <Check size={16} /> Signal Acquired
                           </>
                        )}
                     </button>

                     {/* Mock Result */}
                     {demoStatus === 'SUCCESS' && (
                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
                           <div className="flex justify-between items-start mb-3">
                              <div>
                                 <h4 className="text-white font-medium text-sm">Quant-Growth-V2</h4>
                                 <p className="text-[10px] text-slate-500">By: TopTrader01</p>
                              </div>
                              <div className="text-right">
                                 <div className="text-neon-green font-mono font-bold">+142.5%</div>
                                 <div className="text-[10px] text-slate-500">Total Return</div>
                              </div>
                           </div>
                           <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-neon-green w-[75%]"></div>
                           </div>
                           <p className="text-[10px] text-slate-400 mt-2 text-center">
                              Ready to mirror. Please <span className="text-white underline cursor-pointer" onClick={onLoginClick}>Log In</span> to continue.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Data Section */}
      <section id="data" className="py-20 px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl font-bold text-white">{t('landing.data_title')}</h2>
               <p className="text-slate-400 text-lg">
                 {t('landing.data_desc')}
               </p>
               <ul className="space-y-4">
                  {[
                    'A-Shares / HK / US Stocks',
                    'Crypto (Binance/OKX)',
                    'Point-in-Time Financials',
                    'Level 2 Order Book'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                      {item}
                    </li>
                  ))}
               </ul>
               <button onClick={onRegisterClick} className="mt-4 text-neon-blue font-medium hover:text-white transition-colors flex items-center gap-2">
                 {t('landing.data_btn')} <ArrowRight size={16}/>
               </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <BarChart3 className="text-slate-500 mb-4" size={32} />
                  <div className="text-2xl font-mono font-bold text-white">42TB+</div>
                  <div className="text-xs text-slate-500">Historical Data</div>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 translate-y-8">
                  <Zap className="text-yellow-500 mb-4" size={32} />
                  <div className="text-2xl font-mono font-bold text-white">15ms</div>
                  <div className="text-xs text-slate-500">Execution Latency</div>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Lock className="text-neon-red mb-4" size={32} />
                  <div className="text-2xl font-mono font-bold text-white">AES-256</div>
                  <div className="text-xs text-slate-500">Strategy Encryption</div>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 translate-y-8">
                  <Globe className="text-blue-500 mb-4" size={32} />
                  <div className="text-2xl font-mono font-bold text-white">30+</div>
                  <div className="text-xs text-slate-500">Exchanges Supported</div>
               </div>
            </div>
         </div>
      </section>

       {/* Footer */}
       <footer className="mt-auto py-12 px-6 border-t border-white/5 bg-[#020617]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                 <div className="w-6 h-6 rounded bg-gradient-to-tr from-neon-blue to-purple-600 flex items-center justify-center">
                    <Activity className="text-white w-3 h-3" />
                 </div>
                 <span className="font-semibold text-slate-300 tracking-wide">QUANT AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-neon-blue transition-colors">Privacy Policy</a>
                <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-neon-blue transition-colors">Terms of Service</a>
                <a href="#api" onClick={(e) => e.preventDefault()} className="hover:text-neon-blue transition-colors">API Documentation</a>
                <a href="#status" onClick={(e) => e.preventDefault()} className="hover:text-neon-blue transition-colors">Status</a>
            </div>
            <div className="mt-4 md:mt-0 text-xs">
                {t('landing.footer_rights')}
            </div>
         </div>
       </footer>
    </div>
  );
};