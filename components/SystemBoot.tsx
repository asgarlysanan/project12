import React, { useEffect, useState } from 'react';
import { INITIAL_BOOT_LOGS } from '../constants';

interface SystemBootProps {
  onComplete: () => void;
}

const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentLogIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLogIndex >= INITIAL_BOOT_LOGS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800); // Slight delay after 100%
        return;
      }

      setLogs(prev => [...prev, INITIAL_BOOT_LOGS[currentLogIndex]]);
      setProgress(prev => Math.min(prev + (100 / INITIAL_BOOT_LOGS.length), 100));
      currentLogIndex++;
    }, 600); // Speed of boot steps

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center font-mono z-50">
      <div className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8 animate-pulse">
            <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
        
        <h1 className="text-2xl text-center text-cyan-500 mb-6 tracking-widest uppercase">Initializing Core</h1>
        
        <div className="h-1 w-full bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.7)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2 font-mono text-sm h-48 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-slate-400 border-l-2 border-slate-700 pl-3 animate-fade-in-up">
              <span className="text-cyan-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-xs text-slate-600">
        POWERED BY GEMINI NEURAL ENGINE
      </div>
    </div>
  );
};

export default SystemBoot;