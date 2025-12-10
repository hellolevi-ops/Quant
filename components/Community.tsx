
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Post, Comment } from '../types';
import { MessageSquare, Heart, Share2, Plus, User, TrendingUp, DollarSign, ArrowLeft, Image as ImageIcon, Send } from 'lucide-react';

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
    tags: ['Strategy', 'Showcase'] 
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
    tags: ['Announcement'] 
  },
  { 
    id: '3', 
    author: 'CryptoWhale', 
    title: 'BTC Grid Bot Parameters Discussion', 
    content: 'What grid spacing are you guys using for the current low volatility regime? I am finding 0.5% too aggressive.', 
    likes: 56, 
    comments: 45, 
    timestamp: '1d ago', 
    tags: ['Crypto', 'Discussion'] 
  },
];

const mockComments: Comment[] = [
  { id: 'c1', author: 'Trader123', content: 'Impressive results! Can you share the max drawdown?', timestamp: '1h ago' },
  { id: 'c2', author: 'QuantMaster_Zero', content: 'Max drawdown is around 12% during the 2022 dip.', timestamp: '30m ago' },
  { id: 'c3', author: 'AlphaSeeker', content: 'Will this work on US equities?', timestamp: '10m ago' },
];

type ViewState = 'LIST' | 'DETAIL' | 'CREATE';

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'FEED' | 'MARKET'>('FEED');
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyText, setReplyText] = useState('');

  // Create Post State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

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

                 <div>
                    <textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={t('comm.post_content_ph')}
                      className="w-full bg-black/20 rounded-xl p-6 text-slate-300 placeholder:text-slate-600 border border-white/10 focus:outline-none focus:border-neon-blue/50 min-h-[300px] resize-y"
                    />
                 </div>

                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors">
                       <ImageIcon size={18} /> Add Image
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors">
                       <User size={18} /> Tag Strategy
                    </button>
                    
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
          <div className="grid grid-cols-1 gap-6">
             {mockPosts.map(post => (
                <div key={post.id} onClick={() => handlePostClick(post)} className="glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4 mb-4">
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
                   <h3 className="text-xl font-bold text-slate-200 mb-2">{post.title}</h3>
                   <p className="text-slate-400 line-clamp-2 mb-4 leading-relaxed">{post.content}</p>
                   
                   <div className="flex items-center gap-2 mb-6">
                      {post.tags.map(tag => (
                         <span key={tag} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">#{tag}</span>
                      ))}
                   </div>

                   <div className="flex items-center gap-8 text-sm text-slate-500 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 group-hover:text-neon-red transition-colors">
                         <Heart size={16} /> {post.likes}
                      </div>
                      <div className="flex items-center gap-2 group-hover:text-neon-blue transition-colors">
                         <MessageSquare size={16} /> {post.comments}
                      </div>
                      <div className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                         <Share2 size={16} />
                      </div>
                   </div>
                </div>
             ))}
          </div>
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
