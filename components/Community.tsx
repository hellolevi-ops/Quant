

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Post, Comment } from '../types';
import { MessageSquare, Heart, Share2, Plus, User, TrendingUp, DollarSign, ArrowLeft, Image as ImageIcon, Send, Code, Bold, Italic, List, Link as LinkIcon, Search, Eye, Clock, Calendar, ThumbsUp } from 'lucide-react';

const mockPosts: Post[] = [
  { 
    id: '1', 
    author: 'QuantMaster_Zero', 
    avatar: '', 
    title: 'My Mean Reversion Strategy hitting 40% APR', 
    content: 'Just wanted to share the results of my latest DeepSeek generated strategy on A-shares. It focuses on small cap volatility. \n\nThe logic is simple: \n1. Filter for small caps (<50B Market Cap) \n2. Check RSI(14) < 30 \n3. Verify volume spike > 2x average.\n\nCode snippet attached below.', 
    codeSnippet: `class SmallCapReversion(bt.Strategy):
    def next(self):
        if self.rsi < 30 and self.data.volume > self.avg_vol * 2:
            self.buy()`,
    likes: 142, 
    comments: 23, 
    timestamp: '2h ago', 
    tags: ['Strategy', 'Showcase'],
    views: 1205,
    createdAt: '2024-12-10T10:00:00Z',
    lastReplyAt: '2024-12-10T11:30:00Z'
  },
  { 
    id: '2', 
    author: 'Official_Team', 
    isOfficial: true, 
    title: 'Platform Update V2.1: New Data Sources Added', 
    content: 'We have just integrated HKEX options chain data into the Data Center. Happy trading! You can now backtest derivatives strategies with tick-level precision.', 
    likes: 89, 
    comments: 12, 
    timestamp: '5h ago', 
    tags: ['Announcement'],
    views: 3500,
    createdAt: '2024-12-10T07:00:00Z',
    lastReplyAt: '2024-12-10T08:15:00Z'
  },
  { 
    id: '3', 
    author: 'CryptoWhale', 
    title: 'BTC Grid Bot Parameters Discussion', 
    content: 'What grid spacing are you guys using for the current low volatility regime? I am finding 0.5% too aggressive.', 
    likes: 56, 
    comments: 45, 
    timestamp: '1d ago', 
    tags: ['Crypto', 'Discussion'],
    views: 890,
    createdAt: '2024-12-09T14:00:00Z',
    lastReplyAt: '2024-12-10T09:00:00Z'
  },
  // Add more mock posts to demonstrate pagination
  ...Array.from({ length: 15 }, (_, i) => ({
      id: `m_${i}`,
      author: `User_${i + 100}`,
      title: `Analysis of Market Trend #${i + 1}`,
      content: 'Sharing my thoughts on the current market situation...',
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      timestamp: `${i + 2}d ago`,
      tags: ['Market', 'Analysis'],
      views: Math.floor(Math.random() * 2000),
      createdAt: new Date(Date.now() - (i + 2) * 86400000).toISOString(),
      lastReplyAt: new Date(Date.now() - (i + 2) * 86400000 + 3600000).toISOString(),
  }))
];

const mockComments: Comment[] = [
  { id: 'c1', author: 'Trader123', content: 'Impressive results! Can you share the max drawdown?', timestamp: '1h ago' },
  { id: 'c2', author: 'QuantMaster_Zero', content: 'Max drawdown is around 12% during the 2022 dip.', timestamp: '30m ago' },
  { id: 'c3', author: 'AlphaSeeker', content: 'Will this work on US equities?', timestamp: '10m ago' },
];

