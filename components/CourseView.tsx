
import React, { useState } from 'react';
import { CourseModule } from '../types';
import Terminal from './Terminal';
import { ChevronRight, CheckCircle2, Lock, Copy, Terminal as TerminalIcon } from 'lucide-react';

interface CourseViewProps {
  module: CourseModule;
  onComplete: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({ module, onComplete }) => {
  const [labSuccess, setLabSuccess] = useState(false);

  const handleCommand = (cmd: string): string | null => {
    if (!module.labConfig) return null;

    // Normalize command for checking (ignore extra spaces)
    const normalizedCmd = cmd.replace(/\s+/g, ' ').trim();
    
    // Check if the command contains the expected command (allows for flags/args variation unless strict)
    if (normalizedCmd.includes(module.labConfig.expectedCommand)) {
      if (!labSuccess) {
          setLabSuccess(true);
          // Play a small sound or vibration could go here
      }
      return module.labConfig.successMessage;
    }
    return null;
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, index) => {
      // Handle Code Block Start/End
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of block
          const codeString = codeBuffer.join('\n');
          elements.push(
            <div key={`code-${index}`} className="relative group my-6 border border-zinc-700 rounded-lg overflow-hidden bg-black shadow-lg">
               <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <TerminalIcon size={12} />
                    <span>BASH</span>
                  </div>
                  <button
                    onClick={() => {
                        navigator.clipboard.writeText(codeString);
                        // Optional: Show tooltip "Copied!"
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded"
                    title="Copy to clipboard"
                  >
                    <Copy size={12} /> Copy
                  </button>
               </div>
               <pre className="p-4 overflow-x-auto text-sm font-fira text-green-400 leading-relaxed selection:bg-green-900 selection:text-white">
                 {codeString}
               </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          // Start of block
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        codeBuffer.push(line);
      } else {
        // Normal text rendering
        const key = `text-${index}`;
        if (line.startsWith('# ')) {
          elements.push(<h1 key={key} className="text-3xl font-orbitron font-bold text-white mb-6 mt-8 border-b border-gray-800 pb-2">{line.replace('# ', '')}</h1>);
        } else if (line.startsWith('## ')) {
          elements.push(<h2 key={key} className="text-xl font-bold text-[var(--primary)] mb-4 mt-8 flex items-center gap-2"><ChevronRight size={16}/> {line.replace('## ', '')}</h2>);
        } else if (line.startsWith('### ')) {
          elements.push(<h3 key={key} className="text-lg font-bold text-purple-400 mb-3 mt-6">{line.replace('### ', '')}</h3>);
        } else if (line.trim().startsWith('- ')) {
           elements.push(
            <li key={key} className="ml-6 text-gray-300 list-disc mb-2 pl-2 marker:text-[var(--primary)]">
                {line.replace('- ', '').split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                )}
            </li>
           );
        } else if (line.trim().match(/^\d+\./)) {
            // Ordered list
            const [num, ...rest] = line.split('.');
            elements.push(
                <div key={key} className="flex gap-3 mb-3 ml-2 text-gray-300">
                    <span className="font-mono text-[var(--primary)] font-bold">{num}.</span>
                    <span>
                        {rest.join('.').split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                        )}
                    </span>
                </div>
            );
        } else if (line.trim() !== '') {
            // Paragraph with bold support
          elements.push(
            <p key={key} className="mb-4 text-gray-300 leading-7 text-sm md:text-base">
                {line.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-white font-bold bg-white/5 px-1 rounded">{part}</strong> : part
                )}
            </p>
          );
        }
      }
    });
    return elements;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full md:h-[calc(100vh-100px)]">
      {/* Content Column */}
      <div className="bg-zinc-900/80 border border-green-500/20 rounded-lg overflow-hidden flex flex-col h-[500px] md:h-auto">
        <div className="p-4 md:p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center sticky top-0 z-10 backdrop-blur">
            <div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    module.category === 'Red Team' ? 'bg-red-950/50 text-red-400 border border-red-900' : 'bg-blue-950/50 text-blue-400 border border-blue-900'
                }`}>
                    {module.category}
                </span>
                <h1 className="text-xl md:text-2xl font-orbitron mt-2 text-white truncate max-w-[200px] md:max-w-none">{module.title}</h1>
            </div>
            {labSuccess && (
                <button 
                    onClick={onComplete}
                    className="bg-[var(--primary)] hover:brightness-110 text-black font-bold px-4 py-2 rounded flex items-center gap-2 animate-bounce shadow-[0_0_15px_var(--primary)]"
                >
                    <CheckCircle2 size={18} /> COMPLETE
                </button>
            )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-zinc-700">
            {renderContent(module.content)}
            
            <div className="mt-12 p-6 bg-zinc-800/50 rounded-xl border border-dashed border-zinc-700 text-center">
                <p className="text-gray-400 text-sm mb-2">End of instructional material.</p>
                <p className="text-[var(--primary)] font-bold text-sm">Proceed to the terminal to complete the mission.</p>
            </div>
        </div>
      </div>

      {/* Lab Column */}
      <div className="flex flex-col gap-4 h-[400px] md:h-auto">
        <div className="bg-black border border-[var(--primary)]/30 p-2 rounded-t-lg flex items-center justify-between shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <span className="text-[var(--primary)] font-mono text-xs md:text-sm px-2 flex items-center gap-2">
                <TerminalIcon size={14} /> 
                REMOTE_CONNECTION: ESTABLISHED
            </span>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse delay-150"></div>
            </div>
        </div>
        <div className="flex-1 relative">
            <div className="absolute inset-0">
                <Terminal 
                    initialLines={[{ type: 'system', content: module.labConfig?.initialOutput || 'System Ready. Awaiting commands...' }]}
                    onCommand={handleCommand}
                />
            </div>
        </div>
        
        {module.labConfig && (
            <div className={`transition-all duration-500 border p-4 rounded-lg flex items-start gap-4 ${
                labSuccess 
                ? 'bg-green-900/20 border-green-500/50' 
                : 'bg-zinc-900 border-yellow-500/20'
            }`}>
                <div className={`p-2 rounded-full ${labSuccess ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <Lock size={20} />
                </div>
                <div>
                    <h4 className={`font-bold text-sm mb-1 uppercase tracking-wider ${labSuccess ? 'text-green-400' : 'text-yellow-500'}`}>
                        {labSuccess ? 'Mission Accomplished' : 'Current Objective'}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {labSuccess ? 'Target compromised. System access granted. You may proceed to the next module.' : module.labConfig.hint}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
