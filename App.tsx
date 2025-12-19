
import React, { useState, useEffect } from 'react';
import { ViewState, User, CourseModule, ThemeSettings } from './types';
import { COURSES, CHALLENGES } from './services/mockData';
import { loadUser, saveUser, loadTheme, saveTheme, loadLegalAccepted, saveLegalAccepted } from './services/storageService';
import Dashboard from './components/Dashboard';
import CourseView from './components/CourseView';
import Certificate from './components/Certificate';
import LegalModal from './components/LegalModal';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import LibraryView from './components/LibraryView';
import { Shield, Terminal, Award, BookOpen, User as UserIcon, LogOut, Zap, Menu, X, Settings as SettingsIcon, Book } from 'lucide-react';

const App: React.FC = () => {
  // Initialize from Local Storage
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User>(() => loadUser());
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(() => loadLegalAccepted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme State with Persistence
  const [theme, setTheme] = useState<ThemeSettings>(() => loadTheme() || {
    primaryColor: '#22c55e', // Default Green
    fontFamily: 'Share Tech Mono',
    mode: 'matrix'
  });

  // Persistence Effects
  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveLegalAccepted(legalAccepted);
  }, [legalAccepted]);

  useEffect(() => {
    saveTheme(theme);
    // Apply Theme Side-Effects
    document.body.style.fontFamily = theme.fontFamily;
    document.documentElement.style.setProperty('--primary', theme.primaryColor);
  }, [theme]);

  const handleStartCourse = (course: CourseModule) => {
    setSelectedCourse(course);
    setView('learn');
    setMobileMenuOpen(false);
  };

  const handleCompleteModule = () => {
    if (selectedCourse) {
        // Prevent duplicate XP if module is already completed
        if (user.completedModules.includes(selectedCourse.id)) {
            setView('dashboard');
            setSelectedCourse(null);
            return;
        }

        // Update user stats
        setUser(prev => ({
            ...prev,
            xp: prev.xp + 100,
            completedModules: [...prev.completedModules, selectedCourse.id],
            level: Math.floor((prev.xp + 100) / 1000) + 1
        }));
        // Return to dashboard
        setView('dashboard');
        setSelectedCourse(null);
    }
  };

  const NavItem = ({ icon: Icon, label, target }: { icon: any, label: string, target: ViewState }) => (
    <button 
        onClick={() => {
          setView(target);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-4 md:gap-3 w-full p-4 md:p-3 rounded-xl md:rounded transition-all font-mono text-lg md:text-sm ${
            view === target 
            ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-l-4 md:border-l-0 md:border-r-2 border-[var(--primary)]' 
            : 'text-gray-500 hover:text-white hover:bg-zinc-900'
        }`}
    >
        <Icon size={20} />
        <span className="inline font-bold md:font-normal">{label}</span>
    </button>
  );

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-gray-200 flex flex-col md:flex-row font-mono selection:bg-[var(--primary)]/30">
      {!legalAccepted && <LegalModal onAccept={() => setLegalAccepted(true)} />}
      
      {/* Mobile Header */}
      <div className="md:hidden bg-black/90 backdrop-blur border-b border-zinc-800 p-4 sticky top-0 z-50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <Zap className="text-[var(--primary)] fill-[var(--primary)]" />
            <h1 className="text-xl font-orbitron font-bold text-white tracking-wider">
                VORTEX<span className="text-[var(--primary)]">SCRIPTS</span>
            </h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <nav className={`
        fixed inset-0 z-40 bg-black/95 transform transition-transform duration-300 md:translate-x-0 md:relative md:w-72 md:bg-black md:border-r md:border-zinc-900 md:flex md:flex-col md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:p-4 h-full flex flex-col">
            <div className="hidden md:flex mb-8 items-center gap-2 px-2 pt-2">
                <Zap className="text-[var(--primary)] fill-[var(--primary)]" />
                <h1 className="text-2xl font-orbitron font-bold text-white tracking-wider">
                    VORTEX<span className="text-[var(--primary)]">SCRIPTS</span>
                </h1>
            </div>

            <div className="space-y-3 md:space-y-2 flex-1 mt-16 md:mt-0">
                <p className="md:hidden text-xs font-bold text-gray-600 uppercase mb-4 px-4 tracking-widest">Navigation</p>
                <NavItem icon={Shield} label="Dashboard" target="dashboard" />
                <NavItem icon={BookOpen} label="Learning Paths" target="home" />
                <NavItem icon={Terminal} label="Challenges" target="challenges" />
                <NavItem icon={Book} label="Handbook" target="library" />
                <NavItem icon={Award} label="Certificates" target="certificate" />
                <div className="h-px bg-zinc-800 my-6 md:hidden"></div>
                <NavItem icon={SettingsIcon} label="System Settings" target="settings" />
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-900 hidden md:block">
                <div className="flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                        <UserIcon size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 cursor-pointer hover:opacity-80" onClick={() => setView('settings')}>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-[var(--primary)]">Lvl {user.level} // {user.xp}XP</p>
                    </div>
                    <LogOut size={16} className="text-gray-600 hover:text-white cursor-pointer" />
                </div>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {view === 'library' ? (
             <LibraryView />
        ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
                <div className="max-w-7xl mx-auto pb-24 md:pb-0 min-h-full">
                    
                    {view === 'dashboard' && <Dashboard user={user} />}
                    
                    {view === 'certificate' && <Certificate user={user} />}

                    {view === 'settings' && <Settings settings={theme} onUpdate={setTheme} />}

                    {view === 'home' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="bg-gradient-to-br from-zinc-900 to-black p-6 md:p-8 rounded-2xl border border-[var(--primary)]/30 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl md:text-4xl font-orbitron text-white mb-4">
                                        OPERATIONAL STATUS: <span className="text-[var(--primary)]">ACTIVE</span>
                                    </h2>
                                    <p className="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed mb-6">
                                        Select a mission profile to begin training. <br/>
                                        <span className="text-[var(--primary)] font-bold">Warning:</span> All actions are monitored. Use authorized systems only.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button 
                                            onClick={() => setView('home')} // Keep in home but effectively scroll down
                                            className="bg-[var(--primary)] hover:brightness-110 text-black font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[var(--primary)]/20"
                                        >
                                            <BookOpen size={18} /> Continue Learning
                                        </button>
                                        <button 
                                            onClick={() => setView('library')}
                                            className="border border-zinc-700 hover:border-white text-white px-6 py-3 rounded-lg transition-all"
                                        >
                                            Read Documentation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 sticky top-0 bg-[#050505]/95 backdrop-blur z-20 md:static md:bg-transparent">
                                <h3 className="text-xl md:text-2xl font-orbitron text-gray-200">AVAILABLE PATHS</h3>
                                <span className="text-xs text-gray-500 font-mono hidden md:inline">v2.4.0-STABLE</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {COURSES.map(course => (
                                    <div key={course.id} className="group bg-zinc-900/40 border border-zinc-800 hover:border-[var(--primary)]/50 rounded-xl p-6 md:p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--primary)]/5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                                course.category === 'Red Team' ? 'bg-red-950 text-red-400' : 
                                                course.category === 'Blue Team' ? 'bg-blue-950 text-blue-400' : 'bg-purple-950 text-purple-400'
                                            }`}>
                                                {course.category}
                                            </span>
                                            <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">{course.difficulty}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[var(--primary)] transition-colors leading-tight">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-8 flex-1 leading-relaxed">
                                            {course.description}
                                        </p>
                                        <button 
                                            onClick={() => handleStartCourse(course)}
                                            className="w-full bg-zinc-800 hover:bg-[var(--primary)] hover:text-black text-white py-4 rounded-lg font-mono text-sm transition-all uppercase tracking-widest font-bold border border-zinc-700 hover:border-transparent shadow-lg"
                                        >
                                            Initialize Module
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'learn' && selectedCourse && (
                        <CourseView module={selectedCourse} onComplete={handleCompleteModule} />
                    )}

                    {view === 'challenges' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-[#050505]/95 backdrop-blur z-20 py-2 md:static md:bg-transparent">
                                <h2 className="text-2xl md:text-3xl font-orbitron text-white">CTF OPERATIONS</h2>
                                <div className="flex gap-2 text-sm overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    <button className="bg-[var(--primary)] text-black font-bold px-4 py-2 rounded-full whitespace-nowrap">All</button>
                                    <button className="bg-zinc-900 text-gray-400 hover:text-white px-4 py-2 rounded-full whitespace-nowrap">Web</button>
                                    <button className="bg-zinc-900 text-gray-400 hover:text-white px-4 py-2 rounded-full whitespace-nowrap">Crypto</button>
                                    <button className="bg-zinc-900 text-gray-400 hover:text-white px-4 py-2 rounded-full whitespace-nowrap">Binary</button>
                                </div>
                            </div>
                            
                            <div className="grid gap-6">
                                {CHALLENGES.map(chal => (
                                    <div key={chal.id} className="bg-zinc-900/60 border border-zinc-800 p-6 md:p-8 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[var(--primary)]/30 transition-all hover:bg-zinc-900">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-lg md:text-xl font-bold text-white">{chal.title}</h3>
                                                <span className="text-[10px] uppercase font-bold bg-zinc-800 text-gray-400 px-2 py-1 rounded border border-zinc-700">{chal.category}</span>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                                                    chal.difficulty === 'Easy' ? 'border-green-900 text-green-500' :
                                                    chal.difficulty === 'Medium' ? 'border-yellow-900 text-yellow-500' :
                                                    chal.difficulty === 'Hard' ? 'border-red-900 text-red-500' :
                                                    'border-purple-900 text-purple-500'
                                                }`}>{chal.difficulty}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{chal.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                            <div className="text-xl md:text-2xl font-bold text-[var(--primary)] whitespace-nowrap">{chal.points} pts</div>
                                            <button className="flex-1 md:flex-none bg-zinc-800 hover:bg-white hover:text-black text-gray-200 px-6 py-3 rounded-lg transition-colors font-bold text-sm tracking-wider shadow-md">
                                                DEPLOY
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default App;
