import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { chatWithVortex, initAI } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Greetings, Operator. I am VORTEX. How can I assist with your operation today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAI();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => `${m.role}: ${m.text}`);
    const response = await chatWithVortex(userMsg, history);

    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] z-40 transition-all hover:scale-110"
      >
        {isOpen ? <X /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-zinc-900 border border-purple-500/50 rounded-lg shadow-2xl flex flex-col z-40 overflow-hidden animate-fadeIn">
          <div className="bg-purple-900/30 p-4 border-b border-purple-500/30 flex items-center justify-between">
            <h3 className="font-orbitron text-purple-300 flex items-center gap-2">
                <Bot size={18} /> VORTEX CORE
            </h3>
            <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-500/30">ONLINE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm font-mono ${
                        m.role === 'user' 
                        ? 'bg-purple-600/20 text-purple-100 border border-purple-500/30' 
                        : 'bg-zinc-800 text-gray-300 border border-gray-700'
                    }`}>
                        {m.text}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-zinc-800 text-gray-400 rounded-lg p-3 text-xs font-mono animate-pulse">
                        Analyzing input vector...
                    </div>
                </div>
            )}
          </div>

          <div className="p-4 bg-black/50 border-t border-gray-800">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about exploits, tools..."
                    className="flex-1 bg-zinc-800 border-none outline-none text-white px-3 py-2 rounded text-sm font-fira focus:ring-1 focus:ring-purple-500"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 rounded px-3 flex items-center justify-center text-white transition-colors"
                >
                    <Send size={16} />
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
