import React from 'react';
import { AppDefinition } from '../types';

interface AppGridProps {
  apps: AppDefinition[];
}

const AppGrid: React.FC<AppGridProps> = ({ apps }) => {
  return (
    <div className="glass-panel rounded-xl p-4 h-full flex flex-col">
      <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
        Integrated Applications
      </h2>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
        {apps.map((app) => (
          <div 
            key={app.id}
            className={`
              relative p-3 rounded-lg border flex items-center gap-3 transition-all duration-300
              ${app.status === 'running' 
                ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                : 'bg-slate-800/20 border-transparent hover:bg-slate-800/40'
              }
            `}
          >
            <div className="text-2xl">{app.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">{app.name}</div>
              <div className="text-xs flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'running' ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' : 'bg-slate-600'}`}></span>
                <span className="text-slate-500 capitalize">{app.status}</span>
              </div>
            </div>
            
            {app.status === 'running' && (
              <div className="absolute top-1 right-2 flex gap-1">
                <div className="w-[2px] h-3 bg-cyan-500/50 animate-pulse"></div>
                <div className="w-[2px] h-2 bg-cyan-500/30 animate-pulse delay-75"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppGrid;