
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileText, Upload, Cpu, Search, Calendar, User, TrendingUp, Minus, Loader2, Pickaxe, Eye } from 'lucide-react';
import { ResearchReport, Factor } from '../types';

const mockReports: ResearchReport[] = [
  { 
    id: '1', 
    title: 'Semiconductor Industry Outlook 2025: The AI Supercycle', 
    analyst: 'Morgan Stanley', 
    date: '2024-12-05', 
    sector: 'Technology',
    content: 'Full PDF content placeholder...',
    summary: 'The semiconductor sector is poised for a 20% growth driven by AI data center demand.',
    tags: ['AI', 'Chips', 'Hardware'],
    views: 12500
  },
  { 
    id: '2', 
    title: 'China Consumer Discretionary: Recovery Roadmap', 
    analyst: 'Goldman Sachs', 
    date: '2024-11-28', 
    sector: 'Consumer',
    content: 'Full PDF content placeholder...',
    summary: 'We expect a gradual recovery in consumer spending with a focus on experience-based consumption.',
    tags: ['Retail', 'Macro', 'China'],
    views: 8900
  },
  { 
    id: '3', 
    title: 'Renewable Energy: Policy Shifts and Market Impact', 
    analyst: 'CITIC Securities', 
    date: '2024-12-01', 
    sector: 'Energy',
    content: 'Full PDF content placeholder...',
    tags: ['Green', 'Policy', 'Solar'],
    views: 5400
  },
  { 
    id: '4', 
    title: 'Global Fintech Trends: Blockchain Adoption in Banking', 
    analyst: 'JP Morgan', 
    date: '2024-12-03', 
    sector: 'Financials',
    content: 'Full PDF content placeholder...',
    tags: ['Crypto', 'Fintech', 'Banking'],
    views: 15200
  },
  { 
    id: '5', 
    title: 'Healthcare Innovation: Gene Editing Frontiers', 
    analyst: 'Biotech Capital', 
    date: '2024-11-20', 
    sector: 'Healthcare',
    content: 'Full PDF content placeholder...',
    tags: ['Biotech', 'Innovation', 'Pharma'],
    views: 3200
  },
];

interface ResearchReportsProps {
  onGenerateStrategy: (factors: string[]) => void;
}

