import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const LegalModal: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [canAccept, setCanAccept] = useState(false);

  // Force a small delay so they have to read it (UX pattern)
  React.useEffect(() => {
    const timer = setTimeout(() => setCanAccept(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border-2 border-red-600 max-w-2xl w-full rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden">
        <div className="bg-red-600/20 p-4 border-b border-red-600 flex items-center gap-3">
          <AlertTriangle className="text-red-500 w-8 h-8" />
          <h2 className="text-2xl font-orbitron text-red-500 font-bold tracking-wider">CRITICAL WARNING</h2>
        </div>
        
        <div className="p-6 space-y-4 text-gray-300 font-mono text-sm leading-relaxed">
          <p className="text-white font-bold text-lg">⚠️ EDUCATIONAL USE ONLY ⚠️</p>
          <p>
            VORTEXSCRIPTS is designed strictly for:
            <br/>• Authorized security testing
            <br/>• Educational purposes in controlled environments
            <br/>• Career development in cybersecurity
          </p>

          <div className="bg-black/50 p-4 border border-red-900/50 rounded">
            <p className="text-red-400 font-bold mb-2">PROHIBITED ACTIVITIES:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unauthorized access to systems or networks</li>
              <li>Attacking systems without explicit written permission</li>
              <li>Any illegal hacking activities</li>
            </ul>
          </div>

          <p className="text-xs text-gray-500">
            By using this platform, you acknowledge that all knowledge gained is for lawful purposes only.
            Violating computer security laws can result in criminal prosecution.
          </p>
        </div>

        <div className="p-4 bg-zinc-950 border-t border-red-900/50 flex justify-end">
          <button 
            onClick={onAccept}
            disabled={!canAccept}
            className={`flex items-center gap-2 px-6 py-3 rounded font-bold transition-all ${
              canAccept 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAccept ? <><CheckCircle size={18} /> I ACKNOWLEDGE & ACCEPT</> : 'READ THE WARNING...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
