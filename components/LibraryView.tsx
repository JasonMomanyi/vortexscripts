
import React, { useState } from 'react';
import { COURSES } from '../services/mockData';
import { Book, ChevronRight, Hash, Bookmark, Search } from 'lucide-react';

const LibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(COURSES.map(c => c.category)))];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simplified Markdown Renderer for Reading Mode
  const renderText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('```')) return null; // Skip code fence markers for cleaner look
      
      const key = idx;

      if (line.startsWith('# ')) {
        return <h3 key={key} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-zinc-700 pb-2">{line.replace('# ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h4 key={key} className="text-xl font-bold text-[var(--primary)] mt-6 mb-3">{line.replace('## ', '')}</h4>;
      }
      if (line.startsWith('### ')) {
        return <h5 key={key} className="text-lg font-bold text-gray-200 mt-4 mb-2">{line.replace('### ', '')}</h5>;
      }
      if (line.trim().startsWith('- ')) {
        return (
            <li key={key} className="ml-6 text-gray-400 list-disc mb-1 marker:text-[var(--primary)]">
                {line.replace('- ', '').split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-gray-200">{part}</strong> : part
                )}
            </li>
        );
      }
      // Detect Code Blocks (lines inside fences are handled, but we need to detect lines that look like code)
      // For this simple parser, if it starts with 4 spaces or is inside known context, we style it.
      // However, since we strip fences, we check typical code patterns or rely on the previous context.
      // A simple heuristic for code lines in this context:
      if (line.startsWith('    ') || line.match(/^(curl|nmap|ping|sqlmap|python|grep|ls|cd|cat)/)) {
          return <div key={key} className="bg-black border border-zinc-800 p-3 rounded my-2 font-fira text-sm text-green-400 overflow-x-auto">{line}</div>;
      }

      if (line.trim() !== '') {
        return (
            <p key={key} className="mb-3 text-gray-400 leading-relaxed max-w-4xl">
                {line.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-gray-200 font-bold">{part}</strong> : part
                )}
                {line.split('`').length > 1 && line.split('`').map((part, i) => 
                     i % 2 === 1 ? <code key={i} className="bg-zinc-800 text-[var(--primary)] px-1 rounded text-sm font-fira">{part}</code> : null
                )}
            </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-full animate-fadeIn">
      {/* Table of Contents Sidebar */}
      <div className="w-full md:w-80 bg-zinc-900/50 border-r border-zinc-800 flex flex-col h-[300px] md:h-auto overflow-hidden shrink-0">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-white font-orbitron text-lg flex items-center gap-2 mb-4">
            <Book className="text-[var(--primary)]" size={20} />
            KNOWLEDGE BASE
          </h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-[var(--primary)] outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                  ? 'bg-[var(--primary)] text-black' 
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
           {filteredCourses.map((course) => (
             <button
                key={course.id}
                onClick={() => scrollToSection(course.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-zinc-800 group transition-all mb-1"
             >
               <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${
                    course.category === 'Red Team' ? 'bg-red-500' :
                    course.category === 'Blue Team' ? 'bg-blue-500' : 'bg-purple-500'
                 }`}></span>
                 {course.id.toUpperCase()}
               </div>
               <div className="text-gray-300 text-sm font-bold group-hover:text-white truncate">
                 {course.title.split(': ')[1] || course.title}
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Main Reading Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin scrollbar-thumb-[var(--primary)]/50 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto pb-24">
            <div className="mb-12 border-b border-zinc-800 pb-8">
                <h1 className="text-4xl md:text-5xl font-orbitron text-white mb-4">Field Manual v2.4</h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Comprehensive documentation of all operational modules. 
                    This resource serves as a static reference for offensive and defensive methodologies covered in the VORTEXSCRIPTS curriculum.
                </p>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    No modules match your search criteria.
                </div>
            ) : (
                filteredCourses.map((course, index) => (
                    <article key={course.id} id={course.id} className="mb-20 scroll-mt-8 bg-zinc-900/20 rounded-2xl p-8 border border-zinc-800/50">
                        <header className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                    course.category === 'Red Team' ? 'bg-red-950 text-red-400' : 
                                    course.category === 'Blue Team' ? 'bg-blue-950 text-blue-400' : 'bg-purple-950 text-purple-400'
                                }`}>
                                    {course.category}
                                </span>
                                <span className="text-gray-500 text-xs border border-zinc-700 px-2 py-1 rounded">{course.difficulty}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                <span className="text-[var(--primary)] opacity-50">#{index + 1}</span> 
                                {course.title}
                            </h2>
                            <p className="text-gray-400 text-lg italic border-l-4 border-[var(--primary)] pl-4">
                                {course.description}
                            </p>
                        </header>

                        <div className="prose prose-invert max-w-none">
                            {renderText(course.content)}
                        </div>

                        {/* Interactive Hint Section (Static for Reader) */}
                        {course.labConfig && (
                            <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded p-4 flex gap-4 opacity-75">
                                <div className="text-[var(--primary)]">
                                    <Hash />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-300 uppercase mb-1">Practical Exercise Goal</h4>
                                    <p className="text-sm text-gray-500">{course.labConfig.hint}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-8">
                             <a href={`#${filteredCourses[index + 1]?.id}`} className="text-sm text-gray-500 hover:text-[var(--primary)] flex items-center gap-1">
                                Next Module <ChevronRight size={14} />
                             </a>
                        </div>
                    </article>
                ))
            )}
            
             <div className="text-center pt-12 border-t border-zinc-800">
                <p className="text-gray-600 text-sm font-mono">END OF DOCUMENTATION</p>
                <Bookmark className="mx-auto mt-4 text-zinc-700" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