export const ResearchReports: React.FC<ResearchReportsProps> = ({ onGenerateStrategy }) => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<ResearchReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // Factor Mining State
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [minedFactors, setMinedFactors] = useState<Factor[] | null>(null);
  const [selectedFactorIds, setSelectedFactorIds] = useState<string[]>([]);
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'DATE' | 'VIEWS'>('DATE');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleReportClick = (report: ResearchReport) => {
    setSelectedReport(report);
    setAnalysisResult(null); 
    setMinedFactors(null);
    setSelectedFactorIds([]);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Mock AI Analysis
    setTimeout(() => {
      setAnalysisResult(`### AI Interpretation for ${selectedReport?.title}

**Core Thesis:**
The report maintains a **BULLISH** stance on the sector, citing strong structural demand from Generative AI infrastructure build-outs.

**Key Takeaways:**
1. **Supply Chain Tightness**: HBM (High Bandwidth Memory) supply will remain constrained through Q3 2025.
2. **Valuation**: Current P/E ratios are justified by expected 40% YoY earnings growth.
3. **Risks**: Geopolitical export controls remain the primary downside risk.

**Actionable Insight:**
Consider accumulation on pullbacks in leading foundry and memory chip stocks.`);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleMineFactors = () => {
    setIsMining(true);
    setMiningProgress(0);
    const interval = setInterval(() => {
        setMiningProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 10;
        });
    }, 300); // 3 seconds total

    setTimeout(() => {
        clearInterval(interval);
        setMiningProgress(100);
        setIsMining(false);
        setMinedFactors([
            { id: 'f1', name: 'HBM Supply Shortage', description: 'Long Memory Producers (Hynix, Micron) due to HBM scarcity.', category: 'Fundamental', confidence: 0.92 },
            { id: 'f2', name: 'AI CapEx Momentum', description: 'Long Data Center Infrastructure (Servers, Cooling).', category: 'Thematic', confidence: 0.88 },
            { id: 'f3', name: 'Export Control Hedge', description: 'Short/Hedge equipment manufacturers heavily exposed to restrictions.', category: 'Risk', confidence: 0.75 },
        ]);
    }, 3200);
  };

  const toggleFactor = (id: string) => {
    setSelectedFactorIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submitFactors = () => {
     if (!minedFactors) return;
     const selected = minedFactors.filter(f => selectedFactorIds.includes(f.id)).map(f => `${f.name}: ${f.description}`);
     onGenerateStrategy(selected);
  };

  // Extract unique sectors and tags for filter lists
  const sectors = ['All', ...Array.from(new Set(mockReports.map(r => r.sector)))];
  
  // Filter Logic
  const filteredReports = mockReports
    .filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.analyst.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || r.sector === selectedSector;
      const matchesTag = selectedTag ? r.tags.includes(selectedTag) : true;
      return matchesSearch && matchesSector && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'DATE') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.views - a.views;
      }
    });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
       
       {/* Left: Library & List (Glass Panel) */}
       <div className={`${selectedReport ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden`}>
          <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <FileText className="text-sky-600 dark:text-neon-blue"/> {t('research.title')}
                </h2>
                <button className="p-2 bg-slate-200 dark:bg-white/10 rounded-lg hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                   <Upload size={16} className="text-slate-600 dark:text-white"/>
                </button>
             </div>
             
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-neon-blue/50"
                />
             </div>

             {/* Filters & Sorting */}
             <div className="flex flex-col gap-3">
               {/* Sector Tabs */}
               <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
                 {sectors.map(sector => (
                   <button
                     key={sector}
                     onClick={() => setSelectedSector(sector)}
                     className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${
                       selectedSector === sector 
                         ? 'bg-sky-600 text-white border-sky-600 dark:bg-neon-blue dark:border-neon-blue' 
                         : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30'
                     }`}
                   >
                     {sector === 'All' ? t('research.filter_all') : sector}
                   </button>
                 ))}
               </div>

               {/* Sort & Tag Toggles */}
               <div className="flex items-center justify-between gap-2">
                 {/* Sort Dropdown */}
                 <div className="flex items-center bg-slate-100 dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/10">
                    <button 
                      onClick={() => setSortBy('DATE')}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${sortBy === 'DATE' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                      <Calendar size={10} /> {t('research.sort_newest')}
                    </button>
                    <button 
                      onClick={() => setSortBy('VIEWS')}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${sortBy === 'VIEWS' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                      <TrendingUp size={10} /> {t('research.sort_hottest')}
                    </button>
                 </div>
                 
                 {/* Tag Selector (Simple Toggle) */}
                 {selectedTag && (
                   <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 dark:bg-neon-blue/20 dark:text-neon-blue rounded-lg text-[10px] border border-sky-200 dark:border-neon-blue/30 cursor-pointer" onClick={() => setSelectedTag(null)}>
                      <span>#{selectedTag}</span>
                      <Minus size={10} />
                   </div>
                 )}
               </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-transparent">
             {filteredReports.map(report => (
                <div 
                  key={report.id} 
                  onClick={() => handleReportClick(report)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    selectedReport?.id === report.id 
                      ? 'bg-sky-50 border-sky-300 dark:bg-neon-blue/10 dark:border-neon-blue/40' 
                      : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 dark:text-neon-blue dark:bg-neon-blue/10 px-2 py-0.5 rounded">{report.sector}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Eye size={10}/> {(report.views / 1000).toFixed(1)}k
                      </span>
                   </div>
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-neon-blue transition-colors">{report.title}</h3>
                   <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User size={12}/> {report.analyst}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{report.date}</span>
                   </div>
                   
                   {/* Tags */}
                   <div className="flex gap-2 mt-3 overflow-hidden">
                      {report.tags.map(tag => (
                        <span 
                          key={tag} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag === selectedTag ? null : tag);
                          }}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                            selectedTag === tag 
                              ? 'bg-sky-600 text-white border-sky-600 dark:bg-neon-blue dark:border-neon-blue' 
                              : 'bg-slate-200 text-slate-600 border-slate-200 dark:bg-black/30 dark:text-slate-500 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                   </div>
                </div>
             ))}
             {filteredReports.length === 0 && (
               <div className="text-center py-10 text-slate-500 text-xs">
                 No reports match your filters.
               </div>
             )}
          </div>
       </div>

       {/* Right: Content & Analysis (Reader View) */}
       <div className={`${selectedReport ? 'flex' : 'hidden lg:flex'} flex-1 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex-col relative`}>
          {selectedReport ? (
             <>
               {/* Toolbar */}
               <div className="h-14 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between px-6">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-md">{selectedReport.title}</h3>
                  <div className="flex items-center gap-3">
                     <button 
                       onClick={handleAnalyze}
                       disabled={isAnalyzing}
                       className="flex items-center gap-2 px-4 py-1.5 bg-sky-100 border border-sky-200 text-sky-700 dark:bg-neon-blue/10 dark:border-neon-blue/30 dark:text-neon-blue rounded-lg hover:bg-sky-200 dark:hover:bg-neon-blue dark:hover:text-white transition-all text-sm font-bold"
                     >
                        {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Cpu size={16}/>}
                        {t('research.ai_analysis')}
                     </button>
                     <button onClick={() => setSelectedReport(null)} className="lg:hidden text-slate-400">Back</button>
                  </div>
               </div>

               <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  {/* PDF Viewer Placeholder */}
                  <div className="flex-1 bg-slate-200 dark:bg-[#0d1117] p-8 overflow-y-auto flex flex-col items-center gap-8 relative">
                     <div className="w-full max-w-3xl bg-white min-h-[800px] shadow-xl p-12 text-slate-900">
                        <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                           <div className="text-3xl font-serif font-bold text-slate-900">{selectedReport.analyst}</div>
                           <div className="text-right">
                              <div className="font-bold">{selectedReport.date}</div>
                              <div className="text-sm text-slate-500">EQUITY RESEARCH</div>
                           </div>
                        </div>
                        <h1 className="text-4xl font-serif font-bold mb-6 text-slate-900">{selectedReport.title}</h1>
                        <div className="flex gap-2 mb-6">
                          {selectedReport.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">#{tag}</span>
                          ))}
                        </div>
                        <p className="font-serif text-lg leading-relaxed mb-4 text-slate-800">
                           <strong>Executive Summary:</strong> {selectedReport.summary || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                        </p>
                        <p className="font-serif text-slate-700 leading-relaxed text-justify column-count-2 gap-8">
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        {/* Mock Chart */}
                        <div className="my-8 h-64 bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                           [Chart Visualization Placeholder]
                        </div>
                     </div>
                  </div>

                  {/* AI Analysis & Factor Mining Side Panel */}
                  {analysisResult && (
                     <div className="w-full lg:w-96 border-l border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a] flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-sky-50 dark:bg-neon-blue/5">
                           <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Cpu size={16} className="text-sky-600 dark:text-neon-blue"/> AI Insights
                           </h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                           <div className="prose prose-sm prose-slate dark:prose-invert">
                              {analysisResult.split('\n').map((line, i) => {
                                 if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-sky-700 dark:text-neon-blue mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                 if (line.startsWith('**')) return <strong key={i} className="block text-slate-900 dark:text-white mt-2">{line.replace(/\*\*/g, '')}</strong>;
                                 return <p key={i} className="text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">{line}</p>;
                              })}
                           </div>

                           <div className="mt-8 p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                              <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">{t('research.sentiment')}</h5>
                              <div className="flex items-center gap-2">
                                 <TrendingUp className="text-emerald-600 dark:text-neon-green" size={24}/>
                                 <span className="text-xl font-bold text-emerald-600 dark:text-neon-green">{t('research.sentiment_bullish')}</span>
                              </div>
                           </div>
                           
                           <hr className="my-6 border-slate-200 dark:border-white/10" />

                           {/* Factor Mining Section */}
                           <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                 <Pickaxe size={18} className="text-purple-500 dark:text-purple-400"/> {t('research.factor_mining')}
                              </h3>
                              
                              {!minedFactors && !isMining && (
                                 <button 
                                   onClick={handleMineFactors}
                                   className="w-full py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                 >
                                    <Pickaxe size={16}/> {t('research.btn_mine')}
                                 </button>
                              )}

                              {isMining && (
                                 <div className="space-y-3">
                                    <div className="text-xs text-purple-500 dark:text-purple-400 animate-pulse">{t('research.mining')}</div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                       <div className="h-full bg-purple-500 transition-all duration-300 ease-linear" style={{width: `${miningProgress}%`}}></div>
                                    </div>
                                 </div>
                              )}

                              {minedFactors && (
                                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <p className="text-xs text-slate-500">{t('research.select_factors_desc')}</p>
                                    <div className="space-y-3">
                                       {minedFactors.map(factor => (
                                          <div 
                                             key={factor.id} 
                                             onClick={() => toggleFactor(factor.id)}
                                             className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                selectedFactorIds.includes(factor.id) 
                                                   ? 'bg-purple-50 border-purple-300 dark:bg-purple-500/10 dark:border-purple-500/50' 
                                                   : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 hover:border-purple-300 dark:hover:bg-white/10'
                                             }`}
                                          >
                                             <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                  selectedFactorIds.includes(factor.id) 
                                                    ? 'bg-purple-600 text-white' 
                                                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                                }`}>
                                                   {factor.category}
                                                </span>
                                                <span className="text-[10px] text-emerald-600 dark:text-neon-green font-mono">{(factor.confidence * 100).toFixed(0)}% Conf.</span>
                                             </div>
                                             <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{factor.name}</div>
                                             <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{factor.description}</div>
                                          </div>
                                       ))}
                                    </div>

                                    <button 
                                      onClick={submitFactors}
                                      disabled={selectedFactorIds.length === 0}
                                      className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                         selectedFactorIds.length > 0 
                                            ? 'bg-sky-600 hover:bg-sky-700 dark:bg-neon-blue dark:hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 dark:shadow-neon-blue/20' 
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                      }`}
                                    >
                                       <Cpu size={16}/> {t('research.generate_strat')}
                                    </button>
                                 </div>
                              )}
                           </div>

                        </div>
                     </div>
                  )}
               </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <FileText size={64} className="mb-4 opacity-20"/>
                <p>Select a report to view analysis</p>
             </div>
          )}
       </div>
    </div>
  );
};
