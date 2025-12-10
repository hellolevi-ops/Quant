
import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Code, Cpu, RefreshCw, Calendar } from 'lucide-react';
import { generateStrategy } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock Backtest Data
const mockBacktestData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 10000 * (1 + Math.sin(i / 5) * 0.1 + (i / 50))
}));

export const AIWorkshop: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any[] | null>(null);
  
  // Date State
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const { t } = useLanguage();
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSteps([]); 

    const response = await generateStrategy(input, history);

    setIsTyping(false);
    
    if (response.steps) setSteps(response.steps);
    if (response.code) setGeneratedCode(response.code);

    const aiMsg: ChatMessage = { 
      role: 'model', 
      content: response.text,
      steps: response.steps 
    };
    setHistory(prev => [...prev, aiMsg]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  const runBacktest = () => {
    setIsBacktesting(true);
    setTimeout(() => {
      setBacktestResult(mockBacktestData);
      setIsBacktesting(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left: Chat Interface */}
      <div className="lg:col-span-4 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
          <span className="font-semibold text-slate-200 flex items-center gap-2">
            <Cpu size={16} className="text-neon-blue"/> {t('work.title')}
          </span>
          <select className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none">
            <option>Gemini 2.5 Flash</option>
            <option>DeepSeek R1</option>
            <option>GPT-4o</option>
          </select>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 && (
             <div className="text-center mt-10 text-slate-500 text-sm">
               <p>{t('work.empty_state')}</p>
               <p className="mt-2 text-xs opacity-50">{t('work.empty_hint')}</p>
             </div>
          )}
          
          {history.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] rounded-xl p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-neon-blue/20 text-white border border-neon-blue/30' 
                  : 'bg-white/5 text-slate-300 border border-white/10'
              }`}>
                {msg.content}
              </div>
              
              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-2 ml-1 space-y-1">
                  {msg.steps.map((step, idx) => (
                     <div key={idx} className="flex items-center space-x-2 text-[10px] text-slate-500 animate-pulse">
                        <div className="w-1 h-1 bg-neon-green rounded-full"></div>
                        <span>{step}</span>
                     </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
             <div className="flex space-x-1 pl-2">
               <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('work.input_placeholder')}
              className="w-full bg-black/40 text-slate-200 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-neon-blue border border-white/5"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-1.5 bg-neon-blue rounded-lg text-white hover:bg-sky-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle: Code Editor */}
      <div className="lg:col-span-5 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
           <span className="font-semibold text-slate-200 flex items-center gap-2">
            <Code size={16} className="text-purple-400"/> {t('work.code_title')}
          </span>
          <button className="text-xs flex items-center space-x-1 px-2 py-1 rounded hover:bg-white/10 text-slate-400">
             <RefreshCw size={12}/> <span>{t('work.btn_format')}</span>
          </button>
        </div>
        <div className="flex-1 bg-[#0d1117] p-4 overflow-auto relative group">
          <textarea
            value={generatedCode}
            onChange={(e) => setGeneratedCode(e.target.value)}
            className="w-full h-full bg-transparent text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            placeholder={t('work.code_placeholder')}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Right: Backtest */}
      <div className="lg:col-span-3 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <span className="font-semibold text-slate-200">{t('work.backtest_title')}</span>
          <Calendar size={14} className="text-slate-500"/>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          {!backtestResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                <Play size={24} className="ml-1" />
              </div>
              <p className="text-xs">{t('work.ready_test')}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-4">
               <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockBacktestData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                      itemStyle={{ color: '#10B981' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-white/5 rounded-lg">
                   <p className="text-[10px] text-slate-500 uppercase">{t('work.sharpe')}</p>
                   <p className="text-lg font-mono text-neon-green">2.45</p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-lg">
                   <p className="text-[10px] text-slate-500 uppercase">{t('work.max_dd')}</p>
                   <p className="text-lg font-mono text-neon-red">-12.3%</p>
                 </div>
               </div>
            </div>
          )}
          
          <div className="mt-4 space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="space-y-1">
                <label className="text-xs text-slate-400">{t('work.date_start')}</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-blue/50" 
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-400">{t('work.date_end')}</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-blue/50" 
                />
            </div>

            <button 
              onClick={runBacktest}
              disabled={!generatedCode || isBacktesting}
              className={`w-full py-3 mt-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                !generatedCode 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : isBacktesting 
                    ? 'bg-neon-blue/50 text-white cursor-wait' 
                    : 'bg-neon-blue text-white hover:bg-sky-500 shadow-lg shadow-neon-blue/20'
              }`}
            >
              {isBacktesting ? (
                <>
                  <RefreshCw className="animate-spin" size={16}/>
                  <span>{t('work.btn_running')}</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor"/>
                  <span>{t('work.btn_run')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
