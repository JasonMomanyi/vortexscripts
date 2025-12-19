
import React from 'react';
import { ThemeSettings } from '../types';
import { Monitor, Type, Palette, Layout, Github, Instagram, Globe, Hash, Code, Copy } from 'lucide-react';

interface SettingsProps {
  settings: ThemeSettings;
  onUpdate: (newSettings: ThemeSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const fonts = [
    { name: 'Hacker Mono', value: 'Share Tech Mono' },
    { name: 'Code Default', value: 'Fira Code' },
    { name: 'Cyber Orbit', value: 'Orbitron' },
    { name: 'System Sans', value: 'sans-serif' },
  ];

  const themes = [
    { id: 'matrix', name: 'Matrix', primary: '#22c55e' },
    { id: 'cyberpunk', name: 'Cyberpunk', primary: '#d946ef' },
    { id: 'terminal', name: 'Retro Terminal', primary: '#f59e0b' },
    { id: 'clean', name: 'Clean Slate', primary: '#3b82f6' },
  ];

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText('1092210946547654730');
    alert("Discord ID copied to clipboard: 1092210946547654730");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 animate-fadeIn pb-24">
      <h2 className="text-3xl font-orbitron text-[var(--primary)] border-b border-gray-800 pb-4">
        SYSTEM CONFIGURATION
      </h2>

      {/* Theme Modes */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-[var(--primary)]" />
          <h3 className="text-xl font-bold text-white">Interface Theme</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onUpdate({ ...settings, mode: t.id as any, primaryColor: t.primary })}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                settings.mode === t.id 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white' 
                  : 'border-zinc-800 bg-zinc-900 text-gray-500 hover:border-gray-600'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full shadow-lg" 
                style={{ backgroundColor: t.primary }}
              />
              <span className="font-mono text-sm uppercase tracking-wider">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Type className="text-[var(--primary)]" />
          <h3 className="text-xl font-bold text-white">Typography</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.map((f) => (
            <button
              key={f.value}
              onClick={() => onUpdate({ ...settings, fontFamily: f.value })}
              style={{ fontFamily: f.value }}
              className={`p-4 rounded border transition-all text-left text-lg ${
                settings.fontFamily === f.value
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-black'
                  : 'border-zinc-800 text-gray-400 hover:bg-zinc-800'
              }`}
            >
              {f.name} <span className="text-xs opacity-50 ml-2">The quick brown fox...</span>
            </button>
          ))}
        </div>
      </section>

      {/* Developer Uplink / Credits */}
      <section className="bg-gradient-to-br from-zinc-900 to-black border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
            <Code className="text-purple-500 w-16 h-16" />
        </div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/30">
             <Code className="text-purple-400" size={24} />
          </div>
          <div>
              <h3 className="text-xl font-bold text-white">System Architect</h3>
              <p className="text-xs text-purple-400 font-mono tracking-widest">LORD STUNNIS // CORE_DEV</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            <a 
                href="https://instagram.com/lord_stunnis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded bg-zinc-900/80 border border-zinc-800 hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400 transition-all group/link"
            >
                <Instagram size={20} />
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 group-hover/link:text-pink-300/70 uppercase">Instagram</span>
                    <span className="text-sm font-bold font-mono">@lord_stunnis</span>
                </div>
            </a>

            <a 
                href="https://github.com/JasonMomanyi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded bg-zinc-900/80 border border-zinc-800 hover:border-white hover:bg-white/10 hover:text-white transition-all group/link"
            >
                <Github size={20} />
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 group-hover/link:text-gray-300 uppercase">GitHub</span>
                    <span className="text-sm font-bold font-mono">JasonMomanyi</span>
                </div>
            </a>

            <a 
                href="https://jasonmomanyi.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all group/link"
            >
                <Globe size={20} />
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 group-hover/link:text-cyan-300/70 uppercase">Portfolio</span>
                    <span className="text-sm font-bold font-mono">Web Portal</span>
                </div>
            </a>

            <button 
                onClick={handleCopyDiscord}
                className="flex items-center gap-3 p-4 rounded bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all group/link text-left"
            >
                <Hash size={20} />
                <div className="flex flex-col w-full">
                    <span className="text-[10px] text-gray-500 group-hover/link:text-indigo-300/70 uppercase flex justify-between">
                        Discord ID <Copy size={10} />
                    </span>
                    <span className="text-sm font-bold font-mono truncate w-24 sm:w-auto" title="1092210946547654730">109221...</span>
                </div>
            </button>
        </div>
      </section>

      {/* Preview */}
      <section className="bg-black border border-[var(--primary)] rounded-xl p-6 opacity-80">
        <div className="flex items-center gap-2 mb-2 text-[var(--primary)]">
          <Monitor size={16} />
          <span className="text-xs font-bold uppercase">Live Preview</span>
        </div>
        <div className="space-y-2 font-mono text-sm text-gray-300">
          <p>System initialized...</p>
          <p>Loading user profile <span className="text-[var(--primary)]">Guest Operator</span>...</p>
          <div className="h-2 w-full bg-zinc-800 rounded overflow-hidden">
            <div className="h-full bg-[var(--primary)] w-3/4"></div>
          </div>
          <p>Theme: <span className="text-white">{settings.mode.toUpperCase()}</span> applied.</p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