type ViewState = 'LIST' | 'DETAIL' | 'CREATE';
type SortOption = 'VIEWS' | 'LATEST_REPLY' | 'NEWEST' | 'LIKES';

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'FEED' | 'MARKET'>('FEED');
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyText, setReplyText] = useState('');

  // Create Post State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Search & Sort & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('VIEWS');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setViewState('DETAIL');
  };

  const handleBack = () => {
    setViewState('LIST');
    setSelectedPost(null);
  };

  const handleCreatePost = () => {
    setViewState('CREATE');
  };

  const handlePublish = () => {
    // Mock publish
    setViewState('LIST');
    setNewTitle('');
    setNewContent('');
  };

  // Filter and Sort Logic
  const getProcessedPosts = () => {
    let processed = [...mockPosts];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      processed = processed.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q) || 
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    processed.sort((a, b) => {
      switch (sortBy) {
        case 'VIEWS': return b.views - a.views;
        case 'LIKES': return b.likes - a.likes;
        case 'NEWEST': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'LATEST_REPLY': return new Date(b.lastReplyAt).getTime() - new Date(a.lastReplyAt).getTime();
        default: return 0;
      }
    });

    return processed;
  };

  const processedPosts = getProcessedPosts();
  const totalPages = Math.ceil(processedPosts.length / postsPerPage);
  const displayedPosts = processedPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // --- VIEW: POST DETAIL ---
  if (viewState === 'DETAIL' && selectedPost) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={handleBack} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> {t('comm.back')}
        </button>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 relative">
           {/* Header */}
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-white/10">
                 {selectedPost.avatar ? <img src={selectedPost.avatar} className="w-full h-full rounded-full" /> : <User size={24} className="text-slate-400"/>}
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{selectedPost.author}</span>
                    {selectedPost.isOfficial && <span className="text-[10px] bg-neon-blue text-white px-1.5 py-0.5 rounded font-bold">{t('comm.official')}</span>}
                 </div>
                 <div className="text-sm text-slate-500">{selectedPost.timestamp}</div>
              </div>
              <div className="ml-auto flex gap-2">
                 {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">#{tag}</span>
                 ))}
              </div>
           </div>

           {/* Content */}
           <h1 className="text-3xl font-bold text-white mb-6">{selectedPost.title}</h1>
           
           <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-line mb-8">
              {selectedPost.content}
           </div>

           {selectedPost.codeSnippet && (
             <div className="bg-[#0d1117] p-6 rounded-xl border border-white/10 mb-8 overflow-x-auto">
               <pre className="font-mono text-sm text-slate-300">
                 {selectedPost.codeSnippet}
               </pre>
             </div>
           )}

           {selectedPost.image && (
             <div className="mb-8 rounded-xl overflow-hidden border border-white/10">
                <img src={selectedPost.image} alt="Post attachment" className="w-full object-cover" />
             </div>
           )}

           <div className="flex items-center gap-8 py-6 border-t border-b border-white/10 text-slate-400 mb-8">
              <div className="flex items-center gap-2 hover:text-neon-red cursor-pointer transition-colors">
                 <Heart size={20} /> {selectedPost.likes} Likes
              </div>
              <div className="flex items-center gap-2 hover:text-neon-blue cursor-pointer transition-colors">
                 <MessageSquare size={20} /> {selectedPost.comments} {t('comm.comments')}
              </div>
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors ml-auto">
                 <Share2 size={20} /> Share
              </div>
           </div>

           {/* Comments Section */}
           <h3 className="text-xl font-bold text-white mb-6">{t('comm.comments')}</h3>
           
           {/* Comment Input */}
           <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                 <User size={20} />
              </div>
              <div className="flex-1 relative">
                 <textarea 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   placeholder={t('comm.reply') + "..."}
                   className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-neon-blue/50 min-h-[100px] resize-none"
                 />
                 <button className="absolute right-3 bottom-3 p-2 bg-neon-blue text-white rounded-lg hover:bg-sky-500 transition-colors">
                    <Send size={16} />
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              {mockComments.map(comment => (
                 <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center border border-white/5">
                       <User size={18} className="text-slate-500"/>
                    </div>
                    <div className="flex-1 bg-white/5 p-4 rounded-xl rounded-tl-none border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-slate-300">{comment.author}</span>
                          <span className="text-xs text-slate-600">{comment.timestamp}</span>
                       </div>
                       <p className="text-slate-400 leading-relaxed">{comment.content}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- VIEW: CREATE POST ---
  if (viewState === 'CREATE') {
     return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
           <button 
             onClick={handleBack} 
             className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
           >
             <ArrowLeft size={18} /> {t('comm.back')}
           </button>

           <div className="glass-panel p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">{t('comm.post_create_title')}</h2>
              
              <div className="space-y-6">
                 <div>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={t('comm.post_title_ph')}
                      className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-slate-600 border-b border-white/10 py-2 focus:outline-none focus:border-neon-blue"
                    />
                 </div>

                 {/* Rich Text Editor Simulation */}
                 <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
                    <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Bold size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Italic size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><LinkIcon size={16}/></button>
                       <div className="w-px h-4 bg-white/10 mx-1" />
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><List size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><Code size={16}/></button>
                       <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded"><ImageIcon size={16}/></button>
                    </div>
                    <textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={t('comm.post_content_ph')}
                      className="w-full bg-transparent p-6 text-slate-300 placeholder:text-slate-600 focus:outline-none min-h-[300px] resize-y font-sans leading-relaxed"
                    />
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="ml-auto">
                       <button 
                         onClick={handlePublish}
                         disabled={!newTitle || !newContent}
                         className={`px-8 py-3 rounded-xl font-bold transition-all ${!newTitle || !newContent ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-neon-blue text-white hover:bg-sky-500 shadow-lg shadow-neon-blue/20'}`}
                       >
                          {t('comm.btn_publish')}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- VIEW: FEED LIST ---
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6 border-b border-white/10 w-full sm:w-auto">
             <button 
                onClick={() => setActiveTab('FEED')}
                className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'FEED' ? 'border-neon-blue text-white' : 'border-transparent text-slate-500'}`}
             >
                {t('comm.tab_feed')}
             </button>
             <button 
                onClick={() => setActiveTab('MARKET')}
                className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'MARKET' ? 'border-neon-blue text-white' : 'border-transparent text-slate-500'}`}
             >
                {t('comm.tab_market')}
             </button>
          </div>
          <button 
            onClick={handleCreatePost}
            className="bg-neon-blue hover:bg-sky-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-neon-blue/20 transition-all w-full sm:w-auto justify-center"
          >
             <Plus size={18} /> {t('comm.btn_post')}
          </button>
       </div>

       {activeTab === 'FEED' ? (
          <>
             {/* Toolbar: Search & Sort */}
             <div className="flex flex-col md:flex-row gap-4 justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder={t('comm.search_ph')}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue/50"
                  />
                </div>
                
                <div className="flex overflow-x-auto gap-2 no-scrollbar">
                   {[
                     { id: 'VIEWS', label: t('comm.sort_views'), icon: Eye },
                     { id: 'LATEST_REPLY', label: t('comm.sort_latest_reply'), icon: MessageSquare },
                     { id: 'NEWEST', label: t('comm.sort_newest'), icon: Calendar },
                     { id: 'LIKES', label: t('comm.sort_likes'), icon: ThumbsUp },
                   ].map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id as SortOption); setCurrentPage(1); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                           sortBy === opt.id 
                             ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/30' 
                             : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                         <opt.icon size={12}/> {opt.label}
                      </button>
                   ))}
                </div>
             </div>

             {/* Post List */}
             <div className="grid grid-cols-1 gap-4">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => (
                    <div key={post.id} onClick={() => handlePostClick(post)} className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/10">
                             {post.avatar ? <img src={post.avatar} className="w-full h-full rounded-full" /> : <User size={18} className="text-slate-400"/>}
                          </div>
                          <div>
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-white group-hover:text-neon-blue transition-colors">{post.author}</span>
                                {post.isOfficial && <span className="text-[10px] bg-neon-blue text-white px-1.5 rounded font-bold">{t('comm.official')}</span>}
                             </div>
                             <div className="text-xs text-slate-500">{post.timestamp}</div>
                          </div>
                       </div>
                       <h3 className="text-lg font-bold text-slate-200 mb-2">{post.title}</h3>
                       <p className="text-slate-400 line-clamp-2 mb-4 leading-relaxed text-sm">{post.content}</p>
                       
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            {post.tags.map(tag => (
                               <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">#{tag}</span>
                            ))}
                         </div>
                         <div className="flex items-center gap-6 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5"><Eye size={14}/> {post.views}</div>
                            <div className="flex items-center gap-1.5 group-hover:text-neon-red transition-colors"><Heart size={14}/> {post.likes}</div>
                            <div className="flex items-center gap-1.5 group-hover:text-neon-blue transition-colors"><MessageSquare size={14}/> {post.comments}</div>
                         </div>
                       </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-12 text-slate-500">No posts found.</div>
                )}
             </div>

             {/* Pagination */}
             {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-4">
                   <button 
                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                     disabled={currentPage === 1}
                     className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-bold"
                   >
                      {t('comm.page_prev')}
                   </button>
                   <span className="text-sm text-slate-400">
                      {t('comm.page_info').replace('{curr}', currentPage.toString()).replace('{total}', totalPages.toString())}
                   </span>
                   <button 
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                     className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-bold"
                   >
                      {t('comm.page_next')}
                   </button>
                </div>
             )}
          </>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Market Cards */}
             {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-neon-green/10 rounded-xl text-neon-green">
                         <TrendingUp size={24} />
                      </div>
                      <div className="text-right">
                         <div className="text-xl font-mono font-bold text-neon-green">+152.4%</div>
                         <div className="text-[10px] text-slate-500 uppercase font-bold">{t('comm.total_return')}</div>
                      </div>
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">Golden Cross V4</h3>
                   <p className="text-xs text-slate-400 mb-6 leading-relaxed">Trend following strategy optimized for Crypto markets with automated stop-loss.</p>
                   <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1 text-white font-bold text-lg">
                         <DollarSign size={16} className="text-yellow-400"/> 49.00 <span className="text-slate-500 font-normal text-xs ml-1">/ mo</span>
                      </div>
                      <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                         {t('comm.subscribe')}
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};
