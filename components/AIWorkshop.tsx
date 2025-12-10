

import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Code, Cpu, RefreshCw, Calendar, Save, Check, BookOpen, Layers } from 'lucide-react';
import { generateStrategy } from '../services/geminiService';
import { ChatMessage, StrategyTemplate } from '../types';
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

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'ma_cross',
    nameKey: 'work.tpl_ma_name',
    descKey: 'work.tpl_ma_desc',
    prompt: 'Create a Dual Moving Average Crossover strategy. Buy when SMA(5) crosses above SMA(20), Sell when SMA(5) crosses below SMA(20).',
    tags: ['Trend', 'Beginner'],
    code: `import backtrader as bt

class DoubleMAStrategy(bt.Strategy):
    params = (('fast_period', 5), ('slow_period', 20),)

    def __init__(self):
        self.fast_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.fast_period)
        self.slow_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)

    def next(self):
        if not self.position:
            if self.crossover > 0:  # Fast MA crosses above Slow MA
                self.buy()
        elif self.crossover < 0:  # Fast MA crosses below Slow MA
            self.close()`
  },
  {
    id: 'rsi_reversion',
    nameKey: 'work.tpl_rsi_name',
    descKey: 'work.tpl_rsi_desc',
    prompt: 'Build a Mean Reversion strategy using RSI. Buy if RSI < 30, Sell if RSI > 70.',
    tags: ['Mean Reversion', 'Classic'],
    code: `import backtrader as bt

class RSIStrategy(bt.Strategy):
    params = (('period', 14), ('upper', 70), ('lower', 30),)

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data.close, period=self.params.period)

    def next(self):
        if not self.position:
            if self.rsi < self.params.lower:
                self.buy()
        else:
            if self.rsi > self.params.upper:
                self.sell()`
  },
  {
    id: 'grid_trading',
    nameKey: 'work.tpl_grid_name',
    descKey: 'work.tpl_grid_desc',
    prompt: 'Generate a Grid Trading bot for crypto. Place buy orders every 1% drop and sell orders every 1% rise.',
    tags: ['Crypto', 'Volatility'],
    code: `import backtrader as bt

class GridStrategy(bt.Strategy):
    params = (('grid_step', 0.01), ('grid_levels', 5),)

    def __init__(self):
        self.base_price = None
        self.orders = []

    def next(self):
        if self.base_price is None:
            self.base_price = self.data.close[0]
            # Setup initial grid
            for i in range(1, self.params.grid_levels + 1):
                price = self.base_price * (1 - i * self.params.grid_step)
                self.buy(exectype=bt.Order.Limit, price=price)
        
        # Simple logic: if price moves up significantly, re-center grid
        if self.data.close[0] > self.base_price * (1 + self.params.grid_step):
             self.sell() # Take profit
             self.base_price = self.data.close[0] # Reset center`
  },
    {
    id: 'small_cap',
    nameKey: 'work.tpl_smallcap_name',
    descKey: 'work.tpl_smallcap_desc',
    prompt: 'Create a Small Cap rotation strategy. Rank stocks by market cap, buy the bottom 10%, rebalance monthly.',
    tags: ['Factor', 'Long-Term'],
    code: `import backtrader as bt

class SmallCapRotation(bt.Strategy):
    params = (('rebalance_days', 20), ('top_n', 10),)

    def __init__(self):
        self.timer = 0

    def next(self):
        self.timer += 1
        if self.timer % self.params.rebalance_days != 0:
            return
        
        # Mock logic for factor sorting (requires data feed with market_cap)
        # stocks = sorted(self.datas, key=lambda d: d.market_cap)
        # target_stocks = stocks[:self.params.top_n]
        
        # for d in target_stocks:
        #    self.order_target_percent(d, target=0.1)
        pass`
  }
];

