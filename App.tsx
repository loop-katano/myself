import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MapViz from './components/MapViz';
import PostModal from './components/PostModal';
import { BlogPost, PostType, UserState } from './types';
import { BLOG_POSTS } from './constants';
import { ArrowRight, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>({
    viewMode: 'home',
    selectedPost: null,
  });

  const mapPosts = BLOG_POSTS.filter(p => p.type === PostType.MAP);
  const thoughtPosts = BLOG_POSTS; // Show all in thoughts for now, or just THOUGHT type

  const handlePostSelect = (post: BlogPost) => {
    setUserState(prev => ({ ...prev, selectedPost: post }));
  };

  const handleCloseModal = () => {
    setUserState(prev => ({ ...prev, selectedPost: null }));
  };

  const renderHome = () => (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div 
        className="h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center justify-center text-white text-center px-4 relative"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://picsum.photos/seed/travel_hero/1920/1080")',
        }}
      >
        <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg tracking-wide">
          「千里之行，始于足下」
        </h1>
        <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl text-white/90">
          对世界充满好奇，不断探索的孩童
        </p>
        <button 
          onClick={() => setUserState(prev => ({ ...prev, viewMode: 'map' }))}
          className="bg-primary hover:bg-yellow-400 text-stone-900 px-8 py-3 rounded-md font-sans font-medium transition-transform hover:scale-105 flex items-center gap-2"
        >
          开始探索 <ArrowRight size={20} />
        </button>

        <div className="absolute bottom-10 animate-bounce">
           <span className="text-white/60 text-sm tracking-widest uppercase">Scroll Down</span>
        </div>
      </div>

      {/* Featured Preview */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-stone-800 mb-4">最新足迹</h2>
          <div className="w-16 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mapPosts.slice(0, 3).map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer"
              onClick={() => handlePostSelect(post)}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 shadow-md">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="text-stone-500 text-xs mb-2 flex items-center gap-1">
                <MapPin size={12} /> {post.locationName}
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="pt-20 h-screen flex flex-col bg-paper px-4 md:px-8 pb-8">
      <div className="mb-6">
        <h2 className="text-3xl font-serif text-stone-800">地图探索</h2>
        <p className="text-stone-500 text-sm mt-1">点击地图上的标记，重温那段旅程。</p>
      </div>
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
        <MapViz posts={mapPosts} onSelectPost={handlePostSelect} />
      </div>
    </div>
  );

  const renderThoughts = () => (
    <div className="pt-24 min-h-screen bg-paper px-4 md:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-serif text-stone-800 mb-4">随思随想</h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            并非所有的旅行都在路上。有时候，一次深刻的思考，也是一场抵达灵魂深处的远行。
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {thoughtPosts.map(post => (
            <div 
              key={post.id} 
              className="break-inside-avoid bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePostSelect(post)}
            >
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full rounded-md mb-4" />
              )}
              <div className="text-xs text-primary font-bold tracking-wider mb-2 uppercase">
                {post.type === PostType.MAP ? 'Travel Log' : 'Thoughts'}
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{post.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center text-xs text-stone-400 pt-4 border-t border-stone-100">
                <span>{post.date}</span>
                <span className="group-hover:translate-x-1 transition-transform inline-block">Read More &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-stone-800 selection:bg-primary/30">
      <Navbar userState={userState} onNavigate={(mode) => setUserState(prev => ({ ...prev, viewMode: mode }))} />
      
      <main>
        {userState.viewMode === 'home' && renderHome()}
        {userState.viewMode === 'map' && renderMap()}
        {userState.viewMode === 'thoughts' && renderThoughts()}
      </main>

      {userState.selectedPost && (
        <PostModal post={userState.selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;