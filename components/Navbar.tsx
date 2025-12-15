import React, { useEffect, useState } from 'react';
import { UserState } from '../types';
import { Camera, Map, BookOpen, User } from 'lucide-react';

interface NavbarProps {
  userState: UserState;
  onNavigate: (view: UserState['viewMode']) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userState, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 w-full z-40 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
    scrolled || userState.viewMode !== 'home' 
      ? 'bg-white/90 backdrop-blur-md shadow-sm text-stone-800' 
      : 'bg-transparent text-white'
  }`;

  return (
    <nav className={navClass}>
      <div 
        className="text-2xl font-serif font-bold cursor-pointer flex items-center gap-2"
        onClick={() => onNavigate('home')}
      >
        <span className="opacity-80">未选择的路</span>
      </div>

      <div className="flex items-center gap-8 font-sans font-medium text-sm md:text-base">
        <button 
          onClick={() => onNavigate('home')}
          className={`hover:opacity-70 transition-opacity ${userState.viewMode === 'home' ? 'font-bold' : ''}`}
        >
          首页
        </button>
        <button 
          onClick={() => onNavigate('map')}
          className={`flex items-center gap-1 hover:opacity-70 transition-opacity ${userState.viewMode === 'map' ? 'text-primary font-bold' : ''}`}
        >
          <Map size={18} />
          地图探索
        </button>
        <button 
          onClick={() => onNavigate('thoughts')}
          className={`flex items-center gap-1 hover:opacity-70 transition-opacity ${userState.viewMode === 'thoughts' ? 'text-primary font-bold' : ''}`}
        >
          <BookOpen size={18} />
          随思随想
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <button className="hover:opacity-70 transition-opacity">关于作者</button>
        <button className="border border-current px-4 py-1 rounded-full hover:bg-current hover:text-white/20 transition-all">
          IG
        </button>
      </div>
    </nav>
  );
};

export default Navbar;