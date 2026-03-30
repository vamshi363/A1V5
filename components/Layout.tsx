import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Calculator, 
  Home, 
  FileText, 
  Gift, 
  LayoutGrid, 
  Search, 
  X, 
  BookOpen,
  User,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/universities?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Discover', path: '/quiz', icon: <Compass size={18} /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={18} /> },
    { name: 'Colleges', path: '/universities', icon: <GraduationCap size={18} /> },
    { name: 'Exams', path: '/exams', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gov-blue text-white shadow-lg print:hidden" style={{ backgroundColor: '#1E3A5F', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.div 
                key="nav-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-between items-center"
              >
                <Link to="/" className="flex items-center space-x-2 shrink-0">
                  <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                    <GraduationCap size={24} className="text-primary-green" />
                  </div>
                  <span className="font-heading font-black text-xl tracking-tight">
                    AFTER <span className="text-primary-green">INTER</span>
                  </span>
                </Link>

                <div className="hidden md:flex space-x-8 items-center">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-2 font-bold text-sm uppercase tracking-wider transition-colors hover:text-primary-green ${location.pathname === link.path ? 'text-primary-green' : 'text-slate-300'}`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                   <button 
                     onClick={() => setIsSearchOpen(true)}
                     className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                   >
                     <Search size={22} strokeWidth={2.5} />
                   </button>
                   <Link to="/login" className="bg-primary-green text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary-green/20">
                     Login
                   </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="search-bar"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex items-center space-x-4"
              >
                 <form onSubmit={handleSearchSubmit} className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-blue/50" size={20} />
                    <input 
                      ref={inputRef}
                      type="text" 
                      placeholder="Search colleges, exams, scholarships..."
                      className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl outline-none font-bold text-gov-blue placeholder:text-gov-blue/30"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </form>
                 <button 
                   onClick={() => setIsSearchOpen(false)} 
                   className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors text-white"
                 >
                   <X size={24} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </nav>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const tabs = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Discover', path: '/quiz', icon: <Compass size={22} /> },
    { name: 'Colleges', path: '/universities', icon: <GraduationCap size={22} /> },
    { name: 'Exams', path: '/exams', icon: <FileText size={22} /> },
    { name: 'Tools', path: '/tools', icon: <LayoutGrid size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-safe md:hidden shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
      <div className="flex justify-around items-center h-[64px] px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          return (
            <Link 
              key={tab.name} 
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${isActive ? 'text-gov-blue' : 'text-slate-400'}`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {React.cloneElement(tab.icon as React.ReactElement, { 
                  strokeWidth: isActive ? 3 : 2,
                })}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-gov-blue' : 'text-slate-400'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="mt-auto border-t py-16 bg-gov-blue border-white/5 text-slate-400 print:hidden pb-24 md:pb-16 text-center md:text-left">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1">
        <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
          <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
            <GraduationCap size={24} className="text-primary-green" />
          </div>
          <span className="font-heading font-black text-xl text-white tracking-tight">AFTER INTER</span>
        </div>
        <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
          India's trusted platform for after-intermediate education discovery. Helping students in AP & TG find their future.
        </p>
      </div>
      <div>
        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-6">Resources</h4>
        <ul className="space-y-4 text-sm font-bold">
          <li><Link to="/courses" className="hover:text-primary-green transition-colors">Course Library</Link></li>
          <li><Link to="/universities" className="hover:text-primary-green transition-colors">Universities</Link></li>
          <li><Link to="/exams" className="hover:text-primary-green transition-colors">Entrance Exams</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-6">Legal</h4>
        <ul className="space-y-4 text-sm font-bold">
          <li><Link to="/privacy" className="hover:text-primary-green transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-primary-green transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-white text-xs uppercase tracking-widest mb-6">Integrity</h4>
        <div className="flex items-center justify-center md:justify-start gap-2 text-primary-green text-sm font-bold">
          <ShieldCheck size={18} />
          <span>Government Trusted Data</span>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest opacity-50">
      © 2025 After Inter. All rights reserved. Made in India.
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-primary-green/30 selection:text-gov-blue">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};