interface AIWorkshopProps {
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export const AIWorkshop: React.FC<AIWorkshopProps> = ({ initialPrompt, onClearPrompt }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any[] | null>(null);
  
  // Strategy Meta
  const [strategyName, setStrategyName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Date State
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const { t } = useLanguage();
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Handle Initial Prompt (Auto-Run)
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      // We want to auto-send, but React state updates are async. 
      // We'll use a small timeout to trigger the send after input is set, or just call logic directly.
      // Calling logic directly is cleaner but needs 'input' state which isn't updated yet in this scope.
      // Passing initialPrompt to handleSend is better.
      handleSend(initialPrompt);
      if (onClearPrompt) onClearPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setSteps([]); 

    const response = await generateStrategy(textToSend, history);

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

  const loadTemplate = (template: StrategyTemplate) => {
    // Simulate interaction
    const userMsg: ChatMessage = { role: 'user', content: template.prompt };
    const aiMsg: ChatMessage = { 
      role: 'model', 
      content: t(template.descKey),
      steps: ['Analyze Requirements', 'Select Indicators', 'Generate Backtrader Code'] 
    };
    
    setHistory(prev => [...prev, userMsg, aiMsg]);
    setGeneratedCode(template.code);
    setStrategyName(t(template.nameKey));
    setSteps(aiMsg.steps || []);
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  const handleSave = () => {
    if (!strategyName || !generatedCode) {
      alert(t('work.save_error'));
      return;
    }
    // Simulate save logic
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Helper to generate line numbers
  const lineNumbers = generatedCode.split('\n').map((_, i) => i + 1).join('\n');

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
        
        {/* Strategy Templates Carousel */}
        <div className="p-3 bg-white/5 border-b border-white/5">
           <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase">
              <Layers size={12} /> {t('work.templates')}
           </div>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {STRATEGY_TEMPLATES.map(tpl => (
                 <div 
                   key={tpl.id}
                   onClick={() => loadTemplate(tpl)}
                   className="flex-shrink-0 w-40 p-2 bg-black/20 rounded-lg border border-white/10 hover:border-neon-blue/40 hover:bg-white/5 cursor-pointer transition-all group"
                 >
                    <div className="text-xs font-bold text-slate-300 group-hover:text-neon-blue truncate">{t(tpl.nameKey)}</div>
                    <div className="flex gap-1 mt-1">
                       {tpl.tags.map(tag => (
                          <span key={tag} className="text-[9px] px-1 rounded bg-white/5 text-slate-500">{tag}</span>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 && (
             <div className="text-center mt-4 text-slate-500 text-sm">
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
              onClick={() => handleSend()}
              className="absolute right-2 top-2 p-1.5 bg-neon-blue rounded-lg text-white hover:bg-sky-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle: Code Editor (VS Code Style) */}
      <div className="lg:col-span-5 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {/* Editor Header */}
        <div className="p-3 border-b border-white/10 bg-[#1e1e1e] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-200 flex items-center gap-2 text-xs">
              <Code size={14} className="text-purple-400"/> {t('work.code_title')}
            </span>
            <button className="text-[10px] flex items-center space-x-1 px-2 py-1 rounded hover:bg-white/10 text-slate-400 transition-colors">
              <RefreshCw size={10}/> <span>{t('work.btn_format')}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder={t('work.strat_name_ph')}
              className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-neon-blue/50"
            />
            <button 
              onClick={handleSave}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${isSaved ? 'bg-neon-green text-white' : 'bg-neon-blue text-white hover:bg-sky-500'}`}
            >
              {isSaved ? <Check size={12}/> : <Save size={12}/>}
              {isSaved ? t('work.save_success') : t('work.btn_save')}
            </button>
          </div>
        </div>
        
        {/* Editor Body */}
        <div className="flex-1 bg-[#1e1e1e] relative group overflow-hidden flex font-mono text-xs">
          {/* Line Numbers */}
          <div className="w-10 bg-[#1e1e1e] border-r border-white/5 text-slate-600 text-right pr-3 pt-4 select-none leading-relaxed">
             <pre>{lineNumbers}</pre>
          </div>
          {/* Text Area */}
          <div className="flex-1 relative overflow-hidden">
             <textarea
               value={generatedCode}
               onChange={(e) => setGeneratedCode(e.target.value)}
               className="absolute inset-0 w-full h-full bg-transparent text-[#d4d4d4] p-4 focus:outline-none resize-none leading-relaxed"
               placeholder={t('work.code_placeholder')}
               spellCheck={false}
             />
          </div>
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
